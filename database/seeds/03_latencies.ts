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
  console.log("Generating latency data");
  const data = await latenciesGenerator(steps, 1);
  console.log("Data created");
  const batchSize = 1000;
  try {
    await knex.transaction(async (transaction) => {
      console.log("Inserting data in batches");
      await knex
        .batchInsert("step_latencies", data.step_latencies, batchSize)
        .transacting(transaction);
      console.log(
        `Inserted ${data.step_latencies.length} rows in step_latences`
      );
      await knex
        .batchInsert(
          "step_function_latencies",
          data.step_function_latencies,
          batchSize
        )
        .transacting(transaction);
      console.log(
        `Inserted ${data.step_function_latencies.length} rows in step_function_latences`
      );
    });
    await knex<StepLatenciesTable>("step_latencies").insert(
      data.step_latencies
    );
    await knex<StepFunctionLatenciesTable>("step_function_latencies").insert(
      data.step_function_latencies
    );
  } catch (error) {
    console.log(`Error inserting latency data: ${error}`);
  }
}
