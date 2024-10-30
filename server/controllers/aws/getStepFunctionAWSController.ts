import "dotenv/config";
import { SFNClient, DescribeStateMachineCommand } from "@aws-sdk/client-sfn";
import { fromEnv } from "@aws-sdk/credential-providers";
import stepFunctionsModel from "../../models/stepFunctionsModel";
import type { Request, Response, NextFunction } from "express";
import stepsModel from "../../models/stepsModel";
import parseStepFunction from "../../utils/parseStepFunction";
import { NewStepRow } from "../../models/types";

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

    res.locals.newTable = addStepFunction;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default getStepFunctionAWS;
