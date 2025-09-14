import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ houseId: string }> }
) {
  try {
    const { houseId } = await params;
    
    // Путь к папке interior для данного дома
    const interiorPath = join(process.cwd(), 'public', 'assets', 'skyline', houseId, 'interior');
    
    try {
      // Читаем содержимое папки interior
      const entries = await readdir(interiorPath, { withFileTypes: true });
      
      // Фильтруем только папки (комнаты)
      const rooms = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort(); // Сортируем для консистентности
      
      console.log(`📁 Found rooms for ${houseId}:`, rooms);
      
      return NextResponse.json({
        success: true,
        data: {
          houseId,
          rooms,
          count: rooms.length
        }
      });
      
    } catch (dirError) {
      console.warn(`⚠️ Interior directory not found for ${houseId}:`, dirError);
      
      return NextResponse.json({
        success: true,
        data: {
          houseId,
          rooms: [],
          count: 0,
          message: 'No interior rooms found'
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error getting rooms:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get rooms',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
