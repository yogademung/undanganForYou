'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cover({ guestName, title, coverUrl }: { guestName: string | null; title: string; coverUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('invitation-opened'));
    }
    // Try to play audio if element exists
    const audio = document.getElementById('bg-music') as HTMLAudioElement;
    if (audio) {
      audio.play().catch(console.error);
    }
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* Background Image (Locked to background) */}
          <div 
            className="absolute inset-0 bg-black/80 bg-cover bg-center backdrop-blur-sm"
            style={{ backgroundImage: `url('${coverUrl || '/images/cover-bg.jpg'}')` }}
          />

          {/* Left Door */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-0 right-1/2 bg-black/50 border-r border-white/10 z-0"
          />
          {/* Right Door */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            className="absolute inset-0 left-1/2 bg-black/50 border-l border-white/10 z-0"
          />

          <motion.div 
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center justify-center p-8 text-center glass-dark rounded-xl max-w-md w-[90%] shadow-2xl text-white"
          >
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm tracking-widest uppercase text-yellow-500 mb-2 font-inter"
            >
              The Wedding Of
            </motion.h3>
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-5xl font-playfair mb-6"
            >
              {title}
            </motion.h1>

            {guestName && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 mb-8"
              >
                <p className="text-sm font-inter text-gray-300 mb-2">Kepada Yth.</p>
                <p className="text-xl font-bold font-playfair tracking-wide">{guestName}</p>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              onClick={handleOpen}
              className="group relative flex items-center gap-3 px-8 py-4 bg-[var(--color-gold)] text-black font-playfair font-bold text-lg rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Buka Undangan</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-6 h-6 relative z-10 transition-transform group-hover:rotate-12"
              >
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
