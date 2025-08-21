'use client';

/**
 * Хук для загрузки индекса категорий домов
 */

import { useState, useEffect } from 'react';
import type { CategoriesIndex } from '../types/houses';
import { dataUrl, safeFetch } from '../utils/paths';

interface UseCategoriesResult {
  categories: CategoriesIndex | null;
  loading: boolean;
  error: string | null;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<CategoriesIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        setError(null);
        
        const result = await safeFetch<CategoriesIndex>(dataUrl('index.json'));
        
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setCategories(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { categories, loading, error };
}
