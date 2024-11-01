import NavBar from './navbar/navBar.tsx';
import AllCard from './allCards.tsx';
import AddCard from './addCard.tsx';
import FilterRegions from './filterRegions.tsx';
import {
  getStepFunctionList,
  getStepFunctions,
} from '../reducers/dataSlice.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store.tsx';
import { RootState } from '../../store.tsx';
import { useEffect } from 'react';
// import StepFunctionInput from "./stepFunctionInput";

function LandingPage() {
  const dispatch = useDispatch<AppDispatch>();

  dispatch(getStepFunctionList())
    .unwrap()
    //.then((data) => console.log(data))
    .then((data) => {
      dispatch(getStepFunctions(data));
    });

  return (
    <div className='landingPage'>
      {/* <FilterRegions /> */}
      <AddCard />
      {/* <StepFunctionInput /> */}
      <AllCard />
      {/* This is the Landing Page */}
    </div>
  );
}

export default LandingPage;
