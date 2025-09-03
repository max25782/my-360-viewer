'use client';

import dynamic from 'next/dynamic';

// Динамически импортируем компонент фильтров без SSR
const PremiumFilters = dynamic(() => import('./PremiumFilters'), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-700 rounded-lg p-6 shadow-lg animate-pulse">
      <div className="h-6 bg-slate-600 rounded mb-4 w-3/4"></div>
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-slate-600 rounded mb-2 w-1/4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-12 bg-slate-600 rounded-full"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-4 bg-slate-600 rounded mb-2 w-1/4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-12 bg-slate-600 rounded-full"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-4 bg-slate-600 rounded mb-2 w-1/2"></div>
          <div className="h-6 bg-slate-600 rounded w-full"></div>
        </div>
        <div className="flex justify-between pt-2">
          <div className="h-8 w-20 bg-slate-600 rounded-lg"></div>
          <div className="h-8 w-24 bg-slate-600 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
});

interface PremiumHouse {
  id: string;
  name: string;
  availableRooms: string[];
  squareFeet?: number;
  filters?: {
    bedrooms?: string;
    bathrooms?: string;
    sqft?: string;
  };
  comparison?: {
    features?: {
      [key: string]: {
        good: string;
        better: string;
        best: string;
      }
    }
  };
}

interface PremiumFilterWrapperProps {
  houses?: PremiumHouse[];
  className?: string;
}

export default function PremiumFilterWrapper({ houses = [], className = '' }: PremiumFilterWrapperProps) {
  return <PremiumFilters houses={houses} className={className} />;
}
