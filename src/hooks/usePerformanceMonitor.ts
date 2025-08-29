import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { incrementRenderCount } from '../store/slices/uiSlice';

interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
}

export function usePerformanceMonitor(componentName: string) {
  const dispatch = useAppDispatch();
  const renderStartTime = useRef<number>(0);
  const renderTimes = useRef<number[]>([]);

  useEffect(() => {
    renderStartTime.current = performance.now();
    dispatch(incrementRenderCount());
    
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      renderTimes.current.push(renderTime);
      
      // Keep only last 10 render times for average calculation
      if (renderTimes.current.length > 10) {
        renderTimes.current = renderTimes.current.slice(-10);
      }
      
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms (avg: ${avgRenderTime.toFixed(2)}ms)`);
      }
    };
  });

  const getMetrics = useCallback((): PerformanceMetrics => {
    const avgRenderTime = renderTimes.current.length > 0 
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length 
      : 0;
    
    return {
      renderCount: renderTimes.current.length,
      averageRenderTime: avgRenderTime,
      lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0
    };
  }, []);

  return { getMetrics };
}

export function useRenderOptimization() {
  const lastRenderTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  
  useEffect(() => {
    renderCount.current += 1;
    lastRenderTime.current = Date.now();
    
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && renderCount.current > 5) {
      console.warn(`Component re-rendered ${renderCount.current} times. Consider optimization.`);
    }
  });

  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current
  };
}
