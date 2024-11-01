import db from "./db";
import type {
  TrackerStepFunctionsJoinTable,
  StepFunctionsTable,
  StepFunctionTrackersTable,
  NewTrackerRowResult,
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

const getTrackerDataWithName = async (
  trackerId: number
): Promise<TrackerStepFunctionsJoinTable[]> => {
  try {
    const rows: TrackerStepFunctionsJoinTable[] =
      await db<StepFunctionTrackersTable>("step_function_trackers as t")
        .join<StepFunctionsTable>(
          "step_functions as sf",
          "sf.step_function_id",
          "t.step_function_id"
        )
        .select("t.*", "sf.name")
        .where("tracker_id", trackerId);
    return rows;
  } catch (err) {
    console.log("Error getting tracker data:", err);
  }
};

/**
 * Updates a tracker table newest_execution_time column to a new date.
 * The query is structured to only update if the date is greater than the
 * existing date.  In knex, we used a function within "andWhere" in order to
 * also correctly deal with null values if this is the first time the tracker
 * has been run.
 * @param trackerId Database primary key of the tracker row
 * @param newTime The time to update the row with
 * @returns Number of rows updated
 */
const updateNewestExecutionTime = async (
  trackerId: number,
  newTime: string
): Promise<number> => {
  try {
    const numberOfRows = db<StepFunctionTrackersTable>("step_function_trackers")
      .update({ newest_execution_time: newTime })
      .where("tracker_id", trackerId)
      .andWhere(function () {
        this.where("newest_execution_time", "<", newTime).orWhereNull(
          "newest_execution_time"
        );
      });
    return numberOfRows;
  } catch (err) {
    console.log(`Error updating newest exec time in tracker table: ${err}`);
  }
};

/**
 * Updates a tracker table oldest_execution_time column to a new date.
 * The query is structured to only update if the date is less than the
 * existing date.  In knex, we used a function within "andWhere" in order to
 * also correctly deal with null values if this is the first time the tracker
 * has been run.
 * @param trackerId Database primary key of the tracker row
 * @param newTime The time to update the row with
 * @returns Number of rows updated
 */
const updateOldestExecutionTime = async (
  trackerId: number,
  newTime: string
): Promise<number> => {
  try {
    const numberOfRows = db<StepFunctionTrackersTable>("step_function_trackers")
      .update({ oldest_execution_time: newTime })
      .where("tracker_id", trackerId)
      .andWhere(function () {
        this.where("oldest_execution_time", ">", newTime).orWhereNull(
          "oldest_execution_time"
        );
      });
    return numberOfRows;
  } catch (err) {
    console.log(`Error updating newest exec time in tracker table: ${err}`);
  }
};

const insertTracker = async (
  row: StepFunctionTrackersTable
): Promise<NewTrackerRowResult> => {
  try {
    const [rowInserted]: NewTrackerRowResult[] =
      await db<StepFunctionTrackersTable>("step_function_trackers")
        .insert(row)
        .returning("tracker_id");
    return rowInserted;
  } catch (err) {
    console.log(`Error inserting tracker ${err}`);
  }
};

const stepFunctionTrackersModel = {
  getAllTrackerDataWithNames,
  getTrackerDataWithName,
  updateNewestExecutionTime,
  updateOldestExecutionTime,
  insertTracker,
};

export default stepFunctionTrackersModel;
