import React from 'react';
import { ShieldCheck, Sparkles, Activity, FileText, Lock } from 'lucide-react';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface HeroBannerProps {
  language: LanguageCode;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ language }) => {
  const t = (key: any) => getTranslation(language, key);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-950/40 via-slate-900/60 to-slate-950 p-6 sm:p-8 mb-8 shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-teal-400" />
          <span>{t('heroBadge')}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3">
          {t('heroTitlePrefix')}{' '}
          <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
            {t('heroTitleHighlight')}
          </span>
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
          {t('heroDescription')}
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Lock className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
            <span>{t('pillNoCloud')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Activity className="h-3.5 w-3.5 text-teal-400 flex-shrink-0" />
            <span>{t('pillRangeGauges')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <FileText className="h-3.5 w-3.5 text-teal-300 flex-shrink-0" />
            <span>{t('pillDoctorPrep')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
            <span>{t('pillGuardrails')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
