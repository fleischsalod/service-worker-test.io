const cacheName = 'v1';
const cacheFiles = [
	'./',
	'./index.html',
	'./css/style.css',
	'./js/app.js'
];

this.addEventListener('install', (e) => {
	console.log('Service Worker installed');

	e.waitUntil(
		caches.open(cacheName).then((cache => {
			console.log('Cachefiles are cached');
			return cache.addAll(cacheFiles);
		}))
	);
});

this.addEventListener('activate', (e) => {
	console.log('Service Worker activated');

	e.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(cacheNames.map(thisCacheName => {
				if (thisCacheName !== cacheName) {
					console.log('Removing cached files from', thisCacheName);
					return caches.delete(thisCacheName);
				}
			})
		}))
	);
});

this.addEventListener('fetch', (e) => {
	console.log('Service Worker fetching', e.request.url);

	e.respondWith(
		caches.match(e.request).then(response => {
			if response {
				console.log('Found in cache');
				resturn response;
			} else {
				const requestClone = e.request.clone();
				fetch(requestClone).then(response => {
					if(!response) {
						console.log('No response from fetch');
						return response;
					} else {
						const responseClone = response.clone();
						caches.open(cacheName).then(cache => {
							cache.put(e.request, responseClone);
							return response;
						});
					}
				}).catch(err => {
					console.log('error fetching and caching request', err);
				});
			}
		});
	);
});