export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-white dark:bg-[#050505] transition-colors duration-500">
      {/* Base Forest Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-[3px]"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop')`,
          filter: 'brightness(0.7) saturate(1.2)'
        }}
      />
      
      {/* Dark/Light Overlays */}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/40 transition-colors duration-500" />
      
      {/* Noise texture overlay for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>
      
      {/* Fluid blobs for extra depth */}
      <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 dark:bg-emerald-900/20 blur-[45px] animate-blob transition-colors duration-500" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-900/20 blur-[45px] animate-blob animation-delay-4000 transition-colors duration-500" />
    </div>
  );
}
