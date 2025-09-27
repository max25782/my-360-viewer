'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { 
  Home as HomeIcon,
  Layout,
  Ruler,
  Play,
  ChevronLeft,
  ChevronRight,
  GitCompare
} from 'lucide-react';
import NeoExteriorDesignPackages from '../Neo/NeoExteriorDesignPackages';
import NeoInteriorDesignPackages from '../Neo/NeoInteriorDesignPackages';
import PremiumExteriorCarousel from '../Premium/PremiumExteriorCarousel';
import PremiumInteriorCarousel from '../Premium/PremiumInteriorCarousel';
import PremiumFeatures from '../Premium/PremiumFeatures';
import UniversalDesignSelectorRedux from '../UniversalDesignSelectorRedux';
import CategorySpecific360Viewer from '../CategorySpecific360Viewer';
import { convertModelToHouse, getModelTabContent } from '@/utils/dataHelpers';
import type { NeoHouse } from '@/hooks/useNeoHouse';
import { MODEL_TABS } from '@/constants/home';

function toNeoTour360(input: any): { white: { rooms: string[] }; dark: { rooms: string[] } } {
  if (input && typeof input === 'object' && 'white' in input && 'dark' in input) {
    return input as any;
  }
  const rooms: string[] = Array.isArray(input?.rooms) ? input.rooms : [];
  return { white: { rooms }, dark: { rooms } };
}

interface ModelDetailsViewProps {
  isDark: boolean;
  selectedModel: any;
  modelTab: string;
  setModelTab: (tab: string) => void;
  onBack: () => void;
  currentImageIndex: number;
  prevImage: () => void;
  nextImage: () => void;
}

