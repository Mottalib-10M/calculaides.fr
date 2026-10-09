import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Couple fil rouge : deux revenus, premiers enfants, des jumeaux, 45 000 € de revenus 2024. */
const REV = 45000;
/** Mensualités d’allocation de base : du mois suivant la naissance au mois précédant les 3 ans (fiche F2552). */
const MOIS = 3 * 12 - 1;
const prime = (h: Helpers, bebes: number, revenus: number, enfants = 1) => h.M.paje({ enfants, deuxRevenus: true, revenus, naissances: bebes }).prime;
/** Après la naissance, les bébés sont à charge : allocation de base par enfant, multipliée par le nombre de bébés. */
const abPar = (h: Helpers, bebes: number, revenus: number, deux = true) => h.M.paje({ enfants: bebes, deuxRevenus: deux, revenus }).ab;

export default defineGuide({
  id: 'prime-naissance-jumeaux',
  group: 'famille',
  order: 230,
  mini: 'naissanceJumeaux',
  miniHref: 'simulateur-prime-naissance',
  related: ['simulateur-prime-naissance', 'prime-naissance-plafond', 'allocation-base-paje', 'allocations-familiales-2-enfants', 'ars-montant-age'],
  sources: ['spNaissance', 'spAbPaje', 'instructionPf2026'],
  fr: {
    slug: 'prime-naissance-jumeaux',
    nav: 'Prime de naissance pour jumeaux',
    card: 'Jumeaux, triplés : une prime de naissance par bébé, une allocation de base par enfant, et la question du plafond.',
    title: 'Prime de naissance 2026 : jumeaux, triplés, montant',
    description: 'Prime de naissance 2026, jumeaux : 2 186,22 € (deux primes de 1 093,11 €), triplés 3 279,33 €. Puis une allocation de base par bébé. Conditions et plafond.',
    h1: 'Jumeaux et triplés : une prime par bébé, et après ?',
    intro: 'Pour une naissance multiple, la CAF verse autant de primes que d’enfants attendus, puis une allocation de base pour chacun : c’est l’une des rares règles qui multiplient vraiment.',
    resume: (h) => `Pour des jumeaux, la prime de naissance 2026 est versée deux fois : ${h.eur(h.P.paje.prime_naissance * 2, 2)} au total, soit deux primes de ${h.eur(h.P.paje.prime_naissance, 2)}. Des triplés ouvrent ${h.eur(h.P.paje.prime_naissance * 3, 2)}. Service-public précise qu’il est versé autant de primes que d’enfants à naître, sur la base d’une attestation médicale indiquant leur nombre. La condition de ressources reste celle de la prime ordinaire, appréciée sur le revenu net catégoriel ${h.P.paje.revenus_reference}. Après l’accouchement, la règle habituelle « une seule allocation de base par famille » tombe : la CAF verse une allocation de base par enfant né du même accouchement. Un couple à deux revenus qui a déclaré ${h.eur(REV)} en ${h.P.paje.revenus_reference} et attend des jumeaux reçoit ainsi ${h.eur(prime(h, 2, REV), 2)} de primes, puis ${h.eur(abPar(h, 2, REV) * 2, 2)} par mois d’allocations de base. Un doute subsiste pour les revenus proches du plafond, car la fiche ne dit pas comment se comptent deux enfants à naître. Montants estimés, à confirmer auprès de la CAF.`,
    faqs: (h) => [
      { q: 'Combien touche-t-on de prime de naissance pour des jumeaux en 2026 ?', a: `${h.eur(h.P.paje.prime_naissance * 2, 2)}, soit deux primes de ${h.eur(h.P.paje.prime_naissance, 2)}. La fiche F2550 de service-public prévoit autant de primes que d’enfants à naître en cas de naissances multiples. Les deux primes sont soumises à la même condition de ressources que pour un seul bébé, et versées dans le même délai : avant la fin du mois civil qui suit le 6e mois de grossesse.` },
      { q: 'Quel justificatif la CAF demande-t-elle pour une grossesse gémellaire ?', a: `Une attestation médicale précisant le nombre d’enfants à naître, selon la fiche F2550 de service-public. C’est elle qui permet à la CAF de verser deux primes, ou trois pour des triplés, au lieu d’une seule. Sans ce document, la caisse s’en tient à la déclaration de grossesse ordinaire et à une prime de ${h.eur(h.P.paje.prime_naissance, 2)}.` },
      { q: 'Avec des jumeaux, a-t-on droit à deux allocations de base ?', a: `Oui. L’allocation de base n’est normalement versée que pour un enfant à la fois par famille, mais la fiche F2552 fait exception pour les naissances multiples : la CAF verse autant d’allocations que d’enfants nés du même accouchement. Au taux plein, cela représente ${h.eur(h.P.paje.ab_plein * 2, 2)} par mois pour des jumeaux, ${h.eur(h.P.paje.ab_plein * 3, 2)} pour des triplés.` },
      { q: 'Les jumeaux comptent-ils pour deux enfants dans le plafond de la prime ?', a: `La fiche F2550 indique que l’enfant à naître compte pour un enfant à charge, sans traiter le cas de plusieurs bébés. Notre simulateur retient donc, par prudence, la ligne d’un seul enfant : ${h.eur(h.M.plafondNaissance(1, true))} pour un couple à deux revenus. Si vos revenus ${h.P.paje.revenus_reference} se situent entre ce montant et ${h.eur(h.M.plafondNaissance(2, true))}, posez la question à votre CAF avant de conclure.` },
      { q: 'Des triplés après un premier enfant, quelle somme au total la première année ?', a: `Pour un couple à un revenu sous les plafonds, trois primes de ${h.eur(h.P.paje.prime_naissance, 2)}, soit ${h.eur(h.P.paje.prime_naissance * 3, 2)}, puis trois allocations de base. Avec 40 000 € de revenus 2024 et quatre enfants à charge après la naissance, le taux plein s’applique : ${h.eur(abPar(h, 4, 40000, false) * 3, 2)} par mois. Les allocations familiales s’y ajoutent, selon leur propre barème.` },
      { q: 'Si l’un des jumeaux ne survit pas, la CAF reprend-elle une prime ?', a: `Selon la fiche F2550 de service-public, la prime à la naissance est maintenue si le décès de l’enfant survient à partir du premier jour du mois qui suit le 5e mois de grossesse : les ${h.eur(h.P.paje.prime_naissance, 2)} versés pour ce bébé restent acquis. Après la naissance, la fiche F2552 prévoit que l’allocation de base est prolongée automatiquement de trois mois après le décès, sans condition d’âge.` },
    ],
    body: (h) => `
<h2>Une prime par bébé attendu</h2>
${h.table(['Grossesse', 'Nombre de primes', 'Total'], [[1, 'Un bébé'], [2, 'Jumeaux'], [3, 'Triplés'], [4, 'Quadruplés']].map(([n, l]) => [String(l), String(n), h.eur(h.P.paje.prime_naissance * Number(n), 2)]), 'Prime de naissance 2026, sous condition de ressources', ['l', 'r', 'r'])}
<p>La ${h.src('spNaissance', 'fiche F2550 de service-public')} est claire sur le principe : en cas de naissances multiples attendues, il est versé autant de primes que d’enfants à naître. Le montant unitaire est celui de toute prime de naissance, ${h.eur(h.P.paje.prime_naissance, 2)} net, revalorisé au 1er avril 2026 par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}. Le calendrier ne change pas : la grossesse est déclarée avant la fin du 3e mois, et les primes arrivent avant la fin du mois civil qui suit le 6e mois.</p>
<p>La pièce qui fait la différence est l’attestation médicale indiquant le nombre d’enfants à naître. Elle accompagne la demande ; c’est sur sa base que la CAF multiplie la prime.</p>
<!--mini:naissanceJumeaux-->

<h2>Le plafond, seule zone grise</h2>
<p>Pour un bébé unique, la règle est connue : l’enfant à naître compte pour un enfant à charge. Pour des jumeaux, la fiche ne dit pas s’ils comptent pour un ou pour deux. L’écart n’est pas anodin : pour un couple à deux revenus sans autre enfant, la limite passe de ${h.eur(h.M.plafondNaissance(1, true))} à ${h.eur(h.M.plafondNaissance(2, true))} selon la lecture retenue.</p>
${h.table(['Revenus 2024 (couple, deux revenus)', 'Lecture « un enfant »', 'Lecture « deux enfants »'], [45000, 52000, 58000].map((r) => [h.eur(r), h.eur(prime(h, 2, r, 1), 2), h.eur(prime(h, 2, r, 2), 2)]), 'Primes pour des jumeaux, premiers enfants du foyer', ['l', 'r', 'r'])}
<p>La première ligne ne pose aucun problème : les deux lectures donnent deux primes. La dernière non plus : au-dessus de ${h.eur(h.M.plafondNaissance(2, true))}, rien n’est dû. Seule la ligne du milieu dépend de la réponse de la CAF. Nous ne tranchons pas une règle que nous n’avons pas trouvée écrite ; notre mini-simulateur prend la lecture la plus prudente, et nous vous invitons à interroger votre caisse si vous êtes dans cette zone.</p>

<h2>Après la naissance : une allocation de base par enfant</h2>
<p>Une fois les bébés nés, aucun doute sur leur nombre : ils sont deux, ou trois, enfants à charge. La ${h.src('spAbPaje', 'fiche F2552')} écarte ici la règle qui limite l’allocation de base à un enfant à la fois : pour des naissances multiples, elle est versée pour chaque enfant. Le taux, plein ou partiel, se lit sur la ligne qui correspond au nouveau nombre d’enfants.</p>
<p>Reprenons le couple à deux revenus de ${h.eur(REV)}. Avec deux enfants à charge, le taux plein s’arrête à ${h.eur(h.M.plafondAbPlein(2, true))} : chaque jumeau ouvre ${h.eur(abPar(h, 2, REV), 2)}, soit ${h.eur(abPar(h, 2, REV) * 2, 2)} par mois. Sur les ${MOIS} mensualités qui vont du mois suivant la naissance au mois précédant les 3 ans, cela fait ${h.eur(abPar(h, 2, REV) * 2 * MOIS)} à barème constant. Le détail des taux figure sur la page ${h.a('allocation-base-paje', 'allocation de base de la Paje')}.</p>

<h2>Ce qui se multiplie, ce qui ne bouge pas</h2>
<p>Résumons. La prime se multiplie par le nombre de bébés, l’allocation de base aussi. Le plafond de ressources, lui, ne double pas : il dépend du nombre d’enfants à charge, avec l’incertitude décrite plus haut avant la naissance, puis sans ambiguïté après. Le revenu de référence ne change pas non plus : ce sont toujours les revenus ${h.P.paje.revenus_reference} du foyer. Une famille à un seul revenu de ${h.eur(36000)} qui attend des jumeaux reste sous le plafond le plus bas, ${h.eur(h.M.plafondNaissance(1, false))}, et touche ${h.eur(h.M.paje({ enfants: 1, deuxRevenus: false, revenus: 36000, naissances: 2 }).prime, 2)} quelle que soit la lecture.</p>

<h2>Les autres prestations qui changent avec deux bébés</h2>
<p>Une naissance gémellaire fait parfois passer une famille d’un enfant à trois. Les ${h.a('allocations-familiales-2-enfants', 'allocations familiales')}, versées à partir de deux enfants, peuvent alors démarrer ou augmenter, selon leur propre barème. Plus tard, l’ARS sera due pour chaque jumeau, l’un et l’autre dans la même tranche d’âge : la page ${h.a('ars-montant-age', 'ARS par âge')} donne les montants. Pour la demande de prime et les plafonds en détail, voyez la page ${h.a('prime-naissance-plafond', 'plafond de la prime de naissance')} et le ${h.a('simulateur-prime-naissance', 'simulateur de la prime de naissance')}.</p>
`,
  },
  en: {
    slug: 'birth-grant-twins',
    nav: 'Birth grant for twins',
    card: 'Twins, triplets: one birth grant per baby, one basic allowance per child, and the open question on the ceiling.',
    title: 'Birth Grant 2026: Twins and Triplets, Amounts per Baby',
    description: 'Birth grant 2026 for twins in France: €2,186.22 (two grants of €1,093.11), triplets €3,279.33. Then one basic allowance per baby. Conditions and ceiling.',
    h1: 'Twins and triplets: one grant per baby, and then?',
    intro: 'For a multiple birth, the CAF pays as many grants as babies expected, then a basic allowance for each: one of the few rules that genuinely multiply.',
    resume: (h) => `For twins, the 2026 prime à la naissance (birth grant, part of the Paje early-childhood benefit paid by the CAF family benefits office) is paid twice: ${h.eur(h.P.paje.prime_naissance * 2, 2)} in total, two grants of ${h.eur(h.P.paje.prime_naissance, 2)}. Triplets bring ${h.eur(h.P.paje.prime_naissance * 3, 2)}. Service-public.fr states that as many grants are paid as there are babies expected, on the basis of a medical certificate giving their number. The income test is the same as for a single baby, based on ${h.P.paje.revenus_reference} revenu net catégoriel, broadly taxable income after standard deductions. After the birth, the usual rule of one basic allowance (allocation de base) per family is set aside: the CAF pays one for each child born in the same delivery. A two-income couple who declared ${h.eur(REV)} for ${h.P.paje.revenus_reference} and is expecting twins therefore receives ${h.eur(prime(h, 2, REV), 2)} in grants, then ${h.eur(abPar(h, 2, REV) * 2, 2)} a month in basic allowances. One doubt remains for incomes close to the ceiling, since the sheet does not say how two unborn babies are counted. These are estimates for the CAF to confirm.`,
    faqs: (h) => [
      { q: 'How much birth grant do you get for twins in 2026?', a: `${h.eur(h.P.paje.prime_naissance * 2, 2)}, two grants of ${h.eur(h.P.paje.prime_naissance, 2)}. Service-public.fr sheet F2550 provides for as many grants as babies expected in a multiple pregnancy. Both are subject to the same income test as for one baby and paid within the same deadline: before the end of the calendar month following the sixth month of pregnancy.` },
      { q: 'What proof does the CAF need for a twin pregnancy?', a: `A medical certificate stating the number of babies expected, according to service-public.fr sheet F2550. That is what allows the CAF to pay two grants, or three for triplets, instead of one. Without it, the fund sticks to the ordinary pregnancy declaration and a single grant of ${h.eur(h.P.paje.prime_naissance, 2)}.` },
      { q: 'With twins, do we get two basic allowances?', a: `Yes. The basic allowance is normally paid for one child at a time per family, but sheet F2552 makes an exception for multiple births: the CAF pays as many allowances as children born in the same delivery. At the full rate, that is ${h.eur(h.P.paje.ab_plein * 2, 2)} a month for twins and ${h.eur(h.P.paje.ab_plein * 3, 2)} for triplets.` },
      { q: 'Do twins count as two children for the birth grant ceiling?', a: `Sheet F2550 says the unborn child counts as one dependent child, without covering several babies. Our calculator therefore takes the cautious one-child row: ${h.eur(h.M.plafondNaissance(1, true))} for a two-income couple. If your ${h.P.paje.revenus_reference} income falls between that figure and ${h.eur(h.M.plafondNaissance(2, true))}, ask your CAF before drawing conclusions.` },
      { q: 'Triplets after a first child: what is the total in the first year?', a: `For a one-income couple under the ceilings, three grants of ${h.eur(h.P.paje.prime_naissance, 2)}, or ${h.eur(h.P.paje.prime_naissance * 3, 2)}, then three basic allowances. With €40,000 of 2024 income and four dependent children after the birth, the full rate applies: ${h.eur(abPar(h, 4, 40000, false) * 3, 2)} a month. Family allowances come on top, under their own scale.` },
      { q: 'If one of the twins does not survive, does the CAF take back a grant?', a: `According to service-public.fr sheet F2550, the birth grant is kept if the child dies on or after the first day of the month following the fifth month of pregnancy: the ${h.eur(h.P.paje.prime_naissance, 2)} paid for that baby is not reclaimed. After the birth, sheet F2552 provides that the basic allowance continues automatically for three months after the death, with no age condition.` },
    ],
    body: (h) => `
<h2>One grant per expected baby</h2>
${h.table(['Pregnancy', 'Number of grants', 'Total'], [[1, 'One baby'], [2, 'Twins'], [3, 'Triplets'], [4, 'Quadruplets']].map(([n, l]) => [String(l), String(n), h.eur(h.P.paje.prime_naissance * Number(n), 2)]), 'Birth grant 2026, subject to the income test', ['l', 'r', 'r'])}
<p>${h.src('spNaissance', 'Service-public.fr sheet F2550')} is clear on the principle: where a multiple birth is expected, as many grants are paid as there are babies. Each one is the standard ${h.eur(h.P.paje.prime_naissance, 2)} net, uprated on 1 April 2026 by the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}. The timing does not change: the pregnancy is declared before the end of the third month and the grants arrive before the end of the calendar month following the sixth month.</p>
<p>The document that makes the difference is the medical certificate giving the number of babies expected. It goes with the claim, and the CAF multiplies the grant on that basis.</p>
<!--mini:naissanceJumeaux-->

<h2>The ceiling, the only grey area</h2>
<p>For a single baby the rule is known: the unborn child counts as one dependent child. For twins, the sheet does not say whether they count as one or two. The difference matters: for a two-income couple with no other children, the limit moves from ${h.eur(h.M.plafondNaissance(1, true))} to ${h.eur(h.M.plafondNaissance(2, true))} depending on the reading.</p>
${h.table(['2024 income (couple, two incomes)', '“One child” reading', '“Two children” reading'], [45000, 52000, 58000].map((r) => [h.eur(r), h.eur(prime(h, 2, r, 1), 2), h.eur(prime(h, 2, r, 2), 2)]), 'Grants for twins, first children in the household', ['l', 'r', 'r'])}
<p>The first row raises no issue: both readings give two grants. Nor does the last: above ${h.eur(h.M.plafondNaissance(2, true))}, nothing is due. Only the middle row depends on the CAF’s answer. We do not settle a rule we have not found in writing; our mini calculator takes the cautious reading, and we suggest asking your fund if you fall in that band.</p>

<h2>After the birth: one basic allowance per child</h2>
<p>Once the babies are born there is no doubt about the count: two, or three, dependent children. ${h.src('spAbPaje', 'Sheet F2552')} sets aside the one-child-at-a-time rule here: for multiple births, the basic allowance is paid for each child. The rate, full or partial, is read from the row for the new number of children.</p>
<p>Back to our two-income couple on ${h.eur(REV)}. With two dependent children, the full rate stops at ${h.eur(h.M.plafondAbPlein(2, true))}, so each twin brings ${h.eur(abPar(h, 2, REV), 2)}, or ${h.eur(abPar(h, 2, REV) * 2, 2)} a month. Over the ${MOIS} payments from the month after the birth to the month before the third birthday, that is ${h.eur(abPar(h, 2, REV) * 2 * MOIS)} on today’s scale. The rates are set out on the ${h.a('allocation-base-paje', 'Paje basic allowance')} page.</p>

<h2>What multiplies, and what stays put</h2>
<p>To sum up: the grant multiplies by the number of babies, and so does the basic allowance. The income ceiling does not double. It depends on the number of dependent children, with the uncertainty described above before the birth and none afterwards. The reference income does not move either: it is still the household’s ${h.P.paje.revenus_reference} income. A one-income family on ${h.eur(36000)} expecting twins stays under even the lowest ceiling, ${h.eur(h.M.plafondNaissance(1, false))}, and receives ${h.eur(h.M.paje({ enfants: 1, deuxRevenus: false, revenus: 36000, naissances: 2 }).prime, 2)} whichever reading the CAF takes. Families in that position can plan on both grants without waiting for an answer from the fund.</p>

<h2>Other benefits that change with two babies</h2>
<p>Twins can take a family from one child to three overnight. ${h.a('allocations-familiales-2-enfants', 'Family allowances')}, paid from the second child, may then start or rise under their own scale. Later on, the back-to-school allowance will be due for each twin, both in the same age band: the ${h.a('ars-montant-age', 'allowance by age')} page gives the amounts. For the claim and the ceilings in detail, see the ${h.a('prime-naissance-plafond', 'birth grant ceiling')} page and the ${h.a('simulateur-prime-naissance', 'birth grant calculator')}.</p>
`,
  },
});
