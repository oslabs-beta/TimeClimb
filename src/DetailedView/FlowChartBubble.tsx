import { Handle, Position } from '@xyflow/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  setChartLatencies,
  setBubblePopup,
  setBubbleName,
} from '../reducers/dataSlice';

type BubbleProps = {
  data: {
    metric: number;
    name: string;
    latency: number[];
  };
};

function FlowChartBubble({ data }: BubbleProps) {
  const dispatch: AppDispatch = useDispatch();

  const getColor = (num: number, max: number = 15): string => {
    let red: number;
    let green: number;
    let halfRatio: number;

    if (num <= max / 2) {
      halfRatio = num / (max / 2);
      red = Math.floor(255 * halfRatio);
      green = 255;
    } else {
      halfRatio = ((num - max / 2) / max) * 2;
      red = 255;
      green = Math.floor(255 - 255 * halfRatio);
    }
    return `rgb(${red}, ${green}, 0)`;
  };

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    dispatch(setChartLatencies(data.name));
    dispatch(setBubblePopup(true));
    dispatch(setBubbleName(data.name));
  }

  const latency = useSelector((state: RootState) => state.data.latency);
  let average = 0;
  let color = 'gray';

  if (latency && latency.hasOwnProperty('steps')) {
    average = latency.steps[data.name]?.average || 0;
    color = getColor(average);
  }

  return (
    <button
      className='text-black h-full width-96 p-3 rounded-full shadow-2xl'
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      <Handle type='target' position={Position.Top} />
      <span>{data.name}</span>
      <br></br>
      <span>{average}</span>
      <Handle type='source' position={Position.Bottom} />
    </button>
  );
}

export default FlowChartBubble;
