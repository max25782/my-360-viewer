import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroSection from '../../../components/HeroSection';
import { getServerNeoHouseConfig, getServerNeoAssetPath } from '../../../utils/serverNeoAssets';
import { NeoHouse } from '../../../hooks/useNeoHouse';
import NeoComparisonCallToAction from '../../../components/Neo/NeoComparisonCallToAction';


interface NeoHousePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NeoHousePageProps): Promise<Metadata> {
  const { slug } = await params;
  const houseConfig = await getServerNeoHouseConfig(slug);
  
  if (!houseConfig) {
    return {
      title: 'House Not Found - Neo ADU Series',
      description: 'The requested Neo house could not be found.',
    };
  }

  return {
    title: `${houseConfig.name} - Neo ADU Series`,
    description: houseConfig.description,
    keywords: `${houseConfig.name}, neo adu, modern home, dual color scheme, white interiors, dark interiors`,
  };
}

export default async function NeoHousePage({ params }: NeoHousePageProps) {
  const { slug } = await params;
  const houseConfig = await getServerNeoHouseConfig(slug);
  
  if (!houseConfig) {
    notFound();
  }

  // Convert Neo house config to House interface for compatibility
  let heroPath: string;
  try {
    heroPath = await getServerNeoAssetPath('hero', slug, { 
      color: 'white', 
      format: 'jpg' 
    });
  } catch (error) {
    console.error('Failed to get hero path:', error);
    heroPath = `/assets/neo/${slug}/hero.jpg`; // Fallback
  }

  const house: NeoHouse = {
    id: slug,
    name: houseConfig.name,
    description: houseConfig.description,
    maxDP: houseConfig.maxDP,
    maxPK: houseConfig.maxPK,
    availableRooms: houseConfig.availableRooms,
    images: {
      hero: heroPath,
      exampleDark: `/assets/neo/${slug}/example/dark.jpg`,
      exampleWhite: `/assets/neo/${slug}/example/light.jpg`,
      whiteTexture: '/assets/neo/texrure/thumb-white.jpg',
      darkTexture: '/assets/neo/texrure/thumb-dark.jpg'
    },
    tour360: houseConfig.tour360,
    comparison: houseConfig.comparison
  };

  // Convert to legacy House interface for existing components
  const legacyHouse = {
    id: house.id,
    name: house.name,
    description: house.description,
    maxDP: house.maxDP,
    maxPK: house.maxPK,
    availableRooms: house.availableRooms,
    images: {
      hero: house.images.hero,
      gallery: []
    },
    comparison: house.comparison,
    tour360: {
      rooms: [
        ...(house.tour360.white?.rooms || []),
        ...(house.tour360.dark?.rooms || [])
      ],
      availableFiles: {}
    }
  };

  return (
    <div className="min-h-screen bg-slate-700">
      {/* Hero Section - reuse existing component */}
      <HeroSection house={legacyHouse} />

      {/* Neo-specific color scheme showcase */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dual Color Experience
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {house.name} offers two distinct interior experiences. Choose your preferred aesthetic for the 360° tour.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-24  mx-auto">
            {/* White Scheme Preview */}
            <div className="bg-gradient-to-br w-100 h-100 from-slate-800 to-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="relative  mb-6 rounded-lg overflow-hidden">
                <img 
                  src={house.images.exampleWhite}
                  alt="White Color Scheme"
                  className="w-60 h-60 object-contain"
                />
              
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">White Scheme</h3>
             
            </div>

            {/* Dark Scheme Preview */}
            <div className="bg-gradient-to-br from-gray-900 to-black h-100 w-100 p-8 rounded-xl shadow-xl text-white">
              <div className="relative  mb-6 rounded-lg overflow-hidden">
                <img 
                  src={house.images.exampleDark}
                  alt="Dark Color Scheme"
                  className="w-60 h-60 object-contain"
                />
               
              </div>
              <h3 className="text-xl font-bold mb-3">Dark Scheme</h3>
              
            </div>
          </div>
          

          {/* Tour CTA */}
          <div className="text-center mt-12">
            <a 
              href={`/neo/${slug}/tour`}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start 360° Tour
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-4V9a3 3 0 016 0v1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21z" />
              </svg>
            </a>
          
          </div>
        </div>
      </section>


      {/* Package Comparison Call-to-Action */}
      {house.comparison && (
        <NeoComparisonCallToAction 
          houseSlug={slug}
          houseName={house.name}
        />
      )}
    </div>
  );
}
