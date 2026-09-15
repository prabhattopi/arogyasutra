import React, { useState } from 'react';
import { Stethoscope, CheckCircle, Copy, Check, HelpCircle } from 'lucide-react';
import { DoctorQuestion } from '../types/report';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface DoctorQuestionsProps {
  questions: DoctorQuestion[];
  language: LanguageCode;
}

export const DoctorQuestions: React.FC<DoctorQuestionsProps> = ({ questions, language }) => {
  const [copied, setCopied] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Record<number, boolean>>({});

  const t = (key: any) => getTranslation(language, key);

  if (!questions || questions.length === 0) {
    return null;
  }

  const toggleCheck = (idx: number) => {
    setCheckedIds((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyAll = () => {
    const textToCopy = questions
      .map((q, i) => `${i + 1}. ${q.question}\n   (${q.context})`)
      .join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 mb-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {t('doctorTitle')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('doctorSubtitle')}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/40 text-xs text-slate-300 hover:text-white transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{t('btnQuestionsCopied')}</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>{t('btnCopyQuestions')}</span>
            </>
          )}
        </button>
      </div>

      {/* Questions list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {questions.map((q, idx) => {
          const isDone = checkedIds[idx];

          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                isDone
                  ? 'bg-slate-950/40 border-slate-800/40 opacity-50'
                  : 'bg-slate-950/50 hover:bg-slate-900/60 border-slate-800/80 hover:border-teal-500/40'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition flex-shrink-0 cursor-pointer ${
                  isDone
                    ? 'btn-primary-teal text-slate-950 border-transparent'
                    : 'border-slate-700 bg-slate-900/60 text-transparent hover:border-teal-400'
                }`}
              >
                <CheckCircle className="h-3.5 w-3.5" />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      q.priority === 'high'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.15)]'
                        : q.priority === 'medium'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                        : 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-[0_0_8px_rgba(20,184,166,0.15)]'
                    }`}
                  >
                    {q.priority === 'high'
                      ? t('priorityHigh')
                      : q.priority === 'medium'
                      ? t('priorityMedium')
                      : t('priorityGeneral')}
                  </span>
                </div>

                <p className={`text-xs sm:text-sm font-semibold text-slate-100 mb-1 ${isDone ? 'line-through text-slate-500' : ''}`}>
                  "{q.question}"
                </p>

                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="h-3 w-3 text-teal-400 flex-shrink-0" />
                  <span>{q.context}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
