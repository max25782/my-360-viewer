'use client';

import { useEffect, useState } from 'react';

interface PWAStatus {
  serviceWorkerSupported: boolean;
  serviceWorkerRegistered: boolean;
  serviceWorkerActive: boolean;
  isSecureContext: boolean;
  isStandalone: boolean;
  manifestLoaded: boolean;
  errors: string[];
}

export default function PWADebugger() {
  const [status, setStatus] = useState<PWAStatus>({
    serviceWorkerSupported: false,
    serviceWorkerRegistered: false,
    serviceWorkerActive: false,
    isSecureContext: false,
    isStandalone: false,
    manifestLoaded: false,
    errors: []
  });
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const checkPWAStatus = async () => {
      const newStatus: PWAStatus = {
        serviceWorkerSupported: 'serviceWorker' in navigator,
        serviceWorkerRegistered: false,
        serviceWorkerActive: false,
        isSecureContext: window.isSecureContext,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        manifestLoaded: false,
        errors: []
      };

      // Check service worker
      if (newStatus.serviceWorkerSupported) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          newStatus.serviceWorkerRegistered = registrations.length > 0;
          
          if (registrations.length > 0) {
            newStatus.serviceWorkerActive = registrations.some(reg => reg.active !== null);
          }
        } catch (error) {
          newStatus.errors.push(`Service Worker check failed: ${error}`);
        }
      } else {
        newStatus.errors.push('Service Worker not supported in this browser');
      }

      // Check manifest
      try {
        const manifestResponse = await fetch('/manifest.json');
        newStatus.manifestLoaded = manifestResponse.ok;
        if (!manifestResponse.ok) {
          newStatus.errors.push(`Manifest load failed: HTTP ${manifestResponse.status}`);
        }
      } catch (error) {
        newStatus.errors.push(`Manifest fetch failed: ${error}`);
      }

      // Check secure context
      if (!newStatus.isSecureContext) {
        newStatus.errors.push('Not in secure context (HTTPS required for PWA)');
      }

      setStatus(newStatus);
    };

    checkPWAStatus();

    // Listen for service worker changes
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', checkPWAStatus);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', checkPWAStatus);
      }
    };
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setShowDebugger(!showDebugger)}
        className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        title="Toggle PWA Debugger"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Debug Panel */}
      {showDebugger && (
        <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">PWA Debug Status</h3>
          
          <div className="space-y-2">
            <StatusItem
              label="Service Worker Support"
              value={status.serviceWorkerSupported}
              type="boolean"
            />
            <StatusItem
              label="Service Worker Registered"
              value={status.serviceWorkerRegistered}
              type="boolean"
            />
            <StatusItem
              label="Service Worker Active"
              value={status.serviceWorkerActive}
              type="boolean"
            />
            <StatusItem
              label="Secure Context (HTTPS)"
              value={status.isSecureContext}
              type="boolean"
            />
            <StatusItem
              label="Manifest Loaded"
              value={status.manifestLoaded}
              type="boolean"
            />
            <StatusItem
              label="Standalone Mode"
              value={status.isStandalone}
              type="boolean"
            />
          </div>

          {status.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-red-600">Errors:</h4>
              <ul className="text-sm text-red-600 mt-1">
                {status.errors.map((error, index) => (
                  <li key={index} className="mt-1">• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <button
              onClick={async () => {
                try {
                  const reg = await navigator.serviceWorker.register('/sw.js');
                  console.log('Service Worker registered:', reg);
                  window.location.reload();
                } catch (error) {
                  console.error('Registration failed:', error);
                }
              }}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-sm"
            >
              Register Service Worker
            </button>
            
            <button
              onClick={async () => {
                try {
                  const registrations = await navigator.serviceWorker.getRegistrations();
                  for (const registration of registrations) {
                    await registration.unregister();
                  }
                  console.log('Service Workers unregistered');
                  window.location.reload();
                } catch (error) {
                  console.error('Unregister failed:', error);
                }
              }}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors text-sm"
            >
              Unregister All Service Workers
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function StatusItem({ label, value, type }: { label: string; value: any; type: 'boolean' | 'string' }) {
  const isBoolean = type === 'boolean';
  const boolValue = Boolean(value);
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}:</span>
      {isBoolean ? (
        <span className={`text-sm font-semibold ${boolValue ? 'text-green-600' : 'text-red-600'}`}>
          {boolValue ? '✓' : '✗'}
        </span>
      ) : (
        <span className="text-sm font-mono">{String(value)}</span>
      )}
    </div>
  );
}