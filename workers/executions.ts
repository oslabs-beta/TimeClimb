import stepFunctionAverageLatenciesModel from "../server/models/stepFunctionAverageLatenciesModel";
import stepAverageLatenciesModel from "../server/models/stepAverageLatenciesModel";
import logs from "./logs";
import type {
  FormattedSteps,
  Executions,
  StepCurrentLatencies,
  LatencyData,
} from "./types";
import type {
  StepAverageLatencies,
  AverageLatencies,
} from "../server/models/types";
import type { Moment } from "moment";

const addExecutionsToDatabase = async (
  executions: Executions,
  latencyData: LatencyData,
  stepFunctionId: number,
  stepIds: number[],
  formattedSteps: FormattedSteps,
  startTime: Moment,
  endTime: Moment
) => {
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

  console.log("stepFunctionCurrentLatencyData", stepFunctionCurrentLatencyData);
  console.log("stepsCurrentLatencyRows", stepsCurrentLatencyRows);

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

const upsertStepFunctionLatency = async (
  stepFunctionCurrentLatencyData: AverageLatencies,
  latencyData: LatencyData,
  stepFunctionId: number,
  startTime: Moment,
  endTime: Moment
) => {
  // insert or update the average data for the overall step function
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

const upsertStepLatencies = async (
  stepsCurrentLatencyRows: StepAverageLatencies[],
  latencyData: LatencyData,
  startTime: Moment,
  endTime: Moment
) => {
  // insert or update the calcualted average for each step
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

const calculateNewLatencyData = async (
  oldAverage: number,
  oldExecutions: number,
  newSum: number,
  newExecutions: number
): Promise<number[]> => {
  const oldSum = Number(oldAverage) * Number(oldExecutions);
  console.log("fn_oldSum", oldSum);
  const newAverage =
    (Number(newSum) + Number(oldSum)) /
    (Number(newExecutions) + Number(oldExecutions));
  console.log("newAverage", newAverage);
  const totalExecutions = Number(newExecutions) + Number(oldExecutions);
  console.log("totalExecutions", totalExecutions);
  return [newAverage, totalExecutions];
};

const executionsObject = {
  addExecutionsToDatabase,
  upsertStepFunctionLatency,
  upsertStepLatencies,
  calculateNewLatencyData,
};
export default executionsObject;
