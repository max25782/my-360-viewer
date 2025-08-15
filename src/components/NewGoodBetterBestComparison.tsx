/**
 * NEW: Universal GoodBetterBestComparison using standardized asset paths
 * Replaces the complex house-specific logic with simple universal paths
 */

import { House } from '../data/houses';
import { assetPaths } from '../utils/assetPaths';
import SimpleImageModal from './SimpleImageModal';
import { formatPrice } from '../utils/formatters';

interface GoodBetterBestComparisonProps {
  house: House;
}

interface ComparisonItem {
  label: string;
  good: string | React.ReactNode;
  better: string | React.ReactNode;
  best: string | React.ReactNode;
}

export default function NewGoodBetterBestComparison({ house }: GoodBetterBestComparisonProps) {
  // NEW: Universal image paths using standardized structure
  const getImagePaths = () => {
    return {
      goodExterior: assetPaths.comparison(house.id, 'good', 'exterior'),
      betterExterior: assetPaths.comparison(house.id, 'better', 'exterior'),
      bestExterior: assetPaths.comparison(house.id, 'best', 'exterior'),
      goodPlan1: assetPaths.comparison(house.id, 'good', 'plan1'),
      betterPlan1: assetPaths.comparison(house.id, 'better', 'plan1'),
      bestPlan1: assetPaths.comparison(house.id, 'best', 'plan1'),
      goodPlan2: assetPaths.comparison(house.id, 'good', 'plan2'),
      betterPlan2: assetPaths.comparison(house.id, 'better', 'plan2'),
      bestPlan2: assetPaths.comparison(house.id, 'best', 'plan2')
    };
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
          <p className="text-sm opacity-90">${formatPrice(house.priceRange.good)}</p>
        </div>
        <div className="bg-stone-700 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">BETTER</h3>
          <p className="text-sm opacity-90">${formatPrice(house.priceRange.better)}</p>
        </div>
        <div className="bg-stone-800 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">BEST</h3>
          <p className="text-sm opacity-90">${formatPrice(house.priceRange.best)}</p>
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
