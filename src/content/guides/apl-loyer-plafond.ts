import { defineGuide, type Helpers } from '../../lib/guide-types';

type Z = 1 | 2 | 3;
const ZONES: Z[] = [1, 2, 3];
const pl = (h: Helpers, z: Z, couple: boolean, n: number) => h.M.loyerPlafond(z, couple, n);
const deg = (h: Helpers, z: Z) => h.P.apl.degressivite[String(z) as '1' | '2' | '3'];
/** Compositions du tableau : [couple, personnes à charge, libellé fr, libellé en]. */
const COMPO: Array<[boolean, number, string, string]> = [
  [false, 0, 'Personne seule', 'Single person'],
  [true, 0, 'Couple sans personne à charge', 'Couple, no dependants'],
  [false, 1, '1 personne à charge', '1 dependant'],
  [false, 2, '2 personnes à charge', '2 dependants'],
  [false, 3, '3 personnes à charge', '3 dependants'],
  [false, 4, '4 personnes à charge', '4 dependants'],
];
/** Aide d'une personne seule sans revenu dont le loyer est pile au plafond. */
const maxi = (h: Helpers, z: Z) => h.M.apl({ zone: z, couple: false, enfants: 0, loyer: pl(h, z, false, 0), revenusAnnuels: 0 });

