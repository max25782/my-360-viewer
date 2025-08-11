// Design Collections inspired by RG Pro Builders
export interface DesignCollection {
  id: string;
  name: string;
  displayName: string;
  description: string;
  theme: 'dark' | 'light' | 'natural' | 'premium' | 'warm';
  features: string[];
  priceModifier: number; // multiplier for base price
}

export const DESIGN_COLLECTIONS: DesignCollection[] = [
  {
    id: 'heritage',
    name: 'Heritage',
    displayName: 'Heritage (DC1)',
    description: 'Classic design with timeless appeal and traditional finishes',
    theme: 'dark',
    features: [
      'Traditional color palette',
      'Classic hardware',
      'Timeless finishes',
      'Natural materials'
    ],
    priceModifier: 1.0
  },
  {
    id: 'haven',
    name: 'Haven',
    displayName: 'Haven (DC2)',
    description: 'Light and airy design creating a peaceful sanctuary',
    theme: 'light',
    features: [
      'Light color scheme',
      'Bright finishes',
      'Airy atmosphere',
      'Peaceful design'
    ],
    priceModifier: 1.1
  },
  {
    id: 'serenity',
    name: 'Serenity',
    displayName: 'Serenity (DC3)',
    description: 'Natural materials and calming tones for ultimate relaxation',
    theme: 'natural',
    features: [
      'Natural materials',
      'Calming tones',
      'Organic textures',
      'Zen-inspired design'
    ],
    priceModifier: 1.15
  },
  {
    id: 'luxe',
    name: 'Luxe',
    displayName: 'Luxe (DC4)',
    description: 'Premium finishes and luxury details throughout',
    theme: 'premium',
    features: [
      'Premium fixtures',
      'Luxury materials',
      'High-end finishes',
      'Designer details'
    ],
    priceModifier: 1.25
  },
  {
    id: 'sunset',
    name: 'Sunset',
    displayName: 'Sunset (DC5)',
    description: 'Warm tones and cozy atmosphere for comfortable living',
    theme: 'warm',
    features: [
      'Warm color palette',
      'Cozy atmosphere',
      'Rich textures',
      'Inviting design'
    ],
    priceModifier: 1.2
  }
];

// Helper functions
export const getCollection = (id: string): DesignCollection | undefined =>
  DESIGN_COLLECTIONS.find(collection => collection.id === id);

export const getCollectionsByTheme = (theme: string): DesignCollection[] =>
  DESIGN_COLLECTIONS.filter(collection => collection.theme === theme);

export const calculatePrice = (basePrice: number, collectionId: string): number => {
  const collection = getCollection(collectionId);
  return collection ? Math.round(basePrice * collection.priceModifier) : basePrice;
};
