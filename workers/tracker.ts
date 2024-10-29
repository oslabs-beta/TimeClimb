import moment, { Moment } from "moment";
import stepFunctionTrackersModel from "../server/models/stepFunctionTrackersModel";
import { TrackerStepFunctionsJoinTable } from "../server/models/types";
import { StepFunction } from "./StepFunction";

type TimeSegment = {
  startTime: Moment;
  endTime: Moment;
  isComplete?: boolean;
};

export type Tracker = {
  trackerDbRow: TrackerStepFunctionsJoinTable;
  stepFunction: StepFunction;
  logGroupArn: string;
  logGroupName: string;
  logGroupRegion: string;
  logStreamNamePrefix: string;
  currentStartTime: Moment;
  currentEndTime: Moment;
  timeSegment: TimeSegment[];
  nextToken: string | undefined;
  setTimeSegments: (this: Tracker) => void;
  setLogGroup: (this: Tracker, logGroupArn: string) => void;
  decrementCurrentTimes: (this: Tracker) => Promise<void>;
  isFinished: (this: Tracker) => Promise<boolean>;
  updateTrackerTimes: (
    this: Tracker,
    startTime: Moment,
    endTime: Moment
  ) => Promise<void>;
};

/**
 *
 * @param stepFunction StepFunction object to attach to this tracker
 * @param trackerDbRow Rows of information
 * @returns
 */
export function createTracker(
  stepFunction: StepFunction,
  trackerDbRow: TrackerStepFunctionsJoinTable
) {
  const tracker = Object.create(trackerPrototype);
  tracker.trackerDbRow = trackerDbRow;
  tracker.stepFunction = stepFunction;
  tracker.setLogGroup(trackerDbRow.log_group_arn);
  tracker.logGroupRegion = trackerDbRow.log_group_arn.split(":")[3];
  tracker.logStreamNamePrefix = `states/${trackerDbRow?.name}`;
  tracker.setTimeSegments();
  tracker.nextToken = undefined;

  return tracker;
}

const trackerPrototype = {
  setLogGroup(this: Tracker, logGroupArn: string): void {
    if (logGroupArn.endsWith(":*")) logGroupArn = logGroupArn.slice(0, -2);
    this.logGroupArn = logGroupArn;
    this.logGroupName = logGroupArn.split("log-group:")[1];
    return;
  },
  setTimeSegments(this: Tracker) {
    if (
      this.trackerDbRow.newest_execution_time === null &&
      this.trackerDbRow.oldest_execution_time === null
    ) {
      console.log("this");
      this.timeSegment = [
        {
          startTime: moment(this.trackerDbRow.tracker_start_time).utc(),
          endTime: moment().subtract(2, "hours").endOf("hour").utc(),
        },
      ];

      this.currentStartTime = moment()
        .subtract(2, "hours")
        .startOf("hour")
        .utc();
      this.currentEndTime = moment().subtract(2, "hours").endOf("hour").utc();
    } else {
      console.log("that");
      this.timeSegment = [
        {
          startTime: moment(this.trackerDbRow.newest_execution_time).utc(),
          endTime: moment().subtract(2, "hours").endOf("hour").utc(),
        },
      ];
      this.currentStartTime = moment()
        .subtract(2, "hours")
        .startOf("hour")
        .utc();
      this.currentEndTime = moment().subtract(2, "hours").endOf("hour").utc();
    }
    console.log("this.timeSegment", this.timeSegment);
  },
  async decrementCurrentTimes(this: Tracker) {
    this.currentEndTime.subtract(1, "hour");
    this.currentStartTime.subtract(1, "hour");
  },
  async isFinished(this: Tracker): Promise<boolean> {
    if (this.currentStartTime.isBefore(this.timeSegment[0].startTime)) {
      console.log("we think its finished?");
      return true;
    }
    console.log("we think its NOT finished?");
    return false;
  },
  async updateTrackerTimes(
    this: Tracker,
    startTime: Moment,
    endTime: Moment
  ): Promise<void> {
    if (
      this.trackerDbRow.newest_execution_time === null ||
      moment(this.trackerDbRow.newest_execution_time).isBefore(endTime)
    ) {
      const updatedRows =
        await stepFunctionTrackersModel.updateNewestExecutionTime(
          this.trackerDbRow.tracker_id,
          endTime.toISOString()
        );
      console.log("updated this many new date rows", updatedRows);
    }

    if (
      this.trackerDbRow.oldest_execution_time === null ||
      moment(this.trackerDbRow.oldest_execution_time).isAfter(startTime)
    ) {
      const updatedRows =
        await stepFunctionTrackersModel.updateOldestExecutionTime(
          this.trackerDbRow.tracker_id,
          startTime.toISOString()
        );
      console.log("updated this many old date rows", updatedRows);
    }
  },
};
