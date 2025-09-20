import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Star, GitCompare, Building2, Bed, Bath, Eye } from 'lucide-react';
import { ModelData } from '../../types/home';
import { useHouseSpecs } from '../../hooks/useHouseSpecs';

//

interface ModelCardProps {
  model: ModelData;
  isDark: boolean;
  favorites: string[];
  compareList: string[];
  onModelClick: (model: ModelData) => void;
  onToggleFavorite: (modelId: string) => void;
  onToggleCompare: (modelId: string) => void;
  onViewDetails: (model: ModelData) => void;
}

export function ModelCard({
  model,
  isDark,
  favorites,
  compareList,
  onModelClick,
  onToggleFavorite,
  onToggleCompare,
  onViewDetails
}: ModelCardProps) {
  const isFavorite = favorites.includes(model.id);
  const isInCompare = compareList.includes(model.id);
  
  // Получаем динамические данные о доме
  const { specs, isLoading } = useHouseSpecs(model.id, model.collection);

  // Build hero image path from public assets with fallback across extensions
  const extCandidates: Array<'webp' | 'jpg' | 'png'> = (
    (model.collection || '').toLowerCase() === 'neo'
      ? ['jpg', 'webp', 'png']
      : ['webp', 'jpg', 'png']
  );
  function buildHeroPath(collection: string, houseId: string, ext: string): string {
    if ((collection || '').toLowerCase() === 'neo') {
      let clean = String(houseId || '');
      const lower = clean.toLowerCase();
      if (lower.startsWith('neo-')) clean = clean.slice(4);
      // Normalize case, keeping special HorizonX capitalization
      const normalized = clean.toLowerCase() === 'horizonx'
        ? 'HorizonX'
        : clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
      // Neo hero files are color-specific; default to white
      return `/assets/neo/${normalized}/360/hero_white.${ext}`;
    }
    // Remove collection prefix if present, e.g., premium-Redwood or skyline-walnut
    const coll = (collection || '').toLowerCase();
    let clean = String(houseId || '');
    const lower = clean.toLowerCase();
    const possiblePrefix = `${coll}-`;
    if (lower.startsWith(possiblePrefix)) clean = clean.slice(possiblePrefix.length);
    return `/assets/${collection}/${clean}/360/hero.${ext}`;
  }

  // Build fallback chain: /360/hero.{ext} then /360/preview-hero.{ext} then root /hero.{ext}
  const heroCandidates = React.useMemo(() => {
    const candidates: string[] = [];
    const coll = (model.collection || '').toLowerCase();
    let clean = String(model.id || '');
    const lower = clean.toLowerCase();
    const possiblePrefix = `${coll}-`;
    if (lower.startsWith(possiblePrefix)) clean = clean.slice(possiblePrefix.length);
    
    // Special cases for problematic models
    if (lower === 'oak' || lower === 'retreat') {
      extCandidates.forEach(ext => {
        candidates.push(`/assets/skyline/Oak/360/hero.${ext}`);
      });
      extCandidates.forEach(ext => {
        candidates.push(`/assets/skyline/Oak/360/preview-hero.${ext}`);
      });
      extCandidates.forEach(ext => {
        candidates.push(`/assets/skyline/Oak/hero.${ext}`);
      });
      return candidates;
    }
    
    // Special case for pine
    if (lower === 'pine') {
      candidates.push('/assets/skyline/pine/360/hero.png');
      extCandidates.forEach(ext => {
        candidates.push(`/assets/skyline/pine/hero.${ext}`);
      });
      return candidates;
    }
    
    // Special case for ponderosa
    if (lower === 'ponderosa') {
      candidates.push('/assets/skyline/ponderosa/360/hero.png');
      extCandidates.forEach(ext => {
        candidates.push(`/assets/skyline/ponderosa/hero.${ext}`);
      });
      return candidates;
    }
    
    // Regular case: try all paths
    extCandidates.forEach(ext => {
      candidates.push(buildHeroPath(model.collection, model.id, ext));
    });
    
    // For non-Neo, try preview-hero
    if (coll !== 'neo') {
      extCandidates.forEach(ext => {
        candidates.push(`/assets/${coll}/${clean}/360/preview-hero.${ext}`);
      });
      // Then try root hero
      extCandidates.forEach(ext => {
        candidates.push(`/assets/${coll}/${clean}/hero.${ext}`);
      });
    } else {
      // Neo: try root hero without _white suffix
      if (lower.startsWith('neo-')) clean = clean.slice(4);
      const normalized = lower === 'horizonx'
        ? 'HorizonX'
        : clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
      extCandidates.forEach(ext => {
        candidates.push(`/assets/neo/${normalized}/hero.${ext}`);
      });
    }
    return candidates;
  }, [model.collection, model.id, extCandidates]);

  const [heroFallbackIndex, setHeroFallbackIndex] = React.useState<number>(0);
  const [heroSrc, setHeroSrc] = React.useState<string>(heroCandidates[0]);

  React.useEffect(function resetHeroOnModelChange() {
    setHeroFallbackIndex(0);
    setHeroSrc(heroCandidates[0]);
  }, [model.id, model.collection, heroCandidates]);

  // Derive a robust sqft display string from specs.area or model.area
  const displaySqft: string = React.useMemo(() => {
    const source = (specs?.area || model.area || '').toString();
    if (!source) return '';
    // Grab the last numeric group to avoid truncation issues (e.g., pick 1008 from "1008 SF")
    const numericGroups = source.replace(/,/g, '').match(/\d+/g);
    if (numericGroups && numericGroups.length > 0) {
      const last = numericGroups[numericGroups.length - 1];
      const parsed = parseInt(last, 10);
      if (!Number.isNaN(parsed) && parsed > 0) return `${parsed} SF`;
    }
    return source; // fallback to raw string
  }, [specs?.area, model.area]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="cursor-pointer"
      onClick={() => onModelClick(model)}
    >
      <Card 
        className={`group relative overflow-hidden border transition-all duration-500 hover:shadow-2xl ${
          isFavorite
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
          ...(isFavorite && {
            boxShadow: isDark 
              ? '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(251, 191, 36, 0.1)'
              : '0 12px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(251, 191, 36, 0.15)'
          })
        }}
      >
        {/* Tech Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none">
          <div className={`absolute top-3 left-3 w-3 h-[1px] transition-all duration-300 ${
            isFavorite
              ? 'bg-yellow-400/70'
              : isDark 
                ? 'bg-cyan-400/40 group-hover:bg-cyan-400' 
                : 'bg-slate-400/40 group-hover:bg-cyan-400'
          }`} />
          <div className={`absolute top-3 left-3 w-[1px] h-3 transition-all duration-300 ${
            isFavorite
              ? 'bg-yellow-400/70'
              : isDark 
                ? 'bg-cyan-400/40 group-hover:bg-cyan-400' 
                : 'bg-slate-400/40 group-hover:bg-cyan-400'
          }`} />
        </div>
        
        <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none">
          <div className={`absolute bottom-3 right-3 w-3 h-[1px] transition-all duration-300 ${
            isFavorite
              ? 'bg-yellow-400/70'
              : isDark 
                ? 'bg-cyan-400/40 group-hover:bg-cyan-400' 
                : 'bg-slate-400/40 group-hover:bg-cyan-400'
          }`} />
          <div className={`absolute bottom-3 right-3 w-[1px] h-3 transition-all duration-300 ${
            isFavorite
              ? 'bg-yellow-400/70'
              : isDark 
                ? 'bg-cyan-400/40 group-hover:bg-cyan-400' 
                : 'bg-slate-400/40 group-hover:bg-cyan-400'
          }`} />
        </div>

        {/* Subtle Grid Pattern Overlay */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isFavorite 
              ? 'opacity-[0.04]' 
              : 'opacity-[0.02] group-hover:opacity-[0.05]'
          }`}
          style={{
            backgroundImage: isFavorite
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
              src={heroSrc}
              alt={model.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              onError={() => {
                const nextIndex = heroFallbackIndex + 1;
                if (nextIndex < heroCandidates.length) {
                  setHeroFallbackIndex(nextIndex);
                  setHeroSrc(heroCandidates[nextIndex]);
                }
              }}
            />
          </div>
          
          {/* Enhanced Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500" />
          
          {/* Description overlay removed by request */}
          
          
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
              {model.collection === 'premium' ? 'PREMIER' : model.collection}
            </Badge>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="absolute top-5 right-5 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(model.id);
              }}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              className={`p-2.5 rounded-xl backdrop-blur-lg border transition-all duration-300 ${
                isFavorite
                  ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/40 shadow-lg shadow-yellow-500/20'
                  : 'bg-black/30 text-white/80 border-white/20 hover:bg-black/50 hover:text-white hover:border-white/40'
              }`}
            >
              <Star className={`w-4 h-4 transition-all duration-300 ${
                isFavorite ? 'fill-current' : ''
              }`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(model.id);
              }}
              className={`p-2.5 rounded-xl backdrop-blur-lg border transition-all duration-300 ${
                isInCompare
                  ? 'bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-lg shadow-purple-500/20'
                  : 'bg-black/30 text-white/80 border-white/20 hover:bg-black/50 hover:text-white hover:border-white/40'
              }`}
            >
              <GitCompare className={`w-4 h-4 transition-all duration-300 ${
                isInCompare ? 'fill-current' : ''
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
                <span className="inline-block font-mono tabular-nums whitespace-nowrap min-w-[80px]">
                  {displaySqft || (model.sqft ? `${model.sqft} SF` : 'N/A')}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                <Bed className="w-4 h-4 opacity-60" />
                <span>
                  {isLoading ? '...' : `${specs?.bedrooms || model.bedrooms} BR`}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                <Bath className="w-4 h-4 opacity-60" />
                <span>
                  {isLoading ? '...' : `${specs?.bathrooms || model.bathrooms} BA`}
                </span>
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
                isInCompare
                  ? 'bg-purple-500/25 text-purple-100 border-r border-purple-400/30'
                  : model.collection === 'premium' 
                    ? 'bg-gradient-to-r from-cyan-500/85 to-cyan-600/85 hover:from-cyan-400/95 hover:to-cyan-500/95 text-white border-r border-cyan-400/30'
                    : model.collection === 'neo'
                    ? 'bg-gradient-to-r from-purple-500/85 to-purple-600/85 hover:from-purple-400/95 hover:to-purple-500/95 text-white border-r border-purple-400/30'
                    : 'bg-gradient-to-r from-blue-500/85 to-blue-600/85 hover:from-blue-400/95 hover:to-blue-500/95 text-white border-r border-blue-400/30'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(model.id);
              }}
            >
              <div className="flex items-center justify-center gap-2.5 relative z-10">
                <GitCompare className="w-4 h-4" />
                <span className="font-medium text-sm">
                  {isInCompare ? 'Added' : 'Compare'}
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
                onViewDetails(model);
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
  );
}
