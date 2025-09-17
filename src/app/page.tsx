'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  ArrowLeft,
  Eye,
  Settings,
  Home as HomeIcon,
  Layout,
  Camera,
  Sparkles,
  MapPin,
  DollarSign,
  Ruler,
  Bed,
  Bath,
  Car,
  Building2,
  Filter,
  Search,
  Grid3X3,
  List,
  Maximize2,
  Play,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Star,
  MessageCircle
} from 'lucide-react';

// Components
import AuthGuard from '../components/AuthGuard';
import PWAInitializer from '../components/PWAInitializer';
import { ProjectManager } from '../components/ProjectManager';
import { SkylineConfigurator } from '../components/SkylineConfigurator';
import { NeoConfigurator } from '../components/NeoConfigurator';
import { PremierHouseConfigurator } from '../components/PremierHouseConfigurator';
import { ChatPage } from './chat/ChatPage';
import { ChatComingSoon } from './chat/ChatComingSoon';
import CategorySpecific360Viewer from '../components/CategorySpecific360Viewer';
import UniversalDesignSelectorRedux from '../components/UniversalDesignSelectorRedux';
import JsonGoodBetterBestComparison from '../components/JsonGoodBetterBestComparison';
import NeoExteriorDesignPackages from '../components/Neo/NeoExteriorDesignPackages';
import NeoInteriorDesignPackages from '../components/Neo/NeoInteriorDesignPackages';
import PremiumExteriorCarousel from '../components/Premium/PremiumExteriorCarousel';
import PremiumInteriorCarousel from '../components/Premium/PremiumInteriorCarousel';
import PremiumFeatures from '../components/Premium/PremiumFeatures';

// New modular components
import { HeroAdvertisementBanner } from '../components/home/HeroAdvertisementBanner';
import { CollectionSelector } from '../components/home/CollectionSelector';
import { ModelCard } from '../components/home/ModelCard';
import { OffersSection } from '../components/OffersSection';

// Hooks and utilities
import { useHomeState } from '../hooks/useHomeState';
import { useHomeActions } from '../hooks/useHomeActions';
import { convertHouseToModel } from '../data/realModelsData';
import { convertModelToHouse, getModelTabContent, filterModels } from '../utils/dataHelpers';
import { NeoHouse } from '../hooks/useNeoHouse';
import { MODEL_TABS } from '../constants/home';

// Types
import { MainTab, ModelTab, Collection, ViewMode, ModelData } from '../types/home';

// Convert House to NeoHouse for Neo components
function convertToNeoHouse(house: any): NeoHouse {
  return {
    id: house.id,
    name: house.name,
    description: house.description || '',
    maxDP: house.maxDP,
    maxPK: house.maxPK,
    availableRooms: house.availableRooms,
    images: {
      hero: house.images.hero,
      whiteTexture: '/assets/neo/texrure/thumb-white.jpg',
      darkTexture: '/assets/neo/texrure/thumb-dark.jpg'
    },
    tour360: house.tour360 || { white: { rooms: [] }, dark: { rooms: [] } },
    comparison: house.comparison
  };
}

