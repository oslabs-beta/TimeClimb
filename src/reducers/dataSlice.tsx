import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store.tsx';
import { StateEnteredEventDetailsFilterSensitiveLog } from '@aws-sdk/client-sfn';

type stepfunction = {
  definition?: object;
  name?: string;
  step_function_id?: number;
};

interface dataState {
  stepfunctions: stepfunction[];
  currentDefinition: object | undefined;
  latencies: [
    {
      steps: any;
    }
  ];
  latency: any;
  chartLatencies: number[];
}

const initialState: dataState = {
  stepfunctions: [],
  currentDefinition: {},
  latencies: [
    {
      steps: null,
    },
  ],
  latency: {},
  chartLatencies: [],
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setLatencies: (state, action) => {
      console.log(action.payload);
      state.latencies = action.payload;
      if (state.latencies.length > 0) state.latency = state.latencies[0];
    },
    setLatency: (state, action) => {
      console.log('Setting new latency', action.payload);
      if (state.latencies.length > 0)
        state.latency = state.latencies[action.payload];
    },
    setStepFunction: (state, action) => {
      state.currentDefinition = action.payload;
    },
    getStepFunctions: (state, action) => {
      state.stepfunctions = action.payload;
      // if (state.stepfunctions)
      //   state.currentDefinition = state.stepfunctions[0].definition;
    },
    appendStepFunction: (state, action) => {
      state.stepfunctions.push(action.payload);
    },
    setChartLatencies: (state, action) => {
      if (action.payload) {
        const newChart: number[] = [];
        state.latencies.forEach((ele) => {
          //console.log(ele);
          newChart.push(ele.steps[action.payload].average);
        });
        state.chartLatencies = newChart;
      }
    },
  },
});

export const getStepFunctionList = createAsyncThunk(
  'data/getStepFunctions',
  async () => {
    const res = await fetch('/api/step-functions');
    if (!res.ok) {
      throw new Error('Cannot fetch stepfunctions');
    }
    const stepfunctions: stepfunction[] = await res.json();
    return stepfunctions;
  }
);

export const getLatencies = createAsyncThunk('data/getLatencies', async () => {
  const res = await fetch('/api/average-latencies/1');
  if (!res.ok) {
    throw new Error('Cannot fetch stepfunctions');
  }
  const latencies = await res.json();
  return latencies;
});

export const addStepFunction = createAsyncThunk(
  'data/addStepFunction',
  async () => {
    const res = await fetch('/api/step-functions/addStepFunction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arn: 'arn:aws:states:us-west-2:703671926773:stateMachine:BasicsHelloWorldStateMachine',
      }),
    });
    if (!res.ok) {
      throw new Error('Connot create new stepfunction');
    }
    const newfunction: stepfunction = await res.json();
    return newfunction;
  }
);

export const {
  setLatency,
  setLatencies,
  setStepFunction,
  getStepFunctions,
  appendStepFunction,
  setChartLatencies,
} = dataSlice.actions;

export const selectData = (state: RootState) => {
  state.data;
};

export default dataSlice.reducer;
