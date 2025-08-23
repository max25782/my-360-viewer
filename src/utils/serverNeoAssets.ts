/**
 * Серверная версия функций для работы с Neo домами
 * Используется в API маршрутах и серверных компонентах
 */

import fs from 'fs';
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

/**
 * Функция для нормализации регистра Neo домов (серверная версия)
 */
function getServerNeoHouseDirectory(houseId: string): string {
  // Делаем первую букву заглавной, остальные строчные
  return houseId.charAt(0).toUpperCase() + houseId.slice(1).toLowerCase();
}

/**
 * Load Neo asset configuration from JSON (server-side only)
 */
export async function loadServerNeoAssetConfig(): Promise<NeoAssetData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'neo-assets.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load server Neo asset config:', error);
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
 * Get Neo asset path with color support (server-side only)
 */
export async function getServerNeoAssetPath(
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
  const config = await loadServerNeoAssetConfig();
  const houseConfig = config.neoHouses[houseId];
  
  let template = '';
  // Удаляем префикс neo- если он есть
  const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;
  // Нормализуем регистр имени дома
  const normalizedHouseId = getServerNeoHouseDirectory(cleanHouseId);
  const variables: Record<string, string | number> = { 
    houseId: normalizedHouseId,
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
  
  // Заменяем переменные в шаблоне
  let path = template;
  for (const [key, value] of Object.entries(variables)) {
    path = path.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  
  console.log(`Server Neo path generated: ${path} from template: ${template}`);
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  return path;
}

/**
 * Get Neo house configuration by ID (server-side only)
 */
export async function getServerNeoHouseConfig(houseId: string): Promise<NeoHouseConfig | null> {
  const config = await loadServerNeoAssetConfig();
  
  console.log(`🔍 Server: Looking for Neo house with ID: ${houseId}`);
  console.log(`🏠 Server: Available Neo houses: ${Object.keys(config.neoHouses).join(', ')}`);
  
  // Попробуем найти дом по точному ID
  if (config.neoHouses[houseId]) {
    console.log(`✅ Server: Found Neo house with exact ID: ${houseId}`);
    return config.neoHouses[houseId];
  }
  
  // Если не нашли, попробуем найти с учетом регистра
  const normalizedId = houseId.charAt(0).toUpperCase() + houseId.slice(1).toLowerCase();
  console.log(`🔄 Server: Trying normalized ID: ${normalizedId}`);
  
  if (config.neoHouses[normalizedId]) {
    console.log(`✅ Server: Found Neo house with normalized ID: ${normalizedId}`);
    return config.neoHouses[normalizedId];
  }
  
  // Если все равно не нашли, вернем null
  console.log(`❌ Server: Neo house not found: ${houseId}`);
  return null;
}

/**
 * Get Neo houses (server-side only)
 */
export async function getServerNeoHouses(): Promise<Array<{
  id: string;
  name: string;
  description: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
}>> {
  const config = await loadServerNeoAssetConfig();
  
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
 * Get Neo comparison path (server-side only)
 */
export function getServerNeoComparisonPath(
  houseSlug: string, 
  type: 'good' | 'better' | 'best', 
  variant: 'exterior' | 'plan1' | 'plan2' | 'plan3'= 'exterior'
): string {
  // Удаляем префикс neo- если он есть
  const cleanHouseId = houseSlug.startsWith('neo-') ? houseSlug.substring(4) : houseSlug;
  // Нормализуем регистр имени дома
  const normalizedHouseId = getServerNeoHouseDirectory(cleanHouseId);
  // Используем точное расположение файлов
  const path = `/assets/neo/${normalizedHouseId}/comparison/${type}-${variant}.jpg`;
  console.log(`Generating Server Neo comparison path: ${path}`);
  return path;
}
