#!/usr/bin/env ts-node

/**
 * Скрипт для нормализации и разделения большого house-assets.json
 * Убирает вложенные массивы "других домов", создает структуру с relatedIds
 */

import * as fs from 'fs';
import * as path from 'path';
import type { 
  CategoriesIndex, 
  HouseCard, 
  HouseDetails, 
  Panorama, 
  PanoramaMarker,
  DesignPackage,
  HouseCategory,
  CategoryMetadata
} from '../src/types/houses';

// Пути
const SOURCE_FILE = path.join(process.cwd(), 'public/data/house-assets.json');
const OUTPUT_DIR = path.join(process.cwd(), 'public/data');
const HOUSES_DIR = path.join(OUTPUT_DIR, 'houses');

// Интерфейс для исходных данных
interface SourceHouse {
  name: string;
  description: string;
  maxDP?: number;
  maxPK?: number;
  availableRooms: string[];
  images: {
    hero: string;
    comparison?: Record<string, string>;
  };
  tour360?: {
    rooms: string[];
    markerPositions?: Record<string, Record<string, { yaw: number; pitch: number }>>;
  };
  comparison?: {
    features?: Record<string, any>;
  };
  // Убираем вложенные массивы других домов
  otherHouses?: any[]; // Эти данные будут преобразованы в relatedIds
}

interface SourceData {
  assetConfig?: any;
  houses: Record<string, SourceHouse>;
}

// Конфигурация категорий
const CATEGORY_CONFIG: Record<HouseCategory, CategoryMetadata> = {
  A: {
    id: 'A',
    title: 'Skyline ADU Collection', 
    count: 0, // будет обновлено
    description: 'Compact and efficient ADU designs (1-2 bedrooms)'
  },
  B: {
    id: 'B',
    title: 'Neo ADU Series',
    count: 0,
    description: 'Modern and versatile ADU layouts (2-3 bedrooms)'
  },
  C: {
    id: 'C', 
    title: 'Premium Collection',
    count: 0,
    description: 'Luxury ADU designs with premium finishes (3+ bedrooms)'
  },
  skyline: {
    id: 'skyline',
    title: 'Skyline Collection',
    count: 0,
    description: 'Traditional collection featuring a variety of house designs with beautiful skyline views.'
  },
  neo: {
    id: 'neo',
    title: 'Neo ADU Series',
    count: 0,
    description: 'Modern designs with dual color schemes. Choose between elegant white or sophisticated dark interiors.'
  },
  modern: {
    id: 'modern',
    title: 'Modern Collection',
    count: 0,
    description: 'Contemporary and innovative architectural designs with cutting-edge features and smart home technology.'
  }
};

// Определение категории дома
function determineHouseCategory(house: SourceHouse, houseId: string): HouseCategory {
  // По требованию пользователя, все дома должны быть в категории A (Skyline ADU Collection)
  return 'A';
}

// Создание характеристик дома
function inferHouseStats(house: SourceHouse): { bedrooms: number; bathrooms: number; sqft: number } {
  const bedrooms = house.availableRooms?.filter(room => room.includes('bedroom')).length || 1;
  const bathrooms = house.availableRooms?.filter(room => room.includes('bathroom')).length || 1;
  
  // Примерная площадь на основе количества комнат
  const roomCount = house.availableRooms?.length || 3;
  const sqft = Math.round((roomCount * 200) + (bedrooms * 150) + (bathrooms * 50));
  
  return { bedrooms, bathrooms, sqft };
}

