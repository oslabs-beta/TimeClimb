import "dotenv/config";
import db from "./db";
import { StepsTable } from "./types";

const getStepsByStepFunctionId = async (step_function_id: number) => {
  try {
    const rows = await db<StepsTable>("steps")
      .select("step_id", "name", "type", "comment", "is_branch")
      .where("step_function_id", step_function_id)
      .orderBy("step_id");
    return rows;
  } catch (err) {
    console.log(
      `Error getting steps for step_function_id ${step_function_id}: ${err}`
    );
  }
};

const getStepsByStepFunctionIds = async (stepFunctionIds: number[]) => {
  try {
    const rows = await db<StepsTable>("steps")
      .select("step_id", "name", "type", "step_function_id")
      .whereIn("step_function_id", stepFunctionIds)
      .orderBy("step_function_id", "step_id");
    return rows;
  } catch (err) {
    console.log(
      `Error getting steps for step_function_id ${step_function_id}: ${err}`
    );
  }
};

const stepsModel = {
  getStepsByStepFunctionId,
  getStepsByStepFunctionIds,
};

export default stepsModel;
