import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Key, Lock, Unlock, LogOut, Plus, Edit2, Trash2, Globe, 
  ExternalLink, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, 
  Settings, DollarSign, Layout, Bell, Users, Database, ArrowLeft, 
  ArrowRight, Download, Upload, Eye, EyeOff, Search, ChevronUp, 
  ChevronDown, Mail, Cpu, Zap, Activity, MessageSquare, Laptop, 
  Check, X, Copy, Layers, ShieldCheck, Flame, Server, AlertCircle
} from 'lucide-react';
import { 
  getStoredProjects, 
  saveStoredProjects, 
  getPricingConfig, 
  savePricingConfig, 
  getAnnouncementConfig, 
  saveAnnouncementConfig, 
  getSiteCmsConfig,
  saveSiteCmsConfig,
  getAiGatewayConfig,
  saveAiGatewayConfig,
  getRegisteredUsers,
  saveRegisteredUsers,
  getContactInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getSiteAnalytics,
  getAdminPin,
  saveAdminPin,
  verifyAdminPin,
  checkAdminAuth,
  setAdminAuth,
  exportFullDatabase,
  importFullDatabase,
  resetToFactoryDefaults,
  ProjectItem, 
  PricingConfig, 
  AnnouncementConfig,
  SiteCmsConfig,
  AiGatewayConfig,
  SiteAnalytics,
  ContactInquiry,
  UserPlanData
} from '../utils/storage';

type AdminTab = 
  | 'overview' 
  | 'projects' 
  | 'cms' 
  | 'pricing' 
  | 'users' 
  | 'inquiries' 
  | 'announcement' 
  | 'ai' 
  | 'settings';

interface AdminPortalProps {
  onBack: () => void;
}

