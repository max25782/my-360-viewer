'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import ZoomableImageModal from '../ZoomableImageModal';

interface PremiumFeaturesProps {
  features: string[];
  houseName: string;
  houseId: string;
}

export default function PremiumFeatures({ features, houseName, houseId }: PremiumFeaturesProps) {
  // Преобразуем houseId для правильного регистра и удаления префикса
  const cleanHouseId = houseId.toLowerCase().startsWith('premium-') 
    ? houseId.substring(8) // Удаляем "premium-" (8 символов)
    : houseId;
  const capitalizedHouseId = cleanHouseId.charAt(0).toUpperCase() + cleanHouseId.slice(1).toLowerCase();

  // Стабилизируем features для useEffect
  const stableFeatures = useMemo(() => {
    return features && Array.isArray(features) ? features : [];
  }, [features]);

  console.log('🏠 PREMIUM FEATURES: Received props:', { features: stableFeatures, houseName, houseId, capitalizedHouseId });

  // Состояние для хранения доступных изображений
  const [availableImages, setAvailableImages] = useState<{filename: string, path: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackFeatures, setFallbackFeatures] = useState<string[]>([]);

  // Интерфейсы для типизации
  interface ManifestPlan {
    filename: string;
    path: string;
    type: string;
  }
  
  interface ComparisonManifest {
    houses: {
      [key: string]: {
        comparison?: {
          plans?: ManifestPlan[];
        };
      };
    };
  }

  interface PremiumHouseData {
    name: string;
    description: string;
    maxDP: number;
    maxPK: number;
    availableRooms: string[];
    comparison?: {
      features: string[];
    };
  }

  interface PremiumAssetsData {
    premiumHouses: {
      [key: string]: PremiumHouseData;
    };
  }

  // Загружаем изображения из манифеста
  useEffect(() => {
    const loadImagesFromManifest = async () => {
      setIsLoading(true);
      
      try {
        // Загружаем манифест сравнительных изображений
        const response = await fetch('/premium-comparison-manifest.json');
        if (!response.ok) {
          throw new Error('Не удалось загрузить манифест сравнительных изображений');
        }
        
        const manifest = await response.json() as ComparisonManifest;
        
        // Получаем данные из манифеста (используем уже обработанный capitalizedHouseId)
        const houseData = manifest.houses[houseId] || manifest.houses[capitalizedHouseId];
        console.log(`🏠 PREMIUM FEATURES: Looking for house data: ${houseId} → ${capitalizedHouseId}`);
        
        if (!houseData || !houseData.comparison || !houseData.comparison.plans) {
          console.log(`Нет данных о сравнительных изображениях для дома ${houseId}`);
          setAvailableImages([]);
        } else {
          // Фильтруем только JPG и WebP изображения, начинающиеся с "plan"
          const rawPlans = houseData.comparison.plans
            .filter((plan: ManifestPlan) => 
              (plan.type === 'jpg' || plan.type === 'webp') && 
              plan.filename.startsWith('plan')
            );

          // Группируем по базовому имени и предпочитаем webp
          const grouped = new Map<string, { filename: string; path: string }>();
          for (const p of rawPlans) {
            const base = p.filename.replace(/\.(webp|jpg|jpeg|png)$/i, '');
            const candidate = { filename: base, path: p.path };
            if (!grouped.has(base)) grouped.set(base, candidate);
            else if (p.type === 'webp') grouped.set(base, candidate);
          }
          const uniquePlans = Array.from(grouped.values());
          
          console.log(`Найдено ${uniquePlans.length} планов для дома ${houseId}`);
          setAvailableImages(uniquePlans);
        }
      } catch (error) {
        console.error('Ошибка при загрузке манифеста:', error);
        setAvailableImages([]);
      }

      // Если нет основных features, загружаем данные из premium-assets.json
      if (stableFeatures.length === 0) {
        try {
          const premiumAssetsResponse = await fetch('/data/premium-assets.json');
          if (premiumAssetsResponse.ok) {
            const premiumData = await premiumAssetsResponse.json() as PremiumAssetsData;
            const houseData = premiumData?.premiumHouses?.[capitalizedHouseId];
            if (houseData) {
              // Сначала пробуем загрузить comparison.features
              if (houseData.comparison?.features && Array.isArray(houseData.comparison.features)) {
                setFallbackFeatures(houseData.comparison.features);
                console.log('🏠 PREMIUM FEATURES: Loaded comparison features from premium-assets.json:', houseData.comparison.features);
              } else {
                // Если нет comparison.features, используем базовую информацию
                const basicFeatures = [
                  houseData.description || `Spacious ${capitalizedHouseId} home`,
                  `${houseData.maxDP || 4} Design Packages Available`,
                  `${houseData.maxPK || 4} Interior Packages Available`,
                  `${houseData.availableRooms?.length || 0} Room Types Available`,
                  '360° Virtual Tour Available'
                ];
                setFallbackFeatures(basicFeatures);
                console.log('🏠 PREMIUM FEATURES: Loaded basic fallback features:', basicFeatures);
              }
            }
          }
        } catch (error) {
          console.error('Ошибка при загрузке premium-assets.json:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    loadImagesFromManifest();
  }, [houseId, capitalizedHouseId, stableFeatures]);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {houseName} Features
        </h2>
        
        {/* Изображения сравнения */}
        {!isLoading && availableImages.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableImages.map((plan, index) => (
                <div key={plan.filename} className="bg-slate-800 p-2 rounded-lg overflow-hidden">
                  <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                    <ZoomableImageModal 
                      src={plan.path} 
                      alt={`${houseName} ${plan.filename.replace(/(\d+)/, ' Plan $1')}`}
                      width={800}
                      height={600}
                      className="absolute inset-0 w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <p className="text-center text-gray-300 mt-2 font-medium">
                    {plan.filename.replace(/(\d+)/, ' Plan $1').replace('plan', 'Floor Plan')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Список особенностей */}
        {(() => {
          const displayFeatures = stableFeatures.length > 0 
            ? stableFeatures 
            : fallbackFeatures;
          
          if (displayFeatures.length > 0) {
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayFeatures.map((feature: string, index: number) => (
                  <div key={index} className="bg-slate-800 p-4 rounded-lg flex items-start">
                    <div className="text-emerald-400 mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-gray-200">{feature}</div>
                  </div>
                ))}
              </div>
            );
          } else {
            return (
              <div className="text-center py-8">
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">Floor Plans & Features</h3>
                  <p className="text-gray-300">
                    Detailed features information will be available soon. 
                    {availableImages.length > 0 ? ' Please check the floor plans above.' : ''}
                  </p>
                </div>
              </div>
            );
          }
        })()}
      </div>
    </section>
  );
}
