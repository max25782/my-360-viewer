'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Clock,
  Gift,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Timer,
  Sparkles,
  Target,
  Award,
  X,
  Phone,
  MessageCircle
} from 'lucide-react';

interface MarketingIncentivesProps {
  isDark: boolean;
  modelId?: string;
  collection?: string;
  onContactProjectManager?: () => void;
  userProfile?: {
    fullName: string;
    address: string;
  };
}

interface Incentive {
  id: string;
  type: 'seasonal' | 'early_bird' | 'bundle' | 'referral' | 'quick_decision' | 'financing' | 'limited_time';
  title: string;
  subtitle: string;
  description: string;
  value: string;
  icon: React.ComponentType<any>;
  gradient: string;
  expiryDate?: Date;
  conditions?: string[];
  callToAction: string;
  urgency: 'low' | 'medium' | 'high';
  isActive: boolean;
  exclusive?: boolean;
}

const CURRENT_INCENTIVES: Incentive[] = [
  {
    id: 'winter_2025',
    type: 'seasonal',
    title: '2025 Spring Planning Special',
    subtitle: 'Early Planning Advantage',
    description: 'Start your ADU project planning now and save on design and permit services for spring construction.',
    value: 'Up to $5,000 off',
    icon: Calendar,
    gradient: 'from-emerald-500 to-teal-600',
    expiryDate: new Date('2025-03-01'),
    conditions: [
      'Valid for projects starting April-June 2025',
      'Includes design consultation and permit prep',
      'Non-transferable, one per customer'
    ],
    callToAction: 'Claim Planning Discount',
    urgency: 'medium',
    isActive: true
  },
  {
    id: 'quick_decision',
    type: 'quick_decision',
    title: 'Quick Decision Bonus',
    subtitle: 'Decide within 72 hours',
    description: 'Make your ADU selection within 72 hours of consultation and receive priority scheduling plus additional savings.',
    value: '$2,500 savings',
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    conditions: [
      'Must complete consultation first',
      'Contract signed within 72 hours',
      'Priority construction scheduling included'
    ],
    callToAction: 'Schedule Consultation',
    urgency: 'high',
    isActive: true
  },
  {
    id: 'referral_2025',
    type: 'referral',
    title: 'Neighbor Referral Program',
    subtitle: 'Share the ADU advantage',
    description: 'Refer a neighbor for their ADU project and both receive exclusive benefits.',
    value: '$3,000 each',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500',
    conditions: [
      'Referred customer must complete project',
      'Both parties receive full benefit',
      'No limit on referrals'
    ],
    callToAction: 'Learn More',
    urgency: 'low',
    isActive: true
  },
  {
    id: 'neo_exclusive',
    type: 'limited_time',
    title: 'Neo Collection Launch',
    subtitle: 'First 10 customers only',
    description: 'Be among the first to build our newest Neo Collection design with exclusive launch pricing.',
    value: '15% off base price',
    icon: Star,
    gradient: 'from-cyan-500 to-blue-600',
    expiryDate: new Date('2025-02-15'),
    conditions: [
      'Limited to first 10 Neo Collection orders',
      'Full payment terms available',
      'Includes premium finishes upgrade'
    ],
    callToAction: 'Reserve Your Spot',
    urgency: 'high',
    isActive: true,
    exclusive: true
  },
  {
    id: 'financing_special',
    type: 'financing',
    title: 'Low-Rate Financing',
    subtitle: 'Partner lender special rates',
    description: 'Qualified buyers can access special financing rates through our preferred lending partners.',
    value: 'Starting at 5.99% APR',
    icon: TrendingUp,
    gradient: 'from-green-500 to-emerald-600',
    conditions: [
      'Subject to credit approval',
      'Terms up to 15 years available',
      'No prepayment penalties'
    ],
    callToAction: 'Check Rates',
    urgency: 'low',
    isActive: true
  }
];

