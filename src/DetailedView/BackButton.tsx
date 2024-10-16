import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate()
  function goBack(){
    navigate('/');
  }
  return <button className="dv-btn" onClick={goBack}>Back</button>;
}

export default BackButton;
