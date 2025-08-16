// Service Worker для кэширования 360° изображений
const CACHE_NAME = 'my-360-viewer-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Критические ресурсы для первой загрузки
const PRECACHE_URLS = [
  '/',
  '/data/house-assets.json',
  '/fonts/LeagueSpartan-Regular.ttf',
  '/fonts/LeagueSpartan-Bold.ttf',
];

// Паттерны для кэширования
const CACHE_PATTERNS = {
  images360: /\/assets\/.*\/360\/.*\.(jpg|webp)$/,
  previews: /\/assets\/.*\/(hero|thumbnail|preview)\.(jpg|webp)$/,
  fonts: /\/fonts\/.*\.(ttf|woff2?)$/,
  static: /\.(css|js)$/
};

// Стратегии кэширования
const CACHE_STRATEGIES = {
  // Сначала кэш, потом сеть (для статики)
  cacheFirst: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      // Обновляем в фоне
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      });
      return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  },
  
  // Сначала сеть, потом кэш (для динамических данных)
  networkFirst: async (request) => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      return cached || new Response('Offline', { status: 503 });
    }
  },
  
  // Только сеть (для аналитики и т.д.)
  networkOnly: async (request) => {
    return fetch(request);
  }
};

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching critical resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Обработка запросов
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Игнорируем не-GET запросы
  if (request.method !== 'GET') {
    return;
  }
  
  // Игнорируем запросы к другим доменам
  if (!url.href.startsWith(self.location.origin)) {
    return;
  }
  
  // Определяем стратегию кэширования
  let strategy;
  
  if (CACHE_PATTERNS.images360.test(url.pathname) || 
      CACHE_PATTERNS.previews.test(url.pathname)) {
    // 360° изображения - кэш первый
    strategy = CACHE_STRATEGIES.cacheFirst;
  } else if (CACHE_PATTERNS.fonts.test(url.pathname) || 
             CACHE_PATTERNS.static.test(url.pathname)) {
    // Статические ресурсы - кэш первый
    strategy = CACHE_STRATEGIES.cacheFirst;
  } else if (url.pathname.includes('/api/') || 
             url.pathname.includes('/data/')) {
    // API и данные - сеть первая
    strategy = CACHE_STRATEGIES.networkFirst;
  } else {
    // Всё остальное - сеть первая
    strategy = CACHE_STRATEGIES.networkFirst;
  }
  
  event.respondWith(strategy(request));
});

// Предзагрузка следующих комнат
self.addEventListener('message', event => {
  if (event.data.type === 'PRELOAD_ROOMS') {
    const { houseId, rooms, format } = event.data;
    
    console.log(`[SW] Preloading ${format} tiles for rooms:`, rooms);
    
    const preloadPromises = rooms.flatMap(room => {
      const tiles = ['f', 'b', 'l', 'r', 'u', 'd'];
      return tiles.map(tile => {
        const url = `/assets/${houseId}/360/${room}/${tile}.${format}`;
        return caches.open(CACHE_NAME)
          .then(cache => cache.add(url))
          .catch(error => console.log(`[SW] Failed to preload ${url}:`, error));
      });
    });
    
    Promise.all(preloadPromises)
      .then(() => {
        event.ports[0].postMessage({ 
          type: 'PRELOAD_COMPLETE', 
          rooms 
        });
      });
  }
  
  // Очистка старого кэша
  if (event.data.type === 'CLEAR_OLD_CACHE') {
    caches.delete(RUNTIME_CACHE)
      .then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
  }
});

// Оффлайн страница
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
  }
});
