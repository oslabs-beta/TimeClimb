import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import logData from "./models/controllers";
import stepFunctionController from "./controllers/stepFunctionController";
import apiRouter from "./routes/api/index";
import clientRouter from "./routes/client/index";

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API router
app.use("/api", apiRouter);

app.get("/", logData, (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, Typescript Express!" });
});

app.get(
  "/getStateMachines-aws",
  stepFunctionController.listStateMachines,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.stateMachines);
  }
);

// for react app
app.use(clientRouter);

app.use((err, req, res, next) => {
  const errObj = {
    log: "Error caught by global error handler",
    status: 500,
    message: "Error caught by global error handler",
  };
  const newErrObj = Object.assign({}, errObj, err);
  res.status(newErrObj.status).json(newErrObj.message);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
// import { Application, Request, Response } from 'express';

// const app: Application = express();

// const PORT = 3000;

// try {
//   app.listen(PORT, (): void => {
//     console.log(`Connected successfully on port ${PORT}`);
//   });
// } catch (error: any) {
//   console.error(`Error occured: ${error.message}`);
// }