export function ModelDetailsView({
  isDark,
  selectedModel,
  modelTab,
  setModelTab,
  onBack,
  currentImageIndex,
  prevImage,
  nextImage
}: ModelDetailsViewProps) {
  if (!selectedModel) return null;

  return (
    <motion.div
      key="model-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-20 flex flex-col"
    >
      <motion.div
        className="relative z-30 w-full"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: isDark
            ? `linear-gradient(135deg, rgba(2, 6, 23, 0.95) 0%, rgba(15, 23, 42, 0.95) 25%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.95) 75%, rgba(71, 85, 105, 0.95) 100%),
               radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
               radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%)`
            : `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 25%, rgba(241, 245, 249, 0.95) 50%, rgba(226, 232, 240, 0.95) 75%, rgba(203, 213, 225, 0.95) 100%),
               radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 50%),
               radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.03) 0%, transparent 50%)`,
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
        }}
      >
        <div className="relative px-8 py-6">
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            className={`absolute left-8 top-1/2 transform -translate-y-1/2 ${
              isDark
                ? 'bg-slate-800/60 border-slate-600/40 text-slate-300 hover:bg-slate-700/60 hover:text-white'
                : 'bg-white/60 border-slate-300/40 text-slate-600 hover:bg-white/80 hover:text-slate-800'
            } backdrop-blur-lg rounded-xl px-6 py-3 transition-all duration-300`}
            style={{
              boxShadow: isDark ? '0 4px 16px rgba(0, 0, 0, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

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
                    onClick={() => setModelTab(tab.id as any)}
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
                  onClick={() => setModelTab('about')}
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
                  <span className="text-sm font-medium">{selectedModel.name}</span>
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 relative mb-8 overflow-hidden">
        {(() => {
          const tabContent = getModelTabContent(selectedModel);
          const content = modelTab in tabContent ? (tabContent as any)[modelTab as any] : (tabContent as any)['exterior'];

          if (selectedModel.collection === 'neo' && modelTab === 'exterior') {
            const base = convertModelToHouse(selectedModel);
            const neoHouseData: NeoHouse = {
              id: base.id,
              name: base.name,
              description: base.description || '',
              maxDP: base.maxDP,
              maxPK: base.maxPK,
              availableRooms: base.availableRooms,
              images: {
                hero: base.images.hero,
                whiteTexture: '/assets/neo/texrure/thumb-white.jpg',
                darkTexture: '/assets/neo/texrure/thumb-dark.jpg'
              },
              tour360: toNeoTour360(base.tour360),
              comparison: base.comparison
            };
            return (
              <div className="absolute inset-0 p-8">
                <NeoExteriorDesignPackages house={neoHouseData} />
              </div>
            );
          }
          if (selectedModel.collection === 'neo' && modelTab === 'interior') {
            const base = convertModelToHouse(selectedModel);
            const neoHouseData: NeoHouse = {
              id: base.id,
              name: base.name,
              description: base.description || '',
              maxDP: base.maxDP,
              maxPK: base.maxPK,
              availableRooms: base.availableRooms,
              images: {
                hero: base.images.hero,
                whiteTexture: '/assets/neo/texrure/thumb-white.jpg',
                darkTexture: '/assets/neo/texrure/thumb-dark.jpg'
              },
              tour360: toNeoTour360(base.tour360),
              comparison: base.comparison
            };
            return (
              <div className="absolute inset-0 p-8">
                <NeoInteriorDesignPackages house={neoHouseData} />
              </div>
            );
          }
          if (selectedModel.collection === 'premium' && modelTab === 'exterior') {
            return (
              <div className="absolute inset-0 p-8">
                <PremiumExteriorCarousel houseId={selectedModel.id} maxDP={4} />
              </div>
            );
          }
          if (selectedModel.collection === 'premium' && modelTab === 'interior') {
            const availableRooms = [
              'living',
              'kitchen',
              ...Array.from({ length: selectedModel.bedrooms }, (_, i) => `bedroom${i + 1 > 1 ? i + 1 : ''}`),
              ...Array.from({ length: selectedModel.bathrooms }, (_, i) => `bathroom${i + 1 > 1 ? i + 1 : ''}`)
            ];
            return (
              <div className="absolute inset-0 p-8">
                <PremiumInteriorCarousel houseId={selectedModel.id} availableRooms={availableRooms} maxPK={4} />
              </div>
            );
          }
          if (selectedModel.collection === 'skyline' && (modelTab === 'exterior' || modelTab === 'interior')) {
            return (
              <div className="absolute inset-0 p-8 overflow-hidden">
                <UniversalDesignSelectorRedux houseId={selectedModel.id} type={modelTab as any} />
              </div>
            );
          }
          if (selectedModel.collection === 'premium' && modelTab === 'floor-plan') {
            return (
              <div className="absolute inset-0 p-8 overflow-y-auto">
                <PremiumFeatures features={selectedModel.features || []} houseName={selectedModel.name} houseId={selectedModel.id} />
              </div>
            );
          }
          if (modelTab === 'floor-plan') {
            const houseData = convertModelToHouse(selectedModel);
            const JsonGoodBetterBestComparison = require('../JsonGoodBetterBestComparison').default;
            return (
              <div className="absolute inset-0 p-8 overflow-y-auto">
                <JsonGoodBetterBestComparison house={houseData} />
              </div>
            );
          }
          if (modelTab === 'about') {
            return (
              <div className="absolute inset-0 p-8 overflow-y-auto">
                <div className={`${isDark ? 'text-slate-200' : 'text-slate-800'} max-w-3xl`}>
                  <h2 className="text-2xl font-semibold mb-3">{selectedModel.name}</h2>
                  <p className="text-base leading-relaxed whitespace-pre-line">{selectedModel.description || 'No description available.'}</p>
                </div>
              </div>
            );
          }
          if (modelTab === 'virtual-tour') {
            return (
              <div className="relative inset-0 w-full h-full">
                <CategorySpecific360Viewer
                  category={selectedModel.collection || 'skyline'}
                  slug={selectedModel.id}
                  name={selectedModel.name}
                  description={`Experience ${selectedModel.name} in immersive 360°`}
                  fullView={false}
                />
              </div>
            );
          }

          return (
            <>
              <img
                key={`${modelTab}-${currentImageIndex}`}
                src={content.images[currentImageIndex]}
                alt={content.title}
                className="w-full h-full object-cover"
              />
              {content.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={prevImage}
                    className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30 w-20 h-20 rounded-full bg-black/30 hover:bg-black/50 text-white border-white/20 backdrop-blur-md"
                  >
                    <ChevronLeft className="w-10 h-10" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={nextImage}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 w-20 h-20 rounded-full bg-black/30 hover:bg-black/50 text-white border-white/20 backdrop-blur-md"
                  >
                    <ChevronRight className="w-10 h-10" />
                  </Button>
                </>
              )}
            </>
          );
        })()}
      </div>
    </motion.div>
  );
}


