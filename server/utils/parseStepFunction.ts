import { NewStepRow } from "../models/types";

interface ASL {
  States: {
    [stateName: string]: {
      Type: string;
    };
  };
}
interface StateContent {
  Type: string;
  Branches?: Branch[];
  Comment?: string;
  ItemProcessor?: ItemProcessor;
}
interface States {
  [stateName: string]: StateContent;
}
interface Branch {
  States: {
    [stateName: string]: StateContent;
  };
}
interface ItemProcessor {
  States: {
    [stateName: string]: StateContent;
  };
}
/**
 * Parses a step function definition written in ASL and returns all steps, so
 * that they can be inserted into the steps database table.
 * @param asl The full step function definition parsed as a javascript object
 * @returns Promise<NewStepRow[]> - promise which resolves to an array of
 * objects, whose keys are row names in the steps database table
 */
const parseStepFunction = async (
  asl: ASL,
  stepFunctionId: number
): Promise<NewStepRow[]> => {
  const states = asl.States;
  const parsedStates: NewStepRow[] = [];

  const recursiveParser = async (states: States): Promise<void> => {
    for (const [stateName, stateContent] of Object.entries(states)) {
      parsedStates.push({
        name: stateName,
        step_function_id: stepFunctionId,
        type: stateContent.Type,
        comment: stateContent.Comment,
      });
      if (stateContent.Type === "Parallel") {
        for (const branch of stateContent.Branches) {
          await recursiveParser(branch.States);
        }
      } else if (stateContent.Type === "Map") {
        await recursiveParser(stateContent.ItemProcessor.States);
      }
    }
  };
  await recursiveParser(states);

  return parsedStates;
};

export default parseStepFunction;
