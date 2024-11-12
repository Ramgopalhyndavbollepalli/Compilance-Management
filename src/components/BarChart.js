import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart({ data, options }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Store the chart instance to clean up

  useEffect(() => {
    if (chartInstanceRef.current) {
      // Destroy the previous chart instance if it exists
      chartInstanceRef.current.destroy();
    }

    // Create the new chart instance
    chartInstanceRef.current = new ChartJS(chartRef.current, {
      type: 'bar',
      data,
      options
    });

    // Cleanup on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, options]); // Re-run the effect only if data or options change

  return <canvas ref={chartRef}></canvas>;
}

export default BarChart;
