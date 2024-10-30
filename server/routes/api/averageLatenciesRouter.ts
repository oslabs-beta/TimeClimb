import express from "express";
import type { Request, Response } from "express";
import averageLatenciesApiController from "../../controllers/api/averageLatenciesApiController";
const averageLatenciesRouter = express.Router();
//hourly latencies
averageLatenciesRouter.get(
  "/:step_function_id/hours",
  averageLatenciesApiController.getAverageLatencies,
  (req: Request, res: Response): void => {
    res.status(200).json(res.locals.latencyAverages);
    return;
  }
);

//daily latencies over past week
averageLatenciesRouter.get(
  "/:step_function_id/days",
  averageLatenciesApiController.getAverageLatenciesDaily,
  (req: Request, res: Response): void => {
    res.status(200).json(res.locals.dailyAvgs);
  }
);

//weekly latencies over past 12 weeks
averageLatenciesRouter.get(
  "/:step_function_id/weeks",
  averageLatenciesApiController.getAverageLatenciesWeekly,
  (req: Request, res: Response): void => {
    res.status(200).json(res.locals.weeklyAvgs);
  }
);

//monthly latencies over past year
averageLatenciesRouter.get(
  "/:step_function_id/months",
  averageLatenciesApiController.getAverageLatenciesMonthly,
  (req: Request, res: Response): void => {
    res.status(200).json(res.locals.monthlyAvgs);
  }
);

export default averageLatenciesRouter;
