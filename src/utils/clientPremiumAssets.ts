/**
 * Клиентская версия функций для работы с Premium домами
 * Не использует fs/path, безопасна для клиентского рендеринга
 */

interface PremiumHouse {
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
      markerPositions: {},
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
export const knownPremiumHouses = ['Aspen', 'Canyon', 'Redwood', 'Willow', 'Sequoia'];

/**
 * Быстрая проверка, является ли дом Premium домом (без запроса к серверу)
 */
export function isPremiumHouseIdClient(houseId: string): boolean {
  return knownPremiumHouses.includes(houseId) || houseId.toLowerCase().includes('premium');
}