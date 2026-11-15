// Offline: keep a copy of the app files on the device.
// If the website is down or removed, the app keeps running from this copy.
const C = "nfs-app-v3";
const FILES = ["./", "index.html", "app.bundle.js", "manifest.json", "icon-192.png", "icon-512.png",
  "assets/DejaVuSans.ttf", "assets/DejaVuSans-Bold.ttf", "mupdf/mupdf.js", "mupdf/mupdf-wasm.js", "mupdf/mupdf-wasm.wasm"];
self.addEventListener("install", e => e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith((async () => {
    const cached = await caches.match(e.request, { ignoreSearch: true });
    try {
      const r = await fetch(e.request);
      if (r.ok) { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; }
      return cached || r;          // site removed / error page: keep using the saved copy
    } catch { return cached || Response.error(); }   // no internet
  })());
});
