'use client';

import dynamic from 'next/dynamic';

// Динамический импорт клиентского компонента фильтров
const NeoFilters = dynamic(() => import('@/components/Neo/NeoFilters'), { ssr: false });

interface NeoHouse {
  id: string;
  name: string;
  availableRooms: string[];
  squareFeet?: number;
}

interface NeoFilterWrapperProps {
  houses: NeoHouse[];
  className?: string;
}

export default function NeoFilterWrapper({ houses, className = '' }: NeoFilterWrapperProps) {
  return <NeoFilters houses={houses} className={className} />;
}
