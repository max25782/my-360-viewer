/**
 * Universal assets utilities for 360° tours
 * Проверяет наличие туров и загружает конфигурацию
 */

// Экспортируем интерфейсы для использования в других модулях
export interface TourConfig {
  rooms: string[];
  availableFiles: Record<string, unknown>;
  markerPositions: Record<string, Record<string, { yaw: number; pitch: number }>>;
  legacy: boolean;
}

export interface AssetConfig {
  houses: Record<string, {
    name: string;
    description?: string;
    maxDP: number;
    maxPK: number;
    availableRooms: string[];
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
  }>;
}

/**
 * Загружает конфигурацию ассетов для всех домов
 */
export async function loadAssetConfig(): Promise<AssetConfig> {
  try {
    // 1) Основной источник: house-assets.json (no-store, bust cache)
    try {
      const res = await fetch(`/data/house-assets.json?ts=${Date.now()}` as any, { cache: 'no-store' as RequestCache });
      if (res.ok) {
        const data = await res.json();
        const housesSrc = data?.houses || {};
        const mapped: AssetConfig['houses'] = {} as any;
        for (const [id, h] of Object.entries(housesSrc)) {
          const roomsFromTour = Array.isArray((h as any)?.tour360?.rooms) ? (h as any).tour360.rooms as string[] : [];
          const availableRooms = Array.isArray((h as any)?.availableRooms) && (h as any).availableRooms.length > 0
            ? (h as any).availableRooms as string[]
            : roomsFromTour;
          (mapped as any)[id] = {
            name: (h as any)?.name || id,
            description: (h as any)?.description,
            maxDP: (h as any)?.maxDP ?? 5,
            maxPK: (h as any)?.maxPK ?? 5,
            availableRooms,
            tour360: roomsFromTour.length > 0 ? { rooms: roomsFromTour, availableFiles: (h as any)?.tour360?.availableFiles || {} } : undefined,
            comparison: (h as any)?.comparison,
            specialPaths: (h as any)?.specialPaths,
            fallbacks: (h as any)?.fallbacks,
          };
        }
        return { houses: mapped };
      }
    } catch (e) {
      console.warn('Failed to load house-assets.json, fallback to assets.json', e);
    }

    // 2) Запасной источник: assets.json
    const response = await fetch('/data/assets.json');
    if (response.ok) {
      const config = await response.json();
      return config;
    }
    
    // Если не получилось, возвращаем базовую конфигурацию с Walnut
    console.warn('Failed to load assets.json, using fallback configuration');
    return {
      houses: {
        'Walnut': {
          name: 'Walnut',
          description: 'Modern Walnut design with spacious rooms',
          maxDP: 5,
          maxPK: 3,
          availableRooms: ['entry', 'living', 'kitchen', 'bedroom', 'bathroom'],
          tour360: {
            rooms: ['entry', 'living', 'kitchen', 'bedroom', 'bathroom'],
            availableFiles: {}
          }
        },
        'Oak': {
          name: 'Oak',
          description: 'Elegant Oak design with premium finishes',
          maxDP: 5,
          maxPK: 3,
          availableRooms: ['entry', 'living', 'kitchen', 'bedroom', 'bathroom'],
          tour360: {
            rooms: ['entry', 'living', 'kitchen', 'bedroom', 'bathroom'],
            availableFiles: {}
          }
        }
      }
    };
  } catch (error) {
    console.error('Error loading asset configuration:', error);
    // Возвращаем минимальную конфигурацию при ошибке
    return {
      houses: {
        'Walnut': {
          name: 'Walnut',
          description: 'Modern Walnut design',
          maxDP: 1,
          maxPK: 1,
          availableRooms: ['entry'],
          tour360: {
            rooms: ['entry'],
            availableFiles: {}
          }
        }
      }
    };
  }
}

/**
 * Проверяет, доступен ли 360° тур для дома
 */
