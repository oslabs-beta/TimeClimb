import moment, { Moment } from "moment";
import stepFunctionTrackersModel from "../server/models/stepFunctionTrackersModel";
import { TrackerStepFunctionsJoinTable } from "../server/models/types";

const updateTrackerTimes = async (
  trackerDbRow: TrackerStepFunctionsJoinTable,
  startTime: Moment,
  endTime: Moment
) => {
  if (
    trackerDbRow.newest_execution_time === null ||
    moment(trackerDbRow.newest_execution_time).isBefore(endTime)
  ) {
    const updatedRows =
      await stepFunctionTrackersModel.updateNewestExecutionTime(
        trackerDbRow.tracker_id,
        endTime.toISOString()
      );
    console.log("updated this many new date rows", updatedRows);
  }

  if (
    trackerDbRow.oldest_execution_time === null ||
    moment(trackerDbRow.oldest_execution_time).isAfter(startTime)
  ) {
    const updatedRows =
      await stepFunctionTrackersModel.updateOldestExecutionTime(
        trackerDbRow.tracker_id,
        startTime.toISOString()
      );
    console.log("updated this many old date rows", updatedRows);
  }
};

const tracker = {
  updateTrackerTimes,
};

export default tracker;
