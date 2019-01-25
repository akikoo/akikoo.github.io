---
  layout: null
---

'use strict';

var version = 'v1::';

var offlineFundamentals = [
  '/offline.html',
  '/',
  '/work/',
  '/log/',
  '/about/',
  '/assets/css/styles.css',
  '/assets/images/akikoo_logo.jpg',
  '/assets/images/portfolio/2007-eca-tna-booklet-s.png',
  '/assets/images/portfolio/2008-skynet-be-entertainment-s.png',
  '/assets/images/portfolio/2009-energy-research-s.png',
  '/assets/images/portfolio/2009-enrd-ec-europa-eu-s.png',
  '/assets/images/portfolio/2009-reseau-pwdr-be-s.jpg',
  '/assets/images/portfolio/2010-kantor-group-eu-s.png',
  '/assets/images/portfolio/2011-etihadairways-com-s.jpg',
  '/assets/images/portfolio/2015-podio-com-s.png',
  '/assets/images/portfolio/2016-beagle-co-s.png',
  '/assets/images/portfolio/2017-bownty-com-s.png',
  '/assets/images/portfolio/2017-github-code-s.png',
  '/assets/images/portfolio/2017-social-digital-dk-s.jpg',
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
      if (request.headers.get('Accept').indexOf('text/html') !== -1) {
        return caches.match('/offline.html')
      }
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
