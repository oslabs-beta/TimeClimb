import "dotenv/config";
import moment from "moment-timezone";

import {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { fromEnv } from "@aws-sdk/credential-providers";

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

  console.log("response", response);
}

getLogsForFour();
