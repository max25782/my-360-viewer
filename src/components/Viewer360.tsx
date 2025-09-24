/**
 * SSR-безопасный компонент для 360° просмотрщика
 * Использует PhotoSphere Viewer с h-dvh и ResizeObserver
 */

'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Bed, Bathtub, Car, Door, ForkKnife, Laptop, MapPin, Monitor, Package, Armchair, Sun, Tree, WashingMachine } from '@phosphor-icons/react';
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

  // Инъекция CSS для Neo-стиля маркеров
  useEffect(() => {
    try {
      if (typeof document !== 'undefined' && !document.querySelector('style[data-sky-premium-marker-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-sky-premium-marker-styles', 'true');
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

  // Создание маркеров (Neo-стиль с Phosphor SVG через data URL)
  const createMarkers = useCallback((panorama: Panorama) => {
    if (!panorama.markers || panorama.markers.length === 0) return [];

    const mapEmojiToSlug = (icon?: string) => {
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
        '🚗': 'car',
        '🌳': 'trees',
      };
      if (icon && emojiMap[icon]) return emojiMap[icon];
      return 'map-pin';
    };

    const getIconComponent = (slug: string) => {
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

    return panorama.markers.map((marker) => {
      const slug = mapEmojiToSlug(marker.icon);
      const Icon = getIconComponent(slug);
      const svg = renderToStaticMarkup(
        React.createElement(Icon, { size: 28, color: '#fff', weight: 'bold' })
      );
      const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

      return {
        id: marker.id,
        position: {
          yaw: marker.position.yaw,
          pitch: marker.position.pitch
        },
        html: marker.type === 'room' ? `
          <div class="neo-marker">
            <div class="neo-chip">
              <img class="neo-icon-img" src="${src}" alt="" />
              <div class="neo-chip-label">${marker.label || ''}</div>
            </div>
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
        className: 'psv-room-marker',
        data: { 
          targetPanoramaId: marker.targetPanoramaId,
          type: marker.type
        }
      };
    });
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

  // Prefetch neighbor panoramas (simple best-effort, cache in-memory via Image)
  const prefetchNeighbors = useCallback((panorama: Panorama) => {
    if (!panorama.markers || panorama.markers.length === 0) return;
    const neighbors = panorama.markers
      .filter(m => m.targetPanoramaId)
      .map(m => panoramas.find(p => p.id === m.targetPanoramaId))
      .filter((p): p is Panorama => Boolean(p));
    const toPrefetch = neighbors.slice(0, 2); // cap
    for (const next of toPrefetch) {
      const urls = [
        next.tiles.front,
        next.tiles.back,
        next.tiles.left,
        next.tiles.right,
        next.tiles.up,
        next.tiles.down,
      ].map(publicUrl);
      urls.forEach((u) => {
        const img = new Image();
        img.decoding = 'async' as any;
        img.loading = 'eager' as any;
        img.src = u;
      });
    }
  }, [panoramas]);

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
        zoom: 0, // Начинаем без зума при смене панорам
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

      // Prefetch neighbors right after setting current panorama
      prefetchNeighbors(panorama);

    } catch (error) {
      console.error('Ошибка смены панорамы:', error);
      setError('Ошибка загрузки панорамы');
    }
  }, [getCubemapUrls, createMarkers, onPanoramaChange, prefetchNeighbors]);

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
          defaultZoomLvl: 0, // Начинаем с минимального зума
          minFov: 30,
          maxFov: 120, // Увеличиваем максимальный FOV
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
