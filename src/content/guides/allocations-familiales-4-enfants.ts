import { defineGuide, type Helpers } from '../../lib/guide-types';

const af = (h: Helpers, enfants: number, revenus: number, majorables = 0, vingtAns = 0) => h.M.allocationsFamiliales({ enfants, majorables, revenus, vingtAns });
const parEnfant = (h: Helpers, t: 0 | 1 | 2) => h.M.baseAf(4, t) - h.M.baseAf(3, t);
/** Famille Lefèvre : cinq enfants, 75 000 € de revenus (premier niveau de revenus quelle que soit la taille), hors majorations. */
const R = 75000;
const etapes = (h: Helpers, fr: boolean): Array<[string, number]> => [
  [fr ? 'Cinq enfants de moins de 20 ans' : 'Five children under 20', af(h, 5, R).total],
  [fr ? 'L’aîné a 20 ans : quatre enfants + forfait' : 'Eldest turns 20: four children + flat rate', af(h, 4, R, 0, 1).total],
  [fr ? 'Un an plus tard : quatre enfants' : 'A year later: four children', af(h, 4, R).total],
  [fr ? 'Le deuxième a 20 ans : trois enfants + forfait' : 'Second turns 20: three children + flat rate', af(h, 3, R, 0, 1).total],
  [fr ? 'Un an plus tard : trois enfants' : 'A year later: three children', af(h, 3, R).total],
  [fr ? 'Le troisième a 20 ans : deux enfants + forfait' : 'Third turns 20: two children + flat rate', h.M.baseAf(2, 0) + h.P.af.forfait_20_ans[0]],
  [fr ? 'Un an plus tard : deux enfants' : 'A year later: two children', af(h, 2, R).total],
];

