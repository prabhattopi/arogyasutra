export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta';

export interface TranslationDictionary {
  // Brand & Header
  brandTitle: string;
  brandSubtitle: string;
  hackathonBadge: string;
  airGappedStatus: string;
  airGappedSub: string;
  localOllama: string;

  // Hero Section
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroDescription: string;
  pillNoCloud: string;
  pillRangeGauges: string;
  pillDoctorPrep: string;
  pillGuardrails: string;

  // Uploader & Samples
  tabSamples: string;
  tabUpload: string;
  tabPaste: string;
  uploadTagline: string;
  sampleSubtitle: string;
  uploadDropTitle: string;
  uploadDropSubtitle: string;
  pastePlaceholder: string;
  btnAnalyze: string;
  btnAnalyzing: string;
  quantizedModelReady: string;

  // Biomarker Table
  biomarkersTitle: string;
  biomarkersSubtitle: string;
  normalCountBadge: string;
  outsideRangeBadge: string;
  filterAll: string;
  refInterval: string;
  healthyRange: string;
  statusNormal: string;
  statusLow: string;
  statusHigh: string;
  statusCritical: string;

  // Explanation Stream
  summaryTitle: string;
  summarySubtitle: string;
  streamingIndicator: string;
  btnCopy: string;
  btnCopied: string;
  btnPrint: string;
  subjectLabel: string;
  panelLabel: string;
  awaitingInputTitle: string;
  awaitingInputSubtitle: string;
  guardrailNote: string;

  // Doctor Consultation Card
  doctorTitle: string;
  doctorSubtitle: string;
  btnCopyQuestions: string;
  btnQuestionsCopied: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityGeneral: string;

  // Longitudinal Trends
  trendsTitle: string;
  trendsSubtitle: string;
  currentLevel: string;
  clinicalGoal: string;
  trajectoryLabel: string;
  baselineVisit: string;

  // Privacy Guarantee
  privacyTitle: string;
  privacySubtitle: string;
  cloudHazardTitle: string;
  cloudHazardPoint1: string;
  cloudHazardPoint2: string;
  cloudHazardPoint3: string;
  localShieldTitle: string;
  localShieldPoint1: string;
  localShieldPoint2: string;
  localShieldPoint3: string;

  // Modal
  modalTitle: string;
  modalSubtitle: string;
  ollamaEngine: string;
  activeModel: string;
  dbStorageMode: string;
  switchModelTitle: string;
  switchModelHint: string;

  // Navigation Tabs
  navOverview: string;
  navDemystify: string;
  navBiomarkers: string;
  navDoctor: string;
  navTrends: string;
  navPrivacy: string;

  // Landing View
  landingCta: string;
  landingCtaSub: string;
  landingPillarsTitle: string;
  landingPillarsSubtitle: string;
  landingCard1Title: string;
  landingCard1Desc: string;
  landingCard2Title: string;
  landingCard2Desc: string;
  landingCard3Title: string;
  landingCard3Desc: string;
  landingCard4Title: string;
  landingCard4Desc: string;
  landingWorkflowTitle: string;
  landingStep1Title: string;
  landingStep1Desc: string;
  landingStep2Title: string;
  landingStep2Desc: string;
  landingStep3Title: string;
  landingStep3Desc: string;

  // Demystify View Modes
  viewSplitBiomarkers: string;
  viewCenterChat: string;
  viewCenterChatDesc: string;

  // Mobile Experience
  mobileTipTitle: string;
  mobileTipMessage: string;
  mobileTipDismiss: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    brandTitle: 'ArogyaSutra',
    brandSubtitle: 'Air-Gapped Diagnostic Report Translation & Clinical Companion',
    hackathonBadge: 'Hack2Heal 2.0',
    airGappedStatus: '100% On-Device',
    airGappedSub: 'Air-Gapped:',
    localOllama: 'Local LLM',

