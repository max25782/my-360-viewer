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
    if ('serviceWorker' in navigator) {
      // Регистрируем Service Worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker зарегистрирован:', registration);
          
          // Проверяем обновления
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Найдено обновление Service Worker');
          });
        })
        .catch((error) => {
          console.error('❌ Ошибка регистрации Service Worker:', error);
        });
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