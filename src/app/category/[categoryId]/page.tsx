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

interface CategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

// Валидация категории
function isValidCategory(categoryId: string): categoryId is HouseCategory {
  return ['A', 'B', 'C'].includes(categoryId.toUpperCase());
}

// Метаданные для SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  
  if (!isValidCategory(categoryId)) {
    return { title: 'Category Not Found' };
  }

  const categoryNames = {
    A: 'Skyline ADU Collection',
    B: 'Neo ADU Series',
    C: 'Premium Collection'
  };

  const categoryDescriptions = {
    A: 'Compact and efficient ADU designs perfect for small families.',
    B: 'Modern and versatile ADU layouts with flexible room configurations.',
    C: 'Luxury ADU designs with premium finishes and high-end features.'
  };

  const categoryName = categoryNames[categoryId.toUpperCase() as HouseCategory];
  const description = categoryDescriptions[categoryId.toUpperCase() as HouseCategory];

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
    { categoryId: 'C' }
  ];
}

// Основной компонент страницы
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  
  // Валидация категории
  if (!isValidCategory(categoryId)) {
    notFound();
  }

  const validCategoryId = categoryId.toUpperCase() as HouseCategory;

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Навигация */}
      <Header />

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryHeader categoryId={validCategoryId} />
        <CategoryHousesList categoryId={validCategoryId} />
      </main>
      
      <Footer />
    </div>
  );
}
