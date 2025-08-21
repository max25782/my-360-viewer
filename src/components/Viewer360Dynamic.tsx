/**
 * Динамически загружаемый 360° viewer без SSR
 */

'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type Viewer360Type from './Viewer360';

// Динамический импорт без SSR
const Viewer360 = dynamic(() => import('./Viewer360'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-dvh">
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🏠</div>
          <div className="text-gray-600">Загрузка 360° просмотрщика...</div>
        </div>
      </div>
    </div>
  )
});

// Экспортируем обертку с теми же пропсами
type Viewer360Props = ComponentProps<typeof Viewer360Type>;

export default function Viewer360Dynamic(props: Viewer360Props) {
  return <Viewer360 {...props} />;
}
