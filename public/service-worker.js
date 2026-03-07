const CACHE_NAME = "appV2";
const STATIC_ASSETS = [
    "/index.html",
    "/index.css",
    "/",
];

// Install: cache only essential static assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    // Activate immediately without waiting for old service worker to stop
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== "user-image-cache")
                    .map((name) => caches.delete(name))
            );
        })
    );
    // Take control of all pages immediately
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const requestUrl = new URL(event.request.url);

    // Skip non-GET requests (POST login/signup/API calls should never be cached)
    if (event.request.method !== "GET") {
        return;
    }

    // Skip API calls — never cache backend requests
    if (requestUrl.pathname.startsWith("/api/")) {
        return;
    }

    // Cache dicebear avatar images
    if (
        requestUrl.origin === "https://api.dicebear.com" &&
        requestUrl.pathname === "/5.x/initials/svg"
    ) {
        event.respondWith(
            caches.open("user-image-cache").then((cache) => {
                return cache.match(event.request).then((response) => {
                    return (
                        response ||
                        fetch(event.request).then((response) => {
                            cache.put(event.request, response.clone());
                            return response;
                        })
                    );
                });
            })
        );
        return;
    }

    // For navigation requests (HTML pages): always go network-first
    // This ensures that after login, the user always gets the fresh page
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match("/index.html");
            })
        );
        return;
    }

    // For other static assets: use stale-while-revalidate
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request)
                .then((networkResponse) => {
                    // Update cache with fresh response
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }
                    return networkResponse;
                })
                .catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});
