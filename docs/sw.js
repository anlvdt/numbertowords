const CACHE_NAME = 'docso-v2.2.1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './js/copy.js',
  './js/shared.js',
  './converter.js',
  './manifest-pwa.json',
  './assets/logo.svg',
  './assets/icon-128.png',
  './assets/icon-64.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/** Network-first for HTML/navigation; cache-first for static assets */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const isNav = req.mode === 'navigate' || req.destination === 'document';

  if (isNav) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      });
      return cached || fetchPromise;
    })
  );
});
