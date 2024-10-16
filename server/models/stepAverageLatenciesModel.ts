import db from "./db";
import type { StepAverageLatenciesTable } from "./types";

const getLatenciesBetweenTimes = async (
  stepIds: number[],
  startTime: string,
  endTime: string
) => {
  try {
    const rows = await db<StepAverageLatenciesTable>("step_average_latencies")
      .select("step_id", "average", "start_time")
      .whereIn("step_id", stepIds)
      .whereBetween("start_time", [startTime, endTime])
      // .groupBy(["step_id", "start_time", "average"])
      .orderBy(["start_time", "step_id"]);
    return rows;
  } catch (err) {
    console.log(`Error getting step lantency data between times: ${err}`);
  }
};

const stepAverageLatenciesModel = {
  getLatenciesBetweenTimes,
};

export default stepAverageLatenciesModel;
