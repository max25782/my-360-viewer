/**
 * UNIVERSAL ASSET SYSTEM
 * 🎯 JSON-driven, zero hardcode, automatic fallbacks
 * Replace 1000+ lines of switch/case with 50 lines of universal code!
 */

interface AssetConfig {
  pathTemplates: {
    hero: string;
    exterior: string;
    interior: string;
    comparison: string;
    tour360: {
      thumbnail: string;
      preview: string;
      tiles: Record<string, string>;
    };
    textures: {
      exterior: string;
      interior: string;
    };
  };
  rooms: string[];
  designPackages: Record<string, { dp: number; pk: number }>;
  comparisonTypes: string[];
  comparisonVariants: string[];
}

interface HouseConfig {
  name: string;
  description?: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
  comparison?: {
    features: Record<string, {
      good: string;
      better: string;
      best: string;
    }>;
  };
  tour360?: {
    rooms: string[];
    availableFiles: Record<string, {
      thumbnail: boolean;
      preview: boolean;
      tiles: {
        front: boolean;
        back: boolean;
        left: boolean;
        right: boolean;
        up: boolean;
        down: boolean;
      };
    }>;
    markerPositions?: Record<string, Record<string, { yaw: number; pitch: number }>>;
  };
  tour360Rooms?: string[]; // Legacy support
  specialPaths?: Record<string, string>;
  fallbacks?: Record<string, string>;
}

interface UniversalAssetData {
  assetConfig: AssetConfig;
  houses: Record<string, HouseConfig>;
}

// Cache for loaded config
let assetData: UniversalAssetData | null = null;

/**
 * Clear asset cache - useful for development and updates
 */
export function clearAssetCache(): void {
  assetData = null;
  console.log('Asset cache cleared');
}

/**
 * Load asset configuration from JSON
 */
export async function loadAssetConfig(): Promise<UniversalAssetData> {
  if (assetData) return assetData;
  
  try {
    // Используем относительный путь для лучшей совместимости с Vercel
    const response = await fetch('/data/house-assets.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    assetData = await response.json();
    return assetData!;
  } catch (error) {
    console.error('Failed to load asset config:', error);
    // Return minimal fallback config
    return {
      assetConfig: {
        pathTemplates: {
          hero: '/assets/skyline/{houseId}/hero.webp',
          exterior: '/assets/skyline/{houseId}/exterior/dp{dp}.jpg',
          interior: '/assets/skyline/{houseId}/interior/{room}/pk{pk}.jpg',
          comparison: '/assets/skyline/{houseId}/comparison/{type}-{variant}.jpg',
          tour360: {
            thumbnail: '/assets/skyline/{houseId}/360/{room}/thumbnail.jpg',
            preview: '/assets/skyline/{houseId}/360/{room}/preview.jpg',
            tiles: {}
          },
          textures: {
            exterior: '/assets/skyline/texture/exterior/thumb{id}.jpg',
            interior: '/assets/skyline/texture/interior/colors{id}.jpg'
          }
        },
        rooms: ['living', 'kitchen', 'bedroom', 'bathroom'],
        designPackages: {
          heritage: { dp: 1, pk: 1 },
          haven: { dp: 2, pk: 2 },
          serenity: { dp: 3, pk: 3 },
          luxe: { dp: 4, pk: 4 }
        },
        comparisonTypes: ['good', 'better', 'best'],
        comparisonVariants: ['exterior', 'plan1', 'plan2']
      },
      houses: {}
    };
  }
}

/**
 * Map house ID to actual directory name (handle case sensitivity)
 */
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
    // Add other case mappings as needed
  };
  
  const houseName = houseDirectoryMap[houseId.toLowerCase()] || houseId;
  console.log(`🏠 House directory mapping: ${houseId} → ${houseName}`);
  
  // Убеждаемся, что не возвращаем путь с skyline
  if (houseName.includes('skyline')) {
    console.error('❌ SKYLINE IN HOUSE NAME:', houseName);
    return houseName.replace(/.*skyline\//, '');
  }
  
  // Не добавляем skyline/ здесь, так как он уже есть в шаблонах путей
  return houseName;
}

/**
 * Replace template variables in path
 */
function replacePath(template: string, variables: Record<string, string | number>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    if (key === 'houseId') {
      // Handle case sensitivity for house directories
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), getActualHouseDirectory(String(value)));
    } else {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }
  });
  
  // Добавляем логирование для отладки путей
  console.log(`Generated path: ${result} from template: ${template}`);
  
  // Проверяем на дублирование skyline и автоматически исправляем
  if (result.includes('/skyline/skyline/')) {
    console.error('❌ DOUBLE SKYLINE DETECTED:', result);
    console.error('Template was:', template);
    console.error('Variables were:', variables);
    // Исправляем дублирование
    result = result.replace('/skyline/skyline/', '/skyline/');
    console.log('✅ Fixed path:', result);
  }
  
  // Для Vercel убеждаемся, что путь начинается с /
  if (!result.startsWith('/')) {
    result = '/' + result;
  }
  
  return result;
}

