'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useHouse } from '../../../../hooks/useHouses';
import PanoramaViewerRedux from '@/components/PanoramaViewerRedux';

export default function TourPage() {
  const params = useParams();
  const houseId = params?.slug as string;
  const { house, loading, error } = useHouse(houseId);
  const router = useRouter();

  function normalizeCategory(raw?: string) {
    if (!raw) return 'skyline';
    const s = String(raw).toLowerCase();
    if (s.includes('neo')) return 'neo';
    if (s.includes('prem')) return 'premium';
    if (s.includes('skyline')) return 'skyline';
    return 'skyline';
  }

  const category = normalizeCategory((house as any)?.category || (house as any)?.collection);

  const handleBackToHouse = () => {
    // Принудительно обновляем service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.update();
        });
      });
    }
    
    const ts = Date.now();
    // Полная навигация для гарантированного обхода кэша/старого дизайна
    if (category === 'neo') {
      window.location.href = `/neo/${house!.id}?ts=${ts}`;
    } else if (category === 'premium') {
      window.location.href = `/premium/${house!.id}?ts=${ts}`;
    } else {
      window.location.href = `/houses/${house!.id}?ts=${ts}`;
    }
  };

  const handleClose = () => {
    // Принудительно обновляем service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.update();
        });
      });
    }
    
    const ts = Date.now();
    // Полная навигация для гарантированного обхода кэша/старого дизайна
    if (category === 'neo') {
      window.location.href = `/neo?ts=${ts}`;
    } else if (category === 'premium') {
      window.location.href = `/premium?ts=${ts}`;
    } else {
      window.location.href = `/category/skyline?ts=${ts}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Loading Tour...</div>
          <div className="rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !house) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header overlay for tour */}
      <div className="absolute top-0 left-0 w-full z-50 bg-black bg-opacity-50 p-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={handleBackToHouse}
            className="flex items-center text-white"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {house.name}
          </button>
          
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold"> 360° Tour</h1>
            <p className="text-sm opacity-75">Navigate with mouse/touch • Click hotspots to move</p>
          </div>
          
          <button 
            onClick={handleClose}
            className="text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 360° Panorama Viewer */}
      <div className="w-full h-screen">
        <PanoramaViewerRedux houseId={house.id} />
      </div>

      {/* Tour Controls Footer */}
      <div className="absolute bottom-0 left-0 w-full z-50 bg-black bg-opacity-50 p-4">
        <div className="flex justify-center items-center space-x-4 text-white">
          <div className="text-sm">
            🖱️ Drag to look around • 🖼️ Click arrows to move rooms
          </div>
        </div>
      </div>
    </div>
  );
}