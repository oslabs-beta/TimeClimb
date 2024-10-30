import "dotenv/config";
import moment, { Moment } from "moment";
import {
  SFNClient,
  DescribeStateMachineCommand,
  LoggingConfiguration,
} from "@aws-sdk/client-sfn";
import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogGroupsCommandInput,
} from "@aws-sdk/client-cloudwatch-logs";
import { fromEnv } from "@aws-sdk/credential-providers";
import stepFunctionsModel from "../../models/stepFunctionsModel";
import type { Request, Response, NextFunction } from "express";
import stepsModel from "../../models/stepsModel";
import parseStepFunction from "../../utils/parseStepFunction";
import { NewStepRow } from "../../models/types";
import stepFunctionTrackersModel from "../../models/stepFunctionTrackersModel";

/**
 * Gets the creation time for a log group.  This helps determine how far back to
 * query logs for step function executions.
 *
 * @param {string} logGroupName The log group name to filter results by,
 * without the full arn
 * @returns {Promise<number | undefined>}Promise that resolves to a number,
 * which is an epoch time in milliseconds, or undefined
 */
const getLogGroupCreationTime = async (
  logGroupName: string,
  region: string
): Promise<number | undefined> => {
  const client = new CloudWatchLogsClient({
    region,
    credentials: fromEnv(),
  });

  const params: DescribeLogGroupsCommandInput = {
    logGroupNamePrefix: logGroupName,
  };

  const command = new DescribeLogGroupsCommand(params);
  const response = await client.send(command);
  console.log("DescribeLogGroupsCommand Response", response);
  const creationTime = response?.logGroups[0]?.creationTime;
  return creationTime;
};

const getLoggingConfiguration = async (
  config: LoggingConfiguration
): Promise<string[]> => {
  let logGroupArn = "";
  let logGroupName = "";
  for (const logs of config.destinations) {
    if (logs.cloudWatchLogsLogGroup.logGroupArn) {
      logGroupArn = logs.cloudWatchLogsLogGroup.logGroupArn;
      logGroupName = logGroupArn.split("log-group:")[1];
      if (logGroupName.endsWith(":*")) logGroupName = logGroupName.slice(0, -2);
      break;
    }
  }
  return [logGroupArn, logGroupName];
};

const getStepFunctionAWS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stateMachineArn = req.body.arn;
    //first check it state machine exists in database
    const result = await stepFunctionsModel.checkStepFunctionsTable(
      stateMachineArn
    );
    if (result) {
      res.locals.newTable = {
        name: result.name,
        step_function_id: result.step_function_id,
        definition: result.definition,
      };
      return next();
    }
    //otherwise, retrieve state machine from AWS, add it to database, and retrieve from database
    const describeStateMachine = new DescribeStateMachineCommand({
      stateMachineArn,
    });

    // arn has region after 3rd ':'
    const region: string = stateMachineArn.split(":")[3];
    const sfn = new SFNClient({
      region,
      credentials: fromEnv(),
    });

    const response = await sfn.send(describeStateMachine);

    const [logGroupArn, logGroupName] = await getLoggingConfiguration(
      response.loggingConfiguration
    );

    if (logGroupArn.length <= 0 || logGroupName.length <= 0) {
      return next("No log group found for step function");
    }

    const logGroupCreationTime = await getLogGroupCreationTime(
      logGroupName,
      region
    );

    // limit max log ingestion to one week ago
    const creationDate = moment(logGroupCreationTime).startOf("hour").utc();
    const oneWeekAgo = moment().subtract(1, "week").startOf("hour").utc();

    const newerDate = oneWeekAgo.isBefore(creationDate)
      ? creationDate
      : oneWeekAgo;

    const addStepFunction = await stepFunctionsModel.addToStepFunctionTable(
      response,
      region
    );

    const aslObject = JSON.parse(response.definition);
    const stepRows: NewStepRow[] = await parseStepFunction(
      aslObject,
      addStepFunction.step_function_id
    );

    await stepsModel.insertSteps(stepRows);

    await stepFunctionTrackersModel.insertTracker({
      step_function_id: addStepFunction.step_function_id,
      log_group_arn: logGroupArn,
      tracker_start_time: newerDate.toISOString(),
      active: true,
    });

    res.locals.newTable = addStepFunction;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default getStepFunctionAWS;