export default defineGuide({
  id: 'apl-loyer-plafond',
  group: 'logement',
  order: 110,
  mini: 'aplLoyerPlafond',
  related: ['apl-calcul', 'apl-zone-1', 'apl-zone-3', 'apl-colocation', 'apl-chambre-foyer', 'simulateur-apl'],
  sources: ['arreteApl2026', 'spApl', 'cchD823'],
  fr: {
    slug: 'loyer-plafond-apl',
    nav: 'Loyer plafond APL',
    card: 'Le barème complet des loyers plafonds par zone et par foyer, et les seuils où l’aide baisse puis s’arrête.',
    title: 'Loyer plafond APL 2026 : barème par zone et par foyer',
    description: 'Loyer plafond APL 2026 : de 275 € à 337 € pour une personne seule. L’aide baisse au-delà de 2,5 ou 3,4 fois ce plafond, puis s’arrête. Barème complet.',
    h1: 'Le loyer plafond des aides au logement, zone par zone',
    intro: 'Le loyer plafond est la limite de loyer que la CAF fait entrer dans le calcul ; au-delà, l’aide ne suit plus, et bien au-delà, elle s’efface.',
    resume: (h) => `Au barème du 1er octobre 2026, le loyer plafond d’une personne seule est de ${h.eur(pl(h, 1, false, 0))} en zone 1, ${h.eur(pl(h, 2, false, 0))} en zone 2 et ${h.eur(pl(h, 3, false, 0))} en zone 3. Pour un couple sans enfant, il va de ${h.eur(pl(h, 3, true, 0))} à ${h.eur(pl(h, 1, true, 0))} ; avec une personne à charge, de ${h.eur(pl(h, 3, false, 1))} à ${h.eur(pl(h, 1, false, 1))}, puis chaque personne à charge supplémentaire ajoute entre ${h.eur(h.P.apl.loyers_plafonds['3'].par_enfant)} et ${h.eur(h.P.apl.loyers_plafonds['1'].par_enfant)}. Le plafond n’est pas le montant de l’aide : c’est le loyer maximum, hors charges, que la CAF retient avant de déduire la participation du foyer. En colocation, il est réduit à ${h.pct(h.P.apl.coef_colocation, 0)} ; pour une chambre, à ${h.pct(h.P.apl.coef_chambre, 0)}. Un second mécanisme vise les loyers très élevés : l’aide diminue quand le loyer réel dépasse ${h.num(deg(h, 1)[0], 1)} fois le plafond en zone 1, ${h.num(deg(h, 2)[0], 1)} fois en zones 2 et 3, et s’arrête à ${h.num(deg(h, 1)[1], 0)} et ${h.num(deg(h, 2)[1], 1)} fois. Ces valeurs servent à des estimations ; seule la CAF arrête le droit.`,
    faqs: (h) => [
      { q: 'Le loyer plafond APL correspond-il au montant maximum de l’aide ?', a: `Non. Le plafond limite le loyer pris en compte, pas l’aide. Celle-ci ajoute un forfait charges de ${h.eur(h.M.forfaitCharges(false, 0), 2)} et retire la participation personnelle. Une personne seule sans revenu dont le loyer atteint le plafond de la zone 2 obtiendrait environ ${h.eur(maxi(h, 2).aide)} dans notre calcul, un peu plus que le plafond de ${h.eur(pl(h, 2, false, 0))}. Dès que les ressources montent, l’aide passe nettement en dessous.` },
      { q: 'Les charges locatives entrent-elles dans le loyer plafond ?', a: `Non. Le loyer comparé au plafond est le loyer principal, hors charges. Les charges sont couvertes séparément par un forfait qui ne dépend pas des charges réelles : ${h.eur(h.M.forfaitCharges(false, 0), 2)} par mois pour une personne seule ou un couple, plus ${h.eur(h.P.apl.forfait_charges.par_enfant, 2)} par personne à charge. Déclarer un loyer charges comprises fausse donc la comparaison avec le plafond, surtout quand le loyer réel en est proche.` },
      { q: 'Mon loyer augmente en mars, quand la CAF en tiendra-t-elle compte ?', a: 'Pas tout de suite. Selon la fiche APL de service-public, une hausse de loyer en cours d’année n’est pas intégrée immédiatement : l’aide est réévaluée automatiquement au 1er janvier suivant, sur la base du loyer du mois de juillet précédent. Si votre loyer dépasse déjà le plafond, la hausse ne changera rien, sauf si elle vous fait franchir le seuil où l’aide commence à baisser.' },
      { q: 'La dégressivité de l’APL existe-t-elle aussi hors de Paris ?', a: `Oui, dans toutes les zones, avec des seuils plus bas hors zone 1. En zones 2 et 3, l’aide commence à diminuer quand le loyer réel dépasse ${h.num(deg(h, 2)[0], 1)} fois le plafond et disparaît à ${h.num(deg(h, 2)[1], 1)} fois. Pour une personne seule en zone 3, cela donne ${h.eur(pl(h, 3, false, 0) * deg(h, 3)[0])} puis ${h.eur(pl(h, 3, false, 0) * deg(h, 3)[1])} de loyer hors charges, selon l’arrêté du 28 septembre 2026.` },
      { q: 'Le plafond est-il réduit pour un colocataire dans toutes les zones ?', a: `Oui. En colocation, chaque colocataire se voit appliquer ${h.pct(h.P.apl.coef_colocation, 0)} du plafond de sa composition, quelle que soit la zone : pour une personne seule, ${h.eur(pl(h, 1, false, 0) * h.P.apl.coef_colocation, 2)} en zone 1, ${h.eur(pl(h, 2, false, 0) * h.P.apl.coef_colocation, 2)} en zone 2 et ${h.eur(pl(h, 3, false, 0) * h.P.apl.coef_colocation, 2)} en zone 3. Ce plafond réduit se compare à sa seule part du loyer, celle inscrite au bail.` },
    ],
    body: (h) => `
<h2>Le barème complet au 1er octobre 2026</h2>
<p>Les loyers plafonds sont fixés par arrêté ; les valeurs ci-dessous, revalorisées au 1er octobre 2026, viennent de l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')}. Ils dépendent de deux choses seulement : la zone de la commune et la composition du foyer. Ni l’âge, ni la surface du logement, ni le montant des ressources n’y entrent.</p>
${h.table(['Composition du foyer', 'Zone 1', 'Zone 2', 'Zone 3'], COMPO.map(([c, n, fr]) => [fr, ...ZONES.map((z) => h.eur(pl(h, z, c, n), 2))]), 'Loyer plafond mensuel hors charges, logement loué entier', ['l', 'r', 'r', 'r'])}
<p>Au-delà de quatre personnes à charge, on ajoute ${h.eur(h.P.apl.loyers_plafonds['1'].par_enfant, 2)} par personne en zone 1, ${h.eur(h.P.apl.loyers_plafonds['2'].par_enfant, 2)} en zone 2 et ${h.eur(h.P.apl.loyers_plafonds['3'].par_enfant, 2)} en zone 3. Avec au moins une personne à charge, le plafond est le même pour un parent seul et pour un couple. Pour savoir dans quelle zone se trouve une commune, le service en ligne officiel est indiqué sur la fiche ${h.src('spApl', 'APL de service-public')}.</p>

<h2>Colocation et chambre : deux coefficients</h2>
<p>Le plafond d’un logement loué entier ne s’applique pas tel quel à tous les locataires. En colocation, chaque colocataire a droit à ${h.pct(h.P.apl.coef_colocation, 0)} du plafond de sa propre composition ; pour une chambre, le plafond est ramené à ${h.pct(h.P.apl.coef_chambre, 0)}.</p>
${h.table(['Personne seule', 'Logement entier', `Colocation (${h.pct(h.P.apl.coef_colocation, 0)})`, `Chambre (${h.pct(h.P.apl.coef_chambre, 0)})`], ZONES.map((z) => [`Zone ${z}`, h.eur(pl(h, z, false, 0), 2), h.eur(pl(h, z, false, 0) * h.P.apl.coef_colocation, 2), h.eur(pl(h, z, false, 0) * h.P.apl.coef_chambre, 2)]), 'Plafonds réduits, barème du 1er octobre 2026', ['l', 'r', 'r', 'r'])}
<p>Le forfait charges change aussi en colocation : ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'), 2)} pour une personne seule au lieu de ${h.eur(h.M.forfaitCharges(false, 0), 2)}. Les règles propres à ces logements sont détaillées sur les pages ${h.a('apl-colocation', 'APL en colocation')} et ${h.a('apl-chambre-foyer', 'APL en chambre ou en foyer')}.</p>

<h2>Au-dessus du plafond : d’abord rien de plus, ensuite moins</h2>
<p>Tant que le loyer réel reste au-dessus du plafond mais pas trop loin, l’aide est figée : le loyer retenu est le plafond, quel que soit l’écart. Puis vient la dégressivité. Quand le loyer réel dépasse un premier multiple du plafond, l’aide décroît ; à un second multiple, elle est supprimée. Les multiples ne sont pas les mêmes partout.</p>
${h.table(['Zone', 'Baisse dès', 'Suppression dès', 'Personne seule : baisse', 'Personne seule : suppression', 'Couple : suppression'], ZONES.map((z) => [`Zone ${z}`, `${h.num(deg(h, z)[0], 1)} ×`, `${h.num(deg(h, z)[1], 1)} ×`, h.eur(pl(h, z, false, 0) * deg(h, z)[0]), h.eur(pl(h, z, false, 0) * deg(h, z)[1]), h.eur(pl(h, z, true, 0) * deg(h, z)[1])]), 'Loyer réel hors charges, barème du 1er octobre 2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Entre les deux seuils, notre moteur applique une réduction proportionnelle à la distance parcourue : un loyer situé au quart de l’intervalle retire un quart de l’aide. Ces seuils concernent surtout la zone 1, où les loyers réels dépassent largement le plafond ; la page ${h.a('apl-zone-1', 'APL en zone 1')} en donne des exemples.</p>
<!--mini:aplLoyerPlafond-->

<h2>Lire son propre plafond : un exemple en trois étapes</h2>
<p>Un couple avec deux enfants loue 800 € hors charges dans une commune de zone 2. Première étape, trouver la ligne du tableau : deux personnes à charge, soit un plafond de ${h.eur(pl(h, 2, true, 2), 2)}. Deuxième étape, comparer : le loyer réel dépasse ce montant, la CAF retiendra donc ${h.eur(pl(h, 2, true, 2), 2)} et non 800 €. Troisième étape, situer le loyer par rapport aux seuils de dégressivité : la baisse ne commencerait qu’à ${h.eur(pl(h, 2, true, 2) * deg(h, 2)[0])}, très loin. Ce foyer touche donc l’aide correspondant au plafond, ni plus ni moins, et un déménagement vers un logement à 700 € ne la changerait pas. Avec un troisième enfant, le plafond monterait à ${h.eur(pl(h, 2, true, 3), 2)}, et c’est seulement par ce biais que l’aide progresserait. Le mini-simulateur ci-dessus refait ces trois étapes pour n’importe quel foyer.</p>

<h2>Quand une hausse de loyer est prise en compte</h2>
<p>Le loyer déclaré n’est pas relu chaque mois. D’après la fiche ${h.src('spApl', 'APL de service-public')}, une augmentation intervenue en cours d’année n’entre pas immédiatement dans le calcul : l’aide est réévaluée au 1er janvier de l’année suivante, à partir du loyer du mois de juillet précédent. Le barème, lui, a été revalorisé au 1er octobre 2026 : le plafond et votre loyer ne bougent donc pas à la même date. Un locataire sous le plafond, fréquent en ${h.a('apl-zone-3', 'zone 3')}, verra sa hausse de loyer suivie d’une hausse d’aide en janvier ; un locataire déjà au-dessus ne verra rien changer.</p>

<h2>Ce que le plafond ne dit pas</h2>
<p>Le plafond borne une seule pièce de la formule du ${h.src('cchD823', 'code de la construction et de l’habitation')}. L’aide est égale au loyer retenu plus le forfait charges, moins la participation personnelle, elle-même faite d’un minimum et d’un pourcentage des ressources au-delà d’un abattement. Deux foyers au même plafond peuvent donc toucher des montants très différents. Sans revenu, une personne seule au plafond de la zone 1 obtiendrait environ ${h.eur(maxi(h, 1).aide)} ; en zone 3, ${h.eur(maxi(h, 3).aide)}. La page ${h.a('apl-calcul', 'calcul de l’APL')} déroule la formule complète, et le ${h.a('simulateur-apl', 'simulateur APL')} l’applique à votre cas.</p>
`,
  },
  en: {
    slug: 'housing-aid-rent-ceiling',
    nav: 'APL rent ceiling',
    card: 'The full table of rent ceilings by zone and household, and the thresholds where aid tapers and then stops.',
    title: 'APL Rent Ceiling 2026: Full Scale by Zone and Household',
    description: 'APL rent ceiling in 2026: €275 to €337 for a single person depending on the zone. Aid tapers above 2.5 or 3.4 times the ceiling, then stops. Full scale here.',
    h1: 'The housing aid rent ceiling, zone by zone',
    intro: 'The rent ceiling is the most rent the CAF feeds into the calculation; above it the aid stops following, and far above it the aid fades away.',
    resume: (h) => `On the scale in force since 1 October 2026, the rent ceiling (loyer plafond) for a single person is ${h.eur(pl(h, 1, false, 0))} in zone 1 (Paris area), ${h.eur(pl(h, 2, false, 0))} in zone 2 (large cities) and ${h.eur(pl(h, 3, false, 0))} in zone 3 (elsewhere). For a couple without children it ranges from ${h.eur(pl(h, 3, true, 0))} to ${h.eur(pl(h, 1, true, 0))}; with one dependant, from ${h.eur(pl(h, 3, false, 1))} to ${h.eur(pl(h, 1, false, 1))}, and each further dependant adds between ${h.eur(h.P.apl.loyers_plafonds['3'].par_enfant)} and ${h.eur(h.P.apl.loyers_plafonds['1'].par_enfant)}. The ceiling is not the amount of aid: it is the most rent, excluding service charges, that the CAF (the family allowance fund) counts before deducting the household's own contribution. In a flat-share it is cut to ${h.pct(h.P.apl.coef_colocation, 0)}; for a single room, to ${h.pct(h.P.apl.coef_chambre, 0)}. A second mechanism targets very high rents: aid falls once actual rent passes ${h.num(deg(h, 1)[0], 1)} times the ceiling in zone 1 and ${h.num(deg(h, 2)[0], 1)} times in zones 2 and 3, and stops at ${h.num(deg(h, 1)[1], 0)} and ${h.num(deg(h, 2)[1], 1)} times. These figures support estimates; only the CAF decides the entitlement.`,
    faqs: (h) => [
      { q: 'Is the APL rent ceiling the most housing aid I can get?', a: `No. The ceiling limits the rent counted, not the aid. The aid adds a ${h.eur(h.M.forfaitCharges(false, 0), 2)} service-charge allowance and subtracts your own contribution. A single person with no income whose rent reaches the zone 2 ceiling would get about ${h.eur(maxi(h, 2).aide)} in our calculation, slightly more than the ${h.eur(pl(h, 2, false, 0))} ceiling. Once income rises, the aid drops well below it.` },
      { q: 'Are service charges included in the rent the CAF compares with the ceiling?', a: `No. The rent compared with the ceiling is the base rent, excluding service charges (charges locatives). Charges are covered separately by a flat allowance that ignores your actual bills: ${h.eur(h.M.forfaitCharges(false, 0), 2)} a month for a single person or a couple, plus ${h.eur(h.P.apl.forfait_charges.par_enfant, 2)} per dependant. Declaring rent including charges distorts the comparison, especially when rent is close to the ceiling.` },
      { q: 'My rent goes up in March; when will the CAF take it into account?', a: 'Not straight away. According to the APL page on service-public.fr, a rent rise during the year is not included immediately: the aid is reassessed automatically on 1 January of the following year, using the rent paid in July. If your rent is already above the ceiling, the rise changes nothing, unless it pushes you past the point where the aid starts to taper.' },
      { q: 'Does the high-rent taper on APL apply outside Paris as well?', a: `Yes, in every zone, with lower thresholds outside zone 1. In zones 2 and 3, aid starts to fall once actual rent passes ${h.num(deg(h, 2)[0], 1)} times the ceiling and disappears at ${h.num(deg(h, 2)[1], 1)} times. For a single person in zone 3, that means ${h.eur(pl(h, 3, false, 0) * deg(h, 3)[0])} and then ${h.eur(pl(h, 3, false, 0) * deg(h, 3)[1])} of rent excluding charges, under the order of 28 September 2026.` },
      { q: 'Is the rent ceiling lower for a flatmate in every zone?', a: `Yes. In a flat-share (colocation), each flatmate gets ${h.pct(h.P.apl.coef_colocation, 0)} of the ceiling for their own household type, whatever the zone: for a single person, ${h.eur(pl(h, 1, false, 0) * h.P.apl.coef_colocation, 2)} in zone 1, ${h.eur(pl(h, 2, false, 0) * h.P.apl.coef_colocation, 2)} in zone 2 and ${h.eur(pl(h, 3, false, 0) * h.P.apl.coef_colocation, 2)} in zone 3. That reduced ceiling is compared with your own share of the rent, as written in the lease.` },
    ],
    body: (h) => `
<h2>The full scale on 1 October 2026</h2>
<p>Rent ceilings are set by ministerial order; the figures below, uprated on 1 October 2026, come from the ${h.src('arreteApl2026', 'order of 28 September 2026')}. They depend on two things only: the zone of the town and the make-up of the household. Age, floor area and income play no part.</p>
${h.table(['Household', 'Zone 1', 'Zone 2', 'Zone 3'], COMPO.map(([c, n, , en]) => [en, ...ZONES.map((z) => h.eur(pl(h, z, c, n), 2))]), 'Monthly rent ceiling excluding charges, whole home rented', ['l', 'r', 'r', 'r'])}
<p>Beyond four dependants, add ${h.eur(h.P.apl.loyers_plafonds['1'].par_enfant, 2)} per person in zone 1, ${h.eur(h.P.apl.loyers_plafonds['2'].par_enfant, 2)} in zone 2 and ${h.eur(h.P.apl.loyers_plafonds['3'].par_enfant, 2)} in zone 3. With at least one dependant, the ceiling is the same for a lone parent and a couple. To find a town's zone, the official online tool is listed on the ${h.src('spApl', 'service-public.fr APL page')}.</p>

<h2>Flat-shares and single rooms: two coefficients</h2>
<p>The whole-home ceiling does not apply as such to every tenant. In a flat-share each flatmate is entitled to ${h.pct(h.P.apl.coef_colocation, 0)} of the ceiling for their own household type; for a single room, the ceiling drops to ${h.pct(h.P.apl.coef_chambre, 0)}.</p>
${h.table(['Single person', 'Whole home', `Flat-share (${h.pct(h.P.apl.coef_colocation, 0)})`, `Room (${h.pct(h.P.apl.coef_chambre, 0)})`], ZONES.map((z) => [`Zone ${z}`, h.eur(pl(h, z, false, 0), 2), h.eur(pl(h, z, false, 0) * h.P.apl.coef_colocation, 2), h.eur(pl(h, z, false, 0) * h.P.apl.coef_chambre, 2)]), 'Reduced ceilings, scale of 1 October 2026', ['l', 'r', 'r', 'r'])}
<p>The charges allowance changes too in a flat-share: ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'), 2)} for a single person instead of ${h.eur(h.M.forfaitCharges(false, 0), 2)}. The rules for these homes are on the ${h.a('apl-colocation', 'flat-share housing aid')} and ${h.a('apl-chambre-foyer', 'room or hostel housing aid')} pages.</p>

<h2>Above the ceiling: first nothing more, then less</h2>
<p>While actual rent sits above the ceiling but not too far, the aid is frozen: the rent counted is the ceiling, whatever the gap. Then comes the taper (dégressivité). Once actual rent passes a first multiple of the ceiling, aid shrinks; at a second multiple it is removed. The multiples differ between zones.</p>
${h.table(['Zone', 'Taper from', 'Removed from', 'Single: taper', 'Single: removed', 'Couple: removed'], ZONES.map((z) => [`Zone ${z}`, `${h.num(deg(h, z)[0], 1)} ×`, `${h.num(deg(h, z)[1], 1)} ×`, h.eur(pl(h, z, false, 0) * deg(h, z)[0]), h.eur(pl(h, z, false, 0) * deg(h, z)[1]), h.eur(pl(h, z, true, 0) * deg(h, z)[1])]), 'Actual rent excluding charges, scale of 1 October 2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Between the two thresholds our engine applies a reduction in proportion to the distance covered: rent a quarter of the way along removes a quarter of the aid. These thresholds mostly bite in zone 1, where actual rents run far above the ceiling; the ${h.a('apl-zone-1', 'zone 1 housing aid')} page has examples.</p>
<!--mini:aplLoyerPlafond-->

<h2>Reading your own ceiling: an example in three steps</h2>
<p>A couple with two children rents a home for €800 excluding charges in a zone 2 town. Step one, find the row in the table: two dependants, so a ceiling of ${h.eur(pl(h, 2, true, 2), 2)}. Step two, compare: the actual rent is higher, so the CAF will count ${h.eur(pl(h, 2, true, 2), 2)}, not €800. Step three, place the rent against the taper thresholds: the reduction would only start at ${h.eur(pl(h, 2, true, 2) * deg(h, 2)[0])}, a long way off. This household therefore receives the aid that matches the ceiling, no more and no less, and moving to a €700 home would not change it. With a third child the ceiling would rise to ${h.eur(pl(h, 2, true, 3), 2)}, and only that would lift the aid. The mini calculator above repeats these three steps for any household.</p>

<h2>When a rent rise is taken into account</h2>
<p>Declared rent is not re-read every month. According to the ${h.src('spApl', 'service-public.fr APL page')}, an increase during the year does not enter the calculation straight away: the aid is reassessed on 1 January of the next year, based on July's rent. The scale itself was uprated on 1 October 2026, so the ceiling and your counted rent do not change on the same date. A tenant below the ceiling, common in ${h.a('apl-zone-3', 'zone 3')}, will see a rent rise followed by higher aid in January; a tenant already above it will see no change.</p>

<h2>What the ceiling does not tell you</h2>
<p>The ceiling caps only one part of the formula in the ${h.src('cchD823', 'Construction and Housing Code')}. Aid equals the rent counted plus the charges allowance, minus your own contribution, itself made of a minimum and a percentage of income above an allowance. Two households on the same ceiling can therefore receive very different sums. With no income, a single person at the zone 1 ceiling would get about ${h.eur(maxi(h, 1).aide)}; in zone 3, ${h.eur(maxi(h, 3).aide)}. The ${h.a('apl-calcul', 'APL calculation')} page walks through the whole formula, and the ${h.a('simulateur-apl', 'housing aid calculator')} applies it to your case.</p>
`,
  },
});
