export interface Executions {
  // step function execution arn as key
  [executionArn: string]: {
    logStreamName: string;
    events: Event[];
    eventsFound?: number;
    isStillRunning?: boolean;
    hasMissingEvents?: boolean;
  };
}
export interface Event {
  id: number;
  type: string;
  name?: string; // some events like start and end dont have a name
  timestamp: number; // epoch milliseconds
  eventId: string; // actually a long string of numbers
}

export interface FormattedSteps {
  [stepName: string]: {
    type: string;
    stepId: number;
  };
}

export interface LatencyData {
  executions: number;
  stepFunctionLatencySum: number;
  steps: {
    [stepName: string]: {
      executions: number;
      sum: number;
    };
  };
}

export interface StepCurrentLatencies {
  [stepName: string]: {
    average: number;
    executions: number;
    latencyId: number;
  };
}

export type JobQueue = () => Promise<void>;
