"use client";

import { useState } from 'react';
import { NeoHouse } from '../../hooks/useNeoHouse';

interface NeoExteriorDesignPackagesProps {
  house: NeoHouse;
}

export default function NeoExteriorDesignPackages({ house }: NeoExteriorDesignPackagesProps) {
  const [activeScheme, setActiveScheme] = useState<'light' | 'dark'>('light');
  const [packageType, setPackageType] = useState<'good' | 'better' | 'best'>('good');
  
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

  return (
    <section className="py-16 bg-slate-">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold uppercase tracking-widest text-gray-900 mb-2">
            EXTERIOR
          </h2>
          <p className="text-lg text-gray-600">
            Explore the exterior packages of our {house.name} ADU.
          </p>
        </div>

        {/* Main Image Display */}
        <div className="mb-8 relative">
          <div className="relative">
            <img
              src={`/assets/neo/${house.id}/exterior/${getColorFolder()}/dp${getPackageNumber()}.jpg`}
              alt={`${packageType.toUpperCase()} Package - ${activeScheme === 'light' ? 'White' : 'Dark'}`}
              className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              onError={(e) => {
                if (e.currentTarget) {
                  // Fallback to dp1 if current dp is not found
                  e.currentTarget.src = `/assets/neo/${house.id}/exterior/${getColorFolder()}/dp1.jpg`;
                  e.currentTarget.onerror = () => {
                    // Fallback to white/dp1 if specific color/dp is not found
                    if (e.currentTarget) {
                      e.currentTarget.src = `/assets/neo/${house.id}/exterior/white/dp1.jpg`;
                    }
                  };
                }
              }}
            />
            <div className="absolute bottom-1 flex justify-center items-center   bg-opacity-50 px-6 py-3 text-white text-xl font-semibold">
              {/* Package Selector */}
        <div className="flex justify-center space-x-4 mb-1">
          <button
            className={`px-6 py-3 rounded-lg font-semibold ${packageType === 'good' ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setPackageType('good')}
          >
            Good
          </button>
          
          {maxDP >= 2 && (
            <button
              className={`px-6 py-3 rounded-lg font-semibold ${packageType === 'better' ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setPackageType('better')}
            >
              Better
            </button>
          )}
          
          {maxDP >= 3 && (
            <button
              className={`px-6 py-3 rounded-lg font-semibold ${packageType === 'best' ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
        <div className="flex justify-center space-x-4 mb-8">
          <div
            className={`w-24 h-24 cursor-pointer ${activeScheme === 'light' ? 'border-4 border-blue-500' : 'border border-gray-300'}`}
            onClick={() => setActiveScheme('light')}
          >
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-800">Light</span>
            </div>
          </div>

          <div
            className={`w-24 h-24 cursor-pointer ${activeScheme === 'dark' ? 'border-4 border-blue-500' : 'border border-gray-300'}`}
            onClick={() => setActiveScheme('dark')}
          >
            <div className="h-full w-full bg-gray-800 flex items-center justify-center">
              <span className="text-white">Dark</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
