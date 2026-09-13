# NOVA — Site e-commerce mode & tech (démonstration statique)

Site vitrine + panier + tunnel de commande, en HTML/CSS/JavaScript pur (aucune installation requise).

## Lancer le site en local

**Option la plus simple :** double-cliquez sur `index.html`, il s'ouvrira dans votre navigateur.

**Option recommandée (évite quelques limitations du navigateur) :** lancez un petit serveur local.

- Avec Python (déjà installé sur macOS/Linux, à installer sur Windows) :
  ```
  cd chemin/vers/le/dossier/site
  python3 -m http.server 8000
  ```
  puis ouvrez http://localhost:8000 dans votre navigateur.

- Avec VS Code : installez l'extension "Live Server", clic droit sur `index.html` → "Open with Live Server".

## Structure du projet

```
site/
├── index.html            → Page d'accueil + catalogue (recherche, tri, vu récemment)
├── produit.html           → Fiche produit détaillée (?id=...) + variantes, galerie, avis
├── panier.html             → Panier (quantités, variantes, sous-total, livraison)
├── paiement.html            → Tunnel de commande (livraison + mode de paiement)
├── confirmation.html         → Page de confirmation après commande
├── favoris.html               → Page "Mes favoris" (wishlist, localStorage)
├── mentions-legales.html      → Mentions légales (modèle à compléter)
├── cgv.html                    → Conditions générales de vente (modèle)
├── confidentialite.html         → Politique de confidentialité (modèle)
├── contact.html                  → Formulaire de contact
├── css/style.css                  → Toute la mise en forme (palette NOVA + thème sombre)
└── js/
    ├── data.js       → Catalogue produits + variantes, dateAjout, popularité
    ├── icones.js     → Illustrations vectorielles des produits (mode & tech)
    ├── panier.js     → Logique du panier (localStorage, clé nova_panier) + stocks variantes
    ├── boutique.js   → v2 : toasts, favoris, badge stock, cartes, vu récemment, recherche
    ├── theme.js      → v3 : mode sombre / clair (localStorage, appliqué avant le rendu)
    ├── effets.js     → v3 : apparitions au scroll + squelettes de chargement d'images
    ├── avis.js       → v3 : avis clients (étoiles + commentaires, localStorage)
    ├── galerie.js    → v3 : galerie multi-images de la fiche produit
    ├── promotions.js → v4 : bannière promo + compte à rebours, nouveautés, témoignages, newsletter
    └── menu.js       → Menu mobile (drawer) avec recherche, favoris et bouton thème
```

## Identité visuelle NOVA

- **Palette** : indigo `#4F46E5`, violet `#8B5CF6`, corail `#FF6F61`, vert `#10B981`, rose `#EC4899`, ambre `#F59E0B`, bleu ciel `#0EA5E9`
- **Dégradé signature** : indigo → violet → corail (utilisé pour la bannière d'annonce, le logo, le hero visuel et le footer)
- **Typographie** : Space Grotesk (titres) + Inter (corps)
- **Rayons** : coins arrondis (`--radius: 14px`, `--radius-sm: 8px`, `--radius-lg: 20px`)
- **Ombres** : carte au repos légère, ombre colorée indigo au survol
- **Focus** : outline indigo sur tous les éléments interactifs

## Fonctionnalités v2 (novembre 2026)

1. **Barre de recherche** — dans la barre de nav (et dans le drawer mobile). Sur l'accueil, le filtrage est instantané (nom, catégorie, accroche, accents ignorés) et se combine aux filtres de catégorie. Sur les autres pages, elle renvoie vers `index.html?q=…`.
2. **Tri des produits** — menu "Trier :" au-dessus de la grille : Prix croissant / décroissant (champ `prix`), Nouveautés (champ `dateAjout`, "AAAA-MM-JJ"), Popularité (champ `popularite`, 0-100).
3. **Variantes produits** — les produits `Vêtements` (t-shirt, pull, short, veste) portent un tableau `variantes` dans `data.js` : `{ taille, couleur, hex, stock }`. La fiche produit affiche les tailles S/M/L/XL et les couleurs (pastille `hex`), avec stock par variante. Le panier distingue chaque variante (clé `id|Taille|Couleur`) — les anciens paniers restent compatibles.
4. **Wishlist / Favoris** — cœur sur chaque carte et sur la fiche produit, sauvegarde `localStorage` (clé `nova_favoris`), badge dans la nav, page dédiée `favoris.html`.
5. **Notifications toast** — ajout au panier, favoris, limites de stock : message animé en bas de l'écran avec lien "Voir le panier", au lieu du simple "✓".
6. **Indicateur de stock sur les cartes** — badge ambre "Plus que X en stock !" quand le stock total est ≤ 5 (constante `SEUIL_STOCK_URGENCE` dans `boutique.js`), badge rouge "Rupture de stock" à 0, bouton + désactivé.
7. **Page "Vu récemment"** — les fiches consultées sont mémorisées (clé `nova_vus_recemment`, 8 max) et affichées dans une section dédiée de l'accueil.

## Fonctionnalités v3 (2026)

1. **Animations au scroll** — les cartes produit et les titres de section apparaissent en fondu avec un léger glissement quand ils entrent dans l'écran (IntersectionObserver + MutationObserver : les cartes re-rendues par la recherche ou le tri s'animent aussi, sans toucher à leur code). Les éléments déjà à l'écran au chargement restent statiques, et `prefers-reduced-motion` désigne tout.
2. **Skeleton loading** — pendant le chargement d'une photo produit, le visuel affiche un reflet balayant (shimmer) sur le fond pastel du produit ; l'image fond ensuite en douceur. Si une image est cassée, le fond pastel reste affiché proprement.
3. **Avis clients** — notes en étoiles + commentaires sur chaque fiche produit (`produit.html`) : note globale, répartition par étoile, formulaire avec sélection d'étoiles cliquables, publication instantanée en `localStorage` (clé `nova_avis`). Des avis de démonstration sont semés au premier chargement ; la note moyenne apparaît aussi sur les cartes du catalogue.
4. **Mode sombre** — bouton lune/soleil dans la nav de toutes les pages et dans le drawer mobile. Le choix est mémorisé (`nova_theme`), la préférence système est respectée à la première visite, et le thème est appliqué avant le premier rendu (aucun flash blanc). Toute la palette s'inverse via les variables CSS.
5. **Galerie multi-images** — sur la fiche produit, 4 vues générées à partir des données existantes (photo plein cadre, produit seul, détail zoomé, illustration vectorielle) avec miniatures cliquables, flèches et compteur. Pour de vraies photos multiples, ajoutez un champ `galerie: [url1, url2…]` dans `data.js`.

