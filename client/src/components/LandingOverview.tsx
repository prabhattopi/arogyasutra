import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  FileText,
  Lock,
  Cpu,
  Database,
  CheckCircle2,
  HeartPulse,
} from 'lucide-react';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';
import { NavTab } from './Sidebar';

interface LandingOverviewProps {
  language: LanguageCode;
  onStart: (tab: NavTab) => void;
}

export const LandingOverview: React.FC<LandingOverviewProps> = ({
  language,
  onStart,
}) => {
  const t = (key: any) => getTranslation(language, key);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-500/25 bg-gradient-to-br from-[#0a1526] via-[#070d1a] to-[#040710] p-6 sm:p-10 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/25 mb-5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {t('heroTitlePrefix')}{' '}
            <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-100 bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            {t('heroDescription')}
          </p>

          {/* Primary Action Button - "Let's Start" */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="button"
              onClick={() => onStart('demystify')}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl btn-primary-teal text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{t('landingCta')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <span className="text-xs text-slate-400">
              {t('landingCtaSub')}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {t('landingPillarsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('landingPillarsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1: Zero Cloud Leakage */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition group">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
              {t('landingCard1Title')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('landingCard1Desc')}
            </p>
          </div>

          {/* Pillar 2: Range Gauges */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition group">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
              {t('landingCard2Title')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('landingCard2Desc')}
            </p>
          </div>

          {/* Pillar 3: Plain Language */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition group">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
              {t('landingCard3Title')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('landingCard3Desc')}
            </p>
          </div>

          {/* Pillar 4: Doctor Prep */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition group">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
              {t('landingCard4Title')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('landingCard4Desc')}
            </p>
          </div>
        </div>
      </div>

      {/* 3-Step Air-Gapped Pipeline */}
      <div className="rounded-2xl border border-slate-800 bg-[#090e1a]/80 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="h-5 w-5 text-teal-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            {t('landingWorkflowTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
              Step 01
            </span>
            <h4 className="text-sm font-semibold text-white">
              {t('landingStep1Title')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('landingStep1Desc')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
              Step 02
            </span>
            <h4 className="text-sm font-semibold text-white">
              {t('landingStep2Title')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('landingStep2Desc')}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Step 03
            </span>
            <h4 className="text-sm font-semibold text-white">
              {t('landingStep3Title')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('landingStep3Desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Launch Callout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-teal-500/10 border border-teal-500/25">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-slate-300">
            <strong className="text-white">Ready for live evaluation?</strong> Choose Complete Blood Count (CBC), Metabolic Panel, or Lipid Panel in 1 click.
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStart('demystify')}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs transition cursor-pointer flex-shrink-0"
        >
          {t('landingCta')} →
        </button>
      </div>
    </div>
  );
};
