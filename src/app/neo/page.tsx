import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerNeoHouses, getServerNeoAssetPath } from '../../utils/serverNeoAssets';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { House } from '../../hooks/useHouses';
import NeoFilterWrapper from '@/components/Neo/NeoFilterWrapper';

export const metadata: Metadata = {
  title: 'Neo ADU Series - Modern Dual-Color Designs',
  description: 'Explore our sophisticated Neo ADU Series with white and dark color schemes. Modern living with customizable aesthetics.',
  keywords: 'neo adu, modern homes, dual color schemes, white interiors, dark interiors, sophisticated design',
};

interface NeoHouse {
  id: string;
  name: string;
  description: string;
  maxDP: number;
  maxPK: number;
  availableRooms: string[];
  squareFeet?: number;
  comparison?: {
    features?: {
      [key: string]: {
        good: string;
        better: string;
        best: string;
      }
    }
  };
}

// Функция для конвертации Neo house в формат Legacy House для HeroSection
async function convertNeoToLegacyHouse(neoHouse: NeoHouse): Promise<House> {
  const heroPath = await getServerNeoAssetPath('hero', neoHouse.id, { 
    color: 'white', 
    format: 'jpg' 
  });

  return {
    id: `neo-${neoHouse.id}`,
    name: neoHouse.name,
    description: neoHouse.description,
    maxDP: neoHouse.maxDP,
    maxPK: neoHouse.maxPK,
    availableRooms: neoHouse.availableRooms,
    images: {
      hero: heroPath,
      gallery: []
    },
    tour360: {
      rooms: neoHouse.availableRooms,
      availableFiles: {}
    },
    category: 'neo'
  };
}

export default async function NeoCollectionPage(props: any) {
  let neoHouses: NeoHouse[] = [];
  let heroHouse: House | null = null;
  
  try {
    // Get all houses first
    neoHouses = await getServerNeoHouses();
    
    // Get searchParams safely
    const searchParams = props?.searchParams || {};
    
    // Apply filters if searchParams exists
    if (Object.keys(searchParams).length > 0) {
      // Bedrooms filter
      if (searchParams.bedrooms && searchParams.bedrooms !== 'any') {
        const bedroomCount = parseInt(searchParams.bedrooms as string);
        neoHouses = neoHouses.filter(house => {
          const houseBedroomCount = house.availableRooms.filter(
            room => room === 'bedroom' || room === 'bedroom2'
          ).length;
          return houseBedroomCount === bedroomCount;
        });
      }
      
      // Bathrooms filter
      if (searchParams.bathrooms && searchParams.bathrooms !== 'any') {
        const bathroomCount = parseInt(searchParams.bathrooms as string);
        neoHouses = neoHouses.filter(house => {
          const houseBathroomCount = house.availableRooms.filter(
            room => room === 'bathroom' || room === 'bathroom2'
          ).length;
          return houseBathroomCount === bathroomCount;
        });
      }
      
      // Square footage filter
      if (searchParams.sqftMin || searchParams.sqftMax) {
        const minSqft = searchParams.sqftMin ? parseInt(searchParams.sqftMin as string) : 0;
        const maxSqft = searchParams.sqftMax ? parseInt(searchParams.sqftMax as string) : 10000;
        
        neoHouses = neoHouses.filter(house => {
          if (!house.squareFeet) return true; // Skip houses without square footage
          return house.squareFeet >= minSqft && house.squareFeet <= maxSqft;
        });
      }
      
      // Features filter
      if (searchParams.features) {
        const selectedFeatures = (searchParams.features as string).split(',');
        if (selectedFeatures.length > 0) {
          neoHouses = neoHouses.filter(house => {
            // Define predefined features mapping - which houses have which features
            const predefinedFeaturesMap: Record<string, string[]> = {
              "Loft": ["Apex", "Elementa", "Forma"],
              "Garage": ["Apex", "Arcos"],
              "Office": ["HorizonX", "Forma"],
              "Primary Suite": ["Apex", "Elementa"],
              "Kitchen Island": ["Apex", "Arcos", "Elementa", "Forma", "Halo"],
              "Extra Storage": ["Apex", "Elementa", "Forma"],
              "Covered Patio": ["Apex", "Arcos"],
              "Covered Porch": ["Elementa", "Halo"],
              "Bonus Room": ["Apex", "Forma"]
            };
            
            // Check predefined features first
            for (const feature of selectedFeatures) {
              if (predefinedFeaturesMap[feature]?.includes(house.id)) {
                return true;
              }
            }
            
            // Then check comparison features if available
            if (house.comparison?.features) {
              const houseFeatures = Object.keys(house.comparison.features);
              if (selectedFeatures.some(feature => houseFeatures.includes(feature))) {
                return true;
              }
            }
            
            return false;
          });
        }
      }
    }
    
    if (neoHouses.length > 0) {
      heroHouse = await convertNeoToLegacyHouse(neoHouses[0]);
    }
  } catch (error) {
    console.error('Failed to load Neo houses:', error);
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {/* header */}
          <Header />

        
     



      {/* Houses Grid */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Neo Collection
            </h2>
            <p className="text-lg text-gray-300">
              {neoHouses.length > 0 
                ? `${neoHouses.length} sophisticated designs awaiting your exploration`
                : 'Coming soon - sophisticated designs with dual color schemes'
              }
            </p>
          </div>
          
          {/* Фильтры */}
          {neoHouses.length > 0 && (
            <NeoFilterWrapper houses={neoHouses} />
          )}

          {neoHouses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {neoHouses.map((house) => (
                <Link 
                  key={house.id}
                  href={`/neo/${house.id.charAt(0).toUpperCase() + house.id.slice(1)}`}
                  className="group bg-slate-400 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  
                >
                  <div className="relative h-64 bg-slate-700">
                    {/* Placeholder for hero image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-1 flex items-center justify-center">
                          <Image src={`/assets/neo/${house.id}/hero.jpg`} alt={house.name} width={500} height={500} />
                        </div>
                        
                      </div>
                    </div>
                    
                    
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {house.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {house.description}
                    </p>
                    
                    <div className="flex flex-wrap justify-left gap-2 items-center text-sm text-gray-500">
                      {house.squareFeet && (
                        <span className="bg-gray-100 px-2 py-1 rounded-md">{house.squareFeet} sq.ft</span>
                      )}
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {house.availableRooms.filter(room => room === 'bedroom' || room === 'bedroom2').length} {house.availableRooms.filter(room => room === 'bedroom' || room === 'bedroom2').length === 1 ? 'Bedroom' : 'Bedrooms'}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {house.availableRooms.filter(room => room === 'bathroom' || room === 'bathroom2').length} {house.availableRooms.filter(room => room === 'bathroom' || room === 'bathroom2').length === 1 ? 'Bathroom' : 'Bathrooms'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🚧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Neo Collection Coming Soon
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're putting the finishing touches on our Neo ADU Series. 
                Check back soon for these innovative dual-color designs.
              </p>
            </div>
          )}
        </div>
      </section>


    </div>
  );
}
