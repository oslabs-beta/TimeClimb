import "dotenv/config";

// eslint-disable-next-line @typescript-eslint/no-require-imports
import moment, { Moment } from "moment-timezone";
import Bottleneck from "bottleneck";
import stepFunctionTrackersModel from "../server/models/stepFunctionTrackersModel";
import stepsModel from "../server/models/stepsModel";
import stepFunctionAverageLatenciesModel from "../server/models/stepFunctionAverageLatenciesModel";
import stepAverageLatenciesModel from "../server/models/stepAverageLatenciesModel";
import fs from "fs";
import executionsObject from "./executions";
import type { Executions, FormattedSteps, LatencyData } from "./types";
import logs from "./logs";

import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogGroupsCommandInput,
  FilterLogEventsCommand,
  FilterLogEventsCommandInput,
  FilterLogEventsCommandOutput,
  FilteredLogEvent,
} from "@aws-sdk/client-cloudwatch-logs";
import { fromEnv } from "@aws-sdk/credential-providers";
import {
  AverageLatencies,
  StepAverageLatencies,
  StepAverageLatenciesTable,
  StepsTable,
} from "../server/models/types";

const descibeLogGroupsBottleneck = new Bottleneck({
  maxConcurrent: 3,
  minTime: 105, // rate limit of 10 per second. added 5ms to ensure about 9.5/s
});

/**
 * initial function to get started with this whole process of retreiving logs
 * and storing them
 */
const getDatabaseTrackingData = async () => {
  // need the tracker information to see what time period of data to retreive
  const trackerDbRows =
    await stepFunctionTrackersModel.getAllTrackerDataWithNames();

  // get steps for this step function
  const stepDbRows = await stepsModel.getStepsByStepFunctionId(
    trackerDbRows[0].step_function_id
  );

  const stepIds: number[] = stepDbRows.map((el) => el.step_id);

  // create a new object stucture to look up step information up by step name
  const formattedSteps = await formatSteps(stepDbRows);

  // log group arn needs to be formatted and the group name separated for
  // future api requests
  const [logGroupArn, logGroupName] = await getLogGroupName(
    trackerDbRows[0]?.log_group_arn
  );

  // this prefix is necessary to filter logs by step function
  const logStreamNamePrefix = `states/${trackerDbRows[0]?.name}`;

  // these times ensure we wait at least an hour before reading cloudwatch data
  const startTime = moment().subtract(2, "day").startOf("hour").utc();
  const endTime = moment().subtract(2, "day").endOf("hour").utc();

  // make http requests to retreive full data for an hour
  let reponseHasEvents = true;
  let nextToken = undefined;
  let count = 0;
  const responses = [];
  while (reponseHasEvents) {
    const response = await getFilteredLogEvents(
      logGroupArn,
      logStreamNamePrefix,
      startTime.valueOf(),
      endTime.valueOf(),
      nextToken
    );

    console.log("response had this many events:", response?.events?.length);
    console.log("nextToken", nextToken);
    console.log("count", count);
    console.log("reponseHasEvents", reponseHasEvents);
    console.log("logGroupName", logGroupName);

    if (response.events === undefined || response.events.length === 0) {
      reponseHasEvents = false;
      break;
    } else {
      responses.push(response);
    }
    nextToken = response.nextToken;
    count++;
    if (count > 10) break;
  }

  // seperate complete executions from incomplete executions

  // handle incomplete executions separately

  // parse logs to group them by executions and ensure each execution is
  // has compele data
  let executions: Executions = {};
  for (const response of responses) {
    executions = await parseEvents(response.events, executions);
  }

  // calculate the average data for the step function and steps for this hour
  const [latencyData, incompleteExecutions] = await logs.calculateLogLatencies(
    executions,
    formattedSteps
  );

  if (latencyData.executions > 0) {
    executionsObject.addExecutionsToDatabase(
      executions,
      latencyData,
      trackerDbRows[0].step_function_id,
      stepIds,
      formattedSteps,
      startTime,
      endTime
    );
  }

  // update/insert the tracker data to cover this hour

  // do it again for all previous hours with bottleneck

  // move most functions into class

  // setup cron job

  // communicate with server or built as part of the server

  console.log("incomplete executions", incompleteExecutions);
  fs.writeFileSync("output.json", JSON.stringify(responses), "utf8");
  fs.writeFileSync("executions.json", JSON.stringify(executions), "utf8");
  fs.writeFileSync("latencyData.json", JSON.stringify(latencyData), "utf8");
};

/**
 * This function gets the logGroupArn and logGroupName from the full logGroupArn
 * Often step function logGroups will end with ':*' characters, but these are
 * invalid to use in api calls, se we need to strip them to get a usable arn if
 * they are present.
 * @param logGroupArn The full arn of the log group this step function logs to
 * @returns Promise that resolved to an two element array of strings, with the
 * first element being the altered logGroupArn that cane be used in api queries,
 * and the logGroupName without the arn, which can be used for api calls to
 * DescribeLogGroups to filter by a logGruopName
 */
