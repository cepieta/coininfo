import { CoinSummary } from '@/types';
import CoinCard from './CoinCard';

interface DashboardGridProps {
  coins: CoinSummary[];
}

const DashboardGrid = ({ coins }: DashboardGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {coins.map((coin) => (
        <CoinCard key={coin.id} coin={coin} />
      ))}
    </div>
  );
};

export default DashboardGrid;
