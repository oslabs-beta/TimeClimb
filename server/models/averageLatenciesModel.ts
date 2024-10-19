import db from "./db";
import moment from "moment";
import { StepFunctionAverageLatenciesTable } from "./types";

//hourly latencies
const getStepFunctionLatencies = async (
  step_function_id: number,
  start_time: string,
  end_time: string
) => {
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
const getStepFunctionLatenciesDaily;




const averageLatenciesModel = {
  // methods
  getStepFunctionLatencies,
  getStepFunctionLatenciesDaily,
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
