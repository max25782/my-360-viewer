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
import { formatRoomName, getSkylinePackages } from '../utils/skylineRooms';

interface UniversalDesignSelectorReduxProps {
  houseId: string;
  type: 'exterior' | 'interior';
}

// Exterior Texture Configuration
const EXTERIOR_TEXTURES = [
  {
    id: 1,
    name: 'Heritage',
    path: '/assets/skyline/texture/exterior/thumb1.webp',
    pk: 1
  },
  {
    id: 2,
    name: 'Haven',
    path: '/assets/skyline/texture/exterior/thumb2.webp',
    pk: 2
  },
  {
    id: 3,
    name: 'Serenity',
    path: '/assets/skyline/texture/exterior/thumb3.webp',
    pk: 3
  },
  {
    id: 4,
    name: 'Luxe',
    path: '/assets/skyline/texture/exterior/thumb4.webp',
    pk: 4
  },
  {
    id: 5,
    name: 'Sunset',
    path: '/assets/skyline/texture/exterior/thumb5.webp',
    pk: 5
  }
];

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
  },
  {
    id: 5,
    name: 'Sunset',
    path: '/assets/skyline/texture/interior/colors5.webp',
    pk: 5
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
  
  // Автоматически применяем текстуру для экстерьера при инициализации
  const applyExteriorTexture = React.useCallback(() => {
    if (isDataReady && selectedPackage && type === 'exterior') {
      console.log(`Auto-applying exterior texture ${selectedTexture} for ${houseId}`);
      const selectedTextureConfig = EXTERIOR_TEXTURES.find(t => t.id === selectedTexture);
      if (selectedTextureConfig) {
        dispatch(loadDesignImage({
          houseId,
          type,
          packageData: selectedPackage,
          room: '',
          pk: selectedTextureConfig.pk
        }));
      }
    }
  }, [isDataReady, selectedPackage, type, houseId, dispatch, selectedTexture]);
  
  useEffect(() => {
    applyExteriorTexture();
  }, [applyExteriorTexture]);
  
  // Применяем глобальную текстуру при смене комнаты
  useEffect(() => {
    if (type === 'interior' && selectedPackage && selectedRoom && selectedTexture && isDataReady) {
      const selectedTextureConfig = INTERIOR_TEXTURES.find(t => t.id === selectedTexture);
      if (selectedTextureConfig) {
        console.log(`🎨 Applying global texture ${selectedTexture} (PK${selectedTextureConfig.pk}) to room: ${selectedRoom}`);
        dispatch(loadDesignImage({
          houseId,
          type,
          packageData: selectedPackage,
          room: selectedRoom,
          pk: selectedTextureConfig.pk
        }));
      }
    }
  }, [selectedRoom, selectedTexture, type, houseId, selectedPackage, dispatch, isDataReady]);

  // Эффект для плавного перехода между изображениями
  useEffect(() => {
    if (currentImage) {
      setImageTransitioning(true);
      setImageLoaded(false);
      
      // Создаем новое изображение для предзагрузки
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        setTimeout(() => {
          setImageTransitioning(false);
        }, 100); // Задержка для более плавного перехода
      };
      img.src = getImageUrl(currentImage);
    }
  }, [currentImage, getImageUrl]);

  // For Walnut: collect all photos from all rooms in order
  const [allWalnutPhotos, setAllWalnutPhotos] = useState<string[]>([]);
  const [currentWalnutIndex, setCurrentWalnutIndex] = useState(0);

  // Get house assets using selector
  const houseAssets = useAppSelector(universalSelectors.selectHouseAssetsById(houseId));

  // Collect all Walnut photos when house loads or texture changes
  useEffect(() => {
    if (houseId === 'Walnut' && type === 'interior') {
      const loadWalnutPhotos = async () => {
        try {
          const manifestResponse = await fetch('/skyline-interior-manifest.json');
          if (!manifestResponse.ok) {
            console.error('Failed to load Skyline interior manifest');
            return;
          }
          
          const manifest = await manifestResponse.json();
          const houseData = manifest.houses['Walnut'];
          
          if (!houseData) {
            console.error('Walnut not found in manifest');
            return;
          }
          
          const roomOrder = ['living', 'kitchen', 'bedroom', 'bathroom'];
          const allPhotos: string[] = [];
          
          // For each room, get pkN and pkN.1 photos based on selected texture
          roomOrder.forEach(room => {
            const roomData = houseData.rooms[room];
            if (roomData && roomData.photos) {
              // Helper function to pick preferred format (WebP over JPG)
              const pickPreferredFormat = (candidates: any[]) => {
                if (!candidates || candidates.length === 0) return null;
                const webp = candidates.find((p) => p.filename.toLowerCase().endsWith('.webp'));
                if (webp) return webp;
                const jpg = candidates.find((p) => /\.(jpe?g)$/i.test(p.filename));
                return jpg || candidates[0] || null;
              };

              // Find exact pkN (no decimal)
              const exactCandidates = roomData.photos.filter((photo: any) => {
                const filename = photo.filename.toLowerCase();
                const nameNoExt = filename.substring(0, filename.lastIndexOf('.'));
                return nameNoExt === `pk${selectedTexture}`;
              });
              const exactPicked = pickPreferredFormat(exactCandidates);

              // Find pkN.1 (decimal variant)
              const decimalCandidates = roomData.photos.filter((photo: any) => {
                const filename = photo.filename.toLowerCase();
                const nameNoExt = filename.substring(0, filename.lastIndexOf('.'));
                return nameNoExt === `pk${selectedTexture}.1`;
              });
              const decimalPicked = pickPreferredFormat(decimalCandidates);

              // Add to photos array (exact first, then decimal)
              if (exactPicked) allPhotos.push(exactPicked.path);
              if (decimalPicked) allPhotos.push(decimalPicked.path);
            }
          });
          
          console.log(`🖼️ Collected Walnut photos for texture PK${selectedTexture}:`, allPhotos);
          setAllWalnutPhotos(allPhotos);
          setCurrentWalnutIndex(0);
        } catch (error) {
          console.error('Error loading Walnut photos:', error);
        }
      };
      
      loadWalnutPhotos();
    }
  }, [houseId, type, selectedTexture]);

  // Navigation functions for Walnut photos
  const goToPrevWalnutPhoto = () => {
    if (allWalnutPhotos.length > 0) {
      const prevIndex = currentWalnutIndex === 0 ? allWalnutPhotos.length - 1 : currentWalnutIndex - 1;
      setCurrentWalnutIndex(prevIndex);
    }
  };

  const goToNextWalnutPhoto = () => {
    if (allWalnutPhotos.length > 0) {
      const nextIndex = (currentWalnutIndex + 1) % allWalnutPhotos.length;
      setCurrentWalnutIndex(nextIndex);
    }
  };

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
  
  // Dynamic package information
  const [dynamicPackages, setDynamicPackages] = useState<{
    maxDP: number;
    maxPK: number;
    availableRooms: string[];
  }>({
    maxDP: 4,
    maxPK: 4,
    availableRooms: []
  });

  useEffect(() => {
    // Load dynamic package information for both exterior and interior
    const loadDynamicPackages = async () => {
      console.log(`🔄 Loading dynamic packages for ${houseId} (${type})`);
      const packages = await getSkylinePackages(houseId);
      setDynamicPackages(packages);
      
      // For interior, also set the rooms
      if (type === 'interior') {
        // Ensure order: living -> kitchen -> bedroom -> bathroom, then others
        const desiredOrder = ['living', 'kitchen', 'bedroom', 'bathroom'];
        const rooms = Array.isArray(packages.availableRooms) ? packages.availableRooms : [];
        const lowerRooms = rooms.map(r => r.toLowerCase());
        const orderedCore = desiredOrder.filter(r => lowerRooms.includes(r));
        const rest = rooms.filter(r => !orderedCore.includes(r.toLowerCase()));
        const ordered = [...orderedCore, ...rest];
        setActualInteriorRooms(ordered);
      }
    };

    loadDynamicPackages();
  }, [houseId, type]);

  const interiorRooms = actualInteriorRooms;

  // State for current room index
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  
  // Состояние для плавного перехода изображений
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageTransitioning, setImageTransitioning] = useState(false);

  // Reset room index when interiorRooms changes
  useEffect(() => {
    if (interiorRooms.length > 0 && currentRoomIndex >= interiorRooms.length) {
      setCurrentRoomIndex(0);
    }
  }, [interiorRooms, currentRoomIndex]);

  const handleTextureChange = async (textureId: number) => {
    console.log(`🎨 Global texture change: ${type} texture ${textureId} for house ${houseId}`);
    setSelectedTexture(textureId);
    
    if (type === 'exterior') {
      const selectedTextureConfig = EXTERIOR_TEXTURES.find(t => t.id === textureId);
      console.log(`🏠 Exterior texture config:`, selectedTextureConfig);
      console.log(`📦 Selected package:`, selectedPackage);
      if (selectedTextureConfig && selectedPackage) {
        console.log(`🚀 Loading exterior design image with pk${selectedTextureConfig.pk}`);
        dispatch(loadDesignImage({
          houseId,
          type,
          packageData: selectedPackage,
          room: '',
          pk: selectedTextureConfig.pk
        }));
      }
    } else if (type === 'interior') {
      const selectedTextureConfig = INTERIOR_TEXTURES.find(t => t.id === textureId);
      if (selectedTextureConfig && selectedPackage) {
        // Применяем выбранную текстуру к текущей комнате
        const currentRoom = selectedRoom;
        
        console.log(`🌈 Applying texture ${textureId} (PK${selectedTextureConfig.pk}) globally. Current room: ${currentRoom}`);

        // Загружаем изображение для текущей комнаты с новой текстурой
        dispatch(loadDesignImage({
          houseId,
          type,
          packageData: selectedPackage,
          room: currentRoom,
          pk: selectedTextureConfig.pk
        }));
      }
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

    // Применяем текущую глобальную текстуру к новой комнате
    const selectedTextureConfig = INTERIOR_TEXTURES.find(t => t.id === selectedTexture);

    if (type === 'interior' && selectedTextureConfig && selectedPackage) {
      console.log(`🔄 Changing to room: ${newRoom} with global texture ${selectedTexture} (PK${selectedTextureConfig.pk})`);
      
      dispatch(loadDesignImage({
        houseId,
        type,
        packageData: selectedPackage,
        room: newRoom,
        pk: selectedTextureConfig.pk
      }));
    }
    
    console.log(`Room changed: ${newRoom} (${newIndex + 1}/${interiorRooms.length}) with texture: ${selectedTexture}`);
  }
  
  // Функция для циклического перехода к следующей комнате
  const goToNextRoom = () => {
    if (interiorRooms.length <= 1) return;
    
    // Находим текущий индекс, используя currentRoomIndex как fallback
    let currentIndex = interiorRooms.indexOf(selectedRoom);
    if (currentIndex === -1) {
      currentIndex = currentRoomIndex;
    }
    
    const nextIndex = (currentIndex + 1) % interiorRooms.length;
    const nextRoom = interiorRooms[nextIndex];
    
    console.log(`🔄 goToNextRoom: current=${selectedRoom} (${currentIndex}) -> next=${nextRoom} (${nextIndex}), total=${interiorRooms.length}, texture=${selectedTexture}`);
    handleRoomChange(nextRoom);
  }
  
  // Функция для циклического перехода к предыдущей комнате
  const goToPrevRoom = () => {
    if (interiorRooms.length <= 1) return;
    
    // Находим текущий индекс, используя currentRoomIndex как fallback
    let currentIndex = interiorRooms.indexOf(selectedRoom);
    if (currentIndex === -1) {
      currentIndex = currentRoomIndex;
    }
    
    const prevIndex = (currentIndex - 1 + interiorRooms.length) % interiorRooms.length;
    const prevRoom = interiorRooms[prevIndex];
    
    console.log(`🔄 goToPrevRoom: current=${selectedRoom} (${currentIndex}) -> prev=${prevRoom} (${prevIndex}), total=${interiorRooms.length}, texture=${selectedTexture}`);
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
            {formatRoomName(currentRoom)}
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
        {type === 'exterior' ? '' : ''}
      </h3>

      {/* Texture Selection for Interior - функциональность сохранена, UI отключен */}

      {/* Main Image Display - Lazy Loading Optimized */}
        <div className="rounded-lg overflow-hidden shadow-lg">
            <div
              className="relative overflow-hidden bg-gray-100 h-[40vh] md:h-[350px] xl:h-[380px]"
            >
            {(() => {
              // For Walnut interior, use sequential photo navigation
              let imageToShow = currentImage;
              
              if (houseId === 'Walnut' && type === 'interior' && allWalnutPhotos.length > 0) {
                imageToShow = allWalnutPhotos[currentWalnutIndex];
              } else if (type === 'interior' && currentPhotos && Array.isArray(currentPhotos) && currentPhotos.length > 0) {
                // For other houses with multiple photos
                imageToShow = currentPhotos[currentPhotoIndex] || currentImage;
              }
              
              return imageToShow && (
                <>
                  <img
                    src={getImageUrl(imageToShow)}
                    alt={`${type === 'exterior' ? 'Exterior' : 'Interior'} view`}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
                      imageLoaded && !imageTransitioning 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-98'
                    }`}
                    onLoad={() => {
                      setImageLoaded(true);
                    }}
                    onError={(e) => {
                      // Обработка ошибки загрузки изображения
                      console.error(`Failed to load image: ${imageToShow}`);
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
                  
                  {/* Loading indicator */}
                  {imageTransitioning && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  )}

             {/* Navigation arrows for Walnut */}
             {houseId === 'Walnut' && type === 'interior' && allWalnutPhotos.length > 1 && (
               <>
                 {/* Previous arrow */}
                 <button
                   onClick={goToPrevWalnutPhoto}
                   className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                   </svg>
                 </button>
                 
                 {/* Next arrow */}
                 <button
                   onClick={goToNextWalnutPhoto}
                   className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </button>
                 
                 {/* Photo counter with room info */}
                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                   {(() => {
                     // Calculate which room we're in based on photo distribution
                     let photoIndex = 0;
                     let currentRoom = 'living';
                     let photoInRoom = 1;
                     let totalInRoom = 1;
                     
                     // Count photos per room dynamically
                     const roomOrder = ['living', 'kitchen', 'bedroom', 'bathroom'];
                     const roomPhotoCounts = [2, 2, 1, 2]; // living:2, kitchen:2, bedroom:1, bathroom:2
                     
                     let accumulatedPhotos = 0;
                     for (let i = 0; i < roomOrder.length; i++) {
                       const roomPhotoCount = roomPhotoCounts[i];
                       if (currentWalnutIndex < accumulatedPhotos + roomPhotoCount) {
                         currentRoom = roomOrder[i];
                         photoInRoom = (currentWalnutIndex - accumulatedPhotos) + 1;
                         totalInRoom = roomPhotoCount;
                         break;
                       }
                       accumulatedPhotos += roomPhotoCount;
                     }
                     
                    const textureName = (INTERIOR_TEXTURES.find(t => t.id === selectedTexture)?.name || `PK${selectedTexture}`);
                    return `${textureName} ${currentRoom.toUpperCase()} ${photoInRoom}/${totalInRoom} (${currentWalnutIndex + 1}/${allWalnutPhotos.length})`;
                   })()}
                 </div>
               </>
             )}

             {/* Photo indicator for other houses */}
             {houseId !== 'Walnut' && type === 'interior' && currentPhotos && Array.isArray(currentPhotos) && currentPhotos.length > 1 && (
               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                 {currentPhotos.map((_, idx) => (
                   <div
                     key={idx}
                     className={`w-2 h-2 rounded-full transition-all ${
                       idx === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                     }`}
                   />
                 ))}
               </div>
             )}
                </>
              );
            })()}
          {type === 'interior' && houseId !== 'Walnut' && (
            <div className="flex flex-col items-center space-y-4">
              {/* Room Navigation */}
              {renderRoomNavigation()}
            </div>
          )}
          {/* Room Navigation Arrows */}
          {type === 'interior' && houseId !== 'Walnut' && interiorRooms.length > 1 && (
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
            </>
          )}

       
        </div>
      </div>

      {/* Texture Selection for Exterior - Below Image */}
      {type === 'exterior' && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 text-center mb-4">
            Exterior Finishes
          </h4>
          <div className="flex justify-center space-x-4">
            {EXTERIOR_TEXTURES.filter(texture => 
              texture.id === 5 ? houseId.toLowerCase() === 'walnut' : true
            ).map((texture) => (
              <div key={texture.id} className="text-center">
                <button
                  onClick={() => handleTextureChange(texture.id)}
                  className={`w-20 h-16 rounded-lg overflow-hidden transition-all hover:scale-105 block relative ${
                    selectedTexture === texture.id
                      ? 'ring-4 ring-gray-900 shadow-lg'
                      : 'ring-2 ring-gray-300 hover:ring-gray-500'
                  }`}
                  title={`Select ${texture.name}`}
                >
                  <img
                    src={getImageUrl(texture.path)}
                    alt={`${texture.name} texture`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to solid color if image fails
                      if (e.currentTarget && e.currentTarget.parentElement) {
                        const parent = e.currentTarget.parentElement;
                        parent.style.backgroundColor = texture.id === 1 ? '#e9e5dc' : 
                                                     texture.id === 2 ? '#5e6266' : 
                                                     texture.id === 3 ? '#9a9083' : 
                                                     texture.id === 4 ? '#4c4c4c' : '#b29a7d';
                        e.currentTarget.style.display = 'none';
                      }
                    }}
                  />
                </button>
                <div className="text-sm text-gray-900 font-medium mt-2">
                  {texture.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Texture Selection for Interior - Below Image */}
      {type === 'interior' && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-white text-center mb-4 drop-shadow-lg">
            Textures
          </h4>
          <div className="flex justify-center space-x-4">
            {INTERIOR_TEXTURES.filter(texture => 
              texture.id === 5 ? houseId.toLowerCase() === 'walnut' : true
            ).map((texture) => (
              <div key={texture.id} className="text-center">
                <button
                  onClick={() => handleTextureChange(texture.id)}
                  className={`w-20 h-16 rounded-lg overflow-hidden transition-all hover:scale-105 block relative ${
                    selectedTexture === texture.id
                      ? 'ring-4 ring-white shadow-lg'
                      : 'ring-2 ring-white/30 hover:ring-white/50'
                  }`}
                  title={`Select ${texture.name}`}
                >
                  <img
                    src={getImageUrl(texture.path)}
                    alt={`${texture.name} texture`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to solid color if image fails
                      if (e.currentTarget && e.currentTarget.parentElement) {
                        const parent = e.currentTarget.parentElement;
                        parent.style.backgroundColor = texture.id === 1 ? '#e9e5dc' : 
                                                     texture.id === 2 ? '#5e6266' : 
                                                     texture.id === 3 ? '#9a9083' : 
                                                     texture.id === 4 ? '#4c4c4c' : '#b29a7d';
                        e.currentTarget.style.display = 'none';
                      }
                    }}
                  />
                </button>
                <div className="text-sm text-white font-medium mt-2 drop-shadow">
                  {texture.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}
