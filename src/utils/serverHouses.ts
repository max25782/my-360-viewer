/**
 * Server-side функции для работы с домами
 * Не использует 'use client', может работать в API routes
 */

// Не импортируем getAssetPath, используем server-side версию
import fs from 'fs';
import path from 'path';
import type { HouseDetails } from '../types/houses';

interface HouseConfig {
  name: string;
  description?: string;
  maxDP?: number;
  maxPK?: number;
  availableRooms?: string[];
  tour360?: any;
  comparison?: any;
  specialPaths?: Record<string, string>;
  fallbacks?: Record<string, string>;
  category?: string;
}

export interface ServerHouse {
  id: string;
  name: string;
  description?: string;
  maxDP?: number;
  maxPK?: number;
  availableRooms?: string[];
  images: {
    hero: string;
    gallery?: string[];
  };
  tour360?: {
    rooms: string[];
    availableFiles: Record<string, unknown>;
  };
  comparison?: {
    features: Record<string, {
      good: string;
      better: string;
      best: string;
    }>;
  };
  specialPaths?: Record<string, string>;
  fallbacks?: Record<string, string>;
  category?: string;
}

// Функция маппинга домов (server-side версия)
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
  };
  
  return houseDirectoryMap[houseId.toLowerCase()] || houseId;
}

// Server-side версия loadAssetConfig
async function loadServerAssetConfig(): Promise<any> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'house-assets.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load server asset config:', error);
    return { houses: {} };
  }
}

// Server-side версия loadNeoAssetConfig
async function loadServerNeoAssetConfig(): Promise<any> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'neo-assets.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load server Neo asset config:', error);
    return { neoConfig: { pathTemplates: {}, colors: [], designPackages: {}, rooms: [], comparisonTypes: [], comparisonVariants: [] }, neoHouses: {} };
  }
}

// Server-side версия getAssetPath
async function getServerAssetPath(
  type: 'hero' | 'comparison' | 'interior' | 'exterior' | '360',
  houseId: string,
  options: {
    format?: 'jpg' | 'webp';
    room?: string;
    variant?: string;
    dp?: number;
    pk?: number;
  } = {}
): Promise<string> {
  const config = await loadServerAssetConfig();
  const houseConfig = config.houses[houseId];
  
  // Используем default template если дом не найден в конфиге
  let template = '';
  
  if (type === 'hero') {
    template = houseConfig?.pathTemplates?.hero || '/assets/skyline/{houseId}/hero.webp';
  }
  
  const directoryMapping = getActualHouseDirectory(houseId);
  const variables: Record<string, string | number> = {
    houseId: directoryMapping,
    format: options.format || 'webp',
    room: options.room || '',
    variant: options.variant || '',
    dp: options.dp || 1,
    pk: options.pk || 1
  };

  // Заменяем переменные в шаблоне
  let path = template;
  for (const [key, value] of Object.entries(variables)) {
    path = path.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }

  console.log(`Generated path: ${path} from template: ${template}`);
  return path;
}

// Функция для нормализации регистра Neo домов (серверная версия)
function getServerNeoHouseDirectory(houseId: string): string {
  // Сохраняем оригинальный регистр для специальных случаев
  const specialCases: Record<string, string> = {
    'HorizonX': 'HorizonX'
  };
  
  if (specialCases[houseId]) {
    return specialCases[houseId];
  }
  
  // Для остальных делаем первую букву заглавной, остальные строчные
  return houseId.charAt(0).toUpperCase() + houseId.slice(1).toLowerCase();
}

// Server-side версия getNeoAssetPath  
async function getServerNeoAssetPath(
  type: 'hero',
  houseId: string,
  options: {
    color: 'white' | 'dark';
    format?: 'jpg' | 'webp';
  }
): Promise<string> {
  const neoConfig = await loadServerNeoAssetConfig();
  
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

  if (type === 'hero') {
    template = neoConfig.neoConfig.pathTemplates.hero;
  }

  // Заменяем переменные в шаблоне
  let path = template;
  for (const [key, value] of Object.entries(variables)) {
    path = path.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }

  return path;
}

export async function getAllServerHouses(): Promise<ServerHouse[]> {
  try {
    const config = await loadServerAssetConfig();
    const neoConfig = await loadServerNeoAssetConfig();
    const houseList: ServerHouse[] = [];
    
    console.log('📊 Loading houses - Skyline config:', Object.keys(config.houses).length);
    console.log('📊 Loading houses - Neo config:', Object.keys(neoConfig.neoHouses).length);
    
    console.log('🔍 First Skyline house keys:', Object.keys(Object.values(config.houses)[0] || {}));
    console.log('🔍 First Neo house keys:', Object.keys(Object.values(neoConfig.neoHouses)[0] || {}));
    
    // Добавляем Skyline дома
    for (const [houseId, houseConfig] of Object.entries(config.houses as Record<string, HouseConfig>)) {
      const heroPath = await getServerAssetPath('hero', houseId, { format: 'webp' });
      
      const house: ServerHouse = {
        id: houseId,
        name: houseConfig.name,
        description: houseConfig.description || `Modern ${houseConfig.name} design with ${houseConfig.availableRooms?.length || 0} rooms`,
        maxDP: houseConfig.maxDP,
        maxPK: houseConfig.maxPK,
        availableRooms: houseConfig.availableRooms,
        images: {
          hero: heroPath,
          gallery: []
        },
        tour360: houseConfig.tour360,
        comparison: houseConfig.comparison,
        specialPaths: houseConfig.specialPaths,
        fallbacks: houseConfig.fallbacks,
        category: houseConfig.category || 'skyline'
      };
      
      houseList.push(house);
    }
    
    // Добавляем Neo дома
    for (const [houseId, houseConfig] of Object.entries(neoConfig.neoHouses as Record<string, HouseConfig>)) {
      const heroPath = await getServerNeoAssetPath('hero', houseId, { 
        color: 'white', 
        format: 'jpg' 
      });
      
      const house: ServerHouse = {
        id: `neo-${houseId}`,
        name: houseConfig.name,
        description: houseConfig.description || `Modern Neo ${houseConfig.name} with dual color schemes`,
        maxDP: houseConfig.maxDP,
        maxPK: houseConfig.maxPK,
        availableRooms: houseConfig.availableRooms,
        images: {
          hero: heroPath,
          gallery: []
        },
        tour360: {
          rooms: [...houseConfig.tour360.white.rooms, ...houseConfig.tour360.dark.rooms],
          availableFiles: {}
        },
        comparison: houseConfig.comparison,
        category: 'neo'
      };
      
      console.log(`🏠 Neo house created: ${house.id}, category: ${house.category}`);
      houseList.push(house);
    }
    
    console.log('📊 Final house list:', houseList.length, 'houses');
    console.log('📊 Categories breakdown:', houseList.reduce((acc, house) => {
      acc[house.category || 'unknown'] = (acc[house.category || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));
    
    return houseList;
  } catch (error) {
    console.error('Failed to get all server houses:', error);
    return [];
  }
}
