'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface NeoFiltersProps {
  houses: Array<{
    id: string;
    name: string;
    availableRooms: string[];
    squareFeet?: number;
  }>;
}

export default function NeoFilters({ houses }: NeoFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get parameters from URL
  const bedroomsParam = searchParams.get('bedrooms');
  const bathroomsParam = searchParams.get('bathrooms');
  const sqftMinParam = searchParams.get('sqftMin');
  const sqftMaxParam = searchParams.get('sqftMax');
  
  // Filter states
  const [bedrooms, setBedrooms] = useState<string>(bedroomsParam || 'any');
  const [bathrooms, setBathrooms] = useState<string>(bathroomsParam || 'any');
  const [sqftRange, setSqftRange] = useState<[number, number]>([
    sqftMinParam ? parseInt(sqftMinParam) : 300,
    sqftMaxParam ? parseInt(sqftMaxParam) : 1500
  ]);
  
  // Get unique filter values
  const getBedroomOptions = () => {
    const options = new Set<number>();
    houses.forEach(house => {
      const bedroomCount = house.availableRooms.filter(room => 
        room === 'bedroom' || room === 'bedroom2').length;
      if (bedroomCount > 0) options.add(bedroomCount);
    });
    return Array.from(options).sort((a, b) => a - b);
  };
  
  const getBathroomOptions = () => {
    const options = new Set<number>();
    houses.forEach(house => {
      const bathroomCount = house.availableRooms.filter(room => 
        room === 'bathroom' || room === 'bathroom2').length;
      if (bathroomCount > 0) options.add(bathroomCount);
    });
    return Array.from(options).sort((a, b) => a - b);
  };
  
  // Get min and max square footage
  const getSquareFootRange = () => {
    let min = 10000;
    let max = 0;
    
    houses.forEach(house => {
      if (house.squareFeet) {
        min = Math.min(min, house.squareFeet);
        max = Math.max(max, house.squareFeet);
      }
    });
    
    return [min === 10000 ? 300 : min, max === 0 ? 1500 : max];
  };
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (bedrooms !== 'any') params.set('bedrooms', bedrooms);
    if (bathrooms !== 'any') params.set('bathrooms', bathrooms);
    params.set('sqftMin', sqftRange[0].toString());
    params.set('sqftMax', sqftRange[1].toString());
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newUrl, { scroll: false });
  }, [bedrooms, bathrooms, sqftRange, router]);
  
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bedrooms filter */}
        <div>
          <h4 className="text-md font-medium mb-2 text-gray-700">Bedrooms</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="bedrooms"
                value="any"
                checked={bedrooms === 'any'}
                onChange={() => setBedrooms('any')}
                className="mr-2"
              />
              <span>Any</span>
            </label>
            
            {getBedroomOptions().map(count => (
              <label key={`bedroom-${count}`} className="flex items-center">
                <input
                  type="radio"
                  name="bedrooms"
                  value={count.toString()}
                  checked={bedrooms === count.toString()}
                  onChange={() => setBedrooms(count.toString())}
                  className="mr-2"
                />
                <span>{count} {count === 1 ? 'Bedroom' : 'Bedrooms'}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Bathrooms filter */}
        <div>
          <h4 className="text-md font-medium mb-2 text-gray-700">Bathrooms</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="bathrooms"
                value="any"
                checked={bathrooms === 'any'}
                onChange={() => setBathrooms('any')}
                className="mr-2"
              />
              <span>Any</span>
            </label>
            
            {getBathroomOptions().map(count => (
              <label key={`bathroom-${count}`} className="flex items-center">
                <input
                  type="radio"
                  name="bathrooms"
                  value={count.toString()}
                  checked={bathrooms === count.toString()}
                  onChange={() => setBathrooms(count.toString())}
                  className="mr-2"
                />
                <span>
                  {count} {count === 1 ? 'Bathroom' : 'Bathrooms'}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Square Feet filter */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-2 text-gray-700">Square Feet</h4>
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
    </div>
  );
}
