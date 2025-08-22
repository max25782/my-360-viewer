/**
 * SSR-безопасный компонент для 360° просмотрщика
 * Использует PhotoSphere Viewer с h-dvh и ResizeObserver
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type { Panorama } from '../types/houses';
import { publicUrl } from '../utils/paths';

// Динамические импорты для SSR-безопасности
let Viewer: any = null;
let CubemapAdapter: any = null;
let MarkersPlugin: any = null;

interface Viewer360Props {
  panoramas: Panorama[];
  activePanoramaId?: string;
  onPanoramaChange?: (panoramaId: string) => void;
  className?: string;
  showNavbar?: boolean;
}

export default function Viewer360({ 
  panoramas, 
  activePanoramaId, 
  onPanoramaChange,
  className = "relative w-full h-dvh",
  showNavbar = true
}: Viewer360Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const markersPluginRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSSR, setIsSSR] = useState(true);
  const [librariesLoaded, setLibrariesLoaded] = useState(false);

  // Проверяем SSR и загружаем библиотеки
  useEffect(() => {
    setIsSSR(false);
    
    // Динамическая загрузка библиотек PhotoSphere Viewer
    (async () => {
      try {
        if (!Viewer) {
          const photosphereCore = await import('@photo-sphere-viewer/core');
          const cubemapAdapter = await import('@photo-sphere-viewer/cubemap-adapter');
          const markersPlugin = await import('@photo-sphere-viewer/markers-plugin');
          
          Viewer = photosphereCore.Viewer;
          CubemapAdapter = cubemapAdapter.CubemapAdapter;
          MarkersPlugin = markersPlugin.MarkersPlugin;
          
          // CSS стили загружаются через global.css
        }
        
        setLibrariesLoaded(true);
      } catch (error) {
        console.error('Ошибка загрузки PhotoSphere Viewer:', error);
        setError('Не удалось загрузить 360° viewer');
      }
    })();
  }, []);

  // Получаем активную панораму
  const activePanorama = panoramas.find(p => p.id === activePanoramaId) || panoramas[0];

  // Создание маркеров
  const createMarkers = useCallback((panorama: Panorama) => {
    if (!panorama.markers || panorama.markers.length === 0) return [];

    return panorama.markers.map((marker) => ({
      id: marker.id,
      position: {
        yaw: marker.position.yaw,
        pitch: marker.position.pitch
      },
      html: marker.type === 'room' ? `
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
          ">${marker.icon || '🚪'}</div>
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
          ">${marker.label || 'Room'}</div>
        </div>
      ` : `
        <div style="
          width: 24px;
          height: 24px;
          background: #ff6b35;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      data: { 
        targetPanoramaId: marker.targetPanoramaId,
        type: marker.type
      }
    }));
  }, []);

  // Получение URL тайлов для кубической панорамы
  const getCubemapUrls = useCallback((panorama: Panorama) => {
    return {
      front: publicUrl(panorama.tiles.front),
      back: publicUrl(panorama.tiles.back),
      left: publicUrl(panorama.tiles.left),
      right: publicUrl(panorama.tiles.right),
      top: publicUrl(panorama.tiles.up),
      bottom: publicUrl(panorama.tiles.down)
    };
  }, []);

  // Смена панорамы
  const changePanorama = useCallback(async (panorama: Panorama) => {
    if (!viewerRef.current || !markersPluginRef.current) return;

    try {
      const cubemapUrls = getCubemapUrls(panorama);
      
      // Устанавливаем панораму без переходов
      await viewerRef.current.setPanorama(cubemapUrls, {
        position: {
          yaw: panorama.defaultView.yaw,
          pitch: panorama.defaultView.pitch
        },
        zoom: panorama.defaultView.zoom,
        transition: false
      });

      // Обновляем маркеры
      const markers = createMarkers(panorama);
      markersPluginRef.current.clearMarkers();
      
      if (markers.length > 0) {
        markersPluginRef.current.setMarkers(markers);
      }

      onPanoramaChange?.(panorama.id);
      setError(null);

    } catch (error) {
      console.error('Ошибка смены панорамы:', error);
      setError('Ошибка загрузки панорамы');
    }
  }, [getCubemapUrls, createMarkers, onPanoramaChange]);

  // Инициализация вьюера
  useEffect(() => {
    if (isSSR || !containerRef.current || !activePanorama || isReady || !librariesLoaded) return;

    let isMounted = true;

    async function initViewer() {
      try {
        const cubemapUrls = getCubemapUrls(activePanorama);
        
        const viewer = new Viewer({
          container: containerRef.current!,
          adapter: CubemapAdapter,
          panorama: cubemapUrls,
          plugins: [MarkersPlugin],
          defaultYaw: activePanorama.defaultView.yaw,
          defaultPitch: activePanorama.defaultView.pitch,
          defaultZoomLvl: activePanorama.defaultView.zoom,
          navbar: showNavbar ? [
            'zoom',
            'move',
            'fullscreen'
          ] : false,
          loadingImg: undefined,
          size: {
            width: '100%',
            height: '100%'
          },
          // Оптимизации для производительности
          mousemove: true,
          mousewheelCtrlKey: false,
          touchmoveTwoFingers: true
        });

        if (!isMounted) {
          viewer.destroy();
          return;
        }

        viewerRef.current = viewer;
        markersPluginRef.current = viewer.getPlugin(MarkersPlugin);

        // Обработчик кликов по маркерам
        markersPluginRef.current.addEventListener('select-marker', (e: any) => {
          const marker = e.marker;
          const targetPanoramaId = marker.data?.targetPanoramaId;
          
          if (targetPanoramaId) {
            const targetPanorama = panoramas.find(p => p.id === targetPanoramaId);
            if (targetPanorama) {
              changePanorama(targetPanorama);
            }
          }
        });

        // Начальные маркеры
        const markers = createMarkers(activePanorama);
        if (markers.length > 0) {
          markersPluginRef.current.setMarkers(markers);
        }

        // ResizeObserver для автоматического ресайзинга
        if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
          resizeObserverRef.current = new ResizeObserver((entries) => {
            for (const entry of entries) {
              if (viewerRef.current && entry.target === containerRef.current) {
                // Debounce resize для производительности
                setTimeout(() => {
                  if (viewerRef.current) {
                    viewerRef.current.resize({
                      width: entry.contentRect.width,
                      height: entry.contentRect.height
                    });
                  }
                }, 100);
              }
            }
          });
          
          resizeObserverRef.current.observe(containerRef.current);
        }

        setIsReady(true);
        setError(null);

      } catch (error) {
        console.error('Ошибка инициализации вьюера:', error);
        if (isMounted) {
          setError('Ошибка инициализации 360° просмотрщика');
        }
      }
    }

    initViewer();

    return () => {
      isMounted = false;
    };
  }, [isSSR, activePanorama, getCubemapUrls, createMarkers, changePanorama, isReady, showNavbar, librariesLoaded]);

  // Обработка смены активной панорамы
  useEffect(() => {
    if (isReady && activePanorama && viewerRef.current) {
      changePanorama(activePanorama);
    }
  }, [activePanoramaId, isReady, activePanorama, changePanorama]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  // SSR fallback
  if (isSSR || !librariesLoaded) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <div className="text-4xl mb-4">🏠</div>
            <div className="text-gray-600">Инициализация 360° просмотрщика...</div>
          </div>
        </div>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center p-6">
            <div className="text-red-600 text-xl mb-2">❌</div>
            <div className="text-gray-700 font-medium mb-2">Ошибка загрузки</div>
            <div className="text-gray-600 text-sm">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Перезагрузить
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Контейнер для вьюера */}
      <div
        ref={containerRef}
        className="w-full h-full bg-gray-100"
        style={{ minHeight: '300px' }}
      />
      
      {/* Индикатор загрузки */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-600">Загружается 360° тур...</div>
          </div>
        </div>
      )}
    </div>
  );
}
