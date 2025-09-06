/**
 * UNIVERSAL DESIGN SELECTOR - REDUX VERSION
 * Production дизайн + Redux архитектура для 30+ домов
 * Includes caching, optimistic updates, and memoized selectors
 */

'use client';

import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadHouseAssets,
  loadDesignImage,
  setSelectedPackage,
  setSelectedRoom,
  setCurrentPhotoIndex
} from '../store/slices/universalSlice';
import * as universalSelectors from '../store/selectors/universalSelectors';
import { useState } from 'react';

interface UniversalDesignSelectorReduxProps {
  houseId: string;
  type: 'exterior' | 'interior';
}

// Interior Texture Configuration
const INTERIOR_TEXTURES = [
  {
    id: 1,
    name: 'Heritage',
    path: '/assets/skyline/texture/interior/colors1.webp',
    pk: 1
  },
  {
    id: 2,
    name: 'Haven',
    path: '/assets/skyline/texture/interior/colors2.webp',
    pk: 2
  },
  {
    id: 3,
    name: 'Serenity',
    path: '/assets/skyline/texture/interior/colors3.webp',
    pk: 3
  },
  {
    id: 4,
    name: 'Luxe',
    path: '/assets/skyline/texture/interior/colors4.webp',
    pk: 4
  }
];



