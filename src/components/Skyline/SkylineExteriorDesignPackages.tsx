'use client';

import { useState } from 'react';
import { House } from '../../hooks/useHouses';

interface SkylineExteriorDesignPackagesProps {
  house: House;
}

export default function SkylineExteriorDesignPackages({ house }: SkylineExteriorDesignPackagesProps) {
  const [activePackage, setActivePackage] = useState<number>(1);
  
  // Количество пакетов для экстерьера - фиксированное (5)
  const maxDP = 5;
  
  // Получаем код пакета для пути к файлу
  const getPackageCode = () => {
    return `dc${activePackage}`;
  };
  
  // Проверка существования изображения
  const checkImageExists = (src: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  };

  // Обработка ошибки загрузки изображения
  const handleImageError = async (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!e.currentTarget) return;
    
    // Пробуем загрузить изображение dc1
    const fallbackPath = `/assets/skyline/${house.id}/exterior/dc1.jpg`;
    const exists = await checkImageExists(fallbackPath);
    
    if (exists) {
      e.currentTarget.src = fallbackPath;
    } else {
      // Если и fallback не существует, показываем placeholder
      e.currentTarget.style.display = 'none';
      const parent = e.currentTarget.parentElement;
      if (parent) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'w-full h-[500px] bg-gray-200 flex items-center justify-center';
        fallbackDiv.innerHTML = '<div class="text-gray-500">Image not available</div>';
        parent.appendChild(fallbackDiv);
      }
    }
  };

  return (
    <section className="py-16 bg-slate-700 bg-opacity-70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
          </h2>
          <p className="text-lg text-gray-600">
            Explore the exterior design options for the {house.name}.
          </p>
        </div>

        {/* Main Image Display */}
        <div className="mb-8 relative">
          <div className="relative">
            <img
              src={`/assets/skyline/${house.id}/exterior/dc${activePackage}.jpg`}
              alt={`${house.name} - Package DC${activePackage}`}
              className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              onError={handleImageError}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 px-6 py-3 text-white text-xl font-semibold">
              {/* Package Selector */}
              <div className="flex justify-center space-x-4 mb-1">
                <button
                  className={`px-6 py-3 rounded-lg font-semibold ${activePackage === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActivePackage(1)}
                >
                  Heritage
                </button>
                
                <button
                  className={`px-6 py-3 rounded-lg font-semibold ${activePackage === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActivePackage(2)}
                >
                  Haven
                </button>
                
                <button
                  className={`px-6 py-3 rounded-lg font-semibold ${activePackage === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActivePackage(3)}
                >
                  Serenity
                </button>
                
                <button
                  className={`px-6 py-3 rounded-lg font-semibold ${activePackage === 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActivePackage(4)}
                >
                  Luxe
                </button>
                
                <button
                  className={`px-6 py-3 rounded-lg font-semibold ${activePackage === 5 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActivePackage(5)}
                >
                  Sunset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Design Package Color Swatches */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-white mb-4">Design Packages</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="text-center">
            <div 
              className={`w-32 h-32 cursor-pointer rounded-lg overflow-hidden ${activePackage === 1 ? 'ring-4 ring-blue-500' : 'ring-1 ring-gray-300'}`}
              onClick={() => setActivePackage(1)}
            >
              <div className="h-full w-full bg-[#e9e5dc]"></div>
            </div>
            <div className="mt-2 text-white font-medium">Heritage (DC1)</div>
          </div>

          <div className="text-center">
            <div 
              className={`w-32 h-32 cursor-pointer rounded-lg overflow-hidden ${activePackage === 2 ? 'ring-4 ring-blue-500' : 'ring-1 ring-gray-300'}`}
              onClick={() => setActivePackage(2)}
            >
              <div className="h-full w-full bg-[#5e6266]"></div>
            </div>
            <div className="mt-2 text-white font-medium">Haven (DC2)</div>
          </div>

          <div className="text-center">
            <div 
              className={`w-32 h-32 cursor-pointer rounded-lg overflow-hidden ${activePackage === 3 ? 'ring-4 ring-blue-500' : 'ring-1 ring-gray-300'}`}
              onClick={() => setActivePackage(3)}
            >
              <div className="h-full w-full bg-[#9a9083]"></div>
            </div>
            <div className="mt-2 text-white font-medium">Serenity (DC3)</div>
          </div>

          <div className="text-center">
            <div 
              className={`w-32 h-32 cursor-pointer rounded-lg overflow-hidden ${activePackage === 4 ? 'ring-4 ring-blue-500' : 'ring-1 ring-gray-300'}`}
              onClick={() => setActivePackage(4)}
            >
              <div className="h-full w-full bg-[#4c4c4c]"></div>
            </div>
            <div className="mt-2 text-white font-medium">Luxe (DC4)</div>
          </div>

          <div className="text-center">
            <div 
              className={`w-32 h-32 cursor-pointer rounded-lg overflow-hidden ${activePackage === 5 ? 'ring-4 ring-blue-500' : 'ring-1 ring-gray-300'}`}
              onClick={() => setActivePackage(5)}
            >
              <div className="h-full w-full bg-[#b29a7d]"></div>
            </div>
            <div className="mt-2 text-white font-medium">Sunset (DC5)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
