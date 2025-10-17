'use client';

import { useWatchlist } from '@/hooks/useWatchlist';
import useSWR from 'swr';
import { getCoinsMarkets } from '@/services/coingecko';
import { CoinSummary } from '@/types';
import DashboardGrid from '@/components/dashboard/DashboardGrid';

const DashboardPage = () => {
  const { watchlist, isHydrated } = useWatchlist();

  // The API expects a comma-separated string of coin ids
  const watchlistQueryParam = watchlist.join(',');

  const { data: coins, error, isLoading } = useSWR<CoinSummary[]>(
    // Only fetch if the page is hydrated and the watchlist is not empty
    isHydrated && watchlistQueryParam ? ['coinsMarkets', watchlistQueryParam] : null,
    // The key for SWR is the array above, but the fetcher only needs the query param
    () => getCoinsMarkets('usd', 1, watchlistQueryParam),
    {
      refreshInterval: 900000, // 15 minutes
    }
  );

  if (!isHydrated || isLoading) {
    // TODO: Implement Skeleton UI for the grid
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-3 bg-gray-700 rounded-full"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-700 rounded"></div>
                  <div className="h-3 w-12 bg-gray-700 rounded mt-2"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-5 w-20 bg-gray-700 rounded ml-auto"></div>
                <div className="h-4 w-16 bg-gray-700 rounded mt-2 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading data. Please try again later.</div>;
  }
  
  if (!coins || coins.length === 0) {
    return (
      <div className="text-center text-gray-500 py-16">
        <h2 className="text-2xl font-semibold">Your Watchlist is Empty</h2>
        <p className="mt-2">Use the search bar in the header to find and add coins.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      <DashboardGrid coins={coins} />
    </div>
  );
};

export default DashboardPage;
