import type { Request, Response, NextFunction } from "express";
import stepFunctionAverageLatenciesModel from "../../models/stepFunctionAverageLatenciesModel";
import stepsModel from "../../models/stepsModel";
import stepAverageLatenciesModel from "../../models/stepAverageLatenciesModel";
import moment, { Moment } from "moment";
import type {
  SFLatenciesByTime,
  StepLatenciesByTime,
  TimePeriod,
  AverageLatenciesResponse,
} from "../../types/types";
import type {
  AverageLatencies,
  StepsByStepFunctionId,
  StepAverageLatencies,
  LatenciesObj,
} from "../../models/types";

const getAverageLatencies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { step_function_id } = req.params;
    const { isoStartTime, isoEndTime } = req.query;

    let startTime: Moment;
    let endTime: Moment;
    if (isoStartTime !== undefined) {
      startTime = moment(String(isoStartTime)).startOf("hour");
    } else {
      startTime = moment().startOf("day");
    }

    if (isoEndTime !== undefined) {
      endTime = moment(String(isoEndTime)).endOf("hour");
    } else {
      endTime = moment().endOf("day");
    }

    const sfAverageLatencyRows: AverageLatencies[] =
      await stepFunctionAverageLatenciesModel.getStepFunctionLatencies(
        Number(step_function_id),
        startTime.toISOString(),
        endTime.toISOString()
      );

    const stepRows: StepsByStepFunctionId[] =
      await stepsModel.getStepsByStepFunctionId(Number(step_function_id));

    const stepIds: number[] = stepRows.map((row) => row.step_id);

    const stepAverageLatencyRows: StepAverageLatencies[] =
      await stepAverageLatenciesModel.getHourlyLatenciesBetweenTimes(
        stepIds,
        startTime.toISOString(),
        endTime.toISOString()
      );

    const averageLatenciesResponse = await makeResponseObject(
      sfAverageLatencyRows,
      stepAverageLatencyRows,
      stepRows,
      "hours",
      startTime,
      endTime
    );

    res.locals.latencyAverages = averageLatenciesResponse;
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const getAverageLatenciesDaily = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { step_function_id } = req.params;
    const startTime = moment().subtract(6, "day").startOf("day");
    const endTime = moment().endOf("day"); //includes current day in request

    const dailyStepFunctionLatencies: AverageLatencies[] =
      await stepFunctionAverageLatenciesModel.getStepFunctionLatenciesDaily(
        Number(step_function_id),
        startTime.toISOString(),
        endTime.toISOString()
      );

    const stepRows: StepsByStepFunctionId[] =
      await stepsModel.getStepsByStepFunctionId(Number(step_function_id));

    const stepIDs: number[] = stepRows.map((step) => step.step_id);

    const stepLatencies: StepAverageLatencies[] =
      await stepAverageLatenciesModel.getDailyLatencyAveragesBetweenTimes(
        stepIDs,
        startTime.toISOString(),
        endTime.toISOString()
      );

    const averageLatenciesResponse = await makeResponseObject(
      dailyStepFunctionLatencies,
      stepLatencies,
      stepRows,
      "days",
      startTime,
      endTime
    );

    res.locals.dailyAvgs = averageLatenciesResponse;
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const getAverageLatenciesWeekly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { step_function_id } = req.params;
    const startTime = moment()
      .startOf("week")
      .add(1, "days")
      .subtract(11, "week");
    const endTime = moment().endOf("day"); //includes current day in request

    const weeklyStepFunctionLatencies: AverageLatencies[] =
      await stepFunctionAverageLatenciesModel.getStepFunctionLatenciesWeekly(
        Number(step_function_id),
        startTime.toISOString(),
        endTime.toISOString()
      );

    const stepRows: StepsByStepFunctionId[] =
      await stepsModel.getStepsByStepFunctionId(Number(step_function_id));

    const stepIDs: number[] = stepRows.map((step) => step.step_id);

    const weeklyStepLatencies: StepAverageLatencies[] =
      await stepAverageLatenciesModel.getWeeklyLatencyAveragesBetweenTimes(
        stepIDs,
        startTime.toISOString(),
        endTime.toISOString()
      );

    const averageLatenciesResponse = await makeResponseObject(
      weeklyStepFunctionLatencies,
      weeklyStepLatencies,
      stepRows,
      "weeks",
      startTime,
      endTime
    );

    res.locals.weeklyAvgs = averageLatenciesResponse;
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

