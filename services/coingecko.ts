import { CoinDetail, CoinSummary, ChartDataPoint } from '@/types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Generic fetcher for use with SWR
export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    try {
      error.info = await res.json();
    } catch (e) {
      // Ignore if response is not JSON
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
};

// Specific API functions
export const getCoinsMarkets = (currency: string = 'usd', page: number = 1): Promise<CoinSummary[]> => {
  const url = `${API_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=${page}&sparkline=false`;
  return fetcher<CoinSummary[]>(url);
};

export const getCoinDetail = (id: string): Promise<CoinDetail> => {
  const url = `${API_BASE_URL}/coins/${id}`;
  return fetcher<CoinDetail>(url);
};

export const getCoinOHLC = (id: string, days: string = '7', currency: string = 'usd'): Promise<ChartDataPoint[]> => {
  const url = `${API_BASE_URL}/coins/${id}/ohlc?vs_currency=${currency}&days=${days}`;
  // The response from coingecko is an array of arrays, we need to map it
  return fetcher<number[][]>(url).then(data => 
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

export const getCoinsList = (): Promise<CoinListItem[]> => {
    const url = `${API_BASE_URL}/coins/list`;
    return fetcher<CoinListItem[]>(url);
}
