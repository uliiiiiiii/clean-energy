import {
  GenerationData,
  DailyEnergyMix,
  EnergyMixResponse,
  OptimalChargingWindow,
  CLEAN_ENERGY_SOURCES,
} from '@/types';

const API_BASE_URL = 'https://api.carbonintensity.org.uk';

interface ApiResponse {
  data: GenerationData[];
}

// Formats a date to ISO string format (YYYY-MM-DDTHH:mmZ)
function formatDateForApi(date: Date): string {
  return date.toISOString().slice(0, 16) + 'Z';
}

// Gets the start of a day in UTC
function getStartOfDay(date: Date): Date {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

// Gets the end of a day in UTC
function getEndOfDay(date: Date): Date {
  const result = new Date(date);
  result.setUTCHours(23, 59, 59, 999);
  return result;
}

// Fetches generation data from Carbon Intensity API for a date range
async function fetchGenerationData(from: Date, to: Date): Promise<GenerationData[]> {
  const fromStr = formatDateForApi(from);
  const toStr = formatDateForApi(to);
  
  const url = `${API_BASE_URL}/generation/${fromStr}/${toStr}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch energy generation data from external API');
  }
  
  const data: ApiResponse = await response.json();
  return data.data || [];
}

// Calculates the clean energy percentage from a generation mix
function calculateCleanEnergyPercentage(sources: { [key: string]: number }): number {
  let cleanEnergy = 0;
  
  for (const source of CLEAN_ENERGY_SOURCES) {
    if (sources[source]) {
      cleanEnergy += sources[source];
    }
  }
  
  return Math.round(cleanEnergy * 100) / 100;
}

// Groups generation data by date and calculates daily averages
function groupByDateAndAverage(data: GenerationData[]): Map<string, DailyEnergyMix> {
  const dailyData = new Map<string, { sources: Map<string, number[]> }>();
  
  for (const interval of data) {
    // Extract date from the 'from' field
    const date = interval.from.split('T')[0];
    
    if (!dailyData.has(date)) {
      dailyData.set(date, { sources: new Map() });
    }
    
    const dayData = dailyData.get(date)!;
    
    for (const mix of interval.generationmix) {
      if (!dayData.sources.has(mix.fuel)) {
        dayData.sources.set(mix.fuel, []);
      }
      dayData.sources.get(mix.fuel)!.push(mix.perc);
    }
  }
  
  // Calculate averages for each day
  const result = new Map<string, DailyEnergyMix>();
  
  for (const [date, dayData] of dailyData) {
    const sources: { [key: string]: number } = {};
    
    for (const [fuel, percentages] of dayData.sources) {
      const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
      sources[fuel] = Math.round(avg * 100) / 100;
    }
    
    result.set(date, {
      date,
      sources,
      cleanEnergyPercentage: calculateCleanEnergyPercentage(sources),
    });
  }
  
  return result;
}

// Gets energy mix data for today, tomorrow, and the day after
export async function getEnergyMix(): Promise<EnergyMixResponse> {
  const today = new Date();
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const from = getStartOfDay(today);
  const to = getEndOfDay(dayAfterTomorrow);
  
  const data = await fetchGenerationData(from, to);
  const dailyAverages = groupByDateAndAverage(data);
  
  // Get the three days we need
  const days: DailyEnergyMix[] = [];
  
  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (dailyAverages.has(dateStr)) {
      days.push(dailyAverages.get(dateStr)!);
    }
  }
  
  return { days };
}

// Finds the optimal charging window with highest clean energy percentage
export async function getOptimalChargingWindow(hours: number): Promise<OptimalChargingWindow> {
  if (hours < 1 || hours > 6) {
    throw new Error('Charging window must be between 1 and 6 hours');
  }
  
  // Number of 30-minute intervals needed
  const intervalsNeeded = hours * 2;
  
  // Fetch forecast data for tomorrow and day after tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const from = getStartOfDay(tomorrow);
  const to = getEndOfDay(dayAfterTomorrow);
  
  const data = await fetchGenerationData(from, to);
  
  if (data.length < intervalsNeeded) {
    throw new Error('Not enough forecast data available');
  }
  
  // Sort data by time
  data.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
  
  // Calculate clean energy percentage for each interval
  const intervalsWithCleanEnergy = data.map((interval) => {
    const sources: { [key: string]: number } = {};
    for (const mix of interval.generationmix) {
      sources[mix.fuel] = mix.perc;
    }
    return {
      from: interval.from,
      to: interval.to,
      cleanPercentage: calculateCleanEnergyPercentage(sources),
    };
  });
  
  // Find the window with highest average clean energy
  let bestWindow = {
    startIndex: 0,
    avgCleanEnergy: 0,
  };
  
  for (let i = 0; i <= intervalsWithCleanEnergy.length - intervalsNeeded; i++) {
    let totalClean = 0;
    
    for (let j = 0; j < intervalsNeeded; j++) {
      totalClean += intervalsWithCleanEnergy[i + j].cleanPercentage;
    }
    
    const avgClean = totalClean / intervalsNeeded;
    
    if (avgClean > bestWindow.avgCleanEnergy) {
      bestWindow = {
        startIndex: i,
        avgCleanEnergy: avgClean,
      };
    }
  }
  
  const startInterval = intervalsWithCleanEnergy[bestWindow.startIndex];
  const endInterval = intervalsWithCleanEnergy[bestWindow.startIndex + intervalsNeeded - 1];
  
  return {
    startTime: startInterval.from,
    endTime: endInterval.to,
    cleanEnergyPercentage: Math.round(bestWindow.avgCleanEnergy * 100) / 100,
  };
}
