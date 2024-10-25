import "dotenv/config";
import { Knex } from "knex";
import { StepFunctionTrackersTable } from "../../server/models/types";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("step_function_trackers").del();

  // Inserts seed entries
  await knex<StepFunctionTrackersTable>("step_function_trackers").insert([
    {
      step_function_id: 3,
      tracker_start_time: null,
      tracker_end_time: null,
      log_group_arn: process.env.HT_LOG_GROUP_ARN,
      active: true,
    },
  ]);
}
