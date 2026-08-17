import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;
  rotation: number;
  rotationSpeed: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'ribbon';
}

export function WinningConfetti({ duration = 5000, onComplete }: { duration?: number; onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#00ff88', '#00e077', '#8cacff', '#769dff', '#9bddff', 
      '#f59e0b', '#fbbf24', '#ec4899', '#f43f5e', '#a855f7', '#06b6d4'
    ];

    const particles: Particle[] = [];
    const particleCount = 180;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height, // start above the screen
        width: Math.random() * 12 + 6,
        height: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        oscillationSpeed: Math.random() * 0.05 + 0.02,
        oscillationDistance: Math.random() * 40 + 15,
        opacity: 1,
        shape: Math.random() > 0.3 ? 'rect' : Math.random() > 0.5 ? 'circle' : 'ribbon'
      });
    }

    const startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        if (onComplete) onComplete();
        return;
      }

      const globalFade = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

      particles.forEach((p, idx) => {
        p.y += p.speed;
        p.rotation += p.rotationSpeed;
        const wobble = Math.sin(elapsed * p.oscillationSpeed + idx) * 2;
        p.x += wobble;

        // Reset if passed bottom before fade out
        if (p.y > height && progress < 0.7) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity * globalFade);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.width / 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // ribbon
          ctx.beginPath();
          ctx.moveTo(-p.width / 2, -p.height / 2);
          ctx.quadraticCurveTo(0, p.height, p.width / 2, -p.height / 2);
          ctx.lineTo(p.width / 2, 0);
          ctx.quadraticCurveTo(0, p.height + 4, -p.width / 2, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
