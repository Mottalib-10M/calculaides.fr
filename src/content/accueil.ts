/** Accueil (page pilier) : texte des deux langues. Rendu par components/HomePage.astro. */
import type { Helpers, PageText } from '../lib/guide-types';

type Home = Omit<PageText, 'slug' | 'card'> & { gridTitle: string; grid: (h: Helpers) => Array<[string, string, string, string]> };

/** Trois foyers types, calculés par le moteur (mêmes valeurs dans les deux langues). */
const foyers = (h: Helpers) => {
  const M = h.M;
  // 1. Personne seule au Smic net, locataire en zone 2.
  const smic = h.P.smic.mensuel_net;
  const a1 = M.apl({ zone: 2, couple: false, enfants: 0, loyer: 520, revenusAnnuels: smic * 12 });
  const p1 = M.primeActivite({ couple: false, enfants: 0, revenu1: smic, forfaitLogement: a1.aide > 0 });
  // 2. Couple, deux enfants, un salaire de 2 000 €, locataire en zone 3.
  const af2 = M.allocationsFamiliales({ enfants: 2, majorables: 0, revenus: 24000 }).total;
  const a2 = M.apl({ zone: 3, couple: true, enfants: 2, loyer: 700, revenusAnnuels: 24000 });
  const p2 = M.primeActivite({ couple: true, enfants: 2, revenu1: 2000, revenu2: 0, autres: af2, forfaitLogement: a2.aide > 0 });
  const ars2 = M.ars({ c6_10: 1, c11_14: 1, c15_18: 0, revenus: 24000 }).total;
  // 3. Parent seul, un enfant, sans emploi, locataire en zone 1.
  const a3 = M.apl({ zone: 1, couple: false, enfants: 1, loyer: 800, revenusAnnuels: 0 });
  const r3 = M.rsa({ couple: false, enfants: 1, revenus: 0, forfaitLogement: a3.aide > 0, isoleMajore: false });
  return { smic, a1, p1, af2, a2, p2, ars2, a3, r3 };
};

const grid = (h: Helpers, fr: boolean): Array<[string, string, string, string]> => {
  const P = h.P, e = (n: number) => h.eur(n, 2);
  return [
    [fr ? 'APL, ALF, ALS : loyer plafond, personne seule, zone 1' : 'Housing aid (APL): rent ceiling, single, zone 1', e(h.M.loyerPlafond(1, false, 0)), 'simulateur-apl', fr ? 'Simulateur APL' : 'Housing aid calculator'],
    [fr ? 'Prime d’activité : montant forfaitaire, personne seule' : 'Activity bonus: flat-rate amount, single', e(P.pa.montant_forfaitaire), 'simulateur-prime-activite', fr ? 'Simulation prime d’activité' : 'Activity bonus calculator'],
    [fr ? 'RSA : personne seule sans ressource' : 'RSA: single person with no income', e(P.rsa.montant_forfaitaire), 'simulateur-rsa', fr ? 'Simulateur RSA' : 'RSA calculator'],
    [fr ? 'Allocations familiales : deux enfants, 1re tranche' : 'Family allowances: two children, first band', e(P.af.tranches_nettes.deux[0]), 'simulateur-allocations-familiales', fr ? 'Montant des allocations familiales' : 'Family allowance calculator'],
    [fr ? 'Allocation de rentrée scolaire : enfant de 6 à 10 ans' : 'Back-to-school allowance: child aged 6 to 10', e(P.ars.montants['6_10']), 'simulateur-ars', fr ? 'Simulateur ARS 2026' : 'Back-to-school calculator'],
    [fr ? 'Prime à la naissance (une fois)' : 'Birth grant (one-off)', e(P.paje.prime_naissance), 'simulateur-prime-naissance', fr ? 'Prime de naissance' : 'Birth grant calculator'],
    [fr ? 'PreParE : arrêt total d’activité' : 'PreParE: full stop of work', e(P.prepare.taux_plein), 'simulateur-prepare', fr ? 'Congé parental' : 'Parental leave calculator'],
    [fr ? 'AAH : montant maximal' : 'AAH: maximum amount', e(P.aah.montant_max), 'simulateur-aah', fr ? 'Simulateur AAH' : 'AAH calculator'],
  ];
};