export async function hasTour360(houseId: string): Promise<boolean> {
  try {
    // Premium JSON-driven config check first
    try {
      const premiumRes = await fetch('/data/premium-assets.json');
      if (premiumRes.ok) {
        const premiumData = await premiumRes.json();
        const premiumHouse = premiumData?.premiumHouses?.[houseId];
        if (premiumHouse?.tour360?.rooms?.length) {
          console.log(`[universalAssets.hasTour360] premium-assets.json has rooms for ${houseId}`);
          return true;
        }
      }
    } catch (e) {
      console.log(`[universalAssets.hasTour360] premium-assets.json check failed:`, e);
    }

    // Проверяем house-assets.json для получения реальных комнат (только tour360.rooms)
    try {
      const houseAssetsRes = await fetch(`/data/house-assets.json?ts=${Date.now()}` as any, { cache: 'no-store' as RequestCache });
      if (houseAssetsRes.ok) {
        const houseAssetsData = await houseAssetsRes.json();
        const houseData = resolveHouseData(houseAssetsData?.houses, houseId);
        
        const rooms: string[] | undefined = houseData?.tour360?.rooms;
        if (Array.isArray(rooms) && rooms.length > 0) {
          console.log(`[universalAssets.hasTour360] Found ${rooms.length} tour360 rooms for ${houseId} in house-assets.json`);
          return true;
        }
      }
    } catch (e) {
      console.log(`[universalAssets.hasTour360] Error checking house-assets.json:`, e);
    }

    // Если есть комнаты в house-assets.json, считаем что тур доступен
    // Реальную проверку файлов делаем только при загрузке тура
    
    return false;
  } catch (error) {
    console.error(`Error checking 360° tour for ${houseId}:`, error);
    return false;
  }
}

/**
 * Загружает конфигурацию 360° тура
 */
export async function getTour360Config(houseId: string): Promise<TourConfig | null> {
  try {
    // Проверяем house-assets.json (основной источник данных, только tour360.rooms)
    try {
      const houseAssetsRes = await fetch(`/data/house-assets.json?ts=${Date.now()}` as any, { cache: 'no-store' as RequestCache });
      if (houseAssetsRes.ok) {
        const houseAssetsData = await houseAssetsRes.json();
        const houseData = resolveHouseData(houseAssetsData?.houses, houseId);
        
        if (houseData) {
          console.log(`[universalAssets.getTour360Config] Found house data in house-assets.json for ${houseId}`);
          
          // Получаем список комнат и маркеры из tour360
          const rooms: string[] = houseData.tour360?.rooms || [];
          const markerPositions = (houseData.tour360?.markerPositions || {}) as Record<string, Record<string, { yaw: number; pitch: number }>>;
          if (rooms.length > 0) {
            return {
              rooms,
              availableFiles: {},
              markerPositions,
              legacy: false,
            };
          }
        }
      }
    } catch (e) {
      console.log(`[universalAssets.getTour360Config] Error loading house-assets.json:`, e);
    }
    
    // Premium JSON-driven config (запасной вариант)
    try {
      const premiumRes = await fetch('/data/premium-assets.json');
      if (premiumRes.ok) {
        const premiumData = await premiumRes.json();
        const premiumHouse = premiumData?.premiumHouses?.[houseId];
        const rooms: string[] | undefined = premiumHouse?.tour360?.rooms;
        if (Array.isArray(rooms) && rooms.length > 0) {
          console.log(`[universalAssets.getTour360Config] using premium-assets.json for ${houseId}`);
          return {
            rooms,
            availableFiles: {},
            markerPositions: (premiumHouse?.tour360?.markerPositions || {}) as Record<string, Record<string, { yaw: number; pitch: number }>>,
            legacy: false,
          };
        }
      }
    } catch (e) {
      console.log(`[universalAssets.getTour360Config] Error loading premium-assets.json:`, e);
    }

    // Проверяем assets.json (еще один запасной вариант)
    try {
      const assetsRes = await fetch('/data/assets.json');
      if (assetsRes.ok) {
        const assetsData = await assetsRes.json();
        const houseData = assetsData?.houses?.[houseId];
        
        if (houseData?.tour360?.rooms) {
          console.log(`[universalAssets.getTour360Config] Found house data in assets.json for ${houseId}`);
          return {
            rooms: houseData.tour360.rooms,
            availableFiles: houseData.tour360.availableFiles || {},
            markerPositions: {},
            legacy: false,
          };
        }
      }
    } catch (e) {
      console.log(`[universalAssets.getTour360Config] Error loading assets.json:`, e);
    }

    // Пробуем найти tour.json файлы
    try {
      const variants = buildTourJsonCandidates(houseId);
      console.log(`[universalAssets.getTour360Config] candidates for ${houseId}:`, variants);
      for (const url of variants) {
        console.log(`[universalAssets.getTour360Config] GET ${url}`);
        const response = await fetch(url);
        if (!response.ok) continue;

        const config = await response.json();
        // Валидация конфигурации
        if (!config.rooms || !Array.isArray(config.rooms)) {
          console.error(`Invalid tour config for ${houseId} at ${url}: missing rooms array`);
          continue;
        }
        return {
          rooms: config.rooms,
          availableFiles: config.availableFiles || {},
          markerPositions: (config.markerPositions || {}) as Record<string, Record<string, { yaw: number; pitch: number }>>,
          legacy: config.legacy || false,
        };
      }
    } catch (e) {
      console.log(`[universalAssets.getTour360Config] Error checking tour.json files:`, e);
    }
    
    // Если все методы не сработали, возвращаем null - нет тура
    console.log(`[universalAssets.getTour360Config] No tour configuration found for ${houseId}`);
    return null;
  } catch (error) {
    console.error(`Error loading tour config for ${houseId}:`, error);
    return null;
  }
}

