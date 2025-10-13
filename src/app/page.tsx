'use client';

import React, { useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { ModelDetailsView } from '../components/home/ModelDetailsView';
import { CollectionsView } from '../components/home/CollectionsView';

// New modular components
import { HeroAdvertisementBanner } from '../components/home/HeroAdvertisementBanner';
import { HomeHeader } from '../components/home/HomeHeader';
import { ModelTabsBar } from '../components/home/ModelTabsBar';
import { TopFrame } from '../components/home/TopFrame';
import { ChatOverlay } from '../components/home/ChatOverlay';
import { Background } from '../components/home/Background';
import { CollectionSelector } from '../components/home/CollectionSelector';
import { ModelCard } from '../components/home/ModelCard';
import { OffersSection } from '../components/OffersSection';
import { ComparisonView } from '../components/home/ComparisonView';
import { Virtual360Overlay } from '../components/home/Virtual360Overlay';

// Hooks and utilities
import { useHomeState } from '../hooks/useHomeState';
import { useHomeActions } from '../hooks/useHomeActions';
import { useDeepLink } from '../hooks/useDeepLink';
import { convertHouseToModel } from '../data/realModelsData';
import { convertModelToHouse, getModelTabContent, filterModels, getReadableFeatureBadges } from '../utils/dataHelpers';
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

function HomeContent() {
  const { state, actions } = useHomeState();
  const homeActions = useHomeActions({ actions, state });
  const router = useRouter();
  
  // Check if this is the first visit (redirect to onboarding once)
  React.useEffect(() => {
    try {
      const pathname = window.location.pathname;
      
      // Only on root path
      if (pathname === '/') {
        // FIRST: Check authentication - if no token, AuthGuard will redirect to login
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log('🔐 No auth token - AuthGuard will redirect to login');
          return; // Let AuthGuard handle the redirect
        }
        
        // Check if we just returned from onboarding (session flag)
        const justReturned = sessionStorage.getItem('justReturnedFromOnboarding');
        
        // Check if user has ever completed onboarding (localStorage flag)
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        
        console.log('🔍 Main page loaded:', { pathname, justReturned, hasSeenOnboarding, authToken: !!authToken });
        
        if (justReturned) {
          // Clear flag and allow viewing main page
          console.log('🧹 Clearing return flag - showing main page');
          sessionStorage.removeItem('justReturnedFromOnboarding');
          // Don't redirect - just stay on main page
        } else if (!hasSeenOnboarding) {
          // First time visitor (but authenticated) - redirect to onboarding
          const timer = setTimeout(() => {
            const ts = Date.now();
            console.log('✅ First visit (authenticated) - redirecting to onboarding with ts:', ts);
            window.location.href = `/onboarding?ts=${ts}`;
          }, 100);
          
          return () => clearTimeout(timer);
        }
        // If hasSeenOnboarding exists, just show main page (user can click button to restart)
      }
    } catch (e) {
      console.error('❌ Failed to check onboarding status:', e);
    }
  }, []);
  
  // Deep link handler (?model, ?tab)
  useDeepLink({
    models: state.models,
    onSelectModel: (model: any) => actions.setSelectedModel(model),
    onSetMainTab: (tab) => actions.setMainTab(tab as any),
    onSetModelTab: (tab) => actions.setModelTab(tab as any)
  });
  
  // Get configurator filters from URL search parameters
  const searchParams = useSearchParams();
  const configuratorFilters = React.useMemo(() => ({
    bedrooms: searchParams.get('bedrooms') || undefined,
    bathrooms: searchParams.get('bathrooms') || undefined,
    sqftMin: searchParams.get('sqftMin') || undefined,
    sqftMax: searchParams.get('sqftMax') || undefined,
    features: searchParams.get('features')?.split(',').filter(f => f.length > 0) || []
  }), [searchParams]);

  // Filter models based on collection, favorites, and configurator filters
  const filteredModels = filterModels(state.models, state.selectedCollection, state.favorites, configuratorFilters);

  // Function to update URL search parameters
  const updateSearchParams = useCallback((updates: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === 'any' || value === '') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`, { scroll: false });
  }, [router, searchParams]);

  // Skyline configuration change handler
  const handleSkylineConfigChange = useCallback((config: any) => {
    console.log('Skyline config:', config);
    
    // Update URL search parameters
    updateSearchParams({
      bedrooms: config.bedrooms,
      bathrooms: config.bathrooms,
      sqftMin: config.squareFeet[0].toString(),
      sqftMax: config.squareFeet[1].toString(),
      features: config.features.length > 0 ? config.features.join(',') : null
    });
  }, [updateSearchParams]);

  // Neo configuration change handler
  const handleNeoConfigChange = useCallback((config: any) => {
    console.log('Neo config:', config);
    
    // Update URL search parameters for Neo
    updateSearchParams({
      bedrooms: config.bedrooms,
      bathrooms: config.bathrooms,
      sqftMin: config.squareFeet[0].toString(),
      sqftMax: config.squareFeet[1].toString(),
      features: config.features.length > 0 ? config.features.join(',') : null
    });
  }, [updateSearchParams]);

  // Premier configuration change handler
  const handlePremierConfigChange = useCallback((config: any) => {
    console.log('Premier config:', config);
    
    // Update URL search parameters for Premier
    updateSearchParams({
      bedrooms: config.bedrooms,
      bathrooms: config.bathrooms,
      sqftMin: config.squareFeet[0].toString(),
      sqftMax: config.squareFeet[1].toString(),
      features: config.features.length > 0 ? config.features.join(',') : null
    });
  }, [updateSearchParams]);

  return (
    <AuthGuard>
      <div className="min-h-screen relative">
        {/* Background */}
        <Background isDark={state.isDark} />

        {/* Header */}
        <HomeHeader isDark={state.isDark} showHero={state.mainTab === 'collections'} onOpenChat={homeActions.onOpenChat} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-8 flex flex-col min-h-screen">
          <AnimatePresence mode="wait">
            {/* Comparison Mode - Shows when comparing models */}
            {state.showComparison && state.compareList.length >= 2 && (
              <ComparisonView
                isDark={state.isDark}
                compareList={state.compareList}
                models={state.models}
                onBack={() => actions.setShowComparison(false)}
                onClearAll={() => {
                          actions.setCompareList([]);
                          actions.setShowComparison(false);
                        }}
              />
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
                <TopFrame isDark={state.isDark}>
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
                    <ModelTabsBar
                      isDark={state.isDark}
                      modelTab={state.modelTab}
                      selectedModel={state.selectedModel}
                      onSelectTab={(tabId) => actions.setModelTab(tabId as ModelTab)}
                    />
                  </div>
                </TopFrame>

                <ModelDetailsView
                  isDark={state.isDark}
                  selectedModel={state.selectedModel}
                  modelTab={state.modelTab}
                  setModelTab={(tab) => actions.setModelTab(tab as any)}
                  onBack={() => {
                    actions.setSelectedModel(null);
                    actions.setMainTab('collections');
                  }}
                  currentImageIndex={state.currentImageIndex}
                  prevImage={homeActions.prevImage}
                  nextImage={homeActions.nextImage}
                />
              </motion.div>
            )}

            {/* Regular Collections View */}
            {!state.showComparison && state.mainTab === 'collections' && (
            <CollectionsView
                  isDark={state.isDark}
                  selectedCollection={state.selectedCollection}
                  models={state.models}
                  favorites={state.favorites}
              compareList={state.compareList}
                  onCollectionSelect={homeActions.handleCollectionClick}
              onShowComparison={() => actions.setShowComparison(true)}
              onClearComparison={() => {
                actions.setCompareList([]);
                actions.setShowComparison(false);
              }}
              setViewMode={(mode) => actions.setViewMode(mode)}
              viewMode={state.viewMode}
              filteredModels={filteredModels}
              homeActions={homeActions}
              onSkylineConfigChange={handleSkylineConfigChange}
              onNeoConfigChange={handleNeoConfigChange}
              onPremierConfigChange={handlePremierConfigChange}
            />
            )}
          </AnimatePresence>
        </div>

        {/* 360° Virtual Viewer - Fullscreen Overlay */}
        <Virtual360Overlay
          isOpen={state.is360ViewerOpen}
          model={state.current360Model}
          onClose={homeActions.handle360ViewerClose}
        />


        <ChatOverlay isOpen={state.isChatOpen} isDark={state.isDark} onClose={homeActions.onCloseChat} onSchedule={() => console.log('Notify user')} />

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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
