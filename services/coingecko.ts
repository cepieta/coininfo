import { CoinDetail, CoinSummary, ChartDataPoint } from '@/types';

// Generic fetcher for use with SWR
export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // You might want to log the error or the response status
    console.error('Fetch error:', res.statusText);
    throw error;
  }
  return res.json();
};

// Specific API functions
export const getCoinsMarkets = (locale: string = 'en', page: number = 1, ids?: string): Promise<CoinSummary[]> => {
  const params = new URLSearchParams({
    locale,
    page: page.toString(),
  });
  if (ids) {
    params.append('ids', ids);
  }
  const url = `/api/coins/markets?${params.toString()}`;
  return fetcher<CoinSummary[]>(url);
};

export const getCoinDetail = (id: string, locale: string = 'en'): Promise<CoinDetail> => {
  const url = `/api/coins/${id}?locale=${locale}`;
  return fetcher<CoinDetail>(url);
};

export const getCoinOHLC = (id: string, days: string = '7', currency: string = 'usd'): Promise<ChartDataPoint[]> => {
  const url = `/api/coins/${id}/ohlc?days=${days}&currency=${currency}`;
  // The response from coingecko is an array of arrays, we need to map it
  return fetcher<any[]>(url).then(data => 
    data.map(point => ({
      time: point[0] / 1000, // Convert ms to seconds for lightweight-charts
      open: point[1],
      high: point[2],
      low: point[3],
      close: point[4],
    }))
  );
};

interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
}

export const getCoinsList = (locale: string = 'en'): Promise<CoinListItem[]> => {
    const url = `/api/coins/list?locale=${locale}`;
    return fetcher<CoinListItem[]>(url);
}