// Helpers
function resolveHouseData(
  houses: Record<string, any> | undefined,
  houseId: string
): any | undefined {
  if (!houses) return undefined;
  const direct = houses[houseId];
  if (direct) return direct;
  const lower = houses[houseId.toLowerCase()];
  if (lower) return lower;
  const capped = houses[capitalizeFirst(houseId.toLowerCase())];
  if (capped) return capped;
  return undefined;
}

function capitalizeFirst(input: string): string {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
}

function buildTourJsonCandidates(houseId: string): string[] {
  const id = String(houseId);
  const capped = capitalizeFirst(id);
  // Порядок: premium (Cap, lower) → skyline (Cap, lower)
  return [
    `/assets/premium/${capped}/360/tour.json`,
    `/assets/premium/${id}/360/tour.json`,
    `/assets/skyline/${capped}/360/tour.json`,
    `/assets/skyline/${id}/360/tour.json`,
  ];
}

/**
 * Проверяет наличие конкретной комнаты в туре
 */
export async function hasRoom360(houseId: string, roomName: string): Promise<boolean> {
  try {
    const config = await getTour360Config(houseId);
    return config?.rooms.includes(roomName) || false;
  } catch (error) {
    console.error(`Error checking room ${roomName} for ${houseId}:`, error);
    return false;
  }
}

/**
 * Получает список доступных комнат для дома
 */
export async function getAvailableRooms(houseId: string): Promise<string[]> {
  try {
    const config = await getTour360Config(houseId);
    return config?.rooms || [];
  } catch (error) {
    console.error(`Error getting rooms for ${houseId}:`, error);
    return [];
  }
}

/**
 * Проверяет наличие маркеров навигации для комнаты
 */
export function hasNavigationMarkers(config: TourConfig | null, roomName: string): boolean {
  if (!config || !config.markerPositions) return false;
  return roomName in config.markerPositions;
}

/**
 * Получает позиции маркеров для комнаты
 */
export function getMarkerPositions(config: TourConfig | null, roomName: string): Record<string, { yaw: number; pitch: number }> | null {
  if (!config || !config.markerPositions) return null;
  return config.markerPositions[roomName] || null;
}

/**
 * Получает доступные дизайн-пакеты для дома
 */
