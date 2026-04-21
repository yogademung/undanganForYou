'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { submitInstagramComment } from '@/app/actions/comment';

type Image = {
  id: string;
  url: string;
};

type Comment = {
  id: string;
  name: string;
  text: string;
  createdAt: Date;
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
  invitationId,
  slug,
  guestName,
  comments = [],
}: {
  images: Image[];
  backgroundColor?: string | null;
  invitationId?: string;
  slug?: string;
  guestName?: string | null;
  comments?: Comment[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
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


      {/* Slide indicators (Instagram Story style at top) */}
      <div className="absolute top-5 left-0 right-0 px-4 z-40 space-y-3 pointer-events-none">
        {images.length > 1 && (
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[2.5px] rounded-full transition-all duration-500"
                style={{
                  background: i === currentIndex
                    ? 'rgba(255,255,255,1)'
                    : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </div>
        )}

        {/* Instagram-style Story Header (Collaborative Post) */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center h-8 w-11 hover:scale-105 transition-transform cursor-pointer">
              <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px] shadow-lg">
                <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-black/10">
                   <span className="text-[10px] font-bold text-white uppercase text-shadow-none">D</span>
                </div>
              </div>
              <div className="absolute left-4 w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px] shadow-lg border-2 border-black/10">
                <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-black/10">
                   <span className="text-[10px] font-bold text-white uppercase text-shadow-none">J</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-white text-[13px] font-semibold tracking-tight [text-shadow:0_1px_2.5px_rgba(0,0,0,0.6)] hover:underline cursor-pointer">
                  darma_yyoga & jeniari123
                </span>
                <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white fill-current">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              </div>
              <span className="text-white/90 text-[10.5px] font-medium [text-shadow:0_1px_1.5px_rgba(0,0,0,0.45)]">
                Our Wedding • 12h
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-1 opacity-90 transition-all hover:opacity-100 hover:scale-110 active:scale-95">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white filter drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
            </button>
            <button className="p-1 opacity-90 transition-all hover:opacity-100 hover:scale-110 active:scale-95">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white filter drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom UI: Swipe Up Indicator */}
      <div className="absolute bottom-12 left-0 right-0 px-4 z-40 flex justify-center items-center pointer-events-none">
        <motion.div 
          className="flex flex-col items-center gap-1.5 pointer-events-auto cursor-pointer group"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          onClick={(e) => {
            e.stopPropagation();
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow-lg group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          <span className="text-white text-[10.5px] font-bold uppercase tracking-[0.25em] [text-shadow:0_1.5px_5px_rgba(0,0,0,0.7)] group-hover:tracking-[0.3em] transition-all">
            Swipe Up
          </span>
        </motion.div>
      </div>
    </div>
  );
}
