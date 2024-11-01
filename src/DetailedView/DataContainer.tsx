import TimePeriodToggle from './TimePeriodToggle';
import DataVisualization from './DataVisualization';
import StepDataVisualization from './StepDataVisualization';
import HeatmapChart from './HeatmapChart';
import { useSelector } from 'react-redux';
import { selectData } from '../reducers/dataSlice';

function DataContainer() {
  const data = useSelector(selectData)
  return (
    <div className='dataContainer'>
      {/* This is the Data Container */}
      <TimePeriodToggle />
      <div>
      <DataVisualization />
      </div>
      <div className='heatmapContainer'>
      <HeatmapChart />
      </div>
      {data.bubblePopup && (
          <div className="popupOverlay">
          <StepDataVisualization />
          </div>
      )}

    </div>
  );
}

export default DataContainer;
