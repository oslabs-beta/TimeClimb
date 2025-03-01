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
  revision_id?: string;
  parent_id?: number | null;
}

export interface StepsTable {
  step_id?: number;
  step_function_id?: number;
  name: string;
  type: string;
  comment?: string | null;
}

export interface NewStepRow {
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

export interface StepFunctionTrackersTable {
  tracker_id?: number;
  step_function_id: number;
  newest_execution_time?: string | null;
  oldest_execution_time?: string | null;
  tracker_start_time?: string | null;
  tracker_end_time?: string | null;
  log_group_arn: string;
  active?: boolean;
}

export interface NewTrackerRowResult {
  tracker_id: number;
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

export interface IncompleteStreamsTable {
  stream_id?: number;
  step_function_id: number;
  stream_name: string;
  log_group_arn: string;
}

export type TrackerStepFunctionsJoinTable = StepFunctionTrackersTable &
  StepFunctionsTable;
//for step average latencies from database
export interface StepAverageLatencies {
  latency_id?: number;
  step_id: number;
  average: number;
  start_time: string;
  executions?: number;
}

export interface AverageLatencies {
  latency_id?: number;
  step_function_id: number;
  average: number;
  start_time: string;
  executions?: number;
}

export type StepsByStepFunctionId = Pick<
  StepsTable,
  "step_id" | "name" | "type" | "step_function_id" | "comment"
>;

export interface LatenciesObj {
  date: string;
  stepFunctionAverageLatency: number;
  steps: {
    [key: string]: { average?: number };
  };
}

//for stepFunctionsApiController.getStepFunctions
export interface StepFunctionSubset {
  step_function_id?: number;
  name: string;
  definition: string;
  description?: string | null;
}
