---
  layout: null
---

'use strict';

var version = 'v1::';

var offlineFundamentals = [
  '/offline/',
  '/',
  '/work/',
  '/log/',
  '/about/',
  '/assets/css/styles.css',
  '/assets/images/akikoo_logo.jpg',
  {% for file in site.static_files %}
  {% if file.path contains '/assets/images/portfolio' %}
  '{{ file.path }}',
  {% endif %}
  {% endfor %}
  {% for category in site.categories %}
    '/log/category/{{category[0]|downcase}}/',
  {% endfor %}
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(version + 'fundamentals').then(function (cache) {
    return cache.addAll(offlineFundamentals);
  }).then(function () {}));
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(caches.match(event.request).then(function (cached) {
    var networked = fetch(event.request)
      .then(fetchedFromNetwork, unableToResolve)
      .catch(unableToResolve);

    return cached || networked;

    function fetchedFromNetwork(response) {
      var cacheCopy = response.clone();

      caches.open(version + 'pages').then(function add(cache) {
          cache.put(event.request, cacheCopy);
        }).then(function () {});

      return response;
    }

    function unableToResolve () {
      return caches.match('/offline/')
    }
  }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return !key.startsWith(version);
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {})
  );
});
