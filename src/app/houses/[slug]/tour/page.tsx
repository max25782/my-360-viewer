'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useHouse } from '../../../../hooks/useHouses';
import PanoramaViewerRedux from '@/components/PanoramaViewerRedux';

export default function TourPage() {
  const params = useParams();
  const houseId = params?.slug as string;
  const { house, loading, error } = useHouse(houseId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Loading Tour...</div>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
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
          <Link 
            href={`/houses/${house.id}`}
            className="flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {house.name}
          </Link>
          
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold">{house.name} - 360° Tour</h1>
            <p className="text-sm opacity-75">Navigate with mouse/touch • Click hotspots to move</p>
          </div>
          
          <Link 
            href="/"
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
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