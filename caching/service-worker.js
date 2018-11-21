var cacheName = 'v1';
var cacheFiles = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js'
];

self.addEventListener('install', function(e) {
  console.log('Service Worker installed');
  // SW installiert erst wenn code in e.waitUntil ausgeführt ist
  // Installieren kann einige Zeit dauern
  e.waitUntil(
    // cacheStorage Objekt in service worker scope | CacheAPI
    caches.open(cacheName).then(function(cacheName) {
      console.log('Cachefiles are cached');
      return cacheName.addAll(cacheFiles);
    })
  );
});

// Clean Up data that is no longer necessary
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

// fires every time a http request is fired
self.addEventListener('fetch', function(e) {
  console.log('Service Worker fetching', e.request.url);
  // FetchEvent.respondWith functions as proxy between browser and network
  // allows us to respond to any request with the response we want:
  // prepared by SW, from cache or even modified if needed
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        console.log('Found in cache',response);
        return response;
      } else {
        fetch(e.request).then(function(response) {
          if(!response) {
            console.log('No response from fetch');
            return response;
          } else {
            return caches.open(cacheName).then(function(cache) {
              cache.put(e.request, response.clone());
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
