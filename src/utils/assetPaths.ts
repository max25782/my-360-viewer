/**
 * Universal asset path utilities for standardized house structure
 * Supports fallbacks for missing files + Texture configurator
 */

interface HouseAssetPaths {
  hero: (house: string) => string;
  exterior: (house: string, dp: number) => string;
  interior: (house: string, room: string, pk: number) => string;
  comparison: (house: string, type: 'good' | 'better' | 'best', variant: 'exterior' | 'plan1' | 'plan2') => string;
  tour360: (house: string, room: string) => {
    thumbnail: string;
    preview: string;
    tiles: {
      front: string;
      back: string;
      up: string;
      down: string;
      left: string;
      right: string;
    };
  };
  // NEW: Texture configurator
  textures: {
    exterior: (textureId: number) => string;
    interior: (colorId: number) => string;
  };
}

// Функция для правильного маппинга домов
export function getActualHouseDirectory(houseId: string): string {
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

/**
 * Check if houseId belongs to Premium collection
 */
function isPremiumHouseId(houseId: string): boolean {
  // Import from clientPremiumAssets
  try {
    // Use direct check without import for better performance
    const premiumHouseIds = ['Aspen', 'Canyon', 'Redwood', 'Willow', 'Sequoia'];
    return premiumHouseIds.includes(houseId) || houseId.toLowerCase().includes('premium');
  } catch (error) {
    return houseId.toLowerCase().includes('premium');
  }
}

export const assetPaths: HouseAssetPaths = {
  hero: (house: string) => `/assets/skyline/${getActualHouseDirectory(house)}/hero.jpg`,
  
  exterior: (house: string, dp: number) => `/assets/skyline/${getActualHouseDirectory(house)}/exterior/dp${dp}.jpg`,
  
  interior: (house: string, room: string, pk: number) => 
    `/assets/skyline/${getActualHouseDirectory(house)}/interior/${room}/pk${pk}.jpg`,
  
  comparison: (house: string, type: 'good' | 'better' | 'best', variant: 'exterior' | 'plan1' | 'plan2') => 
    `/assets/skyline/${getActualHouseDirectory(house)}/comparison/${type}-${variant}.jpg`,
  
  tour360: (house: string, room: string) => {
    // Check if it's a Premium house
    if (isPremiumHouseId(house)) {
      // Always use .jpg for Premium houses
      const format = '.jpg'; // Force jpg format for Premium houses
      return {
        thumbnail: `/assets/premium/${house}/360/${room}/thumbnail${format}`,
        preview: `/assets/premium/${house}/360/${room}/hero${format}`,
        tiles: {
          front: `/assets/premium/${house}/360/${room}/f${format}`,
          back: `/assets/premium/${house}/360/${room}/b${format}`,
          up: `/assets/premium/${house}/360/${room}/u${format}`,
          down: `/assets/premium/${house}/360/${room}/d${format}`,
          left: `/assets/premium/${house}/360/${room}/l${format}`,
          right: `/assets/premium/${house}/360/${room}/r${format}`
        }
      };
    }
    
    // Default to Skyline - allow WebP detection
    return {
      thumbnail: `/assets/skyline/${getActualHouseDirectory(house)}/360/${room}/thumbnail.jpg`,
      preview: `/assets/skyline/${getActualHouseDirectory(house)}/360/${room}/preview.jpg`,
      tiles: {
        front: `/assets/skyline/${getActualHouseDirectory(house)}/360/${room}/f.jpg`,
        back: `/assets/skyline/${getActualHouseDirectory(house)}/360/${room}/b.jpg`,
        up: `/assets/skyline/${getActualHouseDirectory(house)}/360/${room}/u.jpg`,
        down: `/assets/skyline/${getActualHouseDirectory(house)}/360/${room}/d.jpg`,
        left: `/assets/skyline/${getActualHouseDirectory(house)}/360/${room}/l.jpg`,
        right: `/assets/skyline/${getActualHouseDirectory(house)}/360/${room}/r.jpg`
      }
    };
  },

  // NEW: Texture configurator paths
  textures: {
    exterior: (textureId: number) => `/assets/skyline/texture/exterior/thumb${textureId}.jpg`,
    interior: (colorId: number) => `/assets/skyline/texture/interior/colors${colorId}.jpg`
  }
};

// Fallback utilities
export const withFallback = (primaryPath: string, fallbackPath: string) => primaryPath;

// Helper for design packages with fallbacks (when DP4/DP5 missing)
export const getExteriorWithFallback = (house: string, dp: number, maxDP: number = 5) => {
  if (dp > maxDP) {
    return assetPaths.exterior(house, maxDP); // fallback to highest available
  }
  return assetPaths.exterior(house, dp);
};

// Helper for interior with fallbacks (when PK4/PK5 missing)
export const getInteriorWithFallback = (house: string, room: string, pk: number, maxPK: number = 5) => {
  if (pk > maxPK) {
    return assetPaths.interior(house, room, maxPK); // fallback to highest available
  }
  return assetPaths.interior(house, room, pk);
};

// NEW: Texture configuration utilities
export const textureConfig = {
  // Available exterior textures (siding, stone, etc.)
  exterior: [
    { id: 1, name: 'Hardie Lap Siding', thumbnail: assetPaths.textures.exterior(1) },
    { id: 2, name: 'Board & Batten', thumbnail: assetPaths.textures.exterior(2) },
    { id: 3, name: 'Stone Accent', thumbnail: assetPaths.textures.exterior(3) },
    { id: 4, name: 'Cedar Shake', thumbnail: assetPaths.textures.exterior(4) },
    { id: 5, name: 'Metal Panel', thumbnail: assetPaths.textures.exterior(5) }
  ],

  // Available interior colors (kitchen, bathroom, etc.)
  interior: [
    { id: 1, name: 'Classic White', thumbnail: assetPaths.textures.interior(1) },
    { id: 2, name: 'Warm Gray', thumbnail: assetPaths.textures.interior(2) },
    { id: 3, name: 'Natural Wood', thumbnail: assetPaths.textures.interior(3) },
    { id: 4, name: 'Modern Black', thumbnail: assetPaths.textures.interior(4) },
    { id: 5, name: 'Custom Color', thumbnail: assetPaths.textures.interior(5) }
  ]
};
