import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, HelpCircle } from 'lucide-react';
import { SiGmail, SiTelegram, SiGithub, SiInstagram, SiFacebook } from 'react-icons/si';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const faqData = [
  {
    category: "Support",
    questions: [
      {
        id: "c1",
        q: "How quickly do you respond to emails?",
        a: "We aim to respond to all email inquiries within 24-48 hours during business days."
      },
      {
        id: "c2",
        q: "Can I get help with my specific document?",
        a: "Yes! While our AI tools provide automated assistance, you can reach out via email for specific technical issues or feedback."
      }
    ]
  },
  {
    category: "Partnerships",
    questions: [
      {
        id: "c3",
        q: "Do you offer collaborations?",
        a: "We are always open to exciting collaborations and partnerships. Please reach out via email with your proposal."
      }
    ]
  }
];

export function ContactUs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>("c1");

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

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight flex items-center gap-3">
          <MessageSquare className="w-10 h-10 text-indigo-500" />
          Contact Us
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Get in touch with Arafatrh Rahman and the Zero Studio team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Links Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="liquid-panel p-8 rounded-[2rem] sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Connect Directly</h3>
            
            <div className="space-y-4">
              <a 
                href="mailto:arafathrahman711@gmail.com" 
                className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 transition-all group"
              >
                <div className="p-3 rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                  <SiGmail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Email</h4>
                  <p className="text-xs text-gray-500">arafathrahman711@gmail.com</p>
                </div>
              </a>

              <a 
                href="https://t.me/open_souce_bangladesh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#0088cc]/5 hover:bg-[#0088cc]/10 border border-[#0088cc]/10 transition-all group"
              >
                <div className="p-3 rounded-xl bg-[#0088cc] text-white shadow-lg shadow-[#0088cc]/20 group-hover:scale-110 transition-transform">
                  <SiTelegram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Telegram</h4>
                  <p className="text-xs text-gray-500">Join the channel</p>
                </div>
              </a>

              <a 
                href="https://github.com/smartworldarafath" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/5 hover:bg-gray-800/10 border border-gray-800/10 transition-all group"
              >
                <div className="p-3 rounded-xl bg-gray-800 text-white shadow-lg shadow-gray-800/20 group-hover:scale-110 transition-transform">
                  <SiGithub className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">GitHub</h4>
                  <p className="text-xs text-gray-500">Follow on GitHub</p>
                </div>
              </a>

              <a 
                href="https://instagram.com/ArafatrhRahman" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#E1306C]/5 hover:bg-[#E1306C]/10 border border-[#E1306C]/10 transition-all group"
              >
                <div className="p-3 rounded-xl bg-[#E1306C] text-white shadow-lg shadow-[#E1306C]/20 group-hover:scale-110 transition-transform">
                  <SiInstagram className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Instagram</h4>
                  <p className="text-xs text-gray-500">Follow for updates</p>
                </div>
              </a>

              <a 
                href="https://facebook.com/ArafatrhRahman" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#4267B2]/5 hover:bg-[#4267B2]/10 border border-[#4267B2]/10 transition-all group"
              >
                <div className="p-3 rounded-xl bg-[#4267B2] text-white shadow-lg shadow-[#4267B2]/20 group-hover:scale-110 transition-transform">
                  <SiFacebook className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Facebook</h4>
                  <p className="text-xs text-gray-500">Connect on Facebook</p>
                </div>
              </a>
            </div>
          </div>
        </aside>

        {/* FAQ Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Search Bar */}
          <div className="relative flex items-center liquid-panel p-1 rounded-2xl shadow-xl border border-white/10 mb-8">
            <Search className="absolute left-4 text-gray-400 w-5 h-5" />
            <input 
              className="w-full bg-transparent border-none focus:ring-0 py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400" 
              placeholder="Search contact FAQs..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
        </div>
      </div>
    </div>
  );
}