export default defineGuide({
  id: 'allocations-familiales-4-enfants',
  group: 'famille',
  order: 40,
  mini: 'afFamilleNombreuse',
  miniHref: 'simulateur-allocations-familiales',
  related: ['simulateur-allocations-familiales', 'allocations-familiales-3-enfants', 'allocation-forfaitaire-20-ans', 'complement-familial', 'majoration-allocations-familiales'],
  sources: ['spAf', 'instructionPf2026', 'spCf'],
  fr: {
    slug: 'allocations-familiales-4-enfants',
    nav: 'Allocations familiales, 4 enfants et plus',
    card: 'Le montant ajouté par chaque enfant au-delà du troisième, les plafonds qui montent et la descente quand les aînés partent.',
    title: 'Allocations familiales 4 enfants et plus 2026 : montants',
    description: 'Allocations familiales 2026 : 542,39 € par mois pour 4 enfants sous 93 308 € de revenus 2024, puis 195,07 € par enfant en plus. Plafonds, calendrier de sortie.',
    h1: 'Allocations familiales avec quatre enfants ou plus',
    intro: 'Au-delà de trois enfants, chaque enfant ajoute le même montant ; la vraie question devient le rythme auquel les aînés sortent du calcul.',
    resume: (h) => `Avec quatre enfants à charge, la CAF verse ${h.eur(h.M.baseAf(4, 0), 2)} d’allocations familiales par mois en 2026 si le revenu net catégoriel ${h.P.af.revenus_reference} du foyer ne dépasse pas ${h.eur(h.M.plafondsAf(4)[0])}. Chaque enfant supplémentaire ajoute ${h.eur(parEnfant(h, 0), 2)} au montant plein : ${h.eur(h.M.baseAf(5, 0), 2)} pour cinq enfants, ${h.eur(h.M.baseAf(6, 0), 2)} pour six. Les plafonds montent de ${h.eur(h.P.af.plafonds.par_enfant)} par enfant au-delà du troisième ; une famille de cinq garde le montant plein jusqu’à ${h.eur(h.M.plafondsAf(5)[0])}. Les majorations pour âge s’ajoutent, à raison de ${h.eur(h.P.af.majoration[0], 2)} par enfant né avant le ${h.date(h.P.af.bascule_majoration)} au premier niveau. Dans une famille nombreuse, le montant évolue surtout au fil des départs : chaque enfant qui atteint ${h.P.af.age_limite} ans retire une part, adoucie un an par l’allocation forfaitaire. Les revenus pris en compte sont ceux de l’avis d’imposition 2025, et les montants sont nets de CRDS. Ce sont des estimations ; la CAF calcule seule le droit réel.`,
    faqs: (h) => [
      { q: 'Combien la CAF ajoute-t-elle pour un quatrième enfant ?', a: `${h.eur(parEnfant(h, 0), 2)} par mois au premier niveau de revenus : une famille passe de ${h.eur(h.M.baseAf(3, 0), 2)} à ${h.eur(h.M.baseAf(4, 0), 2)}. Le gain est moindre qu’au troisième enfant, qui apporte ${h.eur(h.M.baseAf(3, 0) - h.M.baseAf(2, 0), 2)}. Il est divisé par deux, puis par quatre, quand le revenu ${h.P.af.revenus_reference} dépasse les plafonds, selon le barème publié par service-public.` },
      { q: 'Quel est le plafond de revenus des allocations familiales pour 5 enfants ?', a: `${h.eur(h.M.plafondsAf(5)[0])} pour le montant plein et ${h.eur(h.M.plafondsAf(5)[1])} pour le montant divisé par deux, en revenu net catégoriel ${h.P.af.revenus_reference}. Ces chiffres prolongent le barème de service-public : ${h.eur(h.M.plafondsAf(4)[0])} pour quatre enfants, plus ${h.eur(h.P.af.plafonds.par_enfant)} par enfant supplémentaire. À 105 000 €, une famille de cinq touche ${h.eur(af(h, 5, 105000).total, 2)}.` },
      { q: 'Le complément familial augmente-t-il avec le nombre d’enfants ?', a: `Non, son montant reste de ${h.eur(h.P.cf.base, 2)} ou ${h.eur(h.P.cf.majore, 2)} par mois, que la famille compte trois ou six enfants. Seuls les plafonds montent : ${h.eur(h.P.cf.plafonds.un_revenu[1])} pour quatre enfants et un revenu, puis ${h.eur(h.P.cf.plafonds.par_enfant)} par enfant en plus, d’après la fiche service-public du complément familial.` },
      { q: 'Avec six enfants, combien touche-t-on d’allocations familiales par an ?', a: `Au premier niveau de revenus, ${h.eur(h.M.baseAf(6, 0), 2)} par mois, soit ${h.eur(h.M.baseAf(6, 0) * 12)} sur douze mois, avant toute majoration pour âge. Le plafond de ce niveau est de ${h.eur(h.M.plafondsAf(6)[0])} de revenus ${h.P.af.revenus_reference}. Au-delà de ${h.eur(h.M.plafondsAf(6)[1])}, la somme tombe à ${h.eur(h.M.baseAf(6, 2), 2)} par mois.` },
      { q: 'Nous gagnons 100 000 € avec quatre enfants, que verse la CAF ?', a: `${h.eur(af(h, 4, 100000).total, 2)} par mois hors majorations. Le foyer dépasse de ${h.eur(100000 - h.M.plafondsAf(4)[0])} le plafond de ${h.eur(h.M.plafondsAf(4)[0])} : c’est trop pour le complément dégressif, qui s’arrête quand l’écart atteint douze fois la différence entre les deux montants. L’allocation est donc divisée par deux. Avec un cinquième enfant, le même revenu resterait sous le plafond de ${h.eur(h.M.plafondsAf(5)[0])}.` },
      { q: 'Famille recomposée avec quatre enfants sous notre toit : quel barème ?', a: `Celui des enfants dont vous assumez la charge effective et permanente, selon service-public : nourriture, logement, habillement, éducation. Aucun lien de filiation n’est exigé, un enfant du conjoint qui vit chez vous peut donc compter. Si les quatre sont à votre charge, la famille relève du barème de quatre enfants, ${h.eur(h.M.baseAf(4, 0), 2)} au premier niveau ; un enfant qui vit surtout chez son autre parent compte chez lui.` },
      { q: 'Nos quatre enfants sont adolescents : combien de majorations ?', a: `Autant que d’enfants nés avant le 1er mars 2012 : à partir de trois enfants, l’aîné compte aussi. Quatre adolescents nés avant cette date ouvrent quatre majorations de ${h.eur(h.P.af.majoration[0], 2)}, soit ${h.eur(af(h, 4, 70000, 4).total, 2)} par mois pour 70 000 € de revenus. Un enfant né après cette date attendra ses ${h.P.af.age_majoration_nouveau} ans.` },
    ],
    body: (h) => `
<h2>Un montant fixe par enfant au-delà du troisième</h2>
<p>À partir du quatrième, le barème devient linéaire : chaque enfant ajoute ${h.pct(h.P.af.taux_bmaf.par_enfant_suivant, 0)} de la base mensuelle de calcul (BMAF), soit ${h.eur(parEnfant(h, 0), 2)} au montant plein, ${h.eur(parEnfant(h, 1), 2)} au montant divisé par deux et ${h.eur(parEnfant(h, 2), 2)} au montant divisé par quatre, d’après l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}. Les plafonds suivent le même principe, à ${h.eur(h.P.af.plafonds.par_enfant)} par enfant.</p>
${h.table(['Enfants', 'Montant plein', 'Plafond 1', 'Divisé par 2', 'Plafond 2', 'Divisé par 4'], [4, 5, 6, 7, 8].map((n) => [String(n), h.eur(h.M.baseAf(n, 0), 2), h.eur(h.M.plafondsAf(n)[0]), h.eur(h.M.baseAf(n, 1), 2), h.eur(h.M.plafondsAf(n)[1]), h.eur(h.M.baseAf(n, 2), 2)]), 'Familles nombreuses : montants mensuels hors majorations, revenus 2024 (estimation)', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>La ${h.src('spAf', 'fiche service-public')} publie le barème jusqu’à quatre enfants ; les lignes suivantes appliquent la même progression.</p>
<!--mini:afFamilleNombreuse-->

<h2>La descente, un aîné après l’autre</h2>
<p>Dans une famille nombreuse, le montant du mois n’est qu’une photographie. Les aînés atteignent ${h.P.af.age_limite} ans à quelques années d’intervalle, et chaque anniversaire retire une part. Prenons la famille Lefèvre : cinq enfants, ${h.eur(R)} de revenu net catégoriel, un niveau qui reste sous le premier plafond quelle que soit la taille de la famille. Hors majorations, voici ce que verse la CAF à chaque étape :</p>
${h.table(['Étape', 'Par mois'], etapes(h, true).map(([e, v]) => [e, h.eur(v, 2)]), 'Famille de cinq enfants, 75 000 € de revenus 2024, hors majorations', ['l', 'r'])}
<p>Chaque sortie coûte ${h.eur(parEnfant(h, 0), 2)} tant qu’il reste au moins trois enfants, puis ${h.eur(h.M.baseAf(3, 0) - h.M.baseAf(2, 0), 2)} quand on passe de trois à deux. Le forfait de ${h.eur(h.P.af.forfait_20_ans[0], 2)} amortit chaque marche pendant un an, à condition que le jeune vive encore au foyer et gagne peu. Le détail est sur la page ${h.a('allocation-forfaitaire-20-ans', 'allocation forfaitaire des 20 ans')}.</p>

<h2>Un enfant de plus peut faire repasser au montant plein</h2>
<p>Comme le plafond monte avec chaque naissance, un nouvel enfant change parfois de niveau de revenus toute la famille. Les Benali ont quatre enfants et déclarent 96 000 € de revenu net catégoriel ${h.P.af.revenus_reference}. Ils dépassent de ${h.eur(96000 - h.M.plafondsAf(4)[0])} le plafond de quatre enfants : la CAF leur verse ${h.eur(af(h, 4, 96000).total, 2)} par mois, dont ${h.eur(af(h, 4, 96000).complement, 2)} de ${h.a('complement-degressif', 'complément dégressif')}. À la naissance du cinquième, le plafond passe à ${h.eur(h.M.plafondsAf(5)[0])} et le foyer se retrouve dessous, sans que ses revenus aient changé : ${h.eur(af(h, 5, 96000).total, 2)} par mois, soit ${h.eur(af(h, 5, 96000).total - af(h, 4, 96000).total, 2)} de plus, bien au-delà de la seule part du cinquième enfant.</p>
<p>L’effet joue en sens inverse lors des départs. Quand l’aîné d’une famille de cinq atteint ${h.P.af.age_limite} ans, le plafond redescend de ${h.eur(h.P.af.plafonds.par_enfant)} ; un foyer proche de la limite peut alors perdre à la fois une part et le montant plein. C’est pour ces familles qu’une simulation à chaque anniversaire est utile.</p>

<h2>Les adolescents d’une grande fratrie</h2>
<p>Les majorations pèsent lourd quand plusieurs enfants sont adolescents en même temps. Dès trois enfants, chacun compte. Une famille de quatre à 70 000 € dont deux enfants sont nés avant le ${h.date(h.P.af.bascule_majoration)} reçoit ${h.eur(af(h, 4, 70000, 2).total, 2)} par mois. Les plus jeunes, nés après cette date, n’ouvriront la leur qu’à ${h.P.af.age_majoration_nouveau} ans, et seulement s’ils sont encore à charge. La réforme est expliquée sur la page ${h.a('majoration-allocations-familiales', 'majoration pour âge')}.</p>

<h2>Ce qui ne grandit pas avec la famille</h2>
<p>Le ${h.a('complement-familial', 'complément familial')} ne dépend pas du nombre d’enfants : ${h.eur(h.P.cf.base, 2)} ou ${h.eur(h.P.cf.majore, 2)} par mois, que la fratrie compte trois ou sept enfants, selon la ${h.src('spCf', 'fiche du complément familial')}. Seul son plafond s’élève : ${h.eur(h.P.cf.plafonds.un_revenu[1])} pour quatre enfants et un revenu, ${h.eur(h.P.cf.plafonds.deux_revenus[1])} avec deux revenus ou pour un parent isolé. Pour une famille de quatre à 50 000 € et un seul revenu, cela fait ${h.eur(h.M.complementFamilial({ enfants3a21: 4, deuxRevenus: false, revenus: 50000 }).cf, 2)} de plus par mois, à condition que tous les enfants aient au moins ${h.P.cf.age_min} ans.</p>
<p>Le ${h.a('simulateur-allocations-familiales', 'simulateur des allocations familiales')} accepte jusqu’à douze enfants et ajoute les majorations et le forfait.</p>
`,
  },
  en: {
    slug: 'family-allowance-four-children',
    nav: 'Family allowance, 4+ children',
    card: 'The amount each child adds beyond the third, the rising ceilings, and the step-down as the eldest leave.',
    title: 'Family Allowance 4+ Children 2026: Amounts and Ceilings',
    description: 'Family allowance 2026 in France: €542.39 a month for 4 children below €93,308 of 2024 income, then €195.07 per extra child. Ceilings and the step-down by age.',
    h1: 'Family allowance with four or more children',
    intro: 'Beyond three children, each child adds the same amount; the real question becomes how fast the eldest leave the count.',
    resume: (h) => `With four dependent children, the CAF (Caisse d'allocations familiales, the family benefits office) pays ${h.eur(h.M.baseAf(4, 0), 2)} of family allowance a month in 2026 if the household's ${h.P.af.revenus_reference} net income is no more than ${h.eur(h.M.plafondsAf(4)[0])}. Each additional child adds ${h.eur(parEnfant(h, 0), 2)} to the full amount: ${h.eur(h.M.baseAf(5, 0), 2)} for five children, ${h.eur(h.M.baseAf(6, 0), 2)} for six. Ceilings rise by ${h.eur(h.P.af.plafonds.par_enfant)} per child beyond the third; a family of five keeps the full rate up to ${h.eur(h.M.plafondsAf(5)[0])}. Age supplements come on top, at ${h.eur(h.P.af.majoration[0], 2)} per child born before ${h.date(h.P.af.bascule_majoration)} at the lowest income level. In a large family, the amount mostly changes as children leave: each one who turns ${h.P.af.age_limite} removes a share, softened for a year by a flat-rate payment. Income is the revenu net catégoriel on the 2025 tax assessment notice (avis d'imposition), and amounts are net of the CRDS levy. These are estimates; only the CAF sets the actual entitlement.`,
    faqs: (h) => [
      { q: 'How much does the CAF add for a fourth child?', a: `${h.eur(parEnfant(h, 0), 2)} a month at the lowest income level: a family goes from ${h.eur(h.M.baseAf(3, 0), 2)} to ${h.eur(h.M.baseAf(4, 0), 2)}. That is less than the third child, who brings ${h.eur(h.M.baseAf(3, 0) - h.M.baseAf(2, 0), 2)}. It is halved, then quartered, once ${h.P.af.revenus_reference} income passes the ceilings, according to the scale published on service-public.fr.` },
      { q: 'What is the family allowance income ceiling for 5 children?', a: `${h.eur(h.M.plafondsAf(5)[0])} for the full amount and ${h.eur(h.M.plafondsAf(5)[1])} for the halved amount, in ${h.P.af.revenus_reference} revenu net catégoriel. These figures extend the service-public.fr scale: ${h.eur(h.M.plafondsAf(4)[0])} for four children, plus ${h.eur(h.P.af.plafonds.par_enfant)} per additional child. On €105,000, a family of five receives ${h.eur(af(h, 5, 105000).total, 2)} a month, before any age supplement.` },
      { q: 'Does the family supplement grow with the number of children?', a: `No. The family supplement (complément familial) stays at ${h.eur(h.P.cf.base, 2)} or ${h.eur(h.P.cf.majore, 2)} a month whether the family has three or six children. Only the ceilings rise: ${h.eur(h.P.cf.plafonds.un_revenu[1])} for four children on one income, then ${h.eur(h.P.cf.plafonds.par_enfant)} per extra child, according to the service-public.fr page on the supplement.` },
      { q: 'With six children, how much family allowance do we get in a year?', a: `At the lowest income level, ${h.eur(h.M.baseAf(6, 0), 2)} a month, or ${h.eur(h.M.baseAf(6, 0) * 12)} over twelve months, before any age supplement. The ceiling for that level is ${h.eur(h.M.plafondsAf(6)[0])} of ${h.P.af.revenus_reference} income. Above ${h.eur(h.M.plafondsAf(6)[1])}, the sum drops to ${h.eur(h.M.baseAf(6, 2), 2)} a month, a quarter of the full rate.` },
      { q: 'We earn €100,000 with four children, what does the CAF pay?', a: `${h.eur(af(h, 4, 100000).total, 2)} a month before supplements. The household is ${h.eur(100000 - h.M.plafondsAf(4)[0])} over the ${h.eur(h.M.plafondsAf(4)[0])} ceiling: too far for the tapering top-up, which ends once the excess reaches twelve times the gap between the two amounts. So the allowance is halved. With a fifth child, the same income would sit below the ${h.eur(h.M.plafondsAf(5)[0])} ceiling.` },
      { q: 'Blended family with four children under our roof: which scale applies?', a: `The one for the children you effectively and permanently support, according to service-public.fr: food, housing, clothing and upbringing. No parent-child tie is required, so a partner's child living with you can count. If all four depend on you, the family is on the four-child scale, ${h.eur(h.M.baseAf(4, 0), 2)} at the lowest level; a child who mainly lives with their other parent counts in that household.` },
      { q: 'All four of our children are teenagers: how many supplements do we get?', a: `As many as there are children born before 1 March 2012: from three children up, the eldest counts too. Four teenagers born before that date open four supplements of ${h.eur(h.P.af.majoration[0], 2)}, giving ${h.eur(af(h, 4, 70000, 4).total, 2)} a month on €70,000 of income. A child born after that date waits until ${h.P.af.age_majoration_nouveau}.` },
    ],
    body: (h) => `
<h2>A fixed amount per child beyond the third</h2>
<p>From the fourth child, the scale becomes linear: each child adds ${h.pct(h.P.af.taux_bmaf.par_enfant_suivant, 0)} of the monthly benefit base (BMAF, the reference figure all French family benefits are pegged to), which is ${h.eur(parEnfant(h, 0), 2)} at the full rate, ${h.eur(parEnfant(h, 1), 2)} when halved and ${h.eur(parEnfant(h, 2), 2)} when quartered, per the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}. Ceilings follow the same logic, at ${h.eur(h.P.af.plafonds.par_enfant)} per child.</p>
${h.table(['Children', 'Full rate', 'Ceiling 1', 'Halved', 'Ceiling 2', 'Quartered'], [4, 5, 6, 7, 8].map((n) => [String(n), h.eur(h.M.baseAf(n, 0), 2), h.eur(h.M.plafondsAf(n)[0]), h.eur(h.M.baseAf(n, 1), 2), h.eur(h.M.plafondsAf(n)[1]), h.eur(h.M.baseAf(n, 2), 2)]), 'Large families: monthly amounts before supplements, 2024 income (estimate)', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The ${h.src('spAf', 'service-public.fr page')} publishes the scale up to four children; the further rows apply the same progression.</p>
<!--mini:afFamilleNombreuse-->

<h2>The step-down, one eldest at a time</h2>
<p>In a large family, this month's amount is only a snapshot. The eldest children reach ${h.P.af.age_limite} a few years apart, and each birthday removes a share. Take the Lefèvre family: five children, ${h.eur(R)} of net income, a level that stays under the first ceiling whatever the family size. Before supplements, this is what the CAF pays at each stage:</p>
${h.table(['Stage', 'Per month'], etapes(h, false).map(([e, v]) => [e, h.eur(v, 2)]), 'Five-child family, €75,000 of 2024 income, before supplements', ['l', 'r'])}
<p>Each departure costs ${h.eur(parEnfant(h, 0), 2)} while at least three children remain, then ${h.eur(h.M.baseAf(3, 0) - h.M.baseAf(2, 0), 2)} when going from three to two. The ${h.eur(h.P.af.forfait_20_ans[0], 2)} flat rate cushions each step for a year, provided the young adult still lives at home and earns little. Details on the ${h.a('allocation-forfaitaire-20-ans', 'age-20 flat-rate allowance')} page.</p>

<h2>One more child can bring back the full rate</h2>
<p>Because the ceiling rises with each birth, a new child sometimes moves the whole family into a different income band. The Benalis have four children and declared €96,000 of ${h.P.af.revenus_reference} net income. They are ${h.eur(96000 - h.M.plafondsAf(4)[0])} over the four-child ceiling, so the CAF pays ${h.eur(af(h, 4, 96000).total, 2)} a month, including ${h.eur(af(h, 4, 96000).complement, 2)} of ${h.a('complement-degressif', 'tapering top-up')}. When the fifth child arrives, the ceiling moves to ${h.eur(h.M.plafondsAf(5)[0])} and the household finds itself below it with the same income: ${h.eur(af(h, 5, 96000).total, 2)} a month, ${h.eur(af(h, 5, 96000).total - af(h, 4, 96000).total, 2)} more, far beyond the fifth child's own share.</p>
<p>It works the other way as children leave. When the eldest of five turns ${h.P.af.age_limite}, the ceiling falls by ${h.eur(h.P.af.plafonds.par_enfant)}; a household near the limit can then lose both a share and the full rate at once. For these families, running a simulation before each birthday is worth the two minutes it takes.</p>

<h2>Teenagers in a big family</h2>
<p>Supplements add up when several children are teenagers at once. From three children, each one counts. A family of four on €70,000 with two children born before ${h.date(h.P.af.bascule_majoration)} receives ${h.eur(af(h, 4, 70000, 2).total, 2)} a month. The younger ones, born after that date, only open theirs at ${h.P.af.age_majoration_nouveau}, and only if still dependent. The reform is explained on the ${h.a('majoration-allocations-familiales', 'age supplement')} page.</p>

<h2>What does not grow with the family</h2>
<p>The ${h.a('complement-familial', 'family supplement')} does not depend on the number of children: ${h.eur(h.P.cf.base, 2)} or ${h.eur(h.P.cf.majore, 2)} a month, whether there are three siblings or seven, per the ${h.src('spCf', 'family supplement page')}. Only its ceiling rises: ${h.eur(h.P.cf.plafonds.un_revenu[1])} for four children on one income, ${h.eur(h.P.cf.plafonds.deux_revenus[1])} with two incomes or for a single parent. A family of four on €50,000 with one earner gets ${h.eur(h.M.complementFamilial({ enfants3a21: 4, deuxRevenus: false, revenus: 50000 }).cf, 2)} more a month, provided every child is at least ${h.P.cf.age_min}.</p>
<p>The ${h.a('simulateur-allocations-familiales', 'family allowance calculator')} takes up to twelve children and adds supplements and the flat rate.</p>
`,
  },
});
