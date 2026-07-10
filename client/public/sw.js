const CACHE_NAME = 'ener-g-t-49-v1';
const SHELL_CACHE = 'ener-g-t-49-shell-v1';
const API_CACHE = 'ener-g-t-49-api-v1';

// App shell assets to cache on install
const SHELL_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.png',
  '/favicon.svg',
];

// Install: cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch(() => {
        // Individual assets may 404 if not yet built - that's ok
        console.log('Shell cache partial');
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== API_CACHE && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for shell, network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API requests: network-first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  // App shell (HTML, JS, CSS): cache-first
  if (
    url.pathname === '/' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(cacheFirst(event.request, SHELL_CACHE));
    return;
  }

  // Static assets (images, icons): cache-first
  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(cacheFirst(event.request, CACHE_NAME));
    return;
  }

  // Everything else: network-first
  event.respondWith(networkFirst(event.request, CACHE_NAME));
});

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    // If offline and no cache, return offline page
    if (request.mode === 'navigate') {
      const offlineResponse = new Response(
        `<!doctype html>
        <html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Ener-G-T-49 — Offline</title>
        <style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f0eb;color:#2d3436;text-align:center;padding:2rem}
        h1{font-size:1.5rem;margin-bottom:0.5rem}.emoji{font-size:3rem;margin-bottom:1rem}p{color:#636e72;max-width:400px;line-height:1.5}</style>
        </head><body><div><div class="emoji">🌿</div><h1>You're offline</h1>
        <p>Your previously viewed sessions and content are still available. 
        Connect to the internet to browse new content and sync your progress.</p></div></body></html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
      return offlineResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy (stale-while-revalidate)
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return await caches.match('/');
    }
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for session completion data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sessions') {
    event.waitUntil(syncSessions());
  }
});

async function syncSessions() {
  const db = await openIndexedDB();
  const pending = await db.getAll('pending_sessions');
  for (const session of pending) {
    try {
      const response = await fetch('/api/user/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session.data),
      });
      if (response.ok) {
        await db.delete('pending_sessions', session.id);
      }
    } catch (e) {
      // Will retry on next sync
    }
  }
}

// Simple IndexedDB wrapper for background sync
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ener-g-t-49-sync', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('pending_sessions', { keyPath: 'id', autoIncrement: true });
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});