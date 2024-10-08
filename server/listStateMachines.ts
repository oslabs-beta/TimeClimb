import "dotenv/config";
import {
  SFNClient,
  ListStateMachinesCommand,
  ListStateMachineVersionsCommand,
  ListStateMachineVersionsCommandOutput,
  DescribeStateMachineCommand,
} from "@aws-sdk/client-sfn";
import { fromEnv } from "@aws-sdk/credential-providers";

/**
 * Reads access token from these environment variables:
 * AWS_ACCESS_KEY_ID
 * AWS_SECRET_ACCESS_KEY
 */
const sfn = new SFNClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const listStateMachines = new ListStateMachinesCommand();
const response = await sfn.send(listStateMachines);
console.log("listStateMachines response", response);

/**
 * get the detailed implementations of a state machine
 */
if (response.stateMachines && response.stateMachines[0].stateMachineArn) {
  getStateMachineDetails(response.stateMachines[0].stateMachineArn);
}
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
 * Get state machine version information for each state machine
 */
async function getStateMachineVersions(
  response: ListStateMachineVersionsCommandOutput
): undefined {
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
