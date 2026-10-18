/*
 * JNR PDF Studio — update-first Service Worker
 * Keep this file at /sw.js and register it with scope "/".
 *
 * Strategy:
 * - HTML/navigation: network-first, with a cache-busting reload request.
 * - Same-origin static GET assets: network-first for fresh deployments,
 *   cached fallback for offline use.
 * - Never cache cross-origin requests, POSTs, opaque responses, or errors.
 * - Delete only caches owned by this app.
 */
'use strict';

const APP_PREFIX = 'jnr-pdf-studio-';
const CACHE_VERSION = 'v2';
const RUNTIME_CACHE = `${APP_PREFIX}${CACHE_VERSION}`;
const OFFLINE_PAGE = '/index.html';

self.addEventListener('install', (event) => {
  // No pre-cache of every page: a missing file must not break installation.
  event.waitUntil(Promise.resolve());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      // Only remove old caches owned by this app.
      if (key.startsWith(APP_PREFIX) && key !== RUNTIME_CACHE) {
        return caches.delete(key);
      }
      return Promise.resolve(false);
    }));
    await self.clients.claim();

    // Tell open pages that the new worker is controlling them.
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      client.postMessage({ type: 'JNR_SW_ACTIVATED', version: CACHE_VERSION });
    }
  })());
});

function isCacheableSameOriginGet(request, url) {
  return request.method === 'GET' &&
    url.origin === self.location.origin &&
    !url.pathname.startsWith('/api/') &&
    !url.pathname.includes('/.well-known/');
}

async function networkFirst(request, cacheKey) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    // Reload mode asks the browser to revalidate HTTP cache entries as well.
    const freshRequest = new Request(request, { cache: 'reload' });
    const response = await fetch(freshRequest);
    if (response && response.ok && response.type === 'basic') {
      await cache.put(cacheKey || request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(cacheKey || request);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Keep browser navigation and HTML pages fresh so deployments appear quickly.
  if (request.mode === 'navigate' ||
      request.destination === 'document' ||
      /\.html?$/i.test(url.pathname) ||
      url.pathname === '/') {
    event.respondWith((async () => {
      try {
        return await networkFirst(request);
      } catch (_) {
        const cache = await caches.open(RUNTIME_CACHE);
        return (await cache.match(request)) ||
          (await cache.match(OFFLINE_PAGE)) ||
          new Response('You are offline. Please reconnect and reload JNR PDF Studio.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
      }
    })());
    return;
  }

  if (!isCacheableSameOriginGet(request, url)) return;

  // Other same-origin GET assets: network-first for fast updates, cache fallback offline.
  event.respondWith((async () => {
    try {
      return await networkFirst(request);
    } catch (_) {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      return new Response('', { status: 504, statusText: 'Offline asset unavailable' });
    }
  })());
});

// Optional page-to-worker message interface.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'JNR_SKIP_WAITING') {
    self.skipWaiting();
  }
});
