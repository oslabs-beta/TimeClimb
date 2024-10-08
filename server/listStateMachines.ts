import "dotenv/config";
import { SFNClient, ListStateMachinesCommand } from "@aws-sdk/client-sfn";
import { fromEnv } from "@aws-sdk/credential-providers";
console.log("process.env", process.env);

const sfn = new SFNClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const listStateMachines = new ListStateMachinesCommand();
const response = await sfn.send(listStateMachines);
console.log("response", response);
