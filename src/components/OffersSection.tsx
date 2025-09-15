import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CouponCard } from './CouponCard';
import { 
  Gift, 
  Percent, 
  Clock, 
  Zap,
  Star,
  Calendar,
  DollarSign,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

interface OffersSectionProps {
  isDark: boolean;
  onOpenChat: (message?: string) => void;
}

export function OffersSection({ isDark, onOpenChat }: OffersSectionProps) {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const offers = [
    {
      id: 'early-bird',
      title: '⏰ Early Bird Special',
      subtitle: 'Limited Time - First 10 Customers',
      discount: '$15,000 OFF',
      originalPrice: '$280,000',
      salePrice: '$265,000',
      savings: '$15,000',
      validUntil: '2024-03-31',
      description: 'Perfect for quick decision makers! Get started on your ADU journey with our biggest discount.',
      features: [
        'Priority scheduling',
        'Free design consultation',
        'Expedited permits',
        'Premium material upgrade'
      ],
      urgency: 'Only 3 spots left!',
      gradient: 'from-orange-500 via-pink-500 to-purple-500',
      icon: Clock,
      chatMessage: '⏰ I\'m interested in the Early Bird Special! Can you tell me more about the $15,000 discount and what\'s included?'
    },
    {
      id: 'summer-promo',
      title: '☀️ Summer Build Bonus',
      subtitle: 'Start Construction This Season',
      discount: '$8,500 OFF',
      originalPrice: '$280,000',
      salePrice: '$271,500',
      savings: '$8,500',
      validUntil: '2024-09-30',
      description: 'Beat the winter rush! Start your ADU construction this summer and enjoy year-round savings.',
      features: [
        'Weather protection guarantee',
        'Summer crew bonus',
        'Free landscaping touch-up',
        'Seasonal material discounts'
      ],
      urgency: 'Summer slots filling fast!',
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      icon: Zap,
      chatMessage: '☀️ I want to learn about the Summer Build Bonus! How does the $8,500 discount work and what are the construction benefits?'
    },
    {
      id: 'referral-reward',
      title: '🤝 Referral Rewards',
      subtitle: 'Refer a Friend Program',
      discount: '$5,000 CREDIT',
      originalPrice: 'Standard Price',
      salePrice: 'Your Price - $5,000',
      savings: '$5,000',
      validUntil: 'Ongoing',
      description: 'Share the ADU love! Both you and your friend get $5,000 when they start their project.',
      features: [
        'No limit on referrals',
        'Instant credit application',
        'Friend gets $2,500 off too',
        'Stack with other offers'
      ],
      urgency: 'Unlimited referrals accepted!',
      gradient: 'from-green-400 via-blue-500 to-purple-500',
      icon: Star,
      chatMessage: '🤝 Tell me about the Referral Rewards program! How does the $5,000 credit work and can I refer multiple friends?'
    }
  ];

  const handleClaimOffer = (offer: any) => {
    const message = offer.chatMessage || `I'm interested in claiming the ${offer.title}. Can you help me with the next steps?`;
    onOpenChat(message);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gift className="w-8 h-8 text-purple-400" />
          </motion.div>
          <motion.h2 
            className={`text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            🎁 Exclusive Offers
          </motion.h2>
        </div>
        
        <motion.p 
          className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'} max-w-2xl mx-auto`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          💰 Limited-time savings designed to make your ADU dreams more affordable
        </motion.p>

        {/* Quick Stats */}
        <motion.div 
          className="flex items-center justify-center gap-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Save up to $15K
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Premium benefits
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Limited availability
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.6,
              type: "spring",
              stiffness: 300 
            }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.2 }
            }}
          >
            <CouponCard
              title={offer.title}
              subtitle={offer.subtitle}
              discount={offer.discount}
              originalPrice={offer.originalPrice}
              salePrice={offer.salePrice}
              savings={offer.savings}
              validUntil={offer.validUntil}
              description={offer.description}
              features={offer.features}
              urgency={offer.urgency}
              gradient={offer.gradient}
              icon={offer.icon}
              isDark={isDark}
              onClaim={() => handleClaimOffer(offer)}
              isSelected={selectedOffer === offer.id}
              onSelect={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Additional Incentives */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card 
          className={`p-8 ${
            isDark 
              ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50' 
              : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200/50'
          } backdrop-blur-xl rounded-3xl`}
          style={{
            boxShadow: isDark 
              ? '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 25px 50px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
          }}
        >
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <motion.div
                className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </motion.div>
              <h3 className={`text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ✨ Additional Benefits
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[
                {
                  icon: DollarSign,
                  title: 'Financing Available',
                  description: 'Up to 80% LTV with competitive rates',
                  color: 'text-green-400'
                },
                {
                  icon: Calendar,
                  title: 'Flexible Timeline',
                  description: 'Start when you\'re ready, no rush',
                  color: 'text-blue-400'
                },
                {
                  icon: MessageCircle,
                  title: 'Expert Support',
                  description: 'Direct access to Daniel, your project manager',
                  color: 'text-purple-400'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`inline-flex p-3 rounded-2xl ${
                    isDark ? 'bg-slate-800/50' : 'bg-white/50'
                  } backdrop-blur-sm`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <h4 className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {benefit.title}
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div 
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Button
                size="lg"
                onClick={() => onOpenChat('🎯 I want to learn more about all available offers and financing options. Can you help me find the best deal?')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)'
                }}
              >
                💬 Discuss All Offers with Daniel
                <MessageCircle className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
