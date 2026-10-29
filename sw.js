/* Idle Business : fonctionnement hors ligne et mises à jour. Version 20261029-092603 */
const CACHE = 'ib-20261029-092603';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/logo-192.png", "icons/logo-512.png", "icons/logo-apple-touch-icon.png", "fonts/nunito-latin-ext-wght-normal.woff2", "fonts/nunito-latin-wght-normal.woff2"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ib-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Le jeu lui-même : toujours la dernière version si le réseau répond, sinon la copie hors ligne.
  if (req.mode === 'navigate' || (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname))) {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put('index.html', c)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  // Icônes, polices (y compris Google Fonts) : copie locale d'abord, mise à jour en arrière-plan.
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(CACHE).then(async k => {
      const hit = await k.match(req);
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) k.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
  }
});
