'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  Heart,
  Share,
  Download,
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
import AuthGuard from '../components/AuthGuard';
import PWAInitializer from '../components/PWAInitializer';
import { ProjectManager } from '../components/ProjectManager';
import { SkylineConfigurator } from '../components/SkylineConfigurator';
import { NeoConfigurator } from '../components/NeoConfigurator';
import { PremierHouseConfigurator } from '../components/PremierHouseConfigurator';
import { ModelViewer } from '../components/ModelViewer';
import { convertHouseToModel } from '../data/realModelsData';

// Types
type MainTab = 'collections' | 'model-details';
type ModelTab = 'exterior' | 'interior' | 'floor-plan' | 'virtual-tour';
type Collection = 'skyline' | 'neo' | 'premium' | 'favorites';
type ViewMode = 'grid' | 'list';

interface ModelData {
  id: string;
  name: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  heroImage: string;
  features: string[];
  collection: string;
  category?: string;
  squareFeet?: number;
  sqft?: number;
  description?: string;
}

export default function Home() {
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

  const seattleAduLogo = '/logo.png';

  // Handle 360 viewer
  const handle360ViewerOpen = (model: ModelData) => {
    setCurrent360Model(model);
    setIs360ViewerOpen(true);
  };

  const handle360ViewerClose = () => {
    setIs360ViewerOpen(false);
    setCurrent360Model(null);
  };

  // Navigation functions
  const nextImage = () => {
    // Placeholder for image navigation
    setCurrentImageIndex((prev) => (prev + 1) % 4);
  };

  const prevImage = () => {
    // Placeholder for image navigation  
    setCurrentImageIndex((prev) => (prev - 1 + 4) % 4);
  };

  // Generate model tab content
  const getModelTabContent = (model: ModelData) => {
    return {
      exterior: {
        title: 'Exterior Design',
        images: [model.heroImage, model.heroImage, model.heroImage, model.heroImage],
        features: model.features || []
      },
      interior: {
        title: 'Interior Spaces',
        images: [model.heroImage, model.heroImage, model.heroImage, model.heroImage],
        features: model.features || []
      },
      'floor-plan': {
        title: 'Floor Plan & Features',
        images: [model.heroImage, model.heroImage, model.heroImage, model.heroImage],
        features: model.features || []
      },
      'virtual-tour': {
        title: 'Virtual Experience',
        images: [model.heroImage, model.heroImage, model.heroImage, model.heroImage],
        features: model.features || []
      }
    };
  };

  // Chat handler
  const onOpenChat = () => {
    console.log('Opening chat...');
  };

  // Load user profile and models data
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
        console.log('Загружаем модели из API...');
        const response = await fetch('/api/houses');
        console.log('Ответ API:', response.status, response.statusText);
        if (response.ok) {
          const apiResponse = await response.json();
          console.log('API Response:', apiResponse);
          
          // Извлекаем данные из структуры API
          const data = apiResponse.success ? apiResponse.data.categories : apiResponse;
          const allModels: ModelData[] = [];
          
          // Process skyline models
          if (data.skyline && data.skyline.houses && Array.isArray(data.skyline.houses)) {
            const skylineModels = data.skyline.houses.map((m: any) => ({
              ...m,
              collection: 'skyline',
              sqft: m.squareFeet || 800,
              basePrice: m.basePrice || m.price || 150000,
              bedrooms: m.bedrooms || 1,
              bathrooms: m.bathrooms || 1,
              area: m.area || `${m.squareFeet || 800} sq ft`,
              features: m.features || [],
              heroImage: m.images?.hero || m.heroImage || '/assets/skyline/default/hero.webp'
            }));
            allModels.push(...skylineModels);
          }
          
          // Process neo models
          if (data.neo && data.neo.houses && Array.isArray(data.neo.houses)) {
            const neoModels = data.neo.houses.map((m: any) => ({
              ...m,
              collection: 'neo',
              sqft: m.squareFeet || 600,
              basePrice: m.basePrice || m.price || 120000,
              bedrooms: m.bedrooms || 1,
              bathrooms: m.bathrooms || 1,
              area: m.area || `${m.squareFeet || 600} sq ft`,
              features: m.features || [],
              heroImage: m.images?.hero || m.heroImage || '/assets/neo/default/hero.jpg'
            }));
            allModels.push(...neoModels);
          }
          
          // Process premium models
          if (data.premium && data.premium.houses && Array.isArray(data.premium.houses)) {
            const premiumModels = data.premium.houses.map((m: any) => ({
              ...m,
              collection: 'premium',
              sqft: m.squareFeet || 1200,
              basePrice: m.basePrice || m.price || 200000,
              bedrooms: m.bedrooms || 2,
              bathrooms: m.bathrooms || 2,
              area: m.area || `${m.squareFeet || 1200} sq ft`,
              features: m.features || [],
              heroImage: m.images?.hero || m.heroImage || '/assets/premium/default/hero.jpg'
            }));
            allModels.push(...premiumModels);
          }
          
          setModels(allModels);
          console.log('Загружено моделей:', allModels.length);
          console.log('Первые 3 модели с изображениями:', allModels.slice(0, 3).map(m => ({
            id: m.id,
            name: m.name,
            heroImage: m.heroImage
          })));
        } else {
          console.error('Failed to load models:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('Error loading models:', error);
        // Fallback - используем пустой массив, чтобы приложение не падало
        setModels([]);
      }
    };

    loadModels();
  }, []);

  // Filter models based on collection and favorites
  const filteredModels = Array.isArray(models) ? models.filter(model => {
    if (selectedCollection === 'favorites') {
      return favorites.includes(model.id);
    }
    return model.collection === selectedCollection;
  }) : [];

  // Handle model selection
  const handleModelSelect = (model: ModelData) => {
    // Конвертируем модель в полный формат для детального просмотра
    const fullModel = convertHouseToModel(model);
    setDetailedModel(fullModel);
  };

  // Handle model selection for main tab (old functionality)
  const handleModelSelectForTab = (model: ModelData) => {
    setSelectedModel(model);
    setMainTab('model-details');
    setCurrentImageIndex(0);
  };

  // Handle collection click
  const handleCollectionClick = (collectionId: Collection) => {
  setSelectedCollection(collectionId);
};

  // Toggle favorite
  const toggleFavorite = (modelId: string) => {
    setFavorites(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  // Toggle compare
  const toggleCompare = (modelId: string) => {
    setCompareList(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else if (prev.length < 3) {
        return [...prev, modelId];
      } else {
        alert('You can compare up to 3 models at once');
        return prev;
      }
    });
  };

  return (
    <AuthGuard>
         <div className="min-h-screen relative">
      {/* Background */}
      <div 
        className="fixed inset-0 transition-all duration-1000"
           style={{
          background: isDark 
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
          borderColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.15)',
          backdropFilter: 'blur(25px) saturate(180%)',
          background: isDark 
            ? 'rgba(11, 15, 20, 0.95)'
            : 'rgba(248, 250, 252, 0.95)'
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Advertisement Banner - Only show in collections view */}
        {mainTab === 'collections' && (
          <div className="relative w-full overflow-hidden">
            <motion.div 
              className="relative h-32 px-8 flex items-center justify-center"
              style={{
                background: isDark 
                  ? `
                    linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(147, 51, 234, 0.15) 50%, rgba(59, 130, 246, 0.15) 100%),
                    radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%),
                    linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e293b 50%, #334155 75%, #475569 100%)
                  `
                  : `
                    linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(147, 51, 234, 0.08) 50%, rgba(59, 130, 246, 0.08) 100%),
                    radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%),
                    linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)
                  `,
                backdropFilter: 'blur(20px)',
                border: 'none'
              }}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Animated Background Elements */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: isDark 
                    ? 'radial-gradient(ellipse 800px 400px at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
                    : 'radial-gradient(ellipse 800px 400px at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)'
                }}
                animate={{
                  background: isDark ? [
                    'radial-gradient(ellipse 800px 400px at 30% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse 800px 400px at 70% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                    'radial-gradient(ellipse 800px 400px at 30% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
                  ] : [
                    'radial-gradient(ellipse 800px 400px at 30% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)',
                    'radial-gradient(ellipse 800px 400px at 70% 50%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)',
                    'radial-gradient(ellipse 800px 400px at 30% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative z-10 flex items-center gap-8 max-w-6xl mx-auto">
                {/* Logo & Title */}
                <motion.div 
                  className="flex items-center gap-6"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  {/* Animated Logo */}
                  <motion.div 
                    className="relative"
                    animate={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <div 
                      className="w-20 h-20 rounded-full p-1"
               style={{
                        background: isDark 
                          ? 'conic-gradient(from 0deg, #06b6d4, #3b82f6, #9333ea, #06b6d4)'
                          : 'conic-gradient(from 0deg, #0891b2, #2563eb, #7c3aed, #0891b2)'
                      }}
                    >
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${
                        isDark ? 'bg-slate-900' : 'bg-white'
                      }`}>
                        <img 
                          src={seattleAduLogo} 
                          alt="Seattle ADU" 
                          className="w-12 h-12 object-contain"
                        />
        </div>
                    </div>
                  </motion.div>

                  {/* Title & Tagline */}
                  <div>
                    <motion.h1 
                      className="text-4xl bg-gradient-to-r bg-clip-text text-transparent"
             style={{
                        backgroundImage: isDark 
                          ? 'linear-gradient(90deg, #ffffff, #06b6d4, #3b82f6)'
                          : 'linear-gradient(90deg, #1e293b, #0891b2, #2563eb)'
                      }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      Seattle ADU
                    </motion.h1>
                    <motion.p 
                      className={`text-lg ${isDark ? 'text-cyan-200' : 'text-cyan-700'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      Premium Accessory Dwelling Units
                    </motion.p>
                  </div>
                </motion.div>

                {/* Central CTA Message */}
                <motion.div 
                  className="flex-1 text-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <motion.div
                    className={`text-2xl mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🏡 Transform Your Property Today
                  </motion.div>
                  <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Seattle's #1 ADU Builder | 200+ Happy Clients
                  </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div 
                  className="text-right"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <div className={`text-lg ${isDark ? 'text-cyan-200' : 'text-cyan-700'}`}>
                    💬 Ask DANIEL
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Your Project Manager
                  </div>
                  <Button
                    onClick={onOpenChat}
                    className="mt-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-sm px-4 py-2"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </motion.div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className={`absolute top-4 left-1/4 w-2 h-2 rounded-full ${
                  isDark ? 'bg-cyan-400/60' : 'bg-cyan-600/40'
                }`}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className={`absolute bottom-4 right-1/3 w-1.5 h-1.5 rounded-full ${
                  isDark ? 'bg-purple-400/60' : 'bg-purple-600/40'
                }`}
                animate={{
                  y: [10, -10, 10],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-8 flex flex-col min-h-screen">
        <AnimatePresence mode="wait">
          {/* Comparison Mode - Shows when comparing models */}
          {showComparison && compareList.length >= 2 && (
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
                  isDark ? 'bg-slate-800/50' : 'bg-white/50'
                }`} style={{ backdropFilter: 'blur(20px)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowComparison(false)}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Models
                      </Button>
                      <div>
                        <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          Comparing {compareList.length} Models
                        </h2>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Side-by-side comparison of selected models
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCompareList([]);
                        setShowComparison(false);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      Clear All
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Model Comparison Placeholder */}
              <Card className={`p-8 ${isDark ? 'bg-slate-800/50' : 'bg-white/50'}`} style={{ backdropFilter: 'blur(20px)' }}>
                <div className={`text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Model Comparison</h3>
                  <p className="mb-4">Comparing {compareList.length} selected models</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {compareList.slice(0, 3).map((modelId) => {
                      const model = models.find(m => m.id === modelId);
                      return model ? (
                        <div key={modelId} className={`p-4 rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
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
          {!showComparison && mainTab === 'model-details' && selectedModel && (
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
                  backdropFilter: 'blur(25px)',
                  borderBottom: isDark 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: isDark
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
                      setSelectedModel(null);
                      setMainTab('collections');
                    }}
                    className={`absolute left-8 top-1/2 transform -translate-y-1/2 ${
                      isDark 
                        ? 'bg-slate-800/60 border-slate-600/40 text-slate-300 hover:bg-slate-700/60 hover:text-white' 
                        : 'bg-white/60 border-slate-300/40 text-slate-600 hover:bg-white/80 hover:text-slate-800'
                    } backdrop-blur-lg rounded-xl px-6 py-3 transition-all duration-300`}
                    style={{
                      boxShadow: isDark 
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
                      {[
                        { id: 'virtual-tour', icon: Play, label: 'Virtual Tour', gradient: 'from-purple-500 to-pink-500' },
                        { id: 'exterior', icon: HomeIcon, label: 'Exterior', gradient: 'from-blue-500 to-cyan-500' },
                        { id: 'interior', icon: Layout, label: 'Interior', gradient: 'from-emerald-500 to-teal-500' },
                        { id: 'floor-plan', icon: Ruler, label: 'Floor Plan & Features', gradient: 'from-orange-500 to-red-500' }
                      ].map((tab, index) => {
                        const Icon = tab.icon;
                        const isActive = modelTab === tab.id;
                        return (
                          <motion.button
                            key={tab.id}
                            onClick={() => setModelTab(tab.id as ModelTab)}
                            className={`relative px-6 py-3 rounded-2xl transition-all duration-500 group overflow-hidden ${
                              isActive 
                                ? 'shadow-2xl scale-105' 
                                : 'hover:scale-102'
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
                              color: isActive 
                                ? 'white' 
                                : isDark 
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
                              <Icon className="w-5 h-5" />
                              <span className="font-medium text-sm whitespace-nowrap">
                                {tab.label}
</span>
</div>
                            
                            {/* Hover effect */}
                            <motion.div
                              className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 ${
                                isDark ? 'bg-white/10' : 'bg-black/5'
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
              <div className="flex-1 relative overflow-hidden">
                {(() => {
                  const content = getModelTabContent(selectedModel)[modelTab as ModelTab];
                  return (
                    <>
                      {/* FULLSCREEN IMAGE */}
                      <img 
                        key={`${modelTab}-${currentImageIndex}`}
                        src={content.images[currentImageIndex]}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />



                      {/* NAVIGATION ARROWS - ONLY ARROWS */}
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

                      {/* VIRTUAL TOUR BUTTON - CENTER */}
                      {modelTab === 'virtual-tour' && (
                        <div className="absolute inset-0 flex items-center justify-center z-30">
                          <Button
                            size="lg"
                            className="w-40 h-40 rounded-full bg-black/40 hover:bg-black/60 text-white border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110"
                            onClick={() => {
                              if (selectedModel) {
                                handle360ViewerOpen(selectedModel);
                              }
                            }}
                            aria-label="Open 360° Virtual Tour"
                          >
                            <Play className="w-16 h-16 ml-2" />
                          </Button>
</div>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {/* Regular Collections View */}
          {!showComparison && mainTab === 'collections' && (
            <motion.div
              key="collections"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {/* Collection Tabs */}
              <div className="flex items-center justify-center mb-8">
                {/* 🎯 CLEAN FUTURISTIC COLLECTION SELECTOR 🎯 */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Clean Container */}
                  <div 
                    className={`relative p-4 rounded-2xl backdrop-blur-xl border ${
                      isDark ? 'bg-slate-900/60 border-slate-700/30' : 'bg-white/60 border-slate-200/30'
                    }`}
                    style={{
                      background: isDark 
                        ? `rgba(15, 23, 42, 0.7)`
                        : `rgba(248, 250, 252, 0.7)`,
                      boxShadow: isDark 
                        ? `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                        : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`
                    }}
                  >
                    {/* Collection Tabs Grid */}
                    <div className="flex gap-3">
                      {(['skyline', 'neo', 'premium', 'favorites'] as Collection[]).map((collection, index) => {
                        const isActive = selectedCollection === collection;
                        const modelCount = collection !== 'favorites' 
                          ? models.filter(m => m.collection === collection).length
                          : favorites.length;

                        // Clean future-tech collection data
                        const collectionData = {
                          skyline: {
                            name: 'SKYLINE',
                            code: 'SLN-7X',
                            primaryColor: '#3B82F6',
                            gradient: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
                            activeGlow: 'rgba(59, 130, 246, 0.4)'
                          },
                          neo: {
                            name: 'NEO',
                            code: 'NEO-9A',
                            primaryColor: '#9333EA',
                            gradient: 'linear-gradient(135deg, #7c2d12 0%, #a21caf 100%)',
                            activeGlow: 'rgba(147, 51, 234, 0.4)'
                          },
                          premium: {
                            name: 'PREMIUM',
                            code: 'PRM-5E',
                            primaryColor: '#06B6D4',
                            gradient: 'linear-gradient(135deg, #0e7490 0%, #0891b2 100%)',
                            activeGlow: 'rgba(6, 182, 212, 0.4)'
                          },
                          favorites: {
                            name: 'FAVORITES',
                            code: 'SVD-1C',
                            primaryColor: favorites.length > 0 ? '#EAB308' : '#6B7280',
                            gradient: favorites.length > 0 
                              ? 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)' 
                              : 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
                            activeGlow: favorites.length > 0 ? 'rgba(234, 179, 8, 0.4)' : 'rgba(107, 114, 128, 0.4)'
                          }
                        };

                        const data = collectionData[collection];
                        
                        // Safety check - if data is undefined, skip this collection
                        if (!data) {
                          console.warn(`Collection data not found for: ${collection}`);
                          return null;
                        }

                        return (
                          <motion.button
                            key={collection}
                            onClick={() => setSelectedCollection(collection)}
                            className="relative group"
                            whileHover={{ 
                              scale: 1.02,
                              y: -2
                            }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.4, 
                              delay: index * 0.1
                            }}
                          >
                            {/* Clean Collection Panel */}
                            <div
                              className={`
                                relative w-36 h-24 rounded-xl overflow-hidden transition-all duration-300
                                ${isActive ? 'shadow-xl' : 'shadow-md hover:shadow-lg'}
                              `}
                              style={{
                                background: isActive 
                                  ? data.gradient
                                  : isDark 
                                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.9) 100%)'
                                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%)',
                                border: isActive 
                                  ? `1px solid ${data.primaryColor}`
                                  : isDark 
                                    ? '1px solid rgba(71, 85, 105, 0.4)'
                                    : '1px solid rgba(203, 213, 225, 0.4)',
                                boxShadow: isActive 
                                  ? `0 0 25px ${data.activeGlow}, 0 8px 25px rgba(0, 0, 0, 0.3)`
                                  : isDark 
                                    ? '0 4px 15px rgba(0, 0, 0, 0.3)'
                                    : '0 4px 15px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              {/* Subtle Grid Background */}
                              <div 
                                className={`absolute inset-0 opacity-10 ${isActive ? 'opacity-20' : ''}`}
                                style={{
                                  backgroundImage: `
                                    linear-gradient(90deg, ${data.primaryColor}60 1px, transparent 1px),
                                    linear-gradient(${data.primaryColor}60 1px, transparent 1px)
                                  `,
                                  backgroundSize: '16px 16px'
                                }}
                              />

                              {/* Content Layout */}
                              <div className="relative z-10 h-full flex flex-col justify-between p-3">
                                {/* Top Section - Code & Status */}
                                <div className="flex items-center justify-between">
                                  <div 
                                    className={`
                                      px-2 py-1 rounded text-xs backdrop-blur-sm
                                      ${isActive 
                                        ? 'bg-white/25 text-white' 
                                        : isDark 
                                          ? 'bg-slate-800/60 text-slate-300' 
                                          : 'bg-white/70 text-slate-600'
                                      }
                                    `}
                                    style={{
                                      fontFamily: 'monospace',
                                      fontSize: '10px'
                                    }}
                                  >
                                    {data.code}
</div>
                                  
                                  {/* Simple Status Dot */}
                                  <div
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      collection === 'favorites' && favorites.length > 0 ? 'animate-pulse' : ''
                                    }`}
                                    style={{
                                      background: isActive ? data.primaryColor : '#6B7280',
                                      boxShadow: isActive ? `0 0 8px ${data.activeGlow}` : 'none'
                                    }}
                                  />
                                </div>

                                {/* Center - Collection Name */}
                                <div className="text-center">
                                  <div 
                                    className={`
                                      text-sm tracking-wide
                                      ${isActive 
                                        ? 'text-white' 
                                        : isDark ? 'text-slate-200' : 'text-slate-800'
                                      }
                                    `}
                                    style={{ 
                                      fontFamily: 'monospace',
                                      fontSize: '13px'
                                    }}
                                  >
                                    {data.name}
</div>
</div>

                                {/* Bottom - Model Count */}
                                <div className="flex items-center justify-between">
                                  <div 
                                    className={`text-xs opacity-70 ${
                                      isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-600'
                                    }`}
                                    style={{ 
                                      fontFamily: 'monospace',
                                      fontSize: '9px'
                                    }}
                                  >
                                    MODELS
</div>
                                  <div 
                                    className={`
                                      px-2 py-0.5 rounded text-xs backdrop-blur-sm
                                      ${isActive 
                                        ? 'bg-white/25 text-white' 
                                        : isDark 
                                          ? 'bg-slate-700/60 text-slate-300' 
                                          : 'bg-white/70 text-slate-700'
                                      }
                                    `}
                                    style={{ 
                                      fontFamily: 'monospace',
                                      fontSize: '11px'
                                    }}
                                  >
                                    {String(modelCount).padStart(2, '0')}
</div>
</div>
</div>

                              {/* Clean Hover Lines */}
                              <div className={`
                                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                ${!isActive ? 'block' : 'hidden'}
                              `}>
                                <div className="absolute top-1 left-1 w-4 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent" />
                                <div className="absolute top-1 left-1 w-[1px] h-4 bg-gradient-to-b from-cyan-400 to-transparent" />
                                <div className="absolute bottom-1 right-1 w-4 h-[1px] bg-gradient-to-l from-cyan-400 to-transparent" />
                                <div className="absolute bottom-1 right-1 w-[1px] h-4 bg-gradient-to-t from-cyan-400 to-transparent" />
</div>
</div>
                          </motion.button>
                        );
                      })}
</div>

                  </div>
                </motion.div>
              </div>

              {/* Collection Specific Configurators */}
              {selectedCollection === 'skyline' && (
                <div className="mb-8">
                  <SkylineConfigurator 
                    isDark={isDark}
                    onConfigurationChange={(config) => {
                      console.log('Skyline config:', config);
                      // Здесь можно добавить фильтрацию моделей по конфигурации
                    }}
                  />
                </div>
              )}
              
              {selectedCollection === 'neo' && (
                <div className="mb-8">
                  <NeoConfigurator 
                    isDark={isDark}
                    onConfigurationChange={(config) => {
                      console.log('Neo config:', config);
                      // Здесь можно добавить фильтрацию моделей по конфигурации
                    }}
                  />
                </div>
              )}
              
              {selectedCollection === 'premium' && (
                <div className="mb-8">
                  <PremierHouseConfigurator 
                    isDark={isDark}
                    onConfigurationChange={(config) => {
                      console.log('Premier config:', config);
                      // Здесь можно добавить фильтрацию моделей по конфигурации
                    }}
                  />
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Showing {filteredModels.length} model{filteredModels.length !== 1 ? 's' : ''}
                  {selectedCollection === 'favorites' && filteredModels.length === 0 && (
                    <span className="text-sm opacity-70 ml-2">- Add models to favorites to see them here</span>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Compare Button */}
                  {compareList.length >= 2 && (
                    <Button
                      onClick={() => setShowComparison(true)}
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-400/40 hover:from-purple-500/30 hover:to-pink-500/30 hover:scale-105 transition-all duration-300"
                      style={{
                        boxShadow: '0 4px 20px rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <GitCompare className="w-5 h-5 mr-3" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Compare Models</span>
                        <span className="text-xs opacity-80">{compareList.length} selected</span>
                      </div>
                    </Button>
                  )}

                  {/* View Mode Toggle */}
                  <div className={`inline-flex rounded-lg p-1 ${
                    isDark ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-xl border border-white/10`}>
<button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'grid'
                          ? isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-800'
                          : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'list'
                          ? isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-800'
                          : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
</div>
</div>
</div>

              {/* Models Grid/List */}
              <motion.div
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
                }
                layout
              >
                <AnimatePresence>
                  {filteredModels.map((model) => (
                    <motion.div
                      key={model.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => handleModelSelectForTab(model)}
                    >
                      <Card 
                        className={`group relative overflow-hidden border transition-all duration-500 hover:shadow-2xl ${
                          favorites.includes(model.id)
                            ? isDark 
                              ? 'bg-gradient-to-br from-slate-800/70 to-yellow-900/20 border-yellow-400/40 shadow-lg shadow-yellow-500/10' 
                              : 'bg-gradient-to-br from-white/80 to-yellow-50/60 border-yellow-400/50 shadow-lg shadow-yellow-500/15'
                            : isDark 
                              ? 'bg-slate-800/60 border-slate-700/40 hover:border-cyan-400/60' 
                              : 'bg-white/70 border-slate-200/40 hover:border-cyan-400/60'
                        }`} 
                        style={{ 
                          backdropFilter: 'blur(24px)',
                          borderRadius: '20px',
                          ...(favorites.includes(model.id) && {
                            boxShadow: isDark 
                              ? '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(251, 191, 36, 0.1)'
                              : '0 12px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(251, 191, 36, 0.15)'
                          })
                        }}
                      >
                        {/* Tech Corner Accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none">
                          <div className={`absolute top-3 left-3 w-3 h-[1px] transition-all duration-300 ${
                            favorites.includes(model.id)
                              ? 'bg-yellow-400/70'
                              : isDark 
                                ? 'bg-cyan-400/40 group-hover:bg-cyan-400' 
                                : 'bg-slate-400/40 group-hover:bg-cyan-400'
                          }`} />
                          <div className={`absolute top-3 left-3 w-[1px] h-3 transition-all duration-300 ${
                            favorites.includes(model.id)
                              ? 'bg-yellow-400/70'
                              : isDark 
                                ? 'bg-cyan-400/40 group-hover:bg-cyan-400' 
                                : 'bg-slate-400/40 group-hover:bg-cyan-400'
                          }`} />
</div>
                        
                        <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none">
                          <div className={`absolute bottom-3 right-3 w-3 h-[1px] transition-all duration-300 ${
                            favorites.includes(model.id)
                              ? 'bg-yellow-400/70'
                              : isDark 
                                ? 'bg-cyan-400/40 group-hover:bg-cyan-400' 
                                : 'bg-slate-400/40 group-hover:bg-cyan-400'
                          }`} />
                          <div className={`absolute bottom-3 right-3 w-[1px] h-3 transition-all duration-300 ${
                            favorites.includes(model.id)
                              ? 'bg-yellow-400/70'
                              : isDark 
                                ? 'bg-cyan-400/40 group-hover:bg-cyan-400' 
                                : 'bg-slate-400/40 group-hover:bg-cyan-400'
                          }`} />
</div>

                        {/* Subtle Grid Pattern Overlay */}
                        <div 
                          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                            favorites.includes(model.id) 
                              ? 'opacity-[0.04]' 
                              : 'opacity-[0.02] group-hover:opacity-[0.05]'
                          }`}
                          style={{
                            backgroundImage: favorites.includes(model.id)
                              ? `
                                linear-gradient(90deg, #fbbf24 1px, transparent 1px),
                                linear-gradient(#fbbf24 1px, transparent 1px)
                              `
                              : `
                                linear-gradient(90deg, ${isDark ? '#06b6d4' : '#64748b'} 1px, transparent 1px),
                                linear-gradient(${isDark ? '#06b6d4' : '#64748b'} 1px, transparent 1px)
                              `,
                            backgroundSize: '20px 20px'
                          }}
                        />

                        {/* Model Image */}
                        <div className="relative overflow-hidden" style={{ borderRadius: '20px 20px 0 0' }}>
                          <div className="aspect-[16/10] overflow-hidden">
                            <img 
                              src={model.heroImage}
                              alt={model.name}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            />
</div>
                          
                          {/* Enhanced Image Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500" />
                          
                          {/* Status Indicator Line */}
                          <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                            model.collection === 'premium' 
                              ? 'bg-gradient-to-r from-cyan-400 to-blue-500' :
                            model.collection === 'neo' 
                              ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                              'bg-gradient-to-r from-blue-400 to-indigo-500'
                          } opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                          
                          {/* Collection Badge */}
                          <div className="absolute top-5 left-5">
                            <Badge 
                              className={`capitalize backdrop-blur-lg border transition-all duration-300 group-hover:scale-105 ${
                                model.collection === 'premium' 
                                  ? 'bg-cyan-500/15 text-cyan-200 border-cyan-400/40 group-hover:bg-cyan-500/25' :
                                model.collection === 'neo' 
                                  ? 'bg-purple-500/15 text-purple-200 border-purple-400/40 group-hover:bg-purple-500/25' :
                                  'bg-blue-500/15 text-blue-200 border-blue-400/40 group-hover:bg-blue-500/25'
                              }`}
                              style={{
                                fontFamily: 'monospace',
                                fontSize: '11px',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                              }}
                            >
                              {model.collection}
                            </Badge>
</div>

                          {/* Enhanced Action Buttons */}
                          <div className="absolute top-5 right-5 flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.15, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(model.id);
                              }}
                              title={favorites.includes(model.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                              className={`p-2.5 rounded-xl backdrop-blur-lg border transition-all duration-300 ${
                                favorites.includes(model.id)
                                  ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/40 shadow-lg shadow-yellow-500/20'
                                  : 'bg-black/30 text-white/80 border-white/20 hover:bg-black/50 hover:text-white hover:border-white/40'
                              }`}
                            >
                              <Star className={`w-4 h-4 transition-all duration-300 ${
                                favorites.includes(model.id) ? 'fill-current' : ''
                              }`} />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.15, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompare(model.id);
                              }}
                              className={`p-2.5 rounded-xl backdrop-blur-lg border transition-all duration-300 ${
                                compareList.includes(model.id)
                                  ? 'bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-lg shadow-purple-500/20'
                                  : 'bg-black/30 text-white/80 border-white/20 hover:bg-black/50 hover:text-white hover:border-white/40'
                              }`}
                            >
                              <GitCompare className={`w-4 h-4 transition-all duration-300 ${
                                compareList.includes(model.id) ? 'fill-current' : ''
                              }`} />
                            </motion.button>
</div>
                          
                          {/* Enhanced Price Tag */}
                          <div className="absolute bottom-5 right-5">
                            <div className="bg-black/60 backdrop-blur-lg text-white px-4 py-2 rounded-xl border border-white/10 transition-all duration-300 group-hover:bg-black/70 group-hover:scale-105">
                              <div className="text-xs opacity-70 font-medium">Starting at</div>
                              <div className="text-sm font-semibold">${(model.basePrice || 0).toLocaleString()}</div>
</div>
</div>
</div>

                        {/* Enhanced Model Info */}
                        <div className="p-7">
                          {/* Header Section */}
                          <div className="mb-5">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                                isDark ? 'text-white group-hover:text-cyan-100' : 'text-slate-800 group-hover:text-slate-900'
                              }`} style={{ lineHeight: '1.3' }}>
                                {model.name}
                              </h3>
                              
                              {/* Status Dot */}
                              <div className="flex items-center gap-1.5 mt-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  model.collection === 'premium' ? 'bg-cyan-400' :
                                  model.collection === 'neo' ? 'bg-purple-400' : 'bg-blue-400'
                                } animate-pulse`} />
                                <span className={`text-xs font-medium ${
                                  isDark ? 'text-slate-400' : 'text-slate-500'
                                }`} style={{ fontFamily: 'monospace' }}>
                                  ACTIVE
                                </span>
</div>
                            </div>
                            
                            {/* Enhanced Specs */}
                            <div className="flex items-center gap-4">
                              <div className={`flex items-center gap-1.5 text-sm ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}>
                                <Building2 className="w-4 h-4 opacity-60" />
                                <span>{model.area}</span>
                              </div>
                              <div className={`flex items-center gap-1.5 text-sm ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}>
                                <Bed className="w-4 h-4 opacity-60" />
                                <span>{model.bedrooms} BR</span>
                              </div>
                              <div className={`flex items-center gap-1.5 text-sm ${
                                isDark ? 'text-slate-300' : 'text-slate-600'
                              }`}>
                                <Bath className="w-4 h-4 opacity-60" />
                                <span>{model.bathrooms} BA</span>
                              </div>
                            </div>
</div>

                          {/* Enhanced Features */}
                          {model.features && model.features.length > 0 && (
                            <div className="mb-6">
                              <div className="flex flex-wrap gap-2">
                                {model.features.slice(0, 3).map((feature, index) => (
                                  <Badge 
                                    key={index}
                                    variant="outline"
                                    className={`text-xs backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                                      isDark 
                                        ? 'bg-slate-700/40 border-slate-600/40 text-slate-300 hover:bg-slate-700/60' 
                                        : 'bg-white/60 border-slate-300/40 text-slate-600 hover:bg-white/80'
                                    }`}
                                    style={{ 
                                      borderRadius: '8px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                                {model.features.length > 3 && (
                                  <Badge variant="outline" className={`text-xs opacity-60 ${
                                    isDark ? 'border-slate-600/40' : 'border-slate-300/40'
                                  }`}>
                                    +{model.features.length - 3} more
                                  </Badge>
                                )}
</div>
</div>
)}

                          {/* Enhanced Split Action Buttons */}
                          <div className="flex rounded-xl overflow-hidden shadow-lg">
                            {/* Compare Button */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex-1 px-5 py-3.5 transition-all duration-300 relative overflow-hidden ${
                                compareList.includes(model.id)
                                  ? 'bg-purple-500/25 text-purple-100 border-r border-purple-400/30'
                                  : model.collection === 'premium' 
                                    ? 'bg-gradient-to-r from-cyan-500/85 to-cyan-600/85 hover:from-cyan-400/95 hover:to-cyan-500/95 text-white border-r border-cyan-400/30'
                                    : model.collection === 'neo'
                                    ? 'bg-gradient-to-r from-purple-500/85 to-purple-600/85 hover:from-purple-400/95 hover:to-purple-500/95 text-white border-r border-purple-400/30'
                                    : 'bg-gradient-to-r from-blue-500/85 to-blue-600/85 hover:from-blue-400/95 hover:to-blue-500/95 text-white border-r border-blue-400/30'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompare(model.id);
                              }}
                            >
                              <div className="flex items-center justify-center gap-2.5 relative z-10">
                                <GitCompare className="w-4 h-4" />
                                <span className="font-medium text-sm">
                                  {compareList.includes(model.id) ? 'Added' : 'Compare'}
                                </span>
</div>
                            </motion.button>

                            {/* Details Button */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex-1 px-5 py-3.5 transition-all duration-300 relative overflow-hidden ${
                                model.collection === 'premium' 
                                  ? 'bg-gradient-to-r from-cyan-600/85 to-blue-500/85 hover:from-cyan-500/95 hover:to-blue-400/95 text-white'
                                  : model.collection === 'neo'
                                  ? 'bg-gradient-to-r from-purple-600/85 to-pink-500/85 hover:from-purple-500/95 hover:to-pink-400/95 text-white'
                                  : 'bg-gradient-to-r from-blue-600/85 to-indigo-500/85 hover:from-blue-500/95 hover:to-indigo-400/95 text-white'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleModelSelect(model);
                              }}
                            >
                              <div className="flex items-center justify-center gap-2.5 relative z-10">
                                <Eye className="w-4 h-4" />
                                <span className="font-medium text-sm">Details</span>
        </div>
                            </motion.button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty State */}
              {filteredModels.length === 0 && selectedCollection === 'favorites' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className={`text-6xl mb-4`}>⭐</div>
                  <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    No Favorites Yet
                  </h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                    Start exploring our collections and add models to your favorites
                  </p>
                  <Button
                    onClick={() => setSelectedCollection('skyline')}
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
        {is360ViewerOpen && current360Model && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Virtual 360 Viewer Placeholder */}
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 bg-black/80 text-white">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">360° Virtual Tour</h3>
                  <p className="mb-4">Viewing: {current360Model?.name}</p>
                  <Button onClick={handle360ViewerClose} variant="outline" className="text-white border-white">
                    Close
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Model Viewer - Full Screen Overlay */}
      <AnimatePresence>
        {detailedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-slate-900"
          >
            <ModelViewer
              model={detailedModel}
              onBack={() => setDetailedModel(null)}
              onCompareToggle={() => toggleCompare(detailedModel.id)}
              isComparing={compareList.includes(detailedModel.id)}
              onOpenConfigurator={() => {
                console.log('Open configurator for:', detailedModel.id);
                // Здесь можно добавить логику открытия конфигуратора
              }}
              onModelSelect={(modelId) => {
                // Найти модель по ID и открыть её
                const model = models.find(m => m.id === modelId);
                if (model) {
                  handleModelSelect(model);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Manager - Fixed Position */}
      <ProjectManager 
        isDark={isDark}
        onStartChat={onOpenChat}
        onScheduleCall={() => console.log('Schedule call')}
        onSendEmail={() => console.log('Send email')}
      />
      </div>
    </AuthGuard>
  );
}