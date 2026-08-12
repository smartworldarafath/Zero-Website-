import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'video' | 'parallax' | 'exit'>('video');

  useEffect(() => {
    // Fallback for video phase
    const timer = setTimeout(() => {
      if (phase === 'video') setPhase('parallax');
    }, 8000);

    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    // Parallax phase duration
    if (phase === 'parallax') {
      const timer = setTimeout(() => {
        setPhase('exit');
        setTimeout(onComplete, 1000);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {phase === 'video' && (
          <motion.div
            key="video-phase"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setPhase('parallax')}
            >
              <source src="/Gemini Intro PL.mp4" type="video/mp4" />
            </video>
          </motion.div>
        )}

        {phase === 'parallax' && (
          <motion.div
            key="parallax-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[102] flex items-center justify-center bg-black"
          >
            {/* Background Layer - Deep Parallax */}
            <motion.img
              src="/Untitled_design-removebg-preview.png"
              initial={{ scale: 0.5, x: -200, y: -100, opacity: 0 }}
              animate={{ scale: 1.5, x: 100, y: 50, opacity: 0.2 }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute w-[120%] h-auto object-contain blur-md opacity-20"
              referrerPolicy="no-referrer"
            />
            
            {/* Mid Layer - Fast Parallax */}
            <motion.img
              src="/Untitled_design-removebg-preview.png"
              initial={{ scale: 0.8, x: 300, y: 200, opacity: 0 }}
              animate={{ scale: 2, x: -200, y: -100, opacity: 0.4 }}
              transition={{ duration: 4, ease: "linear", delay: 0.2 }}
              className="absolute w-[100%] h-auto object-contain blur-sm opacity-40"
              referrerPolicy="no-referrer"
            />

            {/* Front Layer - Main Focus with Spring Entrance */}
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.5
              }}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.img
                src="/Untitled_design-removebg-preview.png"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-[60vw] max-w-[600px] h-auto object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]"
                referrerPolicy="no-referrer"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8 text-[#8cacff] text-xl font-black tracking-[0.5em] uppercase font-headline"
              >
                Welcome
              </motion.div>
            </motion.div>

            {/* Floating Particles - Multidirectional Parallax */}
            {[...Array(8)].map((_, i) => (
              <motion.img
                key={i}
                src="/Untitled_design-removebg-preview.png"
                initial={{ 
                  opacity: 0, 
                  x: (Math.random() - 0.5) * 1000, 
                  y: (Math.random() - 0.5) * 1000,
                  scale: 0.05
                }}
                animate={{ 
                  opacity: [0, 0.6, 0],
                  x: (Math.random() - 0.5) * 2000,
                  y: (Math.random() - 0.5) * 2000,
                  scale: Math.random() * 0.4 + 0.1,
                  rotate: Math.random() * 720
                }}
                transition={{ 
                  duration: 4, 
                  ease: "easeOut", 
                  delay: i * 0.15 
                }}
                className="absolute w-32 h-32 object-contain pointer-events-none"
                referrerPolicy="no-referrer"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 right-10 z-[110]"
      >
        <button 
          onClick={() => {
            setPhase('exit');
            setTimeout(onComplete, 800);
          }}
          className="px-6 py-2 bg-[#141f38]/60 backdrop-blur-[40px] border-t border-l border-[#40485d]/20 rounded-full text-[#8cacff] text-sm font-bold font-label hover:bg-[#1f2b49]/50 transition-all shadow-[0_8px_32px_0_rgba(6,14,32,0.4)]"
        >
          Skip
        </button>
      </motion.div>
    </motion.div>
  );
}
