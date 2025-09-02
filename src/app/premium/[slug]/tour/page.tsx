import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerPremiumHouse } from '../../../../utils/serverPremiumAssets';
import PremiumTourClient from './PremiumTourClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // В Next.js 15+ params нужно ожидать
  const { slug } = await params;
  
  try {
    const house = await getServerPremiumHouse(slug);
    
    if (!house) {
      return {
        title: 'Tour Not Found',
        description: 'The requested 360° tour could not be found.'
      };
    }
    
    return {
      title: `${house.name} - 360° Virtual Tour`,
      description: `Experience the ${house.name} in immersive 360° virtual reality tour.`,
      keywords: `premium home, ${house.name.toLowerCase()}, virtual tour, 360 tour, VR tour`
    };
  } catch (error) {
    console.error(`Error generating metadata for ${slug}:`, error);
    return {
      title: 'Tour Error',
      description: 'Error loading tour metadata.'
    };
  }
}

export default async function PremiumTourPage({ params }: { params: Promise<{ slug: string }> }) {
  // В Next.js 15+ params нужно ожидать
  const { slug } = await params;
  
  // Get house data
  const premiumHouse = await getServerPremiumHouse(slug);
  
  // Show 404 if house not found
  if (!premiumHouse) {
    notFound();
  }
  
  // Check if tour data exists
  if (!premiumHouse.tour360 || !premiumHouse.tour360.rooms || premiumHouse.tour360.rooms.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-6">360° Tour Not Available</h1>
          <p className="text-xl text-gray-300 mb-8">
            The 360° virtual tour for {premiumHouse.name} is currently not available.
          </p>
          <a 
            href={`/premium/${slug}`} 
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Return to House Details
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <PremiumTourClient 
      houseId={premiumHouse.id}
      houseName={premiumHouse.name}
      slug={slug}
    />
  );
}