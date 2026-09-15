export type BiomarkerStatus = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface Biomarker {
  name: string;
  category: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  referenceText: string;
  status: BiomarkerStatus;
  plainExplanation?: string;
}

export interface DoctorQuestion {
  question: string;
  context: string;
  priority: 'high' | 'medium' | 'general';
}

export interface PatientMetadata {
  patientName: string;
  patientAge: string;
  patientSex: string;
  reportType: string;
}

export interface ReportData {
  _id?: string;
  id?: string;
  patientName: string;
  patientAge?: string;
  patientSex?: string;
  reportDate?: string | Date;
  reportType: string;
  rawText: string;
  biomarkers: Biomarker[];
  plainLanguageSummary: string;
  doctorQuestions: DoctorQuestion[];
  createdAt?: string | Date;
}

export interface SystemHealth {
  status: string;
  service: string;
  version: string;
  database: {
    connected: boolean;
    mode: string;
  };
  ollama: {
    online: boolean;
    host: string;
    activeModel: string;
    availableModels: string[];
    error?: string;
  };
}

export interface TrendPoint {
  date: string;
  label: string;
  hemoglobin?: number | null;
  glucose?: number | null;
  hba1c?: number | null;
  cholesterol?: number | null;
  wbc?: number | null;
  creatinine?: number | null;
}
