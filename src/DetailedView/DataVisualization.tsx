import { useRef, useEffect } from 'react';
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

  const latencies = latency.map((item) =>
    Object.keys(item).length === 0 ? null : item.stepFunctionAverageLatency
  );
  console.log('Function latencies: ', latencies);

  Chart.register(...registerables);

  function generateLast24Hours() {
    return Array.from({ length: 24 }, (_, i) =>
      moment()
        .subtract(23 - i, 'hours')
        .format('HH:mm')
    );
  }

  function generateLast7Days() {
    return Array.from({ length: 7 }, (_, i) =>
      moment()
        .subtract(6 - i, 'days')
        .format('MM/DD')
    );
  }

  function generateLast12Weeks() {
    return Array.from({ length: 12 }, (_, i) =>
      moment()
        .subtract(11 - i, 'weeks')
        .format('MM/DD')
    );
  }

  function generateLast12Months() {
    return Array.from({ length: 12 }, (_, i) =>
      moment()
        .subtract(11 - i, 'months')
        .format('MM/YYYY')
    );
  }

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // let xValues = latency.map((set) => moment(set.date).format('HH:mm'))
    let xValues = generateLast24Hours();
    let timeLabel = '24 Hours';

    if (latency) {
      if (timePeriod == 'days') {
        xValues = generateLast7Days();
        timeLabel = '7 Days';
      } else if (timePeriod == 'weeks') {
        xValues = generateLast12Weeks();
        timeLabel = '12 (Full) Weeks';
      } else if (timePeriod == 'months') {
        xValues = generateLast12Months();
        timeLabel = '12 Months';
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
            fill: false,
          },
        ],
      },
      options: {
        spanGaps: false,
      },
    });

    // return () => {
    //   chartInstance.current.destroy();
    // };
  }, [latency]);

  // function handleClose() {

  // }

  return (
    <div className='my-10 rounded shadow-glow width-auto'>
      <canvas ref={canvasRef}></canvas>
      {/* <button onClick={handleClose}>Close</button> */}
    </div>
  );
}

export default DataVisualization;
