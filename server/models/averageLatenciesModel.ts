import db from "./db";
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
      .select("step_function_id", "average", "start_time")
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
    console.log(latenciesObj);
    return latenciesObj;
  } catch (err) {
    return err;
  }
};

const averageLatenciesModel = {
  getStepFunctionLatencies,
  getStepFunctionLatenciesDaily,
  getStepFunctionLatenciesWeekly,
  getStepFunctionLatenciesMonthly,
};

export default averageLatenciesModel;
