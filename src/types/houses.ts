/**
 * Типы данных для домов и категорий
 */

export type HouseCategory = 'A' | 'B' | 'C' | 'neo' | 'skyline' | 'modern' | 'premium';

export interface CategoryMetadata {
  id: HouseCategory;
  title: string;
  count: number;
  description: string;
}

export interface CategoriesIndex {
  categories: CategoryMetadata[];
  totalHouses: number;
  lastUpdated: string;
}

export interface HouseCard {
  id: string;
  name: string;
  description: string;
  category?: HouseCategory;
  image: string; // hero image
  maxDP?: number;
  maxPK?: number;
  availableRooms?: string[];
  // Legacy fields (optional for backward compatibility)
  thumbnail?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  hasTour360?: boolean;
  hasComparison?: boolean;
  hasDesignPackages?: boolean;
}

export interface PanoramaTiles {
  front: string;
  back: string;
  left: string;
  right: string;
  up: string;
  down: string;
}

export interface PanoramaMarker {
  id: string;
  type: 'room' | 'info' | 'hotspot';
  position: {
    yaw: number;
    pitch: number;
  };
  targetPanoramaId?: string;
  label: string;
  icon?: string;
}

export interface Panorama {
  id: string;
  room: string;
  title: string;
  thumbnail: string;
  preview: string;
  tiles: PanoramaTiles;
  defaultView: {
    yaw: number;
    pitch: number;
    zoom: number;
  };
  markers: PanoramaMarker[];
}

export interface DesignPackage {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  images: {
    exterior: string[];
    interior: Record<string, string[]>;
  };
  features: string[];
  priceModifier: number;
}

export interface HouseDetails {
  id: string;
  name: string;
  description: string;
  category: HouseCategory;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  hero: string;
  gallery: string[];
  tour360?: {
    enabled: boolean;
    panoramas: Panorama[];
    defaultPanoramaId: string;
  };
  designPackages: DesignPackage[];
  defaultDesignPackageId?: string;
  comparison?: {
    enabled: boolean;
    features: Record<string, any>;
  };
  relatedIds: string[];
  tags: string[];
  lastUpdated: string;
}
