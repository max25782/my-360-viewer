import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card } from './ui/card';
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
  Sparkles
} from 'lucide-react';
// Minimal model interface used by onboarding
export interface ModelData {
  id: string;
  name: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  heroImage: string;
  features: string[];
}

const seattleAduLogo = '/logo.png';
import { ExpertContactDialog } from './ExpertContactDialog';

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
  purpose: 'rental' | 'family' | 'office' | 'multigenerational' | '';
  budget: '150-250' | '250-400' | '400-600' | '600+' | '';
  urgency: 'asap' | '3-6' | '6-12' | '12+' | '';
  size: '400-600' | '600-800' | '800-1000' | '1000-1200' | '1200+' | '';
  bedrooms: 0 | 1 | 1.5 | 2 | 3 | null;
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
}

const ONBOARDING_STEPS: QuestionStep[] = [
  {
    id: 'personal',
    title: 'Let\'s get to know you',
    subtitle: 'Your name and address help us personalize your ADU experience',
    type: 'input',
    field: 'address',
    required: true
  },
  {
    id: 'purpose',
    title: "What's your ADU goal?",
    subtitle: 'Help us understand your primary purpose',
    type: 'single',
    field: 'purpose',
    required: true,
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
      { id: '150-250', label: '$150k - $250k', icon: DollarSign, description: 'Compact & efficient' },
      { id: '250-400', label: '$250k - $400k', icon: DollarSign, description: 'Popular range' },
      { id: '400-600', label: '$400k - $600k', icon: DollarSign, description: 'Premium features' },
      { id: '600+', label: '$600k+', icon: DollarSign, description: 'Luxury & custom' }
    ]
  },
  {
    id: 'urgency',
    title: 'When do you need it?',
    subtitle: 'Timeline affects design and permit options',
    type: 'single',
    field: 'urgency',
    required: true,
    options: [
      { id: 'asap', label: 'ASAP (3-6 months)', icon: Zap, description: 'Fast-track designs' },
      { id: '3-6', label: '3-6 months', icon: Calendar, description: 'Standard timeline' },
      { id: '6-12', label: '6-12 months', icon: Calendar, description: 'Flexible planning' },
      { id: '12+', label: '12+ months', icon: Calendar, description: 'Custom design time' }
    ]
  },
  {
    id: 'size',
    title: 'Preferred size range?',
    subtitle: 'Square footage affects zoning compatibility',
    type: 'single',
    field: 'size',
    required: true,
    options: [
      { id: '400-600', label: '400-600 sqft', icon: Ruler, description: 'Compact studio/1BR' },
      { id: '600-800', label: '600-800 sqft', icon: Ruler, description: 'Comfortable 1-2BR' },
      { id: '800-1000', label: '800-1000 sqft', icon: Ruler, description: 'Spacious 2BR' },
      { id: '1000-1200', label: '1000-1200 sqft', icon: Ruler, description: 'Large 2-3BR' },
      { id: '1200+', label: '1200+ sqft', icon: Ruler, description: 'Maximum size' }
    ]
  },
  {
    id: 'bedrooms',
    title: 'How many bedrooms?',
    subtitle: 'Bedroom count affects rental potential',
    type: 'single',
    field: 'bedrooms',
    required: true,
    options: [
      { id: '0', label: 'Studio', icon: Bed, description: 'Open living space', value: 0 },
      { id: '1', label: '1 Bedroom', icon: Bed, description: 'Standard rental', value: 1 },
      { id: '1.5', label: '1BR + Office', icon: Bed, description: 'Flexible space', value: 1.5 },
      { id: '2', label: '2 Bedrooms', icon: Bed, description: 'Family friendly', value: 2 },
      { id: '3', label: '3 Bedrooms', icon: Bed, description: 'Maximum capacity', value: 3 }
    ]
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
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<OnboardingRecommendations | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expertDialogOpen, setExpertDialogOpen] = useState(false);
  const [selectedModelForExpert, setSelectedModelForExpert] = useState<ModelData | null>(null);

  const currentQuestion = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

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
        const [minSize, maxSize] = answers.size.split('-').map(s => parseInt(s.replace('+', '')) || 1300);
        const modelSize = parseInt(model.area.replace(/[^\d]/g, ''));
        
        if (modelSize >= minSize && modelSize <= (maxSize || 1300)) {
          score += weights.size;
          reasons.push(`Perfect ${modelSize} sqft size match`);
        } else if (Math.abs(modelSize - minSize) <= 100) {
          score += weights.size * 0.7;
          reasons.push(`Close size match (${modelSize} sqft)`);
        }
      }

      // Budget matching
      if (answers.budget) {
        const budgetRanges = {
          '150-250': [150000, 250000],
          '250-400': [250000, 400000],
          '400-600': [400000, 600000],
          '600+': [600000, 1000000]
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

      // Purpose matching
      if (answers.purpose) {
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
    const insights = [
      `Based on your ${answers.purpose} goal and ${answers.budget} budget`,
      `${answers.size} sqft range is perfect for ${answers.bedrooms} bedroom layout`,
      `Your ${answers.urgency} timeline allows for ${answers.urgency === 'asap' ? 'pre-designed' : 'customizable'} options`
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
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Calculate and show results
      const recs = calculateRecommendations();
      setRecommendations(recs);
      setShowResults(true);
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

  if (showResults && recommendations) {
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
          <div className="px-8 py-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-0.5">
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                      <img 
                        src={seattleAduLogo} 
                        alt="Seattle ADU" 
                        className="w-8 h-8 object-contain filter brightness-110"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className={`text-2xl bg-gradient-to-r bg-clip-text text-transparent ${
                    isDark 
                      ? 'from-white via-cyan-100 to-blue-100' 
                      : 'from-slate-800 via-slate-700 to-slate-600'
                  }`}>
                    Your Perfect ADU Matches
                  </h1>
                  <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Based on your preferences and goals
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleTheme}
                  className={`${
                    isDark 
                      ? 'bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50' 
                      : 'bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50/80'
                  } backdrop-blur-sm`}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => onComplete(recommendations, { 
                    fullName: answers.fullName || '', 
                    address: answers.address || '' 
                  })}
                  className={`${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50'
                      : 'bg-white/50 border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Continue to Browse
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-8">
          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card 
              className="p-6"
              style={{
                borderRadius: '20px',
                background: isDark 
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)',
                backdropFilter: 'blur(40px)',
                border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)'}`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Key Insights
                </h3>
              </div>
              <div className="space-y-2">
                {recommendations.insights.map((insight, index) => (
                  <p key={index} className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    • {insight}
                  </p>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Top Matches */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recommendations.matches.map((match, index) => (
              <motion.div
                key={match.model.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card 
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden h-full"
                  style={{
                    borderRadius: '16px',
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 182, 212, 0.15)'}`
                  }}
                  onClick={() => onModelSelect(match.model.id)}
                >
                  {/* Match Score Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-lg px-3 py-1"
                    >
                      {match.score}% Match
                    </Badge>
                  </div>

                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={match.model.heroImage}
                      alt={match.model.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    
                    {/* Price */}
                    <div className="absolute bottom-4 left-4">
                      <Badge className={`${
                        isDark ? 'bg-black/60 text-cyan-400 border-cyan-400/50' : 'bg-white/80 text-cyan-600 border-cyan-600/50'
                      } text-sm`}>
                        ${(match.model.basePrice || 0).toLocaleString()}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {match.model.name}
                    </h3>
                    
                    {/* Quick Stats */}
                    <div className={`flex items-center gap-4 text-sm mb-4 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <span>{match.model.area}</span>
                      <span>•</span>
                      <span>{match.model.bedrooms}BR/{match.model.bathrooms}BA</span>
                    </div>

                    {/* Why It Matches */}
                    <div className="mb-4">
                      <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Why it's perfect:
                      </h4>
                      <div className="space-y-1">
                        {match.reasons.map((reason, reasonIndex) => (
                          <div key={reasonIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              {reason}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onModelSelect(match.model.id);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View 360°
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`flex-1 text-xs ${
                          isDark
                            ? 'bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50'
                            : 'bg-white/50 border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModelForExpert(match.model);
                          setExpertDialogOpen(true);
                        }}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Ask Expert
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Card 
              className="p-8"
              style={{
                borderRadius: '20px',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)',
                backdropFilter: 'blur(40px)',
                border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)'}`
              }}
            >
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Ready to Move Forward?
              </h3>
              <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Browse our complete collection or speak with an ADU specialist to refine your choices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400"
                  onClick={() => onComplete(recommendations, { 
                    fullName: answers.fullName || '', 
                    address: answers.address || '' 
                  })}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explore All Models
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50'
                      : 'bg-white/50 border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    setSelectedModelForExpert(null);
                    setExpertDialogOpen(true);
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

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
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${
                        isDark ? 'bg-slate-900' : 'bg-white'
                      } shadow-xl`}>
                        <img 
                          src={seattleAduLogo} 
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
                    ✨ Find Your Perfect ADU
                  </motion.h1>
                  <motion.p 
                    className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-lg`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    🎯 Answer a few questions to get personalized recommendations
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
                  className={`rounded-2xl border-2 transition-all duration-300 ${
                    isDark 
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
                  className={`rounded-2xl px-6 py-2 transition-all duration-300 ${
                    isDark 
                      ? 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50' 
                      : 'text-slate-600 hover:text-cyan-600 hover:bg-slate-100/50'
                  } backdrop-blur-sm`}
                >
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Skip for now →
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
              {/* Progress Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-500/10 text-cyan-600'
                  }`}>
                    <span className="text-sm">{currentStep + 1}</span>
                  </div>
                  <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Question {currentStep + 1} of {ONBOARDING_STEPS.length}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-500'}`} />
                  <span className={`${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>
                    {Math.round(progress)}% complete
                  </span>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className={`w-full h-3 rounded-full overflow-hidden ${
                  isDark ? 'bg-slate-800/50' : 'bg-slate-200/50'
                } backdrop-blur-sm`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </motion.div>
                </div>
                
                {/* Progress dots */}
                <div className="flex justify-between absolute -top-1 left-0 right-0">
                  {Array.from({ length: ONBOARDING_STEPS.length }).map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index <= currentStep 
                          ? 'bg-cyan-400 shadow-lg' 
                          : isDark ? 'bg-slate-600' : 'bg-slate-300'
                      }`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: index <= currentStep ? 1.2 : 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Question Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isAnimating ? 0 : 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="p-8"
              style={{
                borderRadius: '20px',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)',
                backdropFilter: 'blur(40px)',
                border: `1px solid ${isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)'}`
              }}
            >
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {currentQuestion.title}
                </h2>
                <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Input Field for Personal Info */}
              {currentQuestion.type === 'input' && (
                <div className="mb-8 space-y-4">
                  <div>
                    <label className={`block font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={answers.fullName || ''}
                      onChange={(e) => setAnswers(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      className={`w-full p-4 rounded-xl border transition-all duration-300 ${
                        isDark 
                          ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20' 
                          : 'bg-white/80 border-slate-300 text-slate-800 placeholder-slate-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Property Address *
                    </label>
                    <input
                      type="text"
                      value={answers.address || ''}
                      onChange={(e) => setAnswers(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter the address where you plan to build your ADU"
                      className={`w-full p-4 rounded-xl border transition-all duration-300 ${
                        isDark 
                          ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20' 
                          : 'bg-white/80 border-slate-300 text-slate-800 placeholder-slate-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20'
                      }`}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Options */}
              {currentQuestion.options && (
                <div className={`grid gap-4 mb-8 ${
                  currentQuestion.options && currentQuestion.options.length <= 4 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                {currentQuestion.options?.map((option) => {
                  const isSelected = currentQuestion.type === 'multiple'
                    ? (answers[currentQuestion.field] as string[])?.includes(option.id)
                    : answers[currentQuestion.field] === (option.value ?? option.id);
                  
                  const Icon = option.icon;
                  
                  return (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`p-6 cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? `ring-2 ${isDark ? 'ring-cyan-400/50 bg-cyan-500/10' : 'ring-cyan-500/50 bg-cyan-50'}`
                            : `hover:scale-105 ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`
                        }`}
                        style={{
                          borderRadius: '16px',
                          background: isSelected 
                            ? isDark
                              ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)'
                              : 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)'
                            : isDark
                              ? 'rgba(30, 41, 59, 0.6)'
                              : 'rgba(255, 255, 255, 0.8)',
                          border: `1px solid ${
                            isSelected 
                              ? isDark ? 'rgba(6, 182, 212, 0.5)' : 'rgba(6, 182, 212, 0.3)'
                              : isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.5)'
                          }`
                        }}
                        onClick={() => handleAnswer(option.value ?? option.id)}
                      >
                        <div className="flex items-center gap-4">
                          {Icon && (
                            <div className={`p-3 rounded-full ${
                              isSelected 
                                ? 'bg-cyan-500/20' 
                                : isDark ? 'bg-slate-600/50' : 'bg-slate-100'
                            }`}>
                              <Icon className={`w-6 h-6 ${
                                isSelected 
                                  ? 'text-cyan-400' 
                                  : isDark ? 'text-slate-300' : 'text-slate-600'
                              }`} />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className={`font-medium mb-1 ${
                              isDark ? 'text-white' : 'text-slate-800'
                            }`}>
                              {option.label}
                            </h3>
                            {option.description && (
                              <p className={`text-sm ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                {option.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-6 h-6 text-cyan-400" />
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
                </div>
              )}

              {/* Multiple selection hint */}
              {currentQuestion.type === 'multiple' && (
                <div className="text-center mb-6">
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {currentQuestion.field === 'priorities' 
                      ? `Select up to 3 priorities (${(answers[currentQuestion.field] as string[])?.length || 0}/3 selected)`
                      : 'Select all that apply'
                    }
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 disabled:opacity-50'
                      : 'bg-white/50 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <Button
                  onClick={nextStep}
                  disabled={!canContinue}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get My Matches' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Expert Contact Dialog */}
      <ExpertContactDialog
        open={expertDialogOpen}
        onClose={() => {
          setExpertDialogOpen(false);
          setSelectedModelForExpert(null);
        }}
        model={selectedModelForExpert || undefined}
        isDark={isDark}
      />
    </div>
  );
}