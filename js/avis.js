/* NOVA v3 — Avis clients : notes (étoiles) + commentaires.
   Stockés en localStorage (clé "nova_avis") pour la démonstration :
     { "id-produit": [ { nom, note, commentaire, date } ] }
   Quelques avis de démonstration sont semés au premier chargement, puis
   tout ce que le visiteur soumet s'ajoute sur son appareil.
   La logique existante du site est inchangée : ce fichier ajoute
   afficherAvis(idConteneur, idProduit), statsAvis() et ligneAvisCarte()
   (cette dernière est utilisée par boutique.js si présente, pour afficher
   la note moyenne sur les cartes produit). */

const CLE_AVIS = "nova_avis";

/* ---------- Lecture / écriture ---------- */

function lireAvis() {
  try {
    const brut = localStorage.getItem(CLE_AVIS);
    const map = brut ? JSON.parse(brut) : {};
    return (map && typeof map === "object" && !Array.isArray(map)) ? map : {};
  } catch (e) {
    return {};
  }
}

function ecrireAvis(map) {
  try { localStorage.setItem(CLE_AVIS, JSON.stringify(map)); } catch (e) { /* plein / privé */ }
}

/* Avis de démonstration — semés une seule fois, uniquement si le stockage
   ne contient encore rien. Supprimez ce bloc si vous préférez démarrer vide. */
function semerAvisDemo() {
  if (localStorage.getItem(CLE_AVIS)) return;
  ecrireAvis({
    "baskets1-urban-runner": [
      { nom: "Aïcha K.", note: 5, commentaire: "Très légères, je les porte tous les jours pour aller au travail. La semelle amortit vraiment bien sur le bitume.", date: "2026-08-14T10:24:00.000Z" },
      { nom: "Kodjo A.", note: 4, commentaire: "Bonne basket pour le prix. J'aurais aimé un coloris supplémentaire, mais le confort est au rendez-vous.", date: "2026-08-02T16:05:00.000Z" }
    ],
    "smartphone-nova-x5": [
      { nom: "Mariam D.", note: 5, commentaire: "L'écran AMOLED est superbe et la batterie tient facilement deux jours. Livraison rapide à Lomé.", date: "2026-08-20T09:12:00.000Z" },
      { nom: "Yannick T.", note: 4, commentaire: "Fluide pour les jeux et les photos de soirée réussies. Un peu long à charger la première fois, sinon parfait.", date: "2026-07-28T20:41:00.000Z" }
    ],
    "tshirt-coton-bio": [
      { nom: "Fatou B.", note: 5, commentaire: "Le coton est doux et la coupe tombe parfaitement. J'en ai commandé trois, aucune déception après lavage.", date: "2026-08-25T14:30:00.000Z" },
      { nom: "Serge M.", note: 3, commentaire: "Correct pour le prix, mais le coloris kaki tire un peu vers le vert. La taille L correspond bien.", date: "2026-07-15T11:58:00.000Z" }
    ],
    "montre-connectee-nova": [
      { nom: "Ama L.", note: 4, commentaire: "Autonomie annoncée respectée (environ 12 jours pour moi). Le GPS trace bien mes runs du week-end.", date: "2026-08-30T07:47:00.000Z" }
    ],
    "sac-dos-urban-25l": [
      { nom: "David O.", note: 5, commentaire: "Solide, imperméable comme promis sous la pluie de septembre. La poche anti-vol est très pratique en moto.", date: "2026-09-05T18:22:00.000Z" }
    ],
    "latop": [
      { nom: "Nadège K.", note: 4, commentaire: "Suffisant pour mes cours et du montage léger. Écran correct, clavier agréable. Bon rapport qualité-prix.", date: "2026-09-08T13:10:00.000Z" }
    ]
  });
}

/* ---------- API réutilisable ---------- */

function avisPour(idProduit) {
  return lireAvis()[idProduit] || [];
}

function ajouterAvis(idProduit, avis) {
  const map = lireAvis();
  if (!map[idProduit]) map[idProduit] = [];
  map[idProduit].unshift({
    nom: String(avis.nom || "").trim().slice(0, 60),
    note: Math.max(1, Math.min(5, Math.round(Number(avis.note) || 0))),
    commentaire: String(avis.commentaire || "").trim().slice(0, 500),
    date: new Date().toISOString()
  });
  if (map[idProduit].length > 60) map[idProduit].length = 60;
  ecrireAvis(map);
}

