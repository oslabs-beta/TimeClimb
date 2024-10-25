import db from "./db";
import type {
  TrackerStepFunctionsJoinTable,
  StepFunctionsTable,
  StepFunctionTrackersTable,
} from "./types";

const getAllTrackerDataWithNames = async (): Promise<
  TrackerStepFunctionsJoinTable[]
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
      .select("t.*", "sf.name");
    return rows;
  } catch (err) {
    console.log("Error getting tracker data:", err);
  }
};

const stepFunctionTrackersModel = {
  getAllTrackerDataWithNames,
};

export default stepFunctionTrackersModel;
