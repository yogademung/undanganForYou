'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Image = {
  id: string;
  url: string;
};

export default function HeroSlideshow({ images }: { images: Image[] }) {
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
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[currentIndex].id}
          src={images[currentIndex].url}
          alt="Hero Background"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="w-full h-full object-cover absolute inset-0"
        />
      </AnimatePresence>
    </div>
  );
}
