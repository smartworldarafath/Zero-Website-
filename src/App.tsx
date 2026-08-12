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
                  <div className="flex flex-col gap-16">
                    <motion.section
                      whileHover={{ y: -10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="relative"
                    >
                      <div className="flex items-center gap-2 mb-8 ml-2">
                        <Sparkles className="w-5 h-5 text-[#8cacff]" />
                        <h2 className="text-xl font-black text-[#8cacff] dark:text-[#8cacff] tracking-tight uppercase font-headline">Featured Apps</h2>
                      </div>
                      <HorizontalSlider items={topRowItems} startIndex={1} />
                    </motion.section>

                    <motion.section
                      whileHover={{ y: -10 }}
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
