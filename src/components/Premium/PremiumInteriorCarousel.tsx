'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface PremiumInteriorCarouselProps {
  houseId: string;
  availableRooms: string[];
  maxPK: number;
}

export default function PremiumInteriorCarousel({ 
  houseId, 
  availableRooms, 
  maxPK 
}: PremiumInteriorCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [allImages, setAllImages] = useState<Array<{path: string, room: string}>>([]);
  
  // Use refs to avoid re-renders
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const roomLabelRef = useRef<HTMLSpanElement>(null);

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

  // Динамически определяем доступные комнаты и их изображения
  useEffect(() => {
    const loadAllInteriorImages = async () => {
      setIsLoading(true);
      
      const images: Array<{path: string, room: string}> = [];
      const placeholderPath = '/assets/placeholder.jpg';
      
      // Проверяем изображения параллельно для ускорения загрузки
      const checkPromises: Promise<void>[] = [];
      
      // Если список комнат предоставлен, используем его
      if (availableRooms && availableRooms.length > 0) {
        // Используем предоставленный список комнат
        for (const room of availableRooms) {
          for (let pk = 1; pk <= maxPK; pk++) {
            const checkMainImage = async () => {
              const formats = ['jpg', 'webp'];
              for (const format of formats) {
                const path = `/assets/premium/${houseId}/interior/${room}/pk${pk}.${format}`;
                try {
                  const exists = await checkImageExists(path);
                  if (exists) {
                    images.push({ path, room });
                    break; // Если нашли изображение в одном формате, переходим к следующему pk
                  }
                } catch (error) {
                  // Игнорируем ошибки
                }
              }
              
              // Если изображение не найдено и это первый pk, используем заглушку
              if (pk === 1 && !images.some(img => img.room === room)) {
                images.push({ path: placeholderPath, room });
              }
            };
            checkPromises.push(checkMainImage());
          }
        }
      } else {
        // Если список комнат не предоставлен, импортируем список из утилиты
        // Импортируем динамически для избежания проблем с серверным рендерингом
        const { commonPremiumRooms, getPremiumRoomsForHouse } = await import('../../utils/clientPremiumRooms');
        
        // Получаем список комнат для конкретного дома или используем общий список
        const commonRooms = getPremiumRoomsForHouse(houseId);
        
        for (const room of commonRooms) {
          const checkRoom = async () => {
            const path = `/assets/premium/${houseId}/interior/${room}/pk1.jpg`;
            try {
              const exists = await checkImageExists(path);
              if (exists) {
                images.push({ path, room });
                
                // Если первое изображение существует, проверяем остальные pk
                for (let pk = 2; pk <= maxPK; pk++) {
                  const formats = ['jpg', 'webp'];
                  for (const format of formats) {
                    const additionalPath = `/assets/premium/${houseId}/interior/${room}/pk${pk}.${format}`;
                    try {
                      const additionalExists = await checkImageExists(additionalPath);
                      if (additionalExists) {
                        images.push({ path: additionalPath, room });
                        break;
                      }
                    } catch (error) {
                      // Игнорируем ошибки
                    }
                  }
                }
              }
            } catch (error) {
              // Игнорируем ошибки
            }
          };
          checkPromises.push(checkRoom());
        }
      }
      
      await Promise.all(checkPromises);
      
      // If no images found, add placeholder
      if (images.length === 0) {
        images.push({ path: placeholderPath, room: 'No Room Available' });
      }
      
      // Sort images by room name for logical order
      images.sort((a, b) => a.room.localeCompare(b.room));
      
      setAllImages(images);
      setIsLoading(false);
      
      // Preload next image
      if (images.length > 1) {
        const nextImage = new window.Image();
        nextImage.src = images[1].path;
      }
    };
    
    loadAllInteriorImages();
  }, [houseId, availableRooms, maxPK, checkImageExists]);

  // Логирование для отладки
  useEffect(() => {
    if (allImages.length > 0) {
      console.log(`Loaded ${allImages.length} interior images for ${houseId}:`, 
        allImages.map(img => `${img.room}: ${img.path}`));
    }
  }, [allImages, houseId]);

  // Update the DOM directly when image index changes
  useEffect(() => {
    if (allImages.length === 0 || !imageRef.current || !roomLabelRef.current) return;
    
    const currentImage = allImages[currentImageIndex];
    
    // Update image source directly
    imageRef.current.src = currentImage.path;
    imageRef.current.alt = `Interior - ${formatRoomName(currentImage.room)}`;
    
    // Update room label directly
    roomLabelRef.current.textContent = `${formatRoomName(currentImage.room)} (${currentImageIndex + 1}/${allImages.length})`;
    
    // Preload next image
    if (allImages.length > 1) {
      const nextIndex = currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1;
      const preloadImage = new window.Image();
      preloadImage.src = allImages[nextIndex].path;
    }
  }, [currentImageIndex, allImages]);

  // Format room name for display
  const formatRoomName = useCallback((roomName: string) => {
    return roomName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  // Go to next image with loop
  const goToNextImage = useCallback(() => {
    if (allImages.length <= 1) return;
    
    setCurrentImageIndex(prevIndex => 
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [allImages.length]);

  // Go to previous image with loop
  const goToPrevImage = useCallback(() => {
    if (allImages.length <= 1) return;
    
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  }, [allImages.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-400" suppressHydrationWarning>Loading interior images...</div>
      </div>
    );
  }

  // No images state
  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500" suppressHydrationWarning>No interior images available</div>
      </div>
    );
  }

  const initialImage = allImages[currentImageIndex];

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
          src={initialImage.path}
          alt={`Interior - ${formatRoomName(initialImage.room)}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 2 }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        
        {/* Room name label */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full z-10">
          <span 
            ref={roomLabelRef}
            className="text-white text-sm font-semibold"
            suppressHydrationWarning
          >
            {formatRoomName(initialImage.room)} ({currentImageIndex + 1}/{allImages.length})
          </span>
        </div>
      </div>
      
      {/* Navigation buttons */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={goToPrevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-2 shadow-md transition-all z-10"
            aria-label="Previous image"
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
            onClick={goToNextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-2 shadow-md transition-all z-10"
            aria-label="Next image"
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
        </>
      )}
    </div>
  );
}