/**
 * Minimal service worker: caches the app shell and static Daily Awareness /
 * CPR library assets so they remain available offline. The AI chat itself
 * needs a live connection and is intentionally NOT cached.
 */
const CACHE_NAME = 'ausecours-static-v1';
const APP_SHELL = ['/', '/awareness', '/cpr', '/numbers', '/manifest.json', '/avatar-portrait.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  // Never cache API calls (chat needs to always hit the network).
  if (request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached)
    )
  );
});
