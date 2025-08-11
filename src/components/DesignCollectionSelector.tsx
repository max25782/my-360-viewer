'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DesignCollectionSelectorProps {
  houseName: string;
}

export default function DesignCollectionSelector({ houseName }: DesignCollectionSelectorProps) {
  const [selectedCollection, setSelectedCollection] = useState('heritage');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Base paths for images
  const basePaths = {
    heritage: '/Walnut/walnut_color/Walnut-PK1-EXT-BEST-PK1-WALNUT-FRONT.jpg',
    haven: '/Walnut/walnut_color/Walnut-PK2-EXT-BEST-PK2-WALNUT-FRONT.jpg',
        serenity: '/Walnut/walnut_color/Walnut-PK3-EXT-BEST-PK3-WALNUT-FRONT.jpg',
    luxe: '/Walnut/walnut_color/Walnut-PK4-EXT-BEST-PK4-WALNUT-FRONT.jpg'
  };

  const thumbnailData = [
    { path: '/Walnut/walnut_color/design-package-thumb-1.jpg', collection: 'heritage' },
    { path: '/Walnut/walnut_color/design-package-thumb-2.jpg', collection: 'haven' },
        { path: '/Walnut/walnut_color/design-package-thumb-3.jpg', collection: 'serenity' },
    { path: '/Walnut/walnut_color/design-package-thumb-4.jpg', collection: 'luxe' }
  ];

  // Use absolute URLs only after mounting to avoid hydration mismatch
  const getImageUrl = (path: string) => {
    if (mounted && typeof window !== 'undefined') {
      return `${window.location.origin}${path}`;
    }
    return path;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <div 
          className="aspect-video relative"
          style={{
            backgroundImage: `url('${getImageUrl(basePaths[selectedCollection as keyof typeof basePaths])}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
  
        </div>
      </div>
      
            {/* Design Collection Thumbnails with Names */}
      <div className="flex justify-center space-x-6">
        {thumbnailData.map((thumb, index) => (
          <div key={index} className="text-center">
            <button 
              onClick={() => setSelectedCollection(thumb.collection)}
              className={`w-16 h-12 rounded shadow-sm transition-all hover:scale-105 mb-2 block ${
                selectedCollection === thumb.collection 
                  ? 'border-4 border-blue-500' 
                  : 'border-2 border-white hover:border-gray-300'
              }`}
              style={{
                backgroundImage: `url('${getImageUrl(thumb.path)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              title={`Select ${thumb.collection} collection`}
            ></button>
            <div className={`text-xs transition-colors ${
              selectedCollection === thumb.collection 
                ? 'text-blue-600 font-bold' 
                : 'text-gray-600'
            }`}>
              {thumb.collection === 'heritage' && 'Heritage (DC1)'}
              {thumb.collection === 'haven' && 'Haven (DC2)'}
              {thumb.collection === 'serenity' && 'Serenity (DC3)'}
              {thumb.collection === 'luxe' && 'Luxe (DC4)'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
