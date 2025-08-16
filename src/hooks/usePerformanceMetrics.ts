import { useEffect, useCallback, useRef } from 'react';

interface WebVitalsMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  fcp?: number;
  inp?: number;
}

interface PanoramaMetrics {
  loadTime?: number;
  tileLoadTimes: Record<string, number>;
  sceneChangeTimes: number[];
  preloadedRooms: string[];
}

export const usePerformanceMetrics = () => {
  const webVitalsRef = useRef<WebVitalsMetrics>({});
  const panoramaRef = useRef<PanoramaMetrics>({
    tileLoadTimes: {},
    sceneChangeTimes: [],
    preloadedRooms: []
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    const observers: PerformanceObserver[] = [];

    // LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        webVitalsRef.current.lcp = lastEntry.startTime;
        console.log('🎯 LCP:', lastEntry.startTime.toFixed(2) + 'ms', 
          lastEntry.startTime < 2500 ? '✅ Good' : lastEntry.startTime < 4000 ? '⚠️ Needs improvement' : '❌ Poor');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observers.push(lcpObserver);
    } catch (e) {}

    // FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          webVitalsRef.current.fid = fid;
          console.log('🖱️ FID:', fid.toFixed(2) + 'ms',
            fid < 100 ? '✅ Good' : fid < 300 ? '⚠️ Needs improvement' : '❌ Poor');
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observers.push(fidObserver);
    } catch (e) {}

    // CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            webVitalsRef.current.cls = clsValue;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observers.push(clsObserver);
    } catch (e) {}

    // FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            webVitalsRef.current.fcp = entry.startTime;
            console.log('🎨 FCP:', entry.startTime.toFixed(2) + 'ms',
              entry.startTime < 1800 ? '✅ Good' : entry.startTime < 3000 ? '⚠️ Needs improvement' : '❌ Poor');
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      observers.push(fcpObserver);
    } catch (e) {}

    // INP (Interaction to Next Paint)
    try {
      let worstINP = 0;
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'event' && (entry as any).interactionId) {
            const inp = entry.duration;
            if (inp > worstINP) {
              worstINP = inp;
              webVitalsRef.current.inp = inp;
              console.log('⚡ INP:', inp.toFixed(2) + 'ms',
                inp < 200 ? '✅ Good' : inp < 500 ? '⚠️ Needs improvement' : '❌ Poor');
            }
          }
        }
      });
      inpObserver.observe({ entryTypes: ['event'] });
      observers.push(inpObserver);
    } catch (e) {}

    // Resource timing для 360° изображений
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource' && entry.name.includes('/360/')) {
            const resourceTiming = entry as PerformanceResourceTiming;
            const loadTime = resourceTiming.responseEnd - resourceTiming.startTime;
            
            // Извлекаем информацию о tile
            const match = entry.name.match(/\/([^/]+)\/([fblrud])\.(jpg|webp)$/);
            if (match) {
              const [, room, tile, format] = match;
              const key = `${room}-${tile}-${format}`;
              panoramaRef.current.tileLoadTimes[key] = loadTime;
              console.log(`📸 360° ${room}/${tile}.${format}:`, loadTime.toFixed(2) + 'ms');
            }
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      observers.push(resourceObserver);
    } catch (e) {}

    // TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      webVitalsRef.current.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      console.log('📡 TTFB:', webVitalsRef.current.ttfb.toFixed(2) + 'ms',
        webVitalsRef.current.ttfb < 800 ? '✅ Good' : webVitalsRef.current.ttfb < 1800 ? '⚠️ Needs improvement' : '❌ Poor');
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const measure360Scene = useCallback((sceneName: string) => {
    const startTime = performance.now();
    let tilesLoaded = 0;
    const expectedTiles = 6; // f, b, l, r, u, d

    return {
      markTileLoaded: (tileName: string) => {
        tilesLoaded++;
        const loadTime = performance.now() - startTime;
        console.log(`📸 Tile ${tileName} loaded: ${loadTime.toFixed(2)}ms (${tilesLoaded}/${expectedTiles})`);
        
        if (tilesLoaded === expectedTiles) {
          console.log(`✅ All tiles loaded for ${sceneName} in ${loadTime.toFixed(2)}ms`);
        }
      },
      
      markSceneReady: () => {
        const totalTime = performance.now() - startTime;
        panoramaRef.current.sceneChangeTimes.push(totalTime);
        console.log(`🏁 Scene ${sceneName} ready in ${totalTime.toFixed(2)}ms`);
        
        // Вычисляем среднее время загрузки сцен
        const avgTime = panoramaRef.current.sceneChangeTimes.reduce((a, b) => a + b, 0) / 
                       panoramaRef.current.sceneChangeTimes.length;
        console.log(`📊 Average scene load time: ${avgTime.toFixed(2)}ms`);
      }
    };
  }, []);

  const markRoomPreloaded = useCallback((roomName: string) => {
    if (!panoramaRef.current.preloadedRooms.includes(roomName)) {
      panoramaRef.current.preloadedRooms.push(roomName);
      console.log(`📥 Room ${roomName} preloaded. Total preloaded: ${panoramaRef.current.preloadedRooms.length}`);
    }
  }, []);

  const getMetricsSummary = useCallback(() => {
    const vitals = webVitalsRef.current;
    const panorama = panoramaRef.current;
    
    return {
      webVitals: {
        lcp: vitals.lcp,
        fid: vitals.fid,
        cls: vitals.cls,
        ttfb: vitals.ttfb,
        fcp: vitals.fcp,
        inp: vitals.inp
      },
      panorama: {
        averageSceneLoadTime: panorama.sceneChangeTimes.length > 0 
          ? panorama.sceneChangeTimes.reduce((a, b) => a + b, 0) / panorama.sceneChangeTimes.length
          : 0,
        scenesLoaded: panorama.sceneChangeTimes.length,
        roomsPreloaded: panorama.preloadedRooms.length,
        tileLoadCount: Object.keys(panorama.tileLoadTimes).length
      }
    };
  }, []);

  const logPerformanceReport = useCallback(() => {
    const summary = getMetricsSummary();
    
    console.log('\n📊 === PERFORMANCE REPORT ===');
    console.log('\n🌐 Web Vitals:');
    console.log(`  LCP: ${summary.webVitals.lcp?.toFixed(2)}ms ${summary.webVitals.lcp && summary.webVitals.lcp < 2500 ? '✅' : '⚠️'}`);
    console.log(`  FID: ${summary.webVitals.fid?.toFixed(2)}ms ${summary.webVitals.fid && summary.webVitals.fid < 100 ? '✅' : '⚠️'}`);
    console.log(`  CLS: ${summary.webVitals.cls?.toFixed(4)} ${summary.webVitals.cls && summary.webVitals.cls < 0.1 ? '✅' : '⚠️'}`);
    console.log(`  INP: ${summary.webVitals.inp?.toFixed(2)}ms ${summary.webVitals.inp && summary.webVitals.inp < 200 ? '✅' : '⚠️'}`);
    console.log(`  TTFB: ${summary.webVitals.ttfb?.toFixed(2)}ms ${summary.webVitals.ttfb && summary.webVitals.ttfb < 800 ? '✅' : '⚠️'}`);
    console.log(`  FCP: ${summary.webVitals.fcp?.toFixed(2)}ms ${summary.webVitals.fcp && summary.webVitals.fcp < 1800 ? '✅' : '⚠️'}`);
    
    console.log('\n🏠 360° Performance:');
    console.log(`  Average scene load: ${summary.panorama.averageSceneLoadTime.toFixed(2)}ms`);
    console.log(`  Scenes loaded: ${summary.panorama.scenesLoaded}`);
    console.log(`  Rooms preloaded: ${summary.panorama.roomsPreloaded}`);
    console.log(`  Tiles loaded: ${summary.panorama.tileLoadCount}`);
    
    console.log('\n🎯 Score:');
    const score = calculatePerformanceScore(summary);
    console.log(`  Overall: ${score}/100 ${score >= 90 ? '🏆 Excellent!' : score >= 75 ? '✅ Good' : score >= 50 ? '⚠️ Needs work' : '❌ Poor'}`);
    console.log('========================\n');
  }, [getMetricsSummary]);

  const calculatePerformanceScore = (summary: ReturnType<typeof getMetricsSummary>) => {
    let score = 100;
    
    // Web Vitals scoring
    if (summary.webVitals.lcp) {
      if (summary.webVitals.lcp > 2500) score -= 10;
      if (summary.webVitals.lcp > 4000) score -= 10;
    }
    
    if (summary.webVitals.fid) {
      if (summary.webVitals.fid > 100) score -= 10;
      if (summary.webVitals.fid > 300) score -= 10;
    }
    
    if (summary.webVitals.cls) {
      if (summary.webVitals.cls > 0.1) score -= 10;
      if (summary.webVitals.cls > 0.25) score -= 10;
    }
    
    // 360° performance scoring
    if (summary.panorama.averageSceneLoadTime > 2000) score -= 10;
    if (summary.panorama.averageSceneLoadTime > 4000) score -= 10;
    
    return Math.max(0, score);
  };

  return {
    measure360Scene,
    markRoomPreloaded,
    getMetricsSummary,
    logPerformanceReport
  };
};
