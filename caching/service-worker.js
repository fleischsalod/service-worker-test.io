var cacheName = 'v1';
var cacheFiles = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js'
];

self.addEventListener('install', function(e) {
  console.log('Service Worker installed');
  //
  e.waitUntil(
    caches.open(cacheName).then(function(cacheName) {
      console.log('Cachefiles are cached');
      return cacheName.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('Service Worker activated');

  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {
        if (thisCacheName !== cacheName) {
          console.log('Removing cached files from', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('Service Worker fetching', e.request.url);
  //
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        console.log('Found in cache',response);
        return response;
      } else {
        var requestClone = e.request.clone();
        fetch(requestClone).then(function(response) {
          if(!response) {
            console.log('No response from fetch');
            return response;
          } else {
            var responseClone = response.clone();
            caches.open(cacheName).then(function(cache) {
              cache.put(e.request, responseClone);
              return response;
            });
          }
        }).catch(function(err) {
          console.log('error fetching and caching request', err);
        });
      }
    })
  );
});
