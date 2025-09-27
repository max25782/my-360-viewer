'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CollectionConfigurators } from './CollectionConfigurators';
import { Grid3X3, List, GitCompare } from 'lucide-react';
import { CollectionSelector } from './CollectionSelector';
import { OffersSection } from '../OffersSection';
import { ModelCard } from './ModelCard';
import type { Collection } from '@/types/home';

interface CollectionsViewProps {
  isDark: boolean;
  selectedCollection: Collection;
  models: any[];
  favorites: string[];
  compareList: string[];
  onCollectionSelect: (collection: Collection) => void;
  onShowComparison: () => void;
  onClearComparison: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
  filteredModels: any[];
  homeActions: any;
  onSkylineConfigChange?: (config: any) => void;
  onNeoConfigChange?: (config: any) => void;
  onPremierConfigChange?: (config: any) => void;
}

export function CollectionsView({
  isDark,
  selectedCollection,
  models,
  favorites,
  compareList,
  onCollectionSelect,
  onShowComparison,
  onClearComparison,
  setViewMode,
  viewMode,
  filteredModels,
  homeActions
  , onSkylineConfigChange, onNeoConfigChange, onPremierConfigChange
}: CollectionsViewProps) {
  return (
    <motion.div
      key="collections"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1"
    >
      <CollectionSelector
        isDark={isDark}
        selectedCollection={selectedCollection}
        models={models}
        favorites={favorites}
        onCollectionSelect={onCollectionSelect}
      />

      <p className={`mt-3 mb-6 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        Browse modular ADU models, compare features and pricing, and preview immersive 360° tours.
      </p>

      <CollectionConfigurators
        isDark={isDark}
        selectedCollection={selectedCollection}
        onSkylineConfigChange={onSkylineConfigChange}
        onNeoConfigChange={onNeoConfigChange}
        onPremierConfigChange={onPremierConfigChange}
      />
      {selectedCollection === 'coupons' ? (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <OffersSection isDark={isDark} onOpenChat={homeActions.onOpenChat} />
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Showing {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''}
              {selectedCollection === 'favorites' && filteredModels.length === 0 && (
                <span className="text-sm opacity-70 ml-2">- Add models to favorites to see them here</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {compareList.length >= 2 && (
                <Button
                  onClick={onShowComparison}
                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-400/40 hover:from-purple-500/30 hover:to-pink-500/30 hover:scale-105 transition-all duration-300"
                  style={{ boxShadow: '0 4px 20px rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}
                >
                  <GitCompare className="w-5 h-5 mr-3" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Compare Models</span>
                    <span className="text-xs opacity-80">{compareList.length} selected</span>
                  </div>
                </Button>
              )}

              <div className={`inline-flex rounded-lg p-1 ${isDark ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl border border-white/10`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? (isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-800') : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800')}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? (isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-800') : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800')}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <motion.div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'} layout>
            <AnimatePresence>
              {filteredModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  isDark={isDark}
                  favorites={favorites}
                  compareList={[]}
                  onModelClick={homeActions.handleModelSelectForTab}
                  onToggleFavorite={homeActions.toggleFavorite}
                  onToggleCompare={homeActions.toggleCompare}
                  onViewDetails={homeActions.handleModelSelectForTab}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredModels.length === 0 && selectedCollection === 'favorites' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
              <div className={`text-6xl mb-4`}>⭐</div>
              <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>No Favorites Yet</h3>
              <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>Start exploring our collections and add models to your favorites</p>
              <Button onClick={() => onCollectionSelect('skyline')} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white">
                Browse Models
              </Button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}


