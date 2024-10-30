import { useNavigate } from "react-router-dom";
import { setLatency, setLatencies, setBubbleName, setTimeToggle } from '../reducers/dataSlice';
import { AppDispatch } from "../../store.tsx";
import { useDispatch } from 'react-redux';


function BackButton() {
  const navigate = useNavigate()
  const dispatch:AppDispatch = useDispatch();

  function goBack(){
    dispatch(setLatency([]))
    dispatch(setLatencies([]))
    dispatch(setBubbleName(''))
    dispatch(setTimeToggle('hours'))
    navigate('/');
  }
  return <button className="dv-btn" onClick={goBack}>Back</button>;
}

export default BackButton;
