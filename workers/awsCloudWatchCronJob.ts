import "dotenv/config";

// eslint-disable-next-line @typescript-eslint/no-require-imports
import moment from "moment-timezone";
import Bottleneck from "bottleneck";
import stepFunctionTrackersModel from "../server/models/stepFunctionTrackersModel";
import stepsModel from "../server/models/stepsModel";
import stepFunctionAverageLatenciesModel from "../server/models/stepFunctionAverageLatenciesModel";
import stepAverageLatenciesModel from "../server/models/stepAverageLatenciesModel";
import fs from "fs";

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
import { StepsTable } from "../server/models/types";

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
  const rows = await stepFunctionTrackersModel.getAllTrackerDataWithNames();

  // get steps for this step function
  const stepRows = await stepsModel.getStepsByStepFunctionId(
    rows[0].step_function_id
  );

  // create a new object stucture to look up step information up by step name
  const formattedSteps = await formatSteps(stepRows);

  // log group arn needs to be formatted and the group name separated for
  // future api requests
  const [logGroupArn, logGroupName] = await getLogGroupName(
    rows[0]?.log_group_arn
  );

  // this prefix is necessary to filter logs by step function
  const logStreamNamePrefix = `states/${rows[0]?.name}`;

  // these times ensure we wait at least an hour before reading cloudwatch data
  const startTime = moment().subtract(2, "hour").startOf("hour").utc();
  const endTime = moment().subtract(2, "hour").endOf("hour").utc();

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

  // get average data for the step function and steps for this hour
  const [stepFunctionCurrentLatencyData] =
    await stepFunctionAverageLatenciesModel.getStepFunctionLatencies(
      rows[0].step_function_id,
      startTime.toISOString(),
      endTime.toISOString()
    );

  const stepIds: number[] = stepRows.map((el) => el.step_id);
  const stepsCurrentLatencyData =
    await stepAverageLatenciesModel.getHourlyLatenciesBetweenTimes(
      stepIds,
      startTime.toISOString(),
      endTime.toISOString()
    );

  console.log("stepFunctionCurrentLatencyData", stepFunctionCurrentLatencyData);
  console.log("stepsCurrentLatencyData", stepsCurrentLatencyData);

  // calculate the average data for the step function and steps for this hour
  const [latencyData, incompleteExecutions] = await calculateLatencies(
    executions,
    formattedSteps
  );
  console.log("latencyData", latencyData);
  console.log("incompleteExecutions", incompleteExecutions);

  // update/insert the calcualted average for each step and the step function

  if (stepFunctionCurrentLatencyData) {
    // calculate new average
    const oldSum =
      Number(stepFunctionCurrentLatencyData.average) *
      Number(stepFunctionCurrentLatencyData.executions);

    const newSum = oldSum + latencyData.stepFunctionLatencySum / 1000;
    const newExecutions =
      Number(stepFunctionCurrentLatencyData.executions) +
      Number(latencyData.executions);
    const newAverage = newSum / newExecutions;

    console.log("updating data");
    console.log(
      "stepFunctionCurrentLatencyData.average",
      stepFunctionCurrentLatencyData.average
    );
    console.log(
      "stepFunctionCurrentLatencyData.executions",
      stepFunctionCurrentLatencyData.executions
    );
    console.log("oldSum", oldSum);
    console.log("newSum", newSum);
    console.log("newExecutions", newExecutions);
    console.log("newAverage", newAverage);

    await stepFunctionAverageLatenciesModel.updateStepFunctionLatency(
      stepFunctionCurrentLatencyData.latency_id,
      newAverage,
      newExecutions
    );
  } else {
    await stepFunctionAverageLatenciesModel.insertStepFunctionLatencies([
      {
        step_function_id: rows[0].step_function_id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        average:
          latencyData.stepFunctionLatencySum / latencyData.executions / 1000,
        executions: latencyData.executions,
      },
    ]);
  }

  // update/insert the tracker data to cover this hour

  // do it again for all previous hours with bottleneck

  // move most functions into class

  // setup cron job

  // communicate with server or built as part of the server

  // console.log("getFilteredLogEvents Response:", response);
  fs.writeFileSync("output.json", JSON.stringify(responses), "utf8");
  fs.writeFileSync("executions.json", JSON.stringify(executions), "utf8");
  fs.writeFileSync("latencyData.json", JSON.stringify(latencyData), "utf8");
  // console.log("latencyData", latencyData);
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

