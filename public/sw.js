/**
 * Service Worker для PWA с офлайн кэшированием
 * CacheFirst для панорам, StaleWhileRevalidate для данных
 */

const CACHE_NAME = 'house-viewer-v1';
const DATA_CACHE = 'house-data-v1';
const PANORAMA_CACHE = 'panorama-cache-v1';

// Файлы для кэширования при установке
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json'
];

// Паттерны для разных стратегий кэширования
const CACHE_PATTERNS = {
  // Данные: StaleWhileRevalidate
  data: /\/data\/.*\.json$/,
  // Панорамы: CacheFirst
  panoramas: /\/assets\/.*\/(360|panos)\/.*\.(jpg|jpeg|webp|png)$/i,
  // Статичные ресурсы: CacheFirst
  static: /\.(js|css|png|jpg|jpeg|webp|svg|woff|woff2)$/,
  // HTML страницы: NetworkFirst
  pages: /\/.*$/
};

// Стратегии кэширования
const CACHE_STRATEGIES = {
  cacheFirst: 'cache-first',
  networkFirst: 'network-first', 
  staleWhileRevalidate: 'stale-while-revalidate'
};

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Установка...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Кэшируем каждый URL отдельно с обработкой ошибок
        for (const url of STATIC_CACHE_URLS) {
          try {
            await cache.add(url);
            console.log(`✅ Закэширован: ${url}`);
          } catch (err) {
            console.warn(`⚠️ Не удалось закэшировать ${url}:`, err);
          }
        }
        
        console.log('✅ Service Worker: Установка завершена');
        
        // Принудительно активируем новый Service Worker
        await self.skipWaiting();
      } catch (error) {
        console.error('❌ Service Worker: Ошибка установки:', error);
      }
    })()
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Активация...');
  
  event.waitUntil(
    (async () => {
      try {
        // Очищаем старые кэши
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames
          .filter(name => name !== CACHE_NAME && name !== DATA_CACHE && name !== PANORAMA_CACHE)
          .map(name => caches.delete(name));
        
        await Promise.all(deletePromises);
        console.log('🧹 Service Worker: Старые кэши очищены');
        
        // Берем контроль над всеми клиентами
        await self.clients.claim();
      } catch (error) {
        console.error('❌ Service Worker: Ошибка активации:', error);
      }
    })()
  );
});

