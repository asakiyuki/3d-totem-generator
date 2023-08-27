self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('3DTotemGenerator').then(c => {
            return c.addAll([
                '/',
                'index.html'
            ])
        })
    )
})

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
})