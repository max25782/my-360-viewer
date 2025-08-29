/**
 * NEO PANORAMA VIEWER WITH REDUX
 * Версия NeoPanoramaViewer с использованием Redux Toolkit для управления состоянием
 * Основан на PanoramaViewerRedux.tsx но адаптирован для Neo домов
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
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

  // Room icon function
  const getRoomIcon = (roomName: string): string => {
    if (!roomName) return '📍';
    
    const baseName = roomName.replace(/_white$|_dark$/, '').replace(/2$/, '');
    
    switch (baseName) {
      case 'entry': return '🏠';
      case 'living': return '🛋️';
      case 'kitchen': return '🍽️';
      case 'hall': return '🚪';
      case 'bedroom': return '🛏️';
      // Используем только bedroom
      case 'bathroom': return '🛁';
      case 'wik': return '👔';
      case 'office': return '💼';
      default: return '📍';
    }
  };

  // Build markers from scene links (similar to Viewer360)
  const buildNeoMarkers = useCallback((links: any[]) => {
    console.log('Building Neo Redux markers:', links?.length || 0, 'links');
    if (!links || !Array.isArray(links) || links.length === 0) {
      console.warn('No links provided for markers');
      return [];
    }
    
    // Используем HTML маркеры в стиле Viewer360
    const markers = links.map((link, index) => {
      const roomIcon = getRoomIcon(link.to);
      return {
        id: `neo-marker-${index}`,
        position: {
          yaw: toRad(link.yaw || 0),
          pitch: toRad(link.pitch || 0),
        },
        html: `
          <div class="room-marker" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            user-select: none;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
          ">
            <div style="
              font-size: 48px;
              margin-bottom: 4px;
              text-shadow: 0 1px 3px rgba(0,0,0,0.5);
            ">${link.icon || roomIcon}</div>
            <div style="
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              white-space: nowrap;
              max-width: 120px;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              border: 2px solid rgba(255,255,255,0.3);
            ">${link.label}</div>
          </div>
        `,
        tooltip: link.label,
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
      registerAssets(allPaths);
      
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
          touchmoveTwoFingers: true,
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
            <h3 className="text-xl font-semibold mb-3">Loading {currentRoomDisplayName}</h3>
            <p className="text-gray-300">Preparing your {selectedColor} scheme experience...</p>
          </div>
        </div>
      )}
    </div>
  );
}
