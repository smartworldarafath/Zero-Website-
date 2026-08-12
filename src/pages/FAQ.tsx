/// <reference types="vite/client" />
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, BookOpen, HelpCircle, X, Sparkles } from 'lucide-react';
import { SiGmail } from 'react-icons/si';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from '@google/genai';

const faqData = [
  {
    category: "General",
    questions: [
      {
        id: "q1",
        q: "What is Zero Studio exactly?",
        a: "Zero Studio is an AI-powered platform designed to help students and professionals with their application documents. We provide tools for writing and analyzing SOPs, CVs, and emails using advanced Gemini AI models."
      },
      {
        id: "q2",
        q: "How do I start my first project?",
        a: "Simply select a tool from the sidebar (like SOP Writer or CV Builder), fill in your details, and click generate. You can also upload existing documents for analysis."
      },
      {
        id: "q3",
        q: "Which browsers and platforms are supported?",
        a: "We support the latest versions of Chrome, Firefox, Safari, and Edge. The platform is fully responsive and works on desktop, tablet, and mobile devices."
      }
    ]
  },
  {
    category: "Security & Privacy",
    questions: [
      {
        id: "q4",
        q: "How secure is my application data?",
        a: "We prioritize your privacy. Your data is processed securely and is not used to train our models. We use industry-standard encryption for all data in transit and at rest."
      },
      {
        id: "q5",
        q: "Do you store my uploaded documents?",
        a: "Documents are processed for analysis and generation. We do not store your personal documents longer than necessary to provide the service, and you can delete your data at any time."
      }
    ]
  }
];

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>("q1");
  const [modalContent, setModalContent] = useState<{ title: string, content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const filteredFaqs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleAiAction = async (action: 'docs' | 'discord') => {
    setIsLoading(true);
    setModalContent({ title: action === 'docs' ? 'Documentation' : 'Community', content: '' });
    
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
      const prompt = action === 'docs' 
        ? "Write a short, helpful documentation intro for Zero Studio, explaining how to use the AI tools for CVs and SOPs."
        : "Write a welcoming message for the Zero Studio Discord community, inviting users to join, share tips, and get support.";
        
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setModalContent({
        title: action === 'docs' ? 'Documentation' : 'Community',
        content: response.text || 'Content could not be generated.'
      });
    } catch (error) {
      console.error(error);
      setModalContent({
        title: 'Error',
        content: 'Failed to load content. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight flex items-center gap-3">
          <HelpCircle className="w-10 h-10 text-indigo-500" />
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Find answers to common questions about Zero Studio and our AI tools.</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl">
        <div className="relative flex items-center liquid-panel p-1 rounded-2xl shadow-xl border border-white/10">
          <Search className="absolute left-4 text-gray-400 w-5 h-5" />
          <input 
            className="w-full bg-transparent border-none focus:ring-0 py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400" 
            placeholder="Search for questions..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Categories */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="liquid-panel p-6 rounded-[2rem] sticky top-8">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 px-2">Categories</h3>
            <nav className="flex flex-col gap-2">
              {faqData.map((cat) => (
                <button 
                  key={cat.category}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <BookOpen className="w-4 h-4" />
                  {cat.category}
                </button>
              ))}
            </nav>
            
            <div className="mt-8 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
              <h4 className="text-gray-900 dark:text-white font-bold mb-2 text-sm">Still need help?</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Our support team is available to help you with any issues.</p>
              <a href="mailto:arafathrahman711@gmail.com" className="block text-center w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                Contact Support
              </a>
            </div>
          </div>
        </aside>

        {/* FAQ Content */}
        <div className="lg:col-span-9 space-y-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category) => (
              <section key={category.category}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq) => {
                    const isOpen = openIndex === faq.id;
                    return (
                      <div 
                        key={faq.id}
                        className="liquid-panel rounded-2xl overflow-hidden border border-white/5"
                      >
                        <button 
                          onClick={() => toggleAccordion(faq.id)}
                          className="w-full flex items-center justify-between gap-6 p-5 text-left"
                        >
                          <p className="text-gray-900 dark:text-gray-100 font-semibold text-sm">{faq.q}</p>
                          {isOpen ? <ChevronUp className="w-5 h-5 text-indigo-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="px-5 pb-5 pt-0">
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                  {faq.a}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className="text-center py-20 liquid-panel rounded-[2rem]">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No questions found matching your search.</p>
            </div>
          )}

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="liquid-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
              <BookOpen className="text-indigo-500 w-8 h-8" />
              <h4 className="font-bold text-base">Documentation</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Deep dive into our technical specs and tutorials.</p>
              <button onClick={() => handleAiAction('docs')} className="text-indigo-500 text-xs font-bold hover:underline mt-auto text-left flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Read Docs →
              </button>
            </div>
            <div className="liquid-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
              <MessageSquare className="text-indigo-500 w-8 h-8" />
              <h4 className="font-bold text-base">Community</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Join our Discord to talk with other users.</p>
              <button onClick={() => handleAiAction('discord')} className="text-indigo-500 text-xs font-bold hover:underline mt-auto text-left flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Join Discord →
              </button>
            </div>
            <div className="liquid-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
              <SiGmail className="text-red-500 w-8 h-8" />
              <h4 className="font-bold text-base">Email Support</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">Can't find what you're looking for?</p>
              <a href="mailto:arafathrahman711@gmail.com" className="text-indigo-500 text-xs font-bold hover:underline mt-auto">Open Ticket →</a>
            </div>
          </div>
        </div>
      </div>

      {/* AI Content Modal */}
      <AnimatePresence>
        {modalContent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-800 relative"
            >
              <button 
                onClick={() => setModalContent(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                {modalContent.title}
              </h3>
              
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                    {modalContent.content}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
