# Ajouter une page à CalculAides (fr-aides-caf)

Notice pour les agents qui écrivent des pages. À lire en entier avant d'écrire une ligne, avec
`~/Documents/GitHub/RECETTE-SITE.md` §6 (unicité), §7 (FAQ), §9 (écriture), §9.3 (mini-simulateurs),
§11 (titres), §21 (bloc citable). Nom provisoire du site : CalculAides (domaine non choisi).

Site : simulateurs des aides versées par les CAF en France métropolitaine, barèmes 2026, **en français
(`/fr/`) et en anglais (`/en/`)**. Sujets : aides au logement (APL/ALF/ALS), prime d'activité, RSA,
allocations familiales, complément familial, ASF, allocation de rentrée scolaire, prime à la naissance et
allocation de base de la Paje, PreParE, AAH. **Hors sujet** (autres sites) : garde d'enfants, CMG, crèche,
grossesse, chômage, retraite, salaire net. Éditeur : Radif Partners (jamais de nom de personne). Aucun lien
vers un autre site que les sources officielles. Jamais « taxineo ».

## Principe : une page = un fichier

- Un guide = `src/content/guides/<id>.ts`. Une page outil = `src/content/outils/<id>.ts` (champ `tool`).
- Le fichier porte tout, dans les deux langues. Le cœur (routes, menus, sitemap, hreflang, schémas) le lit
  seul. **Ne modifiez aucun fichier du cœur** (components, layouts, i18n, lib/engine, lib/helpers…).
- Un mini-simulateur = `src/lib/minis/<kind>.ts`, chargé automatiquement ; **un par guide, propre à son
  sujet** (un sujet, un calcul). Il appelle le moteur, jamais un calcul refait à côté.
- **Modèle à copier pour la structure (jamais pour les phrases)** : `src/content/guides/apl-etudiant.ts`
  et `src/lib/minis/aplEtudiant.ts`.

## Le moteur (`src/lib/engine/`, exposé dans les textes par `h.M`, paramètres par `h.P`)

| Fonction | Rôle |
|---|---|
| `apl({ zone, couple, enfants, loyer, logement?, revenusAnnuels, etudiant?, boursier? })` | aide au logement en location : `aide`, `plafond`, `loyerRetenu`, `charges`, `p0`, `tp`, `r`, `r0`, `pp`, `degressivite` |
| `loyerPlafond(zone, couple, enfants)`, `forfaitCharges(couple, enfants, logement?)`, `r0(couple, enfants)`, `tauxFamille`, `tauxLoyer`, `ressourcesRetenues`, `seuilSortieApl(base)` | pièces de la formule APL |
| `primeActivite({ couple, enfants, revenu1, revenu2?, autres?, forfaitLogement?, isoleMajore? })` | `prime`, `forfaitaire`, `partRevenus`, `bonif`, `ressources`, `fl` |
| `bonification(revenuMensuel)`, `seuilBonification()`, `plafondBonification()`, `bonificationMax()`, `seuilSortiePrime(base)` | bonification individuelle |
| `rsa({ couple, enfants, revenus, autres?, forfaitLogement?, isoleMajore? })` | `rsa`, `forfaitaire`, `fl`, `ressources` |
| `forfaitaireRsa(couple, enfants, isole?)`, `forfaitairePa(...)`, `forfaitLogement(base, personnes, echelle)`, `coefFoyer`, `coefIsole` | barèmes de composition |
| `allocationsFamiliales({ enfants, majorables, vingtAns?, revenus })` | `total`, `base`, `majorations`, `forfait`, `tranche`, `complement`, `plafonds` |
| `plafondsAf(n)`, `baseAf(n, tranche)`, `nbMajorations(n, majorables)` | AF |
| `ars({ c6_10, c11_14, c15_18, enfants?, revenus })`, `plafondArs(n)` | rentrée scolaire, différentielle |
| `paje({ enfants, deuxRevenus, revenus, naissances? })`, `plafondNaissance`, `plafondAbPlein` | prime à la naissance, allocation de base |
| `prepare({ mode: 'plein' \| 'mi-temps' \| 'partiel', enfants, couple, majoree? })` | PreParE : `mensuel`, `dureeMois`, `total` |
| `complementFamilial({ enfants3a21, deuxRevenus, revenus })`, `asf(enfants, pensionParEnfant?)` | CF, ASF |
| `aah({ salaire, autres?, enfants? })`, `salaireRetenuAah`, `plafondAah(enfants)`, `seuilSortieAah` | AAH |

