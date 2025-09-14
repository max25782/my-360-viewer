'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Интерфейс для манифеста ассетов
interface AssetManifest {
  houses: {
    [house: string]: {
      rooms: {
        [room: string]: {
          photos: Array<{
            filename: string;
            path: string;
            type: string;
          }>;
        };
      };
    };
  };
  generatedAt: string;
}

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

  // Преобразуем houseId для правильного регистра и удаления префикса
  const cleanHouseId = houseId.toLowerCase().startsWith('premium-') 
    ? houseId.substring(8) // Удаляем "premium-" (8 символов)
    : houseId;
  const capitalizedHouseId = cleanHouseId.charAt(0).toUpperCase() + cleanHouseId.slice(1).toLowerCase();

  // Функция всегда возвращает true, чтобы избежать проверок существования файлов
  const checkImageExists = useCallback(async (path: string): Promise<boolean> => {
    return true; // Всегда предполагаем, что изображение существует
  }, []);

  // Загружаем изображения из манифеста
  useEffect(() => {
    const loadImagesFromManifest = async () => {
      setIsLoading(true);
      
      const images: Array<{path: string, room: string}> = [];
      const placeholderPath = '/assets/placeholder.jpg';
      
      try {
        // Загружаем манифест
        const manifestResponse = await fetch('/premium-interior-manifest.json');
        if (!manifestResponse.ok) {
          throw new Error('Не удалось загрузить манифест ассетов');
        }
        
        const manifest: AssetManifest = await manifestResponse.json();
        console.log(`Загружен манифест ассетов, дата генерации: ${manifest.generatedAt}`);
        
        // Получаем данные для текущего дома (используем уже обработанный capitalizedHouseId)
        const houseData = manifest.houses[capitalizedHouseId];
        console.log(`🏠 PREMIUM INTERIOR: Looking for house data: ${houseId} → ${capitalizedHouseId}`);
        
        if (!houseData) {
          console.warn(`Дом ${capitalizedHouseId} не найден в манифесте`);
          images.push({ path: placeholderPath, room: 'No Room Available' });
        } else {
          // Если указан список комнат, используем только их
          const roomsToUse = availableRooms && availableRooms.length > 0 
            ? availableRooms 
            : Object.keys(houseData.rooms);
          
          // Для каждой комнаты получаем фотографии
          for (const room of roomsToUse) {
            const roomData = houseData.rooms[room];
            if (!roomData) continue;
            
            // Фильтруем только фотографии типа 'photo' (pk*)
            const photos = roomData.photos.filter(photo => photo.type === 'photo');
            
            if (photos.length > 0) {
              // Добавляем все найденные фотографии для комнаты
              photos.forEach(photo => {
                images.push({ path: photo.path, room });
              });
            } else {
              // Если фотографий нет, добавляем плейсхолдер для комнаты
              images.push({ path: placeholderPath, room });
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке манифеста:', error);
        // В случае ошибки добавляем плейсхолдер
        images.push({ path: placeholderPath, room: 'No Room Available' });
      }
      
      // Если изображений нет, добавляем плейсхолдер
      if (images.length === 0) {
        images.push({ path: placeholderPath, room: 'No Room Available' });
      }
      
      // Сортируем изображения по имени комнаты
      images.sort((a, b) => a.room.localeCompare(b.room));
      
      console.log(`Загружено ${images.length} изображений интерьера для ${houseId}`);
      
      setAllImages(images);
      setIsLoading(false);
      
      // Предзагружаем следующее изображение
      if (images.length > 1) {
        const nextImage = new window.Image();
        nextImage.src = images[1].path;
      }
    };
    
    loadImagesFromManifest();
  }, [houseId, capitalizedHouseId, availableRooms]);

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
      <div className="w-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center" 
           style={{ height: "600px", minHeight: "600px" }}>
        <div className="text-gray-400" suppressHydrationWarning>Loading interior images...</div>
      </div>
    );
  }

  // No images state
  if (allImages.length === 0) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" 
           style={{ height: "600px", minHeight: "600px" }}>
        <div className="text-gray-500" suppressHydrationWarning>No interior images available</div>
      </div>
    );
  }

  const initialImage = allImages[currentImageIndex];

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg" 
         ref={imageContainerRef}
         style={{ 
           height: "600px", 
           minHeight: "600px",
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