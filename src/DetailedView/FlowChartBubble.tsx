import { Handle, Position } from '@xyflow/react';

type BubbleProps = {
  data: {
    metric: number;
    name: string;
  };
};

function FlowChartBubble({ data }: BubbleProps) {
  // const red = data.metric;
  // const green = 255 - data.metric;
  function handleClick() {
    console.log('Click');
  }
  return (
    <button
      className='chartBubble'
      style={{ backgroundColor: data.metric }}
      onClick={handleClick}
    >
      <Handle type='target' position={Position.Top} />
      <div>{data.name}</div>
      <Handle type='source' position={Position.Bottom} />
    </button>
  );
}

export default FlowChartBubble;