function statsAvis(idProduit) {
  const liste = avisPour(idProduit);
  if (!liste.length) return { moyenne: 0, nombre: 0 };
  const somme = liste.reduce(function (s, a) { return s + (Number(a.note) || 0); }, 0);
  return { moyenne: somme / liste.length, nombre: liste.length };
}

/* ---------- Rendu des étoiles ---------- */

function echapperHTML(texte) {
  return String(texte)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function formaterNote(note) {
  return (Math.round(note * 10) / 10).toFixed(1).replace(".", ",");
}

function etoilesHTML(note) {
  note = Math.max(0, Math.min(5, Number(note) || 0));
  let html = '<span class="etoiles" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) {
    html += '<span class="' + (i <= Math.round(note) ? "etoile-pleine" : "etoile-vide") + '">★</span>';
  }
  return html + "</span>";
}

/* Ligne "★ 4,5 (12 avis)" affichée sur les cartes produit.
   boutique.js l'appelle seulement si cette fonction existe. */
function ligneAvisCarte(idProduit) {
  const stats = statsAvis(idProduit);
  if (!stats.nombre) return "";
  return '<div class="carte-avis-ligne">' + etoilesHTML(stats.moyenne) +
         "<span>" + formaterNote(stats.moyenne) + " (" + stats.nombre + " avis)</span></div>";
}

/* ---------- Bloc complet sur la fiche produit ---------- */

