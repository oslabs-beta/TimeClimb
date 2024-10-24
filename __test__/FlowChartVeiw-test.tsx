import { describe, it, expect, vi, beforeEach,  beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingPage from '../src/landingPage/landingPage.tsx'
import NavBar from  '../src/landingPage/navbar/navBar.tsx'
import AllCard from '../src/landingPage/allCard.tsx';
import AddCard from '../src/landingPage/addCard.tsx';
import FilterRegions from '../src/landingPage/filterRegions.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getStepFunctionList, getStepFunctions } from '../src/reducers/dataSlice.tsx';
import { Provider } from 'react-redux'; // Import Provider
import store from '../store.tsx'

import FlowChartView from '../src/DetailedView/FlowChartView.tsx';


import '@testing-library/jest-dom';

// Mock the external dependencies
vi.mock('@xyflow/react', () => ({
  ReactFlow: vi.fn(({ nodes, edges, children }) => (
    <div data-testid="mock-react-flow">
      <div data-testid="nodes">{JSON.stringify(nodes)}</div>
      <div data-testid="edges">{JSON.stringify(edges)}</div>
      {children}
    </div>
  )),
  Controls: vi.fn(() => <div data-testid="mock-controls">Controls</div>),
  Background: vi.fn(() => <div data-testid="mock-background">Background</div>),
  BackgroundVariant: {
    Lines: 'lines'
  }
}));

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  Provider: ({ children }) => <div>{children}</div>
}));

describe('FlowChartView', () => {
  let nodes;
  let edges;

  // Complex step function definition with various patterns
  const complexDefinition = {
    StartAt: "InitialCheck",
    States: {
      "InitialCheck": {
        Type: "Choice",
        Choices: [
          { Next: "ProcessOrder" },
          { Next: "HandleError" }
        ],
        Default: "HandleError"
      },
      "ProcessOrder": {
        Type: "Parallel",
        Branches: [
          {
            StartAt: "ValidatePayment",
            States: {
              "ValidatePayment": {
                Type: "Task",
                Next: "ProcessPayment"
              },
              "ProcessPayment": {
                Type: "Task",
                End: true
              }
            }
          },
          {
            StartAt: "CheckInventory",
            States: {
              "CheckInventory": {
                Type: "Task",
                Next: "UpdateInventory"
              },
              "UpdateInventory": {
                Type: "Task",
                Next: "NotifyWarehouse"
              },
              "NotifyWarehouse": {
                Type: "Task",
                End: true
              }
            }
          }
        ],
        Next: "FinalizeOrder"
      },
      "HandleError": {
        Type: "Task",
        Next: "NotifySupport"
      },
      "NotifySupport": {
        Type: "Task",
        Catch: [
          {
            ErrorEquals: ["States.ALL"],
            Next: "FinalizeOrder"
          }
        ],
        Next: "FinalizeOrder"
      },
      "FinalizeOrder": {
        Type: "Task",
        End: true
      }
    }
  };

  beforeAll(() => {
    render(
      <FlowChartView 
        height={500} 
        width={500} 
        definition={complexDefinition} 
      />
    );

    const nodesElement = screen.getByTestId('nodes');
    const edgesElement = screen.getByTestId('edges');
    
    nodes = JSON.parse(nodesElement.textContent || '[]');
    edges = JSON.parse(edgesElement.textContent || '[]');
  });

  describe('Basic Path Tests', () => {
    it('creates all expected nodes', () => {
      const expectedNodes = [
        'InitialCheck', 'ProcessOrder', 'HandleError', 
        'NotifySupport', 'FinalizeOrder', 'ValidatePayment', 
        'ProcessPayment', 'CheckInventory', 'UpdateInventory', 
        'NotifyWarehouse'
      ];

      expect(nodes).toHaveLength(expectedNodes.length);
      expectedNodes.forEach(nodeName => {
        expect(nodes.some(node => node.data.name === nodeName)).toBe(true);
      });
    });

    it('verifies simple linear path from HandleError to FinalizeOrder', () => {
      const errorPath = edges.filter(edge => 
        edge.source === 'HandleError' || 
        (edge.source === 'NotifySupport' && edge.target === 'FinalizeOrder')
      );

      expect(errorPath).toHaveLength(2);
      expect(errorPath[0].source).toBe('HandleError');
      expect(errorPath[0].target).toBe('NotifySupport');
      expect(errorPath[1].source).toBe('NotifySupport');
      expect(errorPath[1].target).toBe('FinalizeOrder');
    });
  });

  describe('Choice State Tests', () => {
    it('creates correct edges for Choice state', () => {
      const choiceEdges = edges.filter(edge => edge.source === 'InitialCheck');
      
      expect(choiceEdges).toHaveLength(2);
      expect(choiceEdges.some(edge => edge.target === 'ProcessOrder')).toBe(true);
      expect(choiceEdges.some(edge => edge.target === 'HandleError')).toBe(true);
    });
  });

  describe('Parallel State Tests', () => {
    it('verifies parallel state structure', () => {
      // Test parallel state connections to start of each branch
      const branchStartEdges = edges.filter(edge => 
        edge.source === 'ProcessOrder' && 
        ['ValidatePayment', 'CheckInventory'].includes(edge.target)
      );
      expect(branchStartEdges).toHaveLength(2);

      // Test that terminal nodes of parallel branches connect to Next state
      const terminalNodeEdges = edges.filter(edge => 
        (edge.source === 'ProcessPayment' || edge.source === 'NotifyWarehouse') &&
        edge.target === 'FinalizeOrder'
      );
      expect(terminalNodeEdges).toHaveLength(2);
    });

    it('creates correct structure for payment processing branch', () => {
      const paymentBranchEdges = edges.filter(edge => 
        edge.source === 'ValidatePayment' || 
        edge.source === 'ProcessPayment'
      );

      expect(paymentBranchEdges).toHaveLength(2); // One for internal connection, one for connection to FinalizeOrder
      expect(paymentBranchEdges.some(edge => 
        edge.source === 'ValidatePayment' && edge.target === 'ProcessPayment'
      )).toBe(true);
      expect(paymentBranchEdges.some(edge => 
        edge.source === 'ProcessPayment' && edge.target === 'FinalizeOrder'
      )).toBe(true);
    });

    it('creates correct structure for inventory management branch', () => {
      const inventoryBranchEdges = edges.filter(edge => 
        ['CheckInventory', 'UpdateInventory', 'NotifyWarehouse'].includes(edge.source)
      );

      expect(inventoryBranchEdges).toHaveLength(3); // Two internal connections, one to FinalizeOrder
      expect(inventoryBranchEdges.some(edge => 
        edge.source === 'CheckInventory' && edge.target === 'UpdateInventory'
      )).toBe(true);
      expect(inventoryBranchEdges.some(edge => 
        edge.source === 'UpdateInventory' && edge.target === 'NotifyWarehouse'
      )).toBe(true);
      expect(inventoryBranchEdges.some(edge => 
        edge.source === 'NotifyWarehouse' && edge.target === 'FinalizeOrder'
      )).toBe(true);
    });
  });

  describe('Error Handling Tests', () => {
    it('creates correct edges for Catch conditions', () => {
      const catchEdges = edges.filter(edge => 
        edge.source === 'NotifySupport' && 
        edge.target === 'FinalizeOrder'
      );

      expect(catchEdges).toHaveLength(1);
    });
  });

});