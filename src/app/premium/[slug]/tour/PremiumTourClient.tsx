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
  const handleBackToHouse = () => {
    // Переход на новую premium-страницу деталей
    router.push(`/premium/${slug}`);
  };
  const handleCloseToCollection = () => {
    router.push(`/premium`);
  };
  return (
    <div className="w-full h-screen overflow-hidden">
      {/* 360° Panorama Viewer - Full Screen */}
      <PanoramaViewerRedux 
        houseId={houseId}
        onClose={() => router.push(`/premium/${slug}`)}
        onBack={() => router.push(`/premium/${slug}`)}
      />
    </div>
  );
}
