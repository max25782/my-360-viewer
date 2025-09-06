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
              
              // Сначала пробуем получить изображение hero.jpg/png/webp из директории 360
              try {
                console.log(`Checking for hero images for house: ${houseId}`);
                
                // Получаем правильное имя директории
                // Используем простую логику для маппинга имен
                const houseDirectoryMap: Record<string, string> = {
                  'walnut': 'Walnut',      // Заглавная W в файловой системе
                  'oak': 'Oak',            // Заглавная O в файловой системе
                  'tamarack': 'tamarack',  // lowercase в файловой системе
                  'laurel': 'laurel',      // lowercase в файловой системе
                  'pine': 'pine',          // lowercase в файловой системе
                  'ponderosa': 'ponderosa', // lowercase в файловой системе
                  'juniper': 'juniper',    // lowercase в файловой системе
                  'birch': 'birch',        // lowercase в файловой системе
                  'cypress': 'cypress',    // lowercase в файловой системе
                  'hemlock': 'hemlock',    // lowercase в файловой системе
                  'spruce': 'spruce',      // lowercase в файловой системе
                  'sage': 'sage',          // lowercase в файловой системе
                  'sapling': 'sapling'     // lowercase в файловой системе
                };
                
                const actualHouseId = houseDirectoryMap[houseId.toLowerCase()] || houseId;
                console.log(`Actual house directory: ${actualHouseId}`);
                
                // Проверяем наличие hero.jpg
                const heroJpgPath = `/assets/skyline/${actualHouseId}/360/hero.jpg`;
                console.log(`Checking: ${heroJpgPath}`);
                const heroJpgResponse = await fetch(heroJpgPath, { method: 'HEAD' });
                if (heroJpgResponse.ok) {
                  console.log(`Found hero image: ${heroJpgPath}`);
                  setDynamicPreviewImage(heroJpgPath);
                  setLoading(false);
                  return;
                }
                
                // Проверяем наличие hero.png
                const heroPngPath = `/assets/skyline/${actualHouseId}/360/hero.png`;
                console.log(`Checking: ${heroPngPath}`);
                const heroPngResponse = await fetch(heroPngPath, { method: 'HEAD' });
                if (heroPngResponse.ok) {
                  console.log(`Found hero image: ${heroPngPath}`);
                  setDynamicPreviewImage(heroPngPath);
                  setLoading(false);
                  return;
                }
                
                // Проверяем наличие hero.webp
                const heroWebpPath = `/assets/skyline/${actualHouseId}/360/hero.webp`;
                console.log(`Checking: ${heroWebpPath}`);
                const heroWebpResponse = await fetch(heroWebpPath, { method: 'HEAD' });
                if (heroWebpResponse.ok) {
                  console.log(`Found hero image: ${heroWebpPath}`);
                  setDynamicPreviewImage(heroWebpPath);
                  setLoading(false);
                  return;
                }
                
                console.log(`No hero image found for ${houseId}, falling back to standard path`);
              } catch (error) {
                console.error('Error checking for hero image:', error);
              }
              
              // Если hero изображение не найдено, используем стандартный путь
              const previewPath = assetPaths.tour360(houseId, firstRoom).thumbnail;
              setDynamicPreviewImage(previewPath);
            } else {
              // Fallback to default preview
              setDynamicPreviewImage('/assets/skyline/Walnut/360/entry/thumbnail.webp');
            }
        } else {
          // Fallback to default preview
          setDynamicPreviewImage('/assets/skyline/Walnut/360/entry/thumbnail.webp');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load preview data:', error);
        // Fallback to default preview
        setDynamicPreviewImage('/assets/skyline/Walnut/360/entry/thumbnail.webp');
        setLoading(false);
      }
    }
    
    loadPreviewData();
  }, [houseId, previewImage]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="aspect-video rounded-lg overflow-hidden shadow-2xl bg-gray-300"></div>
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
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <div className="w-32 h-32 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
          </div>
          
         
        </Link>
      </div>
      
      {/* Preview Info - точно как в старом компоненте */}
      <div className="mt-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">360° Virtual Tour</h3>
        <p className="text-gray-300">
          Experience in immersive 360° • Click to explore
        </p>
      </div>
    </div>
  );
}
