'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { getCoinDetail, getCoinOHLC } from '@/services/coingecko';
import { CoinDetail, ChartDataPoint } from '@/types';

// Dynamically import the chart to avoid SSR issues
const TradingChart = dynamic(() => import('@/components/chart/TradingChart'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-800 animate-pulse rounded-md" />,
});

const timeframes = [
  { label: '1D', days: '1' },
  { label: '7D', days: '7' },
  { label: '1M', days: '30' },
  { label: '3M', days: '90' },
  { label: '1Y', days: '365' },
];

const CoinDetailPage = () => {
  const params = useParams();
  const coinId = params.coinId as string;
  const [days, setDays] = useState('7');

  const { data: coin, error: coinError, isLoading: coinIsLoading } = useSWR<CoinDetail>(
    coinId ? ['coinDetail', coinId] : null,
    () => getCoinDetail(coinId)
  );

  const { data: ohlcData, error: ohlcError, isLoading: ohlcIsLoading } = useSWR<ChartDataPoint[]>(
    coinId ? ['coinOHLC', coinId, days] : null,
    () => getCoinOHLC(coinId, days)
  );

  if (coinIsLoading) {
    // TODO: Implement a more detailed skeleton loader for the whole page
    return <div>Loading coin details...</div>;
  }

  if (coinError) {
    return <div>Failed to load coin data. It might be an invalid coin ID.</div>;
  }

  if (!coin) {
    return <div>No data available for this coin.</div>;
  }

  const devData = coin.developer_data;

  return (
    <div>
      <div className="flex items-center mb-6">
        <img src={coin.image} alt={coin.name} className="w-12 h-12 mr-4" />
        <div>
          <h1 className="text-4xl font-bold">{coin.name}</h1>
          <p className="text-xl text-gray-400">{coin.symbol.toUpperCase()}</p>
        </div>
      </div>

      <div className="my-6">
        <p className="text-3xl font-bold">
          ${coin.market_data.current_price.usd.toLocaleString()}
        </p>
      </div>

      {/* Chart Section */}
      <div className="my-8">
        <div className="flex space-x-2 mb-4">
          {timeframes.map(({ label, days: dayValue }) => (
            <button
              key={label}
              onClick={() => setDays(dayValue)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                days === dayValue
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {ohlcIsLoading && <div className="w-full h-[400px] bg-gray-800 animate-pulse rounded-md" />}        {ohlcError && <div className="w-full h-[400px] flex items-center justify-center bg-gray-800 rounded-md text-red-500">Failed to load chart data.</div>}
        {ohlcData && <TradingChart data={ohlcData} />}
      </div>

      {/* On-Chain Data Section */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Developer & Community Data</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Forks</p>
            <p className="text-2xl font-bold">{devData.forks?.toLocaleString() ?? 'N/A'}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Stars</p>
            <p className="text-2xl font-bold">{devData.stars?.toLocaleString() ?? 'N/A'}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Subscribers</p>
            <p className="text-2xl font-bold">{devData.subscribers?.toLocaleString() ?? 'N/A'}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Issues</p>
            <p className="text-2xl font-bold">{devData.total_issues?.toLocaleString() ?? 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">What is {coin.name}?</h2>
        <div dangerouslySetInnerHTML={{ __html: coin.description.en }} />
      </div>
    </div>
  );
};

export default CoinDetailPage;
