import React, { useState, useEffect } from 'react';
import { Monitor, X, Smartphone, ArrowRight } from 'lucide-react';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface MobileTipModalProps {
  language: LanguageCode;
}

export const MobileTipModal: React.FC<MobileTipModalProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const t = (key: any) => getTranslation(language, key);

  useEffect(() => {
    // Only check if on mobile screen and not already dismissed in session
    const isSmallScreen = window.innerWidth < 1024;
    const isDismissed = sessionStorage.getItem('arogyasutra_mobile_tip_dismissed');

    if (isSmallScreen && !isDismissed) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('arogyasutra_mobile_tip_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0a101f] border border-teal-500/30 p-6 shadow-2xl shadow-black/80 space-y-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Dismiss Modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm flex-shrink-0">
            <Monitor className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
              {t('mobileTipTitle')}
            </span>
            <h4 className="text-base font-bold text-white">
              {language === 'hi' ? 'डेस्कटॉप पर सर्वोत्तम अनुभव' : 'Optimal on Desktop Screens'}
            </h4>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {t('mobileTipMessage')}
        </p>

        {/* Feature comparison highlights */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-300">
            <Monitor className="h-3.5 w-3.5 text-teal-400" />
            <span>Desktop: Multi-column side-by-side biomarker visual gauges & real-time streaming</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
            <span>Mobile: Touch-friendly stack with slide-over sidebar and full AI companion</span>
          </div>
        </div>

        {/* Actions */}
        <button
          type="button"
          onClick={handleDismiss}
          className="w-full py-2.5 px-4 rounded-xl btn-primary-teal text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>{t('mobileTipDismiss')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
