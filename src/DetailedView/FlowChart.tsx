//import React from 'react';
import FlowChartView from './FlowChartView';
import FlowChartDataSelector from './FlowChartDataSelector';
import StepFunctionSelector from './StepFunctionSelector';

function FlowChart() {
  return (
    <div>
      {/* This is the flow chart */}
      <FlowChartView />
      <FlowChartDataSelector />
      <StepFunctionSelector />
    </div>
  );
}

export default FlowChart;
