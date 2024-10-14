// functions with queries specific for step funtions table can go here
// and imported into controllers where necessary
import db from "./db";
import type { StepFunctionDetails, StepFunctionsTable } from "./types";

const selectAllStepFunctions = async () => {
  try {
    const rows = await db<StepFunctionsTable>("step_functions").select(
      "step_function_id",
      "name",
      "asl",
      "comment",
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
    await db<StepFunctionsTable>("step_functions").insert({
      name: detailObj.name,
      arn: detailObj.stateMachineArn,
      region: 'us-west-2',//probably can get rid of this
      type: detailObj.type,
      alias: 'n/a',//probably remove this as well
      asl: detailObj.definition,
      comment: 'also a test',
      has_versions: false, //can't remember how we determine this
    })
    return;
  } catch(error){
    console.log("Error:", error)
    return;
  }
}

const stepFunctionsModel = {
  selectAllStepFunctions,
  addToStepFunctionTable,
};


export default stepFunctionsModel;