    heroBadge: 'Hack2Heal 2.0 Global Healthcare Innovation',
    heroTitlePrefix: 'Demystify Diagnostic Reports with ',
    heroTitleHighlight: 'Empathetic, Air-Gapped AI',
    heroDescription:
      'Diagnostic blood panels should never cause anxiety or compromise patient privacy. ArogyaSutra translates complex medical terminology into clear, compassionate insights using a 100% on-premise local model with zero cloud data leakage.',
    pillNoCloud: 'Zero Cloud PHI Leakage',
    pillRangeGauges: 'Visual Range Gauges',
    pillDoctorPrep: 'Doctor Consultation Prep',
    pillGuardrails: 'Ethical Guardrails',

    tabSamples: '1-Click Test Samples',
    tabUpload: 'Upload PDF / File',
    tabPaste: 'Paste Report Text',
    uploadTagline: 'Offline Analysis · 0 Bytes Sent to Cloud',
    sampleSubtitle: 'Select a verified realistic clinical case below for instant demonstration:',
    uploadDropTitle: 'Click to browse or drop medical report file here',
    uploadDropSubtitle: 'Supports PDF diagnostic scans, TXT pathology reports, or raw lab outputs (Max 10MB)',
    pastePlaceholder: 'Paste raw laboratory report text or discharge summary here... (e.g. Hemoglobin 9.4 g/dL, Fasting Glucose 168 mg/dL)',
    btnAnalyze: 'Demystify Report Now',
    btnAnalyzing: 'Streaming Clinical Analysis...',
    quantizedModelReady: 'Local Quantized Model Ready',

    biomarkersTitle: 'Extracted Biomarker Analysis',
    biomarkersSubtitle: 'Visual relative positioning against clinical reference intervals',
    normalCountBadge: 'Normal',
    outsideRangeBadge: 'Outside Range',
    filterAll: 'ALL',
    refInterval: 'Ref Interval:',
    healthyRange: 'Healthy Range',
    statusNormal: 'Normal',
    statusLow: 'Low',
    statusHigh: 'High',
    statusCritical: 'Critical Alert',

    summaryTitle: 'Plain-Language Explanation',
    summarySubtitle: 'Generated via On-Premise Quantized LLM · Non-Diagnostic Framing',
    streamingIndicator: 'Streaming...',
    btnCopy: 'Copy',
    btnCopied: 'Copied',
    btnPrint: 'Print',
    subjectLabel: 'Subject:',
    panelLabel: 'Panel:',
    awaitingInputTitle: 'Awaiting diagnostic input',
    awaitingInputSubtitle: 'Select a sample above to witness the local LLM translate clinical metrics in real time.',
    guardrailNote: 'Clinical Guardrail: ArogyaSutra is strictly an educational tool to empower patient conversations. It does not provide medical diagnoses or prescribe medications. Always consult a licensed healthcare practitioner.',

    doctorTitle: 'Empowered Doctor Consultation Assistant',
    doctorSubtitle: 'Personalized, biomarker-grounded questions for your next physician appointment',
    btnCopyQuestions: 'Copy Questions',
    btnQuestionsCopied: 'Questions Copied',
    priorityHigh: 'High Priority',
    priorityMedium: 'Medium Priority',
    priorityGeneral: 'General',

    trendsTitle: 'Longitudinal Biomarker Progression',
    trendsSubtitle: 'Track multi-visit health trajectories to observe clinical progress over time',
    currentLevel: 'Current Level',
    clinicalGoal: 'Clinical Reference Goal',
    trajectoryLabel: 'Trajectory vs Previous Visit',
    baselineVisit: 'Baseline Visit',

