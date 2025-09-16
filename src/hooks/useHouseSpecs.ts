"use client";

import { useState, useEffect } from 'react';

interface HouseSpecs {
  bedrooms: number;
  bathrooms: number;
  area: string;
}

interface UseHouseSpecsResult {
  specs: HouseSpecs | null;
  isLoading: boolean;
  error: string | null;
}

export function useHouseSpecs(houseId: string, collection: string): UseHouseSpecsResult {
  const [specs, setSpecs] = useState<HouseSpecs | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!houseId || !collection) {
      setSpecs(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchSpecs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Очищаем ID от префиксов коллекций
        let cleanHouseId = houseId;
        if (houseId.startsWith('neo-')) {
          cleanHouseId = houseId.substring(4);
        } else if (houseId.startsWith('premium-')) {
          cleanHouseId = houseId.substring(8);
        } else if (houseId.startsWith('skyline-')) {
          cleanHouseId = houseId.substring(8);
        }

        console.log(`🔍 Fetching specs: ${houseId} -> ${cleanHouseId} (${collection})`);

        const response = await fetch(`/api/house-specs?houseId=${encodeURIComponent(cleanHouseId)}&collection=${encodeURIComponent(collection)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch house specs: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data?.specs) {
          setSpecs(data.data.specs);
        } else {
          throw new Error(data.error || 'Invalid response format');
        }
      } catch (err) {
        console.error(`Error fetching specs for ${houseId} (${collection}):`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fallback к дефолтным значениям
        setSpecs({
          bedrooms: 1,
          bathrooms: 1,
          area: "N/A"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecs();
  }, [houseId, collection]);

  return { specs, isLoading, error };
}
