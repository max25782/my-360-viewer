'use client';

/**
 * Хук для загрузки домов по категории
 */

import { useState, useEffect } from 'react';
import type { HouseCard, HouseCategory } from '../types/houses';
import { dataUrl, safeFetch } from '../utils/paths';

interface UseHousesByCategoryResult {
  houses: HouseCard[];
  loading: boolean;
  error: string | null;
}

export function useHousesByCategory(categoryId: HouseCategory): UseHousesByCategoryResult {
  const [houses, setHouses] = useState<HouseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHouses() {
      try {
        setLoading(true);
        setError(null);
        
        const result = await safeFetch<HouseCard[]>(dataUrl(`houses.${categoryId}.json`));
        
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setHouses(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadHouses();
  }, [categoryId]);

  return { houses, loading, error };
}
