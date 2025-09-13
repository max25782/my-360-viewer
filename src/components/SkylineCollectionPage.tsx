import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { 
  ArrowLeft,
  Home,
  Grid3X3,
  Calculator,
  Settings,
  Eye,
  ChevronRight,
  Play,
  MapPin,
  Clock,
  DollarSign,
  Ruler,
  Building,
  Star,
  CheckCircle,
  ArrowRight,
  Filter,
  SortAsc,
  X,
  RotateCcw,
  Bed,
  Bath,
  Square,
  Zap,
  GripVertical,
  Heart,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ModelData } from '../data/realModelsData';
import { toast } from 'sonner';
const seattleAduLogo = '/logo.png';
import { ExpertContactDialog } from './ExpertContactDialog';

interface SkylineCollectionPageProps {
  models: ModelData[];
  onBack: () => void;
  onModelSelect: (modelId: string) => void;
  onStartConfiguration: (modelId: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const BEDROOM_OPTIONS = [
  { id: 'any', name: 'Any', value: null },
  { id: '1-bedroom', name: '1 Bedroom', value: 1 },
  { id: '1-bedroom-office', name: '1 Bedroom & Office', value: 1.5 },
  { id: '2-bedrooms', name: '2 Bedrooms', value: 2 }
];

const BATHROOM_OPTIONS = [
  { id: 'any', name: 'Any', value: null },
  { id: '1-bathroom', name: '1 Bathroom', value: 1 },
  { id: '1.5-bathrooms', name: '1.5 Bathrooms', value: 1.5 },
  { id: '2-bathrooms', name: '2 Bathrooms', value: 2 },
  { id: '2.5-bathrooms', name: '2.5 Bathrooms', value: 2.5 }
];

const FEATURE_OPTIONS = [
  { id: 'loft', name: 'Loft', icon: Building },
  { id: 'garage', name: 'Garage', icon: Home },
  { id: 'office', name: 'Office', icon: Grid3X3 },
  { id: 'primary-suite', name: 'Primary Suite', icon: Bed },
  { id: 'kitchen-island', name: 'Kitchen Island', icon: Square },
  { id: 'extra-storage', name: 'Extra Storage', icon: Grid3X3 },
  { id: 'covered-patio', name: 'Covered Patio', icon: Home },
  { id: 'covered-porch', name: 'Covered Porch', icon: Home },
  { id: 'bonus-room', name: 'Bonus Room', icon: Star }
];

const SORT_OPTIONS = [
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'size-small', name: 'Size: Small to Large' },
  { id: 'size-large', name: 'Size: Large to Small' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'newest', name: 'Newest First' }
];

interface FilterState {
  bedrooms: string;
  bathrooms: string;
  squareFeet: [number, number];
  features: string[];
}

export function SkylineCollectionPage({ 
  models, 
  onBack, 
  onModelSelect, 
  onStartConfiguration,
  isDark,
  onToggleTheme
}: SkylineCollectionPageProps) {
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  const [sortBy, setSortBy] = useState('popular');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const [likedModels, setLikedModels] = useState<string[]>(() => {
    const saved = localStorage.getItem('adu-liked-models');
    return saved ? JSON.parse(saved).map((like: any) => like.modelId) : [];
  });
  
  const [filters, setFilters] = useState<FilterState>({
    bedrooms: 'any',
    bathrooms: 'any',
    squareFeet: [300, 1300],
    features: []
  });

  React.useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Apply filters to models
  const filteredModels = models.filter(model => {
    // Bedroom filter
    if (filters.bedrooms !== 'any') {
      const bedroomOption = BEDROOM_OPTIONS.find(opt => opt.id === filters.bedrooms);
      if (bedroomOption && bedroomOption.value !== null) {
        if (bedroomOption.value === 1.5) {
          // 1 Bedroom & Office - check if it's 1 bedroom and has office feature
          if (model.bedrooms !== 1) return false;
        } else {
          if (model.bedrooms !== bedroomOption.value) return false;
        }
      }
    }

    // Bathroom filter
    if (filters.bathrooms !== 'any') {
      const bathroomOption = BATHROOM_OPTIONS.find(opt => opt.id === filters.bathrooms);
      if (bathroomOption && bathroomOption.value !== null) {
        if (model.bathrooms !== bathroomOption.value) return false;
      }
    }

    // Square feet filter
    const modelSqft = parseInt(model.area.replace(/[^\d]/g, ''));
    if (modelSqft < filters.squareFeet[0] || modelSqft > filters.squareFeet[1]) {
      return false;
    }

    // Features filter
    if (filters.features.length > 0) {
      const hasAllFeatures = filters.features.every(feature => {
        const featureName = FEATURE_OPTIONS.find(f => f.id === feature)?.name.toLowerCase();
        return model.features.some(modelFeature => 
          modelFeature.toLowerCase().includes(featureName || '')
        );
      });
      if (!hasAllFeatures) return false;
    }

    return true;
  });

  // Sort models
  const sortedModels = [...filteredModels].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.basePrice - b.basePrice;
      case 'price-high':
        return b.basePrice - a.basePrice;
      case 'size-small':
        return parseInt(a.area) - parseInt(b.area);
      case 'size-large':
        return parseInt(b.area) - parseInt(a.area);
      case 'popular':
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      case 'newest': {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }
      default:
        return 0;
    }
  });

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const resetFilters = () => {
    setFilters({
      bedrooms: 'any',
      bathrooms: 'any',
      squareFeet: [300, 1300],
      features: []
    });
  };

  const toggleLike = (modelId: string) => {
    const isCurrentlyLiked = likedModels.includes(modelId);
    
    if (isCurrentlyLiked) {
      const newLikedModels = likedModels.filter(id => id !== modelId);
      setLikedModels(newLikedModels);
      
      // Update localStorage
      const saved = localStorage.getItem('adu-liked-models');
      const allLikes = saved ? JSON.parse(saved) : [];
      const updatedLikes = allLikes.filter((like: any) => like.modelId !== modelId);
      localStorage.setItem('adu-liked-models', JSON.stringify(updatedLikes));
      
      toast.success('Removed from favorites');
    } else {
      const newLikedModels = [...likedModels, modelId];
      setLikedModels(newLikedModels);
      
      // Update localStorage
      const saved = localStorage.getItem('adu-liked-models');
      const allLikes = saved ? JSON.parse(saved) : [];
      const newLike = {
        modelId,
        timestamp: new Date(),
        reason: 'User favorited'
      };
      const updatedLikes = [...allLikes, newLike];
      localStorage.setItem('adu-liked-models', JSON.stringify(updatedLikes));
      
      toast.success('Added to favorites ❤️');
    }
  };

  const hasActiveFilters = 
    filters.bedrooms !== 'any' ||
    filters.bathrooms !== 'any' ||
    filters.squareFeet[0] !== 300 ||
    filters.squareFeet[1] !== 1300 ||
    filters.features.length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Futuristic ADU Construction Background - Now Dynamic */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Dynamic Sky Background with Building Lights */}
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: isDark 
              ? `
                linear-gradient(135deg, 
                  #0B0F14 0%, 
                  #1a202c 25%, 
                  #2d3748 50%, 
                  #4a5568 75%, 
                  #2d3748 100%
                ),
                radial-gradient(ellipse at 20% 70%, rgba(0, 229, 255, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 30%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
              `
              : `
                linear-gradient(135deg, 
                  #f8fafc 0%, 
                  #e2e8f0 25%, 
                  #cbd5e1 50%, 
                  #94a3b8 75%, 
                  #64748b 100%
                ),
                radial-gradient(ellipse at 20% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 30%, rgba(124, 58, 237, 0.06) 0%, transparent 50%)
              `
          }}
        />

        {/* Floating ADU Modules - Now Dynamic */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`adu-${i}`}
              className="absolute transition-all duration-1000"
              style={{
                width: `${40 + Math.random() * 30}px`,
                height: `${20 + Math.random() * 15}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: isDark 
                  ? `linear-gradient(135deg, 
                    rgba(0, 229, 255, 0.15) 0%, 
                    rgba(59, 130, 246, 0.1) 50%, 
                    rgba(147, 51, 234, 0.08) 100%
                  )`
                  : `linear-gradient(135deg, 
                    rgba(6, 182, 212, 0.12) 0%, 
                    rgba(59, 130, 246, 0.08) 50%, 
                    rgba(124, 58, 237, 0.06) 100%
                  )`,
                border: isDark 
                  ? '1px solid rgba(0, 229, 255, 0.2)' 
                  : '1px solid rgba(6, 182, 212, 0.15)',
                borderRadius: '4px',
                boxShadow: isDark 
                  ? '0 4px 12px rgba(0, 229, 255, 0.1)' 
                  : '0 4px 12px rgba(6, 182, 212, 0.08)'
              }}
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                rotateY: [0, 5, 0],
                rotateX: [0, 2, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            >
              {/* Mini windows - Dynamic */}
              <div className={`absolute top-1 left-1 w-2 h-1 rounded-sm transition-colors duration-1000 ${
                isDark ? 'bg-cyan-400/40' : 'bg-cyan-600/25'
              }`} />
              <div className={`absolute top-1 right-1 w-2 h-1 rounded-sm transition-colors duration-1000 ${
                isDark ? 'bg-blue-400/30' : 'bg-blue-600/20'
              }`} />
              <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-0.5 rounded-sm transition-colors duration-1000 ${
                isDark ? 'bg-purple-400/20' : 'bg-purple-600/15'
              }`} />
            </motion.div>
          ))}
        </div>

        {/* Construction Drones - Dynamic */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`drone-${i}`}
              className="absolute transition-all duration-1000"
              style={{
                width: '8px',
                height: '8px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: isDark 
                  ? 'radial-gradient(circle, rgba(0, 229, 255, 0.8) 0%, rgba(0, 229, 255, 0.3) 70%, transparent 100%)'
                  : 'radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, rgba(6, 182, 212, 0.2) 70%, transparent 100%)',
                borderRadius: '50%',
                boxShadow: isDark 
                  ? '0 0 10px rgba(0, 229, 255, 0.5)' 
                  : '0 0 8px rgba(6, 182, 212, 0.3)'
              }}
              animate={{
                x: [0, 100, 200, 300, 400],
                y: [0, -20, -40, -20, 0],
              }}
              transition={{
                duration: 12 + Math.random() * 8,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            >
              {/* Drone propellers - Dynamic */}
              <div className={`absolute -top-1 -left-1 w-2 h-2 rounded-full animate-spin transition-colors duration-1000 ${
                isDark ? 'border border-cyan-400/30' : 'border border-cyan-600/20'
              }`}
                   style={{ animationDuration: '0.1s' }} />
            </motion.div>
          ))}
        </div>

        {/* Holographic Building Blueprint Lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`blueprint-${i}`}
              className="absolute"
              style={{
                width: '2px',
                height: `${50 + Math.random() * 100}px`,
                left: `${10 + i * 12}%`,
                top: `${30 + Math.random() * 40}%`,
                background: isDark 
                  ? `linear-gradient(to bottom, 
                    transparent 0%, 
                    rgba(0, 229, 255, 0.4) 20%, 
                    rgba(0, 229, 255, 0.6) 50%, 
                    rgba(0, 229, 255, 0.4) 80%, 
                    transparent 100%
                  )`
                  : `linear-gradient(to bottom, 
                    transparent 0%, 
                    rgba(6, 182, 212, 0.3) 20%, 
                    rgba(6, 182, 212, 0.4) 50%, 
                    rgba(6, 182, 212, 0.3) 80%, 
                    transparent 100%
                  )`,
                opacity: isDark ? 0.3 : 0.2
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scaleY: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        {/* Smart City Connection Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 229, 255, 0.6)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0.3)" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <motion.path
              key={`connection-${i}`}
              d={`M ${i * 200 + 100} ${100 + i * 150} Q ${i * 200 + 250} ${50 + i * 150} ${i * 200 + 400} ${100 + i * 150}`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="5,10"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ 
                duration: 3 + i * 0.5, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.8
              }}
            />
          ))}
        </svg>

        {/* Modular Building Components */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`module-${i}`}
              className="absolute opacity-30"
              style={{
                width: `${6 + Math.random() * 4}px`,
                height: `${6 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: [
                  'rgba(0, 229, 255, 0.4)',
                  'rgba(147, 51, 234, 0.3)',
                  'rgba(59, 130, 246, 0.35)',
                  'rgba(16, 185, 129, 0.3)'
                ][i % 4],
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(0, 229, 255, 0.3)'
              }}
              animate={{
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.2, 1, 0.8, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>

        {/* Advanced Architectural Scan */}
        <motion.div 
          className="absolute inset-0 opacity-15"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(0, 229, 255, 0.3) 1%, 
              rgba(147, 51, 234, 0.2) 2%, 
              transparent 3%
            )`
          }}
          animate={{ x: [-100, window.innerWidth + 100] }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "linear",
            repeatDelay: 8 
          }}
        />

        {/* Smart Home Network Nodes */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`node-${i}`}
              className="absolute"
              style={{
                width: '3px',
                height: '3px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: 'radial-gradient(circle, rgba(0, 229, 255, 0.8) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>
      </div>

      {/* Header with Construction Theme - Dynamic */}
      <motion.div 
        className="relative z-10 border-b transition-all duration-1000"
        style={{
          borderColor: isDark ? 'rgba(0, 229, 255, 0.2)' : 'rgba(6, 182, 212, 0.15)',
          backdropFilter: 'blur(25px) saturate(180%)',
          background: isDark 
            ? `
              linear-gradient(135deg, 
                rgba(11, 15, 20, 0.95) 0%, 
                rgba(17, 25, 39, 0.9) 50%, 
                rgba(30, 41, 59, 0.85) 100%
              )
            `
            : `
              linear-gradient(135deg, 
                rgba(248, 250, 252, 0.95) 0%, 
                rgba(241, 245, 249, 0.9) 50%, 
                rgba(226, 232, 240, 0.85) 100%
              )
            `,
          boxShadow: isDark 
            ? `
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 0 0 1px rgba(0, 229, 255, 0.1)
            `
            : `
              0 8px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.8),
              0 0 0 1px rgba(6, 182, 212, 0.08)
            `
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div 
          className="px-8 py-6"
          style={{
            maxWidth: isLandscape ? '1194px' : '834px',
            margin: '0 auto'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left: Back + Logo + Title */}
            <div className="flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onBack}
                  variant="outline"
                  size="sm"
                  className="relative overflow-hidden rounded-full w-12 h-12 p-0 group transition-all duration-500"
                  style={{
                    background: isDark 
                      ? 'rgba(15, 23, 42, 0.8)' 
                      : 'rgba(248, 250, 252, 0.8)',
                    border: isDark 
                      ? '1px solid rgba(0, 229, 255, 0.3)' 
                      : '1px solid rgba(6, 182, 212, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <ArrowLeft className={`w-5 h-5 relative z-10 transition-colors duration-500 ${
                    isDark ? 'text-cyan-400' : 'text-cyan-600'
                  }`} />
                </Button>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                      <img 
                        src={seattleAduLogo} 
                        alt="Seattle ADU" 
                        className="w-8 h-8 object-contain filter brightness-110"
                      />
                    </div>
                  </div>
                </motion.div>
                <div>
                  <motion.h1 
                    className={`text-3xl bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
                      isDark 
                        ? 'from-white via-cyan-100 to-blue-100' 
                        : 'from-slate-800 via-slate-700 to-slate-600'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Skyline Collection
                  </motion.h1>
                  <motion.p 
                    className={`transition-colors duration-500 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    🏗️ Future-Ready Urban ADUs
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Right: Enhanced Stats with Construction Icons */}
            <div className="flex items-center gap-8">
              {/* Theme Control Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleTheme}
                  className={`${
                    isDark 
                      ? 'bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50' 
                      : 'bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50/80'
                  } backdrop-blur-sm transition-all duration-500`}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </motion.div>
              {[
                { value: models.length, label: 'Smart Models', icon: '🏠', color: 'from-cyan-400 to-blue-400' },
                { value: '8-12', label: 'Build Weeks', icon: '⚡', color: 'from-purple-400 to-pink-400' },
                { value: '$165k+', label: 'Starting Cost', icon: '💰', color: 'from-emerald-400 to-teal-400' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300" 
                       style={{ backgroundImage: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }} />
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <p className={`text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent relative z-10 font-semibold`}>
                    {stat.value}
                  </p>
                  <p className="text-slate-400 text-sm relative z-10">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div 
        className="relative z-10 py-8"
        style={{
          maxWidth: isLandscape ? '1194px' : '834px',
          margin: '0 auto',
          paddingLeft: isLandscape ? '40px' : '32px',
          paddingRight: isLandscape ? '40px' : '32px'
        }}
      >
        <div className="flex gap-8">
          {/* Enhanced Filter Sidebar */}
          <motion.div
            className={`transition-all duration-500 ${filtersVisible ? 'w-72' : 'w-0'} flex-shrink-0`}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {filtersVisible && (
              <Card 
                className="sticky top-8 h-fit overflow-hidden relative group"
                style={{
                  borderRadius: '20px',
                  background: isDark 
                    ? `
                      linear-gradient(135deg, 
                        rgba(15, 23, 42, 0.95) 0%, 
                        rgba(17, 25, 39, 0.9) 50%, 
                        rgba(30, 41, 59, 0.85) 100%
                      )
                    `
                    : `
                      linear-gradient(135deg, 
                        rgba(248, 250, 252, 0.95) 0%, 
                        rgba(241, 245, 249, 0.9) 50%, 
                        rgba(226, 232, 240, 0.85) 100%
                      )
                    `,
                  backdropFilter: 'blur(25px) saturate(180%)',
                  border: isDark 
                    ? '1px solid rgba(0, 229, 255, 0.2)' 
                    : '1px solid rgba(6, 182, 212, 0.15)',
                  boxShadow: isDark 
                    ? `
                      0 25px 50px rgba(0, 0, 0, 0.25),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1),
                      0 0 0 1px rgba(0, 229, 255, 0.1)
                    `
                    : `
                      0 25px 50px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.8),
                      0 0 0 1px rgba(6, 182, 212, 0.08)
                    `
                }}
              >
                <div className="p-6 relative z-10">
                  {/* Filter Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                        <Filter className="w-4 h-4 text-white" />
                      </div>
                      <h3 className={`text-lg bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
                        isDark 
                          ? 'from-white to-cyan-100' 
                          : 'from-slate-800 to-slate-600'
                      }`}>
                        🔍 Smart Filters
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasActiveFilters && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={resetFilters}
                            variant="ghost"
                            size="sm"
                            className={`transition-colors duration-500 ${
                              isDark 
                                ? 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10' 
                                : 'text-slate-500 hover:text-cyan-600 hover:bg-cyan-500/10'
                            }`}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                          </Button>
                        </motion.div>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => setFiltersVisible(false)}
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Bedrooms Filter */}
                    <div>
                      <h4 className="text-white mb-3 flex items-center gap-2">
                        <Bed className="w-4 h-4 text-cyan-400" />
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                          🛏️ Bedrooms
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {BEDROOM_OPTIONS.map((option) => (
                          <motion.div
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={() => handleFilterChange('bedrooms', option.id)}
                              variant={filters.bedrooms === option.id ? "default" : "ghost"}
                              size="sm"
                              className={`w-full justify-start text-sm h-9 relative overflow-hidden ${
                                filters.bedrooms === option.id
                                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-cyan-400/20'
                              }`}
                            >
                              {filters.bedrooms === option.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
                              )}
                              <span className="relative z-10">{option.name}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent" />

                    {/* Bathrooms Filter */}
                    <div>
                      <h4 className="text-white mb-3 flex items-center gap-2">
                        <Bath className="w-4 h-4 text-cyan-400" />
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                          🚿 Bathrooms
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {BATHROOM_OPTIONS.map((option) => (
                          <motion.div
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={() => handleFilterChange('bathrooms', option.id)}
                              variant={filters.bathrooms === option.id ? "default" : "ghost"}
                              size="sm"
                              className={`w-full justify-start text-sm h-9 relative overflow-hidden ${
                                filters.bathrooms === option.id
                                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-cyan-400/20'
                              }`}
                            >
                              {filters.bathrooms === option.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
                              )}
                              <span className="relative z-10">{option.name}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent" />

                    {/* Square Feet Filter */}
                    <div>
                      <h4 className="text-white mb-3 flex items-center gap-2">
                        <Square className="w-4 h-4 text-cyan-400" />
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                          📐 Square Feet
                        </span>
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                            {filters.squareFeet[0]}sq ft
                          </span>
                          <span className="text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                            {filters.squareFeet[1]}sq ft
                          </span>
                        </div>
                        <Slider
                          value={filters.squareFeet}
                          onValueChange={(value) => handleFilterChange('squareFeet', value)}
                          min={300}
                          max={1300}
                          step={50}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>300sq ft</span>
                          <span>1300sq ft</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent" />

                    {/* Features Filter */}
                    <div>
                      <h4 className="text-white mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                          ⚡ Smart Features
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {FEATURE_OPTIONS.map((feature) => {
                          const IconComponent = feature.icon;
                          const isSelected = filters.features.includes(feature.id);
                          
                          return (
                            <motion.div 
                              key={feature.id}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                isSelected 
                                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30' 
                                  : 'hover:bg-slate-800/40 hover:border-cyan-400/20'
                              }`}
                              onClick={() => handleFeatureToggle(feature.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
                              )}
                              <Checkbox 
                                checked={isSelected}
                                onChange={() => handleFeatureToggle(feature.id)}
                                className="border-slate-500 w-4 h-4 relative z-10"
                              />
                              <IconComponent className="w-4 h-4 text-cyan-400 flex-shrink-0 relative z-10" />
                              <span className={`text-sm relative z-10 ${
                                isSelected ? 'text-cyan-300' : 'text-slate-300'
                              }`}>
                                {feature.name}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="mt-6 pt-4 border-t border-slate-600/30">
                    <div className="text-center p-3 rounded-lg bg-gradient-to-r from-slate-800/30 to-slate-700/30">
                      <p className="text-slate-300 text-sm">
                        <span className="text-cyan-400 text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          {sortedModels.length}
                        </span>
                        <span className="text-slate-400 mx-1">of</span>
                        <span className="text-white">{models.length}</span>
                        <span className="text-slate-400 ml-1">smart ADUs</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Toggle Filters Button (when hidden) */}
            {!filtersVisible && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setFiltersVisible(true)}
                    className="relative overflow-hidden bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-cyan-400/30 text-white hover:from-slate-700/60 hover:to-slate-600/60 hover:border-cyan-400/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <Filter className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10">🔍 Show Smart Filters</span>
                    {hasActiveFilters && (
                      <Badge className="ml-2 bg-cyan-500/20 text-cyan-300 relative z-10">
                        {[
                          filters.bedrooms !== 'any' ? 1 : 0,
                          filters.bathrooms !== 'any' ? 1 : 0,
                          filters.squareFeet[0] !== 300 || filters.squareFeet[1] !== 1300 ? 1 : 0,
                          filters.features.length
                        ].reduce((a, b) => a + b, 0)}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Enhanced Sort Options */}
            <motion.div
              className="mb-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card 
                className="p-5 relative overflow-hidden group"
                style={{
                  borderRadius: '16px',
                  background: `
                    linear-gradient(135deg, 
                      rgba(15, 23, 42, 0.95) 0%, 
                      rgba(17, 25, 39, 0.9) 50%, 
                      rgba(30, 41, 59, 0.85) 100%
                    )
                  `,
                  backdropFilter: 'blur(25px) saturate(180%)',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  boxShadow: `
                    0 20px 40px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `
                }}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <SortAsc className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white text-lg bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                      📊 Sort ADUs
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-slate-600/50 text-white rounded-lg px-4 py-2 text-sm focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id} className="bg-slate-800">
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-slate-400">🏠 ADUs Found</p>
                      <p className="text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {sortedModels.length}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Enhanced Models Grid */}
            <motion.div
              className="grid grid-cols-2 gap-8"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {sortedModels.map((model, index) => {
                const isDragging = false;

                return (
                  <motion.div
                    key={model.id}
                    initial={{ y: 50, opacity: 0, rotateX: 15 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 100,
                      damping: 20
                    }}
                    className={`${isDragging ? 'opacity-50 scale-95' : ''} transform-gpu`}
                    onMouseEnter={() => setHoveredModel(model.id)}
                    onMouseLeave={() => setHoveredModel(null)}
                    whileHover={{ 
                      scale: 1.03,
                      rotateY: 2,
                      rotateX: -2,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card 
                      className="overflow-hidden group cursor-grab active:cursor-grabbing transition-all duration-500 relative"
                      style={{
                        borderRadius: '24px',
                        background: `
                          linear-gradient(135deg, 
                            rgba(15, 23, 42, 0.95) 0%, 
                            rgba(17, 25, 39, 0.9) 50%, 
                            rgba(30, 41, 59, 0.85) 100%
                          )
                        `,
                        backdropFilter: 'blur(25px) saturate(180%)',
                        border: hoveredModel === model.id 
                          ? '1px solid rgba(0, 229, 255, 0.5)' 
                          : '1px solid rgba(0, 229, 255, 0.2)',
                        boxShadow: hoveredModel === model.id
                          ? `
                            0 35px 70px rgba(0, 0, 0, 0.3),
                            0 0 0 1px rgba(0, 229, 255, 0.2),
                            inset 0 1px 0 rgba(255, 255, 255, 0.1),
                            0 0 60px rgba(0, 229, 255, 0.15)
                          `
                          : `
                            0 25px 50px rgba(0, 0, 0, 0.2),
                            0 0 0 1px rgba(0, 229, 255, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.05)
                          `,
                        transform: isDragging ? 'rotate(5deg)' : 'rotate(0deg)'
                      }}
                      onClick={() => onModelSelect(model.id)}
                    >

                      {/* Model Image with Enhanced Effects */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={model.heroImage}
                          alt={model.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          style={{
                            filter: hoveredModel === model.id 
                              ? 'brightness(1.1) contrast(1.1) saturate(1.2)' 
                              : 'brightness(1) contrast(1) saturate(1)'
                          }}
                        />
                        
                        {/* Construction Overlay */}
                        <div 
                          className="absolute inset-0 transition-all duration-500"
                          style={{
                            background: hoveredModel === model.id
                              ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, transparent 50%, rgba(0, 229, 255, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%)'
                          }}
                        />
                        
                        {/* Drag indicator with construction theme */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/80 to-blue-500/80 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <GripVertical className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        {/* Enhanced Like button */}
                        <motion.div
                          className="absolute top-3 left-3 z-20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-10 h-10 rounded-full p-0 backdrop-blur-sm border border-white/20"
                            style={{
                              background: likedModels.includes(model.id) 
                                ? 'rgba(239, 68, 68, 0.2)' 
                                : 'rgba(0, 0, 0, 0.3)'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(model.id);
                            }}
                          >
                            <Heart 
                              className={`w-5 h-5 transition-all duration-300 ${
                                likedModels.includes(model.id) 
                                  ? 'text-red-500 fill-current scale-110' 
                                  : 'text-white hover:text-red-400'
                              }`} 
                            />
                          </Button>
                        </motion.div>

                        {/* Enhanced Badges with Construction Theme */}
                        <div className="absolute top-14 left-3 flex flex-col gap-2">
                          {model.isNew && (
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 text-xs shadow-lg">
                                🆕 New Build
                              </Badge>
                            </motion.div>
                          )}
                          {model.isPopular && (
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs shadow-lg">
                                <Star className="w-3 h-3 mr-1" />
                                🔥 Popular
                              </Badge>
                            </motion.div>
                          )}
                          {model.isFeatured && (
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs shadow-lg">
                                ⭐ Featured
                              </Badge>
                            </motion.div>
                          )}
                        </div>

                        <div className="absolute top-3 right-14">
                          {model.has360View && (
                            <Badge className="bg-black/60 text-white border-white/20 backdrop-blur-sm text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              🏗️ 360°
                            </Badge>
                          )}
                        </div>

                        {/* Enhanced 360 View Button */}
                        {model.has360View && (
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                            initial={{ scale: 0.8 }}
                            whileHover={{ scale: 1 }}
                          >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Enhanced Content Section */}
                      <div className="p-6 relative">
                        {/* Price with Smart Home badge */}
                        <div className="absolute top-0 right-6 transform -translate-y-1/2">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm shadow-lg">
                            💰 Starting from ${(model.basePrice || 0).toLocaleString()}
                          </div>
                        </div>

                        {/* Model Name */}
                        <motion.h3 
                          className="text-2xl bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent mb-4 pr-24"
                          whileHover={{ scale: 1.02 }}
                        >
                          🏠 {model.name}
                        </motion.h3>

                        {/* Enhanced Stats with Construction Icons */}
                        <div className="space-y-3 mb-6">
                          {[
                            { icon: Square, value: `📐 ${model.area}`, color: 'text-cyan-400' },
                            { 
                              icon: Bed, 
                              value: `🛏️ ${model.bedrooms === 1 && model.features.some(f => f.toLowerCase().includes('office')) 
                                ? '1 Bedroom & Office' 
                                : model.bedrooms === 2
                                ? '2 Bedrooms' 
                                : model.bedrooms === 1
                                ? '1 Bedroom'
                                : `${model.bedrooms} Bedrooms`}`,
                              color: 'text-blue-400'
                            },
                            { 
                              icon: Bath, 
                              value: `🚿 ${model.bathrooms === 1 
                                ? '1 Bathroom' 
                                : model.bathrooms === 1.5 
                                ? '1.5 Bathrooms'
                                : model.bathrooms === 2
                                ? '2 Bathrooms'
                                : model.bathrooms === 2.5
                                ? '2.5 Bathrooms'
                                : `${model.bathrooms} Bathrooms`}`,
                              color: 'text-purple-400'
                            }
                          ].map((stat, statIndex) => (
                            <motion.div 
                              key={statIndex}
                              className="flex items-center gap-3 text-white group-hover:text-cyan-100 transition-colors duration-300"
                              whileHover={{ x: 4 }}
                            >
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r from-slate-700/50 to-slate-600/50 flex items-center justify-center border border-slate-600/30`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                              </div>
                              <span className="flex-1">{stat.value}</span>
                            </motion.div>
                          ))}
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex gap-3">
                          <motion.div
                            className="flex-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onModelSelect(model.id);
                              }}
                              className="w-full bg-gradient-to-r from-slate-700/60 to-slate-600/60 border border-slate-500/30 text-white hover:from-slate-600/70 hover:to-slate-500/70 hover:border-cyan-400/40 transition-all duration-300 relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/0 hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300" />
                              <Eye className="w-4 h-4 mr-2 relative z-10" />
                              <span className="relative z-10">🔍 Details</span>
                            </Button>
                          </motion.div>
                          <motion.div
                            className="flex-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartConfiguration(model.id);
                              }}
                              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 hover:from-white/10 hover:to-white/20 transition-all duration-300" />
                              <Settings className="w-4 h-4 mr-2 relative z-10" />
                              <span className="relative z-10">⚙️ Configure</span>
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Enhanced No Results Message */}
            {sortedModels.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card 
                  className="p-12 relative overflow-hidden"
                  style={{
                    borderRadius: '24px',
                    background: `
                      linear-gradient(135deg, 
                        rgba(15, 23, 42, 0.95) 0%, 
                        rgba(17, 25, 39, 0.9) 50%, 
                        rgba(30, 41, 59, 0.85) 100%
                      )
                    `,
                    backdropFilter: 'blur(25px) saturate(180%)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    boxShadow: `
                      0 25px 50px rgba(0, 0, 0, 0.25),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `
                  }}
                >
                  <div className="text-center relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 mx-auto mb-6"
                    >
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-slate-600 to-slate-500 flex items-center justify-center">
                        <div className="text-3xl">🏗️</div>
                      </div>
                    </motion.div>
                    <h3 className="text-2xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                      🔍 No Smart ADUs Match Your Criteria
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                      Try adjusting your filters to discover more amazing future-ready ADU designs 🏠✨
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={resetFilters}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg hover:shadow-cyan-500/25"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        🔄 Reset Smart Filters
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Enhanced Footer with Construction Theme */}
        <motion.div
          className="mt-16 text-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Card 
            className="p-12 relative overflow-hidden group"
            style={{
              borderRadius: '32px',
              background: `
                linear-gradient(135deg, 
                  rgba(15, 23, 42, 0.95) 0%, 
                  rgba(17, 25, 39, 0.9) 50%, 
                  rgba(30, 41, 59, 0.85) 100%
                )
              `,
              backdropFilter: 'blur(25px) saturate(180%)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              boxShadow: `
                0 35px 70px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
          >
            <div className="relative z-10">
              <motion.h3 
                className="text-3xl bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent mb-6"
                whileHover={{ scale: 1.05 }}
              >
                🏗️ Need Help Building Your Future?
              </motion.h3>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Our smart construction consultants are here to help you build the perfect future-ready ADU. 
                Get AI-powered recommendations based on your lot size, budget, and smart home preferences! 🤖🏠
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg hover:shadow-cyan-500/25 px-8 py-3">
                    📅 Schedule Smart Consultation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="bg-slate-800/30 border-slate-600/30 text-white hover:border-cyan-400/50 hover:bg-slate-700/30 px-8 py-3"
                  >
                    📁 Download Future Catalog
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}