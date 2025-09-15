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
      title: 'נ… Early Bird Special',
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
      chatMessage: 'נ… I\'m interested in the Early Bird Special! Can you tell me more about the $15,000 discount and what\'s included?'
    },
    {
      id: 'summer-promo',
      title: 'ג˜€ן¸ Summer Build Bonus',
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
      chatMessage: 'ג˜€ן¸ I want to learn about the Summer Build Bonus! How does the $8,500 discount work and what are the construction benefits?'
    },
    {
      id: 'referral-reward',
      title: 'נ₪ Referral Rewards',
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
      chatMessage: 'נ₪ Tell me about the Referral Rewards program! How does the $5,000 credit work and can I refer multiple friends?'
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
            נ Exclusive Offers
          </motion.h2>
        </div>
        
        <motion.p 
          className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'} max-w-2xl mx-auto`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          נ€ Limited-time savings designed to make your ADU dreams more affordable
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
                נ’ Additional Benefits
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
                onClick={() => onOpenChat('נ’ I want to learn more about all available offers and financing options. Can you help me find the best deal?')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)'
                }}
              >
                נ’¬ Discuss All Offers with Daniel
                <MessageCircle className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
```



2. CouponCard.tsx - ׳›׳¨בƒ¢׳™׳¡׳™ ׳”׳§׳•׳₪׳•׳ ׳™׳


```tsx
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
```



3. PromotionsHub.tsx - ׳׳¨׳›׳– ׳”׳§׳™׳“׳•׳׳™׳


```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Gift,
  Percent,
  Clock,
  Star,
  Zap,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Target,
  MessageCircle,
  Sparkles,
  Crown,
  Flame
} from 'lucide-react';



interface PromotionsHubProps {
  isDark: boolean;
  onOpenChat: (message?: string) => void;
}



