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

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('src'));
app.get('/home', (req: Request, res: Response) => {
  return res.status(200).sendFile('/home/pauluhlenkott/TimeClimb/index.html');
});
app.get('/src/main.tsx', (req: Request, res: Response) => {
  return res.status(200).sendFile('/home/pauluhlenkott/TimeClimb/src/main.js');
});
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
      log: 'Error caught by global error handler',
      status: 500,
      message: 'Error caught by global error handler',
    };
    const newErrObj = Object.assign({}, errObj, err);
    res.status(newErrObj.status).json(newErrObj.message);
    return;
  }
);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
