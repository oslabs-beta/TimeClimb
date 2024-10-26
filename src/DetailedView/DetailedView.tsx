import DetailedViewUI from './DetailedViewUI';
import FlowChart from './FlowChart';
import DataContainer from './DataContainer';
import TimeSlice from './TimeSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getLatencies, setLatencies, setLatency } from '../reducers/dataSlice';

function DetailedView() {
  //const [function, setFunction] = useState({});
  const dispatch: AppDispatch = useDispatch();
  // function onclick() {
  //   fetch('/api/step-functions/addStepFunction', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       arn: 'arn:aws:states:us-west-2:703671926773:stateMachine:BasicsHelloWorldStateMachine',
  //     }),
  //   }).then((data) => {
  //     return data.json();
  //   });
  //   // .then((data) => console.log(data));
  // }
  // function getall() {
  //   fetch('api/step-functions').then((data) => {
  //     return data.json();
  //   });
  //   // .then((data) => console.log(data));
  // }
  const definitionID = useSelector(
    (state: RootState) => state.data.currentDefinitionID
  );
  useEffect(() => {
    dispatch(getLatencies(definitionID))
      .unwrap()
      // .then((data) => {
      //   console.log('d',data);
      //   return data;
      // })
      .then((data) => dispatch(setLatencies(data)));
  }, [dispatch, definitionID]);

  return (
    <div className='detailedView'>
      {/* This is the detailed view */}
      <DetailedViewUI />
      <TimeSlice />
      {/* this is just the back button */}
      {/* <button className="dv-btn" onClick={onclick}>Get one</button>
      <button className="dv-btn" onClick={getall}>Get all</button> */}
      <FlowChart />
      <DataContainer />

    </div>
  );
}

export default DetailedView;
