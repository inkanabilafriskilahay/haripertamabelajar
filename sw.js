// MISSKA Service Worker v3.0
const CACHE = 'misska-v3';
const ASSETS = [
  './misska.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(ASSETS).catch(() => c.addAll(ASSETS.filter(a => !a.startsWith('http'))))
    )
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  if(e.request.url.startsWith('https://cdn.sheetjs.com')){
    e.respondWith(
      fetch(e.request).then(res => {
        const cl = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, cl));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        if(!res || res.status !== 200 || res.type === 'opaque') return res;
        const cl = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, cl));
        return res;
      });
    })
  );
});

self.addEventListener('message', e => {
  if(e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
