import TimePeriodToggle from './TimePeriodToggle';
import DataVisualization from './DataVisualization';
import StepDataVisualization from './StepDataVisualization';

function DataContainer() {
  return (
    <div>
      This is the Data Container
      <TimePeriodToggle />
      <DataVisualization />
      <StepDataVisualization />
    </div>
  );
}

export default DataContainer;
