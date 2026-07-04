const CACHE_NAME = 'hotel-menu-v1';
const URLS_TO_CACHE = [
  '/',
  '/styles.css',
  '/fonts/',
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[v0] Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[v0] Cache opened');
      return cache.addAll(URLS_TO_CACHE).catch(() => {
        console.log('[v0] Some assets could not be cached during install');
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[v0] Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[v0] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and same-origin API calls
  if (request.method !== 'GET') {
    return;
  }

  // Network first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Return cached response if network fails
        return caches.match(request).then((response) => {
          if (response) {
            console.log('[v0] Serving from cache:', request.url);
            return response;
          }
          // Return a fallback for offline navigation
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
