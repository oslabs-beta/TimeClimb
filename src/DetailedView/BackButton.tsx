import { useNavigate } from "react-router-dom";
import { setLatency, setLatencies } from '../reducers/dataSlice';
import { AppDispatch } from "../../store.tsx";
import { useDispatch } from 'react-redux';


function BackButton() {
  const navigate = useNavigate()
  const dispatch:AppDispatch = useDispatch();

  function goBack(){
    dispatch(setLatency([]))
    dispatch(setLatencies([]))
    navigate('/');
  }
  return <button className="dv-btn" onClick={goBack}>Back</button>;
}

export default BackButton;
