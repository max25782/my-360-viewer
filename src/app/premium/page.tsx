import { Metadata } from 'next';
import { getServerPremiumHouses, getServerPremiumAssetPath } from '../../utils/serverPremiumAssets';
import { PremiumHouse, getClientPremiumAssetPath } from '../../utils/clientPremiumAssets';
import Header from '@/components/Header';
import { House } from '../../hooks/useHouses';
import PremiumFilterWrapper from '@/components/Premium/PremiumFilterWrapper';
import PremiumHousesList from '@/components/Premium/PremiumHousesList';

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

export default async function PremiumCollectionPage() {
  let premiumHouses: PremiumHouse[] = [];
  let heroHouse: House | null = null;

  try {
    // Get all houses
    premiumHouses = await getServerPremiumHouses();
    
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
              <PremiumFilterWrapper houses={premiumHouses} className="sticky top-4" />
            </div>
            
            {/* Houses Grid */}
            <div className="lg:col-span-3">
              <PremiumHousesList 
                houses={premiumHouses} 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
