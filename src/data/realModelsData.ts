export interface ExteriorOption {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description?: string;
  isPopular?: boolean;
}

export interface InteriorDesign {
  id: string;
  name: string;
  imageUrl: string;
  style: string;
  price?: number;
  isPreferred?: boolean;
}

export interface ModelData {
  id: string;
  name: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  heroImage: string;
  features: string[];
  collection: string;
  category?: string;
  squareFeet?: number;
  sqft?: number;
  description?: string;
  priceRange?: string;
  deliveryTime?: string;
  installationTime?: string;
  lotCompatibility?: string;
  dimensions?: {
    width: number;
    depth: number;
  };
  stories?: number;
  specifications?: {
    foundation: string;
    framing: string;
    roofing: string;
    siding: string;
    windows: string;
    insulation: string;
    electrical: string;
    plumbing: string;
    flooring: string;
    appliances: string[];
  };
  floorPlans?: Array<{
    id: string;
    name: string;
    imageUrl: string;
    sqft: number;
    isPopular?: boolean;
  }>;
  exteriorOptions?: Array<{
    id: string;
    type: string;
    name: string;
    price: number;
    imageUrl: string;
  }>;
  interiorDesigns?: InteriorDesign[];
  gallery?: string[];
  view360Url?: string;
  has360View?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

// Функция для конвертации данных из API в формат ModelData
export function convertHouseToModel(house: any): ModelData {
  return {
    id: house.id,
    name: house.name,
    area: house.area,
    bedrooms: house.bedrooms,
    bathrooms: house.bathrooms,
    basePrice: house.basePrice,
    heroImage: house.heroImage,
    features: house.features || [],
    collection: house.collection || 'skyline',
    squareFeet: house.squareFeet || parseInt(house.area?.replace(/[^\d]/g, '') || '800'),
    sqft: house.squareFeet || parseInt(house.area?.replace(/[^\d]/g, '') || '800'),
    description: house.description,
    priceRange: `$${house.basePrice?.toLocaleString()}+`,
    deliveryTime: '8-12 weeks',
    installationTime: '2-4 weeks',
    lotCompatibility: 'Most residential lots',
    dimensions: {
      width: Math.floor((house.squareFeet || 800) / 30),
      depth: 30
    },
    stories: 1,
    specifications: {
      foundation: 'Concrete slab or crawl space',
      framing: '2x6 advanced framing',
      roofing: 'Architectural shingles',
      siding: 'Fiber cement or wood',
      windows: 'Double-pane low-E',
      insulation: 'R-21 walls, R-49 ceiling',
      electrical: '200-amp panel, LED lighting',
      plumbing: 'PEX piping, low-flow fixtures',
      flooring: 'Luxury vinyl plank',
      appliances: ['Energy Star refrigerator', 'Induction cooktop', 'Convection microwave']
    },
    floorPlans: [
      {
        id: 'standard',
        name: 'Standard Layout',
        imageUrl: house.heroImage,
        sqft: house.squareFeet || 800,
        isPopular: true
      }
    ],
    interiorDesigns: [
      {
        id: 'modern',
        name: 'Modern Design',
        imageUrl: house.heroImage,
        style: 'Contemporary',
        isPreferred: true
      }
    ],
    gallery: [house.heroImage],
    has360View: true,
    isNew: false,
    isPopular: false,
    isFeatured: false,
    createdAt: new Date().toISOString()
  };
}

// Пустой массив для совместимости
export const REAL_ADU_MODELS: ModelData[] = [];
