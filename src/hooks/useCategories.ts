'use client';

/**
 * Хук для работы с категориями домов через Redux
 * Заменяет локальное состояние на глобальное с кэшированием
 */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import type { CategoriesIndex } from '../types/houses';
import { loadCategories } from '../store/slices/categoriesSlice';
import {
  selectCategoriesData,
  selectCategoriesLoading,
  selectCategoriesError,
  selectShouldRefreshCategories
} from '../store/selectors/categoriesSelectors';
import { useSSRCompatible } from './useSSRCompatible';

interface UseCategoriesResult {
  categories: CategoriesIndex | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useCategories(): UseCategoriesResult {
  const dispatch = useDispatch<AppDispatch>();
  const isMounted = useSSRCompatible();
  
  // Redux selectors
  const categories = useSelector(selectCategoriesData);
  const reduxLoading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);
  const shouldRefresh = useSelector(selectShouldRefreshCategories);

  // Загружаем данные только после монтирования на клиенте
  useEffect(() => {
    if (isMounted && shouldRefresh) {
      dispatch(loadCategories());
    }
  }, [dispatch, shouldRefresh, isMounted]);

  // Функция для принудительного обновления
  const refresh = () => {
    dispatch(loadCategories());
  };

  // На сервере и до монтирования показываем loading: true
  const loading = !isMounted || reduxLoading;

  return { 
    categories, 
    loading, 
    error,
    refresh
  };
}