const getLogGroupName = async (logGroupArn: string): Promise<string[]> => {
  /** example log group arn:
   * arn:aws:logs:us-east-1:123456789012:log-group:/aws/states/MyStateMachineLogs:*
   *
   * Step function log group arns can sometime end with an :*, but we need to
   * remove that to query the logs, as this is an invalid arn to query with
   */
  if (logGroupArn.endsWith(":*")) logGroupArn = logGroupArn.slice(0, -2);

  const logGroupName = logGroupArn.split("log-group:")[1];
  return [logGroupArn, logGroupName];
};

/**
 * This function gets the creation date for a log group.  This is important for
 * figuring out how far back to query logs for information about a step
 * function's executions by default, unless the user specifies a date.
 *
 * This could also potentially be helpful if the user inputs a date before the
 * log group even started.  Thus, this value could be updated in the databse
 * and checked in the future, so we don't need to make this api call on
 * subsequent invokations, if for some reason we stop getting log information.
 *
 * @param {string} logGroupName The log group name to filter results by,
 * without the full arn
 * @returns {Promise<number | undefined>}Promise that resolves to a number,
 * which is an epoch time in milliseconds, or undefined
 */
const getLogGroupCreationDate = async (
  logGroupName: string
): Promise<number | undefined> => {
  const client = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
  });

  const params: DescribeLogGroupsCommandInput = {
    logGroupNamePrefix: logGroupName,
  };

  const command = new DescribeLogGroupsCommand(params);
  const response = await client.send(command);
  console.log("DescribeLogGroupsCommand Response", response);
  const creationTime = response?.logGroups[0]?.creationTime;
  if (creationTime !== undefined) return creationTime;
  return undefined;
};

/**
 * This function gets logs between two times for a specific log group and log
 * stream prefix.  This helps to effectively return only the logs relavent to
 * a specific state machine.
 *
 * @param {string} logGroupArn Log group arn minus any ending ':*' characters
 * @param {string} logStreamNamePrefix Log stream prefix, generally in the form of
 * "states/{state_machine_name}"
 * @param {number} epochStartTime Number of milliseconds after Jan 1, 1970 00:00:00 UTC.
 * Filters out events before this time from results.
 * @param {number} epochEndTime Number of milliseconds after Jan 1, 1970 00:00:00 UTC.
 * Filters out events after this time from results.
 * @returns Promise that resolves to a FilterLogEventsCommandOutput, which is
 * the reposne from calling the FilterLogEvents api
 */
const getFilteredLogEvents = async (
  logGroupArn: string,
  logStreamNamePrefix: string,
  epochStartTime: number,
  epochEndTime: number,
  nextToken: string | undefined = undefined
): Promise<FilterLogEventsCommandOutput> => {
  const client = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
  });

  const params: FilterLogEventsCommandInput = {
    logGroupIdentifier: logGroupArn,
    logStreamNamePrefix: logStreamNamePrefix,
    startTime: epochStartTime,
    endTime: epochEndTime,
    nextToken,
  };
  const command = new FilterLogEventsCommand(params);

  const response = await client.send(command);
  return response;
};

/**
 * This function looks through all events and organizes them by step function
 * execution arn as described in the interface definitions. This is done to
 * effeciently gather up all of the events from the logs, which are not
 * gauranteed to be in proper order.  We also use this to parse the json stored
 * in the message property to grab the values out we need to calculate latencies
 * between steps.  We also process the logs this way to ensure have both a start
 * and end step to each execution, so that we only process executions which are
 * completed.  It seems the Cloudwatch logs do not gaurantee that executions are
 * completed, and either from an incomplete log perspective, or if the step
 * function has logged partial data but is still running.
 *
 * @param {FilteredLogEvent[]} events Events array from a filtered log event
 * response
 * @returns {Promise<ParsedEvent>} Promise that resolves to parsed events
 * objects, organized with keys of step functionexecution arns.
 *
 */
const parseEvents = async (
  events: FilteredLogEvent[],
  executions: Executions = {}
): Promise<Executions> => {
  for (const event of events) {
    const message = JSON.parse(event?.message);
    if (executions[message?.execution_arn] === undefined) {
      executions[message?.execution_arn] = {
        logStreamName: event.logStreamName,
        eventsFound: 0,
        events: [],
      };
    }
    executions[message?.execution_arn].events[Number(message.id) - 1] = {
      id: Number(message.id),
      type: message.type,
      name: message.details?.name,
      timestamp: Number(message.event_timestamp),
      eventId: event.eventId,
    };
    executions[message?.execution_arn].eventsFound++;
  }

  console.log("executions:\n", executions);
  console.log("executions parsed:\n", JSON.stringify(executions, null, 2));
  return executions;
};

const formatSteps = async (stepRows: StepsTable[]): Promise<FormattedSteps> => {
  const steps: FormattedSteps = {};
  for (const step of stepRows) {
    steps[step.name] = {
      type: step.type,
      stepId: step.step_id,
    };
  }
  return steps;
};

// invoked now manually to test out the functionality
getDatabaseTrackingData();
