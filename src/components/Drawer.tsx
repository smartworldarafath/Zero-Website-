import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ isOpen, onClose, title, description, children, className }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-y-0 right-0 z-[70] w-full sm:w-[500px] md:w-[600px] bg-white dark:bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col",
              className
            )}
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
