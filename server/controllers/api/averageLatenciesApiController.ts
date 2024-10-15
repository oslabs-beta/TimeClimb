import type { Request, Response, NextFunction } from "express";
import type { StepFunctionAverageLatenciesTable } from "../../models/types";
import averageLatenciesModel from "../../models/averageLatenciesModel";

const getAverageLatencies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { step_function_id, start_time, end_time } = req.params; //not sure if destructuring will work properly this way with req.params instead of req.body
    const averageLatencies =
      await averageLatenciesModel.getStepFunctionLatencies(
        Number(step_function_id), //was getting error because this must be turn into string or something when passed as param???
        start_time,
        end_time
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
