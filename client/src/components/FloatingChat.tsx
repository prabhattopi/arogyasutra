import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
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

interface FloatingChatProps {
  biomarkers: Biomarker[];
  patientName?: string;
  reportType?: string;
  language: LanguageCode;
  hasAnalyzedReport: boolean;
  reportId?: string;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({
  biomarkers,
  patientName,
  reportType,
  language,
  hasAnalyzedReport,
  reportId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef<boolean>(true);

  // Generate dynamic inquiries grounded specifically in the report's biomarkers
  const generateInitialSuggestions = () => {
    const list: string[] = [];
    const hasLowHb = biomarkers.some((b) => b.name.toLowerCase().includes('hemoglobin') && b.status === 'LOW');
    const hasHighWbc = biomarkers.some((b) => (b.name.toLowerCase().includes('leukocyte') || b.name.toLowerCase().includes('wbc')) && b.status === 'HIGH');
    const hasHighGlucose = biomarkers.some((b) => (b.name.toLowerCase().includes('glucose') || b.name.toLowerCase().includes('hba1c')) && b.status === 'HIGH');
    const hasHighCholesterol = biomarkers.some((b) => (b.name.toLowerCase().includes('cholesterol') || b.name.toLowerCase().includes('triglyceride')) && b.status === 'HIGH');
    const hasKidneyStress = biomarkers.some((b) => (b.name.toLowerCase().includes('creatinine') || b.name.toLowerCase().includes('bun')) && b.status === 'HIGH');

    if (language === 'hi') {
      if (hasLowHb) list.push('हीमोग्लोबिन सुधारने के लिए क्या खाना चाहिए?');
      if (hasHighWbc) list.push('क्या WBC की यह वृद्धि चिंताजनक है?');
      if (hasHighGlucose) list.push('ब्लड शुगर को नियंत्रित करने के आसान उपाय क्या हैं?');
      if (hasHighCholesterol) list.push('कोलेस्ट्रॉल कम करने के लिए कौन से बदलाव करें?');
      if (hasKidneyStress) list.push('किडनी की सुरक्षा के लिए पानी और खान-पान के क्या नियम हैं?');
      list.push('डॉक्टर से परामर्श के लिए सबसे महत्वपूर्ण सवाल क्या हैं?');
    } else {
      if (hasLowHb) list.push('What natural foods help restore healthy hemoglobin levels?');
      if (hasHighWbc) list.push('Does this elevated white blood cell count indicate active infection?');
      if (hasHighGlucose) list.push('What dietary changes help stabilize my blood glucose?');
      if (hasHighCholesterol) list.push('How can I lower my cholesterol through diet and lifestyle?');
      if (hasKidneyStress) list.push('What precautions should I take for kidney and creatinine health?');
      list.push('What key questions should I prioritize with my doctor?');
    }

    return list.slice(0, 3);
  };

  // Auto-refresh chat whenever a new report is demystified or language changes
  useEffect(() => {
    if (hasAnalyzedReport) {
      const welcomeText =
        language === 'hi'
          ? `नमस्ते! मैंने आपकी **${reportType || 'लैब रिपोर्ट'}** का विश्लेषण पूरा कर लिया है। आप रिपोर्ट के किसी भी बायोमार्कर, आहार, या डॉक्टर परामर्श के बारे में हिंदी, English या Hinglish में सवाल पूछ सकते हैं।`
          : `Hello! I have reviewed your **${reportType || 'diagnostic report'}**. Feel free to ask any questions regarding your biomarkers, dietary recommendations, or doctor consultation in English, Hindi, or Hinglish.`;

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
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 60;
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

          // Dynamically evolve follow-up suggested inquiries according to current discussion topic
          const qLower = q.toLowerCase();
          if (qLower.includes('food') || qLower.includes('diet') || qLower.includes('khana') || qLower.includes('eat') || qLower.includes('aahar')) {
            setCurrentSuggestions(
              language === 'hi'
                ? ['किन खाद्य पदार्थों से परहेज करना चाहिए?', 'क्या कोई विटामिन सप्लीमेंट लेना सुरक्षित है?', 'आहार में बदलाव के बाद टेस्ट कब दोहराएं?']
                : ['What foods should I strictly avoid?', 'Are supplements recommended for this?', 'When should I re-test after dietary changes?']
            );
          } else if (qLower.includes('wbc') || qLower.includes('infection') || qLower.includes('serious') || qLower.includes('chinta') || qLower.includes('alarming')) {
            setCurrentSuggestions(
              language === 'hi'
                ? ['घर पर किन चेतावनी लक्षणों पर ध्यान देना चाहिए?', 'क्या इसके लिए एंटीबायोटिक्स की जरूरत है?', 'डॉक्टर से क्या पूछें?']
                : ['What warning symptoms should I monitor at home?', 'Does this usually require prescription medication?', 'What should I report to my doctor?']
            );
          } else if (qLower.includes('sugar') || qLower.includes('glucose') || qLower.includes('diabetes') || qLower.includes('hba1c')) {
            setCurrentSuggestions(
              language === 'hi'
                ? ['भोजन के बाद का शुगर स्तर क्या होना चाहिए?', 'पैदल चलने से शुगर पर क्या असर पड़ता है?', 'HbA1c टेस्ट कब दोहराएं?']
                : ['What should my post-meal target be?', 'How does exercise affect these readings?', 'When should I schedule an HbA1c re-test?']
            );
          } else if (qLower.includes('cholesterol') || qLower.includes('lipid') || qLower.includes('heart') || qLower.includes('dil')) {
            setCurrentSuggestions(
              language === 'hi'
                ? ['खाना पकाने के लिए कौन सा तेल सबसे अच्छा है?', 'क्या यह ब्लड प्रेशर से जुड़ा है?', 'कोलेस्ट्रॉल कम करने के लिए व्यायाम के नियम?']
                : ['What cooking oils are safest for heart health?', 'Is this linked to blood pressure?', 'What exercise routine helps lower LDL?']
            );
          } else {
            setCurrentSuggestions(
              language === 'hi'
                ? ['डॉक्टर से परामर्श के लिए शीर्ष 3 सवाल?', 'अगली जांच की सही समय-सीमा क्या है?', 'रिपोर्ट में कोई अन्य जोखिम तो नहीं?']
                : ['Top questions for my physician appointment?', 'When should I schedule a follow-up test?', 'Are there any related biomarkers to monitor?']
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
    <>
      {/* Floating Action Pill Button with Glowing Teal Accent */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#0a101f] hover:bg-[#0f172a] text-white border border-teal-500/40 shadow-2xl shadow-teal-500/15 transition-all duration-200 hover:scale-105 active:scale-95 hover:border-teal-300 cursor-pointer"
        title="Open ArogyaSutra AI Companion Chat"
      >
        <div className="relative">
          <MessageSquare className="h-5 w-5 text-teal-400" />
          {hasAnalyzedReport && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </div>
        <span className="text-xs sm:text-sm font-semibold tracking-wide">
          {isOpen
            ? (language === 'hi' ? 'चैट बंद करें' : 'Close Companion')
            : (language === 'hi' ? 'रिपोर्ट के सवाल पूछें' : 'Ask AI Companion')}
        </span>
      </button>

      {/* Floating Chat Drawer Popover */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[520px] max-h-[82vh] flex flex-col rounded-2xl bg-[#080d18] border border-teal-500/30 shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-800 bg-[#0b1322]/90">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>ArogyaSutra Copilot</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    Air-Gapped LLM
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                  {hasAnalyzedReport
                    ? `${patientName || 'Patient'} · ${reportType || 'Diagnostic Panel'}`
                    : (language === 'hi' ? 'रिपोर्ट विश्लेषण की प्रतीक्षा...' : 'Awaiting Report Demystification')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-slate-200"
          >
            {!hasAnalyzedReport ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <AlertCircle className="h-10 w-10 text-teal-500/50" />
                <p className="text-sm font-semibold text-white">
                  {language === 'hi' ? 'पहले किसी रिपोर्ट का विश्लेषण करें' : 'Demystify a Report First'}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'hi'
                    ? 'कृपया ऊपर दिए गए टेस्ट नमूनों में से एक चुनें या PDF अपलोड करके "रिपोर्ट विश्लेषण करें" पर क्लिक करें। AI आपके बायोमार्कर्स के आधार पर सवालों का जवाब देगा।'
                    : 'Please select a sample test above or upload a report, then click "Demystify Diagnostic Report". The AI companion will answer questions grounded in your biomarkers.'}
                </p>
              </div>
            ) : (
              <>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${
                      m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-teal-300 border border-teal-500/30'
                      }`}
                    >
                      {m.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-xl p-3 leading-relaxed text-xs ${
                        m.sender === 'user'
                          ? 'bg-teal-500/10 border border-teal-500/30 text-teal-100'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                      }`}
                    >
                      {m.sender === 'user' ? (
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      ) : (
                        <MarkdownRenderer content={m.text} />
                      )}
                      <span className="block text-[9px] text-slate-500 mt-1.5 text-right">
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isStreaming && (
                  <div className="flex items-start gap-2.5">
                    <div className="h-6 w-6 rounded-lg bg-slate-800 border border-teal-500/30 text-teal-400 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="max-w-[85%] rounded-xl p-3 bg-slate-900/90 border border-slate-800 text-slate-200 text-xs">
                      <MarkdownRenderer content={streamingAnswer} isStreaming={true} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Dynamic Follow-Up Suggestions - 1-Click Direct Inquire */}
          {hasAnalyzedReport && currentSuggestions.length > 0 && !isStreaming && (
            <div className="px-3 py-2 bg-[#090f1d] border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] text-teal-400 flex-shrink-0 font-semibold">
                {language === 'hi' ? 'सुझाव:' : 'Suggest:'}
              </span>
              {currentSuggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(s)}
                  className="px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 transition cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 border-t border-slate-800 bg-[#070c18]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!hasAnalyzedReport || isStreaming}
                placeholder={
                  !hasAnalyzedReport
                    ? (language === 'hi' ? 'कृपया पहले ऊपर रिपोर्ट का विश्लेषण करें...' : 'Demystify a report above first...')
                    : (language === 'hi' ? 'हिंदी, English या Hinglish में सवाल पूछें...' : 'Ask about your biomarkers in English/Hinglish...')
                }
                className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/60 disabled:opacity-40 disabled:cursor-not-allowed transition"
              />

              <button
                type="submit"
                disabled={!input.trim() || !hasAnalyzedReport || isStreaming}
                className="h-9 px-3.5 rounded-xl btn-primary-teal text-slate-950 font-bold text-xs flex items-center justify-center transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                title="Send Question"
              >
                {isStreaming ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
