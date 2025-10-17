'use client';

import Link from 'next/link';
import CoinSearch from '@/components/search/CoinSearch';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-cyan-400">
            CoinVibe
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <CoinSearch />
        </div>
      </div>
    </header>
  );
};

export default Header;