// Создание панорам из tour360 данных
function createPanoramas(tour360: any, houseId: string, category: HouseCategory): Panorama[] {
  if (!tour360?.rooms) return [];
  
  return tour360.rooms.map((room: string): Panorama => {
    const markerPositions = tour360.markerPositions?.[room] || {};
    
    const markers: PanoramaMarker[] = Object.entries(markerPositions).map(([targetRoom, position]: [string, any]) => ({
      id: `marker-${room}-to-${targetRoom}`,
      type: 'room' as const,
      position: {
        yaw: position.yaw || 0,
        pitch: position.pitch || 0
      },
      targetPanoramaId: `${houseId}-${targetRoom}`,
      label: targetRoom.charAt(0).toUpperCase() + targetRoom.slice(1),
      icon: '🚪'
    }));

    // Используем правильную структуру путей
    const panoramaPath = `assets/skyline/${houseId}/360`;

    return {
      id: `${houseId}-${room}`,
      room,
      title: room.charAt(0).toUpperCase() + room.slice(1),
      thumbnail: `${panoramaPath}/${room}/thumb.webp`,
      preview: `${panoramaPath}/${room}/preview.webp`,
      tiles: {
        front: `${panoramaPath}/${room}/f.webp`,
        back: `${panoramaPath}/${room}/b.webp`,
        left: `${panoramaPath}/${room}/l.webp`,
        right: `${panoramaPath}/${room}/r.webp`,
        up: `${panoramaPath}/${room}/u.webp`,
        down: `${panoramaPath}/${room}/d.webp`
      },
      defaultView: {
        yaw: 0,
        pitch: 0,
        zoom: 50
      },
      markers
    };
  });
}

// Создание пакетов дизайна
function createDesignPackages(house: SourceHouse, houseId: string, category: HouseCategory): DesignPackage[] {
  const packages: DesignPackage[] = [];
  const maxPackages = house.maxDP || 3;
  
  const assetPath = `assets/${houseId}`;
  
  for (let i = 1; i <= maxPackages; i++) {
    packages.push({
      id: `package-${i}`,
      name: `Design Package ${i}`,
      description: `Premium design option ${i}`,
      thumbnail: `${assetPath}/exterior/dp${i}.webp`,
      images: {
        exterior: [`${assetPath}/exterior/dp${i}.webp`],
        interior: house.availableRooms?.reduce((acc, room) => {
          acc[room] = [`${assetPath}/interior/${room}/pk${i}.webp`];
          return acc;
        }, {} as Record<string, string[]>) || {}
      },
      features: [`Feature ${i}A`, `Feature ${i}B`],
      priceModifier: i > 1 ? (i - 1) * 5000 : 0
    });
  }
  
  return packages;
}

// Извлечение связанных домов из вложенных данных
function extractRelatedIds(house: SourceHouse, allHouseIds: string[]): string[] {
  const relatedIds: string[] = [];
  
  // Если есть данные о "других домах", извлекаем их IDs
  if (house.otherHouses && Array.isArray(house.otherHouses)) {
    house.otherHouses.forEach((otherHouse: any) => {
      if (otherHouse.id && allHouseIds.includes(otherHouse.id)) {
        relatedIds.push(otherHouse.id);
      }
    });
  }
  
  return relatedIds.slice(0, 4); // Ограничиваем до 4 связанных домов
}

