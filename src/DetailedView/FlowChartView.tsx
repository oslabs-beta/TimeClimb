import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  BuiltInNode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useMemo, useState } from 'react';
import FlowChartBubble from './FlowChartBubble';
import dagre, { Node } from '@dagrejs/dagre';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';

type FlowChartNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { metric: number; name: string | undefined };
};
//{ id: 'e1-2', source: '1', target: '2' }
type FlowChartEdge = {
  id: string;
  source: string;
  target: string;
};

type NodesAndEdges = {
  nodes: FlowChartNode[];
  edges: FlowChartEdge[];
};

function FlowChartView({ definition }) {
  const nodeTypes = useMemo(() => ({ flowChartBubble: FlowChartBubble }), []);
  // const [initialNodes, setInitialNodes] = useState<FlowChartNode[]>([]);
  // const [initialEdges, setInitialEdges] = useState<FlowChartEdge[]>([]);

  var g = new dagre.graphlib.Graph();

  g.setGraph({});

  g.setDefaultEdgeLabel(function () {
    return {};
  });

  function createFlowchart(g, data) {
    if (!data) return { nodes: [], edges: [] };
    function createGraph(g, subgraph, next?) {
      for (const state in subgraph.States) {
        g.setNode(state, { label: state, width: 100, height: 100 });
        if (
          subgraph.States[state].Next &&
          !(subgraph.States[state].Type === 'Parallel')
        )
          g.setEdge(state, subgraph.States[state].Next);

        if (subgraph.States[state].Catch) {
          subgraph.States[state].Catch.forEach((ele) => {
            g.setEdge(state, ele.Next);
          });
        }

        if (subgraph.States[state].Type === 'Choice') {
          subgraph.States[state].Choices.forEach((ele) => {
            g.setEdge(state, ele.Next);
          });
        }
        if (subgraph.States[state].Type === 'Parallel') {
          subgraph.States[state].Branches.forEach((ele) => {
            createGraph(g, ele, subgraph.States[state].Next);
            g.setEdge(state, ele.StartAt);
          });
        }
        if (subgraph.States[state].End && next) {
          g.setEdge(state, next);
        }
      }
    }
    createGraph(g, data);

    dagre.layout(g);

    const initialNodes = [];
    const initialEdges = [];

    g.nodes().forEach(function (v) {
      let data = 0;
      const newNode = {
        id: g.node(v).label,
        type: 'flowChartBubble',
        position: { x: g.node(v).x, y: g.node(v).y },
        data: {
          metric: data, //latency, //Math.floor(Math.random() * 255),
          name: g.node(v).label,
        },
      };
      initialNodes.push(newNode);
    });

    g.edges().forEach(function (e) {
      const newEdge = {
        id: `${e.v}->${e.w}`,
        source: e.v,
        target: e.w,
      };
      initialEdges.push(newEdge);
    });
    return { nodes: initialNodes, edges: initialEdges };
  }

  const results = createFlowchart(g, definition);
  const initialNodes = results.nodes;
  const initialEdges = results.edges;

  return (
    <div id='graph-style' style={{ width: 500, height: 500 }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background variant={BackgroundVariant.Lines} gap={25} size={4} />
      </ReactFlow>
    </div>
  );
}

export default FlowChartView;
