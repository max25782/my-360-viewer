import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Gift, 
  Clock, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  AlertCircle,
  MessageCircle
} from 'lucide-react';

interface CouponCardProps {
  title: string;
  subtitle: string;
  discount: string;
  originalPrice: string;
  salePrice: string;
  savings: string;
  validUntil: string;
  description: string;
  features: string[];
  urgency: string;
  gradient: string;
  icon: React.ComponentType<any>;
  isDark: boolean;
  onClaim: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function CouponCard({
  title,
  subtitle,
  discount,
  originalPrice,
  salePrice,
  savings,
  validUntil,
  description,
  features,
  urgency,
  gradient,
  icon: Icon,
  isDark,
  onClaim,
  isSelected = false,
  onSelect
}: CouponCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`relative overflow-hidden transition-all duration-500 cursor-pointer ${
          isSelected
            ? `ring-2 ring-purple-400 shadow-2xl ${
                isDark ? 'bg-slate-800/95' : 'bg-white/95'
              }`
            : isDark 
              ? 'bg-slate-900/90 border-slate-700/50 hover:border-slate-600/70' 
              : 'bg-white/90 border-slate-200/50 hover:border-slate-300/70'
        } backdrop-blur-xl rounded-3xl`}
        style={{
          boxShadow: isSelected || isHovered
            ? (isDark 
                ? '0 25px 50px rgba(147, 51, 234, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 25px 50px rgba(147, 51, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)')
            : (isDark 
                ? '0 10px 30px rgba(0, 0, 0, 0.3)'
                : '0 10px 30px rgba(0, 0, 0, 0.1)')
        }}
        onClick={onSelect}
      >
        {/* Gradient Background Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 transition-opacity duration-500`}
          style={{ opacity: isHovered || isSelected ? 0.15 : 0.08 }}
        />

        {/* Animated Border Effect */}
        <motion.div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-20`}
          initial={{ rotate: 0 }}
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 2, ease: "linear", repeat: isHovered ? Infinity : 0 }}
          style={{
            padding: '2px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor'
          }}
        />

        <div className="relative p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 rounded-2xl bg-gradient-to-r ${gradient} shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Discount Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Badge
                className={`bg-gradient-to-r ${gradient} text-white border-0 px-4 py-2 text-lg shadow-lg`}
                style={{
                  boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)'
                }}
              >
                {discount}
              </Badge>
            </motion.div>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`text-sm line-through ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {originalPrice}
              </span>
              <span className={`text-2xl ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {salePrice}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                You save {savings}!
              </span>
            </div>
          </div>

          {/* Urgency Banner */}
          <motion.div
            className={`flex items-center gap-2 p-3 rounded-xl ${
              isDark 
                ? 'bg-orange-500/10 border border-orange-400/20' 
                : 'bg-orange-50/80 border border-orange-200/50'
            } backdrop-blur-sm`}
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
              {urgency}
            </span>
          </motion.div>

          {/* Description */}
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {description}
          </p>

          {/* Expandable Features */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <h4 className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  What's included:
                </h4>
                <div className="grid gap-2">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {/* Expand Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={`${
                isDark 
                  ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50' 
                  : 'text-slate-600 hover:text-slate-700 hover:bg-slate-100/50'
              } transition-all duration-200`}
            >
              {isExpanded ? (
                <>
                  Less Details <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  More Details <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>

            {/* Claim Button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClaim();
              }}
              className={`bg-gradient-to-r ${gradient} hover:opacity-90 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2`}
              style={{
                boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)'
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Claim with Daniel
            </Button>
          </div>

          {/* Valid Until */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-200/20">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Valid until {validUntil}
            </span>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60"
          animate={{
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-40"
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </Card>
    </motion.div>
  );
}
