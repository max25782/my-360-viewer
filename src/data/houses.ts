// Houses data structure inspired by RG Pro Builders
export interface House {
  id: string;
  name: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  designCollections: string[];
  priceRange: {
    good: number;
    better: number;
    best: number;
  };
  images: {
    hero: string;
    gallery: string[];
    floorPlans: string[];
  };
  specifications: {
    dimensions: string;
    ceilingHeight: string;
    kitchenType: string;
    bathroomType: string;
    exteriorSiding: string;
    flooring: string;
    hvac: string;
  };
  tour360Available: boolean;
}

export const HOUSES: House[] = [
  {
    id: 'walnut',
    name: 'Walnut',
    sqft: 1521,
    bedrooms: 2,
    bathrooms: 2.5,
    description: 'The Walnut Legacy Series offers 1521 square feet of versatile living space, featuring two bedrooms, two and a half baths, and an open two-story living area.',
    features: [
      'Open two-story living area',
      'Optional garage',
      'Modern kitchen design',
      'Master bedroom suite',
      'High ceilings'
    ],
    designCollections: ['heritage', 'haven', 'serenity', 'luxe', 'sunset'],
    priceRange: {
      good: 180000,
      better: 220000,
      best: 280000
    },
    images: {
      hero: '/houses/walnut/hero.jpg',
      gallery: [
        '/houses/walnut/kitchen-1.jpg',
        '/houses/walnut/living-1.jpg',
        '/houses/walnut/bedroom-1.jpg',
        '/houses/walnut/bathroom-1.jpg'
      ],
      floorPlans: [
        '/houses/walnut/floor-plan-1.jpg',
        '/houses/walnut/floor-plan-2.jpg'
      ]
    },
    specifications: {
      dimensions: "32'x36' - 46'x41'",
      ceilingHeight: '8-9 Feet',
      kitchenType: 'Full Kitchen with Upper Cabinets',
      bathroomType: 'Tile Shower, Built-in Vanity',
      exteriorSiding: 'Hardie Lap and Board & Batten',
      flooring: 'Designer Series LVP or Laminate and Tile',
      hvac: 'Mini-Split All Bedrooms'
    },
    tour360Available: true
  },
  {
    id: 'laurel',
    name: 'Laurel',
    sqft: 1056,
    bedrooms: 2,
    bathrooms: 1.5,
    description: 'The Laurel model offers efficient living in 1056 square feet, perfect for couples or small families seeking quality and comfort.',
    features: [
      'Efficient layout',
      'Modern amenities',
      'Open concept living',
      'Private bedrooms'
    ],
    designCollections: ['heritage', 'haven', 'sunset'],
    priceRange: {
      good: 150000,
      better: 180000,
      best: 220000
    },
    images: {
      hero: '/houses/laurel/hero.jpg',
      gallery: [
        '/houses/laurel/kitchen-1.jpg',
        '/houses/laurel/living-1.jpg',
        '/houses/laurel/bedroom-1.jpg'
      ],
      floorPlans: [
        '/houses/laurel/floor-plan-1.jpg'
      ]
    },
    specifications: {
      dimensions: "28'x32'",
      ceilingHeight: '8-9 Feet',
      kitchenType: 'Full Kitchen',
      bathroomType: 'Shower Unit, Built-in Vanity',
      exteriorSiding: 'Hardie Lap',
      flooring: 'Upgraded LVP or Laminate',
      hvac: 'Mini-Split Living Area'
    },
    tour360Available: true
  },
  {
    id: 'tamarack',
    name: 'Tamarack',
    sqft: 683,
    bedrooms: 1,
    bathrooms: 1,
    description: 'The Tamarack is our compact yet comfortable single-bedroom solution, perfect for guest houses or rental units.',
    features: [
      'Compact design',
      'Single bedroom',
      'Efficient use of space',
      'Cost-effective option'
    ],
    designCollections: ['heritage', 'haven'],
    priceRange: {
      good: 120000,
      better: 140000,
      best: 170000
    },
    images: {
      hero: '/houses/tamarack/hero.jpg',
      gallery: [
        '/houses/tamarack/kitchen-1.jpg',
        '/houses/tamarack/living-1.jpg',
        '/houses/tamarack/bedroom-1.jpg'
      ],
      floorPlans: [
        '/houses/tamarack/floor-plan-1.jpg'
      ]
    },
    specifications: {
      dimensions: "24'x28'",
      ceilingHeight: '8 Feet',
      kitchenType: 'Kitchenette',
      bathroomType: 'Tub/Shower Unit',
      exteriorSiding: 'Hardie Lap',
      flooring: 'Builder Grade LVP',
      hvac: 'Mini-Split Living Area'
    },
    tour360Available: true
  },
  {
    id: 'ponderosa',
    name: 'Ponderosa',
    sqft: 763,
    bedrooms: 2,
    bathrooms: 1,
    description: 'The Ponderosa maximizes space efficiency with two bedrooms in just 763 square feet.',
    features: [
      'Two bedrooms',
      'Space efficient',
      'Affordable option',
      'Great for families'
    ],
    designCollections: ['heritage', 'haven', 'sunset'],
    priceRange: {
      good: 130000,
      better: 155000,
      best: 185000
    },
    images: {
      hero: '/houses/ponderosa/hero.jpg',
      gallery: [
        '/houses/ponderosa/kitchen-1.jpg',
        '/houses/ponderosa/living-1.jpg',
        '/houses/ponderosa/bedroom-1.jpg'
      ],
      floorPlans: [
        '/houses/ponderosa/floor-plan-1.jpg'
      ]
    },
    specifications: {
      dimensions: "26'x30'",
      ceilingHeight: '8 Feet',
      kitchenType: 'Kitchenette',
      bathroomType: 'Tub/Shower Unit',
      exteriorSiding: 'Hardie Lap',
      flooring: 'Builder Grade LVP',
      hvac: 'Mini-Split Living Area'
    },
    tour360Available: true
  },
  {
    id: 'pine',
    name: 'Pine',
    sqft: 600,
    bedrooms: 1,
    bathrooms: 1,
    description: 'The Pine model features one bedroom plus a dedicated office space, perfect for remote work.',
    features: [
      'Dedicated office space',
      'Single bedroom',
      'Perfect for remote work',
      'Compact yet functional'
    ],
    designCollections: ['heritage', 'haven'],
    priceRange: {
      good: 115000,
      better: 135000,
      best: 165000
    },
    images: {
      hero: '/houses/pine/hero.jpg',
      gallery: [
        '/houses/pine/kitchen-1.jpg',
        '/houses/pine/office-1.jpg',
        '/houses/pine/bedroom-1.jpg'
      ],
      floorPlans: [
        '/houses/pine/floor-plan-1.jpg'
      ]
    },
    specifications: {
      dimensions: "22'x28'",
      ceilingHeight: '8 Feet',
      kitchenType: 'Kitchenette',
      bathroomType: 'Shower Unit',
      exteriorSiding: 'Hardie Lap',
      flooring: 'Builder Grade LVP',
      hvac: 'Mini-Split Living Area'
    },
    tour360Available: true
  },
  {
    id: 'cypress',
    name: 'Cypress',
    sqft: 960,
    bedrooms: 1,
    bathrooms: 2,
    description: 'The Cypress offers luxury living with one bedroom, office space, and two full bathrooms.',
    features: [
      'Two full bathrooms',
      'Office space',
      'Luxury finishes',
      'Premium layout'
    ],
    designCollections: ['heritage', 'haven', 'serenity', 'luxe'],
    priceRange: {
      good: 145000,
      better: 175000,
      best: 210000
    },
    images: {
      hero: '/houses/cypress/hero.jpg',
      gallery: [
        '/houses/cypress/kitchen-1.jpg',
        '/houses/cypress/office-1.jpg',
        '/houses/cypress/bedroom-1.jpg',
        '/houses/cypress/bathroom-1.jpg'
      ],
      floorPlans: [
        '/houses/cypress/floor-plan-1.jpg'
      ]
    },
    specifications: {
      dimensions: "30'x32'",
      ceilingHeight: '9 Feet',
      kitchenType: 'Full Kitchen with Upper Cabinets',
      bathroomType: 'Tile Shower, Built-in Vanity',
      exteriorSiding: 'Hardie Lap and Board & Batten',
      flooring: 'Upgraded LVP or Laminate',
      hvac: 'Mini-Split Living Area and Bedroom'
    },
    tour360Available: true
  }
];

// Helper functions
export const getHouse = (id: string): House | undefined => 
  HOUSES.find(house => house.id === id);

export const getHousesByCollection = (collection: string): House[] =>
  HOUSES.filter(house => house.designCollections.includes(collection));

export const getAllCollections = (): string[] => {
  const collections = new Set<string>();
  HOUSES.forEach(house => 
    house.designCollections.forEach(collection => 
      collections.add(collection)
    )
  );
  return Array.from(collections);
};
