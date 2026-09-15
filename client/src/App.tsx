import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { LandingOverview } from './components/LandingOverview';
import { CenteredChat, ChatMessage } from './components/CenteredChat';
import { MobileTipModal } from './components/MobileTipModal';
import { ReportUploader, SAMPLE_PRESETS } from './components/ReportUploader';
import { BiomarkerTable } from './components/BiomarkerTable';
import { AnalysisStream } from './components/AnalysisStream';
import { DoctorQuestions } from './components/DoctorQuestions';
import { TrendsChart } from './components/TrendsChart';
import { PrivacyBadge } from './components/PrivacyBadge';
import { ModelStatusModal } from './components/ModelStatusModal';
import {
  LayoutGrid,
  MessageSquare,
  Sparkles,
  Activity,
  Stethoscope,
  TrendingUp,
  FileText,
  UploadCloud,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { getTranslation } from './i18n/useI18n';

import {
  Biomarker,
  DoctorQuestion,
  PatientMetadata,
  SystemHealth,
  TrendPoint,
} from './types/report';
import {
  fetchHealth,
  fetchBiomarkerTrends,
  streamAnalyzeReport,
} from './services/api';
import { LanguageCode } from './i18n/translations';

// Initial pre-loaded sample state for instant visual preview
const INITIAL_BIOMARKERS: Biomarker[] = [
  {
    name: 'Hemoglobin (Hb)',
    category: 'Hematology',
    value: 9.4,
    unit: 'g/dL',
    referenceMin: 13.0,
    referenceMax: 17.0,
    referenceText: '13.0 - 17.0 g/dL',
    status: 'LOW',
    plainExplanation: 'Iron-rich protein in red blood cells that carries vital oxygen from your lungs to the rest of your body.',
  },
  {
    name: 'Total Leukocytes (WBC)',
    category: 'Hematology',
    value: 13800,
    unit: '/cu.mm',
    referenceMin: 4000,
    referenceMax: 11000,
    referenceText: '4,000 - 11,000 /cu.mm',
    status: 'HIGH',
    plainExplanation: 'Immune response soldiers that defend your body against bacterial, viral, and inflammatory infections.',
  },
  {
    name: 'Red Blood Cells (RBC)',
    category: 'Hematology',
    value: 3.35,
    unit: 'mill/cu.mm',
    referenceMin: 4.5,
    referenceMax: 5.9,
    referenceText: '4.50 - 5.90 mill/cu.mm',
    status: 'LOW',
    plainExplanation: 'Cells responsible for transporting oxygen throughout tissues and returning carbon dioxide to the lungs.',
  },
  {
    name: 'Packed Cell Volume (PCV/HCT)',
    category: 'Hematology',
    value: 29.8,
    unit: '%',
    referenceMin: 40.0,
    referenceMax: 50.0,
    referenceText: '40.0 - 50.0 %',
    status: 'LOW',
    plainExplanation: 'The percentage of your total blood volume that consists of red blood cells.',
  },
  {
    name: 'Platelet Count (PLT)',
    category: 'Hematology',
    value: 265000,
    unit: '/cu.mm',
    referenceMin: 150000,
    referenceMax: 450000,
    referenceText: '150,000 - 450,000 /cu.mm',
    status: 'NORMAL',
    plainExplanation: 'Tiny blood disc fragments that form clots to prevent and stop bleeding when vessels are injured.',
  },
  {
    name: 'Mean Corpuscular Hb (MCH)',
    category: 'Hematology',
    value: 21.4,
    unit: 'pg',
    referenceMin: 27.0,
    referenceMax: 32.0,
    referenceText: '27.0 - 32.0 pg',
    status: 'LOW',
    plainExplanation: 'Average amount of oxygen-carrying hemoglobin inside each red blood cell.',
  },
  {
    name: 'MCH Concentration (MCHC)',
    category: 'Hematology',
    value: 31.5,
    unit: 'g/dL',
    referenceMin: 32.0,
    referenceMax: 36.0,
    referenceText: '32.0 - 36.0 g/dL',
    status: 'LOW',
    plainExplanation: 'Average concentration of hemoglobin in a given volume of packed red blood cells.',
  },
  {
    name: 'Red Cell Distribution Width (RDW)',
    category: 'Hematology',
    value: 16.8,
    unit: '%',
    referenceMin: 11.5,
    referenceMax: 14.5,
    referenceText: '11.5 - 14.5 %',
    status: 'HIGH',
    plainExplanation: 'Variation in red blood cell volume and size; higher values suggest mixed cell populations like in iron deficiency.',
  },
  {
    name: 'Neutrophils',
    category: 'Hematology',
    value: 78,
    unit: '%',
    referenceMin: 40,
    referenceMax: 75,
    referenceText: '40 - 75 %',
    status: 'HIGH',
    plainExplanation: 'First responder white blood cells that fight active acute bacterial infections.',
  },
  {
    name: 'Lymphocytes',
    category: 'Hematology',
    value: 16,
    unit: '%',
    referenceMin: 20,
    referenceMax: 45,
    referenceText: '20 - 45 %',
    status: 'LOW',
    plainExplanation: 'White blood cells responsible for viral immunity and targeted antibody production.',
  },
];

const INITIAL_SUMMARY_EN = `### 1. Overview & Gentle Reassurance
This Complete Blood Count provides an essential evaluation of your circulating blood cells and immune defense. Out of 10 parameters analyzed, your Platelet count and cellular volumes are functioning reliably. Several markers show variance: lower red cell counts and elevated white cell numbers.

### 2. Key Findings Explained in Everyday Language
- **Hemoglobin (9.4 g/dL) [LOW]:** Hemoglobin acts like an oxygen delivery vehicle. When it dips below typical ranges, less oxygen reaches muscles and tissues, which commonly explains why individuals might feel tired or easily fatigued during routine activities.
- **Total Leukocyte / WBC (13,800 /cu.mm) [HIGH]:** White blood cells are your body's immune defense team. A high count generally indicates that your immune system is actively working to clear a standard bacterial infection or recent inflammatory trigger.
- **Platelets (265,000 /cu.mm) [NORMAL]:** Your clotting cells are in a healthy, optimal range, confirming your body can properly manage minor cuts or bleeding.

### 3. Next Steps & Empowered Physician Partnership
- **Discuss Energy Levels:** Share with your doctor if you've experienced lethargy, dizziness, or unusual tiredness recently.
- **Check Nutritional Factors:** Ask whether an iron panel or dietary assessment is indicated to support your red blood cell recovery.
- **Follow-Up Timeline:** Inquire about re-checking your WBC count in a few weeks once any underlying infection has resolved.`;

const INITIAL_SUMMARY_HI = `### 1. रिपोर्ट का सारांश एवं आश्वस्ति (Overview & Reassurance)
आपकी यह कम्पलीट ब्लड काउंट जांच आपके शरीर की रक्त कोशिकाओं और प्रतिरक्षा तंत्र की स्थिति को दर्शाती है। कुल 10 मुख्य बायोमार्कर्स में से आपकी प्लेटलेट संख्या पूरी तरह से सामान्य है, जो कि स्वस्थ रक्त के थक्के जमने की क्षमता को सुनिश्चित करती है। दो मुख्य बिंदुओं पर ध्यान देने की आवश्यकता है: हीमोग्लोबिन की कमी और श्वेत रक्त कोशिकाओं (WBC) में वृद्धि।

### 2. महत्वपूर्ण निष्कर्ष सरल बोलचाल में (Key Findings)
- **हीमोग्लोबिन (9.4 g/dL) [कम]:** हीमोग्लोबिन शरीर में ऑक्सीजन पहुंचाने वाली गाड़ी की तरह है। इसका मान कम होने पर मांसपेशियों और अंगों तक कम ऑक्सीजन पहुँचती है, जिससे थकान या कमजोरी महसूस होना स्वाभाविक है।
- **श्वेत रक्त कोशिकाएं / WBC (13,800 /cu.mm) [अधिक]:** ये आपके शरीर की सुरक्षा सैनिक हैं। इनकी संख्या अधिक होना यह दर्शाता है कि शरीर का इम्यून सिस्टम किसी सामान्य संक्रमण या सूजन से सक्रिय रूप से मुकाबला कर रहा है।
- **प्लेटलेट्स (265,000 /cu.mm) [सामान्य]:** आपके थक्का जमाने वाले सेल्स बिलकुल सही और सुरक्षित स्तर पर हैं।

### 3. डॉक्टर से परामर्श के लिए तैयारी (Next Steps)
- यदि आपको हाल ही में अधिक थकान, चक्कर या कमजोरी महसूस हुई है तो अपने डॉक्टर को अवश्य बताएं।
- डॉक्टर से पूछें कि क्या आपको आयरन युक्त आहार या पोषण संबंधी सप्लीमेंट्स की आवश्यकता है।
- संक्रमण ठीक होने के बाद पुनः टेस्ट कब कराना चाहिए, इस पर डॉक्टर का परामर्श लें।`;

const INITIAL_QUESTIONS_EN: DoctorQuestion[] = [
  {
    question: 'Could my fatigue or low energy levels be related to my reduced hemoglobin count, and should we investigate iron or dietary factors?',
    context: 'Suggested based on your lower-than-normal Hemoglobin and Red Blood Cell levels.',
    priority: 'high',
  },
  {
    question: 'My white blood cell count is elevated. Does this indicate an active or recent infection, and should we run a follow-up test after a few weeks?',
    context: 'Suggested because your Total Leukocyte (WBC) count is above the normal reference range.',
    priority: 'high',
  },
  {
    question: 'When would you like me to schedule a repeat test to monitor whether these biomarkers have stabilized?',
    context: 'Ensures a proactive timeline for long-term health tracking.',
    priority: 'general',
  },
];

const INITIAL_QUESTIONS_HI: DoctorQuestion[] = [
  {
    question: 'क्या मेरी कमजोरी और थकान हीमोग्लोबिन के कम स्तर के कारण है, और क्या मुझे आयरन सप्लीमेंट या आहार में बदलाव करना चाहिए?',
    context: 'यह सवाल आपके हीमोग्लोबिन और RBC के कम मान के आधार पर तैयार किया गया है।',
    priority: 'high',
  },
  {
    question: 'मेरी WBC (श्वेत रक्त कोशिकाएं) सामान्य से अधिक हैं। क्या यह किसी हालिया संक्रमण का संकेत है, और क्या कुछ हफ़्तों बाद दोबारा जांच करानी चाहिए?',
    context: 'यह सुझाव आपके ल्यूकोसाइट काउंट के उच्च स्तर को देखकर दिया गया है।',
    priority: 'high',
  },
  {
    question: 'इन बायोमार्कर्स के पुनः सामान्य होने की पुष्टि के लिए मुझे अगली जांच कब करानी चाहिए?',
    context: 'यह सवाल दीर्घकालिक स्वास्थ्य निगरानी की योजना बनाने में मदद करता है।',
    priority: 'general',
  },
];

export const App: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  // Navigation and Layout State
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  type DemystifyTab = 'chat' | 'biomarkers' | 'doctor' | 'trends' | 'split';
  const [demystifyTab, setDemystifyTab] = useState<DemystifyTab>('chat');

  // Slide-Over Drawer State
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);

  // Active Report State
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(INITIAL_BIOMARKERS);
  const [summary, setSummary] = useState<string>(INITIAL_SUMMARY_EN);
  const [doctorQuestions, setDoctorQuestions] = useState<DoctorQuestion[]>(INITIAL_QUESTIONS_EN);
  const [patientMetadata, setPatientMetadata] = useState<PatientMetadata>({
    patientName: 'Rajesh Kumar Verma',
    patientAge: '46 Yrs',
    patientSex: 'Male',
    reportType: 'Complete Blood Count (CBC)',
  });

  // Longitudinal Trends
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Report Analysis State
  const [hasAnalyzedReport, setHasAnalyzedReport] = useState(true);
  const [reportId, setReportId] = useState<string>('initial');

  // Lifted Chat Session State (Persisted across tab changes & language switches)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-init',
      sender: 'assistant',
      text:
        language === 'hi'
          ? `नमस्ते! मैंने आपकी **Complete Blood Count (CBC)** का विश्लेषण पूरा कर लिया है। आप रिपोर्ट के किसी भी बायोमार्कर, आहार, या डॉक्टर परामर्श के बारे में हिंदी, English या Hinglish में सवाल पूछ सकते हैं।`
          : `Hello! I have reviewed your **Complete Blood Count (CBC)** for Rajesh Kumar Verma. Feel free to ask any questions regarding your biomarkers, dietary recommendations, warning signs, or doctor consultation in English, Hindi, or Hinglish.`,
      timestamp: 'Just now',
    },
  ]);
  const [chatSuggestions, setChatSuggestions] = useState<string[]>([
    'What natural foods help restore healthy hemoglobin levels?',
    'Does this elevated white blood cell count indicate active infection?',
    'What key questions should I prioritize with my doctor?',
    'When should I schedule a follow-up CBC test?',
  ]);

  const t = (key: any) => getTranslation(language, key);
  const abnormalCount = biomarkers.filter((b) => b.status !== 'NORMAL').length;

  // Switch initial texts when language changes if on initial report without wiping active chat
  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    if (summary === INITIAL_SUMMARY_EN || summary === INITIAL_SUMMARY_HI) {
      setSummary(newLang === 'hi' ? INITIAL_SUMMARY_HI : INITIAL_SUMMARY_EN);
      setDoctorQuestions(newLang === 'hi' ? INITIAL_QUESTIONS_HI : INITIAL_QUESTIONS_EN);
    }
  };

  // Load initial healthcheck and trends
  useEffect(() => {
    fetchHealth()
      .then((data) => setHealth(data))
      .catch((err) => console.warn('Backend health check skipped', err));

    fetchBiomarkerTrends()
      .then((data) => setTrends(data.trends))
      .catch((err) => console.warn('Trends load skipped', err));
  }, []);

  const handleAnalyze = async (payload: { text?: string; file?: File }) => {
    setIsLoading(true);
    setSummary('');
    setActiveTab('demystify');
    setDemystifyTab('split'); // live streaming visible directly in split view
    setIsUploadDrawerOpen(false); // close the slide-over drawer

    // Update reportId and reset chat for this fresh report upload
    const newReportId = 'rep-' + Date.now();
    setReportId(newReportId);
    setHasAnalyzedReport(true);

    const reportLabel = payload.file
      ? payload.file.name
      : 'Diagnostic Report';

    // Fresh chat session for newly uploaded report
    setChatMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'assistant',
        text:
          language === 'hi'
            ? `नमस्ते! मैंने आपकी नई रिपोर्ट **${reportLabel}** का विश्लेषण पूरा कर लिया है। आप रिपोर्ट के किसी भी बायोमार्कर, आहार, या डॉक्टर परामर्श के बारे में हिंदी, English या Hinglish में सवाल पूछ सकते हैं।`
            : `Hello! I have loaded and analyzed your **${reportLabel}**. Feel free to ask any questions regarding your biomarkers, diet, or physician recommendations.`,
        timestamp: 'Just now',
      },
    ]);
    setChatSuggestions([]);

    await streamAnalyzeReport(
      { ...payload, language },
      {
        onInit: (data) => {
          setBiomarkers(data.biomarkers);
          setDoctorQuestions(data.doctorQuestions);
          if (data.metadata) setPatientMetadata(data.metadata);
        },
        onToken: (token) => {
          setSummary((prev) => prev + token);
        },
        onComplete: () => {
          setIsLoading(false);
          fetchBiomarkerTrends().then((res) => setTrends(res.trends)).catch(() => {});
        },
        onError: (err) => {
          console.error(err);
          setIsLoading(false);
          setSummary((prev) => prev + `\n\n*(Analysis complete: ${err})*`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-row selection:bg-teal-500 selection:text-slate-950">
      {/* Sidebar (Desktop Sticky + Mobile Slide-Over Drawer) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        health={health}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenModelModal={() => setIsModelModalOpen(true)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          health={health}
          language={language}
          onLanguageChange={handleLanguageChange}
          onOpenModelModal={() => setIsModelModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Dynamic View Workspace */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          {/* TAB 1: OVERVIEW / ABOUT LANDING */}
          {activeTab === 'overview' && (
            <LandingOverview
              language={language}
              onStart={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB 2: UNIFIED DEMYSTIFY WORKSPACE */}
          {activeTab === 'demystify' && (
            <div className="space-y-6">
              {/* Slide-Over Side Drawer for Report Ingestion */}
              <ReportUploader
                isOpen={isUploadDrawerOpen}
                onClose={() => setIsUploadDrawerOpen(false)}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                language={language}
              />

              {/* Active Report Header & Context Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900/70 to-slate-900/50 border border-teal-500/30 shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm flex-shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-extrabold text-white">
                        {patientMetadata.reportType || 'Clinical Diagnostic Report'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        {hasAnalyzedReport ? 'Demystified' : 'Loaded Panel'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1">
                      <span>
                        Subject: <strong className="text-slate-100">{patientMetadata.patientName}</strong> ({patientMetadata.patientAge}, {patientMetadata.patientSex})
                      </span>
                      <span>•</span>
                      <span className="text-teal-400 font-medium">{biomarkers.length} Markers Extracted</span>
                    </p>
                  </div>
                </div>

                {/* Right controls: Informative Yellow Alert + Drawer Trigger + Quick Demo */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Informative Interactive Yellow Alert */}
                  {abnormalCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => setDemystifyTab('biomarkers')}
                      className="group px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 flex items-center gap-2 shadow-sm transition cursor-pointer"
                      title={
                        language === 'hi'
                          ? `आपकी रिपोर्ट में ${abnormalCount} बायोमार्कर्स सामान्य सीमा से बाहर हैं। विस्तृत तालिका देखने के लिए क्लिक करें।`
                          : `${abnormalCount} biomarkers are outside healthy medical reference range. Click to inspect biomarker table.`
                      }
                    >
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                      <span>
                        {language === 'hi'
                          ? `⚠️ ${abnormalCount} बायोमार्कर्स सामान्य सीमा से बाहर`
                          : `⚠️ ${abnormalCount} Alerts Outside Range`}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-amber-400 group-hover:translate-x-0.5 transition hidden sm:inline" />
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>All Markers Optimal</span>
                    </span>
                  )}

                  {/* Side Drawer Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsUploadDrawerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-500/20 cursor-pointer transition"
                    title="Open side drawer to upload PDF/TXT or paste text"
                  >
                    <UploadCloud className="h-4 w-4 text-slate-950" />
                    <span>{language === 'hi' ? 'रिपोर्ट अपलोड / बदलें' : 'Upload / Change Report'}</span>
                  </button>

                  {/* Quick Demo Case */}
                  <button
                    type="button"
                    onClick={() => handleAnalyze({ text: SAMPLE_PRESETS[0].text })}
                    className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-teal-500/30 text-teal-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition hidden md:flex"
                    title="Instantly run CBC demo sample"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                    <span>{language === 'hi' ? 'डेमो CBC' : 'Demo CBC'}</span>
                  </button>
                </div>
              </div>

              {/* Integrated Report Navigation Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090e1a] border border-slate-800 overflow-x-auto scrollbar-none">
                {/* Tab 1: Centered Copilot Chat */}
                <button
                  type="button"
                  onClick={() => setDemystifyTab('chat')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    demystifyTab === 'chat'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 text-teal-400" />
                  <span>AI Copilot Chat</span>
                </button>

                {/* Tab 2: Biomarkers Table & Visual Gauges */}
                <button
                  type="button"
                  onClick={() => setDemystifyTab('biomarkers')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    demystifyTab === 'biomarkers'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="h-4 w-4 text-teal-400" />
                  <span>Biomarkers & Vitals ({biomarkers.length})</span>
                </button>

                {/* Tab 3: Doctor Consultation Checklist */}
                <button
                  type="button"
                  onClick={() => setDemystifyTab('doctor')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    demystifyTab === 'doctor'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Stethoscope className="h-4 w-4 text-teal-400" />
                  <span>Doctor Checklist ({doctorQuestions.length})</span>
                </button>

                {/* Tab 4: Health Trends */}
                <button
                  type="button"
                  onClick={() => setDemystifyTab('trends')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    demystifyTab === 'trends'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 text-teal-400" />
                  <span>Health Trends</span>
                </button>

                {/* Tab 5: Split View (Biomarkers + Summary) */}
                <button
                  type="button"
                  onClick={() => setDemystifyTab('split')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    demystifyTab === 'split'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4 text-teal-400" />
                  <span>Split View</span>
                </button>
              </div>

              {/* TAB CONTENT 1: Centered Spacious AI Copilot Chat (Session Preserved Across Tabs) */}
              {demystifyTab === 'chat' && (
                <div className="animate-in fade-in duration-200">
                  <CenteredChat
                    biomarkers={biomarkers}
                    patientName={patientMetadata.patientName}
                    reportType={patientMetadata.reportType}
                    language={language}
                    hasAnalyzedReport={hasAnalyzedReport}
                    reportId={reportId}
                    messages={chatMessages}
                    setMessages={setChatMessages}
                    suggestions={chatSuggestions}
                    setSuggestions={setChatSuggestions}
                  />
                </div>
              )}

              {/* TAB CONTENT 2: Biomarkers Table & Gauges */}
              {demystifyTab === 'biomarkers' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <BiomarkerTable biomarkers={biomarkers} language={language} />
                </div>
              )}

              {/* TAB CONTENT 3: Doctor Consultation Prep */}
              {demystifyTab === 'doctor' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <DoctorQuestions questions={doctorQuestions} language={language} />
                </div>
              )}

              {/* TAB CONTENT 4: Longitudinal Health Trends */}
              {demystifyTab === 'trends' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <TrendsChart trends={trends} language={language} />
                </div>
              )}

              {/* TAB CONTENT 5: Split Overview (Gauges + Sticky Summary Without Empty Void) */}
              {demystifyTab === 'split' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
                  <div className="lg:col-span-7 space-y-6">
                    <BiomarkerTable biomarkers={biomarkers} language={language} />
                  </div>
                  <div className="lg:col-span-5 sticky top-20 self-start">
                    <AnalysisStream
                      summary={summary}
                      isStreaming={isLoading}
                      reportType={patientMetadata.reportType}
                      patientName={patientMetadata.patientName}
                      language={language}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AIR-GAPPED PRIVACY ARCHITECTURE */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <PrivacyBadge language={language} />
            </div>
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-[#060913]/90 py-6 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © 2026 <strong className="text-slate-300">ArogyaSutra</strong> — Built for{' '}
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent font-bold">
                Hack2Heal 2.0 Global Healthcare Innovation Hackathon
              </span>
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Air-Gapped Local Inference</span>
              <span>•</span>
              <span>Local MongoDB</span>
              <span>•</span>
              <a
                href="https://github.com/prabhattopi/arogyasutra"
                target="_blank"
                rel="noreferrer"
                className="text-teal-400 hover:text-teal-300 hover:underline transition font-medium"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Experience Recommendation Modal */}
      <MobileTipModal language={language} />

      {/* Model & System Status Modal */}
      <ModelStatusModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        health={health}
        language={language}
      />
    </div>
  );
};
