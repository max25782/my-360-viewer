'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HeroAdvertisementBanner } from './HeroAdvertisementBanner';
import { Button } from '../ui/button';
import { ClipboardList } from 'lucide-react';

interface HomeHeaderProps {
  isDark: boolean;
  showHero: boolean;
  onOpenChat: () => void;
}

export function HomeHeader({ isDark, showHero, onOpenChat }: HomeHeaderProps) {
  const handleOpenOnboarding = () => {
    // Remove the return flag to force onboarding to show
    sessionStorage.removeItem('justReturnedFromOnboarding');
    window.location.href = `/onboarding?ts=${Date.now()}`;
  };

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
      {/* Onboarding Button - Fixed Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={handleOpenOnboarding}
          className={`px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/30 text-cyan-300 hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-300/50 hover:text-cyan-200'
              : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-300/50 text-cyan-700 hover:from-cyan-100 hover:to-blue-100 hover:border-cyan-400/70 hover:text-cyan-800'
          } backdrop-blur-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`}
        >
          <ClipboardList className="w-5 h-5 mr-2" />
          Start Quiz
        </Button>
      </div>

      {showHero && (
        <HeroAdvertisementBanner isDark={isDark} onOpenChat={onOpenChat} />
      )}
    </motion.div>
  );
}


