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
import { getNeoComparisonPath } from '../utils/neoAssets';


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

  const renderImageWithErrorHandling = (src: string, alt: string) => {
    const [isError, setIsError] = useState(false);

    const handleError = () => {
      console.error(`Failed to load image: ${src}`);
      setIsError(true);
    };

    if (isError) {
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
          Image Not Available
        </div>
      );
    }

    return (
      <SimpleImageModal 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        width={300}
        height={200}
        onError={handleError}
      />
    );
  };

  const [availablePlans, setAvailablePlans] = useState<{[key: string]: string}>({});
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Загружаем планы из манифеста для Skyline домов
  useEffect(() => {
    const loadPlansFromManifest = async () => {
      if (house.category !== 'skyline') {
        setLoadingPlans(false);
        return;
      }

      setLoadingPlans(true);
      try {
        // Загружаем манифест сравнительных изображений
        const manifestResponse = await fetch('/skyline-comparison-manifest.json');
        if (!manifestResponse.ok) {
          throw new Error('Failed to load skyline comparison manifest');
        }

        const manifest = await manifestResponse.json();
        
        // Нормализуем ID дома (первая буква заглавная, остальные строчные)
        const normalizedHouseId = house.id.charAt(0).toUpperCase() + house.id.slice(1).toLowerCase();
        
        // Получаем данные из манифеста
        const houseData = manifest.houses[house.id] || manifest.houses[normalizedHouseId];
        
        if (!houseData || !houseData.comparison || !houseData.comparison.plans) {
          console.log(`No comparison data found for house ${house.id}`);
          setAvailablePlans({});
        } else {
          // Фильтруем только JPG и WebP изображения, начинающиеся с "plan"
          const plans = houseData.comparison.plans
            .filter((plan: {type: string, filename: string, path: string}) => 
              (plan.type === 'jpg' || plan.type === 'webp') && 
              plan.filename.startsWith('plan')
            )
            .reduce((acc: {[key: string]: string}, plan: {type: string, filename: string, path: string}) => {
              const planName = plan.filename.split('.')[0]; // Убираем расширение
              acc[planName] = plan.path;
              return acc;
            }, {} as {[key: string]: string});
          
          console.log(`Found ${Object.keys(plans).length} plans for house ${house.id}:`, plans);
          setAvailablePlans(plans);
        }
      } catch (error) {
        console.error('Error loading manifest:', error);
        setAvailablePlans({});
      }
      setLoadingPlans(false);
    };

    loadPlansFromManifest();
  }, [house.id, house.category]);

  const getImagePaths = () => {
    // Используем WebP формат для современных браузеров
    const format = 'webp'; // Можно сделать динамическим определением поддержки WebP
    
    // Функция для создания пути с поддержкой WebP
    const getComparisonPath = (type: 'good' | 'better' | 'best', variant: 'exterior' | 'plan1' | 'plan2') => {
      // Для Neo домов используем специальную функцию
      if (house.category === 'neo') {
        const path = getNeoComparisonPath(house.id, type, variant);
        console.log(`Neo House Comparison Path (${type}, ${variant}): ${path}`);
        return path;
      }
      
      // Для Skyline домов используем манифест для планов
      if (house.category === 'skyline' && (variant === 'plan1' || variant === 'plan2')) {
        const planKey = variant;
        if (availablePlans[planKey]) {
          return availablePlans[planKey];
        }
      }
      
      // Для остальных случаев используем существующую логику с WebP
      const basePath = assetPaths.comparison(house.id, type, variant);
      return basePath.replace('.jpg', `.${format}`);
    };
    
    const paths = {
      goodExterior: getComparisonPath('good', 'exterior'),
      betterExterior: getComparisonPath('better', 'exterior'),
      bestExterior: getComparisonPath('best', 'exterior'),
      goodPlan1: getComparisonPath('good', 'plan1'),
      betterPlan1: getComparisonPath('better', 'plan1'),
      bestPlan1: getComparisonPath('best', 'plan1'),
      // Добавляем план 2 (для всех домов, если он есть в манифесте)
      goodPlan2: getComparisonPath('good', 'plan2'),
      betterPlan2: getComparisonPath('better', 'plan2'),
      bestPlan2: getComparisonPath('best', 'plan2'),
    };

    console.log('Generated Image Paths:', paths);
    return paths;
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
    // Проверка, что house.availableRooms - это массив
    const availableRooms = Array.isArray(house.availableRooms) ? house.availableRooms : [];
    const bedroomCount = availableRooms.filter(room => room === 'bedroom').length;
    const bathroomCount = availableRooms.filter(room => room === 'bathroom').length;

    // Для Neo домов объединяем данные из house.comparison и загруженные features
    if (house.category === 'neo') {
      const items: ComparisonItem[] = [];
      
      // Добавляем изображения
      items.push(
        {
          label: 'Front Elevation',
          good: renderImageWithErrorHandling(imagePaths.goodExterior, `Good Package - ${house.name} Front Elevation`),
          better: renderImageWithErrorHandling(imagePaths.betterExterior, `Better Package - ${house.name} Front Elevation`),
          best: renderImageWithErrorHandling(imagePaths.bestExterior, `Best Package - ${house.name} Front Elevation`)
        },
        {
          label: 'Floor Plan 1',
          good: renderImageWithErrorHandling(imagePaths.goodPlan1, `Good Package - ${house.name} Floor Plan 1`),
          better: renderImageWithErrorHandling(imagePaths.betterPlan1, `Better Package - ${house.name} Floor Plan 1`),
          best: renderImageWithErrorHandling(imagePaths.bestPlan1, `Best Package - ${house.name} Floor Plan 1`)
        }
      );
      
      // Добавляем базовую информацию о доме
      items.push(
        {
          label: 'Bedrooms',
          good: `${bedroomCount} Bedrooms`,
          better: `${bedroomCount} Bedrooms`,
          best: `${bedroomCount} Bedrooms`
        },
        {
          label: 'Bathrooms',
          good: `${bathroomCount} Bathrooms`,
          better: `${bathroomCount} Bathrooms`,
          best: `${bathroomCount} Bathrooms`
        }
      );
      
      // Добавляем данные из house.comparison.features (если есть)
      if (house.comparison?.features) {
        Object.entries(house.comparison.features).forEach(([featureLabel, featureValues]: [string, any]) => {
          items.push({
            label: featureLabel,
            good: renderFeatureValue(featureValues.good),
            better: renderFeatureValue(featureValues.better),
            best: renderFeatureValue(featureValues.best)
          });
        });
      }
      
      // Добавляем дополнительные функции из JSON файла сравнения
      if (features) {
        console.log(`Loading additional features for Neo house ${house.id}:`, Object.keys(features));
        Object.entries(features).forEach(([featureLabel, featureValues]) => {
          // Проверяем, что эта функция еще не добавлена из house.comparison
          const alreadyExists = house.comparison?.features && 
            Object.keys(house.comparison.features).includes(featureLabel);
          
          if (!alreadyExists) {
            items.push({
              label: featureLabel,
              good: renderFeatureValue(featureValues.good),
              better: renderFeatureValue(featureValues.better),
              best: renderFeatureValue(featureValues.best)
            });
          }
        });
      }
      
      console.log(`Total comparison items for Neo house ${house.id}: ${items.length}`);
      
      return items;
    }

    const items: ComparisonItem[] = [
      // Fixed items (images and basic house data)
      {
        label: 'Front Elevation',
        good: renderImageWithErrorHandling(imagePaths.goodExterior, `Good Package - ${house.name} Front Elevation`),
        better: renderImageWithErrorHandling(imagePaths.betterExterior, `Better Package - ${house.name} Front Elevation`),
        best: renderImageWithErrorHandling(imagePaths.bestExterior, `Best Package - ${house.name} Front Elevation`)
      },
      {
        label: 'Floor Plan 1',
        good: renderImageWithErrorHandling(imagePaths.goodPlan1, `Good Package - ${house.name} Floor Plan 1`),
        better: renderImageWithErrorHandling(imagePaths.betterPlan1, `Better Package - ${house.name} Floor Plan 1`),
        best: renderImageWithErrorHandling(imagePaths.bestPlan1, `Best Package - ${house.name} Floor Plan 1`)
      },
      // Добавляем второй план (если он доступен)
      ...(availablePlans['plan2'] || (house.id === 'walnut' && imagePaths.goodPlan2) ? [{
        label: 'Floor Plan 2',
        good: renderImageWithErrorHandling(imagePaths.goodPlan2!, `Good Package - ${house.name} Floor Plan 2`),
        better: renderImageWithErrorHandling(imagePaths.betterPlan2!, `Better Package - ${house.name} Floor Plan 2`),
        best: renderImageWithErrorHandling(imagePaths.bestPlan2!, `Best Package - ${house.name} Floor Plan 2`)
      }] : []),
      // Basic house info (from JSON config)
          {
        label: 'Bedrooms',
        good: `${bedroomCount} Bedrooms`,
        better: `${bedroomCount} Bedrooms`,
        best: `${bedroomCount} Bedrooms`
      },
      {
        label: 'Bathrooms',
        good: `${bathroomCount} Bathrooms`,
        better: `${bathroomCount} Bathrooms`,
        best: `${bathroomCount} Bathrooms`
      },
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
          <div>
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
         
        </div>
        <div className="bg-stone-700 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">HAVEN</h3>
      
        </div>
        <div className="bg-stone-800 text-white text-center py-4 px-6">
          <h3 className="text-xl font-bold">LUXE</h3>
          
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

