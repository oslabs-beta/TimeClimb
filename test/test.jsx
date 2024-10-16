// sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum.js'

// MyComponent.test.jsx
import { render, screen } from '@testing-library/react';
// import MyComponent from './MyComponent';

// test/simple.test.jsx
function App() {
  return <h1>Hello, Vitest!</h1>;
}

test('Vitest can read React elements', () => {
  const element = <App />;
  expect(element.type).toBe(App); // Checking if the element type is the component
});


test('renders the component', () => {
  render(<div>Hello</div>);
  const element = screen.getByText(/Hello/i); // Find the element
  expect(element).toBeInTheDocument();
});


test('adds 1 + 2 to equal 3', () => {
  expect(1+1).toBe(2)
})