import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { TrendPoint } from '../types/report';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface TrendsChartProps {
  trends: TrendPoint[];
  language: LanguageCode;
}

interface MetricConfig {
  key: keyof TrendPoint;
  label: string;
  unit: string;
  color: string;
  targetMax: number;
  targetMin?: number;
  description: string;
}

const METRICS: MetricConfig[] = [
  {
    key: 'glucose',
    label: 'Fasting Glucose',
    unit: 'mg/dL',
    color: '#2dd4bf', // teal
    targetMax: 99,
    targetMin: 70,
    description: 'Target: 70 - 99 mg/dL fasting',
  },
  {
    key: 'hba1c',
    label: 'HbA1c (Glycated Hb)',
    unit: '%',
    color: '#fbbf24', // amber
    targetMax: 5.6,
    targetMin: 4.0,
    description: 'Target: < 5.7% (Normal), < 7.0% (Managed)',
  },
  {
    key: 'hemoglobin',
    label: 'Hemoglobin (Hb)',
    unit: 'g/dL',
    color: '#fb7185', // rose
    targetMax: 17.0,
    targetMin: 12.0,
    description: 'Target: 12.0 - 17.0 g/dL',
  },
  {
    key: 'cholesterol',
    label: 'Total Cholesterol',
    unit: 'mg/dL',
    color: '#38bdf8', // sky blue
    targetMax: 200,
    description: 'Desirable: < 200 mg/dL',
  },
  {
    key: 'creatinine',
    label: 'Serum Creatinine',
    unit: 'mg/dL',
    color: '#a78bfa', // lavender
    targetMax: 1.2,
    targetMin: 0.6,
    description: 'Target: 0.6 - 1.2 mg/dL',
  },
];

export const TrendsChart: React.FC<TrendsChartProps> = ({ trends, language }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricConfig>(METRICS[0]);

  const t = (key: any) => getTranslation(language, key);

  if (!trends || trends.length === 0) {
    return null;
  }

  const chartData = trends.map((tPoint) => ({
    date: tPoint.label || tPoint.date,
    value: tPoint[selectedMetric.key] as number,
  }));

  const currentValue = chartData[chartData.length - 1]?.value;
  const previousValue = chartData[chartData.length - 2]?.value;
  const delta =
    currentValue !== undefined && previousValue !== undefined
      ? (currentValue - previousValue).toFixed(1)
      : null;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 mb-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t('trendsTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {t('trendsSubtitle')}
          </p>
        </div>

        {/* Metric selection pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedMetric.key === m.key
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trajectory Snapshot Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <span className="text-[11px] text-slate-400">{t('currentLevel')}</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold text-white font-mono">{currentValue ?? '—'}</span>
            <span className="text-xs text-slate-400">{selectedMetric.unit}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <span className="text-[11px] text-slate-400">{t('clinicalGoal')}</span>
          <div className="text-xs font-semibold text-teal-300 mt-1">
            {selectedMetric.description}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <span className="text-[11px] text-slate-400">{t('trajectoryLabel')}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {delta !== null ? (
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                  parseFloat(delta) > 0
                    ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30'
                    : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30'
                }`}
              >
                {parseFloat(delta) > 0 ? `+${delta}` : delta} {selectedMetric.unit}
              </span>
            ) : (
              <span className="text-xs text-slate-500">{t('baselineVisit')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1322',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#ffffff',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
              }}
              formatter={(val: any) => [`${val} ${selectedMetric.unit}`, selectedMetric.label]}
            />
            {selectedMetric.targetMax && (
              <ReferenceLine
                y={selectedMetric.targetMax}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: `Max Normal (${selectedMetric.targetMax})`,
                  fill: '#10b981',
                  fontSize: 10,
                  position: 'right',
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke={selectedMetric.color}
              strokeWidth={3}
              dot={{ r: 5, fill: selectedMetric.color, stroke: '#060913', strokeWidth: 2 }}
              activeDot={{ r: 7, fill: '#2dd4bf' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
