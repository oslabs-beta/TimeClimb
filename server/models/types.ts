// file for describing the shape of the database tables in order to help
// ensure that we are building and using models correctly

export interface StepFunctionsTable {
  step_function_id: number;
  name: string;
  arn: string;
  region: string;
  type: string;
 // alias?: string | null;
  definition: string;
  description?: string | null;
  comment?: string | null;
  has_versions: boolean;
  is_version: boolean;
  revisionId: number | string; //added or string because DB says type expected is character varying
  parent_id?: number | null;
}

export interface StepsTable {
  step_id: number;
  step_function_id: number;
  name: string;
  type: string;
  comment?: string | null;
}

export interface StepLatenciesTable {
  latency_id: number;
  step_id: number;
  average: number;
  executions: number;
  start_time: Date;
  end_time: Date;
}

export interface StepFunctionLatenciesTable {
  latency_id: number;
  step_id: number;
  average: number; //hourly average
  executions: number; //number of times step has run in hour
  start_time: Date; //hour that it starts
  end_time: Date; //hour that it ends
}

export interface StepFunctionMonitoringTable {
  id: number;
  step_function_id: number;
  newest_update: Date;
  oldest_update: Date;
  start_time: Date;
  end_time?: Date | null;
  active: boolean;
}

export interface StepFunctionAliasesTable {
  alias_id: number;
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
