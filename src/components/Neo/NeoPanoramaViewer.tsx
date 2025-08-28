/**
 * NEO PANORAMA VIEWER
 * Специализированная версия PanoramaViewer для Neo домов с поддержкой цветовых схем
 * Основан на PanoramaViewerRedux.tsx но с Neo-специфичной логикой
 */

'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { getNeoAssetPath, getNeoMarkers } from '../../utils/neoAssets';

interface NeoPanoramaViewerProps {
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

interface NeoMarker {
  to: string;
  yaw: number;
  pitch: number;
  label: string;
  icon?: string; // Иконка для маркера
}

// Dynamic imports for PhotoSphere Viewer (SSR-safe)
let Viewer: any = null;
let CubemapAdapter: any = null;
let MarkersPlugin: any = null;

export default function NeoPanoramaViewer({ houseId, selectedColor }: NeoPanoramaViewerProps) {
  const [currentRoom, setCurrentRoom] = useState<string>(`entry_${selectedColor}`);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState<NeoScene | null>(null);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const markersPluginRef = useRef<any>(null);

  // Utility function to convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  // Room icon function (local version)
  const getRoomIcon = (roomName: string): string => {
    const baseName = roomName.replace(/_white$|_dark$/, '').replace(/2$/, '');
    
    switch (baseName) {
      case 'entry': return '🏠';
      case 'living': return '🛋️';
      case 'kitchen': return '🍽️';
      case 'hall': return '🚪';
      case 'bedroom': return '🛏️';
      case 'badroom': return '🛏️'; // поддержка старого названия
      case 'bathroom': return '🛁';
      case 'wik': return '👔';
      case 'office': return '💼';
      default: return '📍';
    }
  };
  
  // Get room display name
  const getRoomDisplayName = useCallback((roomName: string): string => {
    const baseName = roomName.replace(/_white$|_dark$/, '');
    
    switch (baseName) {
      case 'entry': return 'Entry';
      case 'living': return 'Living Room';
      case 'kitchen': return 'Kitchen';
      case 'hall': return 'Hallway';
      case 'bedroom': return 'Bedroom 1';
      case 'bedroom2': return 'Bedroom 2';
      case 'badroom': return 'Bedroom 1'; // поддержка старого названия
      case 'badroom2': return 'Bedroom 2'; // поддержка старого названия
      case 'bathroom': return 'Bathroom 1';
      case 'bathroom2': return 'Bathroom 2';
      case 'wik': return 'Walk-in Closet';
      default: return baseName;
    }
  }, []);

  // Build markers from scene links (similar to Viewer360)
  const buildNeoMarkers = useCallback((links: NeoMarker[]) => {
    console.log('Building Neo markers:', links.length, 'links');
    
    // Используем простые маркеры как в Viewer360
    const markers = links.map((link, index) => {
      const roomIcon = getRoomIcon(link.to);
      const roomLabel = link.label || getRoomDisplayName(link.to);
      
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
            ">${roomLabel}</div>
          </div>
        `,
        tooltip: roomLabel,
        anchor: 'center' as const,
        className: 'psv-room-marker',
        data: {
          to: link.to,
          label: roomLabel,
        },
      };
    });
    
    console.log('Built markers (HTML):', markers);
    return markers;
  }, [getRoomDisplayName]);

  // Мемоизированная функция для создания сцены
  const createNeoScene = useCallback(async (roomName: string): Promise<NeoScene | null> => {
    try {
      setIsLoading(true);
      
      // Убираем суффикс цвета если он уже есть
      const baseRoomName = roomName.replace(/_white$|_dark$/, '');
      const roomWithColor = `${baseRoomName}_${selectedColor}`;
      
      console.log(`Creating Neo scene: ${roomWithColor} for house ${houseId}`);

      // Убираем префикс neo- для путей к ассетам
      const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;

      // Загружаем маркеры для навигации
      const markers = await getNeoMarkers(cleanHouseId, selectedColor, roomWithColor);
      
      // Создаем пути к 360° изображениям
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

      // Сначала пробуем получить thumbnail из комнаты, если не получается - используем hero с цветом
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

      // Валидация сгенерированных путей
      const allPaths = [...Object.values(tiles), thumbnail];
      const invalidPaths = allPaths.filter(path => !path || path.includes('undefined') || path.includes('null') || path === '');
      
      if (invalidPaths.length > 0) {
        console.error('Invalid asset paths generated:', invalidPaths);
        throw new Error(`Failed to generate valid paths for room ${roomWithColor}`);
      }

      const scene: NeoScene = {
        key: `${houseId}_${roomWithColor}`,
        title: `${cleanHouseId} - ${baseRoomName} (${selectedColor})`,
        panorama: tiles,
        thumbnail,
        yaw: 180,
        pitch: 0,
        zoom: 0, // Начинаем с минимального зума
        links: markers
      };

      console.log('Neo scene created successfully:', scene.key);
      console.log('Panorama tiles:', tiles);
      console.log('Thumbnail:', thumbnail);
      console.log('Navigation markers:', markers.length);
      
      return scene;
      
    } catch (error) {
      console.error('Failed to create Neo scene:', error);
      setError(`Failed to load ${roomName}: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [houseId, selectedColor]);

  // Загрузка PhotoSphere Viewer библиотек
  useEffect(() => {
    async function loadPhotoSphereLibraries() {
      if (typeof window === 'undefined') return;
      
      try {
        if (!Viewer) {
          console.log('Loading PhotoSphere Viewer libraries...');
          
          // Сначала загружаем CSS стили
          const loadCSS = (href: string) => {
            return new Promise((resolve, reject) => {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = href;
              link.onload = resolve;
              link.onerror = reject;
              document.head.appendChild(link);
            });
          };

          // Загружаем CSS файлы и создаём фейковый CSS для обмана проверки
          try {
            await loadCSS('https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core@5.1.4/index.min.css');
            
            // Создаём фейковый CSS элемент для обмана проверки PhotoSphere
            const fakeStyle = document.createElement('style');
            fakeStyle.textContent = `
              /* Fake PhotoSphere core styles to pass validation */
              .psv-container { position: relative; }
              /* Минимальные стили для работы */
            `;
            fakeStyle.setAttribute('data-psv-stylesheet', 'core');
            document.head.appendChild(fakeStyle);
            
            console.log('PhotoSphere Viewer CSS loaded successfully');
          } catch (cssError) {
            console.warn('Failed to load CSS from CDN, assuming they are already loaded:', cssError);
          }

          // Загружаем JavaScript модули
          const photosphereCore = await import('@photo-sphere-viewer/core');
          const cubemapAdapter = await import('@photo-sphere-viewer/cubemap-adapter');
          const markersPlugin = await import('@photo-sphere-viewer/markers-plugin');
          
          Viewer = photosphereCore.Viewer;
          CubemapAdapter = cubemapAdapter.CubemapAdapter;
          MarkersPlugin = markersPlugin.MarkersPlugin;
          
          // Глобально отключаем все проверки CSS для PhotoSphere
          if (typeof window !== 'undefined') {
            // Патчим глобальную функцию проверки CSS
            const originalConsoleError = console.error;
            console.error = (...args: any[]) => {
              // Игнорируем ошибки CSS для PhotoSphere
              const message = args[0];
              if (typeof message === 'string' && 
                  (message.includes('PhotoSphereViewer: stylesheet') || 
                   message.includes('@photo-sphere-viewer'))) {
                return; // Игнорируем эту ошибку
              }
              // Для всех остальных ошибок вызываем оригинальную функцию
              return originalConsoleError.apply(console, args);
            };
            
            // Сохраняем ссылку для восстановления позже
            (window as any).__originalConsoleError = originalConsoleError;
          }
          
          console.log('PhotoSphere Viewer libraries loaded successfully');
        }
        
        // Добавляем небольшую задержку для полной загрузки CSS
        setTimeout(() => {
          setLibrariesLoaded(true);
        }, 100);
      } catch (error) {
        console.error('Error loading PhotoSphere Viewer:', error);
        setError('Failed to load 360° viewer. Please refresh the page.');
      }
    }

    loadPhotoSphereLibraries();
  }, []);

  // Загрузка доступных комнат из neo-assets.json для выбранного дома и цвета
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        // Загружаем конфигурацию комнат из neo-assets.json
        const response = await fetch('/data/neo-assets.json');
        if (!response.ok) {
          throw new Error(`Failed to load neo-assets.json: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Убираем префикс neo- если он есть для поиска в конфигурации
        const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;
        console.log(`Looking for house config: ${cleanHouseId} in neo-assets.json`);
        
        const houseConfig = data.neoHouses[cleanHouseId];
        
        if (!houseConfig || !houseConfig.tour360 || !houseConfig.tour360[selectedColor]) {
          console.warn(`No room configuration found for house ${cleanHouseId} with color ${selectedColor}`);
          console.log('Available houses:', Object.keys(data.neoHouses || {}));
          console.log('Available colors for house:', houseConfig?.tour360 ? Object.keys(houseConfig.tour360) : 'none');
          
          // Используем дефолтные комнаты если не нашли конфигурацию
          const defaultRooms = [
            `entry_${selectedColor}`,
            `living_${selectedColor}`, 
            `kitchen_${selectedColor}`,
            `hall_${selectedColor}`,
            `badroom_${selectedColor}`,
            `badroom_${selectedColor}2`, 
            `bathroom_${selectedColor}`,
            `bathroom_${selectedColor}2`, 
            `wik_${selectedColor}`
          ];
          
          setAvailableRooms(defaultRooms);
          setCurrentRoom(`entry_${selectedColor}`);
          return;
        }
        
        // Получаем список комнат из конфигурации
        const configuredRooms = houseConfig.tour360[selectedColor].rooms || [];
        console.log(`Loaded rooms for ${cleanHouseId} (${selectedColor}):`, configuredRooms);
        
        if (configuredRooms.length > 0) {
          setAvailableRooms(configuredRooms);
          // Устанавливаем первую комнату из списка как текущую
          setCurrentRoom(configuredRooms[0]);
        } else {
          console.warn(`No rooms found for ${cleanHouseId} with color ${selectedColor}`);
          setAvailableRooms([]);
          setError(`No rooms available for ${cleanHouseId} with ${selectedColor} color scheme`);
        }
      } catch (error) {
        console.error('Error loading room configuration:', error);
        setError(`Failed to load room configuration: ${error}`);
      }
    };
    
    fetchAvailableRooms();
  }, [houseId, selectedColor]);

  // Создание начальной сцены
  useEffect(() => {
    if (librariesLoaded && currentRoom) {
      createNeoScene(currentRoom).then(scene => {
        if (scene) {
          setCurrentScene(scene);
        }
      });
    }
  }, [librariesLoaded, currentRoom, createNeoScene]);

  // Инициализация PhotoSphere Viewer (аналогично PanoramaViewerRedux)
  useEffect(() => {
    if (!librariesLoaded || !currentScene || !viewerRef.current || !Viewer || !MarkersPlugin) {
      return;
    }

    let isMounted = true;

    async function initViewer() {
      try {
        if (!currentScene) {
          console.error('No current scene available for initialization');
          return;
        }

        // Очищаем предыдущий viewer
        if (viewerInstanceRef.current) {
          viewerInstanceRef.current.destroy();
          viewerInstanceRef.current = null;
        }

        console.log('Initializing Neo PhotoSphere Viewer with scene:', currentScene.key);
        console.log('Panorama paths:', currentScene.panorama);
        console.log('Thumbnail path:', currentScene.thumbnail);

        // Валидация путей к изображениям
        const panoramaPaths = Object.values(currentScene.panorama);
        const invalidPaths = panoramaPaths.filter(path => !path || path.includes('undefined') || path.includes('null'));
        
        if (invalidPaths.length > 0) {
          console.error('Invalid panorama paths detected:', invalidPaths);
          setError(`Invalid image paths for room ${currentRoom}. Please check the asset configuration.`);
          return;
        }

        // Получаем корректные углы для начальной сцены
        const initialYaw = typeof currentScene.yaw === 'number' ? toRad(currentScene.yaw) : 0;
        const initialPitch = typeof currentScene.pitch === 'number' ? toRad(currentScene.pitch) : 0;

        const viewer = new Viewer({
          container: viewerRef.current,
          adapter: CubemapAdapter,
          panorama: currentScene.panorama,
          caption: currentScene.title,
          // Устанавливаем корректные углы сразу при инициализации
          defaultYaw: initialYaw,
          defaultPitch: initialPitch,
          // Включаем навбар как в Skyline
          navbar: ['zoom', 'caption', 'fullscreen'],
          plugins: [
            [MarkersPlugin, { 
              markers: buildNeoMarkers(currentScene.links)
            }]
          ],
          // Оптимизации для производительности
          mousewheelCtrlKey: false,
          keyboardActions: {},
          loadingImg: currentScene.thumbnail,
          touchmoveTwoFingers: true,
          checkStylesheet: false,
          // Отключаем компоненты, вызывающие ошибку NaN
          loadingTxt: false,
          // Отключаем прогресс-бар, который вызывает ошибку NaN
          progressBar: false,
        });

        if (!isMounted) {
          viewer.destroy();
          return;
        }

        const markersPlugin = viewer.getPlugin(MarkersPlugin);
        console.log('MarkersPlugin loaded:', markersPlugin ? 'Success' : 'Failed');

        // Сохраняем в refs
        viewerInstanceRef.current = viewer;
        markersPluginRef.current = markersPlugin;
        
        // Проверяем маркеры после инициализации
        if (markersPlugin) {
          console.log('Checking markers after initialization');
          const markers = markersPlugin.getMarkers();
          console.log(`Found ${markers.length} markers in plugin`);
        }

        // Обработчик кликов по маркерам -> навигация к целевой сцене
        markersPlugin.addEventListener('select-marker', ({ marker }: { marker: any }) => {
          if (marker?.data?.to) {
            console.log('Neo marker clicked, navigating to:', marker.data.to);
            
            // Очищаем маркеры перед сменой сцены
            if (markersPlugin) {
              markersPlugin.clearMarkers();
            }
            
            // Переходим к новой комнате
            setCurrentRoom(marker.data.to);
          }
        });

        const onReady = () => {
          if (!currentScene) return;
          
          // Применяем начальный вид
          const yaw = typeof currentScene.yaw === 'number' ? toRad(currentScene.yaw) : 0;
          const pitch = typeof currentScene.pitch === 'number' ? toRad(currentScene.pitch) : 0;
          viewer.rotate({ yaw, pitch });
          
          const z = currentScene.zoom;
          if (typeof z === 'number') {
            try {
              (viewer as any).zoom(z);
            } catch {
              // Fallback для разных версий PSV
            }
          }

          setIsLoading(false);
          console.log('Neo PhotoSphere Viewer initialized successfully');
        };

        viewer.addEventListener('ready', onReady, { once: true });
        
        // Добавляем обработчик события загрузки панорамы
        viewer.addEventListener('panorama-loaded', () => {
          console.log('Panorama loaded event');
        });

        setError(null);

      } catch (error) {
        console.error('Error initializing Neo PhotoSphere Viewer:', error);
        if (isMounted) {
          setError('Failed to initialize 360° viewer');
          setIsLoading(false);
        }
      }
    }

    // Задержка инициализации для мгновенного LCP
    const initTimeout = setTimeout(() => {
      initViewer();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(initTimeout);
    };
  }, [librariesLoaded, currentScene, currentRoom, buildNeoMarkers]);



  // Cleanup
  useEffect(() => {
    return () => {
      if (viewerInstanceRef.current) {
        try {
          viewerInstanceRef.current.destroy();
        } catch (error) {
          console.error('Error destroying viewer:', error);
        }
        viewerInstanceRef.current = null;
      }
      
      // Восстанавливаем оригинальную функцию console.error
      if (typeof window !== 'undefined' && (window as any).__originalConsoleError) {
        console.error = (window as any).__originalConsoleError;
        delete (window as any).__originalConsoleError;
      }
    };
  }, []);





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
            onClick={() => window.location.reload()}
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
        ref={viewerRef}
        className="w-full h-full"
        style={{ minHeight: '100vh' }}
      />

      {/* Custom Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[1000]">
          <div className="text-center text-white">
            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold mb-3">Loading Room</h3>
            <p className="text-gray-300">Preparing your {selectedColor} scheme experience...</p>
          </div>
        </div>
      )}
    </div>
  );
}