export default function UniversalDesignSelectorRedux({
  houseId,
  type
}: UniversalDesignSelectorReduxProps) {
  const [selectedTexture, setSelectedTexture] = useState(1);
  const dispatch = useAppDispatch();

  // Мемоизированные селекторы для оптимальной производительности
  const isDataReady = useAppSelector(universalSelectors.selectIsHouseDataReady(houseId));
  const isLoading = useAppSelector(universalSelectors.selectIsHouseLoading(houseId));
  const isImageLoading = useAppSelector(universalSelectors.selectIsImageLoading(houseId));

  const packages = useAppSelector(type === 'exterior' ? universalSelectors.selectExteriorPackages(houseId) : universalSelectors.selectInteriorPackages(houseId));
  const rooms = useAppSelector(universalSelectors.selectAvailableRooms(houseId));
  const selectedPackage = useAppSelector(type === 'exterior' ? universalSelectors.selectSelectedExteriorPackage(houseId) : universalSelectors.selectSelectedInteriorPackage(houseId));
  const selectedRoom = useAppSelector(universalSelectors.selectSelectedRoom(houseId));
  const currentImage = useAppSelector(type === 'exterior' ? universalSelectors.selectCurrentExteriorImage(houseId) : universalSelectors.selectCurrentInteriorImage(houseId));
  const currentPhotos = useAppSelector(universalSelectors.selectCurrentInteriorPhotos(houseId));
  const currentPhotoIndex = useAppSelector(universalSelectors.selectCurrentPhotoIndex(houseId));
  const thumbnails = useAppSelector(type === 'exterior' ? universalSelectors.selectExteriorThumbnails(houseId) : universalSelectors.selectInteriorThumbnails(houseId));
  const selection = useAppSelector(universalSelectors.selectHouseSelectionById(houseId));

  // Мемоизированный URL handler для избежания hydration mismatch
  const [isMounted, setIsMounted] = React.useState(false);
  const getImageUrl = useMemo(() => {
    return (path: string) => {
      if (!path) {
        console.error('Attempted to get URL for undefined path');
        return '/placeholder-image.png'; // Запасной вариант
      }
      
      if (isMounted && typeof window !== 'undefined') {
        return `${window.location.origin}${path}`;
      }
      return path;
    };
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Загрузка данных дома
  useEffect(() => {
    dispatch(loadHouseAssets(houseId));
  }, [dispatch, houseId]);
  
  // Автоматически применяем текстуру при инициализации компонента
  const applyTexture = React.useCallback(() => {
    if (type === 'interior' && isDataReady && selectedPackage) {
      console.log(`Auto-applying texture ${selectedTexture} for ${houseId}`);
      const selectedTextureConfig = INTERIOR_TEXTURES.find(t => t.id === selectedTexture);
      if (selectedTextureConfig) {
        dispatch(loadDesignImage({
          houseId,
          type,
          packageData: selectedPackage,
          room: selectedRoom,
          pk: selectedTextureConfig.pk
        }));
      }
    }
  }, [isDataReady, selectedPackage, selectedRoom, type, houseId, dispatch, selectedTexture]);
  
  useEffect(() => {
    applyTexture();
  }, [applyTexture]);

  // Загрузка изображения при изменении выбора
  useEffect(() => {
    if (selectedPackage && isDataReady) {
      dispatch(loadDesignImage({
        houseId,
        type,
        packageData: selectedPackage,
        room: selectedRoom
      }));
    }
  }, [dispatch, houseId, type, selectedPackage, selectedRoom, isDataReady]);

  // Обработчики событий с optimistic updates
  const handlePackageChange = (packageIndex: number) => {
    // Optimistic update для мгновенного отклика UI
    dispatch(setSelectedPackage({ houseId, type, packageIndex }));

    // Загрузка изображения
    const packageData = packages[packageIndex];
    if (packageData) {
      dispatch(loadDesignImage({
        houseId,
        type,
        packageData,
        room: selectedRoom
      }));
    }
  };

  // Get actual interior rooms from file system structure
  const [actualInteriorRooms, setActualInteriorRooms] = useState<string[]>([]);

  useEffect(() => {
    if (type === 'interior') {
      // Get rooms from actual file structure instead of availableRooms
      const getActualInteriorRooms = async () => {
        const possibleRooms = ['kitchen', 'bedroom', 'bathroom', 'living', 'great room'];
        const existingRooms: string[] = [];

        for (const room of possibleRooms) {
          try {
            // Check if pk1.webp exists for this room
            const response = await fetch(`/assets/skyline/${houseId}/interior/${room}/pk1.webp`, { method: 'HEAD' });
            if (response.ok) {
              existingRooms.push(room);
            } else {
              // Fallback to .jpg
              const jpgResponse = await fetch(`/assets/skyline/${houseId}/interior/${room}/pk1.jpg`, { method: 'HEAD' });
              if (jpgResponse.ok) {
                existingRooms.push(room);
              }
            }
          } catch (error) {
            // Room doesn't exist, skip
          }
        }

        setActualInteriorRooms(existingRooms);
      };

      getActualInteriorRooms();
    }
  }, [houseId, type]);

  const interiorRooms = actualInteriorRooms;

  // State for current room index
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  // Reset room index when interiorRooms changes
  useEffect(() => {
    if (interiorRooms.length > 0 && currentRoomIndex >= interiorRooms.length) {
      setCurrentRoomIndex(0);
    }
  }, [interiorRooms, currentRoomIndex]);

  const handleTextureChange = async (textureId: number) => {
    setSelectedTexture(textureId);
    const selectedTextureConfig = INTERIOR_TEXTURES.find(t => t.id === textureId);

    if (type === 'interior' && selectedTextureConfig && selectedPackage) {
      // Используем текущую комнату из Redux, а не из interiorRooms
      const currentRoom = selectedRoom;

      dispatch(loadDesignImage({
        houseId,
        type,
        packageData: selectedPackage,
        room: currentRoom,
        pk: selectedTextureConfig.pk
      }));
    }
  };

  const handleRoomChange = (newRoom: string) => {
    if (interiorRooms.length === 0) return;

    // Находим индекс новой комнаты
    const newIndex = interiorRooms.indexOf(newRoom);
    if (newIndex === -1) return;

    setCurrentRoomIndex(newIndex);
    
    // Обновляем выбранную комнату в Redux
    dispatch(setSelectedRoom({ houseId, room: newRoom }));

    const selectedTextureConfig = INTERIOR_TEXTURES.find(t => t.id === selectedTexture);

    if (type === 'interior' && selectedTextureConfig && selectedPackage) {
      dispatch(loadDesignImage({
        houseId,
        type,
        packageData: selectedPackage,
        room: newRoom,
        pk: selectedTextureConfig.pk
      }));
    }
    
    console.log(`Changing room to: ${newRoom}, index: ${newIndex}, texture: ${selectedTexture}, package: ${selectedPackage?.id}`);
  }
  
  // Функция для циклического перехода к следующей комнате
  const goToNextRoom = () => {
    if (interiorRooms.length <= 1) return;
    
    const currentIndex = interiorRooms.indexOf(selectedRoom);
    const nextIndex = (currentIndex + 1) % interiorRooms.length;
    const nextRoom = interiorRooms[nextIndex];
    
    console.log(`🔄 goToNextRoom: current=${selectedRoom} (${currentIndex}) -> next=${nextRoom} (${nextIndex}), total=${interiorRooms.length}`);
    handleRoomChange(nextRoom);
  }
  
  // Функция для циклического перехода к предыдущей комнате
  const goToPrevRoom = () => {
    if (interiorRooms.length <= 1) return;
    
    const currentIndex = interiorRooms.indexOf(selectedRoom);
    const prevIndex = (currentIndex - 1 + interiorRooms.length) % interiorRooms.length;
    const prevRoom = interiorRooms[prevIndex];
    
    console.log(`🔄 goToPrevRoom: current=${selectedRoom} (${currentIndex}) -> prev=${prevRoom} (${prevIndex}), total=${interiorRooms.length}`);
    handleRoomChange(prevRoom);
  }

  const handlePhotoIndexChange = (photoIndex: number) => {
    // Если индекс выходит за пределы массива, делаем цикличный переход
    const normalizedIndex = (photoIndex + currentPhotos.length) % currentPhotos.length;
    dispatch(setCurrentPhotoIndex({ houseId, photoIndex: normalizedIndex }));
  };
  
  // Функция для перехода к следующему фото с цикличностью
  const goToNextPhoto = () => {
    if (!currentPhotos || !Array.isArray(currentPhotos) || currentPhotos.length <= 1) {
      console.log(`goToNextPhoto: No photos available or only one photo`);
      return;
    }
    
    // Явно приводим к числу, чтобы избежать проблем с типами
    const currentIndex = Number(currentPhotoIndex);
    const photosLength = currentPhotos.length;
    
    // Используем модульную арифметику для циклического перехода
    const nextIndex = (currentIndex + 1) % photosLength;
    
    console.log(`goToNextPhoto: current=${currentIndex}, next=${nextIndex}, total=${photosLength}`);
    dispatch(setCurrentPhotoIndex({ houseId, photoIndex: nextIndex }));
  };
  
  // Функция для перехода к предыдущему фото с цикличностью
  const goToPrevPhoto = () => {
    if (!currentPhotos || !Array.isArray(currentPhotos) || currentPhotos.length <= 1) {
      console.log(`goToPrevPhoto: No photos available or only one photo`);
      return;
    }
    
    // Явно приводим к числу, чтобы избежать проблем с типами
    const currentIndex = Number(currentPhotoIndex);
    const photosLength = currentPhotos.length;
    
    // Используем модульную арифметику для циклического перехода
    // +photosLength нужен для предотвращения отрицательного индекса
    const prevIndex = (currentIndex - 1 + photosLength) % photosLength;
    
    console.log(`goToPrevPhoto: current=${currentIndex}, prev=${prevIndex}, total=${photosLength}`);
    dispatch(setCurrentPhotoIndex({ houseId, photoIndex: prevIndex }));
  };

  const renderRoomNavigation = () => {
    if (type === 'interior' && interiorRooms.length > 0) {
      const currentRoom = interiorRooms[currentRoomIndex];

      // Защита от undefined/null
      if (!currentRoom) {
        return (
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-white drop-shadow-lg">
              Loading rooms...
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-white drop-shadow-lg">
            {currentRoom.charAt(0).toUpperCase() + currentRoom.slice(1)}
          </div>
          {interiorRooms.length > 1 && (
            <div className="text-xs text-white/70">
              ({currentRoomIndex + 1} of {interiorRooms.length})
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (isLoading || !isDataReady) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-video relative bg-gray-300"></div>
        </div>
        <div className="flex justify-center space-x-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-16 h-12 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const selectedPackageIndex = selection ?
    (type === 'exterior' ? selection.selectedExteriorPackage : selection.selectedInteriorPackage) : 0;

  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className={`text-xl font-semibold text-center ${type === 'exterior' ? 'text-gray-900' : 'text-white drop-shadow-lg'
        }`}>
        {type === 'exterior' ? 'Exterior Options' : 'Interior Finishes'}
      </h3>

      {/* Texture Selection for Interior - функциональность сохранена, UI отключен */}

      {/* Main Image Display - Lazy Loading Optimized */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <div
          className="aspect-video relative overflow-hidden bg-gray-100"
          style={{
            minHeight: '360px' // Prevent CLS
          }}
        >
          {currentImage && (
            <>
              <img
                src={getImageUrl(currentImage)}
                alt={`${type === 'exterior' ? 'Exterior' : 'Interior'} view`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // Обработка ошибки загрузки изображения
                  console.error(`Failed to load image: ${currentImage}`);
                  if (e.currentTarget && e.currentTarget.style) {
                    e.currentTarget.style.display = 'none';
                    // Показываем запасной вариант
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'absolute inset-0 bg-gray-200 flex items-center justify-center';
                      fallbackDiv.innerHTML = '<div class="text-gray-500">Image not available</div>';
                      parent.appendChild(fallbackDiv);
                    }
                  }
                }}
              />
              
            </>
          )}
          {type === 'interior' && (
            <div className="flex flex-col items-center space-y-4">
   

              {/* Room Navigation */}
              {renderRoomNavigation()}
            </div>
          )}
          {/* Room Navigation Arrows */}
          {type === 'interior' && interiorRooms.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={goToPrevRoom}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-2 shadow-md transition-all z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={goToNextRoom}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 rounded-full p-2 shadow-md transition-all z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Current Room Label */}
              {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/50 px-4 py-2 rounded-full z-10">
                <span className="text-gray-800 text-sm font-semibold">
                  {selectedRoom.charAt(0).toUpperCase() + selectedRoom.slice(1)}
                </span>
              </div> */}
            </>
          )}

       
        </div>
      </div>

      {/* Package Thumbnails - Lazy Loading */}
      <div className="flex justify-center space-x-6">
        {thumbnails.map((thumb: { package: { id: string; name: string }; index: number; thumbnailPath: string }) => (
          <div key={`${thumb.package.id}-${thumb.index}`} className="text-center">
                          <button
                onClick={() => handlePackageChange(thumb.index)}
                className={`w-16 h-12 rounded shadow-sm transition-all hover:scale-105 mb-2 block relative overflow-hidden ${selectedPackageIndex === thumb.index
                  ? `border-4 ${type === 'exterior' ? 'border-blue-500' : 'border-green-500'}`
                  : 'border-2 border-white hover:border-gray-300'
                }`}
                title={`Select ${thumb.package.name}`}
                onError={(e) => {
                  // Обработка ошибки на кнопке
                  if (e.currentTarget && e.currentTarget.style ) {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }
                }}
              >
              <img
                src={getImageUrl(thumb.thumbnailPath)}
                alt={`${thumb.package.name} thumbnail`}
                loading="lazy"
                decoding="async"
                className="
                  absolute inset-0 w-full h-full object-cover
                  transition-all duration-500 ease-in-out
                  opacity-0 scale-110 blur-sm
                  hover:scale-105 hover:brightness-110
                "
                style={{
                  transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out, filter 0.5s ease-in-out'
                }}
                onLoad={(e) => {
                  // Плавное появление миниатюры
                  if (e.currentTarget && e.currentTarget.style) {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.filter = 'blur(0px)';
                  }
                }}
                onError={(e) => {
                  // Плавное исчезновение при ошибке
                  if (e.currentTarget && e.currentTarget.style) {
                    e.currentTarget.style.opacity = '0';
                    e.currentTarget.style.transform = 'scale(0.9)';
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                    
                    // Сохраняем ссылку на currentTarget, так как она может измениться внутри setTimeout
                    const target = e.currentTarget;
                    setTimeout(() => {
                      if (target && target.style) {
                        target.style.display = 'none';
                      }
                    }, 250);
                  }
                }}
              />
            </button>
            <div className={`text-xs transition-colors ${selectedPackageIndex === thumb.index
                ? `${type === 'exterior' ? 'text-blue-600' : 'text-white'} font-bold ${type === 'interior' ? 'drop-shadow-lg' : ''}`
                : `${type === 'exterior' ? 'text-gray-600' : 'text-white text-opacity-80 drop-shadow'}`
              }`}>
              {thumb.package.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
