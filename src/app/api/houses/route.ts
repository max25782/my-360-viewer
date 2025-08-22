import { NextResponse } from 'next/server';
import { getAllServerHouses } from '../../../utils/serverHouses';
import type { CategoriesIndex, CategoryMetadata } from '../../../types/houses';

export async function GET() {
  try {
    const houses = await getAllServerHouses();
    
    // Группируем дома по категориям
    const categoryGroups = houses.reduce((groups, house) => {
      const category = house.category || 'unknown';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(house);
      return groups;
    }, {} as Record<string, typeof houses>);

    // Создаём расширенные данные категорий с домами
    const categories: Record<string, CategoryMetadata & { houses: typeof houses }> = {};
    Object.entries(categoryGroups).forEach(([categoryId, categoryHouses]) => {
      categories[categoryId] = {
        id: categoryId as any,
        title: getCategoryTitle(categoryId),
        description: getCategoryDescription(categoryId),
        count: categoryHouses.length,
        houses: categoryHouses
      };
    });

    const categoriesIndex = {
      categories,
      totalHouses: houses.length,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: categoriesIndex,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch houses data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function getCategoryTitle(categoryId: string): string {
  const titles: Record<string, string> = {
    'neo': 'Neo ADU Series',
    'skyline': 'Skyline Collection',
    'modern': 'Modern Collection',
    'A': 'Skyline Collection',
    'B': 'Neo ADU Series',  
    'C': 'Modern Collection'
  };
  return titles[categoryId] || `Category ${categoryId}`;
}

function getCategoryDescription(categoryId: string): string {
  const descriptions: Record<string, string> = {
    'neo': 'Modern designs with dual color schemes',
    'skyline': 'Traditional collection with beautiful views',
    'modern': 'Contemporary and innovative architectural designs with cutting-edge features',
    'A': 'Traditional collection with beautiful views',
    'B': 'Modern designs with dual color schemes',
    'C': 'Contemporary and innovative architectural designs with cutting-edge features'
  };
  return descriptions[categoryId] || `Houses in ${categoryId} category`;
}
