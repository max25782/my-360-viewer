'use client';

import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { CubemapAdapter } from '@photo-sphere-viewer/cubemap-adapter';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

// Import CSS styles
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

interface PanoramaViewerProps {
  houseId: string;
}

import { getHouseTour, getScene, getRoomIcon } from '../data/tour-scenes';

export default function PanoramaViewer({ houseId }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const pluginsRef = useRef<{ markers?: MarkersPlugin }>({});
  const [isViewerReady, setIsViewerReady] = useState(false);

  // Get scenes for the specific house
  const getHouseScenes = (house: string) => {
    return getHouseTour(house);
  };

  // Helper: find scene by key  
  const findScene = (key: string, house: string) => {
    return getScene(key, house);
  };

  // Helper: degrees -> radians if needed
  const toRad = (val: number) => (Math.abs(val) > Math.PI * 2 ? (val * Math.PI) / 180 : val);

  // Helper: build markers for scene links with room icons
  const buildMarkers = (links: any[] = [], house: string) =>
    links.map((l, idx) => {
      const targetScene = findScene(l.to, house);
      const roomIcon = getRoomIcon(l.to);
      const roomTitle = targetScene?.title || l.to;
      
      return {
        id: `link-${l.to}-${idx}`,
        position: { yaw: toRad(l.yaw || 0), pitch: toRad(l.pitch || 0) },
        tooltip: roomTitle,
        html: `
          <div class="room-marker" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 60px;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
          ">
            <div style="
              font-size: 32px;
              line-height: 1;
              margin-bottom: 2px;
            ">${roomIcon}</div>
            <div style="
              font-size: 11px;
              font-weight: bold;
              color: white;
              text-align: center;
              max-width: 48px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            ">${roomTitle.split(' - ')[1] || roomTitle}</div>
          </div>
        `,
        anchor: 'center' as const,
        className: 'psv-room-marker',
        data: { to: l.to },
      };
    });

  useEffect(() => {
    if (!containerRef.current) return;

    // Задержка инициализации для мгновенного LCP
    const initTimeout = setTimeout(async () => {
      try {
        const scenes = getHouseScenes(houseId);
        const initial = scenes[0];

        // Получаем правильные углы для начальной сцены
        const initialYaw = typeof initial.yaw === 'number' ? toRad(initial.yaw) : 0;
        const initialPitch = typeof initial.pitch === 'number' ? toRad(initial.pitch) : 0;

        const viewer = new Viewer({
          container: containerRef.current!,
          adapter: CubemapAdapter,
          panorama: initial.panorama,
          caption: initial.title,
          // Устанавливаем правильные углы сразу при инициализации
          defaultYaw: initialYaw,
          defaultPitch: initialPitch,
          navbar: ['zoom', 'caption', 'fullscreen'],
          plugins: [
            [MarkersPlugin, { markers: buildMarkers(initial.links, houseId) }]
          ],
          // Оптимизации для INP
          mousewheelCtrlKey: false, // Убираем необходимость Ctrl для zoom
          keyboardActions: {}, // Убираем клавиатурные события для производительности
        });

        viewerRef.current = viewer;
        pluginsRef.current.markers = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;

        // Handle marker clicks -> navigate to target scene (с defer для INP)
        pluginsRef.current.markers?.addEventListener('select-marker', ({ marker }) => {
          if (marker?.data?.to) {
            // Defer тяжелой операции для улучшения INP
            setTimeout(() => setScene(marker.data.to), 0);
          }
        });

        const applyView = (scene: any) => {
          const yaw = typeof scene.yaw === 'number' ? toRad(scene.yaw) : 0;
          const pitch = typeof scene.pitch === 'number' ? toRad(scene.pitch) : 0;
          viewer.rotate({ yaw, pitch });
          const z = scene.zoom ?? scene.fov;
          if (typeof z === 'number') {
            try {
              (viewer as any).zoom(z);
            } catch {
              // Fallback for different PSV versions
            }
          }
        };

        const setScene = async (key: string) => {
          const scene = findScene(key, houseId);
          if (!scene) return;
          
          try {
            // Yield к браузеру для улучшения INP
            await new Promise(resolve => {
              if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
                (window as any).scheduler.postTask(() => resolve(undefined), { priority: 'user-blocking' });
              } else {
                setTimeout(() => resolve(undefined), 0);
              }
            });
            
            // Получаем целевые параметры
            const targetYaw = typeof scene.yaw === 'number' ? toRad(scene.yaw) : 0;
            const targetPitch = typeof scene.pitch === 'number' ? toRad(scene.pitch) : 0;
            const targetZoom = typeof scene.zoom === 'number' ? scene.zoom : 50;
            
            // Устанавливаем панораму сразу с правильными параметрами (БЕЗ предварительной анимации)
            await viewer.setPanorama(scene.panorama, {
              caption: scene.title,
              position: { yaw: targetYaw, pitch: targetPitch },
              zoom: targetZoom,
              transition: false // Убираем transition для избежания прыжков
            });
            
            // Обновляем маркеры с дополнительным yield
            await new Promise(resolve => setTimeout(resolve, 0));
            const mp = pluginsRef.current.markers;
            if (mp) {
              mp.clearMarkers();
              mp.setMarkers(buildMarkers(scene.links, houseId));
            }
          } catch (error) {
            console.error('Failed to change scene:', error);
          }
        };

        const onReady = () => {
          applyView(initial);
          setIsViewerReady(true);
          try { 
            viewer.removeEventListener('ready', onReady); 
          } catch {}
        };
        
        viewer.addEventListener('ready', onReady);

      } catch (error) {
        console.error('Failed to initialize 360° viewer:', error);
        setIsViewerReady(true); // Показываем контент даже при ошибке
      }
    }, 100); // Минимальная задержка для мгновенного LCP

    return () => {
      clearTimeout(initTimeout);
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
        pluginsRef.current = {};
      }
    };
  }, [houseId]);

  const scenes = getHouseScenes(houseId);
  const initialScene = scenes[0];

  return (
    <div className="relative w-full h-full">
      
      {/* Мгновенный CSS-only LCP placeholder */}
      {!isViewerReady && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-500 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-400 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-orange-800 mb-2">
              {initialScene?.title || '360° Virtual Tour'}
            </h1>
            <p className="text-lg text-orange-600 mb-6">
              Immersive Experience Loading...
            </p>
            
            {/* Простой CSS spinner */}
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
    </div>
  );
}