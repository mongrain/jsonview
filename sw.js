console.log('Script loaded!')
var cacheStorageKey = 'minimal-pwa-8'

var cacheList = [
  '/jsonviewer/static/css/2.36fcf5ee.chunk.css',
  '/jsonviewer/static/css/main.538285c4.chunk.css',
  '/jsonviewer/static/js/2.4edbeab5.chunk.js',
  '/jsonviewer/static/js/main.7b6a177e.chunk.js',
  '/jsonviewer/static/js/runtime-main.23fe0c48.js',
  '/jsonviewer/static/css/static/media/jsoneditor-icons.2b9b4872.svg',
  '/jsonviewer/icon.png',
  '/jsonviewer/index.html'
]

self.addEventListener('install', function(e) {
  console.log('Cache event!')
  e.waitUntil(
    caches.open(cacheStorageKey).then(function(cache) {
      console.log('Adding to Cache:', cacheList)
      if (cache.addAll) {
        return cache.addAll(cacheList)
      }
      return;
    }).then(function() {
      console.log('Skip waiting!')
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log('Activate event')
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheStorageKey) {
            return caches.delete(name)
          }
        })
      })
    ).then(() => {
      console.log('Clients claims.')
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', function(e) {
  var request = e.request;
  if (request.method !== 'GET') {
    return e.respondWith(fetch(request));
  }
  // console.log('Fetch event:', e.request.url)
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response != null) {
        console.log('Using cache for:', e.request.url)
        return response
      }
      console.log('Fallback to fetch:', e.request.url)
      return fetch(e.request.url)
    })
  )
})
