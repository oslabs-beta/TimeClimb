import type { Request, Response, NextFunction } from "express";
import averageLatenciesModel from "../../models/averageLatenciesModel";
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
      await averageLatenciesModel.getStepFunctionLatencies(
        Number(step_function_id),
        startTime.toISOString(),
        endTime.toISOString()
      );

    const stepRows: StepsByStepFunctionId[] =
      await stepsModel.getStepsByStepFunctionId(Number(step_function_id));

    const stepIds: number[] = stepRows.map((row) => row.step_id);

    const stepAverageLatencyRows: StepAverageLatencies[] =
      await stepAverageLatenciesModel.getLatenciesBetweenTimes(
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
      await averageLatenciesModel.getStepFunctionLatenciesDaily(
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
      await averageLatenciesModel.getStepFunctionLatenciesWeekly(
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
      await averageLatenciesModel.getStepFunctionLatenciesMonthly(
        Number(step_function_id),
        startTime.toISOString(),
        endTime.toISOString()
      );

    const stepRows = await stepsModel.getStepsByStepFunctionId(
      Number(step_function_id)
    );
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
    return next(err);
  }
};

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
  console.log("sfLatenciesByTime", sfLatenciesByTime);

  const stepIdsByName = {};
  const stepNamesById = {};
  stepRows.forEach((row) => {
    stepIdsByName[row.name] = row.step_id;
    stepNamesById[row.step_id] = row.name;
  });

  // turn the array of rows into objects with keys of start time for quick
  // lookup
  const stepsLatenciesByTime = await makeStepAverageLatenciesByTimeObject(
    stepLatencyRows,
    stepNamesById
  );

  console.log("stepsLatenciesByTime", stepsLatenciesByTime);

  const latenciesArray: AverageLatenciesResponse[] = [];
  let count = 0;
  // loop through dates by hour using moment
  for (
    const startClone = startTime.clone();
    startClone.isBefore(endTime);
    startClone.add(1, timePeriod)
  ) {
    console.log(startClone.toISOString());
    console.log("count", ++count);
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
          console.log("data", data);
        } else {
          data.steps[name] = {};
        }
      }
      latenciesArray.push(data);
    } else {
      latenciesArray.push({});
    }
  }
  return latenciesArray;
};

const makeSFAverageLatenciesByTimeObject = async (
  averageLatencies: AverageLatencies[]
): Promise<SFLatenciesByTime> => {
  const sfLatenciesByTimeObject = {};
  averageLatencies.forEach((row) => {
    console.log("row", row);
    sfLatenciesByTimeObject[moment(row.start_time).toISOString()] = {
      average: row.average,
    };
  });
  return sfLatenciesByTimeObject;
};

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
  // methods in here
  getAverageLatencies,
  getAverageLatenciesDaily,
  getAverageLatenciesWeekly,
  getAverageLatenciesMonthly,
};

export default averageLatenciesApiController;
