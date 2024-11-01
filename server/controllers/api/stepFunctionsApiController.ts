import type { Request, Response, NextFunction } from "express";
import stepFunctionsModel from "../../models/stepFunctionsModel";
import type { StepFunctionSubset } from "../../models/types";
const getStepFunctions = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  const stepFunctions: StepFunctionSubset[]= await stepFunctionsModel.selectAllStepFunctions();
  res.locals.stepFunctions = stepFunctions;
  return next();
};

const stepFunctionsApiController = {
  getStepFunctions,
};

export default stepFunctionsApiController;
