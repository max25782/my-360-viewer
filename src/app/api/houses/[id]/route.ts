import { NextResponse } from 'next/server';
import { getHouse } from '../../../../hooks/useHouses';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const requestedId = resolvedParams.id;
    
    // Try to get house with exact ID first, then case-insensitive
    let house = await getHouse(requestedId);
    
    if (!house) {
      return NextResponse.json(
        { 
          success: false, 
          error: `House with id '${requestedId}' not found`,
          availableHouses: [], // Could add list of available houses here
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: house,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch house data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
