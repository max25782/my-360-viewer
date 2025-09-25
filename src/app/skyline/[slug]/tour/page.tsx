'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useHouse } from '../../../../hooks/useHouses';
import PanoramaViewerRedux from '@/components/PanoramaViewerRedux';

export default function SkylineTourPage() {
  const params = useParams();
  const houseId = params?.slug as string;
  const { house, loading, error } = useHouse(houseId);
  const router = useRouter();

  const handleBackToHouse = () => {
    // Навигация на новую страницу деталей Skyline
    router.push(`/skyline/${house!.id}`);
  };

  const handleClose = () => {
    // Возврат к коллекции Skyline в новом роутинге
    router.push(`/skyline`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Loading Skyline Tour...</div>
          <div className="rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto animate-spin"></div>
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
      <PanoramaViewerRedux 
        houseId={house.id}
        onClose={() => router.back()}
        onBack={() => router.back()}
      />
    </div>
  );
}
