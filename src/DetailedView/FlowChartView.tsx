import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo } from 'react';
import FlowChartBubble from './FlowChartBubble';

function FlowChartView() {
  const nodeTypes = useMemo(() => ({ flowChartBubble: FlowChartBubble }), []);

  const initialNodea = [
    {
      id: '1',
      type: 'flowChartBubble',
      position: { x: 0, y: 0 },
      data: { label: '1', metric: '255' },
    },
    {
      id: '2',
      type: 'flowChartBubble',
      position: { x: 0, y: 100 },
      data: { label: '2', metric: '0' },
    },
    {
      id: '3',
      type: 'flowChartBubble',
      position: { x: 100, y: 200 },
      data: { label: '3', metric: '100' },
    },
    {
      id: '4',
      type: 'flowChartBubble',
      position: { x: -100, y: 200 },
      data: { label: '4', metric: '125' },
    },
    {
      id: '5',
      type: 'flowChartBubble',
      position: { x: 200, y: 300 },
      data: { label: '5', metric: '200' },
    },
    {
      id: '6',
      type: 'flowChartBubble',
      position: { x: 0, y: 300 },
      data: { label: '6', metric: '50' },
    },
    {
      id: '7',
      type: 'flowChartBubble',
      position: { x: -200, y: 300 },
      data: { label: '7', metric: '69' },
    },
    {
      id: '8',
      type: 'flowChartBubble',
      position: { x: 0, y: 400 },
      data: { label: '8', metric: '240' },
    },
  ];
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e4-7', source: '4', target: '7' },
    { id: 'e4-6', source: '4', target: '6' },
    { id: 'e3-6', source: '3', target: '6' },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e7-8', source: '7', target: '8' },
    { id: 'e6-8', source: '6', target: '8' },
    { id: 'e5-8', source: '5', target: '8' },
  ];
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={initialNodea}
        edges={initialEdges}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Lines} gap={25} size={4} />
      </ReactFlow>
    </div>
  );
}

export default FlowChartView;
