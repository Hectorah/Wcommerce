// Service Worker para Wcommerce PWA
const CACHE_NAME = 'wcommerce-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.png',
  '/data/data.json',
  '/data/comida.json',
  '/data/tecnologia.json',
  '/data/repuestos.json',
  '/data/farmacia.json'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Estrategia de cache: Network First, fallback a Cache
self.addEventListener('fetch', event => {
  // Excluir requests de API y datos dinámicos
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, clonarla y almacenarla en cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Fallback al cache si no hay conexión
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            
            // Fallback a página offline si no está en cache
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            return new Response('', {
              status: 408,
              statusText: 'Offline'
            });
          });
      })
  );
});

// Manejo de mensajes desde la aplicación
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});