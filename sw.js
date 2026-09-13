/* ============================================================
   NOVA — Service Worker (PWA basique : hors-ligne + rapidité)
   Stratégie : cache d'abord, réseau en secours ; les ressources
   locales visitées sont ajoutées au cache au fil de la navigation.
   Pour publier une mise à jour du site : renommez le cache
   "nova-cache-v1" en "nova-cache-v2" (les anciens caches sont
   alors supprimés automatiquement à l'activation).
   ============================================================ */

var CACHE_NOVA = "nova-cache-v2";

var FICHIERS_HORS_LIGNE = [
  "index.html",
  "produit.html",
  "panier.html",
  "paiement.html",
  "confirmation.html",
  "contact.html",
  "favoris.html",
  "mentions-legales.html",
  "confidentialite.html",
  "cgv.html",
  "css/style.css",
  "js/theme.js",
  "js/data.js",
  "js/icones.js",
  "js/panier.js",
  "js/boutique.js",
  "js/avis.js",
  "js/promotions.js",
  "js/galerie.js",
  "js/effets.js",
  "js/menu.js",
  "manifest.json",
  "favicon.svg",
  "favicon-32.png",
  "apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

/* Installation : pré-cache du cœur du site */
self.addEventListener("install", function (evenement) {
  evenement.waitUntil(
    caches.open(CACHE_NOVA)
      .then(function (cache) { return cache.addAll(FICHIERS_HORS_LIGNE); })
      .then(function () { return self.skipWaiting(); })
  );
});

/* Activation : suppression des anciens caches */
self.addEventListener("activate", function (evenement) {
  evenement.waitUntil(
    caches.keys()
      .then(function (cles) {
        return Promise.all(
          cles
            .filter(function (cle) { return cle !== CACHE_NOVA; })
            .map(function (cle) { return caches.delete(cle); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

/* Requêtes : cache d'abord, sinon réseau (+ mise en cache local) */
self.addEventListener("fetch", function (evenement) {
  var requete = evenement.request;
  if (requete.method !== "GET") return;

  evenement.respondWith(
    caches.match(requete).then(function (reponseCache) {
      if (reponseCache) return reponseCache;

      return fetch(requete).then(function (reponse) {
        /* On ne met en cache que les réponses locales valides */
        if (reponse && reponse.ok && requete.url.indexOf(self.location.origin) === 0) {
          var copie = reponse.clone();
          caches.open(CACHE_NOVA).then(function (cache) {
            cache.put(requete, copie);
          });
        }
        return reponse;
      }).catch(function () {
        /* Hors ligne : une page demandée → accueil en secours */
        if (requete.mode === "navigate") {
          return caches.match("index.html");
        }
      });
    })
  );
});
