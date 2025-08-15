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
      hero: '/assets/Walnut/walnut-hero.jpg',
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
              hero: '/assets/laurel/laurel-thumb.jpg',
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
      hero: '/assets/tamarack/tamarack-hero.jpg',
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
      hero: '/assets/ponderosa/ADU-Hero-Ponderosa.jpg',
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
      hero: '/houses/pine/ADU-Hero-Pine.jpg',
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
  },
  {
    id: 'birch',
    name: 'Birch',
    sqft: 1056,
    bedrooms: 2,
    bathrooms: 1.5,
    description: 'The Birch model offers modern living with two bedrooms and an open great room concept, perfect for contemporary lifestyles.',
    features: [
      'Open great room concept',
      'Two bedrooms',
      'Modern kitchen design',
      'Efficient layout',
      'Contemporary styling'
    ],
    designCollections: ['heritage', 'haven', 'serenity', 'luxe'],
    priceRange: {
      good: 150000,
      better: 180000,
      best: 220000
    },
    images: {
      hero: '/assets/birch/ADU-Hero-Birch.jpg',
      gallery: [
        '/assets/birch/interior/KITCHEN/Birch_Sapling-Kitchen-DP1.jpg',
        '/assets/birch/interior/LIV/Birch_Sapling-Living-DP1.jpg',
        '/assets/birch/interior/BEDROOM/Birch_Sapling-Bedroom-DP1.jpg',
        '/assets/birch/interior/BATHROOM/Birch_Sapling-Bathroom-DP1.jpg'
      ],
      floorPlans: [
        '/assets/birch/good and plans/birch-good-1.jpg',
        '/assets/birch/good and plans/birch-better-1.jpg',
        '/assets/birch/good and plans/birch-best-1.jpg'
      ]
    },
    specifications: {
      dimensions: "30'x36'",
      ceilingHeight: '8-9 Feet',
      kitchenType: 'Full Kitchen with Upper Cabinets',
      bathroomType: 'Shower Unit, Built-in Vanity',
      exteriorSiding: 'Hardie Lap and Board & Batten',
      flooring: 'Upgraded LVP or Laminate',
      hvac: 'Mini-Split Living Area and Primary Bedroom'
    },
    tour360Available: true
  },
  {
    id: 'hemlock',
    name: 'Hemlock',
    sqft: 357,
    bedrooms: 1,
    bathrooms: 1,
    description: 'The Hemlock is our most compact model, perfect for minimalist living or as a guest house.',
    features: [
      'Ultra-compact design',
      'Single bedroom',
      'Efficient use of space',
      'Perfect for guests',
      'Affordable option'
    ],
    designCollections: ['heritage', 'haven'],
    priceRange: {
      good: 95000,
      better: 115000,
      best: 140000
    },
    images: {
      hero: '/assets/hemlock/ADU-Hero-Hemlock.jpg',
      gallery: [
        '/assets/hemlock/interior/KITCHEN/Hemlock-Kitchen-DP1.jpg',
        '/assets/hemlock/interior/BEDROOM/Hemlock-Bedroom-DP1.jpg',
        '/assets/hemlock/interior/BATHROOM/Hemlock-Bathroom-DP1.jpg'
      ],
      floorPlans: [
        '/assets/hemlock/good and plans/hemlock-good-1.jpg',
        '/assets/hemlock/good and plans/hemlock-better-1.jpg',
        '/assets/hemlock/good and plans/hemlock-best-1.jpg'
      ]
    },
    specifications: {
      dimensions: "20'x18'",
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
    id: 'juniper',
    name: 'Juniper',
    sqft: 644,
    bedrooms: 1,
    bathrooms: 1,
    description: 'The Juniper combines compact living with modern amenities, featuring a great room and single bedroom.',
    features: [
      'Great room design',
      'Single bedroom',
      'Modern amenities',
      'Compact yet comfortable',
      'Open layout'
    ],
    designCollections: ['heritage', 'haven', 'serenity'],
    priceRange: {
      good: 125000,
      better: 150000,
      best: 185000
    },
    images: {
      hero: '/assets/juniper/ADU-Hero-Juniper.jpg',
      gallery: [
        '/assets/juniper/interior/KITCHEN/Juniper-Kitchen-DP1.jpg',
        '/assets/juniper/interior/BEDROOM/Juniper-Bedroom-DP1.jpg'
      ],
      floorPlans: [
        '/assets/juniper/good and plans/juniper-good-1.jpg',
        '/assets/juniper/good and plans/Juniper-Better-1.jpg',
        '/assets/juniper/good and plans/Juniper-Best-1.jpg'
      ]
    },
    specifications: {
      dimensions: "26'x25'",
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
    id: 'oak',
    name: 'Oak',
    sqft: 1200,
    bedrooms: 2,
    bathrooms: 2,
    description: 'The Oak model provides spacious two-bedroom, two-bathroom living with premium finishes.',
    features: [
      'Two full bathrooms',
      'Spacious bedrooms',
      'Premium finishes',
      'Open concept',
      'High-end design'
    ],
    designCollections: ['heritage', 'haven', 'serenity', 'luxe'],
    priceRange: {
      good: 175000,
      better: 215000,
      best: 265000
    },
    images: {
      hero: '/assets/Oak/oak2.png',
      gallery: [
        '/assets/Oak/interior/Oak-Kitchen-DP1.jpg',
        '/assets/Oak/interior/Oak-Living-DP1.jpg',
        '/assets/Oak/interior/Oak-Bedroom-DP1.jpg',
        '/assets/Oak/interior/Oak-Bathroom-DP1.jpg'
      ],
      floorPlans: [
        '/assets/Oak/good and plans/oak-good-1.jpg',
        '/assets/Oak/good and plans/oak-better-1.jpg',
        '/assets/Oak/good and plans/oak-best-1.jpg'
      ]
    },
    specifications: {
      dimensions: "34'x36'",
      ceilingHeight: '9 Feet',
      kitchenType: 'Full Kitchen with Upper Cabinets',
      bathroomType: 'Tile Shower, Built-in Vanity',
      exteriorSiding: 'Hardie Lap and Board & Batten',
      flooring: 'Designer Series LVP or Laminate and Tile',
      hvac: 'Mini-Split All Bedrooms'
    },
    tour360Available: true
  },
  {
    id: 'sage',
    name: 'Sage',
    sqft: 800,
    bedrooms: 2,
    bathrooms: 1,
    description: 'The Sage model maximizes space efficiency with two bedrooms in a thoughtfully designed layout.',
    features: [
      'Two bedrooms',
      'Space efficient design',
      'Thoughtful layout',
      'Great for families',
      'Affordable living'
    ],
    designCollections: ['heritage', 'haven', 'sunset'],
    priceRange: {
      good: 135000,
      better: 165000,
      best: 200000
    },
    images: {
      hero: '/assets/sage/ADU-Hero-Sage.jpg',
      gallery: [
        '/assets/sage/interior/Sage-Kitchen-DP1.jpg',
        '/assets/sage/interior/Sage-Living-DP1.jpg',
        '/assets/sage/interior/Sage-Bedroom-DP1.jpg',
        '/assets/sage/interior/Sage-Bathroom-DP1.jpg'
      ],
      floorPlans: [
        '/assets/sage/good and plans/sage-good-1.jpg',
        '/assets/sage/good and plans/sage-better-1.jpg',
        '/assets/sage/good and plans/sage-best-1.jpg'
      ]
    },
    specifications: {
      dimensions: "28'x29'",
      ceilingHeight: '8 Feet',
      kitchenType: 'Full Kitchen',
      bathroomType: 'Tub/Shower Unit',
      exteriorSiding: 'Hardie Lap',
      flooring: 'Upgraded LVP or Laminate',
      hvac: 'Mini-Split Living Area'
    },
    tour360Available: true
  },
  {
    id: 'sapling',
    name: 'Sapling',
    sqft: 644,
    bedrooms: 1,
    bathrooms: 1,
    description: 'The Sapling offers modern compact living with all the essentials in a beautifully designed package.',
    features: [
      'Compact modern design',
      'Single bedroom',
      'Efficient layout',
      'Modern amenities',
      'Perfect starter home'
    ],
    designCollections: ['heritage', 'haven'],
    priceRange: {
      good: 120000,
      better: 145000,
      best: 175000
    },
    images: {
      hero: '/assets/sapling/3-Sapling-644.png',
      gallery: [
        '/assets/sapling/interior/Sapling-Kitchen-DP1.jpg',
        '/assets/sapling/interior/Sapling-Living-DP1.jpg',
        '/assets/sapling/interior/Sapling-Bedroom-DP1.jpg',
        '/assets/sapling/interior/Sapling-Bathroom-DP1.jpg'
      ],
      floorPlans: [
        '/assets/sapling/good and plans/sapling-good-1.jpg',
        '/assets/sapling/good and plans/sapling-better-1.jpg',
        '/assets/sapling/good and plans/sapling-best-1.jpg'
      ]
    },
    specifications: {
      dimensions: "26'x25'",
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
    id: 'spruce',
    name: 'Spruce',
    sqft: 800,
    bedrooms: 2,
    bathrooms: 1,
    description: 'The Spruce model provides comfortable two-bedroom living with modern conveniences.',
    features: [
      'Two bedrooms',
      'Modern conveniences',
      'Comfortable living',
      'Efficient design',
      'Great value'
    ],
    designCollections: ['heritage', 'haven', 'sunset'],
    priceRange: {
      good: 140000,
      better: 170000,
      best: 205000
    },
    images: {
      hero: '/assets/spruce/ADU-Hero-Spruce-1.jpg',
      gallery: [
        '/assets/spruce/interior/Spruce-Kitchen-DP1.jpg',
        '/assets/spruce/interior/Spruce-Living-DP1.jpg',
        '/assets/spruce/interior/Spruce-Bedroom-DP1.jpg',
        '/assets/spruce/interior/Spruce-Bathroom-DP1.jpg'
      ],
      floorPlans: [
        '/assets/spruce/good and plans/spruce-good-1.jpg',
        '/assets/spruce/good and plans/spruce-better-1.jpg',
        '/assets/spruce/good and plans/spruce-best-1.jpg'
      ]
    },
    specifications: {
      dimensions: "28'x29'",
      ceilingHeight: '8 Feet',
      kitchenType: 'Full Kitchen',
      bathroomType: 'Tub/Shower Unit',
      exteriorSiding: 'Hardie Lap',
      flooring: 'Upgraded LVP or Laminate',
      hvac: 'Mini-Split Living Area'
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
