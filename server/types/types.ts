// we use this store database results by time for faster future lookup
export interface SFLatenciesByTime {
  [key: string]: {
    stepFunctionId: number;
    average: number;
    executions?: number;
  };
}

// we use this store database results by time for faster future lookup
export interface StepLatenciesByTime {
  [key: string]: {
    stepId?: number;
    average?: number;
    executions?: number;
  };
}

// time period strings as defined by moment
export type TimePeriod = "hours" | "days" | "weeks" | "months";

// api data reponse to average-latencies endpoints

export interface AverageLatenciesResponse {
  date?: string;
  stepFunctionAverageLatency?: number;
  steps?: {
    [key: string]: {
      average?: number;
      executions?: number;
    };
  };
}