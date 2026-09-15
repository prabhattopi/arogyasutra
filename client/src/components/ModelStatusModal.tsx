import React from 'react';
import { X, Cpu, Terminal, Database } from 'lucide-react';
import { SystemHealth } from '../types/report';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface ModelStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: SystemHealth | null;
  language: LanguageCode;
}

export const ModelStatusModal: React.FC<ModelStatusModalProps> = ({ isOpen, onClose, health, language }) => {
  const t = (key: any) => getTranslation(language, key);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-teal-500/30 bg-[#080d1a] p-6 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('modalTitle')}</h3>
            <p className="text-xs text-slate-400">{t('modalSubtitle')}</p>
          </div>
        </div>

        {/* Status Blocks */}
        <div className="space-y-3.5 mb-6 text-xs">
          {/* Ollama Engine Status */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <span className="font-semibold text-white">{t('ollamaEngine')}</span>
                <p className="text-[11px] text-slate-400 font-mono">
                  {health?.ollama?.host || 'http://localhost:11434'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {health?.ollama?.online ? 'Connected' : 'Local Fallback'}
            </span>
          </div>

          {/* Active Model */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">{t('activeModel')}</span>
              <span className="font-mono text-xs font-bold text-teal-300">
                {health?.ollama?.activeModel || 'llama3.2:1b'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Quantized edge LLM running on-premise for high-speed clinical extraction.
            </p>
          </div>

          {/* Database Storage Mode (100% Local MongoDB) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-teal-400" />
              <div>
                <span className="font-semibold text-white">{t('dbStorageMode')}</span>
                <p className="text-[11px] text-slate-400">
                  {health?.database?.mode || 'Local MongoDB (100% On-Premise)'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {health?.database?.connected ? 'Local Docker Mongo' : 'Local Store'}
            </span>
          </div>
        </div>

        {/* How to switch models */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-teal-300 font-semibold mb-1.5">
            <Terminal className="h-3.5 w-3.5" />
            <span>{t('switchModelTitle')}</span>
          </div>
          <div className="bg-[#040812] p-2.5 rounded-lg font-mono text-[11px] text-teal-200 border border-teal-500/20 mb-2">
            bash ./run.sh llama3.2:3b
          </div>
          <p className="text-[11px] text-slate-400">
            {t('switchModelHint')}
          </p>
        </div>
      </div>
    </div>
  );
};
