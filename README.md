# Clean Energy UK 🌿⚡

Aplikacja webowa do monitorowania miksu energetycznego Wielkiej Brytanii oraz optymalizacji czasu ładowania samochodów elektrycznych.

## 📋 Opis

Aplikacja zbudowana w **Next.js 14** z TypeScript, wykorzystująca wbudowane API Routes dla logiki backendowej.

### Funkcjonalności:
- Wyświetla trzy wykresy kołowe przedstawiające miks energetyczny dla dzisiaj, jutra i pojutrze
- Każdy wykres pokazuje udział poszczególnych źródeł energii oraz procent czystej energii
- Umożliwia wybranie czasu ładowania (1-6 godzin) i znalezienie optymalnego okna czasowego
- Wykorzystuje Carbon Intensity API do pobierania danych o miksie energetycznym UK

## 🚀 Uruchomienie

### Wymagania
- Node.js 18+ 
- npm lub yarn

### Instalacja i uruchomienie

```bash
cd cleanEnergy/frontend
npm install
npm run dev
```

Aplikacja uruchomi się na `http://localhost:3000`

## 📡 API Endpoints

### GET `/api/energy-mix`

Zwraca dane o miksie energetycznym dla trzech dni (dzisiaj, jutro, pojutrze).

**Odpowiedź:**
```json
{
  "days": [
    {
      "date": "2024-01-15",
      "sources": {
        "gas": 35.5,
        "wind": 28.3,
        "nuclear": 15.2,
        "imports": 8.1,
        "biomass": 5.4,
        "solar": 3.2,
        "hydro": 2.1,
        "coal": 1.5,
        "other": 0.7
      },
      "cleanEnergyPercentage": 54.2
    }
  ]
}
```

### GET `/api/optimal-charging?hours=<1-6>`

Znajduje optymalne okno czasowe do ładowania EV w ciągu następnych dwóch dni.

**Parametry:**
- `hours` (wymagany) - długość okna ładowania w godzinach (1-6)

**Odpowiedź:**
```json
{
  "window": {
    "startTime": "2024-01-16T14:00Z",
    "endTime": "2024-01-16T17:00Z",
    "cleanEnergyPercentage": 58.7
  }
}
```

### GET `/api/health`

Zwraca status aplikacji.

**Odpowiedź:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

## 🌿 Źródła czystej energii

Za czystą energię uznajemy:
- Biomasa (biomass)
- Energia jądrowa (nuclear)
- Hydroenergia (hydro)
- Energia wiatrowa (wind)
- Energia słoneczna (solar)

## 🔧 Technologie

- **Next.js 14** - framework React z wbudowanym routingiem i API Routes
- **TypeScript** - typowanie statyczne
- **Recharts** - biblioteka do wykresów
- **CSS Modules** - stylowanie komponentów

## 📊 Źródło danych

Dane pochodzą z [Carbon Intensity API](https://carbonintensity.org.uk/) - publicznego API dostarczającego informacje o miksie energetycznym Wielkiej Brytanii.

## 📁 Struktura projektu

```
cleanEnergy/frontend/
├── app/
│   ├── api/
│   │   ├── energy-mix/
│   │   │   └── route.ts      # API endpoint dla miksu energetycznego
│   │   ├── optimal-charging/
│   │   │   └── route.ts      # API endpoint dla optymalnego ładowania
│   │   └── health/
│   │       └── route.ts      # Health check endpoint
│   ├── layout.tsx            # Layout aplikacji
│   ├── page.tsx              # Strona główna
│   ├── page.module.css       # Style strony głównej
│   └── globals.css           # Globalne style
├── components/
│   ├── EnergyPieChart.tsx    # Komponent wykresu kołowego
│   ├── EnergyPieChart.module.css
│   ├── ChargingOptimizer.tsx # Komponent optymalizacji ładowania
│   └── ChargingOptimizer.module.css
├── lib/
│   └── energyService.ts      # Logika biznesowa i integracja z API
├── services/
│   └── api.ts                # Funkcje do komunikacji z API
├── types/
│   └── index.ts              # Definicje typów TypeScript
├── package.json
└── tsconfig.json
```

## 📝 Licencja

MIT
