import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useMemo } from 'react';
import FlowChartBubble from './FlowChartBubble';

type FlowChartNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { metric: number; name: string };
};
//{ id: 'e1-2', source: '1', target: '2' }
type FlowChartEdge = {
  id: string;
  source: string;
  target: string;
};

function FlowChartView() {
  const nodeTypes = useMemo(() => ({ flowChartBubble: FlowChartBubble }), []);

  const exampleFunction = {
    Comment:
      'A Hello World example demonstrating various state types of the Amazon States Language. It is composed of flow control states only, so it does not need resources to run.',
    StartAt: 'Pass',
    States: {
      Pass: {
        Comment:
          'A Pass state passes its input to its output, without performing work. They can also generate static JSON output, or transform JSON input using filters and pass the transformed data to the next state. Pass states are useful when constructing and debugging state machines.',
        Type: 'Pass',
        Result: {
          IsHelloWorldExample: true,
        },
        Next: 'Hello World example?',
      },
      'Hello World example?': {
        Comment:
          'A Choice state adds branching logic to a state machine. Choice rules can implement many different comparison operators, and rules can be combined using And, Or, and Not',
        Type: 'Choice',
        Choices: [
          {
            Variable: '$.IsHelloWorldExample',
            BooleanEquals: true,
            Next: 'Yes',
          },
          {
            Variable: '$.IsHelloWorldExample',
            BooleanEquals: false,
            Next: 'No',
          },
        ],
        Default: 'Yes',
      },
      Yes: {
        Type: 'Pass',
        Next: 'Wait 3 sec',
      },
      No: {
        Type: 'Fail',
        Cause: 'Not Hello World',
      },
      'Wait 3 sec': {
        Comment:
          'A Wait state delays the state machine from continuing for a specified time.',
        Type: 'Wait',
        Seconds: 3,
        Next: 'Parallel State',
      },
      'Parallel State': {
        Comment:
          'A Parallel state can be used to create parallel branches of execution in your state machine.',
        Type: 'Parallel',
        Next: 'Hello World',
        Branches: [
          {
            StartAt: 'Hello',
            States: {
              Hello: {
                Type: 'Pass',
                End: true,
              },
            },
          },
          {
            StartAt: 'World',
            States: {
              World: {
                Type: 'Pass',
                End: true,
              },
            },
          },
        ],
      },
      'Hello World': {
        Type: 'Pass',
        End: true,
      },
    },
  };

  const initialNodes: FlowChartNode[] = [];
  const initialEdges: FlowChartEdge[] = [];

  function createStepFunctionFlowchart(
    data,
    coordinates = { x: 0, y: 0 }
  ): void {
    //let { x, y } = coordinates;
    //Count for choices
    let choiceCount = 0;
    let xOffset = 0;
    //Get the states of the data
    const States = data.States;
    for (const state in States) {
      //Create a new flowchart node with the same name and add it to the list
      const newNode: FlowChartNode = {
        id: state,
        type: 'flowChartBubble',
        position: { x: coordinates.x, y: coordinates.y },
        data: { metric: Math.floor(Math.random() * 255), name: state },
      };
      initialNodes.push(newNode);
      if (choiceCount > 1) {
        //Shift the positions of nodes horizontally when generating choices
        coordinates.x += 200;
        choiceCount--;
      } else {
        coordinates.x = xOffset;
        coordinates.y += 100;
      }
      if (States[state].Type === 'Choice') {
        choiceCount = States[state].Choices.length;
        coordinates.x = -((choiceCount - 1) * 100);
        xOffset = -((choiceCount - 1) * 100);
        //Create a new edge for each choice
        for (let i = 0; i < States[state].Choices.length; i++) {
          const newEdge = {
            id: `${state}-${States[state].Choices[i].Next}`,
            source: state,
            target: States[state].Choices[i].Next,
          };
          initialEdges.push(newEdge);
        }
      }
      if (States[state].Type === 'Parallel') {
        coordinates.x = -((States[state].Branches.length - 1) * 100) + xOffset;
        for (let i = 0; i < States[state].Branches.length; i++) {
          const newEdge = {
            id: `${state}-${States[state].Branches[i].StartAt}`,
            source: state,
            target: States[state].Branches[i].StartAt,
          };
          console.log(newEdge);
          initialEdges.push(newEdge);
          let originalY = coordinates.y;
          createStepFunctionFlowchart(States[state].Branches[i], coordinates);
          coordinates.y = originalY;
          coordinates.x += 100;
        }
        coordinates.y += 100;
        coordinates.x = xOffset;
      }
      const newEdge = {
        id: `${state}-${States[state].Next}`,
        source: state,
        target: States[state].Next,
      };
      initialEdges.push(newEdge);
      console.log(newNode);
    }
  }

  useEffect(() => {
    createStepFunctionFlowchart(exampleFunction);
  }, []);

  // const initialNodea = [
  //   {
  //     id: '1',
  //     type: 'flowChartBubble',
  //     position: { x: 0, y: 0 },
  //     data: { label: '1', metric: '255' },
  //   },
  //   {
  //     id: '2',
  //     type: 'flowChartBubble',
  //     position: { x: 0, y: 100 },
  //     data: { label: '2', metric: '0' },
  //   },
  //   {
  //     id: '3',
  //     type: 'flowChartBubble',
  //     position: { x: 100, y: 200 },
  //     data: { label: '3', metric: '100' },
  //   },
  //   {
  //     id: '4',
  //     type: 'flowChartBubble',
  //     position: { x: -100, y: 200 },
  //     data: { label: '4', metric: '125' },
  //   },
  //   {
  //     id: '5',
  //     type: 'flowChartBubble',
  //     position: { x: 200, y: 300 },
  //     data: { label: '5', metric: '200' },
  //   },
  //   {
  //     id: '6',
  //     type: 'flowChartBubble',
  //     position: { x: 0, y: 300 },
  //     data: { label: '6', metric: '50' },
  //   },
  //   {
  //     id: '7',
  //     type: 'flowChartBubble',
  //     position: { x: -200, y: 300 },
  //     data: { label: '7', metric: '69' },
  //   },
  //   {
  //     id: '8',
  //     type: 'flowChartBubble',
  //     position: { x: 0, y: 400 },
  //     data: { label: '8', metric: '240' },
  //   },
  // ];
  // const initialEdges = [
  //   { id: 'e1-2', source: '1', target: '2' },
  //   { id: 'e2-4', source: '2', target: '4' },
  //   { id: 'e2-3', source: '2', target: '3' },
  //   { id: 'e4-7', source: '4', target: '7' },
  //   { id: 'e4-6', source: '4', target: '6' },
  //   { id: 'e3-6', source: '3', target: '6' },
  //   { id: 'e3-5', source: '3', target: '5' },
  //   { id: 'e7-8', source: '7', target: '8' },
  //   { id: 'e6-8', source: '6', target: '8' },
  //   { id: 'e5-8', source: '5', target: '8' },
  // ];
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
