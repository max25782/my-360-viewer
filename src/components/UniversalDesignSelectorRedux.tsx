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

interface UniversalDesignSelectorReduxProps {
  houseId: string;
  houseName: string;
  type: 'exterior' | 'interior';
}

export default function UniversalDesignSelectorRedux({ 
  houseId, 
  houseName, 
  type 
}: UniversalDesignSelectorReduxProps) {
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

  const handleRoomChange = (room: string) => {
    // Optimistic update
    dispatch(setSelectedRoom({ houseId, room }));
    
    // Загрузка изображения
    if (selectedPackage) {
      dispatch(loadDesignImage({
        houseId,
        type,
        packageData: selectedPackage,
        room
      }));
    }
  };

  const handlePhotoIndexChange = (photoIndex: number) => {
    dispatch(setCurrentPhotoIndex({ houseId, photoIndex }));
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


      {/* Main Image Display */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <div 
          className={`aspect-video relative ${isImageLoading ? 'animate-pulse bg-gray-300' : ''}`}
          style={{
            backgroundImage: currentImage ? `url('${getImageUrl(currentImage)}')` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Photo Navigation Dots (Interior multiple photos) */}
          {type === 'interior' && currentPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {currentPhotos.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handlePhotoIndexChange(index)}
                  className={`w-3 h-3 rounded-full transition-opacity ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Package Thumbnails */}
      <div className="flex justify-center space-x-6">
        {thumbnails.map((thumb: any) => (
          <div key={`${thumb.package.id}-${thumb.index}`} className="text-center">
            <button 
              onClick={() => handlePackageChange(thumb.index)}
              className={`w-16 h-12 rounded shadow-sm transition-all hover:scale-105 mb-2 block ${
                selectedPackageIndex === thumb.index 
                  ? `border-4 ${type === 'exterior' ? 'border-blue-500' : 'border-green-500'}` 
                  : 'border-2 border-white hover:border-gray-300'
              }`}
              style={{
                backgroundImage: `url('${getImageUrl(thumb.thumbnailPath)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              title={`Select ${thumb.package.name}`}
            />
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
