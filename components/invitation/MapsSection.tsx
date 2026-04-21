'use client';

import { motion } from 'framer-motion';

interface MapsSectionProps {
  address: string;
  mapUrl?: string | null;
}

export default function MapsSection({ address, mapUrl }: MapsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="glass rounded-xl p-6 md:p-8 w-full max-w-2xl mx-auto text-center"
    >
      <h3 className="text-2xl font-playfair mb-4 text-[var(--color-charcoal)]">Lokasi & Denah</h3>
      
      <p className="font-inter text-gray-600 mb-6 leading-relaxed whitespace-pre-wrap">
        {address}
      </p>

      {mapUrl && (
        <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6 relative">
           {/* If mapUrl uses Google Maps Embed API, we can render iframe. Otherwise we fallback to just the button. 
               Here we assume standard iframe URL or simplify by just showing a generic map placeholder and CTA. */}
           <iframe
              src={mapUrl.includes('embed') ? mapUrl : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
      )}

      {mapUrl && (
        <a 
          href={mapUrl.includes('embed') ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}` : mapUrl}
          target="_blank" 
          rel="noopener noreferrer"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border border-[var(--color-gold)] text-[var(--color-charcoal)] rounded-full hover:bg-[var(--color-gold)] hover:text-white transition-colors duration-300 font-inter font-medium text-sm tracking-wide shadow-sm hover:shadow-md"
          >
            Buka Petunjuk Jalan
          </motion.button>
        </a>
      )}
    </motion.div>
  );
}
