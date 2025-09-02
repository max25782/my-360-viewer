'use client';

import PanoramaViewerRedux from '@/components/PanoramaViewerRedux';

interface PremiumTourClientProps {
  houseId: string;
  houseName: string;
  slug: string;
}

export default function PremiumTourClient({ 
  houseId, 
  houseName, 
  slug 
}: PremiumTourClientProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Header overlay for tour */}
      <div className="absolute top-0 left-0 w-full z-50 bg-black bg-opacity-50 p-4">
        <div className="flex justify-between items-center">
          <a 
            href={`/premium/${slug}`}
            className="flex items-center text-white hover:text-emerald-400 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {houseName}
          </a>
          
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold">{houseName} 360° Tour</h1>
            <p className="text-sm opacity-75">Navigate with mouse/touch • Click hotspots to move</p>
          </div>
          
          <a 
            href="/premium"
            className="text-white hover:text-emerald-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </a>
        </div>
      </div>

      {/* 360° Panorama Viewer */}
      <div className="w-full h-screen">
        <PanoramaViewerRedux houseId={houseId} />
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
