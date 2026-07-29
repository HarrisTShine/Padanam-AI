import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, RefreshCw, MessageSquare, Globe } from 'lucide-react';
import { agentService } from '../../services/agentService';
import { useLanguage } from '../../context/LanguageContext';

export default function AIChatDrawer({ isOpen, onClose, currentTopicId, currentTopicTitle }) {
  const { language } = useLanguage();
  // Independent teaching language state: 'en' (English) or 'ml' (Malayalam)
  const [teachingLang, setTeachingLang] = useState(language || 'en');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: teachingLang === 'ml'
        ? 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ പഠനം AI ട്യൂട്ടറാണ്. SCERT കേരള സിലബസിലെ ഏത് വിഷയം വേണമെങ്കിലും എന്നോട് ചോദിക്കാം.'
        : 'Hello! I am your Padanam AI tutor. Ask me anything about your SCERT Kerala syllabus, formulas, or concepts!',
      strategy: 'standard',
      suggested_followups: [
        'Explain Wave Motion with a real-life analogy',
        'സമാന്തര ശ്രേണിയുടെ n-ാം പദം എങ്ങനെ കണ്ടെത്താം?',
        'Give me a 2-minute diagnostic quiz'
      ]
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setTeachingLang(language);
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || loading) return;

    const userMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setLoading(true);

    try {
      const data = await agentService.chat(query, currentTopicId, teachingLang);
      const assistantMessage = {
        sender: 'assistant',
        text: data.response,
        strategy: data.strategy_used,
        suggested_followups: data.suggested_followups || []
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: 'Sorry, I encountered a temporary network glitch. Please try asking again.',
        strategy: 'error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header with AI Teaching Language Selector */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 flex items-center space-x-2">
                <span>Padanam AI Tutor</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LangGraph Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {currentTopicTitle ? `Context: ${currentTopicTitle}` : 'SCERT Kerala Syllabus Grounded'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* AI Teaching Mode Switcher */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700/80">
              <Globe className="w-3.5 h-3.5 text-cyan-400 mr-1.5 ml-1" />
              <button
                onClick={() => setTeachingLang('en')}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition ${
                  teachingLang === 'en'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="AI Tutor teaches in English"
              >
                English
              </button>
              <button
                onClick={() => setTeachingLang('ml')}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md transition ${
                  teachingLang === 'ml'
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="AI Tutor teaches in Malayalam"
              >
                മലയാളം
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Teaching Mode Banner */}
        <div className="px-4 py-1.5 bg-slate-950/60 border-b border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>AI Tutor Mode: <strong className="text-cyan-300">{teachingLang === 'ml' ? 'Malayalam Explanation (മലയാളം)' : 'English Explanation'}</strong></span>
          </span>
          <span className="text-slate-500 text-[10px]">SCERT State Board</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'bg-gradient-to-tr from-cyan-600 to-teal-600 text-slate-950 font-bold'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-slate-950" />}
              </div>

              <div className={`max-w-[80%] space-y-2`}>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {msg.strategy && msg.sender === 'assistant' && (
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700/50">
                    Pedagogy: {msg.strategy}
                  </span>
                )}

                {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <p className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3 text-cyan-400" />
                      <span>Suggested Follow-ups:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggested_followups.map((f, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(f)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/20 text-left transition"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <span>LangGraph agent reasoning ({teachingLang === 'ml' ? 'Malayalam' : 'English'})...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={
                teachingLang === 'ml'
                  ? 'ചോദ്യങ്ങൾ മലയാളത്തിലോ ഇംഗ്ലീഷിലോ ചോദിക്കൂ...'
                  : 'Ask about concepts, formulas, or SCERT syllabus...'
              }
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 disabled:opacity-50 transition shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
