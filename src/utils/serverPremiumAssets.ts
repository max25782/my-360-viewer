
/**
 * Серверная версия функций для работы с Premium домами
 * Используется в API маршрутах и серверных компонентах
 */

import fs from 'fs';
import path from 'path';

interface PremiumConfig {
  pathTemplates: {
    hero: string;
    exterior: string;
    interior: string;
    tour360: {
      thumbnail: string;
      preview: string;
      tiles: Record<string, string>;
    };
    textures: {
      standard: string;
      luxury: string;
    };
  };
  finishes: string[];
  designPackages: Record<string, { dp: number; pk: number }>;
  rooms: string[];
  comparisonTypes: string[];
  comparisonVariants: string[];
}

interface PremiumHouseConfig {
  name: string;
  description: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
  tour360?: {
    rooms: string[];
  };
  comparison?: {
    features: Record<string, {
      good: string;
      better: string;
      best: string;
    }>;
  };
}

interface PremiumAssetData {
  premiumConfig: PremiumConfig;
  premiumHouses: Record<string, PremiumHouseConfig>;
}

/**
 * Функция для нормализации регистра Premium домов (серверная версия)
 */
function getServerPremiumHouseDirectory(houseId: string): string {
  // Сохраняем оригинальный регистр для специальных случаев
  const specialCases: Record<string, string> = {
    'GrandVista': 'GrandVista',
    'LuxeHaven': 'LuxeHaven'
  };
  
  if (specialCases[houseId]) {
    return specialCases[houseId];
  }
  
  // Для остальных делаем первую букву заглавной, остальные строчные
  return houseId.charAt(0).toUpperCase() + houseId.slice(1).toLowerCase();
}

/**
 * Load Premium asset configuration from JSON (server-side only)
 */
export async function loadServerPremiumAssetConfig(): Promise<PremiumAssetData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'premium-assets.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load server Premium asset config:', error);
    // Return minimal fallback config
    return {
      premiumConfig: {
        pathTemplates: {
          hero: '/assets/premium/{houseId}/hero.jpg',
          exterior: '/assets/premium/{houseId}/exterior/{finish}/dp{dp}.jpg',
          interior: '/assets/premium/{houseId}/interior/{room}/pk{pk}_{finish}.jpg',
          tour360: {
            thumbnail: '/assets/premium/{houseId}/360/{finish}/{room}/thumbnail.jpg',
            preview: '/assets/premium/{houseId}/360/{finish}/{room}/preview.jpg',
            tiles: {
              front: '/assets/premium/{houseId}/360/{finish}/{room}/f.jpg',
              back: '/assets/premium/{houseId}/360/{finish}/{room}/b.jpg',
              left: '/assets/premium/{houseId}/360/{finish}/{room}/l.jpg',
              right: '/assets/premium/{houseId}/360/{finish}/{room}/r.jpg',
              up: '/assets/premium/{houseId}/360/{finish}/{room}/u.jpg',
              down: '/assets/premium/{houseId}/360/{finish}/{room}/d.jpg'
            }
          },
          textures: {
            standard: '/assets/premium/texture/standard.jpg',
            luxury: '/assets/premium/texture/luxury.jpg'
          }
        },
        finishes: ['standard', 'luxury'],
        designPackages: {
          'DP1': { dp: 1, pk: 1 },
          'DP2': { dp: 2, pk: 2 },
          'DP3': { dp: 3, pk: 3 },
          'DP4': { dp: 4, pk: 4 }
        },
        rooms: ['living', 'kitchen', 'bedroom', 'bathroom', 'office'],
        comparisonTypes: ['features', 'specs', 'options'],
        comparisonVariants: ['good', 'better', 'best']
      },
      premiumHouses: {}
    };
  }
}

/**
 * Get all Premium houses (server-side only)
 */
export async function getServerPremiumHouses(): Promise<any[]> {
  try {
    const { premiumHouses } = await loadServerPremiumAssetConfig();
    return Object.entries(premiumHouses).map(([id, config]) => ({
      id,
      ...config
    }));
  } catch (error) {
    console.error('Failed to get server Premium houses:', error);
    return [];
  }
}

/**
 * Get a specific Premium house by ID (server-side only)
 */
export async function getServerPremiumHouse(houseId: string): Promise<any | null> {
  try {
    const { premiumHouses } = await loadServerPremiumAssetConfig();
    
    // Ищем дом без учета регистра
    const normalizedHouseId = houseId.toLowerCase();
    
    // Ищем по точному совпадению ключа
    if (premiumHouses[houseId]) {
      return {
        id: houseId,
        ...premiumHouses[houseId]
      };
    }
    
    // Ищем по ключу без учета регистра
    const matchedKey = Object.keys(premiumHouses).find(
      key => key.toLowerCase() === normalizedHouseId
    );
    
    if (matchedKey) {
      return {
        id: matchedKey,
        ...premiumHouses[matchedKey]
      };
    }
    
    console.log(`Premium house not found: ${houseId}. Available houses:`, Object.keys(premiumHouses));
    return null;
  } catch (error) {
    console.error(`Failed to get server Premium house ${houseId}:`, error);
    return null;
  }
}

/**
 * Generate asset path for Premium house (server-side only)
 */
export async function getServerPremiumAssetPath(
  type: 'hero' | 'exterior' | 'interior' | 'tour360',
  houseId: string,
  options: {
    finish?: string;
    room?: string;
    dp?: number;
    pk?: number;
    format?: string;
    tile?: string;
  } = {}
): Promise<string> {
  try {
    const { premiumConfig } = await loadServerPremiumAssetConfig();
    const houseDir = getServerPremiumHouseDirectory(houseId);
    
    let template = '';
    
    switch (type) {
      case 'hero':
        template = premiumConfig.pathTemplates.hero;
        break;
      case 'exterior':
        template = premiumConfig.pathTemplates.exterior;
        break;
      case 'interior':
        template = premiumConfig.pathTemplates.interior;
        break;
      case 'tour360':
        if (options.tile) {
          template = premiumConfig.pathTemplates.tour360.tiles[options.tile];
        } else {
          template = premiumConfig.pathTemplates.tour360.thumbnail;
        }
        break;
      default:
        throw new Error(`Unknown asset type: ${type}`);
    }
    
    // Заменяем переменные в шаблоне
    let result = template
      .replace('{houseId}', houseDir)
      .replace('{finish}', options.finish || 'standard')
      .replace('{room}', options.room || 'living')
      .replace('{dp}', String(options.dp || 1))
      .replace('{pk}', String(options.pk || 1));
    
    // Меняем формат если указан
    if (options.format && result.endsWith('.jpg')) {
      result = result.replace('.jpg', `.${options.format}`);
    }
    
    return result;
  } catch (error) {
    console.error(`Failed to generate Premium asset path for ${houseId}:`, error);
    return `/assets/premium/${houseId}/placeholder.jpg`;
  }
}

/**
 * Check if Premium house has 360 tour (server-side only)
 */
export async function hasPremiumTour360(houseId: string): Promise<boolean> {
  try {
    const house = await getServerPremiumHouse(houseId);
    return !!house?.tour360?.rooms?.length;
  } catch (error) {
    console.error(`Failed to check if Premium house ${houseId} has 360 tour:`, error);
    return false;
  }
}

/**
 * Generate 360° tour configuration for Premium house
 */
export async function getServerPremium360Config(houseId: string) {
  try {
    const house = await getServerPremiumHouse(houseId);
    
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
