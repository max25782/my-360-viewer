'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface NeoFiltersProps {
  houses: Array<{
    id: string;
    name: string;
    availableRooms: string[];
    squareFeet?: number;
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

export default function NeoFilters({ houses, className = '' }: NeoFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get parameters from URL
  const bedroomsParam = searchParams.get('bedrooms');
  const bathroomsParam = searchParams.get('bathrooms');
  const sqftMinParam = searchParams.get('sqftMin');
  const sqftMaxParam = searchParams.get('sqftMax');
  const featuresParam = searchParams.get('features');
  
  // Filter states
  const [bedrooms, setBedrooms] = useState<string>(bedroomsParam || 'any');
  const [bathrooms, setBathrooms] = useState<string>(bathroomsParam || 'any');
  const [sqftRange, setSqftRange] = useState<[number, number]>([
    sqftMinParam ? parseInt(sqftMinParam) : 300,
    sqftMaxParam ? parseInt(sqftMaxParam) : 1300
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    featuresParam ? featuresParam.split(',') : []
  );
  const [isFiltersActive, setIsFiltersActive] = useState<boolean>(false);
  
  // Get unique filter values
  const getBedroomOptions = () => {
    // Предустановленные опции для спален согласно требованиям
    return ["Studio", "1 Bedroom", "1 Bedroom & Office", "2 Bedrooms"];
  };
  
  const getBathroomOptions = () => {
    // Предустановленные опции для ванных согласно требованиям
    return ["1 Bathroom", "2 Bathrooms"];
  };
  
  // Get min and max square footage
  const getSquareFootRange = () => {
    // Предустановленный диапазон площадей согласно требованиям
    return [300, 1300];
  };
  
  // Get available features from all houses' comparison data and add predefined features
  const getFeatureOptions = () => {
    // Predefined features for Neo houses согласно требованиям
    const predefinedFeatures = [
      "Garage",
      "Office",
      "Primary Suite",
      "Kitchen Island",
      "Extra Storage",
      "Covered Porch"
    ];
    
    return predefinedFeatures;
  };
  
  // Check if any filter is active
  useEffect(() => {
    setIsFiltersActive(
      bedrooms !== 'any' || 
      bathrooms !== 'any' || 
      selectedFeatures.length > 0 ||
      sqftRange[0] !== (sqftMinParam ? parseInt(sqftMinParam) : 300) ||
        sqftRange[1] !== (sqftMaxParam ? parseInt(sqftMaxParam) : 1300) 
    );
  }, [bedrooms, bathrooms, selectedFeatures, sqftRange, sqftMinParam, sqftMaxParam]);
  
  // Handle feature toggle
  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setBedrooms('any');
    setBathrooms('any');
    setSelectedFeatures([]);
    setSqftRange([
      300,
      1300
    ]);
  };
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (bedrooms !== 'any') params.set('bedrooms', bedrooms);
    else params.delete('bedrooms');
    
    if (bathrooms !== 'any') params.set('bathrooms', bathrooms);
    else params.delete('bathrooms');
    
    if (sqftRange[0] !== 300) params.set('sqftMin', sqftRange[0].toString());
    else params.delete('sqftMin');
    
    if (sqftRange[1] !== 1300) params.set('sqftMax', sqftRange[1].toString());
    else params.delete('sqftMax');
    
    if (selectedFeatures.length > 0) params.set('features', selectedFeatures.join(','));
    else params.delete('features');
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [bedrooms, bathrooms, sqftRange, selectedFeatures, router]);
  
  // Get square footage range
  const [minSqft, maxSqft] = getSquareFootRange();
  
  // Handle slider change
  const handleSqftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const isMin = e.target.name === 'sqftMin';
    
    setSqftRange(prev => {
      if (isMin) {
        return [value, prev[1]];
      } else {
        return [prev[0], value];
      }
    });
  };

  return (
    <div className={`bg-slate-500 p-6 rounded-lg shadow-md mb-8 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        {isFiltersActive && (
          <button 
            onClick={resetFilters}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
        {/* Bedrooms filter */}
        <div>
          <h4 className="text-md font-medium  mb-2 text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Bedrooms
            {bedrooms !== 'any' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {bedrooms}
               
              </span>
            )}
          </h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="bedrooms"
                value="any"
                checked={bedrooms === 'any'}
                onChange={() => setBedrooms('any')}
                className="mr-2 accent-blue-500"
              />
              <span>Any</span>
            </label>
            
            {getBedroomOptions().map(option => (
              <label key={`bedroom-${option}`} className="flex items-center">
                <input
                  type="radio"
                  name="bedrooms"
                  value={option}
                  checked={bedrooms === option}
                  onChange={() => setBedrooms(option)}
                  className="mr-2 accent-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Bathrooms filter */}
        <div>
          <h4 className="text-md font-medium mb-2 text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Bathrooms
            {bathrooms !== 'any' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {bathrooms}
              </span>
            )}
          </h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="bathrooms"
                value="any"
                checked={bathrooms === 'any'}
                onChange={() => setBathrooms('any')}
                className="mr-2 accent-blue-500"
              />
              <span>Any</span>
            </label>
            
            {getBathroomOptions().map(option => (
              <label key={`bathroom-${option}`} className="flex items-center">
                <input
                  type="radio"
                  name="bathrooms"
                  value={option}
                  checked={bathrooms === option}
                  onChange={() => setBathrooms(option)}
                  className="mr-2 accent-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Square Feet filter */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-2 text-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
          Square Feet
          {(sqftRange[0] !== 300 || sqftRange[1] !== 1500) && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {sqftRange[0]}-{sqftRange[1]}
            </span>
          )}
        </h4>
        <div className="px-2">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{sqftRange[0]} sq.ft</span>
            <span>{sqftRange[1]} sq.ft</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute h-2 bg-blue-500 rounded-full"
              style={{
                left: `${((sqftRange[0] - minSqft) / (maxSqft - minSqft)) * 100}%`,
                right: `${100 - ((sqftRange[1] - minSqft) / (maxSqft - minSqft)) * 100}%`
              }}
            ></div>
          </div>
          <div className="relative mt-6">
            <input
              type="range"
              name="sqftMin"
              min={minSqft}
              max={maxSqft}
              value={sqftRange[0]}
              onChange={handleSqftChange}
              className="absolute w-full"
              style={{ zIndex: 1 }}
            />
            <input
              type="range"
              name="sqftMax"
              min={minSqft}
              max={maxSqft}
              value={sqftRange[1]}
              onChange={handleSqftChange}
              className="absolute w-full"
              style={{ zIndex: 2 }}
            />
          </div>
        </div>
      </div>
      
      {/* Features filter */}
      {getFeatureOptions().length > 0 && (
        <div className="mt-15">
          <h4 className="text-md font-medium mb-2 text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Features
            {selectedFeatures.length > 0 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {selectedFeatures.length}
              </span>
            )}
          </h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {getFeatureOptions().map(feature => (
              <button
                key={feature}
                onClick={() => toggleFeature(feature)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  selectedFeatures.includes(feature)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {feature}
                {selectedFeatures.includes(feature) && (
                  <span className="ml-1">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Active filters summary */}
      {isFiltersActive && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {bedrooms !== 'any' && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md flex items-center">
                {bedrooms}
                <button onClick={() => setBedrooms('any')} className="ml-1 text-blue-400 hover:text-blue-600">
                  ×
                </button>
              </span>
            )}
            {bathrooms !== 'any' && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md flex items-center">
                {bathrooms}
                <button onClick={() => setBathrooms('any')} className="ml-1 text-blue-400 hover:text-blue-600">
                  ×
                </button>
              </span>
            )}
            {(sqftRange[0] !== 300 || sqftRange[1] !== 1300) && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md flex items-center">
                {sqftRange[0]}-{sqftRange[1]} sq.ft
                <button onClick={() => setSqftRange([300, 1300])} className="ml-1 text-blue-400 hover:text-blue-600">
                  ×
                </button>
              </span>
            )}
            {selectedFeatures.map(feature => (
              <span key={feature} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md flex items-center">
                {feature}
                <button onClick={() => toggleFeature(feature)} className="ml-1 text-blue-400 hover:text-blue-600">
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
