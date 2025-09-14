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
 * Load models from API
 */
export async function loadModelsFromAPI(): Promise<ModelData[]> {
  try {
    console.log('Загружаем модели из API...');
    const response = await fetch('/api/houses');
    console.log('Ответ API:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('Failed to load models:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return [];
    }

    const apiResponse = await response.json();
    console.log('API Response:', apiResponse);
    
    // Извлекаем данные из структуры API
    const data = apiResponse.success ? apiResponse.data.categories : apiResponse;
    const allModels: ModelData[] = [];
    
    // Process skyline models
    if (data.skyline && data.skyline.houses && Array.isArray(data.skyline.houses)) {
      const skylineModels = data.skyline.houses.map((m: any) => ({
        ...m,
        collection: 'skyline',
        sqft: m.squareFeet || 800,
        basePrice: m.basePrice || m.price || 150000,
        bedrooms: m.bedrooms || 1,
        bathrooms: m.bathrooms || 1,
        area: m.area || `${m.squareFeet || 800} sq ft`,
        features: m.features || [],
        heroImage: m.images?.hero || m.heroImage || '/assets/skyline/default/hero.webp'
      }));
      allModels.push(...skylineModels);
    }
    
    // Process neo models
    if (data.neo && data.neo.houses && Array.isArray(data.neo.houses)) {
      const neoModels = data.neo.houses.map((m: any) => ({
        ...m,
        collection: 'neo',
        sqft: m.squareFeet || 600,
        basePrice: m.basePrice || m.price || 120000,
        bedrooms: m.bedrooms || 1,
        bathrooms: m.bathrooms || 1,
        area: m.area || `${m.squareFeet || 600} sq ft`,
        features: m.features || [],
        heroImage: m.images?.hero || m.heroImage || '/assets/neo/default/hero.jpg'
      }));
      allModels.push(...neoModels);
    }
    
    // Process premium models
    if (data.premium && data.premium.houses && Array.isArray(data.premium.houses)) {
      const premiumModels = data.premium.houses.map((m: any) => ({
        ...m,
        collection: 'premium',
        sqft: m.squareFeet || 1200,
        basePrice: m.basePrice || m.price || 200000,
        bedrooms: m.bedrooms || 2,
        bathrooms: m.bathrooms || 2,
        area: m.area || `${m.squareFeet || 1200} sq ft`,
        features: m.features || [],
        heroImage: m.images?.hero || m.heroImage || '/assets/premium/default/hero.jpg'
      }));
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

/**
 * Filter models based on collection and favorites
 */
export function filterModels(
  models: ModelData[], 
  selectedCollection: string, 
  favorites: string[]
): ModelData[] {
  if (!Array.isArray(models)) return [];
  
  return models.filter(model => {
    if (selectedCollection === 'favorites') {
      return favorites.includes(model.id);
    }
    return model.collection === selectedCollection;
  });
}
