import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Plus, ExternalLink, Sparkles, FolderGit2, X, 
  Code, Laptop, Globe, Maximize2, RefreshCw, Smartphone, Monitor, ShieldCheck, Copy, Check
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link: string;
  embedLink?: string;
  image: string;
  tag: string;
  duration: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'user-1',
    title: 'Arabian Enterprise',
    description: 'A modern corporate enterprise web portal built for seamless business operations, corporate services showcase, and client consultation.',
    tech: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    link: 'https://arbian-enterprise.vercel.app/',
    embedLink: '/proxy/arbian-enterprise/',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    tag: 'Enterprise Web',
    duration: 'Live Project'
  },
  {
    id: 'user-2',
    title: 'International Education Consultancy',
    description: 'A comprehensive education and study-abroad consultancy platform assisting students with global university programs, visa guidance, and admission processing.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    link: 'https://international-education-consultancy.vercel.app/',
    embedLink: '/proxy/international-education/',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    tag: 'Education & Visa',
    duration: 'Live Project'
  },
  {
    id: 'user-3',
    title: 'Local Drive Platform',
    description: 'A fast, reliable cloud storage and file management web application designed for organizing, sharing, and securing user documents seamlessly.',
    tech: ['React', 'Node.js', 'Tailwind CSS', 'Vercel'],
    link: 'https://local-drive.vercel.app/',
    embedLink: '/proxy/local-drive/',
    image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80',
    tag: 'Cloud Storage',
    duration: 'Live Project'
  },
  {
    id: 'user-4',
    title: 'Local Drive Official Web',
    description: 'The official web presence and promotional platform for Local Drive, featuring interactive product tours, service highlights, and onboarding controls.',
    tech: ['HTML5', 'Tailwind CSS', 'JavaScript', 'Netlify'],
    link: 'https://local-drive-official-web.netlify.app/',
    embedLink: '/proxy/local-drive-official/',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    tag: 'Official Portal',
    duration: 'Live Project'
  },
  {
    id: 'user-5',
    title: '0 Zero Studio AI',
    description: 'An all-in-one suite of generative AI tools, code helpers, and intelligent content creation workflows engineered for modern developers and creators.',
    tech: ['React', 'Gemini API', 'Tailwind CSS', 'Netlify'],
    link: 'https://0zerostudioai.netlify.app/',
    embedLink: '/proxy/0zerostudioai/',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tag: 'AI Studio Suite',
    duration: 'Live Project'
  }
];

export function ProjectsPage({ onBack }: { onBack: () => void }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [livePreviewMode, setLivePreviewMode] = useState<Record<string, 'image' | 'iframe'>>({});
  const [fullscreenProject, setFullscreenProject] = useState<Project | null>(null);
  const [iframeDevice, setIframeDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tag, setTag] = useState('');
  const [duration, setDuration] = useState('');

  const togglePreviewMode = (id: string, mode: 'image' | 'iframe') => {
    setLivePreviewMode(prev => ({ ...prev, [id]: mode }));
  };

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newProject: Project = {
      id: Date.now().toString(),
      title,
      description,
      tech: techInput ? techInput.split(',').map(t => t.trim()).filter(Boolean) : ['React', 'Tailwind'],
      link: projectLink.trim() || '#',
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      tag: tag.trim() || 'Custom Project',
      duration: duration.trim() || 'Live Project'
    };

    setProjects([newProject, ...projects]);
    setIsModalOpen(false);

    // Reset Form
    setTitle('');
    setDescription('');
    setTechInput('');
    setProjectLink('');
    setImageUrl('');
    setTag('');
    setDuration('');
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
            <span className="text-sm font-semibold tracking-wide font-spacemono uppercase">Back to Studio</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-[#050507] hover:bg-[#00e077] transition-all duration-300 rounded-full font-bold shadow-lg shadow-[#00ff88]/10 hover:shadow-[#00ff88]/30 hover:-translate-y-1 active:scale-95 cursor-pointer"
            id="add-project-btn"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span className="text-xs tracking-wider uppercase font-spacemono">Add Custom Project</span>
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

      {/* Add Project Dialog/Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-xl bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 relative z-10 shadow-2xl overflow-hidden font-syne text-slate-900 dark:text-white"
            >
              {/* Vibe lines */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-6 h-6 text-[#00ff88]" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">ADD NEW PROJECT</h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-[#6b6b80]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold font-spacemono uppercase text-slate-500 dark:text-[#6b6b80] mb-1.5">Project Title</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Hyperion Analytical Console"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-[#00ff88] transition-all text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-spacemono uppercase text-slate-500 dark:text-[#6b6b80] mb-1.5">Description</label>
                  <textarea 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a high-fidelity summary of your project..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-[#00ff88] transition-all text-slate-800 dark:text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold font-spacemono uppercase text-slate-500 dark:text-[#6b6b80] mb-1.5">Tag / Category</label>
                    <input 
                      type="text" 
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="e.g. AI SaaS, Creative"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-[#00ff88] transition-all text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold font-spacemono uppercase text-slate-500 dark:text-[#6b6b80] mb-1.5">Duration</label>
                    <input 
                      type="text" 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 2 Months"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-[#00ff88] transition-all text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-spacemono uppercase text-slate-500 dark:text-[#6b6b80] mb-1.5">Live Project URL / Link</label>
                  <input 
                    type="url" 
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    placeholder="e.g. https://my-awesome-site.vercel.app/"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-[#00ff88] transition-all text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-spacemono uppercase text-slate-500 dark:text-[#6b6b80] mb-1.5">Tech Stack (comma separated)</label>
                  <input 
                    type="text" 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. React, Next.js, Redux, Tailwind"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-[#00ff88] transition-all text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-spacemono uppercase text-slate-500 dark:text-[#6b6b80] mb-1.5">Unsplash Image URL (Optional)</label>
                  <input 
                    type="url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-[#00ff88] transition-all text-slate-800 dark:text-white"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#00ff88] text-[#050507] hover:bg-[#00e077] transition-colors rounded-xl font-bold tracking-wider font-spacemono uppercase cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Save Project & Publish
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
