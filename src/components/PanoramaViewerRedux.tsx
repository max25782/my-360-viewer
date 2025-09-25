'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Bed, Bathtub, Car, Door, ForkKnife, Laptop, MapPin, Monitor, Package, Armchair, Sun, Tree, WashingMachine } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { Viewer } from '@photo-sphere-viewer/core';
import { CubemapAdapter } from '@photo-sphere-viewer/cubemap-adapter';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

// Import CSS styles
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

// Redux imports
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setHouse,
  setScene,
  setViewerReady,
  setLoading,
  updatePosition,
  setError,
  resetViewer,
} from '../store/slices/panoramaSlice';
import {
  selectCurrentHouseId,
  selectIsViewerReady,
  selectIsLoading,
} from '../store/selectors/panoramaSelectors';

// Universal system imports
import { hasTour360, getTour360Config } from '../utils/universalAssets';
import { assetPaths } from '../utils/assetPaths';
import { checkWebPSupport } from '../utils/webpSupport';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { usePreviews } from '../hooks/usePreviews';

interface PanoramaViewerProps {
  houseId: string;
  onClose?: () => void;
  onBack?: () => void;
}

export default function PanoramaViewerRedux({ houseId, onClose, onBack }: PanoramaViewerProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const markersPluginRef = useRef<MarkersPlugin | null>(null);
  
  // Redux selectors (minimal usage - only for viewer state)
  const currentHouseId = useAppSelector(selectCurrentHouseId);
  const isViewerReady = useAppSelector(selectIsViewerReady);
  const isLoading = useAppSelector(selectIsLoading);
  // Note: We no longer use activeScene and houseScenes from Redux
  // Instead, we manage scenes locally using tour360Config

  // Universal system state
  const [tour360Config, setTour360Config] = useState<{
    rooms: string[];
    availableFiles: Record<string, unknown>;
    markerPositions: Record<string, Record<string, { yaw: number; pitch: number }>>;
    legacy: boolean;
  } | null>(null);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [currentScene, setCurrentScene] = useState<{
    key: string;
    title: string;
    panorama: { front: string; back: string; left: string; right: string; top: string; bottom: string };
    thumbnail: string;
    yaw: number;
    pitch: number;
    zoom: number;
    links: Array<{ to: string; yaw: number; pitch: number; label: string }>;
  } | null>(null);
  const [supportsWebP, setSupportsWebP] = useState<boolean>(false);
  
  // Performance and Service Worker hooks
  const serviceWorker = useServiceWorker();
  // Эти свойства больше не доступны в новой версии хука
  const preloadRoomsSW = () => console.log('preloadRooms deprecated');
  const swReady = true;
  const { measure360Scene, markRoomPreloaded, logPerformanceReport } = usePerformanceMetrics();
  const { getTilePreview } = usePreviews();

  // Helper: degrees -> radians if needed
  const toRad = useCallback((val: number) => (Math.abs(val) > Math.PI * 2 ? (val * Math.PI) / 180 : val), []);

  // Helper: map house ID to actual directory name (handle case sensitivity)
  const getActualHouseDirectory = useCallback((houseId: string): string => {
    const houseDirectoryMap: Record<string, string> = {
      'walnut': 'Walnut',
      'oak': 'Oak'
      // Add other case mappings as needed
    };
    return houseDirectoryMap[houseId] || houseId;
  }, []);

  // We'll move useEffects to the end after all functions are defined

  // Create navigation links for a room (to other rooms)
  const createLinksForRoom = useCallback((currentRoom: string, currentIndex: number) => {
    if (!tour360Config || !tour360Config.rooms) {
      console.log(`🚫 No tour360Config or rooms for ${currentRoom}`);
      return [];
    }
    
    const links: Array<{ to: string; yaw: number; pitch: number; label: string }> = [];
    const rooms = tour360Config.rooms;
    
    // Проверяем есть ли настройки позиций маркеров для этого дома
    const markerPositions = tour360Config.markerPositions?.[currentRoom];
    
    // Добавим отладочную информацию
    console.log(`🔍 Debug markerPositions for ${houseId}/${currentRoom}:`, markerPositions);
    console.log(`🔍 Full tour360Config:`, JSON.stringify(tour360Config, null, 2));
    
    // Если есть настройки markerPositions, используем только комнаты из них
    if (markerPositions) {
      // Создаем ссылки только для комнат, указанных в markerPositions
      Object.entries(markerPositions).forEach(([room, position]) => {
        const typedPosition = position as { yaw: number, pitch: number };
        if (room !== currentRoom) {
          links.push({
            to: `${houseId}_${room}`,
            yaw: typedPosition.yaw,
            pitch: typedPosition.pitch,
            label: room.charAt(0).toUpperCase() + room.slice(1).replace(/\s+/g, ' ')
          });
        }
      });
    } else {
      // Если нет настроек, используем все комнаты как раньше
      rooms.forEach((room: string) => {
        if (room !== currentRoom) {
          const position = {
            yaw: rooms.length === 2 ? 180 : (360 / (rooms.length - 1)) * links.length,
            pitch: 0
          };
          
          links.push({
            to: `${houseId}_${room}`,
            yaw: position.yaw,
            pitch: position.pitch,
            label: room.charAt(0).toUpperCase() + room.slice(1).replace(/\s+/g, ' ')
          });
        }
      });
    }
    
    console.log(`✅ Created ${links.length} links for ${currentRoom}:`, links.map(l => l.to.split('_')[1]));
    return links;
  }, [tour360Config, houseId]);

  // Create scene object from room name and index (for universal JSON system)
  const createSceneFromRoom = useCallback((roomName: string, roomIndex: number) => {
    const links = createLinksForRoom(roomName, roomIndex);
    
    // Проверяем, является ли это Premium домом
    const knownPremiumHouses = ['Aspen', 'Canyon', 'Redwood', 'Willow', 'Sequoia', 'Everest'];
    const isPremium = knownPremiumHouses.includes(houseId) || houseId.toLowerCase().includes('premium');
    
    let tiles;
    let tour360Paths;
    
    if (isPremium) {
      // Используем специальную функцию для Premium домов
      try {
        const { getPremiumAssetPath } = require('../utils/clientPremiumAssets');
        tiles = {
          front: getPremiumAssetPath(houseId, roomName, 'front'),
          back: getPremiumAssetPath(houseId, roomName, 'back'),
          left: getPremiumAssetPath(houseId, roomName, 'left'),
          right: getPremiumAssetPath(houseId, roomName, 'right'),
          up: getPremiumAssetPath(houseId, roomName, 'up'),
          down: getPremiumAssetPath(houseId, roomName, 'down')
        };
        tour360Paths = {
          thumbnail: getPremiumAssetPath(houseId, roomName, 'thumbnail')
        };
      } catch (error) {
        console.error('Failed to generate Premium asset paths:', error);
        // Fallback to old system
        const actualHouseId = getActualHouseDirectory(houseId);
        tour360Paths = assetPaths.tour360(actualHouseId, roomName);
        tiles = {
          front: tour360Paths.tiles.front,
          back: tour360Paths.tiles.back,
          left: tour360Paths.tiles.left,
          right: tour360Paths.tiles.right,
          up: tour360Paths.tiles.up,
          down: tour360Paths.tiles.down
        };
      }
    } else {
      // Используем старую систему для не-Premium домов
      const actualHouseId = getActualHouseDirectory(houseId);
      tour360Paths = assetPaths.tour360(actualHouseId, roomName);
      const format = supportsWebP ? '.webp' : '.jpg';
      
      tiles = {
        front: tour360Paths.tiles.front.replace('.jpg', format),
        back: tour360Paths.tiles.back.replace('.jpg', format),
        left: tour360Paths.tiles.left.replace('.jpg', format),
        right: tour360Paths.tiles.right.replace('.jpg', format),
        up: tour360Paths.tiles.up.replace('.jpg', format),
        down: tour360Paths.tiles.down.replace('.jpg', format)
      };
    }
    
    console.log(`🔧 Creating scene for ${roomName}:`, {
      roomName,
      roomIndex,
      houseId,
      isPremium,
      linksCount: links.length,
      links,
      tiles,
      usingWebP: supportsWebP,
      tilesFormat: isPremium ? 'JPEG (Premium)' : (supportsWebP ? 'WebP' : 'JPEG')
    });
    
    // Дополнительное логирование для Aspen
    if (houseId === 'Aspen') {
      console.log(`🔍 Aspen Debug - Room: ${roomName}, Encoded: ${encodeURIComponent(roomName)}`);
      console.log(`🔍 Aspen Tiles:`, tiles);
    }
    
    return {
      key: `${houseId}_${roomName}`,
      title: `${houseId.charAt(0).toUpperCase() + houseId.slice(1)} - ${roomName.charAt(0).toUpperCase() + roomName.slice(1)}`,
      panorama: {
        front: tiles.front,
        back: tiles.back,
        left: tiles.left,
        right: tiles.right,
        top: tiles.up,
        bottom: tiles.down
      },
      thumbnail: tour360Paths?.thumbnail || '/assets/placeholder-360.jpg',
      yaw: 180,
      pitch: 0,
      zoom: 5,
      links
    };
  }, [houseId, getActualHouseDirectory, createLinksForRoom, supportsWebP]);

  // Get room icon based on room name
  const getRoomIcon = useCallback((roomKey: string) => {
    const roomName = roomKey.split('_').pop()?.toLowerCase() || '';
    const iconMap: { [key: string]: string } = {
      entry: '🚪',
      kitchen: '🍳',
      bedroom: '🛏️',
      bathroom: '🚿',
      living: '🛋️',
      guest: '🛋️',
      dining: '🍽️',
      'great room': '🏡',
      'bathroom2': '🚿',
      'bedroom2': '🛏️',
      'full view to entry': '👁️',
      // Используем только bedroom
    };
    return iconMap[roomName] || '🏠';
  }, []);

  // Get scene from room name (replacement for getScene from tour-scenes.js)
  const getSceneFromRoom = useCallback((sceneKey: string) => {
    if (!tour360Config) return null;
    
    const roomName = sceneKey.split('_').pop();
    if (!roomName) return null;
    
    const roomIndex = tour360Config.rooms.findIndex((room: string) => room === roomName);
    
    if (roomIndex === -1) return null;
    
    return createSceneFromRoom(roomName, roomIndex);
  }, [tour360Config, createSceneFromRoom]);

  // Preload images for next rooms
  const preloadNextRooms = useCallback((links: Array<{ to: string; yaw: number; pitch: number; label: string }>) => {
    if (!links || links.length === 0) return;
    
    links.forEach(link => {
      const roomName = link.to.split('_').pop();
      if (!roomName) return;
      
      const actualHouseId = getActualHouseDirectory(houseId);
      const tour360Paths = assetPaths.tour360(actualHouseId, roomName);
      
      // Проверяем, является ли это Premium домом
      const isPremium = houseId.includes('Aspen') || houseId.includes('Canyon') || 
                        houseId.includes('Redwood') || houseId.includes('Willow') || 
                        houseId.includes('Sequoia') || houseId.toLowerCase().includes('premium');
      
      // Выбираем формат изображений в зависимости от поддержки WebP и типа дома
      // Для Premium домов всегда используем .jpg
      const format = isPremium ? '.jpg' : (supportsWebP ? '.webp' : '.jpg');
      
      const tiles = {
        front: tour360Paths.tiles.front.replace('.jpg', format),
        back: tour360Paths.tiles.back.replace('.jpg', format),
        left: tour360Paths.tiles.left.replace('.jpg', format),
        right: tour360Paths.tiles.right.replace('.jpg', format),
        up: tour360Paths.tiles.up.replace('.jpg', format),
        down: tour360Paths.tiles.down.replace('.jpg', format)
      };
      
      // Предзагружаем изображения в фоне
      Object.values(tiles).forEach((url: string) => {
        const img = new Image();
        img.src = url;
      });
      
      console.log(`📥 Preloading ${supportsWebP ? 'WebP' : 'JPEG'} tiles for room: ${roomName}`);
    });
  }, [houseId, supportsWebP, getActualHouseDirectory]);

  // Инъекция CSS для Neo-стиля маркеров
  useEffect(() => {
    try {
      if (typeof document !== 'undefined' && !document.querySelector('style[data-universal-marker-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-universal-marker-styles', 'true');
        style.textContent = `
          .psv-room-marker { z-index: 1000 !important; pointer-events: auto !important; }
          .psv-room-marker .neo-marker { display: inline-flex; align-items: center; pointer-events: auto; }
          .psv-room-marker .neo-chip { display:inline-flex; align-items:center; height:48px; max-width:48px; background: rgba(0,0,0,0.45); border-radius:9999px; overflow:hidden; transition: max-width .28s ease, padding-right .28s ease; padding-left:10px; padding-right:0; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
          .psv-room-marker:hover .neo-chip { max-width:280px; padding-right:10px; }
          .psv-room-marker .neo-icon-img { width:26px; height:26px; display:block; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6)); }
          .psv-room-marker .neo-chip-label { margin-left:8px; color:#fff; white-space:nowrap; opacity:0; transform: translateX(-8px); transition: opacity .22s ease, transform .22s ease; }
          .psv-room-marker:hover .neo-chip-label { opacity:1; transform: translateX(0); }
        `;
        document.head.appendChild(style);
      }
    } catch {}
  }, []);

  // Build markers from links (Neo-стиль с Phosphor SVG через data URL)
  const buildMarkers = useCallback((links: Array<{ to: string; yaw: number; pitch: number; label: string }>, houseId: string) => {
    const getIconSlugForRoom = (roomName: string): string => {
      const lowerRoom = roomName.toLowerCase();
      if (lowerRoom.includes('living')) return 'sofa';
      if (lowerRoom.includes('bedroom')) return 'bed';
      if (lowerRoom.includes('bath')) return 'bath';
      if (lowerRoom.includes('kitchen')) return 'utensils-crossed';
      if (lowerRoom.includes('dining')) return 'utensils';
      if (lowerRoom.includes('office')) return 'monitor';
      if (lowerRoom.includes('garage')) return 'car';
      if (lowerRoom.includes('balcony') || lowerRoom.includes('outdoor')) return 'trees';
      if (lowerRoom.includes('hall') || lowerRoom.includes('entry')) return 'door-closed';
      if (lowerRoom.includes('stair') || lowerRoom.includes('basement')) return 'door-closed';
      if (lowerRoom.includes('laundry')) return 'washing-machine';
      if (lowerRoom.includes('closet') || lowerRoom.includes('storage')) return 'package';
      return 'map-pin';
    };

    const getPhosphorIconComponent = (slug: string): any => {
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
        'washing-machine': WashingMachine,
        'package': Package,
        'map-pin': MapPin,
      };
      return map[slug] || MapPin;
    };

    return links.map(l => {
      const roomName = l.to.split('_')[1];
      const roomLabel = l.label || roomName;
      const iconSlug = getIconSlugForRoom(roomName);
      const IconComp = getPhosphorIconComponent(iconSlug);

      const svg = renderToStaticMarkup(
        React.createElement(IconComp, { size: 28, color: '#fff', weight: 'bold' })
      );
      const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

      return {
        id: `marker-${l.to}`,
        position: {
          yaw: toRad(l.yaw),
          pitch: toRad(l.pitch)
        },
        html: `
          <div class="neo-marker">
            <div class="neo-chip">
              <img class="neo-icon-img" src="${src}" alt="" />
              <div class="neo-chip-label">${roomLabel}</div>
            </div>
          </div>
        `,
        anchor: 'center' as const,
        className: 'psv-room-marker',
        data: { to: l.to },
      };
    });
  }, [toRad]);

  // Scene change handler with Redux optimization
  const changeScene = useCallback(async (sceneKey: string, viewerInstance?: Viewer, markersInstance?: MarkersPlugin) => {
    // Use provided instances or fallback to refs
    const currentViewer = viewerInstance || viewerRef.current;
    const currentMarkers = markersInstance || markersPluginRef.current;
    
    console.log(`🚪 Changing scene to: ${sceneKey}`);
    
    if (!currentViewer || !currentMarkers) {
      console.warn('Viewer or markers plugin not available for scene change');
      return;
    }
    
    // Start performance measurement
    const perfMeasure = measure360Scene(sceneKey);
    
    dispatch(setLoading(true));
    
    try {
      const scene = getSceneFromRoom(sceneKey);
      if (!scene) {
        dispatch(setError(`Scene ${sceneKey} not found`));
        return;
      }
      
      // Yield to browser for better INP
      await new Promise(resolve => {
        if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
          (window as any).scheduler.postTask(() => resolve(undefined), { priority: 'user-blocking' });
        } else {
          setTimeout(() => resolve(undefined), 0);
        }
      });
      
      // Get target parameters
      const targetYaw = typeof scene.yaw === 'number' ? toRad(scene.yaw) : 0;
      const targetPitch = typeof scene.pitch === 'number' ? toRad(scene.pitch) : 0;
      const targetZoom = typeof scene.zoom === 'number' ? scene.zoom : 5;
      
      // Set panorama with correct parameters
      try {
        await currentViewer.setPanorama(scene.panorama, {
          caption: scene.title,
          position: { yaw: targetYaw, pitch: targetPitch },
          zoom: targetZoom,
          transition: false // Remove transition to avoid jumps
        });
      } catch (panoramaError) {
        console.error(`❌ Failed to set panorama for ${sceneKey}:`, panoramaError);
        console.log('🔍 Scene panorama config:', scene.panorama);
        
        // Дополнительная диагностика для Aspen
        if (houseId === 'Aspen') {
          console.log('🔍 Aspen Panorama Error Details:', {
            sceneKey,
            roomName: sceneKey.split('_')[1],
            panoramaConfig: scene.panorama,
            error: panoramaError
          });
        }
        
        dispatch(setError(`Failed to load panorama for ${sceneKey}: ${panoramaError}`));
        return;
      }
      
      
      // Mark scene as ready for performance metrics
      perfMeasure.markSceneReady();
      
      // Update local and Redux state
      setCurrentScene(scene);
      dispatch(updatePosition({ yaw: targetYaw, pitch: targetPitch, zoom: targetZoom }));
      dispatch(setScene(sceneKey));
      
      // Update markers with additional yield
      await new Promise(resolve => setTimeout(resolve, 0));
      currentMarkers.clearMarkers();
      
      console.log(`🔄 Setting markers for ${sceneKey}, links:`, scene.links.map(l => l.to.split('_')[1]));
      
      currentMarkers.setMarkers(buildMarkers(scene.links, houseId));
      
      // Preload images for linked rooms in background
      if (scene.links && scene.links.length > 0) {
        requestIdleCallback(() => {
          preloadNextRooms(scene.links);
          
          // Предзагрузка через Service Worker если доступно
          const linkedRooms = scene.links.map(link => link.to.split('_').pop()).filter(Boolean);
          
          // Используем новый API для предзагрузки категории
          serviceWorker.preloadCategory(houseId);
          
          // Отмечаем комнаты как предзагруженные
          linkedRooms.forEach(room => markRoomPreloaded(room!));
        }, { timeout: 2000 });
      }
      
      dispatch(setLoading(false));
    } catch (error) {
      console.error('Failed to change scene:', error);
      dispatch(setError(`Failed to change scene: ${error}`));
    }
  }, [houseId, dispatch, toRad, buildMarkers, getSceneFromRoom, preloadNextRooms, measure360Scene, serviceWorker, markRoomPreloaded]);

  // Initialize house when houseId changes
  useEffect(() => {
    if (currentHouseId !== houseId) {
      dispatch(setHouse(houseId));
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
        markersPluginRef.current = null;
        dispatch(resetViewer());
      }
    }
  }, [houseId, currentHouseId, dispatch]);

  // Get current active scene from local state
  const getCurrentScene = useCallback(() => {
    return currentScene;
  }, [currentScene]);

  // Initialize viewer
  useEffect(() => {
    if (!containerRef.current || !tour360Config || !currentScene || currentHouseId !== houseId || viewerRef.current) return;

    dispatch(setLoading(true));

    // Delay initialization for instant LCP [[memory:5988045]]
    const initTimeout = setTimeout(async () => {
      try {
        // Get correct angles for initial scene
        const initialYaw = typeof currentScene.yaw === 'number' ? toRad(currentScene.yaw) : 0;
        const initialPitch = typeof currentScene.pitch === 'number' ? toRad(currentScene.pitch) : 0;

        const newViewer = new Viewer({
          container: containerRef.current!,
          adapter: CubemapAdapter,
          panorama: currentScene.panorama,
          caption: currentScene.title,
          // Set correct angles immediately during initialization
          defaultYaw: initialYaw,
          defaultPitch: initialPitch,
          navbar: ['zoom', 'caption', 'fullscreen'],
          plugins: [
            [MarkersPlugin, { markers: buildMarkers(currentScene.links, houseId) }]
          ],
          // INP optimizations
          mousewheelCtrlKey: false, // Remove Ctrl requirement for zoom
          keyboardActions: {}, // Remove keyboard events for performance
        });

        const newMarkersPlugin = newViewer.getPlugin(MarkersPlugin) as MarkersPlugin;

        // Store in refs
        viewerRef.current = newViewer;
        markersPluginRef.current = newMarkersPlugin;

        // Handle marker clicks -> navigate to target scene (with defer for INP)
        newMarkersPlugin.addEventListener('select-marker', ({ marker }) => {
          if (marker?.data?.to) {
            // Defer heavy operation for better INP
            setTimeout(() => changeScene(marker.data.to, newViewer, newMarkersPlugin), 0);
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
          
          dispatch(updatePosition({ yaw, pitch, zoom: z }));
          dispatch(setViewerReady(true));
          dispatch(setLoading(false));
          
          try { 
            newViewer.removeEventListener('ready', onReady); 
          } catch {}
        };
        
        newViewer.addEventListener('ready', onReady);

      } catch (error) {
        console.error('Failed to initialize 360° viewer:', error);
        dispatch(setError(`Failed to initialize viewer: ${error}`));
      }
    }, 100); // Minimal delay for instant LCP

    return () => {
      clearTimeout(initTimeout);
    };
  }, [tour360Config, currentScene, houseId, currentHouseId, dispatch, toRad, buildMarkers, changeScene]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
        markersPluginRef.current = null;
        dispatch(resetViewer());
      }
    };
  }, [dispatch]);

  // Check WebP support
  useEffect(() => {
    checkWebPSupport().then(supported => {
      setSupportsWebP(supported);
      console.log(`🖼️ WebP support: ${supported ? 'Да ✅' : 'Нет ❌'}`);
    });
  }, []);

  // Load 360° configuration from JSON
  useEffect(() => {
    async function loadTour360Config() {
      try {
        console.log(`🚀 Loading tour config for: ${houseId}`);
        const hasTouring = await hasTour360(houseId);
        console.log(`🚀 ${houseId} has tour: ${hasTouring}`);
        
        if (hasTouring) {
          const config = await getTour360Config(houseId);
          console.log(`🚀 ${houseId} config:`, config);
          setTour360Config(config);
          
          // Don't create scene here - let useEffect handle it when tour360Config is set
        }
      } catch (error) {
        console.error(`❌ Failed to load 360° tour config for ${houseId}:`, error);
        dispatch(setError(`Failed to load tour configuration: ${error}`));
      }
    }
    
    loadTour360Config();
  }, [houseId, dispatch]);

  // Initialize first scene when tour360Config is loaded
  useEffect(() => {
    if (tour360Config && tour360Config.rooms && tour360Config.rooms.length > 0 && !currentScene) {
      console.log('🔧 Initializing first scene with tour360Config:', tour360Config);
      const firstRoom = tour360Config.rooms[0];
      const firstScene = createSceneFromRoom(firstRoom, 0);
      setCurrentScene(firstScene);
      setCurrentRoomIndex(0);
      dispatch(setHouse(houseId));
      dispatch(setScene(firstScene.key));
      
      // Preload next rooms after first scene is ready
      if (firstScene.links && firstScene.links.length > 0) {
        setTimeout(() => {
          preloadNextRooms(firstScene.links);
        }, 1000);
      }
    }
  }, [tour360Config, currentScene, houseId, dispatch, createSceneFromRoom, preloadNextRooms]);

  return (
    <div className="relative w-full h-full">
      
      {/* Navigation buttons */}
      {isViewerReady && (
        <>
          {/* Back button */}
          <button
            onClick={() => (onBack ? onBack() : router.back())}
            className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            title="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Close button */}
          <button
            onClick={() => (onClose ? onClose() : router.back())}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      )}
      
      {/* Instant CSS-only LCP placeholder [[memory:5988045]] */}
      {!isViewerReady && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-500 flex items-center justify-center">
          {/* Preview blur background if available */}
          {currentScene && (() => {
            const roomName = currentScene.key?.split('_').pop();
            const preview = roomName ? getTilePreview(houseId, roomName, 'f') : null;
            return preview ? (
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url(${preview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px) brightness(1.2)'
                }}
              />
            ) : null;
          })()}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-400 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <p className="text-lg text-white mb-6">
              {isLoading ? 'Loading...' : 'Initializing...'}
            </p>
            
            {/* Simple CSS spinner */}
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* 360° Viewer Container */}
      <div
        ref={containerRef}
        className={`w-full h-full ${!isViewerReady ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
      />
      
      {/* Performance Metrics Button - Only in development */}
      {typeof window !== 'undefined' && typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development' && isViewerReady && (
        <button
          onClick={logPerformanceReport}
          className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm hover:bg-black/90 transition-colors"
          title="Show performance metrics"
        >
          📊 Metrics
        </button>
      )}
    </div>
  );
}
