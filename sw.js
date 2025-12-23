const CACHE_NAME = 'color-blaster-offline-v5';  // Increment after changes

// All assets to cache (ROOT FOLDER EDITION)
const urlsToCache = [
    // Core files
    
    'index.html',
    'manifest.json',
        'favicon.ico',

    // CSS/JS (in root)
    'main.css',
    'main.js',

    // Images (in /images/)
    'images/spaceship.png',
    'images/bullet.png',
    'images/ball-red.png',
    'images/ball-yellow.png',
    'images/ball-green.png',
    'images/ball-blue.png',
    'images/ball-purple.png',
    'images/star.png',
    'images/enemy.png',
    'images/boss.png',
    'images/bomb-enemy.png',
    'images/bomb.png',
    'images/life.png',
    'images/icon-192x192.png',
    'images/icon-512x512.png',
    'images/start-screen-bg.png',
    'images/win-screen-bg.png',

    // Backgrounds (in /bg/)
    'bg/bg-0.jpg',
    'bg/bg-1.png',
    'bg/bg-2.png',
    'bg/bg-3.png',
    'bg/bg-4.png',
    'bg/bg-5.png',
    'bg/bg-07.png',
    'bg/bg-8.png',
    'bg/bg-9.png',
    'bg/bg-10.png',
    // ... add ALL other backgrounds ...

    // Sounds (in /sounds/)
    'sounds/bg-music.mp3',
    'sounds/fire-bullet.wav',
    'sounds/ball-pop.flac',
    'sounds/click.mp3',
    'sounds/enemy-death.mp3',
    'sounds/enemy-spawn.mp3',
    'sounds/loose.mp3',
    
];



// Install event: Caches all static assets. This version logs which URL fails but proceeds.
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Pre-caching all assets');
            // Use Promise.all with individual cache.add to debug which URL fails and not stop the whole process
            const cachePromises = urlsToCache.map(url => {
                return cache.add(url).catch(err => {
                    console.error(`[Service Worker] Failed to cache: ${url}`, err);
                    // Return a resolved promise so the other files can still be cached
                    return Promise.resolve();
                });
            });
            return Promise.all(cachePromises);
        }).catch(err => {
            console.error('[Service Worker] Pre-caching operation failed completely:', err);
        })
    );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating and cleaning up old caches...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // This line takes control of all clients immediately
    event.waitUntil(clients.claim());
});

// Fetch event: Intercepts network requests and serves from cache
self.addEventListener('fetch', (event) => {
    // We only want to handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Handle requests for play.html with or without query parameters
    const url = new URL(event.request.url);
    const isPlayHtmlRequest = url.pathname.endsWith('/index.html');
    const normalizedRequest = isPlayHtmlRequest
        ? new Request(new URL(url.pathname, url.origin))
        : event.request;

    event.respondWith(
        caches.match(normalizedRequest, { ignoreSearch: true }).then((cachedResponse) => {
            // Return cached response if found
            if (cachedResponse) {
                console.log('[Service Worker] Serving from cache:', normalizedRequest.url);
                return cachedResponse;
            }

            // No match in cache, try the network
            console.log('[Service Worker] No match in cache, fetching from network:', event.request.url);
            return fetch(event.request);
        }).catch((error) => {
            // If both cache and network fail (i.e. offline), return a fallback
            console.error('[Service Worker] Fetching failed:', error);
            // You could add an offline page fallback here if you wanted
            return new Response('You are offline and this resource is not cached.', {
                status: 503,
                statusText: 'Service Unavailable',
            });
        })
    );
});
// INSTALL - Cache all assets
// self.addEventListener('install', function (event) {
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then(function (cache) {
//                 console.log('Caching all game assets');
//                 return cache.addAll(urlsToCache).catch(function (err) {
//                     console.error('Failed to cache:', err);
//                 });
//             })
//     );
// });

// ACTIVATE - Clean old caches
// self.addEventListener('activate', function (event) {
//     event.waitUntil(
//         caches.keys().then(function (cacheNames) {
//             return Promise.all(
//                 cacheNames.map(function (cacheName) {
//                     if (cacheName !== CACHE_NAME) {
//                         console.log('Deleting old cache:', cacheName);
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

// FETCH - Serve cached files when offline
// self.addEventListener('fetch', function (event) {
//     // Skip non-GET requests (like POST)
//     if (event.request.method !== 'GET') return;

//     // Handle HTML files
//     if (event.request.url.endsWith('.html')) {
//         event.respondWith(
//             caches.match('index.html').then(function (response) {
//                 return response || fetch(event.request);
//             })
//         );
//         return;
//     }

//     // For all other assets
//     event.respondWith(
//         caches.match(event.request).then(function (response) {
//             // Return cached file if found
//             if (response) {
//                 return response;
//             }

//             // Try network if not cached
//             return fetch(event.request).catch(function () {
//                 // Fallback for uncached files
//                 return new Response('Game is offline. Resource not cached.', {
//                     status: 503
//                 });
//             });
//         })
//     );
// });