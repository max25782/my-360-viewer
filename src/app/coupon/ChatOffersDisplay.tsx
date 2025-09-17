'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Gift, 
  Users,
  Star, 
  Clock, 
  Shield, 
  CheckCircle2, 
  MessageCircle,
  Zap
} from 'lucide-react';

interface ChatOffersDisplayProps {
  isDark?: boolean;
  onClaimOffer?: (offer: any) => void;
}

export function ChatOffersDisplay({ isDark = true, onClaimOffer }: ChatOffersDisplayProps) {
  const offers = [
    {
      id: 'seattle-zero-outpocket',
      title: '🎟️ EXCLUSIVE SEATTLE COUPON',
      description: 'Zero Out-of-Pocket Deal - We build your ADU and you pay us from rental income. Get a profitable rental property without spending your own money!',
      value: '$15K-$30K',
      originalPrice: 'Off Total Project Cost',
      icon: Gift,
      color: 'emerald',
      badge: 'Exclusive Deal',
      features: [
        'Complete design & construction',
        'Permit handling included',
        'Tenant finding service',
        'Self-funding program qualification'
      ],
      terms: 'Only 10 Seattle projects qualify. Must qualify for self-funding program',
      expiryDate: 'December 31, 2025'
    },
    {
      id: 'appliances-voucher',
      title: 'FREE Appliances Package',
      description: '$5,000 Home Depot + $5,000 Lowe\'s vouchers for complete appliance upgrade with your ADU project',
      value: '$10,000',
      originalPrice: 'Value',
      icon: Gift,
      color: 'blue',
      badge: 'Premium Package',
      features: [
        '$5,000 Home Depot voucher',
        '$5,000 Lowe\'s voucher',
        'Complete kitchen appliances',
        'Washer & dryer included'
      ],
      terms: 'Valid for ADU projects over $150K. Vouchers issued upon project completion',
      expiryDate: 'December 31, 2025'
    },
    {
      id: 'referral-bonus',
      title: 'Neighbor Referral Bonus',
      description: 'Refer your neighbor and receive $5,000 cash back while your neighbor gets $2,500 project discount',
      value: '$7,500',
      originalPrice: 'N/A',
      icon: Users,
      color: 'purple',
      badge: 'Double Rewards',
      features: [
        '$5,000 cash back for you',
        '$2,500 project discount for your neighbor',
        'Stackable with other offers',
        'No limit on referrals'
      ],
      terms: 'Both projects must be contracted within 30 days and completed within 12 months',
      expiryDate: 'December 31, 2025'
    }
  ];

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
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
          }}
        >
          <Gift className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            🎁 Exclusive Seattle ADU Offers
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-400/40 px-2 py-0.5 text-xs"
              style={{ borderRadius: '8px' }}
            >
              <Zap className="w-2.5 h-2.5 mr-1" />
              Limited Time
            </Badge>
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              • {offers.length} offers available
            </span>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer, index) => {
          const colors = getColorClasses(offer.color);
          const IconComponent = offer.icon;

          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1
              }}
              whileHover={{ y: -4 }}
            >
              <Card 
                className={`relative overflow-hidden border transition-all duration-300 hover:shadow-xl h-full flex flex-col ${
                  isDark 
                    ? 'bg-slate-800/60 border-slate-700/50 hover:border-emerald-400/50' 
                    : 'bg-white/80 border-slate-200/50 hover:border-emerald-400/50'
                }`}
                style={{ 
                  backdropFilter: 'blur(20px)',
                  borderRadius: '18px',
                  minHeight: '400px'
                }}
              >
                {/* Premium indicator for exclusive offers */}
                {index === 0 && (
                  <div className="absolute top-0 left-0 right-0">
                    <div 
                      className="h-0.5 rounded-t-2xl"
                      style={{ background: colors.gradient }}
                    />
                    <div className="absolute top-2 right-3">
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/40 text-xs px-2 py-0.5">
                        <Star className="w-2.5 h-2.5 mr-1" />
                        EXCLUSIVE
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Header Section */}
                <div className={`p-4 pb-3 ${index === 0 ? 'pt-6' : ''}`}>
                  {/* Badge Section */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col gap-1.5">
                      {offer.badge && (
                        <Badge 
                          className={`${colors.badge} backdrop-blur-sm text-xs px-2.5 py-1 font-medium`}
                          style={{ borderRadius: '10px' }}
                        >
                          <Shield className="w-2.5 h-2.5 mr-1" />
                          {offer.badge}
                        </Badge>
                      )}
                      {index === 0 && (
                        <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-400/40 text-xs px-2.5 py-1">
                          🏆 Most Popular
                        </Badge>
                      )}
                    </div>
                    {offer.expiryDate !== 'Ongoing' && offer.expiryDate !== 'December 31, 2025' && (
                      <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg ${
                        isDark ? 'text-red-300 bg-red-500/10' : 'text-red-600 bg-red-50'
                      }`}>
                        <Clock className="w-2.5 h-2.5" />
                        <span>Until {offer.expiryDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Icon and Title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: colors.gradient,
                          boxShadow: `0 6px 20px ${colors.glow}`
                        }}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      {/* Pulsing ring for exclusive offer */}
                      {index === 0 && (
                        <div 
                          className="absolute inset-0 rounded-xl animate-ping"
                          style={{
                            background: colors.gradient,
                            opacity: 0.3
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`text-base font-semibold leading-tight mb-2 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}>
                        {offer.title}
                      </h4>
                      
                      {/* Value Display */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span 
                            className="text-xl font-bold"
                            style={{ color: colors.border }}
                          >
                            {offer.value}
                          </span>
                          {offer.originalPrice !== 'N/A' && (
                            <span className={`text-xs line-through opacity-60 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {offer.originalPrice}
                            </span>
                          )}
                        </div>
                        {index === 0 && (
                          <Badge className="bg-green-500/20 text-green-300 text-xs px-1.5 py-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {offer.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="px-4 pb-3">
                  <h5 className={`text-xs font-medium mb-2 ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    What's Included:
                  </h5>
                  <div className="space-y-1.5">
                    {offer.features.slice(0, 3).map((feature, featIndex) => (
                      <div key={featIndex} className="flex items-start gap-2">
                        <CheckCircle2 
                          className="w-3 h-3 mt-0.5 flex-shrink-0"
                          style={{ color: colors.border }}
                        />
                        <span className={`text-xs leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                    {offer.features.length > 3 && (
                      <p className={`text-xs italic ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        +{offer.features.length - 3} more benefits...
                      </p>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className={`px-4 py-2 border-t mt-auto ${
                  isDark ? 'border-slate-700/50' : 'border-slate-200/50'
                }`}>
                  <p className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    *{offer.terms}
                  </p>
                </div>

                {/* Action Section */}
                <div className="p-4 pt-2 relative z-20">
                  <Button
                    onClick={() => {
                      if (onClaimOffer) {
                        const couponCode = `ADU${offer.id.toUpperCase().replace(/-/g, '')}${new Date().getFullYear()}`;
                        
                        // Send the offer data object instead of a text message
                        onClaimOffer({
                          offer: offer,
                          couponCode: couponCode
                        });
                      }
                    }}
                    size="sm"
                    className="w-full text-white transition-all duration-300 hover:scale-105 pointer-events-auto cursor-pointer z-10"
                    style={{
                      background: colors.gradient,
                      border: `1px solid ${colors.border}`,
                      boxShadow: `0 4px 15px ${colors.glow}`,
                      borderRadius: '12px',
                      fontSize: '13px',
                      padding: '8px 16px'
                    }}
                  >
                    <MessageCircle className="w-3 h-3 mr-1.5" />
                    Claim Offer
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Note */}
      <div className={`text-center text-xs mt-4 p-3 rounded-xl ${
        isDark ? 'bg-slate-800/30 text-slate-400' : 'bg-slate-50/50 text-slate-500'
      }`}>
        💬 Click \"Claim Offer\" to generate your exclusive coupon • Response within 2 hours
      </div>
    </div>
  );
}