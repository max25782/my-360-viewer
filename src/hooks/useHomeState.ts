import { useState, useEffect } from 'react';
import { HomeState, ModelData, MainTab, ModelTab, Collection, ViewMode } from '../types/home';
import { loadModelsFromAPI } from '../utils/dataHelpers';

/**
 * Custom hook for managing home page state
 */
export function useHomeState() {
  const [isDark] = useState(true);
  const [mainTab, setMainTab] = useState<MainTab>('collections');
  const [modelTab, setModelTab] = useState<ModelTab>('exterior');
  const [selectedCollection, setSelectedCollection] = useState<Collection>('skyline');
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [models, setModels] = useState<ModelData[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [is360ViewerOpen, setIs360ViewerOpen] = useState(false);
  const [current360Model, setCurrent360Model] = useState<ModelData | null>(null);
  const [detailedModel, setDetailedModel] = useState<ModelData | null>(null);

  // Load initial data
  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Load recommendations from localStorage
    const savedRecommendations = localStorage.getItem('onboardingRecommendations');
    if (savedRecommendations) {
      setRecommendations(JSON.parse(savedRecommendations));
    }

    // Load models from API
    const loadModels = async () => {
      try {
        // Проверяем аутентификацию перед загрузкой
        const { isAuthenticated } = await import('../utils/auth');
        
        if (!isAuthenticated()) {
          console.warn('⚠️ User not authenticated, redirecting to login');
          window.location.href = '/login';
          return;
        }
        
        const loadedModels = await loadModelsFromAPI();
        setModels(loadedModels);
        console.log('✅ Models loaded successfully:', loadedModels.length);
      } catch (error) {
        console.error('❌ Failed to load models:', error);
        
        // Если ошибка 401, перенаправляем на логин
        if (error instanceof Error && error.message.includes('401')) {
          console.log('🔐 Authentication failed, redirecting to login');
          window.location.href = '/login';
        }
      }
    };

    loadModels();
  }, []);

  const state: HomeState = {
    isDark,
    mainTab,
    modelTab,
    selectedCollection,
    selectedModel,
    viewMode,
    favorites,
    compareList,
    currentImageIndex,
    showComparison,
    models,
    userProfile,
    recommendations,
    is360ViewerOpen,
    current360Model,
    detailedModel
  };

  const actions = {
    setMainTab,
    setModelTab,
    setSelectedCollection,
    setSelectedModel,
    setViewMode,
    setFavorites,
    setCompareList,
    setCurrentImageIndex,
    setShowComparison,
    setModels,
    setUserProfile,
    setRecommendations,
    setIs360ViewerOpen,
    setCurrent360Model,
    setDetailedModel
  };

  return { state, actions };
}
