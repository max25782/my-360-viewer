import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerPremiumHouses, getServerPremiumAssetPath } from '../../utils/serverPremiumAssets';
import { PremiumHouse } from '../../utils/clientPremiumAssets';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { House } from '../../hooks/useHouses';
import PremiumFilterWrapper from '@/components/Premium/PremiumFilterWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Premium Series - Exclusive Luxury Homes',
  description: 'Discover our exclusive Premium Series with high-end finishes and sophisticated design. The epitome of luxury living.',
  keywords: 'premium homes, exclusive houses, luxury living, high-end residences',
};

// Используем тип PremiumHouse из clientPremiumAssets.ts

// Функция для конвертации Premium house в формат Legacy House для HeroSection
async function convertPremiumToLegacyHouse(premiumHouse: PremiumHouse): Promise<House> {
  const heroPath = await getServerPremiumAssetPath('hero', premiumHouse.id, { 
    format: 'jpg' 
  });

  return {
    id: `premium-${premiumHouse.id}`,
    name: premiumHouse.name,
    description: premiumHouse.description,
    maxDP: premiumHouse.maxDP,
    maxPK: premiumHouse.maxPK,
    availableRooms: premiumHouse.tour360?.rooms || [],
    images: {
      hero: heroPath,
      gallery: []
    },
    tour360: {
      rooms: premiumHouse.tour360?.rooms || [],
      availableFiles: {}
    },
    category: 'premium',
    // Проверяем наличие comparison и features перед передачей
    comparison: premiumHouse.comparison ? {
      features: premiumHouse.comparison.features || {}
    } : undefined
  };
}

export default async function PremiumCollectionPage({
  searchParams
}: {
  searchParams?: {
    bedrooms?: string;
    bathrooms?: string;
    sqftMin?: string;
    sqftMax?: string;
  }
}) {
  let premiumHouses: PremiumHouse[] = [];
  let heroHouse: House | null = null;

  try {
    // Get all houses first
    premiumHouses = await getServerPremiumHouses();
    
    // Apply filters if any parameters exist
    const hasFilters = searchParams?.bedrooms || searchParams?.bathrooms || 
                     searchParams?.sqftMin || searchParams?.sqftMax;
    
    if (hasFilters) {
      // Bedrooms filter
      if (searchParams?.bedrooms && searchParams.bedrooms !== 'any') {
        const bedroomCount = searchParams.bedrooms;
        premiumHouses = premiumHouses.filter(house => {
          // Проверяем данные из comparison.features
          if (house.comparison?.features?.Bedrooms) {
            const bedroomFeature = house.comparison.features.Bedrooms.good;
            const match = bedroomFeature.match(/(\d+)/);
            if (match && match[1] === bedroomCount) {
              return true;
            }
          }
          return false;
        });
      }
      
      // Bathrooms filter
      if (searchParams?.bathrooms && searchParams.bathrooms !== 'any') {
        const bathroomCount = searchParams.bathrooms;
        premiumHouses = premiumHouses.filter(house => {
          // Проверяем данные из comparison.features
          if (house.comparison?.features?.Bathrooms) {
            const bathroomFeature = house.comparison.features.Bathrooms.good;
            const match = bathroomFeature.match(/(\d+\.?\d*)/);
            if (match && match[1] === bathroomCount) {
              return true;
            }
          }
          return false;
        });
      }
      
      // Square footage filter
      if (searchParams?.sqftMin || searchParams?.sqftMax) {
        const minSqft = searchParams.sqftMin ? parseInt(searchParams.sqftMin) : 0;
        const maxSqft = searchParams.sqftMax ? parseInt(searchParams.sqftMax) : Infinity;
        
        premiumHouses = premiumHouses.filter(house => {
          // Проверяем данные из comparison.features
          if (house.comparison?.features?.['Living Space']) {
            const sqftFeature = house.comparison.features['Living Space'].good;
            const match = sqftFeature.match(/(\d+)/);
            if (match) {
              const sqft = parseInt(match[1]);
              return sqft >= minSqft && sqft <= maxSqft;
            }
          }
          return false;
        });
      }
    }
    
    // Convert the first house to legacy format for hero section
    if (premiumHouses.length > 0) {
      heroHouse = await convertPremiumToLegacyHouse(premiumHouses[0]);
    }
    
  } catch (error) {
    console.error('Error loading Premium houses:', error);
  }
  
  return (
    <div className="min-h-screen bg-slate-800">
      <Header />
      
      {/* Hero Section */}
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            Premium Series
          </h1>
          <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
            Our exclusive collection of high-end homes with premium finishes and exceptional craftsmanship.
          </p>
        </div>
      </section>
      
   
      
      {/* Filters and Houses */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <PremiumFilterWrapper />
            </div>
            
            {/* Houses Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {premiumHouses.length > 0 ? (
                  premiumHouses.map(async (house) => {
                    const heroPath = await getServerPremiumAssetPath('hero', house.id, { format: 'jpg' });
                    
                    // Extract bedroom and bathroom counts
                    let bedroomCount = "N/A";
                    let bathroomCount = "N/A";
                    let sqFt = "N/A";
                    
                    if (house.comparison?.features?.Bedrooms) {
                      const match = house.comparison.features.Bedrooms.good.match(/(\d+)/);
                      if (match) bedroomCount = match[1];
                    }
                    
                    if (house.comparison?.features?.Bathrooms) {
                      const match = house.comparison.features.Bathrooms.good.match(/(\d+\.?\d*)/);
                      if (match) bathroomCount = match[1];
                    }
                    
                    if (house.comparison?.features?.['Living Space']) {
                      const match = house.comparison.features['Living Space'].good.match(/(\d+)/);
                      if (match) sqFt = match[1];
                    }
                    
                    return (
                      <div key={house.id} className="bg-slate-700 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                        <Link href={`/premium/${house.id.toLowerCase()}`}>
                          <div className="relative h-48">
                            <Image
                              src={heroPath}
                              alt={house.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                              priority={false}
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-xl font-semibold text-white">{house.name}</h3>
                            <p className="text-gray-300 text-sm mt-1 line-clamp-2">{house.description}</p>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex space-x-3 text-sm text-gray-200">
                                <span>{bedroomCount} BD</span>
                                <span>{bathroomCount} BA</span>
                                <span>{sqFt} SF</span>
                              </div>
                              <span className="text-emerald-400 text-sm font-medium">View Details</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-10">
                    <h3 className="text-xl text-white mb-2">No houses match your filters</h3>
                    <p className="text-gray-300">Try adjusting your filter criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
