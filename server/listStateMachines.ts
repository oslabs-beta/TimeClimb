import "dotenv/config";
import {
  SFNClient,
  ListStateMachinesCommand,
  ListStateMachineVersionsCommand,
  ListStateMachineVersionsCommandOutput,
} from "@aws-sdk/client-sfn";
import { fromEnv } from "@aws-sdk/credential-providers";
console.log("process.env", process.env);

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
 * Get state machine version information for each state machine
 */
const stateMachineVersions: ListStateMachineVersionsCommandOutput[] = [];

if (response.stateMachines) {
  for (const stateMachine of response.stateMachines) {
    const input = {
      stateMachineArn: stateMachine.stateMachineArn,
    };
    const listStateMachineVerions = new ListStateMachineVersionsCommand(input);
    const response = await sfn.send(listStateMachineVerions);
    if (response.stateMachineVersions) {
      console.log("stateMachienVersionObject:", response.stateMachineVersions);
    }
    stateMachineVersions.push(response);
  }
}
console.log("listStateMachienVersions", stateMachineVersions);
