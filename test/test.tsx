import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingPage from '../src/landingPage/landingPage.tsx'
import NavBar from  '../src/landingPage/navbar/navBar.tsx'
import AllCard from '../src/landingPage/allCard.tsx';
import AddCard from '../src/landingPage/addCard.tsx';
import FilterRegions from '../src/landingPage/filterRegions.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getStepFunctionList, getStepFunctions } from '../src/reducers/dataSlice.tsx';

// {
//   "name": "BasicsHelloWorldStateMachine",
//   "definition": {
//       "Comment": "An example of the Amazon States Language for scheduling a task.",
//       "StartAt": "Wait for Timer",
//       "States": {
//           "Wait for Timer": {
//               "Type": "Wait",
//               "SecondsPath": "$.timer_seconds",
//               "Next": "Success"
//           },
//           "Success": {
//               "Type": "Succeed"
//           }
//       }
//   }
// }

import FlowChartView from '../src/DetailedView/FlowChartView';
import { ReactFlow } from '@xyflow/react';

// Mock the necessary dependencies
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children }: any) => <div>{children}</div>,
  Controls: () => <div>Mocked Controls</div>,
  Background: () => <div>Mocked Background</div>,
  BackgroundVariant: { Lines: 'lines' },
}));

// Use partial mocking for dagre, only mocking the layout function
vi.mock('@dagrejs/dagre', async () => {
  const actual = await vi.importActual('@dagrejs/dagre'); // Get actual module
  return {
    ...actual, // Spread the actual module to retain other functionality
    layout: vi.fn(), // Mock layout function
  };
});

vi.mock('./FlowChartBubble', () => ({
  default: () => <div>Mocked FlowChartBubble</div>,
}));

describe('FlowChartView Component', () => {
  const mockDefinition = {
    Comment: "An example of the Amazon States Language for scheduling a task.",
    StartAt: "Wait for Timer",
    States: {
      "Wait for Timer": {
        Type: "Wait",
        SecondsPath: "$.timer_seconds",
        Next: "Success",
      },
      Success: {
        Type: "Succeed",
      },
    },
  };

  it('renders without crashing', () => {
    const { getByText } = render(
      <FlowChartView height={500} width={500} definition={mockDefinition} />
    );

    // Check if ReactFlow, Controls, and Background were rendered
    expect(getByText('Mocked Controls')).toBeDefined();
    expect(getByText('Mocked Background')).toBeDefined();
  });
});
