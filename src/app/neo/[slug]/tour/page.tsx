'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useNeoHouse } from '../../../../hooks/useNeoHouse';
import NeoColorSelector from '../../../../components/Neo/NeoColorSelector';
import NeoPanoramaViewer from '../../../../components/Neo/NeoPanoramaViewer';

export default function NeoTourPage() {
  const [selectedColor, setSelectedColor] = useState<'white' | 'dark' | null>(null);
  const [showColorSelector, setShowColorSelector] = useState(true);
  const params = useParams();
  const slug = params?.slug as string;
  
  console.log(`🔍 NeoTourPage: params =`, params);
  console.log(`🔍 NeoTourPage: slug = "${slug}"`);
  
  // Проверяем, что slug определен, прежде чем использовать useNeoHouse
  const shouldLoadHouse = slug && slug !== 'undefined' && slug !== 'null';
  const { house, loading, error } = useNeoHouse(shouldLoadHouse ? slug : 'dummy-house-to-prevent-undefined');
  const router = useRouter();

  // Reset state when house changes
  useEffect(() => {
    setSelectedColor(null);
    setShowColorSelector(true);
  }, [slug]);

  const handleColorSelected = (color: 'white' | 'dark') => {
    setSelectedColor(color);
    setShowColorSelector(false);
  };

  const handleBackToSelection = () => {
    setSelectedColor(null);
    setShowColorSelector(true);
  };

  const handleBackToHouse = () => {
    const clean = (slug || '').toLowerCase().startsWith('neo-') ? (slug as string).substring(4) : (slug as string);
    // Навигация на новую neo-страницу деталей
    router.push(`/neo/${clean}`);
  };

  // Если slug недействителен, показываем ошибку
  if (!shouldLoadHouse) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid House ID</h2>
          <p className="text-gray-600 mb-6">
            The house identifier "{slug}" is not valid.
          </p>
          <button 
            onClick={() => router.push('/neo')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Neo Collection
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Neo Tour</h2>
          <p className="text-gray-600">Preparing your immersive experience...</p>
        </div>
      </div>
    );
  }

  if (error || !house) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tour Not Available</h2>
          <p className="text-gray-600 mb-6">
            {error || `The Neo house "${slug}" could not be found.`}
          </p>
          <button 
            onClick={() => router.push('/neo')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Neo Collection
          </button>
        </div>
      </div>
    );
  }

  // Show color selector first
  if (showColorSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <NeoColorSelector 
          onColorSelected={handleColorSelected}
          onCancel={handleBackToHouse}
          houseName={house.name}
        />
      </div>
    );
  }

  // Show 360° tour with selected color
  return (
    <div className="min-h-screen ">
      {/* Tour Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToSelection}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Change Color
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                selectedColor === 'white' 
                  ? 'bg-white border-2 border-gray-300' 
                  : 'bg-gray-900 border-2 border-gray-600'
              }`}></div>
              <span className="text-white font-medium">
                {selectedColor === 'white' ? 'White' : 'Dark'} Scheme
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-white text-sm">
              <span className="font-semibold">{house.name}</span>
              <span className="text-gray-300 ml-2">• Neo ADU Series</span>
            </div>
            
            <button
              onClick={handleBackToHouse}
              className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-lg transition-all"
            >
              Exit Tour
            </button>
          </div>
        </div>
      </div>

      {/* 360° Panorama Viewer */}
      <div className="pt-16">
        <NeoPanoramaViewer 
          houseId={house.id}
          selectedColor={selectedColor!}
        />
      </div>

      {/* Tour Controls - could be added later */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-white text-sm text-center">
            Click and drag to look around • Use markers to navigate between rooms
          </p>
        </div>
      </div>
    </div>
  );
}
