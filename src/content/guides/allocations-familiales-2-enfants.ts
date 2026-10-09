import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Famille de deux enfants : cadet majorable ou non (majorables = 2 quand le cadet est né avant mars 2012). */
const af = (h: Helpers, revenus: number, cadetMajore = false) => h.M.allocationsFamiliales({ enfants: 2, majorables: cadetMajore ? 2 : 0, revenus });
const pl = (h: Helpers) => h.M.plafondsAf(2);

export default defineGuide({
  id: 'allocations-familiales-2-enfants',
  group: 'famille',
  order: 20,
  mini: 'afDeuxEnfants',
  miniHref: 'simulateur-allocations-familiales',
  related: ['simulateur-allocations-familiales', 'allocations-familiales-3-enfants', 'majoration-allocations-familiales', 'complement-degressif', 'allocation-soutien-familial'],
  sources: ['spAf', 'instructionPf2026'],
  fr: {
    slug: 'allocations-familiales-2-enfants',
    nav: 'Allocations familiales, 2 enfants',
    card: 'Le droit qui s’ouvre avec le deuxième enfant, la majoration réservée au cadet et ce qui arrive aux 20 ans de l’aîné.',
    title: 'Allocations familiales 2 enfants 2026 : 152,25 € par mois',
    description: 'Allocations familiales 2026 pour 2 enfants : 152,25 € par mois sous 79 980 € de revenus 2024, puis 76,13 € et 38,07 €. Majoration du cadet et cas chiffrés.',
    h1: 'Allocations familiales avec deux enfants',
    intro: 'Le deuxième enfant ouvre le droit ; mais c’est aussi la configuration où les revenus et l’âge de l’aîné pèsent le plus.',
    resume: (h) => `Avec deux enfants à charge, la CAF verse ${h.eur(h.M.baseAf(2, 0), 2)} d’allocations familiales par mois en 2026 si le revenu net catégoriel ${h.P.af.revenus_reference} du foyer ne dépasse pas ${h.eur(pl(h)[0])}. Entre ${h.eur(pl(h)[0])} et ${h.eur(pl(h)[1])}, le montant tombe à ${h.eur(h.M.baseAf(2, 1), 2)} ; au-delà, à ${h.eur(h.M.baseAf(2, 2), 2)}. Une seule majoration pour âge est possible, celle du cadet : ${h.eur(h.P.af.majoration[0], 2)} de plus au premier niveau de revenus, s’il est né avant le ${h.date(h.P.af.bascule_majoration)}. L’aîné n’en ouvre jamais, quel que soit son âge. Le droit commence le mois qui suit la naissance ou l’arrivée du deuxième enfant et s’arrête net le mois où l’aîné atteint ${h.P.af.age_limite} ans, car il ne reste alors qu’un enfant à charge : aucune allocation forfaitaire ne vient adoucir cette sortie pour une famille de deux. Le revenu pris en compte est celui de l’avis d’imposition 2025. Ces chiffres sont des estimations nettes de CRDS ; le montant exact est celui que notifie la CAF.`,
    faqs: (h) => [
      { q: 'Mon deuxième enfant naît en janvier, à partir de quand je touche les allocations familiales ?', a: `Le droit s’ouvre le mois qui suit la naissance : un enfant né le 15 janvier ouvre le droit au 1er février. Comme les allocations sont payées à terme échu, le montant de février, soit ${h.eur(h.M.baseAf(2, 0), 2)} au premier niveau de revenus, arrive début mars. C’est l’exemple que donne service-public sur sa fiche des allocations familiales.` },
      { q: 'Mon aîné a 16 ans, pourquoi la CAF ne verse-t-elle aucune majoration ?', a: `Parce qu’avec deux enfants, l’aîné est exclu de la majoration pour âge, même s’il est né avant le 1er mars 2012. Seul le cadet peut l’ouvrir. Tant que celui-ci n’a pas l’âge requis, la famille reste à ${h.eur(af(h, 50000).total, 2)} par mois pour 50 000 € de revenus. Un troisième enfant changerait tout : chaque enfant compterait alors, l’aîné compris.` },
      { q: 'Que deviennent les allocations familiales quand l’aîné de mes deux enfants fête ses 20 ans ?', a: `Elles s’arrêtent. À ${h.P.af.age_limite} ans, un enfant cesse d’être compté à charge pour les allocations familiales ; il ne reste qu’un enfant, et le droit exige d’en avoir au moins deux. L’allocation forfaitaire qui amortit ce passage est réservée aux familles d’au moins trois enfants. Une famille sous ${h.eur(pl(h)[0])} perd donc d’un coup ${h.eur(af(h, 50000).total * 12)} par an.` },
      { q: 'Nous gagnons 90 000 € à deux avec deux enfants, combien reste-t-il ?', a: `Avec 90 000 € de revenu net catégoriel ${h.P.af.revenus_reference}, le foyer se situe entre ${h.eur(pl(h)[0])} et ${h.eur(pl(h)[1])} : il reçoit ${h.eur(af(h, 90000).total, 2)} par mois, ou ${h.eur(af(h, 90000, true).total, 2)} si le cadet est né avant mars 2012. C’est la moitié du montant plein, selon le barème de service-public.` },
      { q: 'Déjà allocataire, dois-je remplir une demande pour mon deuxième enfant ?', a: `Non. D’après service-public, la CAF attribue automatiquement les allocations familiales dès qu’elle a connaissance du deuxième enfant à charge : il suffit de déclarer la naissance, avec une copie du livret de famille ou de l’acte de naissance. Un foyer qui n’est pas encore allocataire remplit les formulaires cerfa n° 11423 et n° 10397 et les adresse à sa CAF.` },
    ],
    body: (h) => `
<h2>Le deuxième enfant, porte d’entrée du droit</h2>
<p>Un enfant seul n’ouvre aucune allocation familiale en métropole. C’est le deuxième qui déclenche le versement, sans démarche particulière si vous êtes déjà connu de la CAF. Le droit naît le mois qui suit la naissance ou l’accueil, et les sommes sont versées chaque mois pour le mois écoulé, selon la ${h.src('spAf', 'fiche service-public')}.</p>
<p>Deux enfants, c’est aussi le niveau où le montant est le plus modeste et où il varie le plus en proportion. Entre le premier et le troisième niveau de revenus, la famille passe de ${h.eur(h.M.baseAf(2, 0), 2)} à ${h.eur(h.M.baseAf(2, 2), 2)} : une division par quatre, sur une somme déjà petite.</p>

<h2>Trois niveaux de revenus, trois montants</h2>
<p>Le barème applicable depuis le 1er avril 2026, publié par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}, donne pour deux enfants :</p>
${h.table(['Revenu net catégoriel 2024', 'Sans majoration', 'Avec majoration du cadet'], [[`jusqu’à ${h.eur(pl(h)[0])}`, h.eur(h.M.baseAf(2, 0), 2), h.eur(h.M.baseAf(2, 0) + h.P.af.majoration[0], 2)], [`de ${h.eur(pl(h)[0])} à ${h.eur(pl(h)[1])}`, h.eur(h.M.baseAf(2, 1), 2), h.eur(h.M.baseAf(2, 1) + h.P.af.majoration[1], 2)], [`au-delà de ${h.eur(pl(h)[1])}`, h.eur(h.M.baseAf(2, 2), 2), h.eur(h.M.baseAf(2, 2) + h.P.af.majoration[2], 2)]], 'Deux enfants à charge, montants mensuels nets de CRDS (barème 2026)', ['l', 'r', 'r'])}
<p>Le revenu retenu est le revenu net catégoriel de ${h.P.af.revenus_reference}, celui de l’avis d’imposition reçu en 2025. Un couple dont les salaires ont fortement augmenté en 2025 ou en 2026 conserve donc le montant fixé sur ses revenus anciens jusqu’à la mise à jour annuelle.</p>
<!--mini:afDeuxEnfants-->

<h2>La majoration, une affaire de cadet</h2>
<p>Dans une famille de deux enfants, la règle est simple et souvent mal comprise : l’aîné n’ouvre jamais la majoration pour âge. Seul le cadet peut le faire, à ${h.P.af.age_majoration_ancien} ans s’il est né avant le ${h.date(h.P.af.bascule_majoration)}, à ${h.P.af.age_majoration_nouveau} ans s’il est né à partir de cette date. Prenons Inès, 17 ans, et Hugo, 15 ans, nés tous deux avant mars 2012. La majoration est due pour Hugo seul : la famille reçoit ${h.eur(af(h, 50000, true).total, 2)} par mois pour 50 000 € de revenus, pas davantage, alors que ses deux enfants ont passé ${h.P.af.age_majoration_ancien} ans.</p>
<p>Pour un cadet né en 2013, en revanche, la majoration n’arrivera qu’à ses ${h.P.af.age_majoration_nouveau} ans, en 2031. Et entre-temps, l’aîné aura peut-être atteint ${h.P.af.age_limite} ans, ce qui supprime toute l’allocation. Beaucoup de familles de deux enfants nés après 2012 ne verront donc jamais cette majoration. La page ${h.a('majoration-allocations-familiales', 'majoration pour âge')} détaille la réforme et ses dates.</p>

<h2>Juste au-dessus du plafond</h2>
<p>Un foyer qui dépasse ${h.eur(pl(h)[0])} de quelques centaines d’euros ne tombe pas brutalement à la moitié. Un ${h.a('complement-degressif', 'complément dégressif')} comble une partie de l’écart. Avec 80 500 € de revenus, soit ${h.eur(80500 - pl(h)[0])} au-dessus du plafond, la famille reçoit ${h.eur(af(h, 80500).total, 2)} au lieu de ${h.eur(h.M.baseAf(2, 1), 2)}. Le complément disparaît dès que le dépassement atteint douze fois l’écart entre les deux montants.</p>

<h2>Deux couples, deux enfants, deux réalités</h2>
<p>Claire et Malik, salariés à temps plein, déclarent 38 000 € de revenu net catégoriel pour ${h.P.af.revenus_reference}. Leurs deux enfants ont 6 et 10 ans. Ils reçoivent ${h.eur(af(h, 38000).total, 2)} par mois, soit ${h.eur(af(h, 38000).total * 12)} sur l’année. Sophie et Paul, cadres, déclarent 115 000 € avec des enfants du même âge : ${h.eur(af(h, 115000).total, 2)} par mois, ${h.eur(af(h, 115000).total * 12)} par an. L’écart annuel dépasse ${h.eur(Math.floor((af(h, 38000).total - af(h, 115000).total) * 12 / 100) * 100)}.</p>
<p>Pour le second couple, ce montant réduit reste toutefois acquis sans démarche, et il évolue avec les revenus : une année de congé parental ou de chômage, visible deux ans plus tard sur l’avis d’imposition, peut faire repasser la famille au montant plein.</p>

<h2>Le mois des 20 ans de l’aîné</h2>
<p>C’est la date à noter. À ${h.P.af.age_limite} ans, l’aîné cesse d’être un enfant à charge pour les allocations familiales. Il reste un seul enfant, et le droit s’éteint. Pour une famille de trois enfants, une ${h.a('allocation-forfaitaire-20-ans', 'allocation forfaitaire')} prend le relais pendant un an ; pour une famille de deux, rien ne compense. Le budget doit l’anticiper : sur un an, la perte vaut ${h.eur(af(h, 40000).total * 12)} pour un foyer au premier niveau de revenus.</p>
<p>Si le cadet a moins de ${h.P.af.age_limite} ans et qu’un troisième enfant arrive plus tard, le droit repart, au barème de ${h.a('allocations-familiales-3-enfants', 'trois enfants')} si les trois sont à charge en même temps.</p>

<h2>Ce que la CAF vous demandera</h2>
<p>Déjà allocataire : une déclaration de naissance suffit. Pas encore allocataire : les deux formulaires de demande. En cas de séparation, déclarez-la sans attendre : le parent qui élève seul les enfants peut aussi relever de l’${h.a('allocation-soutien-familial', 'allocation de soutien familial')}. Le ${h.a('simulateur-allocations-familiales', 'simulateur des allocations familiales')} reprend tous ces paramètres.</p>
`,
  },
  en: {
    slug: 'family-allowance-two-children',
    nav: 'Family allowance, 2 children',
    card: 'The entitlement a second child opens, the supplement reserved for the younger one, and what happens when the elder turns 20.',
    title: 'Family Allowance 2 Children 2026: €152.25 a Month in France',
    description: 'Family allowance in 2026 for 2 children: €152.25 a month below €79,980 of 2024 income, then €76.13 and €38.07. Younger child supplement and worked cases.',
    h1: 'Family allowance with two children',
    intro: 'The second child opens the entitlement; it is also the family size where income and the elder child’s age weigh the most.',
    resume: (h) => `With two dependent children, the CAF (Caisse d'allocations familiales, the family benefits office) pays ${h.eur(h.M.baseAf(2, 0), 2)} of family allowance a month in 2026 if the household's ${h.P.af.revenus_reference} net income does not exceed ${h.eur(pl(h)[0])}. Between ${h.eur(pl(h)[0])} and ${h.eur(pl(h)[1])}, the amount drops to ${h.eur(h.M.baseAf(2, 1), 2)}; above that, to ${h.eur(h.M.baseAf(2, 2), 2)}. Only one age supplement is possible, for the younger child: ${h.eur(h.P.af.majoration[0], 2)} extra at the lowest income level, if that child was born before ${h.date(h.P.af.bascule_majoration)}. The elder child never triggers one, however old. Payments start the month after the second child's birth or arrival and stop outright in the month the elder turns ${h.P.af.age_limite}, because only one dependent child is then left; no flat-rate payment softens that exit for a two-child family. The income used is the revenu net catégoriel on the 2025 tax assessment notice (avis d'imposition). Figures are estimates, net of the CRDS levy; the exact amount is the one the CAF notifies.`,
    faqs: (h) => [
      { q: 'Our second baby is due in January, when does family allowance start?', a: `The entitlement opens the month after the birth: a child born on 15 January opens it on 1 February. Because the allowance is paid in arrears, February's amount, ${h.eur(h.M.baseAf(2, 0), 2)} at the lowest income level, arrives at the start of March. That is the example service-public.fr, the French government information site, gives on its family allowance page.` },
      { q: 'My elder child is 16, why is there no age supplement on my payment?', a: `Because with two children the elder is excluded from the age supplement, even if born before 1 March 2012. Only the younger child can trigger it. Until that child reaches the required age, the family stays at ${h.eur(af(h, 50000).total, 2)} a month on €50,000 of income. A third child would change everything: each child would then count, the eldest included.` },
      { q: 'What happens to family allowance when the elder of two children turns 20?', a: `It stops. At ${h.P.af.age_limite}, a child is no longer counted as dependent for family allowance; one child remains, and the benefit needs at least two. The flat-rate payment that cushions this step only exists for families of three or more. A household below ${h.eur(pl(h)[0])} therefore loses ${h.eur(af(h, 50000).total * 12)} a year at once.` },
      { q: 'We earn €90,000 together with two children, how much family allowance is left?', a: `With €90,000 of ${h.P.af.revenus_reference} net income, the household sits between ${h.eur(pl(h)[0])} and ${h.eur(pl(h)[1])}: it receives ${h.eur(af(h, 90000).total, 2)} a month, or ${h.eur(af(h, 90000, true).total, 2)} if the younger child was born before March 2012. That is half the full amount, on the service-public.fr scale, paid every month.` },
      { q: 'I already receive CAF benefits, do I need to apply for my second child?', a: `No. According to service-public.fr, the CAF grants family allowance automatically as soon as it knows about a second dependent child: you report the birth with a copy of the livret de famille (family record book) or the birth certificate. A household not yet registered with the CAF fills in forms cerfa 11423 and 10397 and sends them in.` },
    ],
    body: (h) => `
<h2>The second child is the way in</h2>
<p>A single child opens no family allowance in mainland France. The second one triggers payment, with no special application if the CAF already knows you. The entitlement starts the month after the birth or arrival, and money is paid each month for the month just ended, according to the ${h.src('spAf', 'service-public.fr page')}.</p>
<p>Two children is also where the amount is smallest and swings the most in proportion. Between the first and third income levels, the family goes from ${h.eur(h.M.baseAf(2, 0), 2)} to ${h.eur(h.M.baseAf(2, 2), 2)}: a fourfold cut on an already modest sum.</p>

<h2>Three income levels, three amounts</h2>
<p>The scale in force since 1 April 2026, published in the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}, gives for two children:</p>
${h.table(['2024 net income', 'No supplement', 'With younger child supplement'], [[`up to ${h.eur(pl(h)[0])}`, h.eur(h.M.baseAf(2, 0), 2), h.eur(h.M.baseAf(2, 0) + h.P.af.majoration[0], 2)], [`${h.eur(pl(h)[0])} to ${h.eur(pl(h)[1])}`, h.eur(h.M.baseAf(2, 1), 2), h.eur(h.M.baseAf(2, 1) + h.P.af.majoration[1], 2)], [`above ${h.eur(pl(h)[1])}`, h.eur(h.M.baseAf(2, 2), 2), h.eur(h.M.baseAf(2, 2) + h.P.af.majoration[2], 2)]], 'Two dependent children, monthly amounts net of CRDS (2026 scale)', ['l', 'r', 'r'])}
<p>The income used is the ${h.P.af.revenus_reference} revenu net catégoriel: your income by category after the standard allowances, as printed on the avis d'imposition received in 2025. A couple whose pay rose sharply in 2025 or 2026 keeps the amount set on the older figures until the yearly update.</p>
<!--mini:afDeuxEnfants-->

<h2>The supplement belongs to the younger child</h2>
<p>In a two-child family the rule is simple and often misread: the elder child never opens the age supplement. Only the younger one can, at ${h.P.af.age_majoration_ancien} if born before ${h.date(h.P.af.bascule_majoration)}, at ${h.P.af.age_majoration_nouveau} if born on or after that date. Take Inès, 17, and Hugo, 15, both born before March 2012. The supplement is due for Hugo alone: the family receives ${h.eur(af(h, 50000, true).total, 2)} a month on €50,000 of income, no more, even though both children are past ${h.P.af.age_majoration_ancien}.</p>
<p>For a younger child born in 2013, the supplement only arrives at ${h.P.af.age_majoration_nouveau}, in 2031. By then the elder may well have turned ${h.P.af.age_limite}, which removes the whole allowance. Many two-child families with children born after 2012 will never see that supplement. The ${h.a('majoration-allocations-familiales', 'age supplement')} page sets out the reform and its dates.</p>

<h2>Just over the ceiling</h2>
<p>A household a few hundred euros above ${h.eur(pl(h)[0])} does not drop straight to half. A ${h.a('complement-degressif', 'tapering top-up')} (complément dégressif) fills part of the gap. On €80,500, which is ${h.eur(80500 - pl(h)[0])} over the ceiling, the family gets ${h.eur(af(h, 80500).total, 2)} instead of ${h.eur(h.M.baseAf(2, 1), 2)}. The top-up vanishes once the excess reaches twelve times the difference between the two amounts.</p>

<h2>Two couples, two children, two outcomes</h2>
<p>Claire and Malik, both in full-time jobs, declared €38,000 of net income for ${h.P.af.revenus_reference}. Their children are 6 and 10. They receive ${h.eur(af(h, 38000).total, 2)} a month, or ${h.eur(af(h, 38000).total * 12)} over the year. Sophie and Paul, both managers, declared €115,000 with children of the same ages: ${h.eur(af(h, 115000).total, 2)} a month, ${h.eur(af(h, 115000).total * 12)} a year. The yearly gap is more than ${h.eur(Math.floor((af(h, 38000).total - af(h, 115000).total) * 12 / 100) * 100)}.</p>
<p>The second couple still gets the reduced amount without any paperwork, and it follows their income: a year of parental leave or unemployment, which shows up two years later on the avis d'imposition, can bring the family back to the full rate.</p>

<h2>The month the elder turns 20</h2>
<p>Put this date in the diary. At ${h.P.af.age_limite}, the elder stops being a dependent child for family allowance. One child remains, and the entitlement ends. For a three-child family, a ${h.a('allocation-forfaitaire-20-ans', 'flat-rate allowance')} takes over for a year; for a two-child family, nothing replaces it. Over a year the loss is ${h.eur(af(h, 40000).total * 12)} for a household at the lowest income level.</p>
<p>If the younger child is under ${h.P.af.age_limite} and a third child arrives later, payments restart, on the ${h.a('allocations-familiales-3-enfants', 'three-child scale')} if all three are dependent at the same time.</p>

<h2>What the CAF will ask for</h2>
<p>Already a claimant: a birth notification is enough. Not yet: the two application forms. If you separate, report it straight away, since a parent raising the children alone may also qualify for the ${h.a('allocation-soutien-familial', 'family support allowance')} (ASF). The ${h.a('simulateur-allocations-familiales', 'family allowance calculator')} covers all of these settings.</p>
`,
  },
});
