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
  houseName: string;
  type: 'exterior' | 'interior';
}

// Interior Texture Configuration
const INTERIOR_TEXTURES = [
  { 
    id: 1, 
    name: 'Classic White', 
    path: '/assets/texture/interior/colors1.webp',
    pk: 1
  },
  { 
    id: 2, 
    name: 'Warm Gray', 
    path: '/assets/texture/interior/colors2.webp',
    pk: 2
  },
  { 
    id: 3, 
    name: 'Natural Wood', 
    path: '/assets/texture/interior/colors3.webp',
    pk: 3
  },
  { 
    id: 4, 
    name: 'Modern Black', 
    path: '/assets/texture/interior/colors4.webp',
    pk: 4
  }
];

const INTERIOR_ROOMS = ['kitchen', 'bedroom', 'bathroom', 'living'];

export default function UniversalDesignSelectorRedux({ 
  houseId, 
  houseName, 
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
            const response = await fetch(`/assets/${houseId}/interior/${room}/pk1.webp`, { method: 'HEAD' });
            if (response.ok) {
              existingRooms.push(room);
            } else {
              // Fallback to .jpg
              const jpgResponse = await fetch(`/assets/${houseId}/interior/${room}/pk1.jpg`, { method: 'HEAD' });
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

  const handleRoomChange = (direction: 'next' | 'prev') => {
    if (interiorRooms.length === 0) return;
    
    const newIndex = direction === 'next' 
      ? (currentRoomIndex + 1) % interiorRooms.length
      : (currentRoomIndex - 1 + interiorRooms.length) % interiorRooms.length;
    
    setCurrentRoomIndex(newIndex);
    const currentRoom = interiorRooms[newIndex];
    
    if (!currentRoom) return;
    
    // Обновляем выбранную комнату в Redux
    dispatch(setSelectedRoom({ houseId, room: currentRoom }));
    
    const selectedTextureConfig = INTERIOR_TEXTURES.find(t => t.id === selectedTexture);
    
    if (type === 'interior' && selectedTextureConfig && selectedPackage) {
      dispatch(loadDesignImage({
        houseId,
        type,
        packageData: selectedPackage,
        room: currentRoom,
        pk: selectedTextureConfig.pk
      }));
    }
  };

  const handlePhotoIndexChange = (photoIndex: number) => {
    dispatch(setCurrentPhotoIndex({ houseId, photoIndex }));
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
          <div className="aspect-video relative bg-gray-300 animate-pulse"></div>
        </div>
        <div className="flex justify-center space-x-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-16 h-12 bg-gray-300 rounded animate-pulse"></div>
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
      <h3 className={`text-xl font-semibold text-center ${
        type === 'exterior' ? 'text-gray-900' : 'text-white drop-shadow-lg'
      }`}>
        {type === 'exterior' ? 'Exterior Options' : 'Interior Finishes'}
      </h3>

      {/* Texture Selection for Interior */}
     

      {/* Main Image Display - Lazy Loading Optimized */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <div 
          className={`aspect-video relative overflow-hidden ${
            isImageLoading 
              ? ' bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200' 
              : 'bg-gray-100'
          }`}
          style={{
            minHeight: '360px', // Prevent CLS
            backgroundSize: isImageLoading ? '200% 100%' : 'cover',
            animation: isImageLoading ? 'shimmer 1.5s infinite' : 'none'
          }}
        >
          {/* Loading Skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="text-gray-500 text-sm font-medium animate-pulse">
                  Loading {type === 'exterior' ? 'exterior' : 'interior'} view...
                </div>
              </div>
            </div>
          )}
          {currentImage && (
            <img
              src={getImageUrl(currentImage)}
              alt={`${type === 'exterior' ? 'Exterior' : 'Interior'} view`}
              loading="lazy"
              decoding="async"
              className={`
                absolute inset-0 w-full h-full object-cover
                transition-all  ease-in-out 
                ${isImageLoading 
                  ? 'opacity-0 scale-105 blur-sm' 
                  : 'opacity-100 scale-100 blur-0'
                }
            
              `}
              style={{
                transition: 'opacity 0.7s ease-in-out, filter 0.7s ease-in-out'
              }}
            
            />
          )}
           {type === 'interior' && (
        <div className="flex flex-col items-center space-y-4">
          {/* Texture Buttons */}
          {/* <div className="flex justify-center space-x-4 mb-4">
            {INTERIOR_TEXTURES.map((texture) => (
              <button
                key={texture.id}
                onClick={() => handleTextureChange(texture.id)}
                className={`
                  w-16 h-16 rounded-full shadow-md transition-all transform hover:scale-110
                  ${selectedTexture === texture.id 
                    ? 'border-4 border-green-500 scale-110' 
                    : 'border-2 border-white hover:border-gray-300'}
                `}
                style={{
                  backgroundImage: `url('${texture.path}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                title={texture.name}
              />
            ))}
          </div> */}

          {/* Room Navigation */}
          {renderRoomNavigation()}
        </div>
      )}
          {/* Room Navigation Arrows */}
          {type === 'interior' && rooms.length > 1 && (
            <>
              {/* Left Arrow */}
              <button 
                onClick={() => {
                  const currentIndex = rooms.indexOf(selectedRoom);
                  const prevIndex = (currentIndex - 1 + rooms.length) % rooms.length;
                  const prevRoom = rooms[prevIndex];
                  handleRoomChange(prevRoom === selectedRoom ? 'prev' : 'next');
                }}
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
                onClick={() => {
                  const currentIndex = rooms.indexOf(selectedRoom);
                  const nextIndex = (currentIndex + 1) % rooms.length;
                  const nextRoom = rooms[nextIndex];
                  handleRoomChange(nextRoom === selectedRoom ? 'next' : 'prev');
                }}
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

          {/* Photo Navigation Dots (Interior multiple photos) */}
          {type === 'interior' && currentPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
              {currentPhotos.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handlePhotoIndexChange(index)}
                  className={`transition-all ${
                    index === currentPhotoIndex 
                      ? 'w-3 h-3 bg-white rounded-full shadow-lg' 
                      : 'w-3 h-3 bg-white bg-opacity-50 rounded-full hover:bg-opacity-80'
                  }`}
                  title={index === 0 ? 'Основной цвет' : `Вариант ${index}`}
                >
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Package Thumbnails - Lazy Loading */}
      <div className="flex justify-center space-x-6">
        {thumbnails.map((thumb: any) => (
          <div key={`${thumb.package.id}-${thumb.index}`} className="text-center">
            <button 
              onClick={() => handlePackageChange(thumb.index)}
              className={`w-16 h-12 rounded shadow-sm transition-all hover:scale-105 mb-2 block relative overflow-hidden ${
                selectedPackageIndex === thumb.index 
                  ? `border-4 ${type === 'exterior' ? 'border-blue-500' : 'border-green-500'}` 
                  : 'border-2 border-white hover:border-gray-300'
              }`}
              title={`Select ${thumb.package.name}`}
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
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'blur(0px)';
                }}
                onError={(e) => {
                  // Плавное исчезновение при ошибке
                  e.currentTarget.style.opacity = '0';
                  e.currentTarget.style.transform = 'scale(0.9)';
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                  setTimeout(() => {
                    e.currentTarget.style.display = 'none';
                  }, 250);
                }}
              />
            </button>
            <div className={`text-xs transition-colors ${
              selectedPackageIndex === thumb.index 
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
