import express from "express";
import type { Request, Response } from "express";
import averageLatenciesApiController from "../../controllers/api/averageLatenciesApiController";
const averageLatenciesRouter = express.Router();

averageLatenciesRouter.get(
  "/average-latencies/:step_function_id",
  averageLatenciesApiController.getAverageLatencies,
  (req: Request, res: Response): void => {
    res.status(200).json();
    return;
  }
);

export default averageLatenciesRouter;
