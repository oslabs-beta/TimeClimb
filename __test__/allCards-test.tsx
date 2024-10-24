import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AllCards from '../src/landingPage/allCards.tsx';
import '@testing-library/jest-dom';

// Mock the FunctionCards component
vi.mock('./FunctionCards', () => ({
  default: ({ name, region, visual, remove, view, definition, id }) => (
    <div data-testid={`function-card-${id}`}>
      <div data-testid={`card-name-${id}`}>{name}</div>
      <div data-testid={`card-region-${id}`}>{region}</div>
    </div>
  ),
}));

// Mock Redux actions
vi.mock('../store/actions', () => ({
  getStepFunctionList: () => ({ type: 'data/getStepFunctionList' }),
  addCard: (sf) => ({ type: 'card/addCard', payload: sf }),
  fetchCards: () => ({ type: 'card/fetchCards' }),
}));

describe('AllCards', () => {
  // Create mock store with initial state
  const createMockStore = (initialState) => {
    return configureStore({
      reducer: {
        card: (state = initialState.card, action) => state,
        data: (state = initialState.data, action) => state,
      },
    });
  };

  const mockStepFunction = {
    name: 'TestFunction',
    region: 'us-west-2',
    definition: { States: {} },
  };

  const mockCard = {
    name: 'TestCard',
    region: 'us-west-2',
    visual: true,
    remove: true,
    view: true,
    definition: { States: {} },
  };

  const defaultState = {
    card: {
      allCards: [],
      status: 'idle',
      currentRegion: null,
    },
    data: {
      stepfunctions: [],
    },
  };

  it('renders without crashing', () => {
    const store = createMockStore(defaultState);
    render(
      <Provider store={store}>
        <AllCards />
      </Provider>
    );
    expect(document.getByClassName('allFunctionCards')).toBeInTheDocument();
  });

  it('displays cards when they exist in state', () => {
    const stateWithCards = {
      card: {
        allCards: [mockCard, { ...mockCard, name: 'TestCard2' }],
        status: 'idle',
        currentRegion: null,
      },
      data: {
        stepfunctions: [],
      },
    };

    const store = createMockStore(stateWithCards);
    render(
      <Provider store={store}>
        <AllCards />
      </Provider>
    );

    expect(screen.getByTestId('function-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('function-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-name-1')).toHaveTextContent('TestCard');
    expect(screen.getByTestId('card-name-2')).toHaveTextContent('TestCard2');
  });

  it('filters cards by region when currentRegion is set', () => {
    const stateWithRegionFilter = {
      card: {
        allCards: [
          { ...mockCard, region: 'us-west-2' },
          { ...mockCard, name: 'TestCard2', region: 'us-east-1' },
        ],
        status: 'idle',
        currentRegion: 'us-west-2',
      },
      data: {
        stepfunctions: [],
      },
    };

    const store = createMockStore(stateWithRegionFilter);
    render(
      <Provider store={store}>
        <AllCards />
      </Provider>
    );

    expect(screen.getByTestId('function-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('function-card-2')).not.toBeInTheDocument();
    expect(screen.getByTestId('card-region-1')).toHaveTextContent('us-west-2');
  });

  it('dispatches getStepFunctionList on mount', () => {
    const store = createMockStore(defaultState);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <AllCards />
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'data/getStepFunctionList'
    }));
  });

  it('dispatches addCard for each stepfunction when stepfunctions update', () => {
    const stateWithStepFunctions = {
      card: {
        allCards: [],
        status: 'idle',
        currentRegion: null,
      },
      data: {
        stepfunctions: [mockStepFunction],
      },
    };

    const store = createMockStore(stateWithStepFunctions);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <AllCards />
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'card/addCard',
      payload: mockStepFunction
    }));
  });

  it('dispatches fetchCards when status is idle', () => {
    const store = createMockStore(defaultState);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <AllCards />
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'card/fetchCards'
    }));
  });

  it('handles empty stepfunctions array', () => {
    const store = createMockStore(defaultState);
    
    render(
      <Provider store={store}>
        <AllCards />
      </Provider>
    );

    expect(screen.getByClassName('allFunctionCards')).toBeInTheDocument();
    expect(screen.queryByTestId('function-card-1')).not.toBeInTheDocument();
  });

  it('handles null currentRegion correctly', () => {
    const stateWithMultipleRegions = {
      card: {
        allCards: [
          { ...mockCard, region: 'us-west-2' },
          { ...mockCard, name: 'TestCard2', region: 'us-east-1' },
        ],
        status: 'idle',
        currentRegion: null,
      },
      data: {
        stepfunctions: [],
      },
    };

    const store = createMockStore(stateWithMultipleRegions);
    render(
      <Provider store={store}>
        <AllCards />
      </Provider>
    );

    // Should show all cards when no region filter
    expect(screen.getByTestId('function-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('function-card-2')).toBeInTheDocument();
  });
});