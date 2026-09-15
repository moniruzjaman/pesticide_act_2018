// Service Worker — Pesticide Act 2018 PWA
// Caches app shell + assets for offline use

const CACHE_NAME = "pesticide-act-v1";
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/favicon-32.png",
  "/favicon-16.png",
  "/og-image.png",
  "/assets/sections.json",
  "/assets/keys.json",
  "/assets/pesticide-act-2018.html",
];

// Install — precache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache URLs individually so failures don't break the whole install
      return Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          fetch(url, { cache: "reload" })
            .then((resp) => {
              if (resp.ok) return cache.put(url, resp);
            })
            .catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for static assets, network-first for HTML
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Skip cross-origin (Google Fonts etc) — let browser handle
  if (url.origin !== self.location.origin) return;

  // Skip Next.js HMR/dev requests
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  // For navigation requests — network-first, fall back to cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/")))
    );
    return;
  }

  // For static assets — cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((resp) => {
          if (resp.ok && resp.type === "basic") {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return resp;
        })
        .catch(() => cached);
    })
  );
});
