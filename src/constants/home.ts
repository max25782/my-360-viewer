import { CollectionData, Collection } from '../types/home';

// Logo path
export const SEATTLE_ADU_LOGO = '/logo.png';

// Collection configurations
export const COLLECTION_DATA: Record<Collection, CollectionData> = {
  skyline: {
    name: 'SKYLINE',
    code: 'SLN-7X',
    primaryColor: '#3B82F6',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
    activeGlow: 'rgba(59, 130, 246, 0.4)'
  },
  neo: {
    name: 'NEO',
    code: 'NEO-9A',
    primaryColor: '#9333EA',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #a21caf 100%)',
    activeGlow: 'rgba(147, 51, 234, 0.4)'
  },
  premium: {
    name: 'PREMIER',
    code: 'PRM-5E',
    primaryColor: '#06B6D4',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #0891b2 100%)',
    activeGlow: 'rgba(6, 182, 212, 0.4)'
  },
  favorites: {
    name: 'FAVORITES',
    code: 'SVD-1C',
    primaryColor: '#EAB308', // Will be overridden based on favorites count
    gradient: 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)',
    activeGlow: 'rgba(234, 179, 8, 0.4)'
  },
  coupons: {
    name: 'OFFERS',
    code: 'CPN-2X',
    primaryColor: '#F59E0B',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    activeGlow: 'rgba(245, 158, 11, 0.4)'
  }
};

// Tab configurations
export const MODEL_TABS = [
  { id: 'virtual-tour', icon: 'Play', label: 'Virtual Tour', gradient: 'from-purple-500 to-pink-500' },
  { id: 'exterior', icon: 'HomeIcon', label: 'Exterior', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'interior', icon: 'Layout', label: 'Interior', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'floor-plan', icon: 'Ruler', label: 'Floor Plan & Features', gradient: 'from-orange-500 to-red-500' }
] as const;

// Collections array for iteration
export const COLLECTIONS: Collection[] = ['skyline', 'neo', 'premium', 'favorites', 'coupons'];

// Default values
export const DEFAULT_VALUES = {
  BEDROOMS: 1,
  BATHROOMS: 1,
  SQFT: 1000,
  MAX_DP: 4,
  MAX_PK: 4,
  MAX_COMPARE_ITEMS: 3,
  IMAGE_COUNT: 4
} as const;
