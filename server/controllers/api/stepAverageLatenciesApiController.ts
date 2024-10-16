import type { Request, Response, NextFunction } from "express";
import moment from "moment";
import type { StepAverageLatenciesTable } from "../../models/types";
import stepsModel from "../../models/stepsModel";
import stepAverageLatenciesModel from "../../models/stepAverageLatenciesModel";

const getYesterdayAverageStepLatencies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const stepFunctionId = 1;
  const stepRows = await stepsModel.getStepsByStepFunctionId(stepFunctionId);

  const stepIds: number[] = stepRows.map((el) => el.step_id);
  console.log("ids array:", stepIds);

  const yesterdayStartTimeString = moment
    .utc()
    .subtract(1, "day")
    .startOf("day")
    .toISOString();
  const yesterdayEndTimeString = moment
    .utc()
    .subtract(1, "day")
    .endOf("day")
    .toISOString();

  const rows = await stepAverageLatenciesModel.getLatenciesBetweenTimes(
    stepIds,
    yesterdayStartTimeString,
    yesterdayEndTimeString
  );

  const latenciesArray = [];
  for (let i = 0; i < rows.length; i += stepIds.length) {
    const object = {
      start_time: rows[i].start_time,
      steps: {},
    };

    for (let j = 0; j < stepIds.length; j++) {
      object.steps[stepRows[j].name] = {
        average: rows[i + j].average,
      };
    }
    latenciesArray.push(object);
  }

  // form this into the correct object

  console.log("rows[0]", rows);
  console.log("latenciesArray", JSON.stringify(latenciesArray, null, 2));
  // return next();
};
getYesterdayAverageStepLatencies();
const stepAverageLatenciesApiController = {};
export default stepAverageLatenciesApiController;
