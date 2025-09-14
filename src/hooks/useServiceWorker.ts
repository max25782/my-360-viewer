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
  resetServiceWorker: () => Promise<void>;
}

export function useServiceWorker(): UseServiceWorkerResult {
  const [isOffline, setIsOffline] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Service Worker работает и в development, и в production
    console.log(`🔧 Service Worker initializing in ${process.env.NODE_ENV} mode`);

    // Проверяем поддержку Service Worker
    if ('serviceWorker' in navigator) {
      // Enhanced Service Worker registration with better error handling
      const registerServiceWorker = async () => {
        try {
          // Check if we're in development mode and service worker is already registered
          const existingRegistration = await navigator.serviceWorker.getRegistration();
          
          if (existingRegistration) {
            console.log('🔄 Service Worker already registered, checking for updates...');
            try {
              await existingRegistration.update();
            } catch (updateError) {
              console.warn('⚠️ Ошибка при обновлении SW, переустанавливаем:', updateError);
              await existingRegistration.unregister();
              // Небольшая задержка перед повторной регистрацией
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }

          const registration = await navigator.serviceWorker.register('/sw-simple.js', {
            scope: '/',
            updateViaCache: 'none' // Always check for updates
          });
          
          console.log('✅ Service Worker зарегистрирован:', registration);
          
          // Enhanced update handling
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🔄 Найдено обновление Service Worker');
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('✨ Новый Service Worker готов к использованию');
                  // Optionally show user notification about update
                }
              });
            }
          });

          // Handle controlling service worker changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker контроллер изменен');
            // Optionally reload the page to use new service worker
          });

        } catch (error) {
          console.error('❌ Ошибка регистрации Service Worker:', error);
          
          // More detailed error logging
          if (error instanceof Error) {
            console.error('Error details:', {
              name: error.name,
              message: error.message,
              stack: error.stack
            });
            
            // Show user-friendly error message
            console.log('💡 To fix PWA issues, visit: /reset-pwa.html');
            
            // Optionally show notification to user
            if (typeof window !== 'undefined' && 'Notification' in window) {
              try {
                new Notification('PWA Service Worker Error', {
                  body: 'PWA features may not work properly. Click to fix.',
                  icon: '/icons/icon-192x192.png',
                  tag: 'sw-error'
                });
              } catch (notifError) {
                // Notification permission not granted or other error
                console.log('Could not show notification:', notifError);
              }
            }
          }
        }
      };

      registerServiceWorker();
    } else {
      console.warn('⚠️ Service Workers не поддерживаются в этом браузере');
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

    // Enhanced PWA installation handling
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎯 PWA installation prompt available');
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
      
      // Optionally show custom install banner
      console.log('💡 App can be installed! Look for the install button in your browser.');
    };

    const handleAppInstalled = () => {
      console.log('✅ PWA установлено успешно');
      setIsInstallable(false);
      setInstallPrompt(null);
      
      // Track installation for analytics if needed
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_installed', {
          event_category: 'PWA',
          event_label: 'App Installation'
        });
      }
    };

    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      if (isStandalone || isIOSStandalone) {
        console.log('✅ PWA уже установлено и запущено в standalone режиме');
        setIsInstallable(false);
      }
    };

    checkIfInstalled();

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

  // Функция для полного сброса Service Worker
  const resetServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        console.log('🔄 Сбрасываем Service Worker...');
        
        // Получаем все регистрации
        const registrations = await navigator.serviceWorker.getRegistrations();
        
        // Отменяем все регистрации
        for (const registration of registrations) {
          await registration.unregister();
          console.log('🗑️ Service Worker отменен:', registration.scope);
        }
        
        // Очищаем все кэши
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log('🗑️ Кэш очищен:', cacheName);
        }
        
        console.log('✅ Service Worker полностью сброшен');
        
        // Перезагружаем страницу для чистого старта
        window.location.reload();
      } catch (error) {
        console.error('❌ Ошибка при сбросе Service Worker:', error);
      }
    }
  };

  return {
    isOffline,
    isInstallable,
    install,
    update,
    preloadCategory,
    registerAssets,
    resetServiceWorker
  };
}