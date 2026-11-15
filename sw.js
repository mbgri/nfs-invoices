// Offline: keep a copy of the app files on the device.
const C = "nfs-app-v2";
const FILES = ["./", "index.html", "app.bundle.js", "manifest.json", "icon-192.png", "icon-512.png",
  "assets/DejaVuSans.ttf", "assets/DejaVuSans-Bold.ttf", "mupdf/mupdf.js", "mupdf/mupdf-wasm.js", "mupdf/mupdf-wasm.wasm"];
self.addEventListener("install", e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // network first (gets updates), cache when offline
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
