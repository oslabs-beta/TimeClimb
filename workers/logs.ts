import type { Executions, LatencyData, FormattedSteps } from "./types";

/**
 * Calculates the overall latency and individual step latencies for each
 * execution.  Stores incomplete executions for later processing.
 * @param executions Object with data on all executions collected from the logs.
 * Data is keyed by execution arn.
 * @param steps Steps object for all steps this step function uses, organized by
 * step name as keys.
 * @returns [LatencyData, Executions]
 */
const calculateLogLatencies = async (
  executions: Executions,
  steps: FormattedSteps
): Promise<[LatencyData, Executions]> => {
  const latencyData: LatencyData = {
    executions: 0,
    stepFunctionLatencySum: 0,
    steps: {},
  };

  const endTypesSet = new Set([
    "ExecutionSucceeded",
    "ExecutionFailed",
    "ExecutionAborted",
    "ExecutionTimedOut",
  ]);

  const incompleteExecutions: Executions = {};

  for (const executionArn in executions) {
    const stepBuffer = {};
    const events = executions[executionArn].events;

    if (!endTypesSet.has(events[events.length - 1].type)) {
      incompleteExecutions[executionArn] = executions[executionArn];
      incompleteExecutions[executionArn].isStillRunning = true;
      continue;
    }
    if (executions[executionArn].eventsFound !== events.length) {
      incompleteExecutions[executionArn] = executions[executionArn];
      incompleteExecutions[executionArn].hasMissingEvents = true;
      continue;
    }

    latencyData.executions++;

    latencyData.stepFunctionLatencySum +=
      events[events.length - 1].timestamp - events[0].timestamp;

    for (const event of events) {
      // these are event types which do not have an associated latency
      if (event.type === "ExecutionStarted") continue;
      if (event.type === "ExecutionSucceeded") continue;
      if (event.name === undefined || steps[event.name] === undefined) continue;
      if (
        event.type === "FailStateEntered" ||
        event.type === "SucessStateEntered"
      )
        continue;

      if (event.type.endsWith("Entered")) {
        if (stepBuffer[event.name] === undefined) {
          stepBuffer[event.name] = [{ timestamp: event.timestamp }];
        } else {
          stepBuffer[event.name].push([{ timestamp: event.timestamp }]);
        }
      } else if (event.type.endsWith("Exited")) {
        const step = stepBuffer[event.name].shift();
        const latency = event.timestamp - step.timestamp;

        const stepId = steps[event.name].stepId;

        if (latencyData.steps[stepId] !== undefined) {
          latencyData.steps[stepId].executions++;
          latencyData.steps[stepId].sum += latency;
        } else {
          latencyData.steps[stepId] = {
            executions: 1,
            sum: latency,
          };
        }
      }
    }
  }
  return [latencyData, incompleteExecutions];
};

const logs = {
  calculateLogLatencies,
};

export default logs;
