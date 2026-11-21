// ============================================================
//  CARFE® Calzado — Service Worker (PWA Oficial v2.0)
//  Estrategia: Network-First con Fallback de App Shell Offline
// ============================================================

const CACHE_NAME = 'carfe-pwa-v2.0';
const STATIC_ASSETS = [
  './',
  './admin.html',
  './index.html',
  './studio3d.html',
  './manifest.json',
  './css/styles.css',
  './js/admin.js',
  './js/store.js',
  './js/base44-client.js',
  './assets/logo-card.png',
  './assets/logo-white.png',
  './assets/logo.jpg',
  './assets/logo.png',
  './assets/logo.svg',
  './assets/pwa-icon-192.png',
  './assets/pwa-icon-512.png',
  './assets/apple-touch-icon.png'
];

// 1. INSTALACIÓN
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[CARFE PWA] Algunos recursos estáticos no pudieron ser precacheados:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVACIÓN Y LIMPIEZA DE CACHÉS ANTIGUOS
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. ESTRATEGIA DE NAVEGACIÓN Y PETICIONES (Network-First)
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorar peticiones que no sean GET (como POST de APIs o formularios)
  if (req.method !== 'GET') return;

  // No cachear llamadas directas a APIs externas de mensajería o pagos
  if (url.origin.includes('graph.facebook.com') || url.origin.includes('api.whatsapp.com')) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then(networkRes => {
        // Si la respuesta es válida, clonar y actualizar caché para assets estáticos
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then(cache => {
            if (url.origin === self.location.origin) {
              cache.put(req, resClone);
            }
          });
        }
        return networkRes;
      })
      .catch(async () => {
        // Si falla la red (Modo Offline), servir desde caché
        const cachedRes = await caches.match(req);
        if (cachedRes) return cachedRes;

        // Si es una navegación HTML, servir admin.html o index.html en caché
        if (req.mode === 'navigate') {
          return caches.match('./admin.html') || caches.match('./index.html');
        }

        return new Response('Sin conexión a Internet', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      })
  );
});

// 4. NOTIFICACIONES PUSH
self.addEventListener('push', event => {
  let data = { title: 'CARFE® Notificación', body: 'Tienes una nueva actualización en tu tienda.' };
  try {
    if (event.data) data = event.data.json();
  } catch(e) {
    if (event.data) data.body = event.data.text();
  }

  const options = {
    body: data.body,
    icon: './assets/pwa-icon-192.png',
    badge: './assets/pwa-icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || './admin.html' }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './admin.html';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('admin.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
