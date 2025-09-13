'use client';

import { useState, useEffect } from 'react';
import { getNeoHouseConfig, getNeoAssetPath, getNeoHouses } from '../utils/neoAssets';

export interface NeoHouse {
  id: string;
  name: string;
  description: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
  images: {
    hero: string;
    exampleDark?: string;
    exampleWhite?: string;
    whiteTexture: string;
    darkTexture: string;
  };
  tour360: {
    white: { rooms: string[] };
    dark: { rooms: string[] };
  };
  comparison?: {
    features: Record<string, {
      good: string;
      better: string;
      best: string;
    }>;
  };
}

export function useNeoHouse(houseId: string) {
  const [house, setHouse] = useState<NeoHouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNeoHouse() {
      // Проверяем, что houseId определен
      if (!houseId || houseId === 'undefined' || houseId === 'null') {
        console.error(`❌ useNeoHouse: Invalid houseId: "${houseId}"`);
        setError(`Invalid house identifier: "${houseId}"`);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const houseConfig = await getNeoHouseConfig(houseId);
        
        if (!houseConfig) {
          setError(`Neo house "${houseId}" not found`);
          setHouse(null);
          return;
        }

        // Generate asset paths
        const heroPath = await getNeoAssetPath('hero', houseId, { 
          color: 'white', 
          format: 'jpg' 
        });

        const neoHouse: NeoHouse = {
          id: houseId,
          name: houseConfig.name,
          description: houseConfig.description,
          maxDP: houseConfig.maxDP,
          maxPK: houseConfig.maxPK,
          availableRooms: houseConfig.availableRooms,
          images: {
            hero: heroPath,
            whiteTexture: '/assets/neo/texrure/thumb-white.jpg',
            darkTexture: '/assets/neo/texrure/thumb-dark.jpg'
          },
          tour360: houseConfig.tour360,
          comparison: houseConfig.comparison
        };

        setHouse(neoHouse);
      } catch (err) {
        console.error('Error loading Neo house:', err);
        setError(err instanceof Error ? err.message : 'Failed to load house');
        setHouse(null);
      } finally {
        setLoading(false);
      }
    }

    if (houseId) {
      loadNeoHouse();
    }
  }, [houseId]);

  return { house, loading, error };
}

export function useNeoHouses() {
  const [houses, setHouses] = useState<NeoHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNeoHouses() {
      try {
        setLoading(true);
        setError(null);
        
        // Загружаем все Neo дома из конфигурации
        const neoHousesData = await getNeoHouses();
        const neoHousesList: NeoHouse[] = [];
        
        for (const houseData of neoHousesData) {
          try {
            // Получаем полную конфигурацию дома
            const houseConfig = await getNeoHouseConfig(houseData.id);
            
            if (houseConfig) {
              const heroPath = await getNeoAssetPath('hero', houseData.id, { 
                color: 'white', 
                format: 'jpg' 
              });

              const neoHouse: NeoHouse = {
                id: houseData.id,
                name: houseConfig.name,
                description: houseConfig.description,
                maxDP: houseConfig.maxDP,
                maxPK: houseConfig.maxPK,
                availableRooms: houseConfig.availableRooms,
                images: {
                  hero: heroPath,
                  whiteTexture: '/assets/neo/texrure/thumb-white.jpg',
                  darkTexture: '/assets/neo/texrure/thumb-dark.jpg'
                },
                tour360: houseConfig.tour360,
                comparison: houseConfig.comparison
              };

              neoHousesList.push(neoHouse);
            }
          } catch (houseError) {
            console.warn(`Failed to load Neo house ${houseData.id}:`, houseError);
            // Продолжаем загрузку других домов
          }
        }
        
        setHouses(neoHousesList);
        
      } catch (err) {
        console.error('Error loading Neo houses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load houses');
        setHouses([]);
      } finally {
        setLoading(false);
      }
    }

    loadNeoHouses();
  }, []);

  return { houses, loading, error };
}
