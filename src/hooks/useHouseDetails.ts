'use client';

/**
 * Хук для загрузки детальных данных дома
 */

import { useState, useEffect } from 'react';
import type { HouseDetails } from '../types/houses';
import { dataUrl, safeFetch } from '../utils/paths';

interface UseHouseDetailsResult {
  house: HouseDetails | null;
  loading: boolean;
  error: string | null;
}

export function useHouseDetails(houseId: string): UseHouseDetailsResult {
  const [house, setHouse] = useState<HouseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!houseId) {
      setLoading(false);
      return;
    }

    async function loadHouse() {
      try {
        setLoading(true);
        setError(null);
        
        const result = await safeFetch<HouseDetails>(dataUrl(`houses/${houseId}.json`));
        
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setHouse(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadHouse();
  }, [houseId]);

  return { house, loading, error };
}
