'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HeroAdvertisementBanner } from './HeroAdvertisementBanner';

interface HomeHeaderProps {
  isDark: boolean;
  showHero: boolean;
  onOpenChat: () => void;
}

export function HomeHeader({ isDark, showHero, onOpenChat }: HomeHeaderProps) {
  return (
    <motion.div
      className="relative z-10 border-b transition-all duration-1000"
      style={{
        borderColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.15)',
        backdropFilter: ' saturate(180%)',
        background: isDark ? 'rgba(11, 15, 20, 0.95)' : 'rgba(248, 250, 252, 0.95)'
      }}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {showHero && (
        <HeroAdvertisementBanner isDark={isDark} onOpenChat={onOpenChat} />
      )}
    </motion.div>
  );
}