export function MarketingIncentives({ 
  isDark, 
  modelId, 
  collection, 
  onContactProjectManager,
  userProfile 
}: MarketingIncentivesProps) {
  const [selectedIncentive, setSelectedIncentive] = useState<Incentive | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>({});
  const [showAllIncentives, setShowAllIncentives] = useState(false);

  // Update countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: { [key: string]: string } = {};
      
      CURRENT_INCENTIVES.forEach(incentive => {
        if (incentive.expiryDate) {
          const now = new Date();
          const diff = incentive.expiryDate.getTime() - now.getTime();
          
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (days > 0) {
              newTimeRemaining[incentive.id] = `${days}d ${hours}h remaining`;
            } else if (hours > 0) {
              newTimeRemaining[incentive.id] = `${hours}h ${minutes}m remaining`;
            } else {
              newTimeRemaining[incentive.id] = `${minutes}m remaining`;
            }
          }
        }
      });
      
      setTimeRemaining(newTimeRemaining);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getActiveIncentives = () => {
    return CURRENT_INCENTIVES.filter(incentive => incentive.isActive);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      default: return 'text-green-400';
    }
  };

  const handleIncentiveAction = (incentive: Incentive) => {
    if (incentive.type === 'quick_decision' || incentive.callToAction.includes('Schedule')) {
      onContactProjectManager?.();
    } else {
      setSelectedIncentive(incentive);
    }
  };

  const activeIncentives = getActiveIncentives();
  const displayedIncentives = showAllIncentives ? activeIncentives : activeIncentives.slice(0, 2);

  return (
    <>
      {/* Main Banner - Top Incentive */}
      {activeIncentives.length > 0 && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card 
            className="relative overflow-hidden border-0 p-0"
            style={{
              background: isDark
                ? `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)`
                : `linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.15)'}`
            }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${activeIncentives[0].gradient.replace('from-', '').replace('to-', ', ')})`
                }}
              />
              <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10" />
            </div>

            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeIncentives[0].gradient} flex items-center justify-center`}>
                      {React.createElement(activeIncentives[0].icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {activeIncentives[0].title}
                        </h3>
                        {activeIncentives[0].exclusive && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Exclusive
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {activeIncentives[0].subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} pr-4`}>
                    {activeIncentives[0].description}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl bg-gradient-to-r ${activeIncentives[0].gradient} bg-clip-text text-transparent`}>
                      {activeIncentives[0].value}
                    </div>
                    {timeRemaining[activeIncentives[0].id] && (
                      <div className="flex items-center gap-1">
                        <Timer className={`w-4 h-4 ${getUrgencyColor(activeIncentives[0].urgency)}`} />
                        <span className={`text-sm ${getUrgencyColor(activeIncentives[0].urgency)}`}>
                          {timeRemaining[activeIncentives[0].id]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleIncentiveAction(activeIncentives[0])}
                    className={`bg-gradient-to-r ${activeIncentives[0].gradient} text-white hover:scale-105 transition-all duration-300`}
                  >
                    {activeIncentives[0].callToAction}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  {activeIncentives[0].type === 'quick_decision' && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onContactProjectManager}
                        className={`${isDark ? 'bg-slate-800/50 border-slate-600/50' : 'bg-white/50 border-slate-300'} text-xs`}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onContactProjectManager}
                        className={`${isDark ? 'bg-slate-800/50 border-slate-600/50' : 'bg-white/50 border-slate-300'} text-xs`}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Additional Incentives Grid */}
      {activeIncentives.length > 1 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h3 className={`text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Current Offers & Incentives
            </h3>
            {activeIncentives.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllIncentives(!showAllIncentives)}
                className={`${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}
              >
                {showAllIncentives ? 'Show Less' : `View All (${activeIncentives.length})`}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedIncentives.slice(1).map((incentive, index) => (
              <motion.div
                key={incentive.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card 
                  className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4"
                  style={{
                    borderLeftColor: incentive.gradient.includes('cyan') ? '#06b6d4' : 
                                   incentive.gradient.includes('purple') ? '#8b5cf6' :
                                   incentive.gradient.includes('orange') ? '#f97316' :
                                   incentive.gradient.includes('green') ? '#10b981' : '#06b6d4',
                    background: isDark
                      ? 'rgba(15, 23, 42, 0.5)'
                      : 'rgba(248, 250, 252, 0.5)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onClick={() => handleIncentiveAction(incentive)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {React.createElement(incentive.icon, { className: `w-5 h-5 bg-gradient-to-r ${incentive.gradient} bg-clip-text text-transparent` })}
                        <h4 className={`${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {incentive.title}
                        </h4>
                      </div>
                      {timeRemaining[incentive.id] && (
                        <Badge variant="outline" className={`text-xs ${getUrgencyColor(incentive.urgency)}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {timeRemaining[incentive.id]}
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {incentive.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className={`bg-gradient-to-r ${incentive.gradient} bg-clip-text text-transparent`}>
                        {incentive.value}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`text-xs ${isDark ? 'border-slate-600/50' : 'border-slate-300'}`}
                      >
                        {incentive.callToAction}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Incentive Details Modal */}
      <AnimatePresence>
        {selectedIncentive && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIncentive(null)}
          >
            <motion.div
              className="max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Card 
                className="p-6"
                style={{
                  background: isDark
                    ? 'rgba(15, 23, 42, 0.95)'
                    : 'rgba(248, 250, 252, 0.95)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedIncentive.gradient} flex items-center justify-center`}>
                      {React.createElement(selectedIncentive.icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedIncentive(null)}
                      className="w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className={`text-xl ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {selectedIncentive.title}
                    </h3>
                    <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {selectedIncentive.subtitle}
                    </p>
                  </div>
                  
                  <div className={`text-2xl bg-gradient-to-r ${selectedIncentive.gradient} bg-clip-text text-transparent`}>
                    {selectedIncentive.value}
                  </div>
                  
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {selectedIncentive.description}
                  </p>
                  
                  {selectedIncentive.conditions && (
                    <div className="space-y-2">
                      <h4 className={`text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Terms & Conditions:
                      </h4>
                      <ul className="space-y-1">
                        {selectedIncentive.conditions.map((condition, index) => (
                          <li key={index} className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} flex items-start gap-2`}>
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        handleIncentiveAction(selectedIncentive);
                        setSelectedIncentive(null);
                      }}
                      className={`flex-1 bg-gradient-to-r ${selectedIncentive.gradient} text-white`}
                    >
                      {selectedIncentive.callToAction}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onContactProjectManager}
                      className="flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Daniel
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}