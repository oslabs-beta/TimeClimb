// file for describing the shape of the database tables in order to help
// ensure that we are building and using models correctly

export interface StepFunctionsTable {
  step_function_id: number;
  name: string;
  arn: string;
  region: string;
  type: string;
  alias?: string | null;
  asl: string;
  description?: string | null;
  comment?: string | null;
  has_versions: boolean;
  parent_id?: number | null;
}

export interface Steps {
  step_id: number;
  step_function_id: number;
  name: string;
  type: string;
  comment?: string | null;
}

export interface StepLatencies {
  latency_id: number;
  step_id: number;
  average: number;
  executions: number;
  start_time: Date;
  end_time: Date;
}

export interface StepFunctionLatencies {
  latency_id: number;
  step_id: number;
  average: number;
  executions: number;
  start_time: Date;
  end_time: Date;
}

export interface StepFunctionMonitoring {
  id: number;
  step_function_id: number;
  newest_update: Date;
  oldest_update: Date;
  start_time: Date;
  end_time?: Date | null;
  active: boolean;
}

