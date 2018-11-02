if ('serviceWorker' in navigator) {
	const serviceWorker = navigator.serviceWorker;

	serviceWorker.register('./service-worker.js', {scope: './'})
		.then((registration) => {
			console.log('Service Worker registered', registration);
		})
		.catch((err) => {
			console.log('Registration failed', err);
		});
}
