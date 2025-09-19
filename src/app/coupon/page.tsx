"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ModelDealBadge } from './ModelDealBadge';
import { MarketingIncentives } from './MarketingIncentives';
import { 
  Gift, 
  FileText, 
  DollarSign, 
  Clock, 
  Star, 
  MessageCircle,
  Building2,
  Percent,
  Users,
  Calendar,
  Shield,
  CheckCircle2,
  Phone,
  Mail,
  Zap
} from 'lucide-react';

interface OffersSectionProps {
  isDark: boolean;
  onContactProjectManager: (message?: string | any) => void;
}

function OffersSection({ isDark, onContactProjectManager }: OffersSectionProps) {
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
      expiryDate: 'December 2025'
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
      expiryDate: 'Ongoing'
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
    <div className="space-y-8">
      {/* Enhanced Header with Project Manager Highlight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        {/* Main Title */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Exclusive Seattle ADU Offers
            </h1>
          </div>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Limited-time incentives designed to make your ADU project more affordable and profitable
          </p>
        </div>

        {/* Project Manager Spotlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`relative max-w-md mx-auto p-6 rounded-2xl border ${
            isDark 
              ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/40' 
              : 'bg-gradient-to-br from-white/80 to-slate-50/80 border-slate-200/40'
          }`}
          style={{
            backdropFilter: 'blur(24px)',
            boxShadow: isDark 
              ? '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 12px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          }}
        >
          {/* Floating status indicator */}
          <div className="absolute -top-2 -right-2">
            <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full" />
              LIVE
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
                  boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)'
                }}
              >
                D
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
            </div>
            
            {/* Info */}
            <div className="flex-1 text-left">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                DANIEL RODRIGUEZ
              </h3>
              <p className={`text-sm ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>
                Senior Project Manager
              </p>
              <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Available to help with all offers
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔥 Header chat button clicked!');
                  console.log('🔥 onContactProjectManager type:', typeof onContactProjectManager);
                  const generalMessage = "Hi Daniel! I'm interested in learning more about the exclusive offers available. Can you help me find the best deal for my ADU project?";
                  
                  if (onContactProjectManager) {
                    onContactProjectManager(generalMessage);
                    console.log('✅ Header message sent!');
                  } else {
                    console.error('❌ onContactProjectManager not available');
                    alert('Contact function not available. Please refresh the page.');
                  }
                }}
                className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Offers Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-6"
      >
        {/* Grid Header */}
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Available Offers ({offers.length})
          </h2>
          <Badge 
            className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-400/40 px-3 py-1"
            style={{ borderRadius: '12px' }}
          >
            <Zap className="w-3 h-3 mr-1" />
            Limited Time
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" style={{ alignItems: 'stretch' }}>
          {offers.map((offer, index) => {
            const colors = getColorClasses(offer.color);
            const IconComponent = offer.icon;

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative group"
              >
              {/* Enhanced offer card */}
              <Card 
                className={`relative overflow-hidden border transition-all duration-500 hover:shadow-2xl h-full flex flex-col ${
                  isDark 
                    ? 'bg-slate-800/70 border-slate-700/50 hover:border-emerald-400/70' 
                    : 'bg-white/80 border-slate-200/50 hover:border-emerald-400/70'
                }`}
                style={{ 
                  backdropFilter: 'blur(32px)',
                  borderRadius: '24px',
                  boxShadow: isDark 
                    ? '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 12px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  minHeight: '600px'
                }}
              >
                  {/* Deal badge overlay */}
                  <ModelDealBadge 
                    dealType={index === 0 ? 'exclusive' : index === 1 ? 'new' : 'popular'}
                    value={offer.value}
                    className="pointer-events-none"
                  />
                {/* Premium indicator for exclusive offers */}
                {index === 0 && (
                  <div className="absolute top-0 left-0 right-0">
                    <div 
                      className="h-1 rounded-t-3xl"
                      style={{ background: colors.gradient }}
                    />
                    <div className="absolute top-2 right-4">
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/40 text-xs px-2 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        EXCLUSIVE
                      </Badge>
                    </div>
                  </div>
                )}
                {/* Enhanced Header Section */}
                <div className={`p-6 pb-4 ${index === 0 ? 'pt-8' : ''}`}>
                  {/* Enhanced Badge Section */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                      {offer.badge && (
                        <Badge 
                          className={`${colors.badge} backdrop-blur-sm text-xs px-3 py-1.5 font-medium`}
                          style={{ borderRadius: '12px' }}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {offer.badge}
                        </Badge>
                      )}
                      {index === 0 && (
                        <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-400/40 text-xs px-3 py-1">
                          🏆 Most Popular
                        </Badge>
                      )}
                    </div>
                    {offer.expiryDate !== 'Ongoing' && (
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                        isDark ? 'text-red-300 bg-red-500/10' : 'text-red-600 bg-red-50'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>Until {offer.expiryDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: colors.gradient,
                          boxShadow: `0 8px 30px ${colors.glow}`
                        }}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      {/* Pulsing ring for exclusive offer */}
                      {index === 0 && (
                        <div 
                          className="absolute inset-0 rounded-2xl animate-ping"
                          style={{
                            background: colors.gradient,
                            opacity: 0.3
                          }}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold leading-tight mb-2 ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}>
                        {offer.title}
                      </h3>
                      
                      {/* Enhanced Value Display */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-baseline gap-2">
                          <span 
                            className="text-2xl font-bold"
                            style={{ color: colors.border }}
                          >
                            {offer.value}
                          </span>
                          {offer.originalPrice !== 'N/A' && (
                            <span className={`text-sm line-through opacity-60 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {offer.originalPrice}
                            </span>
                          )}
                        </div>
                        {index === 0 && (
                          <Badge className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Description */}
                  <p className={`text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {offer.description}
                  </p>
                </div>

                {/* Enhanced Features List */}
                <div className="px-6 pb-4">
                  <h4 className={`text-sm font-medium mb-3 ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    What's Included:
                  </h4>
                  <div className="space-y-2.5">
                    {offer.features.map((feature, featIndex) => (
                      <motion.div 
                        key={featIndex} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: featIndex * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: colors.border }}
                        />
                        <span className={`text-xs leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className={`px-6 py-3 border-t mt-auto ${
                  isDark ? 'border-slate-700/50' : 'border-slate-200/50'
                }`}>
                  <p className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    *{offer.terms}
                  </p>
                </div>

                {/* Enhanced Action Section */}
                <div className="p-6 pt-0 space-y-3 relative z-20">
                  {/* Primary CTA */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🔥 CLAIM BUTTON CLICKED FOR:', offer.title);
                      console.log('🔥 onContactProjectManager function:', typeof onContactProjectManager);
                      
                      if (!onContactProjectManager) {
                        console.error('❌ onContactProjectManager function is not defined!');
                        alert('Error: Contact function not available. Please refresh the page.');
                        return;
                      }
                      
                      // Create offer data object for coupon generation
                      const couponCode = `ADU${offer.id.toUpperCase().replace(/-/g, '')}${new Date().getFullYear()}`;
                      const offerData = {
                        offer: offer,
                        couponCode: couponCode
                      };

                      console.log('🔥 SENDING OFFER DATA:', offerData);
                      
                      try {
                        onContactProjectManager(offerData);
                        console.log('✅ Offer data sent successfully!');
                      } catch (error) {
                        console.error('❌ Error sending offer data:', error);
                        alert('Error sending offer data. Please try again.');
                      }
                    }}
                    className="w-full text-white transition-all duration-300 hover:scale-105 relative group pointer-events-auto cursor-pointer z-10"
                    style={{
                      background: colors.gradient,
                      border: `1px solid ${colors.border}`,
                      boxShadow: `0 6px 25px ${colors.glow}`,
                      borderRadius: '16px',
                      padding: '12px 24px',
                      position: 'relative',
                      zIndex: 999,
                      pointerEvents: 'auto'
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">Claim with Daniel</span>
                    </div>
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />
                  </button>

                  {/* Secondary info */}
                  <div className={`text-center text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Response within 2 hours • Free consultation
                  </div>
                </div>

                {/* Enhanced Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 pointer-events-none rounded-3xl" />
                
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`
                  }}
                />
              </Card>
            </motion.div>
          );
        })}
        </div>
      </motion.div>

      {/* Enhanced Bottom Section with Daniel's Guarantee */}
      {/* Marketing incentives block */}
      <MarketingIncentives 
        isDark={isDark} 
        onContactProjectManager={() => {
          // Reuse header CTA handler
          const generalMessage = "Hi Daniel! I'd like to discuss current incentives and how to claim them.";
          onContactProjectManager(generalMessage);
        }}
      />

      {/* Enhanced Bottom Section with Daniel's Guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="space-y-6"
      >
        {/* Guarantee Section */}
        <div 
          className={`relative p-8 rounded-3xl border ${
            isDark 
              ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/40' 
              : 'bg-gradient-to-br from-white/80 to-slate-50/80 border-slate-200/40'
          }`}
          style={{ 
            backdropFilter: 'blur(32px)',
            boxShadow: isDark 
              ? '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 20px 60px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full rounded-3xl"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, #06b6d4 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, #10b981 0%, transparent 50%)
                `,
              }}
            />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
                    boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)'
                  }}
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Daniel's Personal Guarantee
                </h3>
              </div>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                As your dedicated project manager, I personally ensure every offer delivers exactly what's promised
              </p>
            </div>

            {/* Guarantee Points */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: CheckCircle2,
                  title: "Price Match Promise",
                  description: "If you find a better deal elsewhere, we'll match it plus give you an extra $500"
                },
                {
                  icon: Clock,
                  title: "2-Hour Response",
                  description: "Personal response within 2 hours during business hours, guaranteed"
                },
                {
                  icon: Phone,
                  title: "Direct Access",
                  description: "My personal phone number for any questions or concerns throughout your project"
                }
              ].map((guarantee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div 
                    className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                      isDark ? 'bg-slate-700/50' : 'bg-white/50'
                    }`}
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <guarantee.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {guarantee.title}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {guarantee.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔥 Bottom chat button clicked!');
                  const guaranteeMessage = "Hi Daniel! I'm impressed by your personal guarantee on these offers. I'd like to discuss how your 2-hour response promise and price match guarantee work. Can we start a conversation about my ADU project?";
                  
                  if (onContactProjectManager) {
                    onContactProjectManager(guaranteeMessage);
                    console.log('✅ Bottom message sent!');
                  } else {
                    console.error('❌ onContactProjectManager not available');
                    alert('Contact function not available. Please refresh the page.');
                  }
                }}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 transition-all duration-300 hover:scale-105"
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(6, 182, 212, 0.4)',
                  padding: '12px 32px'
                }}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chat with Daniel
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className={`${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50' 
                    : 'bg-white/50 border-slate-300/50 text-slate-700 hover:bg-white/80'
                } backdrop-blur-lg transition-all duration-300`}
                style={{ borderRadius: '16px', padding: '12px 32px' }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Schedule Call
              </Button>
            </div>

            {/* Contact Info */}
            <div className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Direct: (206) 555-0123 • Email: daniel@seattle-adu.com • Available Mon-Sat 8AM-6PM
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="p-8">
      <OffersSection 
        isDark={true} 
        onContactProjectManager={(message?: string | any) => {
          console.log('Contact Project Manager:', message);
        }}
      />
    </div>
  );
}