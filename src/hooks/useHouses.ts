'use client';

import { useState, useEffect } from 'react';
import { loadAssetConfig, getAssetPath } from '../utils/universalAssets';
import { loadNeoAssetConfig, getNeoAssetPath } from '../utils/neoAssets';

// Импортируем функцию для правильного маппинга домов
function getActualHouseDirectory(houseId: string): string {
  const houseDirectoryMap: Record<string, string> = {
    'walnut': 'Walnut',      // ✅ Заглавная W в файловой системе
    'oak': 'Oak',            // ✅ Заглавная O в файловой системе
    'tamarack': 'tamarack',  // ✅ lowercase в файловой системе
    'laurel': 'laurel',      // ✅ lowercase в файловой системе
    'pine': 'pine',          // ✅ lowercase в файловой системе
    'ponderosa': 'ponderosa', // ✅ lowercase в файловой системе
    'juniper': 'juniper',    // ✅ lowercase в файловой системе
    'birch': 'birch',        // ✅ lowercase в файловой системе
    'cypress': 'cypress',    // ✅ lowercase в файловой системе
    'hemlock': 'hemlock',    // ✅ lowercase в файловой системе
    'spruce': 'spruce',      // ✅ lowercase в файловой системе
    'sage': 'sage',          // ✅ lowercase в файловой системе
    'sapling': 'sapling'     // ✅ lowercase в файловой системе
  };
  
  return houseDirectoryMap[houseId.toLowerCase()] || houseId;
}

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
  category?: string;
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
            console.log(`Full URL for ${houseId}:`, typeof window !== 'undefined' ? `${window.location.origin}${heroPath}` : heroPath);
          
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
                 hero: `/assets/skyline/${getActualHouseDirectory(houseId)}/hero.webp`, // Fallback путь с правильным регистром
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
  
  // Отладочная информация
  console.log(`🔍 useHouse called with houseId: ${houseId}`);
  console.log(`📋 Available houses: ${houses.map(h => h.id).join(', ')}`);
  
  // Try exact match first, then case-insensitive match
  let house = houses.find(h => h.id === houseId);
  if (!house) {
    house = houses.find(h => h.id.toLowerCase() === houseId.toLowerCase());
    if (house) {
      console.log(`✅ Found house with case-insensitive match: ${house.id}`);
    }
  } else {
    console.log(`✅ Found house with exact match: ${house.id}`);
  }
  
  // Проверка на редиректы для Walnut
  if (houseId.toLowerCase() === 'walnut') {
    console.log(`⚠️ Walnut house requested, checking configuration...`);
    if (house) {
      console.log(`✅ Walnut house found: ${JSON.stringify(house)}`);
    } else {
      console.log(`❌ Walnut house not found in houses array!`);
    }
  }
  
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
      
      // Try exact match first
      let houseConfig = config.houses[houseId];
      let actualHouseId = houseId;
      
      // If no exact match, try case-insensitive search
      if (!houseConfig) {
        const houseKeys = Object.keys(config.houses);
        const foundKey = houseKeys.find(key => key.toLowerCase() === houseId.toLowerCase());
        if (foundKey) {
          houseConfig = config.houses[foundKey];
          actualHouseId = foundKey;
        }
      }
      
      if (!houseConfig) {
        resolve(null);
        return;
      }
      
      const heroPath = await getAssetPath('hero', actualHouseId, { format: 'webp' });
      
      const house: House = {
        id: actualHouseId, // Use the actual ID from config
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
    const neoConfig = await loadNeoAssetConfig();
    const houseList: House[] = [];
    

    
    // Добавляем Skyline дома
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
        fallbacks: houseConfig.fallbacks,
        category: 'skyline'
      };
      
      houseList.push(house);
    }
    
    // Добавляем Neo дома
    for (const [houseId, houseConfig] of Object.entries(neoConfig.neoHouses)) {
      const heroPath = await getNeoAssetPath('hero', houseId, { 
        color: 'white', 
        format: 'jpg' 
      });
      
      const house: House = {
        id: `neo-${houseId}`, // Префикс для избежания конфликтов
        name: houseConfig.name,
        description: houseConfig.description || `Modern Neo ${houseConfig.name} with dual color schemes`,
        maxDP: houseConfig.maxDP,
        maxPK: houseConfig.maxPK,
        availableRooms: houseConfig.availableRooms,
        images: {
          hero: heroPath,
          gallery: []
        },
        tour360: {
          rooms: [...houseConfig.tour360.white.rooms, ...houseConfig.tour360.dark.rooms],
          availableFiles: {}
        },
        comparison: houseConfig.comparison,
        category: 'neo'
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
