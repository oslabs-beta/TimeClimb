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
 * Creates a Tracker object to hold data needed to queue logs for processing
 * @param stepFunction StepFunction object to attach to this tracker
 * @param trackerDbRow Rows of data received from the database related to this
 * tracker
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
  /**
   * Removes the ending ':*' characters from the log if they are present.
   * Also reads the log group name from the arn and stores it on the object.
   * @param this Tracker object
   * @param logGroupArn The full raw log group arn
   * @returns undefined
   */
  setLogGroup(this: Tracker, logGroupArn: string): void {
    if (logGroupArn.endsWith(":*")) logGroupArn = logGroupArn.slice(0, -2);
    this.logGroupArn = logGroupArn;
    this.logGroupName = logGroupArn.split("log-group:")[1];
    return;
  },
  /**
   * Splits the logs to scan up into segments. Produces only one segment.
   * Also stores the current time period to begin processing logs.
   * @param this Tracker object
   * @returns undefined
   */
  setTimeSegments(this: Tracker): void {
    if (
      this.trackerDbRow.newest_execution_time === null &&
      this.trackerDbRow.oldest_execution_time === null
    ) {
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
  },
  /**
   * Subtracts an hour from the current time object properties
   * @param this Tracker object
   * @returns Promise<void>
   */
  async decrementCurrentTimes(this: Tracker): Promise<void> {
    this.currentEndTime.subtract(1, "hour");
    this.currentStartTime.subtract(1, "hour");
    return;
  },
  /**
   * Tests to see if the tracker has processed all within the time stegment
   * @param this Tracker object
   * @returns true | false
   */
  async isFinished(this: Tracker): Promise<boolean> {
    if (this.currentStartTime.isBefore(this.timeSegment[0].startTime)) {
      return true;
    }
    return false;
  },
  /**
   * Updates the tracker table in the database with the newest and oldest logs
   * scanned if appropriate.
   * @param this Tracker object
   * @param startTime Moment object for the oldest update
   * @param endTime Moment object for the newest update
   */
  async updateTrackerTimes(
    this: Tracker,
    startTime: Moment,
    endTime: Moment
  ): Promise<void> {
    if (
      this.trackerDbRow.newest_execution_time === null ||
      moment(this.trackerDbRow.newest_execution_time).isBefore(endTime)
    ) {
      await stepFunctionTrackersModel.updateNewestExecutionTime(
        this.trackerDbRow.tracker_id,
        endTime.toISOString()
      );
    }

    if (
      this.trackerDbRow.oldest_execution_time === null ||
      moment(this.trackerDbRow.oldest_execution_time).isAfter(startTime)
    ) {
      await stepFunctionTrackersModel.updateOldestExecutionTime(
        this.trackerDbRow.tracker_id,
        startTime.toISOString()
      );
    }
  },
};
