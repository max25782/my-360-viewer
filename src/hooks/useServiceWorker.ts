'use client';

/**
 * Хук для работы с Service Worker и PWA функциональностью
 */

import { useEffect, useState } from 'react';

interface UseServiceWorkerResult {
  isOffline: boolean;
  isInstallable: boolean;
  install: () => Promise<void>;
  update: () => Promise<void>;
  preloadCategory: (categoryId: string) => void;
  registerAssets: (assets: string[]) => void;
}

export function useServiceWorker(): UseServiceWorkerResult {
  const [isOffline, setIsOffline] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Проверяем поддержку Service Worker
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    // Ждем загрузки страницы для регистрации Service Worker
    const registerSW = async () => {
      try {
        // Включаем Service Worker даже в режиме разработки для тестирования
        // Раскомментируйте код ниже, если хотите отключить SW в режиме разработки
        /*
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          // Удаляем существующие регистрации Service Worker
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
            await registration.unregister();
            console.log('🧹 Service Worker удален в режиме разработки');
          }
          return;
        }
        */
        
        // Проверяем, что мы в безопасном контексте
        if (!window.isSecureContext && window.location.hostname !== 'localhost') {
          console.warn('⚠️ Service Worker требует HTTPS или localhost');
          return;
        }
        
        // Регистрируем Service Worker
        console.log('📝 Регистрация Service Worker...');
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('✅ Service Worker зарегистрирован:', registration.scope);
        
        // Проверяем обновления
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Найдено обновление Service Worker');
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 Новая версия Service Worker доступна');
              }
            });
          }
        });
        
        // Проверяем статус Service Worker
        if (registration.active) {
          console.log('✅ Service Worker активен');
        } else if (registration.installing) {
          console.log('⏳ Service Worker устанавливается');
        } else if (registration.waiting) {
          console.log('⏳ Service Worker ожидает активации');
        }
        
      } catch (error) {
        console.error('❌ Ошибка регистрации Service Worker:', error);
      }
    };
    
    // Регистрируем SW после загрузки страницы
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }

    // Отслеживаем состояние сети
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    // Начальное состояние
    setIsOffline(!navigator.onLine);

    // Слушатели событий сети
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // PWA установка
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('✅ PWA установлено');
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Установка PWA
  const install = async (): Promise<void> => {
    if (!installPrompt) return;
    
    try {
      const result = await installPrompt.prompt();
      console.log('PWA установка:', result);
      
      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Ошибка установки PWA:', error);
    }
  };

  // Обновление Service Worker
  const update = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('🔄 Service Worker обновлен');
        }
      } catch (error) {
        console.error('Ошибка обновления Service Worker:', error);
      }
    }
  };

  // Предзагрузка категории
  const preloadCategory = (categoryId: string): void => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRELOAD_CATEGORY',
        categoryId
      });
    }
  };

  // Регистрация ассетов для кэширования
  const registerAssets = (assets: string[]): void => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller && assets.length > 0) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ASSETS',
        assets
      });
      console.log('🔄 Зарегистрировано для кэширования:', assets.length, 'файлов');
    }
  };

  return {
    isOffline,
    isInstallable,
    install,
    update,
    preloadCategory,
    registerAssets
  };
}