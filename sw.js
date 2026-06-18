// MISSKA Service Worker — v2.0.0
const CACHE_NAME = 'misska-v2';
const ASSETS = [
  './misska.html',
  './orangtua.html',
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
        console.warn('Beberapa aset tidak bisa di-cache:', err);
        return cache.addAll(ASSETS.filter(a => !a.startsWith('http')));
      });
    })
  );
  // Jangan skipWaiting otomatis — tunggu user tekan tombol update
  // self.skipWaiting() dipanggil saat user klik "Update Sekarang"
});

// Activate: hapus cache lama, ambil kendali semua tab
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first untuk aset lokal, network-first untuk CDN
self.addEventListener('fetch', e => {
  const url = e.request.url;
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

// Terima pesan dari halaman — saat user klik "Update Sekarang"
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
