import "dotenv/config";
import db from "./db";
import { StepsTable } from "./types";

const getStepsByStepFunctionId = async (step_function_id: number) => {
  const rows = await db<StepsTable>("steps")
    .select("step_id", "name", "type", "comment")
    .where("step_function_id", step_function_id)
    .orderBy("step_id");
  return rows;
};

const stepsModel = {
  getStepsByStepFunctionId,
};

export default stepsModel;
