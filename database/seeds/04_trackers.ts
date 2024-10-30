import "dotenv/config";
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("step_function_trackers").del();
}
