import express, { Request, Response } from "express";
import stepFunctionsApiController from "../../controllers/api/stepFunctionsApiController";
import getStepFunctionAWS from "../../controllers/aws/getStepFunctionAWS"
const stepFunctionRouter = express.Router();
// routes /api/step-functions
stepFunctionRouter.get(
  "/",
  stepFunctionsApiController.getStepFunctions,
  async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(res.locals.stepFunctions);
    return;
  }
);

stepFunctionRouter.post(
  "/addStepFunction",
  getStepFunctionAWS,
  async (req: Request, res: Response): Promise <void> => {
    res.status(200).json(res.locals.newTable);
    return;
  }
)


export default stepFunctionRouter;
