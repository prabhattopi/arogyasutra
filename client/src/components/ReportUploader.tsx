import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, RefreshCw, X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LanguageCode } from '../i18n/translations';
import { getTranslation } from '../i18n/useI18n';

export interface ReportUploaderProps {
  onAnalyze: (payload: { text?: string; file?: File }) => void;
  isLoading: boolean;
  language: LanguageCode;
  isOpen?: boolean;
  onClose?: () => void;
}

export const SAMPLE_PRESETS = [
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
Mean Corpuscular Volume (MCV)    89.0         fL            83.0 - 101.0        NORMAL
Mean Corpuscular Hb (MCH)        21.4         pg            27.0 - 32.0         LOW
MCH Concentration (MCHC)         31.5         g/dL          32.0 - 36.0         LOW
Red Cell Distribution Width(RDW) 16.8         %             11.5 - 14.5         HIGH
Neutrophils                      78           %             40 - 75             HIGH
Lymphocytes                      16           %             20 - 45             LOW
Monocytes                        4            %             2 - 10              NORMAL
Eosinophils                      2            %             1 - 6               NORMAL
Basophils                        0            %             0 - 1               NORMAL
ESR (Westergren)                 32           mm/1st hr     0 - 15              HIGH
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
SGPT / ALT                       52           U/L           10 - 45             HIGH
SGOT / AST                       44           U/L           10 - 40             HIGH
Serum Calcium                    9.1          mg/dL         8.5 - 10.5          NORMAL
Serum Potassium                  4.4          mmol/L        3.5 - 5.1           NORMAL
Impression: Uncontrolled Type 2 Diabetes with moderate renal filtration impairment.`,
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
VLDL Cholesterol                 43.6         mg/dL         10 - 30             HIGH
Chol / HDL Ratio                 7.0                        3.0 - 5.0           HIGH
hs-CRP (Inflammation)            3.8          mg/L          0.1 - 1.0           HIGH
Apolipoprotein B                 132          mg/dL         60 - 110            HIGH
Impression: Atherogenic dyslipidemia with heightened vascular inflammatory risk.`,
  },
];

export const ReportUploader: React.FC<ReportUploaderProps> = ({
  onAnalyze,
  isLoading,
  language,
  isOpen = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'preset'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('cbc');
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    if (activeTab === 'upload') {
      if (selectedFile) {
        onAnalyze({ file: selectedFile });
      } else {
        onAnalyze({ text: SAMPLE_PRESETS[0].text });
      }
    } else if (activeTab === 'paste') {
      if (pastedText.trim()) {
        onAnalyze({ text: pastedText });
      } else {
        onAnalyze({ text: SAMPLE_PRESETS[0].text });
      }
    } else if (activeTab === 'preset') {
      const presetObj = SAMPLE_PRESETS.find((p) => p.id === selectedPreset) || SAMPLE_PRESETS[0];
      onAnalyze({ text: presetObj.text });
    }

    if (onClose) onClose();
  };

  const handlePresetSelect = (presetText: string, presetId: string) => {
    setSelectedPreset(presetId);
    onAnalyze({ text: presetText });
    if (onClose) onClose();
  };

  // If not open in drawer mode, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-xl bg-[#080d18] border-l border-slate-800 h-full shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#0b1222]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-teal-500/20">
              <UploadCloud className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{language === 'hi' ? 'रिपोर्ट अपलोड एवं विश्लेषण' : 'Upload / Paste Report'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  Side Drawer
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'अपनी लैब रिपोर्ट सुरक्षित रूप से ऑन-डिवाइस लोड करें'
                  : 'Zero Cloud PHI Leakage · 100% On-Device Parsing'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Method Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
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
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{t('tabPaste')}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{language === 'hi' ? 'डेमो सैंपल्स' : 'Demo Samples'}</span>
            </button>
          </div>

          {/* TAB 1: File Upload (PDF / TXT / CSV) */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] ${
                  dragOver
                    ? 'border-teal-400 bg-teal-500/10'
                    : 'border-slate-800 hover:border-teal-500/50 bg-slate-950/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="h-12 w-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  {selectedFile ? selectedFile.name : t('uploadDropTitle')}
                </p>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  {selectedFile
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB · Ready for OCR & parsing`
                    : t('uploadDropSubtitle')}
                </p>
                {selectedFile && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>File Selected</span>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-slate-950/50 border border-slate-800/80 p-3 flex items-start gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {language === 'hi'
                    ? 'आपकी फ़ाइल कभी क्लाउड पर नहीं जाती। PDF पार्सिंग और टेक्स्ट निष्कर्षण पूरी तरह से आपके लोकल कंप्यूटर पर होता है।'
                    : 'Your diagnostic document is parsed strictly within your local machine. No PHI or biometric data leaves your device.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Raw Text Paste */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                {language === 'hi' ? 'लैब रिपोर्ट का टेक्स्ट यहाँ पेस्ट करें:' : 'Paste Raw Diagnostic Report Content:'}
              </label>
              <textarea
                rows={8}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={t('pastePlaceholder')}
                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/60 font-mono leading-relaxed resize-none"
              />
              <p className="text-[11px] text-slate-400">
                {language === 'hi'
                  ? 'सुझाव: आप किसी भी लैब रिपोर्ट का टेक्स्ट, जैसे CBC, LFT, KFT, या लिपिड प्रोफाइल सीधे कॉपी-पेस्ट कर सकते हैं।'
                  : 'Tip: You can copy-paste lab parameters, reference intervals, or impressions from any portal.'}
              </p>
            </div>
          )}

          {/* TAB 3: 1-Click Medical Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                {language === 'hi' ? 'त्वरित परीक्षण के लिए सैंपल चुनें:' : 'Select a Verified Clinical Sample:'}
              </label>

              <div className="space-y-2.5">
                {SAMPLE_PRESETS.map((p) => {
                  const isSelected = selectedPreset === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handlePresetSelect(p.text, p.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'bg-teal-500/15 border-teal-500/50 shadow-md shadow-teal-500/10'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {(p.name as Record<string, string>)[language] || p.name.en}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                          {(p.tag as Record<string, string>)[language] || p.tag.en}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400/90 font-medium">
                        ⚠️ {(p.badge as Record<string, string>)[language] || p.badge.en}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-800 bg-[#070c18] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">{t('quantizedModelReady')}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
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
        </div>
      </div>
    </div>
  );
};
