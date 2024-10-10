import DetailedViewUI from './DetailedViewUI';
import FlowChart from './FlowChart';
import DataContainer from './DataContainer';
import TimeSlice from './TimeSlice';

function DetailedView() {
  return (
    <div>
      This is the detailed view
      <DetailedViewUI />
      <FlowChart />
      <DataContainer />
      <TimeSlice />
    </div>
  );
}

export default DetailedView;