    privacyTitle: 'Air-Gapped Privacy Architecture Guarantee',
    privacySubtitle: 'Engineered for strict zero Protected Health Information (PHI) cloud leakage',
    cloudHazardTitle: 'Commercial Cloud AI Pitfall',
    cloudHazardPoint1: '• Sensitive blood panels transmitted over external public internet APIs.',
    cloudHazardPoint2: '• Risk of model retraining, corporate logging, and identity linkage.',
    cloudHazardPoint3: '• Fails strict air-gapped hospital and defense compliance policies.',
    localShieldTitle: 'ArogyaSutra On-Premise Shield',
    localShieldPoint1: '• 100% token processing executed on local CPU/GPU via Ollama container.',
    localShieldPoint2: '• Operates completely offline without internet or external third-party keys.',
    localShieldPoint3: '• Patient identifiers and biomarker logs remain strictly inside your machine.',

    modalTitle: 'Local AI & Database Status',
    modalSubtitle: 'Real-time inspection of on-premise components',
    ollamaEngine: 'Local Ollama Engine',
    activeModel: 'Active Inference Model',
    dbStorageMode: 'Longitudinal Database',
    switchModelTitle: 'Switch or Upgrade Model via Bash Script:',
    switchModelHint: 'The intelligent run.sh script automatically pulls the model and safely spins up the project.',

    // Navigation Tabs
    navOverview: 'Overview & About',
    navDemystify: 'Demystify & Chat',
    navBiomarkers: 'Biomarkers & Vitals',
    navDoctor: 'Doctor Consultation',
    navTrends: 'Health Trends',
    navPrivacy: 'Air-Gapped Privacy',

    // Landing View
    landingCta: 'Start Demystifying Report',
    landingCtaSub: 'Select a 1-click clinical sample or upload diagnostic scan',
    landingPillarsTitle: 'Engineered for Clinical Peace of Mind',
    landingPillarsSubtitle: 'Addressing clinical jargon anxiety and privacy risks with local intelligence',
    landingCard1Title: '100% Air-Gapped Local Inference',
    landingCard1Desc: 'Zero bytes transmitted to third-party clouds. Sensitive diagnostic data is computed in memory on your device.',
    landingCard2Title: 'Visual Biomarker Gauges',
    landingCard2Desc: 'Relative visual positioning against clinical reference ranges so you never have to decipher raw numbers in isolation.',
    landingCard3Title: 'Empathetic Plain-Language Translation',
    landingCard3Desc: 'Translates complex pathology into patient-friendly explanations without alarmist hallucinations or medical panic.',
    landingCard4Title: 'Empowered Doctor Consultation Prep',
    landingCard4Desc: 'Generates intelligent, biomarker-grounded questions ready to print or take into your physician appointment.',
    landingWorkflowTitle: 'How ArogyaSutra Works Locally',
    landingStep1Title: '1. Ingestion & Extraction',
    landingStep1Desc: 'Local parser extracts patient markers, units, reference intervals, and clinical notes completely offline.',
    landingStep2Title: '2. Local Quantized Intelligence',
    landingStep2Desc: 'On-device quantized LLM synthesizes non-diagnostic explanations and consultation checklists with ethical guardrails.',
    landingStep3Title: '3. Longitudinal Care & Copilot',
    landingStep3Desc: 'Track biomarkers over time and converse with your interactive companion in English, Hindi, or Hinglish.',

    // Demystify View Modes
    viewSplitBiomarkers: 'Biomarkers & Clinical Summary',
    viewCenterChat: 'Centered AI Copilot (Wide)',
    viewCenterChatDesc: 'Spacious conversational workspace grounded in your active report',

