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
  const timePeriod = useSelector((state: RootState) => state.data.time);
  // console.log('p',latency)


  const latencies = latency.map((item) => item.stepFunctionAverageLatency);
  // const latencies = Array.isArray(latency) ? latency.map((item) => item.stepFunctionAverageLatency) : [];


  Chart.register(...registerables);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    let xValues = latency.map((set) => moment(set.date).format('HH:mm'))
    let timeLabel = '24 Hours'


    if (latency) {
      if (timePeriod == 'days') {
          xValues = latency.map((set) => moment(set.date).format('MM/DD'))
          timeLabel = '7 Days'
      } else if (timePeriod == 'weeks') {
          xValues = latency.map((set) => moment(set.date).format('MM/DD'))
          timeLabel = '12 (Full) Weeks'
      } else if (timePeriod == 'months') {
          xValues = latency.map((set) => moment(set.date).format('MM/YYYY'))
          timeLabel = '12 Months'

      }
    }

    chartInstance.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [
          {
            label: `Latency Overview Across ${timeLabel}`,
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
