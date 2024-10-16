import DetailedViewUI from './DetailedViewUI';
import FlowChart from './FlowChart';
import DataContainer from './DataContainer';
import TimeSlice from './TimeSlice';
import { useState } from 'react';

function DetailedView() {
  //const [function, setFunction] = useState({});
  function onclick() {
    fetch('/api/step-functions/addStepFunction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arn: 'arn:aws:states:us-west-2:703671926773:stateMachine:BasicsHelloWorldStateMachine',
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => console.log(data));
  }
  function getall() {
    fetch('api/step-functions')
      .then((data) => {
        return data.json();
      })
      .then((data) => console.log(data));
  }
  return (
    <div>
      This is the detailed view
      <button onClick={onclick}>Get one</button>
      <button onClick={getall}>Get all</button>
      <DetailedViewUI />
      <FlowChart />
      <DataContainer />
      <TimeSlice />
    </div>
  );
}

export default DetailedView;
