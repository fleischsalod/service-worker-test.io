if ('serviceWorker' in navigator) {
	var serviceWorker = navigator.serviceWorker;

	serviceWorker.register('./service-worker.js', {scope: './'})
		.then(function(registration) {
			console.log('Service Worker registered', registration);
		})
		.catch(function(err) {
			console.log('Registration failed', err);
		});
} else {
	console.log('Service Worker is not supported.');
}
