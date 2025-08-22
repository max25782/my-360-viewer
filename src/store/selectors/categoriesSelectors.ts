/**
 * CATEGORIES REDUX SELECTORS
 * Мемоизированные селекторы для категорий домов
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selectors
const selectCategoriesState = (state: RootState) => state.categories;

// Basic selectors
export const selectCategoriesData = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState.data
);

export const selectCategoriesLoading = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState.loading
);

export const selectCategoriesError = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState.error
);

export const selectCategoriesLastUpdated = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState.lastUpdated
);

// Computed selectors
export const selectCategories = createSelector(
  [selectCategoriesData],
  (data) => data?.categories || []
);

export const selectTotalHouses = createSelector(
  [selectCategoriesData],
  (data) => data?.totalHouses || 0
);

export const selectCategoryById = (categoryId: string) =>
  createSelector(
    [selectCategories],
    (categories) => categories.find(cat => cat.id === categoryId)
  );

export const selectCategoryCount = (categoryId: string) =>
  createSelector(
    [selectCategoryById(categoryId)],
    (category) => category?.count || 0
  );

// UI helper selectors
export const selectCategoriesWithMetadata = createSelector(
  [selectCategories],
  (categories) => categories.map(category => ({
    ...category,
    // Добавляем UI метаданные если нужно
    gradient: getGradientForCategory(category.id),
    hoverGradient: getHoverGradientForCategory(category.id),
    icon: getIconForCategory(category.id)
  }))
);

// Проверка готовности данных
export const selectAreCategoriesReady = createSelector(
  [selectCategoriesLoading, selectCategoriesData, selectCategoriesError],
  (loading, data, error) => !loading && !!data && !error
);

// Проверка нужности обновления кэша
export const selectShouldRefreshCategories = createSelector(
  [selectCategoriesState],
  (categoriesState) => {
    if (!categoriesState.data || categoriesState.error) return true;
    
    const cacheAge = Date.now() - categoriesState.lastUpdated;
    return cacheAge > categoriesState.cacheTimeout;
  }
);

// Cache stats для отладки
export const selectCategoriesCacheStats = createSelector(
  [selectCategoriesState],
  (categoriesState) => {
    const cacheAge = Date.now() - categoriesState.lastUpdated;
    
    return {
      hasData: !!categoriesState.data,
      cacheAge: Math.floor(cacheAge / 1000), // seconds
      cacheTimeout: Math.floor(categoriesState.cacheTimeout / 1000), // seconds
      isStale: cacheAge > categoriesState.cacheTimeout,
      lastUpdated: new Date(categoriesState.lastUpdated).toISOString()
    };
  }
);

// Helper functions для UI метаданных
function getGradientForCategory(categoryId: string): string {
  const gradients: Record<string, string> = {
    'A': 'from-blue-600 to-indigo-700',
    'B': 'from-purple-600 to-violet-700',
    'C': 'from-emerald-600 to-teal-700'
  };
  return gradients[categoryId] || 'from-gray-600 to-gray-700';
}

function getHoverGradientForCategory(categoryId: string): string {
  const hoverGradients: Record<string, string> = {
    'A': 'hover:from-blue-700 hover:to-indigo-800',
    'B': 'hover:from-purple-700 hover:to-violet-800',
    'C': 'hover:from-emerald-700 hover:to-teal-800'
  };
  return hoverGradients[categoryId] || 'hover:from-gray-700 hover:to-gray-800';
}

function getIconForCategory(categoryId: string): string {
  const icons: Record<string, string> = {
    'A': '🏠',
    'B': '🏘️',
    'C': '🏛️'
  };
  return icons[categoryId] || '🏠';
}
