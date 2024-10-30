//import React from 'react';
import FlowChartView from './FlowChartView';
import FlowChartDataSelector from './FlowChartDataSelector';
import StepFunctionSelector from './StepFunctionSelector';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TimeSlice from './TimeSlice';

function FlowChart() {
  const definition = useSelector(
    (state: RootState) => state.data.currentDefinition
  );
  return (
    <div className='opacity-80 bg-gradient-to-br from-purple-600 to-fuchsia-400 rounded-3xl mx-10 flex flex-col items-center shadow-inner'>
      {/* This is the flow chart */}
      <FlowChartView size='size-124' definition={definition} />
      {/* <FlowChartDataSelector /> */}
      <StepFunctionSelector />
      <TimeSlice />
    </div>
  );
}

export default FlowChart;
