'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getClientPremiumAssetPath } from '../../utils/clientPremiumAssets';

interface Premium360TourProps {
  houseName: string;
  houseSlug: string;
  description?: string;
}

export default function Premium360Tour({ houseName, houseSlug, description }: Premium360TourProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем наличие изображений для превью
    const checkPreviewImage = async () => {
      try {
        // Сначала проверяем JPG
        const jpgPath = getClientPremiumAssetPath('360-preview', houseSlug, { format: 'jpg' });
        const jpgResponse = await fetch(jpgPath, { method: 'HEAD' });
        
        if (jpgResponse.ok) {
          setPreviewSrc(jpgPath);
          setIsLoading(false);
          return;
        }
        
        // Если JPG не найден, проверяем PNG
        const pngPath = getClientPremiumAssetPath('360-preview', houseSlug, { format: 'png' });
        const pngResponse = await fetch(pngPath, { method: 'HEAD' });
        
        if (pngResponse.ok) {
          setPreviewSrc(pngPath);
          setIsLoading(false);
          return;
        }
        
        // Если ни одно изображение не найдено
        setPreviewSrc(null);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking preview image:', error);
        setPreviewSrc(null);
        setIsLoading(false);
      }
    };
    
    checkPreviewImage();
  }, [houseSlug]);

  return (
    <section className="py-8 bg-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Experience {houseName} in 360°
        </h2>
        <p className="text-lg text-gray-200 mb-6 max-w-3xl mx-auto">
          {description || `Take a virtual tour and explore every room of ${houseName} in immersive 360° view.`}
        </p>
        
        {/* Превью 360 тура */}
        {!isLoading && previewSrc && (
          <div className="relative w-full max-w-7xl  mx-auto h-80 mb-8 rounded-lg overflow-hidden">
            <Image
              src={previewSrc}
              alt={`${houseName} 360° Tour Preview`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0  bg-opacity-30 flex items-center justify-center">
              <div className="bg-white bg-opacity-80 rounded-full p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
            </div>
          
          </div>
        )}
        
        <a 
          href={`/premium/${houseSlug}/tour`}
          className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Start 360° Virtual Tour
        </a>
        
        {/* Additional features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            360° View
          </div>
          <div className="flex items-center justify-center text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            All Rooms
          </div>
          <div className="flex items-center justify-center text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Mobile Friendly
          </div>
        </div>
      </div>
    </section>
  );
}
