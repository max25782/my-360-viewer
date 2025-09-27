/**
 * NEO PANORAMA VIEWER
 * Специализированная версия PanoramaViewer для Neo домов с поддержкой цветовых схем
 * Основан на PanoramaViewerRedux.tsx но с Neo-специфичной логикой
 */

'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Bed, Bathtub, Car, Door, ForkKnife, Laptop, MapPin, Monitor, Package, Armchair, Stairs, Sun, Tree, WashingMachine } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { getNeoAssetPath, getNeoMarkers } from '../../utils/neoAssets';
import { useServiceWorker } from '../../hooks/useServiceWorker';

interface NeoPanoramaViewerProps {
  houseId: string;
  selectedColor: 'white' | 'dark';
  onClose?: () => void;
  onBack?: () => void;
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

export default function NeoPanoramaViewer({ houseId, selectedColor, onClose, onBack }: NeoPanoramaViewerProps) {
  const router = useRouter();
  const [currentRoom, setCurrentRoom] = useState<string>(`entry_${selectedColor}`);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState<NeoScene | null>(null);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const markersPluginRef = useRef<any>(null);
  
  // Service Worker для кэширования
  const { registerAssets } = useServiceWorker();

  // Utility function to convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  // Get room display name
  const getRoomDisplayName = (roomName: string): string => {
    const baseName = roomName.replace(/_white$|_dark$/, '');
    
    switch (baseName) {
      case 'entry': return 'Entry';
      case 'living': return 'Living Room';
      case 'kitchen': return 'Kitchen';
      case 'hall': return 'Hallway';
      case 'bedroom': return 'Bedroom 1';
      case 'bedroom2': return 'Bedroom 2';
      case 'bathroom': return 'Bathroom 1';
      case 'bathroom2': return 'Bathroom 2';
      case 'wik': return 'Walk-in Closet';
      case 'office': return 'Office';
      default: return baseName;
    }
  };
  
  // Room icon slug
  const getRoomIcon = (roomName: string): string => {
    const baseName = roomName.replace(/_white$|_dark$/, '').replace(/2$/, '');
    // Возвращаем slug иконки Lucide (lucide-static)
    switch (baseName) {
      case 'living': return 'sofa'; // Гостиная
      case 'bedroom': return 'bed'; // Спальня
      case 'bathroom': return 'bath'; // Ванная (альт: shower-head)
      case 'kitchen': return 'utensils-crossed'; // Кухня
      case 'dining': return 'utensils'; // Столовая (альт: wine)
      case 'office': return 'monitor'; // Кабинет (альт: laptop)
      case 'garage': return 'car'; // Гараж
      case 'balcony':
      case 'outdoor': return 'trees'; // Балкон / Улица (альт: sun)
      case 'hall':
      case 'entry': return 'door-closed'; // Прихожая
      case 'stairs':
      case 'basement': return 'stairs'; // Лестница / Подвал
      case 'laundry': return 'washing-machine'; // Прачечная
      case 'wik':
      case 'closet':
      case 'storage': return 'package'; // Гардероб / Кладовка (альт: boxes)
      default: return 'map-pin'; // По умолчанию
    }
  };

  // Map various incoming icon values (emoji or arbitrary) to our Phosphor slugs
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

  // Build markers from scene links (similar to Skyline Viewer360)
  const buildNeoMarkers = useCallback((links: NeoMarker[]) => {
    console.log('Building Neo markers:', links.length, 'links');
    console.log('Links data:', links);
    
    // Используем HTML маркеры в стиле Skyline
    const markers = links.map((link, index) => {
      const iconSlug = mapIconToSlug(link.icon as string | undefined, link.to);
      const roomLabel = link.label || getRoomDisplayName(link.to);
      
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
                <div class="neo-chip-label">${roomLabel}</div>
              </div>
            </div>
          `;
        })(),
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
      
      // Теперь комнаты хранятся без суффиксов цвета и с номерами в формате bathroom2
      // Убираем суффикс цвета если он есть и нормализуем имя комнаты
      let baseRoomName = roomName.replace(/_white$|_dark$/, '');
      
      // Преобразуем bathroom_2 в bathroom2
      if (baseRoomName.includes('_2')) {
        baseRoomName = baseRoomName.replace(/_2$/, '2');
        console.log(`Normalized room name with number: ${roomName} -> ${baseRoomName}`);
      }
      
      console.log(`Creating Neo scene: ${baseRoomName} for house ${houseId} (color: ${selectedColor})`);

      // Проверяем, есть ли эта комната в списке доступных комнат
      if (availableRooms.length > 0 && !availableRooms.includes(baseRoomName)) {
        console.warn(`Room ${baseRoomName} is not in available rooms list:`, availableRooms);
        // Если комнаты нет в списке доступных, используем первую доступную комнату
        if (availableRooms.length > 0) {
          const fallbackRoom = availableRooms[0];
          console.log(`Using first available room instead: ${fallbackRoom}`);
          // Обновляем текущую комнату и прерываем выполнение
          setCurrentRoom(fallbackRoom);
          setIsLoading(false);
          return null; // Прерываем создание сцены, позволяем useEffect перезапуститься с новой комнатой
        } else {
          setError(`Room ${baseRoomName} is not available for house ${houseId}`);
          return null;
        }
      }

      // Убираем префикс neo- для путей к ассетам
      const cleanHouseId = houseId.startsWith('neo-') ? houseId.substring(4) : houseId;

      // Загружаем маркеры для навигации
      const markers = await getNeoMarkers(cleanHouseId, selectedColor, baseRoomName);
      
      // Создаем пути к 360° изображениям
      const tiles = {
        front: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: baseRoomName, 
          tour360Type: 'tiles', 
          tileDirection: 'front', 
          format: 'jpg' 
        }),
        back: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: baseRoomName, 
          tour360Type: 'tiles', 
          tileDirection: 'back', 
          format: 'jpg' 
        }),
        left: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: baseRoomName, 
          tour360Type: 'tiles', 
          tileDirection: 'left', 
          format: 'jpg' 
        }),
        right: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: baseRoomName, 
          tour360Type: 'tiles', 
          tileDirection: 'right', 
          format: 'jpg' 
        }),
        top: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: baseRoomName, 
          tour360Type: 'tiles', 
          tileDirection: 'up', 
          format: 'jpg' 
        }),
        bottom: await getNeoAssetPath('tour360', cleanHouseId, { 
          color: selectedColor, 
          room: baseRoomName, 
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
        room: baseRoomName, 
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
        throw new Error(`Failed to generate valid paths for room ${baseRoomName}`);
      }

      const scene: NeoScene = {
        key: `${houseId}_${baseRoomName}`,
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
  }, [houseId, selectedColor, availableRooms]);

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
            await loadCSS('https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/markers-plugin@5.1.4/index.min.css');
            
            // Создаём фейковый CSS элемент для обмана проверки PhotoSphere
            const fakeStyle = document.createElement('style');
            fakeStyle.textContent = `
              /* Fake PhotoSphere core styles to pass validation */
              .psv-container { position: relative; }
              /* Минимальные стили для работы */
              
              /* Стили для маркеров комнат */
              .psv-room-marker {
                z-index: 1000 !important;
                pointer-events: auto !important;
              }
              
              .room-marker {
                z-index: 1000 !important;
                pointer-events: auto !important;
              }

              /* Neo marker layout: icon with right-sliding label (pill grows out of the circle) */
              .psv-room-marker .neo-marker { display: inline-flex; align-items: center; pointer-events: auto; }
              .psv-room-marker .neo-chip {
                display: inline-flex;
                align-items: center;
                height: 48px;
                max-width: 48px;
                background: rgba(0,0,0,0.45);
                border-radius: 9999px;
                overflow: hidden;
             
                transition: max-width .28s ease, padding-right .28s ease;
                padding-left: 10px;
                padding-right: 0;
              }
              .psv-room-marker:hover .neo-chip { max-width: 280px; padding-right: 10px; }
              .psv-room-marker .neo-icon-img { width: 26px; height: 26px; display: block; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6)); }
              .psv-room-marker .neo-chip-label { margin-left: 8px; color: #fff; white-space: nowrap; opacity: 0; transform: translateX(-8px); transition: opacity .22s ease, transform .22s ease; }
              .psv-room-marker:hover .neo-chip-label { opacity: 1; transform: translateX(0); }
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
          
          console.log('PhotoSphere modules loaded:', {
            Viewer: !!Viewer,
            CubemapAdapter: !!CubemapAdapter,
            MarkersPlugin: !!MarkersPlugin
          });
          
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
            'entry',
            'living', 
            'kitchen',
            'hall',
            'bedroom',
            'bedroom2', 
            'bathroom',
            'bathroom2', 
            'wik'
          ];
          
          setAvailableRooms(defaultRooms);
          setCurrentRoom('entry');
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
        
        // Регистрируем ассеты для кэширования в Service Worker
        // Фильтруем пути, чтобы убедиться, что все они валидны
        const assetsToCache = [...panoramaPaths, currentScene.thumbnail].filter(
          path => path && typeof path === 'string' && path.startsWith('/')
        );
        
        if (assetsToCache.length > 0) {
          console.log('Регистрация ассетов для кэширования:', assetsToCache);
          registerAssets(assetsToCache);
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
            [MarkersPlugin, { markers: buildNeoMarkers(currentScene.links) }]
          ],
          // Оптимизации для производительности
          mousewheelCtrlKey: false,
          keyboardActions: {},
        loadingImg: currentScene.thumbnail,
        touchmoveTwoFingers: false, // Позволяет использовать один палец для навигации на сенсорных экранах
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
          
          // Принудительно добавляем маркеры еще раз
          if (markers.length === 0 && currentScene.links.length > 0) {
            console.log('No markers found, adding them manually');
            const neoMarkers = buildNeoMarkers(currentScene.links);
            markersPlugin.setMarkers(neoMarkers);
            markersPlugin.renderMarkers();
            viewer.needsUpdate();
          }
        }

        // Обработчик кликов по маркерам -> навигация к целевой сцене
        markersPlugin.addEventListener('select-marker', ({ marker }: { marker: any }) => {
          if (marker?.data?.to) {
            console.log('Neo marker clicked, navigating to:', marker.data.to);
            
            // Убираем суффикс цвета из target room если он есть
            const targetRoom = marker.data.to.replace(/_white$|_dark$/, '');
            
            // Очищаем маркеры перед сменой сцены
            if (markersPlugin) {
              markersPlugin.clearMarkers();
            }
            
            // Переходим к новой комнате
            setCurrentRoom(targetRoom);
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
          
          // Принудительно перерисовываем маркеры после ready
          if (markersPlugin && currentScene.links.length > 0) {
            console.log('Force rendering markers on ready');
            const neoMarkers = buildNeoMarkers(currentScene.links);
            markersPlugin.clearMarkers();
            markersPlugin.setMarkers(neoMarkers);
            markersPlugin.renderMarkers();
            viewer.needsUpdate();
          }

          setIsLoading(false);
          console.log('Neo PhotoSphere Viewer initialized successfully');
        };

        viewer.addEventListener('ready', onReady, { once: true });
        
        // Добавляем обработчик события загрузки панорамы
        viewer.addEventListener('panorama-loaded', () => {
          console.log('Panorama loaded event');
          
          // Перерисовываем маркеры после загрузки панорамы
          setTimeout(() => {
            if (markersPlugin && isMounted) {
              console.log('Re-rendering markers after panorama load');
              markersPlugin.clearMarkers();
              markersPlugin.setMarkers(buildNeoMarkers(currentScene.links));
              markersPlugin.renderMarkers();
              viewer.needsUpdate();
            }
          }, 300);
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
      
      // Удаляем обработчик ошибок загрузки изображений
      if (typeof window !== 'undefined' && (window as any).__imageErrorHandler) {
        window.removeEventListener('error', (window as any).__imageErrorHandler, true);
        delete (window as any).__imageErrorHandler;
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
      {/* Navigation buttons */}
      {!isLoading && (
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
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
