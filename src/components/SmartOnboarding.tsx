'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  ArrowRight,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Ruler,
  Bed,
  Car,
  Palette,
  Star,
  CheckCircle,
  Target,
  Zap,
  Eye,
  MessageCircle,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Building,
  Building2
} from 'lucide-react';
import { ModelData } from '../data/realModelsData';
import { ExpertContactDialog } from './ExpertContactDialog';
import { GoogleAddressAutocomplete } from './GoogleAddressAutocomplete';
import { Input } from './ui/input';



export interface UserProfile {
  fullName: string;
  address: string;
}



interface SmartOnboardingProps {
  models: ModelData[];
  onComplete: (recommendations?: OnboardingRecommendations, userProfile?: UserProfile) => void;
  onSkip: () => void;
  onModelSelect: (modelId: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}



interface OnboardingAnswers {
  fullName?: string;
  address?: string;
  projectType: 'adu' | 'dadu' | 'premier' | '';
  purpose: 'rental' | 'family' | 'office' | 'multigenerational' | '';
  budget: '150-250' | '250-400' | '400-600' | '600+' | '800-1300' | '1300-1700' | '1700+' | '';
  urgency: '1-3' | '3-6' | '6-12' | '12+' | '';
  size: '400-600' | '600-800' | '800-1000' | '1000-1200' | '1200+' | '1000-1500' | '1500-2500' | '2500-4000' | '4000-10000' | '';
  bedrooms: 0 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | null;
  parking: boolean | null;
  style: string[];
  priorities: string[];
  financing: string[];
  rentGoal?: number;
}



interface OnboardingRecommendations {
  matches: Array<{
    model: ModelData;
    score: number;
    reasons: string[];
  }>;
  insights: string[];
}



interface QuestionStep {
  id: string;
  title: string;
  subtitle: string;
  type: 'single' | 'multiple' | 'input' | 'slider';
  options?: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<any>;
    description?: string;
    value?: any;
  }>;
  field: keyof OnboardingAnswers;
  required?: boolean;
  condition?: (answers: OnboardingAnswers) => boolean;
}



