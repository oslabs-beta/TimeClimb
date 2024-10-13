// here we can define types specific to the step functions api
export type GetStepFunctionsResponse = GetStepFunctionResponse[];

export interface GetStepFunctionByIdRequest {
  step_function_id: number;
}

export interface GetStepFunctionResponse {
  step_function_id: number;
  name: string;
  comment?: string | null;
  description?: string | null;
  alias?: string | null;
  asl: string;
}
