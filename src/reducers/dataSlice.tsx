import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store.tsx';
import { StateEnteredEventDetailsFilterSensitiveLog } from '@aws-sdk/client-sfn';
import { current } from '@reduxjs/toolkit';

type stepfunction = {
  definition?: object;
  name?: string;
  step_function_id?: number;
};

interface dataState {
  stepfunctions: stepfunction[];
  currentDefinition: object | undefined;
  currentDefinitionID: number;
  latencies: [
    {
      steps: any;
    }
  ];
  latency: any;
  chartLatencies: number[];
  time: string;
  bubblePopup: boolean;
  bubbleName: string;
}

const initialState: dataState = {
  stepfunctions: [],
  currentDefinition: JSON.parse(
    localStorage.getItem('currentDefinition') || '{}'
  ),
  currentDefinitionID:
    JSON.parse(localStorage.getItem('currentDefinitionID') /*|| '0'*/) || 0,
  latencies: JSON.parse(
    localStorage.getItem('latencies') /*|| '[{steps: null}]'*/
  ) || [{ steps: null }],
  latency: {},
  chartLatencies: [],
  time:
    JSON.parse(localStorage.getItem('timeToggle') /*|| 'hours'*/) || 'hours',
  bubblePopup: false,
  bubbleName: '',
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setLatencies: (state, action) => {
      //console.log(action.payload);
      state.latencies = action.payload;
      if (state.latencies.length > 0) state.latency = state.latencies[0];
      localStorage.setItem('latencies', JSON.stringify(action.payload));
    },
    setLatency: (state, action) => {
      if (state.latencies.length > 0)
        state.latency = state.latencies[action.payload];
    },
    setStepFunction: (state, action) => {
      // console.log('Adding step function definion');
      state.currentDefinition = action.payload;
      localStorage.setItem('currentDefinition', JSON.stringify(action.payload));

      // console.log(state.currentDefinition);
    },
    setDefinitionID: (state, action) => {
      state.currentDefinitionID = action.payload;
      localStorage.setItem(
        'currentDefinitionID',
        JSON.stringify(action.payload)
      );
    },
    getStepFunctions: (state, action) => {
      state.stepfunctions = action.payload;
      // if (state.stepfunctions)
      //   state.currentDefinition = state.stepfunctions[0].definition;
    },
    appendStepFunction: (state, action) => {
      console.log(current(state.stepfunctions));
      state.stepfunctions.push(action.payload);
      console.log(current(state.stepfunctions));
    },
    setChartLatencies: (state, action) => {
      if (action.payload) {
        const newChart: number[] = [];
        state.latencies.forEach((ele) => {
          // console.log(ele);
          newChart.push(ele.steps[action.payload].average);
        });
        state.chartLatencies = newChart;
      }
    },
    setTimeToggle: (state, action) => {
      state.time = action.payload;
      localStorage.setItem('timeToggle', JSON.stringify(action.payload));
    },
    setBubblePopup: (state, action) => {
      state.bubblePopup = action.payload;
    },
    setBubbleName: (state, action) => {
      state.bubbleName = action.payload;
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

export const getLatencies = createAsyncThunk(
  'data/getLatencies',
  async ({ id, time }: { id: number; time: string }) => {
    console.log(`Geeting latency for id: ${id} time: ${time}`);
    const res = await fetch(`/api/average-latencies/${id}/${time}`);
    if (!res.ok) {
      throw new Error('Cannot fetch stepfunctions');
    }
    const latencies = await res.json();
    return latencies;
  }
);

export const addStepFunction = createAsyncThunk(
  'data/addStepFunction',
  async (arn) => {
    const res = await fetch('/api/step-functions/addStepFunction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arn: arn,
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
  setDefinitionID,
  getStepFunctions,
  appendStepFunction,
  setChartLatencies,
  setTimeToggle,
  setBubblePopup,
  setBubbleName,
} = dataSlice.actions;

export const selectData = (state: RootState) => state.data;

export default dataSlice.reducer;
