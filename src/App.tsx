// import { useState } from 'react';
import './App.css';
// import DetailedView from './DetailedView/DetailedView';
// import LandingPage from './landingPage/landingPage';npm
// import LoginForm from './loginForm';
// import SignUpForm from './signUpForm';
import { Provider } from 'react-redux';
import DetailedView from './DetailedView/DetailedView.tsx';
import store /*persistor*/ from '../store.tsx';
import LandingPage from './landingPage/landingPage.tsx';
import NavBar from './landingPage/navbar/navBar.tsx';
import Dashboard from './landingPage/Dashboard.tsx';
import DetailedViewContainer from './DetailedView/DetailedViewContainer.tsx';

import { Route, Routes, Link } from 'react-router-dom';
// import { PersistGate } from 'redux-persist/integration/react';

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
    // <>
    //     <Provider store={store}>
    //       {/* <LoginForm /> */}
    //       {/* <SignUpForm />  */}
    //       {/* <DetailedView /> */}
    //       <LandingPage />
    //     </Provider>
    //   </>
    // );
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <Routes>
        {/* <Route path='/*' element={<NavBar/>}> */}
        <Route path='/' element={<Dashboard />} />
        <Route path='/expandView' element={<DetailedViewContainer />}>
          {/*possible to nest comps in here dont know that I will */}
          {/* </Route> */}
        </Route>
      </Routes>
      {/* </PersistGate> */}
    </Provider>
    // </>
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
