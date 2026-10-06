/* FocusLab Service Worker — Offline-First PWA */
// Bump APP_VERSION on release to invalidate cached static assets
const APP_VERSION = 'v1.0.1';
const CACHE_NAME = `focuslab-cache-${APP_VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/check',
  '/focus',
  '/activities',
  '/experiments',
  '/insights',
  '/sounds',
  '/learn',
  '/about',
  '/privacy',
  '/disclaimer',
  '/offline.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle GET requests originating from same origin
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Bypass service worker interception for localhost, 127.0.0.1, or webpack HMR
  if (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.pathname.startsWith('/_next/webpack-hmr')
  ) {
    return;
  }

  const isNavigation =
    request.mode === 'navigate' ||
    (request.headers.get('accept') &&
      request.headers.get('accept').includes('text/html'));

async function matchWithTrailingSlash(req) {
  let cached = await caches.match(req);
  if (cached) return cached;
  try {
    const url = new URL(typeof req === 'string' ? req : req.url);
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      const altUrl = new URL(url);
      altUrl.pathname = altUrl.pathname.slice(0, -1);
      cached = await caches.match(altUrl.toString());
    } else if (!url.pathname.endsWith('/')) {
      const altUrl = new URL(url);
      altUrl.pathname = `${altUrl.pathname}/`;
      cached = await caches.match(altUrl.toString());
    }
  } catch {}
  return cached;
}

  if (isNavigation) {
    // HTML requests: Network-first with offline cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await matchWithTrailingSlash(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const offlineFallback = await caches.match('/offline.html');
          return offlineFallback || caches.match('/');
        })
    );
    return;
  }

  // Static assets (Next.js chunks, icons, css, fonts): Cache-first
  event.respondWith(
    matchWithTrailingSlash(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      });
    })
  );
});
