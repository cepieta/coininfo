'use client';

import { createChart, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { ChartDataPoint } from '@/types';

interface TradingChartProps {
  data: ChartDataPoint[];
}

const TradingChart = ({ data }: TradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null); // Use any to bypass the type error
  const candlestickSeriesRef = useRef<any>(null); // Use any to bypass the type error

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#1f2937' },
          textColor: '#d1d5db',
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#10b981',
        wickDownColor: '#ef4444',
        wickUpColor: '#10b981',
      });
    }

    candlestickSeriesRef.current?.setData(data.map(d => ({...d, time: d.time as UTCTimestamp})));
    
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, 400);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);
  
  useEffect(() => {
    return () => {
        chartRef.current?.remove();
    }
  }, []);

  return <div ref={chartContainerRef} className="w-full" />;
};

export default TradingChart;
