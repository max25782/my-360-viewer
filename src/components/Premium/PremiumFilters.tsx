'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PremiumFiltersProps {
  houses?: Array<{
    id: string;
    name: string;
    availableRooms: string[];
    squareFeet?: number;
    filters?: {
      bedrooms?: string;
      bathrooms?: string;
      sqft?: string;
    };
    comparison?: {
      features?: {
        [key: string]: {
          good: string;
          better: string;
          best: string;
        }
      }
    };
  }>;
  className?: string;
}

export default function PremiumFilters({ houses = [], className = '' }: PremiumFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get parameters from URL
  const bedroomsParam = searchParams.get('bedrooms');
  const bathroomsParam = searchParams.get('bathrooms');
  const sqftMinParam = searchParams.get('sqftMin');
  const sqftMaxParam = searchParams.get('sqftMax');
  const featuresParam = searchParams.get('features');
  const styleParam = searchParams.get('style');
  
  // Filter states
  const [bedrooms, setBedrooms] = useState<string>(bedroomsParam || 'any');
  const [bathrooms, setBathrooms] = useState<string>(bathroomsParam || 'any');
  const [sqftRange, setSqftRange] = useState<[number, number]>([
    sqftMinParam ? parseInt(sqftMinParam) : 2200,
    sqftMaxParam ? parseInt(sqftMaxParam) : 3300
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    featuresParam ? featuresParam.split(',') : []
  );
  const [selectedStyle, setSelectedStyle] = useState<string>(styleParam || 'any');
  const [isFiltersActive, setIsFiltersActive] = useState<boolean>(false);
  
  // Get unique filter values
  const getBedroomOptions = () => {
    // Предустановленные опции для спален согласно требованиям
    return ["4 Bedrooms", "5 Bedrooms"];
  };
  
  const getBathroomOptions = () => {
    // Предустановленные опции для ванных согласно требованиям
    return ["3 Bathrooms", "3.5 Bathrooms", "4 Bathrooms"];
  };
  
  const getSqftRange = () => {
    // Предустановленный диапазон площадей согласно требованиям
    return [2200, 3300];
  };
  
  const getAvailableFeatures = () => {
    // Предустановленные особенности для Premium домов согласно требованиям
    return [
      'Garage',
      'Office',
      'Primary Suite',
      'Kitchen Island',
      'Extra Storage',
      'Covered Patio',
      'Covered Porch',
      'Bonus Room',
      'Covered Deck'
    ];
  };

  const getStyleOptions = () => {
    // Предустановленные стили для премиум-домов
    return ['Contemporary', 'Modern', 'Traditional', 'Transitional'];
  };
  
  // Computed values
  const bedroomOptions = getBedroomOptions();
  const bathroomOptions = getBathroomOptions();
  const [minSqft, maxSqft] = getSqftRange();
  const availableFeatures = getAvailableFeatures();
  const styleOptions = getStyleOptions();
  
  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Bedrooms
    if (bedrooms && bedrooms !== 'any') {
      params.set('bedrooms', bedrooms);
    } else {
      params.delete('bedrooms');
    }
    
    // Bathrooms
    if (bathrooms && bathrooms !== 'any') {
      params.set('bathrooms', bathrooms);
    } else {
      params.delete('bathrooms');
    }
    
    // Square footage
    if (sqftRange[0] > minSqft) {
      params.set('sqftMin', sqftRange[0].toString());
    } else {
      params.delete('sqftMin');
    }
    
    if (sqftRange[1] < maxSqft) {
      params.set('sqftMax', sqftRange[1].toString());
    } else {
      params.delete('sqftMax');
    }
    
    // Features
    if (selectedFeatures.length > 0) {
      params.set('features', selectedFeatures.join(','));
    } else {
      params.delete('features');
    }
    
    // Style
    if (selectedStyle && selectedStyle !== 'any') {
      params.set('style', selectedStyle);
    } else {
      params.delete('style');
    }
    
    // Update URL
    router.push(`/premium?${params.toString()}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setBedrooms('any');
    setBathrooms('any');
    setSqftRange([2200, 3300]);
    setSelectedFeatures([]);
    setSelectedStyle('any');
    router.push('/premium');
  };
  
  // Toggle feature selection
  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  // Check if filters are active
  useEffect(() => {
    const hasActiveFilters = 
      bedrooms !== 'any' || 
      bathrooms !== 'any' || 
      sqftRange[0] > minSqft || 
      sqftRange[1] < maxSqft || 
      selectedFeatures.length > 0 ||
      selectedStyle !== 'any';
    
    setIsFiltersActive(hasActiveFilters);
  }, [bedrooms, bathrooms, sqftRange, selectedFeatures, selectedStyle, minSqft, maxSqft]);
  
  return (
    <div className={`bg-slate-700 rounded-lg p-6 shadow-lg ${className}`}>
      <h2 className="text-xl font-semibold text-white mb-4">Filter Premium Homes</h2>
      
      <div className="space-y-6">
        {/* Bedrooms Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Bedrooms
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                bedrooms === 'any' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
              }`}
              onClick={() => setBedrooms('any')}
            >
              Any
            </button>
            {bedroomOptions.map(option => (
              <button
                key={option}
                className={`px-3 py-1 rounded-full text-sm ${
                  bedrooms === option 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
                }`}
                onClick={() => setBedrooms(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        {/* Bathrooms Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Bathrooms
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                bathrooms === 'any' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
              }`}
              onClick={() => setBathrooms('any')}
            >
              Any
            </button>
            {bathroomOptions.map(option => (
              <button
                key={option}
                className={`px-3 py-1 rounded-full text-sm ${
                  bathrooms === option 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
                }`}
                onClick={() => setBathrooms(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        {/* Square Footage Range */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Square Footage: {sqftRange[0]} - {sqftRange[1]} sq ft
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Min</label>
              <input
                type="range"
                min={minSqft}
                max={maxSqft}
                step="100"
                value={sqftRange[0]}
                onChange={(e) => setSqftRange([parseInt(e.target.value), sqftRange[1]])}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Max</label>
              <input
                type="range"
                min={minSqft}
                max={maxSqft}
                step="100"
                value={sqftRange[1]}
                onChange={(e) => setSqftRange([sqftRange[0], parseInt(e.target.value)])}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Style Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Architectural Style
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                selectedStyle === 'any' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
              }`}
              onClick={() => setSelectedStyle('any')}
            >
              Any
            </button>
            {styleOptions.map(style => (
              <button
                key={style}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedStyle === style 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
                }`}
                onClick={() => setSelectedStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        
        {/* Features Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Features
          </label>
          <div className="flex flex-wrap gap-2">
            {availableFeatures.map(feature => (
              <button
                key={feature}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedFeatures.includes(feature) 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
                }`}
                onClick={() => toggleFeature(feature)}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-2">
          <button
            onClick={resetFilters}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              isFiltersActive 
                ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                : 'bg-slate-800 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isFiltersActive}
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}