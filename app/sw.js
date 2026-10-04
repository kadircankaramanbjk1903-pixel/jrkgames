/* JRK Games çevrimdışı önbellek. Sürümü değiştirince yeni dosyalar indirilir. */
const CACHE='jrk-v2';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-512-maskable.png','./gizlilik.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&res.status===200&&(r.url.startsWith(self.location.origin)||r.url.includes('fonts.g')))caches.open(CACHE).then(c=>c.put(r,res.clone()));return res}).catch(()=>hit);return hit||net}))});
