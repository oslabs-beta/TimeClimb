import db from "./db";
import moment from "moment";
import { AverageLatencies, StepFunctionAverageLatenciesTable } from "./types";

//hourly latencies
const getStepFunctionLatencies = async (
  step_function_id: number,
  start_time: string,
  end_time: string
): Promise<AverageLatencies[]> => {
  try {
    const latenciesObj = await db<StepFunctionAverageLatenciesTable>(
      "step_function_average_latencies"
    )
      .select(
        "latency_id",
        "step_function_id",
        "average",
        "start_time",
        "executions"
      )
      .whereBetween("start_time", [start_time, end_time])
      .andWhere("step_function_id", step_function_id)
      .orderBy("start_time", "asc");
    return latenciesObj;
  } catch (err) {
    console.log(`Error getting latencies for step function: ${err}`);
  }
};

//daily latencies
const getStepFunctionLatenciesDaily = async (
  step_function_id: number,
  start_time: string,
  end_time: string
): Promise<AverageLatencies[]> => {
  try {
    const latenciesObj = await db<StepFunctionAverageLatenciesTable>(
      "step_function_average_latencies"
    )
      .select(db.raw("DATE(start_time) AS start_time"))
      .avg("average AS average")
      .whereBetween("start_time", [start_time, end_time])
      .where("step_function_id", step_function_id)
      .groupBy(db.raw("DATE(start_time)"))
      .orderBy("start_time");
    return latenciesObj;
  } catch (err) {
    console.log(`Error getting latencies for step function: ${err}`);
  }
};
//weekly latencies
const getStepFunctionLatenciesWeekly = async (
  step_function_id: number,
  start_time: string,
  end_time: string
): Promise<AverageLatencies[]> => {
  try {
    const latenciesObj = await db<StepFunctionAverageLatenciesTable>(
      "step_function_average_latencies"
    )
      .select(db.raw("DATE_TRUNC('week', \"start_time\") as start_time"))
      .avg("average AS average")
      .whereBetween("start_time", [start_time, end_time])
      .where("step_function_id", step_function_id)
      .groupBy(db.raw("DATE_TRUNC('week', \"start_time\")"))
      .orderBy("start_time");
    return latenciesObj;
  } catch (err) {
    return err;
  }
};
//monthly latencies
const getStepFunctionLatenciesMonthly = async (
  step_function_id: number,
  start_time: string,
  end_time: string
): Promise<AverageLatencies[]> => {
  try {
    const latenciesObj = await db<StepFunctionAverageLatenciesTable>(
      "step_function_average_latencies"
    )
      .select(db.raw("DATE_TRUNC('month', \"start_time\") AS start_time"))
      .avg("average AS average")
      .whereBetween("start_time", [start_time, end_time])
      .where("step_function_id", step_function_id)
      .groupBy(db.raw("DATE_TRUNC('month', \"start_time\")"))
      .orderBy("start_time");
    return latenciesObj;
  } catch (err) {
    return err;
  }
};

const insertStepFunctionLatencies = async (
  rows: StepFunctionAverageLatenciesTable[]
) => {
  try {
    await db<StepFunctionAverageLatenciesTable>(
      "step_function_average_latencies"
    ).insert(rows);
  } catch (err) {
    console.log(
      `Error inserting rows into step function average latencies: ${err}`
    );
    return err;
  }
};

const updateStepFunctionLatency = async (
  latencyId: number,
  average: number,
  executions: number
) => {
  try {
    await db<StepFunctionAverageLatenciesTable>(
      "step_function_average_latencies"
    )
      .update({ average, executions })
      .where("latency_id", latencyId);
  } catch (err) {
    console.log(
      `Error updating row in step function average latencies: ${err}`
    );
  }
};

const stepFunctionAverageLatenciesModel = {
  getStepFunctionLatencies,
  getStepFunctionLatenciesDaily,
  getStepFunctionLatenciesWeekly,
  getStepFunctionLatenciesMonthly,
  insertStepFunctionLatencies,
  updateStepFunctionLatency,
};

export default stepFunctionAverageLatenciesModel;