export default function Home() {
  const { state, actions } = useHomeState();
  const homeActions = useHomeActions({ actions, state });

  // Filter models based on collection and favorites
  const filteredModels = filterModels(state.models, state.selectedCollection, state.favorites);

  return (
    <AuthGuard>
      <div className="min-h-screen relative">
        {/* Background */}
        <div 
          className="fixed inset-0 transition-all duration-1000"
          style={{
            background: state.isDark 
              ? `
                radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%),
                linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e293b 50%, #334155 75%, #475569 100%)
              `
              : `
                radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%),
                linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)
              `
          }}
        />

        {/* Header */}
        <motion.div 
          className="relative z-10 border-b transition-all duration-1000"
          style={{
            borderColor: state.isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.15)',
            backdropFilter: 'blur(25px) saturate(180%)',
            background: state.isDark 
              ? 'rgba(11, 15, 20, 0.95)'
              : 'rgba(248, 250, 252, 0.95)'
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Advertisement Banner - Only show in collections view */}
          {state.mainTab === 'collections' && (
            <HeroAdvertisementBanner 
              isDark={state.isDark}
              onOpenChat={homeActions.onOpenChat}
            />
          )}
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-8 flex flex-col min-h-screen">
          <AnimatePresence mode="wait">
            {/* Comparison Mode - Shows when comparing models */}
            {state.showComparison && state.compareList.length >= 2 && (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <div className="mb-6">
                  <Card className={`p-4 ${
                    state.isDark ? 'bg-slate-800/50' : 'bg-white/50'
                  }`} style={{ backdropFilter: 'blur(20px)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actions.setShowComparison(false)}
                          className="flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back to Models
                        </Button>
                        <div>
                          <h2 className={`font-semibold ${state.isDark ? 'text-white' : 'text-slate-800'}`}>
                            Comparing {state.compareList.length} Models
                          </h2>
                          <p className={`text-sm ${state.isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Side-by-side comparison of selected models
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          actions.setCompareList([]);
                          actions.setShowComparison(false);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        Clear All
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Model Comparison Placeholder */}
                <Card className={`p-8 ${state.isDark ? 'bg-slate-800/50' : 'bg-white/50'}`} style={{ backdropFilter: 'blur(20px)' }}>
                  <div className={`text-center ${state.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Model Comparison</h3>
                    <p className="mb-4">Comparing {state.compareList.length} selected models</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {state.compareList.slice(0, 3).map((modelId) => {
                        const model = state.models.find(m => m.id === modelId);
                        return model ? (
                          <div key={modelId} className={`p-4 rounded-lg border ${state.isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                            <img src={model.heroImage} alt={model.name} className="w-full h-32 object-cover rounded mb-2" />
                            <h4 className="font-semibold">{model.name}</h4>
                            <p className="text-sm opacity-70">{model.area} • ${(model.basePrice || 0).toLocaleString()}</p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Model Details View - FULL SCREEN WITH SEPARATE TAB FRAME */}
            {!state.showComparison && state.mainTab === 'model-details' && state.selectedModel && (
              <motion.div
                key="model-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-20 flex flex-col"
              >
                {/* ✨ FUTURISTIC TAB FRAME - SEPARATE FROM IMAGE */}
                <motion.div
                  className="relative z-30 w-full"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    background: state.isDark
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
                    backdropFilter: 'blur(25px)',
                    borderBottom: state.isDark 
                      ? '1px solid rgba(255, 255, 255, 0.1)' 
                      : '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: state.isDark
                      ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <div className="relative px-8 py-6">
                    {/* Back Button - Top Left */}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        actions.setSelectedModel(null);
                        actions.setMainTab('collections');
                      }}
                      className={`absolute left-8 top-1/2 transform -translate-y-1/2 ${
                        state.isDark 
                          ? 'bg-slate-800/60 border-slate-600/40 text-slate-300 hover:bg-slate-700/60 hover:text-white' 
                          : 'bg-white/60 border-slate-300/40 text-slate-600 hover:bg-white/80 hover:text-slate-800'
                      } backdrop-blur-lg rounded-xl px-6 py-3 transition-all duration-300`}
                      style={{
                        boxShadow: state.isDark 
                          ? '0 4px 16px rgba(0, 0, 0, 0.2)'
                          : '0 4px 16px rgba(0, 0, 0, 0.08)'
                      }}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>

                    {/* Category Tabs - Center */}
                    <div className="flex justify-center">
                      <motion.div 
                        className="flex gap-3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      >
                        {MODEL_TABS.map((tab, index) => {
                          const isActive = state.modelTab === tab.id;
                          const IconComponent = tab.id === 'virtual-tour' ? Play : 
                                              tab.id === 'exterior' ? HomeIcon :
                                              tab.id === 'interior' ? Layout : Ruler;
                          
                          return (
                            <motion.button
                              key={tab.id}
                              onClick={() => actions.setModelTab(tab.id as ModelTab)}
                              className={`relative px-6 py-3 rounded-2xl transition-all duration-500 group overflow-hidden ${
                                isActive 
                                  ? 'shadow-2xl scale-105' 
                                  : 'hover:scale-102'
                              }`}
                              style={{
                                background: isActive 
                                  ? `linear-gradient(135deg, ${tab.gradient.includes('purple') ? '#9333ea, #ec4899' : tab.gradient.includes('blue') ? '#3b82f6, #06b6d4' : tab.gradient.includes('emerald') ? '#10b981, #14b8a6' : '#f97316, #ef4444'})`
                                  : state.isDark 
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(0, 0, 0, 0.05)',
                                backdropFilter: 'blur(12px)',
                                border: isActive 
                                  ? '1px solid rgba(255, 255, 255, 0.3)' 
                                  : state.isDark
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : '1px solid rgba(0, 0, 0, 0.1)',
                                color: isActive 
                                  ? 'white' 
                                  : state.isDark 
                                    ? 'rgba(255, 255, 255, 0.7)'
                                    : 'rgba(0, 0, 0, 0.7)',
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
                              {/* Animated background glow */}
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
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                              )}
                              
                              {/* Content */}
                              <div className="relative flex items-center gap-3">
                                <IconComponent className="w-5 h-5" />
                                <span className="font-medium text-sm whitespace-nowrap">
                                  {tab.label}
                                </span>
                              </div>
                              
                              {/* Hover effect */}
                              <motion.div
                                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 ${
                                  state.isDark ? 'bg-white/10' : 'bg-black/5'
                                }`}
                                transition={{ duration: 0.3 }}
                              />
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* ✨ IMAGE SECTION - CONNECTED TO FRAME */}
                <div className="flex-1 relative mb-8 overflow-hidden">
                  {(() => {
                    const content = getModelTabContent(state.selectedModel)[state.modelTab as ModelTab];
                    
                    // Use NeoExteriorDesignPackages for Neo exterior
                    if (state.selectedModel.collection === 'neo' && state.modelTab === 'exterior') {
                      const houseData = convertModelToHouse(state.selectedModel);
                      const neoHouseData = convertToNeoHouse(houseData);
                      return (
                        <div className="absolute inset-0 p-8">
                          <NeoExteriorDesignPackages house={neoHouseData} />
                        </div>
                      );
                    }
                    
                    // Use NeoInteriorDesignPackages for Neo interior
                    if (state.selectedModel.collection === 'neo' && state.modelTab === 'interior') {
                      const houseData = convertModelToHouse(state.selectedModel);
                      const neoHouseData = convertToNeoHouse(houseData);
                      return (
                        <div className="absolute inset-0 p-8">
                          <NeoInteriorDesignPackages house={neoHouseData} />
                        </div>
                      );
                    }
                    
                    // Use PremiumExteriorCarousel for Premium exterior
                    if (state.selectedModel.collection === 'premium' && state.modelTab === 'exterior') {
                      return (
                        <div className="absolute inset-0 p-8">
                          <PremiumExteriorCarousel
                            houseId={state.selectedModel.id}
                            maxDP={4}
                          />
                        </div>
                      );
                    }
                    
                    // Use PremiumInteriorCarousel for Premium interior
                    if (state.selectedModel.collection === 'premium' && state.modelTab === 'interior') {
                      // Generate available rooms based on bedrooms and bathrooms
                      const availableRooms = [
                        'living',
                        'kitchen',
                        ...Array.from({ length: state.selectedModel.bedrooms }, (_, i) => `bedroom${i + 1 > 1 ? i + 1 : ''}`),
                        ...Array.from({ length: state.selectedModel.bathrooms }, (_, i) => `bathroom${i + 1 > 1 ? i + 1 : ''}`)
                      ];
                      
                      return (
                        <div className="absolute inset-0 p-8">
                          <PremiumInteriorCarousel
                            houseId={state.selectedModel.id}
                            availableRooms={availableRooms}
                            maxPK={4}
                          />
                        </div>
                      );
                    }
                    
                    // Use UniversalDesignSelectorRedux for Skyline exterior and interior
                    if (state.selectedModel.collection === 'skyline' && (state.modelTab === 'exterior' || state.modelTab === 'interior')) {
                      return (
                        <div className="absolute inset-0 p-8 overflow-hidden">
                          <UniversalDesignSelectorRedux
                            houseId={state.selectedModel.id}
                            type={state.modelTab as 'exterior' | 'interior'}
                          />
                        </div>
                      );
                    }
                    
                    // Use PremiumFeatures for Premium Floor Plan tab
                    if (state.selectedModel.collection === 'premium' && state.modelTab === 'floor-plan') {
                      return (
                        <div className="absolute inset-0 p-8 overflow-y-auto">
                          <PremiumFeatures
                            features={state.selectedModel.features || []}
                            houseName={state.selectedModel.name}
                            houseId={state.selectedModel.id}
                          />
                        </div>
                      );
                    }
                    
                    // Use JsonGoodBetterBestComparison for Floor Plan tab (other collections)
                    if (state.modelTab === 'floor-plan') {
                      const houseData = convertModelToHouse(state.selectedModel);
                      return (
                        <div className="absolute inset-0 p-8 overflow-y-auto">
                          <JsonGoodBetterBestComparison house={houseData} />
                        </div>
                      );
                    }
                    
                    // Use CategorySpecific360Viewer for Virtual Tour tab
                    if (state.modelTab === 'virtual-tour') {
                      return (
                        <div className="relative inset-0 w-full h-full">
                          <CategorySpecific360Viewer
                            category={state.selectedModel.collection || 'skyline'}
                            slug={state.selectedModel.id}
                            name={state.selectedModel.name}
                            description={`Experience ${state.selectedModel.name} in immersive 360°`}
                            fullView={false}
                          />
                        </div>
                      );
                    }
                    
                    return (
                      <>
                        {/* FULLSCREEN IMAGE */}
                        <img 
                          key={`${state.modelTab}-${state.currentImageIndex}`}
                          src={content.images[state.currentImageIndex]}
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />

                        {/* NAVIGATION ARROWS - ONLY ARROWS */}
                        {content.images.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="lg"
                              onClick={homeActions.prevImage}
                              className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30 w-20 h-20 rounded-full bg-black/30 hover:bg-black/50 text-white border-white/20 backdrop-blur-md"
                            >
                              <ChevronLeft className="w-10 h-10" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="lg"
                              onClick={homeActions.nextImage}
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
            )}

            {/* Regular Collections View */}
            {!state.showComparison && state.mainTab === 'collections' && (
              <motion.div
                key="collections"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {/* Collection Tabs */}
                <CollectionSelector
                  isDark={state.isDark}
                  selectedCollection={state.selectedCollection}
                  models={state.models}
                  favorites={state.favorites}
                  onCollectionSelect={homeActions.handleCollectionClick}
                />

                {/* Collection Specific Configurators */}
                {state.selectedCollection === 'skyline' && (
                  <div className="mb-8">
                    <SkylineConfigurator 
                      isDark={state.isDark}
                      onConfigurationChange={(config) => {
                        console.log('Skyline config:', config);
                      }}
                    />
                  </div>
                )}
                
                {state.selectedCollection === 'neo' && (
                  <div className="mb-8">
                    <NeoConfigurator 
                      isDark={state.isDark}
                      onConfigurationChange={(config) => {
                        console.log('Neo config:', config);
                      }}
                    />
                  </div>
                )}
                
                {state.selectedCollection === 'premium' && (
                  <div className="mb-8">
                    <PremierHouseConfigurator 
                      isDark={state.isDark}
                      onConfigurationChange={(config) => {
                        console.log('Premier config:', config);
                      }}
                    />
                  </div>
                )}

                {/* View Mode Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`text-lg ${state.isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {state.selectedCollection === 'coupons' ? (
                      'Special Offers & Promotions'
                    ) : (
                      <>
                        Showing {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''}
                        {state.selectedCollection === 'favorites' && filteredModels.length === 0 && (
                          <span className="text-sm opacity-70 ml-2">- Add models to favorites to see them here</span>
                        )}
                      </>
                    )}
                  </div>
                  
                  {state.selectedCollection !== 'coupons' && (
                    <div className="flex items-center gap-4">
                      {/* Compare Button */}
                      {state.compareList.length >= 2 && (
                        <Button
                          onClick={() => actions.setShowComparison(true)}
                          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-400/40 hover:from-purple-500/30 hover:to-pink-500/30 hover:scale-105 transition-all duration-300"
                          style={{
                            boxShadow: '0 4px 20px rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          <GitCompare className="w-5 h-5 mr-3" />
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">Compare Models</span>
                            <span className="text-xs opacity-80">{state.compareList.length} selected</span>
                          </div>
                        </Button>
                      )}

                      {/* View Mode Toggle */}
                      <div className={`inline-flex rounded-lg p-1 ${
                        state.isDark ? 'bg-slate-800/50' : 'bg-white/50'
                      } backdrop-blur-xl border border-white/10`}>
                        <button
                          onClick={() => actions.setViewMode('grid')}
                          className={`p-2 rounded-md transition-all ${
                            state.viewMode === 'grid'
                              ? state.isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-800'
                              : state.isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => actions.setViewMode('list')}
                          className={`p-2 rounded-md transition-all ${
                            state.viewMode === 'list'
                              ? state.isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-800'
                              : state.isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conditional Content Based on Selected Collection */}
                {state.selectedCollection === 'coupons' ? (
                  /* Coupons Section */
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <OffersSection 
                      isDark={state.isDark}
                      onOpenChat={homeActions.onOpenChat}
                    />
                  </motion.div>
                ) : (
                  /* Models Grid/List */
                  <motion.div
                    className={state.viewMode === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "space-y-6"
                    }
                    layout
                  >
                    <AnimatePresence>
                      {filteredModels.map((model) => (
                        <ModelCard
                          key={model.id}
                          model={model}
                          isDark={state.isDark}
                          favorites={state.favorites}
                          compareList={state.compareList}
                          onModelClick={homeActions.handleModelSelectForTab}
                          onToggleFavorite={homeActions.toggleFavorite}
                          onToggleCompare={homeActions.toggleCompare}
                          onViewDetails={homeActions.handleModelSelectForTab}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Empty State */}
                {filteredModels.length === 0 && state.selectedCollection === 'favorites' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className={`text-6xl mb-4`}>⭐</div>
                    <h3 className={`text-xl font-medium mb-2 ${state.isDark ? 'text-white' : 'text-slate-800'}`}>
                      No Favorites Yet
                    </h3>
                    <p className={`${state.isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                      Start exploring our collections and add models to your favorites
                    </p>
                    <Button
                      onClick={() => actions.setSelectedCollection('skyline')}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white"
                    >
                      Browse Models
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 360° Virtual Viewer - Fullscreen Overlay */}
        <AnimatePresence>
          {state.is360ViewerOpen && state.current360Model && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black"
            >
              {/* Real 360° Viewer */}
              <div className="relative w-full h-full">
                <CategorySpecific360Viewer 
                  category={(state.current360Model.collection || 'skyline').toLowerCase() === 'premier' ? 'premium' : (state.current360Model.collection || 'skyline')}
                  slug={state.current360Model.id || ''}
                  name={state.current360Model.name || ''}
                  fullView={true}
                />
                
                {/* Close button */}
                <Button 
                  onClick={homeActions.handle360ViewerClose} 
                  variant="outline" 
                  className="absolute top-4 right-4 z-50 text-white border-white bg-black/50 hover:bg-black/70"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Chat Coming Soon - Fullscreen Overlay */}
        <AnimatePresence>
          {state.isChatOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50"
            >
              <ChatComingSoon
                isDark={state.isDark}
                onClose={homeActions.onCloseChat}
                onScheduleCall={() => console.log('Notify user')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Manager - Fixed Position */}
        <ProjectManager 
          isDark={state.isDark}
          onStartChat={homeActions.onOpenChat}
          onScheduleCall={() => console.log('Schedule call')}
          onSendEmail={() => console.log('Send email')}
        />
      </div>
    </AuthGuard>
  );
}
