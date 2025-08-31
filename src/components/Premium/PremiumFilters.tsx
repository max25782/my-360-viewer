'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPremiumFilterOptions } from '@/utils/clientPremiumAssets';

interface PremiumFiltersProps {
  className?: string;
}

export default function PremiumFilters({ className = '' }: PremiumFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for filters
  const [bedrooms, setBedrooms] = useState<string>(searchParams?.get('bedrooms') || 'any');
  const [bathrooms, setBathrooms] = useState<string>(searchParams?.get('bathrooms') || 'any');
  const [sqftMin, setSqftMin] = useState<string>(searchParams?.get('sqftMin') || '');
  const [sqftMax, setSqftMax] = useState<string>(searchParams?.get('sqftMax') || '');
  
  // Options for filters based on available houses
  const [bedroomOptions, setBedroomOptions] = useState<string[]>([]);
  const [bathroomOptions, setBathroomOptions] = useState<string[]>([]);
  const [sqftRange, setSqftRange] = useState<{min: number, max: number}>({ min: 1500, max: 3500 });
  
  // Load options from houses data
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const options = await getPremiumFilterOptions();
        
        setBedroomOptions(options.bedrooms);
        setBathroomOptions(options.bathrooms);
        setSqftRange(options.sqftRange);
        
        // Initialize range inputs if not already set
        if (!sqftMin) setSqftMin(options.sqftRange.min.toString());
        if (!sqftMax) setSqftMax(options.sqftRange.max.toString());
        
      } catch (error) {
        console.error('Failed to load filter options:', error);
        // Set default options if loading fails
        setBedroomOptions(['2', '3', '4']);
        setBathroomOptions(['2', '2.5', '3', '3.5']);
        setSqftRange({ min: 1500, max: 3500 });
      }
    }
    
    loadFilterOptions();
  }, []);
  
  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());
    
    // Update params with current filter values
    if (bedrooms && bedrooms !== 'any') {
      params.set('bedrooms', bedrooms);
    } else {
      params.delete('bedrooms');
    }
    
    if (bathrooms && bathrooms !== 'any') {
      params.set('bathrooms', bathrooms);
    } else {
      params.delete('bathrooms');
    }
    
    if (sqftMin && parseInt(sqftMin) > sqftRange.min) {
      params.set('sqftMin', sqftMin);
    } else {
      params.delete('sqftMin');
    }
    
    if (sqftMax && parseInt(sqftMax) < sqftRange.max) {
      params.set('sqftMax', sqftMax);
    } else {
      params.delete('sqftMax');
    }
    
    // Create URL with updated params
    const url = `/premium?${params.toString()}`;
    
    // Navigate to filtered URL
    router.replace(url);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setBedrooms('any');
    setBathrooms('any');
    setSqftMin(sqftRange.min.toString());
    setSqftMax(sqftRange.max.toString());
    
    // Clear URL params
    router.replace('/premium');
  };
  
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
            Square Footage: {sqftMin} - {sqftMax} sq ft
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Min</label>
              <input
                type="range"
                min={sqftRange.min}
                max={sqftRange.max}
                step="100"
                value={sqftMin}
                onChange={(e) => setSqftMin(e.target.value)}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Max</label>
              <input
                type="range"
                min={sqftRange.min}
                max={sqftRange.max}
                step="100"
                value={sqftMax}
                onChange={(e) => setSqftMax(e.target.value)}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm transition-colors"
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

