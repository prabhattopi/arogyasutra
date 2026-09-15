import { describe, it, expect } from 'vitest';
import { ExtractorService } from '../services/extractor.service';
import { GuardrailsService } from '../services/guardrails.service';

const SAMPLE_CBC = `
PATIENT NAME: Rajesh Kumar Verma
AGE / SEX: 46 Yrs / Male
COMPLETE BLOOD COUNT (CBC)
Hemoglobin (Hb)                  9.4          g/dL          13.0 - 17.0         LOW
Total Leukocyte Count (WBC)      13,800       /cu.mm        4,000 - 11,000      HIGH
Platelet Count                   265,000      /cu.mm        150,000 - 450,000   NORMAL
`;

const SAMPLE_METABOLIC = `
PATIENT NAME: Ananya S. Sharma
AGE / SEX: 52 Yrs / Female
GLYCEMIC & RENAL METABOLIC PANEL
Fasting Blood Glucose (FBS)      168          mg/dL         70 - 99             HIGH
HbA1c (Glycated Hemoglobin)      8.2          %             4.0 - 5.6           HIGH
Serum Creatinine                 1.45         mg/dL         0.55 - 1.02         HIGH
`;

const SAMPLE_LIPID = `
PATIENT NAME: Vikramaditya Roy
AGE / SEX: 39 Yrs / Male
LIPID PROFILE
Total Cholesterol                252          mg/dL         < 200 (Desirable)   HIGH
Triglycerides                    218          mg/dL         < 150 (Normal)      HIGH
HDL Cholesterol (Good)           36           mg/dL         > 40 (Normal)       LOW
LDL Cholesterol (Bad)            172          mg/dL         < 100 (Optimal)     HIGH
`;

describe('ExtractorService Tests', () => {
  it('correctly extracts Lipid profile biomarkers and statuses', () => {
    const biomarkers = ExtractorService.extractBiomarkers(SAMPLE_LIPID);
    expect(biomarkers.length).toBeGreaterThanOrEqual(4);

    const chol = biomarkers.find((b) => b.name === 'Total Cholesterol');
    expect(chol).toBeDefined();
    expect(chol?.value).toBe(252);
    expect(chol?.status).toBe('HIGH');

    const hdl = biomarkers.find((b) => b.name.includes('HDL'));
    expect(hdl).toBeDefined();
    expect(hdl?.value).toBe(36);
    expect(hdl?.status).toBe('LOW');

    const ldl = biomarkers.find((b) => b.name.includes('LDL'));
    expect(ldl).toBeDefined();
    expect(ldl?.value).toBe(172);
    expect(ldl?.status).toBe('HIGH');
  });
  it('correctly extracts CBC biomarkers, numeric values, and statuses', () => {
    const biomarkers = ExtractorService.extractBiomarkers(SAMPLE_CBC);
    expect(biomarkers.length).toBeGreaterThanOrEqual(3);

    const hb = biomarkers.find((b) => b.name.includes('Hemoglobin'));
    expect(hb).toBeDefined();
    expect(hb?.value).toBe(9.4);
    expect(hb?.status).toBe('LOW');

    const wbc = biomarkers.find((b) => b.name.includes('Leukocyte'));
    expect(wbc).toBeDefined();
    expect(wbc?.value).toBe(13800);
    expect(wbc?.status).toBe('HIGH');

    const plt = biomarkers.find((b) => b.name.includes('Platelet'));
    expect(plt).toBeDefined();
    expect(plt?.value).toBe(265000);
    expect(plt?.status).toBe('NORMAL');
  });

  it('correctly extracts Metabolic markers with reference ranges', () => {
    const biomarkers = ExtractorService.extractBiomarkers(SAMPLE_METABOLIC);

    const fbs = biomarkers.find((b) => b.name.includes('Glucose'));
    expect(fbs).toBeDefined();
    expect(fbs?.value).toBe(168);
    expect(fbs?.status).toBe('HIGH');

    const hba1c = biomarkers.find((b) => b.name.includes('HbA1c'));
    expect(hba1c).toBeDefined();
    expect(hba1c?.value).toBe(8.2);
    expect(hba1c?.status).toBe('HIGH');

    const creat = biomarkers.find((b) => b.name.includes('Creatinine'));
    expect(creat).toBeDefined();
    expect(creat?.value).toBe(1.45);
    expect(creat?.status).toBe('HIGH');
  });

  it('extracts metadata reliably from clinical reports', () => {
    const meta = ExtractorService.extractMetadata(SAMPLE_CBC);
    expect(meta.patientName).toBe('Rajesh Kumar Verma');
    expect(meta.patientAge).toBe('46 Yrs');
    expect(meta.reportType).toContain('Complete Blood Count');
  });

  it('generates tailored doctor consultation questions based on abnormal markers', () => {
    const biomarkers = ExtractorService.extractBiomarkers(SAMPLE_CBC);
    const questions = GuardrailsService.generateDoctorQuestions(biomarkers);

    expect(questions.length).toBeGreaterThan(0);
    const hasFatigueQ = questions.some((q) => q.question.toLowerCase().includes('fatigue') || q.question.toLowerCase().includes('hemoglobin'));
    const hasWbcQ = questions.some((q) => q.question.toLowerCase().includes('white blood cell'));

    expect(hasFatigueQ).toBe(true);
    expect(hasWbcQ).toBe(true);
  });
});
