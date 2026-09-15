import React from 'react';
import { Shield, Cpu, Github, HeartPulse, Menu } from 'lucide-react';
import { SystemHealth } from '../types/report';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface NavbarProps {
  health: SystemHealth | null;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenModelModal: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  health,
  language,
  onLanguageChange,
  onOpenModelModal,
  onToggleMobileMenu,
}) => {
  const t = (key: any) => getTranslation(language, key);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#060913]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle Button */}
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5 text-teal-400" />
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
            <HeartPulse className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-300 via-teal-100 to-white bg-clip-text text-transparent">
                {t('brandTitle')}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                {t('hackathonBadge')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t('brandSubtitle')}
            </p>
          </div>
        </div>

        {/* Action Controls & Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Air-Gapped Privacy Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-teal-500/30 text-xs font-medium text-slate-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Shield className="h-3.5 w-3.5 text-teal-400 hidden md:inline" />
            <span className="hidden md:inline text-slate-400">{t('airGappedSub')}</span>
            <span className="text-teal-400 font-semibold">{t('airGappedStatus')}</span>
          </div>

          {/* Model Status Modal Trigger */}
          <button
            onClick={onOpenModelModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:text-white transition cursor-pointer"
            title="Inspect Local Ollama Model State"
          >
            <Cpu className="h-3.5 w-3.5 text-teal-400" />
            <span className="hidden sm:inline font-mono text-[11px] text-slate-300">
              {health?.ollama?.activeModel || 'llama3.2:1b'}
            </span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center rounded-xl bg-slate-900/80 border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                language === 'en'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 rounded-lg transition font-medium cursor-pointer ${
                language === 'hi'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/prabhattopi/arogyasutra"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
            title="View ArogyaSutra on GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
