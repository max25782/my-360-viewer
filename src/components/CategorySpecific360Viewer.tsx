'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Premium360Tour from './Premium/Premium360Tour';
import Neo360Page from './Neo/Neo360';

import VirtualTourPreviewUniversal from './VirtualTourPreviewUniversal';
import dynamic from 'next/dynamic';

// Динамический импорт для компонентов с зависимостями от браузерного API
const PanoramaViewerRedux = dynamic(() => import('./PanoramaViewerRedux'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-slate-700 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Загрузка 360° просмотра...</p>
      </div>
    </div>
  ),
});

const Neo360Redux = dynamic(() => import('./Neo/Neo360Redux'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 bg-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Загрузка Neo 360° просмотра...</p>
      </div>
    </div>
  ),
});

interface CategorySpecific360ViewerProps {
  category: 'premium' | 'neo' | 'skyline' | string;
  slug: string;
  name?: string;
  description?: string;
  fullView?: boolean;
}

export default function CategorySpecific360Viewer({
  category,
  slug,
  name,
  description,
  fullView = false
}: CategorySpecific360ViewerProps) {
  console.log(`🔍 CategorySpecific360Viewer: Received props - category="${category}", slug="${slug}", name="${name}", fullView=${fullView}`);
  
  const pathname = usePathname();
  const [isTourPage, setIsTourPage] = useState(false);
  
  useEffect(() => {
    // Проверяем, находимся ли мы на странице тура
    setIsTourPage(pathname?.includes('/tour') || false);
  }, [pathname]);
  
  // Определяем, какую категорию показывать
  const normalizedCategory = category.toLowerCase();
  
  // Если мы на странице тура, показываем полный 360 просмотр
  if (isTourPage || fullView) {
    if (normalizedCategory === 'premium') {
      // Use router.back() like Skyline for consistent behavior
      return <PanoramaViewerRedux houseId={slug} />;
    } else if (normalizedCategory === 'neo') {
      return <Neo360Redux />;
    } else {
      // Skyline и другие категории используют PanoramaViewerRedux
      return <PanoramaViewerRedux houseId={slug} />;
    }
  }
  
  // Если мы на обычной странице, показываем превью 360
  if (normalizedCategory === 'premium') {
    return (
      <Premium360Tour 
        houseName={name || slug} 
        houseSlug={slug}
        description={description}
      />
    );
  } else if (normalizedCategory === 'neo') {
    // Проверяем, что slug определен и не является строкой "undefined" или "null"
    if (!slug || slug === 'undefined' || slug === 'null') {
      console.error("CategorySpecific360Viewer: slug is undefined for Neo category!");
      return (
        <div className="py-16 bg-slate-800 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Neo 360° Experience
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Unable to load 360° experience due to missing house identifier.
          </p>
          <a 
            href="/neo"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500"
          >
            Browse Neo Houses
          </a>
        </div>
      );
    }
    
    // Используем Neo360Page с передачей параметров напрямую
    return <Neo360Page slug={slug} name={name} description={description} />;
  } else {
    // Для Skyline и других категорий используем VirtualTourPreviewUniversal
    return (
      <VirtualTourPreviewUniversal 
        houseId={slug}
        houseName={name || slug}
      />
    );
  }
}
