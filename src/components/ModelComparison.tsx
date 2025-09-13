import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  X, 
  Square, 
  Bed, 
  Bath, 
  DollarSign,
  Star,
  Eye,
  Settings,
  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
// import { ModelData } from '../data/realModelsData';
import { toast } from 'sonner';
const seattleAduLogo = '/logo.png';

// Локальный интерфейс ModelData для ModelComparison
interface ModelData {
  id: string;
  name: string;
  collection: string;
  basePrice: number;
  heroImage: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  features: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

interface ModelComparisonProps {
  models: ModelData[];
  compareList: string[];
  onBack: () => void;
  onRemoveFromCompare: (modelId: string) => void;
  onModelSelect: (modelId: string) => void;
  onStartConfiguration: (modelId: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function ModelComparison({
  models,
  compareList,
  onBack,
  onRemoveFromCompare,
  onModelSelect,
  onStartConfiguration,
  isDark,
  onToggleTheme
}: ModelComparisonProps) {
  const [isLandscape, setIsLandscape] = React.useState(window.innerWidth > window.innerHeight);

  React.useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Get compared models data
  const comparedModels = models.filter(model => compareList.includes(model.id));

  if (comparedModels.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl mb-4">No Models to Compare</h2>
          <p className="text-muted-foreground mb-6">
            Please select models to compare from the catalog.
          </p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>
        </Card>
      </div>
    );
  }

  // Comparison categories
  const comparisonCategories = [
    {
      title: '🏠 Basic Info',
      items: [
        { key: 'name', label: 'Model Name' },
        { key: 'collection', label: 'Collection' },
        { key: 'area', label: 'Square Feet' },
        { key: 'basePrice', label: 'Starting Price', format: (value: number) => `Starting from ${(value || 0).toLocaleString()}` }
      ]
    },
    {
      title: '🛏️ Layout',
      items: [
        { key: 'bedrooms', label: 'Bedrooms', format: (value: number) => `${value} ${value === 1 ? 'Bedroom' : 'Bedrooms'}` },
        { key: 'bathrooms', label: 'Bathrooms', format: (value: number) => `${value} ${value === 1 ? 'Bathroom' : 'Bathrooms'}` }
      ]
    },
    {
      title: '⚡ Features',
      items: [
        { key: 'features', label: 'Key Features', format: (value: string[]) => value.join(', ') }
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
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
      </div>

      {/* Header */}
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
                    <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-500 ${
                      isDark ? 'bg-slate-900' : 'bg-white'
                    }`}>
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
                    📊 Model Comparison
                  </motion.h1>
                  <motion.p 
                    className={`transition-colors duration-500 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    🏠 Compare {comparedModels.length} ADU Models
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Right: Theme Button + Stats */}
            <div className="flex items-center gap-6">
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
                  {isDark ? '☀️' : '🌙'}
                </Button>
              </motion.div>

              <div className="text-center">
                <p className={`text-2xl transition-colors duration-500 ${
                  isDark ? 'text-cyan-400' : 'text-cyan-600'
                }`}>
                  {comparedModels.length}
                </p>
                <p className={`text-sm transition-colors duration-500 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Models
                </p>
              </div>
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
        {/* Models Overview Cards */}
        <motion.div
          className="grid gap-6 mb-8"
          style={{ gridTemplateColumns: `repeat(${Math.min(comparedModels.length, 3)}, 1fr)` }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {comparedModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card 
                className="overflow-hidden relative group cursor-pointer transition-all duration-500"
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
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `
                    : `
                      0 25px 50px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.8)
                    `
                }}
                onClick={() => onModelSelect(model.id)}
              >
                {/* Remove Button */}
                <div className="absolute top-3 right-3 z-20">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 rounded-full p-0 backdrop-blur-sm border border-white/20"
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromCompare(model.id);
                        toast.success('Removed from comparison');
                      }}
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </Button>
                  </motion.div>
                </div>