export async function getAvailableDesignPackages(houseId: string): Promise<number[]> {
  try {
    console.log(`🔍 Getting available design packages for ${houseId}`);
    
    // Используем новый динамический API
    const response = await fetch(`/api/skyline/${houseId}/packages`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success && data.data?.maxDP) {
        const maxDP = data.data.maxDP;
        const packages = Array.from({ length: maxDP }, (_, i) => i + 1);
        console.log(`✅ Found ${maxDP} design packages for ${houseId}:`, packages);
        return packages;
      }
    }
    
    console.warn(`⚠️ Failed to get packages from API for ${houseId}, using fallback`);
    
    // Fallback: проверяем файлы напрямую с поддержкой WebP
    const packages: number[] = [];
    
    for (let dp = 1; dp <= 5; dp++) {
      // Сначала пробуем .webp, потом .jpg
      const webpResponse = await fetch(`/assets/skyline/${houseId}/exterior/dp${dp}.webp`, { method: 'HEAD' });
      if (webpResponse.ok) {
        packages.push(dp);
        continue;
      }
      
      const jpgResponse = await fetch(`/assets/skyline/${houseId}/exterior/dp${dp}.jpg`, { method: 'HEAD' });
      if (jpgResponse.ok) {
        packages.push(dp);
      }
    }
    
    console.log(`🔄 Fallback packages for ${houseId}:`, packages);
    return packages.length > 0 ? packages : [1]; // Fallback to DP1 if nothing found
    
  } catch (error) {
    console.error(`❌ Error checking design packages for ${houseId}:`, error);
    return [1]; // Fallback to DP1
  }
}

/**
 * Получает фичи сравнения (Good/Better/Best) из соответствующего JSON файла
 */
export async function getComparisonFeatures(houseId: string): Promise<Record<string, { good: string; better: string; best: string }>> {
  try {
    // Сначала пробуем загрузить из neo-assets.json для Neo домов
    try {
      const neoRes = await fetch(`/data/neo-assets.json?ts=${Date.now()}` as any, { cache: 'no-store' as RequestCache });
      if (neoRes.ok) {
        const neoData = await neoRes.json();
        // Проверяем разные варианты ID для Neo домов
        const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;
        const neoHouseData = neoData?.neoHouses && (
          neoData.neoHouses[houseId] || 
          neoData.neoHouses[cleanHouseId] || 
          neoData.neoHouses[cleanHouseId.toLowerCase()] || 
          neoData.neoHouses[cleanHouseId.charAt(0).toUpperCase() + cleanHouseId.slice(1).toLowerCase()]
        );
        
        if (neoHouseData?.comparison?.features) {
          console.log(`Found Neo comparison features for ${houseId}:`, neoHouseData.comparison.features);
          return neoHouseData.comparison.features;
        }
      }
    } catch (neoError) {
      console.log('Neo assets not found, trying house-assets.json');
    }

    // Если не найдено в neo-assets.json, пробуем house-assets.json
    const res = await fetch(`/data/house-assets.json?ts=${Date.now()}` as any, { cache: 'no-store' as RequestCache });
    if (!res.ok) return {};
    const data = await res.json();
    const houseData = (data?.houses && (data.houses[houseId] || data.houses[houseId.toLowerCase()] || data.houses[(houseId.charAt(0).toUpperCase() + houseId.slice(1).toLowerCase())])) || null;
    const features = houseData?.comparison?.features;
    return features && typeof features === 'object' ? features : {};
  } catch (e) {
    console.warn('[universalAssets.getComparisonFeatures] failed:', e);
    return {};
  }
}

/**
 * Получает путь к ассету с проверкой доступности или с учетом типа и параметров
 * Перегруженная функция для разных случаев использования
 */
export async function getAssetPath(
  pathOrType: string, 
  fallbackPathOrHouseId?: string, 
  options?: { format?: string; dp?: number; pk?: number }
): Promise<string> {
  // Определяем, какая версия функции вызвана
  if (fallbackPathOrHouseId && fallbackPathOrHouseId.startsWith('/')) {
    // Базовая версия с путями
    return getAssetPathBasic(pathOrType, fallbackPathOrHouseId);
  } else {
    // Расширенная версия с типом и домом
    return getAssetPathExtended(pathOrType, fallbackPathOrHouseId || '', options);
  }
}

