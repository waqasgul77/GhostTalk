// Minimal service worker — required for PWA installability (APK conversion tools
// like PWABuilder check for this). Firebase calls always go to the network;
// this only lets the app shell itself be re-opened offline.
const CACHE_NAME = 'ghosttalk-shell-v1';
const SHELL_FILES = ['./Index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for everything (this app is realtime/online-only);
  // fall back to the cached shell only if the network request fails.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
