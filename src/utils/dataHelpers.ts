import { ModelData } from '../types/home';
import { House } from '../hooks/useHouses';
import { DEFAULT_VALUES } from '../constants/home';

/**
 * Extract proper Skyline house data from house-assets.json
 */
export async function extractSkylineHouseData(modelId: string) {
  try {
    const response = await fetch('/data/house-assets.json');
    const data = await response.json();
    
    // Find house data (case insensitive)
    const houseKey = Object.keys(data).find(key => 
      key.toLowerCase() === modelId.toLowerCase()
    );
    
    if (!houseKey || !data[houseKey]) {
      return null;
    }
    
    const houseData = data[houseKey];
    
    // Extract bedrooms from availableRooms
    const bedrooms = houseData.availableRooms?.filter((room: string) => 
      room.toLowerCase().includes('bedroom') || room.toLowerCase().includes('badroom')
    ).length || DEFAULT_VALUES.BEDROOMS;
    
    // Extract bathrooms from availableRooms  
    const bathrooms = houseData.availableRooms?.filter((room: string) => 
      room.toLowerCase().includes('bathroom')
    ).length || DEFAULT_VALUES.BATHROOMS;
    
    // Extract square feet from comparison.features
    let sqft = houseData.squareFeet || 0;
    
    if (!sqft && houseData.comparison?.features?.['Living Space']) {
      const ls = houseData.comparison.features['Living Space'];
      if (typeof ls === 'object') {
        // Try to extract from best/better/good
        const candidates = [ls.best, ls.better, ls.good].filter((v: any) => v && typeof v === 'string');
        for (const candidate of candidates) {
          const match = candidate.replace(/,/g, '').match(/(\d+)/);
          if (match && match[1]) {
            sqft = parseInt(match[1], 10);
            break;
          }
        }
      }
    }
    
    return {
      bedrooms,
      bathrooms,
      sqft,
      availableRooms: houseData.availableRooms || [],
      comparison: houseData.comparison
    };
  } catch (error) {
    console.error('Error extracting Skyline house data:', error);
    return null;
  }
}

/**
 * Convert ModelData to House for JsonGoodBetterBestComparison
 */
export function convertModelToHouse(model: ModelData): House {
  const bedrooms = model.bedrooms || DEFAULT_VALUES.BEDROOMS;
  const bathrooms = model.bathrooms || DEFAULT_VALUES.BATHROOMS;
  const sqft = model.sqft || DEFAULT_VALUES.SQFT;
  
  return {
    id: model.id,
    name: model.name,
    description: `${bedrooms} bed, ${bathrooms} bath ${model.area}`,
    maxDP: DEFAULT_VALUES.MAX_DP,
    maxPK: DEFAULT_VALUES.MAX_PK,
    availableRooms: Array.from({ length: bedrooms }, () => 'bedroom')
      .concat(Array.from({ length: bathrooms }, () => 'bathroom'))
      .concat(['kitchen', 'living']),
    category: model.collection as 'skyline' | 'neo' | 'premium',
    pricing: {
      good: model.basePrice,
      better: model.basePrice * 1.2,
      best: model.basePrice * 1.5
    },
    images: {
      hero: model.heroImage,
      gallery: [model.heroImage]
    }
  };
}

/**
 * Generate model tab content
 */
export function getModelTabContent(model: ModelData) {
  return {
    exterior: {
      title: 'Exterior Design',
      images: [model.heroImage, model.heroImage, model.heroImage, model.heroImage],
      features: model.features || []
    },
    interior: {
      title: 'Interior Spaces',
      images: [model.heroImage, model.heroImage, model.heroImage, model.heroImage],
      features: model.features || []
    },
    'floor-plan': {
      title: 'Floor Plan & Features',
      images: [model.heroImage, model.heroImage, model.heroImage, model.heroImage],
      features: model.features || []
    },
    'virtual-tour': {
      title: 'Virtual Experience',
      images: [model.collection === 'skyline' ? `/assets/skyline/${model.id}/360/hero.jpg` : model.heroImage],
      features: model.features || []
    }
  };
}

/**
 * Build human-readable feature badges from comparison.features if present
 */
