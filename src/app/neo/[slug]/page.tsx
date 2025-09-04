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
  console.log(`🏠 NeoHousePage called with slug: "${slug}"`);
  
  const houseConfig = await getServerNeoHouseConfig(slug);
  
  if (!houseConfig) {
    console.log(`❌ No house config found for slug: "${slug}"`);
    notFound();
  }
  
  console.log(`✅ Found house config for slug: "${slug}", name: "${houseConfig.name}"`);
  console.log(`🔍 House config comparison:`, houseConfig.comparison);
  console.log(`🔍 House config tour360:`, houseConfig.tour360);

  // Convert Neo house config to House interface for compatibility
  let heroPath: string;
  try {
    console.log(`Generating hero path for slug: ${slug}`);
    heroPath = await getServerNeoAssetPath('hero', slug, { 
      color: 'white', 
      format: 'jpg' 
    });
    console.log(`Generated hero path: ${heroPath}`);
    
    // Проверяем, содержит ли slug префикс "neo-"
    if (slug.startsWith('neo-')) {
      const cleanSlug = slug.substring(4);
      console.log(`Slug contains 'neo-' prefix. Clean slug: ${cleanSlug}`);
      // Корректируем путь, если slug содержит префикс "neo-"
      heroPath = `/assets/neo/${cleanSlug}/hero.jpg`;
      console.log(`Corrected hero path: ${heroPath}`);
    }
  } catch (error) {
    console.error('Failed to get hero path:', error);
    // Удаляем префикс "neo-" из slug при формировании пути к fallback-изображению
    const cleanSlug = slug.startsWith('neo-') ? slug.substring(4) : slug;
    heroPath = `/assets/neo/${cleanSlug}/hero.jpg`; // Fallback
    console.log(`Using fallback hero path: ${heroPath}`);
  }

  // Удаляем префикс "neo-" из slug для формирования путей к изображениям
  const cleanSlug = slug.startsWith('neo-') ? slug.substring(4) : slug;
  console.log(`Using clean slug for image paths: ${cleanSlug}`);
  
  const house: NeoHouse = {
    id: slug,
    name: houseConfig.name,
    description: houseConfig.description,
    maxDP: houseConfig.maxDP,
    maxPK: houseConfig.maxPK,
    availableRooms: houseConfig.availableRooms,
    images: {
      hero: heroPath,
      exampleDark: `/assets/neo/${cleanSlug}/example/dark.jpg`,
      exampleWhite: `/assets/neo/${cleanSlug}/example/light.jpg`,
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
    description: house.description || '',  // Гарантируем, что description не будет undefined
    maxDP: house.maxDP || 1,              // Гарантируем, что maxDP не будет undefined
    maxPK: house.maxPK || 1,              // Гарантируем, что maxPK не будет undefined
    availableRooms: house.availableRooms || [],  // Гарантируем, что availableRooms не будет undefined
    images: {
      hero: house.images.hero || '/assets/skyline/Birch/hero.jpg',  // Гарантированный fallback
      gallery: []
    },
    comparison: {  // Всегда создаем объект comparison
      features: house.comparison?.features || {
        // Добавляем минимальные данные, если их нет
        "Bedrooms": { good: "1 Bedroom", better: "", best: "" },
        "Bathrooms": { good: "1 Bathroom", better: "", best: "" },
        "Living Space": { good: "N/A", better: "", best: "" }
      }
    },
    tour360: {
      rooms: [
        ...(house.tour360?.white?.rooms || []),
        ...(house.tour360?.dark?.rooms || [])
      ],
      availableFiles: {}
    },
    category: 'neo'
  };

  console.log(`🏠 Created legacyHouse for HeroSection:`, {
    id: legacyHouse.id,
    name: legacyHouse.name,
    description: legacyHouse.description,
    hero_path: legacyHouse.images.hero,
    has_comparison: !!legacyHouse.comparison,
    comparison_features: legacyHouse.comparison?.features,
    available_rooms: legacyHouse.availableRooms,
    category: legacyHouse.category
  });

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
