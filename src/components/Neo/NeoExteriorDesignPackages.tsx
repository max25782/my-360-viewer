"use client";

import { useState, useEffect } from 'react';
import { NeoHouse } from '../../hooks/useNeoHouse';
import { getNeoAssetPath } from '../../utils/neoAssets';

interface NeoExteriorDesignPackagesProps {
  house: NeoHouse;
}

export default function NeoExteriorDesignPackages({ house }: NeoExteriorDesignPackagesProps) {
  const [activeScheme, setActiveScheme] = useState<'light' | 'dark'>('light');
  const [packageType, setPackageType] = useState<'good' | 'better' | 'best'>('good');
  const [imagePath, setImagePath] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(true);
  
  // Максимальное количество пакетов для экстерьера
  const maxDP = house.maxDP || 3;
  
  // Получаем цветовую схему для пути к файлу
  const getColorFolder = () => {
    return activeScheme === 'light' ? 'white' : 'black';
  };
  
  // Получаем номер пакета для пути к файлу
  const getPackageNumber = () => {
    return packageType === 'good' ? 1 : packageType === 'better' ? 2 : 3;
  };

  // Генерируем путь к изображению через Neo Asset система
  const generateImagePath = async () => {
    try {
      setImageLoading(true);
      // Используем правильный цветовой маппинг Neo системы
      const colorValue = activeScheme === 'light' ? 'white' : 'dark';
      const path = await getNeoAssetPath('exterior', house.id, {
        color: colorValue,
        dp: getPackageNumber(),
        format: 'jpg'
      });
      console.log(`Generated Neo exterior path: ${path} for ${house.id}, color: ${colorValue}, dp: ${getPackageNumber()}`);
      setImagePath(path);
    } catch (error) {
      console.error('Error generating Neo exterior path:', error);
      // Fallback к прямому пути с правильным маппингом
      const folderName = activeScheme === 'light' ? 'white' : 'black';
      setImagePath(`/assets/neo/${house.id}/exterior/${folderName}/dp${getPackageNumber()}.jpg`);
    } finally {
      setImageLoading(false);
    }
  };

  // Обновляем путь к изображению при изменении параметров
  useEffect(() => {
    generateImagePath();
  }, [activeScheme, packageType, house.id]);

  return (
    <div className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Image Display */}
        <div className="mb-8 relative">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center z-10">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
                <p className="text-gray-600">Загрузка изображения...</p>
              </div>
            </div>
          )}
          
          <div className="relative overflow-hidden bg-radial-gradient(ellipse at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.12) 0%, transparent 50%),
                linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e293b 50%, #334155 75%, #475569 100%) min-h-[calc(100dvh-64px)] max-w-full mx-auto ml-10">
            {imagePath && (
              <img
                src={imagePath}
                alt={`${packageType.toUpperCase()} Package - ${activeScheme === 'light' ? 'White' : 'Dark'}`}
                className={` absolute left-1/2 top-82 -translate-x-1/2 -translate-y-1/2 w-100% min-h-[calc(100dvh-64px)] object-contain transition-all duration-2500 ease-out-quad 
                   `}
                onLoad={() => setImageLoading(false)}
                onError={async (e) => {
                  if (e.currentTarget) {
                    try {
                      // Fallback to dp1 if current dp is not found
                      const colorValue = activeScheme === 'light' ? 'white' : 'dark';
                      const fallbackPath = await getNeoAssetPath('exterior', house.id, {
                        color: colorValue,
                        dp: 1,
                        format: 'jpg'
                      });
                      console.log(`Using fallback path: ${fallbackPath}`);
                      e.currentTarget.src = fallbackPath;
                    } catch {
                      // Final fallback to direct path with correct folder mapping
                      const folderName = activeScheme === 'light' ? 'white' : 'black';
                      e.currentTarget.src = `/assets/neo/${house.id}/exterior/${folderName}/dp1.jpg`;
                      console.log(`Using final fallback: /assets/neo/${house.id}/exterior/${folderName}/dp1.jpg`);
                    }
                  }
                  setImageLoading(false);
                }}
              />
            )}
             <div className="absolute bottom-30  left-1/2 transform -translate-x-1/2 bg-opacity-60 rounded-lg px-6 py-3">
               {/* Package Selector */}
               <div className="flex justify-center space-x-3">
                 <button
                   className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                     packageType === 'good' 
                       ? 'bg-slate-700 text-white shadow-lg' 
                       : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'
                   }`}
                   onClick={() => setPackageType('good')}
                 >
                   Good
                 </button>
                 
                 {maxDP >= 2 && (
                   <button
                     className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                       packageType === 'better' 
                         ? 'bg-slate-700 text-white shadow-lg' 
                         : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'
                     }`}
                     onClick={() => setPackageType('better')}
                   >
                     Better
                   </button>
                 )}
                 
                 {maxDP >= 3 && (
                   <button
                     className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                       packageType === 'best' 
                         ? 'bg-slate-700 text-white shadow-lg' 
                         : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'
                     }`}
                     onClick={() => setPackageType('best')}
                   >
                     Best
                   </button>
                 )}
               </div>
             </div>
          </div>
        </div>

        

        {/* Color Scheme Selector */}
        <div className="mt-6 absolute  bottom-100 left-1 flex-row justify-center space-y-4 mb-8 ">
          <div className="text-center">
            <button
              className={`w-[5rem] h-[5rem] cursor-pointer rounded-lg transition-all ${
                activeScheme === 'light' 
                  ? 'border-4 border-slate-700 shadow-lg transform scale-105' 
                  : 'border-2 border-gray-300 hover:border-gray-400 hover:shadow-md'
              }`}
              onClick={() => setActiveScheme('light')}
            >
              <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-800 font-bold text-sm">WHITE</span>
              </div>
            </button>
          </div>

          <div className="text-center">
            <button
              className={`w-[5rem] h-[5rem] cursor-pointer rounded-lg transition-all ${
                activeScheme === 'dark' 
                  ? 'border-4 border-slate-700 shadow-lg transform scale-105' 
                  : 'border-2 border-gray-300 hover:border-gray-400 hover:shadow-md'
              }`}
              onClick={() => setActiveScheme('dark')}
            >
              <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BLACK</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
