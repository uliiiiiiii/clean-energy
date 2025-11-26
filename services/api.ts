import { EnergyMixResponse, ChargingWindowResponse } from '@/types';

export async function fetchEnergyMix(): Promise<EnergyMixResponse> {
  const response = await fetch('/api/energy-mix');
  
  if (!response.ok) {
    throw new Error('Failed to fetch energy mix data');
  }
  
  return response.json();
}

export async function fetchOptimalCharging(hours: number): Promise<ChargingWindowResponse> {
  const response = await fetch(`/api/optimal-charging?hours=${hours}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch optimal charging window');
  }
  
  return response.json();
}