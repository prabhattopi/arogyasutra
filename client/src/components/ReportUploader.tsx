import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

interface ReportUploaderProps {
  onAnalyze: (payload: { text?: string; file?: File }) => void;
  isLoading: boolean;
  language: LanguageCode;
}

const SAMPLE_PRESETS = [
  {
    id: 'cbc',
    name: { en: 'Complete Blood Count (CBC)', hi: 'कम्प्लीट ब्लड काउंट (CBC)' },
    badge: { en: 'Anemia & Immune Alert', hi: 'एनीमिया एवं संक्रमण' },
    tag: { en: 'Hematology', hi: 'रक्त विज्ञान' },
    text: `METROCARE ADVANCED DIAGNOSTICS LABORATORY
PATIENT NAME   : Rajesh Kumar Verma               AGE / SEX   : 46 Yrs / Male
COMPLETE BLOOD COUNT (CBC)
Hemoglobin (Hb)                  9.4          g/dL          13.0 - 17.0         LOW
Red Blood Cell Count (RBC)       3.35         mill/cu.mm    4.50 - 5.90         LOW
Packed Cell Volume (PCV/HCT)     29.8         %             40.0 - 50.0         LOW
Total Leukocyte Count (WBC)      13,800       /cu.mm        4,000 - 11,000      HIGH
Platelet Count                   265,000      /cu.mm        150,000 - 450,000   NORMAL
Impression: Microcytic hypochromic anemia with neutrophilic leukocytosis.`,
  },
  {
    id: 'metabolic',
    name: { en: 'Comprehensive Metabolic Panel', hi: 'मेटाबोलिक एवं किडनी प्रोफाइल' },
    badge: { en: 'Diabetes & Renal Stress', hi: 'डायबिटीज एवं किडनी' },
    tag: { en: 'Glycemic / Kidney', hi: 'ग्लूकोज / रीनल' },
    text: `APEX PATHOLOGY & ENDOCRINE RESEARCH LAB
PATIENT NAME   : Ananya S. Sharma                 AGE / SEX   : 52 Yrs / Female
GLYCEMIC & RENAL METABOLIC PANEL
Fasting Blood Glucose (FBS)      168          mg/dL         70 - 99             HIGH
HbA1c (Glycated Hemoglobin)      8.2          %             4.0 - 5.6           HIGH
Blood Urea Nitrogen (BUN)        26.4         mg/dL         7.0 - 20.0          HIGH
Serum Creatinine                 1.45         mg/dL         0.55 - 1.02         HIGH
eGFR (CKD-EPI Formula)           54           mL/min        90 - 120            LOW
SGPT / ALT                       52           U/L           10 - 45             HIGH`,
  },
  {
    id: 'lipid',
    name: { en: 'Cardiovascular & Lipid Panel', hi: 'हृदय एवं लिपिड प्रोफाइल' },
    badge: { en: 'High Cholesterol & CRP', hi: 'कोलेस्ट्रॉल एवं इन्फ्लेमेशन' },
    tag: { en: 'Lipid / Cardio', hi: 'लिपिड / कार्डियो' },
    text: `CAREPULSE CARDIOLOGY & DIAGNOSTIC SUITE
PATIENT NAME   : Vikramaditya Roy                 AGE / SEX   : 39 Yrs / Male
LIPID & CARDIOVASCULAR PROFILE
Total Cholesterol                252          mg/dL         125 - 200           HIGH
Triglycerides                    218          mg/dL         50 - 150            HIGH
HDL Cholesterol (Good)           36           mg/dL         40 - 60             LOW
LDL Cholesterol (Bad)            172          mg/dL         50 - 100            HIGH
hs-CRP (Inflammation)            3.8          mg/L          0.1 - 1.0           HIGH`,
  },
];

export const ReportUploader: React.FC<ReportUploaderProps> = ({ onAnalyze, isLoading, language }) => {
  const [activeTab, setActiveTab] = useState<'sample' | 'upload' | 'paste'>('sample');
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('cbc');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (key: any) => getTranslation(language, key);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (activeTab === 'sample') {
      const preset = SAMPLE_PRESETS.find((p) => p.id === selectedPresetId);
      if (preset) {
        onAnalyze({ text: preset.text });
      }
    } else if (activeTab === 'upload') {
      if (selectedFile) {
        onAnalyze({ file: selectedFile });
      }
    } else if (activeTab === 'paste') {
      if (pastedText.trim()) {
        onAnalyze({ text: pastedText });
      }
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 mb-8 shadow-xl">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('sample')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('tabSamples')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>{t('tabUpload')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{t('tabPaste')}</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          {t('uploadTagline')}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab 1: 1-Click Test Samples */}
        {activeTab === 'sample' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              {t('sampleSubtitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SAMPLE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 text-left relative ${
                    selectedPresetId === preset.id
                      ? 'ring-2 ring-teal-400/90 border-teal-400/60 bg-teal-500/10 shadow-lg shadow-teal-500/10'
                      : 'border-slate-800/80 bg-slate-950/50 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800/90 text-teal-300 border border-teal-500/20">
                      {preset.tag[language === 'hi' ? 'hi' : 'en']}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300">
                      {preset.badge[language === 'hi' ? 'hi' : 'en']}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">
                    {preset.name[language === 'hi' ? 'hi' : 'en']}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono line-clamp-2">
                    {preset.text.split('\n')[2] || preset.text.slice(0, 70)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Upload PDF/TXT */}
        {activeTab === 'upload' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
              dragOver
                ? 'border-teal-400 bg-teal-500/10'
                : 'border-slate-800 hover:border-teal-500/50 bg-slate-950/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <UploadCloud className="h-8 w-8 text-teal-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white mb-1">
              {selectedFile ? selectedFile.name : t('uploadDropTitle')}
            </p>
            <p className="text-xs text-slate-400">
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(1)} KB · Ready to parse`
                : t('uploadDropSubtitle')}
            </p>
          </div>
        )}

        {/* Tab 3: Paste Raw Text */}
        {activeTab === 'paste' && (
          <div>
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder={t('pastePlaceholder')}
              className="w-full rounded-xl bg-slate-950/70 border border-slate-800 p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/60 font-mono leading-relaxed"
            />
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('quantizedModelReady')}</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
              isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'btn-primary-teal'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                <span>{t('btnAnalyzing')}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-slate-950" />
                <span>{t('btnAnalyze')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
