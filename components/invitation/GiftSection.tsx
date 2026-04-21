'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimateOnScroll from './AnimateOnScroll';

interface GiftSectionProps {
  bankName?: string | null;
  bankAccount?: string | null;
  bankAccountName?: string | null;
}

export default function GiftSection({ bankName, bankAccount, bankAccountName }: GiftSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (bankAccount) {
      navigator.clipboard.writeText(bankAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!bankName && !bankAccount) return null;

  return (
    <section className="py-16 px-4 overflow-hidden">
      <AnimateOnScroll direction="up" className="max-w-3xl mx-auto text-center glass p-8 md:p-12 rounded-2xl shadow-xl border border-[var(--color-gold)]/20 bg-white">
        <div className="w-16 h-16 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-3xl md:text-4xl font-playfair text-[var(--color-charcoal)] mb-4">Digital Gift</h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
          Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.
          Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 inline-block min-w-[280px] relative overflow-hidden">
          <p className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide">{bankName}</p>
          <div className="flex flex-col items-center gap-4 mb-2">
            <p className="text-2xl font-mono text-[var(--color-gold)] tracking-wider font-bold">
              {bankAccount}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-xs rounded-full font-medium transition-colors hover:bg-black relative"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Tersalin
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Salin No. Rekening
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          <p className="text-sm text-gray-500 font-medium tracking-wide">
            a/n {bankAccountName}
          </p>
        </div>
      </AnimateOnScroll>
    </section>
  );
}
