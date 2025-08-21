'use client';

import { useState, useEffect } from 'react';
import { loadAssetConfig, getAssetPath } from '../utils/universalAssets';

export interface House {
  id: string;
  name: string;
  description?: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
  pricing?: {
    good: number;
    better: number;
    best: number;
  };
  images: {
    hero: string;
    gallery?: string[];
  };
  tour360?: {
    rooms: string[];
    availableFiles: Record<string, unknown>;
  };
  comparison?: {
    features: Record<string, {
      good: string;
      better: string;
      best: string;
    }>;
  };
  specialPaths?: Record<string, string>;
  fallbacks?: Record<string, string>;
}

export function useHouses() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHouses() {
      try {
        setLoading(true);
        const config = await loadAssetConfig();
        
        const houseList: House[] = [];
        
        for (const [houseId, houseConfig] of Object.entries(config.houses)) {
          // Загружаем hero изображение
          try {
            const heroPath = await getAssetPath('hero', houseId, { format: 'webp' });
            console.log(`Hero path for ${houseId}:`, heroPath);
          
            const house: House = {
            id: houseId,
            name: houseConfig.name,
            description: houseConfig.description || `Modern ${houseConfig.name} design with ${houseConfig.availableRooms?.length || 0} rooms`,
            maxDP: houseConfig.maxDP,
            maxPK: houseConfig.maxPK,
            availableRooms: houseConfig.availableRooms,
            images: {
              hero: heroPath,
              gallery: [] // Можно добавить позже
            },
            tour360: houseConfig.tour360,
            comparison: houseConfig.comparison,
            specialPaths: houseConfig.specialPaths,
            fallbacks: houseConfig.fallbacks
            };
            
            houseList.push(house);
          } catch (error) {
            console.error(`Error loading hero for ${houseId}:`, error);
            console.log('HouseConfig for fallback:', houseConfig);
            
            // Проверяем, что у нас есть минимальные данные для дома
            if (!houseConfig || !houseConfig.name) {
              console.error(`Skipping house ${houseId} - insufficient data`);
              continue;
            }
            
            // Используем fallback путь
            const house: House = {
              id: houseId,
              name: houseConfig.name,
              description: houseConfig.description || `Modern ${houseConfig.name} design with ${houseConfig.availableRooms?.length || 0} rooms`,
              maxDP: houseConfig.maxDP,
              maxPK: houseConfig.maxPK,
              availableRooms: houseConfig.availableRooms,
              images: {
                hero: houseId ? `/assets/skyline/${houseId === 'oak' ? 'Oak' : houseId === 'walnut' ? 'Walnut' : houseId}/hero.webp` : `/assets/skyline/${houseId}/hero.webp`, // Fallback путь
                gallery: []
              },
              tour360: houseConfig.tour360,
              comparison: houseConfig.comparison,
              specialPaths: houseConfig.specialPaths,
              fallbacks: houseConfig.fallbacks
            };
            
            houseList.push(house);
          }
        }
        
        setHouses(houseList);
        setError(null);
      } catch (err) {
        console.error('Failed to load houses:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    loadHouses();
  }, []);

  return { houses, loading, error };
}

export function useHouse(houseId: string) {
  const { houses, loading, error } = useHouses();
  const house = houses.find(h => h.id === houseId);
  
  return { 
    house: house || null, 
    loading, 
    error: error || (!house && !loading ? 'House not found' : null)
  };
}

// Совместимость со старым API
export function getHouse(houseId: string): Promise<House | null> {
  return new Promise(async (resolve) => {
    try {
      const config = await loadAssetConfig();
      const houseConfig = config.houses[houseId];
      
      if (!houseConfig) {
        resolve(null);
        return;
      }
      
      const heroPath = await getAssetPath('hero', houseId, { format: 'webp' });
      
      const house: House = {
        id: houseId,
        name: houseConfig.name,
                      description: houseConfig.description || `Modern ${houseConfig.name} design with ${houseConfig.availableRooms?.length || 0} rooms`,
        maxDP: houseConfig.maxDP,
        maxPK: houseConfig.maxPK,
        availableRooms: houseConfig.availableRooms,
        images: {
          hero: heroPath,
          gallery: []
        },
        tour360: houseConfig.tour360,
        comparison: houseConfig.comparison,
        specialPaths: houseConfig.specialPaths,
        fallbacks: houseConfig.fallbacks
      };
      
      resolve(house);
    } catch (error) {
      console.error('Failed to get house:', error);
      resolve(null);
    }
  });
}

export async function getAllHouses(): Promise<House[]> {
  try {
    const config = await loadAssetConfig();
    const houseList: House[] = [];
    
    for (const [houseId, houseConfig] of Object.entries(config.houses)) {
      const heroPath = await getAssetPath('hero', houseId, { format: 'webp' });
      
      const house: House = {
        id: houseId,
        name: houseConfig.name,
                      description: houseConfig.description || `Modern ${houseConfig.name} design with ${houseConfig.availableRooms?.length || 0} rooms`,
        maxDP: houseConfig.maxDP,
        maxPK: houseConfig.maxPK,
        availableRooms: houseConfig.availableRooms,
        images: {
          hero: heroPath,
          gallery: []
        },
        tour360: houseConfig.tour360,
        comparison: houseConfig.comparison,
        specialPaths: houseConfig.specialPaths,
        fallbacks: houseConfig.fallbacks
      };
      
      houseList.push(house);
    }
    
    return houseList;
  } catch (error) {
    console.error('Failed to get all houses:', error);
    return [];
  }
}

// Совместимость со старым HOUSES константой
export const HOUSES = getAllHouses();
