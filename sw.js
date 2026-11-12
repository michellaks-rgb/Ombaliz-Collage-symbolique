const cacheName='ombaliz-collage-v8';
self.addEventListener('install',event=>event.waitUntil(caches.open(cacheName).then(cache=>cache.addAll(['./','./manifest.json','./icon-192.png','./icon-512.png','./ombaliz-logo.png','./pdf-lib.min.js','./collage-pdf.js','./symbols.js','./flashcode-collage-symbolique.png'])).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all(['ombaliz-collage-v1','ombaliz-collage-v2','ombaliz-collage-v3','ombaliz-collage-v4','ombaliz-collage-v5','ombaliz-collage-v6','ombaliz-collage-v7'].map(name=>caches.delete(name))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request).then(result=>result||(event.request.mode==='navigate'?caches.match('./'):Response.error()))));
});
