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
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 bg-cover bg-center text-white backdrop-blur-sm"
          style={{ backgroundImage: `url('${coverUrl || '/images/cover-bg.jpg'}')` }}
        >
          <div className="absolute inset-0 bg-black/50" />
          
          <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center glass-dark rounded-xl max-w-md w-[90%]">
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
                <p className="text-xl font-bold font-playfair">{guestName}</p>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              onClick={handleOpen}
              className="px-6 py-3 bg-[var(--color-gold)] text-black font-inter font-semibold rounded-full hover:bg-yellow-600 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.5)]"
            >
              Buka Undangan
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
