import TimePeriodToggle from './TimePeriodToggle';
import DataVisualization from './DataVisualization';
import StepDataVisualization from './StepDataVisualization';
import HeatmapChart from './HeatmapChart';
import { useSelector } from 'react-redux';
import { selectData } from '../reducers/dataSlice';

function DataContainer() {
  const data = useSelector(selectData)
  return (
    <div>
      {/* This is the Data Container */}
      <TimePeriodToggle />
      <DataVisualization />
      {data.bubblePopup && (
          <div className="popupOverlay">
          <StepDataVisualization />
          </div>
      )}
      <HeatmapChart />
    </div>
  );
}

export default DataContainer;
