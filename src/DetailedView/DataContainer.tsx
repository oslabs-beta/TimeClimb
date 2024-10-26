import TimePeriodToggle from './TimePeriodToggle';
import DataVisualization from './DataVisualization';
import StepDataVisualization from './StepDataVisualization';
import HeatmapChart from './HeatmapChart';

function DataContainer() {
  return (
    <div>
      {/* This is the Data Container */}
      <TimePeriodToggle />
      <DataVisualization />
      <StepDataVisualization />
      <HeatmapChart />
    </div>
  );
}

export default DataContainer;
