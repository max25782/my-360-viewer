'use client';

import { useServiceWorker } from '../hooks/useServiceWorker';
import { useState, useEffect } from 'react';

interface PWAStatusProps {
  showDetails?: boolean;
  className?: string;
}

export default function PWAStatus({ showDetails = false, className = '' }: PWAStatusProps) {
  const { isOffline, isInstallable, install } = useServiceWorker();
  const [isStandalone, setIsStandalone] = useState(false);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'loading' | 'active' | 'error'>('loading');

  useEffect(() => {
    // Check if running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const iosStandalone = (window.navigator as any).standalone === true;
      setIsStandalone(standalone || iosStandalone);
    };

    // Check service worker status
    const checkServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration && registration.active) {
            setServiceWorkerStatus('active');
          } else {
            setServiceWorkerStatus('error');
          }
        } catch (error) {
          setServiceWorkerStatus('error');
        }
      } else {
        setServiceWorkerStatus('error');
      }
    };

    checkStandalone();
    checkServiceWorker();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => checkStandalone();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  if (!showDetails && isStandalone && serviceWorkerStatus === 'active') {
    // PWA is working perfectly, don't show anything
    return null;
  }

  return (
    <div className={`pwa-status ${className}`}>
      {/* PWA Installation Banner */}
      {isInstallable && !isStandalone && (
        <div className="bg-blue-600 text-white p-3 rounded-lg mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl mr-2">📱</span>
            <div>
              <div className="font-semibold">Install App</div>
              <div className="text-sm opacity-90">Get the full PWA experience!</div>
            </div>
          </div>
          <button
            onClick={install}
            className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors"
          >
            Install
          </button>
        </div>
      )}

      {/* Offline Indicator */}
      {isOffline && (
        <div className="bg-yellow-600 text-white p-3 rounded-lg mb-4 flex items-center">
          <span className="text-xl mr-2">📶</span>
          <div>
            <div className="font-semibold">You're Offline</div>
            <div className="text-sm opacity-90">Some features may be limited</div>
          </div>
        </div>
      )}

      {/* Service Worker Status (only show if there's an issue) */}
      {serviceWorkerStatus === 'error' && (
        <div className="bg-red-600 text-white p-3 rounded-lg mb-4 flex items-center">
          <span className="text-xl mr-2">⚠️</span>
          <div>
            <div className="font-semibold">Service Worker Issue</div>
            <div className="text-sm opacity-90">PWA features may not work properly</div>
          </div>
        </div>
      )}

      {/* Detailed Status (for debugging) */}
      {showDetails && (
        <div className="bg-gray-800 text-white p-4 rounded-lg text-sm font-mono">
          <div className="font-bold mb-2">PWA Status Debug:</div>
          <div className="space-y-1">
            <div>🔧 Service Worker: <span className={serviceWorkerStatus === 'active' ? 'text-green-400' : 'text-red-400'}>{serviceWorkerStatus}</span></div>
            <div>📱 Standalone Mode: <span className={isStandalone ? 'text-green-400' : 'text-yellow-400'}>{isStandalone ? 'Yes' : 'No'}</span></div>
            <div>📶 Network: <span className={!isOffline ? 'text-green-400' : 'text-red-400'}>{isOffline ? 'Offline' : 'Online'}</span></div>
            <div>💾 Installable: <span className={isInstallable ? 'text-green-400' : 'text-gray-400'}>{isInstallable ? 'Yes' : 'No'}</span></div>
            <div>🌐 Browser: <span className="text-blue-400">{navigator.userAgent.split(' ').pop()}</span></div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-600">
            <div className="text-xs opacity-75">
              💡 Tips: Open DevTools → Application → Service Workers to see more details
            </div>
          </div>
        </div>
      )}
    </div>
  );
}