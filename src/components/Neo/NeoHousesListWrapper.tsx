'use client';

import React from 'react';
import NeoHousesList from './NeoHousesList';
import { useNeoHouses } from '../../hooks/useNeoHouse';

export default function NeoHousesListWrapper() {
  const { houses, loading, error } = useNeoHouses();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading Neo collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return <NeoHousesList houses={houses} />;
}
