import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Settings, Command, Plus, Send, X, Bot, ArrowRight, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const API_KEY = process.env.GEMINI_API_KEY;

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('what is the cost')) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Please explore the pricing list.' }]);
      setIsLoading(false);
      return;
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('contract')) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Contract: arafathrahman711@gmail.com' }]);
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      if (!API_KEY) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          content: 'Here are a few quick ideas based on your question: 1) Try a short recipe. 2) Ask for a step-by-step guide. 3) Request a simple summary.' 
        }]);
        return;
      }

      const genAI = new GoogleGenAI({ apiKey: API_KEY });
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are a helpful AI assistant for Zero Studio. Be concise, professional, and friendly.",
        }
      });

      const response = await model;
      const text = response.text;
      
      setMessages(prev => [...prev, { role: 'bot', content: text || 'I am sorry, I could not generate a response.' }]);
    } catch (error) {
      console.error('ChatBot Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'I am having some trouble connecting, but we can try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black dark:bg-[#1e1e1e] text-white dark:text-white flex items-center justify-center shadow-2xl z-50 group border border-white/10"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
        {isOpen ? <X className="w-6 h-6 sm:w-8 sm:h-8" /> : <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />}
      </motion.button>

      {/* Assistant Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-4 sm:bottom-28 sm:right-8 w-[calc(100vw-2rem)] sm:w-[360px] h-[600px] max-h-[80vh] bg-white/60 dark:bg-[#1e1e1e]/60 backdrop-blur-[20px] border border-black/5 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-[32px] p-4 flex flex-col z-50 text-black dark:text-white overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-2 pt-2 pb-4 shrink-0">
              <button onClick={() => setIsOpen(false)} className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="flex flex-col items-center">
                <h3 className="font-bold text-sm tracking-wide">AI Assistant</h3>
              </div>
              <button className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 text-sm no-scrollbar pb-2 px-2">
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === 'user' ? (
                    <div className="flex justify-end mb-2">
                       <div className="inline-flex items-center gap-2 px-5 py-3 bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-2xl max-w-[85%] border border-black/5 dark:border-white/5 font-medium shadow-sm">
                          {msg.content}
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 mt-4">
                      <div className="mt-1 shrink-0 text-violet-500 animate-spin-slow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
                      </div>
                      <div>
                        <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-black/90 dark:text-white/90">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3 mt-4">
                  <div className="mt-1 shrink-0 text-violet-500 animate-spin">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
                  </div>
                  <div>
                     <p className="opacity-70 flex gap-1 items-center h-5 mt-1">
                        <span className="w-1.5 h-1.5 bg-black/40 dark:bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                        <span className="w-1.5 h-1.5 bg-black/40 dark:bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-1.5 h-1.5 bg-black/40 dark:bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                     </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Field at the Bottom */}
            <div className="flex items-center gap-3 mt-4 pt-2 shrink-0 px-2 pb-2">
               <div className="flex items-center gap-3 text-black/40 dark:text-white/40 shrink-0">
                  <button className="hover:text-black dark:hover:text-white transition-colors">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                  </button>
                  <button className="hover:text-black dark:hover:text-white transition-colors">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </button>
                  <button className="hover:text-black dark:hover:text-white transition-colors">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
                  </button>
               </div>
               <div className="flex items-center w-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5 p-1 pl-4 rounded-full">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type here..."
                  className="bg-transparent outline-none w-full text-sm placeholder:text-black/40 dark:placeholder:text-white/40 font-medium pr-2"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-full bg-violet-500 hover:bg-violet-600 disabled:opacity-50 flex items-center justify-center transition-transform hover:scale-105 shrink-0 text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
