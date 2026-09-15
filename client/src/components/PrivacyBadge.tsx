import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface PrivacyBadgeProps {
  language: LanguageCode;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ language }) => {
  const t = (key: any) => getTranslation(language, key);

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8 border border-teal-500/20 bg-gradient-to-br from-[#0c1629]/70 via-[#080e1c]/60 to-[#050812] shadow-xl">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-8 w-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            {t('privacyTitle')}
          </h3>
          <p className="text-xs text-slate-400">
            {t('privacySubtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
        {/* Conventional Cloud AI Pitfall */}
        <div className="p-4 rounded-xl bg-rose-950/15 border border-rose-500/25">
          <div className="flex items-center gap-2 text-rose-400 font-semibold mb-2">
            <XCircle className="h-4 w-4" />
            <span>{t('cloudHazardTitle')}</span>
          </div>
          <ul className="space-y-1.5 text-slate-400 leading-relaxed">
            <li>{t('cloudHazardPoint1')}</li>
            <li>{t('cloudHazardPoint2')}</li>
            <li>{t('cloudHazardPoint3')}</li>
          </ul>
        </div>

        {/* ArogyaSutra Local Guarantee */}
        <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/25">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{t('localShieldTitle')}</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 leading-relaxed">
            <li>{t('localShieldPoint1')}</li>
            <li>{t('localShieldPoint2')}</li>
            <li>{t('localShieldPoint3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
