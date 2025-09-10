/**
 * Простой Service Worker для исправления PWA проблем
 */

const CACHE_NAME = 'house-viewer-simple-v2';

// Файлы для кэширования (только критически важные)
const STATIC_CACHE_URLS = [
  '/',
  '/login',
  '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static files');
        // Кэшируем файлы по одному, чтобы один неудачный файл не сломал весь процесс
        return Promise.allSettled(
          STATIC_CACHE_URLS.map(url => 
            cache.add(url).catch(err => {
              console.warn(`⚠️ Service Worker: Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Activation failed', error);
      })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем не-GET запросы
  if (event.request.method !== 'GET') {
    return;
  }

  // Пропускаем chrome-extension и другие специальные протоколы
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Пропускаем проблемные иконки
  if (event.request.url.includes('/icons/icon-') && event.request.url.includes('.png')) {
    console.log('⚠️ Service Worker: Skipping problematic icon', event.request.url);
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Если есть в кэше, возвращаем кэшированную версию
        if (cachedResponse) {
          console.log('📦 Service Worker: Serving from cache', event.request.url);
          return cachedResponse;
        }

        // Иначе загружаем из сети
        console.log('🌐 Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Проверяем, что ответ валидный
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Кэшируем только GET запросы к нашему домену
            if (event.request.url.startsWith(self.location.origin)) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('❌ Service Worker: Fetch failed', error);
            
            // Для навигационных запросов возвращаем fallback
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            throw error;
          });
      })
  );
});

// Обработка сообщений от основного потока
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker: Received message', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ Service Worker: Script loaded');
