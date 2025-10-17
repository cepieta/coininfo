import { useEffect, useState } from 'react';
import { useWatchlistStore } from '@/store/watchlistStore';

const STORAGE_KEY = 'coin-watchlist';

export const useWatchlist = () => {
  const { watchlist, addCoin: zustandAdd, removeCoin: zustandRemove, setWatchlist } = useWatchlistStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hydrate the store from localStorage on mount
    try {
      const storedWatchlist = localStorage.getItem(STORAGE_KEY);
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
    }
    setIsHydrated(true);
  }, [setWatchlist]);

  useEffect(() => {
    // Persist to localStorage whenever the watchlist changes, but only after hydration
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
      } catch (error) {
        console.error("Failed to save watchlist to localStorage", error);
      }
    }
  }, [watchlist, isHydrated]);

  const addCoin = (id: string) => {
    zustandAdd(id);
  };

  const removeCoin = (id: string) => {
    zustandRemove(id);
  };

  // Return an empty array on the server or before hydration
  const safeWatchlist = isHydrated ? watchlist : [];

  return { watchlist: safeWatchlist, addCoin, removeCoin, isHydrated };
};
