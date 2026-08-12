import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Mail, Reply, FileText, Briefcase, GraduationCap, PenTool,
  Menu, X, ArrowLeft, Moon, Sun, LayoutDashboard, Sparkles,
  HelpCircle, FileSignature, ShieldCheck, User, MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { AnimatedBackground } from './AnimatedBackground';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'motion/react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Email Writer', href: '/email-writer', icon: Mail },
  { name: 'Email Replier', href: '/email-replier', icon: Reply },
  { name: 'SOP Writer', href: '/sop-writer', icon: PenTool },
  { name: 'SOP Analyzer', href: '/sop-analyzer', icon: GraduationCap },
  { name: 'CV Builder', href: '/cv-builder', icon: Briefcase },
  { name: 'CV Analyzer', href: '/cv-analyzer', icon: FileText },
];

const legalNavigation = [
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
  { name: 'Contact Us', href: '/contact', icon: MessageSquare },
  { name: 'Developer', href: '/developer', icon: User },
  { name: 'Terms of Service', href: '/terms', icon: FileSignature },
  { name: 'Privacy Policy', href: '/policy', icon: ShieldCheck },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex text-gray-900 dark:text-gray-100 selection:bg-indigo-500/30 font-sans">
      <AnimatedBackground />

      {/* Mobile sidebar overlay */}
      <div className={cn(
        "fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-[8px] lg:hidden transition-opacity duration-300",
        sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white/10 dark:bg-black/20 backdrop-blur-[28px] border-r border-white/10 transform transition-transform duration-500 ease-out lg:translate-x-0 flex flex-col overflow-hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-20 px-8">
          <div className="flex items-center space-x-3">
            <img 
              src="/Untitled_design-removebg-preview.png" 
              alt="Zero Studio Logo" 
              className="w-12 h-12 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl font-bold tracking-tight">Zero Studio</span>
          </div>
          <button className="lg:hidden p-2 hover:bg-white/10 rounded-full" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6 px-2">
            Tools & Utilities
          </p>
          <nav className="space-y-1.5 mb-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-white/20 dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)]" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-white/5"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    )} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6 px-2">
            Legal & Support
          </p>
          <nav className="space-y-1.5">
            {legalNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-white/20 dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.05)]" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-white/5"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    )} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Pro Widget */}
        <div className="mt-auto p-6">
          <div className="p-5 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 backdrop-blur-[17px]">
            <p className="text-xs font-bold mb-1">Pro Features Active</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">Powered by Gemini 2.5</p>
            <div className="h-1.5 w-full bg-gray-200/20 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-gradient-to-r from-indigo-500 to-purple-500" />
            </div>
            <p className="text-[9px] text-right mt-1.5 text-gray-500">Tokens remaining</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-72">
        <header className="h-20 flex items-center justify-between px-8 z-10">
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded-full text-gray-700 dark:text-gray-300 mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {!isHome && (
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-[11px] rounded-xl border border-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 bg-white/10 dark:bg-white/5 backdrop-blur-[11px] rounded-xl border border-white/10 hover:scale-105 transition-transform"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
