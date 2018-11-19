const cacheName = 'v1';
const cacheFiles = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js'
];

self.addEventListener('install', (e) => {
  console.log('Service Worker installed');
  e.waitUntil(
    caches.open(cacheName).then((cacheName) => {
      console.log('Cachefiles are cached');
      return cacheName.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker activated');

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((thisCacheName) => {
        if (thisCacheName !== cacheName) {
          console.log('Removing cached files from', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (e) => {
  console.log('Service Worker fetching', e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        console.log('Found in cache',response);
        return response;
      } else {
        const requestClone = e.request.clone();
        fetch(requestClone).then((response) => {
          if(!response) {
            console.log('No response from fetch');
            return response;
          } else {
            const responseClone = response.clone();
            caches.open(cacheName).then((cache) => {
              cache.put(e.request, responseClone);
              return response;
            });
          }
        }).catch((err) => {
          console.log('error fetching and caching request', err);
        });
      }
    })
  );
});

// Push Notification

self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Notification';
  const options = {
    body: 'Click to enter fupa.net!'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://www.fupa.net/niederbayern')
  );
});
