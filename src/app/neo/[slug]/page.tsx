import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroSection from '../../../components/HeroSection';
import { getServerNeoHouseConfig, getServerNeoAssetPath } from '../../../utils/serverNeoAssets';
import { NeoHouse } from '../../../hooks/useNeoHouse';
import NeoComparisonCallToAction from '../../../components/Neo/NeoComparisonCallToAction';
import NeoExteriorDesignPackages from '../../../components/Neo/NeoExteriorDesignPackages';
import NeoInteriorDesignPackages from '../../../components/Neo/NeoInteriorDesignPackages';

import Header from '@/components/Header';
import Neo360Page from '@/components/Neo/Neo360';
import NeonStartColors from '@/components/Neo/NeoStartColors';


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
    comparison: house.comparison ? {
      features: house.comparison.features || {}
    } : undefined,
    tour360: {
      rooms: [
        ...(house.tour360.white?.rooms || []),
        ...(house.tour360.dark?.rooms || [])
      ],
      availableFiles: {}
    },
    category: 'neo'
  };

  return (
    <div className="min-h-screen bg-slate-700">
      <Header />

      {/* Hero Section - reuse existing component */}
      <HeroSection house={legacyHouse} />

     
      <Neo360Page />
      {/* Neo-specific color scheme showcase */}
      <section className="py-16 bg-slate-800">
        <>
          

         
    {/* Package Comparison Call-to-Action temporarily removed */}
      <NeoComparisonCallToAction houseSlug={house.id} houseName={house.name} />
        </>
      
      </section>
     

      {/* Exterior Design Packages Section */}
      <NeoExteriorDesignPackages house={house} />
      
      {/* Interior Design Packages Section */}
      <NeoInteriorDesignPackages house={house} />
      
    
    
    </div>
  );
}
