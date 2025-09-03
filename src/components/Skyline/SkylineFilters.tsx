'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SkylineFiltersProps {
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
}

export default function SkylineFilters({ houses }: SkylineFiltersProps) {
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
    sqftMaxParam ? parseInt(sqftMaxParam) : 1200
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    featuresParam ? featuresParam.split(',') : []
  );
  const [isFiltersActive, setIsFiltersActive] = useState<boolean>(false);
  
  // Get unique filter values
  const getBedroomOptions = () => {
    // Предустановленные опции для спален (1, 2, 3)
    const options = new Set<number>([1, 2, 3]);
    
    houses.forEach(house => {
      // Сначала проверяем данные из comparison.features
      if (house.comparison?.features) {
        // Ищем ключ "Bedrooms" независимо от регистра
        const bedroomsKey = Object.keys(house.comparison.features)
          .find(key => key.toLowerCase() === 'bedrooms');
        
        if (bedroomsKey) {
          const bedroomsData = house.comparison.features[bedroomsKey]?.good || '';
          
          // Извлекаем число из строки, например "2 Bedrooms" -> 2
          const match = bedroomsData.match(/(\d+)/);
          if (match && match[1]) {
            const count = parseInt(match[1]);
            if (!isNaN(count) && count > 0) {
              options.add(count);
            }
          }
        }
      }
      
      // Fallback: подсчет из availableRooms
      const bedroomCount = house.availableRooms.filter(room => 
        room.toLowerCase() === 'bedroom' || 
        room.toLowerCase() === 'bedroom2' || 
        room.toLowerCase().includes('bedroom')).length;
      if (bedroomCount > 0) options.add(bedroomCount);
    });
    
    return Array.from(options).sort((a, b) => a - b);
  };
  
  const getBathroomOptions = () => {
    // Предустановленные опции для ванных (1, 1.5, 2)
    const options = new Set<string>(['1', '1.5', '2']);
    
    houses.forEach(house => {
      // Сначала проверяем данные из comparison.features
      if (house.comparison?.features) {
        // Ищем ключ "Bathrooms" независимо от регистра
        const bathroomsKey = Object.keys(house.comparison.features)
          .find(key => key.toLowerCase() === 'bathrooms');
        
        if (bathroomsKey) {
          const bathroomsData = house.comparison.features[bathroomsKey]?.good || '';
          
          // Извлекаем число из строки, например "2 Bathrooms" -> 2 или "1.5 Bathrooms" -> 1.5
          const match = bathroomsData.match(/(\d+\.?\d*)/);
          if (match && match[1]) {
            options.add(match[1]);
          }
        }
      }
      
      // Fallback: подсчет из availableRooms
      const bathroomCount = house.availableRooms.filter(room => 
        room.toLowerCase() === 'bathroom' || 
        room.toLowerCase() === 'bathroom2' || 
        room.toLowerCase().includes('bathroom')).length;
      if (bathroomCount > 0) options.add(bathroomCount.toString());
    });
    
    // Сортировка с учетом десятичных значений
    return Array.from(options).sort((a, b) => parseFloat(a) - parseFloat(b));
  };
  
  const getSqftRange = () => {
    let min = 300;
    let max = 1200;
    
    houses.forEach(house => {
      // Проверяем прямое указание площади
      if (house.squareFeet) {
        min = Math.min(min, house.squareFeet);
        max = Math.max(max, house.squareFeet);
      }
      
      // Проверяем данные из comparison.features
      if (house.comparison?.features) {
        // Ищем ключ, содержащий "square" или "sqft" или "living space"
        const sqftKey = Object.keys(house.comparison.features)
          .find(key => 
            key.toLowerCase().includes('square') || 
            key.toLowerCase().includes('sqft') ||
            key.toLowerCase().includes('living space'));
        
        if (sqftKey) {
          const sqftData = house.comparison.features[sqftKey]?.good || '';
          
          // Извлекаем число из строки
          const match = sqftData.match(/(\d+)/);
          if (match && match[1]) {
            const sqft = parseInt(match[1]);
            if (!isNaN(sqft) && sqft > 0) {
              min = Math.min(min, sqft);
              max = Math.max(max, sqft);
            }
          }
        }
      }
    });
    
    // Округляем до ближайших сотен для удобства
    min = Math.floor(min / 100) * 100;
    max = Math.ceil(max / 100) * 100;
    
    return [min, max];
  };
  
  const getAvailableFeatures = () => {
    const features = new Set<string>();
    
    houses.forEach(house => {
      if (house.comparison?.features) {
        // Добавляем все ключи features кроме стандартных (спальни, ванные, площадь)
        Object.keys(house.comparison.features).forEach(key => {
          const lowerKey = key.toLowerCase();
          if (!lowerKey.includes('bedroom') && 
              !lowerKey.includes('bathroom') && 
              !lowerKey.includes('square') && 
              !lowerKey.includes('sqft') &&
              !lowerKey.includes('living space')) {
            features.add(key);
          }
        });
      }
    });
    
    return Array.from(features).sort();
  };
  
  // Computed values
  const bedroomOptions = getBedroomOptions();
  const bathroomOptions = getBathroomOptions();
  const [minSqft, maxSqft] = getSqftRange();
  const availableFeatures = getAvailableFeatures();
  
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
    
    // Update URL
    router.push(`/skyline?${params.toString()}`);
  };
  
  // Reset filters
  const resetFilters = () => {
    setBedrooms('any');
    setBathrooms('any');
    setSqftRange([minSqft, maxSqft]);
    setSelectedFeatures([]);
    router.push('/skyline');
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
      selectedFeatures.length > 0;
    
    setIsFiltersActive(hasActiveFilters);
  }, [bedrooms, bathrooms, sqftRange, selectedFeatures, minSqft, maxSqft]);
  
  return (
    <div className="bg-sky-800 bg-opacity-90 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Filter Skyline Homes</h2>
      
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
                  ? 'bg-sky-600 text-white' 
                  : 'bg-sky-900 text-gray-200 hover:bg-sky-800'
              }`}
              onClick={() => setBedrooms('any')}
            >
              Any
            </button>
            {bedroomOptions.map(option => (
              <button
                key={option}
                className={`px-3 py-1 rounded-full text-sm ${
                  bedrooms === option.toString() 
                    ? 'bg-sky-600 text-white' 
                    : 'bg-sky-900 text-gray-200 hover:bg-sky-800'
                }`}
                onClick={() => setBedrooms(option.toString())}
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
                  ? 'bg-sky-600 text-white' 
                  : 'bg-sky-900 text-gray-200 hover:bg-sky-800'
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
                    ? 'bg-sky-600 text-white' 
                    : 'bg-sky-900 text-gray-200 hover:bg-sky-800'
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
                step="50"
                value={sqftRange[0]}
                onChange={(e) => setSqftRange([parseInt(e.target.value), sqftRange[1]])}
                className="w-full accent-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Max</label>
              <input
                type="range"
                min={minSqft}
                max={maxSqft}
                step="50"
                value={sqftRange[1]}
                onChange={(e) => setSqftRange([sqftRange[0], parseInt(e.target.value)])}
                className="w-full accent-sky-500"
              />
            </div>
          </div>
        </div>
        
        {/* Features Filter */}
        {availableFeatures.length > 0 && (
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
                      ? 'bg-sky-600 text-white' 
                      : 'bg-sky-900 text-gray-200 hover:bg-sky-800'
                  }`}
                  onClick={() => toggleFeature(feature)}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-2">
          <button
            onClick={resetFilters}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              isFiltersActive 
                ? 'bg-sky-900 hover:bg-sky-800 text-white' 
                : 'bg-sky-950 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isFiltersActive}
          >
            Reset
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