const getOnboardingSteps = (answers: OnboardingAnswers): QuestionStep[] => [
  {
    id: 'personal',
    title: 'Let\'s get to know you',
    subtitle: 'Your name and address help us personalize your experience',
    type: 'input',
    field: 'address',
    required: true
  },
  {
    id: 'projectType',
    title: 'What would you like to build?',
    subtitle: 'Choose the type of project that best fits your needs',
    type: 'single',
    field: 'projectType',
    required: true,
    options: [
      { id: 'adu', label: 'ADU (Accessory Dwelling Unit)', icon: Home, description: 'Secondary unit on your property' },
      { id: 'dadu', label: 'DADU (Detached ADU)', icon: Building, description: 'Standalone structure separate from main house' },
      { id: 'premier', label: 'PREMIER HOME', icon: Building2, description: 'Luxury custom home construction' }
    ]
  },
  {
    id: 'purpose',
    title: "What's your ADU goal?",
    subtitle: 'Help us understand your primary purpose',
    type: 'single',
    field: 'purpose',
    required: true,
    condition: (answers) => answers.projectType === 'adu' || answers.projectType === 'dadu',
    options: [
      { id: 'rental', label: 'Rental Income', icon: DollarSign, description: 'Generate passive income' },
      { id: 'family', label: 'Family Living', icon: Home, description: 'Extended family housing' },
      { id: 'office', label: 'Home Office', icon: Settings, description: 'Work from home space' },
      { id: 'multigenerational', label: 'Multi-Gen', icon: Star, description: 'Multiple generations' }
    ]
  },
  {
    id: 'budget',
    title: "What's your budget range?",
    subtitle: 'Including permits and basic finishes',
    type: 'single',
    field: 'budget',
    required: true,
    options: [
      // ADU/DADU budget options
      { id: '150-250', label: '$150k - $250k', icon: DollarSign, description: 'Compact & efficient' },
      { id: '250-400', label: '$250k - $400k', icon: DollarSign, description: 'Popular range' },
      { id: '400-600', label: '$400k - $600k', icon: DollarSign, description: 'Premium features' },
      { id: '600+', label: '$600k+', icon: DollarSign, description: 'Luxury & custom' },
      // Premier Home budget options
      { id: '800-1300', label: '$800k - $1.3M', icon: DollarSign, description: 'Entry luxury home' },
      { id: '1300-1700', label: '$1.3M - $1.7M', icon: DollarSign, description: 'Premium luxury home' },
      { id: '1700+', label: '$1.7M+', icon: DollarSign, description: 'Ultra-luxury custom' }
    ].filter(option => {
      if (answers.projectType === 'premier') {
        return ['800-1300', '1300-1700', '1700+'].includes(option.id);
      } else {
        return ['150-250', '250-400', '400-600', '600+'].includes(option.id);
      }
    })
  },
  {
    id: 'urgency',
    title: 'When do you need it?',
    subtitle: 'Timeline affects design and permit options',
    type: 'single',
    field: 'urgency',
    required: true,
    options: [
      { id: '1-3', label: '1-3 months', icon: Zap, description: 'Fast-track designs' },
      { id: '3-6', label: '3-6 months', icon: Calendar, description: 'Standard timeline' },
      { id: '6-12', label: '6-12 months', icon: Calendar, description: 'Flexible planning' },
      { id: '12+', label: '12+ months', icon: Calendar, description: 'Custom design time' }
    ]
  },
  {
    id: 'size',
    title: 'Preferred size range?',
    subtitle: answers.projectType === 'premier' ? 'Square footage for your custom home' : 'Square footage affects zoning compatibility',
    type: 'single',
    field: 'size',
    required: true,
    options: [
      // ADU/DADU size options
      { id: '400-600', label: '400-600 sqft', icon: Ruler, description: 'Compact studio/1BR' },
      { id: '600-800', label: '600-800 sqft', icon: Ruler, description: 'Comfortable 1-2BR' },
      { id: '800-1000', label: '800-1000 sqft', icon: Ruler, description: 'Spacious 2BR' },
      { id: '1000-1200', label: '1000-1200 sqft', icon: Ruler, description: 'Large 2-3BR' },
      { id: '1200+', label: '1200+ sqft', icon: Ruler, description: 'Maximum size' },
      // Premier Home size options
      { id: '1000-1500', label: '1000-1500 sqft', icon: Ruler, description: 'Cozy custom home' },
      { id: '1500-2500', label: '1500-2500 sqft', icon: Ruler, description: 'Family home' },
      { id: '2500-4000', label: '2500-4000 sqft', icon: Ruler, description: 'Large luxury home' },
      { id: '4000-10000', label: '4000-10000 sqft', icon: Ruler, description: 'Estate home' }
    ].filter(option => {
      if (answers.projectType === 'premier') {
        return ['1000-1500', '1500-2500', '2500-4000', '4000-10000'].includes(option.id);
      } else {
        return ['400-600', '600-800', '800-1000', '1000-1200', '1200+'].includes(option.id);
      }
    })
  },
  {
    id: 'bedrooms',
    title: 'How many bedrooms?',
    subtitle: answers.projectType === 'premier' ? 'Bedroom count for your custom home' : 'Bedroom count affects rental potential',
    type: 'single',
    field: 'bedrooms',
    required: true,
    options: [
      // ADU/DADU bedroom options
      { id: '0', label: 'Studio', icon: Bed, description: 'Open living space', value: 0 },
      { id: '1', label: '1 Bedroom', icon: Bed, description: 'Standard rental', value: 1 },
      { id: '1.5', label: '1BR + Office', icon: Bed, description: 'Flexible space', value: 1.5 },
      { id: '2', label: '2 Bedrooms', icon: Bed, description: 'Family friendly', value: 2 },
      { id: '3', label: '3 Bedrooms', icon: Bed, description: 'Maximum capacity', value: 3 },
      // Premier Home bedroom options
      { id: '2', label: '2 Bedrooms', icon: Bed, description: 'Starter home', value: 2 },
      { id: '3', label: '3 Bedrooms', icon: Bed, description: 'Family home', value: 3 },
      { id: '4', label: '4 Bedrooms', icon: Bed, description: 'Large family', value: 4 },
      { id: '5', label: '5 Bedrooms', icon: Bed, description: 'Executive home', value: 5 },
      { id: '6', label: '6+ Bedrooms', icon: Bed, description: 'Estate living', value: 6 }
    ].filter(option => {
      if (answers.projectType === 'premier') {
        return [2, 3, 4, 5, 6].includes(option.value);
      } else {
        return [0, 1, 1.5, 2, 3].includes(option.value);
      }
    })
  },
  {
    id: 'parking',
    title: 'Need parking space?',
    subtitle: 'Required in some areas, adds value everywhere',
    type: 'single',
    field: 'parking',
    required: true,
    options: [
      { id: 'yes', label: 'Yes, Required', icon: Car, description: 'Essential feature', value: true },
      { id: 'no', label: 'Not Needed', icon: Home, description: 'More living space', value: false }
    ]
  },
  {
    id: 'style',
    title: 'Preferred style?',
    subtitle: 'Choose all that appeal to you',
    type: 'multiple',
    field: 'style',
    options: [
      { id: 'modern', label: 'Modern Clean', icon: Sparkles, description: 'Minimalist lines' },
      { id: 'scandi', label: 'Scandinavian', icon: Sun, description: 'Light & airy' },
      { id: 'industrial', label: 'Industrial', icon: Settings, description: 'Raw materials' },
      { id: 'farmhouse', label: 'Farmhouse', icon: Home, description: 'Rustic charm' },
      { id: 'coastal', label: 'Coastal', icon: Star, description: 'Beach vibes' },
      { id: 'traditional', label: 'Traditional', icon: CheckCircle, description: 'Classic appeal' }
    ]
  },
  {
    id: 'priorities',
    title: 'Top priorities?',
    subtitle: 'Select up to 3 most important features',
    type: 'multiple',
    field: 'priorities',
    options: [
      { id: 'low_maintenance', label: 'Low Maintenance', icon: CheckCircle, description: 'Durable materials' },
      { id: 'privacy', label: 'Privacy', icon: Eye, description: 'Screening & setbacks' },
      { id: 'high_ceilings', label: 'High Ceilings', icon: Star, description: 'Spacious feel' },
      { id: 'chef_kitchen', label: 'Chef Kitchen', icon: Settings, description: 'Premium appliances' },
      { id: 'accessibility', label: 'ADA Accessible', icon: Home, description: 'Universal design' },
      { id: 'sound_insulation', label: 'Sound Proofing', icon: Sparkles, description: 'Quiet living' },
      { id: 'energy_efficient', label: 'Energy Efficient', icon: Zap, description: 'Green features' },
      { id: 'storage', label: 'Extra Storage', icon: Settings, description: 'Built-in solutions' }
    ]
  }
];



