import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples de la page : zone 1, revenus nets imposables de 10 000 € sur douze mois, loyers parisiens. */
const REV = 10000;
const z1 = (h: Helpers, couple: boolean, enfants: number, loyer: number) => h.M.apl({ zone: 1, couple, enfants, loyer, revenusAnnuels: REV });
const pl = (h: Helpers, couple: boolean, enfants: number) => h.M.loyerPlafond(1, couple, enfants);
const kd = (h: Helpers) => h.P.apl.degressivite['1'][0];
const ks = (h: Helpers) => h.P.apl.degressivite['1'][1];
/** Foyers du tableau des plafonds. */
const FOYERS: Array<[boolean, number, string, string]> = [
  [false, 0, 'Personne seule', 'Single person'],
  [true, 0, 'Couple sans enfant', 'Couple, no children'],
  [false, 1, 'Un enfant à charge', 'One dependent child'],
  [false, 2, 'Deux enfants', 'Two children'],
  [false, 3, 'Trois enfants', 'Three children'],
];
/** Cas types : [couple, enfants, loyer réel]. */
const CAS: Array<[boolean, number, number, string, string]> = [
  [false, 0, 950, 'Studio, personne seule', 'Studio, single person'],
  [false, 0, 1250, 'Deux-pièces, personne seule', 'One-bedroom flat, single person'],
  [true, 0, 1500, 'Deux-pièces, couple', 'One-bedroom flat, couple'],
  [false, 1, 1400, 'Parent et un enfant', 'Parent and one child'],
  [true, 2, 1900, 'Couple et deux enfants', 'Couple and two children'],
];

