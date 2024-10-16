import "dotenv/config";
import {
  SFNClient,
  ListStateMachinesCommand,
  ListStateMachinesCommandOutput,
  ListStateMachineVersionsCommand,
  ListStateMachineVersionsCommandOutput,
  DescribeStateMachineCommand,
} from "@aws-sdk/client-sfn";
import { fromEnv } from "@aws-sdk/credential-providers";

/**
 * Reads access token from these environment variables:
 * AWS_ACCESS_KEY_ID
 * AWS_SECRET_ACCESS_KEY
 *
 * Using fromEnv() to automatically pull the data in from environment variables
 * When I tried specifying the creditials manually, TypeScript complained.
 * This could probably be done without the need for
 * @aws-sdk/credentials-provider library with proper TypeScript configuration.
 *
 * However, that library would be useful if we offered another way to
 * authenticate other than with access keys, which amazon suggests to do, so it
 * was worth experimenting with as well.
 */
const sfn = new SFNClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const listStateMachines = new ListStateMachinesCommand();
const response = await sfn.send(listStateMachines);
console.log("listStateMachines response", response);

// just getting the details for the first state machine returned
if (response.stateMachines && response.stateMachines[0].stateMachineArn) {
  getStateMachineDetails(
    "arn:aws:states:us-east-1:124355667606:stateMachine:HelloWorldVersions:1"
  );
  getStateMachineVersions(response);
}

/**
 * get the detailed implementations of a state machine
 */
async function getStateMachineDetails(
  stateMachineArn: string
): Promise<undefined> {
  const describeStateMachine = new DescribeStateMachineCommand({
    stateMachineArn,
  });

  const response = await sfn.send(describeStateMachine);
  console.log("getStateMachineDetails reponse", response);

  return undefined;
}

/**
 * Get state machine version information for each state machine found
 * Not invoked anymore in this file - could use some throttling later
 */
async function getStateMachineVersions(
  response: ListStateMachinesCommandOutput
): Promise<undefined> {
  const stateMachineVersions: ListStateMachineVersionsCommandOutput[] = [];

  if (response.stateMachines) {
    for (const stateMachine of response.stateMachines) {
      const input = {
        stateMachineArn: stateMachine.stateMachineArn,
      };
      const listStateMachineVerions = new ListStateMachineVersionsCommand(
        input
      );
      const response = await sfn.send(listStateMachineVerions);
      if (response.stateMachineVersions) {
        console.log(
          "stateMachienVersionObject:",
          response.stateMachineVersions
        );
      }
      stateMachineVersions.push(response);
    }
  }
  console.log("listStateMachienVersions", stateMachineVersions);
  return undefined;
}
