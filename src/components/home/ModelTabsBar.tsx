'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home as HomeIcon, Layout, Ruler, Play } from 'lucide-react';
import { MODEL_TABS } from '@/constants/home';

interface ModelTabsBarProps {
  isDark: boolean;
  modelTab: string;
  selectedModel?: { name?: string } | null;
  onSelectTab: (tabId: string) => void;
}

export function ModelTabsBar({ isDark, modelTab, selectedModel, onSelectTab }: ModelTabsBarProps) {
  return (
    <div className="flex justify-center">
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        {MODEL_TABS.map((tab, index) => {
          const isActive = modelTab === tab.id;
          const IconComponent = tab.id === 'virtual-tour' ? Play : tab.id === 'exterior' ? HomeIcon : tab.id === 'interior' ? Layout : Ruler;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative px-6 py-3 rounded-2xl transition-all duration-500 group overflow-hidden ${
                isActive ? 'shadow-2xl scale-105' : 'hover:scale-102'
              }`}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${tab.gradient.includes('purple') ? '#9333ea, #ec4899' : tab.gradient.includes('blue') ? '#3b82f6, #06b6d4' : tab.gradient.includes('emerald') ? '#10b981, #14b8a6' : '#f97316, #ef4444'})`
                  : isDark
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(12px)',
                border: isActive
                  ? '1px solid rgba(255, 255, 255, 0.3)'
                  : isDark
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
                color: isActive ? 'white' : isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                boxShadow: isActive
                  ? `0 8px 32px ${tab.gradient.includes('purple') ? 'rgba(147, 51, 234, 0.4)' : tab.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : tab.gradient.includes('emerald') ? 'rgba(16, 185, 129, 0.4)' : 'rgba(249, 115, 22, 0.4)'}`
                  : '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: isActive
                  ? `0 12px 48px ${tab.gradient.includes('purple') ? 'rgba(147, 51, 234, 0.5)' : tab.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.5)' : tab.gradient.includes('emerald') ? 'rgba(16, 185, 129, 0.5)' : 'rgba(249, 115, 22, 0.5)'}`
                  : '0 6px 24px rgba(0, 0, 0, 0.15)'
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${tab.gradient.includes('purple') ? '#9333ea, #ec4899' : tab.gradient.includes('blue') ? '#3b82f6, #06b6d4' : tab.gradient.includes('emerald') ? '#10b981, #14b8a6' : '#f97316, #ef4444'})`
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <div className="relative flex items-center gap-3">
                <IconComponent className="w-5 h-5" />
                <span className="font-medium text-sm whitespace-nowrap">{tab.label}</span>
              </div>
              <motion.div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 ${isDark ? 'bg-white/10' : 'bg-black/5'}`}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          );
        })}

        {selectedModel && (
          <motion.button
            key="about"
            onClick={() => onSelectTab('about')}
            className={`relative px-6 py-3 rounded-2xl transition-all duration-500 group overflow-hidden ${
              modelTab === 'about' ? 'shadow-2xl scale-105' : 'hover:scale-102'
            }`}
            style={{
              background: modelTab === 'about' ? 'linear-gradient(135deg, #64748b, #0ea5e9)' : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(12px)',
              border: modelTab === 'about' ? '1px solid rgba(255, 255, 255, 0.3)' : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: modelTab === 'about' ? 'white' : isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              boxShadow: modelTab === 'about' ? '0 8px 32px rgba(59, 130, 246, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: modelTab === 'about' ? '0 12px 48px rgba(59, 130, 246, 0.5)' : '0 6px 24px rgba(0, 0, 0, 0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: MODEL_TABS.length * 0.1 }}
          >
            <span className="text-sm font-medium">{selectedModel?.name}</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}


