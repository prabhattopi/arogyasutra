import mongoose, { Schema, Document } from 'mongoose';

export interface IBiomarker {
  name: string;
  category: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  referenceText: string;
  status: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  plainExplanation?: string;
}

export interface IDoctorQuestion {
  question: string;
  context: string;
  priority: 'high' | 'medium' | 'general';
}

export interface IReport extends Document {
  patientName: string;
  patientAge?: string;
  patientSex?: string;
  reportDate: Date;
  reportType: string;
  rawText: string;
  biomarkers: IBiomarker[];
  plainLanguageSummary: string;
  doctorQuestions: IDoctorQuestion[];
  createdAt: Date;
}

const BiomarkerSchema = new Schema<IBiomarker>({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  value: { type: Number, required: true },
  unit: { type: String, default: '' },
  referenceMin: { type: Number, required: true },
  referenceMax: { type: Number, required: true },
  referenceText: { type: String, default: '' },
  status: { type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'], required: true },
  plainExplanation: { type: String },
});

const DoctorQuestionSchema = new Schema<IDoctorQuestion>({
  question: { type: String, required: true },
  context: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'general'], default: 'medium' },
});

const ReportSchema = new Schema<IReport>(
  {
    patientName: { type: String, default: 'Anonymous Patient' },
    patientAge: { type: String, default: '' },
    patientSex: { type: String, default: '' },
    reportDate: { type: Date, default: Date.now },
    reportType: { type: String, default: 'Diagnostic Lab Panel' },
    rawText: { type: String, required: true },
    biomarkers: [BiomarkerSchema],
    plainLanguageSummary: { type: String, required: true },
    doctorQuestions: [DoctorQuestionSchema],
  },
  { timestamps: true }
);

export const ReportModel = mongoose.model<IReport>('Report', ReportSchema);

// In-Memory Fallback Storage for zero-dependency instant demoing
export const inMemoryReports: any[] = [];
