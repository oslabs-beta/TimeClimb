import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';
import DataVisualization from './DataVisualization';
// import { AppDispatch } from "../../store.tsx";
// import { setAddCardForm } from '../reducers/cardSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectCard } from '../reducers/cardSlice.tsx'


type BubbleProps = {
  data: {
    metric: number;
    name: string;
    latency: number[]
  };
};

function FlowChartBubble({ data }: BubbleProps) {
  const red = data.metric;
  const green = 255 - data.metric;

  const [popup , setPopup] = useState(false)

  // const dispatch:AppDispatch = useDispatch()
  // const chart = useSelector(selectCard)

  function handleClick(e:React.FormEvent) {
    console.log('Click');
    e.preventDefault()
    setPopup(true)
    // dispatch(setAddCardForm())
  }
  return (
    <div>
      <button
        className='chartBubble'
        style={{ backgroundColor: `rgb(${red}, ${green}, 0)` }}
        onClick={handleClick}
      >
        <Handle type='target' position={Position.Top} />
        <div>{data.name}</div>
        <Handle type='source' position={Position.Bottom} />
      </button>

      {popup && <DataVisualization latency={[...data.latency]}/>}

    </div>
  );
}

export default FlowChartBubble;
