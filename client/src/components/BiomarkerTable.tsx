import React, { useState } from 'react';
import { Biomarker, BiomarkerStatus } from '../types/report';
import { Activity, ArrowDown, ArrowUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface BiomarkerTableProps {
  biomarkers: Biomarker[];
  language: LanguageCode;
}

export const BiomarkerTable: React.FC<BiomarkerTableProps> = ({ biomarkers, language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null);

  const t = (key: any) => getTranslation(language, key);

  if (!biomarkers || biomarkers.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-slate-400">
        <Activity className="h-8 w-8 mx-auto mb-2 text-slate-600 animate-pulse" />
        <p className="text-sm">No biomarkers parsed yet.</p>
      </div>
    );
  }

  const categories = ['ALL', ...Array.from(new Set(biomarkers.map((b) => b.category)))];

  const filtered = selectedCategory === 'ALL'
    ? biomarkers
    : biomarkers.filter((b) => b.category === selectedCategory);

  const normalCount = biomarkers.filter((b) => b.status === 'NORMAL').length;
  const abnormalCount = biomarkers.length - normalCount;

  const getStatusBadge = (status: BiomarkerStatus) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <CheckCircle className="h-3 w-3" />
            {t('statusNormal')}
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]">
            <ArrowDown className="h-3 w-3" />
            {t('statusLow')}
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            <ArrowUp className="h-3 w-3" />
            {t('statusHigh')}
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600/20 text-red-300 border border-red-500/40 animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            {t('statusCritical')}
          </span>
        );
    }
  };

  const calculatePosition = (val: number, min: number, max: number) => {
    const span = max - min || 1;
    const lowerBuffer = span * 0.35;
    const upperBuffer = span * 0.35;
    const totalStart = min - lowerBuffer;
    const totalEnd = max + upperBuffer;
    const totalSpan = totalEnd - totalStart;

    let pct = ((val - totalStart) / totalSpan) * 100;
    return Math.max(5, Math.min(95, pct));
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Header and Summary stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-400" />
            {t('biomarkersTitle')}
          </h3>
          <p className="text-xs text-slate-400">
            {t('biomarkersSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            {normalCount} {t('normalCountBadge')}
          </span>
          {abnormalCount > 0 && (
            <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-semibold shadow-[0_0_12px_rgba(244,63,94,0.15)]">
              {abnormalCount} {t('outsideRangeBadge')}
            </span>
          )}
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition font-semibold cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat === 'ALL' ? t('filterAll') : cat}
            </button>
          ))}
        </div>
      )}

      {/* Biomarker List with Dynamic Range Gauges */}
      <div className="space-y-3">
        {filtered.map((b, idx) => {
          const posPct = calculatePosition(b.value, b.referenceMin, b.referenceMax);
          const isSelected = selectedBiomarker?.name === b.name;

          return (
            <div
              key={idx}
              onClick={() => setSelectedBiomarker(isSelected ? null : b)}
              className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#0f172a]/90 ring-1 ring-teal-400/80 border-teal-400/60 shadow-lg shadow-teal-500/10'
                  : 'bg-slate-950/50 hover:bg-slate-900/60 border-slate-800/80 hover:border-teal-500/30'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{b.name}</span>
                    <span className="text-[10px] text-teal-300 px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 font-mono">
                      {b.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {t('refInterval')} <span className="text-slate-300 font-mono">{b.referenceText}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-base text-white font-mono">{b.value.toLocaleString()}</span>{' '}
                    <span className="text-xs text-slate-400">{b.unit}</span>
                  </div>
                  {getStatusBadge(b.status)}
                </div>
              </div>

              {/* Dynamic Range Gauge Visualizer */}
              <div className="mt-2.5 pt-1">
                <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="absolute inset-y-0 left-[25%] right-[25%] bg-emerald-500/30 rounded-full" />
                </div>

                {/* Patient's value marker indicator */}
                <div className="relative h-4 -mt-3 pointer-events-none">
                  <div
                    className="absolute -top-0.5 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                    style={{ left: `${posPct}%` }}
                  >
                    <div
                      className={`h-3.5 w-3.5 rounded-full border-2 border-slate-950 shadow-md ${
                        b.status === 'NORMAL'
                          ? 'bg-emerald-400 ring-2 ring-emerald-400/30'
                          : b.status === 'LOW'
                          ? 'bg-rose-400 ring-2 ring-rose-400/40 animate-pulse'
                          : 'bg-amber-400 ring-2 ring-amber-400/40 animate-pulse'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>Min ({b.referenceMin})</span>
                  <span className="text-emerald-400 font-semibold">{t('healthyRange')}</span>
                  <span>Max ({b.referenceMax})</span>
                </div>
              </div>

              {/* Expandable Plain Language Explanation */}
              {isSelected && b.plainExplanation && (
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2 bg-slate-900/80 p-3 rounded-xl border border-teal-500/20">
                  <Info className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{b.plainExplanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
