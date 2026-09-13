/* NOVA v4 — Promotions et mise en avant sur l'accueil.
   Contenu :
     1. Bannière promo "−20% jusqu'à vendredi !" avec compte à rebours en temps réel.
     2. Section "Nouveautés" : les 3 derniers produits ajoutés (badge "Nouveau"
        posé côté boutique.js via IDS_NOUVEAUTES).
     3. Témoignages clients : les 3 meilleurs avis (note >= 4) issus de
        nova_avis, mis en avant sur l'accueil.
     4. Bloc newsletter : inscription e-mail (démonstration, localStorage).

   Dépend de js/data.js (PRODUITS, getProduitParId), js/boutique.js
   (carteProduitHTML, brancherGrille, afficherToast) et js/avis.js
   (lireAvis, etoilesHTML, echapperHTML).
   La logique existante du site est inchangée : ce fichier n'ajoute que des
   blocs nouveaux, rendus dans des conteneurs dédiés de index.html. */

"use strict";

const CLE_NEWSLETTER = "nova_newsletter";
const CODE_PROMO = "NOVA20";

/* ============================================================
   1. Bannière promo : compte à rebours jusqu'à vendredi
   ============================================================ */

/* Prochaine échéance de la promo : vendredi 23h59m59s.
   Si nous sommes déjà vendredi, l'échéance est ce soir. */
function cibleVendredi() {
  const maintenant = new Date();
  const cible = new Date(maintenant);
  cible.setHours(23, 59, 59, 999);
  const deltaJours = (5 - maintenant.getDay() + 7) % 7; /* 5 = vendredi */
  cible.setDate(cible.getDate() + deltaJours);
  return cible;
}

function deuxChiffres(n) {
  return (n < 10 ? "0" : "") + n;
}

function demarrerCompteRebours() {
  const conteneur = document.getElementById("compte-rebours");
  if (!conteneur) return;

  const elJours = conteneur.querySelector('[data-cr="jours"]');
  const elHeures = conteneur.querySelector('[data-cr="heures"]');
  const elMinutes = conteneur.querySelector('[data-cr="minutes"]');
  const elSecondes = conteneur.querySelector('[data-cr="secondes"]');
  if (!elJours || !elHeures || !elMinutes || !elSecondes) return;

  let cible = cibleVendredi();

  function tic() {
    let reste = cible.getTime() - Date.now();
    if (reste <= 0) {
      cible = cibleVendredi();
      reste = cible.getTime() - Date.now();
    }
    const jours = Math.floor(reste / 86400000);
    const heures = Math.floor(reste / 3600000) % 24;
    const minutes = Math.floor(reste / 60000) % 60;
    const secondes = Math.floor(reste / 1000) % 60;

    elJours.textContent = deuxChiffres(jours);
    elHeures.textContent = deuxChiffres(heures);
    elMinutes.textContent = deuxChiffres(minutes);
    elSecondes.textContent = deuxChiffres(secondes);
  }

  tic();
  setInterval(tic, 1000);
}

/* ============================================================
   2. Section "Nouveautés" : les 3 derniers produits ajoutés
   ============================================================ */

/* Remplit la grille passée en argument avec les cartes des 3 produits
   les plus récents (IDS_NOUVEAUTES est calculé dans boutique.js). */
function afficherNouveautes(idGrille) {
  const grille = document.getElementById(idGrille);
  if (!grille || typeof carteProduitHTML !== "function") return;

  const ids = (typeof IDS_NOUVEAUTES !== "undefined") ? IDS_NOUVEAUTES : [];
  const produits = ids.map(getProduitParId).filter(Boolean);
  if (!produits.length) return;

  grille.innerHTML = produits.map(carteProduitHTML).join("");
  brancherGrille(grille);
}

/* ============================================================
   3. Témoignages clients : 3 avis mis en avant
   ============================================================ */

/* Parcourt tous les avis enregistrés (nova_avis) et retient les mieux notés
   (note >= 4, commentaire assez consistant pour être cité). Déterministe :
   tri par note décroissante puis date décroissante. */
function collecterTemoignages(nombre) {
  if (typeof lireAvis !== "function") return [];
  const map = lireAvis();
  const candidats = [];

  Object.keys(map).forEach(function (idProduit) {
    const liste = Array.isArray(map[idProduit]) ? map[idProduit] : [];
    liste.forEach(function (a) {
      const note = Number(a.note) || 0;
      const texte = String(a.commentaire || "").trim();
      if (note >= 4 && texte.length >= 40 && getProduitParId(idProduit)) {
        candidats.push({
          produit: idProduit,
          nom: String(a.nom || "Client NOVA").trim(),
          note: note,
          commentaire: texte,
          date: String(a.date || "")
        });
      }
    });
  });

  candidats.sort(function (x, y) {
    return (y.note - x.note) || y.date.localeCompare(x.date);
  });
  return candidats.slice(0, nombre || 3);
}

