const CACHE_NAME = 'villainous-v2.3';

self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		Promise.all([
			self.clients.claim(),
			caches.keys().then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== CACHE_NAME) {
							return caches.delete(cacheName);
						}
					})
				);
			}),
		])
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		fetch(event.request)
			.then((response) => {
				const responseClone = response.clone();
				caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, responseClone);
				});
				return response;
			})
			.catch(() => {
				return caches.match(event.request);
			})
	);
});

// Invia un messaggio a tutti i client quando c'è un nuovo service worker
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
