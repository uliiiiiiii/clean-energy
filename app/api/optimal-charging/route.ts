import { NextRequest, NextResponse } from 'next/server';
import { getOptimalChargingWindow } from '@/lib/energyService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hoursParam = searchParams.get('hours');
    
    if (!hoursParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: hours' },
        { status: 400 }
      );
    }
    
    const hours = parseInt(hoursParam, 10);
    
    if (isNaN(hours) || hours < 1 || hours > 6) {
      return NextResponse.json(
        { error: 'Invalid hours parameter. Must be a number between 1 and 6.' },
        { status: 400 }
      );
    }
    
    const window = await getOptimalChargingWindow(hours);
    return NextResponse.json({ window });
  } catch (error) {
    console.error('Error finding optimal charging window:', error);
    return NextResponse.json(
      { 
        error: 'Failed to calculate optimal charging window',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

