import type { Request, Response, NextFunction } from "express";
import stepFunctionsModel from "../../models/stepFunctionsModel";
import type { GetStepFunctionResponse } from "../../types/stepFunctionsApi";

const getStepFunctions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const stepFunctions: GetStepFunctionResponse[] =
    await stepFunctionsModel.selectAllStepFunctions();

  console.log(stepFunctions);
  res.locals.stepFunctions = stepFunctions;
  return next();
};

const stepFunctionsApiController = {
  getStepFunctions,
};

export default stepFunctionsApiController;
