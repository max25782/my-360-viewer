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
      title: 'Skyline ADU Collection',
      description: 'Compact and efficient ADU designs perfect for small families and urban living.',
      icon: '🏠',
      gradient: 'from-blue-600 to-indigo-700'
    },
    B: {
      title: 'Neo ADU Series', 
      description: 'Modern and versatile ADU layouts with flexible room configurations.',
      icon: '🏘️',
      gradient: 'from-purple-600 to-violet-700'
    },
    C: {
      title: 'Premium Collection',
      description: 'Luxury ADU designs with premium finishes and high-end features.',
      icon: '🏛️',
      gradient: 'from-emerald-600 to-teal-700'
    }
  };

  const category = categoryData[categoryId];
  const categoryInfo = categories?.categories.find(c => c.id === categoryId);

  return (
    <div className="text-center bg-slate-800 mb-12">

      {/* Category Header */}
  
    </div>
  );
}