/**
 * Get asset path with automatic fallbacks
 */
export async function getAssetPath(
  type: 'hero' | 'exterior' | 'interior' | 'comparison' | 'tour360' | 'texture',
  houseId: string,
  options: {
    dp?: number;
    pk?: number;
    room?: string;
    comparisonType?: string;
    comparisonVariant?: string;
    textureType?: 'exterior' | 'interior';
    textureId?: number;
    tour360Type?: 'thumbnail' | 'preview' | 'tiles';
    tileDirection?: 'front' | 'back' | 'left' | 'right' | 'up' | 'down';
    format?: 'jpg' | 'webp'; // Новый параметр
  } = {}
): Promise<string> {
  const config = await loadAssetConfig();
  const houseConfig = config.houses[houseId];
  
  let template = '';
  const variables: Record<string, string | number> = { 
    houseId,
    format: options.format || 'jpg' // По умолчанию JPG
  };
  
  // Проверяем специальные пути
  if (type === 'hero' && houseConfig?.specialPaths?.hero) {
    template = houseConfig.specialPaths.hero;
    console.log(`Using special path for ${houseId}:`, template);
    return replacePath(template, variables);
  }
  
  switch (type) {
    case 'hero':
      template = config.assetConfig.pathTemplates.hero;
      console.log(`Using default hero template for ${houseId}:`, template);
      break;
      
    case 'exterior':
      template = config.assetConfig.pathTemplates.exterior;
      let dp = options.dp || 1;
      
      // Применяем fallbacks
      if (houseConfig) {
        const maxDP = houseConfig.maxDP;
        if (dp > maxDP) {
          dp = maxDP;
        }
        
        // Проверяем специфические fallbacks
        const fallbackKey = `dp${options.dp}`;
        if (houseConfig.fallbacks?.[fallbackKey]) {
          const fallbackDP = houseConfig.fallbacks[fallbackKey];
          dp = parseInt(fallbackDP.replace('dp', ''));
        }
      }
      
      variables.dp = dp;
      break;
      
    case 'interior':
      template = config.assetConfig.pathTemplates.interior;
      let room = options.room || 'living';
      let pk = options.pk || 1;
      
      if (houseConfig) {
        // Применяем fallbacks для комнат
        if (!houseConfig.availableRooms.includes(room) && houseConfig.fallbacks?.[room]) {
          room = houseConfig.fallbacks[room];
        }
        
        // Применяем PK fallbacks
        const maxPK = houseConfig.maxPK;
        if (pk > maxPK) {
          pk = maxPK;
        }
        
        const fallbackKey = `pk${options.pk}`;
        if (houseConfig.fallbacks?.[fallbackKey]) {
          const fallbackPK = houseConfig.fallbacks[fallbackKey];
          pk = parseInt(fallbackPK.replace('pk', ''));
        }
      }
      
      variables.room = room;
      variables.pk = pk;
      
      // Проверяем формат изображения - сначала пробуем webp, потом jpg
      if (!options.format) {
        variables.format = 'webp'; // По умолчанию пробуем webp сначала
      }
      break;
      
    case 'comparison':
      template = config.assetConfig.pathTemplates.comparison;
      variables.type = options.comparisonType || 'good';
      variables.variant = options.comparisonVariant || 'exterior';
      break;
      
    case 'tour360':
      const tour360Templates = config.assetConfig.pathTemplates.tour360;
      const tour360Type = options.tour360Type || 'thumbnail';
      
      if (tour360Type === 'tiles' && options.tileDirection) {
        template = tour360Templates.tiles[options.tileDirection] || tour360Templates.thumbnail;
      } else if (tour360Type === 'thumbnail' || tour360Type === 'preview') {
        template = tour360Templates[tour360Type] || tour360Templates.thumbnail;
      } else {
        template = tour360Templates.thumbnail;
      }
      
      variables.room = options.room || 'living';
      break;
      
    case 'texture':
      const textureTemplates = config.assetConfig.pathTemplates.textures;
      template = textureTemplates[options.textureType || 'exterior'];
      variables.id = options.textureId || 1;
      break;
  }
  
  const finalPath = replacePath(template, variables);
  console.log(`Final asset path for ${houseId} (${type}):`, finalPath);
  return finalPath;
}

/**
 * Get all available design packages for a house
 */
