// file for describing the shape of the database tables in order to help
// ensure that we are building and using models correctly

export interface StepFunctions {
  step_function_id: number;
  name: string;
  arn: string;
  region: string;
  type: string;
  alias?: string;
  asl: string;
  description?: string;
  comment?: string;
  has_versions: boolean;
  parent_id?: number;
}
