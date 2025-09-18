import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  Bed,
  Bath,
  Ruler,
  Settings,
  Car,
  Building2,
  ChefHat,
  Archive,
  Umbrella,
  User,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  Mountain,
  Plus
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';

interface SkylineConfiguratorProps {
  isDark?: boolean;
  onConfigurationChange?: (config: SkylineConfig) => void;
  initialConfig?: Partial<SkylineConfig>;
  className?: string;
}

export interface SkylineConfig {
  bedrooms: 'any' | '1' | '1-office' | '2';
  bathrooms: 'any' | '1' | '1.5' | '2' | '2.5';
  squareFeet: [number, number];
  features: string[];
}

const FEATURES = [
  { id: 'loft', label: 'Loft', icon: Mountain },
  { id: 'garage', label: 'Garage', icon: Car },
  { id: 'office', label: 'Office', icon: Building2 },
  { id: 'primary-suite', label: 'Primary Suite', icon: Bed },
  { id: 'kitchen-island', label: 'Kitchen Island', icon: ChefHat },
  { id: 'extra-storage', label: 'Extra Storage', icon: Archive },
  { id: 'covered-patio', label: 'Covered Patio', icon: Umbrella },
  { id: 'covered-porch', label: 'Covered Porch', icon: Home },
  { id: 'bonus-room', label: 'Bonus Room', icon: Plus }
];

const BEDROOM_OPTIONS = [
  { value: 'any', label: 'Any Bedrooms' },
  { value: '1', label: '1 Bedroom' },
  { value: '1-office', label: '1 Bedroom & Office' },
  { value: '2', label: '2 Bedrooms' }
];

const BATHROOM_OPTIONS = [
  { value: 'any', label: 'Any Bathrooms' },
  { value: '1', label: '1 Bathroom' },
  { value: '1.5', label: '1.5 Bathrooms' },
  { value: '2', label: '2 Bathrooms' },
  { value: '2.5', label: '2.5 Bathrooms' }
];

export function SkylineConfigurator({
  isDark = true,
  onConfigurationChange,
  initialConfig,
  className = ""
}: SkylineConfiguratorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [config, setConfig] = useState<SkylineConfig>({
    bedrooms: 'any',
    bathrooms: 'any',
    squareFeet: [300, 1300],
    features: [],
    ...initialConfig
  });

  useEffect(() => {
    onConfigurationChange?.(config);
  }, [config]);

  const updateConfig = (updates: Partial<SkylineConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleFeature = (featureId: string) => {
    updateConfig({
      features: config.features.includes(featureId)
        ? config.features.filter(f => f !== featureId)
        : [...config.features, featureId]
    });
  };

  const clearAllFilters = () => {
    setConfig({
      bedrooms: 'any',
      bathrooms: 'any',
      squareFeet: [300, 1300],
      features: []
    });
  };

  const hasActiveFilters = config.bedrooms !== 'any' || 
                          config.bathrooms !== 'any' || 
                          config.squareFeet[0] !== 300 || 
                          config.squareFeet[1] !== 1300 || 
                          config.features.length > 0;

  return (
    <motion.div
      className={`relative ${className}`}
      initial={false}
      animate={{ height: isExpanded ? 'auto' : 'auto' }}
    >
      <Card className={`overflow-hidden transition-all duration-500 ${
        isDark 
          ? 'bg-slate-800/60 border-slate-700/50' 
          : 'bg-white/60 border-slate-200/50'
      } backdrop-blur-xl shadow-2xl`}
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)'
          : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.6) 100%)',
        boxShadow: isDark 
          ? '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 20px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
      }}>
        {/* Header */}
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'
              }`}>
                <Filter className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className={`font-medium ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  Skyline Collection Filters
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Customize your ADU search preferences
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                    {config.features.length + 
                     (config.bedrooms !== 'any' ? 1 : 0) + 
                     (config.bathrooms !== 'any' ? 1 : 0) +
                     (config.squareFeet[0] !== 300 || config.squareFeet[1] !== 1300 ? 1 : 0)} active
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllFilters();
                    }}
                    className={`h-8 px-3 ${
                      isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100/50'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
              
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`p-2 rounded-lg ${
                  isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100/50'
                } transition-colors`}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 space-y-6">
                
                {/* Bedrooms & Bathrooms Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Bedrooms */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-blue-500" />
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Bedrooms
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {BEDROOM_OPTIONS.map((option) => (
                        <Button
                          key={option.value}
                          size="sm"
                          variant={config.bedrooms === option.value ? 'default' : 'outline'}
                          onClick={() => updateConfig({ bedrooms: option.value as any })}
                          className={`h-9 px-4 transition-all duration-200 ${
                            config.bedrooms === option.value
                              ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                              : isDark
                                ? 'border-slate-600/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                : 'border-slate-300/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Bath className="w-4 h-4 text-blue-500" />
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Bathrooms
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {BATHROOM_OPTIONS.map((option) => (
                        <Button
                          key={option.value}
                          size="sm"
                          variant={config.bathrooms === option.value ? 'default' : 'outline'}
                          onClick={() => updateConfig({ bathrooms: option.value as any })}
                          className={`h-9 px-4 transition-all duration-200 ${
                            config.bathrooms === option.value
                              ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                              : isDark
                                ? 'border-slate-600/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                : 'border-slate-300/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className={isDark ? 'bg-slate-700/50' : 'bg-slate-200/50'} />

                {/* Square Feet */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-blue-500" />
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Square Feet
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="px-4">
                      <Slider
                        value={config.squareFeet}
                        onValueChange={(value) => updateConfig({ squareFeet: value as [number, number] })}
                        min={300}
                        max={1300}
                        step={25}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center px-2">
                      <span className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {config.squareFeet[0]} sq ft
                      </span>
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {config.squareFeet[0]} — {config.squareFeet[1]} sq ft
                      </span>
                      <span className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {config.squareFeet[1]} sq ft
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className={isDark ? 'bg-slate-700/50' : 'bg-slate-200/50'} />

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-blue-500" />
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Features
                    </span>
                    {config.features.length > 0 && (
                      <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                        {config.features.length} selected
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {FEATURES.map((feature) => {
                      const Icon = feature.icon;
                      const isSelected = config.features.includes(feature.id);
                      
                      return (
                        <motion.div
                          key={feature.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            onClick={() => toggleFeature(feature.id)}
                            className={`w-full h-12 flex items-center gap-3 px-4 transition-all duration-200 ${
                              isSelected
                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-600'
                                : isDark
                                  ? 'border-slate-600/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                  : 'border-slate-300/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${
                              isSelected ? 'text-blue-500' : 'text-current'
                            }`} />
                            <span className="text-sm font-medium truncate">
                              {feature.label}
                            </span>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}