    // Mobile Experience
    mobileTipTitle: 'Mobile Experience Notice',
    mobileTipMessage: 'For optimal side-by-side medical biomarker comparison and multi-gauge visualization, desktop is recommended. ArogyaSutra works fully on mobile!',
    mobileTipDismiss: 'Got it, Continue',
  },

  hi: {
    brandTitle: 'आरोग्यसूत्र',
    brandSubtitle: 'सुरक्षित एवं सरल मेडिकल रिपोर्ट साथी (ऑन-डिवाइस AI)',
    hackathonBadge: 'हैक2हील 2.0',
    airGappedStatus: '100% आपके डिवाइस पर',
    airGappedSub: 'पूर्णतः ऑफलाइन:',
    localOllama: 'लोकल AI मॉडल',

    heroBadge: 'हैक2हील 2.0 ग्लोबल हेल्थकेयर इनोवेशन प्रोजेक्ट',
    heroTitlePrefix: 'कठिन मेडिकल रिपोर्ट को समझें ',
    heroTitleHighlight: 'सरल, शांत और सुरक्षित AI के साथ',
    heroDescription:
      'लैब टेस्ट रिपोर्ट देखकर डरने की आवश्यकता नहीं है। आरोग्यसूत्र आपकी गोपनीय स्वास्थ्य रिपोर्ट को किसी भी क्लाउड पर भेजे बिना, आपके कंप्यूटर पर ही सुरक्षित रूप से सरल बोलचाल की भाषा में समझाता है।',
    pillNoCloud: 'शून्य क्लाउड डेटा लीकेज',
    pillRangeGauges: 'सरल विज़ुअल रेंज मीटर',
    pillDoctorPrep: 'डॉक्टर से परामर्श की तैयारी',
    pillGuardrails: 'सुरक्षित चिकित्सकीय नियम',

    tabSamples: '1-क्लिक टेस्ट नमूने',
    tabUpload: 'PDF / फ़ाइल अपलोड करें',
    tabPaste: 'रिपोर्ट का टेक्स्ट लिखें',
    uploadTagline: '100% ऑफलाइन विश्लेषण · क्लाउड पर कोई डेटा नहीं जाता',
    sampleSubtitle: 'वीडियो प्रदर्शन के लिए नीचे दिए गए वास्तविक टेस्ट नमूनों में से एक चुनें:',
    uploadDropTitle: 'मेडिकल रिपोर्ट फ़ाइल यहाँ चुनें या ड्रैग करें',
    uploadDropSubtitle: 'PDF लैब स्कैन या सामान्य टेक्स्ट रिपोर्ट स्वीकार्य हैं (अधिकतम 10MB)',
    pastePlaceholder: 'यहाँ अपनी लैब रिपोर्ट का टेक्स्ट पेस्ट करें... (उदा. हीमोग्लोबिन 9.4 g/dL, फास्टिंग ग्लूकोज 168 mg/dL)',
    btnAnalyze: 'रिपोर्ट का सरल विश्लेषण देखें',
    btnAnalyzing: 'विश्लेषण तैयार हो रहा है...',
    quantizedModelReady: 'लोकल AI मॉडल सक्रिय है',

    biomarkersTitle: 'बायोमार्कर्स का विस्तृत विश्लेषण',
    biomarkersSubtitle: 'स्वस्थ संदर्भ सीमा के सापेक्ष आपके टेस्ट मानों की स्थिति',
    normalCountBadge: 'सामान्य',
    outsideRangeBadge: 'सीमा से बाहर',
    filterAll: 'सभी',
    refInterval: 'सामान्य सीमा:',
    healthyRange: 'स्वस्थ सीमा',
    statusNormal: 'सामान्य',
    statusLow: 'कम (Low)',
    statusHigh: 'अधिक (High)',
    statusCritical: 'अति आवश्यक ध्यान',

    summaryTitle: 'सरल हिंदी में रिपोर्ट का अर्थ',
    summarySubtitle: 'लोकल ऑन-डिवाइस AI द्वारा निर्मित · सहानुभूतिपूर्ण व्याख्या',
    streamingIndicator: 'लिखा जा रहा है...',
    btnCopy: 'कॉपी करें',
    btnCopied: 'कॉपी हो गया',
    btnPrint: 'प्रिंट लें',
    subjectLabel: 'मरीज:',
    panelLabel: 'जांच प्रकार:',
    awaitingInputTitle: 'जांच रिपोर्ट की प्रतीक्षा',
    awaitingInputSubtitle: 'लोकल AI द्वारा वास्तविक समय में सरल व्याख्या देखने के लिए ऊपर से एक नमूना चुनें।',
    guardrailNote: 'महत्वपूर्ण सूचना: आरोग्यसूत्र एक शैक्षणिक मार्गदर्शक है जो डॉक्टर से बातचीत को आसान बनाता है। यह कोई अंतिम चिकित्सकीय निदान या दवा का नुस्खा नहीं देता। हमेशा अपने डॉक्टर से सलाह लें।',

    doctorTitle: 'डॉक्टर से परामर्श हेतु तैयार प्रश्न',
    doctorSubtitle: 'आपकी रिपोर्ट के आधार पर तैयार किए गए महत्वपूर्ण सवाल जो आपको अपने डॉक्टर से पूछने चाहिए',
    btnCopyQuestions: 'सभी सवाल कॉपी करें',
    btnQuestionsCopied: 'सवाल कॉपी हो गए',
    priorityHigh: 'अति महत्वपूर्ण सवाल',
    priorityMedium: 'मध्यम प्राथमिकता',
    priorityGeneral: 'सामान्य सलाह',

    trendsTitle: 'दीर्घकालिक स्वास्थ्य सुधार ट्रैकिंग',
    trendsSubtitle: 'विभिन्न तारीखों में अपने स्वास्थ्य पैरामीटर के सुधार का ग्राफ देखें',
    currentLevel: 'वर्तमान स्तर',
    clinicalGoal: 'लक्ष्य सामान्य मान',
    trajectoryLabel: 'पिछली जांच की तुलना में बदलाव',
    baselineVisit: 'प्रारंभिक जांच',

    privacyTitle: 'पूर्णतः ऑफलाइन गोपनीयता सुरक्षा गारंटी',
    privacySubtitle: 'आपकी निजी स्वास्थ्य जानकारी का एक भी अक्षर कंप्यूटर से बाहर नहीं जाता',
    cloudHazardTitle: 'कमर्शियल क्लाउड AI का जोखिम',
    cloudHazardPoint1: '• संवेदनशील स्वास्थ्य डेटा बाहरी इंटरनेट सर्वरों पर भेजा जाता है।',
    cloudHazardPoint2: '• डेटा चोरी, व्यावसायिक प्रोफाइलिंग और विज्ञापन कंपनियों द्वारा ट्रैकिंग का खतरा।',
    cloudHazardPoint3: '• सख्त अस्पताल एवं व्यक्तिगत डेटा गोपनीयता नियमों का उल्लंघन।',
    localShieldTitle: 'आरोग्यसूत्र ऑन-डिवाइस सुरक्षा ढाल',
    localShieldPoint1: '• पूरा AI विश्लेषण आपके ही कंप्यूटर के CPU/GPU पर Ollama द्वारा होता है।',
    localShieldPoint2: '• बिना इंटरनेट के भी 100% तेज गति से सुचारू रूप से कार्य करता है।',
    localShieldPoint3: '• मरीज का नाम और स्वास्थ्य रिकॉर्ड केवल आपके कंप्यूटर में सुरक्षित रहता है।',

    modalTitle: 'लोकल AI एवं डेटाबेस स्थिति',
    modalSubtitle: 'ऑन-डिवाइस घटकों की लाइव स्थिति की जांच',
    ollamaEngine: 'लोकल Ollama AI इंजन',
    activeModel: 'सक्रिय AI मॉडल',
    dbStorageMode: 'लोकल डेटाबेस (MongoDB)',
    switchModelTitle: 'स्क्रिप्ट द्वारा मॉडल बदलें या अपग्रेड करें:',
    switchModelHint: 'इंटेलिजेंट run.sh स्क्रिप्ट स्वतः नया मॉडल डाउनलोड कर प्रोजेक्ट को सुरक्षित चलाती है।',

    // Navigation Tabs
    navOverview: 'अवलोकन एवं परिचय',
    navDemystify: 'रिपोर्ट समझें एवं चैट',
    navBiomarkers: 'बायोमार्कर्स एवं विटल्स',
    navDoctor: 'डॉक्टर से परामर्श',
    navTrends: 'दीर्घकालिक सुधार',
    navPrivacy: 'ऑफलाइन गोपनीयता',

    // Landing View
    landingCta: 'रिपोर्ट समझना शुरू करें',
    landingCtaSub: '1-क्लिक टेस्ट नमूने चुनें या अपनी लैब रिपोर्ट अपलोड करें',
    landingPillarsTitle: 'रोगी की मानसिक शांति और गोपनीयता के लिए निर्मित',
    landingPillarsSubtitle: 'कठिन मेडिकल शब्दों की घबराहट और डेटा गोपनीयता के जोखिम का सम्पूर्ण समाधान',
    landingCard1Title: '100% ऑन-डिवाइस सुरक्षित AI',
    landingCard1Desc: 'कोई भी डेटा बाहरी सर्वर पर नहीं भेजा जाता। गोपनीय स्वास्थ्य रिपोर्ट पूरी तरह आपके कंप्यूटर में सुरक्षित रहती है।',
    landingCard2Title: 'विज़ुअल बायोमार्कर्स मीटर',
    landingCard2Desc: 'कठिन संख्याओं के बजाय स्वस्थ संदर्भ सीमा के सापेक्ष अपने बायोमार्कर्स को सरल विज़ुअल मीटर में देखें।',
    landingCard3Title: 'सहानुभूतिपूर्ण सरल व्याख्या',
    landingCard3Desc: 'कठिन मेडिकल शब्दों को बिना किसी घबराहट के सरल, शांत और सहज बोलचाल की भाषा में समझें।',
    landingCard4Title: 'डॉक्टर से परामर्श की तैयारी',
    landingCard4Desc: 'आपकी असामान्य जांचों के आधार पर डॉक्टर से पूछने योग्य सबसे जरूरी सवालों की सूची तैयार करता है।',
    landingWorkflowTitle: 'आरोग्यसूत्र कैसे काम करता है',
    landingStep1Title: '1. सुरक्षित इनपुट एवं निष्कर्षण',
    landingStep1Desc: 'लोकल पार्सर बिना इंटरनेट के आपके ब्लड टेस्ट और रिपोर्ट्स के आंकड़ों को तुरंत व्यवस्थित करता है।',
    landingStep2Title: '2. ऑन-डिवाइस स्थानीय AI',
    landingStep2Desc: 'आपके ही कंप्यूटर पर सक्रिय Ollama मॉडल बिना किसी क्लाउड लीकेज के सरल भाषा में रिपोर्ट समझाता है।',
    landingStep3Title: '3. निरंतर सुधार एवं AI साथी',
    landingStep3Desc: 'विभिन्न तारीखों के सुधार ट्रैक करें और हिंदी, English या Hinglish में कोई भी सवाल पूछें।',

    // Demystify View Modes
    viewSplitBiomarkers: 'बायोमार्कर्स एवं सारांश',
    viewCenterChat: 'विस्तृत AI चैट साथी (सेंटर)',
    viewCenterChatDesc: 'सक्रिय रिपोर्ट के आधार पर सवाल पूछने का सुविधाजनक विस्तृत केंद्र',

    // Mobile Experience
    mobileTipTitle: 'मोबाइल व्यू सूचना',
    mobileTipMessage: 'बायोमार्कर्स के बहु-स्तंभीय विज़ुअल तुलना के लिए डेस्कटॉप सबसे बेहतर है, हालांकि आरोग्यसूत्र मोबाइल पर भी पूरी तरह से सक्षम है!',
    mobileTipDismiss: 'समझ गया, आगे बढ़ें',
  },

  // Easily extendable for any future language like Bengali or Tamil:
  bn: {} as any,
  ta: {} as any,
};
