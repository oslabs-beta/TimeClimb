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
  tickangle: number;
};

type yaxis = {
  ticks: string;
  ticksuffix: string;
  autosize: boolean;
  automargin: boolean;
  title: string;
};

function HeatmapChart() {
  const plotRef = useRef(null);
  const dataset = useSelector((state: RootState) => state.data.latencies);
  console.log('dat',dataset)
  const timePeriod = useSelector((state: RootState) => state.data.time);

  const placeholderData = [
    {
      date: new Date(),
      steps: { step1: { average: 0 }, step2: { average: 0 } },
    },
  ];

  const currentData = dataset && dataset.length > 0 ? dataset : placeholderData;

  // function generateLast24Hours() {
  //   return Array.from({ length: 24 }, (_, i) =>
  //     moment()
  //       .subtract(23 - i, 'hours')
  //       .format('HH:mm')
  //   );
  // }
  function generateTimes() {
    return Array.from({ length: 24 }, (_, i) => 
      `${String(i).padStart(2, '0')}:00`
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
    if (!currentData || currentData.length === 0) return;
    let xValues;
    // let xValues = currentData.map((set) => moment(set.date).format('HH:mm'));
    if (timePeriod === 'hours') {
      // xValues = generateLast24Hours();
      xValues = generateTimes();

    }
    if (timePeriod === 'days') {
      xValues = generateLast7Days();
    } else if (timePeriod === 'weeks') {
      xValues = generateLast12Weeks();
    } else if (timePeriod === 'months') {
      xValues = generateLast12Months();
    }

    const addLineBreaks = (label: string, maxLength: number) => {
      const words = label.split(' ');
      let line = '';
      const lines = [];

      words.forEach((word) => {
        if ((line + word).length > maxLength) {
          lines.push(line);
          line = '';
        }
        line += word + ' ';
      });
      lines.push(line.trim());

      return { original: label, processed: lines.join('<br>') };
    };
    const validData = currentData.find((set) => set.steps);
    const yValues = Object.keys(validData.steps).map((label) =>
      addLineBreaks(label, 15)
    );
    const zValues = currentData.map((set) =>
      yValues.map((step) => {
        /*set.steps[step.original]?.average || 0*/
        if (set.steps && set.steps[step.original]) {
          return set.steps[step.original].average;
        }
        return null;
      })
    );

    const processedYValues = yValues.map((step) => step.processed);
    const transposedZValues = zValues[0].map((_, colIndex) =>
      zValues.map((row) => row[colIndex])
    );

    const data = [
      {
        x: xValues,
        y: processedYValues,
        z: transposedZValues,
        type: 'heatmap',
        colorscale: [
          [0, '#78fa4c'],
          [1, '#ff4136'],
        ],
        showscale: true,
      },
    ];

    const layout: {
      annotations: Annotation[];
      title: string;
      width: number;
      xaxis: xaxis;
      yaxis: yaxis;
    } = {
      title: 'Heatmap Overview',
      annotations: [],
      xaxis: {
        ticks: '',
        side: 'bottom',
        zeroline: false,
        title: 'Time',
        automargin: true,
        tickangle: 315,
      },
      yaxis: {
        ticks: '',
        ticksuffix: ' ',
        autosize: false,
        automargin: true,
        title: 'Step Function Action',
      },
      width: '100%',
      // plot_bgcolor: 'black',
      paper_bgcolor: 'rgb(172,104,197)',
      //   'opacity-80 bg-gradient-to-br from-purple-600 to-fuchsia-400 rounded-3xl mx-10',
      // plot_bgcolor: 'rgba(0,0,0,0)',
      // paper_bgcolor: 'rgba(0,0,0,0)',
    };

    if (plotRef.current) {
      Plotly.newPlot(plotRef.current, data, layout);
    }

    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [currentData, timePeriod]);

  return (
    <div className='heatmapChart'>
      <div ref={plotRef} />
    </div>
  );
}

export default HeatmapChart;
