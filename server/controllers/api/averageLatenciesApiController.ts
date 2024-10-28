import type { Request, Response, NextFunction } from "express";
import averageLatenciesModel from "../../models/averageLatenciesModel";
import stepsModel from "../../models/stepsModel";
import stepAverageLatenciesModel from "../../models/stepAverageLatenciesModel";
import moment from "moment";

import type {
  AverageLatencies,
  StepsByStepFunctionId,
  StepAverageLatencies,
  LatenciesObj,
} from "../../models/types";
import { start } from "repl";

const getAverageLatencies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { step_function_id } = req.params;
    const startTime = moment().startOf("day");
    const endTime = moment().endOf("day");

    const averageLatencies: AverageLatencies[] =
      await averageLatenciesModel.getStepFunctionLatencies(
        Number(step_function_id),
        startTime.toISOString(),
        endTime.toISOString()
      );

    interface FunctionAverageLatenciesObject {
      [key: string]: {
        stepFunctionId: number;
        average: number;
        executions?: number;
      };
    }
    // turn the array or rows into an object with keys of start time
    const functionAverageLatenciesObject: FunctionAverageLatenciesObject = {};
    averageLatencies.forEach((row) => {
      functionAverageLatenciesObject[moment(row.start_time).toISOString()] = {
        stepFunctionId: row.step_function_id,
        average: row.average,
      };
    });
    console.log(
      "functionAverageLatenciesObject",
      functionAverageLatenciesObject
    );
    const stepRows: StepsByStepFunctionId[] =
      await stepsModel.getStepsByStepFunctionId(Number(step_function_id));

    const stepIds: number[] = stepRows.map((row) => row.step_id);

    const stepIdsByName = {};
    const stepNamesById = {};
    stepRows.forEach((row) => {
      stepIdsByName[row.name] = row.step_id;
      stepNamesById[row.step_id] = row.name;
    });

    const stepAverageLatenciesRows: StepAverageLatencies[] =
      await stepAverageLatenciesModel.getLatenciesBetweenTimes(
        stepIds,
        startTime.toISOString(),
        endTime.toISOString()
      );

    interface StepAverageLatenciesObject {
      [key: string]: {
        stepId?: number;
        average?: number;
        executions?: number;
      };
    }
    // turn the array of rows into objects with keys of start time for quick
    // lookup
    const stepAverageLatenciesObject: StepAverageLatenciesObject = {};
    stepAverageLatenciesRows.forEach((row) => {
      stepAverageLatenciesObject[
        stepNamesById[row.step_id] + moment(row.start_time).toISOString()
      ] = {
        stepId: row.step_id,
        average: row.average,
      };
    });

    const latenciesArray = [];
    let stepFunctionIndex = 0;
    let count = 0;
    // loop through dates by hour using moment
    for (
      const startClone = startTime.clone();
      startClone.isBefore(endTime);
      startClone.add(1, "hour")
    ) {
      console.log(startClone.toISOString());
      console.log("count", ++count);
      const functionObject =
        functionAverageLatenciesObject[startClone.toISOString()];
      if (functionObject) {
        console.log("functionObject truthy", functionObject);
        const data: LatenciesObj = {
          date: startClone.toISOString(),
          stepFunctionAverageLatency: functionObject.average,
          steps: {},
        };

        for (const name in stepIdsByName) {
          if (stepAverageLatenciesObject[name + startClone.toISOString()]) {
            data.steps[name] = {
              average:
                stepAverageLatenciesObject[name + startClone.toISOString()]
                  .average,
            };
          } else {
            data.steps[name] = {};
          }
        }

        latenciesArray.push(data);
      } else {
        latenciesArray.push({});
      }
    }

    // for (let i = 0; i < stepAverageLatencies.length; i += stepIds.length) {
    //   const hourLatencies: LatenciesObj = {
    //     date: averageLatencies[stepFunctionIndex].start_time,
    //     stepFunctionAverageLatency: averageLatencies[stepFunctionIndex].average,
    //     steps: {},
    //   };

    //   for (let j = 0; j < stepIds.length; j++) {
    //     hourLatencies.steps[stepRows[j].name] = {
    //       average: stepAverageLatencies[i + j].average,
    //     };
    //   }
    //   stepFunctionIndex++;
    //   latenciesArray.push(hourLatencies);
    // }

    //console.log("latenciesArray", JSON.stringify(latenciesArray, null, 2));
    // console.log("latenciesArray", latenciesArray.length);

    res.locals.latencyAverages = latenciesArray;
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
    const start_time = moment().subtract(6, "day").startOf("day");

    const allAvgLatencies = [];
    const end_time = moment().endOf("day"); //includes current day in request
    const dailyStepFunctionLatencies: AverageLatencies[] =
      await averageLatenciesModel.getStepFunctionLatenciesDaily(
        Number(step_function_id),
        start_time.toISOString(),
        end_time.toISOString()
      );
    // console.log("daily latencies", dailyStepFunctionLatencies)
    //iterate through 7 days

    //  console.log(allAvgLatencies)
    //get step averages for all steps within function
    const stepRows: StepsByStepFunctionId[] =
      await stepsModel.getStepsByStepFunctionId(Number(step_function_id));
    const stepNames = {};
    stepRows.forEach((el) => (stepNames[el.step_id] = el.name));
    //create array of the id's of each step in function
    const stepIDs: number[] = stepRows.map((step) => step.step_id);
    //create array of all step latencies from the last week
    const stepLatencies: StepAverageLatencies[] =
      await stepAverageLatenciesModel.getDailyLatencyAveragesBetweenTimes(
        stepIDs,
        start_time.toISOString(),
        end_time.toISOString()
      );

    let currentDay = moment(start_time);
    for (let i = 6; i >= 0; i--) {
      const [currentDate] = dailyStepFunctionLatencies.filter((day) => {
        //  console.log('day.start_time:', day.start_time.toISOString())
        // console.log('currentDay:', typeof currentDay)
        return day.start_time.toISOString() === currentDay.utc().toISOString();
      });

      if (currentDate) {
        const currentDateSteps = stepLatencies.filter((step) => {
          console.log("step.start_time", step.start_time.toISOString());
          console.log("currentDay", currentDay.utc().toISOString());
          return (
            step.start_time.toISOString() === currentDay.utc().toISOString()
          );
        });
        console.log(currentDateSteps);
        const dailyLatencies: LatenciesObj = {
          date: currentDate.start_time,
          stepFunctionAverageLatency: currentDate.average,
          steps: {},
        };
        for (const step of currentDateSteps) {
          dailyLatencies.steps[stepNames[step.step_id]] = {
            average: step.average,
          };
        }
        allAvgLatencies.push(dailyLatencies);
      } else {
        allAvgLatencies.push({});
      }
      currentDay = currentDay.add(1, "day");
    }
    res.locals.dailyAvgs = allAvgLatencies;

    return next();
  } catch (err) {
    return next(err);
  }
};
//  const allAvgLatencies = [];
// let stepFunctionIndex = 0;
// console.log("rows:", rows)
//iterate through all step latencies from the last week
// for(let i = 0; i < rows.length; i += stepIDs.length){
//   const dailyLatencies:LatenciesObj = {
//     date: dailyStepFunctionLatencies[stepFunctionIndex].start_time,
//     stepFunctionAverageLatency: dailyStepFunctionLatencies[stepFunctionIndex].average,
//     steps: {}
//   };
//     //for each step in this function, add it's averages to dailyLatencies
//     for(let j = 0; j < stepIDs.length; j++){
//       dailyLatencies.steps[stepRows[j].name] = {
//         average : rows[i + j].average
//       }
//     }
//     stepFunctionIndex++;
//     allAvgLatencies.push(dailyLatencies)
//    // console.log(allAvgLatencies.length)
// }

