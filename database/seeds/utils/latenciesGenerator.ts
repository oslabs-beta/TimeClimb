import moment from "moment";
import {
  StepTimeData,
  StepLatenciesTable,
  StepFunctionLatenciesTable,
} from "./types";

const getRandomNumber = (range: number, offset: number): number => {
  return Math.random() * range + offset;
};

const latenciesGenerator = async (
  events: StepTimeData[],
  stepFunctionId: number
) => {
  const data: {
    step_latencies: StepLatenciesTable[];
    step_function_latencies: StepFunctionLatenciesTable[];
  } = { step_latencies: [], step_function_latencies: [] };
  // dates in moment are mutable, so we need to create a new one before
  // subtracting here... doing now.subtract() would alter now
  const now = moment.utc();
  // const oneYearAgo = moment.utc().subtract(1, "year");
  const oneDayAgo = moment.utc().subtract(1, "day");
  while (now.isAfter(oneDayAgo)) {
    const startOfCurrentHour = now.clone().utc().startOf("hour");
    const endOfCurrentHour = now.clone().utc().endOf("hour");
    let totalDuration = 0;
    const maxExecutions: number[] = [];

    for (const event of events) {
      const average = getRandomNumber(event.averageRange, event.averageOffset);
      const executions = getRandomNumber(
        event.executionRange,
        event.executionOffset
      );
      data.step_latencies.push({
        step_id: event.step_id,
        average,
        executions: Math.floor(executions),
        start_time: startOfCurrentHour.toISOString(),
        end_time: endOfCurrentHour.toISOString(),
      });

      totalDuration += average;
      maxExecutions.push(executions);
    }
    data.step_function_latencies.push({
      step_function_id: stepFunctionId,
      average: totalDuration,
      executions: Math.floor(Math.max(...maxExecutions)),
      start_time: startOfCurrentHour.toISOString(),
      end_time: endOfCurrentHour.toISOString(),
    });

    now.subtract(1, "hour");
  }
  // function that generates step data object for specific hour
  return data;
};

export default latenciesGenerator;
