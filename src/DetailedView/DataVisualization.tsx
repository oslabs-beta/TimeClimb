import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../store';
// import { selectData } from '../reducers/dataSlice';

function DataVisualization() {
  const canvasRef = useRef(null);
  let chartInstance = useRef(null);
  const latency = useSelector((state: RootState) => state.data.latencies);
  console.log('p',latency)

  const startTimes = latency.map((item) =>
    moment(item.startTime).format('HH:mm')
  );

  const latencies = latency.map((item) => item.stepFunctionAverageLatency);

  Chart.register(...registerables);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: startTimes,
        datasets: [
          {
            label: 'Latency Overview Over One Day',
            data: latencies,
          },
        ],
      },
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
