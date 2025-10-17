'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { getCoinsList } from '@/services/coingecko';
import { useWatchlist } from '@/hooks/useWatchlist';

interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
}

const CoinSearch = () => {
  const { data: coinsList, error } = useSWR('coinsList', getCoinsList);
  const { addCoin } = useWatchlist();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CoinListItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 1 && coinsList) {
      const filtered = coinsList
        .filter(
          (coin) =>
            coin.name.toLowerCase().includes(query.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10); // Limit results to 10
      setResults(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query, coinsList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectCoin = (coinId: string) => {
    addCoin(coinId);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-64" ref={searchRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setIsOpen(true)}
        placeholder="Search for a coin..."
        className="w-full px-4 py-2 text-white bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
          {error && <div className="px-4 py-2 text-red-500">Failed to load coins list.</div>}
          {results.length > 0 ? (
            <ul>
              {results.map((coin) => (
                <li
                  key={coin.id}
                  onClick={() => handleSelectCoin(coin.id)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                >
                  {coin.name} ({coin.symbol.toUpperCase()})
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-gray-400">
              {query.length > 1 ? 'No results found.' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoinSearch;
