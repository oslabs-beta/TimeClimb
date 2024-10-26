// functions with queries specific for step funtions table can go here
// and imported into controllers where necessary
import db from "./db";
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

//add to step_functions table
const addToStepFunctionTable = async (detailObj) => {
  try {
    const [rowInserted] = await db<StepFunctionsTable>("step_functions")
      .insert({
        name: detailObj.name,
        arn: detailObj.stateMachineArn,
        region: "us-west-2", //probably can get rid of this
        type: detailObj.type,
        definition: detailObj.definition,
        comment: "also a test",
        revision_id: "56789929",
        has_versions: false, //can't remember how we determine this
      })
      .returning(["step_function_id", "name", "definition"]);

    return rowInserted;
  } catch (error) {
    console.log("Error:", error);
    return;
  }
};

//check if step function exists in step_functions table in DB
const checkStepFunctionsTable = async (arn: string): Promise<StepFunctionsTable | undefined> => {
  const result = await db<StepFunctionsTable>("step_functions")
  .where({arn: arn})
  .first();
  return result
}


const stepFunctionsModel = {
  selectAllStepFunctions,
  addToStepFunctionTable,
  checkStepFunctionsTable
};

export default stepFunctionsModel;