async function splitHouses(): Promise<void> {
  console.log('🏠 Начинаем нормализацию и разделение house-assets.json...');
  
  // Проверка файлов
  if (!fs.existsSync(SOURCE_FILE)) {
    throw new Error(`Исходный файл не найден: ${SOURCE_FILE}`);
  }
  
  // Создание директорий
  [OUTPUT_DIR, HOUSES_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Чтение и парсинг данных
  console.log('📖 Читаем исходные данные...');
  const rawData = fs.readFileSync(SOURCE_FILE, 'utf-8');
  const cleanData = rawData.replace(/^\uFEFF/, ''); // убираем BOM
  
  let sourceData: SourceData;
  try {
    sourceData = JSON.parse(cleanData);
  } catch (error) {
    throw new Error(`Ошибка парсинга JSON: ${error}`);
  }
  
  if (!sourceData.houses) {
    throw new Error('Неверная структура: отсутствует раздел "houses"');
  }
  
  const houseIds = Object.keys(sourceData.houses);
  console.log(`📊 Найдено домов: ${houseIds.length}`);
  
  // Счетчики категорий
  const categoryCounts: Record<HouseCategory, number> = { A: 0, B: 0, C: 0, skyline: 0, neo: 0, modern: 0 };
  const categoryCards: Record<HouseCategory, HouseCard[]> = { A: [], B: [], C: [], skyline: [], neo: [], modern: [] };
  
  // Обработка каждого дома
  for (const houseId of houseIds) {
    const house = sourceData.houses[houseId];
    const category = determineHouseCategory(house, houseId);
    const stats = inferHouseStats(house);
    const relatedIds = extractRelatedIds(house, houseIds);
    
    console.log(`🏡 Обрабатываем: ${houseId} → категория ${category} (${CATEGORY_CONFIG[category].title})`);
    
    // Создание карточки
    const houseCard: HouseCard = {
      id: houseId,
      name: house.name || `House ${houseId}`,
      description: house.description || '',
      category,
      image: `assets/skyline/${houseId}/hero.webp`, // hero image
      thumbnail: `assets/skyline/${houseId}/hero.webp`,
      bedrooms: stats.bedrooms,
      bathrooms: stats.bathrooms,
      sqft: stats.sqft,
      hasTour360: Boolean(house.tour360?.rooms?.length),
      hasComparison: Boolean(house.comparison?.features),
      hasDesignPackages: Boolean(house.maxDP && house.maxDP > 1)
    };
    
    categoryCards[category].push(houseCard);
    categoryCounts[category]++;
    
    // Создание полных данных
    const panoramas = createPanoramas(house.tour360, houseId, category);
    const designPackages = createDesignPackages(house, houseId, category);
    
    const houseDetails: HouseDetails = {
      id: houseId,
      name: house.name || `House ${houseId}`,
      description: house.description || '',
      category,
      bedrooms: stats.bedrooms,
      bathrooms: stats.bathrooms,
      sqft: stats.sqft,
      hero: `assets/skyline/${houseId}/hero.webp`,
      gallery: [], // можно дополнить
      tour360: panoramas.length > 0 ? {
        enabled: true,
        panoramas,
        defaultPanoramaId: panoramas[0]?.id || ''
      } : undefined,
      designPackages,
      defaultDesignPackageId: designPackages[0]?.id,
      comparison: house.comparison?.features ? {
        enabled: true,
        features: house.comparison.features
      } : undefined,
      relatedIds, // Нормализованные связи вместо вложенных массивов
      tags: [category === 'A' ? 'compact' : category === 'B' ? 'standard' : 'premium'],
      lastUpdated: new Date().toISOString()
    };
    
    // Сохранение детального файла
    const houseFile = path.join(HOUSES_DIR, `${houseId}.json`);
    fs.writeFileSync(houseFile, JSON.stringify(houseDetails, null, 2));
  }
  
  // Обновление счетчиков в конфигурации
  Object.keys(categoryCounts).forEach(cat => {
    const category = cat as HouseCategory;
    CATEGORY_CONFIG[category].count = categoryCounts[category];
  });
  
  // Создание индекса категорий
  const categoriesIndex: CategoriesIndex = {
    categories: Object.values(CATEGORY_CONFIG),
    totalHouses: houseIds.length,
    lastUpdated: new Date().toISOString()
  };
  
  // Сохранение файлов
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'index.json'),
    JSON.stringify(categoriesIndex, null, 2)
  );
  
  // Сохранение карточек по категориям
  for (const [category, cards] of Object.entries(categoryCards)) {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `houses.${category}.json`),
      JSON.stringify(cards, null, 2)
    );
  }
  
  console.log('✅ Нормализация завершена!');
  console.log(`📁 Создано файлов:`);
  console.log(`   - public/data/index.json`);
  console.log(`   - public/data/houses.A.json (${categoryCounts.A} домов - ${CATEGORY_CONFIG.A.title})`);
  console.log(`   - public/data/houses.B.json (${categoryCounts.B} домов - ${CATEGORY_CONFIG.B.title})`);
  console.log(`   - public/data/houses.C.json (${categoryCounts.C} домов - ${CATEGORY_CONFIG.C.title})`);
  console.log(`   - public/data/houses/*.json (${houseIds.length} детальных файлов)`);
  console.log('📋 Убраны вложенные массивы "других домов", добавлены relatedIds');
}

// Запуск
if (require.main === module) {
  splitHouses().catch((error) => {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  });
}

export { splitHouses };
