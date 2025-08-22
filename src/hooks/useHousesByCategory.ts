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
        
        // Используем новый API для получения всех домов
        const result = await safeFetch<any>('/api/houses');
        
        if (result.error) {
          setError(result.error);
          return;
        }

        // Извлекаем данные из API response
        const apiData = result.data?.data || result.data;
        
        if (!apiData?.categories) {
          setError('No categories data available');
          return;
        }

        // Находим категорию
        const category = apiData.categories[categoryId];
        if (!category) {
          setHouses([]);
          return;
        }

        console.log(`Category ${categoryId} has ${category.count} houses`);
        console.log('🔍 Category data:', category);
        console.log('🏠 Houses data length:', category.houses?.length);
        
        // Извлекаем дома из категории и конвертируем их в HouseCard формат
        const housesData = category.houses || [];
        console.log('🏠 Houses to process:', housesData.length);
        const houseCards: HouseCard[] = housesData.map(house => {
          // Извлекаем количество спален из availableRooms (подсчитываем bedroom*)
          const bedrooms = house.availableRooms?.filter(room => 
            room.toLowerCase().includes('bedroom') || room.toLowerCase().includes('badroom')
          ).length || 1;
          
          // Подсчитываем ванные комнаты
          const bathrooms = house.availableRooms?.filter(room => 
            room.toLowerCase().includes('bathroom')
          ).length || 1;
          
          // Приблизительная площадь на основе maxDP/maxPK (если есть)
          const sqft = (house.maxDP && house.maxPK) ? house.maxDP * house.maxPK * 10 : 1200;
          
          return {
            id: house.id,
            name: house.name,
            description: house.description,
            image: house.images?.hero || '/assets/placeholder.jpg',
            category: house.category,
            bedrooms,
            bathrooms,
            sqft,
            hasTour360: !!house.tour360,
            hasComparison: !!house.comparison,
            hasDesignPackages: false, // TODO: определить логику для design packages
            // Дополнительные поля
            maxDP: house.maxDP,
            maxPK: house.maxPK,
            availableRooms: house.availableRooms
          };
        });
        
        setHouses(houseCards);
        
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
