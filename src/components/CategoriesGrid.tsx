'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useCategories } from '../hooks/useCategories';
import { selectCategoriesWithMetadata } from '../store/selectors/categoriesSelectors';
import { useSSRCompatible } from '../hooks/useSSRCompatible';

export default function CategoriesGrid() {
  const isMounted = useSSRCompatible();
  const { categories, loading, error, refresh } = useCategories();
  const categoriesWithMetadata = useSelector(selectCategoriesWithMetadata);

  // Отладочная информация
  console.log('🐛 CategoriesGrid Debug:', {
    isMounted,
    loading,
    error,
    categories,
    categoriesWithMetadata,
    categoriesLength: categoriesWithMetadata?.length
  });

  // На сервере и до монтирования показываем loading state
  if (!isMounted || loading) {
    return (
      <div className="grid grid-cols-1 bg-slate-800 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !categories) {
    return (
      <div className="text-center  text-white">
        <p className="text-xl">Error loading categories</p>
        <p className="text-gray-300 mb-4">{error}</p>
        <button 
          onClick={refresh}
          className="px-4 py-2 bg-slate-700 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {categoriesWithMetadata.map((category) => (
        <Link
          key={category.id}
          href={
            category.id === 'neo' ? '/neo' : 
            category.id === 'premium' ? '/premium' : 
            `/category/${category.id}`
          }
          className="group bg-slate-700 rounded-xl p-8 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          {/* Icon */}
          <div className="text-6xl mb-6 text-center">
            {category.icon}
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 text-center group-hover:text-yellow-200 transition-colors">
            {category.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-100 mb-6 text-center leading-relaxed">
            {category.description}
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-4 text-sm">
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="font-semibold">{category.count} Houses</span>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-6 text-center">
            <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium group-hover:bg-white/30 transition-colors">
              Explore Collection
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
