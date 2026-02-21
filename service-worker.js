const CACHE_NAME = 'habit-piggy-v1';
const urlsToCache = [
  './',
  './index.html',
  './calendar.html',
  './heatmap.html',
  './reports.html',
  './logs.html',
  './recipes.html',
  './piggy.html',
  './css/styles.css',
  './js/config.js',
  './js/storage.js',
  './js/habits.js',
  './js/piggy.js',
  './js/weekly.js',
  './js/app.js',
  './js/calendar.js',
  './js/heatmap.js',
  './js/reports.js',
  './js/logs.js',
  './js/recipes.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

