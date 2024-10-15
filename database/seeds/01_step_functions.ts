import { Knex } from "knex";
import definitions from "./utils/step-function-definitions";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("step_functions").del();

  // Inserts seed entries
  await knex("step_functions").insert([
    {
      step_function_id: 1,
      name: "CallbackExample",
      arn: "arn:aws:states:us-east-1:123456789012:stateMachine:CallBackExample",
      region: "us-east-1",
      type: "STANDARD",
      definition: definitions[0],
      comment:
        "An example of the Amazon States Language for starting a task and waiting for a callback.",
      has_versions: false,
      is_version: false,
      revisionId: "e3f0c4c8a0b503b8059f2b9f876bcc27",
    },
  ]);
}
