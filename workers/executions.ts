import stepFunctionAverageLatenciesModel from "../server/models/stepFunctionAverageLatenciesModel";
import stepAverageLatenciesModel from "../server/models/stepAverageLatenciesModel";
import type { StepCurrentLatencies, LatencyData } from "./types";
import type {
  StepAverageLatencies,
  AverageLatencies,
} from "../server/models/types";
import type { Moment } from "moment";

/**
 * Adds latencies to the database for step functions and each step, whether
 * updating existing rows or adding new rows of data.
 * @param latencyData Object with latency data per execution of the step function
 * @param stepFunctionId Id of the step function as referenced in the database
 * @param stepIds Array step ids which belong to this step function
 * @param startTime The start time of the hour for this data
 * @param endTime The end time of the hour for this data
 */
const addLatenciesToDatabase = async (
  latencyData: LatencyData,
  stepFunctionId: number,
  stepIds: number[],
  startTime: Moment,
  endTime: Moment
): Promise<void> => {
  // get average data for the step function and steps for this hour
  const [stepFunctionCurrentLatencyData] =
    await stepFunctionAverageLatenciesModel.getStepFunctionLatencies(
      stepFunctionId,
      startTime.toISOString(),
      endTime.toISOString()
    );

  const stepsCurrentLatencyRows =
    await stepAverageLatenciesModel.getHourlyLatenciesBetweenTimes(
      stepIds,
      startTime.toISOString(),
      endTime.toISOString()
    );

  await upsertStepFunctionLatency(
    stepFunctionCurrentLatencyData,
    latencyData,
    stepFunctionId,
    startTime,
    endTime
  );
  if (Object.keys(latencyData.steps).length > 0) {
    await upsertStepLatencies(
      stepsCurrentLatencyRows,
      latencyData,
      startTime,
      endTime
    );
  }
};

/**
 * Inserts or Updates the step function average latencies in the database with
 * the most recent calculated values.
 * @param stepFunctionCurrentLatencyData Row of database information for the
 * overall step function latency from step_function_average_latencies table
 * @param latencyData New latency data from cloudwatch logs
 * @param stepFunctionId Id of the step function as stored in the database
 * @param startTime The start time of the hour for this data
 * @param endTime The end time of the hour for this data
 */
const upsertStepFunctionLatency = async (
  stepFunctionCurrentLatencyData: AverageLatencies,
  latencyData: LatencyData,
  stepFunctionId: number,
  startTime: Moment,
  endTime: Moment
) => {
  if (stepFunctionCurrentLatencyData) {
    const [newAverage, newExecutions] = await calculateNewLatencyData(
      stepFunctionCurrentLatencyData.average,
      stepFunctionCurrentLatencyData.executions,
      latencyData.stepFunctionLatencySum / 1000,
      latencyData.executions
    );

    await stepFunctionAverageLatenciesModel.updateStepFunctionLatency(
      stepFunctionCurrentLatencyData.latency_id,
      newAverage,
      newExecutions
    );
  } else {
    await stepFunctionAverageLatenciesModel.insertStepFunctionLatencies([
      {
        step_function_id: stepFunctionId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        average:
          latencyData.stepFunctionLatencySum / latencyData.executions / 1000,
        executions: latencyData.executions,
      },
    ]);
  }
};

/**
 * Inserts or Updates step average latencies in the database with most recent
 * calculated values.
 * @param stepsCurrentLatencyRows Rows of database information for each step
 * which includes its currently latency information
 * @param latencyData New latency data object created from cloudwatch logs
 * @param startTime The start time of the hour this data is for
 * @param endTime The end time of the hour this data is for
 */
const upsertStepLatencies = async (
  stepsCurrentLatencyRows: StepAverageLatencies[],
  latencyData: LatencyData,
  startTime: Moment,
  endTime: Moment
) => {
  const stepsCurrentLatencyObject: StepCurrentLatencies = {};
  stepsCurrentLatencyRows.forEach((row) => {
    stepsCurrentLatencyObject[row.step_id] = {
      average: row.average,
      executions: row.executions,
      latencyId: row.latency_id,
    };
  });

  if (stepsCurrentLatencyRows.length > 0) {
    for (const stepId of Object.keys(latencyData.steps)) {
      if (stepsCurrentLatencyObject[stepId] !== undefined) {
        const [newAverage, newExecutions] = await calculateNewLatencyData(
          stepsCurrentLatencyObject[stepId].average,
          stepsCurrentLatencyObject[stepId].executions,
          Number(latencyData.steps[stepId].sum) / 1000,
          Number(latencyData.steps[stepId].executions)
        );
        await stepAverageLatenciesModel.updateStepAverageLatency(
          stepsCurrentLatencyObject[stepId].latencyId,
          newAverage,
          newExecutions
        );
      } else {
        const average =
          Number(latencyData.steps[stepId].sum) /
          Number(latencyData.steps[stepId].executions) /
          1000; // convert from milliseconds to seconds

        await stepAverageLatenciesModel.insertStepAverageLatencies([
          {
            step_id: Number(stepId),
            average,
            executions: Number(latencyData.steps[stepId].executions),
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
          },
        ]);
      }
    }
  } else {
    for (const stepId of Object.keys(latencyData.steps)) {
      const average =
        Number(latencyData.steps[stepId].sum) /
        Number(latencyData.steps[stepId].executions) /
        1000; // convert from milliseconds to seconds

      await stepAverageLatenciesModel.insertStepAverageLatencies([
        {
          step_id: Number(stepId),
          average,
          executions: Number(latencyData.steps[stepId].executions),
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
        },
      ]);
    }
  }
};

/**
 * Calculates latency by combining old data with new data
 * @param oldAverage Existing average from
 * @param oldExecutions Existing number of executions from the database
 * @param newSum New latency sum from cloudwatch logs
 * @param newExecutions New execution sum from cloudwatch logs
 * @returns Array of [new average, new total executions]
 */
const calculateNewLatencyData = async (
  oldAverage: number,
  oldExecutions: number,
  newSum: number,
  newExecutions: number
): Promise<number[]> => {
  const oldSum = Number(oldAverage) * Number(oldExecutions);
  const newAverage =
    (Number(newSum) + Number(oldSum)) /
    (Number(newExecutions) + Number(oldExecutions));
  const totalExecutions = Number(newExecutions) + Number(oldExecutions);
  return [newAverage, totalExecutions];
};

const executionsObject = {
  addLatenciesToDatabase,
  upsertStepFunctionLatency,
  upsertStepLatencies,
  calculateNewLatencyData,
};
export default executionsObject;
