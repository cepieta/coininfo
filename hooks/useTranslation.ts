import useSWR from 'swr';
import { useUiStore } from '@/store/uiStore';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useTranslation = () => {
  const { locale } = useUiStore();
  const { data: translations, error } = useSWR(`/locales/${locale}.json`, fetcher);

  const t = (key: string, params?: Record<string, string>): string => {
    if (error || !translations) {
      return key; // Return key as fallback
    }
    let translation = translations[key] || key;
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        translation = translation.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    return translation;
  };

  return { t, isLoading: !translations && !error };
};
