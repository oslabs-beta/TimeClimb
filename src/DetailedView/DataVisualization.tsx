import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Handle } from '@xyflow/react';

function DataVisualization({latency}) {
  const canvasRef = useRef(null);
  let chartInstance = useRef(null); 

  Chart.register(...registerables);

  useEffect(() => {
    const data = latency;
    const labels = [2010, 2011, 2012, 2013, 2014, 2015, 2016];

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Acquisitions by year',
          data
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
