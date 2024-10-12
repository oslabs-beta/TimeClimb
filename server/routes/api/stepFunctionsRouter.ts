import express, { Request, Response, NextFunction } from "express";
const stepFunctionRouter = express.Router();

// routes /api/step-functions
stepFunctionRouter.get(
  "/",
  (req: Request, res: Response, next: NextFunction): void => {
    return next();
  }
);

export default stepFunctionRouter;
