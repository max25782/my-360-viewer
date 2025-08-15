import { NextResponse } from 'next/server';
import { HOUSES } from '../../../data/houses';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: HOUSES,
      total: HOUSES.length,
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