## Fonctionnalités v4 (2026 — accueil)

1. **Bannière promo avec compte à rebours** — en haut de l'accueil : "−20% jusqu'à vendredi !" avec code `NOVA20` et décompte en temps réel (jours / heures / min / sec) jusqu'au vendredi 23h59m59s (ce soir si nous sommes vendredi). Calculé à l'ouverture, aucune donnée stockée. Blocs `js/promotions.js` + `.banniere-promo` dans `style.css`.
2. **Section "Nouveautés"** — sous le bandeau de confiance : les 3 produits dont `dateAjout` est le plus récent (actuellement Ecran moniteur, Casque, Baskets Noire). Un badge dégradé **"Nouveau"** est posé sur ces 3 cartes partout où elles apparaissent (accueil, catalogue, favoris, produits associés) — la liste `IDS_NOUVEAUTES` est recalculée automatiquement dans `boutique.js` quand vous mettez à jour `dateAjout` dans `data.js`.
3. **Témoignages clients** — section "Ils nous font confiance" : les 3 meilleurs avis (note ≥ 4, commentaire consistant) tirés de `nova_avis`, avec étoiles, citation, initiales du client et lien vers le produit concerné. Sélection déterministe (note puis date décroissantes) ; la section se masque d'elle-même s'il n'existe aucun avis éligible.
4. **Newsletter** — bloc dégradé en bas de l'accueil : saisie d'e-mail avec validation, anti-doublon et confirmation visuelle. L'inscription est mémorisée dans `localStorage` (clé `nova_newsletter`) pour la démonstration — rien n'est envoyé en ligne ; branchez ici votre outil d'newsletter (Mailchimp, Brevo…) pour un usage réel.

## Catalogue produits

Le catalogue est composé de 16 articles répartis en 4 familles :

- **Vêtements** : T-shirt coton bio Essentials, Pull maille Urban, Short Urban cargos, Veste en jean Classic
- **Chaussures** : Baskets Urban runner, Original, The blue, Noire
- **Accessoires** : Lunettes de soleil, Casquette snapback, Casque Ecouteure, Sac à dos Urban 25L
- **Tech** : Smartphone X5, Ecran moniteur, Latop, Montre connectée Watch

Chaque produit possède sa propre couleur d'accent et sa couleur de fond, définies dans `js/data.js` par les champs `couleur` et `couleurFond`.

## Avant la mise en ligne réelle

Ce site est un livrable fonctionnel prêt pour la démonstration locale, mais quelques points sont à traiter avant une mise en ligne commerciale :

1. **Paiement réel** — Le formulaire de paiement (`paiement.html`) est une simulation : aucune transaction n'est réellement traitée. Pour accepter de vrais paiements, il faut intégrer un prestataire agréé (par ex. CinetPay, PayGate, Stripe, ou l'API Mobile Money de votre opérateur) via un serveur backend sécurisé — les identifiants de paiement ne doivent jamais être traités uniquement côté navigateur.
2. **Mentions légales et CGV** — Les pages `mentions-legales.html` et `cgv.html` contiennent des modèles génériques avec des champs `[à compléter]`. Faites-les valider par un professionnel du droit avant publication.
3. **Nom de domaine et hébergement** — Il faudra héberger ces fichiers sur un service d'hébergement web (mutualisé, VPS, ou hébergement statique type Netlify/Vercel/OVH) et pointer un nom de domaine dessus.
4. **Gestion des stocks et commandes** — Actuellement, les commandes ne sont pas transmises à un système de gestion : il n'y a pas de base de données. Pour un usage réel, il faudra un minimum de backend pour recevoir, stocker et notifier les commandes (e-mail, tableau de gestion, etc.).
5. **Photos produits** — Les produits utilisent des illustrations vectorielles génériques. Remplacez-les par de vraies photos de vos produits (voir `js/data.js` et `js/icones.js`).
6. **Nom de domaine e-mail** — Les adresses `@nova.tg` et le numéro de téléphone sont des exemples à remplacer par vos vraies coordonnées.

## Personnaliser le catalogue

Ouvrez `js/data.js` : chaque produit est un objet avec un nom, une catégorie, un prix (en FCFA), une description, une icône, une couleur d'accent et une couleur de fond. Ajoutez, modifiez ou supprimez des entrées dans le tableau `PRODUITS` — le site se met à jour automatiquement.

Pour ajouter une nouvelle icône, ajoutez une entrée dans la fonction `iconeSVG` du fichier `js/icones.js`.
