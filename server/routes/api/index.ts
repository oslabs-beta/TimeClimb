import express from "express";
import stepFunctionsRouter from "./stepFunctionsRouter";
import averageLatenciesRouter from "./averageLatenciesRouter";
const apiRouter = express.Router();

// routes /api
apiRouter.use("/step-functions", stepFunctionsRouter);
apiRouter.use("/average-latencies", averageLatenciesRouter);

export default apiRouter;
