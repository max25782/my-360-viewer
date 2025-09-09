'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ZoomableImageModal from '../ZoomableImageModal';

interface PremiumFeaturesProps {
  features: string[];
  houseName: string;
  houseId: string;
}

export default function PremiumFeatures({ features, houseName, houseId }: PremiumFeaturesProps) {
  if (!features || !Array.isArray(features) || features.length === 0) {
    return null;
  }

  // Состояние для хранения доступных изображений
  const [availableImages, setAvailableImages] = useState<{filename: string, path: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        
        // Нормализуем ID дома (первая буква заглавная, остальные строчные)
        const normalizedHouseId = houseId.charAt(0).toUpperCase() + houseId.slice(1).toLowerCase();
        
        // Получаем данные из манифеста
        const houseData = manifest.houses[houseId] || manifest.houses[normalizedHouseId];
        
        if (!houseData || !houseData.comparison || !houseData.comparison.plans) {
          console.log(`Нет данных о сравнительных изображениях для дома ${houseId}`);
          setAvailableImages([]);
        } else {
          // Фильтруем только JPG и WebP изображения, начинающиеся с "plan"
          const plans = houseData.comparison.plans
            .filter((plan: ManifestPlan) => 
              (plan.type === 'jpg' || plan.type === 'webp') && 
              plan.filename.startsWith('plan')
            )
            .map((plan: ManifestPlan) => ({
              filename: plan.filename.split('.')[0], // Убираем расширение
              path: plan.path
            }));
          
          // Удаляем дубликаты (если есть и jpg, и webp)
          const uniquePlans = Array.from(new Map(
            plans.map((plan: {filename: string, path: string}) => [plan.filename, plan])
          ).values());
          
          console.log(`Найдено ${uniquePlans.length} планов для дома ${houseId}`);
          setAvailableImages(uniquePlans);
        }
      } catch (error) {
        console.error('Ошибка при загрузке манифеста:', error);
        setAvailableImages([]);
      }
      
      setIsLoading(false);
    };
    
    loadImagesFromManifest();
  }, [houseId]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature: string, index: number) => (
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
      </div>
    </section>
  );
}
