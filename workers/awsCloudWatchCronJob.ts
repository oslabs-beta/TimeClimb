import "dotenv/config";

// eslint-disable-next-line @typescript-eslint/no-require-imports
import moment from "moment-timezone";

import stepFunctionTrackersModel from "../server/models/stepFunctionTrackersModel";

import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogGroupsCommandInput,
  DescribeLogStreamsCommand,
  DescribeLogStreamsCommandInput,
  FilterLogEventsCommand,
  FilterLogEventsCommandInput,
} from "@aws-sdk/client-cloudwatch-logs";
import { fromEnv } from "@aws-sdk/credential-providers";

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
  await getLogGroupCreationDate(logGroupName);
};

const getLogGroupName = async (logGroupArn: string): Promise<string[]> => {
  /** example log group arn:
   * arn:aws:logs:us-east-1:123456789012:log-group:/aws/states/MyStateMachineLogs:*
   *
   * Step function log group arns can sometime end with an :*, but we need to
   * remove that to query the logs, as this is an invalid arn to query with
   */
  if (logGroupArn.endsWith(":*")) {
    logGroupArn = logGroupArn.slice(0, -2);
  }
  const logGroupName = logGroupArn.split("log-group:")[1];
  return [logGroupArn, logGroupName];
};

const getLogGroupCreationDate = async (logGroupName: string) => {
  const client = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
  });

  const params: DescribeLogGroupsCommandInput = {
    // logGroupName: "/aws/vendedlogs/states/HelloWorldTwo-Logs",
    logGroupNamePrefix: logGroupName,
    // logStreamNamePrefix: logStreamNamePrefix,
  };

  const command = new DescribeLogGroupsCommand(params);
  const response = await client.send(command);
  console.log("DescribeLogGroupsCommand Response", response);
  const creationTime = response?.logGroups[0]?.creationTime;
  if (creationTime !== undefined) {
    console.log(moment(creationTime).toString());
  }
};

const getLogStreamCreationDate = async (
  logGroupArn: string,
  logStreamNamePrefix: string
) => {
  const client = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
  });

  const params: DescribeLogStreamsCommandInput = {
    // logGroupName: "/aws/vendedlogs/states/HelloWorldTwo-Logs",
    logGroupIdentifier: logGroupArn,
    // logStreamNamePrefix: logStreamNamePrefix,
    descending: false,
  };

  const command = new DescribeLogStreamsCommand(params);
  const response = await client.send(command);
  console.log("DescribeLogStreamsCommand Response", response);
};

// const getLog;

getDatabaseTrackingData();

/** 
async function getLogsForFour() {
  const startTime = moment.tz("2024-10-21T16:00:00", "America/New_York").utc();
  const endTime = moment.tz("2024-10-21T17:00:00", "America/New_York").utc();
  console.log(startTime.toString());

  const client = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
  });

  const params = {
    logGroupName: "/aws/vendedlogs/states/HelloWorldTwo-Logs",
    startTime: startTime.valueOf(),
    endTime: endTime.valueOf(),
  };
  const command = new FilterLogEventsCommand(params);

  const response = await client.send(command);

  console.log("event length:", response.events.length);
  // console.log("response", response);
  await printTimes(response.events);
  if (response.nextToken !== undefined) {
    console.log("next token was found");
    const otherParams = {
      nextToken: response.nextToken,
      logGroupName: "/aws/vendedlogs/states/HelloWorldTwo-Logs",
      startTime: moment
        .tz("2024-10-21T16:00:00", "America/New_York")
        .utc()
        .valueOf(),
      endTime: moment
        .tz("2024-10-21T17:00:00", "America/New_York")
        .utc()
        .valueOf(),
    };

    const otherCommand = new FilterLogEventsCommand(otherParams);
    const otherResponse = await client.send(otherCommand);
    // console.log("otherResponse\n", otherResponse);
    console.log("other response events length:", otherResponse.events.length);
    console.log("other response:", otherResponse);
    await printTimes(otherResponse.events);
  }
}

// getLogsForFour();

async function printTimes(events) {
  for (const event of events) {
    console.log(moment(event.timestamp).toString());
  }
}

async function getLogStreams() {
  const client = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
  });
  const versionLogArn = "version_log_arn";

  const versionLogName = "version_log_name";

  const params: DescribeLogStreamsCommandInput = {
    // logGroupName: "/aws/vendedlogs/states/HelloWorldTwo-Logs",
    logGroupIdentifier: versionLogArn,
    logStreamNamePrefix: versionLogName,
    orderBy: "LastEventTime",
    descending: true,
    limit: 10,
  };

  // filter by

  const command = new DescribeLogStreamsCommand(params);
  const response = await client.send(command);
  console.log("DescribeLogStreamsCommand Response", response);
}

// getLogStreams();

async function tryVersion() {
  const client = new CloudWatchLogsClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
  });

  const versionLogArn = "";

  const params: FilterLogEventsCommandInput = {
    logGroupIdentifier: versionLogArn,
    // logGroupName: "/aws/vendedlogs/states/HelloWorldTwo-Logs",
    // startTime: startTime.valueOf(),
    // endTime: endTime.valueOf(),
  };
  const command = new FilterLogEventsCommand(params);

  const response = await client.send(command);

  console.log("event length:", response?.events?.length);
  console.log("reponse:", response);
}

tryVersion();


*/
