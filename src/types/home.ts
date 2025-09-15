// Types for Home page
export type MainTab = 'collections' | 'model-details';
export type ModelTab = 'exterior' | 'interior' | 'floor-plan' | 'virtual-tour';
export type Collection = 'skyline' | 'neo' | 'premium' | 'favorites' | 'coupons';
export type ViewMode = 'grid' | 'list';

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
}

export interface CollectionData {
  name: string;
  code: string;
  primaryColor: string;
  gradient: string;
  activeGlow: string;
}

export interface ModelTabContent {
  title: string;
  images: string[];
  features: string[];
}

export interface HomeState {
  isDark: boolean;
  mainTab: MainTab;
  modelTab: ModelTab;
  selectedCollection: Collection;
  selectedModel: ModelData | null;
  viewMode: ViewMode;
  favorites: string[];
  compareList: string[];
  currentImageIndex: number;
  showComparison: boolean;
  models: ModelData[];
  userProfile: any;
  recommendations: any[];
  is360ViewerOpen: boolean;
  current360Model: ModelData | null;
  detailedModel: ModelData | null;
}
