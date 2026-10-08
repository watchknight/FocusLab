import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let commitHash = process.env.RENDER_GIT_COMMIT;
if (!commitHash) {
  try {
    commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    commitHash = Date.now().toString();
  }
}
const cacheName = `focuslab-cache-${commitHash}`;

const swContent = `/* FocusLab Service Worker — Offline-First PWA */
// Cache version: commit hash (RENDER_GIT_COMMIT) when present, else build timestamp
const CACHE_NAME = '${cacheName}';

const PRECACHE_ASSETS = [
  '/',
  '/check/',
  '/focus/',
  '/activities/',
  '/experiments/',
  '/insights/',
  '/sounds/',
  '/learn/',
  '/about/',
  '/privacy/',
  '/disclaimer/',
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
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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
      const targetUrl = new URL(typeof req === 'string' ? req : req.url);
      if (targetUrl.pathname.length > 1 && targetUrl.pathname.endsWith('/')) {
        const altUrl = new URL(targetUrl);
        altUrl.pathname = altUrl.pathname.slice(0, -1);
        cached = await caches.match(altUrl.toString());
      } else if (!targetUrl.pathname.endsWith('/')) {
        const altUrl = new URL(targetUrl);
        altUrl.pathname = \`\${targetUrl.pathname}/\`;
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
          return caches.match('/');
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
`;

fs.writeFileSync(path.join(rootDir, 'public', 'sw.js'), swContent, 'utf8');

const outDir = path.join(rootDir, 'out');
if (fs.existsSync(outDir)) {
  fs.writeFileSync(path.join(outDir, 'sw.js'), swContent, 'utf8');
}

console.log(`[sw] Generated Service Worker with CACHE_NAME="${cacheName}"`);

