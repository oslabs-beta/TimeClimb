import type { Request, Response, NextFunction } from "express";
import type { StepFunctionAverageLatenciesTable } from "../../models/types";
import averageLatenciesModel from "../../models/averageLatenciesModel";
import moment from "moment";

const getAverageLatencies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { step_function_id } = req.params; //not sure if destructuring will work properly this way with req.params instead of req.body
    const start_time = moment.utc().subtract(1, 'day').startOf("day");
    const end_time = moment.utc().subtract(1, 'day').endOf("day");
    const averageLatencies =
      await averageLatenciesModel.getStepFunctionLatencies(
        Number(step_function_id), //was getting error because this must be turn into string or something when passed as param???
        start_time.toISOString(),
        end_time.toISOString()
      );
    res.locals.latencyAverages = averageLatencies;
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