export function AdminPortal({ onBack }: AdminPortalProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkAdminAuth());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Active Tab with URL hash sync
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const tabParam = params.get('tab') as AdminTab;
      if (['overview', 'projects', 'cms', 'pricing', 'users', 'inquiries', 'announcement', 'ai', 'settings'].includes(tabParam)) {
        return tabParam;
      }
    }
    return 'overview';
  });

  // Data States
  const [projects, setProjects] = useState<ProjectItem[]>(getStoredProjects());
  const [pricing, setPricing] = useState<PricingConfig>(getPricingConfig());
  const [announcement, setAnnouncement] = useState<AnnouncementConfig>(getAnnouncementConfig());
  const [cms, setCms] = useState<SiteCmsConfig>(getSiteCmsConfig());
  const [aiConfig, setAiConfig] = useState<AiGatewayConfig>(getAiGatewayConfig());
  const [analytics, setAnalytics] = useState<SiteAnalytics>(getSiteAnalytics());
  const [users, setUsers] = useState<UserPlanData[]>(getRegisteredUsers());
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(getContactInquiries());

  // UI States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [previewDrawerProject, setPreviewDrawerProject] = useState<ProjectItem | null>(null);

  // Project Modal Form State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTech, setFormTech] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  // PIN Change State
  const [newPinInput, setNewPinInput] = useState('');

  // Sync Tab to URL Hash for Browser Back/Forward navigation
  const switchTab = (tab: AdminTab, pushHistory = true) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined' && pushHistory) {
      window.history.pushState({ adminTab: tab }, '', `#/admin?tab=${tab}`);
    }
  };

  // Listen for Browser Back & Forward buttons
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (window.location.hash.startsWith('#admin') || window.location.hash.startsWith('#/admin')) {
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const tabParam = params.get('tab') as AdminTab;
        if (tabParam && ['overview', 'projects', 'cms', 'pricing', 'users', 'inquiries', 'announcement', 'ai', 'settings'].includes(tabParam)) {
          setActiveTab(tabParam);
        } else {
          setActiveTab('overview');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Storage Sync Listener
  useEffect(() => {
    const handleStorageSync = () => {
      setProjects(getStoredProjects());
      setPricing(getPricingConfig());
      setAnnouncement(getAnnouncementConfig());
      setCms(getSiteCmsConfig());
      setAiConfig(getAiGatewayConfig());
      setAnalytics(getSiteAnalytics());
      setUsers(getRegisteredUsers());
      setInquiries(getContactInquiries());
    };
    window.addEventListener('zero_storage_sync', handleStorageSync);
    return () => window.removeEventListener('zero_storage_sync', handleStorageSync);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Authentication Handlers ──
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pinInput)) {
      setAdminAuth(true);
      setIsAuthenticated(true);
      setPinError(false);
      showToast('Admin Access Granted! Welcome to Zero Control Center.');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
    setPinInput('');
    showToast('Logged out of Admin Portal.');
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length >= 4) {
      saveAdminPin(newPinInput.trim());
      setNewPinInput('');
      showToast(`Security PIN successfully updated to: ${newPinInput.trim()}`);
    } else {
      showToast('PIN must be at least 4 characters long.');
    }
  };

  // ── Projects CRUD Handlers ──
  const openNewProjectModal = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormDesc('');
    setFormTech('React, Tailwind CSS, Vercel');
    setFormLink('');
    setFormImage('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80');
    setFormTag('Enterprise Web');
    setFormFeatured(false);
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
    setFormFeatured(!!proj.featured);
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
        tag: formTag || 'Enterprise Web',
        featured: formFeatured
      } : p);
      showToast(`Project "${formTitle}" updated live!`);
    } else {
      const newProj: ProjectItem = {
        id: 'proj-' + Date.now(),
        title: formTitle,
        description: formDesc,
        tech: formTech.split(',').map(t => t.trim()).filter(Boolean),
        link: formLink || '#',
        image: formImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        tag: formTag || 'Enterprise Web',
        duration: 'Live Project',
        featured: formFeatured,
        visible: true
      };
      updated = [newProj, ...projects];
      showToast(`Project "${formTitle}" published live to Explore Projects!`);
    }

    setProjects(updated);
    saveStoredProjects(updated);
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete project "${title}"?`)) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      saveStoredProjects(updated);
      showToast(`Project "${title}" deleted from live website.`);
    }
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const newArr = [...projects];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    setProjects(newArr);
    saveStoredProjects(newArr);
  };

  const toggleProjectVisibility = (id: string) => {
    const updated = projects.map(p => p.id === id ? { ...p, visible: p.visible === false ? true : false } : p);
    setProjects(updated);
    saveStoredProjects(updated);
    showToast('Project visibility updated.');
  };

  // ── CMS Save ──
  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteCmsConfig(cms);
    showToast('Website Hero Content & CMS updated in Realtime!');
  };

  // ── Pricing Save ──
  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    savePricingConfig(pricing);
    showToast('Pricing and Free Trial duration updated in Realtime!');
  };

  // ── Announcement Save ──
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    saveAnnouncementConfig(announcement);
    showToast('Live Top Announcement Banner broadcasted!');
  };

  // ── AI Gateway Save ──
  const handleSaveAiGateway = (e: React.FormEvent) => {
    e.preventDefault();
    saveAiGatewayConfig(aiConfig);
    showToast('AI Model routing & gateway configuration saved!');
  };

  // ── User Management Handlers ──
  const handleExtendUserTrial = (userId: string, extraDays: number) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          trialDays: (u.trialDays || 25) + extraDays,
          status: 'active' as const
        };
      }
      return u;
    });
    setUsers(updated);
    saveRegisteredUsers(updated);
    showToast(`Added +${extraDays} days to user subscription.`);
  };

  // ── Inquiries Handlers ──
  const handleToggleInquiryStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'new' ? 'contacted' : currentStatus === 'contacted' ? 'resolved' : 'new';
    updateInquiryStatus(id, nextStatus as any);
    showToast(`Inquiry status updated to: ${nextStatus.toUpperCase()}`);
  };

  // ── Database Backup / Restore ──
  const handleDownloadBackup = () => {
    const jsonStr = exportFullDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zero-studio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database exported successfully as JSON!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importFullDatabase(content)) {
        showToast('Database backup restored and verified successfully!');
      } else {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('WARNING: Reset all site configurations and projects back to factory defaults?')) {
      resetToFactoryDefaults();
      showToast('All settings reset to Factory Defaults.');
    }
  };

  // ───────────────────────────────────────────────
  // ── LOGIN GATE SCREEN (Security PIN: 4048) ────
  // ───────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-transparent relative z-30 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white/80 dark:bg-[#0c1427]/90 backdrop-blur-3xl border border-gray-200 dark:border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-gray-900 dark:text-white"
        >
          {/* Neon Gradient Orbs */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#00ff88]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#8cacff]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00ff88]/20 to-[#8cacff]/20 border border-[#00ff88]/40 flex items-center justify-center mb-4 shadow-inner">
              <Shield className="w-8 h-8 text-[#00ff88]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-headline tracking-tight">Zero Studio Admin</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-body">Authorized Administrator Realtime Site Control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 font-label">Security PIN</label>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-[11px] text-[#8cacff] hover:underline cursor-pointer flex items-center gap-1"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPin ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4-Digit PIN (4048)"
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-100 dark:bg-black/50 border border-gray-300 dark:border-white/15 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff88] transition-colors text-center font-mono text-xl tracking-[0.3em]"
                  autoFocus
                />
              </div>

              {pinError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-bold mt-2 text-center flex items-center justify-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Enter 4048.
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#00ff88] to-[#00e077] text-[#050507] rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg shadow-[#00ff88]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" /> Authenticate & Access Admin
            </button>

            {/* Quick Fill Button & Back */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => { setPinInput('4048'); }}
                className="text-[#00ff88] font-bold hover:underline cursor-pointer flex items-center gap-1 font-mono"
              >
                <Sparkles className="w-3.5 h-3.5" /> Quick Fill PIN (4048)
              </button>
              <button
                type="button"
                onClick={onBack}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Back to Home &rarr;
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // ───────────────────────────────────────────────
  // ── MAIN ADMIN DASHBOARD & CMS WORKBENCH ───────
  // ───────────────────────────────────────────────
  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
    p.tag.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
    p.tech.some(t => t.toLowerCase().includes(searchProjectQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen w-full py-6 px-3 sm:px-8 text-gray-900 dark:text-white relative z-30 font-sans pb-24">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#00ff88] text-[#050507] font-bold text-xs shadow-2xl flex items-center gap-2 border border-black/10 backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── TOP ACTION BAR WITH BROWSER BACK/FORWARD & BREADCRUMBS ── */}
        <header className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-4 sm:p-5 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            
            {/* Browser Back / Forward Controls */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Browser Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.history.forward()}
                className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Browser Forward"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Back to Website */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-2xl text-xs font-bold font-label transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#00ff88]" />
              <span>Back to Website</span>
            </button>

            {/* Breadcrumb Path */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
              <span>Zero Studio</span>
              <span>/</span>
              <span className="text-[#00ff88] font-bold uppercase">{activeTab}</span>
            </div>
          </div>

          {/* Admin Header Right */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] text-[11px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span>Live Realtime Sync Active</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* ── NAVIGATION TABS BAR ── */}
        <div className="bg-white/50 dark:bg-[#0c1427]/60 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-2 rounded-3xl shadow-lg overflow-x-auto scrollbar-hide flex items-center gap-1.5">
          {[
            { id: 'overview', label: 'Overview & Stats', icon: <Activity className="w-4 h-4" /> },
            { id: 'projects', label: 'Live Projects', icon: <Laptop className="w-4 h-4" />, count: projects.length },
            { id: 'cms', label: 'Website CMS', icon: <Layout className="w-4 h-4" /> },
            { id: 'pricing', label: 'Pricing & Trials', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'users', label: 'Subscribers & CRM', icon: <Users className="w-4 h-4" />, count: users.length },
            { id: 'inquiries', label: 'Inquiries Inbox', icon: <MessageSquare className="w-4 h-4" />, count: inquiries.filter(i => i.status === 'new').length },
            { id: 'announcement', label: 'Announcement', icon: <Bell className="w-4 h-4" /> },
            { id: 'ai', label: 'AI Gateway', icon: <Cpu className="w-4 h-4" /> },
            { id: 'settings', label: 'Security & Backup', icon: <Settings className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold font-label whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#00ff88] text-[#050507] shadow-md shadow-[#00ff88]/20 scale-[1.02]'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT CONTAINERS ── */}
        <main>
          
          {/* ═════════════════════════════════════════════════ */}
          {/* ── 1. OVERVIEW & ANALYTICS DASHBOARD ──────────── */}
          {/* ═════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold font-label uppercase text-gray-500 dark:text-gray-400 tracking-wider">Total Site Visits</span>
                    <h3 className="text-3xl font-black font-headline mt-1">{analytics.totalVisits.toLocaleString()}</h3>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold mt-1 inline-block">+14% this week</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#8cacff]/10 text-[#8cacff] flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold font-label uppercase text-gray-500 dark:text-gray-400 tracking-wider">AI Generations</span>
                    <h3 className="text-3xl font-black font-headline mt-1 text-[#00ff88]">{analytics.aiGenerations.toLocaleString()}</h3>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold mt-1 inline-block">20x Groq Pool Active</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold font-label uppercase text-gray-500 dark:text-gray-400 tracking-wider">Free Trials (25 Days)</span>
                    <h3 className="text-3xl font-black font-headline mt-1 text-indigo-400">{analytics.trialActivations}</h3>
                    <span className="text-[11px] font-mono text-indigo-300 font-bold mt-1 inline-block">Active Subscriptions</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold font-label uppercase text-gray-500 dark:text-gray-400 tracking-wider">Client Inquiries</span>
                    <h3 className="text-3xl font-black font-headline mt-1 text-sky-400">{inquiries.length}</h3>
                    <span className="text-[11px] font-mono text-sky-300 font-bold mt-1 inline-block">{inquiries.filter(i => i.status === 'new').length} Unread</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Quick Workbench & Server Health */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Quick Action Matrix */}
                <div className="lg:col-span-2 bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                  <div>
                    <h4 className="text-lg font-black font-headline tracking-tight">Quick Administrator Actions</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Perform direct updates to live site components with 1-click execution.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={openNewProjectModal}
                      className="p-4 rounded-2xl bg-[#00ff88]/10 hover:bg-[#00ff88]/20 border border-[#00ff88]/30 text-left transition-all cursor-pointer group flex items-start justify-between"
                    >
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#00ff88] transition-colors">Publish Live Project</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add a new verified web deployment into showcase</p>
                      </div>
                      <Plus className="w-5 h-5 text-[#00ff88]" />
                    </button>

                    <button
                      onClick={() => switchTab('announcement')}
                      className="p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-left transition-all cursor-pointer group flex items-start justify-between"
                    >
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-400 transition-colors">Broadcast Announcement</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set urgent alerts or deals on top header</p>
                      </div>
                      <Bell className="w-5 h-5 text-indigo-400" />
                    </button>

                    <button
                      onClick={() => switchTab('pricing')}
                      className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all cursor-pointer group flex items-start justify-between"
                    >
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-400 transition-colors">Adjust Free Trial Rules</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Change default 25-day trial or pricing rates</p>
                      </div>
                      <DollarSign className="w-5 h-5 text-amber-400" />
                    </button>

                    <button
                      onClick={handleDownloadBackup}
                      className="p-4 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-left transition-all cursor-pointer group flex items-start justify-between"
                    >
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-sky-400 transition-colors">Export Site Database</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Download complete JSON backup</p>
                      </div>
                      <Download className="w-5 h-5 text-sky-400" />
                    </button>
                  </div>
                </div>

                {/* Server Status & Cloud Node */}
                <div className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                  <div>
                    <h4 className="text-lg font-black font-headline tracking-tight">System Infrastructure</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Deployment and API Gateway status.</p>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-white/5">
                      <span className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-[#00ff88]" /> Vercel Edge SPA
                      </span>
                      <span className="text-[#00ff88] font-bold">100% OPERATIONAL</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-white/5">
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#8cacff]" /> Groq API 20x Rotation
                      </span>
                      <span className="text-[#8cacff] font-bold">ACTIVE</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-white/5">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-400" /> Storage Synchronization
                      </span>
                      <span className="text-indigo-400 font-bold">REALTIME</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-white/5">
                      <span className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-emerald-400" /> Admin Security PIN
                      </span>
                      <span className="text-emerald-400 font-bold">PROTECTED (4048)</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════ */}
          {/* ── 2. LIVE PROJECTS MANAGER (CRUD) ────────────── */}
          {/* ═════════════════════════════════════════════════ */}
          {activeTab === 'projects' && (
            <motion.div
              key="tab-projects"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 rounded-3xl shadow-xl">
                <div>
                  <h3 className="text-2xl font-black font-headline tracking-tight">Live Deployed Projects</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage real enterprise portals appearing in Explore Projects & Homepage.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={searchProjectQuery}
                      onChange={(e) => setSearchProjectQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs"
                    />
                  </div>
                  <button
                    onClick={openNewProjectModal}
                    className="px-5 py-2.5 rounded-xl bg-[#00ff88] text-[#050507] font-bold text-xs shadow-lg shadow-[#00ff88]/20 flex items-center gap-2 hover:brightness-110 active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" /> Add New Project
                  </button>
                </div>
              </div>

              {/* Projects Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((proj, idx) => (
                  <div 
                    key={proj.id}
                    className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-[#00ff88]/40 transition-colors"
                  >
                    <div>
                      {/* Image header */}
                      <div className="h-44 relative overflow-hidden bg-black">
                        <img 
                          src={proj.image} 
                          alt={proj.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-bold font-mono text-[#00ff88] border border-white/20">
                            {proj.tag}
                          </span>
                        </div>

                        {/* Quick Action Top Right */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={() => moveProject(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveProject(idx, 'down')}
                            disabled={idx === projects.length - 1}
                            className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <h4 className="text-base font-extrabold text-gray-900 dark:text-white">{proj.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{proj.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {proj.tech.map((t, tidx) => (
                            <span key={tidx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-5 pt-0 border-t border-gray-100 dark:border-white/5 flex items-center justify-between mt-4">
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#8cacff] hover:underline flex items-center gap-1"
                      >
                        Visit Site <ExternalLink className="w-3 h-3" />
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProjectModal(proj)}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════ */}
          {/* ── 3. WEBSITE CMS & HERO CONTENT ──────────────── */}
          {/* ═════════════════════════════════════════════════ */}
          {activeTab === 'cms' && (
            <motion.div
              key="tab-cms"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 max-w-3xl"
            >
              <div>
                <h3 className="text-2xl font-black font-headline tracking-tight">Website Content CMS</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Update homepage headlines, hero tagline, contact address and global announcements.</p>
              </div>

              <form onSubmit={handleSaveCms} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Top Pill Badge Text</label>
                  <input
                    type="text"
                    value={cms.badgeText}
                    onChange={(e) => setCms({ ...cms, badgeText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Main Hero Headline</label>
                  <input
                    type="text"
                    value={cms.heroTitle}
                    onChange={(e) => setCms({ ...cms, heroTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle Paragraph</label>
                  <textarea
                    value={cms.heroSubtitle}
                    onChange={(e) => setCms({ ...cms, heroSubtitle: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      value={cms.contactEmail}
                      onChange={(e) => setCms({ ...cms, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">GitHub Repository URL</label>
                    <input
                      type="url"
                      value={cms.githubUrl}
                      onChange={(e) => setCms({ ...cms, githubUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#00ff88] text-[#050507] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00ff88]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Save Realtime CMS Changes
                </button>
              </form>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════ */}
          {/* ── 4. PRICING & FREE TRIAL ENGINE ─────────────── */}
          {/* ═════════════════════════════════════════════════ */}
          {activeTab === 'pricing' && (
            <motion.div
              key="tab-pricing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 max-w-3xl"
            >
              <div>
                <h3 className="text-2xl font-black font-headline tracking-tight">Pricing & Free Trial Rules</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Configure free trial days, plan prices, and annual discount percentages.</p>
              </div>

              <form onSubmit={handleSavePricing} className="space-y-6">
                
                {/* Trial Duration Setting */}
                <div className="p-4 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">Free Trial Duration (Days)</label>
                    <span className="text-sm font-black font-mono text-[#00ff88]">{pricing.trialDurationDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min={7}
                    max={60}
                    value={pricing.trialDurationDays}
                    onChange={(e) => setPricing({ ...pricing, trialDurationDays: Number(e.target.value) })}
                    className="w-full accent-[#00ff88] cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-600 dark:text-gray-400">Users who click "Try Now" will get this number of free days before requiring pack activation.</p>
                </div>

                {/* Plan Rates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Core Pro Monthly Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pricing.coreMonthly}
                      onChange={(e) => setPricing({ ...pricing, coreMonthly: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Core Pro Annual Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pricing.coreAnnual}
                      onChange={(e) => setPricing({ ...pricing, coreAnnual: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Enterprise Monthly Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pricing.enterpriseMonthly}
                      onChange={(e) => setPricing({ ...pricing, enterpriseMonthly: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Annual Discount Percentage (%)</label>
                    <input
                      type="number"
                      value={pricing.discountPercent}
                      onChange={(e) => setPricing({ ...pricing, discountPercent: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#00ff88] text-[#050507] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00ff88]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Save Pricing Rules
                </button>
              </form>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════ */}
          {/* ── 5. USER SUBSCRIBERS & CRM ──────────────────── */}
          {/* ═════════════════════════════════════════════════ */}
          {activeTab === 'users' && (
            <motion.div
              key="tab-users"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black font-headline tracking-tight">Active Subscriptions & Users</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View and extend trial periods for registered platform users.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 uppercase font-mono">
                      <th className="pb-3">User</th>
                      <th className="pb-3">Plan</th>
                      <th className="pb-3">Trial Days</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-sans">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="py-3.5">
                          <div className="font-bold text-gray-900 dark:text-white">{u.name || 'Anonymous User'}</div>
                          <div className="text-[11px] text-gray-500 font-mono">{u.email || 'guest@zerostudio.app'}</div>
                        </td>
                        <td className="py-3.5">
                          <span className="px-2.5 py-1 rounded-full font-mono uppercase text-[10px] font-bold bg-[#00ff88]/15 text-[#00ff88]">
                            {u.plan}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono">{u.trialDays} Days</td>
                        <td className="py-3.5">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleExtendUserTrial(u.id!, 7)}
                            className="px-3 py-1 bg-gray-100 dark:bg-white/10 hover:bg-[#00ff88] hover:text-black rounded-lg transition-colors cursor-pointer font-bold font-mono text-[10px]"
                          >
                            +7 Days
                          </button>
                          <button
                            onClick={() => handleExtendUserTrial(u.id!, 30)}
                            className="px-3 py-1 bg-gray-100 dark:bg-white/10 hover:bg-[#00ff88] hover:text-black rounded-lg transition-colors cursor-pointer font-bold font-mono text-[10px]"
                          >
                            +30 Days
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════ */}
          {/* ── 6. INQUIRIES INBOX (LEADS CRM) ─────────────── */}
          {/* ═════════════════════════════════════════════════ */}
          {activeTab === 'inquiries' && (
            <motion.div
              key="tab-inquiries"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black font-headline tracking-tight">Enterprise Client Inquiries</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Direct inquiries received from the website's Contact Us form.</p>
                </div>
              </div>

              <div className="space-y-4">
                {inquiries.map(inq => (
                  <div 
                    key={inq.id}
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">{inq.name}</h4>
                          <span className="text-xs font-mono text-gray-400">({inq.company || 'Individual'})</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                            inq.status === 'new' ? 'bg-amber-500/20 text-amber-400' : inq.status === 'contacted' ? 'bg-sky-500/20 text-sky-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{inq.email} • Scope: {inq.project || 'Web App'}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${inq.email}?subject=Zero Studio Enterprise Inquiry Response&body=Hi ${inq.name},\n\nThank you for reaching out to Zero Studio regarding ${inq.project}...\n\nBest regards,\nArafath Rahman`}
                          className="px-3 py-1.5 rounded-xl bg-[#8cacff] text-[#002a6e] font-bold text-xs flex items-center gap-1.5 hover:brightness-110"
                        >
                          <Mail className="w-3.5 h-3.5" /> Reply Email
                        </a>
                        <button
                          onClick={() => handleToggleInquiryStatus(inq.id, inq.status)}
                          className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-white/10 text-xs font-bold hover:bg-gray-300 dark:hover:bg-white/20 cursor-pointer"
                        >
                          Change Status
                        </button>
                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-black/40 p-3.5 rounded-xl leading-relaxed">
                      "{inq.message}"
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════ */}
          {/* ── 7. ANNOUNCEMENT BANNER BROADCASTER ─────────── */}
          {/* ═════════════════════════════════════════════════ */}
          {activeTab === 'announcement' && (
            <motion.div
              key="tab-announcement"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 max-w-2xl"
            >
              <div>
                <h3 className="text-2xl font-black font-headline tracking-tight">Top Announcement Banner</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Broadcast dynamic message banners at the top of the entire website.</p>
              </div>

              <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <input
                    type="checkbox"
                    id="ann-enabled"
                    checked={announcement.enabled}
                    onChange={(e) => setAnnouncement({ ...announcement, enabled: e.target.checked })}
                    className="w-5 h-5 accent-[#00ff88] rounded cursor-pointer"
                  />
                  <label htmlFor="ann-enabled" className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white cursor-pointer">
                    Enable Top Header Announcement Banner
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Banner Announcement Text</label>
                  <input
                    type="text"
                    value={announcement.text}
                    onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Action Button Text</label>
                    <input
                      type="text"
                      value={announcement.linkText || ''}
                      onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
                      placeholder="e.g. Try Now"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Action Link Target</label>
                    <input
                      type="text"
                      value={announcement.linkUrl || ''}
                      onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
                      placeholder="e.g. #pricing"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#00ff88] text-[#050507] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00ff88]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Broadcast Announcement
                </button>
              </form>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════ */}
          {/* ── 8. AI GATEWAY & MODEL CONTROLLER ───────────── */}
          {/* ═════════════════════════════════════════════════ */}
          {activeTab === 'ai' && (
            <motion.div
              key="tab-ai"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 max-w-2xl"
            >
              <div>
                <h3 className="text-2xl font-black font-headline tracking-tight">AI Gateway & Model Engine</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage 20x Groq API acceleration, Gemini grounding, and default models.</p>
              </div>

              <form onSubmit={handleSaveAiGateway} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Default AI Model in Studio Code</label>
                  <select
                    value={aiConfig.defaultModelId}
                    onChange={(e) => setAiConfig({ ...aiConfig, defaultModelId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#060e20] border border-gray-300 dark:border-white/15 text-sm"
                  >
                    <option value="gemini-3.1-pro">Gemini 3.1 Pro (Google)</option>
                    <option value="gpt-5.5">GPT 5.5 (OpenAI)</option>
                    <option value="claude-sonnet-4.5">Claude Sonnet 4.5 (Anthropic)</option>
                    <option value="deep-seek-v4-pro">DeepSeek V4 Pro</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-3 text-xs">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiConfig.groqAcceleration}
                      onChange={(e) => setAiConfig({ ...aiConfig, groqAcceleration: e.target.checked })}
                      className="w-4 h-4 accent-[#00ff88]"
                    />
                    <span>Enable 20x Groq API Automatic Key Rotation Pool</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiConfig.geminiGrounding}
                      onChange={(e) => setAiConfig({ ...aiConfig, geminiGrounding: e.target.checked })}
                      className="w-4 h-4 accent-[#00ff88]"
                    />
                    <span>Enable Google Search Grounding with Gemini</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Global AI System Prompt</label>
                  <textarea
                    value={aiConfig.customSystemPrompt}
                    onChange={(e) => setAiConfig({ ...aiConfig, customSystemPrompt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#00ff88] text-[#050507] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00ff88]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Save AI Gateway Configuration
                </button>
              </form>
            </motion.div>
          )}

          {/* ═════════════════════════════════════════════════ */}
          {/* ── 9. SECURITY PIN & BACKUP RESTORE ───────────── */}
          {/* ═════════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <motion.div
              key="tab-settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-2xl"
            >
              {/* Change PIN Box */}
              <div className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
                <div>
                  <h3 className="text-xl font-black font-headline tracking-tight">Update Admin Security PIN</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current Default PIN: <span className="font-mono text-[#00ff88] font-bold">4048</span></p>
                </div>

                <form onSubmit={handleUpdatePin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">New Security PIN</label>
                    <input
                      type="text"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="Enter new 4+ digit PIN"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm font-mono tracking-widest"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00ff88] text-[#050507] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5" /> Save New PIN
                  </button>
                </form>
              </div>

              {/* Database Backup & Restore */}
              <div className="bg-white/70 dark:bg-[#0c1427]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
                <div>
                  <h3 className="text-xl font-black font-headline tracking-tight">Database Backup & Recovery</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Export or restore all projects, pricing, CMS text, and user data in 1-click.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDownloadBackup}
                    className="px-5 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Backup JSON
                  </button>

                  <label className="px-5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" /> Restore from JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-rose-500/5 border border-rose-500/20 p-6 sm:p-8 rounded-3xl space-y-4">
                <h4 className="text-base font-black text-rose-400">Danger Zone</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Resetting will restore all website content, live projects, and settings to original factory values.</p>
                <button
                  onClick={handleResetDefaults}
                  className="px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs cursor-pointer"
                >
                  Reset to Factory Defaults
                </button>
              </div>
            </motion.div>
          )}

        </main>

      </div>

      {/* ── PROJECT CREATE / EDIT MODAL ── */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white dark:bg-[#0c1427] border border-gray-200 dark:border-white/15 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black font-headline tracking-tight text-gray-900 dark:text-white">
                    {editingProject ? 'Edit Live Project' : 'Add New Live Project'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Will immediately publish to Explore Projects & Homepage.</p>
                </div>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Arabian Enterprise"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    required
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Detailed project summary..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Tag / Category</label>
                    <input
                      type="text"
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      placeholder="e.g. Enterprise Web"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={formTech}
                      onChange={(e) => setFormTech(e.target.value)}
                      placeholder="React, Next.js, Tailwind"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Live Project URL</label>
                  <input
                    type="url"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/15 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="feat-proj"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#00ff88] rounded cursor-pointer"
                  />
                  <label htmlFor="feat-proj" className="text-xs font-bold text-gray-800 dark:text-white cursor-pointer">
                    Feature on Homepage Carousel
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#00ff88] text-[#050507] font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00ff88]/20 hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    {editingProject ? 'Save Project Changes' : 'Publish Live Project'}
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
