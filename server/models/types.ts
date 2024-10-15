// file for describing the shape of the database tables in order to help
// ensure that we are building and using models correctly

export interface StepFunctionsTable {
  step_function_id?: number;
  name: string;
  arn: string;
  region: string;
  type: string;
  definition: string;
  description?: string | null;
  comment?: string | null;
  has_versions: boolean;
  is_version: boolean;
  revision_id?: number;
  parent_id?: number | null;
}

export interface StepsTable {
  step_id?: number;
  step_function_id: number;
  name: string;
  type: string;
  comment?: string | null;
}

export interface StepAverageLatenciesTable {
  latency_id?: number;
  step_id: number;
  average: number;
  executions: number;
  start_time: string;
  end_time: string;
}

export interface StepFunctionAverageLatenciesTable {
  latency_id?: number;
  step_function_id: number;
  average: number;
  executions: number;
  start_time: string;
  end_time: string;
}

export interface StepFunctionMonitoringTable {
  id?: number;
  step_function_id: number;
  newest_update: string;
  oldest_update: string;
  start_time: string;
  end_time?: string | null;
  active?: boolean;
}

export interface StepFunctionAliasesTable {
  alias_id?: number;
  name: string;
  arn: string;
  region: string;
  description?: string;
}

export interface AliasRoutesTable {
  alias_id: number;
  step_function_id: number;
  weight: number;
}