// Стратегия Cache First (для панорам и статики)
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Не кэшируем HEAD запросы и частичные ответы (status 206)
    if (networkResponse.ok && request.method !== 'HEAD' && networkResponse.status !== 206) {
      try {
        const cache = await caches.open(cacheName);
        await cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn(`⚠️ Failed to cache response for ${request.url}:`, cacheError);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.warn(`⚠️ Cache First failed for ${request.url}:`, error);
    // Возвращаем offline fallback если есть
    return new Response('Offline - content not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Стратегия Network First (для HTML страниц)
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Не кэшируем HEAD запросы и частичные ответы (status 206)
    if (networkResponse.ok && request.method !== 'HEAD' && networkResponse.status !== 206) {
      try {
        const cache = await caches.open(cacheName);
        await cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn(`⚠️ Failed to cache response for ${request.url}:`, cacheError);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.warn(`⚠️ Network failed for ${request.url}, trying cache:`, error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback для HTML страниц
    if (request.headers.get('accept')?.includes('text/html')) {
      const cache = await caches.open(CACHE_NAME);
      const fallback = await cache.match('/');
      if (fallback) return fallback;
    }
    
    throw error;
  }
}

// Стратегия Stale While Revalidate (для данных)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Запускаем обновление в фоне
  const fetchPromise = fetch(request).then(networkResponse => {
    // Не кэшируем HEAD запросы и частичные ответы (status 206)
    if (networkResponse.ok && request.method !== 'HEAD' && networkResponse.status !== 206) {
      try {
        cache.put(request, networkResponse.clone());
      } catch (cacheError) {
        console.warn(`⚠️ Failed to cache response for ${request.url}:`, cacheError);
      }
    }
    return networkResponse;
  }).catch(error => {
    console.warn(`⚠️ Background fetch failed for ${request.url}:`, error);
    return cachedResponse;
  });
  
  // Возвращаем кэшированную версию сразу или ждем сеть
  return cachedResponse || fetchPromise;
}

// Основной обработчик запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Пропускаем chrome-extension и другие схемы
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Пропускаем запросы к API - пусть идут напрямую
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // Пропускаем главную страницу в режиме разработки
  if (url.hostname.includes('localhost') && (url.pathname === '/' || url.pathname === '/index.html')) {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        // Определяем стратегию кэширования
        if (CACHE_PATTERNS.data.test(url.pathname)) {
          // Данные: StaleWhileRevalidate
          return await staleWhileRevalidate(request, DATA_CACHE);
        }
        
        if (CACHE_PATTERNS.panoramas.test(url.pathname)) {
          // Панорамы: CacheFirst
          return await cacheFirst(request, PANORAMA_CACHE);
        }
        
        if (CACHE_PATTERNS.static.test(url.pathname)) {
          // Статичные ресурсы: CacheFirst
          return await cacheFirst(request, CACHE_NAME);
        }
        
        // HTML страницы: NetworkFirst
        if (request.method === 'GET' && request.headers.get('accept')?.includes('text/html')) {
          return await networkFirst(request, CACHE_NAME);
        }
        
        // Все остальное - прямо из сети
        return await fetch(request);
        
      } catch (error) {
        console.error('❌ Service Worker: Ошибка обработки запроса:', error);
        
        // Универсальный fallback
        if (request.headers.get('accept')?.includes('text/html')) {
          const cache = await caches.open(CACHE_NAME);
          const fallback = await cache.match('/');
          if (fallback) return fallback;
        }
        
        return new Response('Service Unavailable', { 
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});

// Предзагрузка данных категории (опционально)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRELOAD_CATEGORY') {
    const { categoryId } = event.data;
    
    (async () => {
      try {
        console.log(`🚀 Предзагрузка категории ${categoryId}...`);
        
        // Загружаем данные категории
        const dataUrls = [
          `/data/index.json`,
          `/data/houses.${categoryId}.json`
        ];
        
        const cache = await caches.open(DATA_CACHE);
        const fetchPromises = dataUrls.map(url => 
          fetch(url).then(response => {
            if (response.ok) {
              cache.put(url, response.clone());
            }
            return response;
          }).catch(error => {
            console.warn(`⚠️ Не удалось предзагрузить ${url}:`, error);
          })
        );
        
        await Promise.allSettled(fetchPromises);
        console.log(`✅ Категория ${categoryId} предзагружена`);
        
      } catch (error) {
        console.error('❌ Ошибка предзагрузки:', error);
      }
    })();
  }
});

// Кэширование ассетов
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_ASSETS') {
    const { assets } = event.data;
    
    (async () => {
      try {
        console.log(`🚀 Кэширование ${assets.length} ассетов...`);
        
        const cache = await caches.open(PANORAMA_CACHE);
        
        // Проверяем и фильтруем ассеты перед кэшированием
        const validAssets = assets.filter(asset => {
          // Проверяем, что путь не пустой и не содержит недопустимых значений
          const isValid = asset && 
                         typeof asset === 'string' && 
                         asset.startsWith('/') && 
                         !asset.includes('undefined') && 
                         !asset.includes('null');
          
          if (!isValid) {
            console.warn(`⚠️ Пропускаем некорректный ассет: ${asset}`);
          }
          return isValid;
        });
        
        console.log(`🔍 Отфильтровано ${assets.length - validAssets.length} некорректных ассетов, кэширую ${validAssets.length}`);
        
        // Кэшируем каждый ассет индивидуально с обработкой ошибок
        const results = await Promise.allSettled(
          validAssets.map(async (asset) => {
            try {
              const response = await fetch(asset);
              if (response.ok) {
                await cache.put(asset, response);
                return { status: 'cached', asset };
              } else {
                console.warn(`⚠️ Не удалось закэшировать ${asset}: HTTP ${response.status}`);
                return { status: 'error', asset, reason: `HTTP ${response.status}` };
              }
            } catch (error) {
              console.warn(`⚠️ Ошибка при кэшировании ${asset}: ${error.message}`);
              return { status: 'error', asset, reason: error.message };
            }
          })
        );
        
        const succeeded = results.filter(r => r.status === 'fulfilled' && r.value?.status === 'cached').length;
        const failed = results.filter(r => r.status !== 'fulfilled' || r.value?.status !== 'cached').length;
        
        console.log(`✅ Кэширование завершено: ${succeeded} успешно, ${failed} с ошибками`);
        
        // Отправляем результат обратно
        if (event.source && event.source.postMessage) {
          event.source.postMessage({
            type: 'CACHE_ASSETS_RESULT',
            succeeded,
            failed
          });
        }
        
      } catch (error) {
        console.error('❌ Ошибка кэширования ассетов:', error);
      }
    })();
  }
});

// Обработка ошибок
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker unhandled rejection:', event.reason);
});