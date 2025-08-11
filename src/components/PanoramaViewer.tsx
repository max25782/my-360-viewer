'use client';

import { useEffect, useRef } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { CubemapAdapter } from '@photo-sphere-viewer/cubemap-adapter';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

// Import CSS styles
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

interface PanoramaViewerProps {
  houseId: string;
}

import { getHouseTour, getScene } from '../data/tour-scenes';

export default function PanoramaViewer({ houseId }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const pluginsRef = useRef<{ markers?: MarkersPlugin }>({});

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

  // Helper: build markers for scene links
  const buildMarkers = (links: any[] = [], house: string) =>
    links.map((l, idx) => ({
      id: `link-${l.to}-${idx}`,
      position: { yaw: toRad(l.yaw || 0), pitch: toRad(l.pitch || 0) },
      tooltip: findScene(l.to, house)?.title || l.to,
      html: '<div style="width:18px;height:18px;border-radius:50%;background:#00bcd4;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div>',
      anchor: 'center' as const,
      className: 'psv-link-marker',
      data: { to: l.to },
    }));

  useEffect(() => {
    if (!containerRef.current) return;

    const scenes = getHouseScenes(houseId);
    const initial = scenes[0];

    const viewer = new Viewer({
      container: containerRef.current,
      adapter: CubemapAdapter,
      panorama: initial.panorama,
      caption: initial.title,
      navbar: [
        'zoom',
        'caption',
        'fullscreen'
      ],
      plugins: [
        [MarkersPlugin, { markers: buildMarkers(initial.links, houseId) }]
      ],
    });

    viewerRef.current = viewer;
    pluginsRef.current.markers = viewer.getPlugin(MarkersPlugin) as MarkersPlugin;

    // Handle marker clicks -> navigate to target scene
    pluginsRef.current.markers?.addEventListener('select-marker', ({ marker }) => {
      if (marker?.data?.to) setScene(marker.data.to);
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

      // Note: yawRange and pitchRange may not be available in all PSV versions
      try {
        if (typeof scene.yawLimit === 'number') {
          const half = toRad(scene.yawLimit / 2);
          (viewer as any).setOptions({ yawRange: [yaw - half, yaw + half] });
        }

        if (Array.isArray(scene.pitchRange)) {
          const pr = scene.pitchRange.map((v: number) => toRad(v));
          (viewer as any).setOptions({ pitchRange: pr });
        }
      } catch {
        // Options not supported in this PSV version
      }
    };

    const setScene = async (key: string) => {
      const scene = findScene(key, houseId);
      if (!scene) return;
      
      await viewer.setPanorama(scene.panorama, { caption: scene.title });
      applyView(scene);
      const mp = pluginsRef.current.markers;
      if (mp) {
        mp.clearMarkers();
        mp.setMarkers(buildMarkers(scene.links, houseId));
      }
    };

    const onReady = () => {
      applyView(initial);
      try { 
        viewer.removeEventListener('ready', onReady); 
      } catch {}
    };
    
    viewer.addEventListener('ready', onReady);

    return () => {
      viewer?.destroy();
      viewerRef.current = null;
      pluginsRef.current = {};
    };
  }, [houseId]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: '#000' }}
    />
  );
}
