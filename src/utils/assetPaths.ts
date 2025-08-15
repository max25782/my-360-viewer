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

export const assetPaths: HouseAssetPaths = {
  hero: (house: string) => `/assets/${house}/hero.jpg`,
  
  exterior: (house: string, dp: number) => `/assets/${house}/exterior/dp${dp}.jpg`,
  
  interior: (house: string, room: string, pk: number) => 
    `/assets/${house}/interior/${room}/pk${pk}.jpg`,
  
  comparison: (house: string, type: 'good' | 'better' | 'best', variant: 'exterior' | 'plan1' | 'plan2') => 
    `/assets/${house}/comparison/${type}-${variant}.jpg`,
  
  tour360: (house: string, room: string) => ({
    thumbnail: `/assets/${house}/360/${room}/thumbnail.jpg`,
    preview: `/assets/${house}/360/${room}/preview.jpg`,
    tiles: {
      front: `/assets/${house}/360/${room}/f.jpg`,
      back: `/assets/${house}/360/${room}/b.jpg`,
      up: `/assets/${house}/360/${room}/u.jpg`,
      down: `/assets/${house}/360/${room}/d.jpg`,
      left: `/assets/${house}/360/${room}/l.jpg`,
      right: `/assets/${house}/360/${room}/r.jpg`
    }
  }),

  // NEW: Texture configurator paths
  textures: {
    exterior: (textureId: number) => `/assets/texture/exterior/thumb${textureId}.jpg`,
    interior: (colorId: number) => `/assets/texture/interior/colors${colorId}.jpg`
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
