'use client';

import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { ChartDataPoint } from '@/types';

interface TradingChartProps {
  data: ChartDataPoint[];
  // Add more props for customization later
}

const TradingChart = ({ data }: TradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    // Create chart instance
    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#1f2937' }, // gray-800
          textColor: '#d1d5db', // gray-300
        },
        grid: {
          vertLines: { color: '#374151' }, // gray-700
          horzLines: { color: '#374151' }, // gray-700
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#10b981', // green-500
        downColor: '#ef4444', // red-500
        borderDownColor: '#ef4444',
        borderUpColor: '#10b981',
        wickDownColor: '#ef4444',
        wickUpColor: '#10b981',
      });
    }

    // Set data
    candlestickSeriesRef.current?.setData(data.map(d => ({...d, time: d.time as UTCTimestamp})));
    
    // Handle resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 400);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      // Do not remove the chart on every re-render, only when component unmounts
      // chartRef.current?.remove();
    };
  }, [data]);
  
  // Final cleanup on unmount
  useEffect(() => {
    return () => {
        chartRef.current?.remove();
    }
  }, []);

  return <div ref={chartContainerRef} className="w-full" />;
};

export default TradingChart;
