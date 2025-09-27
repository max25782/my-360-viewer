'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TopFrameProps {
  isDark: boolean;
  children: React.ReactNode;
  className?: string;
}

export function TopFrame({ isDark, children, className = 'relative z-30 w-full' }: TopFrameProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        background: isDark
          ? `linear-gradient(135deg, 
              rgba(2, 6, 23, 0.95) 0%, 
              rgba(15, 23, 42, 0.95) 25%, 
              rgba(30, 41, 59, 0.95) 50%, 
              rgba(51, 65, 85, 0.95) 75%, 
              rgba(71, 85, 105, 0.95) 100%),
            radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%)`
          : `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.95) 0%, 
              rgba(248, 250, 252, 0.95) 25%, 
              rgba(241, 245, 249, 0.95) 50%, 
              rgba(226, 232, 240, 0.95) 75%, 
              rgba(203, 213, 225, 0.95) 100%),
            radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.03) 0%, transparent 50%)`,
        borderBottom: isDark
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        boxShadow: isDark
          ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
      }}
    >
      {children}
    </motion.div>
  );
}


