import { Knex } from "knex";
import { StepsTable } from "./utils/types";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("steps").del();

  // Inserts seed entries
  await knex<StepsTable>("steps").insert([
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
  ]);
}
