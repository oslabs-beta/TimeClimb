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
  currentFunction: stepfunction;
  latency: string[];
}

const initialState: dataState = {
  stepfunctions: [],
  currentFunction: { definition: undefined },
  latency: [],
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setLatency: (state, action) => {
      state.latency = action.payload;
    },
    setStepFunction: (state, action) => {
      state.currentFunction = action.payload;
    },
    getStepFunctions: (state, action) => {
      state.stepfunctions = action.payload;
      if (state.stepfunctions) state.currentFunction = state.stepfunctions[0];
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
    return stepfunctions;
  }
);

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
