import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../store';
import {setBubblePopup} from '../reducers/dataSlice';
// import { selectData } from '../reducers/dataSlice';

function StepDataVisualization() {
  const canvasRef = useRef(null);
  let chartInstance = useRef(null);
  const latency = useSelector((state: RootState) => state.data.chartLatencies);
  const times = useSelector((state: RootState) => state.data.latencies);
  const dispatch = useDispatch()
  // console.log('l',latency)

  const startTimes = times.map((item) =>
    moment(item.startTime).format('HH:mm')
  );

    const latencies = latency.map((item) => item.stepFunctionAverageLatency);
    // console.log('hi',latencies)

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
            label: 'Latency Over One Day',
            data: latency,
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

  const handleClick = () => {
    dispatch(setBubblePopup(false))
  }

  return (
    <div className='popupLineGraph'>
      <canvas ref={canvasRef}></canvas>
      <button onClick={handleClick}>Close</button>
    </div>
  );
}

export default StepDataVisualization;
