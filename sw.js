// ============================================================================
// Sw.js / Service Worker
// ============================================================================
const CACHE_NAME = 'chatbot-cache'
const urlsToCache = ['/', './assets/css/style.css', './app.js', './favicon.png']

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => response || fetch(event.request))
    )
})
