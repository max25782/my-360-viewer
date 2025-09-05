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
  (data) => {
    // Определяем все ожидаемые категории
    const expectedCategories = ['skyline', 'neo', 'premium'];
    
    if (!data?.categories) {
      // Если данных нет, возвращаем пустые категории
      return expectedCategories.map(id => ({
        id: id as any,
        title: getTitleForCategory(id),
        description: getDescriptionForCategory(id),
        count: 0
      }));
    }
    
    // Преобразуем объект категорий в массив
    const apiCategories = Object.values(data.categories);
    
    // Добавляем отсутствующие категории
    const result = expectedCategories.map(expectedId => {
      const existing = apiCategories.find((cat: any) => cat.id === expectedId);
      return existing || {
        id: expectedId as any,
        title: getTitleForCategory(expectedId),
        description: getDescriptionForCategory(expectedId),
        count: 0
      };
    });
    
    return result;
  }
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
  (categories) => {
    console.log('🐛 Selector Debug - categories:', categories);
    
    const result = categories.map(category => ({
      ...category,
      // Добавляем UI метаданные если нужно
      title: getTitleForCategory(category.id, category.title),
      description: getDescriptionForCategory(category.id, category.description),
      gradient: getGradientForCategory(category.id),
      hoverGradient: getHoverGradientForCategory(category.id),
      icon: getIconForCategory(category.id)
    }));
    
    console.log('🐛 Selector result:', result);
    return result;
  }
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
    'A': 'from-sky-600 to-blue-800',
    'B': 'from-indigo-600 to-purple-800', 
    'C': 'from-emerald-600 to-green-800',
    'neo': 'from-indigo-600 to-purple-800',
    'skyline': 'from-sky-600 to-blue-800',
    'premium': 'from-emerald-600 to-green-800'
  };
  return gradients[categoryId] || 'from-gray-600 to-gray-700';
}

function getHoverGradientForCategory(categoryId: string): string {
  const hoverGradients: Record<string, string> = {
    'A': 'hover:from-sky-700 hover:to-blue-900',
    'B': 'hover:from-indigo-700 hover:to-purple-900',
    'C': 'hover:from-emerald-700 hover:to-green-900',
    'neo': 'hover:from-indigo-700 hover:to-purple-900',
    'skyline': 'hover:from-sky-700 hover:to-blue-900',
    'premium': 'hover:from-emerald-700 hover:to-green-900'
  };
  return hoverGradients[categoryId] || 'hover:from-gray-700 hover:to-gray-800';
}

function getIconForCategory(categoryId: string): string {
  const icons: Record<string, string> = {
    'A': '🏔️',
    'B': '⚡',
    'C': '🏗️',
    'neo': '⚡',
    'skyline': '🏔️',
    'premium': '🏗️'
  };
  return icons[categoryId] || '🏠';
}

function getTitleForCategory(categoryId: string, originalTitle?: string): string {
  const titles: Record<string, string> = {
    'neo': 'Neo ADU Series',
    'skyline': 'Skyline Collection',
    'modern': 'Premium Collection',
    'premium': 'Premium Collection'
  };
  return titles[categoryId] || originalTitle || `Category ${categoryId}`;
}

function getDescriptionForCategory(categoryId: string, originalDescription?: string): string {
  const descriptions: Record<string, string> = {
    'neo': 'Modern designs with dual color schemes. Choose between elegant white or sophisticated dark interiors.',
    'skyline': 'Traditional collection featuring a variety of house designs with beautiful skyline views.',
    'modern': 'Contemporary and innovative architectural designs with cutting-edge features and smart home technology.',
    'premium': 'Contemporary and innovative architectural designs with cutting-edge features and smart home technology.'
  };
  return descriptions[categoryId] || originalDescription || `Houses in ${categoryId} category`;
}
