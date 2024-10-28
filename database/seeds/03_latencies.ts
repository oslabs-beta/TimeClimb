import { Knex } from "knex";
import { StepTimeData } from "./utils/types";
import latenciesGenerator from "./utils/latenciesGenerator";
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("step_average_latencies").del();
  await knex("step_function_average_latencies").del();
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
        .batchInsert("step_average_latencies", data.step_latencies, batchSize)
        .transacting(transaction);
      console.log(
        `Inserted ${data.step_latencies.length} rows in step_latences`
      );
      await knex
        .batchInsert(
          "step_function_average_latencies",
          data.step_function_latencies,
          batchSize
        )
        .transacting(transaction);
      console.log(
        `Inserted ${data.step_function_latencies.length} rows in step_function_latences`
      );
    });

    const helloWorldSteps = [
      {
        step_id: 4,
        averageRange: 0.25,
        averageOffset: 0.001,
        executionOffset: 50,
        executionRange: 30,
      },
      {
        step_id: 5,
        averageRange: 0.8,
        averageOffset: 0.2,
        executionOffset: 50,
        executionRange: 3000,
      },
      {
        step_id: 6,
        averageRange: 1,
        averageOffset: 0.05,
        executionOffset: 50,
        executionRange: 30,
      },
      {
        step_id: 7,
        averageRange: 3,
        averageOffset: 0.5,
        executionOffset: 5000,
        executionRange: 3000,
      },
      {
        step_id: 8,
        averageRange: 1,
        averageOffset: 20,
        executionOffset: 5000,
        executionRange: 3000,
      },
      {
        step_id: 9,
        averageRange: 10,
        averageOffset: 2,
        executionOffset: 50,
        executionRange: 30,
      },
      // {
      //   step_id: 10,
      //   averageRange: 4.5,
      //   averageOffset: 0.25,
      //   executionOffset: 50,
      //   executionRange: 30,
      // },
      {
        step_id: 11,
        averageRange: 2,
        averageOffset: 0.2,
        executionOffset: 50,
        executionRange: 30,
      },
      {
        step_id: 12,
        averageRange: 0.3,
        averageOffset: 0.001,
        executionOffset: 50,
        executionRange: 30,
      },
    ];

    const data2 = await latenciesGenerator(helloWorldSteps, 2);
    console.log("Data created");

    await knex.transaction(async (transaction) => {
      console.log("Inserting data in batches");
      await knex
        .batchInsert("step_average_latencies", data2.step_latencies, batchSize)
        .transacting(transaction);
      console.log(
        `Inserted ${data2.step_latencies.length} rows in step_latences`
      );
      await knex
        .batchInsert(
          "step_function_average_latencies",
          data2.step_function_latencies,
          batchSize
        )
        .transacting(transaction);
      console.log(
        `Inserted ${data2.step_function_latencies.length} rows in step_function_latences`
      );
    });
  } catch (error) {
    console.log(`Error inserting latency data: ${error}`);
  }
}
