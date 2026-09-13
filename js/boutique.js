/* NOVA — composants de boutique v2
   Notifications toast, favoris (localStorage), badge de stock sur les cartes,
   rendu partagé des cartes produit, "vu récemment", barre de recherche.
   Dépend de js/data.js et js/panier.js. La logique existante du site est inchangée :
   ce fichier n'ajoute que des briques réutilisables. */

const CLE_FAVORIS = "nova_favoris";
const CLE_VUS = "nova_vus_recemment";
const SEUIL_STOCK_URGENCE = 5; /* en dessous de ce niveau : badge "Plus que X en stock !" */

/* ---------- Utilitaires ---------- */

function normaliserTexte(chaine) {
  return String(chaine || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ---------- Notifications toast ---------- */

let conteneurToast = null;

function assurerConteneurToast() {
  if (conteneurToast && document.body.contains(conteneurToast)) return conteneurToast;
  conteneurToast = document.createElement("div");
  conteneurToast.className = "toast-conteneur";
  conteneurToast.setAttribute("aria-live", "polite");
  document.body.appendChild(conteneurToast);
  return conteneurToast;
}

function afficherToast(message, type, lien) {
  type = type || "succes";
  const conteneur = assurerConteneurToast();
  const toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  const symbole = type === "erreur" ? "!" : (type === "info" ? "i" : "✓");
  toast.innerHTML =
    '<span class="toast-icone">' + symbole + "</span>" +
    '<span class="toast-message">' + message + "</span>" +
    (lien && lien.href
      ? ' <a class="toast-lien" href="' + lien.href + '">' + (lien.texte || "Voir") + "</a>"
      : "");
  conteneur.appendChild(toast);
  while (conteneur.children.length > 3) conteneur.removeChild(conteneur.firstChild);
  setTimeout(function () {
    toast.classList.add("toast-sortie");
    setTimeout(function () { toast.remove(); }, 320);
  }, 3200);
}

/* ---------- Favoris / Wishlist ---------- */

function lireFavoris() {
  try {
    const brut = localStorage.getItem(CLE_FAVORIS);
    const liste = brut ? JSON.parse(brut) : [];
    return Array.isArray(liste) ? liste : [];
  } catch (e) {
    return [];
  }
}

function ecrireFavoris(liste) {
  localStorage.setItem(CLE_FAVORIS, JSON.stringify(liste));
  mettreAJourBadgeFavoris();
}

function estFavori(id) {
  return lireFavoris().indexOf(id) !== -1;
}

function basculerFavori(id) {
  const produit = getProduitParId(id);
  let liste = lireFavoris();
  if (estFavori(id)) {
    liste = liste.filter(function (x) { return x !== id; });
    ecrireFavoris(liste);
    afficherToast((produit ? produit.nom + " " : "") + "retiré des favoris", "info");
    return false;
  }
  liste.unshift(id);
  ecrireFavoris(liste);
  afficherToast((produit ? produit.nom + " " : "") + "ajouté aux favoris", "succes", { href: "favoris.html", texte: "Voir mes favoris" });
  return true;
}

function mettreAJourBadgeFavoris() {
  const total = lireFavoris().length;
  document.querySelectorAll("[data-badge-favoris]").forEach(function (b) {
    b.textContent = total;
    b.style.display = total > 0 ? "flex" : "none";
  });
}

function synchroniserBoutonsFavori(id, actif) {
  document.querySelectorAll('[data-favori="' + id + '"]').forEach(function (b) {
    b.classList.toggle("actif", actif);
    b.setAttribute("aria-pressed", String(actif));
  });
}

/* ---------- Badge de stock (cartes) ---------- */

function badgeStockHTML(p) {
  const total = stockTotalProduit(p);
  if (total <= 0) return '<span class="badge-stock rupture">Rupture de stock</span>';
  if (total <= SEUIL_STOCK_URGENCE) {
    return '<span class="badge-stock">Plus que ' + total + " en stock !</span>";
  }
  return "";
}

/* ---------- Rendu partagé des cartes produit ---------- */

const SVG_COEUR =
  '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>';

function boutonFavoriHTML(id) {
  const actif = estFavori(id);
  return (
    '<button type="button" class="bouton-favori' + (actif ? " actif" : "") + '" data-favori="' + id + '"' +
    ' aria-pressed="' + actif + '" aria-label="' + (actif ? "Retirer des favoris" : "Ajouter aux favoris") + '">' +
    SVG_COEUR + "</button>"
  );
}

function carteProduitHTML(p) {
  const total = stockTotalProduit(p);
  const lien = "produit.html?id=" + encodeURIComponent(p.id);
  return (
    '<article class="carte-produit">' +
      '<div class="carte-produit-visuel" style="background:' + p.couleurFond + '">' +
        '<a href="' + lien + '" class="carte-produit-lien" aria-label="' + p.nom + '">' + iconeSVG(p.icone, p.couleur, p.image) + "</a>" +
        badgeStockHTML(p) +
        boutonFavoriHTML(p.id) +
      "</div>" +
      '<div class="carte-produit-corps">' +
        '<span class="carte-produit-cat" style="color:' + p.couleur + '">' + p.categorie + "</span>" +
        '<a href="' + lien + '"><h3 class="carte-produit-nom">' + p.nom + "</h3></a>" +
        '<p class="carte-produit-accroche">' + p.accroche + "</p>" +
        '<div class="carte-produit-bas">' +
          '<span class="carte-produit-prix">' + formatPrix(p.prix) + "</span>" +
          '<button class="bouton-ajout-rapide" title="' + (total > 0 ? "Ajouter au panier" : "Produit épuisé") + '" data-ajout="' + p.id + '"' + (total <= 0 ? " disabled" : "") + ">+</button>" +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

/* Ajout rapide : pour un produit à variantes, choisit la première variante disponible. */
function ajoutRapide(id) {
  const p = getProduitParId(id);
  if (!p) return;
  let variante = null;
  if (p.variantes && p.variantes.length) {
    variante = p.variantes.find(function (v) { return v.stock > 0; }) || null;
    if (!variante) {
      afficherToast(p.nom + " est en rupture de stock", "erreur");
      return;
    }
  }
  const resultat = ajouterAuPanier(id, 1, variante);
  if (resultat.ok) {
    const detail = variante ? " (Taille " + variante.taille + " · " + variante.couleur + ")" : "";
    afficherToast(p.nom + detail + " ajouté au panier", "succes", { href: "panier.html", texte: "Voir le panier" });
  } else {
    afficherToast("Stock maximum atteint pour " + p.nom, "info");
  }
}

/* Branche une grille de cartes : favoris + ajout rapide (délégation d'événements). */
function brancherGrille(conteneur) {
  if (!conteneur || conteneur.dataset.grilleBranchee) return;
  conteneur.dataset.grilleBranchee = "1";
  conteneur.addEventListener("click", function (e) {
    const coeur = e.target.closest("[data-favori]");
    if (coeur) {
      const actif = basculerFavori(coeur.dataset.favori);
      synchroniserBoutonsFavori(coeur.dataset.favori, actif);
      if (typeof rafraichirPageFavoris === "function") rafraichirPageFavoris();
      return;
    }
    const ajout = e.target.closest("[data-ajout]");
    if (ajout && !ajout.disabled) {
      ajoutRapide(ajout.dataset.ajout);
    }
  });
}

/* ---------- Vu récemment ---------- */

function lireVus() {
  try {
    const brut = localStorage.getItem(CLE_VUS);
    const liste = brut ? JSON.parse(brut) : [];
    return Array.isArray(liste) ? liste : [];
  } catch (e) {
    return [];
  }
}

function ecrireVus(liste) {
  localStorage.setItem(CLE_VUS, JSON.stringify(liste));
}

/* Mémorise la fiche produit consultée (appelé depuis produit.html). */
function enregistrerVue(id) {
  if (!id || !getProduitParId(id)) return;
  let liste = lireVus().filter(function (x) { return x !== id; });
  liste.unshift(id);
  ecrireVus(liste.slice(0, 8));
}

/* Affiche la section "Vu récemment" de l'accueil (masquée si aucune visite). */
function afficherVusRecemment(idSection, idGrille) {
  const section = document.getElementById(idSection);
  const grille = document.getElementById(idGrille);
  if (!section || !grille) return;
  const produits = lireVus().map(getProduitParId).filter(Boolean);
  if (produits.length === 0) {
    section.style.display = "none";
    return;
  }
  grille.innerHTML = produits.map(carteProduitHTML).join("");
  brancherGrille(grille);
  section.style.display = "";
}

/* ---------- Barre de recherche (filtre instantané côté boutique) ---------- */

function initRecherche() {
  const input = document.querySelector("form[data-recherche] input[name='q']");
  if (!input) return;

  /* Préremplissage depuis l'URL (index.html?q=...) */
  const q = new URLSearchParams(location.search).get("q");
  if (q) {
    document.querySelectorAll("form[data-recherche] input[name='q']").forEach(function (i) { i.value = q; });
  }

  /* Sur la boutique : filtre instantané ; ailleurs : le formulaire envoie vers index.html?q=… */
  if (document.getElementById("grille-produits") && typeof appliquerFiltresCatalogue === "function") {
    let minuteur = null;
    input.addEventListener("input", function () {
      clearTimeout(minuteur);
      minuteur = setTimeout(appliquerFiltresCatalogue, 140);
    });
    input.closest("form[data-recherche]").addEventListener("submit", function (e) {
      e.preventDefault();
      clearTimeout(minuteur);
      appliquerFiltresCatalogue();
    });
    if (q) {
      appliquerFiltresCatalogue();
      setTimeout(function () {
        const cible = document.getElementById("categories");
        if (cible) cible.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  mettreAJourBadgeFavoris();
  initRecherche();
});
