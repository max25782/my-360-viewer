'use client';

import { useEffect, useRef, useCallback } from 'react';
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
  selectActiveScene,
  selectHouseScenes,
} from '../store/selectors/panoramaSelectors';

// Data imports
import { getScene, getRoomIcon } from '../data/tour-scenes';

interface PanoramaViewerProps {
  houseId: string;
}

export default function PanoramaViewerRedux({ houseId }: PanoramaViewerProps) {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const markersPluginRef = useRef<MarkersPlugin | null>(null);
  
  // Redux selectors
  const currentHouseId = useAppSelector(selectCurrentHouseId);
  const isViewerReady = useAppSelector(selectIsViewerReady);
  const isLoading = useAppSelector(selectIsLoading);
  const activeScene = useAppSelector(selectActiveScene);
  const houseScenes = useAppSelector(selectHouseScenes);

  // Helper: degrees -> radians if needed
  const toRad = useCallback((val: number) => (Math.abs(val) > Math.PI * 2 ? (val * Math.PI) / 180 : val), []);

  // Helper: build markers for scene links with room icons
  const buildMarkers = useCallback((links: any[] = [], house: string) =>
    links.map((l, idx) => {
      const targetScene = getScene(l.to, house);
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
    }), [toRad]);

  // Scene change handler with Redux optimization
  const changeScene = useCallback(async (sceneKey: string, viewerInstance?: Viewer, markersInstance?: MarkersPlugin) => {
    // Use provided instances or fallback to refs
    const currentViewer = viewerInstance || viewerRef.current;
    const currentMarkers = markersInstance || markersPluginRef.current;
    
    if (!currentViewer || !currentMarkers) {
      console.warn('Viewer or markers plugin not available for scene change');
      return;
    }
    
    dispatch(setLoading(true));
    
    try {
      const scene = getScene(sceneKey, houseId);
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
      const targetZoom = typeof scene.zoom === 'number' ? scene.zoom : 50;
      
      // Set panorama with correct parameters
      await currentViewer.setPanorama(scene.panorama, {
        caption: scene.title,
        position: { yaw: targetYaw, pitch: targetPitch },
        zoom: targetZoom,
        transition: false // Remove transition to avoid jumps
      });
      
      // Update Redux state
      dispatch(updatePosition({ yaw: targetYaw, pitch: targetPitch, zoom: targetZoom }));
      dispatch(setScene(sceneKey));
      
      // Update markers with additional yield
      await new Promise(resolve => setTimeout(resolve, 0));
      currentMarkers.clearMarkers();
      currentMarkers.setMarkers(buildMarkers(scene.links, houseId));
      
      dispatch(setLoading(false));
    } catch (error) {
      console.error('Failed to change scene:', error);
      dispatch(setError(`Failed to change scene: ${error}`));
    }
  }, [houseId, dispatch, toRad, buildMarkers]);

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

  // Initialize viewer
  useEffect(() => {
    if (!containerRef.current || !activeScene || currentHouseId !== houseId || viewerRef.current) return;

    dispatch(setLoading(true));

    // Delay initialization for instant LCP [[memory:5988045]]
    const initTimeout = setTimeout(async () => {
      try {
        // Get correct angles for initial scene
        const initialYaw = typeof activeScene.yaw === 'number' ? toRad(activeScene.yaw) : 0;
        const initialPitch = typeof activeScene.pitch === 'number' ? toRad(activeScene.pitch) : 0;

        const newViewer = new Viewer({
          container: containerRef.current!,
          adapter: CubemapAdapter,
          panorama: activeScene.panorama,
          caption: activeScene.title,
          // Set correct angles immediately during initialization
          defaultYaw: initialYaw,
          defaultPitch: initialPitch,
          navbar: ['zoom', 'caption', 'fullscreen'],
          plugins: [
            [MarkersPlugin, { markers: buildMarkers(activeScene.links, houseId) }]
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
          const yaw = typeof activeScene.yaw === 'number' ? toRad(activeScene.yaw) : 0;
          const pitch = typeof activeScene.pitch === 'number' ? toRad(activeScene.pitch) : 0;
          newViewer.rotate({ yaw, pitch });
          
          const z = activeScene.zoom ?? activeScene.fov;
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
  }, [activeScene, houseId, currentHouseId, dispatch, toRad, buildMarkers, changeScene]);

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

  return (
    <div className="relative w-full h-full">
      
      {/* Instant CSS-only LCP placeholder [[memory:5988045]] */}
      {!isViewerReady && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-500 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-400 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-orange-800 mb-2">
              {activeScene?.title || '360° Virtual Tour'}
            </h1>
            <p className="text-lg text-orange-600 mb-6">
              {isLoading ? 'Loading immersive experience...' : 'Initializing viewer...'}
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
    </div>
  );
}
