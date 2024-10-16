import "dotenv/config";
import { SFNClient, DescribeStateMachineCommand } from "@aws-sdk/client-sfn";
import { fromEnv } from "@aws-sdk/credential-providers";
import { GetStateMachineDetailsFromAWS } from "../../types/stepFunctionDetailsFromAWS";
import  stepFunctionsModel from "../../../server/models/stepFunctionsModel"
import type { Request, Response, NextFunction } from "express";
import type { StepFunctionsTable } from "../../models/types";
import db from "../../models/db";

const getStateMachineDetails = async(
    req: Request,
    res: Response,
    next: NextFunction,
    ) => {
        try{  //first check it state machine exists in database
            const result = await db<StepFunctionsTable>("step_functions")
            .where({arn: req.body.arn})
            .first();
        if(result){
           res.locals.newTable = {name: result.name, step_function_id: result.step_function_id, definition: result.definition}
          return next();
        }
        //otherwise, retrieve state machine from AWS, add it to database, and retrieve from database
    const stateMachineArn = req.body.arn;
    const describeStateMachine = new DescribeStateMachineCommand({
        stateMachineArn,
    });
    //create new instance of sfn
    const sfn = new SFNClient({
        region: stateMachineArn.split(":")[3],
        credentials: fromEnv(),
    });
   // sfn.config.region = stateMachineArn.split(":")
    const response = await sfn.send(describeStateMachine);
   // console.log("getStateMachineDetails response", response);
    const addStepFunction = stepFunctionsModel.addToStepFunctionTable(response);
    res.locals.newTable = addStepFunction;
    return next();
        } catch(error){
            return next(error)
        }
}
//getStateMachineDetails("arn:aws:states:us-west-2:703671926773:stateMachine:BasicsHelloWorldStateMachine");

export default getStateMachineDetails