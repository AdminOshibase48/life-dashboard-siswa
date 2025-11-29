// Service Worker for Life Dashboard Siswa
const CACHE_NAME = 'studentlife-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/styles/pages/login.css',
    '/styles/pages/dashboard.css',
    '/styles/pages/games.css',
    '/styles/pages/finance.css',
    '/styles/pages/mood.css',
    '/styles/pages/chatbot.css',
    '/styles/components/notifications.css',
    '/scripts/main.js',
    '/scripts/components/auth.js',
    '/scripts/components/finance.js',
    '/scripts/components/mood.js',
    '/scripts/components/games.js',
    '/scripts/components/chatbot.js',
    '/scripts/utils/helpers.js',
    '/scripts/utils/pwa.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Install completed');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.log('Service Worker: Install failed', error);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(() => {
            console.log('Service Worker: Activate completed');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip chrome-extension requests
    if (event.request.url.startsWith('chrome-extension://')) return;

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then((fetchResponse) => {
                        // Cache dynamic requests
                        if (event.request.url.startsWith('http')) {
                            return caches.open(DYNAMIC_CACHE)
                                .then((cache) => {
                                    cache.put(event.request.url, fetchResponse.clone());
                                    return fetchResponse;
                                });
                        }
                        return fetchResponse;
                    })
                    .catch((error) => {
                        // Fallback for failed requests
                        console.log('Fetch failed; returning offline page:', error);
                        
                        // If it's a document request, return offline page
                        if (event.request.destination === 'document') {
                            return caches.match('/');
                        }
                        
                        // For other requests, return generic offline response
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Background sync:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Get pending actions from IndexedDB or localStorage
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
        try {
            await processPendingAction(action);
            await removePendingAction(action.id);
        } catch (error) {
            console.error('Failed to process pending action:', error);
        }
    }
}

// Helper functions for background sync
async function getPendingActions() {
    return new Promise((resolve) => {
        // In a real app, use IndexedDB
        const actions = JSON.parse(localStorage.getItem('pending_actions') || '[]');
        resolve(actions);
    });
}

async function processPendingAction(action) {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Processed pending action:', action);
            resolve();
        }, 1000);
    });
}

async function removePendingAction(actionId) {
    return new Promise((resolve) => {
        const actions = JSON.parse(localStorage.getItem('pending_actions') || '[]');
        const filtered = actions.filter(a => a.id !== actionId);
        localStorage.setItem('pending_actions', JSON.stringify(filtered));
        resolve();
    });
}

// Push notifications
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        },
        actions: [
            {
                action: 'open',
                title: 'Buka Aplikasi'
            },
            {
                action: 'close',
                title: 'Tutup'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then((clientList) => {
                    // Focus existing window or open new one
                    for (const client of clientList) {
                        if (client.url === event.notification.data.url && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    if (clients.openWindow) {
                        return clients.openWindow(event.notification.data.url);
                    }
                })
        );
    }
});
