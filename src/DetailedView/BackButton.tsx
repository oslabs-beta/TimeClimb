import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate()
  function goBack(){
    navigate('/');
  }
  return <button onClick={goBack}>Back</button>;
}

export default BackButton;