function afficherAvis(idConteneur, idProduit) {
  semerAvisDemo();
  const conteneur = document.getElementById(idConteneur);
  if (!conteneur || !getProduitParId(idProduit)) return;

  let noteChoisie = 0;

  function dateFrancaise(iso) {
    try {
      return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return iso || "";
    }
  }

  function initiales(nom) {
    const mots = String(nom).trim().split(/\s+/).filter(Boolean);
    return mots.slice(0, 2).map(function (m) { return m.charAt(0); }).join("").toUpperCase() || "?";
  }

  function rendre() {
    const liste = avisPour(idProduit);
    const stats = statsAvis(idProduit);

    const repartition = [0, 0, 0, 0, 0];
    liste.forEach(function (a) {
      const n = Math.round(Number(a.note));
      if (n >= 1 && n <= 5) repartition[n - 1] += 1;
    });

    const barresHTML = [5, 4, 3, 2, 1].map(function (n) {
      const part = liste.length ? (repartition[n - 1] / liste.length) * 100 : 0;
      return '<div class="avis-repartition-ligne">' +
               "<span>" + n + " ★</span>" +
               '<div class="avis-barre"><div class="avis-barre-remplie" style="width:' + part.toFixed(0) + '%"></div></div>' +
               "<span>" + repartition[n - 1] + "</span>" +
             "</div>";
    }).join("");

    const listeHTML = liste.length
      ? liste.map(function (a) {
          return '<article class="avis-carte">' +
                   '<div class="avis-carte-tete">' +
                     '<div class="avis-avatar" aria-hidden="true">' + echapperHTML(initiales(a.nom)) + "</div>" +
                     "<div>" +
                       '<div class="avis-auteur">' + echapperHTML(a.nom) + "</div>" +
                       '<div class="avis-date">' + dateFrancaise(a.date) + "</div>" +
                     "</div>" +
                   "</div>" +
                   etoilesHTML(a.note) +
                   '<p class="avis-texte">' + echapperHTML(a.commentaire) + "</p>" +
                 "</article>";
        }).join("")
      : '<div class="avis-vide">Aucun avis pour le moment — soyez le premier à donner le vôtre !</div>';

    conteneur.innerHTML =
      '<div class="section-tete">' +
        "<div>" +
          "<h2>Avis clients</h2>" +
          "<p>Les notes et commentaires enregistrés sur cet appareil pour ce produit.</p>" +
        "</div>" +
      "</div>" +
      '<div class="avis-entete">' +
        '<div class="avis-synthese">' +
          '<div class="avis-note-globale">' + (stats.nombre ? formaterNote(stats.moyenne) : "—") +
            ' <small>/ 5</small></div>' +
          etoilesHTML(stats.moyenne) +
          '<div class="avis-compte">' + (stats.nombre
            ? "Basé sur " + stats.nombre + " avis client" + (stats.nombre > 1 ? "s" : "")
            : "Pas encore d'avis") + "</div>" +
          '<div class="avis-repartition">' + barresHTML + "</div>" +
        "</div>" +
        '<form class="avis-form" novalidate>' +
          "<h3>Donner mon avis</h3>" +
          '<div class="avis-champs">' +
            '<div class="avis-champ">' +
              '<label for="avis-nom">Votre nom</label>' +
              '<input type="text" id="avis-nom" maxlength="60" placeholder="Ex. : Awa S." required>' +
            "</div>" +
            '<div class="avis-champ">' +
              "<label>Votre note</label>" +
              '<div class="saisie-etoiles" role="radiogroup" aria-label="Votre note de 1 à 5 étoiles">' +
                [1, 2, 3, 4, 5].map(function (n) {
                  return '<button type="button" class="etoile-btn" data-note="' + n + '" aria-label="' + n + ' étoile' + (n > 1 ? "s" : "") + '">★</button>';
                }).join("") +
              "</div>" +
              '<div class="avis-note-choisie"></div>' +
            "</div>" +
            '<div class="avis-champ pleine">' +
              '<label for="avis-commentaire">Votre commentaire</label>' +
              '<textarea id="avis-commentaire" rows="4" maxlength="500" placeholder="Qualité, confort, livraison… dites-nous tout !" required></textarea>' +
            "</div>" +
          "</div>" +
          '<button type="submit" class="bouton bouton-primaire" style="margin-top:16px;">Publier mon avis</button>' +
          '<p class="avis-note-demo">Avis de démonstration : rien n\'est envoyé en ligne, tout reste dans votre navigateur.</p>' +
        "</form>" +
      "</div>" +
      '<div class="avis-liste">' + listeHTML + "</div>";

    brancherFormulaire();
  }

  function marquerEtoiles(note, classe) {
    conteneur.querySelectorAll(".etoile-btn").forEach(function (btn) {
      btn.classList.toggle(classe, Number(btn.dataset.note) <= note);
    });
  }

  function brancherFormulaire() {
    const form = conteneur.querySelector(".avis-form");
    const saisieEtoiles = conteneur.querySelector(".saisie-etoiles");
    const messageNote = conteneur.querySelector(".avis-note-choisie");
    if (!form) return;

    saisieEtoiles.addEventListener("mouseover", function (e) {
      const btn = e.target.closest(".etoile-btn");
      if (btn) marquerEtoiles(Number(btn.dataset.note), "survol");
    });
    saisieEtoiles.addEventListener("mouseleave", function () {
      marquerEtoiles(0, "survol");
    });
    saisieEtoiles.addEventListener("click", function (e) {
      const btn = e.target.closest(".etoile-btn");
      if (!btn) return;
      noteChoisie = Number(btn.dataset.note);
      marquerEtoiles(noteChoisie, "actif");
      messageNote.textContent = "Note choisie : " + noteChoisie + " / 5";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const champNom = form.querySelector("#avis-nom");
      const champCommentaire = form.querySelector("#avis-commentaire");

      if (!noteChoisie) {
        afficherToast("Choisissez une note en cliquant sur les étoiles", "erreur");
        return;
      }
      if (!champNom.value.trim()) {
        afficherToast("Indiquez votre nom pour publier l'avis", "erreur");
        champNom.focus();
        return;
      }
      if (!champCommentaire.value.trim()) {
        afficherToast("Écrivez un petit commentaire pour accompagner votre note", "erreur");
        champCommentaire.focus();
        return;
      }

      ajouterAvis(idProduit, {
        nom: champNom.value,
        note: noteChoisie,
        commentaire: champCommentaire.value
      });

      noteChoisie = 0;
      rendre();
      afficherToast("Merci ! Votre avis a été publié", "succes");
    });
  }

  rendre();
}

/* Sème les avis de démonstration dès le chargement (une seule fois) pour
   que la note moyenne s'affiche aussi sur les cartes du catalogue
   (index.html, favoris.html), avant même toute visite de fiche produit. */
try { semerAvisDemo(); } catch (e) { /* localStorage indisponible */ }
