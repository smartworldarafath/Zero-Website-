import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronDown, X, User } from 'lucide-react';
import React, { useState } from 'react';

type SidebarItem = {
  id: string;
  label: string;
  children?: SidebarItem[];
  url?: string;
};

const sidebarData: SidebarItem[] = [
  { id: 'build-apps', label: 'Build Apps' },
  { id: 'build-website', label: 'Build Website' },
  {
    id: 'ai',
    label: 'AI',
    children: [
      {
        id: 'ai-resume',
        label: 'AI Resume / CV Builder',
        children: [
          { id: 'cv-job', label: 'CV For JOB' },
          { id: 'cv-student', label: 'CV For Student' },
          { id: 'ai-resume-analyzer', label: 'AI Resume Analyzer' },
          { id: 'detect-mistakes', label: 'Detect mistakes' },
          { id: 'suggest-improvements', label: 'Suggest improvements' },
          { id: 'give-resume-score', label: 'Give a resume score' },
        ],
      },
      {
        id: 'ai-code',
        label: 'AI Code Generator',
        children: [
          { id: 'html', label: 'HTML' },
          { id: 'java', label: 'JAVA' },
          { id: 'python', label: 'Python' },
          { id: 'kothin', label: 'Kothin' },
        ],
      },
      {
        id: 'ai-email',
        label: 'AI Email Writer',
        children: [
          { id: 'job-email', label: 'Job application email' },
          { id: 'business-email', label: 'Business email' },
          { id: 'complaint-email', label: 'Complaint email' },
          { id: 'university-email', label: 'University email' },
          { id: 'email-replier', label: 'AI Email Replier' },
        ],
      },
      {
        id: 'sop-generator',
        label: '(SOP) Generator',
        children: [
          { id: 'university', label: 'University' },
          { id: 'student-visa', label: 'Student Visa' },
          { id: 'sop-checker', label: 'SOP checker' },
          { id: 'human-sop', label: 'Human SOP writer' },
        ],
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    children: [
      { id: 'apps', label: 'Apps' },
      { id: 'websites', label: 'Websites' },
    ],
  },
  {
    id: 'contract',
    label: 'Contract',
    children: [
      { id: 'mail', label: 'Mail', url: 'mailto:arafathrahman711@gmail.com' },
      { id: 'telegram', label: 'Telegram', url: 'https://t.me/open_souce_bangladesh' },
      { id: 'github', label: 'Github', url: 'https://github.com/smartworldarafath' },
      {
        id: 'about',
        label: 'About',
        children: [
          { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/arafath_rahman_?igsh=emo2c2tjZ2VhemVi' },
          { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/arafath.rahman.57956' },
          { id: 'other', label: 'Other' },
        ],
      },
    ],
  },
];

const MenuItem: React.FC<{ item: SidebarItem; depth?: number; onToolClick?: (id: string) => void }> = ({ item, depth = 0, onToolClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else if (onToolClick) {
      onToolClick(item.id);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 hover:-translate-y-1 hover:shadow-lg ${
          depth === 0 ? 'bg-white/90 dark:bg-[#141f38]/40 mb-2 border-t border-l border-white/50 dark:border-[#40485d]/20 shadow-sm dark:shadow-none' : ''
        }`}
        style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
      >
        <span className={`text-sm ${depth === 0 ? 'font-bold text-gray-800 dark:text-white' : 'font-medium text-gray-600 dark:text-white/90'}`}>
          {item.label}
        </span>
        {hasChildren && (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-white/50" />
          </motion.div>
        )}
      </button>

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="py-1">
              {item.children!.map((child) => (
                <MenuItem key={child.id} item={child} depth={depth + 1} onToolClick={onToolClick} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function Sidebar({ isOpen, onClose, onUpgradeClick, onToolClick }: { isOpen: boolean; onClose: () => void; onUpgradeClick: () => void; onToolClick?: (id: string) => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] sm:w-[320px] bg-slate-100/95 dark:bg-[#0f1930]/80 backdrop-blur-[40px] border-r border-slate-200 dark:border-[#40485d]/20 z-50 flex flex-col shadow-2xl will-change-transform font-body"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <img src="/logo.png" alt="Zero Studio" className="h-16 w-auto object-contain drop-shadow-md" />
                <p className="text-[10px] font-black text-[#8cacff] font-headline uppercase tracking-[0.2em] ml-1 mt-2">Categories</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-white/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-hide">
              {sidebarData.map((item) => (
                <MenuItem key={item.id} item={item} onToolClick={onToolClick} />
              ))}
            </div>

            <div className="p-4 mt-auto">
              <div 
                onClick={() => {
                  onUpgradeClick();
                  onClose();
                }}
                className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-[#40485d]/10 dark:border-white/5 p-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer group shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8cacff] to-[#769dff] flex items-center justify-center text-[#002a6e] shrink-0 shadow-lg group-hover:shadow-[#8cacff]/50 transition-shadow">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-gray-800 dark:text-white">Admin User</p>
                  <p className="text-[10px] text-[#8cacff] dark:text-[#9bddff] font-bold font-label uppercase tracking-tighter group-hover:text-[#769dff] transition-colors">Upgrade to Premium</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
