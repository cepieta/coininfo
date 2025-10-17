import { create } from 'zustand';

interface WatchlistState {
  watchlist: string[];
  addCoin: (id: string) => void;
  removeCoin: (id: string) => void;
  setWatchlist: (watchlist: string[]) => void;
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  watchlist: [],
  addCoin: (id) =>
    set((state) => {
      if (state.watchlist.includes(id)) {
        return state;
      }
      return { watchlist: [...state.watchlist, id] };
    }),
  removeCoin: (id) =>
    set((state) => ({
      watchlist: state.watchlist.filter((coinId) => coinId !== id),
    })),
  setWatchlist: (watchlist) => set({ watchlist }),
}));
