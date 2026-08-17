import { useState, useEffect, useRef } from 'react';
import { Menu, Moon, Sun, Sparkles, ArrowLeft, ExternalLink, ShieldCheck, Zap, Bell, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { HorizontalSlider } from './components/HorizontalSlider';
import { ChatBot } from './components/ChatBot';
import { PricingPage } from './components/PricingPage';
import { SplashScreen } from './components/SplashScreen';
import { ZeroStudioPage, InputMode } from './components/ZeroStudioPage';
import { ZeroAiLearnerPage } from './components/ZeroAiLearnerPage';
import { St1Page } from './components/St1Page';
import { useTheme } from './components/ThemeProvider';
import { ProjectsPage } from './components/ProjectsPage';
import { AnimatedBackground } from './components/AnimatedBackground';
import { AdminPortal } from './components/AdminPortal';
import { WinningConfetti } from './components/WinningConfetti';
import { 
  getStoredProjects, 
  getUserPlan, 
  getRemainingTrialDays, 
  getAnnouncementConfig, 
  AnnouncementConfig,
  ProjectItem,
  UserPlanData
} from './utils/storage';

// AI Tool Pages
import { EmailWriter } from './pages/EmailWriter';
import { EmailReplier } from './pages/EmailReplier';
import { CVAnalyzer } from './pages/CVAnalyzer';
import { CVBuilder } from './pages/CVBuilder';
import { SOPAnalyzer } from './pages/SOPAnalyzer';
import { SOPWriter } from './pages/SOPWriter';
import { CodeGenerator } from './pages/CodeGenerator';

type ViewType = 
  | 'home' 
  | 'pricing' 
  | 'zero-studio' 
  | 'zero-ai-learner' 
  | 'st1' 
  | 'email-writer' 
  | 'email-replier' 
  | 'cv-analyzer' 
  | 'cv-builder' 
  | 'sop-analyzer' 
  | 'sop-writer' 
  | 'ai-code' 
  | 'projects'
  | 'admin';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // URL Routing & Initial View resolver
  const [view, setView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin') return 'admin';
      if (path === '/studio' || path === '/zero-studio' || hash === '#studio' || hash === '#zero-studio') return 'zero-studio';
      if (path === '/pricing' || hash === '#pricing') return 'pricing';
      if (path === '/projects' || hash === '#projects') return 'projects';
    }
    return 'home';
  });

  const [initialStudioMode, setInitialStudioMode] = useState<InputMode>('Auto');
  const [isWebsiteBuilder, setIsWebsiteBuilder] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiBannerText, setConfettiBannerText] = useState<string | null>(null);

  // Storage synced states
  const [projects, setProjects] = useState<ProjectItem[]>(getStoredProjects());
  const [userPlan, setUserPlan] = useState<UserPlanData>(getUserPlan());
  const [remainingDays, setRemainingDays] = useState<number>(getRemainingTrialDays());
  const [announcement, setAnnouncement] = useState<AnnouncementConfig>(getAnnouncementConfig());

  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      // Skip intro on direct sub-routes or admin
      if (path === '/admin' || hash === '#admin') return false;
      return !sessionStorage.getItem('hasSeenIntro');
    }
    return false;
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Realtime Storage Sync Listener
  useEffect(() => {
    const handleStorageSync = () => {
      setProjects(getStoredProjects());
      setUserPlan(getUserPlan());
      setRemainingDays(getRemainingTrialDays());
      setAnnouncement(getAnnouncementConfig());
    };

    window.addEventListener('zero_storage_sync', handleStorageSync);
    return () => window.removeEventListener('zero_storage_sync', handleStorageSync);
  }, []);

  // Sync URL hash with view state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (view === 'home' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      } else if (view !== 'home') {
        window.history.replaceState(null, '', `#${view}`);
      }
    }
  }, [view]);

  // Window Popstate Listener
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'admin') setView('admin');
      else if (hash === 'studio' || hash === 'zero-studio') setView('zero-studio');
      else if (hash === 'pricing') setView('pricing');
      else if (hash === 'projects') setView('projects');
      else if (!hash) setView('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const { theme, setTheme } = useTheme();
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    active: boolean;
    toTheme: 'light' | 'dark';
  } | null>(null);

  const toggleThemeWithRipple = (e: React.MouseEvent) => {
    const toTheme = theme === 'dark' ? 'light' : 'dark';
    const x = e.clientX || window.innerWidth - 64;
    const y = e.clientY || 64;
    
    setRipple({
      x,
      y,
      active: true,
      toTheme
    });

    setTimeout(() => {
      setTheme(toTheme);
    }, 380);

    setTimeout(() => {
      setRipple(null);
    }, 850);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  // Trigger Plan Success & Confetti
  const handlePlanActivationSuccess = (planType: 'free' | 'core') => {
    setView('home');
    setShowConfetti(true);
    if (planType === 'free') {
      setConfettiBannerText('🎉 Congratulations! Your 25-Day Full Free Trial is Activated.');
    } else {
      setConfettiBannerText('✨ Core Plan Request Registered! We will contact you soon. Enjoy your Free Access in the meantime.');
    }

    setTimeout(() => {
      setConfettiBannerText(null);
    }, 8000);
  };
  
  const { scrollY } = useScroll();

  const topRowItems = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 1,
    title: i === 0 ? 'Empty Box' : i === 1 ? 'St1 Portfolio' : i === 2 ? 'Projects Showcase' : i === 3 ? 'Pricing & Plans' : i === 4 ? 'Zero AI Learner' : `${i + 1}th Box`,
    image: i === 4 ? '/1st box.jpg' : i === 1 ? '/2nd box.png' : i === 2 ? '/3rd box.png' : i === 3 ? '/4th box.png' : undefined,
    onClick: i === 0 ? undefined : i === 1 ? () => setView('st1') : i === 2 ? () => setView('projects') : i === 3 ? () => setView('pricing') : i === 4 ? () => setView('zero-ai-learner') : i === 5 ? () => { setIsWebsiteBuilder(false); setInitialStudioMode('Auto'); setView('zero-studio'); } : undefined,
  }));

  const bottomRowItems = Array.from({ length: 6 }).map((_, i) => ({
    id: i + 7,
    title: `${i + 7}th Box`,
  }));

  return (
    <div ref={containerRef} className="min-h-screen w-full relative overflow-x-hidden transition-colors duration-500 bg-transparent dark:bg-transparent">
      
      {/* Winning Confetti Celebration Particle Engine */}
      {showConfetti && (
        <WinningConfetti onComplete={() => setShowConfetti(false)} />
      )}

      <AnimatePresence>
        {showIntro && (
          <SplashScreen onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <AnimatedBackground />

          {/* Top Live Announcement Banner (Configurable in Admin) */}
          {announcement.enabled && view === 'home' && (
            <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-[#00ff88]/20 via-[#8cacff]/20 to-[#7b5ea7]/20 backdrop-blur-xl border-b border-white/20 dark:border-white/10 py-2.5 px-4 text-center text-xs font-bold text-gray-800 dark:text-white flex items-center justify-center gap-3 relative z-30 shadow-sm">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff88] animate-pulse" />
                {announcement.text}
              </span>
              {announcement.linkText && (
                <button
                  onClick={() => setView('pricing')}
                  className="px-3 py-1 rounded-full bg-[#00ff88] text-[#050507] text-[10px] font-black uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-sm"
                >
                  {announcement.linkText}
                </button>
              )}
            </aside>
          )}

          {/* Winning Celebration Banner */}
          <AnimatePresence>
            {confettiBannerText && view === 'home' && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="w-full bg-gradient-to-r from-[#00ff88] to-[#00e077] py-3.5 px-4 text-center text-xs sm:text-sm font-extrabold text-[#050507] shadow-2xl flex items-center justify-center gap-2 relative z-40"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>{confettiBannerText}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            onUpgradeClick={() => setView('pricing')}
            onToolClick={(id) => {
              if (id === 'build-website' || id === 'build-websites' || id === 'websites') {
                // Open Studio Code with ChatGPT Website Architect Mode
                setIsWebsiteBuilder(true);
                setInitialStudioMode('Website');
                setView('zero-studio');
              } else if (id === 'build-apps' || id === 'apps') {
                setIsWebsiteBuilder(false);
                setInitialStudioMode('Auto');
                setView('zero-studio');
              } else if (id === 'projects') {
                setView('projects');
              } else if (id === 'cv-job' || id === 'cv-student') {
                setView('cv-builder');
              } else if (id === 'ai-resume-analyzer' || id === 'detect-mistakes' || id === 'suggest-improvements' || id === 'give-resume-score') {
                setView('cv-analyzer');
              } else if (id === 'job-email' || id === 'business-email' || id === 'complaint-email' || id === 'university-email') {
                setView('email-writer');
              } else if (id === 'email-replier') {
                setView('email-replier');
              } else if (id === 'sop-writer' || id === 'human-sop' || id === 'university' || id === 'student-visa') {
                setView('sop-writer');
              } else if (id === 'sop-checker') {
                setView('sop-analyzer');
              } else if (id === 'html' || id === 'java' || id === 'python' || id === 'kothin') {
                setView('ai-code');
              }
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

                    {/* Top Right Controls & Plan Status */}
                    <div className="flex items-center gap-3">
                      {userPlan.status === 'active' && (
                        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] text-xs font-mono font-bold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>{userPlan.plan.toUpperCase()} • {remainingDays}d Left</span>
                        </div>
                      )}

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
                          onClick={() => {
                            setIsWebsiteBuilder(false);
                            setInitialStudioMode('Auto');
                            setView('zero-studio');
                          }}
                          className="px-6 py-3.5 bg-white/20 dark:bg-white/10 backdrop-blur-md border border-gray-300 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all rounded-2xl font-bold font-label uppercase tracking-wider text-xs text-gray-800 dark:text-white cursor-pointer"
                          id="launch-studio-code-btn"
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

                    {/* SECTION 1: Featured Live Projects Grid Showcase (Realtime from Admin) */}
                    <section className="relative pt-12">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent mb-16" />
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-[2px] bg-[#00ff88]" />
                            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#00ff88] font-label">Verified Deployments</span>
                          </div>
                          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-headline tracking-tight">
                            ENTERPRISE WEB PORTALS
                          </h2>
                        </div>
                        <button 
                          onClick={() => setView('projects')}
                          className="text-xs font-bold font-label uppercase tracking-widest text-[#8cacff] hover:text-white flex items-center gap-2 group cursor-pointer"
                        >
                          View All Deployments ({projects.length})
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {projects.slice(0, 3).map((proj) => (
                          <div key={proj.id} className="group relative bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="h-52 overflow-hidden relative">
                              <img 
                                src={proj.image} 
                                alt={proj.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              />
                              <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold font-mono text-[#00ff88] uppercase tracking-wider">
                                  {proj.tag}
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-6">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{proj.title}</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">{proj.description}</p>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                                <a 
                                  href={proj.link}
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs font-bold text-[#8cacff] hover:text-blue-500 transition-colors flex items-center gap-1.5"
                                >
                                  Open Live Portal <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* SECTION 2: AI Capabilities Matrix */}
                    <section className="relative">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent mb-16" />

                      <div className="max-w-2xl mb-12">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#8cacff] font-label mb-2 block">Intelligent Architecture</span>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-headline tracking-tight">
                          MULTI-MODAL AI WORKSUITE
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl flex flex-col justify-between hover:border-[#8cacff]/40 transition-colors">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#8cacff]/10 text-[#8cacff] flex items-center justify-center mb-4">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">CV & Resume Builder</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">Generate ATS-optimized resumes with scoring, keyword recommendations, and error detection.</p>
                          </div>
                          <button onClick={() => setView('cv-builder')} className="text-xs font-bold text-[#8cacff] flex items-center gap-1 hover:underline cursor-pointer">Launch Builder &rarr;</button>
                        </div>

                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl flex flex-col justify-between hover:border-[#00ff88]/40 transition-colors">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center mb-4">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Smart Email Writer</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">Draft job inquiries, complaints, and professional responses in seconds with custom tones.</p>
                          </div>
                          <button onClick={() => setView('email-writer')} className="text-xs font-bold text-[#00ff88] flex items-center gap-1 hover:underline cursor-pointer">Launch Writer &rarr;</button>
                        </div>

                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl flex flex-col justify-between hover:border-[#9bddff]/40 transition-colors">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#9bddff]/10 text-[#9bddff] flex items-center justify-center mb-4">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">SOP Generator & Audit</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">Create comprehensive Statement of Purpose documents for universities and student visas.</p>
                          </div>
                          <button onClick={() => setView('sop-writer')} className="text-xs font-bold text-[#9bddff] flex items-center gap-1 hover:underline cursor-pointer">Generate SOP &rarr;</button>
                        </div>

                        <div className="bg-white/40 dark:bg-[#0c1427]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl flex flex-col justify-between hover:border-[#7b5ea7]/40 transition-colors">
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-[#7b5ea7]/10 text-[#7b5ea7] flex items-center justify-center mb-4">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">ChatGPT Website Builder</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">Live conversational coding assistant generating responsive HTML, CSS, and Tailwind components.</p>
                          </div>
                          <button 
                            onClick={() => {
                              setIsWebsiteBuilder(true);
                              setInitialStudioMode('Website');
                              setView('zero-studio');
                            }} 
                            className="text-xs font-bold text-[#7b5ea7] flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            Open Website Architect &rarr;
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* SECTION 3: Performance Metrics */}
                    <section className="relative">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-white/10 to-transparent mb-16" />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-8 rounded-3xl bg-white/40 dark:bg-[#0c1427]/40 backdrop-blur-xl border border-gray-200 dark:border-white/10">
                          <span className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white font-headline block mb-2">99.9%</span>
                          <span className="text-xs font-bold font-label uppercase tracking-wider text-gray-600 dark:text-gray-400">Uptime Reliability</span>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/40 dark:bg-[#0c1427]/40 backdrop-blur-xl border border-gray-200 dark:border-white/10">
                          <span className="text-4xl sm:text-6xl font-black text-[#00ff88] font-headline block mb-2">&lt;200ms</span>
                          <span className="text-xs font-bold font-label uppercase tracking-wider text-gray-600 dark:text-gray-400">Response Latency</span>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/40 dark:bg-[#0c1427]/40 backdrop-blur-xl border border-gray-200 dark:border-white/10">
                          <span className="text-4xl sm:text-6xl font-black text-[#8cacff] font-headline block mb-2">22+</span>
                          <span className="text-xs font-bold font-label uppercase tracking-wider text-gray-600 dark:text-gray-400">AI Models Integrated</span>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/40 dark:bg-[#0c1427]/40 backdrop-blur-xl border border-gray-200 dark:border-white/10">
                          <span className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white font-headline block mb-2">24/7</span>
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
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">Powered by Google Gemini and Groq acceleration for deep contextual analysis and real-time generation.</p>
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
                        <button onClick={() => { setIsWebsiteBuilder(false); setInitialStudioMode('Auto'); setView('zero-studio'); }} className="hover:text-[#8cacff] transition-colors cursor-pointer">Studio Code</button>
                        <button onClick={() => setView('pricing')} className="hover:text-[#8cacff] transition-colors cursor-pointer">Pricing</button>
                        <button onClick={() => setView('admin')} className="text-[#00ff88] hover:underline font-bold transition-colors cursor-pointer flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
                        </button>
                        <a href="mailto:arafathrahman711@gmail.com" className="hover:text-[#8cacff] transition-colors">Contact</a>
                        <a href="https://github.com/smartworldarafath" target="_blank" rel="noopener noreferrer" className="hover:text-[#8cacff] transition-colors">GitHub</a>
                      </div>
                    </footer>

                  </div>
                </motion.div>
              ) : view === 'pricing' ? (
                <PricingPage 
                  key="pricing" 
                  onBack={() => setView('home')} 
                  onActivatePlanSuccess={handlePlanActivationSuccess}
                />
              ) : view === 'zero-studio' ? (
                <ZeroStudioPage 
                  key="zero-studio" 
                  onBack={() => setView('home')} 
                  onPricingClick={() => setView('pricing')}
                  onProjectsClick={() => setView('projects')}
                  initialMode={initialStudioMode}
                  isWebsiteBuilder={isWebsiteBuilder}
                />
              ) : view === 'projects' ? (
                <ProjectsPage key="projects" onBack={() => setView('home')} />
              ) : view === 'admin' ? (
                <AdminPortal key="admin" onBack={() => setView('home')} />
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
                    className="mb-8 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm font-bold text-black dark:text-white hover:bg-white/20 transition-all cursor-pointer"
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

          {view !== 'zero-studio' && view !== 'admin' && <ChatBot />}

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
