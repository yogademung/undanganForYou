'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

type Image = {
  id: string;
  url: string;
};


// --- Transition Variants Library ---
// Each slide has a unique entry/exit transition, simulating "album page turns"
const transitionVariants: Variants[] = [
  // 0: Elegant fade + scale (like gently lifting a photo)
  {
    initial: { opacity: 0, scale: 1.08 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.94 },
  },
  // 1: Page flip from right (like turning album pages right to left)
  {
    initial: { opacity: 0, x: '100%', rotateY: -30 },
    animate: { opacity: 1, x: 0, rotateY: 0 },
    exit: { opacity: 0, x: '-60%', rotateY: 20 },
  },
  // 2: Curtain reveal from top (like pulling a silken curtain)
  {
    initial: { opacity: 0, y: '-100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '30%' },
  },
  // 3: Zoom from center with radial feel
  {
    initial: { opacity: 0, scale: 0.6, rotate: -2 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 1.15, rotate: 1 },
  },
  // 4: Diagonal slide (from bottom-right corner like unfolding)
  {
    initial: { opacity: 0, x: '40%', y: '40%' },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: '-30%', y: '-30%' },
  },
  // 5: Iris / soft vignette reveal (scale + blur)
  {
    initial: { opacity: 0, scale: 1.3, filter: 'blur(12px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.9, filter: 'blur(8px)' },
  },
];

// Paired eases for each transition
const transitionEases = [
  { duration: 1.8, ease: [0.4, 0, 0.2, 1] as const },       // 0: smooth
  { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const },     // 1: spring-like
  { duration: 1.5, ease: [0.76, 0, 0.24, 1] as const },     // 2: curtain
  { duration: 2.0, ease: [0.34, 1.56, 0.64, 1] as const },  // 3: elastic
  { duration: 1.6, ease: [0.65, 0, 0.35, 1] as const },     // 4: diagonal
  { duration: 2.2, ease: [0.4, 0, 0.2, 1] as const },       // 5: iris
];

// Portrait detection hook (image intrinsic ratio)
function useIsPortrait(src: string) {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.onload = () => {
      setIsPortrait(img.naturalHeight > img.naturalWidth);
    };
    img.src = src;
  }, [src]);

  return isPortrait;
}

// Individual slide with portrait-aware rendering
function Slide({
  image,
  variantIndex,
  backgroundColor,
}: {
  image: Image;
  variantIndex: number;
  backgroundColor?: string | null;
}) {
  const isPortrait = useIsPortrait(image.url);
  const variants = transitionVariants[variantIndex % transitionVariants.length];
  const ease = transitionEases[variantIndex % transitionEases.length];

  return (
    <motion.div
      key={image.id}
      className="absolute inset-0"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={ease}
      style={{ perspective: '1200px' }}
    >
      {/* === LAYER 1 (paling bawah): Blurred background fill === */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image.url}
          alt=""
          className="w-full h-full object-cover blur-3xl scale-125"
          style={{ opacity: 0.35 }}
          aria-hidden="true"
        />
      </div>

      {/* === LAYER 2: Vignette overlay (mengisi area kosong dengan transparansi lebih tinggi) === */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 35%, ${backgroundColor || '#1a100a'} 100%)`,
          opacity: 0.55,
        }}
      />

      {/* === LAYER 3 (di atas ornamen): Foto utama === */}
      <img
        src={image.url}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-contain z-10"
        style={{ opacity: 1 }}
      />

      {/* === LAYER 4: Soft vignette + subtle center fog untuk readability teks === */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: [
            // Sudut gelap soft
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.38) 100%)',
            // Overlay lembut di area tengah bawah (zona teks)
            'linear-gradient(to top, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.18) 35%, transparent 65%)',
            // Overlay lembut di area tengah atas
            'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 45%)',
          ].join(', '),
        }}
      />
    </motion.div>
  );
}

// Main Slideshow
export default function HeroSlideshow({
  images,
  backgroundColor,
}: {
  images: Image[];
  backgroundColor?: string | null;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Track which variant was used, advance through all variants in order
  const variantIndexRef = useRef(0);
  const [variantIndex, setVariantIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      variantIndexRef.current = (variantIndexRef.current + 1) % transitionVariants.length;
      setVariantIndex(variantIndexRef.current);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#2d2925] opacity-70" />
    );
  }

  const bgColor = backgroundColor || '#1a100a';

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <AnimatePresence mode="wait">
        <Slide
          key={images[currentIndex].id + '-' + currentIndex}
          image={images[currentIndex]}
          variantIndex={variantIndex}
          backgroundColor={backgroundColor}
        />
      </AnimatePresence>

      {/* Slide indicator dots (subtle) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40 pointer-events-none">
          {images.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-700"
              style={{
                width: i === currentIndex ? '20px' : '6px',
                height: '6px',
                background: i === currentIndex
                  ? 'rgba(212,160,23,0.9)'
                  : 'rgba(255,255,255,0.35)',
                boxShadow: i === currentIndex ? '0 0 8px rgba(212,160,23,0.7)' : 'none',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
