/**
 * Серверные функции для работы со Skyline домами
 */

import path from 'path';
import fs from 'fs/promises';
// Импортируем функции из хуков, но без клиентских зависимостей
import { House } from '@/hooks/useHouses';

// Серверная версия функций для получения домов
async function getAllHouses(): Promise<House[]> {
  try {
    // Загружаем данные из файла houses.A.json (Skyline коллекция)
    const filePath = path.join(process.cwd(), 'public/data/houses.A.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const houses = JSON.parse(fileData);
    
    return houses.map((house: any) => ({
      ...house,
      category: 'skyline'
    }));
  } catch (error) {
    console.error('Error loading houses:', error);
    return [];
  }
}

async function getHouseById(id: string): Promise<House | null> {
  try {
    const houses = await getAllHouses();
    return houses.find(house => house.id === id) || null;
  } catch (error) {
    console.error(`Error getting house ${id}:`, error);
    return null;
  }
}

/**
 * Получает все дома категории Skyline
 */
export async function getServerSkylineHouses() {
  try {
    const allHouses = await getAllHouses();
    const skylineHouses = allHouses.filter(house => house.category === 'skyline');
    
    return skylineHouses.map(house => ({
      id: house.id,
      name: house.name,
      description: house.description || '',
      availableRooms: house.availableRooms || [],
      squareFeet: extractSquareFeet(house),
      comparison: house.comparison
    }));
  } catch (error) {
    console.error('Error getting Skyline houses:', error);
    return [];
  }
}

/**
 * Получает дом Skyline по ID
 */
export async function getServerSkylineHouse(id: string) {
  try {
    const house = await getHouseById(id);
    if (!house || house.category !== 'skyline') {
      return null;
    }
    
    return {
      id: house.id,
      name: house.name,
      description: house.description || '',
      availableRooms: house.availableRooms || [],
      squareFeet: extractSquareFeet(house),
      comparison: house.comparison
    };
  } catch (error) {
    console.error(`Error getting Skyline house ${id}:`, error);
    return null;
  }
}

/**
 * Извлекает площадь из данных дома
 */
function extractSquareFeet(house: any): number | undefined {
  // Проверяем данные из comparison.features
  if (house.comparison?.features) {
    // Ищем ключ, содержащий "square" или "sqft" или "living space"
    const sqftKey = Object.keys(house.comparison.features)
      .find(key => 
        key.toLowerCase().includes('square') || 
        key.toLowerCase().includes('sqft') ||
        key.toLowerCase().includes('living space'));
    
    if (sqftKey) {
      const sqftData = house.comparison.features[sqftKey]?.good || '';
      
      // Извлекаем число из строки
      const match = sqftData.match(/(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
    }
  }
  
  // Если не нашли в comparison, проверяем описание
  if (house.description) {
    const match = house.description.match(/(\d+)\s*sq\.?\s*ft/i);
    if (match && match[1]) {
      return parseInt(match[1]);
    }
  }
  
  return undefined;
}
