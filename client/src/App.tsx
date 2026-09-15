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
  ShieldCheck,
  Zap,
  HeartPulse,
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

// ==============================================================================
// VERIFIED CLINICAL SAMPLES FOR 1-CLICK INSTANT DEMYSTIFICATION
// ==============================================================================

interface ClinicalPreset {
  id: 'cbc' | 'metabolic' | 'lipid';
  metadata: PatientMetadata;
  badge: { en: string; hi: string };
  tag: { en: string; hi: string };
  biomarkers: Biomarker[];
  summaryEn: string;
  summaryHi: string;
  questionsEn: DoctorQuestion[];
  questionsHi: DoctorQuestion[];
  suggestionsEn: string[];
  suggestionsHi: string[];
}

const PRESET_CBC: ClinicalPreset = {
  id: 'cbc',
  metadata: {
    patientName: 'Rajesh Kumar Verma',
    patientAge: '46 Yrs',
    patientSex: 'Male',
    reportType: 'Complete Blood Count (CBC)',
  },
  badge: { en: 'Anemia & Immune Alert', hi: 'एनीमिया एवं संक्रमण चेतावनी' },
  tag: { en: 'Hematology', hi: 'रक्त विज्ञान' },
  biomarkers: [
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
  ],
  summaryEn: `### 1. Overview & Gentle Reassurance
This Complete Blood Count provides an essential evaluation of your circulating blood cells and immune defense. Out of 10 parameters analyzed, your Platelet count and cellular volumes are functioning reliably. Several markers show variance: lower red cell counts and elevated white cell numbers.

### 2. Key Findings Explained in Everyday Language
- **Hemoglobin (9.4 g/dL) [LOW]:** Hemoglobin acts like an oxygen delivery vehicle. When it dips below typical ranges, less oxygen reaches muscles and tissues, which commonly explains why individuals might feel tired or easily fatigued during routine activities.
- **Total Leukocyte / WBC (13,800 /cu.mm) [HIGH]:** White blood cells are your body's immune defense team. A high count generally indicates that your immune system is actively working to clear a standard bacterial infection or recent inflammatory trigger.
- **Platelets (265,000 /cu.mm) [NORMAL]:** Your clotting cells are in a healthy, optimal range, confirming your body can properly manage minor cuts or bleeding.

### 3. Next Steps & Empowered Physician Partnership
- **Discuss Energy Levels:** Share with your doctor if you've experienced lethargy, dizziness, or unusual tiredness recently.
- **Check Nutritional Factors:** Ask whether an iron panel or dietary assessment is indicated to support your red blood cell recovery.
- **Follow-Up Timeline:** Inquire about re-checking your WBC count in a few weeks once any underlying infection has resolved.`,
  summaryHi: `### 1. रिपोर्ट का सारांश एवं आश्वस्ति (Overview & Reassurance)
आपकी यह कम्पलीट ब्लड काउंट जांच आपके शरीर की रक्त कोशिकाओं और प्रतिरक्षा तंत्र की स्थिति को दर्शाती है। कुल 10 मुख्य बायोमार्कर्स में से आपकी प्लेटलेट संख्या पूरी तरह से सामान्य है, जो कि स्वस्थ रक्त के थक्के जमने की क्षमता को सुनिश्चित करती है। दो मुख्य बिंदुओं पर ध्यान देने की आवश्यकता है: हीमोग्लोबिन की कमी और श्वेत रक्त कोशिकाओं (WBC) में वृद्धि।

### 2. महत्वपूर्ण निष्कर्ष सरल बोलचाल में (Key Findings)
- **हीमोग्लोबिन (9.4 g/dL) [कम]:** हीमोग्लोबिन शरीर में ऑक्सीजन पहुंचाने वाली गाड़ी की तरह है। इसका मान कम होने पर मांसपेशियों और अंगों तक कम ऑक्सीजन पहुँचती है, जिससे थकान या कमजोरी महसूस होना स्वाभाविक है।
- **श्वेत रक्त कोशिकाएं / WBC (13,800 /cu.mm) [अधिक]:** ये आपके शरीर की सुरक्षा सैनिक हैं। इनकी संख्या अधिक होना यह दर्शाता है कि शरीर का इम्यून सिस्टम किसी सामान्य संक्रमण या सूजन से सक्रिय रूप से मुकाबला कर रहा है।
- **प्लेटलेट्स (265,000 /cu.mm) [सामान्य]:** आपके थक्का जमाने वाले सेल्स बिलकुल सही और सुरक्षित स्तर पर हैं।

### 3. डॉक्टर से परामर्श के लिए तैयारी (Next Steps)
- यदि आपको हाल ही में अधिक थकान, चक्कर या कमजोरी महसूस हुई है तो अपने डॉक्टर को अवश्य बताएं।
- डॉक्टर से पूछें कि क्या आपको आयरन युक्त आहार या पोषण संबंधी सप्लीमेंट्स की आवश्यकता है।
- संक्रमण ठीक होने के बाद पुनः टेस्ट कब कराना चाहिए, इस पर डॉक्टर का परामर्श लें।`,
  questionsEn: [
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
  ],
  questionsHi: [
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
  ],
  suggestionsEn: [
    'What natural foods help restore healthy hemoglobin levels?',
    'Does this elevated white blood cell count indicate active infection?',
    'What key questions should I prioritize with my doctor?',
    'When should I schedule a follow-up CBC test?',
  ],
  suggestionsHi: [
    'हीमोग्लोबिन सुधारने के लिए क्या खाना चाहिए?',
    'क्या WBC की यह वृद्धि चिंताजनक है?',
    'डॉक्टर से परामर्श के लिए सबसे महत्वपूर्ण सवाल क्या हैं?',
    'जांच दोबारा कब करानी चाहिए?',
  ],
};

