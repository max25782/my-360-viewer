'use client';

import Link from 'next/link';
import type { HouseCategory } from '../types/houses';
import { useCategories } from '../hooks/useCategories';

interface CategoryHeaderProps {
  categoryId: HouseCategory;
}

export default function CategoryHeader({ categoryId }: CategoryHeaderProps) {
  const { categories } = useCategories();
  
  const categoryData = {
    A: {
      title: 'Skyline Collection',
      description: 'Traditional collection featuring a variety of house designs with beautiful skyline views.',
      icon: '🏔️',
      gradient: 'from-sky-600 to-blue-800'
    },
    B: {
      title: 'Neo ADU Series', 
      description: 'Modern designs with dual color schemes. Choose between elegant white or sophisticated dark interiors.',
      icon: '⚡',
      gradient: 'from-indigo-600 to-purple-800'
    },
    C: {
      title: 'Premium Collection',
      description: 'Contemporary and innovative architectural designs with cutting-edge features and smart home technology.',
      icon: '🏗️',
      gradient: 'from-emerald-600 to-green-800'
    },
    skyline: {
      title: 'Skyline Collection',
      description: 'Traditional collection featuring a variety of house designs with beautiful skyline views.',
      icon: '🏔️',
      gradient: 'from-sky-600 to-blue-800'
    },
    neo: {
      title: 'Neo ADU Series', 
      description: 'Modern designs with dual color schemes. Choose between elegant white or sophisticated dark interiors.',
      icon: '⚡',
      gradient: 'from-indigo-600 to-purple-800'
    },
    modern: {
      title: 'Premium Collection',
      description: 'Contemporary and innovative architectural designs with cutting-edge features and smart home technology.',
      icon: '🏗️',
      gradient: 'from-emerald-600 to-green-800'
    },
    premium: {
      title: 'Premium Collection',
      description: 'Contemporary and innovative architectural designs with cutting-edge features and smart home technology.',
      icon: '🏗️',
      gradient: 'from-emerald-600 to-green-800'
    }
  };

  const category = categoryData[categoryId];
  const categoryInfo = categories?.categories ? Object.values(categories.categories).find(c => c.id === categoryId) : null;

  return (
    <div className="text-center bg-slate-800 mb-12">

      {/* Category Header */}
  
    </div>
  );
}