export function SmartOnboarding({ 
  models, 
  onComplete, 
  onSkip, 
  onModelSelect,
  isDark,
  onToggleTheme 
}: SmartOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    fullName: '',
    address: '',
    projectType: '',
    purpose: '',
    budget: '',
    urgency: '',
    size: '',
    bedrooms: null,
    parking: null,
    style: [],
    priorities: [],
    financing: []
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [expertDialogOpen, setExpertDialogOpen] = useState(false);
  const [selectedModelForExpert, setSelectedModelForExpert] = useState<ModelData | null>(null);



  // Get filtered steps based on current answers
  const onboardingSteps = getOnboardingSteps(answers).filter(step => 
    !step.condition || step.condition(answers)
  );



  const currentQuestion = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;



  // Calculate recommendations based on answers
  const calculateRecommendations = (): OnboardingRecommendations => {
    const weights = {
      size: 25,
      budget: 25,
      bedrooms: 20,
      purpose: 15,
      style: 10,
      priorities: 5
    };



    const modelScores = models.map(model => {
      let score = 0;
      const reasons: string[] = [];



      // Size matching
      if (answers.size) {
        const [minSize, maxSize] = answers.size.split('-').map(s => parseInt(s.replace(/[^0-9]/g, '')) || 10000);
        const modelSize = parseInt(model.area.replace(/[^\d]/g, ''));
        
        if (modelSize >= minSize && modelSize <= (maxSize || 10000)) {
          score += weights.size;
          reasons.push(`Perfect ${modelSize} sqft size match`);
        } else if (Math.abs(modelSize - minSize) <= 200) {
          score += weights.size * 0.7;
          reasons.push(`Close size match (${modelSize} sqft)`);
        }
      }



      // Budget matching with different ranges for Premier homes
      if (answers.budget) {
        const budgetRanges = {
          '150-250': [150000, 250000],
          '250-400': [250000, 400000],
          '400-600': [400000, 600000],
          '600+': [600000, 1000000],
          '800-1300': [800000, 1300000],
          '1300-1700': [1300000, 1700000],
          '1700+': [1700000, 3000000]
        };
        
        const [minBudget, maxBudget] = budgetRanges[answers.budget as keyof typeof budgetRanges];
        
        if (model.basePrice >= minBudget && model.basePrice <= maxBudget) {
          score += weights.budget;
          reasons.push(`Within your $${minBudget/1000}k-${maxBudget/1000}k budget`);
        } else if (model.basePrice <= maxBudget * 1.1) {
          score += weights.budget * 0.8;
          reasons.push(`Close to budget range`);
        }
      }



      // Bedroom matching
      if (answers.bedrooms !== null) {
        if (model.bedrooms === answers.bedrooms) {
          score += weights.bedrooms;
          reasons.push(`Exact ${answers.bedrooms} bedroom match`);
        } else if (Math.abs(model.bedrooms - (answers.bedrooms || 0)) <= 0.5) {
          score += weights.bedrooms * 0.7;
          reasons.push(`Close bedroom count`);
        }
      }



      // Purpose matching (only for ADU/DADU)
      if (answers.purpose && (answers.projectType === 'adu' || answers.projectType === 'dadu')) {
        const purposeFeatures = {
          rental: ['rental ready', 'income potential', 'low maintenance'],
          family: ['family friendly', 'flexible space', 'privacy'],
          office: ['home office', 'quiet space', 'internet ready'],
          multigenerational: ['accessible', 'private entrance', 'kitchen']
        };
        
        const relevantFeatures = purposeFeatures[answers.purpose as keyof typeof purposeFeatures] || [];
        const matchingFeatures = model.features.filter(feature => 
          relevantFeatures.some(rf => feature.toLowerCase().includes(rf))
        );
        
        if (matchingFeatures.length > 0) {
          score += weights.purpose * (matchingFeatures.length / relevantFeatures.length);
          reasons.push(`Great for ${answers.purpose} use`);
        }
      }



      // Style matching
      if (answers.style.length > 0) {
        const styleKeywords = {
          modern: ['modern', 'contemporary', 'clean', 'minimalist'],
          scandi: ['scandinavian', 'light', 'bright', 'wood'],
          industrial: ['industrial', 'metal', 'concrete', 'loft'],
          farmhouse: ['farmhouse', 'rustic', 'wood', 'traditional'],
          coastal: ['coastal', 'beach', 'light', 'airy'],
          traditional: ['traditional', 'classic', 'timeless']
        };



        let styleMatch = false;
        answers.style.forEach(style => {
          const keywords = styleKeywords[style as keyof typeof styleKeywords] || [];
          if (keywords.some(keyword => 
            model.features.some(feature => feature.toLowerCase().includes(keyword)) ||
            model.name.toLowerCase().includes(keyword)
          )) {
            styleMatch = true;
            reasons.push(`Matches ${style} style preference`);
          }
        });



        if (styleMatch) {
          score += weights.style;
        }
      }



      // Priorities matching
      if (answers.priorities.length > 0) {
        const priorityKeywords = {
          low_maintenance: ['maintenance', 'durable', 'vinyl', 'composite'],
          privacy: ['privacy', 'screening', 'setback', 'fence'],
          high_ceilings: ['ceiling', 'height', 'loft', 'volume'],
          chef_kitchen: ['kitchen', 'island', 'appliances', 'granite'],
          accessibility: ['accessible', 'ada', 'ramp', 'wide'],
          sound_insulation: ['insulation', 'sound', 'quiet', 'acoustic'],
          energy_efficient: ['energy', 'efficient', 'insulation', 'hvac'],
          storage: ['storage', 'closet', 'built-in', 'pantry']
        };



        let priorityMatches = 0;
        answers.priorities.forEach(priority => {
          const keywords = priorityKeywords[priority as keyof typeof priorityKeywords] || [];
          if (keywords.some(keyword => 
            model.features.some(feature => feature.toLowerCase().includes(keyword))
          )) {
            priorityMatches++;
            reasons.push(`Includes ${priority.replace('_', ' ')} feature`);
          }
        });



        if (priorityMatches > 0) {
          score += weights.priorities * (priorityMatches / answers.priorities.length);
        }
      }



      return {
        model,
        score: Math.round(score),
        reasons: reasons.slice(0, 3) // Top 3 reasons
      };
    });



    // Sort by score and take top 3
    const topMatches = modelScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);



    // Generate insights
    const projectTypeText = answers.projectType === 'premier' ? 'Premier Home' : 'ADU';
    const insights = [
      `Based on your ${answers.purpose || projectTypeText} goal and ${answers.budget} budget`,
      `${answers.size} sqft range is perfect for ${answers.bedrooms} bedroom layout`,
      `Your ${answers.urgency} timeline allows for ${answers.urgency === '1-3' ? 'pre-designed' : 'customizable'} options`
    ];



    return {
      matches: topMatches,
      insights
    };
  };



  const handleAnswer = (value: any) => {
    const field = currentQuestion.field;
    
    if (currentQuestion.type === 'multiple') {
      const currentValues = (answers[field] as string[]) || [];
      let newValues;
      
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v !== value);
      } else {
        if (field === 'priorities' && currentValues.length >= 3) {
          return; // Max 3 priorities
        }
        newValues = [...currentValues, value];
      }
      
      setAnswers(prev => ({
        ...prev,
        [field]: newValues
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };



  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Direct navigation to collections
      const recs = calculateRecommendations();
      const userProfile = {
        fullName: answers.fullName || 'Guest User',
        address: answers.address || 'Seattle, WA'
      };
      onComplete(recs, userProfile);
    }
  };



  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };



  const isStepValid = () => {
    const field = currentQuestion.field;
    const value = answers[field];
    
    if (!currentQuestion.required) return true;
    
    if (currentQuestion.type === 'input') {
      // For personal info step, check both fullName and address
      return answers.fullName && answers.fullName.trim() !== '' && 
             answers.address && answers.address.trim() !== '';
    }
    
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(value) && value.length > 0;
    }
    
    return value !== null && value !== undefined && value !== '';
  };



  const canContinue = isStepValid();



  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 transition-all duration-1000"
        style={{
          background: isDark
            ? `
              radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%),
              linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e293b 50%, #334155 75%, #475569 100%)
            `
            : `
              radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.06) 0%, transparent 50%),
              linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)
            `
        }}
      />



      {/* Header */}
      <motion.div
        className="relative z-10 border-b transition-all duration-1000"
        style={{
          borderColor: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.15)',
          backdropFilter: 'blur(25px) saturate(180%)',
          background: isDark
            ? 'rgba(11, 15, 20, 0.95)'
            : 'rgba(248, 250, 252, 0.95)'
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="relative px-8 py-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Glassmorphism Background */}
          <div
            className="absolute inset-0 rounded-3xl backdrop-blur-xl border border-cyan-500/20"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.3) 50%, rgba(51, 65, 85, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.4) 0%, rgba(226, 232, 240, 0.3) 50%, rgba(203, 213, 225, 0.2) 100%)',
              boxShadow: isDark
                ? '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                : '0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}
          />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              {/* Logo and Title Section */}
              <motion.div
                className="flex items-center gap-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Enhanced Logo */}
                <div className="relative group">
                  <motion.div
                    className="w-16 h-16 relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Glowing ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 p-0.5">
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'
                        } shadow-xl`}>
                        <img
                          src="/logo.png"
                          alt="Seattle ADU"
                          className="w-10 h-10 object-contain filter brightness-110 drop-shadow-lg"
                        />
                      </div>
                    </div>
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 animate-pulse" />
                  </motion.div>
                </div>
                
                {/* Title and Subtitle */}
                <div className="space-y-2">
                  <motion.h1
                    className="text-3xl bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Find Your Perfect Project
                  </motion.h1>
                  <motion.p
                    className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-lg`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Answer a few questions to get personalized recommendations
                  </motion.p>
                </div>
              </motion.div>
              
              {/* Action Buttons */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleTheme}
                  className={`rounded-2xl border-2 transition-all duration-300 ${isDark
                      ? 'bg-slate-800/60 border-cyan-500/30 text-cyan-300 hover:bg-slate-700/70 hover:border-cyan-400/50 hover:text-cyan-200'
                      : 'bg-white/60 border-cyan-500/30 text-cyan-600 hover:bg-white/80 hover:border-cyan-600/50 hover:text-cyan-700'
                    } backdrop-blur-lg shadow-lg hover:shadow-xl`}
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </motion.div>
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className={`rounded-2xl px-6 py-2 transition-all duration-300 ${isDark
                      ? 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
                      : 'text-slate-600 hover:text-cyan-600 hover:bg-slate-100/50'
                    } backdrop-blur-sm`}
                >
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Skip for now 
                  </motion.span>
                </Button>
              </motion.div>
            </div>
            
            {/* Enhanced Progress Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* Step indicator with numbers */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${isDark
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30'
                        : 'bg-cyan-50 text-cyan-600 border-cyan-300/30'
                      } px-3 py-1 backdrop-blur-sm`}
                  >
                    Step {currentStep + 1} of {onboardingSteps.length}
                  </Badge>
                  <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm`}>
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                
                {/* Quick progress dots */}
                <div className="flex items-center gap-2">
                  {onboardingSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ${index <= currentStep
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg'
                          : isDark
                            ? 'bg-slate-600/50'
                            : 'bg-slate-300/50'
                        }`}
                      animate={{
                        scale: index === currentStep ? 1.3 : 1,
                        opacity: index === currentStep ? 1 : 0.6
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative">
                <Progress
                  value={progress}
                  className={`h-3 rounded-full overflow-hidden border ${isDark ? 'border-slate-600/30 bg-slate-800/30' : 'border-slate-300/30 bg-slate-200/30'
                    } backdrop-blur-sm`}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
        
   



      </motion.div>



        {/* Main Content */}
        <div className="relative z-10 p-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {!isAnimating && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    scale: { duration: 0.3 }
                  }}
                >
                  {/* Question Card */}
                  <Card
                    className={`p-8 transition-all duration-500 ${isDark
                        ? 'bg-slate-900/90 border-slate-700/50'
                        : 'bg-white/90 border-slate-200/50'
                      } backdrop-blur-xl rounded-3xl shadow-2xl`}
                    style={{
                      boxShadow: isDark
                        ? '0 25px 50px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                        : '0 25px 50px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    {/* Question Header */}
                    <motion.div
                      className="text-center mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <motion.h2
                        className={`text-2xl mb-3 bg-gradient-to-r ${isDark
                            ? 'from-cyan-300 via-blue-300 to-purple-300'
                            : 'from-cyan-600 via-blue-600 to-purple-600'
                          } bg-clip-text text-transparent`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        {currentQuestion.title}
                      </motion.h2>
                      <motion.p
                        className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-lg`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        {currentQuestion.subtitle}
                      </motion.p>
                    </motion.div>



                    {/* Question Content */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {currentQuestion.type === 'input' ? (
                        <div className="space-y-6 max-w-md mx-auto">
                          {/* Full Name Input */}
                          <div className="space-y-2">
                            <label className={`block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              Full Name *
                            </label>
                            <Input
                              placeholder="Enter your full name"
                              value={answers.fullName || ''}
                              onChange={(e) => setAnswers(prev => ({ ...prev, fullName: e.target.value }))}
                              className={`${isDark
                                  ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400'
                                  : 'bg-white/50 border-slate-300/50 text-slate-900 placeholder-slate-500'
                                } backdrop-blur-sm rounded-xl`}
                            />
                          </div>
                        
                          {/* Address Input */}
                          <div className="space-y-2">
                            <label className={`block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              Property Address *
                            </label>
                            <GoogleAddressAutocomplete
                              value={answers.address || ''}
                              onChange={(address: string) => setAnswers(prev => ({ ...prev, address }))}
                              placeholder="Enter your property address"
                              className={`${isDark
                                  ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400'
                                  : 'bg-white/50 border-slate-300/50 text-slate-900 placeholder-slate-500'
                                } backdrop-blur-sm rounded-xl`}
                            />
                          </div>
                        </div>
                      ) : currentQuestion.type === 'single' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {currentQuestion.options?.map((option, index) => {
                            const Icon = option.icon;
                            const isSelected = answers[currentQuestion.field] === option.value || answers[currentQuestion.field] === option.id;
                          
                            return (
                              <motion.button
                                key={option.id}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.1 * index, duration: 0.3 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAnswer(option.value !== undefined ? option.value : option.id)}
                                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${isSelected
                                    ? `border-cyan-400 shadow-lg ${isDark
                                      ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-cyan-500/25'
                                      : 'bg-gradient-to-br from-cyan-50 to-blue-50 shadow-cyan-500/15'
                                    }`
                                    : isDark
                                      ? 'border-slate-600/30 bg-slate-800/20 hover:border-slate-500/50 hover:bg-slate-800/40'
                                      : 'border-slate-300/30 bg-white/20 hover:border-slate-400/50 hover:bg-white/40'
                                  } backdrop-blur-sm hover:shadow-xl`}
                                style={{
                                  transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                                  boxShadow: isSelected
                                    ? (isDark
                                      ? '0 20px 40px rgba(6, 182, 212, 0.15), 0 0 0 1px rgba(6, 182, 212, 0.2)'
                                      : '0 20px 40px rgba(6, 182, 212, 0.1), 0 0 0 1px rgba(6, 182, 212, 0.15)')
                                    : 'none'
                                }}
                              >
                                {/* Selection indicator */}
                                <motion.div
                                  className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 transition-all duration-300 ${isSelected
                                      ? 'border-cyan-400 bg-cyan-400'
                                      : isDark
                                        ? 'border-slate-500/50'
                                        : 'border-slate-300/50'
                                    }`}
                                  animate={{ scale: isSelected ? 1.1 : 1 }}
                                >
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-full h-full flex items-center justify-center"
                                    >
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </motion.div>
                                  )}
                                </motion.div>
                              
                                {/* Icon */}
                                {Icon && (
                                  <motion.div
                                    className={`mb-4 ${isSelected
                                        ? 'text-cyan-400'
                                        : isDark
                                          ? 'text-slate-400 group-hover:text-slate-300'
                                          : 'text-slate-500 group-hover:text-slate-600'
                                      }`}
                                    animate={{
                                      scale: isSelected ? 1.1 : 1,
                                      rotateY: isSelected ? 360 : 0
                                    }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <Icon className="w-8 h-8" />
                                  </motion.div>
                                )}
                              
                                {/* Content */}
                                <div>
                                  <h3 className={`text-lg mb-2 transition-colors duration-300 ${isSelected
                                      ? isDark ? 'text-white' : 'text-slate-900'
                                      : isDark
                                        ? 'text-slate-200 group-hover:text-white'
                                        : 'text-slate-800 group-hover:text-slate-900'
                                    }`}>
                                    {option.label}
                                  </h3>
                                  <p className={`text-sm transition-colors duration-300 ${isSelected
                                      ? isDark ? 'text-slate-300' : 'text-slate-600'
                                      : isDark
                                        ? 'text-slate-400 group-hover:text-slate-300'
                                        : 'text-slate-600 group-hover:text-slate-700'
                                    }`}>
                                    {option.description}
                                  </p>
                                </div>
                              
                                {/* Hover effect overlay */}
                                <motion.div
                                  className="absolute inset-0 rounded-2xl pointer-events-none"
                                  initial={{ opacity: 0 }}
                                  whileHover={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                  style={{
                                    background: isDark
                                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
                                      : 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
                                  }}
                                />
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : currentQuestion.type === 'multiple' ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentQuestion.options?.map((option, index) => {
                              const Icon = option.icon;
                              const isSelected = (answers[currentQuestion.field] as string[])?.includes(option.id) || false;
                              const currentValues = (answers[currentQuestion.field] as string[]) || [];
                              const isMaxReached = currentQuestion.field === 'priorities' && currentValues.length >= 3 && !isSelected;
                            
                              return (
                                <motion.button
                                  key={option.id}
                                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                                  whileHover={{ scale: isMaxReached ? 1 : 1.02, y: isMaxReached ? 0 : -5 }}
                                  whileTap={{ scale: isMaxReached ? 1 : 0.98 }}
                                  onClick={() => !isMaxReached && handleAnswer(option.id)}
                                  disabled={isMaxReached}
                                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${isSelected
                                      ? `border-cyan-400 shadow-lg ${isDark
                                        ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-cyan-500/25'
                                        : 'bg-gradient-to-br from-cyan-50 to-blue-50 shadow-cyan-500/15'
                                      }`
                                      : isMaxReached
                                        ? isDark
                                          ? 'border-slate-700/30 bg-slate-800/10 opacity-50 cursor-not-allowed'
                                          : 'border-slate-200/30 bg-white/10 opacity-50 cursor-not-allowed'
                                        : isDark
                                          ? 'border-slate-600/30 bg-slate-800/20 hover:border-slate-500/50 hover:bg-slate-800/40'
                                          : 'border-slate-300/30 bg-white/20 hover:border-slate-400/50 hover:bg-white/40'
                                    } backdrop-blur-sm hover:shadow-xl`}
                                  style={{
                                    transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                                    boxShadow: isSelected
                                      ? (isDark
                                        ? '0 20px 40px rgba(6, 182, 212, 0.15), 0 0 0 1px rgba(6, 182, 212, 0.2)'
                                        : '0 20px 40px rgba(6, 182, 212, 0.1), 0 0 0 1px rgba(6, 182, 212, 0.15)')
                                      : 'none'
                                  }}
                                >
                                  {/* Selection indicator */}
                                  <motion.div
                                    className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 transition-all duration-300 ${isSelected
                                        ? 'border-cyan-400 bg-cyan-400'
                                        : isDark
                                          ? 'border-slate-500/50'
                                          : 'border-slate-300/50'
                                      }`}
                                    animate={{ scale: isSelected ? 1.1 : 1 }}
                                  >
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-full h-full flex items-center justify-center"
                                      >
                                        <CheckCircle className="w-4 h-4 text-white" />
                                      </motion.div>
                                    )}
                                  </motion.div>
                                
                                  {/* Icon */}
                                  {Icon && (
                                    <motion.div
                                      className={`mb-4 ${isSelected
                                          ? 'text-cyan-400'
                                          : isDark
                                            ? 'text-slate-400 group-hover:text-slate-300'
                                            : 'text-slate-500 group-hover:text-slate-600'
                                        }`}
                                      animate={{
                                        scale: isSelected ? 1.1 : 1,
                                        rotateY: isSelected ? 360 : 0
                                      }}
                                      transition={{ duration: 0.5 }}
                                    >
                                      <Icon className="w-8 h-8" />
                                    </motion.div>
                                  )}
                                
                                  {/* Content */}
                                  <div>
                                    <h3 className={`text-lg mb-2 transition-colors duration-300 ${isSelected
                                        ? isDark ? 'text-white' : 'text-slate-900'
                                        : isDark
                                          ? 'text-slate-200 group-hover:text-white'
                                          : 'text-slate-800 group-hover:text-slate-900'
                                      }`}>
                                      {option.label}
                                    </h3>
                                    <p className={`text-sm transition-colors duration-300 ${isSelected
                                        ? isDark ? 'text-slate-300' : 'text-slate-600'
                                        : isDark
                                          ? 'text-slate-400 group-hover:text-slate-300'
                                          : 'text-slate-600 group-hover:text-slate-700'
                                      }`}>
                                      {option.description}
                                    </p>
                                  </div>
                                
                                  {/* Hover effect overlay */}
                                  {!isMaxReached && (
                                    <motion.div
                                      className="absolute inset-0 rounded-2xl pointer-events-none"
                                      initial={{ opacity: 0 }}
                                      whileHover={{ opacity: 1 }}
                                      transition={{ duration: 0.3 }}
                                      style={{
                                        background: isDark
                                          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
                                          : 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)'
                                      }}
                                    />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        
                          {/* Selection count for priorities */}
                          {currentQuestion.field === 'priorities' && (
                            <motion.div
                              className="text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <Badge
                                variant="outline"
                                className={`${isDark
                                    ? 'bg-slate-800/50 text-slate-300 border-slate-600/50'
                                    : 'bg-white/50 text-slate-600 border-slate-300/50'
                                  } backdrop-blur-sm`}
                              >
                                {(answers.priorities || []).length} of 3 selected
                              </Badge>
                            </motion.div>
                          )}
                        </div>
                      ) : null}
                    </motion.div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>



            {/* Navigation */}
            <motion.div
              className="flex items-center justify-between mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-8 py-3 rounded-2xl border-2 transition-all duration-300 ${currentStep === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : isDark
                      ? 'bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/70 hover:border-slate-500/70 hover:text-white'
                      : 'bg-white/60 border-slate-300/50 text-slate-600 hover:bg-white/80 hover:border-slate-400/70 hover:text-slate-800'
                  } backdrop-blur-lg shadow-lg hover:shadow-xl`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>



              <div className="flex items-center gap-4">
                {/* Contact Expert Button */}
                <Button
                  variant="outline"
                  onClick={() => setExpertDialogOpen(true)}
                  className={`px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${isDark
                      ? 'bg-purple-500/10 border-purple-400/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-300/50 hover:text-purple-200'
                      : 'bg-purple-50/60 border-purple-300/30 text-purple-600 hover:bg-purple-100/60 hover:border-purple-400/50 hover:text-purple-700'
                    } backdrop-blur-lg shadow-lg hover:shadow-xl`}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Expert
                </Button>



                {/* Continue Button */}
                <Button
                  onClick={nextStep}
                  disabled={!canContinue}
                  className={`px-8 py-3 rounded-2xl transition-all duration-300 ${canContinue
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg hover:shadow-xl'
                      : 'opacity-50 cursor-not-allowed bg-slate-400'
                    } backdrop-blur-lg`}
                  style={{
                    boxShadow: canContinue
                      ? '0 10px 30px rgba(6, 182, 212, 0.3)'
                      : 'none'
                  }}
                >
                  {currentStep === onboardingSteps.length - 1 ? (
                    <>
                      <Target className="w-5 h-5 mr-2" />
                      Get Recommendations
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>



        {/* Expert Contact Dialog */}
        <ExpertContactDialog
          open={expertDialogOpen}
          onClose={() => setExpertDialogOpen(false)}
          model={selectedModelForExpert || undefined}
          isDark={isDark}
        />
    </div >
      
  );
}

