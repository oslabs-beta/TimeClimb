import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../store';
import {setBubblePopup} from '../reducers/dataSlice';
// import { selectData } from '../reducers/dataSlice';

function StepDataVisualization() {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);
  const latency = useSelector((state: RootState) => state.data.chartLatencies);
  const times = useSelector((state: RootState) => state.data.latencies);
  const timePeriod = useSelector((state: RootState) => state.data.time);
  const bubbleName = useSelector((state: RootState) => state.data.bubbleName);


  const dispatch = useDispatch()

  // console.log('l',latency)


    // const latencies = latency.map((item) => item.stepFunctionAverageLatency);
    // console.log('hi',latencies)

  Chart.register(...registerables);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    let xValues = times.map((set) => moment(set.date).format('HH:mm'))
    let timeLabel = '24 Hours'

    if (times) {
      if (timePeriod == 'days') {
          xValues = times.map((set) => moment(set.date).format('MM/DD'))
          timeLabel = '7 Days'
      } else if (timePeriod == 'weeks') {
          xValues = times.map((set) => moment(set.date).format('MM/DD'))
          timeLabel = '12 (Full) Weeks'
      } else if (timePeriod == 'months') {
          xValues = times.map((set) => moment(set.date).format('MM/YYYY'))
          timeLabel = '12 Months'

      }
    }

    chartInstance.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [
          {
            label: `"${bubbleName}" Latency Across ${timeLabel}`,
            data: latency,
          },
        ],
      },
    });

    // return () => {
    //   chartInstance.current.destroy();
    // };
  }, [latency, timePeriod, times]);

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
