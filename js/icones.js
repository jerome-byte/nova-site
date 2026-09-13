/* Illustrations vectorielles NOVA pour chaque catégorie de produit (mode & tech).
   Un seul jeu de lignes, cohérent avec la nouvelle identité visuelle du site.
   Si une URL d'image est fournie (3ème argument), elle est utilisée à la place du SVG.

   v2 : ajout des icônes "ecran", "casque" et "laptop" (produits tech ajoutés au catalogue). */

function iconeSVG(nom, couleur, image) {
  // Si une image est fournie, on l'utilise à la place de l'icône vectorielle.
  if (image) {
    return `<img src="${image}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">`;
  }
  const c = couleur || "#4F46E5";
  const icones = {
    tshirt: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M68 40 L48 50 L38 75 L55 88 L62 78 L62 165 L138 165 L138 78 L145 88 L162 75 L152 50 L132 40 Q125 56 100 56 Q75 56 68 40 Z" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M68 40 Q80 56 100 56 Q120 56 132 40" stroke="${c}" stroke-width="2" opacity="0.5"/>
    </svg>`,
    pull: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M62 42 L42 56 L32 82 L50 92 L58 82 L58 165 L142 165 L142 82 L150 92 L168 82 L158 56 L138 42 L122 52 L100 58 L78 52 Z" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M78 42 Q88 58 100 58 Q112 58 122 42" stroke="${c}" stroke-width="3"/>
      <line x1="58" y1="105" x2="142" y2="105" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <line x1="58" y1="125" x2="142" y2="125" stroke="${c}" stroke-width="2" opacity="0.4"/>
    </svg>`,
    short: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 60 L50 150 L92 150 L100 100 L108 150 L150 150 L150 60 Z" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <line x1="100" y1="60" x2="100" y2="100" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <line x1="50" y1="80" x2="150" y2="80" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <circle cx="65" cy="135" r="2" fill="${c}"/>
      <circle cx="135" cy="135" r="2" fill="${c}"/>
    </svg>`,
    baskets: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 145 L35 110 Q40 90 62 90 L98 90 L132 75 Q165 70 168 100 L168 145 Z" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M35 145 L168 145" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
      <path d="M35 130 L168 130" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <line x1="65" y1="90" x2="65" y2="110" stroke="${c}" stroke-width="2"/>
      <line x1="85" y1="90" x2="85" y2="110" stroke="${c}" stroke-width="2"/>
      <line x1="105" y1="90" x2="105" y2="110" stroke="${c}" stroke-width="2"/>
      <path d="M98 90 L120 80" stroke="${c}" stroke-width="2"/>
      <circle cx="50" cy="118" r="3" fill="${c}"/>
    </svg>`,
    lunettes: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 100 Q60 80 90 100" stroke="${c}" stroke-width="3" fill="none"/>
      <path d="M110 100 Q140 80 170 100" stroke="${c}" stroke-width="3" fill="none"/>
      <ellipse cx="60" cy="105" rx="28" ry="22" stroke="${c}" stroke-width="3" fill="none"/>
      <ellipse cx="140" cy="105" rx="28" ry="22" stroke="${c}" stroke-width="3" fill="none"/>
      <line x1="30" y1="100" x2="18" y2="92" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
      <line x1="170" y1="100" x2="182" y2="92" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
      <path d="M55 95 Q60 92 65 95" stroke="${c}" stroke-width="2" opacity="0.6"/>
      <path d="M135 95 Q140 92 145 95" stroke="${c}" stroke-width="2" opacity="0.6"/>
    </svg>`,
    smartphone: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="62" y="22" width="76" height="156" rx="14" stroke="${c}" stroke-width="3"/>
      <line x1="82" y1="38" x2="118" y2="38" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <rect x="72" y="50" width="56" height="98" rx="4" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <circle cx="100" cy="162" r="5" stroke="${c}" stroke-width="2"/>
      <circle cx="92" cy="32" r="2" fill="${c}"/>
    </svg>`,
    casquette: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38 112 Q38 68 100 68 Q162 68 162 112 L162 118 L38 118 Z" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M38 118 L162 118 L185 148 L15 148 Z" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <line x1="100" y1="68" x2="100" y2="118" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <path d="M85 88 Q100 80 115 88" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <circle cx="100" cy="90" r="3" fill="${c}"/>
    </svg>`,
    "veste-jean": `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M58 45 L38 60 L32 92 L50 98 L58 88 L58 165 L142 165 L142 88 L150 98 L168 92 L162 60 L142 45 L122 55 L100 60 L78 55 Z" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M78 45 Q88 60 100 60 Q112 60 122 45" stroke="${c}" stroke-width="3"/>
      <line x1="100" y1="60" x2="100" y2="165" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <line x1="100" y1="95" x2="115" y2="105" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <line x1="100" y1="95" x2="85" y2="105" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <circle cx="78" cy="85" r="3" fill="${c}"/>
      <circle cx="122" cy="85" r="3" fill="${c}"/>
      <circle cx="78" cy="115" r="3" fill="${c}"/>
      <circle cx="122" cy="115" r="3" fill="${c}"/>
      <circle cx="78" cy="145" r="3" fill="${c}"/>
      <circle cx="122" cy="145" r="3" fill="${c}"/>
    </svg>`,
    montre: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="62" y="68" width="76" height="64" rx="16" stroke="${c}" stroke-width="3"/>
      <path d="M78 68 L73 32 L127 32 L122 68" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M78 132 L73 168 L127 168 L122 132" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="100" cy="100" r="18" stroke="${c}" stroke-width="2.5"/>
      <line x1="100" y1="100" x2="100" y2="88" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="100" y1="100" x2="110" y2="100" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="76" y="76" width="6" height="4" rx="1" fill="${c}"/>
      <rect x="118" y="76" width="6" height="4" rx="1" fill="${c}"/>
      <rect x="76" y="120" width="6" height="4" rx="1" fill="${c}"/>
      <rect x="118" y="120" width="6" height="4" rx="1" fill="${c}"/>
    </svg>`,
    "sac-dos": `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M62 58 Q62 38 80 38 L120 38 Q138 38 138 58 L138 78 L62 78 Z" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="52" y="78" width="96" height="100" rx="14" stroke="${c}" stroke-width="3"/>
      <line x1="52" y1="124" x2="148" y2="124" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <rect x="78" y="96" width="44" height="28" rx="4" stroke="${c}" stroke-width="2.5" opacity="0.7"/>
      <line x1="100" y1="96" x2="100" y2="124" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <path d="M62 58 L72 42" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <path d="M138 58 L128 42" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <circle cx="100" cy="150" r="4" fill="${c}"/>
    </svg>`,
    ecran: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="42" width="144" height="94" rx="8" stroke="${c}" stroke-width="3"/>
      <rect x="40" y="54" width="120" height="70" rx="3" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <path d="M84 136 L84 154 M116 136 L116 154" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
      <line x1="64" y1="158" x2="136" y2="158" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
      <path d="M58 92 L74 76 M92 108 L124 68" stroke="${c}" stroke-width="2" opacity="0.55" stroke-linecap="round"/>
    </svg>`,
    casque: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M46 118 L46 96 Q46 52 100 52 Q154 52 154 96 L154 118" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
      <rect x="34" y="110" width="26" height="44" rx="10" stroke="${c}" stroke-width="3"/>
      <rect x="140" y="110" width="26" height="44" rx="10" stroke="${c}" stroke-width="3"/>
      <path d="M60 132 Q60 158 88 162" stroke="${c}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
      <circle cx="94" cy="163" r="3.5" fill="${c}"/>
      <line x1="47" y1="84" x2="47" y2="98" stroke="${c}" stroke-width="2" opacity="0.5"/>
      <line x1="153" y1="84" x2="153" y2="98" stroke="${c}" stroke-width="2" opacity="0.5"/>
    </svg>`,
    laptop: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="46" y="48" width="108" height="72" rx="7" stroke="${c}" stroke-width="3"/>
      <rect x="56" y="58" width="88" height="52" rx="3" stroke="${c}" stroke-width="2" opacity="0.4"/>
      <path d="M32 132 L168 132 L156 148 L44 148 Z" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>
      <line x1="88" y1="140" x2="112" y2="140" stroke="${c}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
      <circle cx="100" cy="115" r="2.5" fill="${c}" opacity="0.7"/>
    </svg>`
  };
  return icones[nom] || icones.tshirt;
}
