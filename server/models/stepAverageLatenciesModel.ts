import db from "./db";
import type { StepAverageLatenciesTable } from "./types";
import type { StepAverageLatencies } from "./types";

//getting hourly latencies (no averages)
const getLatenciesBetweenTimes = async (
  stepIds: number[],
  startTime: string,
  endTime: string
):Promise<StepAverageLatencies[]> => {
  try {
    const rows = await db<StepAverageLatenciesTable>("step_average_latencies")
      .select("step_id", "average", "start_time")
      .whereIn("step_id", stepIds)
      .whereBetween("start_time", [startTime, endTime])
      .orderBy(["start_time", "step_id"]);
    return rows;
  } catch (err) {
    console.log(`Error getting step lantency data between times: ${err}`);
    return []
  }
};

const getHourlyLatencyAveragesBetweenTimes = async (
  stepIds: number[],
  startTime: string,
  endTime: string
):Promise<StepAverageLatencies[]> => {
  try {
    const rows = await db<StepAverageLatenciesTable>("step_average_latencies")
      .select("step_id")
      .select(db.raw('DATE_TRUNC(\'day\', "start_time") AS day'))
      .avg("average")
      .whereIn("step_id", stepIds)
      .whereBetween("start_time", [startTime, endTime])
      .groupBy(db.raw("step_id, DATE_TRUNC('day', \"start_time\")"))
      .orderBy(["day","step_id"]);
     // console.log(rows)
    return rows;
  } catch (err) {
    console.log(`Error getting step lantency data between times: ${err}`);
    return [];
  }
};

const getWeeklyLatencyAveragesBetweenTimes = async (
  stepIds: number[],
  startTime: string,
  endTime: string,
):Promise<StepAverageLatencies[]> => {
  try {
    const rows = await db<StepAverageLatenciesTable>("step_average_latencies")
      .select("step_id")
      .select(db.raw('DATE_TRUNC(\'week\', "start_time") AS week'))
      .avg("average")
      .whereIn("step_id", stepIds)
      .whereBetween("start_time", [startTime, endTime])
      .groupBy(db.raw("step_id, DATE_TRUNC('week', \"start_time\")"))
      .orderBy(["week","step_id"]);
     // console.log(rows)
    return rows;
  } catch(err) {
    console.log(`Error getting step lantency data between times: ${err}`);
    return []
  }
}

const getMonthlyLatencyAveragesBetweenTimes = async (
  stepIds: number[],
  startTime: string,
  endTime: string,
):Promise<StepAverageLatencies[]> => {
  try{
  const rows = await db<StepAverageLatenciesTable>("step_average_latencies")
  .select("step_id")
  .select(db.raw('DATE_TRUNC(\'month\', "start_time") AS month'))
  .avg("average")
  .whereIn("step_id", stepIds)
  .whereBetween("start_time", [startTime, endTime])
  .groupBy(db.raw("step_id, DATE_TRUNC('month', \"start_time\")"))
  .orderBy("month", "step_id")
  return rows
  }catch(err){
    console.log(`Error gettting step latency between times: ${err}`)
  return [];
  }
}

const stepAverageLatenciesModel = {
  getLatenciesBetweenTimes,
  getHourlyLatencyAveragesBetweenTimes,
  getWeeklyLatencyAveragesBetweenTimes,
  getMonthlyLatencyAveragesBetweenTimes
};

export default stepAverageLatenciesModel;
