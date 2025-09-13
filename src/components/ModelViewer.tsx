import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  GitCompare, 
  Play, 
  RotateCcw, 
  ZoomIn,
  Home,
  Ruler,
  Building,
  Layers,
  MapPin,
  Calendar,
  Wrench,
  Star,
  Download,
  MessageCircle,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
// import { ModelData } from '../data/realModelsData';
import { Virtual360Viewer } from './Virtual360Viewer';
// import { ImageGallery } from './ImageGallery';
// import { SimilarModels } from './SimilarModels';
// import { REAL_ADU_MODELS } from '../data/realModelsData';

// Локальный интерфейс ModelData для ModelViewer
interface ModelData {
  id: string;
  name: string;
  collection: string;
  basePrice: number;
  heroImage: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  features: string[];
  dimensions?: {
    width: number;
    depth: number;
  };
  stories?: number;
  deliveryTime?: string;
  installationTime?: string;
  lotCompatibility?: string;
  floorPlans?: any[];
  interiorDesigns?: any[];
  specifications?: {
    foundation?: string;
    framing?: string;
    roofing?: string;
    siding?: string;
    windows?: string;
    insulation?: string;
    electrical?: string;
    plumbing?: string;
    flooring?: string;
    appliances?: string[];
  };
}
const seattleAduLogo = '/logo.png';
import { ExpertContactDialog } from './ExpertContactDialog';

interface ModelViewerProps {
  model: ModelData;
  onBack: () => void;
  onCompareToggle: () => void;
  isComparing?: boolean;
  onOpenConfigurator?: () => void;
  onModelSelect: (modelId: string) => void;
}

