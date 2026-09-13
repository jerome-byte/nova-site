/* NOVA v3 — Effets d'apparition au scroll + squelettes de chargement d'images.
   Deux mécanismes discrets, respectueux de prefers-reduced-motion, qui
   n'altèrent AUCUNE logique existante (les pages ne sont pas modifiées :
   un MutationObserver capte les cartes re-rendues par filtres/tris/avis).

   1. Apparition au scroll : les éléments ciblés reçoivent ".reveal" puis
      ".reveal-visible" quand ils entrent dans l'écran (fade + léger glissement).
      Les éléments déjà à l'écran au chargement restent statiques (aucun flash).

   2. Squelette : les images des visuels produits sont invisibles puis fondent
      (".img-chargee") quand elles sont prêtes ; le conteneur reçoit
      ".img-prete" pour arrêter le shimmer. En cas d'image cassée, le fond
      pastel du produit reste visible (".img-echouee"). */

(function () {
  "use strict";

  const mouvementReduit = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Apparition au scroll ---------- */

  const SELECTEURS_REVEAL = [
    ".carte-produit",
    ".section-tete",
    ".item-confiance",
    ".page-titre",
    ".galerie-produit",
    ".produit-info",
    ".panier-vide",
    ".avis-entete",
    ".avis-carte",
    ".temoignage-carte",
    ".newsletter-bloc"
  ].join(",");

  let observateurReveal = null;

  function revelerParLot(elements, rapide) {
    let compteur = 0;
    elements.forEach(function (el) {
      el.classList.add("reveal-visible");
      if (compteur > 0 && !mouvementReduit) {
        const pas = rapide ? 30 : 60;
        const plafond = rapide ? 180 : 300;
        const delai = Math.min(compteur * pas, plafond);
        el.style.transitionDelay = delai + "ms";
        setTimeout(function () { el.style.transitionDelay = ""; }, delai + 700);
      }
      compteur += 1;
    });
  }

  function revelerElement(el, rapide) {
    if (el.classList.contains("reveal") || el.classList.contains("reveal-visible")) return;
    if (mouvementReduit || !observateurReveal) {
      el.classList.add("reveal-visible");
      return;
    }
    el.classList.add("reveal");
    if (rapide) el.classList.add("reveal-rapide");
    observateurReveal.observe(el);
  }

  function initReveal() {
    const cibles = Array.prototype.slice.call(document.querySelectorAll(SELECTEURS_REVEAL));

    if (mouvementReduit || !("IntersectionObserver" in window)) {
      cibles.forEach(function (el) { el.classList.add("reveal-visible"); });
      return;
    }

    observateurReveal = new IntersectionObserver(function (entrees) {
      const aReveler = entrees
        .filter(function (e) { return e.isIntersecting; })
        .map(function (e) { return e.target; });
      if (aReveler.length) {
        revelerParLot(aReveler, false);
        aReveler.forEach(function (el) { observateurReveal.unobserve(el); });
      }
    }, { rootMargin: "0px 0px -36px 0px", threshold: 0.06 });

    cibles.forEach(function (el) {
      /* Déjà (presque) à l'écran à l'ouverture → statique, pas d'animation,
         pour éviter tout scintillement du contenu au-dessus de la ligne de flottaison. */
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        el.classList.add("reveal-visible");
      } else {
        el.classList.add("reveal");
        observateurReveal.observe(el);
      }
    });
  }

  /* Capte les éléments ajoutés dynamiquement : cartes re-rendues par la
     recherche / le tri, avis soumis, galerie, vu récemment… sans toucher
     au code des pages. Animation plus courte ("reveal-rapide") pour ces
     rafraîchissements. */
  function initMutationReveal() {
    if (!("MutationObserver" in window) || mouvementReduit) return;

    const mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (noeud) {
          if (noeud.nodeType !== 1) return;

          if (noeud.matches && noeud.matches(SELECTEURS_REVEAL)) {
            revelerElement(noeud, true);
          }
          if (noeud.querySelectorAll) {
            noeud.querySelectorAll(SELECTEURS_REVEAL).forEach(function (sous) {
              revelerElement(sous, true);
            });
          }

          /* Nouvelles images → brancher le squelette (fondu au chargement) */
          brancherImages(noeud);
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- 2. Squelettes de chargement d'images ---------- */

  const HOTES_SQUELETTE = ".carte-produit-visuel, .mini-visuel, .galerie-principal";

  function marquerImage(img) {
    if (img.dataset.squeletteBranche) return;
    img.dataset.squeletteBranche = "1";

    const hote = img.closest(HOTES_SQUELETTE) || img.parentElement;

    function prete() {
      img.classList.add("img-chargee");
      if (hote) hote.classList.add("img-prete");
    }
    function echouee() {
      img.classList.add("img-echouee", "img-chargee");
      if (hote) hote.classList.add("img-prete");
    }

    if (img.complete) {
      if (img.naturalWidth > 0) prete(); else echouee();
    } else {
      img.addEventListener("load", prete);
      img.addEventListener("error", echouee);
    }
  }

  function brancherImages(racine) {
    if (!racine || !racine.querySelectorAll) return;
    if (racine.tagName === "IMG") { marquerImage(racine); return; }
    racine.querySelectorAll("img").forEach(marquerImage);
  }

  /* ---------- Démarrage ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    brancherImages(document);
    initReveal();
    initMutationReveal();
  });
  /* ---------- NOVA v6 : PWA — enregistrement du Service Worker ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function () {
      /* Environnement sans Service Worker (file://, aperçu intégré…) : silencieux */
    });
  });
}
})();
