import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ houseId: string }> }
) {
  try {
    const { houseId } = await params;
    
    console.log(`🔍 Getting dynamic packages for house: ${houseId}`);
    
    // Путь к папке exterior для определения maxDP
    const exteriorPath = join(process.cwd(), 'public', 'assets', 'skyline', houseId, 'exterior');
    
    // Путь к папке interior для определения maxPK
    const interiorPath = join(process.cwd(), 'public', 'assets', 'skyline', houseId, 'interior');
    
    let maxDP = 0;
    let maxPK = 0;
    const availableRooms: string[] = [];
    
    // Определяем maxDP из файлов exterior
    try {
      const exteriorFiles = await readdir(exteriorPath);
      const dpFiles = exteriorFiles.filter(file => 
        file.match(/^dp\d+\.(jpg|webp)$/i)
      );
      
      const dpNumbers = dpFiles.map(file => {
        const match = file.match(/^dp(\d+)\./i);
        return match ? parseInt(match[1], 10) : 0;
      }).filter(num => num > 0);
      
      maxDP = dpNumbers.length > 0 ? Math.max(...dpNumbers) : 0;
      
      console.log(`📦 Found exterior files for ${houseId}:`, dpFiles);
      console.log(`📦 Determined maxDP: ${maxDP}`);
      
    } catch (exteriorError) {
      console.warn(`⚠️ Exterior directory not found for ${houseId}:`, exteriorError);
    }
    
    // Определяем maxPK и комнаты из файлов interior
    try {
      const interiorEntries = await readdir(interiorPath, { withFileTypes: true });
      const rooms = interiorEntries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort();
      
      availableRooms.push(...rooms);
      
      // Для каждой комнаты определяем максимальный PK
      const pkNumbers: number[] = [];
      
      for (const room of rooms) {
        try {
          const roomPath = join(interiorPath, room);
          const roomFiles = await readdir(roomPath);
          
          const pkFiles = roomFiles.filter(file => 
            file.match(/^pk\d+\.(jpg|webp)$/i)
          );
          
          const roomPkNumbers = pkFiles.map(file => {
            const match = file.match(/^pk(\d+)\./i);
            return match ? parseInt(match[1], 10) : 0;
          }).filter(num => num > 0);
          
          pkNumbers.push(...roomPkNumbers);
          
        } catch (roomError) {
          console.warn(`⚠️ Could not read room ${room} for ${houseId}:`, roomError);
        }
      }
      
      maxPK = pkNumbers.length > 0 ? Math.max(...pkNumbers) : 0;
      
      console.log(`🏠 Found interior rooms for ${houseId}:`, rooms);
      console.log(`🎨 Determined maxPK: ${maxPK}`);
      
    } catch (interiorError) {
      console.warn(`⚠️ Interior directory not found for ${houseId}:`, interiorError);
    }
    
    const result = {
      success: true,
      data: {
        houseId,
        maxDP,
        maxPK,
        availableRooms,
        summary: {
          exteriorPackages: maxDP,
          interiorPackages: maxPK,
          roomCount: availableRooms.length
        }
      }
    };
    
    console.log(`✅ Package info for ${houseId}:`, result.data.summary);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Error getting packages:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get package information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
