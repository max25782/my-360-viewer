'use client';

import dynamic from 'next/dynamic';

// Динамический импорт клиентского компонента фильтров
const SkylineFilters = dynamic(() => import('@/components/Skyline/SkylineFilters'), { 
  ssr: false,
  loading: () => (
    <div className="bg-sky-800 bg-opacity-90 rounded-lg p-6 shadow-lg animate-pulse">
      <div className="h-6 bg-sky-700 rounded mb-4 w-3/4"></div>
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-sky-700 rounded mb-2 w-1/4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 w-12 bg-sky-700 rounded-full"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-4 bg-sky-700 rounded mb-2 w-1/4"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 w-12 bg-sky-700 rounded-full"></div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-4 bg-sky-700 rounded mb-2 w-1/2"></div>
          <div className="h-6 bg-sky-700 rounded w-full"></div>
        </div>
        <div className="flex justify-between pt-2">
          <div className="h-8 w-20 bg-sky-700 rounded-lg"></div>
          <div className="h-8 w-24 bg-sky-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
});

interface SkylineHouse {
  id: string;
  name: string;
  availableRooms: string[];
  squareFeet?: number;
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

interface SkylineFilterWrapperProps {
  houses: SkylineHouse[];
}

export default function SkylineFilterWrapper({ houses }: SkylineFilterWrapperProps) {
  return <SkylineFilters houses={houses} />;
}

