import { House } from '../data/houses';
import SimpleImageModal from './SimpleImageModal';

interface GoodBetterBestComparisonProps {
  house: House;
}

interface ComparisonItem {
  label: string;
  good: string | React.ReactNode;
  better: string | React.ReactNode;
  best: string | React.ReactNode;
}

export default function GoodBetterBestComparison({ house }: GoodBetterBestComparisonProps) {
  // Dynamic image paths based on house model
  const getImagePaths = () => {
    const houseName = house.name.toLowerCase();
    
    // Handle different naming conventions for different houses
    if (house.id === 'walnut') {
      return {
        goodExterior: `/assets/Walnut/walnut_color/walnut-good.jpg`,
        betterExterior: `/assets/Walnut/walnut_color/walnut-better.jpg`,
        bestExterior: `/assets/Walnut/walnut_color/walnut-best.jpg`,
        goodPlan1: `/assets/Walnut/walnut_scena/Walnut-good-1.jpg`,
        betterPlan1: `/assets/Walnut/walnut_scena/Walnut-better-1.jpg`,
        bestPlan1: `/assets/Walnut/walnut_scena/Walnut-best-1.jpg`,
        goodPlan2: `/assets/Walnut/walnut_scena/Walnut-good-2.jpg`,
        betterPlan2: `/assets/Walnut/walnut_scena/Walnut-better-2.jpg`,
        bestPlan2: `/assets/Walnut/walnut_scena/Walnut-best-2.jpg`
      };
    } else if (house.id === 'laurel') {
      return {
        goodExterior: `/assets/laurel/good and plans/laurel-good.jpg`,
        betterExterior: `/assets/laurel/good and plans/laurel-better.jpg`,
        bestExterior: `/assets/laurel/good and plans/laurel-ext-pk3.jpg`,
        goodPlan1: `/assets/laurel/good and plans/Laurel-Good-1.jpg`,
        betterPlan1: `/assets/laurel/good and plans/Laurel-Better-1.jpg`,
        bestPlan1: `/assets/laurel/good and plans/Laurel-Best.jpg`,
      };
    } else if (house.id === 'tamarack') {
      return {
        goodExterior: `/assets/tamarack/good and plans/DP1-Good-Tamarack-Front.jpg`,
        betterExterior: `/assets/tamarack/good and plans/DP3-Better-Tamarack-Front.jpg`,
        bestExterior: `/assets/tamarack/good and plans/EXT-BEST-PK4-TAMARACK-FRONT.jpg`,
        goodPlan1: `/assets/tamarack/good and plans/Tamarack-Better.jpg`, // Using available file
        betterPlan1: `/assets/tamarack/good and plans/Tamarack-Better.jpg`,
        bestPlan1: `/assets/tamarack/good and plans/Tamarack-Best.jpg`,
      };
    } else if (house.id === 'pine') {
      return {
        goodExterior: `/assets/pine/good and plans/Pine-Good-2.jpg`, // Only available good file
        betterExterior: `/assets/pine/good and plans/Pine-Better-Front.jpg`,
        bestExterior: `/assets/pine/good and plans/Pine-Best-Front.jpg`,
        goodPlan1: `/assets/pine/good and plans/Pine-Good-2.jpg`,
        betterPlan1: `/assets/pine/good and plans/Pine-Better-2.jpg`,
        bestPlan1: `/assets/pine/good and plans/Pine-Best-2.jpg`,
      };
    } else {
      // For new houses with the standard structure
      return {
        goodExterior: `/assets/${house.id}/good and plans/EXT-GOOD-PK1-FRONT.jpg`,
        betterExterior: `/assets/${house.id}/good and plans/EXT-BETTER-PK2-FRONT.jpg`,
        bestExterior: `/assets/${house.id}/good and plans/EXT-BEST-PK3-FRONT.jpg`,
        goodPlan1: `/assets/${house.id}/good and plans/good-1.jpg`,
        betterPlan1: `/assets/${house.id}/good and plans/better-1.jpg`,
        bestPlan1: `/assets/${house.id}/good and plans/best-1.jpg`,
        // goodPlan2: house.images.floorPlans?.[0] || `/assets/${house.id}/good and plans/${houseName}-good-2.jpg`,
        // betterPlan2: house.images.floorPlans?.[1] || `/assets/${house.id}/good and plans/${houseName}-better-2.jpg`,
        // bestPlan2: house.images.floorPlans?.[2] || `/assets/${house.id}/good and plans/${houseName}-best-2.jpg`
      };
    }
  };

  const imagePaths = getImagePaths();
  
  const comparisonItems: ComparisonItem[] = [
    {
      label: 'Front Elevation',
      good: (
        <SimpleImageModal 
          src={imagePaths.goodExterior} 
          alt={`Good Package - ${house.name} Front Elevation`} 
          className="w-full h-full object-contain"
          width={400}
          height={300}
        />
      ),
      better: (
        <SimpleImageModal 
          src={imagePaths.betterExterior} 
          alt={`Better Package - ${house.name} Front Elevation`} 
          className="w-full h-full object-contain"
          width={400}
          height={300}
        />
      ),
      best: (
        <SimpleImageModal 
          src={imagePaths.bestExterior} 
          alt={`Best Package - ${house.name} Front Elevation`} 
          className="w-full h-full object-contain"
          width={400}
          height={300}
        />
      )
    },
    {
      label: 'Floor Plan',
      good: (
        <SimpleImageModal 
          src={imagePaths.goodPlan1} 
          alt={`Good Package - ${house.name} Floor Plan`} 
          className="w-full h-32 object-contain"
          width={300}
          height={200}
        />
      ),
      better: (
        <SimpleImageModal 
          src={imagePaths.betterPlan1} 
          alt={`Better Package - ${house.name} Floor Plan`} 
          className="w-full h-32 object-contain"
          width={300}
          height={200}
        />
      ),
      best: (
        <SimpleImageModal 
          src={imagePaths.bestPlan1} 
          alt={`Best Package - ${house.name} Floor Plan`} 
          className="w-full h-32 object-contain"
          width={300}
          height={200}
        />
      )
    },
    {
      label: 'Living Space',
      good: `${house.sqft} SF`,
      better: `${house.sqft} SF`,
      best: `${house.sqft} SF`
    },
    {
      label: 'Outdoor Space',
      good: <span className="text-red-500">✗</span>,
      better: '210 SF',
      best: '210 SF'
    },
    {
      label: 'Overall Dimensions',
      good: house.specifications.dimensions,
      better: house.specifications.dimensions,
      best: house.specifications.dimensions
    },
    {
      label: 'Bedrooms',
      good: `${house.bedrooms} Bedrooms`,
      better: `${house.bedrooms} Bedrooms`,
      best: `${house.bedrooms} Bedrooms`
    },
    {
      label: 'Bathrooms',
      good: `${house.bathrooms} Bathrooms`,
      better: `${house.bathrooms} Bathrooms`,
      best: `${house.bathrooms} Bathrooms`
    },
    {
      label: 'Ceiling Height',
      good: '8 Feet',
      better: '9 Feet',
      best: '9 Feet'
    },
    {
      label: 'Kitchen',
      good: 'Kitchenette',
      better: 'Full Kitchen with Upper Cabs',
      best: 'Full Kitchen with Upper Cabs'
    },
    {
      label: 'Kitchen Island',
      good: <span className="text-red-500">✗</span>,
      better: <span className="text-red-500">✗</span>,
      best: <span className="text-green-500">✓</span>
    },
    {
      label: 'Garbage Disposal',
      good: <span className="text-red-500">✗</span>,
      better: <span className="text-red-500">✗</span>,
      best: <span className="text-green-500">✓</span>
    },
    {
      label: 'Vanity',
      good: 'Pedestal Sink',
      better: 'Built-in Vanity w/ Single Sink',
      best: 'Built-in Vanity w/ Single Sink'
    },
    {
      label: 'Shower',
      good: 'Tub/Shower Unit',
      better: 'Shower Unit',
      best: 'Tile Shower'
    },
    {
      label: 'Bathroom Accessories',
      good: <span className="text-red-500">✗</span>,
      better: <span className="text-green-500">✓</span>,
      best: <span className="text-green-500">✓</span>
    },
    {
      label: 'Exterior Siding',
      good: 'Hardie Lap',
      better: 'Hardie Lap and Board & Batten',
      best: 'Hardie Lap and Board & Batten'
    },
    {
      label: 'Flooring',
      good: 'Builder Grade LVP or Laminate',
      better: 'Upgraded LVP or Laminate',
      best: 'Designer Series LVP or Laminate and Tile'
    },
    {
      label: 'Feature Lighting',
      good: 'Downlighting, Interior and Exterior Fixtures',
      better: 'Downlighting, Ceiling Fans, Interior and Exterior Fixtures',
      best: 'Premium Fixtures from Rejuvenation'
    },
    {
      label: 'Mini-Split HVAC',
      good: 'Living Area',
      better: 'Living Area and Primary Bedroom',
      best: 'Living Area and All Bedrooms'
    },
    {
      label: 'Tank Water Heater',
      good: <span className="text-green-500">✓</span>,
      better: <span className="text-green-500">✓</span>,
      best: <span className="text-green-500">✓</span>
    },
    {
      label: 'Electric Fireplace',
      good: <span className="text-red-500">✗</span>,
      better: <span className="text-red-500">✗</span>,
      best: <span className="text-green-500">✓</span>
    },
    {
      label: 'Available Design Collection',
      good: 'Dark & Light',
      better: 'Heritage, Haven and Sunset',
      best: 'Heritage, Haven, Serenity, Luxe & Sunset'
    }
  ];

  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
      {/* Headers */}
      <div className="grid grid-cols-4">
        <div className="bg-stone-600 text-white text-center py-4 px-6"></div>
        <div className="bg-stone-600 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">GOOD</h3>
        </div>
        <div className="bg-stone-700 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">BETTER</h3>
        </div>
        <div className="bg-stone-800 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">BEST</h3>
        </div>
      </div>
      
      {/* Comparison Items */}
      <div className="divide-y">
        {comparisonItems.map((item, index) => (
          <div key={index} className="grid grid-cols-4">
            <div className="bg-gray-50 p-4 font-semibold text-gray-800 border-r">
              {item.label}
            </div>
            <div className={`p-4 text-center ${index < comparisonItems.length - 1 ? 'border-r' : ''}`}>
              {typeof item.good === 'string' ? item.good : item.good}
            </div>
            <div className={`p-4 text-center ${index < comparisonItems.length - 1 ? 'border-r' : ''}`}>
              {typeof item.better === 'string' ? item.better : item.better}
            </div>
            <div className="p-4 text-center">
              {typeof item.best === 'string' ? item.best : item.best}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
