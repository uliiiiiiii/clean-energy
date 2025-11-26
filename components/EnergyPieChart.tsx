'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DailyEnergyMix, ENERGY_SOURCE_COLORS, ENERGY_SOURCE_LABELS, CLEAN_ENERGY_SOURCES } from '@/types';
import styles from './EnergyPieChart.module.css';

interface EnergyPieChartProps {
  data: DailyEnergyMix;
  dayLabel: string;
}

export default function EnergyPieChart({ data, dayLabel }: EnergyPieChartProps) {
  const chartData = Object.entries(data.sources)
    .map(([name, value]) => ({
      name,
      value,
      label: ENERGY_SOURCE_LABELS[name] || name,
      isClean: CLEAN_ENERGY_SOURCES.includes(name),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; label: string; isClean: boolean } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipHeader}>
            <span 
              className={styles.tooltipDot}
              style={{ backgroundColor: ENERGY_SOURCE_COLORS[item.name] || '#95A5A6' }}
            />
            <span className={styles.tooltipLabel}>{item.label}</span>
            {item.isClean && <span className={styles.cleanBadge}>♻️ Czysta</span>}
          </div>
          <div className={styles.tooltipValue}>{item.value.toFixed(1)}%</div>
        </div>
      );
    }
    return null;
  };

  const renderLegend = ({ payload }: { payload?: Array<{ value: string; color: string; payload: { isClean: boolean } }> }) => {
    if (!payload) return null;
    
    return (
      <div className={styles.legend}>
        {payload.map((entry, index) => (
          <div key={index} className={styles.legendItem}>
            <span 
              className={styles.legendDot}
              style={{ backgroundColor: entry.color }}
            />
            <span className={styles.legendLabel}>
              {ENERGY_SOURCE_LABELS[entry.value] || entry.value}
            </span>
            {entry.payload.isClean && <span className={styles.legendClean}>♻️</span>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.dayLabel}>{dayLabel}</h3>
        <p className={styles.date}>{formatDate(data.date)}</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="rgba(0, 0, 0, 0.3)"
              strokeWidth={1}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={ENERGY_SOURCE_COLORS[entry.name] || '#95A5A6'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className={styles.centerLabel}>
          <div className={styles.centerValue}>{data.cleanEnergyPercentage.toFixed(1)}%</div>
          <div className={styles.centerText}>Czysta energia</div>
        </div>
      </div>
      
      <div className={styles.cleanEnergyBadge}>
        <span className={styles.leafIcon}>🌿</span>
        <span className={styles.cleanEnergyText}>
          {data.cleanEnergyPercentage.toFixed(1)}% czystej energii
        </span>
      </div>
    </div>
  );
}

