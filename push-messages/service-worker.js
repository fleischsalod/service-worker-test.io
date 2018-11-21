self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Notificationdata: ${event.data.text()}`);

  var title = 'Push Notification';
  var options = {
    body: 'You just sent a push notificaton.'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://www.fupa.net/niederbayern')
  );
});
