const CACHE = "ancestra-header-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./about.html",
  "./menu.html",
  "./gallery.html",
  "./experience.html",
  "./blog.html",
  "./contact.html",
  "./faq.html",
  "./css/style.css",
  "./js/main.js",
  "./js/home.js",
  "./js/menu.js",
  "./js/cart.js",
  "./js/reservation.js",
  "./js/order-tracking.js",
  "./js/loyalty.js",
  "./js/reviews.js",
  "./js/reviews-data.js",
  "./js/gallery.js",
  "./js/contact.js",
  "./js/blog.js",
  "./manifest.json",
  "./images/favicon.jpg"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("ancestra-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then((response) => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html"))));
});
