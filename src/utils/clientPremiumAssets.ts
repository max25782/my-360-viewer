/**
 * Клиентская версия функций для работы с Premium домами
 * Не использует fs/path, безопасна для клиентского рендеринга
 */

export interface PremiumHouse {
  id: string;
  name: string;
  description: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
  tour360?: {
    rooms: string[];
  };
  comparison?: {
    features: any;
  };
}

/**
 * Проверяет, есть ли у Premium дома 360° тур (клиентская версия)
 */
export async function hasPremiumTour360Client(houseId: string): Promise<boolean> {
  try {
    const response = await fetch('/data/premium-assets.json');
    if (!response.ok) {
      throw new Error(`Failed to load premium-assets.json: ${response.status}`);
    }
    
    const data = await response.json();
    const house = data.premiumHouses[houseId];
    
    return !!house?.tour360?.rooms?.length;
  } catch (error) {
    console.error(`Failed to check if Premium house ${houseId} has 360 tour:`, error);
    return false;
  }
}

/**
 * Получает конфигурацию 360° тура для Premium дома (клиентская версия)
 */
export async function getPremium360ConfigClient(houseId: string) {
  try {
    const response = await fetch('/data/premium-assets.json');
    if (!response.ok) {
      throw new Error(`Failed to load premium-assets.json: ${response.status}`);
    }
    
    const data = await response.json();
    const house = data.premiumHouses[houseId];
    
    if (!house || !house.tour360 || !house.tour360.rooms) {
      return null;
    }

    return {
      rooms: house.tour360.rooms,
      availableFiles: {},
      markerPositions: house.tour360.markerPositions || {},
      legacy: false
    };
  } catch (error) {
    console.error(`Failed to get Premium 360° config for ${houseId}:`, error);
    return null;
  }
}

/**
 * Проверяет, является ли дом Premium домом (клиентская версия)
 */
export async function isPremiumHouseClient(houseId: string): Promise<boolean> {
  try {
    const response = await fetch('/data/premium-assets.json');
    if (!response.ok) {
      throw new Error(`Failed to load premium-assets.json: ${response.status}`);
    }
    
    const data = await response.json();
    return !!data.premiumHouses[houseId];
  } catch (error) {
    console.error(`Failed to check if ${houseId} is a Premium house:`, error);
    return false;
  }
}

/**
 * Список известных Premium домов
 */
export const knownPremiumHouses = ['Aspen', 'Canyon', 'Redwood', 'Willow', 'Sequoia', 'Everest'];

/**
 * Быстрая проверка, является ли дом Premium домом (без запроса к серверу)
 */
export function isPremiumHouseIdClient(houseId: string): boolean {
  return knownPremiumHouses.includes(houseId) || houseId.toLowerCase().includes('premium');
}

/**
 * Генерирует пути к ассетам для Premium домов
 */
export function getPremiumAssetPath(
  houseId: string, 
  room: string, 
  tileDirection: 'front' | 'back' | 'left' | 'right' | 'up' | 'down' | 'thumbnail' | 'hero'
): string {
  // Кодируем имя комнаты для корректного URL
  const encodedRoom = encodeURIComponent(room);
  
  // Маппинг направлений к файлам
  const tileMap = {
    'front': 'f',
    'back': 'b', 
    'left': 'l',
    'right': 'r',
    'up': 'u',
    'down': 'd',
    'thumbnail': 'thumbnail',
    'preview': 'hero'
  };
  
  const fileName = tileMap[tileDirection as keyof typeof tileMap];
  const extension = '.jpg';
  
  const path = `/assets/premium/${houseId}/360/${encodedRoom}/${fileName}${extension}`;
  console.log(`Generated Premium asset path: ${path}`);
  
  return path;
}

/**
 * Получает опции фильтров для Premium домов
 */
export async function getPremiumFilterOptions() {
  try {
    const response = await fetch('/data/premium-assets.json');
    if (!response.ok) {
      throw new Error(`Failed to load premium-assets.json: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Извлекаем уникальные значения для фильтров
    const filters = {
      bedrooms: new Set<string>(),
      bathrooms: new Set<string>(),
      sqft: new Set<number>()
    };
    
    // Собираем все уникальные значения из домов
    Object.values(data.premiumHouses).forEach((house: any) => {
      if (house.filters) {
        if (house.filters.bedrooms) filters.bedrooms.add(house.filters.bedrooms);
        if (house.filters.bathrooms) filters.bathrooms.add(house.filters.bathrooms);
        if (house.filters.sqft) filters.sqft.add(parseInt(house.filters.sqft));
      }
    });
    
    // Находим минимальное и максимальное значение площади
    const sqftValues = Array.from(filters.sqft);
    const sqftMin = sqftValues.length > 0 ? Math.min(...sqftValues) : 1500;
    const sqftMax = sqftValues.length > 0 ? Math.max(...sqftValues) : 3500;
    
    // Преобразуем Set в отсортированные массивы
    return {
      bedrooms: Array.from(filters.bedrooms).sort(),
      bathrooms: Array.from(filters.bathrooms).sort(),
      sqftRange: { min: sqftMin, max: sqftMax }
    };
  } catch (error) {
    console.error('Failed to load premium filter options:', error);
    return {
      bedrooms: ['2', '3', '4'],
      bathrooms: ['2', '2.5', '3'],
      sqftRange: { min: 1500, max: 3500 }
    };
  }
}