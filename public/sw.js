/**
 * Service worker بسيط: كاش للتنقل (network-first) وللموارد الثابتة (stale-while-revalidate)
 * وكاش لنتائج /api/places عشان التطبيق يشتغل أوفلاين.
 */
const CACHE = "khrouga-v2";
const PRECACHE = ["/", "/manifest.webmanifest", "/icon.svg", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE).catch(() => undefined)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // ممنوع تخزين لوحة الأدمن أو ردود API الخاصة بيها على الجهاز.
  if (sameOrigin && (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin"))) return;

  // صفحات التنقل: الشبكة أولًا، ولو فشلت نرجع للكاش
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/"))),
    );
    return;
  }

  // API الأماكن: شبكة أولًا مع كاش احتياطي
  if (sameOrigin && url.pathname.startsWith("/api/places")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req)),
    );
    return;
  }

  // موارد ثابتة: stale-while-revalidate
  if (sameOrigin || url.hostname.endsWith("fonts.gstatic.com")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});
