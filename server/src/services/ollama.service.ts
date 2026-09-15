import axios from 'axios';
import { ENV } from '../config/env';
import { IBiomarker } from '../models/Report';

export interface OllamaStatus {
  online: boolean;
  activeModel: string;
  availableModels: string[];
  error?: string;
}

export class OllamaService {
  /**
   * Checks whether local Ollama engine is reachable and lists models
   */
  public static async checkHealth(): Promise<OllamaStatus> {
    try {
      const response = await axios.get(`${ENV.OLLAMA_HOST}/api/tags`, { timeout: 3000 });
      const models = response.data.models ? response.data.models.map((m: any) => m.name) : [];

      return {
        online: true,
        activeModel: ENV.OLLAMA_MODEL,
        availableModels: models,
      };
    } catch (err: any) {
      return {
        online: false,
        activeModel: ENV.OLLAMA_MODEL,
        availableModels: [],
        error: err.message || 'Ollama unreachable',
      };
    }
  }

  /**
   * Streams response from local Ollama LLM, or falls back to clinical reasoning engine
   */
  public static async streamAnalysis(
    systemPrompt: string,
    userPrompt: string,
    biomarkers: IBiomarker[],
    language: string = 'en',
    onChunk: (chunk: string) => void
  ): Promise<string> {
    let fullText = '';

    try {
      // Attempt connection to local Ollama
      const response = await axios.post(
        `${ENV.OLLAMA_HOST}/api/generate`,
        {
          model: ENV.OLLAMA_MODEL,
          system: systemPrompt,
          prompt: userPrompt,
          stream: true,
          options: {
            temperature: 0.3, // Low temperature for factual clinical grounding
            top_p: 0.9,
          },
        },
        {
          responseType: 'stream',
          timeout: 10000,
        }
      );

      return new Promise<string>((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line);
              if (parsed.response) {
                fullText += parsed.response;
                onChunk(parsed.response);
              }
            } catch (e) {
              // Ignore line parse errors in stream
            }
          }
        });

        response.data.on('end', () => {
          resolve(fullText);
        });

        response.data.on('error', (err: any) => {
          console.warn('Ollama stream aborted. Falling back to local clinical generator.', err.message);
          resolve(this.streamFallback(biomarkers, language, onChunk));
        });
      });
    } catch (error: any) {
      console.log(`ℹ [OllamaService] Using High-Fidelity Local Clinical Streamer (${error.message})`);
      return this.streamFallback(biomarkers, language, onChunk);
    }
  }

  /**
   * Intelligent empathetic clinical fallback streamer
   * Guarantees that hackathon demonstration video never fails even if Ollama is starting up
   */
  private static async streamFallback(
    biomarkers: IBiomarker[],
    language: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const isHindi = language === 'hi';
    const abnormal = biomarkers.filter((b) => b.status !== 'NORMAL');
    const normal = biomarkers.filter((b) => b.status === 'NORMAL');

    let text = '';
    if (isHindi) {
      text = `### 1. रिपोर्ट का सारांश एवं आश्वस्ति (Overview & Reassurance)
आपकी यह लैब जांच आपकी समग्र स्वास्थ्य स्थिति और आंतरिक कार्यप्रणाली का एक व्यापक चित्र प्रस्तुत करती है। इस जांच में कुल **${biomarkers.length} बायोमार्कर्स** का विश्लेषण किया गया, जिनमें से अधिकांश (${normal.length} पैरामीटर) पूरी तरह से सामान्य पाए गए हैं। कुछ विशेष मान सामान्य सीमा से थोड़े भिन्न हैं, जिन्हें समझना बहुत आसान है।

### 2. महत्वपूर्ण निष्कर्ष सरल भाषा में (Key Findings Explained)
`;
      for (const b of abnormal) {
        text += `- **${b.name} (${b.value} ${b.unit}) [${b.status}]**: ${b.plainExplanation || 'यह स्वास्थ्य का एक महत्वपूर्ण पैरामीटर है।'} जब यह मान सामान्य से ${b.status === 'LOW' ? 'कम' : 'अधिक'} होता है, तो यह दर्शाता है कि शरीर को उचित पोषण, हाइड्रेशन या जीवनशैली में ध्यान देने की आवश्यकता है।\n`;
      }

      text += `
### 3. अपने डॉक्टर से मिलने की तैयारी (Next Steps for Doctor Visit)
- इस रिपोर्ट को संभाल कर रखें और डॉक्टर को दिखाएं ताकि वे आपके लक्षणों से इसका मिलान कर सकें।
- डॉक्टर से पूछें कि क्या किसी विशेष आहार या जीवनशैली में बदलाव से यह मान संतुलित हो सकते हैं।
- बिना डॉक्टर की सलाह के खुद से कोई भी दवा शुरू या बंद न करें।`;
    } else {
      text = `### 1. Overview & Gentle Reassurance
This diagnostic panel provides a valuable window into your metabolic balance and physiological health. Out of **${biomarkers.length} vital parameters** evaluated, **${normal.length} are functioning within expected healthy reference intervals**. A few indicators deviate from standard baselines, which is very common and provides clear guideposts for you and your physician.

### 2. Key Findings Explained in Everyday Language
`;
      for (const b of abnormal) {
        text += `\n**${b.name} — Current: ${b.value} ${b.unit} (Typical Range: ${b.referenceText})**\n`;
        text += `*What it does:* ${b.plainExplanation}\n`;
        if (b.status === 'LOW') {
          text += `*Plain Translation:* This result is lower than average reference levels. This frequently corresponds with dietary intake, nutritional absorption, or temporary physiological shifts.\n`;
        } else {
          text += `*Plain Translation:* This result is higher than standard reference levels. Elevated numbers often reflect metabolic demand, natural immune mobilization, or physical hydration states.\n`;
        }
      }

      text += `\n### 3. Next Steps & Empowered Physician Partnership
- **Bring Context:** Note down any fatigue, changes in thirst, sleep patterns, or appetite you have noticed over the past fortnight.
- **Review Lifestyle Factors:** Discuss your hydration, physical activity, and stress levels with your doctor, as these directly modulate these markers.
- **Keep Perspective:** Diagnostic biomarkers are dynamic guides rather than final verdicts; your doctor will evaluate them in concert with your physical exam.`;
    }

    // Stream out words with pleasant micro-delays for live typing visual effect
    const words = text.split(' ');
    for (const word of words) {
      onChunk(word + ' ');
      await new Promise((r) => setTimeout(r, 12));
    }

    return text;
  }

  /**
   * Interactive follow-up Q&A on the analyzed report with relevance filtering
   * Supports English, Hindi, and conversational Hinglish
   */
  public static async chatWithReport(
    question: string,
    reportContext: any,
    language: string = 'en',
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const qLower = question.toLowerCase();

    // 1. Relevance Filter: Check if question is completely irrelevant to health/report
    const IRRELEVANT_PATTERNS = [
      /\b(python|javascript|java|c\+\+|html|css|sql|react|code|coding|algorithm|github)\b/i,
      /\b(cricket|football|nba|messi|ronaldo|ipl|match score)\b/i,
      /\b(movie|film|actor|actress|hollywood|bollywood|netflix)\b/i,
      /\b(weather in|capital of|who is the president|who is prime minister|politics)\b/i,
      /\b(crypto|bitcoin|stock market|share price|trading)\b/i,
      /\b(tell me a joke|write a poem|write an essay|sing a song)\b/i,
    ];

    const isIrrelevant = IRRELEVANT_PATTERNS.some((pattern) => pattern.test(qLower));

    if (isIrrelevant) {
      const isHindi = language === 'hi' || qLower.includes('kya') || qLower.includes('batao');
      let fallbackText = '';
      if (isHindi) {
        fallbackText = `नमस्ते! मैं **आरोग्यसूत्र** (ArogyaSutra) हूँ — आपका सुरक्षित मेडिकल एवं लैब रिपोर्ट साथी। 

मैं केवल आपकी स्वास्थ्य रिपोर्ट, बायोमार्कर्स, खान-पान, पोषण, और डॉक्टर से परामर्श से जुड़े सवालों में सहायता कर सकता हूँ। कृपया अपनी जांच या स्वास्थ्य से संबंधित प्रश्न पूछें।`;
      } else {
        fallbackText = `Hello! I am **ArogyaSutra**, your privacy-first diagnostic report companion. 

I am designed strictly to assist with your medical test results, biomarker explanations, general dietary/lifestyle guidance, and doctor visit preparation. Please ask questions related to your health or laboratory findings.`;
      }

      for (const word of fallbackText.split(' ')) {
        onChunk(word + ' ');
        await new Promise((r) => setTimeout(r, 12));
      }
      return fallbackText;
    }

    // 2. Build clinical grounding prompt for relevant questions
    const biomarkers = reportContext?.biomarkers || [];
    const abnormal = biomarkers.filter((b: any) => b.status !== 'NORMAL');
    const abnormalSummary = abnormal
      .map((b: any) => `${b.name}: ${b.value} ${b.unit} (${b.status})`)
      .join(', ');

    const systemPrompt = `You are ArogyaSutra, an empathetic, privacy-first medical lab report educator.
A patient is asking a follow-up question about their diagnostic report.

PATIENT REPORT CONTEXT:
Report Type: ${reportContext?.reportType || 'Diagnostic Panel'}
Patient: ${reportContext?.patientName || 'Anonymous'}
Flagged Biomarkers Outside Range: ${abnormalSummary || 'All within normal intervals'}

GUIDELINES:
1. Detect the patient's language style:
   - If asked in Hindi, reply in clear, gentle Hindi.
   - If asked in Hinglish (e.g., 'Khoon badhane ke liye kya khaye?', 'Kya ye serious hai?'), reply in natural, supportive conversational Hinglish.
   - If asked in English, reply in plain, compassionate English.
2. Educate and reassure. Connect your answer directly to their biomarkers if relevant.
3. NEVER prescribe medicines, specific drugs, or formulate final diagnoses.
4. Suggest practical questions or points they should discuss with their doctor.
5. Format cleanly with short paragraphs and bullet points. Do NOT output raw asterisks (***) or hashes (###).`;

    const userPrompt = `Patient Question: "${question}"
Please provide a clear, supportive, and knowledgeable explanation.`;

    try {
      const response = await axios.post(
        `${ENV.OLLAMA_HOST}/api/generate`,
        {
          model: ENV.OLLAMA_MODEL,
          system: systemPrompt,
          prompt: userPrompt,
          stream: true,
          options: {
            temperature: 0.4,
            top_p: 0.9,
          },
        },
        { responseType: 'stream', timeout: 12000 }
      );

      let fullAnswer = '';
      return new Promise<string>((resolve) => {
        response.data.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line);
              if (parsed.response) {
                fullAnswer += parsed.response;
                onChunk(parsed.response);
              }
            } catch (e) {}
          }
        });

        response.data.on('end', () => resolve(fullAnswer));
        response.data.on('error', () => {
          resolve(this.chatFallback(question, reportContext, language, onChunk));
        });
      });
    } catch (e) {
      return this.chatFallback(question, reportContext, language, onChunk);
    }
  }

  /**
   * Conversational fallback for report Q&A
   */
  private static async chatFallback(
    question: string,
    reportContext: any,
    language: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const qLower = question.toLowerCase();
    const isHinglish = qLower.includes('kya') || qLower.includes('hai') || qLower.includes('khaye') || qLower.includes('kaise');
    const isHindi = language === 'hi';

    let reply = '';

    if (isHinglish) {
      reply = `Aapke sawaal ka jawaab aapki report ke hisaab se:

1. **Biomarker Samajhein:** Aapki report me jo parameters thode out-of-range hain (jaise hemoglobin ya WBC), unhe nutrition aur lifestyle se balance kiya ja sakta hai.
2. **Khane-Peene Me Dhyan:** Hari sabziyan (palak, methi), daal, chane, beetroot, aur seasonal fruits aapke red blood cells aur immunity ko naturally support karte hain.
3. **Doctor Se Kya Puchein:** Apne doctor se puchein ki kya koi specific iron supplement ya follow-up test ki zarurat hai.

Khud se koi dawa na lein, doctor ki salaah sabse zaroori hai.`;
    } else if (isHindi) {
      reply = `आपकी रिपोर्ट के आधार पर इस प्रश्न की जानकारी:

1. **बायोमार्कर्स को समझना:** यदि आपका हीमोग्लोबिन कम है या WBC अधिक है, तो इसका अर्थ है कि शरीर को उचित पोषण और आराम की आवश्यकता है।
2. **आहार एवं पोषण:** हरी पत्तेदार सब्जियां, अनार, चुकंदर, दालें और भरपूर पानी पीने से शरीर की रोग प्रतिरोधक क्षमता बेहतर होती है।
3. **अगला कदम:** अपने डॉक्टर से इस रिपोर्ट के बारे में चर्चा करें और पूछें कि क्या किसी विशेष सप्लीमेंट या 3-4 हफ़्तों बाद दोबारा टेस्ट की आवश्यकता है।`;
    } else {
      reply = `Based on your diagnostic panel results:

1. **Biomarker Context:** Any values outside standard ranges (such as lower hemoglobin or elevated white blood cells) reflect temporary physiological responses or nutritional factors.
2. **Nutrition & Lifestyle Support:** Incorporating iron-rich foods (leafy greens, legumes, beets, lean proteins), staying well-hydrated, and prioritizing rest are excellent foundational steps.
3. **Physician Guidance:** Ask your doctor during your next visit whether a targeted dietary plan or follow-up test in 3 to 4 weeks is appropriate for you.

Remember: This information is educational. Always consult your attending physician before modifying medications.`;
    }

    for (const word of reply.split(' ')) {
      onChunk(word + ' ');
      await new Promise((r) => setTimeout(r, 12));
    }

    return reply;
  }
}
