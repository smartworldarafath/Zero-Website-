import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

type BoxData = {
  id: number;
  title: string;
  image?: string;
  url?: string;
  onClick?: () => void;
};

export function HorizontalSlider({ items, startIndex }: { items: BoxData[]; startIndex: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8; // Scroll 80% of container width
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      // Check scroll after animation
      setTimeout(checkScroll, 300);
    }
  };

  const handleItemClick = (item: BoxData) => {
    if (!isDragging) {
      if (item.onClick) {
        item.onClick();
      } else if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="relative w-full group">
      <div className="absolute -top-12 right-0 flex gap-2 z-10">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
              className={`p-3 rounded-full bg-white/70 dark:bg-[#141f38]/40 backdrop-blur-[40px] border border-white/50 dark:border-[#40485d]/20 shadow-[0_8px_32px_0_rgba(6,14,32,0.1)] dark:shadow-[0_8px_32px_0_rgba(6,14,32,0.4)] transition-all ${
                canScrollLeft ? 'hover:bg-slate-100 dark:hover:bg-[#1f2b49]/50 cursor-pointer' : 'opacity-40 cursor-not-allowed'
              }`}
        >
          <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
              className={`p-3 rounded-full bg-white/70 dark:bg-[#141f38]/40 backdrop-blur-[40px] border border-white/50 dark:border-[#40485d]/20 shadow-[0_8px_32px_0_rgba(6,14,32,0.1)] dark:shadow-[0_8px_32px_0_rgba(6,14,32,0.4)] transition-all ${
                canScrollRight ? 'hover:bg-slate-100 dark:hover:bg-[#1f2b49]/50 cursor-pointer' : 'opacity-40 cursor-not-allowed'
              }`}
        >
          <ChevronRight className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
      </div>

      <div
        ref={containerRef}
        onScroll={checkScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-6 overflow-x-auto scrollbar-hide pb-12 pt-10 px-10 -mx-10 -mt-10 scroll-pl-10 select-none ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'}`}
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none', 
          scrollBehavior: isDragging ? 'auto' : 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (item.id - startIndex) * 0.1 }}
            className="snap-start shrink-0 w-[85vw] sm:w-[45vw] md:w-[30vw] lg:w-[28vw] xl:w-[24vw] flex flex-col gap-4"
          >
            {/* Main Box */}
            <motion.div 
              onClick={() => handleItemClick(item)}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="aspect-[4/3] rounded-[2.5rem] bg-white/70 dark:bg-[#141f38]/40 backdrop-blur-[40px] border border-white/60 dark:border-[#40485d]/20 shadow-[0_8px_32px_0_rgba(6,14,32,0.1)] dark:shadow-[0_8px_32px_0_rgba(6,14,32,0.4)] flex items-center justify-center cursor-pointer overflow-hidden group/box relative isolate"
            >
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover object-left transition-transform duration-500 group-hover/box:scale-110"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-2xl font-black text-gray-800 dark:text-white z-10 tracking-tight">{item.title}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8cacff]/10 to-[#769dff]/10 opacity-0 group-hover/box:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-[#8cacff]/20 rounded-full blur-3xl opacity-0 group-hover/box:opacity-100 transition-opacity duration-500" />
            </motion.div>

            {/* Sub Box */}
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl bg-white/60 dark:bg-[#141f38]/40 backdrop-blur-[40px] border border-white/60 dark:border-[#40485d]/20 shadow-[0_8px_32px_0_rgba(6,14,32,0.1)] dark:shadow-[0_8px_32px_0_rgba(6,14,32,0.4)] p-5 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1f2b49]/50 transition-all duration-300"
            >
              <p className="text-sm text-gray-800 dark:text-white leading-tight font-semibold">
                Discover Amazing<br />Features Here
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
