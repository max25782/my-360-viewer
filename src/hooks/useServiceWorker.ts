import { useEffect, useState, useCallback } from 'react';

interface ServiceWorkerStatus {
  isRegistered: boolean;
  isReady: boolean;
  isOffline: boolean;
  controller: ServiceWorker | null;
}

export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isRegistered: false,
    isReady: false,
    isOffline: !navigator.onLine,
    controller: null,
  });

  // Предзагрузка комнат через Service Worker
  const preloadRooms = useCallback(async (houseId: string, rooms: string[], format: 'jpg' | 'webp' = 'webp') => {
    if (!status.controller) return;

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        if (event.data.type === 'PRELOAD_COMPLETE') {
          console.log(`[SW] Предзагрузка завершена для комнат:`, event.data.rooms);
          resolve(event.data);
        }
      };

      status.controller.postMessage({
        type: 'PRELOAD_ROOMS',
        houseId,
        rooms,
        format
      }, [channel.port2]);
    });
  }, [status.controller]);

  // Очистка старого кэша
  const clearCache = useCallback(async () => {
    if (!status.controller) return;

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      
      channel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          console.log('[SW] Кэш очищен');
          resolve(event.data);
        }
      };

      status.controller.postMessage({
        type: 'CLEAR_OLD_CACHE'
      }, [channel.port2]);
    });
  }, [status.controller]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Регистрация Service Worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        setStatus(prev => ({ ...prev, isRegistered: true }));

        // Проверка готовности
        if (navigator.serviceWorker.controller) {
          setStatus(prev => ({ 
            ...prev, 
            isReady: true,
            controller: navigator.serviceWorker.controller 
          }));
        }

        // Обновление при изменении
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                console.log('[SW] Новая версия активирована');
                window.location.reload();
              }
            });
          }
        });
      } catch (error) {
        console.error('[SW] Ошибка регистрации:', error);
      }
    };

    registerSW();

    // Слушаем изменения контроллера
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setStatus(prev => ({
        ...prev,
        controller: navigator.serviceWorker.controller
      }));
    });

    // Слушаем состояние сети
    const handleOnline = () => setStatus(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    ...status,
    preloadRooms,
    clearCache,
  };
}
