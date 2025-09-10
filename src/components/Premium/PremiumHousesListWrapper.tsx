'use client';

import React, { useState, useEffect } from 'react';
import CategoryHousesList from '../CategoryHousesList';

export default function PremiumHousesListWrapper() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку данных
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading premium models...</p>
      </div>
    );
  }

  // Используем существующий CategoryHousesList с category="premium"
  return <CategoryHousesList category="premium" />;
}
