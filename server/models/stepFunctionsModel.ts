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
const stepFunctionsModel = {
  selectAllStepFunctions,
};

//add to step_functions table

export default stepFunctionsModel;
