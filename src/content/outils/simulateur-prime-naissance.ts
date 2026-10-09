import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Cas types : enfants à charge = bébé à naître compris ; parent isolé = barème « deux revenus » (fiche F2550). */
const cas = (h: Helpers) => [
  { k: 'a', rev: 33000, r: h.M.paje({ enfants: 1, deuxRevenus: false, revenus: 33000 }) },
  { k: 'b', rev: 45000, r: h.M.paje({ enfants: 1, deuxRevenus: true, revenus: 45000 }) },
  { k: 'c', rev: 46000, r: h.M.paje({ enfants: 2, deuxRevenus: false, revenus: 46000 }) },
  { k: 'd', rev: 47000, r: h.M.paje({ enfants: 1, deuxRevenus: true, revenus: 47000 }) },
  { k: 'e', rev: 60000, r: h.M.paje({ enfants: 3, deuxRevenus: true, revenus: 60000 }) },
];
const lib = {
  fr: { a: 'Couple, un revenu, premier enfant', b: 'Couple, deux revenus, premier enfant', c: 'Couple, un revenu, deuxième enfant', d: 'Parent isolé, premier enfant', e: 'Couple, deux revenus, troisième enfant' },
  en: { a: 'Couple, one income, first child', b: 'Couple, two incomes, first child', c: 'Couple, one income, second child', d: 'Single parent, first child', e: 'Couple, two incomes, third child' },
};
const tableau = (h: Helpers, l: 'fr' | 'en') => h.table(
  l === 'fr' ? ['Foyer', 'Revenus 2024', 'Plafond', 'Prime', 'Allocation de base'] : ['Household', '2024 income', 'Ceiling', 'Grant', 'Basic allowance'],
  cas(h).map((c) => [lib[l][c.k as keyof typeof lib.fr], h.eur(c.rev), h.eur(c.r.plafond), h.eur(c.r.prime, 2), h.eur(c.r.ab, 2)]),
  l === 'fr' ? 'Barème 2026, revenus 2024 (estimation)' : '2026 scale, 2024 income (estimate)',
  ['l', 'r', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'simulateur-prime-naissance',
  group: 'famille',
  order: 200,
  tool: 'naissance',
  related: ['prime-naissance-plafond', 'allocation-base-paje', 'prime-naissance-jumeaux', 'simulateur-prepare', 'simulateur-allocations-familiales'],
  sources: ['spNaissance', 'spAbPaje', 'instructionPf2026'],
  fr: {
    slug: 'simulateur-prime-naissance',
    nav: 'Simulateur prime de naissance',
    card: 'La prime à la naissance de la Paje et l’allocation de base qui suit, selon vos revenus 2024 et votre foyer.',
    title: 'Prime de naissance 2026 : montant et simulateur CAF',
    description: 'Prime de naissance 2026 : 1 093,11 € par enfant attendu, sous plafond de revenus 2024 (37 118 € pour un couple à un seul revenu). Simulateur et cas types.',
    h1: 'Simulateur de la prime à la naissance',
    intro: 'Indiquez votre situation, le nombre d’enfants à charge avec le bébé attendu et vos revenus 2024 : l’outil applique le barème de la Paje.',
    resume: (h) => `La prime à la naissance vaut ${h.eur(h.P.paje.prime_naissance, 2)} net par enfant attendu en 2026. Elle fait partie de la Paje, la prestation d’accueil du jeune enfant, et dépend d’un plafond de ressources calculé sur le revenu net catégoriel de ${h.P.paje.revenus_reference}. Pour un premier enfant, ce plafond est de ${h.eur(h.M.plafondNaissance(1, false))} pour un couple à un seul revenu et de ${h.eur(h.M.plafondNaissance(1, true))} pour un couple à deux revenus ou un parent isolé ; il monte avec chaque enfant à charge, le bébé à naître compris. Un couple compte deux revenus quand chacun a perçu au moins ${h.eur(h.P.paje.seuil_deuxieme_revenu)} en ${h.P.paje.revenus_reference}. Il n’existe pas de prime réduite : sous le plafond, la somme est entière, au-dessus elle n’est pas due. La CAF la verse avant la fin du mois civil qui suit le 6e mois de grossesse, à condition que la grossesse ait été déclarée. Après la naissance, l’allocation de base peut prendre le relais chaque mois. Résultats indicatifs : la CAF calcule le droit.`,
    faqs: (h) => [
      { q: 'Le simulateur de prime de naissance compte-t-il le bébé à naître ?', a: `Oui, il faut l’inclure. La fiche F2550 de service-public précise que l’enfant à naître compte pour un enfant à charge. Un couple qui attend son deuxième enfant se place donc sur la ligne « deux enfants », avec un plafond de ${h.eur(h.M.plafondNaissance(2, false))} à un revenu ou ${h.eur(h.M.plafondNaissance(2, true))} à deux revenus. Oublier le bébé fait lire un plafond trop bas.` },
      { q: 'Pourquoi l’outil répond-il zéro alors que je suis juste au-dessus du plafond ?', a: `Parce que la prime à la naissance ne connaît pas de montant dégressif. Contrairement à l’allocation de rentrée scolaire, il n’y a pas d’allocation différentielle : à ${h.eur(h.M.plafondNaissance(1, false) + 1)} de revenus 2024, un couple à un revenu attendant son premier enfant perd les ${h.eur(h.P.paje.prime_naissance, 2)}. La fiche F2550 ne prévoit que le montant entier sous condition de ressources.` },
      { q: 'Quelle situation choisir si je suis enceinte et seule ?', a: `« Parent isolé ». La fiche F2550 lui applique les mêmes plafonds qu’à un couple à deux revenus : ${h.eur(h.M.plafondNaissance(1, true))} pour un premier enfant, ${h.eur(h.M.plafondNaissance(2, true))} pour un deuxième. Attention au moment retenu : la situation familiale est appréciée au premier jour du mois civil qui suit le 5e mois de grossesse. Une mise en couple avant cette date change la ligne du barème.` },
    ],
    body: (h) => `
<h2>Ce que fait l’outil</h2>
<p>Il lit trois informations : la situation du foyer (couple à un revenu, couple à deux revenus ou parent isolé), le nombre d’enfants à charge avec le bébé attendu, et le revenu net catégoriel ${h.P.paje.revenus_reference}. Il en tire le plafond applicable, dit si la prime de ${h.eur(h.P.paje.prime_naissance, 2)} est due, puis estime l’allocation de base mensuelle qui suivrait la naissance, au taux plein de ${h.eur(h.P.paje.ab_plein, 2)} ou au taux partiel de ${h.eur(h.P.paje.ab_partiel, 2)}.</p>
<p>Les plafonds sont ceux de la ${h.src('spNaissance', 'fiche F2550 de service-public')} pour la prime et de la ${h.src('spAbPaje', 'fiche F2552')} pour l’allocation de base ; les montants découlent de l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}. Au-delà de trois enfants, la prime ajoute ${h.eur(h.P.paje.plafonds_naissance.par_enfant)} de plafond par enfant.</p>

<h2>Cas types</h2>
${tableau(h, 'fr')}
<p>Comparez les deuxième et troisième lignes : à revenus voisins, le couple à deux revenus touche la prime, le couple à un seul revenu non, alors même que son deuxième enfant relève son plafond. Le seuil de ${h.eur(h.P.paje.seuil_deuxieme_revenu)} par conjoint décide de la colonne, comme l’explique la page ${h.a('prime-naissance-plafond', 'plafond de la prime de naissance')}.</p>

<h2>Ce que l’outil ne fait pas</h2>
<p>Il ne vérifie pas la déclaration de grossesse, faite avant la fin du 3e mois, ni la condition de résidence en France plus de neuf mois dans l’année. Il ne traite pas la prime à l’adoption, dont les règles diffèrent. Il ne connaît pas les régimes d’outre-mer. Enfin, l’allocation de base n’est attribuée que pour un enfant à la fois, hors naissances multiples : un foyer qui la touche déjà pour un aîné de moins de 3 ans n’en reçoit pas une seconde. Les détails sont sur la page ${h.a('allocation-base-paje', 'allocation de base de la Paje')}.</p>
<p>Après la naissance, un parent qui réduit ou cesse son activité peut aussi regarder le ${h.a('simulateur-prepare', 'simulateur de la PreParE')}.</p>
`,
  },
  en: {
    slug: 'birth-grant-calculator',
    nav: 'Birth grant calculator',
    card: 'The Paje birth grant and the basic allowance that follows, worked out from your 2024 income and household.',
    title: 'Birth Grant France 2026: Prime de Naissance Calculator',
    description: 'Birth grant (prime de naissance) 2026: €1,093.11 per expected child if 2024 income is under the ceiling (€37,118, one-income couple). Calculator, sample cases.',
    h1: 'Birth grant (prime à la naissance) calculator',
    intro: 'Enter your household type, the number of dependent children including the expected baby, and your 2024 income: the tool applies the Paje scale.',
    resume: (h) => `The prime à la naissance (birth grant) is ${h.eur(h.P.paje.prime_naissance, 2)} net per expected child in 2026. It belongs to the Paje (prestation d’accueil du jeune enfant, the French early-childhood benefit paid by the CAF family benefits office) and depends on an income ceiling based on your revenu net catégoriel for ${h.P.paje.revenus_reference}, broadly taxable income after the standard deductions. For a first child, the ceiling is ${h.eur(h.M.plafondNaissance(1, false))} for a couple with one income and ${h.eur(h.M.plafondNaissance(1, true))} for a couple with two incomes or a single parent; it rises with each dependent child, the unborn baby included. A couple counts as having two incomes when each partner earned at least ${h.eur(h.P.paje.seuil_deuxieme_revenu)} in ${h.P.paje.revenus_reference}. There is no reduced grant: under the ceiling you get the full sum, above it nothing. The CAF pays it before the end of the calendar month following the sixth month of pregnancy, provided the pregnancy has been declared. After the birth, the monthly basic allowance can take over. Results are indicative; the CAF decides.`,
    faqs: (h) => [
      { q: 'Should I count the unborn baby in the birth grant calculator?', a: `Yes. Service-public.fr sheet F2550 says the unborn child counts as one dependent child. A couple expecting their second child therefore uses the two-child row, with a ceiling of ${h.eur(h.M.plafondNaissance(2, false))} on one income or ${h.eur(h.M.plafondNaissance(2, true))} on two. Leaving the baby out makes you read a ceiling that is too low.` },
      { q: 'Why does the calculator show zero when I am only just over the ceiling?', a: `Because the birth grant has no tapering. Unlike the back-to-school allowance, there is no differential amount: at ${h.eur(h.M.plafondNaissance(1, false) + 1)} of 2024 income, a one-income couple expecting their first child loses the whole ${h.eur(h.P.paje.prime_naissance, 2)}. Sheet F2550 only provides for the full amount, subject to the income test.` },
      { q: 'I am pregnant and on my own: which household type do I pick?', a: `“Single parent”. Sheet F2550 gives single parents the same ceilings as two-income couples: ${h.eur(h.M.plafondNaissance(1, true))} for a first child, ${h.eur(h.M.plafondNaissance(2, true))} for a second. Watch the reference date: family situation is assessed on the first day of the calendar month following the fifth month of pregnancy. Moving in with a partner before then changes the row.` },
    ],
    body: (h) => `
<h2>What the tool does</h2>
<p>It reads three things: your household type (couple with one income, couple with two, or single parent), the number of dependent children with the expected baby, and your ${h.P.paje.revenus_reference} net taxable income. From these it finds the applicable ceiling, says whether the ${h.eur(h.P.paje.prime_naissance, 2)} grant is due, then estimates the monthly basic allowance (allocation de base) that would follow the birth, at the full rate of ${h.eur(h.P.paje.ab_plein, 2)} or the partial rate of ${h.eur(h.P.paje.ab_partiel, 2)}.</p>
<p>Ceilings come from ${h.src('spNaissance', 'service-public.fr sheet F2550')} for the grant and ${h.src('spAbPaje', 'sheet F2552')} for the basic allowance; amounts follow the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}. Beyond three children, the grant ceiling rises by ${h.eur(h.P.paje.plafonds_naissance.par_enfant)} per child.</p>

<h2>Sample households</h2>
${tableau(h, 'en')}
<p>Compare the second and third rows: on similar income, the two-income couple gets the grant and the one-income couple does not, even though its second child raises its ceiling. The ${h.eur(h.P.paje.seuil_deuxieme_revenu)} threshold per partner decides the column, as the ${h.a('prime-naissance-plafond', 'birth grant ceiling')} page explains.</p>

<h2>What the tool does not do</h2>
<p>It does not check that the pregnancy was declared before the end of the third month, nor the rule on living in France for more than nine months of the year. It leaves out the adoption grant, which has its own rules, and the overseas schemes. And the basic allowance is paid for one child at a time, except for multiple births: a household already receiving it for an older child under 3 does not get a second one. Details are on the ${h.a('allocation-base-paje', 'Paje basic allowance')} page.</p>
<p>After the birth, a parent who cuts back or stops work can also try the ${h.a('simulateur-prepare', 'parental leave benefit calculator')}.</p>
`,
  },
});
