'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { 
  Zap, 
  Clock, 
  Gift, 
  Star, 
  Timer,
  TrendingUp,
  Award
} from 'lucide-react';

interface ModelDealBadgeProps {
  dealType?: 'hot' | 'limited_time' | 'new' | 'popular' | 'financing' | 'early_bird' | 'exclusive';
  value?: string;
  timeLeft?: string;
  className?: string;
}

const dealConfig = {
  hot: {
    icon: Zap,
    text: 'HOT DEAL',
    gradient: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-600',
    pulse: true
  },
  limited_time: {
    icon: Clock,
    text: 'LIMITED TIME',
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-600',
    pulse: true
  },
  new: {
    icon: Star,
    text: 'NEW MODEL',
    gradient: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-600',
    pulse: false
  },
  popular: {
    icon: TrendingUp,
    text: 'MOST POPULAR',
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600',
    pulse: false
  },
  financing: {
    icon: Award,
    text: 'SPECIAL RATES',
    gradient: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-600',
    pulse: false
  },
  early_bird: {
    icon: Gift,
    text: 'EARLY ACCESS',
    gradient: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-600',
    pulse: false
  },
  exclusive: {
    icon: Star,
    text: 'EXCLUSIVE',
    gradient: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-600',
    pulse: true
  }
};

export function ModelDealBadge({ dealType, value, timeLeft, className = '' }: ModelDealBadgeProps) {
  if (!dealType) return null;

  const config = dealConfig[dealType];
  if (!config) return null;
  
  const IconComponent = config.icon;

  return (
    <motion.div
      className={`absolute top-3 right-3 z-10 ${className}`}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2 
      }}
    >
      <motion.div
        className="relative"
        animate={config.pulse ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={config.pulse ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        <Badge 
          className={`
            ${config.bgColor} ${config.textColor} border-0 text-xs font-medium
            backdrop-blur-sm shadow-lg px-2 py-1
          `}
          style={{
            background: `linear-gradient(135deg, ${config.gradient.replace('from-', '').replace('to-', ', ')})`,
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
          }}
        >
          <IconComponent className="w-3 h-3 mr-1" />
          {config.text}
        </Badge>

        {/* Glow effect for hot deals */}
        {config.pulse && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${config.gradient.replace('from-', '').replace('to-', ', ')})`,
              filter: 'blur(8px)',
              opacity: 0.4,
              zIndex: -1
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Value badge */}
      {value && (
        <motion.div
          className="mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Badge 
            variant="outline" 
            className="text-xs bg-white/90 text-slate-800 border-slate-200/50 backdrop-blur-sm"
          >
            {value}
          </Badge>
        </motion.div>
      )}

      {/* Time remaining */}
      {timeLeft && (
        <motion.div
          className="mt-1 flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Badge 
            variant="outline" 
            className="text-xs bg-slate-800/90 text-white border-slate-600/50 backdrop-blur-sm"
          >
            <Timer className="w-2.5 h-2.5 mr-1" />
            {timeLeft}
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
}

// Helper function to determine deal type based on model properties
export function getModelDealType(model: any): {
  dealType?: ModelDealBadgeProps['dealType'];
  value?: string;
  timeLeft?: string;
} {
  // Return empty object if model is not provided or invalid
  if (!model || typeof model !== 'object') {
    return {};
  }

  try {
    // Example logic - you can customize this based on your model data
    const currentDate = new Date();
    const modelAge = model?.createdAt ? (currentDate.getTime() - new Date(model.createdAt).getTime()) / (1000 * 60 * 60 * 24) : 0;
    
    // New models (less than 30 days old)
    if (modelAge < 30 && modelAge > 0) {
      return {
        dealType: 'new',
        value: '15% Off Launch Price'
      };
    }
    
    // Popular models (based on some popularity metric)
    if (model?.popularity && model.popularity > 0.8) {
      return {
        dealType: 'popular'
      };
    }
    
    // Neo collection gets special financing
    if (model?.collection === 'neo') {
      return {
        dealType: 'financing',
        value: 'From 5.99% APR'
      };
    }
    
    // Spring special (seasonal)
    const month = currentDate.getMonth();
    if (month >= 2 && month <= 4) { // March-May
      return {
        dealType: 'limited_time',
        value: 'Spring Special',
        timeLeft: '42 days left'
      };
    }
    
    // Quick decision bonus for Skyline
    if (model?.collection === 'skyline') {
      return {
        dealType: 'hot',
        value: '$2,500 Savings',
        timeLeft: '72 hours'
      };
    }
    
    return {};
  } catch (error) {
    // Return empty object if any error occurs
    console.warn('Error in getModelDealType:', error);
    return {};
  }
}