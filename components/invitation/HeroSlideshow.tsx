'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Image = {
  id: string;
  url: string;
};

export default function HeroSlideshow({ 
  images, 
  backgroundColor 
}: { 
  images: Image[], 
  backgroundColor?: string | null 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2d2925] opacity-70" />
    );
  }

  return (
    <div 
      className="relative w-full h-full overflow-hidden" 
      style={{ backgroundColor: backgroundColor || 'black' }}
    >
      <AnimatePresence mode="wait">
        <div key={images[currentIndex].id} className="absolute inset-0">
          {/* Blurred Background Layer (Object Cover to fill everything) */}
          <motion.img
            src={images[currentIndex].url}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full object-cover blur-2xl scale-110"
          />
          
          {/* Main Foreground Layer (Object Contain to show full image) */}
          <motion.img
            src={images[currentIndex].url}
            alt="Hero Background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-full h-full object-contain absolute inset-0 z-10"
          />
        </div>
      </AnimatePresence>
    </div>
  );
}
