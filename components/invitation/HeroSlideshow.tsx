'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

type Image = {
  id: string;
  url: string;
};

// --- Bali Ornament SVG ---
// A rich decorative frame inspired by traditional Balinese carving (ukiran Bali)
const BaliOrnamentFrame = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none z-20"
    viewBox="0 0 400 700"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0c060" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#d4a017" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#b8860b" stopOpacity="0.85" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* === TOP ORNAMENT === */}
    {/* Center top lotus / padma */}
    <g filter="url(#glow)" fill="url(#goldGrad)" opacity="0.92">
      {/* Top center crown */}
      <path d="M200,10 C185,25 170,20 165,35 C175,32 185,38 200,30 C215,38 225,32 235,35 C230,20 215,25 200,10Z" />
      <ellipse cx="200" cy="36" rx="16" ry="8" />
      {/* Petal crown around center */}
      <path d="M200,36 C190,50 178,52 170,65 C183,58 195,62 200,55 C205,62 217,58 230,65 C222,52 210,50 200,36Z" />
      {/* Sub petals */}
      <path d="M170,65 C160,70 148,78 145,92 C158,82 168,86 173,78Z" />
      <path d="M230,65 C240,70 252,78 255,92 C242,82 232,86 227,78Z" />

      {/* Top left spiral (pepalihan) */}
      <path d="M100,30 C90,40 78,38 70,50 C75,55 85,52 92,44 C98,52 108,55 115,48 C112,38 105,34 100,30Z" />
      <path d="M70,50 C58,55 48,62 42,75 C55,68 65,72 70,64Z" />
      <path d="M42,75 C32,80 22,90 18,105 C30,96 40,100 44,90Z" />

      {/* Top right spiral (mirror) */}
      <path d="M300,30 C310,40 322,38 330,50 C325,55 315,52 308,44 C302,52 292,55 285,48 C288,38 295,34 300,30Z" />
      <path d="M330,50 C342,55 352,62 358,75 C345,68 335,72 330,64Z" />
      <path d="M358,75 C368,80 378,90 382,105 C370,96 360,100 356,90Z" />

      {/* Horizontal vine connecting - top */}
      <path d="M115,48 Q150,30 185,40 Q200,28 215,40 Q250,30 285,48" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" />
      {/* Small flowers on vine */}
      <circle cx="150" cy="35" r="5" />
      <circle cx="250" cy="35" r="5" />
      <circle cx="200" cy="28" r="4" />
    </g>

    {/* === LEFT SIDE ORNAMENT === */}
    <g filter="url(#glow)" fill="url(#goldGrad)" opacity="0.88">
      {/* Left side leafy vines */}
      <path d="M18,105 C10,120 8,138 14,155 C20,148 24,138 20,122Z" />
      <path d="M14,155 C6,170 4,190 10,208 C18,200 22,188 16,172Z" />
      <path d="M10,208 C4,225 5,245 12,262 C20,252 22,240 16,224Z" />
      <path d="M12,262 C8,280 10,300 18,315 C26,305 26,292 20,276Z" />
      {/* Left leaves (daun) */}
      <path d="M20,122 C30,115 45,118 52,130 C40,134 28,130 20,122Z" />
      <path d="M16,172 C28,165 44,170 50,183 C38,187 24,182 16,172Z" />
      <path d="M16,224 C28,217 45,222 52,235 C40,240 25,234 16,224Z" />
      <path d="M20,276 C32,270 48,276 54,290 C42,295 28,288 20,276Z" />
      {/* Corner lotus bottom left */}
      <path d="M18,315 C10,335 8,355 15,370 C22,358 24,342 18,315Z" />
      <path d="M15,370 C22,355 35,352 42,364 C32,370 20,368 15,370Z" />
    </g>

    {/* === RIGHT SIDE ORNAMENT (mirror) === */}
    <g filter="url(#glow)" fill="url(#goldGrad)" opacity="0.88">
      <path d="M382,105 C390,120 392,138 386,155 C380,148 376,138 380,122Z" />
      <path d="M386,155 C394,170 396,190 390,208 C382,200 378,188 384,172Z" />
      <path d="M390,208 C396,225 395,245 388,262 C380,252 378,240 384,224Z" />
      <path d="M388,262 C392,280 390,300 382,315 C374,305 374,292 380,276Z" />
      <path d="M380,122 C370,115 355,118 348,130 C360,134 372,130 380,122Z" />
      <path d="M384,172 C372,165 356,170 350,183 C362,187 376,182 384,172Z" />
      <path d="M384,224 C372,217 355,222 348,235 C360,240 375,234 384,224Z" />
      <path d="M380,276 C368,270 352,276 346,290 C358,295 372,288 380,276Z" />
      <path d="M382,315 C390,335 392,355 385,370 C378,358 376,342 382,315Z" />
      <path d="M385,370 C378,355 365,352 358,364 C368,370 380,368 385,370Z" />
    </g>

    {/* === BOTTOM ORNAMENT === */}
    <g filter="url(#glow)" fill="url(#goldGrad)" opacity="0.92">
      {/* Bottom center lotus */}
      <path d="M200,690 C215,675 230,680 235,665 C225,668 215,662 200,670 C185,662 175,668 165,665 C170,680 185,675 200,690Z" />
      <ellipse cx="200" cy="664" rx="16" ry="8" />
      <path d="M200,664 C210,650 222,648 230,635 C217,642 205,638 200,645 C195,638 183,642 170,635 C178,648 190,650 200,664Z" />
      <path d="M230,635 C240,630 252,622 255,608 C242,618 232,614 227,622Z" />
      <path d="M170,635 C160,630 148,622 145,608 C158,618 168,614 173,622Z" />

      {/* Bottom-left spiral */}
      <path d="M42,625 C32,620 22,610 18,595 C30,604 40,600 44,610Z" />
      <path d="M70,650 C58,645 48,638 42,625 C55,632 65,628 70,636Z" />
      <path d="M100,670 C90,660 78,662 70,650 C75,645 85,648 92,656 C98,648 108,645 115,652 C112,662 105,666 100,670Z" />

      {/* Bottom-right spiral */}
      <path d="M358,625 C368,620 378,610 382,595 C370,604 360,600 356,610Z" />
      <path d="M330,650 C342,645 352,638 358,625 C345,632 335,628 330,636Z" />
      <path d="M300,670 C310,660 322,662 330,650 C325,645 315,648 308,656 C302,648 292,645 285,652 C288,662 295,666 300,670Z" />

      {/* Bottom vine */}
      <path d="M115,652 Q150,670 185,660 Q200,672 215,660 Q250,670 285,652" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" />
      <circle cx="150" cy="665" r="5" />
      <circle cx="250" cy="665" r="5" />
      <circle cx="200" cy="672" r="4" />
    </g>

    {/* === CORNER FLOURISHES === */}
    <g fill="none" stroke="url(#goldGrad)" strokeWidth="1.8" opacity="0.75">
      {/* Top-left corner */}
      <path d="M30,30 Q50,20 70,30 Q55,45 40,50 Q25,45 30,30Z" />
      <path d="M30,30 Q20,50 30,70 Q45,55 50,40 Q45,25 30,30Z" />
      {/* Top-right corner */}
      <path d="M370,30 Q350,20 330,30 Q345,45 360,50 Q375,45 370,30Z" />
      <path d="M370,30 Q380,50 370,70 Q355,55 350,40 Q355,25 370,30Z" />
      {/* Bottom-left corner */}
      <path d="M30,670 Q50,680 70,670 Q55,655 40,650 Q25,655 30,670Z" />
      <path d="M30,670 Q20,650 30,630 Q45,645 50,660 Q45,675 30,670Z" />
      {/* Bottom-right corner */}
      <path d="M370,670 Q350,680 330,670 Q345,655 360,650 Q375,655 370,670Z" />
      <path d="M370,670 Q380,650 370,630 Q355,645 350,660 Q355,675 370,670Z" />
    </g>

    {/* Outer border lines */}
    <rect x="10" y="8" width="380" height="684" rx="4" ry="4"
      fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" opacity="0.5" />
    <rect x="14" y="12" width="372" height="676" rx="3" ry="3"
      fill="none" stroke="url(#goldGrad)" strokeWidth="0.7" opacity="0.35" />
  </svg>
);

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
          style={{ opacity: isPortrait ? 0.15 : 0.28 }}
          aria-hidden="true"
        />
      </div>

      {/* === LAYER 2: Background gelap + Ornamen Bali (HANYA portrait, di belakang foto) === */}
      {isPortrait && (
        <>
          {/* Overlay gelap cokelat-hitam khas Bali */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(45,28,8,0.88) 0%, rgba(12,7,2,0.97) 100%)',
            }}
          />
          {/* Ornamen ukiran di sudut-sudut area kosong — z-index rendah agar di bawah foto */}
          <div className="absolute inset-0 z-[5]">
            <BaliOrnamentFrame />
          </div>
        </>
      )}

      {/* === LAYER 3 (di atas ornamen): Foto utama === */}
      <img
        src={image.url}
        alt="Hero"
        className={[
          'absolute inset-0 w-full h-full',
          isPortrait
            ? 'object-contain z-10'   // contain → foto di tengah, sisi kosong terisi ornamen
            : 'object-cover z-10',    // cover → penuh, ornamen tidak muncul
        ].join(' ')}
      />

      {/* === LAYER 4 (paling atas): Vignette sudut halus === */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
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
