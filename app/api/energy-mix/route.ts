import { NextResponse } from 'next/server';
import { getEnergyMix } from '@/lib/energyService';

export async function GET() {
  try {
    const data = await getEnergyMix();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching energy mix:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch energy mix data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

