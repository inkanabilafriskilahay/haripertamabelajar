// MISSKA Service Worker — v1.0.0
const CACHE_NAME = 'misska-v1';
const ASSETS = [
  './misska.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js'
];

// Install: cache semua aset
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        // Jika CDN gagal di-cache, lanjutkan tanpa error
        console.warn('Beberapa aset tidak bisa di-cache:', err);
        return cache.addAll(ASSETS.filter(a => !a.startsWith('http')));
      });
    })
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first untuk aset lokal, network-first untuk CDN
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Skip non-GET
  if (e.request.method !== 'GET') return;

  // Network-first untuk CDN eksternal
  if (url.startsWith('https://cdn.sheetjs.com')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first untuk aset lokal
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});

// Background sync placeholder (untuk pengembangan lebih lanjut)
self.addEventListener('sync', e => {
  if (e.tag === 'sync-data') {
    console.log('Background sync triggered');
  }
});
