'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { 
  Gift, 
  Users, 
  Star, 
  Clock, 
  Shield, 
  CheckCircle2, 
  Scissors,
  Zap,
  Calendar,
  DollarSign,
  Phone
} from 'lucide-react';

interface CouponCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    value: string;
    originalPrice: string;
    color: string;
    badge: string;
    features: string[];
    terms: string;
    expiryDate: string;
  };
  couponCode: string;
  isDark?: boolean;
  onContactDaniel?: (data: any) => void;
}

export function CouponCard({ offer, couponCode, isDark = true, onContactDaniel }: CouponCardProps) {
  if (!offer) {
    return null;
  }
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          border: '#10b981',
          glow: 'rgba(16, 185, 129, 0.4)',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
        };
      case 'blue':
        return {
          gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          border: '#3b82f6',
          glow: 'rgba(59, 130, 246, 0.4)',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-400/40'
        };
      case 'purple':
        return {
          gradient: 'linear-gradient(135deg, #7c2d12 0%, #a855f7 100%)',
          border: '#a855f7',
          glow: 'rgba(168, 85, 247, 0.4)',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-400/40'
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
          border: '#6b7280',
          glow: 'rgba(107, 114, 128, 0.4)',
          badge: 'bg-gray-500/20 text-gray-300 border-gray-400/40'
        };
    };
  };

  const colors = getColorClasses(offer.color || 'emerald');
  const IconComponent = offer.id === 'referral-bonus' ? Users : Gift;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        duration: 0.6, 
        type: "spring",
        stiffness: 100
      }}
      className="max-w-md mx-auto"
    >
      {/* Coupon Container */}
      <div
        className={`relative overflow-hidden border-2 transition-all duration-500 ${ 
          isDark 
            ? 'bg-slate-800/90 border-slate-700/60' 
            : 'bg-white/90 border-slate-300/60'
        }`}
        style={{ 
          backdropFilter: 'blur(32px)',
          borderRadius: '24px',
          boxShadow: isDark 
            ? `0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px ${colors.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.1)` 
            : `0 25px 50px rgba(0, 0, 0, 0.15), 0 0 30px ${colors.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
          border: `2px solid ${colors.border}`
        }}
      >
        {/* Coupon Header with Scissors */}
        <div className="relative">
          {/* Top Border with Perforations */}
          <div 
            className="h-2 relative"
            style={{ background: colors.gradient }}
          >
            {/* Perforated edge simulation */}
            <div className="absolute top-0 left-0 right-0 flex justify-between">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full -mt-1.5 ${
                    isDark ? 'bg-slate-800' : 'bg-white'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Exclusive Badge */}
          <div className="absolute -top-1 right-4">
            <Badge 
              className="bg-yellow-500/90 text-yellow-900 border-yellow-600/60 text-xs px-3 py-1.5 backdrop-blur-sm"
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(234, 179, 8, 0.4)'
              }}
            >
              <Star className="w-3 h-3 mr-1.5" />
              EXCLUSIVE COUPON
            </Badge>
          </div>

          {/* Scissors Icon */}
          <div className="absolute -top-3 left-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: colors.gradient,
                boxShadow: `0 4px 15px ${colors.glow}`
              }}
            >
              <Scissors className="w-4 h-4 text-white rotate-45" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 pt-6 space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: colors.gradient,
                  boxShadow: `0 8px 25px ${colors.glow}`
                }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {offer.title}
                </h2>
                <Badge 
                  className={`${colors.badge} text-xs px-2 py-1 mt-1`}
                  style={{ borderRadius: '8px' }}
                >
                  <Shield className="w-2.5 h-2.5 mr-1" />
                  {offer.badge}
                </Badge>
              </div>
            </div>
          </div>

          {/* Value Display */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign 
                className="w-6 h-6"
                style={{ color: colors.border }}
              />
              <span 
                className="text-3xl font-bold"
                style={{ color: colors.border }}
              >
                {offer.value}
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {offer.originalPrice !== 'N/A' ? offer.originalPrice : 'Total Value'}
            </p>
          </div>

          {/* Description */}
          <p className={`text-sm leading-relaxed text-center ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {offer.description}
          </p>

          {/* Features */}
          <div className="space-y-3">
            <h4 className={`text-sm font-medium ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}>
              ✅ What's Included:
            </h4>
            <div className="space-y-2">
              {(offer.features || []).map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: colors.border }}
                  />
                  <span className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coupon Code Section */}
        <div 
          className="relative p-6 border-t-2 border-dashed"
          style={{ borderColor: colors.border }}
        >
          {/* Side circles for coupon effect */}
          <div 
            className={`absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full ${
              isDark ? 'bg-slate-900' : 'bg-slate-100'
            }`}
          />
          <div 
            className={`absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full ${
              isDark ? 'bg-slate-900' : 'bg-slate-100'
            }`}
          />

          <div className="text-center space-y-4">
            {/* Coupon Code */}
            <div>
              <p className={`text-xs uppercase tracking-wide mb-2 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                🎫 COUPON CODE
              </p>
              <div 
                className={`inline-block px-6 py-3 rounded-xl border-2 border-dashed ${
                  isDark ? 'bg-slate-700/50' : 'bg-slate-50/50'
                }`}
                style={{ borderColor: colors.border }}
              >
                <code 
                  className={`text-lg font-mono font-bold tracking-wider ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                  style={{ color: colors.border }}
                >
                  {couponCode}
                </code>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span className={`text-xs ${
                isDark ? 'text-orange-300' : 'text-orange-600'
              }`}>
                Valid until: {offer.expiryDate}
              </span>
            </div>

            {/* Terms */}
            <p className={`text-xs leading-relaxed ${
              isDark ? 'text-slate-500' : 'text-slate-500'
            }`}>
              *{offer.terms}
            </p>

            {/* Call to Action */}
            <motion.button
              onClick={() => {
                if (onContactDaniel) {
                  // Send the full coupon data, not just a message
                  const couponData = {
                    offer: offer,
                    couponCode: couponCode,
                    contactMessage: `🎯 **COUPON ACTIVATION REQUEST**

Hi Daniel! I have my exclusive "${offer.title}" coupon (Code: ${couponCode}) and I'm ready to move forward!

**💰 Coupon Value:** ${offer.value}
**🎫 Coupon Code:** ${couponCode}

I'd like to:
📞 Schedule a priority consultation call
📋 Get my project assessment started
💼 Discuss implementation timeline

**What's the best phone number to reach me at, and when would be the most convenient time for a detailed consultation call?**

*This is a hot lead - I'm ready to proceed with my ADU project!*`
                  };

                  onContactDaniel(couponData);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                isDark 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border-cyan-400/40 hover:border-cyan-300' 
                  : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border-cyan-500/40 hover:border-cyan-600'
              }`}
              style={{
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)'
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <Phone className="w-5 h-5 text-cyan-400 animate-pulse" />
                <div className="text-center">
                  <p className={`font-bold ${
                    isDark ? 'text-cyan-300' : 'text-cyan-600'
                  }`}>
                    ACTIVATE COUPON → Schedule Call with Daniel
                  </p>
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Click to discuss your project and claim this offer
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Animated glow effect */}
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-500 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`
          }}
        />

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-3xl" />
      </div>

      {/* Bottom Note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-center text-xs mt-4 p-3 rounded-xl ${
          isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50/70 text-slate-600'
        }`}
        style={{ backdropFilter: 'blur(12px)' }}
      >
        💎 This coupon has been generated specifically for you • Response within 2 hours
      </motion.div>
    </motion.div>
  );
}