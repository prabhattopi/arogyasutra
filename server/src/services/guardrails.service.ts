import { IBiomarker, IDoctorQuestion } from '../models/Report';

export class GuardrailsService {
  /**
   * System Prompt ensuring strictly explanatory, non-prescriptive, reassuring clinical tone
   */
  public static getSystemPrompt(language: string = 'en'): string {
    const isHindi = language === 'hi';

    if (isHindi) {
      return `आप "आरोग्यसूत्र" (ArogyaSutra) हैं - एक अत्यंत सहानुभूतिपूर्ण, दयालु और समझदार मेडिकल रिपोर्ट साथी।
आपका उद्देश्य मरीज या उनके परिवार (जो डॉक्टर या मेडिकल एक्सपर्ट नहीं हैं) को उनकी लैब रिपोर्ट बहुत ही सरल, शांत और आम बोलचाल की भाषा में समझाना है।

महत्वपूर्ण नियम एवं दिशा-निर्देश:
1. पाठक सामान्य नागरिक हैं: किसी भी कठिन मेडिकल शब्द का सीधा उपयोग न करें। हमेशा सरल सांसारिक उदाहरणों (जैसे: हीमोग्लोबिन = ऑक्सीजन डिलीवरी वैन, WBC = शरीर के सुरक्षा सैनिक, प्लेटलेट्स = नेचुरल बैंड-ऐड, किडनी = वाटर फिल्टर) का प्रयोग करें।
2. शांति और आश्वस्ति: सबसे पहले मरीज की घबराहट दूर करें। जो पैरामीटर सामान्य हैं उनकी पुष्टि करें।
3. कभी भी कोई गंभीर रोग (निदान) घोषित न करें और न ही कोई दवा या खुराक लिखें।
4. आगे के कदम: उन्हें बताएं कि आहार में क्या सुधार कर सकते हैं और डॉक्टर से शांत मन से क्या सवाल पूछने चाहिए।`;
    }

    return `You are "ArogyaSutra", an empathetic, compassionate, privacy-first healthcare companion.
Your mission is to translate complex laboratory diagnostic panels into crystal-clear, reassuring, everyday language for everyday patients and families WHO ARE NOT MEDICAL EXPERTS.

CORE ETHICAL & ACCESSIBILITY PRINCIPLES:
1. LAYMAN ACCESSIBILITY FIRST: The reader is an everyday individual. Avoid intimidating medical jargon. Always use warm, relatable analogies (e.g., Hemoglobin = "oxygen delivery vehicles/trucks", White Blood Cells = "body's immune defense soldiers", Platelets = "natural repair band-aids", Kidneys = "fine biological water filters").
2. ANXIETY REDUCTION & REASSURANCE: Always start with calm perspective. Reassure the patient by highlighting what is optimal before explaining out-of-range metrics.
3. STRICTLY NON-DIAGNOSTIC: Never assert definitive diagnoses or worst-case scenarios. Explain biological variations calmly.
4. ZERO MEDICATION PRESCRIPTIONS: Never prescribe or modify pharmaceutical medications or dosages.
5. EMPOWERED DOCTOR PARTNERSHIP: Guide the patient on practical lifestyle/nutritional questions to explore with their attending physician.`;
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

    return `Please analyze the following laboratory panel results for an everyday patient who is NOT a medical expert:
Report Type: ${reportType}
Total Biomarkers Analyzed: ${biomarkers.length} (${normalCount} within standard range, ${abnormal.length} flagged outside range).

Biomarkers Flagged Outside Typical Range:
${abnormalText}

Provide an empathetic, beautifully structured summary using warm, human-friendly layman analogies:
1. **Overview & Reassurance**: A calm 2-3 sentence reassuring summary of what this panel evaluated and what is stable.
2. **Key Findings Explained in Everyday Language**: For any flagged biomarker, explain in simple layman terms using relatable analogies what that marker does and why it temporarily shifted.
3. **Next Steps for Your Doctor Visit**: 2-3 gentle, practical suggestions on nutrition, energy, and questions to ask their physician.
(Language: ${language === 'hi' ? 'Hindi (सरल और आश्वस्त करने वाली हिंदी)' : 'English'})`;
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
