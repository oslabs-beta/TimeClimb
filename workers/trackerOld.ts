import moment, { Moment } from "moment";
import stepFunctionTrackersModel from "../server/models/stepFunctionTrackersModel";
import { TrackerStepFunctionsJoinTable } from "../server/models/types";
import { Tracker } from "./Tracker";

const updateTrackerTimes = async (
  tracker: Tracker,
  startTime: Moment,
  endTime: Moment
) => {
  if (
    tracker.trackerDbRow.newest_execution_time === null ||
    moment(tracker.trackerDbRow.newest_execution_time).isBefore(endTime)
  ) {
    const updatedRows =
      await stepFunctionTrackersModel.updateNewestExecutionTime(
        tracker.trackerDbRow.tracker_id,
        endTime.toISOString()
      );
    console.log("updated this many new date rows", updatedRows);
  }

  if (
    tracker.trackerDbRow.oldest_execution_time === null ||
    moment(tracker.trackerDbRow.oldest_execution_time).isAfter(startTime)
  ) {
    const updatedRows =
      await stepFunctionTrackersModel.updateOldestExecutionTime(
        tracker.trackerDbRow.tracker_id,
        startTime.toISOString()
      );
    console.log("updated this many old date rows", updatedRows);
  }
};

const trackerFunctions = {
  updateTrackerTimes,
};

export default trackerFunctions;
