import { NextResponse } from 'next/server';
import { getAllHouses } from '../../../hooks/useHouses';

export async function GET() {
  try {
    const houses = await getAllHouses();
    return NextResponse.json({
      success: true,
      data: houses,
      total: houses.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
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
