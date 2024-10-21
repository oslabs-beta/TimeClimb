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
      revision_id: "e3f0c4c8a0b503b8059f2b9f876bcc27",
    },
    {
      step_function_id: 2,
      name: "HelloWorld",
      arn: "arn:aws:states:us-west-2:123456789012:stateMachine:HelloWorld",
      region: "us-west-2",
      type: "STANDARD",
      definition: definitions[1],
      comment:
        "A Hello World example demonstrating various state types of the Amazon States Language. It is composed of flow control states only, so it does not need resources to run.",
      has_versions: false,
      is_version: false,
      revision_id: "afq0c4c8a0b503b8059f2b9f876egg56",
    },
  ]);

  await knex.raw(`
    SELECT setval('step_functions_step_function_id_seq', 2, true);
  `);
}
