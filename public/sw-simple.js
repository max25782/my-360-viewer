// Simple Service Worker for testing
const CACHE_NAME = 'pwa-test-v1';

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  // Force immediate activation
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // For now, just pass through all requests
  console.log('[SW] Fetching:', event.request.url);
  event.respondWith(fetch(event.request));
});

// Log that service worker is loaded
console.log('[SW] Service Worker script loaded');