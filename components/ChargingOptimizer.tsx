'use client';

import { useState } from 'react';
import { OptimalChargingWindow } from '@/types';
import { fetchOptimalCharging } from '@/services/api';
import styles from './ChargingOptimizer.module.css';

export default function ChargingOptimizer() {
  const [hours, setHours] = useState<number>(2);
  const [result, setResult] = useState<OptimalChargingWindow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchOptimalCharging(hours);
      setResult(data.window);
    } catch (err) {
      setError('Nie udało się znaleźć optymalnego okna ładowania. Spróbuj ponownie.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('pl-PL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>⚡</span>
        </div>
        <h2 className={styles.title}>Optymalne ładowanie EV</h2>
        <p className={styles.subtitle}>
          Znajdź najlepszy czas na ładowanie samochodu elektrycznego, 
          gdy udział czystej energii jest najwyższy
        </p>
      </div>

      <div className={styles.formSection}>
        <label className={styles.label}>
          <span className={styles.labelText}>Czas ładowania</span>
          <span className={styles.labelHint}>Wybierz od 1 do 6 godzin</span>
        </label>
        
        <div className={styles.sliderWrapper}>
          <input
            type="range"
            min="1"
            max="6"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.sliderLabels}>
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <span 
                key={h} 
                className={`${styles.sliderLabel} ${hours === h ? styles.active : ''}`}
              >
                {h}h
              </span>
            ))}
          </div>
        </div>

        <div className={styles.selectedValue}>
          <span className={styles.valueNumber}>{hours}</span>
          <span className={styles.valueUnit}>{hours === 1 ? 'godzina' : hours < 5 ? 'godziny' : 'godzin'}</span>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className={styles.button}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Szukam...
            </>
          ) : (
            <>
              <span className={styles.buttonIcon}>🔍</span>
              Znajdź optymalny czas
            </>
          )}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {result && !error && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <span className={styles.resultIcon}>✅</span>
            <h3 className={styles.resultTitle}>Znaleziono optymalny czas!</h3>
          </div>

          <div className={styles.resultGrid}>
            <div className={styles.resultCard}>
              <div className={styles.cardIcon}>🟢</div>
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>Rozpoczęcie</span>
                <span className={styles.cardDate}>{formatDateTime(result.startTime).date}</span>
                <span className={styles.cardTime}>{formatDateTime(result.startTime).time}</span>
              </div>
            </div>

            <div className={styles.resultCard}>
              <div className={styles.cardIcon}>🔴</div>
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>Zakończenie</span>
                <span className={styles.cardDate}>{formatDateTime(result.endTime).date}</span>
                <span className={styles.cardTime}>{formatDateTime(result.endTime).time}</span>
              </div>
            </div>
          </div>

          <div className={styles.cleanEnergyResult}>
            <div className={styles.cleanEnergyIcon}>🌿</div>
            <div className={styles.cleanEnergyContent}>
              <span className={styles.cleanEnergyLabel}>Średni udział czystej energii</span>
              <span className={styles.cleanEnergyValue}>{result.cleanEnergyPercentage.toFixed(1)}%</span>
            </div>
            <div className={styles.cleanEnergyBar}>
              <div 
                className={styles.cleanEnergyFill}
                style={{ width: `${result.cleanEnergyPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

