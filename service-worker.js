const CACHE_NAME = 'bwga-nexus-cache-v20'; // Increment version to trigger update
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  // Vite generates hashed assets, so we can't pre-cache them by name.
  // The fetch handler will cache them on first load.
  // The font request will also be cached by the fetch handler.
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache, pre-caching essential assets.');
        return cache.addAll(urlsToCache).catch(err => {
            console.warn('Pre-caching failed for some assets:', err);
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all clients as soon as the SW is activated.
  );
});


self.addEventListener('fetch', event => {
  // Let the browser handle requests for scripts from dev servers etc.
  if (event.request.url.includes('vite') || event.request.url.includes('chrome-extension')) {
    return;
  }
  
  if (event.request.method !== 'GET') {
    return;
  }

  // Network falling back to cache strategy
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // If the fetch is successful, update the cache with the new version.
        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // If the network request fails, try to serve from the cache.
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // If not in cache, and it's a navigation request, serve the index.html as a fallback for SPAs
        if (event.request.mode === 'navigate') {
          const indexUrl = '/index.html';
          const cachedIndex = await caches.match(indexUrl);
          if(cachedIndex) {
              return cachedIndex;
          }
        }
        // Otherwise, the request will fail, which is expected for offline.
      })
  );
});
