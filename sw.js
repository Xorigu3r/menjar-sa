// Xoriguer · funcionament sense connexió
// Quan canviïs l'app, puja el número de versió perquè els mòbils agafin la nova.
const VERSION = "xoriguer-v6";
// Tot el que cal per funcionar sense internet des del primer dia
const APP = [
  "./", "index.html", "manifest.json", "css/app.css",
  "js/i18n.js", "js/rules.js", "js/app.js",
  "vendor/icons.css", "vendor/icons.woff2", "vendor/html5-qrcode.min.js",
  "vendor/fonts/pjs-400.woff2", "vendor/fonts/pjs-500.woff2", "vendor/fonts/pjs-600.woff2", "vendor/fonts/pjs-700.woff2", "vendor/fonts/pjs-800.woff2",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png",
  "icons/apple-touch-icon.png", "icons/mark-256.png", "icons/favicon-64.png"
];
// Externs que es guarden després del primer ús (lector de fotos i fotos dels productes)
const EXTERNAL = ["cdn.jsdelivr.net", "tessdata.projectnaptha.com", "images.openfoodfacts.org"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith("xoriguer-") && k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;

  // Consultes de productes (Open Food Facts, USDA): sempre a internet; l'app guarda les seves dades
  if (!same && !EXTERNAL.includes(url.hostname)) return;

  // Pàgina i codi propi: primer internet (per rebre actualitzacions), si no, la còpia guardada
  if (same && (req.mode === "navigate" || /\.(html|js|css|json)$/.test(url.pathname) || url.pathname.endsWith("/"))){
    e.respondWith(
      fetch(req).then(res => { if (res.ok){ const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return res; })
        .catch(() => caches.match(req, {ignoreSearch:true}).then(r => r || caches.match("index.html")))
    );
    return;
  }
  // Icones, fonts, llibreries i fotos: primer la còpia guardada
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")){ const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); }
      return res;
    }))
  );
});
