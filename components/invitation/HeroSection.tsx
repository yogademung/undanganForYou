'use client';
import { useState } from 'react';
import HeroSlideshow from './HeroSlideshow';
import HeroLightbox from './HeroLightbox';
import AnimateOnScroll from './AnimateOnScroll';

type Image = {
  id: string;
  url: string;
  position: string;
};

type HeroSectionProps = {
  heroImages: Image[];
  groomNickname: string;
  brideNickname: string;
  backgroundColor?: string | null;
};

export default function HeroSection({ 
  heroImages, 
  groomNickname, 
  brideNickname,
  backgroundColor 
}: HeroSectionProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center relative p-4 overflow-hidden">
      <div 
        className="absolute inset-0 -z-10 cursor-pointer group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <HeroSlideshow images={heroImages} backgroundColor={backgroundColor} />
        {/* Overlay to indicate interactivity */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
            </div>
        </div>
      </div>

      <AnimateOnScroll delay={0.6} className="flex flex-col items-center max-w-4xl px-4 pointer-events-none z-20">
        <h2 className="text-sm tracking-[0.4em] uppercase text-[var(--color-charcoal)] font-bold mb-6 opacity-80 drop-shadow-md">The Wedding Of</h2>
        <h1 className="text-7xl md:text-9xl font-script text-[var(--color-gold)] leading-tight mb-8 drop-shadow-md">
          {groomNickname} & {brideNickname}
        </h1>
        
        <div className="flex flex-col items-center gap-6 text-[var(--color-charcoal)] px-4">
          <p className="font-script text-5xl md:text-7xl text-[var(--color-gold)] drop-shadow-md">Om Swastyastu</p>
          <p className="text-sm md:text-lg font-serif font-semibold max-w-xl leading-relaxed tracking-wide opacity-90 drop-shadow-md">
            Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, serta kerabat sekalian, untuk menghadiri acara pernikahan kami:
          </p>
        </div>
      </AnimateOnScroll>

      <HeroLightbox 
        images={heroImages} 
        isOpen={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)} 
      />
    </section>
  );
}