export function PromotionsHub({ isDark, onOpenChat }: PromotionsHubProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'seasonal' | 'loyalty'>('current');



  const currentPromotions = [
    {
      id: 'flash-sale',
      title: 'ג¡ Flash Sale Weekend',
      subtitle: '48 Hours Only',
      discount: '20% OFF',
      value: '$12,000 Savings',
      expires: '2024-01-21T23:59:59',
      description: 'Lightning-fast savings on all ADU models',
      tier: 'Premium',
      color: 'from-yellow-400 to-orange-500',
      icon: Flame,
      urgency: 'HIGH'
    },
    {
      id: 'winter-special',
      title: 'ג„ן¸ Winter Comfort Package',
      subtitle: 'Free Heating Upgrade',
      discount: 'FREE',
      value: '$4,500 Value',
      expires: '2024-03-01T23:59:59',
      description: 'Premium heating system included at no extra cost',
      tier: 'Standard',
      color: 'from-blue-400 to-cyan-500',
      icon: Star,
      urgency: 'MEDIUM'
    }
  ];



  const seasonalPromotions = [
    {
      id: 'spring-launch',
      title: 'נ¸ Spring Launch Special',
      subtitle: 'New Season, New Home',
      discount: '15% OFF',
      value: '$9,500 Savings',
      expires: '2024-05-31T23:59:59',
      description: 'Perfect timing for spring construction start',
      tier: 'Premium',
      color: 'from-green-400 to-emerald-500',
      icon: Target,
      urgency: 'MEDIUM'
    },
    {
      id: 'summer-build',
      title: 'ג˜€ן¸ Summer Build Bonus',
      subtitle: 'Beat the Rush',
      discount: '$8,000',
      value: 'Cash Back',
      expires: '2024-08-31T23:59:59',
      description: 'Early summer construction incentive',
      tier: 'Standard',
      color: 'from-orange-400 to-red-500',
      icon: TrendingUp,
      urgency: 'LOW'
    }
  ];



  const loyaltyRewards = [
    {
      id: 'vip-program',
      title: 'נ‘‘ VIP Member Benefits',
      subtitle: 'Exclusive Access',
      discount: 'UP TO 25%',
      value: 'Lifetime Savings',
      expires: 'Ongoing',
      description: 'Premium member exclusive benefits and pricing',
      tier: 'VIP',
      color: 'from-purple-400 to-pink-500',
      icon: Crown,
      urgency: 'EXCLUSIVE'
    },
    {
      id: 'referral-bonus',
      title: 'נ₪ Referral Rewards',
      subtitle: 'Share & Earn',
      discount: '$5,000',
      value: 'Per Referral',
      expires: 'Unlimited',
      description: 'Earn rewards for every successful referral',
      tier: 'Open',
      color: 'from-cyan-400 to-blue-500',
      icon: Award,
      urgency: 'ONGOING'
    }
  ];



  const getPromotions = () => {
    switch (activeTab) {
      case 'current': return currentPromotions;
      case 'seasonal': return seasonalPromotions;
      case 'loyalty': return loyaltyRewards;
      default: return currentPromotions;
    }
  };



  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'LOW': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'EXCLUSIVE': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      case 'ONGOING': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };



  const formatTimeLeft = (expiryDate: string) => {
    if (expiryDate === 'Ongoing' || expiryDate === 'Unlimited') return expiryDate;
    
    const now = new Date().getTime();
    const expiry = new Date(expiryDate).getTime();
    const difference = expiry - now;
    
    if (difference < 0) return 'Expired';
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
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
            <Percent className="w-8 h-8 text-purple-400" />
          </motion.div>
          <motion.h2 
            className={`text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            נ‰ Promotions Hub
          </motion.h2>
        </div>
        
        <motion.p 
          className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'} max-w-2xl mx-auto`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          נ”¥ Discover amazing deals and exclusive offers designed just for you
        </motion.p>
      </motion.div>



      {/* Tab Navigation */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className={`inline-flex p-1 rounded-2xl ${
          isDark ? 'bg-slate-800/50' : 'bg-white/50'
        } backdrop-blur-sm border ${
          isDark ? 'border-slate-700/30' : 'border-slate-200/30'
        }`}>
          {[
            { id: 'current', label: 'Current Deals', icon: Flame },
            { id: 'seasonal', label: 'Seasonal', icon: Calendar },
            { id: 'loyalty', label: 'Loyalty', icon: Crown }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </motion.div>



      {/* Promotions Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {getPromotions().map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.5,
                type: "spring",
                stiffness: 300 
              }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card 
                className={`p-6 h-full ${
                  isDark 
                    ? 'bg-slate-900/90 border-slate-700/50' 
                    : 'bg-white/90 border-slate-200/50'
                } backdrop-blur-xl rounded-3xl relative overflow-hidden group cursor-pointer`}
                style={{
                  boxShadow: isDark 
                    ? '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 20px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {/* Background Gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-10 group-hover:opacity-15 transition-opacity duration-500`}
                />



                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={`p-3 rounded-2xl bg-gradient-to-r ${promo.color} shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <promo.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className={`text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {promo.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {promo.subtitle}
                        </p>
                      </div>
                    </div>



                    {/* Urgency Badge */}
                    <Badge
                      variant="outline"
                      className={`${getUrgencyColor(promo.urgency)} backdrop-blur-sm text-xs px-2 py-1`}
                    >
                      {promo.urgency}
                    </Badge>
                  </div>



                  {/* Discount & Value */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl bg-gradient-to-r ${promo.color} bg-clip-text text-transparent`}>
                        {promo.discount}
                      </span>
                      <div className="text-right">
                        <div className={`text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          {promo.value}
                        </div>
                      </div>
                    </div>
                  </div>



                  {/* Description */}
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                    {promo.description}
                  </p>



                  {/* Time Left */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {formatTimeLeft(promo.expires)}
                      </span>
                    </div>



                    <Badge
                      variant="outline"
                      className={`${
                        promo.tier === 'VIP' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-400/30'
                          : promo.tier === 'Premium'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-400/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-400/30'
                      } backdrop-blur-sm`}
                    >
                      {promo.tier}
                    </Badge>
                  </div>



                  {/* Action Button */}
                  <Button
                    onClick={() => onOpenChat(`נ‰ I'm interested in the ${promo.title}! Can you tell me more about this promotion and how to claim it?`)}
                    className={`w-full bg-gradient-to-r ${promo.color} hover:opacity-90 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Claim with Daniel
                  </Button>
                </div>



                {/* Floating Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full"
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
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>



      {/* Bottom CTA */}
      <motion.div
        className="text-center pt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Card 
          className={`p-8 ${
            isDark 
              ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50' 
              : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200/50'
          } backdrop-blur-xl rounded-3xl`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h3 className={`text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                נ’ Need a Custom Deal?
              </h3>
            </div>
            
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} max-w-md mx-auto`}>
              Don't see what you're looking for? Let Daniel create a personalized offer just for you.
            </p>



            <Button
              size="lg"
              onClick={() => onOpenChat('נ’ I\'d like to discuss custom promotional options for my ADU project. Can you help me find the best deal based on my specific needs?')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Get Custom Offer
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
```



4. MarketingIncentives.tsx - ׳×׳׳¨׳™׳¦׳™ ׳©׳™׳•׳•׳§


```tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DollarSign,
  Gift,
  Calendar,
  TrendingUp,
  Award,
  Users,
  Home,
  MessageCircle,
  Clock,
  CheckCircle,
  Star,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';



interface MarketingIncentivesProps {
  isDark: boolean;
  onOpenChat: (message?: string) => void;
}



interface Incentive {
  id: string;
  category: 'financial' | 'service' | 'bonus';
  title: string;
  subtitle: string;
  description: string;
  value: string;
  savings: string;
  icon: React.ComponentType<any>;
  color: string;
  benefits: string[];
  eligibility: string[];
  action: string;
  chatMessage: string;
  featured?: boolean;
}



export function MarketingIncentives({ isDark, onOpenChat }: MarketingIncentivesProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'financial' | 'service' | 'bonus'>('all');
  const [expandedIncentive, setExpandedIncentive] = useState<string | null>(null);



  const incentives: Incentive[] = [
    {
      id: 'early-commitment',
      category: 'financial',
      title: 'נ’° Early Commitment Bonus',
      subtitle: 'Sign contract within 7 days',
      description: 'Lock in your savings with our early decision incentive program',
      value: '$12,000 OFF',
      savings: 'Total Project Cost',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      benefits: [
        'Immediate $12,000 discount',
        'Priority scheduling guarantee',
        'Free permit expediting',
        'Locked-in material pricing'
      ],
      eligibility: [
        'Valid for new contracts only',
        'Must sign within 7 days of quote',
        'Applies to projects $200K+',
        'Cannot combine with other major discounts'
      ],
      action: 'Claim Now',
      chatMessage: 'נ’° I want to learn about the Early Commitment Bonus! How does the $12,000 discount work and what are the requirements?',
      featured: true
    },
    {
      id: 'referral-program',
      category: 'bonus',
      title: 'נ₪ Referral Rewards Program',
      subtitle: 'Earn for every successful referral',
      description: 'Share the ADU experience and earn substantial rewards',
      value: '$5,000 CREDIT',
      savings: 'Per Referral',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      benefits: [
        '$5,000 credit per successful referral',
        'No limit on number of referrals',
        'Friend gets $2,500 discount too',
        'Credits can be applied to future projects'
      ],
      eligibility: [
        'Must be current or past client',
        'Referral must sign contract',
        'Credit applied after referral project starts',
        'Valid for 2 years from issue date'
      ],
      action: 'Start Referring',
      chatMessage: 'נ₪ Tell me about the Referral Rewards Program! How much can I earn and what are the requirements for my friends?'
    },
    {
      id: 'premium-upgrades',
      category: 'service',
      title: 'ג­ Premium Service Package',
      subtitle: 'Complimentary luxury upgrades',
      description: 'Elevate your ADU with premium finishes at no extra cost',
      value: '$8,500 VALUE',
      savings: 'In Free Upgrades',
      icon: Star,
      color: 'from-purple-500 to-pink-600',
      benefits: [
        'Premium flooring upgrade',
        'Designer lighting package',
        'High-end appliance suite',
        'Custom cabinetry finishes'
      ],
      eligibility: [
        'Available for Skyline & Neo collections',
        'Must select during design phase',
        'Limited quantity available',
        'First-come, first-served basis'
      ],
      action: 'Upgrade Now',
      chatMessage: 'ג­ I\'m interested in the Premium Service Package! What upgrades are included and how do I qualify?'
    },
    {
      id: 'fast-track',
      category: 'service',
      title: 'ג¡ Fast-Track Construction',
      subtitle: 'Expedited project timeline',
      description: 'Jump ahead in the construction queue with priority scheduling',
      value: '4-6 WEEKS',
      savings: 'Time Saved',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      benefits: [
        'Priority crew assignment',
        'Expedited permit processing',
        'Dedicated project coordination',
        'Weekly progress updates'
      ],
      eligibility: [
        'Available for immediate starts',
        'Requires flexible scheduling',
        'Additional fee may apply',
        'Subject to crew availability'
      ],
      action: 'Fast Track',
      chatMessage: 'ג¡ I need to Fast-Track my construction! How much time can I save and what does it cost?'
    },
    {
      id: 'financing-special',
      category: 'financial',
      title: 'נ¦ Special Financing Offer',
      subtitle: '0% APR for 12 months',
      description: 'Interest-free financing to make your ADU more affordable',
      value: '0% APR',
      savings: 'Interest-Free Period',
      icon: TrendingUp,
      color: 'from-indigo-500 to-blue-600',
      benefits: [
        '12 months interest-free',
        'No prepayment penalties',
        'Flexible payment options',
        'Quick approval process'
      ],
      eligibility: [
        'Subject to credit approval',
        'Minimum project value $150K',
        'Must close within 30 days',
        'Valid for qualified applicants only'
      ],
      action: 'Apply Now',
      chatMessage: 'נ¦ I want to learn about the Special Financing Offer! How does the 0% APR work and what are the qualifications?'
    },
    {
      id: 'loyalty-rewards',
      category: 'bonus',
      title: 'נ† Loyalty Rewards',
      subtitle: 'Benefits for repeat customers',
      description: 'Extra perks and discounts for returning clients',
      value: 'UP TO 15%',
      savings: 'Additional Discount',
      icon: Award,
      color: 'from-rose-500 to-red-600',
      benefits: [
        'Tiered discount system',
        'Exclusive access to new models',
        'VIP customer support',
        'Special event invitations'
      ],
      eligibility: [
        'Previous project completion required',
        'Account in good standing',
        'Discount varies by project size',
        'Cannot combine with other major offers'
      ],
      action: 'Join VIP',
      chatMessage: 'נ† How do the Loyalty Rewards work? What benefits do I get as a returning customer?'
    }
  ];



  const categories = [
    { id: 'all', label: 'All Incentives', icon: Gift },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'service', label: 'Service', icon: Home },
    { id: 'bonus', label: 'Bonus', icon: Award }
  ];



  const filteredIncentives = selectedCategory === 'all' 
    ? incentives 
    : incentives.filter(incentive => incentive.category === selectedCategory);



  const handleClaimIncentive = (incentive: Incentive) => {
    onOpenChat(incentive.chatMessage);
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
            className="p-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Target className="w-8 h-8 text-green-400" />
          </motion.div>
          <motion.h2 
            className={`text-3xl bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            נ¯ Special Incentives
          </motion.h2>
        </div>
        
        <motion.p 
          className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'} max-w-2xl mx-auto`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          נ’¡ Exclusive incentives and rewards to maximize your ADU investment value
        </motion.p>
      </motion.div>



      {/* Category Filters */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className={`inline-flex p-1 rounded-2xl ${
          isDark ? 'bg-slate-800/50' : 'bg-white/50'
        } backdrop-blur-sm border ${
          isDark ? 'border-slate-700/30' : 'border-slate-200/30'
        }`}>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(category.id as any)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                  : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>



      {/* Incentives Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredIncentives.map((incentive, index) => (
            <motion.div
              key={incentive.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.5,
                type: "spring",
                stiffness: 300 
              }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card 
                className={`p-6 h-full ${
                  incentive.featured
                    ? `ring-2 ring-gradient-to-r ${incentive.color} ${
                        isDark ? 'bg-slate-800/95' : 'bg-white/95'
                      }`
                    : isDark 
                      ? 'bg-slate-900/90 border-slate-700/50' 
                      : 'bg-white/90 border-slate-200/50'
                } backdrop-blur-xl rounded-3xl relative overflow-hidden group cursor-pointer`}
                style={{
                  boxShadow: incentive.featured
                    ? (isDark 
                        ? '0 25px 50px rgba(34, 197, 94, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 25px 50px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)')
                    : (isDark 
                        ? '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 20px 40px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)')
                }}
              >
                {/* Featured Badge */}
                {incentive.featured && (
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  >
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
                      ג­ Featured
                    </Badge>
                  </motion.div>
                )}



                {/* Background Gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${incentive.color} opacity-10 group-hover:opacity-15 transition-opacity duration-500`}
                />



                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className={`p-3 rounded-2xl bg-gradient-to-r ${incentive.color} shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <incentive.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {incentive.title}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {incentive.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>



                  {/* Value Display */}
                  <div className="text-center space-y-2">
                    <div className={`text-3xl bg-gradient-to-r ${incentive.color} bg-clip-text text-transparent`}>
                      {incentive.value}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {incentive.savings}
                    </div>
                  </div>



                  {/* Description */}
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                    {incentive.description}
                  </p>



                  {/* Expandable Details */}
                  <AnimatePresence>
                    {expandedIncentive === incentive.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Benefits */}
                        <div>
                          <h4 className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Benefits:
                          </h4>
                          <div className="space-y-1">
                            {incentive.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                  {benefit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>



                        {/* Eligibility */}
                        <div>
                          <h4 className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Eligibility:
                          </h4>
                          <div className="space-y-1">
                            {incentive.eligibility.map((req, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                  {req}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>



                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedIncentive(
                        expandedIncentive === incentive.id ? null : incentive.id
                      )}
                      className={`text-xs ${
                        isDark 
                          ? 'text-slate-400 hover:text-slate-300' 
                          : 'text-slate-600 hover:text-slate-700'
                      }`}
                    >
                      {expandedIncentive === incentive.id ? 'Less Details' : 'More Details'}
                    </Button>



                    <Button
                      onClick={() => handleClaimIncentive(incentive)}
                      className={`bg-gradient-to-r ${incentive.color} hover:opacity-90 text-white px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {incentive.action}
                    </Button>
                  </div>
                </div>



                {/* Floating Animation */}
                <motion.div
                  className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/60 rounded-full"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>



      {/* Bottom CTA */}
      <motion.div
        className="text-center pt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Card 
          className={`p-8 ${
            isDark 
              ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50' 
              : 'bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200/50'
          } backdrop-blur-xl rounded-3xl`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 text-green-400" />
              <h3 className={`text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                נ Maximize Your Savings
              </h3>
            </div>
            
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} max-w-md mx-auto`}>
              Combine multiple incentives and work with Daniel to create the perfect savings package for your project.
            </p>



            <Button
              size="lg"
              onClick={() => onOpenChat('נ I want to maximize my savings! Can you help me combine multiple incentives and find the best deal for my ADU project?')}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Combine Incentives
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
```



5. PromotionalBanner.tsx - ׳‘׳׳ ׳¨ ׳§׳™׳“׳•׳׳™


```tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  Clock, 
  Zap, 
  Gift, 
  MessageCircle,
  Sparkles,
  TrendingUp
} from 'lucide-react';



interface PromotionalBannerProps {
  isDark: boolean;
  onOpenChat: (message?: string) => void;
}



export function PromotionalBanner({ isDark, onOpenChat }: PromotionalBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });



  // Set promotion end date (e.g., 3 days from now)
  const promotionEndDate = new Date();
  promotionEndDate.setDate(promotionEndDate.getDate() + 3);
  promotionEndDate.setHours(23, 59, 59, 999);



  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = promotionEndDate.getTime() - now;



      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);



        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);



    return () => clearInterval(timer);
  }, []);



  if (!isVisible) return null;



  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.6 
        }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="p-4">
          <motion.div
            className={`relative overflow-hidden rounded-2xl mx-auto max-w-6xl pointer-events-auto ${
              isDark 
                ? 'bg-gradient-to-r from-purple-900/95 via-pink-900/95 to-orange-900/95' 
                : 'bg-gradient-to-r from-purple-600/95 via-pink-600/95 to-orange-600/95'
            } backdrop-blur-xl border ${
              isDark ? 'border-purple-400/30' : 'border-purple-300/50'
            }`}
            style={{
              boxShadow: isDark 
                ? '0 25px 50px rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 25px 50px rgba(147, 51, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-1 -left-1 w-8 h-8 bg-white/20 rounded-full"
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-300/30 rounded-full"
                animate={{
                  x: [0, -80, 0],
                  y: [0, -30, 0],
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>



            <div className="relative px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Left Content */}
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <motion.div
                    className="p-2 rounded-xl bg-white/20 backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Gift className="w-6 h-6 text-white" />
                  </motion.div>



                  {/* Text Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white text-lg">
                        נ”¥ Limited Time: Save $15,000!
                      </h3>
                      <Badge 
                        variant="outline" 
                        className="bg-yellow-400/20 text-yellow-100 border-yellow-300/30 backdrop-blur-sm text-xs"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Flash Sale
                      </Badge>
                    </div>
                    <p className="text-white/80 text-sm">
                      Early Bird Special - First 10 customers only. Act fast! ג¡
                    </p>
                  </div>
                </div>



                {/* Center - Countdown */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Ends in:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Min', value: timeLeft.minutes },
                      { label: 'Sec', value: timeLeft.seconds }
                    ].map((unit, index) => (
                      <div key={unit.label} className="flex items-center">
                        <motion.div
                          className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 min-w-[32px] text-center"
                          animate={{ scale: unit.label === 'Sec' ? [1, 1.05, 1] : 1 }}
                          transition={{ duration: 1, repeat: unit.label === 'Sec' ? Infinity : 0 }}
                        >
                          <div className="text-white text-sm font-mono">
                            {unit.value.toString().padStart(2, '0')}
                          </div>
                          <div className="text-white/60 text-xs">
                            {unit.label}
                          </div>
                        </motion.div>
                        {index < 3 && <span className="text-white/60 mx-1">:</span>}
                      </div>
                    ))}
                  </div>
                </div>



                {/* Right Actions */}
                <div className="flex items-center gap-3">
                  {/* Claim Button */}
                  <Button
                    onClick={() => onOpenChat('נ”¥ I want to claim the Limited Time $15,000 discount! I\'m one of the first 10 customers - how do I secure this deal?')}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Claim Now
                  </Button>



                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>



              {/* Mobile Countdown */}
              <div className="md:hidden mt-3 pt-3 border-t border-white/20">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Ends in:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Min', value: timeLeft.minutes }
                    ].map((unit, index) => (
                      <div key={unit.label} className="flex items-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
                          <div className="text-white text-sm font-mono">
                            {unit.value.toString().padStart(2, '0')}
                          </div>
                          <div className="text-white/60 text-xs">
                            {unit.label}
                          </div>
                        </div>
                        {index < 2 && <span className="text-white/60 mx-1">:</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>



            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{ width: '0%' }}
              animate={{ width: '75%' }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
