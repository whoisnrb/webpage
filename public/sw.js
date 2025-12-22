// Advanced Service Worker with Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
    console.log('Workbox is loaded');

    // Cache Page Transitions
    workbox.routing.registerRoute(
        ({ request }) => request.mode === 'navigate',
        new workbox.strategies.NetworkFirst({
            cacheName: 'pages',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 50,
                }),
            ],
        })
    );

    // Cache Images with Cache First strategy
    workbox.routing.registerRoute(
        ({ request }) => request.destination === 'image',
        new workbox.strategies.CacheFirst({
            cacheName: 'images',
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                }),
            ],
        })
    );

    // Cache Fonts
    workbox.routing.registerRoute(
        ({ request }) => request.destination === 'font',
        new workbox.strategies.CacheFirst({
            cacheName: 'fonts',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 10,
                }),
            ],
        })
    );

    // Cache API requests with Stale While Revalidate
    workbox.routing.registerRoute(
        ({ url }) => url.pathname.startsWith('/api/'),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'api-cache',
        })
    );

    // Offline fallback
    workbox.recipes.offlineFallback({ pageFallback: '/offline' });
}
