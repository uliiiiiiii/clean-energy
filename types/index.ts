// Types for Carbon Intensity API response
export interface GenerationMix {
  fuel: string;
  perc: number;
}

export interface GenerationData {
  from: string;
  to: string;
  generationmix: GenerationMix[];
}

export interface DailyEnergyMix {
  date: string;
  sources: {
    [key: string]: number;
  };
  cleanEnergyPercentage: number;
}

export interface EnergyMixResponse {
  days: DailyEnergyMix[];
}

export interface OptimalChargingWindow {
  startTime: string;
  endTime: string;
  cleanEnergyPercentage: number;
}

export interface ChargingWindowResponse {
  window: OptimalChargingWindow;
}

export const CLEAN_ENERGY_SOURCES = ['biomass', 'nuclear', 'hydro', 'wind', 'solar'];

export const ENERGY_SOURCE_COLORS: { [key: string]: string } = {
  biomass: '#8B5A2B',
  coal: '#2C2C2C',
  imports: '#9B59B6',
  gas: '#E67E22',
  nuclear: '#F1C40F',
  other: '#95A5A6',
  hydro: '#3498DB',
  solar: '#F39C12',
  wind: '#1ABC9C',
};

export const ENERGY_SOURCE_LABELS: { [key: string]: string } = {
  biomass: 'Biomasa',
  coal: 'Węgiel',
  imports: 'Import',
  gas: 'Gaz',
  nuclear: 'Energia jądrowa',
  other: 'Inne',
  hydro: 'Hydroenergia',
  solar: 'Energia słoneczna',
  wind: 'Energia wiatrowa',
};