export const HOME: Record<'fr' | 'en', Home> = {
  fr: {
    nav: 'Accueil',
    title: 'Simulation CAF 2026 : APL, prime d’activité, RSA, familles',
    description: 'Simulation CAF 2026 gratuite : APL au barème d’octobre, prime d’activité, RSA, allocations familiales, rentrée scolaire, naissance, PreParE, AAH, en détail.',
    h1: 'Simulation CAF : toutes vos aides 2026 en un calcul',
    intro: 'Aide au logement, RSA, prime d’activité, allocations familiales et rentrée scolaire, calculés ensemble avec les barèmes officiels de 2026.',
    gridTitle: 'Les montants 2026, aide par aide',
    grid: (h) => grid(h, true),
    resume: (h) => { const f = foyers(h); return `Une personne seule payée au Smic net, ${h.eur(f.smic)} par mois, qui loue 520 € hors charges en zone 2 peut prétendre à environ ${h.eur(f.a1.aide)} d’aide au logement et ${h.eur(f.p1.prime)} de prime d’activité par mois en octobre 2026. Ces deux chiffres viennent des barèmes officiels en vigueur : l’arrêté du 28 septembre 2026 pour les aides au logement, revalorisées de 1,15 % au 1er octobre, et les décrets du 30 mars 2026 pour le RSA, la prime d’activité et l’AAH, revalorisés au 1er avril. Le simulateur ci-dessus additionne cinq aides de la CAF à partir des mêmes saisies : il retire automatiquement le forfait logement du RSA et de la prime d’activité quand une aide au logement est versée, et compte les allocations familiales dans les ressources, comme le fait la caisse. Chaque aide a ensuite sa page, avec un simulateur complet et les règles détaillées. Les résultats restent des estimations : seule votre CAF calcule le droit, sur votre dossier.`; },
    faqs: (h) => { const f = foyers(h); return [
      { q: 'Peut-on toucher l’APL, le RSA et la prime d’activité en même temps ?', a: `Oui, les trois se cumulent, mais l’aide au logement réduit les deux autres par le forfait logement : ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} pour une personne seule au RSA en 2026. Un parent seul sans emploi en zone 1, avec un enfant et 800 € de loyer, obtiendrait environ ${h.eur(f.a3.aide)} d’aide au logement et ${h.eur(f.r3.rsa)} de RSA selon nos calculs, avant toute autre prestation.` },
      { q: 'Quelles ressources la CAF regarde-t-elle pour chaque aide ?', a: 'Elles diffèrent. L’aide au logement prend les revenus des douze derniers mois glissants, révisés chaque trimestre. Le RSA et la prime d’activité reposent sur la déclaration trimestrielle des trois mois précédents. Les allocations familiales, la rentrée scolaire, la prime à la naissance et le complément familial comparent le revenu net catégoriel de 2024 à leurs plafonds pour les droits de 2026.' },
      { q: 'La simulation CAF en ligne engage-t-elle la caisse ?', a: 'Non. Une simulation, la nôtre comme celle de caf.fr, est une estimation calculée sur vos seules déclarations, sans effet juridique. Le droit n’existe qu’après une demande et l’examen du dossier par la CAF, qui peut retenir des ressources ou des règles que le simulateur ignore. Le montant notifié par la caisse prime toujours.' },
      { q: 'Pourquoi mes allocations ont-elles changé au 1er avril ?', a: `Parce que la plupart des prestations sont revalorisées à cette date. En 2026, le montant forfaitaire du RSA est passé à ${h.eur(h.P.rsa.montant_forfaitaire, 2)}, celui de la prime d’activité à ${h.eur(h.P.pa.montant_forfaitaire, 2)} et l’AAH à ${h.eur(h.P.aah.montant_max, 2)}. La base mensuelle des allocations familiales, ${h.eur(h.P.bmaf, 2)}, sert à calculer les prestations familiales. Les aides au logement suivent, elles, un calendrier d’octobre.` },
      { q: 'Faut-il refaire une simulation quand ma situation change ?', a: 'Oui, et la déclarer à la CAF. Une mise en couple, une séparation, une naissance, un déménagement ou une reprise d’emploi modifient la composition du foyer ou les ressources, donc presque toutes les aides à la fois. Le simulateur global permet de comparer les deux situations en changeant une seule saisie, puis le lien de partage garde la trace du calcul.' },
      { q: 'Mes données saisies dans le simulateur sont-elles envoyées quelque part ?', a: 'Non. Le calcul se fait dans votre navigateur : loyer, revenus et composition du foyer ne sont transmis à aucun serveur, ni à la CAF ni à nous, et le site ne dépose aucun cookie. Seul le lien de partage, si vous le copiez, reprend vos saisies dans l’adresse de la page.' },
    ]; },
    body: (h) => { const f = foyers(h); const P = h.P; return `
<h2>Ce que calcule la simulation globale</h2>
<p>Le simulateur en tête de page reprend les cinq aides que la plupart des foyers modestes peuvent cumuler : l’aide personnelle au logement, le RSA, la prime d’activité, les allocations familiales et l’allocation de rentrée scolaire. Chacune est calculée par sa propre formule, celle que publient les textes, et non par une règle de trois. Les aides se répondent : la CAF déduit du RSA et de la prime d’activité un forfait logement dès qu’une aide au logement est versée, et elle compte les allocations familiales dans les ressources de ces deux prestations. Le simulateur applique ces liens dans le même ordre que la caisse.</p>
<p>Il fait une hypothèse que la CAF ne fait pas : il suppose que vos revenus de 2024, qui servent aux prestations familiales, valent douze fois vos revenus mensuels actuels. Si votre situation a changé depuis, le simulateur dédié de chaque aide accepte vos vrais revenus de référence. Il compte aussi les enfants scolarisés au montant des 6 à 10 ans, le plus bas : le ${h.a('simulateur-ars', 'simulateur de rentrée scolaire')} détaille les trois tranches d’âge.</p>

<h2>Trois foyers, trois combinaisons d’aides</h2>
<h3>Une personne seule au Smic, locataire en zone 2</h3>
<p>Avec ${h.eur(f.smic)} de salaire net et 520 € de loyer, l’aide au logement estimée atteint ${h.eur(f.a1.aide)} par mois : le loyer retenu est plafonné à ${h.eur(f.a1.plafond)}, et la participation personnelle, ${h.eur(f.a1.pp)}, absorbe une bonne partie du reste. La prime d’activité ajoute ${h.eur(f.p1.prime)}, forfait logement déduit. Pas de RSA : le salaire dépasse déjà le montant forfaitaire de ${h.eur(P.rsa.montant_forfaitaire, 2)}.</p>
<h3>Un couple avec deux enfants et un seul salaire de 2 000 €, en zone 3</h3>
<p>Les allocations familiales versent ${h.eur(f.af2, 2)} par mois pour deux enfants dans la première tranche de revenus. L’aide au logement estimée, pour 700 € de loyer, s’élève à ${h.eur(f.a2.aide)}. La prime d’activité, calculée sur un foyer de quatre personnes, atteint ${h.eur(f.p2.prime)}. En août, si les enfants ont 8 et 12 ans, l’allocation de rentrée ajoute ${h.eur(f.ars2, 2)} en une fois.</p>
<h3>Un parent seul sans emploi, un enfant, en zone 1</h3>
<p>Pour 800 € de loyer, l’aide au logement plafonne à ${h.eur(f.a3.aide)} : en zone 1, la CAF ne retient pas plus de ${h.eur(f.a3.plafond)} de loyer pour ce foyer. Le RSA estimé, ${h.eur(f.r3.rsa)}, tient compte du forfait logement de deux personnes. Une séparation récente ou un enfant de moins de 3 ans ouvrirait le montant majoré pour parent isolé, plus élevé : la page ${h.a('rsa-parent-isole', 'RSA du parent isolé')} le chiffre.</p>
<!--mini:accueil-->

<h2>Les barèmes de 2026, et d’où ils viennent</h2>
<p>Les aides ne bougent pas toutes à la même date. Le RSA, la prime d’activité, l’AAH et les prestations familiales sont revalorisés au 1er avril, par décret : le ${h.src('decretRsa2026', 'décret n° 2026-220')} pour le RSA, le ${h.src('decretPa2026', 'décret n° 2026-222')} pour la prime d’activité, l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')} pour la base mensuelle des allocations familiales. Les aides au logement suivent l’indice de référence des loyers et changent au 1er octobre : l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')} a relevé loyers plafonds et forfaits de 1,15 %.</p>
${h.table(['Aide', 'Montant au 1er avril ou au 1er octobre 2026', 'Ce qui le module'], [
  ['RSA, personne seule', h.eur(P.rsa.montant_forfaitaire, 2), 'composition du foyer, ressources, forfait logement'],
  ['RSA, couple', h.eur(h.M.forfaitaireRsa(true, 0), 2), 'enfants : +30 %, puis +40 % à partir du 3e'],
  ['Prime d’activité, montant forfaitaire', h.eur(P.pa.montant_forfaitaire, 2), `${h.pct(P.pa.taux_revenus, 2)} des revenus d’activité, bonification`],
  ['Bonification individuelle maximale', h.eur(h.M.bonificationMax(), 2), `atteinte dès ${h.eur(h.M.plafondBonification(), 2)} de revenus`],
  ['AAH, montant maximal', h.eur(P.aah.montant_max, 2), 'ressources de la personne seule'],
  ['Allocations familiales, 2 enfants', h.eur(P.af.tranches_nettes.deux[0], 2), 'tranches de revenus 2024, âge des enfants'],
  ['Allocation de rentrée, 15 à 18 ans', h.eur(P.ars.montants['15_18'], 2), 'plafond de revenus 2024'],
  ['Prime à la naissance', h.eur(P.paje.prime_naissance, 2), 'plafond de revenus 2024'],
  ['PreParE à taux plein', h.eur(P.prepare.taux_plein, 2), 'temps de travail conservé'],
  ['Allocation de soutien familial, par enfant', h.eur(P.asf.par_enfant, 2), 'pension alimentaire versée'],
], 'Montants mensuels nets, sauf prime à la naissance et rentrée (versements uniques)', ['l', 'r', 'l'])}
<p>Tous ces montants sont repris des fiches de ${h.src('spRsa', 'service-public.fr')} et des textes publiés sur Légifrance, puis rejoués par des tests à chaque version du site. Une seule valeur n’est pas de 2026 : l’abattement R0 des aides au logement, dont nous n’avons trouvé aucune revalorisation pour 2026. La ${h.a('method', 'méthode de calcul')} détaille chaque formule et chaque limite.</p>

<h2>Pourquoi un calcul détaillé change tout</h2>
<p>Le simulateur de la CAF donne un chiffre. Celui-ci donne le chiffre et le chemin. Pour l’aide au logement, vous voyez le loyer retenu, le plafond de votre zone, le forfait charges et votre participation personnelle : c’est elle qui explique pourquoi deux locataires au même loyer touchent des montants différents. Pour la prime d’activité, vous voyez la part de vos revenus ajoutée, la bonification et les ressources déduites. Ce détail permet de répondre aux vraies questions : combien je perds si j’accepte des heures en plus, à partir de quel salaire l’aide s’arrête, ce que change une mise en couple.</p>
<p>Ce site tient aussi une base que les simulateurs généralistes n’affichent pas : les loyers plafonds des trois zones pour chaque composition de foyer, les tranches de revenus des prestations familiales par nombre d’enfants, les seuils de sortie de chaque aide. Ces tableaux sont recalculés par le même moteur que les simulateurs, à partir du même fichier de paramètres daté. Quand les aides au logement changent en octobre ou les prestations en avril, toutes les pages bougent ensemble.</p>

<h2>Les ressources : trois périodes de référence</h2>
<p>C’est la source de la plupart des surprises. L’aide au logement se calcule sur les revenus des douze derniers mois, mis à jour chaque trimestre : une hausse de salaire la réduit trois mois plus tard, pas l’année suivante. Le RSA et la prime d’activité dépendent de la déclaration trimestrielle : le montant est fixé pour trois mois d’après les revenus du trimestre précédent. Les prestations familiales, enfin, regardent le revenu net catégoriel de l’avant-dernière année : en 2026, celui de 2024, inscrit sur l’avis d’imposition reçu en 2025.</p>
<p>Un même foyer peut donc voir sa prime d’activité baisser au printemps, son aide au logement en été et ses allocations familiales seulement deux ans après une augmentation. La page ${h.a('apl-ressources', 'ressources de l’aide au logement')} détaille le calcul glissant, celle sur la ${h.a('prime-activite-declaration-trimestrielle', 'déclaration trimestrielle')} explique le décalage de la prime.</p>

<h2>Bien utiliser le résultat</h2>
<ul>
<li><strong>Comparez deux situations</strong> plutôt que de lire un seul chiffre : avant et après une reprise d’emploi, seul ou en couple, avec ou sans le nouveau loyer.</li>
<li><strong>Vérifiez la zone</strong> de votre commune : l’écart de loyer plafond entre la zone 1 et la zone 3 atteint ${h.eur(h.M.loyerPlafond(1, false, 0) - h.M.loyerPlafond(3, false, 0))} pour une personne seule.</li>
<li><strong>Gardez le lien de partage</strong> : il reprend vos saisies, utile pour en parler avec un travailleur social ou pour refaire le calcul après la revalorisation.</li>
<li><strong>Faites la demande</strong> si le simulateur affiche un droit : aucune aide n’est versée sans demande, et la plupart ne sont pas rétroactives.</li>
</ul>

<h2>Ce que le site ne calcule pas</h2>
<p>Le site traite les aides des CAF en France métropolitaine pour les locataires, les familles, les personnes à faibles revenus et les personnes handicapées. Il ne calcule pas les aides à la garde d’enfants, l’allocation chômage, les pensions de retraite ni le salaire net, qui relèvent d’autres organismes ou d’autres règles. Il ne couvre pas l’outre-mer, dont les barèmes diffèrent, ni l’aide au logement des accédants à la propriété. Pour ces situations, la fiche officielle de ${h.src('spApl', 'service-public.fr')} et votre CAF restent les références.</p>
`; },
  },
  en: {
    nav: 'Home',
    title: 'CAF Benefits 2026: Housing Aid, RSA, Activity Bonus, Family',
    description: 'Free CAF benefits estimate for 2026 in France: housing aid (APL) at October rates, activity bonus, RSA, family allowances, back-to-school, birth grant, AAH.',
    h1: 'French CAF benefits: all your 2026 aid in one calculation',
    intro: 'Housing aid, RSA minimum income, activity bonus, family allowances and back-to-school allowance, worked out together with the official 2026 scales.',
    gridTitle: '2026 amounts, benefit by benefit',
    grid: (h) => grid(h, false),
    resume: (h) => { const f = foyers(h); return `A single person on the net minimum wage, ${h.eur(f.smic)} a month, renting a flat for €520 excluding charges in zone 2 can expect around ${h.eur(f.a1.aide)} of housing aid and ${h.eur(f.p1.prime)} of activity bonus a month in October 2026. Both figures come from the official scales in force: the order of 28 September 2026 for housing aid, uprated by 1.15% on 1 October, and the decrees of 30 March 2026 for the RSA (revenu de solidarité active, France’s minimum income), the activity bonus (prime d’activité, a top-up for low earners) and the disability allowance, uprated on 1 April. The calculator above adds up five benefits paid by the CAF, the family allowance fund, from the same inputs: it removes the housing flat rate from the RSA and the activity bonus when housing aid is paid, and counts family allowances as income, exactly as the fund does. Each benefit then has its own page with a full calculator and the detailed rules. Results remain estimates: only your CAF works out the entitlement from your file.`; },
    faqs: (h) => { const f = foyers(h); return [
      { q: 'Can I get housing aid, the RSA and the activity bonus at the same time?', a: `Yes, all three can be combined, but housing aid reduces the other two through the housing flat rate: ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} for a single person on the RSA in 2026. A jobless lone parent in zone 1 with one child and €800 rent would get about ${h.eur(f.a3.aide)} of housing aid and ${h.eur(f.r3.rsa)} of RSA by our estimate, before any other benefit.` },
      { q: 'Which income does the CAF look at for each benefit?', a: 'It differs. Housing aid uses income over the last twelve rolling months, reviewed every quarter. The RSA and the activity bonus rest on the quarterly return covering the previous three months. Family allowances, the back-to-school allowance, the birth grant and the family supplement compare 2024 net income (revenu net catégoriel, on your tax notice) with their ceilings for 2026 entitlements.' },
      { q: 'Is an online CAF estimate binding on the fund?', a: 'No. A simulation, ours or the one on caf.fr, is an estimate built only on what you type, with no legal effect. An entitlement exists only after a claim and a review of your file by the CAF, which may count income or apply rules the calculator ignores. The amount the fund notifies always prevails.' },
      { q: 'Why did my benefits change on 1 April?', a: `Because most benefits are uprated on that date. In 2026 the RSA flat-rate amount rose to ${h.eur(h.P.rsa.montant_forfaitaire, 2)}, the activity bonus flat rate to ${h.eur(h.P.pa.montant_forfaitaire, 2)} and the AAH to ${h.eur(h.P.aah.montant_max, 2)}. The monthly family-allowance base (BMAF), ${h.eur(h.P.bmaf, 2)}, drives family benefits. Housing aid follows its own October calendar.` },
      { q: 'Should I run the estimate again when my situation changes?', a: 'Yes, and report the change to the CAF. Moving in together, separating, a birth, a move or a new job changes the household or its income, and so almost every benefit at once. The home-page calculator lets you compare both situations by changing a single input, and its share link keeps a record of the sum.' },
      { q: 'Are the details I type into the calculator sent anywhere?', a: 'No. The calculation runs in your browser: rent, income and household details are sent to no server, neither the CAF nor us, and the site sets no cookie. Only the share link, if you copy it, carries your inputs in the page address.' },
    ]; },
    body: (h) => { const f = foyers(h); const P = h.P; return `
<h2>What the all-in-one estimate covers</h2>
<p>The calculator at the top of the page handles the five benefits that most low-income households can combine: personal housing aid (APL, or ALF and ALS when the home is not under an approved agreement), the RSA, the activity bonus, family allowances and the back-to-school allowance (ARS). Each is worked out with its own formula, the one set in the official texts, not with a rule of thumb. The benefits interact: the CAF deducts a housing flat rate from the RSA and the activity bonus as soon as housing aid is paid, and counts family allowances as income for both. The calculator applies those links in the same order as the fund.</p>
<p>It makes one assumption the CAF does not: it treats your 2024 income, used for family benefits, as twelve times your current monthly income. If your situation has changed since then, each benefit’s own calculator accepts your real reference income. It also counts school-age children at the 6-to-10 rate, the lowest: the ${h.a('simulateur-ars', 'back-to-school calculator')} handles all three age bands.</p>

<h2>Three households, three mixes of benefits</h2>
<h3>A single person on the minimum wage, renting in zone 2</h3>
<p>With ${h.eur(f.smic)} of net pay and €520 rent, estimated housing aid reaches ${h.eur(f.a1.aide)} a month: rent counted is capped at ${h.eur(f.a1.plafond)}, and the own contribution, ${h.eur(f.a1.pp)}, absorbs much of the rest. The activity bonus adds ${h.eur(f.p1.prime)}, after the housing flat rate. No RSA: pay already exceeds the ${h.eur(P.rsa.montant_forfaitaire, 2)} flat-rate amount.</p>
<h3>A couple with two children and one €2,000 salary, in zone 3</h3>
<p>Family allowances pay ${h.eur(f.af2, 2)} a month for two children in the first income band. Estimated housing aid, for €700 rent, comes to ${h.eur(f.a2.aide)}. The activity bonus, worked out for a household of four, reaches ${h.eur(f.p2.prime)}. In August, with children aged 8 and 12, the back-to-school allowance adds ${h.eur(f.ars2, 2)} as a one-off payment.</p>
<h3>A jobless lone parent with one child, in zone 1</h3>
<p>For €800 rent, housing aid tops out at ${h.eur(f.a3.aide)}: in zone 1 the CAF counts no more than ${h.eur(f.a3.plafond)} of rent for this household. The estimated RSA, ${h.eur(f.r3.rsa)}, allows for the two-person housing flat rate. A recent separation or a child under 3 would open the higher lone-parent rate: the ${h.a('rsa-parent-isole', 'lone-parent RSA')} page puts a figure on it.</p>
<!--mini:accueil-->

<h2>The 2026 scales, and where they come from</h2>
<p>Benefits do not all move on the same date. The RSA, the activity bonus, the AAH and family benefits are uprated on 1 April by decree: ${h.src('decretRsa2026', 'decree 2026-220')} for the RSA, ${h.src('decretPa2026', 'decree 2026-222')} for the activity bonus, and the ${h.src('instructionPf2026', 'instruction of 20 March 2026')} for the family-allowance base. Housing aid follows the rent reference index and changes on 1 October: the ${h.src('arreteApl2026', 'order of 28 September 2026')} raised rent ceilings and flat allowances by 1.15%.</p>
${h.table(['Benefit', 'Amount from 1 April or 1 October 2026', 'What moves it'], [
  ['RSA, single person', h.eur(P.rsa.montant_forfaitaire, 2), 'household, income, housing flat rate'],
  ['RSA, couple', h.eur(h.M.forfaitaireRsa(true, 0), 2), 'children: +30%, then +40% from the third'],
  ['Activity bonus, flat-rate amount', h.eur(P.pa.montant_forfaitaire, 2), `${h.pct(P.pa.taux_revenus, 2)} of earnings, top-up`],
  ['Maximum individual top-up', h.eur(h.M.bonificationMax(), 2), `reached from ${h.eur(h.M.plafondBonification(), 2)} of earnings`],
  ['AAH, maximum', h.eur(P.aah.montant_max, 2), 'the claimant’s own income'],
  ['Family allowances, 2 children', h.eur(P.af.tranches_nettes.deux[0], 2), '2024 income bands, children’s ages'],
  ['Back-to-school, ages 15 to 18', h.eur(P.ars.montants['15_18'], 2), '2024 income ceiling'],
  ['Birth grant', h.eur(P.paje.prime_naissance, 2), '2024 income ceiling'],
  ['PreParE, full rate', h.eur(P.prepare.taux_plein, 2), 'working time kept'],
  ['Family support allowance, per child', h.eur(P.asf.par_enfant, 2), 'maintenance actually paid'],
], 'Monthly net amounts, except the birth grant and back-to-school allowance (one-off payments)', ['l', 'r', 'l'])}
<p>All amounts are taken from the ${h.src('spRsa', 'service-public.fr')} benefit sheets and the texts on Légifrance, then replayed by tests at every release of the site. Only one value is not from 2026: the R0 allowance in housing aid, for which we found no 2026 uprating. The ${h.a('method', 'calculation method')} sets out each formula and each limit.</p>

<h2>Why a detailed calculation matters</h2>
<p>The CAF’s simulator gives a figure. This one gives the figure and the route to it. For housing aid you see the rent counted, your zone’s ceiling, the service-charge allowance and your own contribution: that contribution explains why two tenants paying the same rent receive different amounts. For the activity bonus you see the share of earnings added, the top-up and the income deducted. That detail answers the real questions: how much do I lose if I take on more hours, at what pay does the aid stop, what changes if I move in with a partner.</p>
<p>The site also keeps data that general-purpose simulators do not show: rent ceilings for all three zones and every household size, family-benefit income bands by number of children, the exit point of each benefit. These tables are recalculated by the same engine as the calculators, from the same dated parameter file. When housing aid changes in October or benefits in April, every page moves together.</p>

<h2>Income: three reference periods</h2>
<p>This is where most surprises come from. Housing aid uses income over the last twelve months, refreshed every quarter: a pay rise reduces it three months later, not the following year. The RSA and the activity bonus depend on the quarterly return: the amount is fixed for three months from the previous quarter’s income. Family benefits look at net income from two years earlier: in 2026, the 2024 figure shown on the tax notice received in 2025.</p>
<p>The same household can therefore see its activity bonus fall in spring, its housing aid in summer, and its family allowances only two years after a pay rise. The page on ${h.a('apl-ressources', 'housing aid income')} explains the rolling sum, and the one on the ${h.a('prime-activite-declaration-trimestrielle', 'quarterly return')} explains the activity bonus time lag.</p>

<h2>Making good use of the result</h2>
<ul>
<li><strong>Compare two situations</strong> rather than reading one figure: before and after a new job, single or as a couple, with or without the new rent.</li>
<li><strong>Check your town’s zone</strong>: the rent-ceiling gap between zone 1 and zone 3 reaches ${h.eur(h.M.loyerPlafond(1, false, 0) - h.M.loyerPlafond(3, false, 0))} for a single person.</li>
<li><strong>Keep the share link</strong>: it stores your inputs, handy when talking to a social worker or redoing the sum after an uprating.</li>
<li><strong>Make the claim</strong> if the calculator shows an entitlement: no benefit is paid without a claim, and most are not backdated.</li>
</ul>

<h2>What the site does not calculate</h2>
<p>The site covers CAF benefits in mainland France for tenants, families, people on low incomes and disabled adults. It does not calculate childcare aid, unemployment benefit, pensions or net pay, which come under other bodies or rules. It does not cover the overseas departments, whose scales differ, or housing aid for home-buyers. For those cases, the official ${h.src('spApl', 'service-public.fr')} sheet and your CAF remain the references.</p>
`; },
  },
};
