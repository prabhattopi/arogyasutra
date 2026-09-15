import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, RefreshCw, AlertCircle, Sparkles, MessageSquare, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Biomarker } from '../types/report';
import { streamChatWithReport } from '../services/api';
import { LanguageCode } from '../i18n/translations';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface CenteredChatProps {
  biomarkers: Biomarker[];
  patientName?: string;
  reportType?: string;
  language: LanguageCode;
  hasAnalyzedReport: boolean;
  reportId?: string;
}

export const CenteredChat: React.FC<CenteredChatProps> = ({
  biomarkers,
  patientName,
  reportType,
  language,
  hasAnalyzedReport,
  reportId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef<boolean>(true);

  // Dynamic grounded suggestions
  const generateInitialSuggestions = () => {
    const list: string[] = [];
    const hasLowHb = biomarkers.some(
      (b) => b.name.toLowerCase().includes('hemoglobin') && b.status === 'LOW'
    );
    const hasHighWbc = biomarkers.some(
      (b) =>
        (b.name.toLowerCase().includes('leukocyte') || b.name.toLowerCase().includes('wbc')) &&
        b.status === 'HIGH'
    );
    const hasHighGlucose = biomarkers.some(
      (b) =>
        (b.name.toLowerCase().includes('glucose') || b.name.toLowerCase().includes('hba1c')) &&
        b.status === 'HIGH'
    );
    const hasHighCholesterol = biomarkers.some(
      (b) =>
        (b.name.toLowerCase().includes('cholesterol') ||
          b.name.toLowerCase().includes('triglyceride')) &&
        b.status === 'HIGH'
    );
    const hasKidneyStress = biomarkers.some(
      (b) =>
        (b.name.toLowerCase().includes('creatinine') || b.name.toLowerCase().includes('bun')) &&
        b.status === 'HIGH'
    );

    if (language === 'hi') {
      if (hasLowHb) list.push('हीमोग्लोबिन सुधारने के लिए क्या खाना चाहिए?');
      if (hasHighWbc) list.push('क्या WBC की यह वृद्धि चिंताजनक है?');
      if (hasHighGlucose) list.push('ब्लड शुगर को नियंत्रित करने के आसान उपाय क्या हैं?');
      if (hasHighCholesterol) list.push('कोलेस्ट्रॉल कम करने के लिए कौन से बदलाव करें?');
      if (hasKidneyStress) list.push('किडनी की सुरक्षा के लिए खान-पान के क्या नियम हैं?');
      list.push('डॉक्टर से परामर्श के लिए सबसे महत्वपूर्ण सवाल क्या हैं?');
    } else {
      if (hasLowHb) list.push('What natural foods help restore healthy hemoglobin levels?');
      if (hasHighWbc) list.push('Does this elevated white blood cell count indicate active infection?');
      if (hasHighGlucose) list.push('What dietary changes help stabilize my blood glucose?');
      if (hasHighCholesterol) list.push('How can I lower my cholesterol through diet and lifestyle?');
      if (hasKidneyStress) list.push('What precautions should I take for kidney and creatinine health?');
      list.push('What key questions should I prioritize with my doctor?');
    }

    return list.slice(0, 4);
  };

  // Reset or initialize on report switch or language change
  useEffect(() => {
    if (hasAnalyzedReport) {
      const welcomeText =
        language === 'hi'
          ? `नमस्ते! मैंने आपकी **${reportType || 'लैब रिपोर्ट'}** का विश्लेषण पूरा कर लिया है। आप रिपोर्ट के किसी भी बायोमार्कर, आहार, या डॉक्टर परामर्श के बारे में हिंदी, English या Hinglish में सवाल पूछ सकते हैं।`
          : `Hello! I have reviewed your **${reportType || 'diagnostic report'}** for ${patientName || 'the patient'}. Feel free to ask any questions regarding your biomarkers, dietary recommendations, warning signs, or doctor consultation in English, Hindi, or Hinglish.`;

      setMessages([
        {
          id: 'welcome-' + Date.now(),
          sender: 'assistant',
          text: welcomeText,
          timestamp: 'Just now',
        },
      ]);
      setCurrentSuggestions(generateInitialSuggestions());
      setStreamingAnswer('');
    } else {
      setMessages([]);
      setCurrentSuggestions([]);
    }
  }, [reportId, hasAnalyzedReport, language]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
  };

  useEffect(() => {
    if (scrollContainerRef.current && isNearBottomRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, streamingAnswer]);

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || input).trim();
    if (!q || isStreaming || !hasAnalyzedReport) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setStreamingAnswer('');
    isNearBottomRef.current = true;

    const reportContext = {
      patientName,
      reportType,
      biomarkers,
    };

    await streamChatWithReport(
      { question: q, report: reportContext, language },
      {
        onToken: (token) => {
          setStreamingAnswer((prev) => prev + token);
        },
        onComplete: (fullAnswer) => {
          setIsStreaming(false);
          setMessages((prev) => [
            ...prev,
            {
              id: 'ai-' + Date.now(),
              sender: 'assistant',
              text: fullAnswer,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setStreamingAnswer('');

          // Contextual suggestions evolution
          const qLower = q.toLowerCase();
          if (
            qLower.includes('food') ||
            qLower.includes('diet') ||
            qLower.includes('khana') ||
            qLower.includes('eat') ||
            qLower.includes('aahar')
          ) {
            setCurrentSuggestions(
              language === 'hi'
                ? [
                    'किन खाद्य पदार्थों से परहेज करना चाहिए?',
                    'क्या कोई सप्लीमेंट लेना सुरक्षित है?',
                    'आहार में बदलाव के बाद टेस्ट कब दोहराएं?',
                  ]
                : [
                    'What foods should I strictly avoid?',
                    'Are supplements recommended for this?',
                    'When should I re-test after dietary changes?',
                  ]
            );
          } else if (
            qLower.includes('wbc') ||
            qLower.includes('infection') ||
            qLower.includes('serious') ||
            qLower.includes('chinta')
          ) {
            setCurrentSuggestions(
              language === 'hi'
                ? [
                    'घर पर किन चेतावनी लक्षणों पर ध्यान देना चाहिए?',
                    'क्या इसके लिए एंटीबायोटिक्स की जरूरत है?',
                    'डॉक्टर से क्या पूछें?',
                  ]
                : [
                    'What warning symptoms should I monitor at home?',
                    'Does this usually require prescription medication?',
                    'What should I report to my doctor?',
                  ]
            );
          } else if (
            qLower.includes('sugar') ||
            qLower.includes('glucose') ||
            qLower.includes('diabetes')
          ) {
            setCurrentSuggestions(
              language === 'hi'
                ? [
                    'भोजन के बाद का शुगर स्तर क्या होना चाहिए?',
                    'व्यायाम से शुगर पर क्या असर पड़ता है?',
                    'HbA1c टेस्ट कब दोहराएं?',
                  ]
                : [
                    'What should my post-meal target be?',
                    'How does exercise affect these readings?',
                    'When should I schedule an HbA1c re-test?',
                  ]
            );
          } else {
            setCurrentSuggestions(
              language === 'hi'
                ? [
                    'डॉक्टर से परामर्श के लिए शीर्ष सवाल?',
                    'अगली जांच की सही समय-सीमा क्या है?',
                    'रिपोर्ट में कोई अन्य जोखिम तो नहीं?',
                  ]
                : [
                    'Top questions for my physician appointment?',
                    'When should I schedule a follow-up test?',
                    'Are there any related biomarkers to monitor?',
                  ]
            );
          }
        },
        onError: (err) => {
          setIsStreaming(false);
          setMessages((prev) => [
            ...prev,
            {
              id: 'err-' + Date.now(),
              sender: 'assistant',
              text: `⚠️ Error: ${err}`,
              timestamp: 'Now',
            },
          ]);
          setStreamingAnswer('');
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full rounded-2xl bg-[#080d18] border border-teal-500/30 shadow-2xl overflow-hidden flex flex-col h-[640px] max-h-[82vh] backdrop-blur-2xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-800/80 bg-[#0b1322]/90">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>ArogyaSutra Copilot</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                Air-Gapped LLM
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {hasAnalyzedReport ? (
                <span>
                  Active Report: <strong className="text-slate-200">{reportType}</strong> · Subject:{' '}
                  <strong className="text-slate-200">{patientName}</strong>
                </span>
              ) : (
                language === 'hi' ? 'रिपोर्ट विश्लेषण की प्रतीक्षा...' : 'Awaiting Report Demystification'
              )}
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{language === 'hi' ? 'ऑन-डिवाइस सुरक्षित' : 'On-Device Secure'}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-200"
      >
        {!hasAnalyzedReport ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              {language === 'hi' ? 'पहले किसी रिपोर्ट का विश्लेषण करें' : 'Demystify a Diagnostic Report First'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              {language === 'hi'
                ? 'कृपया ऊपर दिए गए टेस्ट नमूनों में से एक चुनें या अपनी PDF/TXT रिपोर्ट अपलोड करें। इसके बाद AI साथी आपके बायोमार्कर्स के आधार पर सवालों का विस्तृत उत्तर देगा।'
                : 'Select one of the 1-click verified test cases above (CBC, Metabolic Panel, or Lipid Panel) or upload your lab report. The Copilot will answer any biomarker inquiry with 100% on-device privacy.'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${
                  m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-sm'
                      : 'bg-slate-900 border border-teal-500/30 text-teal-300'
                  }`}
                >
                  {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-teal-500/15 border border-teal-500/30 text-teal-100 text-xs sm:text-sm'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 text-xs sm:text-sm shadow-md'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <MarkdownRenderer content={m.text} />
                  )}
                  <span className="block text-[10px] text-slate-500 mt-2 text-right">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-slate-900 border border-teal-500/30 text-teal-400 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 bg-slate-900/90 border border-slate-800 text-slate-200 text-xs sm:text-sm shadow-md">
                  <MarkdownRenderer content={streamingAnswer} isStreaming={true} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Grounded Suggestions Stack with Hide/Open Toggle */}
      {hasAnalyzedReport && currentSuggestions.length > 0 && !isStreaming && (
        <div className="px-5 py-2.5 bg-[#090f1d]/95 border-t border-slate-800 transition-all">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition cursor-pointer group"
              title={isSuggestionsOpen ? 'Hide suggestions' : 'Open suggestions'}
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-400 group-hover:rotate-12 transition" />
              <span>
                {language === 'hi'
                  ? 'सुझाए गए प्रश्न'
                  : 'Suggested Questions'}
              </span>
              <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/25">
                {currentSuggestions.length}
              </span>
            </button>

            {/* Small icon button to hide / open suggestions */}
            <button
              type="button"
              onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
              className="p-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-teal-300 transition cursor-pointer flex items-center gap-1 text-[11px]"
              title={isSuggestionsOpen ? 'Hide Suggestions' : 'Open Suggestions'}
            >
              <span className="hidden sm:inline text-[10px]">
                {isSuggestionsOpen
                  ? (language === 'hi' ? 'छुपाएं' : 'Hide')
                  : (language === 'hi' ? 'खोलें' : 'Open')}
              </span>
              {isSuggestionsOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-teal-400" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5 text-teal-400" />
              )}
            </button>
          </div>

          {/* Collapsible Suggestions Body */}
          {isSuggestionsOpen && (
            <div className="flex flex-col gap-1.5 mt-2.5 max-h-48 overflow-y-auto pr-1 animate-in fade-in duration-150">
              {currentSuggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(s)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 hover:border-teal-500/50 text-slate-200 hover:text-teal-200 transition flex items-center justify-between group cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                    <span className="leading-snug">{s}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Message Input Footer */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#070c18]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!hasAnalyzedReport || isStreaming}
            placeholder={
              !hasAnalyzedReport
                ? language === 'hi'
                  ? 'कृपया पहले ऊपर रिपोर्ट का विश्लेषण करें...'
                  : 'Demystify a report above first to start conversation...'
                : language === 'hi'
                ? 'हिंदी, English या Hinglish में अपने सवाल पूछें...'
                : 'Ask questions about your biomarkers in English/Hindi/Hinglish...'
            }
            className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/60 disabled:opacity-40 disabled:cursor-not-allowed transition"
          />

          <button
            type="submit"
            disabled={!input.trim() || !hasAnalyzedReport || isStreaming}
            className="h-11 px-5 rounded-2xl btn-primary-teal text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isStreaming ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>{language === 'hi' ? 'भेजें' : 'Send'}</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