/**
 * Базовая версия getAssetPath
 */
async function getAssetPathBasic(basePath: string, fallbackPath?: string): Promise<string> {
  try {
    const response = await fetch(basePath, { method: 'HEAD' });
    if (response.ok) {
      return basePath;
    }
    
    if (fallbackPath) {
      const fallbackResponse = await fetch(fallbackPath, { method: 'HEAD' });
      if (fallbackResponse.ok) {
        return fallbackPath;
      }
    }
    
    return basePath; // Return original path even if not found
  } catch (error) {
    console.error(`Error checking asset path ${basePath}:`, error);
    return fallbackPath || basePath;
  }
}

/**
 * Расширенная версия getAssetPath для совместимости с useHouses
 */
async function getAssetPathExtended(
  assetType: string, 
  houseId: string, 
  options?: { format?: string; dp?: number; pk?: number }
): Promise<string> {
  try {
    const format = options?.format || 'jpg';
    const dp = options?.dp || 1;
    const pk = options?.pk || 1;
    
    // Получаем правильное имя директории
    const houseDirectoryMap: Record<string, string> = {
      'walnut': 'Walnut',      // Заглавная W в файловой системе
      'oak': 'Oak',            // Заглавная O в файловой системе
      'tamarack': 'tamarack',  // lowercase в файловой системе
      'laurel': 'laurel',      // lowercase в файловой системе
      'pine': 'pine',          // lowercase в файловой системе
      'ponderosa': 'ponderosa', // lowercase в файловой системе
      'juniper': 'juniper',    // lowercase в файловой системе
      'birch': 'birch',        // lowercase в файловой системе
      'cypress': 'cypress',    // lowercase в файловой системе
      'hemlock': 'hemlock',    // lowercase в файловой системе
      'spruce': 'spruce',      // lowercase в файловой системе
      'sage': 'sage',          // lowercase в файловой системе
      'sapling': 'sapling'     // lowercase в файловой системе
    };
    
    const actualHouseId = houseDirectoryMap[houseId.toLowerCase()] || houseId;
    
    // Строим путь в зависимости от типа ассета
    let basePath = '';
    let fallbackPath = '';
    
    switch (assetType) {
      case 'hero':
        basePath = `/assets/skyline/${actualHouseId}/hero.${format}`;
        fallbackPath = `/assets/skyline/${actualHouseId}/hero.jpg`;
        break;
      case 'exterior':
        basePath = `/assets/skyline/${actualHouseId}/exterior/dp${dp}.${format}`;
        fallbackPath = `/assets/skyline/${actualHouseId}/exterior/dp${dp}.jpg`;
        break;
      case 'interior':
        basePath = `/assets/skyline/${actualHouseId}/interior/pk${pk}.${format}`;
        fallbackPath = `/assets/skyline/${actualHouseId}/interior/pk${pk}.jpg`;
        break;
      case 'floorplan':
        basePath = `/assets/skyline/${actualHouseId}/floorplan.${format}`;
        fallbackPath = `/assets/skyline/${actualHouseId}/floorplan.jpg`;
        break;
      default:
        basePath = `/assets/skyline/${actualHouseId}/${assetType}.${format}`;
        fallbackPath = `/assets/skyline/${actualHouseId}/${assetType}.jpg`;
    }
    
    // Проверяем наличие файла
    try {
      const response = await fetch(basePath, { method: 'HEAD' });
      if (response.ok) {
        return basePath;
      }
      
      // Если не найден, пробуем fallback
      const fallbackResponse = await fetch(fallbackPath, { method: 'HEAD' });
      if (fallbackResponse.ok) {
        return fallbackPath;
      }
      
      // Если и fallback не найден, возвращаем базовый путь
      return basePath;
    } catch (error) {
      console.error(`Error checking asset path ${basePath}:`, error);
      return basePath;
    }
  } catch (error) {
    console.error(`Error in getAssetPath for ${houseId}:`, error);
    return `/assets/skyline/${houseId}/hero.jpg`; // Default fallback
  }
}