const getAverageLatenciesWeekly = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { step_function_id } = req.params;
    const start_time = moment().subtract(10, "week").startOf("week");
    const end_time = moment().endOf("day"); //includes current day in request
    const weeklyStepFunctionLatencies: AverageLatencies[] =
      await averageLatenciesModel.getStepFunctionLatenciesWeekly(
        Number(step_function_id),
        start_time.toISOString(),
        end_time.toISOString()
      );
    // console.log(weeklyStepFunctionLatencies)
    const stepRows: StepsByStepFunctionId[] =
      await stepsModel.getStepsByStepFunctionId(Number(step_function_id));
    // console.log('ids', stepRows)
    const stepIDs: number[] = stepRows.map((step) => step.step_id);
    const rows: StepAverageLatencies[] =
      await stepAverageLatenciesModel.getWeeklyLatencyAveragesBetweenTimes(
        stepIDs,
        start_time.toISOString(),
        end_time.toISOString()
      );
    const allAvgLatencies = [];
    let stepFunctionIndex = 0;
    for (let i = 0; i < rows.length; i += stepIDs.length) {
      const weeklyLatencies: LatenciesObj = {
        date: weeklyStepFunctionLatencies[stepFunctionIndex].start_time,
        stepFunctionAverageLatency:
          weeklyStepFunctionLatencies[stepFunctionIndex].average,
        steps: {},
      };
      for (let j = 0; j < stepIDs.length; j++) {
        weeklyLatencies.steps[stepRows[j].name] = {
          average: rows[i + j].average,
        };
      }
      stepFunctionIndex++;
      allAvgLatencies.push(weeklyLatencies);
    }
    console.log("weekly:", allAvgLatencies.length);
    res.locals.weeklyAvgs = allAvgLatencies;
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
    const start_time = moment().subtract(11, "month").startOf("month");
    const end_time = moment().endOf("month");
    const monthlyStepFunctionLatencies: AverageLatencies[] =
      await averageLatenciesModel.getStepFunctionLatenciesMonthly(
        Number(step_function_id),
        start_time.toISOString(),
        end_time.toISOString()
      );
    const stepRows = await stepsModel.getStepsByStepFunctionId(
      Number(step_function_id)
    );
    const stepIDs = stepRows.map((step) => step.step_id);
    const rows =
      await stepAverageLatenciesModel.getMonthlyLatencyAveragesBetweenTimes(
        stepIDs,
        start_time.toISOString(),
        end_time.toISOString()
      );
    const allAvgLatencies = [];
    let stepFunctionIndex = 0;
    for (let i = 0; i < rows.length; i += stepIDs.length) {
      const monthlyLatencies = {
        date: monthlyStepFunctionLatencies[stepFunctionIndex].start_time,
        stepFunctionAverageLatency:
          monthlyStepFunctionLatencies[stepFunctionIndex].average,
        steps: {},
      };
      for (let j = 0; j < stepIDs.length; j++) {
        monthlyLatencies.steps[stepRows[j].name] = {
          average: rows[i + j].average,
        };
      }
      stepFunctionIndex++;
      allAvgLatencies.push(monthlyLatencies);
    }
    //console.log(allAvgLatencies.length)
    res.locals.monthlyAvgs = allAvgLatencies;
    return next();
  } catch (err) {
    return next(err);
  }
};

const averageLatenciesApiController = {
  // methods in here
  getAverageLatencies,
  getAverageLatenciesDaily,
  getAverageLatenciesWeekly,
  getAverageLatenciesMonthly,
};

export default averageLatenciesApiController;
