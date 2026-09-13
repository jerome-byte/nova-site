/* Gestion du panier NOVA — persistance via localStorage.
   Le panier est un objet { cle: quantite } où la clé vaut :
   - "id-produit"                     → produit simple (inchangé, logique d'origine)
   - "id-produit|Taille|Couleur"      → produit à variantes (vêtements, v2)
   Les paniers plus anciens (clés simples) restent compatibles. */

const CLE_PANIER = "nova_panier";
const SEPARATEUR_VARIANTE = "|";

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

/* ---------- Clés de panier & variantes (v2) ---------- */

function fabriqueCle(id, variante) {
  if (variante && variante.taille && variante.couleur) {
    return id + SEPARATEUR_VARIANTE + variante.taille + SEPARATEUR_VARIANTE + variante.couleur;
  }
  return id;
}

function decoderCle(cle) {
  const parties = String(cle).split(SEPARATEUR_VARIANTE);
  return { id: parties[0], taille: parties[1] || null, couleur: parties[2] || null };
}

/* Stock disponible pour un produit, ou pour une variante précise.
   Sans variante sur un produit à variantes, renvoie le stock total. */
function stockPour(id, taille, couleur) {
  const p = getProduitParId(id);
  if (!p) return 0;
  if (p.variantes && p.variantes.length) {
    if (taille && couleur) {
      const v = p.variantes.find(function (x) { return x.taille === taille && x.couleur === couleur; });
      return v ? v.stock : 0;
    }
    return stockTotalProduit(p);
  }
  return p.stock;
}

/* Stock total d'un produit (somme des variantes si elles existent). */
function stockTotalProduit(p) {
  if (!p) return 0;
  if (p.variantes && p.variantes.length) {
    return p.variantes.reduce(function (s, v) { return s + v.stock; }, 0);
  }
  return p.stock;
}

/* ---------- Opérations panier ---------- */

function ajouterAuPanier(id, quantite, variante) {
  const cle = fabriqueCle(id, variante);
  const stock = stockPour(id, variante && variante.taille, variante && variante.couleur);
  const panier = lirePanier();
  const actuel = panier[cle] || 0;
  const nouvelle = Math.min(actuel + (quantite || 1), stock);
  panier[cle] = nouvelle;
  ecrirePanier(panier);
  return { ok: nouvelle > actuel, quantite: nouvelle, stock: stock };
}

function definirQuantite(cle, quantite) {
  const info = decoderCle(cle);
  const stock = stockPour(info.id, info.taille, info.couleur);
  const panier = lirePanier();
  if (quantite <= 0) {
    delete panier[cle];
  } else {
    panier[cle] = Math.min(quantite, stock);
  }
  ecrirePanier(panier);
}

function retirerDuPanier(cle) {
  const panier = lirePanier();
  delete panier[cle];
  ecrirePanier(panier);
}

function viderPanier() {
  localStorage.removeItem(CLE_PANIER);
  mettreAJourBadge();
}

function lignesPanier() {
  const panier = lirePanier();
  return Object.keys(panier)
    .map(function (cle) {
      const info = decoderCle(cle);
      const produit = getProduitParId(info.id);
      if (!produit) return null;
      return {
        cle: cle,
        produit: produit,
        quantite: panier[cle],
        taille: info.taille,
        couleur: info.couleur
      };
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
