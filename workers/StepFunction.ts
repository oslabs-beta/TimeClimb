import type { StepsByStepFunctionId } from "../server/models/types";
import { FormattedSteps } from "./types";
import { StepsTable } from "../server/models/types";

export type StepFunction = {
  id: number;
  stepIds: number[];
  stepRows: StepsByStepFunctionId[];
  steps: FormattedSteps;
  setStepIdArray: (this: StepFunction) => void;
  formatSteps: (this: StepFunction, stepRows: StepsTable[]) => FormattedSteps;
};

/**
 * Creates step function objects in functional style to conform with the rest
 * of the codebase's functional style.
 * @param stepRows Rows of step data from the database steps table for this step
 * function
 * @returns stepFunction object
 */
export function createStepFunction(stepRows: StepsByStepFunctionId[]) {
  const stepFunction = Object.create(stepFunctionPrototype);
  stepFunction.setStepIdArray(stepRows);
  stepFunction.formatSteps(stepRows);
  return stepFunction;
}
const stepFunctionPrototype = {
  /**
   * Gets an array of step ids to filter database queries based on id
   * @param this StepFunction object
   * @param stepRows Rows of step data from the database steps table for this step
   * function
   * @returns undefined (void)
   */
  setStepIdArray(this: StepFunction, stepRows: StepsTable[]): void {
    this.stepIds = stepRows.map((el) => el.step_id);
    return;
  },
  /**
   * This function formats the steps into an object with keys as the step names
   * for easier lookup when parsing logs
   * @param this StepFunction object
   * @param stepRows Rows of step data from the database steps table for this step
   * function
   * @returns FormattedSteps object
   */
  formatSteps(this: StepFunction, stepRows: StepsTable[]): FormattedSteps {
    const steps: FormattedSteps = {};
    for (const step of stepRows) {
      steps[step.name] = {
        type: step.type,
        stepId: step.step_id,
      };
    }
    this.steps = steps;
    return steps;
  },
};
