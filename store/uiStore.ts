import { create } from 'zustand';

interface UiState {
  locale: 'en' | 'ko';
  setLocale: (locale: 'en' | 'ko') => void;
}

export const useUiStore = create<UiState>((set) => ({
  locale: 'ko', // Default locale
  setLocale: (locale) => set({ locale }),
}));
