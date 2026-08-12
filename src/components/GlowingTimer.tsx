import { useState, useEffect } from 'react';

interface GlowingTimerProps {
  isRunning: boolean;
  label: string;
}

export function GlowingTimer({ isRunning, label }: GlowingTimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!isRunning) return null;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-6">
      <div className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 animate-pulse drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]">
        {label}
      </div>
      <div className="text-4xl font-mono font-black text-gray-900 dark:text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] dark:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
        {timeString}
      </div>
    </div>
  );
}
