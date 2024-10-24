import db from "./db";
import type { StepFunctionsTable, StepFunctionTrackersTable } from "./types";

const getAllTrackerDataWithNames = async (): Promise<
  StepFunctionTrackersTable[]
> => {
  try {
    const rows = await db<StepFunctionTrackersTable>(
      "step_function_trackers as t"
    )
      .join<StepFunctionsTable>(
        "step_functions as sf",
        "sf.step_function_id",
        "t.step_function_id"
      )
      .select("t.*", "sf.step_function_id");
    return rows;
  } catch (err) {
    console.log("Error getting tracker data:", err);
  }
};

const stepFunctionTrackersModel = {
  getAllTrackerDataWithNames,
};

export default stepFunctionTrackersModel;
