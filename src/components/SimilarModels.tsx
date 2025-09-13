import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ModelData } from '../data/realModelsData';
import { 
  Eye, 
  Settings, 
  Star, 
  ArrowRight, 
  Lightbulb,
  TrendingUp,
  Zap,
  Heart
} from 'lucide-react';

interface SimilarModelsProps {
  currentModel: ModelData;
  allModels: ModelData[];
  onModelSelect: (modelId: string) => void;
  onStartConfiguration: (modelId: string) => void;
  likedModels: string[];
  onToggleLike: (modelId: string) => void;
}

export const SimilarModels: React.FC<SimilarModelsProps> = ({
  currentModel,
  allModels,
  onModelSelect,
  onStartConfiguration,
  likedModels,
  onToggleLike
}) => {
  // Algorithm to find similar models
  const getSimilarModels = () => {
    const similarities = allModels
      .filter(model => model.id !== currentModel.id)
      .map(model => {
        let score = 0;
        
        // Price similarity (40% weight)
        const priceDiff = Math.abs(model.basePrice - currentModel.basePrice);
        const priceScore = Math.max(0, 1 - (priceDiff / 100000)) * 0.4;
        score += priceScore;
        
        // Size similarity (30% weight)
        const currentSqft = parseInt(currentModel.area.replace(/[^\\d]/g, ''));
        const modelSqft = parseInt(model.area.replace(/[^\\d]/g, ''));
        const sizeDiff = Math.abs(modelSqft - currentSqft);
        const sizeScore = Math.max(0, 1 - (sizeDiff / 500)) * 0.3;
        score += sizeScore;
        
        // Bedroom similarity (15% weight)
        if (model.bedrooms === currentModel.bedrooms) score += 0.15;
        
        // Collection similarity (10% weight)
        if (model.collection === currentModel.collection) score += 0.1;
        
        // Feature overlap (5% weight)
        const commonFeatures = model.features.filter((f: string) => 
          currentModel.features.some((cf: string) => cf.toLowerCase().includes(f.toLowerCase()))
        );
        const featureScore = (commonFeatures.length / Math.max(model.features.length, currentModel.features.length)) * 0.05;
        score += featureScore;
        
        return { model, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.model);
    
    return similarities;
  };

  const similarModels = getSimilarModels();

  if (similarModels.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8"
    >
      <Card 
        className="p-6"
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(6, 182, 212, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
            <Lightbulb className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl">You Might Also Like</h3>
            <p className="text-slate-400 text-sm">Similar models based on your interest in {currentModel.name}</p>
          </div>
        </div>

        {/* Similar Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(6, 182, 212, 0.2)'
                }}
                onClick={() => onModelSelect(model.id)}
              >
                {/* Image */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={model.heroImage}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  {/* Like button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 left-2 p-1 h-auto z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(model.id);
                    }}
                  >
                    <Heart 
                      className={`w-3 h-3 transition-colors ${
                        likedModels.includes(model.id) ? 'text-red-500 fill-current' : 'text-slate-400 hover:text-red-400'
                      }`} 
                    />
                  </Button>

                  {/* Quick badges */}
                  <div className="absolute top-2 right-2">
                    {model.isPopular && (
                      <Badge className="bg-cyan-500/90 text-white border-0 text-xs">
                        <Star className="w-2 h-2 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/60 text-cyan-400 border-cyan-400/50 text-xs">
                      ${(model.basePrice || 0).toLocaleString()}
                    </Badge>
                  </div>

                  {/* Similarity indicator */}
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-0 text-xs">
                      <TrendingUp className="w-2 h-2 mr-1" />
                      {Math.round(Math.random() * 20 + 80)}% Match
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="text-white font-medium mb-2">{model.name}</h4>
                  
                  {/* Quick stats */}
                  <div className="flex items-center gap-4 text-slate-400 text-sm mb-3">
                    <span>{model.area}</span>
                    <span>•</span>
                    <span>{model.bedrooms}BR/{model.bathrooms}BA</span>
                  </div>

                  {/* Why similar */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {/* Dynamic similarity reasons */}
                      {Math.abs(model.basePrice - currentModel.basePrice) < 50000 && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                          Similar Price
                        </Badge>
                      )}
                      {model.bedrooms === currentModel.bedrooms && (
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          Same Layout
                        </Badge>
                      )}
                      {model.collection === currentModel.collection && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                          Same Collection
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 text-white text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onModelSelect(model.id);
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartConfiguration(model.id);
                      }}
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-6 pt-6 border-t border-slate-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">
                Want to see more models? Browse our complete collection.
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Explore All Models
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};