export function getReadableFeatureBadges(model: Partial<ModelData> & { comparison?: any }): string[] {
  const badges: string[] = [];
  const cmp = model?.comparison?.features;
  
  if (!cmp) {
    // Fallback to model.features if available
    if (Array.isArray((model as any).features)) {
      return ((model as any).features as string[]).slice(0, 4);
    }
    return [];
  }

  // Handle Premium format: comparison.features is an array of strings
  if (Array.isArray(cmp)) {
    const premiumFeatures: string[] = [];
    
    cmp.forEach((feature: string) => {
      // Extract key information from feature strings
      if (feature.includes('SF of') && feature.includes('Living Space')) {
        const match = feature.match(/(\d{1,3}(?:,\d{3})*)\s*SF/);
        if (match) premiumFeatures.push(`${match[1]} SF`);
      } else if (feature.includes('Bedroom')) {
        const match = feature.match(/(\d+)\s+.*Bedroom/);
        if (match) premiumFeatures.push(`${match[1]} BR`);
      } else if (feature.includes('Bathroom')) {
        const match = feature.match(/(\d+)\s+.*Bathroom/);
        if (match) premiumFeatures.push(`${match[1]} BA`);
      } else if (feature.includes('Garage')) {
        premiumFeatures.push('Garage');
      } else if (feature.includes('Office') || feature.includes('Flex Room')) {
        premiumFeatures.push('Office');
      } else if (feature.includes('Covered Porch')) {
        premiumFeatures.push('Covered Porch');
      } else if (feature.includes('Covered Deck')) {
        premiumFeatures.push('Covered Deck');
      } else if (feature.includes('ADU')) {
        premiumFeatures.push('ADU');
      }
    });
    
    return premiumFeatures.slice(0, 4);
  }

  // Handle Skyline/Neo format: comparison.features is an object with {good, better, best}
  if (typeof cmp === 'object') {
    const pickNumeric = (label: string, short?: string) => {
      const v = cmp[label];
      if (v && typeof v === 'object') {
        const text = v.best || v.better || v.good || '';
        if (typeof text === 'string') {
          const m = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
          if (m) {
            const value = m[1];
            badges.push(short ? `${value} ${short}` : `${label}: ${value}`);
          }
        }
      }
    };

    // Common numeric badges
    pickNumeric('Bedrooms', 'BR');
    pickNumeric('Baths'); // sometimes labeled differently
    pickNumeric('Bathrooms', 'BA');
    pickNumeric('Living Space', 'SF');

    // Boolean-like features shown with ✓
    const boolKeys = [
      'Garage',
      'Office',
      'Kitchen Island',
      'Extra Storage',
      'Covered Patio',
      'Covered Porch',
      'Bonus Room',
      'Loft',
      'Vaulted Ceiling',
      'Garbage Disposal',
      'Electric Fireplace'
    ];
    
    for (const key of boolKeys) {
      const v = cmp[key];
      if (v && typeof v === 'object') {
        const has = ['best', 'better', 'good'].some((k) => typeof v[k] === 'string' && v[k].includes('✓'));
        if (has) badges.push(key);
      }
    }

    // Special text features that are meaningful
    const textKeys = [
      'Kitchen',
      'Shower',
      'Flooring',
      'Exterior Siding'
    ];
    
    for (const key of textKeys) {
      const v = cmp[key];
      if (v && typeof v === 'object') {
        const text = v.best || v.better || v.good || '';
        if (typeof text === 'string' && text !== '✗' && text.length > 0) {
          // Simplify common text values
          if (key === 'Kitchen' && text.includes('Island')) {
            badges.push('Kitchen Island');
          } else if (key === 'Shower' && text.includes('Tile')) {
            badges.push('Tile Shower');
          } else if (key === 'Flooring' && (text.includes('Tile') || text.includes('Designer'))) {
            badges.push('Premium Flooring');
          }
        }
      }
    }
  }

  // Ensure uniqueness and limit
  return Array.from(new Set(badges)).slice(0, 4);
}

/**
 * Load models from API
 */
