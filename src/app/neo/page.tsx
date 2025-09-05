import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerNeoHouses, getServerNeoAssetPath } from '../../utils/serverNeoAssets';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import { House } from '../../hooks/useHouses';
import NeoFilterWrapper from '@/components/Neo/NeoFilterWrapper';
import NeoHousesList from '@/components/Neo/NeoHousesList';

export const dynamic = 'force-dynamic';

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
  tour360?: {
    white?: { rooms?: string[] };
    dark?: { rooms?: string[] };
  };
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
    availableRooms: neoHouse.tour360?.white?.rooms || [],
    images: {
      hero: heroPath,
      gallery: []
    },
    tour360: {
      rooms: neoHouse.tour360?.white?.rooms || [],
      availableFiles: {}
    },
    category: 'neo',
    // Проверяем наличие comparison и features перед передачей
    comparison: neoHouse.comparison ? {
      features: neoHouse.comparison.features || {}
    } : undefined
  };
}

export default async function NeoCollectionPage() {
  let neoHouses: NeoHouse[] = [];
  let heroHouse: House | null = null;

  try {
    // Get all houses first
    neoHouses = await getServerNeoHouses();
    
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
          
          {/* Двухколоночный макет: фильтры слева, карточки справа */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Фильтры (aside) */}
          {neoHouses.length > 0 && (
              <aside className="md:w-1/4 lg:w-1/5">
                <NeoFilterWrapper houses={neoHouses} className="sticky top-4" />
              </aside>
          )}

            {/* Карточки домов */}
            <div className="md:w-3/4 lg:w-4/5 sm:w-full" >
          {neoHouses.length > 0 ? (
            <NeoHousesList houses={neoHouses} />
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
          </div>
        </div>
      </section>


    </div>
  );
}
