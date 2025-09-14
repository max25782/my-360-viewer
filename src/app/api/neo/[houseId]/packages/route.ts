import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ houseId: string }> }
) {
  try {
    const { houseId } = await params;
    
    console.log(`🔍 Getting dynamic packages for Neo house: ${houseId}`);
    
    // Убираем префикс "neo-" если есть
    const cleanHouseId = houseId.toLowerCase().startsWith('neo-') 
      ? houseId.substring(4) 
      : houseId;
    
    // Капитализируем для путей
    const capitalizedHouseId = cleanHouseId.charAt(0).toUpperCase() + cleanHouseId.slice(1);
    
    // Пути к папкам для Neo домов (у них есть white и black варианты)
    const exteriorWhitePath = join(process.cwd(), 'public', 'assets', 'neo', capitalizedHouseId, 'exterior', 'white');
    const exteriorBlackPath = join(process.cwd(), 'public', 'assets', 'neo', capitalizedHouseId, 'exterior', 'black');
    const interiorWhitePath = join(process.cwd(), 'public', 'assets', 'neo', capitalizedHouseId, 'interior', 'white');
    const interiorBlackPath = join(process.cwd(), 'public', 'assets', 'neo', capitalizedHouseId, 'interior', 'black');
    
    let maxDP = 0;
    let maxPK = 0;
    const availableRooms: string[] = [];
    
    // Определяем maxDP из файлов exterior (проверяем оба цвета)
    try {
      const exteriorPaths = [exteriorWhitePath, exteriorBlackPath];
      const dpNumbers: number[] = [];
      
      for (const path of exteriorPaths) {
        try {
          const files = await readdir(path);
          const dpFiles = files.filter(file => 
            file.match(/^dp\d+\.(jpg|webp)$/i)
          );
          
          const pathDpNumbers = dpFiles.map(file => {
            const match = file.match(/^dp(\d+)\./i);
            return match ? parseInt(match[1], 10) : 0;
          }).filter(num => num > 0);
          
          dpNumbers.push(...pathDpNumbers);
          
        } catch (pathError) {
          // Игнорируем ошибки отдельных путей
        }
      }
      
      maxDP = dpNumbers.length > 0 ? Math.max(...dpNumbers) : 0;
      console.log(`📦 Neo exterior DP numbers found: ${dpNumbers}, maxDP: ${maxDP}`);
      
    } catch (exteriorError) {
      console.warn(`⚠️ Neo exterior directories not found for ${capitalizedHouseId}:`, exteriorError);
    }
    
    // Определяем maxPK и комнаты из файлов interior (проверяем оба цвета)
    try {
      const interiorPaths = [interiorWhitePath, interiorBlackPath];
      const pkNumbers: number[] = [];
      const roomsSet = new Set<string>();
      
      for (const path of interiorPaths) {
        try {
          const entries = await readdir(path, { withFileTypes: true });
          const rooms = entries
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);
          
          rooms.forEach(room => roomsSet.add(room));
          
          // Для каждой комнаты определяем максимальный PK
          for (const room of rooms) {
            try {
              const roomPath = join(path, room);
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
              console.warn(`⚠️ Could not read Neo room ${room}:`, roomError);
            }
          }
          
        } catch (pathError) {
          // Игнорируем ошибки отдельных путей
        }
      }
      
      availableRooms.push(...Array.from(roomsSet).sort());
      maxPK = pkNumbers.length > 0 ? Math.max(...pkNumbers) : 0;
      
      console.log(`🏠 Neo interior rooms found: ${availableRooms}`);
      console.log(`🎨 Neo interior PK numbers found: ${pkNumbers}, maxPK: ${maxPK}`);
      
    } catch (interiorError) {
      console.warn(`⚠️ Neo interior directories not found for ${capitalizedHouseId}:`, interiorError);
    }
    
    const result = {
      success: true,
      data: {
        houseId,
        cleanHouseId,
        capitalizedHouseId,
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
    
    console.log(`✅ Neo package info for ${houseId}:`, result.data.summary);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Error getting Neo packages:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get Neo package information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
