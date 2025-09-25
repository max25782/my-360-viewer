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
  const hardNavigate = (url: string) => {
    // Обновление SW и жесткая перезагрузка для обхода старого кэша в PWA
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(r => r.update());
        });
      }
    } catch {}
    const ts = Date.now();
    window.location.href = `${url}${url.includes('?') ? '&' : '?'}ts=${ts}`;
  };
  return (
    <div className="w-full h-screen overflow-hidden">
      {/* 360° Panorama Viewer - Full Screen */}
      <PanoramaViewerRedux 
        houseId={houseId}
        onClose={() => hardNavigate(`/premium/${slug}`)}
        onBack={() => hardNavigate(`/premium/${slug}`)}
      />
    </div>
  );
}
