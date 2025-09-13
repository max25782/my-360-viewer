import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { 
  ArrowLeft, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Play,
  Pause,
  Settings,
  Palette,
  Home,
  Wrench,
  Calculator,
  Save,
  Share2,
  Download,
  Layers3,
  PaintBucket,
  Sofa,
  Lightbulb,
  Shield,
  Snowflake,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModelData, ExteriorOption, InteriorDesign } from '../data/realModelsData';
import { Virtual360Viewer } from './Virtual360Viewer';
import { PriceCalculator } from './PriceCalculator';
import { AdvancedMaterialSelector } from './AdvancedMaterialSelector';
import { InteriorFinishSelector } from './InteriorFinishSelector';
const seattleAduLogo = '/logo.png';

interface ModelConfiguratorProps {
  model: ModelData;
  onBack: () => void;
  onSaveConfiguration: (config: ConfigurationState) => void;
}

interface ConfigurationState {
  floorPlan: string;
  exteriorOptions: {
    siding: string;
    roofing: string;
    windows: string;
    doors: string;
    trim: string;
  };
  interiorDesign: string;
  upgrades: {
    smartHome: boolean;
    solarPanels: boolean;
    premiumAppliances: boolean;
    luxuryFlooring: boolean;
    customLighting: boolean;
    climateControl: boolean;
    securitySystem: boolean;
    energyEfficiency: boolean;
  };
  customizations: {
    exteriorColors: {
      primary: string;
      accent: string;
      trim: string;
    };
    interiorColors: {
      walls: string;
      cabinets: string;
      countertops: string;
    };
  };
  totalPrice: number;
  basePrice: number;
  exteriorOptionsTotal?: number;
  upgradesTotal?: number;
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  permitFees?: number;
  deliveryFee?: number;
  installationFee?: number;
}

