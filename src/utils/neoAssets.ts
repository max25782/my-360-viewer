/**
 * NEO ASSET SYSTEM
 * Специализированная система для Neo ADU Series с поддержкой цветовых схем
 */

import { readFile } from 'fs/promises';
import path from 'path';

interface NeoConfig {
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
      white: string;
      dark: string;
    };
  };
  colors: string[];
  designPackages: Record<string, { dp: number; pk: number }>;
  rooms: string[];
  comparisonTypes: string[];
  comparisonVariants: string[];
}

interface NeoHouseConfig {
  name: string;
  description: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
  tour360: {
    white: { rooms: string[] };
    dark: { rooms: string[] };
  };
  comparison?: {
    features: Record<string, {
      good: string;
      better: string;
      best: string;
    }>;
  };
}

interface NeoAssetData {
  neoConfig: NeoConfig;
  neoHouses: Record<string, NeoHouseConfig>;
}

// Cache for loaded Neo config
let neoAssetData: NeoAssetData | null = null;

/**
 * Load Neo asset configuration from JSON
 */
export async function loadNeoAssetConfig(): Promise<NeoAssetData> {
  if (neoAssetData) return neoAssetData;
  
  try {
    // Check if we're on server side
    if (typeof window === 'undefined') {
      // Server side - use fs to read file
      const fs = await import('fs');
      const path = await import('path');
      
      const filePath = path.join(process.cwd(), 'public', 'data', 'neo-assets.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      neoAssetData = JSON.parse(fileContent);
      return neoAssetData!;
    } else {
      // Client side - use fetch
      const response = await fetch('/data/neo-assets.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      neoAssetData = await response.json();
      return neoAssetData!;
    }
  } catch (error) {
    console.error('Failed to load Neo asset config:', error);
    // Return minimal fallback config
    return {
      neoConfig: {
        pathTemplates: {
          hero: '/assets/neo/{houseId}/hero.jpg',
          exterior: '/assets/neo/{houseId}/exterior/{color}/dp{dp}.jpg',
          interior: '/assets/neo/{houseId}/interior/{room}/pk{pk}_{color}.jpg',
          tour360: {
            thumbnail: '/assets/neo/{houseId}/360/{color}/{room}/thumbnail.jpg',
            preview: '/assets/neo/{houseId}/360/{color}/{room}/preview.jpg',
            tiles: {
              front: '/assets/neo/{houseId}/360/{color}/{room}/f.jpg',
              back: '/assets/neo/{houseId}/360/{color}/{room}/b.jpg',
              left: '/assets/neo/{houseId}/360/{color}/{room}/l.jpg',
              right: '/assets/neo/{houseId}/360/{color}/{room}/r.jpg',
              up: '/assets/neo/{houseId}/360/{color}/{room}/u.jpg',
              down: '/assets/neo/{houseId}/360/{color}/{room}/d.jpg'
            }
          },
          textures: {
            white: '/assets/neo/texrure/thumb-white.jpg',
            dark: '/assets/neo/texrure/thumb-dark.jpg'
          }
        },
        colors: ['white', 'dark'],
        designPackages: {
          heritage: { dp: 1, pk: 1 },
          haven: { dp: 2, pk: 2 },
          serenity: { dp: 3, pk: 3 },
          luxe: { dp: 4, pk: 4 }
        },
        rooms: ['entry', 'living', 'kitchen', 'hall', 'badroom', 'badroom2', 'bathroom', 'bathroom2', 'wik'],
        comparisonTypes: ['good', 'better', 'best'],
        comparisonVariants: ['exterior', 'plan1', 'plan2']
      },
      neoHouses: {}
    };
  }
}

/**
 * Map Neo house ID to actual directory name
 */
function getNeoHouseDirectory(houseId: string): string {
  // Neo houses use proper case (Apex, Vertex, etc.)
  return houseId.charAt(0).toUpperCase() + houseId.slice(1);
}

/**
 * Replace template variables in Neo path
 */
function replaceNeoPath(template: string, variables: Record<string, string | number>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    if (key === 'houseId') {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), getNeoHouseDirectory(String(value)));
    } else {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }
  });
  
  console.log(`Neo path generated: ${result} from template: ${template}`);
  
  // Ensure path starts with /
  if (!result.startsWith('/')) {
    result = '/' + result;
  }
  
  return result;
}

/**
 * Get Neo asset path with color support
 */
