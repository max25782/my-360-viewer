/**
 * NEO ASSET SYSTEM
 * Специализированная система для Neo ADU Series с поддержкой цветовых схем
 */

import { readFile } from 'fs/promises';
import path from 'path';

interface NeoConfig {
  pathTemplates: {
    hero: string;
    heroColor: string;
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
  colorMapping?: Record<string, string>;
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
    // Client side - use fetch
    const response = await fetch('/data/neo-assets.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    neoAssetData = await response.json();
    return neoAssetData!;
  } catch (error) {
    console.error('Failed to load Neo asset config:', error);
    // Return minimal fallback config
    return {
      neoConfig: {
        pathTemplates: {
          hero: '/assets/neo/{houseId}/hero.jpg',
          heroColor: '/assets/neo/{houseId}/360/hero_{colorFile}.jpg',
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
        rooms: ['entry', 'living', 'kitchen', 'hall', 'bedroom', 'bedroom2', 'bathroom', 'bathroom2', 'wik'],
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
  // Проверяем, что houseId определен и не является строкой "undefined"
  if (!houseId || houseId === 'undefined' || houseId === 'null') {
    console.error(`❌ Invalid houseId passed to getNeoHouseDirectory: "${houseId}"`);
    return 'Unknown';
  }
  
  // Удаляем префикс neo- или Neo- если он есть
  let cleanId = houseId;
  if (cleanId.toLowerCase().startsWith('neo-')) {
    cleanId = cleanId.substring(4);
  }
  
  // Сохраняем оригинальный регистр для специальных случаев
  const specialCases: Record<string, string> = {
    'HorizonX': 'HorizonX'
  };
  
  if (specialCases[cleanId]) {
    return specialCases[cleanId];
  }
  
  // Для остальных делаем первую букву заглавной, остальные строчные
  return cleanId.charAt(0).toUpperCase() + cleanId.slice(1).toLowerCase();
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
  type: 'hero' | 'heroColor' | 'exterior' | 'interior' | 'tour360',
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
  // Удаляем префикс neo- если он есть
  const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;
  // Нормализуем регистр имени дома
  const normalizedHouseId = getNeoHouseDirectory(cleanHouseId);
  
  // Получаем сопоставление цветов из конфигурации
  const colorMapping = config.neoConfig.colorMapping || { white: 'white', dark: 'black' };
  const colorFile = colorMapping[options.color] || options.color;
  
  // Проверяем, есть ли директория с именем colorFile
  // Для tour360 мы используем имя цвета, а не маппинг
  const useDarkForTour = type === 'tour360' && options.color === 'dark';
  
  const variables: Record<string, string | number> = { 
    houseId: normalizedHouseId,
    color: options.color,
    colorFile: useDarkForTour ? 'dark' : colorFile,
    format: options.format || 'jpg'
  };
  
  console.log(`Color mapping: ${options.color} -> ${useDarkForTour ? 'dark' : colorFile} (for ${type})`);
  
  switch (type) {
    case 'hero':
      template = config.neoConfig.pathTemplates.hero;
      break;
      
    case 'heroColor':
      template = config.neoConfig.pathTemplates.heroColor;
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
      
      // Проверяем, не содержит ли имя комнаты уже суффикс цвета
      let roomName = options.room || 'living';
      
      // Если имя комнаты уже содержит суффикс цвета, удаляем его
      if (roomName.endsWith(`_${options.color}`)) {
        roomName = roomName.replace(new RegExp(`_${options.color}$`), '');
        console.log(`Removed color suffix from room name: ${options.room} -> ${roomName}`);
      }
      
      // Нормализуем имена комнат для совместимости с файловой системой
      // Теперь комнаты хранятся в формате bathroom2, а не bathroom_2
      if (roomName.includes('_2')) {
        roomName = roomName.replace(/_2$/, '2');
        console.log(`Normalized room name with number: ${options.room} -> ${roomName}`);
      }
      
      // Все комнаты теперь используют единое именование bedroom
      
      console.log(`Using room name for 360 panorama: ${roomName}`);
      
      variables.room = roomName;
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
  // Проверяем, что houseId определен и не является строкой "undefined"
  if (!houseId || houseId === 'undefined' || houseId === 'null') {
    console.error(`❌ Invalid Neo house ID: "${houseId}" (undefined, null, or empty)`);
    return null;
  }
  
  const config = await loadNeoAssetConfig();
  
  console.log(`🔍 Looking for Neo house with ID: ${houseId}`);
  console.log(`🏠 Available Neo houses: ${Object.keys(config.neoHouses).join(', ')}`);
  
  // Попробуем найти дом по точному ID
  if (config.neoHouses[houseId]) {
    console.log(`✅ Found Neo house with exact ID: ${houseId}`);
    return config.neoHouses[houseId];
  }
  
  // Если не нашли, попробуем найти с нормализацией регистра
  const normalizedId = getNeoHouseDirectory(houseId);
  console.log(`🔄 Trying normalized ID: ${normalizedId}`);
  
  if (config.neoHouses[normalizedId]) {
    console.log(`✅ Found Neo house with normalized ID: ${normalizedId}`);
    return config.neoHouses[normalizedId];
  }
  
  // Если все равно не нашли, вернем null
  console.log(`❌ Neo house not found: ${houseId}`);
  return null;
}

/**
 * Get Neo markers for navigation
 */
export async function getNeoMarkers(houseId: string, color: 'white' | 'dark', room: string): Promise<Array<{
  to: string;
  yaw: number;
  pitch: number;
  label: string;
  icon?: string;
}>> {
  try {
    let markersData;
    
    // Client side - use fetch
    const response = await fetch('/data/neo-markers.json');
    if (!response.ok) {
      return [];
    }
    markersData = await response.json();
    
    // Проверяем наличие маркеров для указанного дома
    const houseMarkers = markersData[houseId];
    
    if (!houseMarkers || !houseMarkers[color] || !houseMarkers[color][room]) {
      console.log(`No markers found for house: ${houseId}, color: ${color}, room: ${room}`);
      
      // Если не нашли маркеры для точного ID дома, пробуем с нормализованным регистром
      const normalizedId = getNeoHouseDirectory(houseId);
      if (normalizedId !== houseId && markersData[normalizedId]) {
        console.log(`Trying with normalized house ID: ${normalizedId}`);
        const normalizedHouseMarkers = markersData[normalizedId];
        
        if (normalizedHouseMarkers && normalizedHouseMarkers[color] && normalizedHouseMarkers[color][room]) {
          console.log(`Found markers for normalized house ID: ${normalizedId}`);
          return normalizedHouseMarkers[color][room].markers || [];
        }
      }
      
      return [];
    }
    
    // Добавляем иконки к маркерам на основе типа комнаты
    const markers = houseMarkers[color][room].markers || [];
    
    return markers.map((marker: { to: string; icon?: string; yaw: number; pitch: number; label: string }) => {
      // Добавляем иконку на основе типа комнаты, если она не указана
      if (!marker.icon) {
        const roomType = marker.to.replace(/_white$|_dark$/, '').replace(/2$/, '');
        marker.icon = getRoomIcon(roomType);
      }
      return marker;
    });
  } catch (error) {
    console.error('Failed to load Neo markers:', error);
    return [];
  }
}

/**
 * Получение иконки комнаты по типу
 */
function getRoomIcon(roomName: string): string {
  const baseName = roomName.replace(/_white$|_dark$/, '').replace(/2$/, '');
  
  switch (baseName) {
    case 'entry': return '🚪';
    case 'living': return '🛋️';
    case 'kitchen': return '🍳';
    case 'hall': return '🚶';
    case 'bedroom': return '🛏️';
    // Используем только bedroom
    case 'bathroom': return '🚿';
    case 'wik': return '👔';
    default: return '📍';
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
  // Удаляем префикс neo- если он есть
  const cleanHouseId = houseSlug.startsWith('neo-') ? houseSlug.substring(4) : houseSlug;
  // Нормализуем регистр имени дома
  const normalizedHouseId = getNeoHouseDirectory(cleanHouseId);
  // Получаем данные сравнения из neo-assets.json, а не из пути к файлам
  // Путь оставляем для обратной совместимости
  const path = `/assets/neo/${normalizedHouseId}/comparison/${type}-${variant}.jpg`;
  console.log(`Generating Neo comparison path: ${path}`);
  return path;
}
