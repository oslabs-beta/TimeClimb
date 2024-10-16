import "dotenv/config";
import db from "./db";
import { StepsTable } from "./types";

const getStepsByStepFunctionId = async (step_function_id: number) => {
  try {
    const rows = await db<StepsTable>("steps")
      .select("step_id", "name", "type", "comment")
      .where("step_function_id", step_function_id)
      .orderBy("step_id");
    return rows;
  } catch (err) {
    console.log(
      `Error getting steps for step_function_id ${step_function_id}: ${err}`
    );
  }
};

const stepsModel = {
  getStepsByStepFunctionId,
};

export default stepsModel;
