'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type AnimateOnScrollProps = {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
};

export default function AnimateOnScroll({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className = '' 
}: AnimateOnScrollProps) {
  
  const getDirections = () => {
    switch (direction) {
      case 'up': return { y: 50, x: 0 };
      case 'down': return { y: -50, x: 0 };
      case 'left': return { x: 50, y: 0 };
      case 'right': return { x: -50, y: 0 };
      default: return { y: 50, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getDirections() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
