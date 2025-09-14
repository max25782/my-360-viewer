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
    <div className="w-full h-screen overflow-hidden">
      {/* 360° Panorama Viewer - Full Screen */}
      <NeoPanoramaViewer 
        houseId={house.id}
        selectedColor={selectedColor!}
      />
    </div>
  );
}