export default defineGuide({
  id: 'apl-zone-1',
  group: 'logement',
  order: 70,
  mini: 'aplZone1',
  related: ['simulateur-apl', 'apl-loyer-plafond', 'apl-zone-2', 'apl-zone-3', 'apl-colocation'],
  sources: ['spApl', 'arreteApl2026', 'cchD823'],
  fr: {
    slug: 'apl-zone-1',
    nav: 'APL zone 1',
    card: 'Paris et sa proche banlieue : un plafond vite dépassé, et une aide qui fond quand le loyer s’envole.',
    title: 'APL zone 1 2026 : plafond, loyers élevés et dégressivité',
    description: 'APL zone 1 2026 : la CAF retient au plus 337 € de loyer pour une personne seule ; l’aide baisse au-delà de 3,4 fois ce plafond et devient nulle à 4 fois.',
    h1: 'APL en zone 1 : quand le loyer dépasse de loin le plafond',
    intro: 'À Paris, la question n’est pas de savoir si le loyer dépasse le plafond, mais de combien, car au-delà d’un certain multiple l’aide se réduit.',
    resume: (h) => `En zone 1, la CAF ne prend jamais en compte plus de ${h.eur(pl(h, false, 0))} de loyer mensuel pour une personne seule, ${h.eur(pl(h, true, 0))} pour un couple et ${h.eur(pl(h, false, 1))} pour un foyer avec un enfant, au barème entré en vigueur le 1er octobre 2026. Les loyers parisiens dépassent presque tous ces montants, si bien qu’un studio à 950 € et un autre à 1 100 € ouvrent la même aide : environ ${h.eur(z1(h, false, 0, 950).aide)} par mois pour 10 000 € de revenus nets imposables sur l’année. La zone 1 applique cependant un garde-fou contre les loyers très élevés. Quand le loyer réel dépasse ${h.num(kd(h), 1)} fois le plafond, soit ${h.eur(pl(h, false, 0) * kd(h))} pour une personne seule, l’aide décroît en ligne droite ; elle tombe à zéro à ${h.num(ks(h), 0)} fois le plafond, soit ${h.eur(pl(h, false, 0) * ks(h))}. Entre ces deux bornes, un loyer de 1 250 € ne laisse plus qu’environ ${h.eur(z1(h, false, 0, 1250).aide)}. Ces montants sont des estimations : la CAF seule arrête le droit, sur le dossier complet.`,
    faqs: (h) => [
      { q: 'Je paie 1 300 € pour un deux-pièces à Paris, pourquoi la CAF me verse-t-elle si peu ?', a: `Parce que votre loyer franchit le seuil de dégressivité. Seul, le plafond de la zone 1 est de ${h.eur(pl(h, false, 0))} ; au-delà de ${h.num(kd(h), 1)} fois ce montant, soit ${h.eur(pl(h, false, 0) * kd(h))}, l’aide est réduite en proportion. À 1 300 €, la réduction atteint ${h.pct(z1(h, false, 0, 1300).degressivite, 0)} dans notre calcul, et l’aide estimée passe à ${h.eur(z1(h, false, 0, 1300).aide)} pour 10 000 € de revenus. Le mécanisme figure dans l’arrêté du 28 septembre 2026.` },
      { q: 'À partir de quel loyer l’APL disparaît-elle en zone 1 ?', a: `À ${h.num(ks(h), 0)} fois le loyer plafond du foyer. Cela donne ${h.eur(pl(h, false, 0) * ks(h))} hors charges pour une personne seule, ${h.eur(pl(h, true, 0) * ks(h))} pour un couple sans enfant et ${h.eur(pl(h, true, 2) * ks(h))} pour une famille de deux enfants. Au-dessus, l’aide est nulle quels que soient les revenus. Ces seuils suivent le plafond : ils montent à chaque revalorisation du barème, la dernière datant du 1er octobre 2026.` },
      { q: 'Un couple parisien a-t-il plus de marge avant que l’aide ne baisse ?', a: `Oui, parce que son plafond est plus haut : ${h.eur(pl(h, true, 0))} contre ${h.eur(pl(h, false, 0))} pour une personne seule. La baisse commence donc vers ${h.eur(pl(h, true, 0) * kd(h))} de loyer au lieu de ${h.eur(pl(h, false, 0) * kd(h))}. En revanche, un couple déclare souvent deux revenus, et sa participation personnelle grimpe d’autant : la marge sur le loyer ne garantit pas une aide plus élevée.` },
      { q: 'Comment savoir si ma commune de banlieue est classée en zone 1 ?', a: `Le service en ligne de l’État « Connaître la zone de sa commune », signalé sur la fiche APL de service-public, donne la zone à partir du nom ou du code postal. Ne vous fiez pas à la distance de Paris : deux villes voisines peuvent relever de zones différentes. L’écart compte, puisque le plafond d’une personne seule passe de ${h.eur(pl(h, false, 0))} en zone 1 à ${h.eur(h.M.loyerPlafond(2, false, 0))} en zone 2.` },
      { q: 'Payer 950 € ou 1 100 € à Paris, cela change-t-il mon APL ?', a: `Non, tant que le loyer reste sous ${h.eur(pl(h, false, 0) * kd(h))} pour une personne seule. Dans les deux cas, la CAF ne retient que le plafond de ${h.eur(pl(h, false, 0))}, et l’estimation reste à ${h.eur(z1(h, false, 0, 1100).aide)} pour 10 000 € de revenus annuels. Les 150 € d’écart restent entièrement à votre charge. C’est pourquoi, à Paris, la recherche d’un loyer plus bas améliore le reste à vivre sans changer l’aide.` },
    ],
    body: (h) => `
<h2>Les plafonds de la zone 1 et les deux seuils qui les accompagnent</h2>
<p>Le loyer plafond est le montant maximum de loyer hors charges que la CAF fait entrer dans le calcul. Il dépend de la composition du foyer et de la zone, et l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')} l’a revalorisé au 1er octobre. En zone 1, deux autres montants comptent autant que lui : le loyer réel à partir duquel l’aide commence à baisser, et celui à partir duquel elle disparaît.</p>
${h.table(['Foyer', 'Loyer plafond', `Baisse dès (${h.num(kd(h), 1)} ×)`, `Aide nulle dès (${h.num(ks(h), 0)} ×)`], FOYERS.map(([c, n, fr]) => [fr, h.eur(pl(h, c, n), 2), h.eur(pl(h, c, n) * kd(h)), h.eur(pl(h, c, n) * ks(h))]), 'Zone 1, logement loué entier, barème du 1er octobre 2026', ['l', 'r', 'r', 'r'])}
<p>Chaque enfant supplémentaire au-delà du premier ajoute ${h.eur(h.P.apl.loyers_plafonds['1'].par_enfant, 2)} au plafond. Un parent seul et un couple qui ont le même nombre d’enfants partagent le même plafond : seule l’absence d’enfant distingue la personne seule du couple.</p>

<h2>Pourquoi le loyer réel ne pèse presque pas à Paris</h2>
<p>Dans la formule du ${h.src('cchD823', 'code de la construction et de l’habitation')}, l’aide est égale au loyer retenu, augmenté d’un forfait pour les charges, diminué d’une participation personnelle qui dépend des ressources. Le loyer retenu est le plus petit des deux montants : loyer réel ou plafond. À Paris, c’est presque toujours le plafond. Un locataire qui paie 950 € et un autre qui en paie 1 100 € entrent donc dans le calcul avec exactement la même valeur.</p>
<p>Une conséquence passe souvent inaperçue : en zone 1, l’APL couvre une part très faible du loyer. Pour notre personne seule à 950 €, l’aide estimée de ${h.eur(z1(h, false, 0, 950).aide)} représente ${h.pct(z1(h, false, 0, 950).aide / 950, 0)} du loyer. Dans une ville moyenne où le loyer serait proche du plafond, la même aide en couvrirait une fraction bien plus large.</p>

<h2>La dégressivité : ce qui se passe au-delà de ${h.num(kd(h), 1)} fois le plafond</h2>
<p>Pour ne pas financer des logements dont le loyer est hors de proportion avec les ressources du ménage, la réglementation réduit l’aide quand le loyer réel devient trop élevé. En zone 1, la réduction démarre à ${h.num(kd(h), 1)} fois le plafond et l’aide s’éteint à ${h.num(ks(h), 0)} fois ; dans les zones 2 et 3, les multiples sont de ${h.num(h.P.apl.degressivite['2'][0], 1)} et ${h.num(h.P.apl.degressivite['2'][1], 1)}. Entre les deux bornes, notre moteur applique une baisse proportionnelle : à mi-chemin, l’aide est réduite de moitié.</p>
<p>Exemple : un couple sans enfant paie 1 500 € hors charges. Son plafond est de ${h.eur(pl(h, true, 0))}, la baisse commence à ${h.eur(pl(h, true, 0) * kd(h))} et l’aide s’annule à ${h.eur(pl(h, true, 0) * ks(h))}. Avec 10 000 € de revenus, la réduction calculée est de ${h.pct(z1(h, true, 0, 1500).degressivite, 0)}, et l’aide estimée passe de ${h.eur(z1(h, true, 0, 1000).aide)} (loyer sous le seuil) à ${h.eur(z1(h, true, 0, 1500).aide)}.</p>
<!--mini:aplZone1-->

<h2>Cinq foyers parisiens, cinq résultats</h2>
<p>Le tableau suivant garde les mêmes ressources (10 000 € nets imposables sur douze mois) et fait varier le foyer et le loyer réel, avec des montants courants dans la capitale.</p>
${h.table(['Cas', 'Loyer réel', 'Plafond', 'Réduction', 'APL estimée'], CAS.map(([c, n, loyer, fr]) => { const r = z1(h, c, n, loyer); return [fr, h.eur(loyer), h.eur(r.plafond), h.pct(r.degressivite, 0), h.eur(r.aide)]; }), 'Zone 1, revenus de 10 000 € sur douze mois, barème du 1er octobre 2026 (estimation)', ['l', 'r', 'r', 'r', 'r'])}
<p>Le deux-pièces à 1 250 € d’une personne seule et celui à 1 500 € d’un couple sont dans la zone de dégressivité ; la famille à 1 900 € y échappe grâce à un plafond plus élevé. La colocation, fréquente à Paris, obéit à d’autres plafonds, détaillés sur la page ${h.a('apl-colocation', 'APL en colocation')}.</p>

<h2>Ce que la zone change dans la formule, et ce qu’elle laisse intact</h2>
<p>La zone agit sur deux pièces : le plafond, et les seuils de dégressivité. Les ressources sont lues de la même façon partout, sur les douze derniers mois, avec le même abattement forfaitaire. Le forfait charges, de ${h.eur(h.M.forfaitCharges(false, 0), 2)} pour une personne seule, ne varie pas non plus selon la ville. Le taux lié au loyer, lui, compare le loyer retenu au plafond de la zone 2 : comme le plafond parisien est plus haut, ce taux y est légèrement supérieur, ce qui grignote quelques euros d’aide.</p>

<h2>Avant de signer un bail en zone 1</h2>
<ul>
<li><strong>Calculer le seuil de baisse</strong> de son foyer avant de visiter : ${h.eur(pl(h, false, 0) * kd(h))} pour une personne seule, ${h.eur(pl(h, true, 0) * kd(h))} pour un couple.</li>
<li><strong>Vérifier la zone</strong> avec le service officiel indiqué par ${h.src('spApl', 'service-public')}, sans se fier à la carte.</li>
<li><strong>Demander l’aide dès l’entrée</strong> : le droit s’ouvre le mois qui suit la demande, et le versement a lieu le 5 du mois, en général directement au bailleur.</li>
<li><strong>Anticiper une hausse</strong> : un loyer qui augmente en cours d’année n’est revu qu’au 1er janvier suivant, sur la base du loyer de juillet, et peut alors faire franchir le seuil de dégressivité.</li>
</ul>
<p>Pour comparer avec une grande ville de province, voir ${h.a('apl-zone-2', 'l’APL en zone 2')}, et pour le détail de tous les plafonds, ${h.a('apl-loyer-plafond', 'le loyer plafond APL')}. Le ${h.a('simulateur-apl', 'simulateur APL')} reprend votre situation complète.</p>
`,
  },
  en: {
    slug: 'housing-aid-zone-1',
    nav: 'APL zone 1',
    card: 'Paris and its close suburbs: a ceiling you pass quickly, and aid that shrinks once rent soars.',
    title: 'APL Zone 1 2026: Paris Rent Ceiling and High-Rent Taper',
    description: 'APL zone 1 in 2026: the CAF counts at most €337 of rent for a single person; aid starts falling above 3.4 times that ceiling and stops at 4 times. Examples.',
    h1: 'Housing aid in zone 1: when rent is far above the ceiling',
    intro: 'In Paris the question is not whether your rent exceeds the ceiling, but by how much, because past a certain multiple the aid shrinks.',
    resume: (h) => `In zone 1, the area around Paris, the CAF (the family allowance fund that pays housing aid) never counts more than ${h.eur(pl(h, false, 0))} of monthly rent for a single person, ${h.eur(pl(h, true, 0))} for a couple and ${h.eur(pl(h, false, 1))} for a household with one child, on the scale in force since 1 October 2026. Almost every Paris rent is above those figures, so a €950 studio and a €1,100 studio open exactly the same aid: about ${h.eur(z1(h, false, 0, 950).aide)} a month for €10,000 of taxable net income over the year. Zone 1 does have one extra safeguard against very high rents. Once the actual rent passes ${h.num(kd(h), 1)} times the ceiling, which is ${h.eur(pl(h, false, 0) * kd(h))} for a single person, the APL (aide personnalisée au logement, the main housing benefit) tapers in a straight line and reaches zero at ${h.num(ks(h), 0)} times the ceiling, ${h.eur(pl(h, false, 0) * ks(h))}. In between, a €1,250 rent leaves only about ${h.eur(z1(h, false, 0, 1250).aide)}. These are estimates; only the CAF settles the entitlement, on your full file.`,
    faqs: (h) => [
      { q: 'I pay €1,300 for a one-bedroom flat in Paris; why is my CAF payment so small?', a: `Because your rent is past the taper threshold. For a single person the zone 1 ceiling is ${h.eur(pl(h, false, 0))}; above ${h.num(kd(h), 1)} times that, or ${h.eur(pl(h, false, 0) * kd(h))}, the aid is cut in proportion. At €1,300 our calculation applies a ${h.pct(z1(h, false, 0, 1300).degressivite, 0)} reduction, leaving an estimated ${h.eur(z1(h, false, 0, 1300).aide)} on €10,000 of income. The rule comes from the order of 28 September 2026 and earlier texts.` },
      { q: 'At what rent does APL stop altogether in zone 1?', a: `At ${h.num(ks(h), 0)} times your household's rent ceiling. That is ${h.eur(pl(h, false, 0) * ks(h))} excluding charges for a single person, ${h.eur(pl(h, true, 0) * ks(h))} for a couple without children and ${h.eur(pl(h, true, 2) * ks(h))} for a family with two children. Above that, the aid is zero whatever your income. These cut-offs move with the ceiling, so they rose with the 1 October 2026 uprating.` },
      { q: 'Does a couple renting in Paris get more headroom before the taper?', a: `Yes, since their ceiling is higher: ${h.eur(pl(h, true, 0))} against ${h.eur(pl(h, false, 0))} for a single person. The reduction therefore starts at about ${h.eur(pl(h, true, 0) * kd(h))} of rent rather than ${h.eur(pl(h, false, 0) * kd(h))}. But a couple often declares two incomes, which raises their own contribution, so extra headroom on rent does not mean more aid.` },
      { q: 'How do I find out whether my suburban town is in zone 1?', a: `Use the government's online tool "Connaître la zone de sa commune" (find your town's zone), linked from the APL page on service-public.fr; it works from the town name or postcode. Distance from Paris is not a reliable guide, as neighbouring towns can sit in different zones. It matters: the single-person ceiling drops from ${h.eur(pl(h, false, 0))} in zone 1 to ${h.eur(h.M.loyerPlafond(2, false, 0))} in zone 2.` },
      { q: 'Paris rent of €950 or €1,100: does it change my APL?', a: `No, as long as rent stays under ${h.eur(pl(h, false, 0) * kd(h))} for a single person. In both cases the CAF counts only the ${h.eur(pl(h, false, 0))} ceiling, and the estimate stays at ${h.eur(z1(h, false, 0, 1100).aide)} for €10,000 of yearly income. The €150 difference is yours alone. In Paris, hunting for a cheaper flat improves what you have left each month without moving the aid.` },
    ],
    body: (h) => `
<h2>Zone 1 ceilings and the two thresholds that go with them</h2>
<p>The rent ceiling (loyer plafond) is the most rent, excluding service charges, that the CAF will feed into the calculation. It depends on who lives with you and on the zone, and the ${h.src('arreteApl2026', 'order of 28 September 2026')} uprated it on 1 October. In zone 1, two other figures matter just as much: the actual rent at which aid begins to fall, and the rent at which it vanishes.</p>
${h.table(['Household', 'Rent ceiling', `Taper from (${h.num(kd(h), 1)} ×)`, `Zero aid from (${h.num(ks(h), 0)} ×)`], FOYERS.map(([c, n, , en]) => [en, h.eur(pl(h, c, n), 2), h.eur(pl(h, c, n) * kd(h)), h.eur(pl(h, c, n) * ks(h))]), 'Zone 1, whole home rented, scale of 1 October 2026', ['l', 'r', 'r', 'r'])}
<p>Each child after the first adds ${h.eur(h.P.apl.loyers_plafonds['1'].par_enfant, 2)} to the ceiling. A lone parent and a couple with the same number of children share one ceiling; only households without children are split between single people and couples.</p>

<h2>Why actual rent barely matters in Paris</h2>
<p>Under the formula in the ${h.src('cchD823', 'Construction and Housing Code')}, aid equals the rent counted plus a flat service-charge allowance, minus your own contribution, which depends on income. The rent counted is the lower of two figures: what you pay, or the ceiling. In Paris it is nearly always the ceiling, so a tenant paying €950 and one paying €1,100 enter the sum with the very same number.</p>
<p>The side effect is easy to miss: in zone 1, APL covers only a thin slice of the rent. For our single tenant at €950, the estimated ${h.eur(z1(h, false, 0, 950).aide)} is ${h.pct(z1(h, false, 0, 950).aide / 950, 0)} of the rent. In a mid-sized town with rent close to the ceiling, the same aid would cover a far larger share.</p>

<h2>The taper: what happens above ${h.num(kd(h), 1)} times the ceiling</h2>
<p>To avoid subsidising homes whose rent is out of all proportion to a household's means, the rules cut the aid once actual rent climbs too high. In zone 1 the cut starts at ${h.num(kd(h), 1)} times the ceiling and the aid ends at ${h.num(ks(h), 0)} times; in zones 2 and 3 the multiples are ${h.num(h.P.apl.degressivite['2'][0], 1)} and ${h.num(h.P.apl.degressivite['2'][1], 1)}. Between the two, our engine applies a proportional reduction: halfway along, the aid is halved.</p>
<p>Example: a couple with no children pays €1,500 excluding charges. Their ceiling is ${h.eur(pl(h, true, 0))}, the taper starts at ${h.eur(pl(h, true, 0) * kd(h))} and aid ends at ${h.eur(pl(h, true, 0) * ks(h))}. With €10,000 of income, the computed reduction is ${h.pct(z1(h, true, 0, 1500).degressivite, 0)}, taking the estimate from ${h.eur(z1(h, true, 0, 1000).aide)} (rent below the threshold) down to ${h.eur(z1(h, true, 0, 1500).aide)}.</p>
<!--mini:aplZone1-->

<h2>Five Paris households, five outcomes</h2>
<p>The table keeps income fixed (€10,000 of taxable net income over twelve months) and changes the household and the actual rent, using amounts that are common in the capital.</p>
${h.table(['Case', 'Actual rent', 'Ceiling', 'Reduction', 'Estimated APL'], CAS.map(([c, n, loyer, , en]) => { const r = z1(h, c, n, loyer); return [en, h.eur(loyer), h.eur(r.plafond), h.pct(r.degressivite, 0), h.eur(r.aide)]; }), 'Zone 1, income of €10,000 over twelve months, scale of 1 October 2026 (estimate)', ['l', 'r', 'r', 'r', 'r'])}
<p>The single person's €1,250 flat and the couple's €1,500 flat both fall inside the taper; the family paying €1,900 escapes it thanks to a higher ceiling. Flat-sharing, common in Paris, follows its own ceilings, covered on the ${h.a('apl-colocation', 'flat-share housing aid')} page.</p>

<h2>What the zone changes in the formula, and what it leaves alone</h2>
<p>The zone acts on two pieces only: the ceiling and the taper thresholds. Income is read the same way everywhere, over the last twelve months with the same flat deduction. The service-charge allowance, ${h.eur(h.M.forfaitCharges(false, 0), 2)} for a single person, does not vary by city either. The rent-related rate compares the rent counted with the zone 2 ceiling; because the Paris ceiling is higher, that rate is slightly higher there, which shaves a few euros off the aid.</p>

<h2>Before signing a lease in zone 1</h2>
<ul>
<li><strong>Work out your taper threshold</strong> before viewings: ${h.eur(pl(h, false, 0) * kd(h))} for a single person, ${h.eur(pl(h, true, 0) * kd(h))} for a couple.</li>
<li><strong>Check the zone</strong> with the official tool listed by ${h.src('spApl', 'service-public.fr')}, not by looking at a map.</li>
<li><strong>Claim as soon as you move in</strong>: entitlement opens the month after the claim, payment is made on the 5th, usually straight to the landlord, who deducts it from the rent.</li>
<li><strong>Plan for a rent rise</strong>: an increase during the year is only taken into account on 1 January, based on July's rent, and may then push you past the taper threshold.</li>
</ul>
<p>To compare with a large regional city, see ${h.a('apl-zone-2', 'housing aid in zone 2')}; for every ceiling in one place, see ${h.a('apl-loyer-plafond', 'the APL rent ceiling')}. The ${h.a('simulateur-apl', 'housing aid calculator')} takes your whole situation into account.</p>
`,
  },
});
