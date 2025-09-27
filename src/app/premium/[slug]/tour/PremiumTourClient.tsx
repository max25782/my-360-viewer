'use client';

import PanoramaViewerRedux from '@/components/PanoramaViewerRedux';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  return (
    <div className="w-full h-screen overflow-hidden">
      {/* 360° Panorama Viewer - Full Screen */}
      <PanoramaViewerRedux 
        houseId={houseId}
        onClose={() => router.push(`/house/${encodeURIComponent(slug)}`)}
        onBack={() => router.push(`/house/${encodeURIComponent(slug)}`)}
      />
    </div>
  );
}