export async function getAvailableDesignPackages(houseId: string) {
  const config = await loadAssetConfig();
  const houseConfig = config.houses[houseId];
  const maxDP = houseConfig?.maxDP || 4;
  
  return Object.entries(config.assetConfig.designPackages)
    .filter(([_, packageConfig]) => packageConfig.dp <= maxDP)
    .map(([name, packageConfig]) => ({
      id: name,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      dp: packageConfig.dp,
      pk: packageConfig.pk
    }));
}

/**
 * Get all available rooms for a house
 */
export async function getAvailableRooms(houseId: string) {
  const config = await loadAssetConfig();
  const houseConfig = config.houses[houseId];
  
  return houseConfig?.availableRooms || config.assetConfig.rooms;
}

/**
 * Check if house has 360° tour
 */
export async function hasTour360(houseId: string): Promise<boolean> {
  // Check if it's a Premium house first
  if (houseId.toLowerCase().includes('premium') || await isPremiumHouse(houseId)) {
    try {
      const { hasPremiumTour360Client } = await import('./clientPremiumAssets');
      return await hasPremiumTour360Client(houseId);
    } catch (error) {
      console.error('Failed to check Premium 360 tour:', error);
      return false;
    }
  }

  const config = await loadAssetConfig();
  const houseConfig = config.houses[houseId];
  
  // Check new structure first, then fallback to legacy
  if (houseConfig?.tour360?.rooms) {
    return houseConfig.tour360.rooms.length > 0;
  }
  
  return (houseConfig?.tour360Rooms || []).length > 0;
}

/**
 * Check if houseId belongs to Premium collection
 */
async function isPremiumHouse(houseId: string): Promise<boolean> {
  try {
    const { isPremiumHouseClient, knownPremiumHouses } = await import('./clientPremiumAssets');
    // Quick check for known premium houses
    if (knownPremiumHouses.includes(houseId)) {
      return true;
    }
    return await isPremiumHouseClient(houseId);
  } catch (error) {
    console.error('Error checking if house is premium:', error);
    return false;
  }
}

/**
 * Get 360° tour configuration for a house
 */
export async function getTour360Config(houseId: string) {
  // Check if it's a Premium house first
  if (houseId.toLowerCase().includes('premium') || await isPremiumHouse(houseId)) {
    try {
      const { getPremium360ConfigClient } = await import('./clientPremiumAssets');
      return await getPremium360ConfigClient(houseId);
    } catch (error) {
      console.error('Failed to get Premium 360 config:', error);
      return null;
    }
  }

  const config = await loadAssetConfig();
  const houseConfig = config.houses[houseId];
  
  // Check new structure first
  if (houseConfig?.tour360) {
    return {
      rooms: houseConfig.tour360.rooms,
      availableFiles: houseConfig.tour360.availableFiles || {},
      markerPositions: houseConfig.tour360.markerPositions || {},
      legacy: false
    };
  }
  
  // Fallback to legacy structure
  if (houseConfig?.tour360Rooms) {
    return {
      rooms: houseConfig.tour360Rooms,
      availableFiles: {},
      markerPositions: {},
      legacy: true
    };
  }
  
  return null;
}

/**
 * Check if specific 360° file is available for a room
 */
export async function is360FileAvailable(
  houseId: string, 
  room: string, 
  fileType: 'thumbnail' | 'preview' | 'front' | 'back' | 'left' | 'right' | 'up' | 'down'
): Promise<boolean> {
  const config = await getTour360Config(houseId);
  
  if (!config || config.legacy) {
    // For legacy structure, assume all files are available
    return true;
  }
  
  const availableFiles = config.availableFiles as Record<string, {
    thumbnail: boolean;
    preview: boolean;
    tiles: {
      front: boolean;
      back: boolean;
      left: boolean;
      right: boolean;
      up: boolean;
      down: boolean;
    };
  }>;
  
  const roomConfig = availableFiles[room];
  if (!roomConfig) return false;
  
  if (fileType === 'thumbnail' || fileType === 'preview') {
    return roomConfig[fileType];
  }
  
  // For tile files
  return roomConfig.tiles[fileType];
}

/**
 * Get comparison features for a house from JSON
 */
export async function getComparisonFeatures(houseId: string): Promise<Record<string, { good: string; better: string; best: string; }> | null> {
  try {
    const config = await loadAssetConfig();
    const houseConfig = config.houses[houseId];
    
    if (!houseConfig?.comparison?.features) {
      console.warn(`No comparison features found for house: ${houseId}`);
      return null;
    }
    
    return houseConfig.comparison.features;
  } catch (error) {
    console.error('Failed to get comparison features:', error);
    return null;
  }
}
