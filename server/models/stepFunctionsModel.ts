import db from "./db";
import { DescribeStateMachineOutput } from "@aws-sdk/client-sfn";
import type { StepFunctionsTable } from "./types";

const selectAllStepFunctions = async () => {
  try {
    const rows = await db<StepFunctionsTable>("step_functions").select(
      "step_function_id",
      "name",
      "definition",
      "description"
    );
    return rows;
  } catch (err) {
    console.log("Error:", err);
    return;
  }
};

/**
 * Inserts a step function into the step_functions table
 * @param stepFunction Response object from DescribeStateMachine command, which
 * holds step function data
 * @param region The region the step function is hosted within
 * @returns Object with step_function_id, name, and definition properties of the
 * step function that was inserted into the database.
 */
const addToStepFunctionTable = async (
  stepFunction: DescribeStateMachineOutput,
  region: string
) => {
  try {
    const [rowInserted] = await db<StepFunctionsTable>("step_functions")
      .insert({
        name: stepFunction.name,
        arn: stepFunction.stateMachineArn,
        region,
        type: stepFunction.type,
        definition: stepFunction.definition,
        description: stepFunction.description,
        revision_id: stepFunction.revisionId,
      })
      .returning(["step_function_id", "name", "definition"]);

    return rowInserted;
  } catch (error) {
    console.log("Error inserting step function into database:", error);
    return;
  }
};

//check if step function exists in step_functions table in DB
const checkStepFunctionsTable = async (
  arn: string
): Promise<StepFunctionsTable | undefined> => {
  const result = await db<StepFunctionsTable>("step_functions")
    .where({ arn: arn })
    .first();
  return result;
};

const stepFunctionsModel = {
  selectAllStepFunctions,
  addToStepFunctionTable,
  checkStepFunctionsTable,
};

export default stepFunctionsModel;
