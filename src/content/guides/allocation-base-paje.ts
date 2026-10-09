import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Versements : du mois qui suit la naissance au mois qui précède le 3e anniversaire (fiche F2552), soit 35 mois. */
const MOIS = 3 * 12 - 1;
const ab = (h: Helpers, enfants: number, deux: boolean, revenus: number) => h.M.paje({ enfants, deuxRevenus: deux, revenus });

export default defineGuide({
  id: 'allocation-base-paje',
  group: 'famille',
  order: 220,
  mini: 'naissanceAbPaje',
  miniHref: 'simulateur-prime-naissance',
  related: ['simulateur-prime-naissance', 'prime-naissance-plafond', 'prime-naissance-jumeaux', 'complement-familial', 'simulateur-prepare'],
  sources: ['spAbPaje', 'spNaissance', 'instructionPf2026'],
  fr: {
    slug: 'allocation-de-base-paje',
    nav: 'Allocation de base de la Paje',
    card: 'L’allocation de base 2026 : 198,16 € ou 99,08 € par mois jusqu’aux 3 ans de l’enfant, selon vos revenus 2024.',
    title: 'Prime de naissance 2026 : allocation de base de la Paje',
    description: 'Allocation de base de la Paje 2026 : 198,16 € par mois à taux plein, 99,08 € à taux partiel, jusqu’aux 3 ans. Plafonds selon les revenus 2024 et le foyer.',
    h1: 'L’allocation de base de la Paje, du premier mois aux 3 ans',
    intro: 'Après la prime de naissance, la CAF peut verser chaque mois l’allocation de base : deux taux, un seul enfant à la fois, jusqu’au mois qui précède les 3 ans.',
    resume: (h) => `L’allocation de base de la Paje vaut ${h.eur(h.P.paje.ab_plein, 2)} par mois à taux plein et ${h.eur(h.P.paje.ab_partiel, 2)} à taux partiel en 2026. Le taux dépend du revenu net catégoriel ${h.P.paje.revenus_reference} : pour un couple à un seul revenu avec un enfant, le taux plein s’applique jusqu’à ${h.eur(h.M.plafondAbPlein(1, false))}, le taux partiel jusqu’à ${h.eur(h.M.plafondNaissance(1, false))}. Pour un couple à deux revenus ou un parent isolé, les seuils passent à ${h.eur(h.M.plafondAbPlein(1, true))} et ${h.eur(h.M.plafondNaissance(1, true))}. Le taux partiel s’arrête donc exactement au plafond de la prime de naissance. L’allocation est due à partir du premier jour du mois qui suit la naissance et versée jusqu’au mois qui précède le 3e anniversaire, soit ${MOIS} mensualités : ${h.eur(h.P.paje.ab_plein * MOIS)} au taux plein sur la période, ${h.eur(h.P.paje.ab_partiel * MOIS)} au taux partiel. Une famille ne la perçoit que pour un enfant à la fois, sauf naissances multiples, et elle ne se cumule pas avec le complément familial. Estimation : la CAF calcule le droit.`,
    faqs: (h) => [
      { q: 'Mon bébé est né le 15 février, quand arrive la première allocation de base ?', a: `Le 1er avril, pour le mois de mars. C’est l’exemple que donne la fiche F2552 de service-public : l’allocation est due à partir du premier jour du mois qui suit la naissance, puis versée le mois suivant. Pour un enfant né en février, le premier versement est donc de ${h.eur(h.P.paje.ab_plein, 2)} ou ${h.eur(h.P.paje.ab_partiel, 2)}, selon le taux, et couvre mars.` },
      { q: 'Nous avons deux enfants de moins de 3 ans, touchons-nous deux allocations de base ?', a: `Non, sauf s’il s’agit de jumeaux ou de triplés. Service-public précise que l’allocation de base n’est attribuée qu’à un seul enfant à la fois par famille. Quand le cadet naît alors que l’aîné n’a pas 3 ans, la famille continue de percevoir une seule allocation, ${h.eur(h.P.paje.ab_plein, 2)} au plus par mois. En cas de naissances multiples, elle est versée pour chaque enfant.` },
      { q: 'À quel revenu passe-t-on du taux plein au taux partiel de l’allocation de base ?', a: `Pour un premier enfant, à ${h.eur(h.M.plafondAbPlein(1, false))} de revenus ${h.P.paje.revenus_reference} pour un couple à un seul revenu, et à ${h.eur(h.M.plafondAbPlein(1, true))} pour un couple à deux revenus ou un parent isolé. Avec deux enfants, ces seuils montent à ${h.eur(h.M.plafondAbPlein(2, false))} et ${h.eur(h.M.plafondAbPlein(2, true))}. Le montant mensuel est alors divisé par deux, de ${h.eur(h.P.paje.ab_plein, 2)} à ${h.eur(h.P.paje.ab_partiel, 2)}.` },
      { q: 'Peut-on toucher l’allocation de base et le complément familial en même temps ?', a: `Non. La fiche F2552 de service-public l’exclut : l’allocation de base de la Paje n’est pas cumulable avec le complément familial. Une famille de trois enfants qui pourrait prétendre aux deux perçoit l’un ou l’autre, selon les règles de priorité de la CAF. En revanche, elle se cumule avec l’allocation journalière de présence parentale, versée quand un parent s’arrête pour un enfant gravement malade.` },
      { q: 'Quels papiers envoyer à la CAF pour l’allocation de base ?', a: `Deux documents, selon service-public : une copie lisible des pages du livret de famille, et un extrait ou une copie intégrale de l’acte de naissance de l’enfant. Ils permettent à la CAF d’enregistrer la naissance et d’ouvrir le droit dès le mois suivant. Le montant, ${h.eur(h.P.paje.ab_plein, 2)} ou ${h.eur(h.P.paje.ab_partiel, 2)} par mois, dépend ensuite des revenus ${h.P.paje.revenus_reference} déjà connus.` },
      { q: 'Pourquoi notre allocation de base passe-t-elle au taux partiel alors que notre salaire n’a pas bougé ?', a: `Parce que le taux se lit sur le revenu net catégoriel de ${h.P.paje.revenus_reference}, pas sur le salaire actuel. Une prime exceptionnelle touchée cette année-là, ou un second conjoint qui n’a pas atteint ${h.eur(h.P.paje.seuil_deuxieme_revenu)}, suffit à changer de ligne. Pour un couple à un revenu avec un enfant, le taux plein s’arrête à ${h.eur(h.M.plafondAbPlein(1, false))} ; un euro de plus fait passer de ${h.eur(h.P.paje.ab_plein, 2)} à ${h.eur(h.P.paje.ab_partiel, 2)}.` },
    ],
    body: (h) => `
<h2>Les seuils du taux plein et du taux partiel</h2>
${h.table(['Enfants à charge', 'Taux plein, un revenu', 'Taux partiel, un revenu', 'Taux plein, deux revenus ou isolé', 'Taux partiel, deux revenus ou isolé'], [1, 2, 3].map((n) => [String(n), `≤ ${h.eur(h.M.plafondAbPlein(n, false))}`, `≤ ${h.eur(h.M.plafondNaissance(n, false))}`, `≤ ${h.eur(h.M.plafondAbPlein(n, true))}`, `≤ ${h.eur(h.M.plafondNaissance(n, true))}`]), `Allocation de base de la Paje 2026, revenu net catégoriel ${h.P.paje.revenus_reference}`, ['l', 'r', 'r', 'r', 'r'])}
<p>Le barème vient de la ${h.src('spAbPaje', 'fiche F2552 de service-public')}, vérifiée le 1er avril 2026. Les montants mensuels, ${h.eur(h.P.paje.ab_plein, 2)} et ${h.eur(h.P.paje.ab_partiel, 2)}, ont été revalorisés au 1er avril 2026 par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}. Au-delà du dernier seuil, aucune allocation n’est due.</p>
<!--mini:naissanceAbPaje-->

<h2>Trente-cinq mensualités, pas trente-six</h2>
<p>On lit souvent que l’allocation de base est versée « jusqu’aux 3 ans ». Le compte exact est un peu différent. Elle démarre le premier jour du mois qui suit la naissance et s’arrête au mois qui précède le 3e anniversaire. Pour un enfant né le 15 février 2026, elle couvre mars 2026 à janvier 2029 : ${MOIS} mois. Au taux plein, cela représente ${h.eur(h.P.paje.ab_plein * MOIS)} ; au taux partiel, ${h.eur(h.P.paje.ab_partiel * MOIS)}, à barème constant. Les revalorisations annuelles d’avril ajouteront quelques euros.</p>

<h2>Le calendrier d’une première naissance</h2>
<p>La Paje s’enchaîne en deux temps. La grossesse est déclarée avant la fin du 3e mois ; la prime de naissance de ${h.eur(h.P.paje.prime_naissance, 2)} arrive avant la fin du mois civil qui suit le 6e mois, si les revenus le permettent. Puis, dès le mois qui suit l’accouchement, l’allocation de base prend le relais. Pour un couple à un seul revenu de 30 000 €, l’ensemble représente, à barème constant, ${h.eur(h.P.paje.prime_naissance + ab(h, 1, false, 30000).ab * MOIS)} sur un peu plus de trois ans : la prime, plus ${MOIS} mensualités au taux plein. Le même couple à 34 000 € recevrait ${h.eur(h.P.paje.prime_naissance + ab(h, 1, false, 34000).ab * MOIS)}, la prime restant entière mais l’allocation passant au taux partiel. L’écart entre les deux, ${h.eur((ab(h, 1, false, 30000).ab - ab(h, 1, false, 34000).ab) * MOIS)}, tient à 4 000 € de revenus déclarés.</p>

<h2>Trois familles, trois taux</h2>
<h3>Couple à un revenu, premier enfant</h3>
<p>Léa ne travaille pas, Thomas a déclaré 30 000 € de revenu net catégoriel pour ${h.P.paje.revenus_reference}. Le foyer reste sous ${h.eur(h.M.plafondAbPlein(1, false))} : taux plein, ${h.eur(ab(h, 1, false, 30000).ab, 2)} par mois. Avec 34 000 €, il passerait au taux partiel, ${h.eur(ab(h, 1, false, 34000).ab, 2)}.</p>
<h3>Couple à deux revenus, deuxième enfant</h3>
<p>Deux salaires, 50 000 € de revenus 2024, un aîné de 4 ans. Le bébé fait deux enfants à charge : le taux plein va jusqu’à ${h.eur(h.M.plafondAbPlein(2, true))}, le taux partiel jusqu’à ${h.eur(h.M.plafondNaissance(2, true))}. Résultat : ${h.eur(ab(h, 2, true, 50000).ab, 2)} par mois.</p>
<h3>Parent isolé, premier enfant</h3>
<p>Un père seul avec 43 000 € de revenus profite des seuils du couple à deux revenus : taux partiel, ${h.eur(ab(h, 1, true, 43000).ab, 2)} par mois, là où un couple à un revenu au même niveau n’aurait rien.</p>

<h2>Un enfant à la fois</h2>
<p>L’allocation de base ne se multiplie pas avec la fratrie. Quand un deuxième enfant naît avant les 3 ans du premier, la famille ne touche toujours qu’une allocation. Seules les naissances multiples font exception : des jumeaux ouvrent deux allocations, des triplés trois, comme l’explique la page ${h.a('prime-naissance-jumeaux', 'jumeaux et triplés')}.</p>
<p>Elle ne se cumule pas non plus avec le ${h.a('complement-familial', 'complément familial')}, qui concerne les familles d’au moins trois enfants de 3 ans et plus. Elle reste compatible avec l’allocation journalière de présence parentale.</p>

<h2>Situations particulières</h2>
<p>En cas de décès de l’enfant, l’allocation est prolongée automatiquement de trois mois, sans condition d’âge ni de durée, selon la fiche F2552. Pour une adoption, les règles diffèrent et ne sont pas traitées ici. Enfin, un parent qui réduit ou cesse son activité peut toucher, en plus, la PreParE : le ${h.a('simulateur-prepare', 'simulateur de la PreParE')} en donne le montant. Les plafonds de la prime, qui bornent aussi le taux partiel, sont détaillés sur la page ${h.a('prime-naissance-plafond', 'plafond de la prime de naissance')} ; le ${h.a('simulateur-prime-naissance', 'simulateur de la prime de naissance')} calcule les deux d’un coup.</p>
`,
  },
  en: {
    slug: 'paje-basic-allowance',
    nav: 'Paje basic allowance',
    card: 'The 2026 basic allowance: €198.16 or €99.08 a month until the child turns 3, depending on 2024 income.',
    title: 'Birth Grant 2026: Paje Basic Allowance until Age Three',
    description: 'Paje basic allowance 2026: €198.16 a month at the full rate, €99.08 at the partial rate, until the child turns 3. Ceilings by 2024 income and household.',
    h1: 'The Paje basic allowance, from the first month to age 3',
    intro: 'After the birth grant, the CAF may pay the basic allowance every month: two rates, one child at a time, until the month before the third birthday.',
    resume: (h) => `The allocation de base (basic allowance) of the Paje, the French early-childhood benefit paid by the CAF family benefits office, is ${h.eur(h.P.paje.ab_plein, 2)} a month at the full rate and ${h.eur(h.P.paje.ab_partiel, 2)} at the partial rate in 2026. The rate depends on your ${h.P.paje.revenus_reference} revenu net catégoriel, broadly taxable income after standard deductions: for a one-income couple with one child, the full rate applies up to ${h.eur(h.M.plafondAbPlein(1, false))} and the partial rate up to ${h.eur(h.M.plafondNaissance(1, false))}. For a two-income couple or a single parent, the thresholds are ${h.eur(h.M.plafondAbPlein(1, true))} and ${h.eur(h.M.plafondNaissance(1, true))}. The partial rate therefore stops exactly at the birth grant ceiling. The allowance is due from the first day of the month after the birth and paid until the month before the third birthday, which makes ${MOIS} monthly payments: ${h.eur(h.P.paje.ab_plein * MOIS)} at the full rate over the period, ${h.eur(h.P.paje.ab_partiel * MOIS)} at the partial rate. A family receives it for one child at a time, except for multiple births, and it cannot be combined with the family supplement. This is an estimate; the CAF decides.`,
    faqs: (h) => [
      { q: 'Our baby was born on 15 February: when does the first basic allowance arrive?', a: `On 1 April, for March. That is the example given in service-public.fr sheet F2552: the allowance is due from the first day of the month following the birth, then paid the month after. For a February baby, the first payment is therefore ${h.eur(h.P.paje.ab_plein, 2)} or ${h.eur(h.P.paje.ab_partiel, 2)}, depending on the rate, and covers March.` },
      { q: 'We have two children under 3: do we get two basic allowances?', a: `No, unless they are twins or triplets. Service-public.fr states that the basic allowance is paid for only one child at a time per family. When a younger child arrives before the elder turns 3, the family still receives a single allowance, at most ${h.eur(h.P.paje.ab_plein, 2)} a month. For multiple births, it is paid for each child.` },
      { q: 'At what income does the basic allowance drop from the full to the partial rate?', a: `For a first child, at ${h.eur(h.M.plafondAbPlein(1, false))} of ${h.P.paje.revenus_reference} income for a one-income couple, and ${h.eur(h.M.plafondAbPlein(1, true))} for a two-income couple or single parent. With two children, the thresholds rise to ${h.eur(h.M.plafondAbPlein(2, false))} and ${h.eur(h.M.plafondAbPlein(2, true))}. The monthly amount then halves, from ${h.eur(h.P.paje.ab_plein, 2)} to ${h.eur(h.P.paje.ab_partiel, 2)}.` },
      { q: 'Can we receive the basic allowance and the family supplement together?', a: `No. Service-public.fr sheet F2552 rules it out: the Paje basic allowance cannot be combined with the complément familial (family supplement). A three-child family that might qualify for both gets one or the other, under the CAF’s priority rules. It can, however, be combined with the AJPP, the daily allowance paid when a parent stops work to care for a seriously ill child.` },
      { q: 'Which documents does the CAF need for the basic allowance?', a: `Two, according to service-public.fr: a legible copy of the pages of the livret de famille (the French family record book) and an extract or full copy of the child’s birth certificate. They let the CAF record the birth and open entitlement from the following month. The amount, ${h.eur(h.P.paje.ab_plein, 2)} or ${h.eur(h.P.paje.ab_partiel, 2)} a month, then depends on the ${h.P.paje.revenus_reference} income already on file.` },
      { q: 'Why is our basic allowance at the partial rate when our pay has not changed?', a: `Because the rate is read from ${h.P.paje.revenus_reference} net taxable income, not current pay. A one-off bonus received that year, or a second partner who earned less than ${h.eur(h.P.paje.seuil_deuxieme_revenu)}, is enough to change rows. For a one-income couple with one child, the full rate stops at ${h.eur(h.M.plafondAbPlein(1, false))}; one euro more takes you from ${h.eur(h.P.paje.ab_plein, 2)} to ${h.eur(h.P.paje.ab_partiel, 2)}.` },
    ],
    body: (h) => `
<h2>Full-rate and partial-rate thresholds</h2>
${h.table(['Dependent children', 'Full rate, one income', 'Partial rate, one income', 'Full rate, two incomes or single', 'Partial rate, two incomes or single'], [1, 2, 3].map((n) => [String(n), `≤ ${h.eur(h.M.plafondAbPlein(n, false))}`, `≤ ${h.eur(h.M.plafondNaissance(n, false))}`, `≤ ${h.eur(h.M.plafondAbPlein(n, true))}`, `≤ ${h.eur(h.M.plafondNaissance(n, true))}`]), `Paje basic allowance 2026, ${h.P.paje.revenus_reference} net taxable income`, ['l', 'r', 'r', 'r', 'r'])}
<p>The scale comes from ${h.src('spAbPaje', 'service-public.fr sheet F2552')}, checked on 1 April 2026. The monthly amounts, ${h.eur(h.P.paje.ab_plein, 2)} and ${h.eur(h.P.paje.ab_partiel, 2)}, were uprated on 1 April 2026 by the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}. Above the last threshold, nothing is due.</p>
<!--mini:naissanceAbPaje-->

<h2>Thirty-five payments, not thirty-six</h2>
<p>People often say the basic allowance runs “until age 3”. The exact count is slightly different. It starts on the first day of the month after the birth and stops with the month before the third birthday. For a child born on 15 February 2026, it covers March 2026 to January 2029: ${MOIS} months. At the full rate that is ${h.eur(h.P.paje.ab_plein * MOIS)}; at the partial rate, ${h.eur(h.P.paje.ab_partiel * MOIS)}, on today’s scale. The yearly April upratings will add a few euros.</p>

<h2>The timeline of a first birth</h2>
<p>The Paje comes in two stages. The pregnancy is declared before the end of the third month; the ${h.eur(h.P.paje.prime_naissance, 2)} birth grant arrives before the end of the calendar month following the sixth month, if income allows. Then, from the month after the birth, the basic allowance takes over. For a one-income couple on €30,000, the whole package comes to ${h.eur(h.P.paje.prime_naissance + ab(h, 1, false, 30000).ab * MOIS)} over a little more than three years at today’s rates: the grant plus ${MOIS} full-rate payments. The same couple on €34,000 would receive ${h.eur(h.P.paje.prime_naissance + ab(h, 1, false, 34000).ab * MOIS)}: the grant stays whole but the allowance drops to the partial rate. The gap, ${h.eur((ab(h, 1, false, 30000).ab - ab(h, 1, false, 34000).ab) * MOIS)}, comes down to €4,000 of declared income.</p>

<h2>Three families, three rates</h2>
<h3>One-income couple, first child</h3>
<p>Léa is not working and Thomas declared €30,000 of net taxable income for ${h.P.paje.revenus_reference}. The household is under ${h.eur(h.M.plafondAbPlein(1, false))}: full rate, ${h.eur(ab(h, 1, false, 30000).ab, 2)} a month. On €34,000 it would move to the partial rate, ${h.eur(ab(h, 1, false, 34000).ab, 2)}.</p>
<h3>Two-income couple, second child</h3>
<p>Two salaries, €50,000 of 2024 income, an older child aged 4. The baby makes two dependent children: the full rate runs up to ${h.eur(h.M.plafondAbPlein(2, true))} and the partial rate up to ${h.eur(h.M.plafondNaissance(2, true))}. Result: ${h.eur(ab(h, 2, true, 50000).ab, 2)} a month.</p>
<h3>Single parent, first child</h3>
<p>A father on his own with €43,000 of income benefits from the two-income thresholds: partial rate, ${h.eur(ab(h, 1, true, 43000).ab, 2)} a month, where a one-income couple on the same income would get nothing.</p>

<h2>One child at a time</h2>
<p>The basic allowance does not multiply with the number of children. When a second child arrives before the first turns 3, the family still gets one allowance. Multiple births are the only exception: twins bring two allowances, triplets three, as the page on ${h.a('prime-naissance-jumeaux', 'twins and triplets')} explains.</p>
<p>Nor can it be combined with the ${h.a('complement-familial', 'family supplement')}, aimed at families with at least three children aged 3 or over. It remains compatible with the AJPP parental presence allowance.</p>

<h2>Special situations</h2>
<p>If the child dies, the allowance continues automatically for three months, with no age or duration condition, under sheet F2552. Adoption has different rules, not covered here. A parent who cuts back or stops work may also receive the PreParE (shared child-rearing benefit): the ${h.a('simulateur-prepare', 'parental leave benefit calculator')} gives the amount. The grant ceilings, which also cap the partial rate, are set out on the ${h.a('prime-naissance-plafond', 'birth grant ceiling')} page, and the ${h.a('simulateur-prime-naissance', 'birth grant calculator')} works out both at once.</p>
`,
  },
});
