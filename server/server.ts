<<<<<<< HEAD
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import logData from './models/controllers';
import stepFunctionController from './controllers/stepFunctionController';
import apiRouter from './routes/api/index';
import clientRouter from './routes/client/index';
=======
import express from "express";
import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import cors from "cors";
import apiRouter from "./routes/api/index";
import clientRouter from "./routes/client/index";
>>>>>>> ace0c2c7eef7ccf0bdb477c4bd0d0b8423c53099

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
app.use(express.static('src'));
app.get('/home', (req: Request, res: Response) => {
  return res.status(200).sendFile('/home/pauluhlenkott/TimeClimb/index.html');
});
app.get('/src/main.tsx', (req: Request, res: Response) => {
  return res.status(200).sendFile('/home/pauluhlenkott/TimeClimb/src/main.js');
});

// API router
app.use('/api', apiRouter);

app.get(
  '/getStateMachines-aws',
  stepFunctionController.listStateMachines,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.stateMachines);
  }
);

// for react app
app.use(clientRouter);

app.use('/*', (req: Request, res: Response) => {
  res.status(404).send('404 not found');
});

app.use((err, req, res, next) => {
  const errObj = {
    log: 'Error caught by global error handler',
    status: 500,
    message: err,
  };
  const newErrObj = Object.assign({}, errObj, err);
  res.status(newErrObj.status).json(newErrObj.message);
});

=======
// API router
app.use("/api", apiRouter);

// for react app - not yet implemented
app.use(clientRouter);

app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const errObj = {
      log: "Error caught by global error handler",
      status: 500,
      message: "Error caught by global error handler",
    };
    const newErrObj = Object.assign({}, errObj, err);
    res.status(newErrObj.status).json(newErrObj.message);
    return;
  }
);

>>>>>>> ace0c2c7eef7ccf0bdb477c4bd0d0b8423c53099
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
