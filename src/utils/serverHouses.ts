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
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
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
  if (type === 'hero') {
    const directory = getActualHouseDirectory(houseId);
    // Не трогаем файловую систему на сервере, просто возвращаем предсказуемый URL
    // Порядок предпочтений: webp → jpg → png. Берём webp как дефолт.
    return `/assets/skyline/${directory}/360/hero.webp`;
  }

  // Для остальных типов (если потребуется в будущем) можно добавить похожую логику
  // Пока возвращаем дефолтный путь по формату
  const directory = getActualHouseDirectory(houseId);
  const fmt = options.format || 'jpg';
  switch (type) {
    case 'exterior':
      return `/assets/skyline/${directory}/exterior/dp${options.dp || 1}.${fmt}`;
    case 'interior':
      return `/assets/skyline/${directory}/interior/pk${options.pk || 1}.${fmt}`;
    default:
      return `/assets/skyline/${directory}/${type}.${fmt}`;
  }
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

// Импортируем функцию для загрузки Premium домов
import { getServerPremiumHouses, getServerPremiumAssetPath } from './serverPremiumAssets';

export async function getAllServerHouses(): Promise<ServerHouse[]> {
  try {
    const config = await loadServerAssetConfig();
    const neoConfig = await loadServerNeoAssetConfig();
    const premiumHouses = await getServerPremiumHouses();
    const houseList: ServerHouse[] = [];
    
    console.log('📊 Loading houses - Skyline config:', Object.keys(config.houses).length);
    console.log('📊 Loading houses - Neo config:', Object.keys(neoConfig.neoHouses).length);
    console.log('📊 Loading houses - Premium config:', premiumHouses.length);
    
    console.log('🔍 First Skyline house keys:', Object.keys(Object.values(config.houses)[0] || {}));
    console.log('🔍 First Neo house keys:', Object.keys(Object.values(neoConfig.neoHouses)[0] || {}));
    if (premiumHouses.length > 0) {
      console.log('🔍 First Premium house keys:', Object.keys(premiumHouses[0] || {}));
    }
    
    // Вспомогательный парсер площади: ищет число рядом с "sq ft" или "SF"
    const parseSqft = (text?: string): number | null => {
      if (!text || typeof text !== 'string') return null;
      const cleaned = text.replace(/,/g, '');
      
      // Ищем паттерн "число sq ft" или "число SF"
      const sqftMatch = cleaned.match(/(\d{3,4})\s*(sq\s*ft|SF)/i);
      if (sqftMatch) {
        return parseInt(sqftMatch[1], 10);
      }
      
      // Если не нашли с "sq ft", берём первое разумное число (300-9999)
      const matches = cleaned.match(/\d{3,4}/g);
      if (!matches) return null;
      const numbers = matches.map(m => parseInt(m, 10))
        .filter(n => n >= 300 && n <= 9999);
      return numbers.length > 0 ? numbers[0] : null; // Берём первое, а не максимум
    };

    // Добавляем Skyline дома
    for (const [houseId, houseConfig] of Object.entries(config.houses as Record<string, HouseConfig>)) {
      const heroPath = await getServerAssetPath('hero', houseId, { format: 'webp' });
      
      // Extract bedrooms, bathrooms, and square feet
      let bedrooms = 1;
      let bathrooms = 1;
      let squareFeet = 800;

      // Extract from availableRooms
      if (houseConfig.availableRooms && Array.isArray(houseConfig.availableRooms)) {
        bedrooms = houseConfig.availableRooms.filter(room => 
          room.toLowerCase().includes('bedroom')
        ).length || 1;
        
        bathrooms = houseConfig.availableRooms.filter(room => 
          room.toLowerCase().includes('bathroom')
        ).length || 1;
      }

      // Extract square feet from comparison features (best -> better -> good), корректно обрабатываем запятые
      if (houseConfig.comparison?.features?.['Living Space']) {
        const livingSpace = houseConfig.comparison.features['Living Space'];
        if (typeof livingSpace === 'object') {
          const candidate = livingSpace.best || livingSpace.better || livingSpace.good || '';
          const parsed = parseSqft(candidate);
          if (houseId === 'laurel' || houseId.toLowerCase() === 'walnut') {
            console.log(`🔍 Skyline ${houseId} Living Space: "${candidate}" -> ${parsed ?? 'null'} SF`);
          }
          if (parsed) squareFeet = parsed;
        }
      }

      // Extract from description as fallback
      if (houseConfig.description) {
        const desc = houseConfig.description;
        
        // Extract bedrooms from description
        const bedroomMatch = desc.match(/(\d+)\s+bedrooms?/i);
        if (bedroomMatch && bedrooms === 1) {
          bedrooms = parseInt(bedroomMatch[1]);
        }
        
        // Extract bathrooms from description (including "two and a half baths")
        const halfBathMatch = desc.match(/(two|three|four|five|\d+)\s+and\s+a\s+half\s+baths?/i);
        if (halfBathMatch && bathrooms === 1) {
          const numberWord = halfBathMatch[1].toLowerCase();
          const wordToNumber: Record<string, number> = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5
          };
          const baseNumber = wordToNumber[numberWord] || parseInt(halfBathMatch[1]);
          bathrooms = baseNumber + 0.5;
        } else {
          const bathroomMatch = desc.match(/(\d+(?:\.\d+)?)\s+baths?/i);
          if (bathroomMatch && bathrooms === 1) {
            bathrooms = parseFloat(bathroomMatch[1]);
          }
        }
        
        // Extract square feet from description
        const sqftMatch = desc.match(/(\d{1,3}(?:,\d{3})*)\s*(?:square\s*feet|sf)/i);
        if (sqftMatch) {
          const parsed = parseInt(sqftMatch[1].replace(/,/g, ''));
          if (!Number.isNaN(parsed)) squareFeet = parsed;
        }
      }
      
      const house: ServerHouse = {
        id: houseId,
        name: houseConfig.name,
        description: houseConfig.description || `Modern ${houseConfig.name} design with ${houseConfig.availableRooms?.length || 0} rooms`,
        maxDP: houseConfig.maxDP,
        maxPK: houseConfig.maxPK,
        availableRooms: houseConfig.availableRooms,
        squareFeet,
        bedrooms,
        bathrooms,
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
      
      // Extract bedrooms, bathrooms, and square feet for Neo houses
      let bedrooms = 1;
      let bathrooms = 1;
      let squareFeet = 600;

      // Extract from comparison features (Neo structure)
      if (houseConfig.comparison?.features) {
        const features = houseConfig.comparison.features;
        
        const bedroomsText = features.Bedrooms?.best || features.Bedrooms?.better || features.Bedrooms?.good;
        const bathroomsText = features.Bathrooms?.best || features.Bathrooms?.better || features.Bathrooms?.good;
        const livingSpaceText = features['Living Space']?.best || features['Living Space']?.better || features['Living Space']?.good;

        const bMatch = bedroomsText ? bedroomsText.match(/(\d+)/) : null;
        if (bMatch) bedrooms = parseInt(bMatch[1]);

        const baMatch = bathroomsText ? bathroomsText.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/) : null;
        if (baMatch) bathrooms = parseFloat(baMatch[1]);

        const parsedSqft = parseSqft(livingSpaceText);
        if (parsedSqft) {
          squareFeet = parsedSqft;
          if (houseId === 'Arcos') {
            console.log(`🔍 Neo Arcos Living Space: "${livingSpaceText}" -> ${parsedSqft} SF`);
          }
        }
      }
      
      const house: ServerHouse = {
        id: `neo-${houseId}`,
        name: houseConfig.name,
        description: houseConfig.description || `Modern Neo ${houseConfig.name} with dual color schemes`,
        maxDP: houseConfig.maxDP,
        maxPK: houseConfig.maxPK,
        availableRooms: houseConfig.availableRooms,
        squareFeet,
        bedrooms,
        bathrooms,
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
    
    // Добавляем Premium дома
    for (const premiumHouse of premiumHouses) {
      try {
        const heroPath = await getServerPremiumAssetPath('hero', premiumHouse.id, { format: 'jpg' });
        
        // Extract bedrooms, bathrooms, and square feet for Premium houses
        let bedrooms = 2;
        let bathrooms = 2;
        let squareFeet = 1200;

        // Extract from comparison features (Premium structure)
        if (premiumHouse.comparison?.features) {
          const features = premiumHouse.comparison.features;
          
          // Look for bedroom info in features array
          if (Array.isArray(features)) {
            const bedroomFeature = features.find((feature: string) => 
              feature.toLowerCase().includes('bedroom') && /\d+/.test(feature)
            );
            if (bedroomFeature) {
              const match = bedroomFeature.match(/(\d+)/);
              if (match) bedrooms = parseInt(match[1]);
            }

            const bathroomFeature = features.find((feature: string) => 
              feature.toLowerCase().includes('bathroom') && /\d+/.test(feature)
            );
            if (bathroomFeature) {
              const match = bathroomFeature.match(/(\d+(?:\.\d+)?)/);
              if (match) bathrooms = parseFloat(match[1]);
            }

            const areaFeature = features.find((feature: string) => 
              feature.toLowerCase().includes('sf') || feature.toLowerCase().includes('square feet')
            );
            if (areaFeature) {
              const match = areaFeature.match(/(\d{1,3}(?:,\d{3})*)\s*sf/i);
              if (match) squareFeet = parseInt(match[1].replace(/,/g, ''));
            }
          }
        }

        // Extract from description as fallback
        if (premiumHouse.description) {
          const desc = premiumHouse.description;
          
          // Extract bedrooms from description
          const bedroomMatch = desc.match(/(\d+)-bedroom/i);
          if (bedroomMatch && bedrooms === 2) {
            bedrooms = parseInt(bedroomMatch[1]);
          }
          
          // Extract bathrooms from description
          const bathroomMatch = desc.match(/(\d+(?:\.\d+)?)-bath/i);
          if (bathroomMatch && bathrooms === 2) {
            bathrooms = parseFloat(bathroomMatch[1]);
          }
          
          // Extract square feet from description
          const sqftMatch = desc.match(/(\d{1,3}(?:,\d{3})*)\s*square feet/i);
          if (sqftMatch && squareFeet === 1200) {
            squareFeet = parseInt(sqftMatch[1].replace(/,/g, ''));
          }
        }
        
        const house: ServerHouse = {
          id: `premium-${premiumHouse.id}`,
          name: premiumHouse.name,
          description: premiumHouse.description || `Premium ${premiumHouse.name} with luxury features`,
          maxDP: premiumHouse.maxDP,
          maxPK: premiumHouse.maxPK,
          availableRooms: premiumHouse.availableRooms,
          squareFeet,
          bedrooms,
          bathrooms,
          images: {
            hero: heroPath,
            gallery: []
          },
          tour360: {
            rooms: premiumHouse.tour360?.rooms || [],
            availableFiles: {}
          },
          comparison: premiumHouse.comparison,
          category: 'premium'
        };
        
        console.log(`🏠 Premium house created: ${house.id}, category: ${house.category}, bedrooms: ${bedrooms}, bathrooms: ${bathrooms}, sqft: ${squareFeet}`);
        houseList.push(house);
      } catch (error) {
        console.error(`Failed to process Premium house ${premiumHouse.id}:`, error);
      }
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