                {/* Model Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={model.heroImage}
                    alt={model.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {model.isNew && (
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 text-xs">
                        🆕 New
                      </Badge>
                    )}
                    {model.isPopular && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                        🔥 Popular
                      </Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      💰 ${(model.basePrice || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className={`text-xl mb-2 transition-colors duration-500 ${
                    isDark ? 'text-white' : 'text-slate-800'
                  }`}>
                    🏠 {model.name}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className={`flex items-center gap-1 transition-colors duration-500 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <Square className="w-4 h-4 text-cyan-400" />
                      📐 {model.area}
                    </div>
                    <div className={`flex items-center gap-1 transition-colors duration-500 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <Bed className="w-4 h-4 text-blue-400" />
                      🛏️ {model.bedrooms}
                    </div>
                    <div className={`flex items-center gap-1 transition-colors duration-500 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <Bath className="w-4 h-4 text-purple-400" />
                      🚿 {model.bathrooms}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onModelSelect(model.id);
                      }}
                      className={`flex-1 transition-all duration-300 ${
                        isDark 
                          ? 'bg-slate-700/60 border-slate-500/30 text-white hover:bg-slate-600/70' 
                          : 'bg-white/60 border-slate-300/30 text-slate-700 hover:bg-slate-50/70'
                      }`}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      🔍 View
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartConfiguration(model.id);
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      ⚙️ Config
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Comparison Table */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card 
            className="overflow-hidden"
            style={{
              borderRadius: '24px',
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
                  0 35px 70px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `
                : `
                  0 35px 70px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `
            }}
          >
            <div className="p-8">
              <h2 className={`text-2xl mb-8 bg-gradient-to-r bg-clip-text text-transparent ${
                isDark 
                  ? 'from-white via-cyan-100 to-blue-100' 
                  : 'from-slate-800 via-slate-700 to-slate-600'
              }`}>
                📊 Detailed Comparison
              </h2>

              <div className="space-y-8">
                {comparisonCategories.map((category, categoryIndex) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + categoryIndex * 0.1 }}
                  >
                    <h3 className={`text-lg mb-4 transition-colors duration-500 ${
                      isDark ? 'text-cyan-300' : 'text-cyan-700'
                    }`}>
                      {category.title}
                    </h3>
                    
                    <div className="space-y-4">
                      {category.items.map((item) => (
                        <div key={item.key} className="grid gap-4" style={{
                          gridTemplateColumns: `200px repeat(${comparedModels.length}, 1fr)`
                        }}>
                          <div className={`font-medium py-3 px-4 rounded-lg transition-colors duration-500 ${
                            isDark 
                              ? 'bg-slate-800/30 text-slate-300' 
                              : 'bg-slate-100/50 text-slate-700'
                          }`}>
                            {item.label}
                          </div>
                          
                          {comparedModels.map((model) => {
                            const value = (model as any)[item.key];
                            const displayValue = item.format ? item.format(value) : value;
                            
                            return (
                              <div 
                                key={model.id} 
                                className={`py-3 px-4 rounded-lg transition-colors duration-500 ${
                                  isDark 
                                    ? 'bg-slate-900/30 text-white' 
                                    : 'bg-white/50 text-slate-800'
                                }`}
                              >
                                {displayValue || 'N/A'}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Card 
            className="p-8"
            style={{
              borderRadius: '24px',
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
                : '1px solid rgba(6, 182, 212, 0.15)'
            }}
          >
            <h3 className={`text-xl mb-4 transition-colors duration-500 ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              🎯 Ready to Choose?
            </h3>
            <p className={`mb-6 transition-colors duration-500 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Found your perfect ADU? Start configuring or schedule a consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onBack}
                className="bg-gradient-to-r from-slate-600 to-slate-500 text-white hover:from-slate-500 hover:to-slate-400"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                🔙 Back to Catalog
              </Button>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400">
                📅 Schedule Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}