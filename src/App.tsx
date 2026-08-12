import { useState, useEffect, useRef } from 'react';
import { Menu, Moon, Sun, Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { HorizontalSlider } from './components/HorizontalSlider';
import { ChatBot } from './components/ChatBot';
import { PricingPage } from './components/PricingPage';
import { SplashScreen } from './components/SplashScreen';
import { ZeroStudioPage } from './components/ZeroStudioPage';
import { ZeroAiLearnerPage } from './components/ZeroAiLearnerPage';
import { St1Page } from './components/St1Page';
import { useTheme } from './components/ThemeProvider';
import { ProjectsPage } from './components/ProjectsPage';

// AI Tool Pages
import { EmailWriter } from './pages/EmailWriter';
import { EmailReplier } from './pages/EmailReplier';
import { CVAnalyzer } from './pages/CVAnalyzer';
import { CVBuilder } from './pages/CVBuilder';
import { SOPAnalyzer } from './pages/SOPAnalyzer';
import { SOPWriter } from './pages/SOPWriter';
import { CodeGenerator } from './pages/CodeGenerator';

type ViewType = 'home' | 'pricing' | 'zero-studio' | 'zero-ai-learner' | 'st1' | 'email-writer' | 'email-replier' | 'cv-analyzer' | 'cv-builder' | 'sop-analyzer' | 'sop-writer' | 'ai-code' | 'projects';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<ViewType>('home');
  const [showIntro, setShowIntro] = useState(() => {
    // Check session storage immediately to avoid flash of content
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('hasSeenIntro');
    }
    return false;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Backup check in case the initial state didn't catch it (SSR/Hydration)
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro && showIntro) {
      setShowIntro(false);
    }
  }, [showIntro]);

  const { theme, setTheme } = useTheme();
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    active: boolean;
    toTheme: 'light' | 'dark';
  } | null>(null);

  const toggleThemeWithRipple = (e: React.MouseEvent) => {
    const toTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Fallback: If clicked button itself has coordinates, use it, else default top corner
    const x = e.clientX || window.innerWidth - 64;
    const y = e.clientY || 64;
    
    setRipple({
      x,
      y,
      active: true,
      toTheme
    });

    // Toggle original theme state halfway through transition (so the change page colors flow perfectly)
    setTimeout(() => {
      setTheme(toTheme);
    }, 380);

    // End active ripple and clean up (duration: 850ms)
    setTimeout(() => {
      setRipple(null);
    }, 850);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };
  
  const { scrollY } = useScroll();

  const topRowItems = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    title: `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Box`,
    image: i === 0 ? '/1st box.jpg' : i === 1 ? '/2nd box.png' : i === 2 ? '/3rd box.png' : i === 3 ? '/4th box.png' : undefined,
    onClick: (i === 0 || i === 1) ? () => setView('zero-studio') : (i === 2 || i === 3) ? () => setView('zero-ai-learner') : i === 4 ? () => setView('st1') : undefined,
  }));

  const bottomRowItems = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 7,
    title: `${i + 7}th Box`,
  }));

  return (
    <div ref={containerRef} className="min-h-screen w-full relative overflow-x-hidden transition-colors duration-500 bg-transparent dark:bg-transparent">
      <AnimatePresence>
        {showIntro && (
          <SplashScreen onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            onUpgradeClick={() => setView('pricing')}
            onToolClick={(id) => {
              if (id === 'build-apps' || id === 'apps') setView('zero-studio');
              else if (id === 'build-websites' || id === 'websites') setView('zero-studio');
              else if (id === 'cv-job' || id === 'cv-student') setView('cv-builder');
              else if (id === 'ai-resume-analyzer' || id === 'detect-mistakes' || id === 'suggest-improvements' || id === 'give-resume-score') setView('cv-analyzer');
              else if (id === 'job-email' || id === 'business-email' || id === 'complaint-email' || id === 'university-email') setView('email-writer');
              else if (id === 'email-replier') setView('email-replier');
              else if (id === 'sop-writer' || id === 'human-sop' || id === 'university' || id === 'student-visa') setView('sop-writer');
              else if (id === 'sop-checker') setView('sop-analyzer');
              else if (id === 'html' || id === 'java' || id === 'python' || id === 'kothin') setView('ai-code');
              // Add more mappings as needed
              setIsSidebarOpen(false);
            }}
          />

          <main className="w-full px-4 py-8 md:px-8 md:py-12 relative z-10">
            <AnimatePresence mode="wait">
              {view === 'home' ? (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Header */}
                  <header className="flex justify-between items-start mb-8 sm:mb-16">
                    <div className="flex flex-col gap-0 animate-fade-in">
                      <div className="flex flex-col">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                          className="flex items-center justify-center w-fit -translate-y-4 sm:-translate-y-[27px] -translate-x-2 sm:-translate-x-[17px]"
                        >
                          <img src="/logo.png" alt="Zero Studio" className="h-14 sm:h-[100px] w-auto object-contain drop-shadow-md" />
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                          className="text-[#8cacff] dark:text-[#8cacff] text-[8px] sm:text-[10px] uppercase tracking-[0.3em] font-bold font-label ml-2 sm:ml-4 -mt-6 sm:-mt-8"
                        >
                          Scroll to Explore
                        </motion.div>
                      </div>

                      <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2.5 sm:p-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/50 dark:border-white/20 rounded-xl hover:bg-white/30 dark:hover:bg-white/20 transition-colors w-fit group mt-2 sm:mt-4 shadow-sm cursor-pointer"
                      >
                        <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white transition-colors" />
                      </button>
                    </div>

                    {/* Top Right Theme Control */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => toggleThemeWithRipple(e)}
                        className="p-2.5 sm:p-3 bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/20 rounded-xl hover:bg-white/70 dark:hover:bg-white/20 hover:scale-105 transition-all text-gray-800 dark:text-yellow-400 shadow-md active:scale-95 cursor-pointer flex items-center justify-center"
                        aria-label="Toggle Theme"
                      >
                        {theme === 'dark' ? (
                          <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
                        ) : (
                          <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                        )}
                      </button>
                    </div>
                  </header>

                  {/* Content Rows */}
                  <div className="flex flex-col gap-24">
                    
                    {/* Hero Tagline Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center sm:text-left max-w-4xl pt-4"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/15 text-[#8cacff] text-xs font-bold font-label tracking-widest uppercase mb-6 shadow-sm">
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                        Next-Gen Digital Engine & AI Studio 2026
                      </div>
                      <h1 className="text-4xl sm:text-7xl font-extrabold text-gray-900 dark:text-white font-headline tracking-tight leading-[1.1] mb-6">
                        Engineered for <span className="bg-gradient-to-r from-[#8cacff] via-[#769dff] to-[#9bddff] bg-clip-text text-transparent">Creators, Developers & Enterprises.</span>
                      </h1>
                      <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 font-body leading-relaxed max-w-2xl mb-8">
                        Experience blazing-fast web applications, custom enterprise deployments, and a complete suite of intelligent AI productivity tools.
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                        <button 
                          onClick={() => setView('projects')}
                          className="px-6 py-3.5 bg-gradient-to-r from-[#8cacff] to-[#769dff] text-[#002a6e] hover:brightness-110 transition-all duration-300 rounded-2xl font-bold font-label uppercase tracking-wider text-xs shadow-lg shadow-[#8cacff]/20 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                        >
                          Explore Live Projects <ExternalLink className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => setView('zero-studio')}
                          className="px-6 py-3.5 bg-white/20 dark:bg-white/10 backdrop-blur-md border border-gray-300 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all rounded-2xl font-bold font-label uppercase tracking-wider text-xs text-gray-800 dark:text-white cursor-pointer"
                        >
                          Launch Studio Code
                        </button>
                      </div>
                    </motion.div>

                    {/* Original Featured Apps Section */}
                    <motion.section
                      whileHover={{ y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="relative"
                    >
                      <div className="flex items-center gap-2 mb-8 ml-2">
                        <Sparkles className="w-5 h-5 text-[#8cacff]" />
                        <h2 className="text-xl font-black text-[#8cacff] dark:text-[#8cacff] tracking-tight uppercase font-headline">Featured Apps</h2>
                      </div>
                      <HorizontalSlider items={topRowItems} startIndex={1} />
                    </motion.section>

                    {/* Original New Releases Section */}
                    <motion.section
                      whileHover={{ y: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="relative"
                    >
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent mb-12" />
                      <div className="flex items-center gap-2 mb-8 ml-2">
                        <Sparkles className="w-5 h-5 text-[#9bddff]" />
                        <h2 className="text-xl font-black text-[#8cacff] dark:text-[#8cacff] tracking-tight uppercase font-headline">New Releases</h2>
                      </div>
                      <HorizontalSlider items={bottomRowItems} startIndex={7} />
                    </motion.section>

                    {/* SECTION 1: Featured Live Projects Grid Showcase */}
                    <section className="relative pt-12">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent mb-16" />
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-[2px] bg-[#00ff88]" />
                            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#00ff88] font-label">Verified Deployments</span>
                          </div>
                          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-headline tracking-tight">
                            ENGINEERED <span className="text-[#00ff88]">LIVE PROJECTS</span>
                          </h2>
                        </div>
                        
                        <button 
                          onClick={() => setView('projects')}
                          className="px-5 py-2.5 bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/20 hover:bg-[#00ff88] hover:text-[#050507] dark:hover:bg-[#00ff88] dark:hover:text-[#050507] transition-all rounded-xl text-xs font-bold tracking-wider font-label uppercase text-gray-800 dark:text-white flex items-center gap-2 cursor-pointer"
                        >
                          View Full Gallery <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 5 Live Projects Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Project 1 */}
                        <div className="group bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-[#00ff88]/50 transition-all duration-500 hover:-translate-y-1 shadow-lg">
                          <div className="h-48 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" alt="Arabian Enterprise" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-4 left-4 bg-slate-950/90 text-[#00ff88] text-[10px] font-bold font-label uppercase px-3 py-1 rounded-full border border-[#00ff88]/30">Enterprise Web</span>
                          </div>
                          <div className="p-6 flex flex-col justify-between h-[220px]">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Arabian Enterprise</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">Corporate enterprise web portal built for seamless business operations and client consultations.</p>
                            </div>
                            <div className="pt-4 flex items-center justify-between">
                              <a href="https://arbian-enterprise.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#00ff88] hover:underline flex items-center gap-1 font-label uppercase">
                                Live Site <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button onClick={() => setView('projects')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-white font-label uppercase">
                                Preview →
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Project 2 */}
                        <div className="group bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-[#00ff88]/50 transition-all duration-500 hover:-translate-y-1 shadow-lg">
                          <div className="h-48 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" alt="International Education Consultancy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-4 left-4 bg-slate-950/90 text-[#00ff88] text-[10px] font-bold font-label uppercase px-3 py-1 rounded-full border border-[#00ff88]/30">Education & Visa</span>
                          </div>
                          <div className="p-6 flex flex-col justify-between h-[220px]">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">International Education Consultancy</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">Study-abroad consultancy platform assisting students with global university programs and visa guidance.</p>
                            </div>
                            <div className="pt-4 flex items-center justify-between">
                              <a href="https://international-education-consultancy.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#00ff88] hover:underline flex items-center gap-1 font-label uppercase">
                                Live Site <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button onClick={() => setView('projects')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-white font-label uppercase">
                                Preview →
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Project 3 */}
                        <div className="group bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-[#00ff88]/50 transition-all duration-500 hover:-translate-y-1 shadow-lg">
                          <div className="h-48 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=800&q=80" alt="Local Drive Platform" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-4 left-4 bg-slate-950/90 text-[#00ff88] text-[10px] font-bold font-label uppercase px-3 py-1 rounded-full border border-[#00ff88]/30">Cloud Storage</span>
                          </div>
                          <div className="p-6 flex flex-col justify-between h-[220px]">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Local Drive Platform</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">Fast, reliable cloud storage and file management web application for organizing user documents.</p>
                            </div>
                            <div className="pt-4 flex items-center justify-between">
                              <a href="https://local-drive.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#00ff88] hover:underline flex items-center gap-1 font-label uppercase">
                                Live Site <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button onClick={() => setView('projects')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-white font-label uppercase">
                                Preview →
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Project 4 */}
                        <div className="group bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-[#00ff88]/50 transition-all duration-500 hover:-translate-y-1 shadow-lg">
                          <div className="h-48 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" alt="Local Drive Official Web" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-4 left-4 bg-slate-950/90 text-[#00ff88] text-[10px] font-bold font-label uppercase px-3 py-1 rounded-full border border-[#00ff88]/30">Official Portal</span>
                          </div>
                          <div className="p-6 flex flex-col justify-between h-[220px]">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Local Drive Official Web</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">Official web presence and promotional platform for Local Drive featuring product tours.</p>
                            </div>
                            <div className="pt-4 flex items-center justify-between">
                              <a href="https://local-drive-official-web.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#00ff88] hover:underline flex items-center gap-1 font-label uppercase">
                                Live Site <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button onClick={() => setView('projects')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-white font-label uppercase">
                                Preview →
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Project 5 */}
                        <div className="group bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-[#00ff88]/50 transition-all duration-500 hover:-translate-y-1 shadow-lg">
                          <div className="h-48 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" alt="0 Zero Studio AI" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-4 left-4 bg-slate-950/90 text-[#00ff88] text-[10px] font-bold font-label uppercase px-3 py-1 rounded-full border border-[#00ff88]/30">AI Studio Suite</span>
                          </div>
                          <div className="p-6 flex flex-col justify-between h-[220px]">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">0 Zero Studio AI</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">All-in-one suite of generative AI tools, code helpers, and intelligent content creation workflows.</p>
                            </div>
                            <div className="pt-4 flex items-center justify-between">
                              <a href="https://0zerostudioai.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#00ff88] hover:underline flex items-center gap-1 font-label uppercase">
                                Live Site <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button onClick={() => setView('projects')} className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-white font-label uppercase">
                                Preview →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* SECTION 2: AI Suite Workspace Hub */}
                    <section className="relative pt-12">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent mb-16" />

                      <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#8cacff] font-label mb-2 block">Integrated Workspace</span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-headline tracking-tight">
                          AI PRODUCTIVITY <span className="bg-gradient-to-r from-[#8cacff] to-[#9bddff] bg-clip-text text-transparent">TOOLKIT</span>
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                          Elevate your workflow with specialized AI generators for code, resumes, emails, and cognitive learning.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Tool 1 */}
                        <div 
                          onClick={() => setView('cv-builder')} 
                          className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-[#8cacff] transition-all duration-300 hover:-translate-y-1 cursor-pointer group shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI CV & Resume Builder</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">Build ATS-optimized, beautifully structured professional resumes in minutes.</p>
                          <span className="text-xs font-bold text-[#8cacff] font-label uppercase flex items-center gap-1">Open Builder →</span>
                        </div>

                        {/* Tool 2 */}
                        <div 
                          onClick={() => setView('cv-analyzer')} 
                          className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-[#8cacff] transition-all duration-300 hover:-translate-y-1 cursor-pointer group shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Resume Score & Analyzer</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">Analyze resume ATS compliance, detect mistakes, and get improvement scores.</p>
                          <span className="text-xs font-bold text-[#8cacff] font-label uppercase flex items-center gap-1">Analyze Resume →</span>
                        </div>

                        {/* Tool 3 */}
                        <div 
                          onClick={() => setView('ai-code')} 
                          className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-[#8cacff] transition-all duration-300 hover:-translate-y-1 cursor-pointer group shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Neural Code Generator</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">Generate HTML, Java, Python, and full-stack component code instantly.</p>
                          <span className="text-xs font-bold text-[#8cacff] font-label uppercase flex items-center gap-1">Generate Code →</span>
                        </div>

                        {/* Tool 4 */}
                        <div 
                          onClick={() => setView('email-writer')} 
                          className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-[#8cacff] transition-all duration-300 hover:-translate-y-1 cursor-pointer group shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Email & Response Suite</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">Craft job applications, business proposals, and intelligent email replies.</p>
                          <span className="text-xs font-bold text-[#8cacff] font-label uppercase flex items-center gap-1">Write Emails →</span>
                        </div>

                        {/* Tool 5 */}
                        <div 
                          onClick={() => setView('sop-writer')} 
                          className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-[#8cacff] transition-all duration-300 hover:-translate-y-1 cursor-pointer group shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI SOP & Statement Writer</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">Create university SOPs, visa motivation letters, and statement checkers.</p>
                          <span className="text-xs font-bold text-[#8cacff] font-label uppercase flex items-center gap-1">Draft SOP →</span>
                        </div>

                        {/* Tool 6 */}
                        <div 
                          onClick={() => setView('zero-ai-learner')} 
                          className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:border-[#8cacff] transition-all duration-300 hover:-translate-y-1 cursor-pointer group shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Zero AI Learner Studio</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">Neural summaries, learning maps, and real-time cognitive practice engine.</p>
                          <span className="text-xs font-bold text-[#8cacff] font-label uppercase flex items-center gap-1">Launch Studio →</span>
                        </div>
                      </div>
                    </section>

                    {/* SECTION 3: Performance Metrics & Real-Time Stats Band */}
                    <section className="relative py-12">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
                          <span className="text-4xl sm:text-5xl font-black text-[#8cacff] font-headline block mb-2">50+</span>
                          <span className="text-xs font-bold font-label uppercase tracking-wider text-gray-600 dark:text-gray-400">Deployed Projects</span>
                        </div>
                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
                          <span className="text-4xl sm:text-5xl font-black text-[#00ff88] font-headline block mb-2">100%</span>
                          <span className="text-xs font-bold font-label uppercase tracking-wider text-gray-600 dark:text-gray-400">Client Satisfaction</span>
                        </div>
                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
                          <span className="text-4xl sm:text-5xl font-black text-[#9bddff] font-headline block mb-2">&lt; 1.2s</span>
                          <span className="text-xs font-bold font-label uppercase tracking-wider text-gray-600 dark:text-gray-400">Load Speed</span>
                        </div>
                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
                          <span className="text-4xl sm:text-5xl font-black text-[#7b5ea7] font-headline block mb-2">24/7</span>
                          <span className="text-xs font-bold font-label uppercase tracking-wider text-gray-600 dark:text-gray-400">AI Availability</span>
                        </div>
                      </div>
                    </section>

                    {/* SECTION 4: Why Choose Zero Studio (Feature Highlights) */}
                    <section className="relative">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent mb-16" />

                      <div className="max-w-2xl mb-12">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#8cacff] font-label mb-2 block">Why Zero Studio</span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-headline tracking-tight">
                          BUILT FOR HIGH PERFORMANCE & SCALE
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
                          <div className="w-10 h-10 rounded-xl bg-[#8cacff]/10 text-[#8cacff] flex items-center justify-center mb-4">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Modern Micro-Interactive Architecture</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Built with React 19, Vite, and Framer Motion to ensure smooth 60fps transitions and zero latency.</p>
                        </div>

                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
                          <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center mb-4">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Multi-Model AI Integration</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Powered by Google Gemini models for deep contextual analysis, document scoring, and real-time generation.</p>
                        </div>

                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
                          <div className="w-10 h-10 rounded-xl bg-[#9bddff]/10 text-[#9bddff] flex items-center justify-center mb-4">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Cross-Platform Responsive Design</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Pixel-perfect layout optimization across desktop monitors, tablets, and mobile smartphones.</p>
                        </div>

                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
                          <div className="w-10 h-10 rounded-xl bg-[#7b5ea7]/10 text-[#7b5ea7] flex items-center justify-center mb-4">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Verified Enterprise Deployments</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Live verified portals hosted on Vercel and Netlify with real-time interactive previews.</p>
                        </div>
                      </div>
                    </section>

                    {/* SECTION 5: Professional Footer */}
                    <footer className="pt-16 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-label text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center md:items-start gap-2">
                        <img src="/logo.png" alt="Zero Studio" className="h-10 w-auto object-contain" />
                        <span>ZERO STUDIO CODE &copy; 2026. ALL RIGHTS RESERVED.</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-6">
                        <button onClick={() => setView('projects')} className="hover:text-[#8cacff] transition-colors cursor-pointer">Projects</button>
                        <button onClick={() => setView('zero-studio')} className="hover:text-[#8cacff] transition-colors cursor-pointer">Studio Code</button>
                        <button onClick={() => setView('pricing')} className="hover:text-[#8cacff] transition-colors cursor-pointer">Pricing</button>
                        <a href="mailto:arafathrahman711@gmail.com" className="hover:text-[#8cacff] transition-colors">Contact</a>
                        <a href="https://github.com/smartworldarafath" target="_blank" rel="noopener noreferrer" className="hover:text-[#8cacff] transition-colors">GitHub</a>
                      </div>
                    </footer>

                  </div>
                </motion.div>
              ) : view === 'pricing' ? (
                <PricingPage key="pricing" onBack={() => setView('home')} />
              ) : view === 'zero-studio' ? (
                <ZeroStudioPage 
                  key="zero-studio" 
                  onBack={() => setView('home')} 
                  onPricingClick={() => setView('pricing')}
                  onProjectsClick={() => setView('projects')}
                />
              ) : view === 'projects' ? (
                <ProjectsPage key="projects" onBack={() => setView('zero-studio')} />
              ) : view === 'zero-ai-learner' ? (
                <ZeroAiLearnerPage
                  key="zero-ai-learner"
                  onBack={() => setView('home')}
                  onPricingClick={() => setView('pricing')}
                />
              ) : view === 'st1' ? (
                <St1Page
                  key="st1"
                  onBack={() => setView('home')}
                  onPricingClick={() => setView('pricing')}
                />
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setView('home')}
                    className="mb-8 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm font-bold text-black dark:text-white hover:bg-white/20 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </button>
                  {view === 'email-writer' && <EmailWriter />}
                  {view === 'email-replier' && <EmailReplier />}
                  {view === 'cv-analyzer' && <CVAnalyzer />}
                  {view === 'cv-builder' && <CVBuilder />}
                  {view === 'sop-analyzer' && <SOPAnalyzer />}
                  {view === 'sop-writer' && <SOPWriter />}
                  {view === 'ai-code' && <CodeGenerator />}
                </div>
              )}
            </AnimatePresence>
          </main>

          <ChatBot />

          {/* Liquid Ripple Overlay Container */}
          {ripple && (
            <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
              <div 
                className="theme-ripple absolute rounded-full"
                style={{
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  width: '12px',
                  height: '12px',
                  backgroundColor: ripple.toTheme === 'light' ? '#f8fafc' : '#01040a',
                  boxShadow: '0 0 100px rgba(140, 172, 255, 0.4)'
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
