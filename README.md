# NOVA Site e-commerce mode & tech (démonstration statique)

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
├── index.html            → Page d'accueil + catalogue produits
├── produit.html           → Fiche produit détaillée (?id=...)
├── panier.html             → Panier (quantités, sous-total, livraison)
├── paiement.html            → Tunnel de commande (livraison + mode de paiement)
├── confirmation.html         → Page de confirmation après commande
├── mentions-legales.html      → Mentions légales (modèle à compléter)
├── cgv.html                    → Conditions générales de vente (modèle)
├── confidentialite.html         → Politique de confidentialité (modèle)
├── contact.html                  → Formulaire de contact
├── css/style.css                  → Toute la mise en forme du site (palette NOVA)
└── js/
    ├── data.js    → Catalogue produits (modifiez ce fichier pour vos produits)
    ├── icones.js  → Illustrations vectorielles des produits (mode & tech)
    └── panier.js  → Logique du panier (stockage local du navigateur, clé nova_panier)
```

## Identité visuelle NOVA

- **Palette** : indigo `#4F46E5`, violet `#8B5CF6`, corail `#FF6F61`, vert `#10B981`, rose `#EC4899`, ambre `#F59E0B`, bleu ciel `#0EA5E9`
- **Dégradé signature** : indigo → violet → corail (utilisé pour la bannière d'annonce, le logo, le hero visuel et le footer)
- **Typographie** : Space Grotesk (titres) + Inter (corps)
- **Rayons** : coins arrondis (`--radius: 14px`, `--radius-sm: 8px`, `--radius-lg: 20px`)
- **Ombres** : carte au repos légère, ombre colorée indigo au survol
- **Focus** : outline indigo sur tous les éléments interactifs

## Catalogue produits

Le catalogue est composé de 10 articles répartis en 4 familles :

- **Vêtements** : T-shirt coton bio, Pull maille Urban, Short Urban cargos, Veste en jean Classic
- **Chaussures** : Baskets Urban runner
- **Accessoires** : Lunettes de soleil NOVA, Casquette snapback NOVA, Sac à dos Urban 25L
- **Tech** : Smartphone NOVA X5, Montre connectée NOVA Watch

Chaque produit possède sa propre couleur d'accent et sa couleur de fond, définies dans `js/data.js` par les champs `couleur` et `couleurFond`.

## Avant la mise en ligne réelle

Ce site est un livrable fonctionnel prêt pour la démonstration locale, mais quelques points sont à traiter avant une mise en ligne commerciale :

1. **Paiement réel**  Le formulaire de paiement (`paiement.html`) est une simulation : aucune transaction n'est réellement traitée. Pour accepter de vrais paiements, il faut intégrer un prestataire agréé (par ex. CinetPay, PayGate, Stripe, ou l'API Mobile Money de votre opérateur) via un serveur backend sécurisé  les identifiants de paiement ne doivent jamais être traités uniquement côté navigateur.
2. **Mentions légales et CGV**  Les pages `mentions-legales.html` et `cgv.html` contiennent des modèles génériques avec des champs `[à compléter]`. Faites-les valider par un professionnel du droit avant publication.
3. **Nom de domaine et hébergement** Il faudra héberger ces fichiers sur un service d'hébergement web (mutualisé, VPS, ou hébergement statique type Netlify/Vercel/OVH) et pointer un nom de domaine dessus.
4. **Gestion des stocks et commandes**  Actuellement, les commandes ne sont pas transmises à un système de gestion : il n'y a pas de base de données. Pour un usage réel, il faudra un minimum de backend pour recevoir, stocker et notifier les commandes (e-mail, tableau de gestion, etc.).
5. **Photos produits**  Les produits utilisent des illustrations vectorielles génériques. Remplacez-les par de vraies photos de vos produits (voir `js/data.js` et `js/icones.js`).
6. **Nom de domaine e-mail**  Les adresses `@nova.tg` et le numéro de téléphone sont des exemples à remplacer par vos vraies coordonnées.

## Personnaliser le catalogue

Ouvrez `js/data.js` : chaque produit est un objet avec un nom, une catégorie, un prix (en FCFA), une description, une icône, une couleur d'accent et une couleur de fond. Ajoutez, modifiez ou supprimez des entrées dans le tableau `PRODUITS` — le site se met à jour automatiquement.

Pour ajouter une nouvelle icône, ajoutez une entrée dans la fonction `iconeSVG` du fichier `js/icones.js`.
