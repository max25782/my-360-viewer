/**
 * Service Worker для PWA с офлайн кэшированием
 * - CacheFirst для панорам и статики
 * - StaleWhileRevalidate для JSON данных
 * - NetworkFirst для HTML
 * - Navigation Preload включен
 */

const CACHE_VERSION = 'v3'; // 🚀 увеличивай при каждом деплое
const CACHE_NAME = `house-viewer-${CACHE_VERSION}`;
const DATA_CACHE = `house-data-${CACHE_VERSION}`;
const PANORAMA_CACHE = `panorama-cache-${CACHE_VERSION}`;

// Файлы для кэширования при установке
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json'
];

// Паттерны
const CACHE_PATTERNS = {
  data: /\/data\/.*\.json$/,
  panoramas: /\/assets\/.*\/(360|panos)\/.*\.(jpg|jpeg|webp|png)$/i,
  static: /\.(js|css|png|jpg|jpeg|webp|svg|woff|woff2)$/,
};

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Установка...');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(STATIC_CACHE_URLS.map(url => cache.add(url)));
      await self.skipWaiting();
    })()
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Активация...');
  event.waitUntil(
    (async () => {
      // Включаем navigation preload
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
        console.log('⚡ Navigation Preload enabled');
      }

      // Чистим старые кэши
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => ![CACHE_NAME, DATA_CACHE, PANORAMA_CACHE].includes(name))
          .map(name => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

// Cache First
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Offline - content not available', { status: 503 });
  }
}

// Network First (с navigation preload)
async function networkFirst(request, cacheName, event) {
  try {
    // ⚡ используем preload, если есть
    const preloadResponse = event?.preloadResponse ? await event.preloadResponse : null;
    if (preloadResponse) return preloadResponse;

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline - page not available', { status: 503 });
  }
}

// Stale While Revalidate (с фиксами)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (!cachedResponse) {
    // 🚀 Первый визит — ждём сеть
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch {
      return new Response('Offline - no cached data', { status: 503 });
    }
  }

  // Если кэш есть — отдаем и параллельно обновляем
  fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  }).catch(() => {});

  return cachedResponse;
}

// Fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!url.protocol.startsWith('http') || url.pathname.startsWith('/api/')) return;

  event.respondWith(
    (async () => {
      if (CACHE_PATTERNS.data.test(url.pathname)) {
        return staleWhileRevalidate(request, DATA_CACHE);
      }
      if (CACHE_PATTERNS.panoramas.test(url.pathname)) {
        return cacheFirst(request, PANORAMA_CACHE);
      }
      if (CACHE_PATTERNS.static.test(url.pathname)) {
        return cacheFirst(request, CACHE_NAME);
      }
      if (request.headers.get('accept')?.includes('text/html')) {
        return networkFirst(request, CACHE_NAME, event);
      }
      return fetch(request);
    })()
  );
});

// Message handlers (предзагрузка ассетов/категорий)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'PRELOAD_CATEGORY') {
    const { categoryId } = event.data;
    (async () => {
      console.log(`🚀 Предзагрузка категории ${categoryId}...`);
      const dataUrls = [
        `/data/index.json`,
        `/data/houses.${categoryId}.json`
      ];
      const cache = await caches.open(DATA_CACHE);
      await Promise.allSettled(
        dataUrls.map(url =>
          fetch(url).then(res => {
            if (res.ok) cache.put(url, res.clone());
          })
        )
      );
    })();
  }

  if (event.data.type === 'CACHE_ASSETS') {
    const { assets } = event.data;
    (async () => {
      console.log(`🚀 Кэширование ${assets.length} ассетов...`);
      const cache = await caches.open(PANORAMA_CACHE);
      await Promise.allSettled(
        assets.map(async (asset) => {
          try {
            const res = await fetch(asset);
            if (res.ok) {
              await cache.put(asset, res.clone());
            }
          } catch (err) {
            console.warn(`⚠️ Ошибка при кэшировании ${asset}:`, err);
          }
        })
      );
    })();
  }
});

// Error logging
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error);
});
self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker unhandled rejection:', event.reason);
});
