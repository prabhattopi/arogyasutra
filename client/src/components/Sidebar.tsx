import React from 'react';
import {
  HeartPulse,
  Home,
  FileText,
  Activity,
  Stethoscope,
  TrendingUp,
  Shield,
  Cpu,
  Github,
  X,
  Sparkles,
} from 'lucide-react';
import { SystemHealth } from '../types/report';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

export type NavTab = 'overview' | 'demystify' | 'privacy';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  health: SystemHealth | null;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenModelModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  health,
  language,
  onLanguageChange,
  onOpenModelModal,
}) => {
  const t = (key: any) => getTranslation(language, key);

  const navItems = [
    {
      id: 'overview' as NavTab,
      label: t('navOverview'),
      icon: Home,
      badge: null,
    },
    {
      id: 'demystify' as NavTab,
      label: t('navDemystify'),
      icon: FileText,
      badge: (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </span>
      ),
    },
    {
      id: 'privacy' as NavTab,
      label: t('navPrivacy'),
      icon: Shield,
      badge: (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
          Zero-Cloud
        </span>
      ),
    },
  ];

  const handleItemClick = (id: NavTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#070b14] border-r border-slate-800/80 text-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20 flex-shrink-0">
            <HeartPulse className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-teal-100 to-white bg-clip-text text-transparent">
                {t('brandTitle')}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight line-clamp-1">
              {t('brandSubtitle')}
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close Sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-teal-400" />
          <span>Clinical Navigation</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-teal-500/15 text-teal-200 border border-teal-500/40 shadow-sm shadow-teal-500/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 flex-shrink-0 transition ${
                    isActive ? 'text-teal-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && <div className="flex-shrink-0">{item.badge}</div>}
            </button>
          );
        })}
      </div>

      {/* System Status & Quick Controls Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#050810]/70 space-y-3">
        {/* Air-Gapped Status Pill */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-teal-500/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-slate-300 font-medium">{t('airGappedStatus')}</span>
          </div>
          <Shield className="h-3.5 w-3.5 text-emerald-400" />
        </div>

        {/* Local Model Pill & Trigger */}
        <button
          type="button"
          onClick={onOpenModelModal}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/50 text-xs text-slate-300 hover:text-white transition cursor-pointer"
          title="Inspect Local Ollama Model State"
        >
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-teal-400" />
            <span className="font-mono text-[11px] text-slate-300 truncate max-w-[130px]">
              {health?.ollama?.activeModel || 'llama3.2:1b'}
            </span>
          </div>
          <span className="text-[10px] text-teal-400 hover:underline">Config</span>
        </button>

        {/* Language Toggle + GitHub Link */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded transition font-medium cursor-pointer ${
                language === 'en'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 rounded transition font-medium cursor-pointer ${
                language === 'hi'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          <a
            href="https://github.com/prabhattopi/arogyasutra"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-teal-300 transition"
            title="GitHub Repository"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
