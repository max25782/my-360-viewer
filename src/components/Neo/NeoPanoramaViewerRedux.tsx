/**
 * NEO PANORAMA VIEWER WITH REDUX
 * Версия NeoPanoramaViewer с использованием Redux Toolkit для управления состоянием
 * Основан на PanoramaViewerRedux.tsx но адаптирован для Neo домов
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Bed, Bathtub, Car, Door, ForkKnife, Laptop, MapPin, Monitor, Package, Armchair, Stairs, Sun, Tree, WashingMachine } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setHouse,
  setSelectedColor,
  setAvailableRooms,
  setCurrentRoom,
  setViewerReady,
  setLoading,
  updatePosition,
  setError,
  cacheScene,
  resetViewer,
} from '../../store/slices/neoSlice';
import {
  selectCurrentHouseId,
  selectCurrentRoom,
  selectSelectedColor,
  selectAvailableRooms,
  selectIsViewerReady,
  selectIsLoading,
  selectCurrentPosition,
  selectError,
  selectCurrentSceneKey,
  selectCachedScene,
  selectCurrentRoomDisplayName,
  selectIsInitialized,
} from '../../store/selectors/neoSelectors';

import { getNeoAssetPath, getNeoMarkers } from '../../utils/neoAssets';
import { useServiceWorker } from '../../hooks/useServiceWorker';

interface NeoPanoramaViewerReduxProps {
  houseId: string;
  selectedColor: 'white' | 'dark';
}

interface NeoScene {
  key: string;
  title: string;
  panorama: {
    front: string;
    back: string;
    left: string;
    right: string;
    top: string;
    bottom: string;
  };
  thumbnail: string;
  yaw: number;
  pitch: number;
  zoom: number;
  links: Array<{ to: string; yaw: number; pitch: number; label: string; icon?: string }>;
}

// Dynamic imports for PhotoSphere Viewer (SSR-safe)
let Viewer: any = null;
let CubemapAdapter: any = null;
let MarkersPlugin: any = null;

export default function NeoPanoramaViewerRedux({ houseId, selectedColor: initialColor }: NeoPanoramaViewerReduxProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentHouseId = useAppSelector(selectCurrentHouseId);
  const currentRoom = useAppSelector(selectCurrentRoom);
  const selectedColor = useAppSelector(selectSelectedColor);
  const availableRooms = useAppSelector(selectAvailableRooms);
  const isViewerReady = useAppSelector(selectIsViewerReady);
  const isLoading = useAppSelector(selectIsLoading);
  const currentPosition = useAppSelector(selectCurrentPosition);
  const error = useAppSelector(selectError);
  const currentSceneKey = useAppSelector(selectCurrentSceneKey);
  const cachedScene = useAppSelector(selectCachedScene);
  const currentRoomDisplayName = useAppSelector(selectCurrentRoomDisplayName);
  const isInitialized = useAppSelector(selectIsInitialized);

  const viewerRef = useRef<any>(null);
  const markersPluginRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Service Worker for caching
  const { registerAssets } = useServiceWorker();

  // Initialize house and color if needed
  useEffect(() => {
    if (currentHouseId !== houseId) {
      dispatch(setHouse(houseId));
    }
    if (selectedColor !== initialColor) {
      dispatch(setSelectedColor(initialColor));
    }
  }, [houseId, initialColor, currentHouseId, selectedColor, dispatch]);

  // Utility functions
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Room icon function (Lucide slugs)
  const getRoomIcon = (roomName: string): string => {
    if (!roomName) return 'map-pin';
    
    const baseName = roomName.replace(/_white$|_dark$/, '').replace(/2$/, '');
    
    switch (baseName) {
      case 'living': return 'sofa';
      case 'bedroom': return 'bed';
      case 'bathroom': return 'bath'; // alt: shower-head
      case 'kitchen': return 'utensils-crossed';
      case 'dining': return 'utensils'; // alt: wine
      case 'office': return 'monitor'; // alt: laptop
      case 'garage': return 'car';
      case 'balcony':
      case 'outdoor': return 'trees'; // alt: sun
      case 'hall':
      case 'entry': return 'door-closed';
      case 'stairs':
      case 'basement': return 'stairs';
      case 'laundry': return 'washing-machine';
      case 'wik':
      case 'closet':
      case 'storage': return 'package'; // alt: boxes
      default: return 'map-pin';
    }
  };

  // Map incoming icon values (emoji or arbitrary) to our Phosphor slugs
  function mapIconToSlug(icon: string | undefined, toRoom: string): string {
    const emojiMap: Record<string, string> = {
      '🛋️': 'sofa',
      '🛏️': 'bed',
      '🛁': 'bath',
      '🚪': 'door-closed',
      '🚶': 'door-closed',
      '🍽️': 'utensils',
      '🍳': 'utensils-crossed',
      '💼': 'monitor',
      '👔': 'package',
      '🏠': 'door-closed',
      '🚗': 'car',
      '🌳': 'trees',
    };
    const allowed = new Set([
      'sofa','bed','bath','utensils-crossed','utensils','monitor','laptop','car','trees','sun','door-closed','stairs','washing-machine','package','map-pin'
    ]);
    if (icon && emojiMap[icon]) return emojiMap[icon];
    if (icon && allowed.has(icon)) return icon;
    return getRoomIcon(toRoom);
  }

  function getPhosphorIconComponent(slug: string): any {
    const map: Record<string, any> = {
      'sofa': Armchair,
      'bed': Bed,
      'bath': Bathtub,
      'utensils-crossed': ForkKnife,
      'utensils': ForkKnife,
      'monitor': Monitor,
      'laptop': Laptop,
      'car': Car,
      'trees': Tree,
      'sun': Sun,
      'door-closed': Door,
      'stairs': Stairs,
      'washing-machine': WashingMachine,
      'package': Package,
      'map-pin': MapPin,
    };
    return map[slug] || MapPin;
  }

  // Build markers from scene links (similar to Viewer360)
  const buildNeoMarkers = useCallback((links: any[]) => {
    console.log('Building Neo Redux markers:', links?.length || 0, 'links');
    if (!links || !Array.isArray(links) || links.length === 0) {
      console.warn('No links provided for markers');
      return [];
    }
    
    // Используем HTML маркеры с Lucide без текстовых лейблов
    const markers = links.map((link, index) => {
      const iconSlug = mapIconToSlug(link.icon as string | undefined, link.to);
      return {
        id: `neo-marker-${index}`,
        position: {
          yaw: toRad(link.yaw || 0),
          pitch: toRad(link.pitch || 0),
        },
        html: (() => {
          const Icon = getPhosphorIconComponent(iconSlug);
          const svg = renderToStaticMarkup(
            React.createElement(Icon, { size: 28, color: '#fff', weight: 'bold' })
          );
          const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
          return `
            <div class="neo-marker" style="
              cursor: pointer;
              user-select: none;
              z-index: 1000;
              position: relative;
            ">
              <div class="neo-chip">
                <img class="neo-icon-img" src="${src}" alt="" />
                <div class="neo-chip-label">${link.label}</div>
              </div>
            </div>
          `;
        })(),
        anchor: 'center' as const,
        className: 'psv-room-marker',
        data: {
          to: link.to,
          label: link.label,
        },
      };
    });
    
    console.log('Built Neo Redux markers (HTML):', markers);
    return markers;
  }, [toRad]);

  // Load available rooms from neo-assets.json
  useEffect(() => {
    if (!houseId) return;

    const fetchAvailableRooms = async () => {
      try {
        dispatch(setLoading(true));
        
        const response = await fetch('/data/neo-assets.json');
        if (!response.ok) {
          throw new Error(`Failed to load neo-assets.json: ${response.status}`);
        }
        
        const data = await response.json();
        const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;
        const houseConfig = data.neoHouses[cleanHouseId];
        
        if (!houseConfig || !houseConfig.tour360 || !houseConfig.tour360[selectedColor]) {
          console.warn(`No room configuration found for house ${cleanHouseId} with color ${selectedColor}`);
          
          const defaultRooms = [
            `entry`,
            `living`, 
            `kitchen`,
            `hall`,
            `bedroom`,
            `bathroom`,
            `wik`
          ];
          
          dispatch(setAvailableRooms(defaultRooms));
          dispatch(setCurrentRoom(`entry_${selectedColor}`));
          return;
        }
        
        const configuredRooms = houseConfig.tour360[selectedColor].rooms || [];
        console.log(`Loaded rooms for ${cleanHouseId} (${selectedColor}):`, configuredRooms);
        
        if (configuredRooms.length > 0) {
          dispatch(setAvailableRooms(configuredRooms));
          dispatch(setCurrentRoom(configuredRooms[0]));
        } else {
          dispatch(setError(`No rooms available for ${cleanHouseId} with ${selectedColor} color scheme`));
        }
      } catch (error) {
        console.error('Error loading room configuration:', error);
        dispatch(setError(`Failed to load room configuration: ${error}`));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    fetchAvailableRooms();
  }, [houseId, selectedColor, dispatch]);

  // Create Neo scene
  const createNeoScene = useCallback(async (roomName: string): Promise<NeoScene | null> => {
    try {
      const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;
      const baseRoomName = roomName.replace(/_white$|_dark$/, '');
      const roomWithColor = `${baseRoomName}_${selectedColor}`;
      
      console.log(`Creating Neo scene: ${roomWithColor} for house ${cleanHouseId}`);

      // Load markers for navigation
      const markers = await getNeoMarkers(cleanHouseId, selectedColor, roomWithColor);
      console.log(`Loaded ${markers.length} markers for ${roomWithColor}`);
      
      // Create paths to 360° images
      const tiles = {
        front: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'front', 
          format: 'jpg' 
        }),
        back: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'back', 
          format: 'jpg' 
        }),
        left: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'left', 
          format: 'jpg' 
        }),
        right: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'right', 
          format: 'jpg' 
        }),
        top: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'up', 
          format: 'jpg' 
        }),
        bottom: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'down', 
          format: 'jpg' 
        })
      };

      // Try to get thumbnail, fallback to heroColor if needed
      let thumbnail;
      try {
        thumbnail = await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'thumbnail', 
          format: 'jpg' 
        });
      } catch (error) {
        console.warn('Failed to get room thumbnail, using hero color image:', error);
        thumbnail = await getNeoAssetPath('heroColor', cleanHouseId, { 
          color: selectedColor, 
          format: 'jpg' 
        });
      }

      // Validate generated paths
      const allPaths = [...Object.values(tiles), thumbnail];
      const invalidPaths = allPaths.filter(path => !path || path.includes('undefined') || path.includes('null') || path === '');
      
      if (invalidPaths.length > 0) {
        console.error('Invalid asset paths generated:', invalidPaths);
        throw new Error(`Failed to generate valid paths for room ${roomWithColor}`);
      }

      const scene: NeoScene = {
        key: currentSceneKey,
        title: `${cleanHouseId} - ${baseRoomName} (${selectedColor})`,
        panorama: tiles,
        thumbnail,
        yaw: 180,
        pitch: 0,
        zoom: 0,
        links: markers
      };

      console.log('Neo scene created successfully:', scene.key);
      
      // Cache the scene
      dispatch(cacheScene({ key: currentSceneKey, scene }));
      
      // Register assets for service worker caching
      // Фильтруем пути, чтобы убедиться, что все они валидны
      const assetsToCache = allPaths.filter(
        path => path && typeof path === 'string' && path.startsWith('/')
      );
      
      if (assetsToCache.length > 0) {
        console.log('Регистрация ассетов для кэширования:', assetsToCache);
        registerAssets(assetsToCache);
      }
      
      return scene;
      
    } catch (error) {
      console.error('Failed to create Neo scene:', error);
      dispatch(setError(`Failed to load ${roomName}: ${error}`));
      return null;
    }
  }, [houseId, selectedColor, currentSceneKey, dispatch, registerAssets]);

  // Load PhotoSphere Viewer libraries
  useEffect(() => {
    async function loadPhotoSphereLibraries() {
      if (typeof window === 'undefined') return;
      
      try {
        if (!Viewer) {
          console.log('Loading PhotoSphere Viewer libraries...');
          
          // Вставляем стили для маркеров (если ещё не вставлены)
          try {
            if (!document.querySelector('style[data-neo-marker-styles]')) {
              const markerStyle = document.createElement('style');
              markerStyle.setAttribute('data-neo-marker-styles', 'true');
              markerStyle.textContent = `
                .psv-room-marker { z-index: 1000 !important; pointer-events: auto !important; }
                .psv-room-marker .neo-marker { display: inline-flex; align-items: center; pointer-events: auto; }
                .psv-room-marker .neo-icon { display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; line-height:0; border-radius: 9999px; background: rgba(0,0,0,0.45); box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
                .psv-room-marker .neo-icon img { width:26px; height:26px; display:block; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6)); }
                .psv-room-marker .neo-label { margin-left:8px; background: rgba(0,0,0,0.6); color:#fff; padding:6px 10px; border-radius:9999px; white-space:nowrap; transform: translateX(-12px); opacity:0; max-width:0; overflow:hidden; border:1px solid rgba(255,255,255,0.15); backdrop-filter: blur(4px); transition: transform .25s ease, opacity .25s ease, max-width .25s ease; }
                .psv-room-marker:hover .neo-label { opacity:1; transform: translateX(0); max-width:260px; }
              `;
              document.head.appendChild(markerStyle);
            }
          } catch (e) {
            // no-op, стили не критичны
          }

          // Глобально отключаем все проверки CSS для PhotoSphere
          if (typeof window !== 'undefined') {
            // Патчим глобальную функцию проверки CSS
            const originalConsoleError = console.error;
            console.error = (...args: any[]) => {
              const message = args[0];
              
              // Игнорируем ошибки CSS для PhotoSphere
              if (typeof message === 'string' && 
                  (message.includes('PhotoSphereViewer: stylesheet') || 
                   message.includes('@photo-sphere-viewer'))) {
                return; // Игнорируем эту ошибку
              }
              
              // Игнорируем пустые объекты Error: {}
              if (message instanceof Error && 
                  Object.keys(message).length === 0 && 
                  message.constructor === Error) {
                return; // Игнорируем пустую ошибку
              }
              
              // Игнорируем Error объекты без сообщения
              if (message instanceof Error && !message.message) {
                return; // Игнорируем ошибку без сообщения
              }
              
              // Для всех остальных ошибок вызываем оригинальную функцию
              return originalConsoleError.apply(console, args);
            };
            
            // Сохраняем ссылку для восстановления позже
            (window as any).__originalConsoleError = originalConsoleError;
            
            // Добавляем глобальный обработчик ошибок загрузки изображений
            const handleImageError = (event: ErrorEvent) => {
              if (event.target instanceof HTMLImageElement) {
                console.warn(`Failed to load image: ${event.target.src}`);
                console.warn(`Image error details:`, {
                  src: event.target.src,
                  naturalWidth: event.target.naturalWidth,
                  naturalHeight: event.target.naturalHeight,
                  complete: event.target.complete,
                  currentSrc: event.target.currentSrc
                });
              }
            };
            
            window.addEventListener('error', handleImageError, true);
            (window as any).__imageErrorHandler = handleImageError;
          }
          
          const photosphereCore = await import('@photo-sphere-viewer/core');
          const cubemapAdapter = await import('@photo-sphere-viewer/cubemap-adapter');
          const markersPlugin = await import('@photo-sphere-viewer/markers-plugin');
          
          Viewer = photosphereCore.Viewer;
          CubemapAdapter = cubemapAdapter.CubemapAdapter;
          MarkersPlugin = markersPlugin.MarkersPlugin;
          
          console.log('PhotoSphere Viewer libraries loaded successfully');
        }
      } catch (error) {
        console.error('Error loading PhotoSphere Viewer:', error);
        dispatch(setError('Failed to load 360° viewer. Please refresh the page.'));
      }
    }

    loadPhotoSphereLibraries();
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined' && (window as any).__originalConsoleError) {
        console.error = (window as any).__originalConsoleError;
        delete (window as any).__originalConsoleError;
      }
      
      // Удаляем обработчик ошибок загрузки изображений
      if (typeof window !== 'undefined' && (window as any).__imageErrorHandler) {
        window.removeEventListener('error', (window as any).__imageErrorHandler, true);
        delete (window as any).__imageErrorHandler;
      }
    };
  }, [dispatch]);

  // Get current scene (from cache or create new)
  const getCurrentScene = useCallback(async (): Promise<NeoScene | null> => {
    if (!currentRoom || !isInitialized) return null;
    
    // Check cache first
    if (cachedScene) {
      console.log('Using cached scene:', currentSceneKey);
      return cachedScene;
    }
    
    // Create new scene
    return await createNeoScene(currentRoom);
  }, [currentRoom, isInitialized, cachedScene, currentSceneKey, createNeoScene]);

  // Initialize viewer
  useEffect(() => {
    if (!containerRef.current || !isInitialized || !Viewer || !MarkersPlugin || viewerRef.current) return;

    dispatch(setLoading(true));

    // Delay initialization for better LCP
    const initTimeout = setTimeout(async () => {
      try {
        const currentScene = await getCurrentScene();
        if (!currentScene) {
          dispatch(setError('Failed to load scene data'));
          return;
        }

        // Get correct angles for initial scene
        const initialYaw = typeof currentScene.yaw === 'number' ? toRad(currentScene.yaw) : 0;
        const initialPitch = typeof currentScene.pitch === 'number' ? toRad(currentScene.pitch) : 0;

        const newViewer = new Viewer({
          container: containerRef.current!,
          adapter: CubemapAdapter,
          panorama: currentScene.panorama,
          caption: currentScene.title,
          defaultYaw: initialYaw,
          defaultPitch: initialPitch,
          navbar: ['zoom', 'caption', 'fullscreen'],
          plugins: [
            [MarkersPlugin, { markers: buildNeoMarkers(currentScene.links) }]
          ],
          mousewheelCtrlKey: false,
          keyboardActions: {},
          loadingImg: currentScene.thumbnail,
          touchmoveTwoFingers: false, // Позволяет использовать один палец для навигации на сенсорных экранах
          checkStylesheet: false,
        });

        const newMarkersPlugin = newViewer.getPlugin(MarkersPlugin);
        console.log('MarkersPlugin loaded in Redux:', newMarkersPlugin ? 'Success' : 'Failed');

        // Store in refs
        viewerRef.current = newViewer;
        markersPluginRef.current = newMarkersPlugin;

        // Handle marker clicks -> navigate to target scene
        newMarkersPlugin.addEventListener('select-marker', ({ marker }: { marker: any }) => {
          if (marker?.data?.to) {
            setTimeout(() => {
              console.log('Neo marker clicked, navigating to:', marker.data.to);
              
              // Очищаем маркеры перед сменой сцены
              if (newMarkersPlugin) {
                newMarkersPlugin.clearMarkers();
              }
              
              dispatch(setCurrentRoom(marker.data.to));
            }, 0);
          }
        });

        const onReady = () => {
          // Apply initial view
          const yaw = typeof currentScene.yaw === 'number' ? toRad(currentScene.yaw) : 0;
          const pitch = typeof currentScene.pitch === 'number' ? toRad(currentScene.pitch) : 0;
          newViewer.rotate({ yaw, pitch });
          
          const z = currentScene.zoom;
          if (typeof z === 'number') {
            try {
              (newViewer as any).zoom(z);
            } catch {
              // Fallback for different PSV versions
            }
          }

          dispatch(setViewerReady(true));
          console.log('Neo PhotoSphere Viewer initialized successfully');
        };

        newViewer.addEventListener('ready', onReady, { once: true });

        // Position tracking
        newViewer.addEventListener('position-updated', ({ position }: any) => {
          dispatch(updatePosition({
            yaw: position.yaw,
            pitch: position.pitch,
          }));
        });

        dispatch(setError(null));

      } catch (error) {
        console.error('Error initializing Neo PhotoSphere Viewer:', error);
        dispatch(setError('Failed to initialize 360° viewer'));
      }
    }, 300);

    return () => {
      clearTimeout(initTimeout);
    };
  }, [isInitialized, Viewer, MarkersPlugin, getCurrentScene, buildNeoMarkers, dispatch]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying viewer:', error);
        }
        viewerRef.current = null;
      }
      dispatch(resetViewer());
    };
  }, [dispatch]);

  // Change scene when room changes
  useEffect(() => {
    if (!currentRoom || !viewerRef.current || !isViewerReady) return;

    const changeScene = async () => {
      try {
        dispatch(setLoading(true));
        
        const newScene = await getCurrentScene();
        if (!newScene) {
          dispatch(setError('Failed to load new scene'));
          return;
        }

        // Update viewer with new scene
        await viewerRef.current.setPanorama(newScene.panorama, {
          caption: newScene.title,
          transition: 1000,
        });

        // Update markers
        const markers = buildNeoMarkers(newScene.links);
        markersPluginRef.current.setMarkers(markers);

        // Apply scene view
        const yaw = typeof newScene.yaw === 'number' ? toRad(newScene.yaw) : 0;
        const pitch = typeof newScene.pitch === 'number' ? toRad(newScene.pitch) : 0;
        viewerRef.current.rotate({ yaw, pitch });

        dispatch(setViewerReady(true));
        dispatch(setError(null));
        
      } catch (error) {
        console.error('Error changing scene:', error);
        dispatch(setError('Failed to change scene'));
      }
    };

    changeScene();
  }, [currentRoom, isViewerReady, getCurrentScene, buildNeoMarkers, dispatch]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Tour Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => {
              dispatch(setError(null));
              window.location.reload();
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Tour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black">
      {/* Navigation buttons */}
      {isViewerReady && (
        <>
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            title="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Close button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      )}
      
      {/* PhotoSphere Viewer Container */}
      <div 
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: '100vh' }}
      />

      {/* Redux-managed Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[1000]">
          <div className="text-center text-white">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
