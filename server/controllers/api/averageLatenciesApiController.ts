import type { Request, Response, NextFunction } from "express";
import averageLatenciesModel from "../../models/averageLatenciesModel";
import stepsModel from "../../models/stepsModel";
import stepAverageLatenciesModel from "../../models/stepAverageLatenciesModel";
import moment from "moment";

import type { AverageLatencies, StepsByStepFunctionId, StepAverageLatencies, LatenciesObj } from "../../models/types";

const getAverageLatencies = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  try {
    const { step_function_id } = req.params; //not sure if destructuring will work properly this way with req.params instead of req.body
    const start_time = moment().subtract(1, "day").startOf("day");//eventually will need to be set by frontend
    const end_time = moment().subtract(1, "day").endOf("day");
    const averageLatencies: AverageLatencies[] =
      await averageLatenciesModel.getStepFunctionLatencies(
        Number(step_function_id), //was getting error because this must be turn into string or something when passed as param???
        start_time.toISOString(),
        end_time.toISOString()
      );
    /**
     * [
     *  { start_time, step_function_id, average, start_time }
     * ]
     */
//creates array of all steps based on step function id
    const stepRows: StepsByStepFunctionId[] = await stepsModel.getStepsByStepFunctionId(
      Number(step_function_id)
    );
//create array of all step ids
    const stepIds: number[] = stepRows.map((el) => el.step_id);
//assign rows to array of steps in a function executed between certain times
    const rows: StepAverageLatencies[] = await stepAverageLatenciesModel.getLatenciesBetweenTimes(
      stepIds,
      start_time.toISOString(),
      end_time.toISOString()
    );

    const latenciesArray = [];
    let stepFunctionIndex = 0;
    for (let i = 0; i < rows.length; i += stepIds.length) {
      const hourLatencies:LatenciesObj = {
        date: averageLatencies[stepFunctionIndex].start_time,
        stepFunctionAverageLatency: averageLatencies[stepFunctionIndex].average,
        steps: {},
      };

      for (let j = 0; j < stepIds.length; j++) {
        hourLatencies.steps[stepRows[j].name] = {
          average: rows[i + j].average,
        };
      }
      stepFunctionIndex++;
      latenciesArray.push(hourLatencies);
    }

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
):Promise<void> => {
  try{
  const {step_function_id} = req.params;
  const start_time = moment().subtract(6, "day").startOf("day")
  const end_time = moment().endOf("day")//includes current day in request
    const dailyStepFunctionLatencies: AverageLatencies[] = 
    await averageLatenciesModel.getStepFunctionLatenciesDaily(Number(step_function_id), start_time.toISOString(), end_time.toISOString())
    console.log("daily latencies", dailyStepFunctionLatencies)
    //get step averages for all steps within function
    const stepRows: StepsByStepFunctionId[] = await stepsModel.getStepsByStepFunctionId(Number(step_function_id));
    //create array of the id's of each step in function
    const stepIDs: number[] = stepRows.map((step) => step.step_id);
    //create array of all step latencies from the last week
    const rows: StepAverageLatencies[] = await stepAverageLatenciesModel
    .getDailyLatencyAveragesBetweenTimes(stepIDs,
       start_time.toISOString(),
        end_time.toISOString()
      );
        const allAvgLatencies = [];
        let stepFunctionIndex = 0;
       // console.log("rows:", rows)
        //iterate through all step latencies from the last week
        for(let i = 0; i < rows.length; i += stepIDs.length){
          const dailyLatencies:LatenciesObj = {
            date: dailyStepFunctionLatencies[stepFunctionIndex].start_time,
            stepFunctionAverageLatency: dailyStepFunctionLatencies[stepFunctionIndex].average,
            steps: {}
          };
            //for each step in this function, add it's averages to dailyLatencies
            for(let j = 0; j < stepIDs.length; j++){
              dailyLatencies.steps[stepRows[j].name] = {
                average : rows[i + j].average
              }
            }
            stepFunctionIndex++;
            allAvgLatencies.push(dailyLatencies) 
           // console.log(allAvgLatencies.length)
        }

        res.locals.dailyAvgs = allAvgLatencies
         
    return next()
  } catch (err){
    return next(err)
  }
}

