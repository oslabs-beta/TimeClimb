import React from 'react';
import TimePeriodToggle from './TimePeriodToggle';
import DataVisualization from './DataVisualization';

function DataContainer() {
  return (
    <div>
      This is the Data Container
      <TimePeriodToggle />
      <DataVisualization />
    </div>
  );
}

export default DataContainer;
