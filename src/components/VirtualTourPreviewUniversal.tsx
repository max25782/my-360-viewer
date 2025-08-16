/**
 * PRODUCTION VIRTUAL TOUR PREVIEW - UNIVERSAL VERSION
 * Сохраняет старый дизайн, но использует новую JSON-driven архитектуру
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hasTour360, getTour360Config } from '../utils/universalAssets';
import { assetPaths } from '../utils/assetPaths';

interface VirtualTourPreviewUniversalProps {
  houseId: string;
  houseName: string;
  previewImage?: string;
}

export default function VirtualTourPreviewUniversal({ 
  houseId, 
  houseName, 
  previewImage 
}: VirtualTourPreviewUniversalProps) {
  const [dynamicPreviewImage, setDynamicPreviewImage] = useState<string>('');
  const [hasTouring, setHasTouring] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreviewData() {
      try {
        setLoading(true);
        
        // Check if 360° tour is available
        const tourAvailable = await hasTour360(houseId);
        setHasTouring(tourAvailable);
        
        if (previewImage) {
          setDynamicPreviewImage(previewImage);
        } else if (tourAvailable) {
          // Get preview image from tour configuration
          const tourConfig = await getTour360Config(houseId);
          if (tourConfig && tourConfig.rooms && tourConfig.rooms.length > 0) {
            const firstRoom = tourConfig.rooms[0];
            const previewPath = assetPaths.tour360(houseId, firstRoom).thumbnail;
            setDynamicPreviewImage(previewPath);
          } else {
            // Fallback to Walnut if no tour found
            setDynamicPreviewImage('/assets/Walnut/3D/entry/thumbnail-qwc9E691mj83t8TKcLx5erIxLUnmEEt0.jpg');
          }
        } else {
          // Fallback to Walnut if no tour found
          setDynamicPreviewImage('/assets/Walnut/3D/entry/thumbnail-qwc9E691mj83t8TKcLx5erIxLUnmEEt0.jpg');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load preview data:', error);
        // Fallback to Walnut
        setDynamicPreviewImage('/assets/Walnut/3D/entry/thumbnail-qwc9E691mj83t8TKcLx5erIxLUnmEEt0.jpg');
        setLoading(false);
      }
    }
    
    loadPreviewData();
  }, [houseId, previewImage]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-300 animate-pulse"></div>
        <div className="mt-4 text-center">
          <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!hasTouring) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">360° Virtual Tour</h3>
            <p className="text-gray-400">Coming soon for {houseName}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div 
        className="aspect-video rounded-lg overflow-hidden shadow-2xl relative group cursor-pointer"
        style={{
          minHeight: '360px', // Prevent CLS
          backgroundImage: `url('${dynamicPreviewImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Link href={`/houses/${houseId}/tour`}>
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-opacity-40"></div>
          
          {/* Play Button Overlay - точно как в старом компоненте */}
          <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <div className="w-32 h-32 bg-slate-700 bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white border-opacity-30 shadow-2xl">
              <div 
                className="w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-2" 
                style={{
                  borderLeftWidth: '20px',
                  borderTopWidth: '12px',
                  borderBottomWidth: '12px'
                }}
              ></div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Preview Info - точно как в старом компоненте */}
      <div className="mt-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">360° Virtual Tour</h3>
        <p className="text-gray-300">
          Experience {houseName} in immersive 360° • Click to explore
        </p>
      </div>
    </div>
  );
}
