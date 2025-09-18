import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  GitCompare,
  X,
  Eye,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ModelData } from '../data/realModelsData';

interface CompareFloatingBarProps {
  compareList: string[];
  models: ModelData[];
  onRemoveFromCompare: (modelId: string) => void;
  onStartComparison: () => void;
  onClearAll: () => void;
  isDark?: boolean;
}

export function CompareFloatingBar({
  compareList,
  models,
  onRemoveFromCompare,
  onStartComparison,
  onClearAll,
  isDark = true
}: CompareFloatingBarProps) {
  const compareModels = models.filter(model => compareList.includes(model.id));

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <Card 
          className={`px-6 py-4 shadow-2xl border-2 relative ${
            isDark 
              ? 'bg-slate-900/95 border-cyan-500/30' 
              : 'bg-white/95 border-cyan-500/40'
          }`}
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(6, 182, 212, 0.2)',
            background: isDark 
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)'
          }}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClearAll}
            className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isDark 
                ? 'bg-slate-700/90 hover:bg-slate-600/90 text-slate-300 hover:text-white border border-slate-600/50' 
                : 'bg-white/90 hover:bg-gray-100/90 text-slate-600 hover:text-slate-800 border border-slate-300/50'
            }`}
            style={{
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <X className="w-4 h-4" />
          </motion.button>
          <div className="flex items-center gap-4">
            {/* Compare Icon with Animation */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className={`p-3 rounded-full ${
                isDark 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600'
              }`}>
                <GitCompare className="w-5 h-5 text-white" />
              </div>
              
              {/* Glow Effect */}
              <div 
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)'
                }}
              />
            </motion.div>

            {/* Models Preview */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {compareModels.slice(0, 3).map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                      <img 
                        src={model.heroImage}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Remove Button */}
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => onRemoveFromCompare(model.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {/* Count and Text */}
              <div className={`${isDark ? 'text-white' : 'text-slate-800'}`}>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {compareList.length} Model{compareList.length !== 1 ? 's' : ''}
                  </Badge>
                  <span className="font-medium">Ready to Compare</span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Compare features, pricing, and specifications
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Clear All */}
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className={`text-xs ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50'
                    : 'bg-white/50 border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Clear All
              </Button>

              {/* Compare Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onStartComparison}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg"
                  disabled={compareList.length < 2}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Compare Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-3">
            <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {compareList.length < 2 ? 'Add at least 2 models to compare' : 
               compareList.length === 3 ? 'Maximum models selected' : 
               'Add up to 3 models'}
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-slate-200'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(compareList.length / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>
          </div>

          {/* Sparkle Effects */}
          <div className="absolute -top-2 -right-2">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className={`w-4 h-4 ${
                isDark ? 'text-cyan-400' : 'text-cyan-600'
              }`} />
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}