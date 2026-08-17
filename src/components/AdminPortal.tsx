import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Shield, Sparkles, FolderGit2, Plus, Trash2, Edit2, 
  Save, RefreshCw, CheckCircle2, DollarSign, Bell, Users, Lock, 
  Unlock, Eye, Globe, ExternalLink, Activity, Server, Zap, ChevronRight, X
} from 'lucide-react';
import { 
  ProjectItem, 
  PricingConfig, 
  AnnouncementConfig,
  getStoredProjects, 
  saveStoredProjects, 
  getPricingConfig, 
  savePricingConfig, 
  getAnnouncementConfig, 
  saveAnnouncementConfig,
  getUserPlan,
  setUserPlan,
  checkAdminAuth,
  setAdminAuth,
  DEFAULT_PROJECTS,
  DEFAULT_PRICING
} from '../utils/storage';

export function AdminPortal({ onBack }: { onBack: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAdminAuth());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'pricing' | 'announcement' | 'users'>('overview');

  // Stored state
  const [projects, setProjects] = useState<ProjectItem[]>(getStoredProjects());
  const [pricing, setPricing] = useState<PricingConfig>(getPricingConfig());
  const [announcement, setAnnouncement] = useState<AnnouncementConfig>(getAnnouncementConfig());
  const [userPlan, setUserPlanState] = useState(getUserPlan());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Project Modal state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Form states for project
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTech, setFormTech] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formTag, setFormTag] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput.trim() === '2026' || pinInput.trim() === 'arafath711' || pinInput.trim() === 'admin') {
      setAdminAuth(true);
      setIsAuthenticated(true);
      setPinError(false);
      showToast('Admin Access Granted! Welcome.');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Projects CRUD
  const openNewProjectModal = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormDesc('');
    setFormTech('React, Tailwind CSS, Vercel');
    setFormLink('');
    setFormImage('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80');
    setFormTag('Enterprise Web');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setFormTitle(proj.title);
    setFormDesc(proj.description);
    setFormTech(proj.tech.join(', '));
    setFormLink(proj.link);
    setFormImage(proj.image);
    setFormTag(proj.tag);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDesc) return;

    let updated: ProjectItem[];
    if (editingProject) {
      updated = projects.map(p => p.id === editingProject.id ? {
        ...p,
        title: formTitle,
        description: formDesc,
        tech: formTech.split(',').map(t => t.trim()).filter(Boolean),
        link: formLink || '#',
        image: formImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        tag: formTag || 'Web App'
      } : p);
      showToast(`Project "${formTitle}" updated!`);
    } else {
      const newProj: ProjectItem = {
        id: 'proj-' + Date.now(),
        title: formTitle,
        description: formDesc,
        tech: formTech.split(',').map(t => t.trim()).filter(Boolean),
        link: formLink || '#',
        image: formImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        tag: formTag || 'New Project',
        duration: 'Live Project'
      };
      updated = [newProj, ...projects];
      showToast(`Project "${formTitle}" added to Live Website!`);
    }

    setProjects(updated);
    saveStoredProjects(updated);
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from the live website?`)) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      saveStoredProjects(updated);
      showToast(`Project "${title}" deleted.`);
    }
  };

  const handleResetProjects = () => {
    if (confirm('Reset all projects to original verified list?')) {
      setProjects(DEFAULT_PROJECTS);
      saveStoredProjects(DEFAULT_PROJECTS);
      showToast('Projects reset to default!');
    }
  };

  // Pricing Handlers
  const handleSavePricing = () => {
    savePricingConfig(pricing);
    showToast('Pricing configurations saved to live website!');
  };

  // Announcement Handlers
  const handleSaveAnnouncement = () => {
    saveAnnouncementConfig(announcement);
    showToast('Live announcement banner updated!');
  };

  // User Plan Quick Toggles
  const handleSetUserPlan = (plan: 'free' | 'core' | 'enterprise', days = 25) => {
    setUserPlan(plan, days);
    setUserPlanState(getUserPlan());
    showToast(`User plan updated to ${plan.toUpperCase()} (${days} days)!`);
  };

  // Listen for storage updates
  useEffect(() => {
    const handleSync = () => {
      setProjects(getStoredProjects());
      setPricing(getPricingConfig());
      setAnnouncement(getAnnouncementConfig());
      setUserPlanState(getUserPlan());
    };
    window.addEventListener('zero_storage_sync', handleSync);
    return () => window.removeEventListener('zero_storage_sync', handleSync);
  }, []);

  // ── Login Gate ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-transparent relative z-20">
        <div className="w-full max-w-md bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-3xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00ff88]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#8cacff]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00ff88]/20 to-[#8cacff]/20 border border-[#00ff88]/40 flex items-center justify-center mb-4 shadow-inner">
              <Shield className="w-8 h-8 text-[#00ff88]" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Zero Studio Admin Portal</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Authorized Administrator Access & Realtime Site Control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Admin Security PIN</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. 2026)"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-black/40 border border-gray-300 dark:border-white/15 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff88] transition-colors text-center font-mono text-lg tracking-widest"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-500 font-bold mt-2 text-center animate-shake">Incorrect Security PIN. Please try again.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#00ff88] to-[#00e077] text-[#050507] rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-[#00ff88]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Authenticate & Enter
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setPinInput('2026'); }}
                className="text-[11px] text-[#8cacff] hover:underline cursor-pointer"
              >
                Quick Fill PIN (2026)
              </button>
              <button
                type="button"
                onClick={onBack}
                className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Back to Website
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Main Admin Dashboard ──
  return (
    <div className="min-h-screen w-full py-8 px-4 sm:px-8 text-gray-900 dark:text-white relative z-20 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#00ff88] text-[#050507] font-bold text-xs shadow-2xl flex items-center gap-2 border border-black/10"
          >
            <CheckCircle2 className="w-4 h-4" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-all text-gray-700 dark:text-white cursor-pointer"
              title="Return to Main Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00ff88]">Realtime Connected Engine</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight">Zero Studio Admin Control Panel</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-[#8cacff]/20 text-[#8cacff] font-bold text-xs hover:bg-[#8cacff]/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" /> Live Website View
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-rose-500/15 text-rose-400 font-bold text-xs hover:bg-rose-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-4 h-4" /> Lock Admin
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white/40 dark:bg-[#0c1427]/50 backdrop-blur-xl p-2 rounded-2xl border border-gray-200 dark:border-white/10">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: <Activity className="w-4 h-4" /> },
            { id: 'projects', label: 'Live Projects Manager', icon: <FolderGit2 className="w-4 h-4" /> },
            { id: 'pricing', label: 'Pricing & Trial Config', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'announcement', label: 'Announcement Banner', icon: <Bell className="w-4 h-4" /> },
            { id: 'users', label: 'User Plan & Trials', icon: <Users className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#00ff88] text-[#050507] shadow-lg shadow-[#00ff88]/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white/60 dark:bg-[#0c1427]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-lg">
                <span className="text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400">Current User Plan</span>
                <h3 className="text-2xl font-black text-[#00ff88] mt-1 uppercase">{userPlan.plan}</h3>
                <p className="text-xs text-gray-500 mt-1">{userPlan.status === 'active' ? 'Active 25-Day Trial' : 'Not Active'}</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/60 dark:bg-[#0c1427]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-lg">
                <span className="text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400">Live Projects Count</span>
                <h3 className="text-2xl font-black text-[#8cacff] mt-1">{projects.length} Portals</h3>
                <p className="text-xs text-gray-500 mt-1">Verified Deployments on Vercel</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/60 dark:bg-[#0c1427]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-lg">
                <span className="text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400">Core Subscription</span>
                <h3 className="text-2xl font-black text-amber-400 mt-1">${pricing.coreMonthly}/mo</h3>
                <p className="text-xs text-gray-500 mt-1">{pricing.discountPercent}% Annual Discount</p>
              </div>

              <div className="p-6 rounded-3xl bg-white/60 dark:bg-[#0c1427]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-lg">
                <span className="text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400">System AI Engine</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">100% Online</h3>
                <p className="text-xs text-gray-500 mt-1">Groq + Gemini + WebGPU Active</p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-8 rounded-3xl bg-white/60 dark:bg-[#0c1427]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
              <h3 className="text-lg font-bold">Admin Rapid Operations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={openNewProjectModal}
                  className="p-4 rounded-2xl bg-[#00ff88]/15 border border-[#00ff88]/30 hover:bg-[#00ff88]/25 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Plus className="w-5 h-5 text-[#00ff88]" />
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-[#00ff88]">Add New Live Project</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Instantly publish a project to Explore Projects.</p>
                </button>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className="p-4 rounded-2xl bg-[#8cacff]/15 border border-[#8cacff]/30 hover:bg-[#8cacff]/25 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-[#8cacff]" />
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-[#8cacff]">Update Pricing & Discounts</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Edit plan rates and free trial rules.</p>
                </button>

                <button
                  onClick={() => setActiveTab('announcement')}
                  className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Bell className="w-5 h-5 text-amber-400" />
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-sm text-amber-400">Broadcast Banner Alert</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Push top announcement message live.</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: LIVE PROJECTS MANAGER ─── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold">Manage Live Deployments ({projects.length})</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Any addition, edit, or deletion updates the live Explore Projects page in real time.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetProjects}
                  className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Default
                </button>
                <button
                  onClick={openNewProjectModal}
                  className="px-5 py-2.5 rounded-xl bg-[#00ff88] text-[#050507] hover:bg-[#00e077] transition-all text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#00ff88]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Add Project
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-6 rounded-3xl bg-white/60 dark:bg-[#0c1427]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-20 h-20 rounded-2xl object-cover border border-black/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30">
                          {proj.tag}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{proj.duration}</span>
                      </div>
                      <h4 className="text-base font-bold truncate mt-1">{proj.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{proj.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#8cacff] hover:underline flex items-center gap-1 truncate max-w-[200px]"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" /> {proj.link}
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditProjectModal(proj)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white transition-all cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
                        className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 transition-all cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: PRICING & TRIAL CONFIG ─── */}
        {activeTab === 'pricing' && (
          <div className="p-8 rounded-3xl bg-white/60 dark:bg-[#0c1427]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-xl space-y-8">
            <div>
              <h3 className="text-xl font-bold">Live Pricing & Free Trial Configurations</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Controls the prices displayed on the Pricing page and the default free trial length.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Starter Free */}
              <div className="p-6 rounded-2xl bg-white/40 dark:bg-black/30 border border-gray-200 dark:border-white/10 space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-[#00ff88]">Starter Plan (Free)</span>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Monthly Price ($)</label>
                  <input
                    type="number"
                    value={pricing.starterMonthly}
                    onChange={(e) => setPricing({ ...pricing, starterMonthly: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/15 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Free Trial Days Duration</label>
                  <input
                    type="number"
                    value={pricing.trialDurationDays}
                    onChange={(e) => setPricing({ ...pricing, trialDurationDays: parseInt(e.target.value) || 25 })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/15 font-mono text-sm font-bold text-[#00ff88]"
                  />
                </div>
              </div>

              {/* Core Plan */}
              <div className="p-6 rounded-2xl bg-white/40 dark:bg-black/30 border border-indigo-500/30 space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-indigo-400">Core Plan</span>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Monthly Rate ($/mo)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricing.coreMonthly}
                    onChange={(e) => setPricing({ ...pricing, coreMonthly: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/15 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Annual Rate ($/mo)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricing.coreAnnual}
                    onChange={(e) => setPricing({ ...pricing, coreAnnual: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/15 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="p-6 rounded-2xl bg-white/40 dark:bg-black/30 border border-gray-200 dark:border-white/10 space-y-4">
                <span className="text-xs font-mono font-bold uppercase text-rose-400">Enterprise Plan</span>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Monthly Rate ($/mo)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricing.enterpriseMonthly}
                    onChange={(e) => setPricing({ ...pricing, enterpriseMonthly: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/15 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Annual Rate ($/mo)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricing.enterpriseAnnual}
                    onChange={(e) => setPricing({ ...pricing, enterpriseAnnual: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/15 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSavePricing}
                className="px-6 py-3 rounded-xl bg-[#00ff88] text-[#050507] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#00ff88]/20 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Live Pricing
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 4: ANNOUNCEMENT BANNER ─── */}
        {activeTab === 'announcement' && (
          <div className="p-8 rounded-3xl bg-white/60 dark:bg-[#0c1427]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-bold">Top Announcement Banner</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Displays a prominent announcement bar across the top of the entire website.</p>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ann-enabled"
                  checked={announcement.enabled}
                  onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })}
                  className="w-5 h-5 accent-[#00ff88] rounded cursor-pointer"
                />
                <label htmlFor="ann-enabled" className="text-sm font-bold cursor-pointer">Enable Announcement Banner</label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Banner Text Message</label>
                <input
                  type="text"
                  value={announcement.text}
                  onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  placeholder="e.g. 🚀 25-Day Free Trial Available! Explore Zero Studio Code today."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button / Link Label</label>
                  <input
                    type="text"
                    value={announcement.linkText || ''}
                    onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    placeholder="Try Now"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Link Target</label>
                  <input
                    type="text"
                    value={announcement.linkUrl || ''}
                    onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    placeholder="#pricing"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveAnnouncement}
                className="px-6 py-3 rounded-xl bg-[#00ff88] text-[#050507] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#00ff88]/20 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Live Announcement
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 5: USER PLANS & ACCESS ─── */}
        {activeTab === 'users' && (
          <div className="p-8 rounded-3xl bg-white/60 dark:bg-[#0c1427]/70 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-bold">User Plan & Trial Management</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Quickly override active user plans for testing, demonstrations, or customer activations.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/40 dark:bg-black/30 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-gray-500">Current Session Plan Status</span>
                <h4 className="text-xl font-bold text-[#00ff88] uppercase mt-1">{userPlan.plan} Plan ({userPlan.status})</h4>
                <p className="text-xs text-gray-500 mt-1">Trial duration: {userPlan.trialDays} Days</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSetUserPlan('free', 25)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs hover:bg-emerald-500/30 transition-all cursor-pointer"
                >
                  Activate 25-Day Free
                </button>
                <button
                  onClick={() => handleSetUserPlan('core', 365)}
                  className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-xs hover:bg-indigo-500/30 transition-all cursor-pointer"
                >
                  Activate Full Core
                </button>
                <button
                  onClick={() => handleSetUserPlan('enterprise', 365)}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-xs hover:bg-rose-500/30 transition-all cursor-pointer"
                >
                  Activate Enterprise
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── ADD / EDIT PROJECT MODAL ─── */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-[#0c1427] border border-gray-200 dark:border-white/15 p-8 rounded-3xl shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{editingProject ? 'Edit Live Project' : 'Add New Live Project'}</h3>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Project Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Arabian Enterprise"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Description</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Describe the application features and value proposition..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Live URL Link</label>
                    <input
                      type="url"
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      placeholder="https://my-app.vercel.app/"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Tag / Category</label>
                    <input
                      type="text"
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      placeholder="e.g. Enterprise Web"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formTech}
                    onChange={(e) => setFormTech(e.target.value)}
                    placeholder="React, Next.js, Tailwind CSS, Vercel"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">Thumbnail Image URL</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#00ff88] text-[#050507] font-bold text-xs shadow-lg shadow-[#00ff88]/20 cursor-pointer"
                  >
                    {editingProject ? 'Save Changes' : 'Publish Project'}
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
