import { Knex } from "knex";
import {
  StepLatenciesTable,
  StepFunctionLatenciesTable,
  StepTimeData,
} from "./utils/types";
import latenciesGenerator from "./utils/latenciesGenerator";
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("step_latencies").del();
  await knex("step_function_latencies").del();
  // // Inserts seed entries

  const steps: StepTimeData[] = [
    {
      step_id: 1,
      averageRange: 5,
      averageOffset: 10,
      executionOffset: 5000,
      executionRange: 3000,
    },
    {
      step_id: 2,
      averageRange: 0.4,
      averageOffset: 0.65,
      executionRange: 45,
      executionOffset: 125,
    },
    {
      step_id: 3,
      averageRange: 2.5,
      averageOffset: 3,
      executionRange: 25,
      executionOffset: 50,
    },
  ];
  const data = await latenciesGenerator(steps, 1);
  await knex<StepLatenciesTable>("step_latencies").insert(data.step_latencies);
  await knex<StepFunctionLatenciesTable>("step_function_latencies").insert(
    data.step_function_latencies
  );
}
