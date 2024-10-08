import { Handle, Position } from '@xyflow/react';

function FlowChartBubble({ data }) {
  const red = data.metric;
  const green = 255 - data.metric;
  return (
    <div
      className='chartBubble'
      style={{ backgroundColor: `rgb(${red}, ${green}, 0)` }}
    >
      <Handle type='target' position={Position.Top} />
      <div>{data.metric}</div>
      <Handle type='source' position={Position.Bottom} />
    </div>
  );
}

export default FlowChartBubble;
