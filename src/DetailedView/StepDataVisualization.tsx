import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../store';
import {setBubblePopup} from '../reducers/dataSlice';
import { Background } from '@xyflow/react';
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

  function generateLast24Hours() {
    return Array.from({ length: 24 }, (_, i) =>
      moment().subtract(23 - i, 'hours').format('HH:mm')
    );
  }

  function generateLast7Days() {
    return Array.from({ length: 7 }, (_, i) =>
      moment().subtract(6 - i, 'days').format('MM/DD')
    );
  }

  function generateLast12Weeks() {
    return Array.from({ length: 12 }, (_, i) =>
      moment().subtract(11 - i, 'weeks').format('MM/DD') 
    );
  }

  function generateLast12Months() {
    return Array.from({ length: 12 }, (_, i) =>
      moment().subtract(11 - i, 'months').format('MM/YYYY') 
    );
  }

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    let xValues = generateLast24Hours()
    let timeLabel = '24 Hours'

    if (times) {
      if (timePeriod == 'days') {
          xValues = generateLast7Days()
          timeLabel = '7 Days'
      } else if (timePeriod == 'weeks') {
          xValues = generateLast12Weeks()
          timeLabel = '12 Weeks'
      } else if (timePeriod == 'months') {
          xValues = generateLast12Months()
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
      <button style={{backgroundColor: 'pink'}} onClick={handleClick}>Close</button>
    </div>
  );
}

export default StepDataVisualization;