const getAverageLatenciesMonthly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { step_function_id } = req.params;
    const startTime = moment().subtract(11, "month").startOf("month");
    const endTime = moment().endOf("month");

    const monthlyStepFunctionLatencies: AverageLatencies[] =
      await stepFunctionAverageLatenciesModel.getStepFunctionLatenciesMonthly(
        Number(step_function_id),
        startTime.toISOString(),
        endTime.toISOString()
      );

    const stepRows: StepsByStepFunctionId[] =
      await stepsModel.getStepsByStepFunctionId(Number(step_function_id));
    const stepIDs = stepRows.map((step) => step.step_id);

    const monthlyStepLatencies: StepAverageLatencies[] =
      await stepAverageLatenciesModel.getMonthlyLatencyAveragesBetweenTimes(
        stepIDs,
        startTime.toISOString(),
        endTime.toISOString()
      );

    const averageLatenciesResponse = await makeResponseObject(
      monthlyStepFunctionLatencies,
      monthlyStepLatencies,
      stepRows,
      "months",
      startTime,
      endTime
    );

    res.locals.monthlyAvgs = averageLatenciesResponse;
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

/**
 * Creates the formatted json object from the database data retreived by
 * appropriate queries.
 * @param sfLatencyRows Step Function Average Latencey rows of data returned
 * from the database
 * @param stepLatencyRows Step Average Latency rows of data returned from the
 * database
 * @param stepRows Rows of steps from the database that belong to this step
 * function
 * @param timePeriod Granularity of the data requested, such as hours, days,
 * weeks, or months
 * @param startTime Start time of the data requested, with full date and time
 * with timezone
 * @param endTime Start time of the data requested, with full date and time with
 * timezone
 * @returns Array of Average Latencies Objects in form the client can consume
 */
const makeResponseObject = async (
  sfLatencyRows: AverageLatencies[],
  stepLatencyRows: StepAverageLatencies[],
  stepRows: StepsByStepFunctionId[],
  timePeriod: TimePeriod,
  startTime: Moment,
  endTime: Moment
): Promise<AverageLatenciesResponse[]> => {
  // turn the array or rows into an object with keys of start time
  const sfLatenciesByTime = await makeSFAverageLatenciesByTimeObject(
    sfLatencyRows
  );

  // two different ways to access data quickly by keys to reduce iteration
  const stepIdsByName = {};
  const stepNamesById = {};
  stepRows.forEach((row) => {
    stepIdsByName[row.name] = row.step_id;
    stepNamesById[row.step_id] = row.name;
  });

  // turns array of rows into objects with keys of start time for quick access
  const stepsLatenciesByTime = await makeStepAverageLatenciesByTimeObject(
    stepLatencyRows,
    stepNamesById
  );

  const latenciesArray: AverageLatenciesResponse[] = [];

  // loop through dates by time period using moment, as the dates can change
  for (
    const startClone = startTime.clone();
    startClone.isBefore(endTime);
    startClone.add(1, timePeriod)
  ) {
    const sfData = sfLatenciesByTime[startClone.toISOString()];
    if (sfData) {
      const data: LatenciesObj = {
        date: startClone.toISOString(),
        stepFunctionAverageLatency: sfData.average,
        steps: {},
      };

      for (const name in stepIdsByName) {
        if (stepsLatenciesByTime[name + startClone.toISOString()]) {
          data.steps[name] = {
            average:
              stepsLatenciesByTime[name + startClone.toISOString()].average,
          };
        } else {
          data.steps[name] = {}; //return empty object if no data for this time
        }
      }
      latenciesArray.push(data);
    } else {
      latenciesArray.push({}); //return empty object if no data for this time
    }
  }
  return latenciesArray;
};

/**
 * Turn array of data into object with keys as timestamps for faster lookup
 * @param averageLatencies Rows of database data containing average latencies
 * for the overall step function
 * @returns Promise of SFLatenciesByTime object, where data can be accessed by
 * date keys for faster iteration in the future
 */
const makeSFAverageLatenciesByTimeObject = async (
  averageLatencies: AverageLatencies[]
): Promise<SFLatenciesByTime> => {
  const sfLatenciesByTimeObject = {};
  averageLatencies.forEach((row) => {
    sfLatenciesByTimeObject[moment(row.start_time).toISOString()] = {
      average: row.average,
    };
  });
  return sfLatenciesByTimeObject;
};

/**
 * Turns array of step data into object with timestamps as keys for faster
 * access.  Keys are actually step names concatenated with timestamps to make
 * them unique.
 * @param stepLatencyRows Rows of step average latency data as returned from
 * the database
 * @param stepNamesById Object to lookup step names using their ids as keys
 * @returns Promise of StepLatenceiesBy time object, where data can be accessed
 * by step names combined with times for faster access.
 */
const makeStepAverageLatenciesByTimeObject = async (
  stepLatencyRows: StepAverageLatencies[],
  stepNamesById: object
): Promise<StepLatenciesByTime> => {
  const stepLatenciesByTimeObject: StepLatenciesByTime = {};
  stepLatencyRows.forEach((row) => {
    stepLatenciesByTimeObject[
      stepNamesById[row.step_id] + moment(row.start_time).toISOString()
    ] = {
      stepId: row.step_id,
      average: row.average,
    };
  });
  return stepLatenciesByTimeObject;
};

const averageLatenciesApiController = {
  getAverageLatencies,
  getAverageLatenciesDaily,
  getAverageLatenciesWeekly,
  getAverageLatenciesMonthly,
};

export default averageLatenciesApiController;
