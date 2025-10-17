'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CoinSummary } from '@/types';
import { useWatchlist } from '@/hooks/useWatchlist';

interface CoinCardProps {
  coin: CoinSummary;
}

const CoinCard = ({ coin }: CoinCardProps) => {
  const { removeCoin } = useWatchlist();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking the button
    e.stopPropagation();
    removeCoin(coin.id);
  };

  return (
    <Link href={`/coin/${coin.id}`} className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center mb-2">
          <Image src={coin.image} alt={coin.name} width={32} height={32} className="mr-3" />
          <div>
            <h3 className="font-bold">{coin.name}</h3>
            <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-gray-500 hover:text-red-500 transition-colors text-xl"
          aria-label={`Remove ${coin.name} from watchlist`}
        >
          &times;
        </button>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">${coin.current_price.toLocaleString()}</p>
        <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {coin.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </Link>
  );
};

export default CoinCard;
