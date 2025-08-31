'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface PremiumExteriorCarouselProps {
  houseId: string;
  maxDP: number;
}

export default function PremiumExteriorCarousel({ houseId, maxDP }: PremiumExteriorCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [exteriorImages, setExteriorImages] = useState<string[]>([]);
  
  // Use refs to avoid re-renders
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Optimized function to check image existence
  const checkImageExists = useCallback(async (path: string): Promise<boolean> => {
    try {
      // Используем GET вместо HEAD с range запросом для получения только заголовков
      const response = await fetch(path, { 
        method: 'GET',
        headers: { 'Range': 'bytes=0-0' },
        cache: 'force-cache'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }, []);

  // Load all exterior images once
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      
      const images: string[] = [];
      const placeholderPath = '/assets/placeholder.jpg';
      
      // Check images in parallel for faster loading
      const checkPromises: Promise<void>[] = [];
      
      for (let dp = 1; dp <= maxDP; dp++) {
        const checkDPImage = async () => {
          // Сразу используем jpg, так как мы создали заглушки только в этом формате
          const path = `/assets/premium/${houseId}/exterior/dp${dp}.jpg`;
          try {
            const exists = await checkImageExists(path);
            if (exists) {
              images.push(path);
            } else if (dp === 1) { // Только для dp1 добавляем заглушку, если файл не найден
              images.push(placeholderPath);
            }
          } catch (error) {
            if (dp === 1) { // Только для dp1 добавляем заглушку при ошибке
              images.push(placeholderPath);
            }
          }
        };
        checkPromises.push(checkDPImage());
      }
      
      await Promise.all(checkPromises);
      
      // Add placeholder if no images found
      if (images.length === 0) {
        images.push(placeholderPath);
      }
      
      setExteriorImages(images);
      setIsLoading(false);
    };
    
    loadImages();
  }, [houseId, maxDP, checkImageExists]);

  // Update the DOM directly when image index changes
  useEffect(() => {
    if (exteriorImages.length === 0 || !imageRef.current || !labelRef.current) return;
    
    // Update image source directly
    imageRef.current.src = exteriorImages[currentIndex];
    imageRef.current.alt = `Exterior design ${currentIndex + 1}`;
    
    // Update label directly
    labelRef.current.textContent = `Exterior (${currentIndex + 1}/${exteriorImages.length})`;
    
    // Preload next image
    if (exteriorImages.length > 1) {
      const nextIndex = currentIndex === exteriorImages.length - 1 ? 0 : currentIndex + 1;
      const preloadImage = new window.Image();
      preloadImage.src = exteriorImages[nextIndex];
    }
  }, [currentIndex, exteriorImages]);

  // Go to next image with loop
  const goToNext = useCallback(() => {
    if (exteriorImages.length <= 1) return;
    
    setCurrentIndex(prevIndex => 
      prevIndex === exteriorImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [exteriorImages.length]);

  // Go to previous image with loop
  const goToPrev = useCallback(() => {
    if (exteriorImages.length <= 1) return;
    
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? exteriorImages.length - 1 : prevIndex - 1
    );
  }, [exteriorImages.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-400" suppressHydrationWarning>Loading exterior images...</div>
      </div>
    );
  }

  // No images state
  if (exteriorImages.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500" suppressHydrationWarning>No exterior images available</div>
      </div>
    );
  }

  const initialImage = exteriorImages[currentIndex];

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg" 
         ref={imageContainerRef}
         style={{ 
           height: "400px", 
           minHeight: "400px",
           contain: "layout paint" 
         }}>
      {/* Fast loading placeholder for LCP */}
      <div className="absolute inset-0 bg-slate-700 w-full h-full" style={{ zIndex: 1 }} />
      
      {/* Image container with direct DOM manipulation */}
      <div className="relative w-full h-full">
        <img
          ref={imageRef}
          src={initialImage}
          alt={`Exterior design ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 2 }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        
        {/* Label */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full z-10">
          <span 
            ref={labelRef}
            className="text-white text-sm font-semibold"
            suppressHydrationWarning
          >
            Exterior ({currentIndex + 1}/{exteriorImages.length})
          </span>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-2 shadow-md transition-all z-10"
        aria-label="Previous design"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-2 shadow-md transition-all z-10"
        aria-label="Next design"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}