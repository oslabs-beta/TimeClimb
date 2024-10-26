import db from "./db";
import moment from "moment";
import { AverageLatencies, StepFunctionAverageLatenciesTable } from "./types";
import { start } from "repl";

//hourly latencies
const getStepFunctionLatencies = async (
  step_function_id: number,
  start_time: string,
  end_time: string
):Promise<AverageLatencies[]> => {
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
):Promise<AverageLatencies[]> => {
  try {
  const latenciesObj = await db<StepFunctionAverageLatenciesTable>(
    "step_function_average_latencies"
  )
  .select(db.raw("DATE(start_time)"))
  .avg("average")
  .whereBetween("start_time", [start_time, end_time])
  .where("step_function_id", step_function_id)
  .groupBy(db.raw("DATE(start_time)"))
  return latenciesObj;
} catch (err){
  console.log(`Error getting latencies for step function: ${err}`);
}
}
//weekly latencies
const getStepFunctionLatenciesWeekly = async (
  step_function_id: number,
  start_time: string,
  end_time: string
):Promise<AverageLatencies[]>  => {
  try {
    const latenciesObj = await db<StepFunctionAverageLatenciesTable>(
      "step_function_average_latencies"
    )
    .select(db.raw("DATE_TRUNC('week', \"start_time\") as week_start"))
    .avg("average")
    .whereBetween("start_time", [start_time, end_time])
    .where("step_function_id", step_function_id)
    .groupBy(db.raw("DATE_TRUNC('week', \"start_time\")"))
    .orderBy("week_start")
    return latenciesObj;
  } catch(err){
    return(err)
  }
}
//monthly latencies
const getStepFunctionLatenciesMonthly = async (
  step_function_id: number,
  start_time: string,
  end_time: string
):Promise<AverageLatencies[]>  => {
  try {
    const latenciesObj = await db<StepFunctionAverageLatenciesTable>(
      "step_function_average_latencies"
    )
    .select(db.raw("DATE_TRUNC('month', \"start_time\") as month_start"))
    .avg("average")
    .whereBetween("start_time", [start_time, end_time])
    .where("step_function_id", step_function_id)
    .groupBy(db.raw("DATE_TRUNC('month', \"start_time\")"))
    .orderBy("month_start");
    return latenciesObj
  } catch(err) {
      return(err)
  }
}

const averageLatenciesModel = {
  // methods
  getStepFunctionLatencies,
  getStepFunctionLatenciesDaily,
  getStepFunctionLatenciesWeekly,
  getStepFunctionLatenciesMonthly
};

// const endOfYesterday = moment.utc().subtract(1, 'day').endOf("day");
// const startOfYesterday = moment.utc().subtract(1, 'day').startOf("day");

// async function whatever() {
//   console.log(
//     await averageLatenciesModel.getStepFunctionLatencies(
//       1,
//       startOfYesterday.toISOString(),
//       endOfYesterday.toISOString()
//     )
//   );
// }
//whatever();
export default averageLatenciesModel;

// export interface StepFunctionAverageLatenciesTable {
//   latency_id?: number;
//   step_function_id: number;
//   average: number;
//   executions: number;
//   start_time: string;
//   end_time: string;
// }
