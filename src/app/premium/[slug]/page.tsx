import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerPremiumHouse, getServerPremiumAssetPath } from '../../../utils/serverPremiumAssets';
import { PremiumHouse } from '../../../utils/clientPremiumAssets';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import HeroSection from '@/components/HeroSection';
import { House } from '../../../hooks/useHouses';
import PremiumExteriorCarousel from '@/components/Premium/PremiumExteriorCarousel';
// Импортируем функцию для работы с features премиум домов
import { getPremiumHouseFeatures } from '@/utils/premiumHouseData';
import PremiumInteriorCarousel from '@/components/Premium/PremiumInteriorCarousel';
import PremiumFeatures from '@/components/Premium/PremiumFeatures';
import Premium360Tour from '@/components/Premium/Premium360Tour';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // В Next.js 15+ params нужно ожидать
  const { slug } = await params;
  
  try {
    const house = await getServerPremiumHouse(slug);
    
    if (!house) {
      return {
        title: 'House Not Found',
        description: 'The requested house could not be found.'
      };
    }
    
    return {
      title: `${house.name} - Premium Series`,
      description: house.description,
      keywords: `premium home, ${house.name.toLowerCase()}, luxury house`
    };
  } catch (error) {
    console.error(`Error generating metadata for ${slug}:`, error);
    return {
      title: 'Premium Home',
      description: 'Explore our premium home collection'
    };
  }
}

// Функция для конвертации Premium house в формат Legacy House для компонентов
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
    availableRooms: premiumHouse.availableRooms || [],
    images: {
      hero: heroPath,
      gallery: []
    },
    tour360: {
      rooms: premiumHouse.tour360?.rooms || [],
      availableFiles: {}
    },
    category: 'premium',
    // Используем динамические данные из централизованного источника
    comparison: {
      features: getPremiumHouseFeatures(premiumHouse.id)
    }
  };
}

export default async function PremiumHousePage({ params }: { params: Promise<{ slug: string }> }) {
  // В Next.js 15+ params нужно ожидать
  const { slug } = await params;
  
  // Получаем данные о доме
  const premiumHouse = await getServerPremiumHouse(slug);
  
  // Если дом не найден, показываем 404
  if (!premiumHouse) {
    notFound();
  }
  
  // Конвертируем в формат для компонентов
  const house = await convertPremiumToLegacyHouse(premiumHouse);
  
  return (
    <div className="min-h-screen bg-slate-800">
      <Header />
      
      {/* Breadcrumbs */}
      <Breadcrumb 
        items={[
          { label: 'Premium Collection', href: '/premium' },
          { label: premiumHouse.name }
        ]} 
      />
      
      {/* Hero Section - Optimized for LCP */}
      <section className="py-5">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection house={house} />
        </div>
      </section>

        {/* 360 Tour Section */}
      <Premium360Tour 
        houseName={premiumHouse.name}
        houseSlug={slug}
        description="Take a virtual tour and explore every room in immersive 360° view."
      />
      
      {/* Design Selector */}
             <section className="py-10 bg-slate-700">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 gap-12">
            {/* Exterior Design */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Exterior Options</h2>
              <PremiumExteriorCarousel 
                houseId={premiumHouse.id} 
                maxDP={premiumHouse.maxDP} 
              />
            </div>
            
            {/* Interior Design */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Interior Options</h2>
              <PremiumInteriorCarousel 
                houseId={premiumHouse.id} 
                availableRooms={[]} // Пусть компонент сам определит доступные комнаты
                maxPK={premiumHouse.maxPK || 4} // Используем 4 как значение по умолчанию
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <PremiumFeatures 
        features={premiumHouse.comparison?.features || []} 
        houseName={premiumHouse.name}
        houseId={premiumHouse.id}
      />
      
     {/* {footer} */}
        <Footer />
       
    </div>
  );
}
