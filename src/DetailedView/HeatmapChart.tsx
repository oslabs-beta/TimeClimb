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
  const timePeriod = useSelector((state: RootState) => state.data.time);
  

  const placeholderData = [
    {
      date: new Date(),
      steps: { step1: { average: 0 }, step2: { average: 0 } }
    }
  ];

  const currentData = dataset && dataset.length > 0 ? dataset : placeholderData;

  useEffect(() => {
    if (!currentData || currentData.length === 0 || !currentData[0].steps) return;

    let xValues = currentData.map((set) => moment(set.date).format('HH:mm'));
    if (timePeriod === 'days') {
      xValues = currentData.map((set) => moment(set.date).format('MM/DD'));
    } else if (timePeriod === 'weeks') {
      xValues = currentData.map((set) => moment(set.date).format('MM/DD'));
    } else if (timePeriod === 'months') {
      xValues = currentData.map((set) => moment(set.date).format('MM/YYYY'));
    }

    const addLineBreaks = (label: string, maxLength: number) => {
      const words = label.split(" ");
      let line = "";
      const lines = [];

      words.forEach((word) => {
        if ((line + word).length > maxLength) {
          lines.push(line);
          line = "";
        }
        line += word + " ";
      });
      lines.push(line.trim());

      return { original: label, processed: lines.join("<br>") };
    };

    const yValues = Object.keys(currentData[0].steps || {}).map((label) => addLineBreaks(label, 15));
    const zValues = currentData.map((set) =>
      yValues.map((step) => set.steps[step.original]?.average || 0)
    );

    const processedYValues = yValues.map((step) => step.processed);
    const transposedZValues = zValues[0].map((_, colIndex) => zValues.map(row => row[colIndex]));


    const data = [
      {
        x: xValues,
        y: processedYValues,
        z: transposedZValues,
        type: 'heatmap',
        colorscale: [
          [0, '#78fa4c'],
          [1, '#ff4136']
        ],
        showscale: true
      }
    ];

    const layout: { annotations: Annotation[]; title: string; width: number; xaxis: xaxis; yaxis: yaxis } = {
      title: 'Heatmap Overview',
      annotations: [],
      xaxis: { ticks: '', side: 'bottom', zeroline: false, title: 'Time', automargin: true, tickangle: 315 },
      yaxis: { ticks: '', ticksuffix: ' ', autosize: false, automargin: true, title: 'Step Function Action' },
      width: 500,
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
    <div>
      <div ref={plotRef} className="heatMap" />
    </div>
  );
}

export default HeatmapChart;
