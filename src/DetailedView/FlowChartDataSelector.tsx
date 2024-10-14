import { useLocation } from "react-router-dom";


function FlowChartDataSelector() {
  const location = useLocation();
  const { cardName } = location.state
  return (
    <div>
      {cardName}
      This is the flow chart data selector
    </div>
  )
}

export default FlowChartDataSelector;
