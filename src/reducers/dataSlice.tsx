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
  latencies: object[];
  latency: object;
}

const initialState: dataState = {
  stepfunctions: [],
  currentDefinition: {},
  latencies: [],
  latency: {},
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setLatencies: (state, action) => {
      state.latencies = action.payload;
    },
    setLatency: (state, action) => {
      state.latency = action.payload;
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
    console.log('GettingStepfunctions:', stepfunctions);
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
  setStepFunction,
  getStepFunctions,
  appendStepFunction,
} = dataSlice.actions;

export const selectData = (state: RootState) => {
  state.data;
};

export default dataSlice.reducer;
