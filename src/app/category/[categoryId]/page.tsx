/**
 * Страница категории домов (A/B/C)
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { HouseCategory } from '../../../types/houses';
import CategoryHeader from '@/components/CategoryHeader';
import CategoryHousesList from '@/components/CategoryHousesList';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SkylineFilterWrapper from '@/components/Skyline/SkylineFilterWrapper';
import { getHousesByCategory } from '../../../utils/houses';

interface CategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

// Валидация категории
function isValidCategory(categoryId: string): categoryId is HouseCategory {
  return ['A', 'B', 'C', 'skyline', 'neo', 'modern'].includes(categoryId.toLowerCase());
}

// Метаданные для SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  
  if (!isValidCategory(categoryId)) {
    return { title: 'Category Not Found' };
  }

  const categoryNames = {
    A: 'Skyline Collection',
    B: 'Neo ADU Series',
    C: 'Premium Collection',
    skyline: 'Skyline Collection',
    neo: 'Neo ADU Series',
    modern: 'Premium Collection',
    premium: 'Premium Collection'
  };

  const categoryDescriptions = {
    A: 'Traditional collection featuring a variety of house designs with beautiful skyline views.',
    B: 'Modern designs with dual color schemes. Choose between elegant white or sophisticated dark interiors.',
    C: 'Contemporary and innovative architectural designs with cutting-edge features and smart home technology.',
    skyline: 'Traditional collection featuring a variety of house designs with beautiful skyline views.',
    neo: 'Modern designs with dual color schemes. Choose between elegant white or sophisticated dark interiors.',
    modern: 'Contemporary and innovative architectural designs with cutting-edge features and smart home technology.',
    premium: 'Contemporary and innovative architectural designs with cutting-edge features and smart home technology.'
  };

  const categoryName = categoryNames[categoryId.toLowerCase() as HouseCategory] || categoryNames[categoryId.toUpperCase() as HouseCategory];
  const description = categoryDescriptions[categoryId.toLowerCase() as HouseCategory] || categoryDescriptions[categoryId.toUpperCase() as HouseCategory];

  return {
    title: `${categoryName} - RG Pro Builders`,
    description: `Explore our ${categoryName}: ${description}`,
    openGraph: {
      title: `${categoryName} - RG Pro Builders`,
      description: description,
      type: 'website'
    }
  };
}

// Статические параметры для генерации
export async function generateStaticParams() {
  return [
    { categoryId: 'A' },
    { categoryId: 'B' },
    { categoryId: 'C' },
    { categoryId: 'skyline' },
    { categoryId: 'neo' },
    { categoryId: 'modern' }
  ];
}

// Основной компонент страницы
export default async function CategoryPage({ params, searchParams }: { 
  params: Promise<{ categoryId: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // В Next.js App Router с асинхронными параметрами
  const { categoryId } = await params;
  const resolvedSearchParams = await searchParams;
  
  // Валидация категории
  if (!isValidCategory(categoryId)) {
    notFound();
  }

  const validCategoryId = categoryId.toLowerCase() as HouseCategory;
  
  // Получаем дома для категории, если это Skyline
  const skylineHouses = validCategoryId === 'skyline' ? await getHousesByCategory('skyline') : [];

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Навигация */}
      <Header />

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-8">
        {/* <CategoryHeader categoryId={validCategoryId} /> */}
        
        {/* Двухколоночный макет для Skyline с фильтрами слева */}
        {validCategoryId === 'skyline' ? (
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            {/* Левая колонка с фильтрами */}
            <div className="w-full md:w-1/4 flex-shrink-0">
              <SkylineFilterWrapper houses={skylineHouses} className="sticky top" />
            </div>
            
            {/* Правая колонка со списком домов */}
            <div className="w-full md:w-3/4">
              <CategoryHousesList category={validCategoryId} searchParams={resolvedSearchParams} />
            </div>
          </div>
        ) : (
          /* Обычный макет для других категорий */
          <CategoryHousesList category={validCategoryId} searchParams={resolvedSearchParams} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
