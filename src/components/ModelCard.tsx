import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Heart, Share2, GitCompare, Eye, Home, Ruler, Building, Layers, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface LegacyModelData {
  id: string;
  title: string;
  description?: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  footprint: string;
  height: string;
  stories: number;
  priceRange: string;
  imageUrl: string;
  badges: Array<'360' | 'New' | 'Fits-Lot'>;
  collection: 'economy' | 'comfort' | 'luxury' | 'premium';
  isNew?: boolean;
  isFavorite?: boolean;
}

interface ModelCardProps {
  model: LegacyModelData;
  viewMode: 'grid' | 'list';
  isComparing?: boolean;
  onSelect: () => void;
  onCompareToggle: () => void;
}

export function ModelCard({ model, viewMode, isComparing = false, onSelect, onCompareToggle }: ModelCardProps) {
  const [isFavorite, setIsFavorite] = useState(model.isFavorite || false);
  const [isHovered, setIsHovered] = useState(false);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case '360': return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30';
      case 'New': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'Fits-Lot': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-400/30';
    }
  };

  const getCollectionColors = () => {
    switch (model.collection) {
      case 'economy': return {
        border: '#10B981',
        gradient: 'from-green-500/20 to-emerald-500/20',
        accent: 'text-green-400'
      };
      case 'comfort': return {
        border: '#3B82F6',
        gradient: 'from-blue-500/20 to-indigo-500/20',
        accent: 'text-blue-400'
      };
      case 'luxury': return {
        border: '#8B5CF6',
        gradient: 'from-purple-500/20 to-violet-500/20',
        accent: 'text-purple-400'
      };
      case 'premium': return {
        border: '#F59E0B',
        gradient: 'from-amber-500/20 to-orange-500/20',
        accent: 'text-amber-400'
      };
      default: return {
        border: '#10B981',
        gradient: 'from-green-500/20 to-emerald-500/20',
        accent: 'text-green-400'
      };
    }
  };

  const colors = getCollectionColors();

  if (viewMode === 'list') {
    return (
      <motion.div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          className="overflow-hidden transition-all duration-500 group-hover:shadow-2xl"
          style={{
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
            backdropFilter: 'blur(40px)',
            border: `1px solid ${colors.border}30`,
            boxShadow: isHovered ? `0 0 40px -10px ${colors.border}40` : 'none',
            minHeight: '160px'
          }}
        >
          <div className="flex h-full">
            {/* Image Section */}
            <div className="relative w-80 h-40 overflow-hidden" style={{ borderRadius: '20px 0 0 20px' }}>
              <img 
                src={model.imageUrl} 
                alt={model.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {model.badges.map((badge, index) => (
                  <Badge 
                    key={index}
                    className={`text-xs font-medium ${getBadgeColor(badge)}`}
                    style={{ borderRadius: '8px', padding: '2px 8px' }}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                className="absolute top-3 right-3 w-8 h-8 p-0 bg-black/30 hover:bg-black/50 rounded-full"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-400 text-red-400' : 'text-white'}`} />
              </Button>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-semibold mb-2" style={{ fontSize: '1.125rem' }}>
                  {model.title}
                </h3>
                
                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Ruler className="w-4 h-4 text-slate-400" />
                    <span>{model.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Home className="w-4 h-4 text-slate-400" />
                    <span>{model.bedrooms}BR / {model.bathrooms}BA</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>{model.footprint}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span>{model.stories} {model.stories === 1 ? 'Story' : 'Stories'}</span>
                  </div>
                </div>

                {/* Status Pill */}
                <Badge 
                  className="bg-green-500/20 text-green-300 border-green-400/30 mb-4"
                  style={{ borderRadius: '12px', fontSize: '0.75rem' }}
                >
                  Compatible with your lot
                </Badge>
              </div>

              {/* Bottom Section */}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold ${colors.accent}`} style={{ fontSize: '1rem' }}>
                    {model.priceRange}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompareToggle();
                    }}
                    className={`w-9 h-9 p-0 rounded-full transition-all duration-300 ${
                      isComparing 
                        ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-400' 
                        : 'bg-slate-800/50 border-slate-600/50 text-slate-400 hover:border-cyan-400/50 hover:text-cyan-400'
                    }`}
                  >
                    <GitCompare className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-9 h-9 p-0 rounded-full bg-slate-800/50 border-slate-600/50 text-slate-400 hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={onSelect}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
                    style={{ borderRadius: '12px', padding: '8px 16px' }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
    >
      <Card 
        className="overflow-hidden transition-all duration-500 group-hover:shadow-2xl"
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          backdropFilter: 'blur(40px)',
          border: `1px solid ${colors.border}30`,
          boxShadow: isHovered ? `0 0 40px -10px ${colors.border}40` : 'none'
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={model.imageUrl} 
            alt={model.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {model.badges.map((badge, index) => (
              <Badge 
                key={index}
                className={`text-xs font-medium ${getBadgeColor(badge)}`}
                style={{ borderRadius: '8px', padding: '2px 8px' }}
              >
                {badge}
              </Badge>
            ))}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 w-8 h-8 p-0 bg-black/30 hover:bg-black/50 rounded-full transition-all duration-300"
          >
            <Heart className={`w-4 h-4 transition-all duration-300 ${isFavorite ? 'fill-red-400 text-red-400' : 'text-white'}`} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-white font-semibold mb-3" style={{ fontSize: '1rem' }}>
            {model.title}
          </h3>
          
          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <Ruler className="w-3 h-3 text-slate-400" />
              <span>{model.area}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <Home className="w-3 h-3 text-slate-400" />
              <span>{model.bedrooms}BR/{model.bathrooms}BA</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <Building className="w-3 h-3 text-slate-400" />
              <span>{model.footprint}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <Layers className="w-3 h-3 text-slate-400" />
              <span>{model.height}</span>
            </div>
          </div>

          {/* Status Pill */}
          <Badge 
            className="bg-green-500/20 text-green-300 border-green-400/30 mb-4 text-xs"
            style={{ borderRadius: '10px', padding: '2px 8px' }}
          >
            Fits
          </Badge>

          {/* Price */}
          <p className={`font-semibold mb-4 ${colors.accent}`} style={{ fontSize: '0.875rem' }}>
            {model.priceRange}
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-between">
            <Button
              onClick={onSelect}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 mr-2"
              style={{ borderRadius: '12px', height: '36px' }}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCompareToggle();
                }}
                className={`w-9 h-9 p-0 rounded-full transition-all duration-300 ${
                  isComparing 
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-400' 
                    : 'bg-slate-800/50 border-slate-600/50 text-slate-400 hover:border-cyan-400/50 hover:text-cyan-400'
                }`}
              >
                <GitCompare className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle share
                }}
                className="w-9 h-9 p-0 rounded-full bg-slate-800/50 border-slate-600/50 text-slate-400 hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}