const getAverageLatenciesWeekly = async(
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  try{
    const {step_function_id} = req.params;
    const start_time = moment().subtract(10, "week").startOf("week")
    const end_time = moment().endOf("day")//includes current day in request
      const weeklyStepFunctionLatencies: AverageLatencies[] = 
      await averageLatenciesModel.getStepFunctionLatenciesWeekly(Number(step_function_id), start_time.toISOString(), end_time.toISOString())
   // console.log(weeklyStepFunctionLatencies)
    const stepRows: StepsByStepFunctionId[] = await stepsModel.getStepsByStepFunctionId(Number(step_function_id))
   // console.log('ids', stepRows)
   const stepIDs: number[] = stepRows.map((step) => step.step_id)
   const rows: StepAverageLatencies[] = await stepAverageLatenciesModel
   .getWeeklyLatencyAveragesBetweenTimes(stepIDs,
    start_time.toISOString(),
    end_time.toISOString()
   );
   const allAvgLatencies = [];
   let stepFunctionIndex = 0;
   for (let i = 0; i < rows.length; i += stepIDs.length){
    const weeklyLatencies: LatenciesObj = {
      date: weeklyStepFunctionLatencies[stepFunctionIndex].start_time,
      stepFunctionAverageLatency: weeklyStepFunctionLatencies[stepFunctionIndex].average,
      steps: {}
    };
      for(let j = 0; j < stepIDs.length; j++){
        weeklyLatencies.steps[stepRows[j].name] = {
          average : rows[i + j].average
        }
      }
      stepFunctionIndex++;
      allAvgLatencies.push(weeklyLatencies)
   }
   console.log('weekly:', allAvgLatencies.length)
   res.locals.weeklyAvgs = allAvgLatencies
    return next()
  } catch (err){
    return next(err)
  }
}

const getAverageLatenciesMonthly = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  try{
    const {step_function_id} = req.params;
    const start_time = moment().subtract(11, "month").startOf("month");
    const end_time = moment().endOf("month");
    const monthlyStepFunctionLatencies: AverageLatencies[] = 
    await averageLatenciesModel.getStepFunctionLatenciesMonthly(
      Number(step_function_id),
      start_time.toISOString(),
      end_time.toISOString()
    );
    const stepRows = await stepsModel.getStepsByStepFunctionId(Number(step_function_id))
    const stepIDs = stepRows.map((step) => step.step_id)
    const rows = await stepAverageLatenciesModel
    .getMonthlyLatencyAveragesBetweenTimes(stepIDs,
     start_time.toISOString(),
     end_time.toISOString()
    );
    const allAvgLatencies = [];
    let stepFunctionIndex = 0;
    for (let i = 0; i < rows.length; i += stepIDs.length){
     const monthlyLatencies = {
       date: monthlyStepFunctionLatencies[stepFunctionIndex].start_time,
       stepFunctionAverageLatency: monthlyStepFunctionLatencies[stepFunctionIndex].average,
       steps: {}
     };
       for(let j = 0; j < stepIDs.length; j++){
         monthlyLatencies.steps[stepRows[j].name] = {
           average : rows[i + j].average
         }
       }
       stepFunctionIndex++;
       allAvgLatencies.push(monthlyLatencies)
    }
    //console.log(allAvgLatencies.length)
    res.locals.monthlyAvgs = allAvgLatencies
     return next()
   } catch (err){
     return next(err)
   }
 }


const averageLatenciesApiController = {
  // methods in here
  getAverageLatencies,
  getAverageLatenciesDaily,
  getAverageLatenciesWeekly,
  getAverageLatenciesMonthly
};

export default averageLatenciesApiController;
