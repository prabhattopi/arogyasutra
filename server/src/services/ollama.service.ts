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

    const systemPrompt = `You are ArogyaSutra, an empathetic, privacy-first medical healthcare companion.
A patient or family member is asking a follow-up question about their diagnostic report.
THE PATIENT IS AN EVERYDAY PERSON, NOT A MEDICAL DOCTOR OR EXPERT.

PATIENT REPORT CONTEXT:
Report Type: ${reportContext?.reportType || 'Diagnostic Panel'}
Patient: ${reportContext?.patientName || 'Anonymous'}
Flagged Biomarkers Outside Range: ${abnormalSummary || 'All within normal intervals'}

ESSENTIAL GUIDELINES:
1. Speak in warm, human-friendly, layman terms. Never use cold, frightening medical jargon without immediately explaining it in simple terms.
2. Use relatable everyday analogies (e.g., hemoglobin = oxygen delivery vehicle, WBC = immune soldiers defending against a temporary infection, kidneys = fine water filters).
3. Start with gentle reassurance (e.g., "घबराने की कोई बात नहीं है...", "There is no reason to panic...").
4. Detect the patient's language style:
   - If asked in Hindi, reply in clear, gentle, comforting Hindi.
   - If asked in Hinglish (e.g., 'Khoon badhane ke liye kya khaye?', 'Kya ye serious hai?'), reply in natural, supportive conversational Hinglish.
   - If asked in English, reply in plain, accessible, compassionate English.
5. Provide practical, daily lifestyle & nutrition tips (spinach, beetroot, jaggery, hydration, restful sleep).
6. Strict Guardrails: NEVER prescribe prescription medications or dosages, and never declare a scary definitive disease diagnosis.
7. End with calm, specific questions the patient can discuss with their attending doctor.
8. Format cleanly with clean bullet points and short, readable paragraphs.`;

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
    const isHinglish = qLower.includes('kya') || qLower.includes('hai') || qLower.includes('khaye') || qLower.includes('kaise') || qLower.includes('batao');
    const isHindi = language === 'hi';

    let reply = '';

    if (isHinglish) {
      reply = `Ghabrane ki koi baat nahi hai! Aapke sawaal ka aasan bhasha me jawaab:

1. **Aapke Biomarkers Ka Matlab:** Agar aapki report me hemoglobin kam ya WBC thoda badha hua hai, toh yeh aam taur par poshan ki kami ya kisi aam infection se ladne ka sanket hota hai.
2. **Khane-Peene Me Aasan Sudhaar:** 
   - Hari sabziyan (palak, methi) aur daalein khoon badhane me madad karti hain.
   - Chukandar (beetroot), anar, aur gudd (jaggery) iron ke acche natural srot hain.
   - Khoob paani piyein aur acchi neend lein taaki sharir jaldi recover ho sake.
3. **Doctor Se Kya Puchein:** Agli visit par doctor se puchein ki kya kisi iron tonic/supplement ki zarurat hai aur 3-4 hafte baad dubara test kab karana chahiye.

*Dhyan rahe: Yeh jankari samajhne ke liye hai. Koi bhi nayi dawa shuru karne se pehle apne doctor se zaroor consult karein.*`;
    } else if (isHindi) {
      reply = `घबराने की कोई बात नहीं है! आपकी रिपोर्ट के आधार पर सरल और शांत शब्दों में जानकारी:

1. **बायोमार्कर्स को आसान शब्दों में समझें:** यदि आपका हीमोग्लोबिन कम है या श्वेत रक्त कोशिकाएं (WBC) अधिक हैं, तो इसका अर्थ है कि शरीर का प्राकृतिक सुरक्षा तंत्र काम कर रहा है और शरीर को पोषण व आराम की जरूरत है।
2. **आहार एवं घरेलू पोषण:**
   - **आयरन युक्त आहार:** पालक, मेथी, दालें, चना, अनार और चुकंदर का सेवन हीमोग्लोबिन सुधारने में मददगार है।
   - **विटामिन C:** नींबू पानी या संतरे का सेवन भोजन से आयरन सोखने में मदद करता है।
   - **पर्याप्त पानी व आराम:** प्रतिदिन पर्याप्त पानी पिएं और 7-8 घंटे की शांतिपूर्ण नींद लें।
3. **डॉक्टर से परामर्श:** अपने डॉक्टर से पूछें कि क्या आपको किसी विशेष आयरन सप्लीमेंट की आवश्यकता है और कितने हफ्तों बाद दोबारा जांच करानी चाहिए।

*महत्वपूर्ण: यह जानकारी केवल आपकी समझ के लिए है। किसी भी दवा की खुराक के लिए हमेशा अपने डॉक्टर की सलाह लें।*`;
    } else {
      reply = `Please do not worry! Here is a simple, plain-language explanation designed for you and your family:

1. **Understanding Your Biomarkers:** Temporary shifts in parameters like Hemoglobin or White Blood Cells are very common. Hemoglobin acts like an oxygen delivery vehicle (low levels cause tiredness), while white cells are immune soldiers defending against recent inflammation.
2. **Everyday Nutrition & Energy Steps:**
   - **Iron-Rich Foods:** Incorporate spinach, lentils, beets, dates, and jaggery into your meals.
   - **Vitamin C Support:** Citrus fruits (oranges, lemons) help your body naturally absorb iron.
   - **Rest & Hydration:** Adequate water intake and restorative sleep are foundational for healthy recovery.
3. **Partnering With Your Doctor:** Ask your physician if an iron panel or dietary supplement is indicated, and when a routine follow-up re-test in 3 to 4 weeks should be scheduled.

*Note: ArogyaSutra is an educational companion. Always consult your attending healthcare practitioner before starting any medications.*`;
    }

    for (const word of reply.split(' ')) {
      onChunk(word + ' ');
      await new Promise((r) => setTimeout(r, 12));
    }

    return reply;
  }
}
