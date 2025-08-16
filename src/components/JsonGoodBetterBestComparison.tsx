/**
 * JSON-DRIVEN: GoodBetterBestComparison using dynamic data from JSON
 * Replaces hardcoded features with configurable JSON data per house
 */

'use client';

import React, { useEffect, useState } from 'react';
import { House } from '../hooks/useHouses';
import { assetPaths } from '../utils/assetPaths';
import { getComparisonFeatures } from '../utils/universalAssets';
import SimpleImageModal from './SimpleImageModal';
import { formatPrice } from '../utils/formatters';

interface JsonGoodBetterBestComparisonProps {
  house: House;
}

interface ComparisonItem {
  label: string;
  good: string | React.ReactNode;
  better: string | React.ReactNode;
  best: string | React.ReactNode;
}

export default function JsonGoodBetterBestComparison({ house }: JsonGoodBetterBestComparisonProps) {
  const [features, setFeatures] = useState<Record<string, { good: string; better: string; best: string; }> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load comparison features from JSON
  useEffect(() => {
    async function loadFeatures() {
      try {
        setIsLoading(true);
        const comparisonFeatures = await getComparisonFeatures(house.id);
        setFeatures(comparisonFeatures);
      } catch (error) {
        console.error('Failed to load comparison features:', error);
        setFeatures(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadFeatures();
  }, [house.id]);

  // Universal image paths using standardized structure
  const getImagePaths = () => {
    return {
      goodExterior: assetPaths.comparison(house.id, 'good', 'exterior'),
      betterExterior: assetPaths.comparison(house.id, 'better', 'exterior'),
      bestExterior: assetPaths.comparison(house.id, 'best', 'exterior'),
      goodPlan1: assetPaths.comparison(house.id, 'good', 'plan1'),
      betterPlan1: assetPaths.comparison(house.id, 'better', 'plan1'),
      bestPlan1: assetPaths.comparison(house.id, 'best', 'plan1'),
    };
  };

  const imagePaths = getImagePaths();

  // Helper to render feature value (handle ✓/✗ symbols)
  const renderFeatureValue = (value: string) => {
    if (value === '✓') {
      return <span className="text-green-500">✓</span>;
    }
    if (value === '✗') {
      return <span className="text-red-500">✗</span>;
    }
    return value;
  };

  // Build comparison items dynamically
  const buildComparisonItems = (): ComparisonItem[] => {
    const items: ComparisonItem[] = [
      // Fixed items (images and basic house data)
      {
        label: 'Front Elevation',
        good: (
          <SimpleImageModal 
            src={imagePaths.goodExterior} 
            alt={`Good Package - ${house.name} Front Elevation`} 
            className="w-full h-full object-contain min-h-[200px] min-w-[300px]"
            width={400}
            height={300}
          />
        ),
        better: (
          <SimpleImageModal 
            src={imagePaths.betterExterior} 
            alt={`Better Package - ${house.name} Front Elevation`} 
            className="w-full h-full object-contain"
            width={400}
            height={300}
          />
        ),
        best: (
          <SimpleImageModal 
            src={imagePaths.bestExterior} 
            alt={`Best Package - ${house.name} Front Elevation`} 
            className="w-full h-full object-contain"
            width={400}
            height={300}
          />
        )
      },
      {
        label: 'Floor Plan',
        good: (
          <SimpleImageModal 
            src={imagePaths.goodPlan1} 
            alt={`Good Package - ${house.name} Floor Plan`} 
            className="w-full h-32 object-contain"
            width={300}
            height={200}
          />
        ),
        better: (
          <SimpleImageModal 
            src={imagePaths.betterPlan1} 
            alt={`Better Package - ${house.name} Floor Plan`} 
            className="w-full h-32 object-contain"
            width={300}
            height={200}
          />
        ),
        best: (
          <SimpleImageModal 
            src={imagePaths.bestPlan1} 
            alt={`Best Package - ${house.name} Floor Plan`} 
            className="w-full h-32 object-contain"
            width={300}
            height={200}
          />
        )
      },
      // Basic house info (from JSON config)
      {
        label: 'Available Rooms',
        good: `${house.availableRooms.length} Rooms`,
        better: `${house.availableRooms.length} Rooms`,
        best: `${house.availableRooms.length} Rooms`
      },
      {
        label: 'Design Options',
        good: `DP1-DP${house.maxDP} / PK1-PK${house.maxPK}`,
        better: `DP1-DP${house.maxDP} / PK1-PK${house.maxPK}`,
        best: `DP1-DP${house.maxDP} / PK1-PK${house.maxPK}`
      },
      {
        label: 'Room Types',
        good: house.availableRooms.slice(0, 3).join(', ') + (house.availableRooms.length > 3 ? '...' : ''),
        better: house.availableRooms.slice(0, 3).join(', ') + (house.availableRooms.length > 3 ? '...' : ''),
        best: house.availableRooms.slice(0, 3).join(', ') + (house.availableRooms.length > 3 ? '...' : '')
      }
    ];

    // Add dynamic features from JSON
    if (features) {
      Object.entries(features).forEach(([featureLabel, featureValues]) => {
        items.push({
          label: featureLabel,
          good: renderFeatureValue(featureValues.good),
          better: renderFeatureValue(featureValues.better),
          best: renderFeatureValue(featureValues.best)
        });
      });
    }

    return items;
  };

  const comparisonItems = buildComparisonItems();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-slate-700 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-500 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden min-h-[600px]">
      {/* Headers */}
      <div className="grid grid-cols-4">
        <div className="bg-stone-600 text-white text-center py-4 px-6"></div>
        <div className="bg-stone-600 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">HERITAGE</h3>
          <p className="text-sm opacity-90">DP1 / PK1</p>
        </div>
        <div className="bg-stone-700 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">HAVEN</h3>
          <p className="text-sm opacity-90">DP2 / PK2</p>
        </div>
        <div className="bg-stone-800 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">LUXE</h3>
          <p className="text-sm opacity-90">DP{house.maxDP} / PK{house.maxPK}</p>
        </div>
      </div>
      
      {/* Comparison Items */}
      <div className="divide-y">
        {comparisonItems.map((item, index) => (
          <div key={index} className="grid grid-cols-4">
            <div className="bg-slate-400 p-4 font-semibold text-gray-800 border-r">
              {item.label}
            </div>
            <div className={`p-4 text-center ${index < comparisonItems.length - 1 ? 'border-r' : ''}`}>
              {typeof item.good === 'string' ? item.good : item.good}
            </div>
            <div className={`p-4 text-center ${index < comparisonItems.length - 1 ? 'border-r' : ''}`}>
              {typeof item.better === 'string' ? item.better : item.better}
            </div>
            <div className="p-4 text-center">
              {typeof item.best === 'string' ? item.best : item.best}
            </div>
          </div>
        ))}
      </div>

 
    </div>
  );
}
