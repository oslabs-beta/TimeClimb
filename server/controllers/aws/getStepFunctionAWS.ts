import "dotenv/config";
import { SFNClient, DescribeStateMachineCommand } from "@aws-sdk/client-sfn";
import { fromEnv } from "@aws-sdk/credential-providers";
import { GetStateMachineDetailsFromAWS } from "../../types/stepFunctionDetailsFromAWS";
import  stepFunctionsModel from "/Users/alexstewart/gh-repos/timeClimb/TimeClimb/server/models/stepFunctionsModel"

async function getStateMachineDetails(
    stateMachineArn: GetStateMachineDetailsFromAWS
): Promise<undefined> {
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
    console.log("getStateMachineDetails response", response);
    stepFunctionsModel.addToStepFunctionTable(response);
    return undefined

}

getStateMachineDetails("arn:aws:states:us-west-2:703671926773:stateMachine:BasicsHelloWorldStateMachine");