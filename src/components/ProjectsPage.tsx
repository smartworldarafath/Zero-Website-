import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ExternalLink, Sparkles, FolderGit2, X, 
  Code, Laptop, Globe, Maximize2, RefreshCw, Smartphone, Monitor, ShieldCheck, Copy, Check
} from 'lucide-react';
import { getStoredProjects, ProjectItem } from '../utils/storage';

export function ProjectsPage({ onBack }: { onBack: () => void }) {
  const [projects, setProjects] = useState<ProjectItem[]>(getStoredProjects());
  const [livePreviewMode, setLivePreviewMode] = useState<Record<string, 'image' | 'iframe'>>({});
  const [fullscreenProject, setFullscreenProject] = useState<ProjectItem | null>(null);
  const [iframeDevice, setIframeDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => {
      setProjects(getStoredProjects());
    };
    window.addEventListener('zero_storage_sync', handleSync);
    return () => window.removeEventListener('zero_storage_sync', handleSync);
  }, []);

  const togglePreviewMode = (id: string, mode: 'image' | 'iframe') => {
    setLivePreviewMode(prev => ({ ...prev, [id]: mode }));
  };

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full min-h-screen text-slate-900 dark:text-[#e8e8f0] py-6 px-4 md:px-12 font-syne relative isolate">
      
      {/* Background Orbs replicating Zero Studio Code vibe */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-50 dark:opacity-100">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00ff88]/5 blur-[120px]" />
        <div className="absolute bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-[#7b5ea7]/5 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-16">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-md dark:shadow-none hover:-translate-y-0.5 cursor-pointer"
            id="projects-back-btn"
          >
            <ArrowLeft className="w-5 h-5 text-[#00ff88]" />
            <span className="text-sm font-semibold tracking-wide font-spacemono uppercase">Back to Home</span>
          </button>
        </div>

        {/* Header Title Section */}
        <div className="text-center sm:text-left mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-[#00ff88]" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#00ff88] font-spacemono">Live Deployment Showcase</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold font-bebas tracking-wide text-slate-800 dark:text-white leading-none">
            MY LIVE <span className="text-[#00ff88]">PROJECTS</span>
          </h1>
          <p className="text-slate-600 dark:text-[#8d8ea6] mt-4 max-w-xl text-sm sm:text-base leading-relaxed">
            Explore live deployed applications and corporate portals. Toggle between high-res screenshots or interact directly with the live web applications inside the embedded viewer.
          </p>
        </div>

        {/* Projects Alternating Layout */}
        <div className="flex flex-col gap-24 sm:gap-32">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;
            const currentMode = livePreviewMode[project.id] || 'image';
            const isLiveUrl = project.link.startsWith('http');

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-14 items-center`}
              >
                
                {/* Project Media Container (Image vs iFrame) */}
                <div className="w-full lg:w-1/2 flex flex-col gap-3">
                  
                  {/* Mode Bar */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff88]"></span>
                      </span>
                      <span className="text-[11px] font-bold font-spacemono uppercase tracking-wider text-[#00ff88]">
                        LIVE DEPLOYMENT
                      </span>
                    </div>

                    {isLiveUrl && (
                      <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-white/10 p-1 rounded-lg backdrop-blur-md">
                        <button
                          onClick={() => togglePreviewMode(project.id, 'image')}
                          className={`px-3 py-1 text-[11px] font-bold font-spacemono rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                            currentMode === 'image' 
                              ? 'bg-white dark:bg-slate-900 text-[#00ff88] shadow-sm' 
                              : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Laptop className="w-3.5 h-3.5" /> Screen
                        </button>

                        <button
                          onClick={() => togglePreviewMode(project.id, 'iframe')}
                          className={`px-3 py-1 text-[11px] font-bold font-spacemono rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                            currentMode === 'iframe' 
                              ? 'bg-[#00ff88] text-[#050507] shadow-sm' 
                              : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" /> Interactive
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Visual Box */}
                  <div className="w-full aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 shadow-2xl relative group flex flex-col">
                    
                    {currentMode === 'image' ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-slate-900/95 text-[#00ff88] text-[10px] font-bold font-spacemono uppercase px-3.5 py-1.5 rounded-full border border-[#00ff88]/30 backdrop-blur-md tracking-wider z-10">
                          {project.tag}
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/90 via-[#050507]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#00ff88] text-[#050507] rounded-xl text-xs font-bold font-spacemono uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-transform"
                          >
                            Open Live Website <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          
                          {isLiveUrl && (
                            <button
                              onClick={() => setFullscreenProject(project)}
                              className="p-2.5 bg-slate-900/90 text-white hover:text-[#00ff88] rounded-xl backdrop-blur-md border border-white/20 hover:scale-105 transition-transform cursor-pointer"
                              title="Fullscreen Interactive Browser"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full relative bg-slate-950 flex flex-col overflow-hidden">
                        {/* Browser Top Bar */}
                        <div className="w-full bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-white/10 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                          </div>
                          <span className="text-[11px] font-spacemono text-slate-400 truncate max-w-[220px]">
                            {project.link}
                          </span>
                          <button 
                            onClick={() => setFullscreenProject(project)}
                            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Interactive iFrame */}
                        <div className="w-full flex-1 relative bg-white overflow-hidden">
                          <iframe 
                            src={project.embedLink || project.link} 
                            className="absolute inset-0 w-full h-full border-none bg-white"
                            title={project.title}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Project Details Box */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold font-spacemono text-[#00ff88]">Project 0{index + 1}</span>
                    <span className="w-4 h-[1px] bg-slate-300 dark:bg-white/10" />
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold font-spacemono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Verified Live Site
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-tight mb-4">
                    {project.title}
                  </h3>

                  <p className="text-slate-600 dark:text-[#9798b3] text-sm sm:text-base leading-relaxed mb-6 font-medium">
                    {project.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((t, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold font-spacemono text-slate-700 dark:text-white/90 rounded-md tracking-wide"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-[#050507] hover:bg-[#00e077] transition-all duration-300 rounded-xl text-xs font-bold tracking-wider font-spacemono uppercase shadow-lg shadow-[#00ff88]/10 hover:shadow-[#00ff88]/25 hover:-translate-y-0.5 active:scale-95"
                    >
                      Visit Live Website <ExternalLink className="w-4 h-4" />
                    </a>

                    {isLiveUrl && (
                      <button 
                        onClick={() => setFullscreenProject(project)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all rounded-xl text-xs font-bold tracking-wider font-spacemono uppercase text-slate-700 dark:text-white cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-[#00ff88]" /> Interactive Frame
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(project.link, project.id)}
                      className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-white transition-all cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedId === project.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Footer Area */}
        <div className="mt-32 pt-12 border-t border-slate-200 dark:border-white/10 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-[#6b6b80] font-spacemono pb-12">
          <span>ZERO STUDIO CODE &copy; 2026. ALL RIGHTS RESERVED.</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#00ff88] animate-pulse" /> Bangladesh Professional Portfolio Suite
          </span>
        </div>

      </div>

      {/* Fullscreen Interactive Browser Modal */}
      <AnimatePresence>
        {fullscreenProject && (
          <div className="fixed inset-0 z-[150] flex flex-col bg-slate-950 text-white font-syne">
            
            {/* Modal Top Header */}
            <div className="px-6 py-4 bg-slate-900 border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <h3 className="font-bold text-sm font-spacemono text-[#00ff88] truncate max-w-xs sm:max-w-md">
                  {fullscreenProject.title}
                </h3>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                  <button 
                    onClick={() => setIframeDevice('desktop')}
                    className={`px-3 py-1 text-xs font-spacemono rounded transition-colors flex items-center gap-1 cursor-pointer ${
                      iframeDevice === 'desktop' ? 'bg-[#00ff88] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop
                  </button>
                  <button 
                    onClick={() => setIframeDevice('mobile')}
                    className={`px-3 py-1 text-xs font-spacemono rounded transition-colors flex items-center gap-1 cursor-pointer ${
                      iframeDevice === 'mobile' ? 'bg-[#00ff88] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </button>
                </div>

                <a 
                  href={fullscreenProject.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-spacemono flex items-center gap-1.5 transition-colors"
                >
                  Open External <ExternalLink className="w-3.5 h-3.5 text-[#00ff88]" />
                </a>

                <button 
                  onClick={() => setFullscreenProject(null)}
                  className="p-2 bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* iFrame Viewport Container */}
            <div className="flex-1 w-full bg-slate-950 flex items-center justify-center p-4 overflow-hidden relative">
              <iframe 
                src={fullscreenProject.embedLink || fullscreenProject.link}
                className={`transition-all duration-300 border border-white/10 rounded-2xl shadow-2xl bg-white ${
                  iframeDevice === 'desktop' 
                    ? 'w-full h-full' 
                    : 'w-[385px] h-[780px] max-h-full'
                }`}
                title={fullscreenProject.title}
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
