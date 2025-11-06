self.addEventListener('install', (event) => {
  console.log('Service worker installed');
  // Caching resources could be done here
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
