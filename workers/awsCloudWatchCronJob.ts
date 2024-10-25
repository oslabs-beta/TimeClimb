import "dotenv/config";

// eslint-disable-next-line @typescript-eslint/no-require-imports
import moment from "moment-timezone";
import Bottleneck from "bottleneck";
import stepFunctionTrackersModel from "../server/models/stepFunctionTrackersModel";
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

const descibeLogGroupsBottleneck = new Bottleneck({
  maxConcurrent: 10,
  minTime: 105, // rate limit of 10 per second. added 5ms to ensure about 9.5/s
});

const trackerData = {};
/**
 * initial function to get started with this whole process of retreiving logs
 * and storing them
 */
const getDatabaseTrackingData = async () => {
  const rows = await stepFunctionTrackersModel.getAllTrackerDataWithNames();
  console.log(rows);
  const [logGroupArn, logGroupName] = await getLogGroupName(
    rows[0]?.log_group_arn
  );
  console.log("logGroupArn", logGroupArn);
  console.log("logGroupName", logGroupName);
  const logStreamNamePrefix = `states/${rows[0]?.name}`;
  console.log(logStreamNamePrefix);
  const creationDateEpochTime = await getLogGroupCreationDate(logGroupName);
  const momentLogGroupCreationDate = moment(creationDateEpochTime);
  console.log(
    "moment epoch time toString",
    moment(momentLogGroupCreationDate).toString()
  );
  const response = await getFilteredLogEvents(
    logGroupArn,
    logStreamNamePrefix,
    moment().subtract("1", "hour").utc().valueOf(),
    moment().utc().valueOf()
  );
  const parsedEvents = await parseEvents(response.events);
  // console.log("getFilteredLogEvents Response:", response);
  console.log("response.events.length", response?.events?.length);
  fs.writeFileSync("output.json", JSON.stringify(response), "utf8");
  fs.writeFileSync("parseEvents.json", JSON.stringify(parsedEvents), "utf8");
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
  epochEndTime: number
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
  };
  const command = new FilterLogEventsCommand(params);

  const response = await client.send(command);
  return response;
};

interface ParsedEvents {
  // step function execution arn as key
  [key: string]: {
    logStreamName: string;
    events: Event[];
    eventsFound?: number;
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
 * effiencently gather up all of the events from the logs, which are not
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
  events: FilteredLogEvent[]
): Promise<ParsedEvents> => {
  const executions: ParsedEvents = {};
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

// invoked now manually to test out the functionality
getDatabaseTrackingData();
