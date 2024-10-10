// import { useState } from 'react';
import './App.css';
// import DetailedView from './DetailedView/DetailedView';
import LandingPage from './landingPage/landingPage';
// import LoginForm from './loginForm';
// import SignUpForm from './signUpForm';
import { Provider } from 'react-redux';
import store from '../store.tsx';

function App() {
  return (
    <>
      <Provider store={store}>
        {/* <LoginForm /> */}
        {/* <SignUpForm />  */}
        <DetailedView />
      </Provider>
    </>
  );
}

export default App;

// app

// login/sign
//     login
//     sign up

// landing
//     nav bar
//         Diff options (home, about us, etc)
//     step function cards
//     add function button

// detailed view
//     UI
//         Back button
//     Flow Chart
//         flowchart view
//             Flowchart elements
//                 Ability to click into and see graph
//         Filter for data to show
//         Select function button
//     Data Container
//         Collapsable menu of diff visualization tools
//             Data visualization tool component
//         Toggle time period button/filter
//     Time Slice
//         Slider with time range
//         Toggle between day/week/month button
