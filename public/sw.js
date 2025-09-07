import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", (event) => {
  console.log("Service worker is installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((cache) => caches.delete(cache)));
    })
  );
});

const shownNotifications = new Set();

self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: "Notifikasi Baru" };
    }
  }

  const storyId = data?.options?.data?.storyId || data?.storyId;

  if (storyId && shownNotifications.has(storyId)) {
    console.log("Notifikasi untuk story ini sudah pernah ditampilkan, skip...");
    return;
  }

  if (storyId) shownNotifications.add(storyId);

  const title = data.title || "Notifikasi Baru";
  const options = data.options || {
    body: "Ada story baru nih!",
    icon: "/icon.png",
    badge: "/badge.png",
    data: { storyId },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// --- RUNTIME CACHING ---
// Google Fonts
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new CacheFirst({ cacheName: "google-fonts" })
);

// Fontawesome / CDN
registerRoute(
  ({ url }) =>
    url.origin === "https://cdnjs.cloudflare.com" || url.origin.includes("fontawesome"),
  new CacheFirst({ cacheName: "fontawesome" })
);

// Avatar API
registerRoute(
  ({ url }) => url.origin === "https://ui-avatars.com",
  new CacheFirst({
    cacheName: "avatars-api",
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// API JSON (kecuali image)
registerRoute(
  ({ url }) => url.origin === "https://story-api.dicoding.dev",
  new NetworkFirst({
    cacheName: "storyku-api",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // cache 7 hari
      }),
    ],
  })
);

// API Images
registerRoute(
  ({ url }) => url.origin === "https://story-api.dicoding.dev",
  new StaleWhileRevalidate({
    cacheName: "storyku-api",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // cache 7 hari
      }),
    ],
  })
);

// Maptiler API
registerRoute(
  ({ url }) => url.origin.includes("maptiler"),
  new CacheFirst({ cacheName: "maptiler-api" })
);

// OpenStreetMap tiles
registerRoute(
  ({ url }) => url.origin.includes("tile.openstreetmap.org"),
  new CacheFirst({
    cacheName: "osm-tiles",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
      }),
      new CacheableResponsePlugin({ statuses: [200] }),
    ],
  })
);