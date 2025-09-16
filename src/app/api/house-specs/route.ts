import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { extractHouseSpecs } from '../../../utils/houseDataExtractor';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const houseId = searchParams.get('houseId');
    const collection = searchParams.get('collection');

    if (!houseId || !collection) {
      return NextResponse.json(
        { error: 'Missing houseId or collection parameter' },
        { status: 400 }
      );
    }

    let jsonPath: string;
    let houseKey: string;

    // Определяем путь к JSON файлу в зависимости от коллекции
    switch (collection.toLowerCase()) {
      case 'premium':
        jsonPath = join(process.cwd(), 'public/data/premium-assets.json');
        houseKey = 'premiumHouses';
        break;
      case 'neo':
        jsonPath = join(process.cwd(), 'public/data/neo-assets.json');
        houseKey = 'neoHouses';
        break;
      case 'skyline':
        jsonPath = join(process.cwd(), 'public/data/house-assets.json');
        houseKey = 'houses';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid collection' },
          { status: 400 }
        );
    }

    // Читаем JSON файл
    const jsonContent = await readFile(jsonPath, 'utf-8');
    const data = JSON.parse(jsonContent);

    // Ищем дом по ID
    const houses = data[houseKey];
    if (!houses || !houses[houseId]) {
      return NextResponse.json(
        { error: 'House not found' },
        { status: 404 }
      );
    }

    const houseData = houses[houseId];
    
    // Извлекаем спецификации
    const specs = extractHouseSpecs(houseData, collection);

    return NextResponse.json({
      success: true,
      data: {
        houseId,
        collection,
        specs
      }
    });

  } catch (error) {
    console.error('Error fetching house specs:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch house specifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