export function ModelConfigurator({ model, onBack, onSaveConfiguration }: ModelConfiguratorProps) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [activeTab, setActiveTab] = useState('floorplan');
  const [isPlaying360, setIsPlaying360] = useState(false);
  const [viewerRotation, setViewerRotation] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const [configuration, setConfiguration] = useState<ConfigurationState>({
    floorPlan: model.floorPlans?.[0]?.id || '',
    exteriorOptions: {
      siding: model.exteriorOptions?.find(opt => opt.type === 'Siding')?.id || '',
      roofing: model.exteriorOptions?.find(opt => opt.type === 'Roofing')?.id || '',
      windows: model.exteriorOptions?.find(opt => opt.type === 'Windows')?.id || '',
      doors: model.exteriorOptions?.find(opt => opt.type === 'Doors')?.id || '',
      trim: model.exteriorOptions?.find(opt => opt.type === 'Trim')?.id || '',
    },
    interiorDesign: model.interiorDesigns?.[0]?.id || '',
    upgrades: {
      smartHome: false,
      solarPanels: false,
      premiumAppliances: false,
      luxuryFlooring: false,
      customLighting: false,
      climateControl: false,
      securitySystem: false,
      energyEfficiency: false,
    },
    customizations: {
      exteriorColors: {
        primary: '#4A5568',
        accent: '#2D3748',
        trim: '#FFFFFF',
      },
      interiorColors: {
        walls: '#F7FAFC',
        cabinets: '#2D3748',
        countertops: '#E2E8F0',
      },
    },
    totalPrice: model.basePrice,
    basePrice: model.basePrice,
  });

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  useEffect(() => {
    // Calculate detailed price breakdown
    let subtotal = configuration.basePrice;
    let exteriorOptionsTotal = 0;
    let upgradesTotal = 0;
    
    // Add exterior options pricing
    Object.values(configuration.exteriorOptions).forEach(optionId => {
      const option = model.exteriorOptions?.find(opt => opt.id === optionId);
      if (option && option.price) {
        exteriorOptionsTotal += option.price;
      }
    });

    // Add upgrades pricing
    const upgradePricing = {
      smartHome: 8500,
      solarPanels: 15000,
      premiumAppliances: 6500,
      luxuryFlooring: 4500,
      customLighting: 2800,
      climateControl: 3200,
      securitySystem: 2100,
      energyEfficiency: 5500,
    };

    // Add interior design pricing
    const selectedInteriorDesign = model.interiorDesigns.find(design => design.id === configuration.interiorDesign);
    const interiorDesignAdjustment = selectedInteriorDesign?.priceAdjustment || 0;

    Object.entries(configuration.upgrades).forEach(([upgrade, enabled]) => {
      if (enabled) {
        upgradesTotal += upgradePricing[upgrade as keyof typeof upgradePricing];
      }
    });

    subtotal = configuration.basePrice + exteriorOptionsTotal + interiorDesignAdjustment + upgradesTotal;
    const taxRate = 0.0875; // 8.75% tax rate
    const taxAmount = Math.round(subtotal * taxRate);
    const permitFees = 2500;
    const deliveryFee = 3500;
    const installationFee = 4500;
    const totalPrice = subtotal + taxAmount + permitFees + deliveryFee + installationFee;

    setConfiguration(prev => ({ 
      ...prev, 
      totalPrice,
      exteriorOptionsTotal,
      upgradesTotal,
      subtotal,
      taxRate,
      taxAmount,
      permitFees,
      deliveryFee,
      installationFee
    }));
  }, [configuration.exteriorOptions, configuration.upgrades, configuration.basePrice, model.exteriorOptions]);

  const getCollectionColors = () => {
    switch (model.collection) {
      case 'skyline': return {
        border: '#00E5FF',
        gradient: 'from-cyan-500/20 to-blue-500/20',
        accent: 'text-cyan-400',
        bg: 'bg-cyan-500/10'
      };
      case 'neo': return {
        border: '#FF2AAF',
        gradient: 'from-purple-500/20 to-pink-500/20',
        accent: 'text-purple-400',
        bg: 'bg-purple-500/10'
      };
      case 'premier': return {
        border: '#FFA726',
        gradient: 'from-amber-500/20 to-orange-500/20',
        accent: 'text-amber-400',
        bg: 'bg-amber-500/10'
      };
      default: return {
        border: '#00E5FF',
        gradient: 'from-cyan-500/20 to-blue-500/20',
        accent: 'text-cyan-400',
        bg: 'bg-cyan-500/10'
      };
    }
  };

  const colors = getCollectionColors();

  const handleExteriorOptionChange = (type: string, optionId: string) => {
    setConfiguration(prev => ({
      ...prev,
      exteriorOptions: {
        ...prev.exteriorOptions,
        [type.toLowerCase()]: optionId
      }
    }));
  };

  const handleUpgradeToggle = (upgrade: keyof ConfigurationState['upgrades']) => {
    setConfiguration(prev => ({
      ...prev,
      upgrades: {
        ...prev.upgrades,
        [upgrade]: !prev.upgrades[upgrade]
      }
    }));
  };

  const upgradeOptions = [
    {
      id: 'smartHome',
      name: 'Smart Home Package',
      description: 'Automated lighting, climate, and security controls',
      price: 8500,
      icon: Zap,
      category: 'Technology'
    },
    {
      id: 'solarPanels',
      name: 'Solar Panel System',
      description: '8kW solar system with battery backup',
      price: 15000,
      icon: Lightbulb,
      category: 'Energy'
    },
    {
      id: 'premiumAppliances',
      name: 'Premium Appliances',
      description: 'High-end kitchen and laundry appliances',
      price: 6500,
      icon: Home,
      category: 'Kitchen'
    },
    {
      id: 'luxuryFlooring',
      name: 'Luxury Flooring',
      description: 'Hardwood floors throughout living areas',
      price: 4500,
      icon: Layers3,
      category: 'Flooring'
    },
    {
      id: 'customLighting',
      name: 'Custom Lighting',
      description: 'Designer fixtures and LED accent lighting',
      price: 2800,
      icon: Lightbulb,
      category: 'Lighting'
    },
    {
      id: 'climateControl',
      name: 'Climate Control',
      description: 'Multi-zone HVAC with smart thermostats',
      price: 3200,
      icon: Snowflake,
      category: 'HVAC'
    },
    {
      id: 'securitySystem',
      name: 'Security System',
      description: 'Smart locks, cameras, and alarm system',
      price: 2100,
      icon: Shield,
      category: 'Security'
    },
    {
      id: 'energyEfficiency',
      name: 'Energy Efficiency',
      description: 'Enhanced insulation and energy-star windows',
      price: 5500,
      icon: Lightbulb,
      category: 'Efficiency'
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Enhanced futuristic background */}
      <div 
        className="fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(0, 229, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(255, 42, 175, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, #0B0F14 0%, #111927 25%, #1e293b 50%, #334155 75%, #0B0F14 100%)
          `
        }}
      />
      
      {/* Animated grid pattern */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 30s linear infinite'
        }}
      />

      {/* App Bar */}
      <motion.div 
        className="relative z-10 flex items-center justify-between px-8 py-6"
        style={{
          borderBottom: '1px solid #223043',
          backdropFilter: 'blur(20px)',
          background: 'rgba(11, 15, 20, 0.8)'
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="w-8 h-8 relative">
            <img 
              src={seattleAduLogo} 
              alt="Seattle ADU" 
              className="w-full h-full object-contain filter brightness-110"
            />
          </div>
        </div>

        {/* Center: Model Name + Configurator Title */}
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-white font-semibold tracking-wide" style={{ fontSize: '1.25rem' }}>
            {model.name} Configurator
          </h1>
          <p className="text-slate-400 text-sm">
            Customize your perfect ADU
          </p>
        </motion.div>

        {/* Right: Price + Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-slate-400 text-sm">Total Price</p>
            <p className={`font-bold text-xl ${colors.accent}`}>
              ${configuration.totalPrice.toLocaleString()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 rounded-full w-10 h-10 p-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Main Content - Split Layout for iPad */}
      <div 
        className="relative z-10 flex-1"
        style={{
          maxWidth: isLandscape ? '1194px' : '834px',
          margin: '0 auto',
          paddingLeft: isLandscape ? '40px' : '32px',
          paddingRight: isLandscape ? '40px' : '32px'
        }}
      >
        <div className={`py-8 ${isLandscape ? 'grid grid-cols-2 gap-8' : 'space-y-8'}`}>
          {/* Left Panel: 360° Viewer */}
          <motion.div
            className="space-y-6"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* 360° Viewer */}
            <Virtual360Viewer 
              imageUrl={model.heroImage}
              modelName={model.name}
              view360Url={model.view360Url}
              category={model.collection || 'skyline'}
              slug={model.id || ''}
            />

            {/* Price Calculator */}
            <PriceCalculator 
              priceBreakdown={{
                basePrice: configuration.basePrice,
                floorPlanAdjustment: 0,
                exteriorOptionsTotal: configuration.exteriorOptionsTotal || 0,
                interiorDesignAdjustment: configuration.interiorDesignAdjustment || 0,
                upgradesTotal: configuration.upgradesTotal || 0,
                subtotal: configuration.subtotal || configuration.totalPrice,
                taxRate: configuration.taxRate || 0.0875,
                taxAmount: configuration.taxAmount || 0,
                permitFees: configuration.permitFees || 2500,
                deliveryFee: configuration.deliveryFee || 3500,
                installationFee: configuration.installationFee || 4500,
                totalPrice: configuration.totalPrice
              }}
              collectionColors={colors}
            />

            {/* Action Buttons */}
            <Card 
              className="p-6"
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                backdropFilter: 'blur(40px)',
                border: `1px solid ${colors.border}30`
              }}
            >
              <div className="space-y-3">
                <Button
                  onClick={() => onSaveConfiguration(configuration)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400"
                  style={{ borderRadius: '12px' }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full bg-slate-800/50 border-slate-600/50 text-white hover:border-cyan-400/50"
                  style={{ borderRadius: '12px' }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Specs
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Right Panel: Configuration Options */}
          <motion.div
            className="space-y-6"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-900/40 border border-slate-600/30 rounded-xl p-1">
                <TabsTrigger 
                  value="floorplan"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-400"
                >
                  Floor Plan
                </TabsTrigger>
                <TabsTrigger 
                  value="exterior"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-400"
                >
                  Exterior Options
                </TabsTrigger>
                <TabsTrigger 
                  value="interior"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-400"
                >
                  Interior Finishes
                </TabsTrigger>
                <TabsTrigger 
                  value="upgrades"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-400"
                >
                  Upgrades
                </TabsTrigger>
              </TabsList>

              {/* Floor Plan Tab */}
              <TabsContent value="floorplan" className="mt-6">
                <Card 
                  className="p-6"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                    backdropFilter: 'blur(40px)',
                    border: `1px solid ${colors.border}30`
                  }}
                >
                  <h3 className="text-white font-semibold mb-4">Choose Floor Plan</h3>
                  
                  <div className="space-y-4">
                    {model.floorPlans.map((plan) => (
                      <motion.div
                        key={plan.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                          configuration.floorPlan === plan.id 
                            ? 'bg-cyan-500/20 border border-cyan-400/50' 
                            : 'bg-slate-800/30 border border-slate-600/30 hover:border-slate-500/50'
                        }`}
                        onClick={() => setConfiguration(prev => ({ ...prev, floorPlan: plan.id }))}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex gap-4">
                          <img 
                            src={plan.imageUrl}
                            alt={plan.name}
                            className="w-20 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{plan.name}</h4>
                            <p className="text-slate-400 text-sm">{plan.sqft} sq ft</p>
                            {plan.isPopular && (
                              <Badge className="mt-1 bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                                Most Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Exterior Tab */}
              <TabsContent value="exterior" className="mt-6">
                <Card 
                  className="p-0 overflow-hidden"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                    backdropFilter: 'blur(40px)',
                    border: `1px solid ${colors.border}30`,
                    height: 'calc(100vh - 320px)',
                    minHeight: '600px'
                  }}
                >
                  <AdvancedMaterialSelector
                    modelName={model.name}
                    baseImage={model.heroImage}
                    exteriorOptions={model.exteriorOptions}
                    currentSelections={configuration.exteriorOptions}
                    onMaterialChange={handleExteriorOptionChange}
                    collectionColors={colors}
                  />
                </Card>
              </TabsContent>

              {/* Interior Tab */}
              <TabsContent value="interior" className="mt-6">
                <Card 
                  className="p-0 overflow-hidden"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                    backdropFilter: 'blur(40px)',
                    border: `1px solid ${colors.border}30`,
                    height: 'calc(100vh - 320px)',
                    minHeight: '600px'
                  }}
                >
                  <InteriorFinishSelector
                    modelName={model.name}
                    baseImage={model.heroImage}
                    interiorDesigns={model.interiorDesigns}
                    currentSelection={configuration.interiorDesign}
                    onInteriorChange={(designId) => setConfiguration(prev => ({ ...prev, interiorDesign: designId }))}
                    collectionColors={colors}
                  />
                </Card>
              </TabsContent>

              {/* Upgrades Tab */}
              <TabsContent value="upgrades" className="mt-6">
                <div className="space-y-4">
                  {upgradeOptions.map((upgrade) => {
                    const IconComponent = upgrade.icon;
                    const isEnabled = configuration.upgrades[upgrade.id as keyof typeof configuration.upgrades];
                    
                    return (
                      <motion.div
                        key={upgrade.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card 
                          className={`p-4 cursor-pointer transition-all duration-300 ${
                            isEnabled 
                              ? 'bg-cyan-500/20 border border-cyan-400/50' 
                              : 'bg-slate-800/30 border border-slate-600/30 hover:border-slate-500/50'
                          }`}
                          onClick={() => handleUpgradeToggle(upgrade.id as keyof typeof configuration.upgrades)}
                          style={{
                            borderRadius: '16px',
                            background: isEnabled 
                              ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(17, 25, 39, 0.95) 100%)'
                              : 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                            backdropFilter: 'blur(40px)',
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isEnabled ? colors.bg : 'bg-slate-700/50'
                            }`}>
                              <IconComponent className={`w-6 h-6 ${
                                isEnabled ? colors.accent : 'text-slate-400'
                              }`} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-white font-semibold">{upgrade.name}</h4>
                                <div className="flex items-center gap-3">
                                  <span className={`font-bold ${colors.accent}`}>
                                    +${upgrade.price.toLocaleString()}
                                  </span>
                                  <Switch
                                    checked={isEnabled}
                                    onCheckedChange={() => handleUpgradeToggle(upgrade.id as keyof typeof configuration.upgrades)}
                                  />
                                </div>
                              </div>
                              <p className="text-slate-400 text-sm mb-1">{upgrade.description}</p>
                              <Badge 
                                variant="outline" 
                                className="text-xs text-slate-500 border-slate-600"
                              >
                                {upgrade.category}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}