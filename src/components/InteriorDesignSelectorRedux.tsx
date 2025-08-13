'use client';

import { useEffect, useMemo, useCallback } from 'react';

// Redux imports
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setInterior, 
  setCurrentRoom, 
  setCurrentImage, 
  navigateImage, 
  setMounted 
} from '../store/slices/designSlice';
import {
  selectSelectedInterior,
  selectCurrentRoomIndex,
  selectCurrentImageIndex,
  selectIsMounted,
  selectCurrentStyleRooms,
  selectCurrentRoom,
  selectCurrentRoomImages,
  selectCurrentImage,
  selectCurrentPackage,
  selectInteriorThumbnails,
  selectCanNavigateNext,
  selectCanNavigatePrev,
} from '../store/selectors/designSelectors';

interface InteriorDesignSelectorProps {
  houseName: string;
}

export default function InteriorDesignSelectorRedux({ houseName }: InteriorDesignSelectorProps) {
  const dispatch = useAppDispatch();
  
  // Redux selectors with automatic memoization
  const selectedInterior = useAppSelector(selectSelectedInterior);
  const currentRoomIndex = useAppSelector(selectCurrentRoomIndex);
  const currentImageIndex = useAppSelector(selectCurrentImageIndex);
  const isMounted = useAppSelector(selectIsMounted);
  const currentStyleRooms = useAppSelector(selectCurrentStyleRooms);
  const currentRoom = useAppSelector(selectCurrentRoom);
  const currentRoomImages = useAppSelector(selectCurrentRoomImages);
  const currentImage = useAppSelector(selectCurrentImage);
  const currentPackage = useAppSelector(selectCurrentPackage);
  const interiorThumbnails = useAppSelector(selectInteriorThumbnails);
  const canNavigateNext = useAppSelector(selectCanNavigateNext);
  const canNavigatePrev = useAppSelector(selectCanNavigatePrev);

  useEffect(() => {
    dispatch(setMounted(true));
  }, [dispatch]);

  // Memoized URL handler to avoid hydration mismatch
  const getImageUrl = useMemo(() => {
    return (path: string) => path;
  }, []);

  // Optimized navigation functions with useCallback to prevent re-renders
  const nextImage = useCallback(() => {
    if (currentImageIndex < currentRoomImages.length - 1) {
      dispatch(setCurrentImage(currentImageIndex + 1));
    } else if (currentRoomIndex < currentStyleRooms.length - 1) {
      // Go to next room, first image
      dispatch(navigateImage({ roomIndex: currentRoomIndex + 1, imageIndex: 0 }));
    }
  }, [currentImageIndex, currentRoomImages.length, currentRoomIndex, currentStyleRooms.length, dispatch]);

  const prevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      dispatch(setCurrentImage(currentImageIndex - 1));
    } else if (currentRoomIndex > 0) {
      // Go to previous room, last image
      const prevRoomIndex = currentRoomIndex - 1;
      const prevRoom = currentStyleRooms[prevRoomIndex];
      dispatch(navigateImage({ roomIndex: prevRoomIndex, imageIndex: prevRoom.images.length - 1 }));
    }
  }, [currentImageIndex, currentRoomIndex, currentStyleRooms, dispatch]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleInteriorChange = useCallback((interior: typeof selectedInterior) => {
    dispatch(setInterior(interior));
  }, [dispatch]);

  const handleImageIndexChange = useCallback((index: number) => {
    dispatch(setCurrentImage(index));
  }, [dispatch]);

  if (!currentRoom) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 aspect-video flex items-center justify-center">
          <span className="text-gray-500">Loading room data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Room Carousel */}
      <div className="rounded-lg overflow-hidden shadow-lg relative">
        <div 
          className="aspect-video relative group"
          style={{
            backgroundImage: `url('${getImageUrl(currentImage)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Background overlay for contrast */}
          <div className="absolute inset-0 bg-opacity-20"></div>

          {/* Room and Image Info */}
          <div className="absolute top-4 right-4 bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentRoom.name} ({currentImageIndex + 1}/{currentRoomImages.length})
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            disabled={!canNavigatePrev}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full transition-opacity ${
              canNavigatePrev ? 'hover:bg-opacity-70' : 'opacity-30 cursor-not-allowed'
            }`}
          >
            ←
          </button>
          <button
            onClick={nextImage}
            disabled={!canNavigateNext}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full transition-opacity ${
              canNavigateNext ? 'hover:bg-opacity-70' : 'opacity-30 cursor-not-allowed'
            }`}
          >
            →
          </button>

          {/* Image Indicator Dots for Current Room */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {currentRoomImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleImageIndexChange(index)}
                className={`w-3 h-3 rounded-full transition-opacity ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Interior Design Thumbnails with Names */}
      <div className="flex justify-center space-x-6">
        {interiorThumbnails.map((thumb, index) => (
          <div key={`${thumb.interior}-${index}`} className="text-center">
            <button 
              onClick={() => handleInteriorChange(thumb.interior)}
              className={`w-16 h-12 rounded shadow-sm transition-all hover:scale-105 mb-2 block ${
                selectedInterior === thumb.interior 
                  ? 'border-4 border-green-500' 
                  : 'border-2 border-white hover:border-gray-300'
              }`}
              style={{
                backgroundImage: `url('${getImageUrl(thumb.path)}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              title={`Select ${thumb.interior} interior`}
            />
            <div className={`text-xs transition-colors ${
              selectedInterior === thumb.interior 
                ? 'text-white font-bold drop-shadow-lg' 
                : 'text-white text-opacity-80 drop-shadow'
            }`}>
              {thumb.interior === 'modern' && 'Modern (ID1)'}
              {thumb.interior === 'classic' && 'Classic (ID2)'}
              {thumb.interior === 'rustic' && 'Rustic (ID3)'}
              {thumb.interior === 'luxury' && 'Luxury (ID4)'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
