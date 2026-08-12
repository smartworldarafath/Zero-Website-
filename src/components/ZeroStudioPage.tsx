import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export function ZeroStudioPage({ 
  onBack, 
  onPricingClick,
  onProjectsClick,
}: { 
  onBack: () => void;
  onPricingClick: () => void;
  onProjectsClick: () => void;
}) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'open-pricing') {
        onPricingClick();
      } else if (event.data === 'open-projects') {
        onProjectsClick();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onPricingClick, onProjectsClick]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-[60] flex flex-col bg-transparent"
    >
      <div className="absolute top-6 left-6 z-[100] flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full text-black dark:text-white hover:bg-white/20 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>
      <iframe 
        src="/zero-studio-code.html" 
        className="w-full h-full border-none bg-transparent"
        title="Zero Studio Code"
      />
    </motion.div>
  );
}