export async function loadModelsFromAPI(): Promise<ModelData[]> {
  try {
    console.log('Загружаем модели из API...');
    
    // Получаем токен аутентификации
    const { getAuthToken } = await import('./auth');
    const token = getAuthToken();
    
    // Создаем заголовки с токеном
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Adding auth token to API request');
    } else {
      console.warn('⚠️ No auth token found, making unauthenticated request');
    }
    
    const response = await fetch('/api/houses', {
      method: 'GET',
      headers,
      credentials: 'include' // Включаем cookies
    });
    console.log('Ответ API:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('Failed to load models:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      // Если 401, бросаем ошибку для обработки в хуке
      if (response.status === 401) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }
      
      return [];
    }

    const apiResponse = await response.json();
    console.log('API Response:', apiResponse);
    
    // Извлекаем данные из структуры API
    const data = apiResponse.success ? apiResponse.data.categories : apiResponse;
    console.log('🔍 Data structure:', Object.keys(data));
    console.log('🔍 Premium data:', data.premium);
    const allModels: ModelData[] = [];
    
    // Утилита: надёжно привести площадь к числу (берём максимум из всех 3-6значных групп)
    function toNumericSqft(input: unknown, fallback: number): number {
      if (typeof input === 'number' && Number.isFinite(input)) return input;
      if (typeof input === 'string') {
        const cleaned = input.replace(/,/g, '');
        const matches = cleaned.match(/\d{3,6}/g);
        if (matches && matches.length > 0) {
          const nums = matches.map((m: string) => parseInt(m, 10)).filter(n => Number.isFinite(n));
          if (nums.length > 0) return Math.max(...nums);
        }
      }
      return fallback;
    }

    // Process skyline models
    if (data.skyline && data.skyline.houses && Array.isArray(data.skyline.houses)) {
      const skylineModels = data.skyline.houses.map((m: any) => {
        const sqft = toNumericSqft(m.squareFeet ?? m.area, 800);
        const basePrice = Math.round(sqft * 340);
        return {
          ...m,
          collection: 'skyline',
          sqft,
          basePrice,
          bedrooms: m.bedrooms || 1,
          bathrooms: m.bathrooms || 1,
          area: m.area || `${sqft} sq ft`,
          features: m.features || [],
          heroImage: m.images?.hero || m.heroImage || '/assets/skyline/default/hero.webp'
        };
      });
      allModels.push(...skylineModels);
    }
    
    // Process neo models
    if (data.neo && data.neo.houses && Array.isArray(data.neo.houses)) {
      const neoModels = data.neo.houses.map((m: any) => {
        const sqft = toNumericSqft(m.squareFeet ?? m.area, 600);
        const basePrice = Math.round(sqft * 340);
        return {
          ...m,
          collection: 'neo',
          sqft,
          basePrice,
          bedrooms: m.bedrooms || 1,
          bathrooms: m.bathrooms || 1,
          area: m.area || `${sqft} sq ft`,
          features: m.features || [],
          heroImage: m.images?.hero || m.heroImage || '/assets/neo/default/hero.jpg'
        };
      });
      allModels.push(...neoModels);
    }
    
    // Process premium models
    if (data.premium && data.premium.houses && Array.isArray(data.premium.houses)) {
      const premiumModels = data.premium.houses.map((m: any) => {
        const sqft = toNumericSqft(m.squareFeet ?? m.area, 1200);
        const basePrice = Math.round(sqft * 340);
        return {
          ...m,
          collection: 'premium',
          sqft,
          basePrice,
          bedrooms: m.bedrooms || 2,
          bathrooms: m.bathrooms || 2,
          area: m.area || `${sqft} sq ft`,
          features: m.features || [],
          heroImage: m.images?.hero || m.heroImage || '/assets/premium/default/hero.jpg'
        };
      });
      allModels.push(...premiumModels);
    }
    
    console.log('Загружено моделей:', allModels.length);
    console.log('Первые 3 модели с изображениями:', allModels.slice(0, 3).map(m => ({
      id: m.id,
      name: m.name,
      heroImage: m.heroImage
    })));
    
    return allModels;
  } catch (error) {
    console.error('Error loading models:', error);
    return [];
  }
}

// Infer features from model content (description and comparison features)
function getModelFeatureText(model: any): string {
  const parts: string[] = [];
  if (model?.description) parts.push(String(model.description));
  const comparisonFeatures = model?.comparison?.features;
  if (comparisonFeatures && typeof comparisonFeatures === 'object') {
    for (const value of Object.values(comparisonFeatures)) {
      if (value && typeof value === 'object') {
        const v: any = value;
        ['good', 'better', 'best'].forEach((k) => {
          const t = v?.[k];
          if (typeof t === 'string') parts.push(t);
        });
      } else if (typeof value === 'string') {
        parts.push(value);
      }
    }
  }
  return parts.join(' ').toLowerCase();
}

