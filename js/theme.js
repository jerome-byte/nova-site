/* NOVA v3 — Mode sombre / mode jour
   Ce script est chargé dans <head> : il applique le thème AVANT le premier
   rendu de la page (aucun flash blanc). Le choix est mémorisé dans
   localStorage (clé "nova_theme") ; à défaut, la préférence système est
   respectée ; sinon le site s'affiche en mode jour.
   Logique du site inchangée : ce fichier ne fait qu'ajouter un attribut
   data-theme sur <html> et répondre aux clics sur [data-bascule-theme]. */

(function () {
  const CLE_THEME = "nova_theme";

  function lireThemeSauvegarde() {
    try { return localStorage.getItem(CLE_THEME); } catch (e) { return null; }
  }

  function prefereSombre() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function appliquerTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode === "sombre" ? "sombre" : "jour");
  }

  /* Thème initial : choix enregistré → préférence système → mode jour */
  appliquerTheme(lireThemeSauvegarde() || (prefereSombre() ? "sombre" : "jour"));

  /* Marqueur : apparitions au scroll et squelettes d'images actifs uniquement avec JS.
     Sans JavaScript, tout le contenu reste visible normalement. */
  document.documentElement.classList.add("a-animations");

  function basculerTheme() {
    const sombreActif = document.documentElement.getAttribute("data-theme") === "sombre";
    const nouveau = sombreActif ? "jour" : "sombre";
    appliquerTheme(nouveau);
    try { localStorage.setItem(CLE_THEME, nouveau); } catch (e) { /* stockage indisponible */ }
    return nouveau;
  }

  /* Délégation sur document : fonctionne aussi pour le bouton injecté
     plus tard dans le drawer mobile (js/menu.js). */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-bascule-theme]")) basculerTheme();
  });

  /* Exposé pour usage éventuel (console, extensions) */
  window.NOVALumiere = { basculer: basculerTheme };
})();
