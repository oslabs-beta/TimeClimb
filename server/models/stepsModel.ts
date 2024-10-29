import "dotenv/config";
import db from "./db";
import { StepsByStepFunctionId, StepsTable } from "./types";

const getStepsByStepFunctionId = async (
  stepFunctionId: number
): Promise<StepsByStepFunctionId[]> => {
  try {
    const rows = await db<StepsTable>("steps")
      .select("step_id", "name", "type", "comment")
      .where("step_function_id", stepFunctionId)
      .orderBy("step_id");
    return rows;
  } catch (err) {
    console.log(
      `Error getting steps for step_function_id ${stepFunctionId}: ${err}`
    );
  }
};

const getStepsByStepFunctionIds = async (
  stepFunctionIds: number[]
): Promise<StepsByStepFunctionId[]> => {
  try {
    const rows = await db<StepsTable>("steps")
      .select("step_id", "name", "type", "step_function_id")
      .whereIn("step_function_id", stepFunctionIds)
      .orderBy("step_function_id", "step_id");
    return rows;
  } catch (err) {
    console.log(
      `Error getting steps for step_function_ids ${stepFunctionIds}: ${err}`
    );
  }
};

const stepsModel = {
  getStepsByStepFunctionId,
  getStepsByStepFunctionIds,
};

export default stepsModel;
