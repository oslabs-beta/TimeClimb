// here we can define types specific to the step functions api

export interface GetStepFunctionByIdRequest {
  step_function_id: number;
}

export interface GetStepFunctionResponse {
  step_function_id: number;
  name: string;
  description?: string | null;
  definition: string;
}

export interface PostStepFunctionRequest {
  arn: string;
}

export interface MonthlyAverage {
  month_start: string;
  avg: number;
}
