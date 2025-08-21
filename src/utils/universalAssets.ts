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
 * Load asset configuration from JSON
 */
export async function loadAssetConfig(): Promise<UniversalAssetData> {
  if (assetData) return assetData;
  
  try {
    // Используем window.location для построения абсолютного URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/data/house-assets.json`);
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
          hero: '/assets/{houseId}/hero.webp',
          exterior: '/assets/{houseId}/exterior/dp{dp}.jpg',
          interior: '/assets/{houseId}/interior/{room}/pk{pk}.jpg',
          comparison: '/assets/{houseId}/comparison/{type}-{variant}.jpg',
          tour360: {
            thumbnail: '/assets/{houseId}/360/{room}/thumbnail.jpg',
            preview: '/assets/{houseId}/360/{room}/preview.jpg',
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
 * and add skyline prefix
 */
function getActualHouseDirectory(houseId: string): string {
  const houseDirectoryMap: Record<string, string> = {
    'walnut': 'Walnut',
    'oak': 'Oak',
    'tamarack': 'tamarack',
    'laurel': 'laurel',
    'pine': 'pine',
    'ponderosa': 'ponderosa',
    'juniper': 'juniper',
    'birch': 'birch',
    'cypress': 'cypress',
    'hemlock': 'hemlock',
    'spruce': 'spruce',
    'sage': 'sage',
    'sapling': 'sapling'
    // Add other case mappings as needed
  };
  
  const houseName = houseDirectoryMap[houseId.toLowerCase()] || houseId;
  return `skyline/${houseName}`;
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
  const config = await loadAssetConfig();
  const houseConfig = config.houses[houseId];
  
  // Check new structure first, then fallback to legacy
  if (houseConfig?.tour360?.rooms) {
    return houseConfig.tour360.rooms.length > 0;
  }
  
  return (houseConfig?.tour360Rooms || []).length > 0;
}

/**
 * Get 360° tour configuration for a house
 */
export async function getTour360Config(houseId: string) {
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