const PRESET_METABOLIC: ClinicalPreset = {
  id: 'metabolic',
  metadata: {
    patientName: 'Ananya S. Sharma',
    patientAge: '52 Yrs',
    patientSex: 'Female',
    reportType: 'Comprehensive Metabolic & Renal Panel',
  },
  badge: { en: 'Diabetes & Renal Stress', hi: 'डायबिटीज एवं किडनी स्वास्थ्य' },
  tag: { en: 'Glycemic / Kidney', hi: 'ग्लूकोज / रीनल' },
  biomarkers: [
    {
      name: 'Fasting Blood Glucose (FBS)',
      category: 'Metabolic',
      value: 168,
      unit: 'mg/dL',
      referenceMin: 70,
      referenceMax: 99,
      referenceText: '70 - 99 mg/dL',
      status: 'HIGH',
      plainExplanation: 'Primary circulating sugar providing energy; elevated levels signify insulin resistance or diabetes.',
    },
    {
      name: 'HbA1c (Glycated Hemoglobin)',
      category: 'Metabolic',
      value: 8.2,
      unit: '%',
      referenceMin: 4.0,
      referenceMax: 5.6,
      referenceText: '4.0 - 5.6 %',
      status: 'HIGH',
      plainExplanation: 'Three-month average blood glucose control attached to red blood cells.',
    },
    {
      name: 'Blood Urea Nitrogen (BUN)',
      category: 'Renal',
      value: 26.4,
      unit: 'mg/dL',
      referenceMin: 7.0,
      referenceMax: 20.0,
      referenceText: '7.0 - 20.0 mg/dL',
      status: 'HIGH',
      plainExplanation: 'Waste product cleared by healthy kidneys during daily dietary protein breakdown.',
    },
    {
      name: 'Serum Creatinine',
      category: 'Renal',
      value: 1.45,
      unit: 'mg/dL',
      referenceMin: 0.55,
      referenceMax: 1.02,
      referenceText: '0.55 - 1.02 mg/dL',
      status: 'HIGH',
      plainExplanation: 'Essential marker of renal filtration efficiency; higher levels indicate kidney workload.',
    },
    {
      name: 'eGFR (CKD-EPI Formula)',
      category: 'Renal',
      value: 54,
      unit: 'mL/min',
      referenceMin: 90,
      referenceMax: 120,
      referenceText: '90 - 120 mL/min',
      status: 'LOW',
      plainExplanation: 'Estimated glomerular filtration rate measuring total filtering speed of kidneys.',
    },
    {
      name: 'SGPT / ALT',
      category: 'Hepatic',
      value: 52,
      unit: 'U/L',
      referenceMin: 10,
      referenceMax: 45,
      referenceText: '10 - 45 U/L',
      status: 'HIGH',
      plainExplanation: 'Liver enzyme released when hepatic cells experience metabolic stress.',
    },
    {
      name: 'SGOT / AST',
      category: 'Hepatic',
      value: 44,
      unit: 'U/L',
      referenceMin: 10,
      referenceMax: 40,
      referenceText: '10 - 40 U/L',
      status: 'HIGH',
      plainExplanation: 'Enzyme found in liver and muscle tissue.',
    },
    {
      name: 'Serum Calcium',
      category: 'Metabolic',
      value: 9.1,
      unit: 'mg/dL',
      referenceMin: 8.5,
      referenceMax: 10.5,
      referenceText: '8.5 - 10.5 mg/dL',
      status: 'NORMAL',
      plainExplanation: 'Critical mineral maintaining bone density, cardiac pacing, and nerve conduction.',
    },
    {
      name: 'Serum Potassium',
      category: 'Electrolytes',
      value: 4.4,
      unit: 'mmol/L',
      referenceMin: 3.5,
      referenceMax: 5.1,
      referenceText: '3.5 - 5.1 mmol/L',
      status: 'NORMAL',
      plainExplanation: 'Electrolyte regulating intracellular fluid balance and muscle contractions.',
    },
  ],
  summaryEn: `### 1. Overview & Gentle Reassurance
This Comprehensive Metabolic & Renal Panel evaluates your blood sugar regulation and vital organ filtration. Electrolytes like Potassium and Calcium remain balanced, supporting steady heart and nerve health. Two primary areas show stress: elevated glycemic metrics and reduced kidney filtration.

### 2. Key Findings Explained in Everyday Language
- **Fasting Glucose (168 mg/dL) & HbA1c (8.2%) [HIGH]:** Your average blood sugar over the last three months is higher than standard targets, indicating that your body requires therapeutic or lifestyle assistance to clear glucose from the bloodstream.
- **Creatinine (1.45 mg/dL) & eGFR (54 mL/min) [ALERT]:** The kidneys act like fine biological filters. A reduced filtration rate of 54 mL/min means your kidneys are working harder than usual, often as a downstream effect of high blood sugar.
- **Electrolytes [OPTIMAL]:** Stable potassium and calcium confirm immediate fluid balance is safe.

### 3. Next Steps & Empowered Physician Partnership
- **Diabetes Medication Review:** Discuss modern glycemic therapies with your endocrinologist or primary physician.
- **Kidney Protection (Renoprotection):** Inquire whether blood pressure or kidney-protective medications are indicated.
- **Hydration & Dietary Modifications:** Work with a dietitian on low-glycemic meal planning.`,
  summaryHi: `### 1. रिपोर्ट का सारांश एवं आश्वस्ति (Overview & Reassurance)
यह मेटाबोलिक एवं रीनल प्रोफाइल आपके ब्लड शुगर और किडनी के कार्य की स्थिति का आंकलन करती है। आपके पोटेशियम और कैल्शियम जैसे महत्वपूर्ण इलेक्ट्रोलाइट्स सामान्य स्तर पर हैं, जो हृदय के लिए सुरक्षित हैं। मुख्य ध्यान देने योग्य पहलू ब्लड शुगर का उच्च स्तर और किडनी पर अतिरिक्त दबाव है।

### 2. महत्वपूर्ण निष्कर्ष सरल बोलचाल में (Key Findings)
- **फास्टिंग शुगर (168 mg/dL) एवं HbA1c (8.2%) [अधिक]:** पिछले तीन महीनों का शुगर स्तर सामान्य सीमा से अधिक है, जिसका अर्थ है कि शरीर को इंसुलिन प्रबंधन में सहायता की आवश्यकता है।
- **सीरम क्रिएटिनिन (1.45) एवं eGFR (54 mL/min) [किडनी तनाव]:** किडनी शरीर का प्राकृतिक फिल्टर है। 54 eGFR यह दर्शाता है कि फिल्टर करने की गति धीमी हुई है, जो अक्सर अनियंत्रित शुगर के कारण होता है।

### 3. डॉक्टर से परामर्श के लिए तैयारी (Next Steps)
- डॉक्टर से शुगर को नियंत्रित करने वाली उचित दवा या खुराक के बारे में सलाह लें।
- किडनी की सुरक्षा के लिए पानी की उचित मात्रा और कम नमक वाले आहार पर चर्चा करें।`,
  questionsEn: [
    {
      question: 'With an HbA1c of 8.2% and reduced eGFR of 54, what diabetes medications are both effective and kidney-safe?',
      context: 'Suggested based on your elevated HbA1c and mild renal filtration reduction.',
      priority: 'high',
    },
    {
      question: 'Should we schedule a urine albumin-to-creatinine ratio (uACR) test to further evaluate kidney health?',
      context: 'Standard guideline-directed next step for assessing renal microvascular function.',
      priority: 'high',
    },
    {
      question: 'What dietary changes regarding carbohydrates and sodium should I adopt immediately?',
      context: 'Empowers positive lifestyle adjustments.',
      priority: 'general',
    },
  ],
  questionsHi: [
    {
      question: '8.2% HbA1c और 54 eGFR के साथ, कौन सी शुगर की दवाएं किडनी के लिए सबसे सुरक्षित हैं?',
      context: 'आपके बढ़े हुए शुगर और क्रिएटिनिन स्तर के आधार पर सुझाया गया प्रश्न।',
      priority: 'high',
    },
    {
      question: 'क्या किडनी की अतिरिक्त जांच (जैसे यूरिन माइक्रोएल्ब्यूमिन) कराने की आवश्यकता है?',
      context: 'किडनी की सुरक्षा जांच का अगला कदम।',
      priority: 'high',
    },
  ],
  suggestionsEn: [
    'What dietary changes help stabilize my blood glucose?',
    'What precautions should I take for kidney and creatinine health?',
    'What should my post-meal target be?',
    'When should I schedule an HbA1c re-test?',
  ],
  suggestionsHi: [
    'ब्लड शुगर को नियंत्रित करने के आसान उपाय क्या हैं?',
    'किडनी की सुरक्षा के लिए खान-पान के क्या नियम हैं?',
    'भोजन के बाद का शुगर स्तर क्या होना चाहिए?',
    'HbA1c टेस्ट कब दोहराएं?',
  ],
};