Tous les paramètres sont dans `src/data/params-2026.json` (lire ce fichier en entier : chaque valeur, sa
source, ses limites ; le `_lisezmoi` dit ce qui est provisoire). Une valeur réglementaire ne s'écrit
**jamais en dur** dans `resume`, `faqs` ou `body` : `${h.eur(h.P.rsa.montant_forfaitaire)}`, pas « 651,69 € ».
Seuls `title` et `description` sont des chaînes fixes : tout nombre qui y figure doit apparaître aussi dans
le texte rendu de la page.

## Faits vérifiés que vous pouvez écrire (relevés le 2026-10-09 sur service-public.fr et Légifrance)

- Revalorisation des prestations au 1er avril 2026 ; des aides au logement au 1er octobre 2026 (+1,15 %,
  arrêté du 28 septembre 2026). R0 : dernière valeur publiée (janvier 2025), pas d'arrêté 2026 trouvé.
- APL : pas d'âge minimum ; étudiants hors UE/EEE/Suisse avec titre de séjour « études » : APL seulement
  s'ils sont boursiers sur critères sociaux, exercent une activité, ou sont en apprentissage ou contrat de
  professionnalisation (depuis le 1er juillet 2026) ; garde alternée : chaque parent pour ses jours ;
  logement décent, résidence principale, conventionné pour l'APL (sinon ALF ou ALS) ; lien de parenté avec
  le propriétaire ou part de propriété : pas d'aide. Ressources des 12 derniers mois glissants, aide
  recalculée chaque trimestre. Aide non versée sous 10 €.
- Prime d'activité : 59,85 % des revenus professionnels ; montant forfaitaire 638,28 € ; bonification
  individuelle due au-dessus de 59 Smic horaires (726,29 €), maximale à 240,63 € à partir de 138 Smic horaires
  (1 698,78 €) ; parent isolé : 128,412 % + 42,804 % par enfant, accordé 12 mois sur 18 après l'événement ou
  jusqu'aux 3 ans du plus jeune ; versée par trimestre sur la base du trimestre précédent, montant fixe
  3 mois ; non versée sous 15 € ; pas imposable ; déclaration trimestrielle préremplie depuis le 1er mars 2025.
- RSA : tableaux exacts de service-public (personne seule 651,69 €, couple 977,54 €…), forfait logement
  78,20 / 156,41 / 193,55 € ; exemple officiel couple + 2 enfants avec AL et AF = 1 022,75 € ; non versé sous 6 €.
- AF : 2 enfants 152,25 € ; 3 enfants 347,32 € ; 4 enfants 542,39 € ; tranches divisées par 2 et par 4 ;
  plafonds 79 980 / 106 604 € (2 enfants), 86 644 / 113 268 € (3), +6 664 € par enfant ; majoration
  76,13 € à 14 ans pour un enfant né **avant le 1er mars 2012**, à **18 ans** pour un enfant né à partir du
  1er mars 2012 ; famille de 2 enfants : pas de majoration pour l'aîné ; forfait 20 ans 96,27 € (familles de
  3 enfants et plus, un an) ; complément dégressif si dépassement < 12 fois le montant mensuel ; ressources
  2024 pour les droits 2026 ; AF jusqu'à 20 ans.
- ARS rentrée 2026 : 426,87 € (6-10 ans), 450,41 € (11-14), 466,02 € (15-18) ; plafonds 28 956 € (1 enfant),
  35 638 € (2), 42 320 € (3) + 6 682 € par enfant ; revenus 2024 ; enfant né entre le 16 septembre 2008 et le
  31 décembre 2020 ; scolarisé ou inscrit au Cned ; instruction en famille : pas d'ARS ; allocation
  différentielle en cas de léger dépassement ; montants nets de CRDS.
- Paje : prime à la naissance 1 093,11 € (par enfant, jumeaux = 2 primes), versée avant la fin du mois civil
  qui suit le 6e mois de grossesse, grossesse déclarée ; plafonds 2024 (tableau params) ; deux revenus si
  chacun ≥ 6 306 € ; allocation de base 198,16 € (taux plein) ou 99,08 € (partiel) jusqu'aux 3 ans.
- PreParE : 459,70 € arrêt total, 297,17 € temps partiel ≤ 50 %, 171,42 € de 50 à 80 % ; couple, 1 enfant :
  6 mois par parent avant le 1er anniversaire ; 2 enfants et plus : 24 mois par parent jusqu'aux 3 ans ;
  parent isolé : jusqu'au 1er anniversaire (1 enfant) ou aux 3 ans (2 et plus) ; PreParE majorée 751,40 €,
  3 enfants et plus, arrêt total, 8 mois par parent avant le 1er anniversaire ; durée réduite des mois
  d'indemnités postnatales ; versée à terme échu ; pas de cumul avec les indemnités de congés payés ni de
  congé maternité/paternité (sauf exceptions de la fiche F32485).
