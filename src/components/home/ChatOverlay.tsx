'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatComingSoon } from '@/app/chat/ChatComingSoon';

interface ChatOverlayProps {
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
  onSchedule?: () => void;
}

export function ChatOverlay({ isOpen, isDark, onClose, onSchedule }: ChatOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50"
        >
          <ChatComingSoon isDark={isDark} onClose={onClose} onScheduleCall={onSchedule || (() => {})} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