const PRESET_LIPID: ClinicalPreset = {
  id: 'lipid',
  metadata: {
    patientName: 'Vikramaditya Roy',
    patientAge: '39 Yrs',
    patientSex: 'Male',
    reportType: 'Cardiovascular & Lipid Profile',
  },
  badge: { en: 'High Cholesterol & CRP', hi: 'कोलेस्ट्रॉल एवं सूजन' },
  tag: { en: 'Lipid / Cardio', hi: 'लिपिड / कार्डियो' },
  biomarkers: [
    {
      name: 'Total Cholesterol',
      category: 'Lipid',
      value: 252,
      unit: 'mg/dL',
      referenceMin: 125,
      referenceMax: 200,
      referenceText: '125 - 200 mg/dL',
      status: 'HIGH',
      plainExplanation: 'Total circulating sterols in the bloodstream; excess can contribute to arterial plaque buildup.',
    },
    {
      name: 'Triglycerides',
      category: 'Lipid',
      value: 218,
      unit: 'mg/dL',
      referenceMin: 50,
      referenceMax: 150,
      referenceText: '50 - 150 mg/dL',
      status: 'HIGH',
      plainExplanation: 'Storage fats from unused calories circulating in blood vessels.',
    },
    {
      name: 'HDL Cholesterol (Good)',
      category: 'Lipid',
      value: 36,
      unit: 'mg/dL',
      referenceMin: 40,
      referenceMax: 60,
      referenceText: '40 - 60 mg/dL',
      status: 'LOW',
      plainExplanation: 'Protective scavenger lipoprotein that sweeps excess cholesterol from arteries back to the liver.',
    },
    {
      name: 'LDL Cholesterol (Bad)',
      category: 'Lipid',
      value: 172,
      unit: 'mg/dL',
      referenceMin: 50,
      referenceMax: 100,
      referenceText: '50 - 100 mg/dL',
      status: 'HIGH',
      plainExplanation: 'Low-density lipoprotein prone to oxidizing and creating vascular wall narrowing.',
    },
    {
      name: 'VLDL Cholesterol',
      category: 'Lipid',
      value: 43.6,
      unit: 'mg/dL',
      referenceMin: 10,
      referenceMax: 30,
      referenceText: '10 - 30 mg/dL',
      status: 'HIGH',
      plainExplanation: 'Very-low-density particles rich in triglycerides.',
    },
    {
      name: 'Cholesterol / HDL Ratio',
      category: 'Lipid',
      value: 7.0,
      unit: 'ratio',
      referenceMin: 3.0,
      referenceMax: 5.0,
      referenceText: '3.0 - 5.0',
      status: 'HIGH',
      plainExplanation: 'Key proportional risk metric reflecting atherogenic balance.',
    },
    {
      name: 'hs-CRP (High-Sensitivity CRP)',
      category: 'Inflammation',
      value: 3.8,
      unit: 'mg/L',
      referenceMin: 0.1,
      referenceMax: 1.0,
      referenceText: '0.1 - 1.0 mg/L',
      status: 'HIGH',
      plainExplanation: 'Sensitive acute-phase protein marking ongoing micro-vascular inflammation.',
    },
    {
      name: 'Apolipoprotein B (ApoB)',
      category: 'Lipid',
      value: 132,
      unit: 'mg/dL',
      referenceMin: 60,
      referenceMax: 110,
      referenceText: '60 - 110 mg/dL',
      status: 'HIGH',
      plainExplanation: 'Particle count indicator capturing total atherogenic cholesterol carriers.',
    },
  ],
  summaryEn: `### 1. Overview & Gentle Reassurance
This Cardiovascular & Lipid Profile examines your blood lipid carriers and vascular health markers. Your overall health foundation is strong, but elevated circulating LDL particles and inflammatory signals suggest that taking proactive cardioprotective measures now will yield substantial long-term benefits.

### 2. Key Findings Explained in Everyday Language
- **Total Cholesterol (252 mg/dL) & LDL (172 mg/dL) [HIGH]:** LDL acts like cargo trucks carrying fat into arterial walls. When LDL is elevated above 100 mg/dL, these particles can slowly contribute to plaque stiffness over decades.
- **HDL (36 mg/dL) [LOW]:** HDL is your cleanup crew. Higher HDL helps clear arterial cholesterol, so elevating this through aerobic exercise and healthy fats is advantageous.
- **hs-CRP (3.8 mg/L) [HIGH]:** Marks low-grade vascular inflammation, meaning vessel linings are under mild oxidative stress.

### 3. Next Steps & Empowered Physician Partnership
- **Cardiovascular Risk Assessment:** Discuss with your doctor whether statin therapy or targeted lipid-lowering is indicated.
- **Mediterranean Diet & Aerobic Fitness:** Focus on omega-3 fatty acids, soluble fiber, and 150 minutes of weekly brisk walking.
- **Follow-Up Interval:** Re-check your lipid panel in 3 to 6 months to evaluate lifestyle impact.`,
  summaryHi: `### 1. रिपोर्ट का सारांश एवं आश्वस्ति (Overview & Reassurance)
यह लिपिड प्रोफाइल आपके हृदय और रक्त वाहिकाओं में कोलेस्ट्रॉल की स्थिति को दर्शाती है। आपका समग्र स्वास्थ्य मजबूत है, लेकिन उच्च LDL (खराब कोलेस्ट्रॉल) और सूजन मार्कर (hs-CRP) संकेत देते हैं कि समय रहते जीवनशैली में सुधार करना दीर्घकालिक हृदय स्वास्थ्य के लिए आवश्यक है।

### 2. महत्वपूर्ण निष्कर्ष सरल बोलचाल में (Key Findings)
- **LDL खराब कोलेस्ट्रॉल (172 mg/dL) [अधिक]:** यह कोलेस्ट्रॉल धमनियों में जमाव कर सकता है। इसे कम रखना महत्वपूर्ण है।
- **HDL अच्छा कोलेस्ट्रॉल (36 mg/dL) [कम]:** यह शरीर का सफाई कर्मचारी है जो धमनियों से अतिरिक्त वसा को हटाता है। व्यायाम द्वारा इसे बढ़ाना लाभकारी होगा।
- **hs-CRP (3.8 mg/L) [अधिक]:** रक्त वाहिकाओं में हल्की सूजन को दर्शाता है।

### 3. डॉक्टर से परामर्श के लिए तैयारी (Next Steps)
- डॉक्टर से कोलेस्ट्रॉल कम करने के उपायों पर चर्चा करें।
- फाइबर युक्त आहार और नियमित व्यायाम अपनाएं।`,
  questionsEn: [
    {
      question: 'Given an LDL of 172 mg/dL and elevated hs-CRP (3.8 mg/L), should we calculate my 10-year ASCVD risk score and consider lipid-lowering therapy?',
      context: 'Standard guideline recommendation for primary cardiovascular prevention.',
      priority: 'high',
    },
    {
      question: 'What specific dietary changes regarding saturated fats and soluble fiber will most effectively raise my HDL and lower LDL?',
      context: 'Guidance on lifestyle modifications.',
      priority: 'general',
    },
  ],
  questionsHi: [
    {
      question: '172 LDL और बढ़े हुए hs-CRP के साथ, क्या मुझे कोलेस्ट्रॉल कम करने वाली दवा की आवश्यकता है?',
      context: 'हृदय रोग के जोखिम को कम करने के लिए महत्वपूर्ण सवाल।',
      priority: 'high',
    },
  ],
  suggestionsEn: [
    'How can I lower my cholesterol through diet and lifestyle?',
    'What foods should I strictly avoid?',
    'Top questions for my physician appointment?',
    'When should I schedule a follow-up test?',
  ],
  suggestionsHi: [
    'कोलेस्ट्रॉल कम करने के लिए कौन से बदलाव करें?',
    'किन खाद्य पदार्थों से परहेज करना चाहिए?',
    'डॉक्टर से क्या पूछें?',
    'जांच दोबारा कब कराएं?',
  ],
};

