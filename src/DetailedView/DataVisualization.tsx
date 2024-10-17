import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { useSelector } from 'react-redux';
// import { selectData } from '../reducers/dataSlice';

function DataVisualization() {
  const canvasRef = useRef(null);
  let chartInstance = useRef(null); 
  const latency = useSelector((state) => state.data.latency)

  const dateLabels: string[] = []

  Chart.register(...registerables);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [{
          label: 'Acquisitions by year',
          data: latency
        }]
      }
    });

    // return () => {
    //   chartInstance.current.destroy();
    // };
  }, [latency]);  

  // function handleClose() {

  // }

  return (
    <div className='rightSideLineGraph'>
      <canvas ref={canvasRef}></canvas>
      {/* <button onClick={handleClose}>Close</button> */}
    </div>
  );
}

export default DataVisualization;