- Complément familial : 198,16 € ou 297,27 € (majoré), au moins 3 enfants de 3 à moins de 21 ans, plafonds
  dans params. ASF : 200,78 € par enfant ; différentielle si pension < 200,78 € ; supprimée en couple.
- AAH : 1 041,59 € maximum ; plafond 12 499 €/an + 6 250 € par enfant ; déconjugalisation depuis le
  1er octobre 2023 (ancien calcul conservé s'il est plus favorable, plafond couple 22 623 €) ; taux
  d'incapacité ≥ 80 %, ou 50 à 79 % avec restriction substantielle et durable d'accès à l'emploi ;
  attribuée 1 à 10 ans ou à vie ; hospitalisation > 60 jours : 30 % (312 €) ; salaire en milieu ordinaire :
  abattement 80 % jusqu'à 30 % du Smic brut, 40 % au-delà.
- Smic 2026 : 12,31 €/h brut, 1 867,02 € brut, 1 477,93 € net par mois.

**Un point incertain ne se publie pas.** Pour un fait absent de cette liste, lisez la fiche officielle
(`curl -sL -A 'Mozilla/5.0' https://www.service-public.gouv.fr/particuliers/vosdroits/Fxxxx`) et citez-la ;
sinon n'écrivez pas le fait. Aucun chiffre inventé, aucune date de versement non sourcée, aucune statistique.

## Les champs d'une page (`src/lib/guide-types.ts`)

| Champ | Règle |
|---|---|
| `id` | = nom du fichier. Liens : `h.a('apl-colocation', 'texte')`. N'utilisez que des id du plan ci-dessous. |
| `group` | `logement`, `activite`, `rsa`, `famille`, `handicap`. |
| `order` | place dans le groupe, par pas de 10 (outil : 10). |
| `mini` | nom d'un fichier de `src/lib/minis/` (obligatoire pour un guide, absent pour un outil). |
| `miniHref` | facultatif : page cible du bouton du mini (sinon l'outil du groupe). Pour la famille, mettre l'outil du sujet (`simulateur-ars`, `simulateur-prime-naissance`, `simulateur-prepare`). |
| `related` | 3 à 6 id existants dans le plan. |
| `sources` | 2 clés de `params-2026.json > sources` au moins. |

| Champ texte (`fr`, `en`) | Règle |
|---|---|
| `slug` | minuscules et tirets, dans la langue ; ni année, ni nombre à 3 chiffres, pas de chiffre en tête ; jamais `contact`, `cookies`, `methode`, `method`, `a-propos`, `about`, `widget`, `privacy`, `faq`. |
| `title` | **50 à 60 caractères**, « 2026 » dedans, terme-clé en tête (jamais « France », « French », un mot d'outil — Simulateur, Calcul, Calculator — une question ou « FAQ » en tête). Le mot d'outil peut venir après : « Prime d'activité couple 2026 : simulateur et montant ». Titres uniques sur tout le site. |
| `description` | **150 à 160 caractères**, « 2026 » dedans, un fait chiffré. Unique. Pas de tiret cadratin. |
| `h1` | sans année. |
| `intro` | une phrase. |
| `resume` | `(h) => string` : **UN** paragraphe d'au moins 120 mots, texte brut (pas de lien, pas de HTML), le chiffre d'abord. C'est la réponse à la requête (§21). |
| `faqs` | `(h) => FAQ[]` : 4 à 8 vraies questions (comme on les tape), réponses de **40 à 90 mots** avec chiffre, condition et source. Une question n'existe qu'**une fois sur tout le site** (fr et en compris). Préférez des questions très propres au sujet de la page. |
| `body` | `(h) => string` HTML (`h2`, `h3`, `p`, `ul`, `ol`, `h.table(...)`). Total page (resume + FAQ + body) ≥ **1 100 mots** pour un guide, ≥ **450** pour un outil. `<!--mini:<kind>-->` insère le mini-simulateur une 2e fois (ou un autre mini du même sujet). |

Outils `h` : `h.a(id, texte)`, `h.eur(n, décimales?)`, `h.num(n, d?)`, `h.pct(fraction, d?)`, `h.date(iso)`,
`h.table(entêtes, lignes, légende, align)`, `h.src(clé, texte)`, `h.P`, `h.M`.

Page outil : `tool: 'apl' | 'pa' | 'rsa' | 'af' | 'ars' | 'naissance' | 'prepare' | 'aah'`, 3 à 5 FAQ,
`body` qui dit ce que l'outil calcule, sur quelles données (barème et date), ce qu'il ne sait pas faire,
avec un tableau de cas types calculé par `h.M`. 500 à 700 mots.

## Mini-simulateur (`src/lib/minis/<kind>.ts`)

`export default (l: L) => ({ title, cta, inputs, run })` — 1 à 3 champs (`options` pour une liste), le chiffre
du sujet en grand (`head`), 2 à 4 lignes, une `note` facultative. Valeurs par défaut réalistes. Libellés dans
les deux langues avec `T(l, fr, en)`. Nom en camelCase, unique (préfixe du sujet : `aplCouple`, `paBonif`…).

## Ton et langue

- **Français** : voix humaine, phrases de longueur variable, le chiffre d'abord, vocabulaire de la CAF
  (allocataire, droit, ressources, quotient, foyer, personne à charge). Accents partout (« à », « é »).
- **Anglais** : pour un anglophone qui vit en France. Chaque terme français est expliqué à sa première
  apparition (CAF, APL, RSA, prime d'activité, revenu net catégoriel, avis d'imposition…) ; montants en euros.
  Pas une traduction mot à mot ; mêmes chiffres, mêmes mini-simulateurs.
- **Interdits** : tiret cadratin « — » ou « &mdash; », « il est important de noter », « plongeons »,
  « que vous soyez X ou Y », « it's important to note », « dive into », « whether you're », triplets
  systématiques, conclusion-résumé, émojis, listes là où une phrase suffit.
- **Unicité** (§6) : `check-unique` compare toutes les pages d'une langue (seuil 30 %, chiffres neutralisés).
  Chaque page parle de **son** cas : son exemple chiffré, son seuil, son piège, ses démarches. Ne recopiez
  aucune phrase d'une autre page (ni du modèle), ne réutilisez pas le même gabarit de sections.
- La CAF peut être nommée (c'est l'organisme) ; jamais d'imitation de sa charte, ni de « site officiel ».
  Chaque page rappelle sobrement qu'il s'agit d'une estimation et que seule la CAF calcule le droit.

## Plan complet (id) — n'écrivez que les vôtres, ne liez qu'à celles-ci

- **logement** : `simulateur-apl` (outil apl), `apl-etudiant` (fait), `apl-colocation`, `apl-couple`,
  `apl-famille`, `apl-salarie`, `apl-zone-1`, `apl-zone-2`, `apl-zone-3`, `apl-ressources`,
  `apl-loyer-plafond`, `apl-calcul`, `apl-als-alf`, `apl-chambre-foyer`.
- **activite** : `simulateur-prime-activite` (outil pa), `prime-activite-celibataire`,
  `prime-activite-couple`, `prime-activite-parent-isole`, `prime-activite-bonification`,
  `prime-activite-temps-partiel`, `prime-activite-smic`, `prime-activite-forfait-logement`,
  `prime-activite-declaration-trimestrielle`.
- **rsa** : `simulateur-rsa` (outil rsa), `rsa-personne-seule`, `rsa-couple`, `rsa-parent-isole`,
  `rsa-forfait-logement`, `rsa-cumul-salaire`, `rsa-allocations-familiales`.
- **handicap** : `simulateur-aah` (outil aah), `aah-deconjugalisation`, `aah-cumul-salaire`,
  `aah-plafond-ressources`, `aah-pension-invalidite`, `aah-enfants`.
- **famille** : `simulateur-allocations-familiales` (outil af), `allocations-familiales-2-enfants`,
  `allocations-familiales-3-enfants`, `allocations-familiales-4-enfants`, `majoration-allocations-familiales`,
  `allocation-forfaitaire-20-ans`, `complement-degressif`, `complement-familial`,
  `allocation-soutien-familial` ; `simulateur-ars` (outil ars), `ars-plafond`, `ars-montant-age`,
  `ars-differentielle`, `ars-lyceen-apprenti` ; `simulateur-prime-naissance` (outil naissance),
  `prime-naissance-plafond`, `allocation-base-paje`, `prime-naissance-jumeaux` ; `simulateur-prepare`
  (outil prepare), `prepare-temps-partiel`, `prepare-duree`, `prepare-majoree`.
- Cœur : `home`, `method`, `about`, `contact`, `editorial`, `widget`, `terms`, `privacy`, `cookies`.

## Contrôles (tous à 0 avant de rendre la main)

```bash
cd ~/Documents/GitHub/a-publier/domaine-a-choisir/fr-aides-caf
PAGE_FILES=<id1>,<id2> npx vitest run tests/pages.test.ts   # vos pages
npx vitest run src/lib/engine                                # le moteur
```
Ne lancez pas `npm run build` ni les contrôles globaux : le coordinateur les lance une fois pour tout le site.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de git commit (le coordinateur commit).
- Ne pas toucher à `_trame`, à la RECETTE, ni à un autre site ; ne pas modifier le moteur ni les paramètres :
  un manque ou une erreur va dans le compte rendu.
- Pas de publicité, pas de lien vers un autre site du portefeuille.
