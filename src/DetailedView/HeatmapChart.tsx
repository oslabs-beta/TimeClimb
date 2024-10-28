import React, { useRef, useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../store';


type Annotation = {
  xref: string;
  yref: string;
  x: string;
  y: string;
  text: number;
  font: {
    family: string;
    size: number;
    color: string;
  };
  showarrow: boolean;
};

type xaxis = {
    ticks: string;
    side: string;
    zeroline: boolean;
    title: string;
    automargin: boolean;
    tickangle: number
};

type yaxis = {
    ticks: string;
    ticksuffix: string;
    autosize: boolean;
    automargin: boolean;
    title: string;
    // tickangle: number
};

function HeatmapChart() {

  const dataset = useSelector((state:RootState) => state.data.latencies)
//   console.log('t', dataset)
  const plotRef = useRef(null);

//   const xValues = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K', 'L'];
//   const yValues = ['W', 'X', 'Y', 'Z'];
//   const hourly = [
//     '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00',
//     '09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00',
//     '18:00','19:00','20:00','21:00','22:00','23:00']

//   const dataset = [
//     { name: 'set1', data: [0.00, 0.3, 0.75, 0.75, 0.00, .75,.75,.75,.75,.75,.75] },
//     { name: 'set2', data: [0.00, 0.90, 0.75, 0.75, 0.00] },
//     { name: 'set3', data: [0.75, 0.5, 0.75, 0.3, 0.75] },
//     { name: 'set4', data: [0.8, 0.00, 0.6, 0.3, 0.00] },
//     { name: 'set5', data: [0.00, 0.3, 0.00, 0.4, 0.9] },
//     { name: 'set6', data: [0.3, 0.6, 0.00, 0.75, 0.00] },
//     { name: 'set7', data: [1, 0.00, 0.5, 0.75, 0.7] },
//     { name: 'set8', data: [0.2, 0.00, 0.00, 0.75, 0.5] },

//   ];
useEffect(() => {
  if (dataset && dataset.length > 0) {
  const xValues = dataset.map((set) => moment(set.startTime).format('HH:mm'))
//   console.log('x', xValues)
  const yValues = Object.keys(dataset[0].steps)
//   console.log('y', yValues)

  const zValues = dataset.map((set) =>
    yValues.map((step) => set.steps[step]?.average || 0)
  );
  
  const transposedZValues = zValues[0].map((_, colIndex) => zValues.map(row => row[colIndex]));
  
  const colorscaleValue = [
    [0, '#78fa4c'],
    [1, '#ff4136']
  ];

  const data = [{
    x: xValues,
    y: yValues,
    z: transposedZValues,
    type: 'heatmap',
    colorscale: colorscaleValue,
    showscale: true
  }];

  const layout: { annotations: Annotation[]; title:string; width: number; xaxis:xaxis; yaxis:yaxis} = {
    title: 'Heatmap Overview',
    annotations: [],
    xaxis: {
      ticks: '',
      side: 'bottom',
      zeroline: false,
      title: 'Time',
      automargin: true,
      tickangle: 315
    },
    yaxis: {
      ticks: '',
      ticksuffix: ' ',
      autosize: false,
      automargin: true,
      title: 'Step Function Action',
    //   tickangle: -45

    },
    width: 800
  };
      Plotly.purge(plotRef.current);
      Plotly.newPlot(plotRef.current, data, layout);
    }
  }, [dataset]); 

  if (!dataset || dataset.length < 2) {
    return <div>Loading data...</div>; 
  }

  return (
    <div>
      <div ref={plotRef} className='heatMap' />
    </div>
  );
}

export default HeatmapChart;
