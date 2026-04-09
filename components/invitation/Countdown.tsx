'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  targetDate: string | Date;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  if (!hasMounted) return null;

  return (
    <div className="flex gap-4 justify-center items-center font-inter">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="glass w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center mb-2 overflow-hidden relative shadow-md bg-[var(--color-offwhite)]">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute text-2xl md:text-3xl font-bold text-[var(--color-charcoal)]"
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="text-xs md:text-sm uppercase tracking-widest text-[var(--color-charcoal)]">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