function afficherTemoignages(idSection, idGrille) {
  const section = document.getElementById(idSection);
  const grille = document.getElementById(idGrille);
  if (!section || !grille) return;

  const temoignages = collecterTemoignages(3);
  if (!temoignages.length) {
    section.style.display = "none";
    return;
  }

  function initiales(nom) {
    const mots = String(nom).trim().split(/\s+/).filter(Boolean);
    return mots.slice(0, 2).map(function (m) { return m.charAt(0); }).join("").toUpperCase() || "?";
  }

  grille.innerHTML = temoignages.map(function (t) {
    const p = getProduitParId(t.produit);
    const etoiles = (typeof etoilesHTML === "function") ? etoilesHTML(t.note) : "";
    return (
      '<article class="temoignage-carte">' +
        '<span class="temoignage-guillemet" aria-hidden="true">\u201C</span>' +
        etoiles +
        '<p class="temoignage-texte">' + echapperHTML(t.commentaire) + "</p>" +
        '<div class="temoignage-pied">' +
          '<div class="temoignage-avatar" aria-hidden="true">' + echapperHTML(initiales(t.nom)) + "</div>" +
          "<div>" +
            '<div class="temoignage-nom">' + echapperHTML(t.nom) + "</div>" +
            '<a class="temoignage-produit" href="produit.html?id=' + encodeURIComponent(t.produit) + '">' +
              "à propos de " + echapperHTML(p.nom) +
            "</a>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }).join("");
}

/* ============================================================
   4. Newsletter (démonstration, localStorage)
   ============================================================ */

function lireInscriptionNewsletter() {
  try {
    const brut = localStorage.getItem(CLE_NEWSLETTER);
    const valeur = brut ? JSON.parse(brut) : null;
    return (valeur && typeof valeur === "object" && valeur.email) ? valeur : null;
  } catch (e) {
    return null;
  }
}

function emailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());
}

function afficherEtatNewsletter(form, email, dejaInscrit) {
  form.classList.add("newsletter-inscrit");
  form.innerHTML =
    '<p class="newsletter-succes">' +
      "<strong>" + (dejaInscrit ? "Vous êtes déjà abonné !" : "Merci et bienvenue !") + "</strong>" +
      " La lettre NOVA partira vers " + echapperHTML(email) + "." +
      (dejaInscrit ? "" : " À très vite pour les nouveautés et ventes flash.") +
    "</p>" +
    '<p class="newsletter-note">Démonstration : l\u2019adresse reste dans votre navigateur, rien n\u2019est envoyé en ligne.</p>';
}

function initierNewsletter() {
  const form = document.getElementById("formulaire-newsletter");
  if (!form) return;

  /* Déjà inscrit sur cet appareil → état de confirmation direct. */
  const existante = lireInscriptionNewsletter();
  if (existante && typeof echapperHTML === "function") {
    afficherEtatNewsletter(form, existante.email, true);
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const champ = form.querySelector("input[type='email']");
    const email = champ ? champ.value.trim() : "";

    if (!emailValide(email)) {
      afficherToast("Entrez une adresse e-mail valide (ex. : awa@exemple.tg)", "erreur");
      if (champ) champ.focus();
      return;
    }
    const deja = lireInscriptionNewsletter();
    if (deja) {
      afficherEtatNewsletter(form, deja.email, true);
      return;
    }
    try {
      localStorage.setItem(CLE_NEWSLETTER, JSON.stringify({
        email: email,
        date: new Date().toISOString()
      }));
    } catch (err) { /* stockage plein ou indisponible : on continue la démo */ }

    afficherToast("Bienvenue ! Votre inscription à la lettre NOVA est confirmée", "succes");
    afficherEtatNewsletter(form, email, false);
  });
}

/* ============================================================
   Démarrage — les scripts sont chargés en fin de <body> :
   le DOM des blocs v4 existe déjà, on rend immédiatement.
   ============================================================ */
demarrerCompteRebours();
afficherNouveautes("grille-nouveautes");
afficherTemoignages("section-temoignages", "grille-temoignages");
initierNewsletter();
