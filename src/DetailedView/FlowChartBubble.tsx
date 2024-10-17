import { Handle, Position } from '@xyflow/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type BubbleProps = {
  data: {
    metric: number;
    name: string;
  };
};

function FlowChartBubble({ data }: BubbleProps) {
  // const red = data.metric;
  // const green = 255 - data.metric;
  const getColor = (num: number, max: number = 15): string => {
    //the score form green to red is between 1 and max
    //colors in rgb
    let red: number;
    let green: number;
    let halfRatio: number;
    //red starts at zero and increases to the half way point remains at 255
    //green starts a 255, starts decreaseing at the half way point
    //const latencies = useSelector((state: RootState) => state.data.latencies);
    if (num <= max / 2) {
      halfRatio = num / (max / 2);
      console.log(halfRatio);
      red = Math.floor(255 * halfRatio);
      green = 255;
    } else {
      halfRatio = ((num - max / 2) / max) * 2;
      console.log(halfRatio);
      red = 255;
      green = Math.floor(255 - 255 * halfRatio);
    }
    return `rgb(${red}, ${green}, 0)`;
  };
  function handleClick() {
    console.log('Click');
  }
  const latency = useSelector((state: RootState) => state.data.latency);
  let average = 0;
  let color = 'white';
  if (latency) {
    if (latency.hasOwnProperty('steps')) {
      average = latency.steps[data.name].average;
      color = getColor(average);
    }
  }
  return (
    <button
      className='chartBubble'
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      <Handle type='target' position={Position.Top} />
      <span>{data.name}</span>
      <span>{average}</span>
      <Handle type='source' position={Position.Bottom} />
    </button>
  );
}

export default FlowChartBubble;
