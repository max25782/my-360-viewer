import { NextResponse } from 'next/server';
import { getAllServerHouses } from '../../../utils/serverHouses';
import type { CategoriesIndex, CategoryMetadata } from '../../../types/houses';

/**
 * Проверяет токен аутентификации
 */
function verifyAuthToken(request: Request): boolean {
  // Проверяем Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Простая проверка токена (в реальном приложении нужна более сложная логика)
    return token.startsWith('demo-token-');
  }
  
  // Проверяем cookies
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
    if (authCookie) {
      const token = authCookie.split('=')[1];
      return token.startsWith('demo-token-');
    }
  }
  
  return false;
}

export async function GET(request: Request) {
  try {
    // Проверяем аутентификацию
    if (!verifyAuthToken(request)) {
      console.log('🔐 Unauthorized API request to /api/houses');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      );
    }
    
    console.log('🔐 Authenticated API request to /api/houses');
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
    'premium': 'Premium Collection',
    'A': 'Skyline Collection',
    'B': 'Neo ADU Series',  
    'C': 'Premium Collection'
  };
  return titles[categoryId] || `Category ${categoryId}`;
}

function getCategoryDescription(categoryId: string): string {
  const descriptions: Record<string, string> = {
    'neo': 'Modern designs with dual color schemes',
    'skyline': 'Traditional collection with beautiful views',
    'modern': 'Contemporary and innovative architectural designs with cutting-edge features',
    'premium': 'Luxury homes with premium finishes and exceptional craftsmanship',
    'A': 'Traditional collection with beautiful views',
    'B': 'Modern designs with dual color schemes',
    'C': 'Luxury homes with premium finishes and exceptional craftsmanship'
  };
  return descriptions[categoryId] || `Houses in ${categoryId} category`;
}
