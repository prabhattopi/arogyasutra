import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Copy, Check, Printer, Shield, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface AnalysisStreamProps {
  summary: string;
  isStreaming: boolean;
  reportType?: string;
  patientName?: string;
  language: LanguageCode;
}

export const AnalysisStream: React.FC<AnalysisStreamProps> = ({
  summary,
  isStreaming,
  reportType,
  patientName,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const streamContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef<boolean>(true);

  const t = (key: any) => getTranslation(language, key);

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe internal auto-scroll that respects user scrolling
  const handleScroll = () => {
    if (!streamContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = streamContainerRef.current;
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 60;
  };

  useEffect(() => {
    if (isStreaming && streamContainerRef.current && isNearBottomRef.current) {
      streamContainerRef.current.scrollTop = streamContainerRef.current.scrollHeight;
    }
  }, [summary, isStreaming]);

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {t('summaryTitle')}
                {isStreaming && (
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-normal">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    {t('streamingIndicator')}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {t('summarySubtitle')}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!summary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={t('btnCopy')}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">{t('btnCopied')}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>{t('btnCopy')}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              disabled={!summary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition cursor-pointer hidden sm:flex disabled:opacity-40 disabled:cursor-not-allowed"
              title={t('btnPrint')}
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>{t('btnPrint')}</span>
            </button>
          </div>
        </div>

        {/* Patient / Report Context Tag */}
        {(patientName || reportType) && (
          <div className="mb-4 px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              {t('subjectLabel')} <strong className="text-white font-medium">{patientName || 'Anonymous Patient'}</strong>
            </span>
            <span>
              {t('panelLabel')} <strong className="text-teal-300 font-semibold">{reportType || 'Laboratory Panel'}</strong>
            </span>
          </div>
        )}

        {/* Formatted Human-Readable Stream Area */}
        <div
          ref={streamContainerRef}
          onScroll={handleScroll}
          className="min-h-[220px] max-h-[500px] overflow-y-auto pr-1 text-xs sm:text-sm text-slate-200"
        >
          {summary ? (
            <MarkdownRenderer content={summary} isStreaming={isStreaming} />
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-center">
              <BookOpen className="h-10 w-10 mb-2 opacity-40 text-teal-400" />
              <p className="text-sm font-medium text-white">{t('awaitingInputTitle')}</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                {t('awaitingInputSubtitle')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ethical Guardrails Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
        <Shield className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {t('guardrailNote')}
        </p>
      </div>
    </div>
  );
};
