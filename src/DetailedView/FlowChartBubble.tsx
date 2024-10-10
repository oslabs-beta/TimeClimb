import { Handle, Position } from '@xyflow/react';

type BubbleProps = {
  data: {
    metric: number;
    name: string;
  };
};

function FlowChartBubble({ data }: BubbleProps) {
  const red = data.metric;
  const green = 255 - data.metric;
  return (
    <div
      className='chartBubble'
      style={{ backgroundColor: `rgb(${red}, ${green}, 0)` }}
    >
      <Handle type='target' position={Position.Top} />
      <div>{data.name}</div>
      <Handle type='source' position={Position.Bottom} />
    </div>
  );
}

export default FlowChartBubble;
