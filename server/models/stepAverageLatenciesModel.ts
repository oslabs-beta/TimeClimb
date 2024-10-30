import db from "./db";
import type { StepAverageLatenciesTable } from "./types";
import type { StepAverageLatencies } from "./types";

//getting hourly latencies (no averages)
const getHourlyLatenciesBetweenTimes = async (
  stepIds: number[],
  startTime: string,
  endTime: string
): Promise<StepAverageLatencies[]> => {
  try {
    const rows = await db<StepAverageLatenciesTable>("step_average_latencies")
      .select("latency_id", "step_id", "average", "start_time", "executions")
      .whereIn("step_id", stepIds)
      .whereBetween("start_time", [startTime, endTime])
      .orderBy(["start_time", "step_id"]);
    return rows;
  } catch (err) {
    console.log(`Error getting step lantency data between times: ${err}`);
    return [];
  }
};

const getDailyLatencyAveragesBetweenTimes = async (
  stepIds: number[],
  startTime: string,
  endTime: string
): Promise<StepAverageLatencies[]> => {
  try {
    const rows = await db<StepAverageLatenciesTable>("step_average_latencies")
      .select("step_id")
      .select(db.raw("DATE_TRUNC('day', \"start_time\") AS start_time"))
      .avg("average AS average")
      .whereIn("step_id", stepIds)
      .whereBetween("start_time", [startTime, endTime])
      .groupBy(db.raw("step_id, DATE_TRUNC('day', \"start_time\")"))
      .orderBy(["start_time", "step_id"]);
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
  endTime: string
): Promise<StepAverageLatencies[]> => {
  try {
    const rows = await db<StepAverageLatenciesTable>("step_average_latencies")
      .select("step_id")
      .select(db.raw("DATE_TRUNC('week', \"start_time\") AS start_time"))
      .avg("average as average")
      .whereIn("step_id", stepIds)
      .whereBetween("start_time", [startTime, endTime])
      .groupBy(db.raw("step_id, DATE_TRUNC('week', \"start_time\")"))
      .orderBy(["start_time", "step_id"]);
    // console.log(rows)
    return rows;
  } catch (err) {
    console.log(`Error getting step lantency data between times: ${err}`);
    return [];
  }
};

const getMonthlyLatencyAveragesBetweenTimes = async (
  stepIds: number[],
  startTime: string,
  endTime: string
): Promise<StepAverageLatencies[]> => {
  try {
    const rows = await db<StepAverageLatenciesTable>("step_average_latencies")
      .select("step_id")
      .select(db.raw("DATE_TRUNC('month', \"start_time\") AS start_time"))
      .avg("average AS average")
      .whereIn("step_id", stepIds)
      .whereBetween("start_time", [startTime, endTime])
      .groupBy(db.raw("step_id, DATE_TRUNC('month', \"start_time\")"))
      .orderBy(["start_time", "step_id"]);
    return rows;
  } catch (err) {
    console.log(`Error gettting step latency between times: ${err}`);
    return [];
  }
};

const insertStepAverageLatencies = async (
  rows: StepAverageLatenciesTable[]
): Promise<void> => {
  try {
    await db<StepAverageLatenciesTable>("step_average_latencies").insert(rows);
  } catch (err) {
    console.log(`Error inserting rows into Step Averge Latencies: ${err}`);
  }
};

const updateStepAverageLatency = async (
  latencyId: number,
  average: number,
  executions: number
): Promise<void> => {
  try {
    await db<StepAverageLatenciesTable>("step_average_latencies")
      .update({ average, executions })
      .where("latency_id", latencyId);
  } catch (err) {
    console.log(`Error updating row in step average latencies: ${err}`);
  }
};

const stepAverageLatenciesModel = {
  getHourlyLatenciesBetweenTimes,
  getDailyLatencyAveragesBetweenTimes,
  getWeeklyLatencyAveragesBetweenTimes,
  getMonthlyLatencyAveragesBetweenTimes,
  insertStepAverageLatencies,
  updateStepAverageLatency,
};

export default stepAverageLatenciesModel;
