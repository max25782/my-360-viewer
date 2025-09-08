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
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем наличие изображений при загрузке компонента
  useEffect(() => {
    const checkImages = async () => {
      const imagesToCheck = ['plan1', 'plan2', 'plan3'];
      const available = [];
      
      for (const plan of imagesToCheck) {
        try {
          // Проверяем доступность изображения
          const response = await fetch(`/assets/premium/${houseId}/comparison/${plan}.jpg`, { method: 'HEAD' });
          if (response.ok) {
            available.push(plan);
          }
        } catch (e) {
          console.log(`Image ${plan} not available for ${houseId}`);
        }
      }
      
      setAvailableImages(available);
      setIsLoading(false);
    };
    
    checkImages();
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
                <div key={plan} className="bg-slate-800 p-2 rounded-lg overflow-hidden">
                  <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                    <ZoomableImageModal 
                      src={`/assets/premium/${houseId}/comparison/${plan}.jpg`} 
                      alt={`${houseName} ${plan.replace(/(\d+)/, ' Plan $1')}`}
                      width={800}
                      height={600}
                      className="absolute inset-0 w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <p className="text-center text-gray-300 mt-2 font-medium">
                    {plan.replace(/(\d+)/, ' Plan $1').replace('plan', 'Floor Plan')}
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