interface Executions {
  // step function execution arn as key
  [key: string]: {
    logStreamName: string;
    events: Event[];
    eventsFound?: number;
    isStillRunning?: boolean;
    hasMissingEvents?: boolean;
  };
}
interface Event {
  id: number;
  type: string;
  name?: string; // some events like start and end dont have an end
  timestamp: number; // epoch milliseconds
  eventId: string; // actually a long string of numbers
}

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

interface FormattedSteps {
  [key: string]: {
    type: string;
    stepId: number;
  };
}

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

type starType = "ExecutionStarted";
type endTypes =
  | "ExecutionSucceeded"
  | "ExecutionFailed"
  | "ExecutionAborted"
  | "ExecutionTimedOut";
const endTypesSet = new Set([
  "ExecutionSucceeded",
  "ExecutionFailed",
  "ExecutionAborted",
  "ExecutionTimedOut",
]);

interface LatencyData {
  executions: number;
  stepFunctionLatencySum: number;
  steps: {
    [key: string]: {
      executions: number;
      sum: number;
    };
  };
}
const calculateLatencies = async (
  executions: Executions,
  steps: FormattedSteps
): Promise<[LatencyData, Executions]> => {
  const latencyData: LatencyData = {
    executions: 0,
    stepFunctionLatencySum: 0,
    steps: {},
  };

  const incompleteExecutions: Executions = {};

  for (const executionArn in executions) {
    const stepBuffer = {};
    const events = executions[executionArn].events;

    if (!endTypesSet.has(events[events.length - 1].type)) {
      incompleteExecutions[executionArn] = executions[executionArn];
      incompleteExecutions[executionArn].isStillRunning = true;
      continue;
    }
    if (executions[executionArn].eventsFound !== events.length) {
      incompleteExecutions[executionArn] = executions[executionArn];
      incompleteExecutions[executionArn].hasMissingEvents = true;
      continue;
    }

    latencyData.executions++;

    latencyData.stepFunctionLatencySum +=
      events[events.length - 1].timestamp - events[0].timestamp;

    // executions[exercutionArn].startTime = events[0].timestamp;
    // executions[exercutionArn].endTime = events[events.length - 1].timestamp;
    // executions[exercutionArn].latency =
    //   events[events.length - 1].timestamp - events[0].timestamp;

    for (const event of events) {
      // these are event types which do not need processing
      if (event.type === "ExecutionStarted") continue;
      if (event.type === "ExecutionSucceeded") continue;
      if (event.name === undefined || steps[event.name] === undefined) continue;
      if (
        event.type === "FailStateEntered" ||
        event.type === "SucessStateEntered"
      )
        continue;

      if (event.type.endsWith("Entered")) {
        if (stepBuffer[event.name] === undefined) {
          stepBuffer[event.name] = [{ timestamp: event.timestamp }];
        } else {
          stepBuffer[event.name].push([{ timestamp: event.timestamp }]);
        }
      } else if (event.type.endsWith("Exited")) {
        const step = stepBuffer[event.name].shift();
        const latency = event.timestamp - step.timestamp;

        const stepId = steps[event.name].stepId;

        if (latencyData.steps[stepId] !== undefined) {
          latencyData.steps[stepId].executions++;
          latencyData.steps[stepId].sum += latency;
        } else {
          latencyData.steps[stepId] = {
            executions: 1,
            sum: latency,
          };
        }
        // latencyData.steps[event.name].steps.push({
        //   stepName: event.name,
        //   startTime: step.timestamp,
        //   endTime: event.timestamp,
        //   latency: latency,
        // });
      }
    }
  }
  return [latencyData, incompleteExecutions];
};

// invoked now manually to test out the functionality
getDatabaseTrackingData();
