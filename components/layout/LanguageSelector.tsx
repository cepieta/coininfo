'use client';

import { useUiStore } from '@/store/uiStore';

const LanguageSelector = () => {
  const { locale, setLocale } = useUiStore();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-cyan-500 text-white'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('ko')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          locale === 'ko'
            ? 'bg-cyan-500 text-white'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        KO
      </button>
    </div>
  );
};

export default LanguageSelector;