export async function getNeoAssetPath(
  type: 'hero' | 'exterior' | 'interior' | 'tour360',
  houseId: string,
  options: {
    color: 'white' | 'dark';
    dp?: number;
    pk?: number;
    room?: string;
    tour360Type?: 'thumbnail' | 'preview' | 'tiles';
    tileDirection?: 'front' | 'back' | 'left' | 'right' | 'up' | 'down';
    format?: 'jpg' | 'webp';
  }
): Promise<string> {
  const config = await loadNeoAssetConfig();
  const houseConfig = config.neoHouses[houseId];
  
  let template = '';
  const variables: Record<string, string | number> = { 
    houseId,
    color: options.color,
    format: options.format || 'jpg'
  };
  
  switch (type) {
    case 'hero':
      template = config.neoConfig.pathTemplates.hero;
      break;
      
    case 'exterior':
      template = config.neoConfig.pathTemplates.exterior;
      let dp = options.dp || 1;
      
      if (houseConfig) {
        const maxDP = houseConfig.maxDP;
        if (dp > maxDP) {
          dp = maxDP;
        }
      }
      
      variables.dp = dp;
      break;
      
    case 'interior':
      template = config.neoConfig.pathTemplates.interior;
      let room = options.room || 'living';
      let pk = options.pk || 1;
      
      if (houseConfig) {
        const maxPK = houseConfig.maxPK;
        if (pk > maxPK) {
          pk = maxPK;
        }
      }
      
      variables.room = room;
      variables.pk = pk;
      break;
      
    case 'tour360':
      const tour360Templates = config.neoConfig.pathTemplates.tour360;
      const tour360Type = options.tour360Type || 'thumbnail';
      
      if (tour360Type === 'tiles' && options.tileDirection) {
        template = tour360Templates.tiles[options.tileDirection] || tour360Templates.thumbnail;
      } else {
        template = typeof tour360Templates[tour360Type] === 'string' 
          ? tour360Templates[tour360Type] as string 
          : tour360Templates.thumbnail;
      }
      
      variables.room = options.room || 'living';
      break;
  }
  
  return replaceNeoPath(template, variables);
}

/**
 * Get all available Neo houses
 */
export async function getNeoHouses(): Promise<Array<{
  id: string;
  name: string;
  description: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
}>> {
  const config = await loadNeoAssetConfig();
  
  return Object.entries(config.neoHouses).map(([id, house]) => ({
    id,
    name: house.name,
    description: house.description,
    maxDP: house.maxDP,
    maxPK: house.maxPK,
    availableRooms: house.availableRooms
  }));
}

/**
 * Get Neo house configuration by ID
 */
export async function getNeoHouseConfig(houseId: string): Promise<NeoHouseConfig | null> {
  const config = await loadNeoAssetConfig();
  return config.neoHouses[houseId] || null;
}

/**
 * Get Neo markers for navigation
 */
export async function getNeoMarkers(houseId: string, color: 'white' | 'dark', room: string): Promise<Array<{
  to: string;
  yaw: number;
  pitch: number;
  label: string;
}>> {
  try {
    let markersData;
    
    // Check if we're on server side
    if (typeof window === 'undefined') {
      // Server side - use fs to read file
      const fs = await import('fs');
      const path = await import('path');
      
      const filePath = path.join(process.cwd(), 'public', 'data', 'neo-markers.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      markersData = JSON.parse(fileContent);
    } else {
      // Client side - use fetch
      const response = await fetch('/data/neo-markers.json');
      if (!response.ok) {
        return [];
      }
      markersData = await response.json();
    }
    
    const houseMarkers = markersData[houseId];
    
    if (!houseMarkers || !houseMarkers[color] || !houseMarkers[color][room]) {
      return [];
    }
    
    return houseMarkers[color][room].markers || [];
  } catch (error) {
    console.error('Failed to load Neo markers:', error);
    return [];
  }
}

/**
 * Get Neo texture thumbnails
 */
export async function getNeoTextures(): Promise<Array<{
  id: 'white' | 'dark';
  name: string;
  thumbnail: string;
}>> {
  const config = await loadNeoAssetConfig();
  
  return [
    {
      id: 'white',
      name: 'White Scheme',
      thumbnail: config.neoConfig.pathTemplates.textures.white
    },
    {
      id: 'dark', 
      name: 'Dark Scheme',
      thumbnail: config.neoConfig.pathTemplates.textures.dark
    }
  ];
}

/**
 * Clear Neo asset cache
 */
export function clearNeoAssetCache(): void {
  neoAssetData = null;
  console.log('Neo asset cache cleared');
}

export function getNeoComparisonPath(
  houseSlug: string, 
  type: 'good' | 'better' | 'best', 
  variant: 'exterior' | 'plan1' | 'plan2' | 'plan3'= 'exterior'
): string {
  // Используем точное расположение файлов
  const path = `/assets/neo/${houseSlug}/comparison/${type}-${variant}.jpg`;
  console.log(`Generating Neo comparison path: ${path}`);
  return path;
}
