<<<<<<< HEAD
import 'dotenv/config';
import { SFNClient, DescribeStateMachineCommand } from '@aws-sdk/client-sfn';
import { fromEnv } from '@aws-sdk/credential-providers';
import { GetStateMachineDetailsFromAWS } from '../../types/stepFunctionDetailsFromAWS';
import stepFunctionsModel from '../../models/stepFunctionsModel';
// import  stepFunctionsModel from "/Users/alexstewart/gh-repos/timeClimb/TimeClimb/server/models/stepFunctionsModel"
import type { Request, Response, NextFunction } from 'express';
import type { StepFunctionsTable } from '../../models/types';
import db from '../../models/db';
=======
import "dotenv/config";
import { SFNClient, DescribeStateMachineCommand } from "@aws-sdk/client-sfn";
import { fromEnv } from "@aws-sdk/credential-providers";
import stepFunctionsModel from "../../models/stepFunctionsModel";
import type { Request, Response, NextFunction } from "express";
import type { StepFunctionsTable } from "../../models/types";
import db from "../../models/db";
>>>>>>> ace0c2c7eef7ccf0bdb477c4bd0d0b8423c53099

const getStateMachineDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //first check it state machine exists in database
<<<<<<< HEAD
    const result = await db<StepFunctionsTable>('step_functions')
=======
    const result = await db<StepFunctionsTable>("step_functions")
>>>>>>> ace0c2c7eef7ccf0bdb477c4bd0d0b8423c53099
      .where({ arn: req.body.arn })
      .first();
    if (result) {
      res.locals.newTable = {
        name: result.name,
        step_function_id: result.step_function_id,
        definition: result.definition,
      };
      return next();
    }
    //otherwise, retrieve state machine from AWS, add it to database, and retrieve from database
    const stateMachineArn = req.body.arn;
    const describeStateMachine = new DescribeStateMachineCommand({
      stateMachineArn,
    });
    //create new instance of sfn
    const sfn = new SFNClient({
<<<<<<< HEAD
      region: stateMachineArn.split(':')[3],
=======
      region: stateMachineArn.split(":")[3],
>>>>>>> ace0c2c7eef7ccf0bdb477c4bd0d0b8423c53099
      credentials: fromEnv(),
    });
    // sfn.config.region = stateMachineArn.split(":")
    const response = await sfn.send(describeStateMachine);
    // console.log("getStateMachineDetails response", response);
    const addStepFunction = stepFunctionsModel.addToStepFunctionTable(response);
    res.locals.newTable = addStepFunction;
    return next();
  } catch (error) {
    return next(error);
  }
};
//getStateMachineDetails("arn:aws:states:us-west-2:703671926773:stateMachine:BasicsHelloWorldStateMachine");

export default getStateMachineDetails;
