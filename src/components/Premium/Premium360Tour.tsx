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
  
  // Преобразуем houseSlug для правильного регистра и URL
  const cleanHouseSlug = houseSlug.replace('premium-', '');
  const capitalizedHouseSlug = cleanHouseSlug.charAt(0).toUpperCase() + cleanHouseSlug.slice(1).toLowerCase();

  useEffect(() => {
    // Проверяем оба формата изображений
    const checkAndSetPreviewImage = async () => {
      console.log(`Setting preview image for premium house: ${houseSlug}`);
      
      // Используем преобразованные переменные из компонента
      console.log(`🖼️ PREMIUM360TOUR: houseSlug="${houseSlug}" → cleanHouseSlug="${cleanHouseSlug}" → capitalizedHouseSlug="${capitalizedHouseSlug}"`);
      
      // Сначала пробуем PNG, затем JPG
      const pngPath = `/assets/premium/${capitalizedHouseSlug}/360/hero.png`;
      const jpgPath = `/assets/premium/${capitalizedHouseSlug}/360/hero.jpg`;
      
      console.log(`🖼️ PREMIUM360TOUR: Trying PNG path first: ${pngPath}, then JPG: ${jpgPath}`);
      
      try {
        // Создаем объект Image для проверки загрузки PNG
        const img = new window.Image();
        img.src = pngPath;
        
        // Устанавливаем обработчики событий
        img.onload = () => {
          console.log(`PNG image loaded successfully: ${pngPath}`);
          setPreviewSrc(pngPath);
          setIsLoading(false);
        };
        
        img.onerror = () => {
          console.log(`PNG failed to load, trying JPG: ${jpgPath}`);
          // Пробуем JPG
          const jpgImg = new window.Image();
          jpgImg.src = jpgPath;
          
          jpgImg.onload = () => {
            console.log(`JPG image loaded successfully: ${jpgPath}`);
            setPreviewSrc(jpgPath);
            setIsLoading(false);
          };
          
          jpgImg.onerror = () => {
            console.log(`Both PNG and JPG failed to load`);
            setPreviewSrc(null);
            setIsLoading(false);
          };
        };
      } catch (error) {
        console.error('Error loading preview images:', error);
        setPreviewSrc(null);
        setIsLoading(false);
      }
    };
    
    checkAndSetPreviewImage();
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
          <a 
            href={`/premium/${cleanHouseSlug}/tour`}
            className="block relative w-full max-w-7xl mx-auto h-80 mb-8 rounded-lg overflow-hidden shadow-xl cursor-pointer"
            style={{
              minHeight: '360px', // Предотвращает CLS
              backgroundImage: `url('${previewSrc}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            data-jpg-path={`/assets/premium/${capitalizedHouseSlug}/360/hero.jpg`}
            data-png-path={`/assets/premium/${capitalizedHouseSlug}/360/hero.png`}
          >
            {/* Полупрозрачный слой для лучшей видимости кнопки */}
            <div className="absolute inset-0 bg-opacity-30"></div>
            
            {/* Кнопка воспроизведения */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-80 rounded-full p-6 shadow-lg transform transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
            </div>
            
            {/* Запасной вариант с Image компонентом, если стиль фона не работает */}
            <div className="hidden">
              <Image
                src={previewSrc}
                alt={`${houseName} 360° Tour Preview`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={false}
                onError={(e) => {
                  // Если PNG не загрузился, пробуем JPG
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement?.parentElement;
                  if (parent && parent.hasAttribute('data-jpg-path')) {
                    const jpgPath = parent.getAttribute('data-jpg-path');
                    if (jpgPath && target.src.endsWith('png')) {
                      console.log('PNG не загрузился, пробуем JPG:', jpgPath);
                      target.src = jpgPath;
                    }
                  }
                }}
              />
            </div>
          </a>
        )}
        
        {/* Показываем плейсхолдер, если изображение не найдено */}
        {!isLoading && !previewSrc && (
          <div className="relative w-full max-w-7xl mx-auto h-80 mb-8 rounded-lg overflow-hidden bg-slate-700">
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className="bg-slate-600 rounded-full p-6 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
                </svg>
              </div>
              <p className="text-slate-400 text-lg">360° тур скоро будет доступен</p>
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
        
       
      </div>
    </section>
  );
}
