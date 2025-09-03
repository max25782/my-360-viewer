import { Metadata } from 'next';
import { getServerSkylineHouses } from '@/utils/serverSkylineAssets';
import CategoryHousesList from '@/components/CategoryHousesList';
import Header from '@/components/Header';
import SkylineFilterWrapper from '@/components/Skyline/SkylineFilterWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Skyline Series - Modern Luxury Homes',
  description: 'Explore our premium Skyline Series with modern architecture and luxury features. Designed for comfort and style.',
  keywords: 'skyline homes, luxury houses, modern architecture, premium living spaces',
};

export default async function SkylinePage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Получаем дома для передачи в фильтры
  const skylineHouses = await getServerSkylineHouses();
  
  return (
    <div className="min-h-screen bg-slate-800">
      <Header />
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            Skyline Series
          </h1>
          <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
            Our premium collection of modern luxury homes with sophisticated design and premium features.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <SkylineFilterWrapper houses={skylineHouses} />
            </div>
            
            {/* Houses Grid */}
            <div className="lg:col-span-3">
              <CategoryHousesList 
                category="skyline" 
                title="Skyline Collection" 
                searchParams={searchParams}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
