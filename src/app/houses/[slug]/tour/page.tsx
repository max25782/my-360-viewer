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
    <div className="w-full h-screen overflow-hidden">
      {/* 360° Panorama Viewer - Full Screen */}
      <PanoramaViewerRedux houseId={house.id} />
    </div>
  );
}