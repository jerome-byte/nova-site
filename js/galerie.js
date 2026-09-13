/* NOVA v3 — Galerie multi-images sur la fiche produit.
   Construit plusieurs vues à partir des données EXISTANTES du produit
   (aucune image inventée, tout fonctionne même hors ligne) :
     1. Photo plein cadre      (l'image du produit, cover)
     2. Produit seul           (l'image entière, contain, sur fond pastel)
     3. Détail zoomé           (l'image agrandie, transform: scale)
     4. Illustration vectorielle (icône SVG de la catégorie)
   Miniatures cliquables + flèches + compteur. La logique de la fiche
   produit (variantes, panier, favoris, vu récemment) est inchangée. */

function vuesGalerie(produit) {
  const vues = [];
  if (produit.image) {
    vues.push({ type: "img", src: produit.image, label: "Photo", imgStyle: "object-fit:cover;" });
    vues.push({ type: "img", src: produit.image, label: "Produit seul", imgStyle: "object-fit:contain;padding:44px;" });
    vues.push({ type: "img", src: produit.image, label: "Détail zoomé", imgStyle: "object-fit:cover;transform:scale(1.8);transform-origin:50% 32%;" });
  }
  vues.push({ type: "icone", label: "Illustration" });
  return vues;
}

function contenuVueGalerie(produit, vue, miniature) {
  if (vue.type === "img") {
    /* En miniature, un padding réduit pour que la vue "produit seul" reste lisible */
    const style = miniature ? vue.imgStyle.replace(/padding:\d+px/, "padding:5px") : vue.imgStyle;
    return '<img src="' + vue.src + '" alt="' + produit.nom + " — " + vue.label + '"' +
           ' style="width:100%;height:100%;display:block;' + style + '">';
  }
  return '<div style="width:70%;height:70%;display:flex;align-items:center;justify-content:center;">' +
           iconeSVG(produit.icone, produit.couleur, "") +
         "</div>";
}

function afficherGalerie(conteneur, produit) {
  if (!conteneur || !produit) return;
  const vues = vuesGalerie(produit);
  if (!vues.length) return;
  let indexVue = 0;

  conteneur.innerHTML =
    '<div class="galerie-principal" style="background:' + produit.couleurFond + '">' +
      '<div class="galerie-vue"></div>' +
      '<button type="button" class="galerie-fleche prev" aria-label="Vue précédente">‹</button>' +
      '<button type="button" class="galerie-fleche suiv" aria-label="Vue suivante">›</button>' +
      '<span class="galerie-compteur" aria-live="polite"></span>' +
    "</div>" +
    '<div class="galerie-miniatures" role="tablist" aria-label="Vues du produit"></div>';

  const vuePrincipale = conteneur.querySelector(".galerie-vue");
  const compteur = conteneur.querySelector(".galerie-compteur");
  const miniatures = conteneur.querySelector(".galerie-miniatures");

  miniatures.innerHTML = vues.map(function (vue, i) {
    return '<button type="button" class="galerie-miniature" data-index="' + i + '" role="tab"' +
           ' aria-label="Vue ' + (i + 1) + " : " + vue.label + '" title="' + vue.label + '">' +
             contenuVueGalerie(produit, vue, true) +
           "</button>";
  }).join("");

  function montrerVue(i) {
    indexVue = (i + vues.length) % vues.length;

    vuePrincipale.innerHTML = contenuVueGalerie(produit, vues[indexVue]);

    /* Relance le fondu à chaque changement de vue */
    vuePrincipale.classList.remove("galerie-animee");
    void vuePrincipale.offsetWidth; /* reflow : rejoue l'animation */
    vuePrincipale.classList.add("galerie-animee");

    compteur.textContent = (indexVue + 1) + " / " + vues.length + " — " + vues[indexVue].label;

    miniatures.querySelectorAll(".galerie-miniature").forEach(function (btn, j) {
      btn.classList.toggle("actif", j === indexVue);
      btn.setAttribute("aria-selected", String(j === indexVue));
    });
  }

  miniatures.addEventListener("click", function (e) {
    const btn = e.target.closest(".galerie-miniature");
    if (btn) montrerVue(parseInt(btn.dataset.index, 10));
  });

  conteneur.querySelector(".galerie-fleche.prev").addEventListener("click", function () {
    montrerVue(indexVue - 1);
  });
  conteneur.querySelector(".galerie-fleche.suiv").addEventListener("click", function () {
    montrerVue(indexVue + 1);
  });

  montrerVue(0);
}