export function ModelViewer({ model, onBack, onCompareToggle, isComparing = false, onOpenConfigurator, onModelSelect }: ModelViewerProps) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(0);
  const [selectedInteriorDesign, setSelectedInteriorDesign] = useState(0);
  const [expertDialogOpen, setExpertDialogOpen] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

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

  return (
    <div className="min-h-screen relative">

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

        {/* Center: Model Name */}
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-white font-semibold tracking-wide" style={{ fontSize: '1.25rem' }}>
            {model.name}
          </h1>
          <p className="text-slate-400 text-sm">
            {model.collection.charAt(0).toUpperCase() + model.collection.slice(1)} Collection
          </p>
        </motion.div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 rounded-full w-10 h-10 p-0"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 rounded-full w-10 h-10 p-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div 
        className="relative z-10 flex-1"
        style={{
          maxWidth: isLandscape ? '1194px' : '834px',
          margin: '0 auto',
          paddingLeft: isLandscape ? '40px' : '32px',
          paddingRight: isLandscape ? '40px' : '32px'
        }}
      >
        <div className="py-8">
         

          {/* Model Info Tabs */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-900/40 border border-slate-600/30 rounded-xl p-1">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-400"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="floorplans"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-400"
                >
                  Floor Plans
                </TabsTrigger>
                <TabsTrigger 
                  value="interiors"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-400"
                >
                  Interiors
                </TabsTrigger>
                <TabsTrigger 
                  value="specs"
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-slate-400"
                >
                  Specifications
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Key Specs Card */}
                  <Card 
                    className="lg:col-span-2 p-6"
                    style={{
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                      backdropFilter: 'blur(40px)',
                      border: `1px solid ${colors.border}30`
                    }}
                  >
                    <h3 className="text-white font-semibold mb-4" style={{ fontSize: '1.125rem' }}>
                      Key Specifications
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                          <Ruler className={`w-5 h-5 ${colors.accent}`} />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Total Area</p>
                          <p className="text-white font-semibold">{model.area}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                          <Home className={`w-5 h-5 ${colors.accent}`} />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Bedrooms/Bathrooms</p>
                          <p className="text-white font-semibold">{model.bedrooms}BR / {model.bathrooms}BA</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                          <Building className={`w-5 h-5 ${colors.accent}`} />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Dimensions</p>
                          <p className="text-white font-semibold">{model.dimensions?.width || 20}×{model.dimensions?.depth || 30} ft</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                          <Layers className={`w-5 h-5 ${colors.accent}`} />
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Stories</p>
                          <p className="text-white font-semibold">{model.stories || 1} {(model.stories || 1) === 1 ? 'Story' : 'Stories'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <h4 className="text-white font-semibold mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {(model.features || []).slice(0, 6).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <Star className={`w-4 h-4 ${colors.accent}`} />
                          <p className="text-slate-300 text-sm">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Pricing & Actions Card */}
                  <Card 
                    className="p-6"
                    style={{
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                      backdropFilter: 'blur(40px)',
                      border: `1px solid ${colors.border}30`
                    }}
                  >
                    <h3 className="text-white font-semibold mb-4" style={{ fontSize: '1.125rem' }}>
                      Pricing & Timeline
                    </h3>
                    
                    <div className="mb-6">
                      <p className="text-slate-400 text-sm mb-2">Starting Price</p>
                      <p className={`font-bold text-2xl ${colors.accent} mb-4`}>
                        ${(model.basePrice || 150000).toLocaleString()}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-400 text-sm">Delivery</p>
                            <p className="text-white text-sm">{model.deliveryTime || '8-12 weeks'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Wrench className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-400 text-sm">Installation</p>
                            <p className="text-white text-sm">{model.installationTime || '2-3 days'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-slate-400 text-sm">Lot Compatibility</p>
                            <p className="text-white text-sm">{model.lotCompatibility || 'Most residential lots'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        onClick={onCompareToggle}
                        variant="outline"
                        className={`w-full ${
                          isComparing 
                            ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-400' 
                            : 'bg-slate-800/50 border-slate-600/50 text-white hover:border-cyan-400/50'
                        }`}
                        style={{ borderRadius: '12px' }}
                      >
                        <GitCompare className="w-4 h-4 mr-2" />
                        {isComparing ? 'Remove from Compare' : 'Add to Compare'}
                      </Button>
                      
                      <Button
                        onClick={onOpenConfigurator}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400"
                        style={{ borderRadius: '12px' }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure & Customize
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full bg-slate-800/50 border-slate-600/50 text-white hover:border-cyan-400/50"
                        style={{ borderRadius: '12px' }}
                        onClick={() => setExpertDialogOpen(true)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Request Quote
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
                </div>
              </TabsContent>

              {/* Floor Plans Tab */}
              <TabsContent value="floorplans" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(model.floorPlans || []).map((plan: any, index: number) => (
                    <Card 
                      key={plan.id}
                      className={`p-6 cursor-pointer transition-all duration-300 ${
                        selectedFloorPlan === index ? 'ring-2 ring-cyan-400/50' : ''
                      }`}
                      onClick={() => setSelectedFloorPlan(index)}
                      style={{
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                        backdropFilter: 'blur(40px)',
                        border: `1px solid ${colors.border}30`
                      }}
                    >
                      <img 
                        src={plan.imageUrl}
                        alt={plan.name}
                        className="w-full aspect-video object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-white font-semibold mb-2">{plan.name}</h3>
                      <p className="text-slate-400 text-sm">{plan.sqft} sq ft</p>
                      {plan.isPopular && (
                        <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-400/30">
                          Most Popular
                        </Badge>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Interiors Tab */}
              <TabsContent value="interiors" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(model.interiorDesigns || []).map((design: any, index: number) => (
                    <Card 
                      key={design.id}
                      className={`p-6 cursor-pointer transition-all duration-300 ${
                        selectedInteriorDesign === index ? 'ring-2 ring-cyan-400/50' : ''
                      }`}
                      onClick={() => setSelectedInteriorDesign(index)}
                      style={{
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                        backdropFilter: 'blur(40px)',
                        border: `1px solid ${colors.border}30`
                      }}
                    >
                      <img 
                        src={design.imageUrl}
                        alt={design.name}
                        className="w-full aspect-video object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-white font-semibold mb-2">{design.name}</h3>
                      <p className="text-slate-400 text-sm">{design.style} Style</p>
                      {design.isPreferred && (
                        <Badge className="mt-2 bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
                          Recommended
                        </Badge>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specs" className="mt-6">
                <Card 
                  className="p-6"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(17, 25, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                    backdropFilter: 'blur(40px)',
                    border: `1px solid ${colors.border}30`
                  }}
                >
                  <h3 className="text-white font-semibold mb-6" style={{ fontSize: '1.125rem' }}>
                    Detailed Specifications
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-4">Construction</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-slate-400 text-sm">Foundation</p>
                          <p className="text-white">{model.specifications?.foundation || 'Concrete slab'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Framing</p>
                          <p className="text-white">{model.specifications?.framing || 'Wood frame'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Roofing</p>
                          <p className="text-white">{model.specifications?.roofing || 'Composition shingles'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Siding</p>
                          <p className="text-white">{model.specifications?.siding || 'Fiber cement'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Windows</p>
                          <p className="text-white">{model.specifications?.windows || 'Double-pane vinyl'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Insulation</p>
                          <p className="text-white">{model.specifications?.insulation || 'R-15 walls, R-30 ceiling'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-4">Systems & Finishes</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-slate-400 text-sm">Electrical</p>
                          <p className="text-white">{model.specifications?.electrical || '200-amp panel'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Plumbing</p>
                          <p className="text-white">{model.specifications?.plumbing || 'PEX supply lines'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Flooring</p>
                          <p className="text-white">{model.specifications?.flooring || 'Luxury vinyl plank'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Appliances</p>
                          <div className="space-y-1">
                            {(model.specifications?.appliances || []).map((appliance: string, index: number) => (
                              <p key={index} className="text-white text-sm">• {appliance}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Similar Models Section - временно отключено */}
            {/* <SimilarModels 
              currentModel={model}
              allModels={[]} // Заглушка - нужно передавать из родительского компонента
              onModelSelect={onModelSelect}
              onStartConfiguration={(modelId) => {
                // First set the model, then open configurator
                onModelSelect(modelId);
                onOpenConfigurator?.();
              }}
              likedModels={[]} // We'll need to pass this from parent or manage state here
              onToggleLike={(modelId) => {
                // Handle like toggle
                console.log('Toggle like:', modelId);
              }}
            /> */}
          </motion.div>
        </div>
      </div>

      {/* Expert Contact Dialog */}
      <ExpertContactDialog
        open={expertDialogOpen}
        onClose={() => setExpertDialogOpen(false)}
        model={model}
        isDark={true}
      />
    </div>
  );
}