const CLINICAL_PRESETS_MAP: Record<string, ClinicalPreset> = {
  cbc: PRESET_CBC,
  metabolic: PRESET_METABOLIC,
  lipid: PRESET_LIPID,
};

// ==============================================================================
// MAIN APPLICATION COMPONENT
// ==============================================================================

export const App: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  // Navigation and Layout State
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Demystify Sub-Tabs (Includes dedicated 'summary' tab for plain reading!)
  type DemystifyTab = 'summary' | 'chat' | 'biomarkers' | 'doctor' | 'trends' | 'split';
  const [demystifyTab, setDemystifyTab] = useState<DemystifyTab>('summary');

  // Slide-Over Drawer State
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);

  // Active Report State (Initialized EMPTY by default on page load / refresh!)
  const [hasAnalyzedReport, setHasAnalyzedReport] = useState<boolean>(false);
  const [reportId, setReportId] = useState<string>('');
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [doctorQuestions, setDoctorQuestions] = useState<DoctorQuestion[]>([]);
  const [patientMetadata, setPatientMetadata] = useState<PatientMetadata>({
    patientName: '',
    patientAge: '',
    patientSex: '',
    reportType: '',
  });

  // Longitudinal Trends & Loading
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lifted Chat Session State (Persists across tab switching & language changes)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatSuggestions, setChatSuggestions] = useState<string[]>([]);

  const t = (key: any) => getTranslation(language, key);
  const abnormalCount = biomarkers.filter((b) => b.status !== 'NORMAL').length;

  // Load initial healthcheck and trends
  useEffect(() => {
    fetchHealth()
      .then((data) => setHealth(data))
      .catch((err) => console.warn('Backend health check skipped', err));

    fetchBiomarkerTrends()
      .then((data) => setTrends(data.trends))
      .catch((err) => console.warn('Trends load skipped', err));
  }, []);

  // Language switch handler (updates active summary text if on preset without wiping chat)
  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    // If currently viewing a preset, adjust summary translation
    if (reportId.startsWith('cbc')) {
      setSummary(newLang === 'hi' ? PRESET_CBC.summaryHi : PRESET_CBC.summaryEn);
      setDoctorQuestions(newLang === 'hi' ? PRESET_CBC.questionsHi : PRESET_CBC.questionsEn);
    } else if (reportId.startsWith('metabolic')) {
      setSummary(newLang === 'hi' ? PRESET_METABOLIC.summaryHi : PRESET_METABOLIC.summaryEn);
      setDoctorQuestions(newLang === 'hi' ? PRESET_METABOLIC.questionsHi : PRESET_METABOLIC.questionsEn);
    } else if (reportId.startsWith('lipid')) {
      setSummary(newLang === 'hi' ? PRESET_LIPID.summaryHi : PRESET_LIPID.summaryEn);
      setDoctorQuestions(newLang === 'hi' ? PRESET_LIPID.questionsHi : PRESET_LIPID.questionsEn);
    }
  };

  // Instant 1-Click Preset Loader
  const loadClinicalPreset = (presetKey: 'cbc' | 'metabolic' | 'lipid') => {
    const preset = CLINICAL_PRESETS_MAP[presetKey] || PRESET_CBC;
    const newReportId = `${preset.id}-${Date.now()}`;

    setBiomarkers(preset.biomarkers);
    setPatientMetadata(preset.metadata);
    setSummary(language === 'hi' ? preset.summaryHi : preset.summaryEn);
    setDoctorQuestions(language === 'hi' ? preset.questionsHi : preset.questionsEn);
    setReportId(newReportId);
    setHasAnalyzedReport(true);
    setActiveTab('demystify');
    setDemystifyTab('summary');
    setIsUploadDrawerOpen(false);

    // Initial chat welcome for this preset
    const welcomeMsg =
      language === 'hi'
        ? `नमस्ते! मैंने आपकी **${preset.metadata.reportType}** (${preset.metadata.patientName}) का विश्लेषण पूरा कर लिया है। आप किसी भी बायोमार्कर या आहार के बारे में हिंदी, English या Hinglish में सवाल पूछ सकते हैं।`
        : `Hello! I have reviewed the **${preset.metadata.reportType}** for ${preset.metadata.patientName}. Feel free to ask any questions regarding your biomarkers, dietary recommendations, warning signs, or doctor consultation in English, Hindi, or Hinglish.`;

    setChatMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'assistant',
        text: welcomeMsg,
        timestamp: 'Just now',
      },
    ]);
    setChatSuggestions(language === 'hi' ? preset.suggestionsHi : preset.suggestionsEn);
  };

  // Upload or Custom Analysis Pipeline
  const handleAnalyze = async (payload: { text?: string; file?: File }) => {
    setIsLoading(true);
    setSummary('');
    setActiveTab('demystify');
    setDemystifyTab('split'); // live stream in split view
    setIsUploadDrawerOpen(false);

    const newReportId = 'rep-' + Date.now();
    setReportId(newReportId);
    setHasAnalyzedReport(true);

    const reportLabel = payload.file
      ? payload.file.name
      : 'Diagnostic Report';

    setChatMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'assistant',
        text:
          language === 'hi'
            ? `नमस्ते! मैंने आपकी नई रिपोर्ट **${reportLabel}** का विश्लेषण शुरू कर दिया है। आप रिपोर्ट के किसी भी बायोमार्कर, आहार, या डॉक्टर परामर्श के बारे में सवाल पूछ सकते हैं।`
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
          // Graceful fallback if backend is offline and user pasted CBC
          if (payload.text && payload.text.includes('COMPLETE BLOOD COUNT')) {
            loadClinicalPreset('cbc');
          } else {
            setSummary((prev) => prev + `\n\n*(Note: Backend offline or response finalized: ${err})*`);
          }
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
              onStart={(tab) => {
                setActiveTab(tab);
                if (!hasAnalyzedReport) loadClinicalPreset('cbc');
              }}
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
                  <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center shadow-sm flex-shrink-0 ${
                    hasAnalyzedReport
                      ? 'bg-teal-500/15 border-teal-500/30 text-teal-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-extrabold text-white">
                        {hasAnalyzedReport
                          ? patientMetadata.reportType || 'Clinical Diagnostic Report'
                          : language === 'hi'
                          ? 'कोई रिपोर्ट लोड नहीं है'
                          : 'No Report Loaded Yet'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        hasAnalyzedReport
                          ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {hasAnalyzedReport ? 'Demystified' : 'Awaiting Ingestion'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2 mt-1">
                      {hasAnalyzedReport ? (
                        <>
                          <span>
                            Subject: <strong className="text-slate-100">{patientMetadata.patientName}</strong> ({patientMetadata.patientAge}, {patientMetadata.patientSex})
                          </span>
                          <span>•</span>
                          <span className="text-teal-400 font-medium">{biomarkers.length} Markers Extracted</span>
                        </>
                      ) : (
                        <span className="text-slate-400">
                          {language === 'hi'
                            ? 'शुरू करने के लिए अपनी PDF/TXT रिपोर्ट अपलोड करें या नीचे कोई सैंपल चुनें'
                            : 'Upload a PDF/TXT lab report or select any clinical sample below to begin'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right controls: Yellow Alert + Drawer Trigger + Quick Demo Presets */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {hasAnalyzedReport && abnormalCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => setDemystifyTab('biomarkers')}
                      className="group px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 flex items-center gap-2 shadow-sm transition cursor-pointer"
                      title={
                        language === 'hi'
                          ? `आपकी रिपोर्ट में ${abnormalCount} बायोमार्कर्स सामान्य सीमा से बाहर हैं। देखने के लिए क्लिक करें।`
                          : `${abnormalCount} biomarkers are outside healthy medical reference range. Click to inspect.`
                      }
                    >
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                      <span>
                        {language === 'hi'
                          ? `⚠️ ${abnormalCount} बायोमार्कर्स सीमा से बाहर`
                          : `⚠️ ${abnormalCount} Alerts Outside Range`}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-amber-400 group-hover:translate-x-0.5 transition hidden sm:inline" />
                    </button>
                  ) : hasAnalyzedReport ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>All Markers Optimal</span>
                    </span>
                  ) : null}

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

                  {/* Quick 1-Click Demo Buttons */}
                  <button
                    type="button"
                    onClick={() => loadClinicalPreset('cbc')}
                    className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-teal-500/30 text-teal-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
                    title="Instantly test Complete Blood Count case"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                    <span>{language === 'hi' ? 'डेमो CBC' : 'Demo CBC'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loadClinicalPreset('metabolic')}
                    className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-teal-500/30 text-teal-300 hover:text-white font-semibold text-xs items-center gap-1.5 cursor-pointer transition hidden sm:flex"
                    title="Instantly test Metabolic & Kidney Panel"
                  >
                    <Zap className="h-3.5 w-3.5 text-teal-400" />
                    <span>{language === 'hi' ? 'डेमो मेटाबोलिक' : 'Demo Metabolic'}</span>
                  </button>
                </div>
              </div>

              {/* Integrated Report Navigation Tabs */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090e1a] border border-slate-800 overflow-x-auto scrollbar-none">
                {/* Tab 1: Dedicated Plain Summary Tab (New!) */}
                <button
                  type="button"
                  onClick={() => setDemystifyTab('summary')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                    demystifyTab === 'summary'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="h-4 w-4 text-teal-400" />
                  <span>{language === 'hi' ? 'सरल सारांश' : 'Plain Summary'}</span>
                </button>

                {/* Tab 2: Centered Copilot Chat */}
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
                  <span>{language === 'hi' ? 'AI साथी चैट' : 'AI Copilot Chat'}</span>
                </button>

                {/* Tab 3: Biomarkers Table & Visual Gauges */}
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
                  <span>{language === 'hi' ? 'बायोमार्कर्स' : 'Biomarkers & Vitals'} {hasAnalyzedReport && `(${biomarkers.length})`}</span>
                </button>

                {/* Tab 4: Doctor Consultation Checklist */}
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
                  <span>{language === 'hi' ? 'डॉक्टर चेकलिस्ट' : 'Doctor Checklist'} {hasAnalyzedReport && `(${doctorQuestions.length})`}</span>
                </button>

                {/* Tab 5: Health Trends */}
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
                  <span>{language === 'hi' ? 'स्वास्थ्य ट्रेंड्स' : 'Health Trends'}</span>
                </button>

                {/* Tab 6: Split View */}
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
                  <span>{language === 'hi' ? 'स्प्लिट व्यू' : 'Split View'}</span>
                </button>
              </div>

              {/* EMPTY STATE HERO: Shown when no report is loaded yet */}
              {!hasAnalyzedReport && (
                <div className="rounded-2xl bg-[#080d18] border border-teal-500/25 p-6 sm:p-8 text-center space-y-6 animate-in fade-in duration-200 shadow-xl">
                  <div className="max-w-2xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                      <span>100% On-Device · Zero Cloud PHI Leakage</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      {language === 'hi'
                        ? 'परीक्षण के लिए केस चुनें या अपनी लैब रिपोर्ट अपलोड करें'
                        : 'Select a Clinical Test Case or Upload Your Report'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {language === 'hi'
                        ? 'डिफ़ॉल्ट रूप से कोई रिपोर्ट लोड नहीं की गई है। नीचे दिए गए सत्यापित सैंपल्स में से किसी एक पर क्लिक करें या अपनी PDF/TXT फ़ाइल अपलोड करें।'
                        : 'No report is loaded by default. Select any verified case below for an instant demo, or upload your own diagnostic report.'}
                    </p>
                  </div>

                  {/* 3 Verified Clinical Sample Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-5xl mx-auto pt-2">
                    {/* Sample 1: CBC */}
                    <div
                      onClick={() => loadClinicalPreset('cbc')}
                      className="group rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 p-5 transition cursor-pointer flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                            Hematology
                          </span>
                          <span className="text-xs font-semibold text-amber-400">
                            9 Outside Range
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition mb-1">
                          Complete Blood Count (CBC)
                        </h4>
                        <p className="text-xs text-slate-400 mb-2">
                          Subject: <strong>Rajesh Kumar Verma</strong> (46 Yrs)
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Low Hemoglobin (9.4 g/dL) with elevated WBC (13,800/cu.mm).
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-4 w-full py-2 rounded-xl bg-teal-500/15 group-hover:bg-teal-500 text-teal-300 group-hover:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{language === 'hi' ? 'डेमो CBC लोड करें' : 'Test Demo CBC'}</span>
                      </button>
                    </div>

                    {/* Sample 2: Metabolic */}
                    <div
                      onClick={() => loadClinicalPreset('metabolic')}
                      className="group rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 p-5 transition cursor-pointer flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                            Glycemic / Kidney
                          </span>
                          <span className="text-xs font-semibold text-amber-400">
                            6 Outside Range
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition mb-1">
                          Comprehensive Metabolic Panel
                        </h4>
                        <p className="text-xs text-slate-400 mb-2">
                          Subject: <strong>Ananya S. Sharma</strong> (52 Yrs)
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Fasting Glucose (168 mg/dL), HbA1c 8.2% & Creatinine 1.45 mg/dL.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-4 w-full py-2 rounded-xl bg-teal-500/15 group-hover:bg-teal-500 text-teal-300 group-hover:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        <span>{language === 'hi' ? 'मेटाबोलिक लोड करें' : 'Test Metabolic Panel'}</span>
                      </button>
                    </div>

                    {/* Sample 3: Lipid */}
                    <div
                      onClick={() => loadClinicalPreset('lipid')}
                      className="group rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 p-5 transition cursor-pointer flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                            Cardiovascular
                          </span>
                          <span className="text-xs font-semibold text-amber-400">
                            7 Outside Range
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition mb-1">
                          Cardiovascular & Lipid Panel
                        </h4>
                        <p className="text-xs text-slate-400 mb-2">
                          Subject: <strong>Vikramaditya Roy</strong> (39 Yrs)
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Total Cholesterol 252 mg/dL, LDL 172 mg/dL & high hs-CRP.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-4 w-full py-2 rounded-xl bg-teal-500/15 group-hover:bg-teal-500 text-teal-300 group-hover:text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <HeartPulse className="h-3.5 w-3.5" />
                        <span>{language === 'hi' ? 'लिपिड प्रोफाइल लोड करें' : 'Test Lipid Profile'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary Upload Action */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadDrawerOpen(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold text-sm inline-flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer transition"
                    >
                      <UploadCloud className="h-5 w-5 text-slate-950" />
                      <span>{language === 'hi' ? 'अपनी PDF / TXT रिपोर्ट अपलोड करें' : 'Upload Your PDF / TXT Lab Report'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 1: Dedicated Full-Width Plain Summary */}
              {hasAnalyzedReport && demystifyTab === 'summary' && (
                <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
                  <AnalysisStream
                    summary={summary}
                    isStreaming={isLoading}
                    reportType={patientMetadata.reportType}
                    patientName={patientMetadata.patientName}
                    language={language}
                  />
                </div>
              )}

              {/* TAB CONTENT 2: Centered Spacious AI Copilot Chat */}
              {hasAnalyzedReport && demystifyTab === 'chat' && (
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

              {/* TAB CONTENT 3: Biomarkers Table & Gauges */}
              {hasAnalyzedReport && demystifyTab === 'biomarkers' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <BiomarkerTable biomarkers={biomarkers} language={language} />
                </div>
              )}

              {/* TAB CONTENT 4: Doctor Consultation Prep */}
              {hasAnalyzedReport && demystifyTab === 'doctor' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <DoctorQuestions questions={doctorQuestions} language={language} />
                </div>
              )}

              {/* TAB CONTENT 5: Longitudinal Health Trends */}
              {hasAnalyzedReport && demystifyTab === 'trends' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <TrendsChart trends={trends} language={language} />
                </div>
              )}

              {/* TAB CONTENT 6: Split Overview (Gauges + Sticky Summary Without Empty Void) */}
              {hasAnalyzedReport && demystifyTab === 'split' && (
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
