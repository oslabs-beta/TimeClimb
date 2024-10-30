import { Knex } from "knex";
import { StepsTable } from "../../server/models/types";

// export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("steps").del();

  // Inserts seed entries
  await knex<StepsTable>("steps").insert([
    //CallbackExample step function steps
    {
      step_id: 1,
      step_function_id: 1,
      name: "Start Task And Wait For Callback",
      type: "Task",
    },
    {
      step_id: 2,
      step_function_id: 1,
      name: "Notify Success",
      type: "Task",
    },
    {
      step_id: 3,
      step_function_id: 1,
      name: "Notify Failure",
      type: "Task",
    },
    // begin of HelloWord step function steps
    {
      step_id: 4,
      step_function_id: 2,
      name: "Pass",
      type: "Pass",
    },
    {
      step_id: 5,
      step_function_id: 2,
      name: "Hello World example?",
      type: "Choice",
    },
    {
      step_id: 6,
      step_function_id: 2,
      name: "Yes",
      type: "Pass",
    },
    {
      step_id: 7,
      step_function_id: 2,
      name: "No",
      type: "Fail",
    },
    {
      step_id: 8,
      step_function_id: 2,
      name: "Wait 3 sec",
      type: "Wait",
    },
    {
      step_id: 9,
      step_function_id: 2,
      name: "Parallel State",
      type: "Parallel",
    },
    {
      step_id: 10,
      step_function_id: 2,
      name: "Hello",
      type: "Pass",
    },
    {
      step_id: 11,
      step_function_id: 2,
      name: "World",
      type: "Pass",
    },
    {
      step_id: 12,
      step_function_id: 2,
      name: "Hello World",
      type: "Pass",
    },
  ]);

  await knex.raw(`
    SELECT setval('steps_step_id_seq', 12, true);
  `);
}
