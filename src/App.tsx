// import { useState } from 'react';
import './App.css';
// import DetailedView from './DetailedView/DetailedView';
import LandingPage from './landingPage/landingPage';
// import LoginForm from './loginForm';
// import SignUpForm from './signUpForm';
import { Provider } from 'react-redux';
import DetailedView from './DetailedView/DetailedView.tsx';
import store from '../store.tsx';

import {Route, Routes, Link} from "react-router-dom";

function App() {
  // return (
  //   <>
  //     <Provider store={store}>
  //       {/* <LoginForm /> */}
  //       {/* <SignUpForm />  */}
  //       {/* <DetailedView /> */}
  //       <LandingPage />
  //     </Provider>
  //   </>
  // );old

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/expandView" >graph</Link></li>
        </ul>
      </nav>
    <Provider store={store}>
      <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/expandView" element={<DetailedView />}>
            {/*possible to nest comps in here dont know that I will */}
          </Route>
        </Routes>
    </Provider>
  </>
  )
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
