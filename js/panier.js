/* Gestion du panier NOVA — persistance via localStorage.
   Le panier est un objet { "id-produit": quantite } */

const CLE_PANIER = "nova_panier";

function lirePanier() {
  try {
    const brut = localStorage.getItem(CLE_PANIER);
    return brut ? JSON.parse(brut) : {};
  } catch (e) {
    return {};
  }
}

function ecrirePanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
  mettreAJourBadge();
}

function ajouterAuPanier(id, quantite) {
  const panier = lirePanier();
  panier[id] = (panier[id] || 0) + (quantite || 1);
  ecrirePanier(panier);
}

function definirQuantite(id, quantite) {
  const panier = lirePanier();
  if (quantite <= 0) {
    delete panier[id];
  } else {
    panier[id] = quantite;
  }
  ecrirePanier(panier);
}

function retirerDuPanier(id) {
  const panier = lirePanier();
  delete panier[id];
  ecrirePanier(panier);
}

function viderPanier() {
  localStorage.removeItem(CLE_PANIER);
  mettreAJourBadge();
}

function lignesPanier() {
  const panier = lirePanier();
  return Object.keys(panier)
    .map(function (id) {
      const produit = getProduitParId(id);
      if (!produit) return null;
      return { produit: produit, quantite: panier[id] };
    })
    .filter(Boolean);
}

function totalArticles() {
  const panier = lirePanier();
  return Object.values(panier).reduce(function (a, b) { return a + b; }, 0);
}

function sousTotalPanier() {
  return lignesPanier().reduce(function (somme, ligne) {
    return somme + ligne.produit.prix * ligne.quantite;
  }, 0);
}

function fraisLivraison(sousTotal) {
  if (sousTotal === 0) return 0;
  return sousTotal >= 50000 ? 0 : 2500;
}

function mettreAJourBadge() {
  const badges = document.querySelectorAll("[data-badge-panier]");
  const total = totalArticles();
  badges.forEach(function (b) {
    b.textContent = total;
    b.style.display = total > 0 ? "flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", mettreAJourBadge);
