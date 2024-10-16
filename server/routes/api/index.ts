import express from "express";
import stepFunctionsRouter from "./stepFunctionsRouter";
import latenciesRouter from "./latenciesRouter";
const apiRouter = express.Router();

// routes /api
apiRouter.use("/step-functions", stepFunctionsRouter);
apiRouter.use("/latencies", latenciesRouter);

export default apiRouter;