function hasModelFeature(model: ModelData, featureId: string): boolean {
  const text = getModelFeatureText(model);
  switch (featureId) {
    case 'garage':
      return text.includes('garage');
    case 'office':
      return text.includes('office');
    case 'primary-suite':
      return (model.bedrooms ?? 0) >= 2 || text.includes('primary suite') || text.includes('primary bedroom');
    case 'kitchen-island':
      return text.includes('island');
    case 'extra-storage':
      return text.includes('storage') || text.includes('pantry') || text.includes('walk-in') || text.includes('closet');
    case 'covered-patio':
      return text.includes('covered patio');
    case 'covered-porch':
      return text.includes('covered porch');
    case 'bonus-room':
      return text.includes('bonus room') || text.includes('loft') || text.includes('flex room');
    case 'covered-deck':
      return text.includes('covered deck') || text.includes('deck');
    default:
      return false;
  }
}

/**
 * Filter models based on collection, favorites, and configurator filters
 */
export function filterModels(
  models: ModelData[], 
  selectedCollection: string, 
  favorites: string[],
  configuratorFilters?: {
    bedrooms?: string;
    bathrooms?: string;
    sqftMin?: string;
    sqftMax?: string;
    features?: string[];
  }
): ModelData[] {
  if (!Array.isArray(models)) return [];
  
  // Принудительно исправляем известные проблемные модели
  const fixedModels = models.map(model => {
    if (model.id === 'Walnut' && model.sqft === 521) {
      const correctSqft = 1521;
      return { 
        ...model, 
        sqft: correctSqft,
        basePrice: Math.round(correctSqft * 340),
        area: `${correctSqft} sq ft`
      };
    }
    if (model.id === 'laurel' && model.sqft === 56) {
      const correctSqft = 1056;
      return { 
        ...model, 
        sqft: correctSqft,
        basePrice: Math.round(correctSqft * 340),
        area: `${correctSqft} sq ft`
      };
    }
    return model;
  });

  let filteredModels = fixedModels.filter(model => {
    if (selectedCollection === 'favorites') {
      return favorites.includes(model.id);
    }
    if (selectedCollection === 'coupons') {
      // For coupons, we don't filter models - we'll show the OffersSection instead
      return false;
    }
    return model.collection === selectedCollection;
  });

  // Apply configurator filters if provided
  if (configuratorFilters) {
    // Filter by bedrooms (inclusive: >= selected)
    if (configuratorFilters.bedrooms && configuratorFilters.bedrooms !== 'any') {
      const bedroomCount = parseInt(configuratorFilters.bedrooms);
      if (!isNaN(bedroomCount)) {
        filteredModels = filteredModels.filter(model => (model.bedrooms || 1) >= bedroomCount);
      }
    }

    // Filter by bathrooms (inclusive: >= selected; round up model 1.5 -> 2)
    if (configuratorFilters.bathrooms && configuratorFilters.bathrooms !== 'any') {
      const bathroomCount = parseFloat(configuratorFilters.bathrooms);
      if (!isNaN(bathroomCount)) {
        filteredModels = filteredModels.filter(model => {
          const modelBathrooms = model.bathrooms ?? 1;
          const rounded = Math.ceil(modelBathrooms);
          return rounded >= bathroomCount;
        });
      }
    }

    // Filter by square feet (unknown sqft should not exclude the model)
    if (configuratorFilters.sqftMin || configuratorFilters.sqftMax) {
      const minSqft = configuratorFilters.sqftMin ? parseInt(configuratorFilters.sqftMin) : 0;
      const maxSqft = configuratorFilters.sqftMax ? parseInt(configuratorFilters.sqftMax) : Infinity;
      
      if (!isNaN(minSqft) && !isNaN(maxSqft)) {
        console.log('[filters] sqft range:', { minSqft, maxSqft });
        filteredModels = filteredModels.filter(model => {
          const modelSqft = model.sqft ?? 0;
          console.log('[filters] model sqft:', { id: model.id, name: model.name, sqft: modelSqft });
          if (!modelSqft || modelSqft <= 0) return true; // keep when unknown
          return modelSqft >= minSqft && modelSqft <= maxSqft;
        });
      }
    }

    // Filter by features (dynamic inference from model data)
    if (configuratorFilters.features && configuratorFilters.features.length > 0) {
      filteredModels = filteredModels.filter(model =>
        configuratorFilters.features!.some(featureId => hasModelFeature(model, featureId))
      );
    }
  }

  return filteredModels;
}
