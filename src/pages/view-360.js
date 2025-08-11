import { useEffect, useRef } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { CubemapAdapter } from '@photo-sphere-viewer/cubemap-adapter';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { SCENES } from '../data/tour-scenes';

// Import CSS styles
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

export default function PanoramaViewer() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const pluginsRef = useRef({});

  // Helper: find scene by key
  const getScene = (key) => SCENES.find((s) => s.key === key);

  // Helper: degrees -> radians if needed
  const toRad = (val) => (Math.abs(val) > Math.PI * 2 ? (val * Math.PI) / 180 : val);
  const toRadRange = (range) => Array.isArray(range) ? range.map((v) => toRad(v)) : undefined;

  // Helper: build markers for scene links
  const buildMarkers = (links = []) =>
    links.map((l, idx) => ({
      id: `link-${l.to}-${idx}`,
      position: { yaw: toRad(l.yaw || 0), pitch: toRad(l.pitch || 0) },
      tooltip: getScene(l.to)?.title || l.to,
      // simple dot marker; can be replaced with custom image/svg
      html: '<div style="width:18px;height:18px;border-radius:50%;background:#00bcd4;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div>',
      anchor: 'center',
      className: 'psv-link-marker',
      data: { to: l.to },
    }));

  useEffect(() => {
    const initial = SCENES[0];
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
        [MarkersPlugin, { markers: buildMarkers(initial.links) }]
      ],
    });

    viewerRef.current = viewer;
    pluginsRef.current.markers = viewer.getPlugin(MarkersPlugin);

    // Handle marker clicks -> navigate to target scene
    pluginsRef.current.markers.addEventListener('select-marker', ({ marker }) => {
      if (marker?.data?.to) setScene(marker.data.to);
    });

    const applyView = (scene) => {
      // Orient camera to desired entry view and zoom
      const yaw = typeof scene.yaw === 'number' ? toRad(scene.yaw) : 0;
      const pitch = typeof scene.pitch === 'number' ? toRad(scene.pitch) : 0;
      viewer.rotate({ yaw, pitch });
      const z = scene.zoom ?? scene.fov; // support either name
      if (typeof z === 'number') {
        if (typeof viewer.setZoom === 'function') viewer.setZoom(z);
        else if (typeof viewer.zoom === 'function') viewer.zoom(z);
      }

      // Apply horizontal rotation limit (yawRange) centered on yaw if provided
      if (typeof scene.yawLimit === 'number') {
        const half = toRad(scene.yawLimit / 2);
        viewer.setOptions({ yawRange: [yaw - half, yaw + half] });
      } else {
        // reset to full range
        viewer.setOptions({ yawRange: [-Math.PI, Math.PI] });
      }

      // Optional vertical rotation limit (pitchRange) in degrees
      if (Array.isArray(scene.pitchRange)) {
        const pr = toRadRange(scene.pitchRange);
        viewer.setOptions({ pitchRange: pr });
      } else {
        viewer.setOptions({ pitchRange: [-Math.PI / 2, Math.PI / 2] });
      }
    };

    const setScene = async (key) => {
      const scene = getScene(key);
      if (!scene) return;
      await viewer.setPanorama(scene.panorama, { caption: scene.title });
      applyView(scene);
      // rebuild markers for new scene
      const mp = pluginsRef.current.markers;
      mp.clearMarkers();
      mp.setMarkers(buildMarkers(scene.links));
    };

    // Apply initial orientation and fov after viewer is ready
    const onReady = () => {
      applyView(initial);
      try { viewer.removeEventListener('ready', onReady); } catch {}
    };
    viewer.addEventListener('ready', onReady);

    return () => {
      viewer?.destroy();
      viewerRef.current = null;
      pluginsRef.current = {};
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100vh', background: '#000' }}
    />
  );
}


