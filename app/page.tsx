'use client';

import { useState, useEffect } from 'react';
import { DailyEnergyMix } from '@/types';
import { fetchEnergyMix } from '@/services/api';
import EnergyPieChart from '@/components/EnergyPieChart';
import ChargingOptimizer from '@/components/ChargingOptimizer';
import styles from './page.module.css';

export default function Home() {
  const [energyData, setEnergyData] = useState<DailyEnergyMix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEnergyData();
  }, []);

  const loadEnergyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEnergyMix();
      setEnergyData(data.days);
    } catch (err) {
      setError('Nie udało się pobrać danych o miksie energetycznym. Upewnij się, że backend działa.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDayLabel = (index: number) => {
    const labels = ['Dzisiaj', 'Jutro', 'Pojutrze'];
    return labels[index] || `Dzień ${index + 1}`;
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoWrapper}>
            <span className={styles.logo}>⚡</span>
          </div>
          <h1 className={styles.title}>
            Clean<span className={styles.titleAccent}>Energy</span> UK
          </h1>
          <p className={styles.subtitle}>
            Monitoruj miks energetyczny Wielkiej Brytanii i znajdź optymalny czas na ładowanie 
            swojego samochodu elektrycznego
          </p>
        </div>
        <div className={styles.headerGlow}></div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📊</span>
            Miks energetyczny
          </h2>
          <p className={styles.sectionSubtitle}>
            Średnie udziały źródeł energii dla trzech kolejnych dni
          </p>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Ładowanie danych...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <span className={styles.errorIcon}>⚠️</span>
            <p className={styles.errorText}>{error}</p>
            <button onClick={loadEnergyData} className={styles.retryButton}>
              Spróbuj ponownie
            </button>
          </div>
        )}

        {!loading && !error && energyData.length > 0 && (
          <div className={styles.chartsGrid}>
            {energyData.map((day, index) => (
              <div 
                key={day.date} 
                className={styles.chartWrapper}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <EnergyPieChart data={day} dayLabel={getDayLabel(index)} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🔋</span>
            Optymalizacja ładowania
          </h2>
          <p className={styles.sectionSubtitle}>
            Znajdź najlepszy czas na ładowanie, gdy udział czystej energii jest najwyższy
          </p>
        </div>

        <ChargingOptimizer />
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Dane pochodzą z <a href="https://carbonintensity.org.uk/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Carbon Intensity API</a>
          </p>
          <p className={styles.footerNote}>
            Czysta energia: biomasa, energia jądrowa, hydroenergia, energia wiatrowa, energia słoneczna
          </p>
        </div>
      </footer>
    </main>
  );
}

