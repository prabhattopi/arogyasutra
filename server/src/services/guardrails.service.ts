import { IBiomarker, IDoctorQuestion } from '../models/Report';

export class GuardrailsService {
  /**
   * System Prompt ensuring strictly explanatory, non-prescriptive, reassuring clinical tone
   */
  public static getSystemPrompt(language: string = 'en'): string {
    const isHindi = language === 'hi';

    if (isHindi) {
      return `आप "आरोग्यसूत्र" (ArogyaSutra) हैं - एक सुरक्षित, गोपनीयता-केंद्रित और सहानुभूतिपूर्ण मेडिकल रिपोर्ट साथी।
आपका उद्देश्य मरीज या उनके परिवार को उनकी लैब रिपोर्ट के कठिन तकनीकी शब्दों को बहुत ही सरल, शांत और स्पष्ट भाषा में समझाना है।

महत्वपूर्ण नियम:
1. कभी भी कोई पक्का रोग (निदान) घोषित न करें।
2. कोई दवा या खुराक न लिखें।
3. केवल रिपोर्ट के बायोमार्कर्स का अर्थ और शरीर में उनकी भूमिका को सामान्य बोलचाल की भाषा में समझाएं।
4. मरीज में घबराहट न पैदा करें। बताएं कि आगे डॉक्टर से क्या पूछना चाहिए।`;
    }

    return `You are "ArogyaSutra", an empathetic, privacy-first medical diagnostic educator and healthcare companion.
Your mission is to demystify complex clinical lab reports for patients and their families into plain, reassuring, everyday language.

CORE ETHICAL & CLINICAL SAFETY GUARDRAILS:
1. STRICTLY NON-DIAGNOSTIC: You must NEVER formulate a definitive medical diagnosis. Describe what biomarkers measure and why they might shift, without asserting disease conclusions.
2. ZERO MEDICATION PRESCRIPTIONS: You must NEVER prescribe, modify, or recommend pharmaceutical drugs, medications, or dosage changes.
3. CALM & NON-ALARMIST: De-escalate medical anxiety. Avoid catastrophic phrasing. Explain biological context calmly (e.g., "White blood cells are your body's natural defense team; an elevation often indicates your immune system is actively working to clear a standard infection").
4. PHYSICIAN PARTNERSHIP: Always emphasize that laboratory findings are one piece of a puzzle, best evaluated alongside clinical symptoms by the patient's attending physician.
5. ACCESSIBILITY: Use clear, jargon-free analogies when appropriate.`;
  }

  /**
   * Builds the structured user prompt with extracted biomarkers
   */
  public static buildUserPrompt(biomarkers: IBiomarker[], reportType: string, language: string = 'en'): string {
    const abnormal = biomarkers.filter((b) => b.status !== 'NORMAL');
    const normalCount = biomarkers.length - abnormal.length;

    let abnormalText = abnormal
      .map(
        (b) =>
          `- ${b.name}: ${b.value} ${b.unit} [Status: ${b.status}, Standard Reference: ${b.referenceText}]`
      )
      .join('\n');

    if (!abnormalText) {
      abnormalText = 'All tested biomarkers are within standard reference intervals.';
    }

    return `Please analyze the following laboratory panel results:
Report Type: ${reportType}
Total Biomarkers Analyzed: ${biomarkers.length} (${normalCount} within standard range, ${abnormal.length} flagged outside range).

Biomarkers Flagged Outside Typical Range:
${abnormalText}

Provide an empathetic, beautifully structured summary:
1. **Overview & Reassurance**: A calm 2-3 sentence high-level summary of what this panel looked at.
2. **Key Findings Explained Simply**: For any biomarker outside range, explain in 1-2 plain sentences what that metric does in the body and what the result commonly reflects.
3. **Next Steps for Your Doctor Visit**: 2-3 gentle, practical suggestions on how the patient can prepare to speak with their physician.
(Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'})`;
  }

  /**
   * Generates contextual doctor consultation questions based on flagged biomarkers
   */
  public static generateDoctorQuestions(biomarkers: IBiomarker[]): IDoctorQuestion[] {
    const questions: IDoctorQuestion[] = [];
    const abnormal = biomarkers.filter((b) => b.status !== 'NORMAL');

    const hasLowHb = abnormal.some((b) => b.name.includes('Hemoglobin') && b.status === 'LOW');
    const hasHighWbc = abnormal.some((b) => b.name.includes('Leukocyte') || b.name.includes('WBC'));
    const hasHighGlucose = abnormal.some(
      (b) => (b.name.includes('Glucose') || b.name.includes('HbA1c')) && b.status === 'HIGH'
    );
    const hasKidneyIssue = abnormal.some(
      (b) => (b.name.includes('Creatinine') || b.name.includes('BUN') || b.name.includes('eGFR')) && b.status !== 'NORMAL'
    );
    const hasLipidIssue = abnormal.some(
      (b) => (b.name.includes('Cholesterol') || b.name.includes('Triglycerides') || b.name.includes('LDL')) && b.status === 'HIGH'
    );
    const hasLiverIssue = abnormal.some(
      (b) => (b.name.includes('ALT') || b.name.includes('AST') || b.name.includes('ALP')) && b.status === 'HIGH'
    );

    if (hasLowHb) {
      questions.push({
        question: 'Could my fatigue or low energy levels be related to my reduced hemoglobin count, and should we investigate iron or dietary factors?',
        context: 'Suggested based on your lower-than-normal Hemoglobin and Red Blood Cell levels.',
        priority: 'high',
      });
    }

    if (hasHighWbc) {
      questions.push({
        question: 'My white blood cell count is elevated. Does this indicate an active or recent infection, and should we run a follow-up test after a few weeks?',
        context: 'Suggested because your Total Leukocyte (WBC) count is above the normal reference range.',
        priority: 'high',
      });
    }

    if (hasHighGlucose) {
      questions.push({
        question: 'Given the elevated fasting glucose / HbA1c values, what personalized lifestyle or nutrition adjustments should we prioritize, and do I need a continuous monitoring plan?',
        context: 'Suggested based on elevated glycemic markers outside target range.',
        priority: 'high',
      });
    }

    if (hasKidneyIssue) {
      questions.push({
        question: 'My creatinine or filtration rate shows a slight deviation. Are there any hydration habits, over-the-counter pain medications, or dietary changes I should be cautious of?',
        context: 'Suggested to protect renal health based on kidney marker levels.',
        priority: 'medium',
      });
    }

    if (hasLipidIssue) {
      questions.push({
        question: 'My lipid profile shows elevated cholesterol/triglycerides. What cardiovascular risk assessment do you recommend, and how soon should we re-check after dietary adjustments?',
        context: 'Suggested based on out-of-range lipid parameters.',
        priority: 'medium',
      });
    }

    if (hasLiverIssue) {
      questions.push({
        question: 'My liver enzymes (ALT/AST) are slightly elevated. Could recent medications, supplements, or dietary factors be contributing to this temporary stress?',
        context: 'Suggested to understand hepatic enzyme variance.',
        priority: 'medium',
      });
    }

    // Default holistic questions
    questions.push({
      question: 'When would you like me to schedule a repeat test to monitor whether these biomarkers have stabilized?',
      context: 'Ensures a proactive timeline for long-term health tracking.',
      priority: 'general',
    });

    questions.push({
      question: 'Are there any specific warning symptoms I should watch for at home before our next scheduled appointment?',
      context: 'Empowers you to recognize early signals safely.',
      priority: 'general',
    });

    return questions;
  }
}
