/**
 * Утилиты для работы с комнатами Skyline домов
 */

export interface SkylineRoomsResponse {
  success: boolean;
  data?: {
    houseId: string;
    rooms: string[];
    count: number;
    message?: string;
  };
  error?: string;
}

export interface SkylinePackagesResponse {
  success: boolean;
  data?: {
    houseId: string;
    maxDP: number;
    maxPK: number;
    availableRooms: string[];
    summary: {
      exteriorPackages: number;
      interiorPackages: number;
      roomCount: number;
    };
  };
  error?: string;
}

/**
 * Получает список комнат для дома Skyline динамически
 */
export async function getSkylineRooms(houseId: string): Promise<string[]> {
  try {
    console.log(`🔍 Getting rooms for Skyline house: ${houseId}`);
    
    const response = await fetch(`/api/skyline/${houseId}/rooms`);
    
    if (!response.ok) {
      console.error(`❌ Failed to get rooms: ${response.status} ${response.statusText}`);
      return getFallbackRooms();
    }
    
    const data: SkylineRoomsResponse = await response.json();
    
    if (data.success && data.data?.rooms) {
      console.log(`✅ Found ${data.data.rooms.length} rooms:`, data.data.rooms);
      return data.data.rooms;
    } else {
      console.warn(`⚠️ No rooms data in response:`, data);
      return getFallbackRooms();
    }
    
  } catch (error) {
    console.error(`❌ Error getting rooms for ${houseId}:`, error);
    return getFallbackRooms();
  }
}

/**
 * Возвращает стандартный список комнат как fallback
 */
function getFallbackRooms(): string[] {
  const fallbackRooms = ['kitchen', 'bedroom', 'bathroom', 'living'];
  console.log(`🔄 Using fallback rooms:`, fallbackRooms);
  return fallbackRooms;
}

/**
 * Проверяет, существует ли изображение для комнаты
 */
export async function checkRoomImageExists(
  houseId: string, 
  room: string, 
  packageType: string = 'pk1'
): Promise<boolean> {
  try {
    // Сначала пробуем .webp
    const webpResponse = await fetch(
      `/assets/skyline/${houseId}/interior/${room}/${packageType}.webp`, 
      { method: 'HEAD' }
    );
    
    if (webpResponse.ok) {
      return true;
    }
    
    // Fallback к .jpg
    const jpgResponse = await fetch(
      `/assets/skyline/${houseId}/interior/${room}/${packageType}.jpg`, 
      { method: 'HEAD' }
    );
    
    return jpgResponse.ok;
    
  } catch (error) {
    console.warn(`Image check failed for ${houseId}/${room}/${packageType}:`, error);
    return false;
  }
}

/**
 * Получает путь к изображению комнаты с fallback
 */
export function getRoomImagePath(
  houseId: string, 
  room: string, 
  packageType: string = 'pk1',
  preferWebp: boolean = true
): string {
  const extension = preferWebp ? 'webp' : 'jpg';
  return `/assets/skyline/${houseId}/interior/${room}/${packageType}.${extension}`;
}

/**
 * Получает информацию о пакетах для дома Skyline динамически
 */
export async function getSkylinePackages(houseId: string): Promise<{
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
}> {
  try {
    console.log(`🔍 Getting packages for Skyline house: ${houseId}`);
    
    const response = await fetch(`/api/skyline/${houseId}/packages`);
    
    if (!response.ok) {
      console.error(`❌ Failed to get packages: ${response.status} ${response.statusText}`);
      return getFallbackPackages();
    }
    
    const data: SkylinePackagesResponse = await response.json();
    
    if (data.success && data.data) {
      console.log(`✅ Found packages for ${houseId}:`, data.data.summary);
      return {
        maxDP: data.data.maxDP,
        maxPK: data.data.maxPK,
        availableRooms: data.data.availableRooms
      };
    } else {
      console.warn(`⚠️ No package data in response:`, data);
      return getFallbackPackages();
    }
    
  } catch (error) {
    console.error(`❌ Error getting packages for ${houseId}:`, error);
    return getFallbackPackages();
  }
}

/**
 * Возвращает стандартные значения пакетов как fallback
 */
function getFallbackPackages(): {
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
} {
  const fallback = {
    maxDP: 4,
    maxPK: 4,
    availableRooms: ['kitchen', 'bedroom', 'bathroom', 'living']
  };
  console.log(`🔄 Using fallback packages:`, fallback);
  return fallback;
}

/**
 * Форматирует название комнаты для отображения
 */
export function formatRoomName(room: string): string {
  return room
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
