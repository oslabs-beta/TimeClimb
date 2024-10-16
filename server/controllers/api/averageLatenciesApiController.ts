import type { Request, Response, NextFunction } from "express";
import averageLatenciesModel from "../../models/averageLatenciesModel";
import stepsModel from "../../models/stepsModel";
import stepAverageLatenciesModel from "../../models/stepAverageLatenciesModel";
import moment from "moment";

const getAverageLatencies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { step_function_id } = req.params; //not sure if destructuring will work properly this way with req.params instead of req.body
    const start_time = moment().subtract(1, "day").startOf("day");
    const end_time = moment().subtract(1, "day").endOf("day");
    const averageLatencies =
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

    const stepRows = await stepsModel.getStepsByStepFunctionId(
      Number(step_function_id)
    );

    const stepIds: number[] = stepRows.map((el) => el.step_id);

    const rows = await stepAverageLatenciesModel.getLatenciesBetweenTimes(
      stepIds,
      start_time.toISOString(),
      end_time.toISOString()
    );

    const latenciesArray = [];
    let stepFunctionIndex = 0;
    for (let i = 0; i < rows.length; i += stepIds.length) {
      const hourLatencies = {
        startTime: averageLatencies[stepFunctionIndex].start_time,
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

    console.log("latenciesArray", JSON.stringify(latenciesArray, null, 2));
    console.log("latenciesArray", latenciesArray.length);
    res.locals.latencyAverages = latenciesArray;
    return next();
  } catch (err) {
    return next(err);
  }
};
const averageLatenciesApiController = {
  // methods in here
  getAverageLatencies,
};

export default averageLatenciesApiController;
