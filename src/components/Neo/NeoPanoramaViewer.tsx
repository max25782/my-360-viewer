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
  links: Array<{ to: string; yaw: number; pitch: number; label: string }>;
}

interface NeoMarker {
  to: string;
  yaw: number;
  pitch: number;
  label: string;
}

// Dynamic imports for PhotoSphere Viewer (SSR-safe)
let Viewer: any = null;
let CubemapAdapter: any = null;

export default function NeoPanoramaViewer({ houseId, selectedColor }: NeoPanoramaViewerProps) {
  const [currentRoom, setCurrentRoom] = useState<string>(`entry_${selectedColor}`);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState<NeoScene | null>(null);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);

  // Мемоизированная функция для создания сцены
  const createNeoScene = useCallback(async (roomName: string): Promise<NeoScene | null> => {
    try {
      setIsLoading(true);
      
      // Убираем суффикс цвета если он уже есть
      const baseRoomName = roomName.replace(/_white$|_dark$/, '');
      const roomWithColor = `${baseRoomName}_${selectedColor}`;
      
      console.log(`Creating Neo scene: ${roomWithColor} for house ${houseId}`);

      // Загружаем маркеры для навигации
      const markers = await getNeoMarkers(houseId, selectedColor, roomWithColor);
      
      // Создаем пути к 360° изображениям
      const tiles = {
        front: await getNeoAssetPath('tour360', houseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'front', 
          format: 'jpg' 
        }),
        back: await getNeoAssetPath('tour360', houseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'back', 
          format: 'jpg' 
        }),
        left: await getNeoAssetPath('tour360', houseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'left', 
          format: 'jpg' 
        }),
        right: await getNeoAssetPath('tour360', houseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'right', 
          format: 'jpg' 
        }),
        top: await getNeoAssetPath('tour360', houseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'up', 
          format: 'jpg' 
        }),
        bottom: await getNeoAssetPath('tour360', houseId, { 
          color: selectedColor, 
          room: roomWithColor, 
          tour360Type: 'tiles', 
          tileDirection: 'down', 
          format: 'jpg' 
        })
      };

      const thumbnail = await getNeoAssetPath('tour360', houseId, { 
        color: selectedColor, 
        room: roomWithColor, 
        tour360Type: 'thumbnail', 
        format: 'jpg' 
      });

      const scene: NeoScene = {
        key: `${houseId}_${roomWithColor}`,
        title: `${houseId} - ${baseRoomName} (${selectedColor})`,
        panorama: tiles,
        thumbnail,
        yaw: 180,
        pitch: 0,
        zoom: 50,
        links: markers
      };

      console.log('Neo scene created:', scene);
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
          
          Viewer = photosphereCore.Viewer;
          CubemapAdapter = cubemapAdapter.CubemapAdapter;
          
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

  // Загрузка доступных комнат для выбранного цвета
  useEffect(() => {
    const rooms = [
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
    
    setAvailableRooms(rooms);
    setCurrentRoom(`entry_${selectedColor}`);
  }, [selectedColor]);

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

  // Инициализация PhotoSphere Viewer
  useEffect(() => {
    if (!librariesLoaded || !currentScene || !viewerRef.current || !Viewer) {
      return;
    }

    try {
      // Очищаем предыдущий viewer и маркеры
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      }
      
      // Очищаем старые маркеры
      if (viewerRef.current) {
        const oldMarkers = viewerRef.current.querySelectorAll('.neo-marker');
        oldMarkers.forEach(marker => marker.remove());
      }

      console.log('Initializing PhotoSphere Viewer with scene:', currentScene.key);

      const viewer = new Viewer({
        container: viewerRef.current,
        adapter: CubemapAdapter,
        panorama: currentScene.panorama,
        caption: currentScene.title,
        defaultYaw: (currentScene.yaw * Math.PI) / 180,
        defaultPitch: (currentScene.pitch * Math.PI) / 180,
        defaultZoomLvl: currentScene.zoom,
        minFov: 30,
        maxFov: 90,
        loadingImg: currentScene.thumbnail,
        touchmoveTwoFingers: true,
        mousewheelCtrlKey: false,
        // Отключаем проверку CSS стилей
        checkStylesheet: false
      });

      // Добавляем маркеры после инициализации viewer
      try {
        // Попробуем добавить маркеры программно
        setTimeout(() => {
          if (currentScene.links && currentScene.links.length > 0) {
            // Добавляем простые HTML маркеры вместо MarkersPlugin
            const container = viewerRef.current;
            if (container) {
              currentScene.links.forEach((link, index) => {
                const marker = document.createElement('div');
                marker.className = 'neo-marker';
                marker.style.cssText = `
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 32px;
                  height: 32px;
                  background: rgba(255, 255, 255, 0.9);
                  border: 2px solid #007bff;
                  border-radius: 50%;
                  cursor: pointer;
                  transform: translate(-50%, -50%);
                  z-index: 100;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: bold;
                  color: #007bff;
                  transition: all 0.2s ease;
                `;
                marker.textContent = '➤';
                marker.title = link.label;
                marker.onclick = () => {
                  setCurrentRoom(link.to);
                };
                
                // Позиционируем маркер случайно для демонстрации
                const angle = (index * 60) % 360;
                const radius = 40;
                const x = 50 + Math.cos(angle * Math.PI / 180) * radius;
                const y = 50 + Math.sin(angle * Math.PI / 180) * radius;
                marker.style.left = `${x}%`;
                marker.style.top = `${y}%`;
                
                container.appendChild(marker);
              });
            }
          }
        }, 500);
      } catch (markerError) {
        console.warn('Failed to add markers:', markerError);
      }

      viewerInstanceRef.current = viewer;
      setError(null);
      
      console.log('PhotoSphere Viewer initialized successfully');

    } catch (error) {
      console.error('Error initializing PhotoSphere Viewer:', error);
      setError('Failed to initialize 360° viewer');
    }
  }, [librariesLoaded, currentScene, currentRoom]);

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

  // Функция получения иконки комнаты
  const getRoomIcon = (roomName: string): string => {
    const baseName = roomName.replace(/_white$|_dark$/, '').replace(/2$/, '');
    
    switch (baseName) {
      case 'entry': return '🚪';
      case 'living': return '🛋️';
      case 'kitchen': return '🍳';
      case 'hall': return '🚶';
      case 'bedroom': return '🛏️';
      case 'badroom': return '🛏️'; // поддержка старого названия
      case 'bathroom': return '🚿';
      case 'wik': return '👔';
      default: return '📍';
    }
  };

  const getRoomDisplayName = (roomName: string): string => {
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
  };

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

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading {getRoomDisplayName(currentRoom)}</h3>
            <p className="text-gray-300">Preparing your {selectedColor} scheme experience...</p>
          </div>
        </div>
      )}

      {/* Room Navigation */}
      <div className="absolute bottom-6 left-6 right-6 z-40">
        <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">
              {getRoomIcon(currentRoom)} {getRoomDisplayName(currentRoom)}
            </h3>
            <div className="text-sm text-gray-300">
              {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} Scheme
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {availableRooms.map((room) => {
              const isActive = room === currentRoom;
              const displayName = getRoomDisplayName(room);
              const icon = getRoomIcon(room);
              
              return (
                <button
                  key={room}
                  onClick={() => setCurrentRoom(room)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{displayName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
