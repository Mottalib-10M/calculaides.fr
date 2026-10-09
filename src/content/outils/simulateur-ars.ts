import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Cas types du tableau : familles réelles, revenus 2024, âges différents. */
const cas = (h: Helpers) => [
  { k: 'a', rev: 22000, r: h.M.ars({ c6_10: 1, c11_14: 0, c15_18: 0, enfants: 1, revenus: 22000 }) },
  { k: 'b', rev: 33000, r: h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 0, enfants: 2, revenus: 33000 }) },
  { k: 'c', rev: 36000, r: h.M.ars({ c6_10: 0, c11_14: 1, c15_18: 0, enfants: 3, revenus: 36000 }) },
  { k: 'd', rev: 41000, r: h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, enfants: 3, revenus: 41000 }) },
  { k: 'e', rev: 29100, r: h.M.ars({ c6_10: 0, c11_14: 0, c15_18: 1, enfants: 1, revenus: 29100 }) },
];
const lib = {
  fr: { a: 'Un enfant de 8 ans', b: 'Deux enfants, 7 et 12 ans', c: 'Trois enfants dont un collégien, deux petits', d: 'Trois enfants, 9, 13 et 16 ans', e: 'Un lycéen de 16 ans, revenus juste au-dessus' },
  en: { a: 'One child aged 8', b: 'Two children, 7 and 12', c: 'Three children: one aged 12, two under 6', d: 'Three children, 9, 13 and 16', e: 'One pupil aged 16, income just above' },
};
const tableau = (h: Helpers, l: 'fr' | 'en') => h.table(
  l === 'fr' ? ['Famille', 'Revenus 2024', 'Plafond', 'ARS estimée'] : ['Family', '2024 income', 'Ceiling', 'Estimated allowance'],
  cas(h).map((c) => [lib[l][c.k as keyof typeof lib.fr], h.eur(c.rev), h.eur(c.r.plafond), h.eur(c.r.total, 2)]),
  l === 'fr' ? 'Rentrée 2026, montants nets de CRDS (estimation)' : 'Autumn 2026 school year, amounts net of CRDS (estimate)',
  ['l', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'simulateur-ars',
  group: 'famille',
  order: 100,
  tool: 'ars',
  related: ['ars-plafond', 'ars-montant-age', 'ars-differentielle', 'ars-lyceen-apprenti', 'simulateur-allocations-familiales'],
  sources: ['spArs', 'instructionPf2026'],
  fr: {
    slug: 'simulateur-ars',
    nav: 'Simulateur ARS',
    card: 'L’allocation de rentrée scolaire de la rentrée 2026, enfant par enfant, avec le calcul différentiel.',
    title: 'Allocation de rentrée scolaire 2026 : simulateur et montant',
    description: 'Allocation de rentrée scolaire 2026 : 426,87 € à 466,02 € par enfant selon l’âge, plafond de 28 956 € pour un enfant. Simulateur avec allocation différentielle.',
    h1: 'Simulateur de l’allocation de rentrée scolaire',
    intro: 'Indiquez l’âge de vos enfants scolarisés et les revenus 2024 du foyer : l’outil applique le barème de la rentrée 2026.',
    resume: (h) => `Pour la rentrée 2026, l’allocation de rentrée scolaire (ARS) vaut ${h.eur(h.P.ars.montants['6_10'], 2)} pour un enfant de 6 à 10 ans, ${h.eur(h.P.ars.montants['11_14'], 2)} de 11 à 14 ans et ${h.eur(h.P.ars.montants['15_18'], 2)} de 15 à 18 ans, montants déjà nets de CRDS. Elle est due si le revenu net catégoriel 2024 du foyer ne dépasse pas ${h.eur(h.P.ars.plafonds.un)} avec un enfant à charge, ${h.eur(h.P.ars.plafonds.deux)} avec deux, ${h.eur(h.P.ars.plafonds.trois)} avec trois, puis ${h.eur(h.P.ars.plafonds.par_enfant)} de plus par enfant. Un foyer de deux enfants de 7 et 12 ans qui a déclaré 33 000 € en 2024 reçoit ${h.eur(cas(h)[1].r.total, 2)}. Au-dessus du plafond, l’aide ne tombe pas d’un coup : une allocation différentielle verse le montant plein diminué du dépassement. L’enfant doit être né entre le ${h.date(h.P.ars.naissance_min)} et le ${h.date(h.P.ars.naissance_max)}, scolarisé ou inscrit au Cned. Le simulateur donne une estimation ; la CAF reste seule juge du droit.`,
    faqs: (h) => [
      { q: 'Le simulateur ARS tient-il compte de mon bébé ?', a: `Oui, si vous le comptez dans les enfants à charge. Il ne touche pas d’ARS, mais il relève le plafond du foyer : avec trois enfants à charge, la limite passe à ${h.eur(h.P.ars.plafonds.trois)} contre ${h.eur(h.P.ars.plafonds.deux)} avec deux. Dans notre tableau, la famille d’un collégien et de deux petits reste ainsi sous le plafond avec 36 000 € de revenus 2024. Règle de la fiche F1878 de service-public.` },
      { q: 'Quand l’ARS 2026 a-t-elle été versée ?', a: `Selon la fiche F1878 de service-public, à partir du ${h.date('2026-08-18')} en métropole, pour les enfants de 6 à 16 ans et pour ceux de 16 à 18 ans dont la scolarité ou l’apprentissage avait été déclaré. Une déclaration faite plus tard entraîne un versement quelques jours après sa réception par la CAF. Notre outil ne donne pas de date : il calcule le montant, à ${h.eur(h.P.ars.montants['6_10'], 2)} au moins par enfant.` },
      { q: 'Pourquoi le simulateur affiche-t-il un montant réduit ?', a: `Parce que vos revenus dépassent le plafond de peu. L’allocation différentielle verse le montant plein moins le dépassement : un lycéen seul à charge avec 29 100 € de revenus 2024 donne ${h.eur(cas(h)[4].r.total, 2)} au lieu de ${h.eur(h.P.ars.montants['15_18'], 2)}. Notre calcul n’affiche pas de reliquat inférieur à ${h.eur(h.P.ars.minimum_verse)}. Le détail figure sur la page dédiée au calcul différentiel.` },
    ],
    body: (h) => `
<h2>Ce que calcule l’outil</h2>
<p>Trois nombres suffisent : combien d’enfants scolarisés dans chaque tranche d’âge, combien d’enfants à charge au total, et le revenu net catégoriel 2024 du foyer. L’outil additionne les montants par enfant, compare les revenus au plafond qui correspond à la taille de la famille et, en cas de dépassement, applique l’allocation différentielle. Le résultat est un montant unique, versé une fois par an pour la rentrée.</p>
<p>Les montants viennent de la ${h.src('spArs', 'fiche F1878 de service-public')} et de l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')} qui revalorise les prestations familiales. Ils sont publiés après déduction de la CRDS : ce que l’outil affiche est ce qui arrive sur le compte.</p>

<h2>Cas types de la rentrée 2026</h2>
${tableau(h, 'fr')}
<p>La troisième ligne montre l’effet du nombre d’enfants à charge : un seul enfant ouvre droit à l’ARS, mais les deux plus jeunes portent le plafond à ${h.eur(h.P.ars.plafonds.trois)}. La dernière ligne montre la différentielle : ${h.eur(29100 - h.P.ars.plafonds.un)} de dépassement retirés du montant plein.</p>

<h2>Ce que l’outil ne sait pas faire</h2>
<p>Il ne vérifie pas la scolarité. Un enfant instruit en famille n’ouvre pas droit à l’ARS, et un apprenti dont le salaire dépasse le plafond fixé par les textes non plus : la page ${h.a('ars-lyceen-apprenti', 'lycéens et apprentis')} en donne le chiffre. Il ignore aussi le cas d’un enfant confié par le juge à l’aide sociale à l’enfance, dont l’allocation est placée sur un compte bloqué jusqu’à sa majorité.</p>
<p>Le barème est celui de la métropole. La Réunion verse à une autre date et Mayotte applique d’autres montants et d’autres plafonds. Enfin, l’outil ne sait pas lire votre avis d’imposition : c’est à vous de reporter le revenu net catégoriel, ligne expliquée sur la page ${h.a('ars-plafond', 'plafond de l’ARS')}.</p>
<p>Pour aller plus loin : ${h.a('ars-montant-age', 'le montant selon l’âge')}, ${h.a('ars-differentielle', 'l’allocation différentielle')} et, pour les autres prestations de la famille, le ${h.a('simulateur-allocations-familiales', 'simulateur des allocations familiales')}.</p>
`,
  },
  en: {
    slug: 'back-to-school-allowance-calculator',
    nav: 'Back-to-school allowance calculator',
    card: 'The French back-to-school allowance for autumn 2026, child by child, including the reduced differential amount.',
    title: 'Back-to-School Allowance 2026: ARS Calculator and Amounts',
    description: 'Back-to-school allowance (ARS) 2026: €426.87 to €466.02 per child by age, income ceiling €28,956 for one child. Calculator with the differential amount.',
    h1: 'Back-to-school allowance (ARS) calculator',
    intro: 'Enter the ages of your school-age children and your household income for 2024: the tool applies the autumn 2026 scale.',
    resume: (h) => `For the 2026 school year, the allocation de rentrée scolaire (ARS, the French back-to-school allowance paid by the CAF family benefits office) is ${h.eur(h.P.ars.montants['6_10'], 2)} for a child aged 6 to 10, ${h.eur(h.P.ars.montants['11_14'], 2)} for ages 11 to 14 and ${h.eur(h.P.ars.montants['15_18'], 2)} for ages 15 to 18, already net of CRDS (a small social levy). It is paid when the household’s revenu net catégoriel for 2024, broadly taxable income after the standard tax allowances, stays at or below ${h.eur(h.P.ars.plafonds.un)} with one dependent child, ${h.eur(h.P.ars.plafonds.deux)} with two, ${h.eur(h.P.ars.plafonds.trois)} with three, plus ${h.eur(h.P.ars.plafonds.par_enfant)} for each further child. A family with children of 7 and 12 and €33,000 of 2024 income receives ${h.eur(cas(h)[1].r.total, 2)}. Slightly above the ceiling, a differential allowance pays the full amount minus the excess. The child must be born between ${h.date(h.P.ars.naissance_min)} and ${h.date(h.P.ars.naissance_max)} and be at school or enrolled with Cned, the state distance-learning body. Results are estimates; the CAF alone decides.`,
    faqs: (h) => [
      { q: 'Should I count my toddler in the back-to-school allowance calculator?', a: `Yes, as a dependent child. A toddler gets no allowance, but raises the household ceiling: with three dependent children the limit is ${h.eur(h.P.ars.plafonds.trois)}, against ${h.eur(h.P.ars.plafonds.deux)} with two. In our table, the family with one 12-year-old and two under-6s stays below the ceiling on €36,000 of 2024 income. The rule comes from service-public.fr sheet F1878.` },
      { q: 'When was the 2026 back-to-school allowance paid in mainland France?', a: `According to service-public.fr sheet F1878, from ${h.date('2026-08-18')} in mainland France, for children aged 6 to 16 and for 16 to 18-year-olds whose schooling or apprenticeship had been declared. A later declaration means payment a few days after the CAF receives it. Our tool gives no date; it works out the amount, at least ${h.eur(h.P.ars.montants['6_10'], 2)} per child.` },
      { q: 'Why does the calculator show a reduced back-to-school allowance?', a: `Because your income is only slightly over the ceiling. The differential allowance pays the full amount minus the excess: one dependent pupil aged 16 with €29,100 of 2024 income gives ${h.eur(cas(h)[4].r.total, 2)} instead of ${h.eur(h.P.ars.montants['15_18'], 2)}. Our calculation shows nothing below ${h.eur(h.P.ars.minimum_verse)}. The dedicated page walks through the differential sum.` },
    ],
    body: (h) => `
<h2>What the tool works out</h2>
<p>It needs three things: how many school-age children you have in each age band, how many dependent children in total, and the household’s 2024 revenu net catégoriel. It adds up the per-child amounts, checks income against the ceiling for your family size and, if you are over, applies the differential allowance. The answer is a single lump sum, paid once a year for the start of the school year in September.</p>
<p>The amounts come from ${h.src('spArs', 'service-public.fr sheet F1878')} and the ${h.src('instructionPf2026', 'instruction of 20 March 2026')} uprating family benefits. They are published after CRDS has been taken off, so the figure shown is what reaches your bank account.</p>

<h2>Sample families for autumn 2026</h2>
${tableau(h, 'en')}
<p>The third row shows why the number of dependants matters: only one child qualifies for the allowance, yet the two younger ones lift the ceiling to ${h.eur(h.P.ars.plafonds.trois)}. The last row is the differential case: an excess of ${h.eur(29100 - h.P.ars.plafonds.un)} is deducted from the full amount.</p>

<h2>What the tool cannot do</h2>
<p>It does not check schooling. A child home-schooled (instruction en famille) does not qualify, nor does an apprentice whose pay exceeds the legal ceiling; the page on ${h.a('ars-lyceen-apprenti', 'older pupils and apprentices')} gives that figure. It also leaves aside children placed in care by a judge, whose allowance goes into a blocked account until they turn 18.</p>
<p>The scale is the one for mainland France. Réunion pays on a different date and Mayotte has its own amounts and ceilings. Nor can the tool read your tax notice (avis d’imposition): you enter the net taxable income figure yourself, as explained on the ${h.a('ars-plafond', 'income ceiling')} page.</p>
<p>Further reading: ${h.a('ars-montant-age', 'amounts by age')}, ${h.a('ars-differentielle', 'the differential allowance')} and, for the rest of your family benefits, the ${h.a('simulateur-allocations-familiales', 'family allowance calculator')}.</p>
`,
  },
});
