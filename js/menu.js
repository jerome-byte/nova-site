/* NOVA — Menu mobile (toggle + drawer)
   Gère l'ouverture/fermeture du panneau coulissant sur mobile.
   v2 : le drawer embarque aussi la barre de recherche et le lien Favoris. */

document.addEventListener("DOMContentLoaded", function () {
  // Injecter le markup du drawer si non présent (évite de répéter dans chaque HTML)
  if (!document.getElementById("drawer-menu")) {
    const drawer = document.createElement("aside");
    drawer.id = "drawer-menu";
    drawer.className = "drawer-menu";
    drawer.setAttribute("aria-hidden", "true");

    // Récupérer les liens de navigation depuis le header existant
    const navOriginale = document.querySelector(".entete .nav-liens");
    const liensHTML = navOriginale ? navOriginale.innerHTML : `
      <a href="index.html">Boutique</a>
      <a href="index.html#categories">Catégories</a>
      <a href="contact.html">Contact</a>`;

    drawer.innerHTML = `
      <div class="drawer-menu-tete">
        <a href="index.html" class="logo">NOVA<span>MODE &amp; TECH</span></a>
        <button type="button" class="bouton-menu actif" id="bouton-menu-fermer" aria-label="Fermer le menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <form class="recherche-form recherche-drawer" role="search" action="index.html" method="get">
        <input type="search" class="recherche-input" name="q" placeholder="Rechercher un produit…" aria-label="Rechercher un produit" autocomplete="off">
      </form>
      <nav class="nav-liens">${liensHTML}</nav>
      <a href="favoris.html" class="lien-panier">
        Favoris <span class="badge-panier badge-favoris" data-badge-favoris style="display:none;">0</span>
      </a>
      <a href="panier.html" class="lien-panier">
        Panier <span class="badge-panier" data-badge-panier style="display:none;">0</span>
      </a>`;

    document.body.appendChild(drawer);

    const overlay = document.createElement("div");
    overlay.id = "overlay-menu";
    overlay.className = "overlay-menu";
    document.body.appendChild(overlay);
  }

  const boutonOuvrir = document.getElementById("bouton-menu-ouvrir");
  const boutonFermer = document.getElementById("bouton-menu-fermer");
  const drawer = document.getElementById("drawer-menu");
  const overlay = document.getElementById("overlay-menu");

  function ouvrirMenu() {
    if (!drawer) return;
    drawer.classList.add("ouvert");
    overlay.classList.add("ouvert");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function fermerMenu() {
    if (!drawer) return;
    drawer.classList.remove("ouvert");
    overlay.classList.remove("ouvert");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function basculerMenu() {
    if (drawer && drawer.classList.contains("ouvert")) {
      fermerMenu();
    } else {
      ouvrirMenu();
    }
  }

  if (boutonOuvrir) boutonOuvrir.addEventListener("click", basculerMenu);
  if (boutonFermer) boutonFermer.addEventListener("click", fermerMenu);
  if (overlay) overlay.addEventListener("click", fermerMenu);

  // Fermer sur Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermerMenu();
  });

  // Fermer après clic sur un lien du drawer
  if (drawer) {
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", fermerMenu);
    });
  }

  // Exposer pour usage externe éventuel
  window.NOVAMenu = { ouvrir: ouvrirMenu, fermer: fermerMenu, basculer: basculerMenu };
});
