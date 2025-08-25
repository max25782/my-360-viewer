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
}

export default function NeoFilterWrapper({ houses }: NeoFilterWrapperProps) {
  return <NeoFilters houses={houses} />;
}
