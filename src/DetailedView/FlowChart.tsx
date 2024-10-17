//import React from 'react';
import FlowChartView from './FlowChartView';
import FlowChartDataSelector from './FlowChartDataSelector';
import StepFunctionSelector from './StepFunctionSelector';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

function FlowChart() {
  const definition = useSelector(
    (state: RootState) => state.data.currentDefinition
  );
  return (
    <div>
      This is the flow chart
      <FlowChartView definition={definition} />
      <FlowChartDataSelector />
      <StepFunctionSelector />
    </div>
  );
}

export default FlowChart;
