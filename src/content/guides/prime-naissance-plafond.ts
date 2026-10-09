import { defineGuide, type Helpers } from '../../lib/guide-types';

const pn = (h: Helpers, n: number, deux: boolean) => h.M.plafondNaissance(n, deux);
const seuil = (h: Helpers) => h.P.paje.seuil_deuxieme_revenu;
/** Couple fil rouge : premier enfant, 44 000 € de revenus 2024 ; le second conjoint a gagné 6 000 € ou 6 500 €. */
const REV = 44000;
const avec = (h: Helpers, deux: boolean) => h.M.paje({ enfants: 1, deuxRevenus: deux, revenus: REV });

export default defineGuide({
  id: 'prime-naissance-plafond',
  group: 'famille',
  order: 210,
  mini: 'naissancePlafond',
  miniHref: 'simulateur-prime-naissance',
  related: ['simulateur-prime-naissance', 'allocation-base-paje', 'prime-naissance-jumeaux', 'complement-familial', 'allocations-familiales-2-enfants'],
  sources: ['spNaissance', 'spAbPaje', 'instructionPf2026'],
  fr: {
    slug: 'plafond-prime-naissance',
    nav: 'Plafond de la prime de naissance',
    card: 'Les plafonds de revenus de la prime de naissance 2026, la règle des deux revenus et le cas du parent isolé.',
    title: 'Prime de naissance 2026 : plafond de ressources CAF',
    description: 'Plafond de la prime de naissance 2026 : 37 118 € de revenus 2024 pour un couple à un revenu, 49 054 € à deux revenus ou seul, premier enfant. Règle des 6 306 €.',
    h1: 'Le plafond de la prime de naissance : quelle colonne, quelle ligne',
    intro: 'Le barème de la prime de naissance se lit comme un tableau à double entrée : le nombre d’enfants à charge d’un côté, le nombre de revenus du foyer de l’autre.',
    resume: (h) => `Pour toucher la prime de naissance de ${h.eur(h.P.paje.prime_naissance, 2)} en 2026, le revenu net catégoriel ${h.P.paje.revenus_reference} du foyer ne doit pas dépasser ${h.eur(pn(h, 1, false))} pour un couple à un seul revenu attendant son premier enfant, ou ${h.eur(pn(h, 1, true))} pour un couple à deux revenus. Le parent isolé bénéficie du même plafond que le couple à deux revenus. Avec un enfant déjà à charge, les limites passent à ${h.eur(pn(h, 2, false))} et ${h.eur(pn(h, 2, true))} ; avec deux, à ${h.eur(pn(h, 3, false))} et ${h.eur(pn(h, 3, true))}, puis ${h.eur(h.P.paje.plafonds_naissance.par_enfant)} de plus par enfant. Le bébé attendu compte déjà pour un enfant. Un couple a deux revenus quand chacun a gagné au moins ${h.eur(seuil(h))} en ${h.P.paje.revenus_reference} par son activité professionnelle ou des indemnités journalières d’accident du travail ou de maladie professionnelle. Cette règle déplace la limite de ${h.eur(pn(h, 1, true) - pn(h, 1, false))} pour un premier enfant. Le plafond est un couperet : aucun montant réduit n’existe au-dessus. Ce sont des estimations, que seule la CAF peut confirmer.`,
    faqs: (h) => [
      { q: 'Mon conjoint a gagné 6 000 € en 2024, sommes-nous un couple à deux revenus pour la prime de naissance ?', a: `Non. Il faut que chacun des deux ait perçu au moins ${h.eur(seuil(h))} en ${h.P.paje.revenus_reference}, au titre d’une activité professionnelle ou d’indemnités journalières d’accident du travail ou de maladie professionnelle (fiche F2550). Avec 6 000 €, votre foyer reste sur le barème à un revenu : ${h.eur(pn(h, 1, false))} pour un premier enfant au lieu de ${h.eur(pn(h, 1, true))}.` },
      { q: 'Je suis enceinte et je vis seule, quel plafond pour la prime de naissance ?', a: `Celui du couple à deux revenus : ${h.eur(pn(h, 1, true))} de revenus ${h.P.paje.revenus_reference} pour un premier enfant, ${h.eur(pn(h, 2, true))} si vous avez déjà un enfant à charge. Service-public le présente dans un tableau propre au parent isolé, aux montants identiques. Votre situation est appréciée au premier jour du mois civil qui suit le 5e mois de grossesse, soit au début du 7e mois.` },
      { q: 'Nous nous sommes installés ensemble au 6e mois de grossesse, quel barème la CAF prend-elle ?', a: `Celui du couple. La fiche F2550 de service-public fixe la date d’appréciation de la situation familiale au premier jour du mois civil suivant le 5e mois de grossesse. Un couple formé avant cette date est examiné en couple, avec les revenus ${h.P.paje.revenus_reference} des deux. Selon que chacun a gagné ${h.eur(seuil(h))} ou non, le plafond d’un premier enfant sera ${h.eur(pn(h, 1, true))} ou ${h.eur(pn(h, 1, false))}.` },
      { q: 'À combien s’élève le plafond de la prime de naissance pour un quatrième enfant ?', a: `${h.eur(pn(h, 4, false))} pour un couple à un revenu et ${h.eur(pn(h, 4, true))} pour un couple à deux revenus ou un parent isolé, en comptant le bébé attendu comme quatrième enfant à charge. Le barème 2026 ajoute ${h.eur(h.P.paje.plafonds_naissance.par_enfant)} par enfant au-delà du troisième, dans les deux colonnes. La prime reste de ${h.eur(h.P.paje.prime_naissance, 2)}.` },
      { q: 'Mes revenus de 2026 sont plus bas que ceux de 2024, la CAF peut-elle les prendre ?', a: `Pas pour le plafond de la prime. Pour 2026, c’est le revenu net catégoriel ${h.P.paje.revenus_reference} qui sert de référence, selon les fiches F2550 et F2552 de service-public. Une baisse récente de salaire ne fait donc pas passer sous le plafond de ${h.eur(pn(h, 1, false))} ou ${h.eur(pn(h, 1, true))}. Elle sera prise en compte pour les droits calculés sur l’année de revenus correspondante.` },
      { q: 'Nous venons d’arriver en France, la prime de naissance est-elle possible ?', a: `Le plafond n’est pas la seule condition. La fiche F2550 de service-public exige de séjourner en France plus de neuf mois, consécutifs ou non, au cours de l’année civile de versement des prestations. Un foyer arrivé en cours d’année doit donc vérifier ce point avant même de comparer ses revenus ${h.P.paje.revenus_reference} au plafond de ${h.eur(pn(h, 1, false))} ou ${h.eur(pn(h, 1, true))}. La CAF examine la résidence au moment de la demande.` },
    ],
    body: (h) => `
<h2>Le barème complet</h2>
${h.table(['Enfants à charge (bébé compris)', 'Couple, un revenu', 'Couple, deux revenus ou parent isolé'], [1, 2, 3, 4, 5].map((n) => [String(n), h.eur(pn(h, n, false)), h.eur(pn(h, n, true))]), `Plafonds de la prime de naissance 2026, revenu net catégoriel ${h.P.paje.revenus_reference}`, ['l', 'r', 'r'])}
<p>Ces chiffres sont ceux de la ${h.src('spNaissance', 'fiche F2550 de service-public')}, vérifiée le 1er avril 2026, prolongés au-delà de trois enfants avec le pas officiel de ${h.eur(h.P.paje.plafonds_naissance.par_enfant)}. L’écart entre les deux colonnes est constant : ${h.eur(pn(h, 1, true) - pn(h, 1, false))} quel que soit le nombre d’enfants.</p>

<h2>La règle des deux revenus, au cas par cas</h2>
<p>Sophie et Karim attendent leur premier enfant. Leur revenu net catégoriel ${h.P.paje.revenus_reference} atteint ${h.eur(REV)}. Presque tout vient du salaire de Karim ; Sophie, en reprise d’études, a travaillé quelques mois. Si elle a gagné 6 000 €, le foyer reste sur la colonne « un revenu », plafond ${h.eur(pn(h, 1, false))} : la prime n’est pas due (${h.eur(avec(h, false).prime, 2)}). Si elle a gagné 6 500 €, elle franchit le seuil de ${h.eur(seuil(h))}, le foyer passe à ${h.eur(pn(h, 1, true))} et reçoit ${h.eur(avec(h, true).prime, 2)}.</p>
<p>Cinq cents euros de salaire de Sophie valent donc, ici, une prime de naissance entière. Le seuil vise les revenus d’activité et les indemnités journalières d’accident du travail ou de maladie professionnelle ; une allocation chômage n’est pas citée par la fiche, et nous ne pouvons pas dire comment la CAF la traiterait.</p>
<!--mini:naissancePlafond-->

<h2>Le parent isolé, mieux traité qu’on ne le croit</h2>
<p>Une mère seule n’a qu’un revenu, mais la CAF ne la place pas dans la colonne du couple à un revenu. Les fiches F2550 et ${h.src('spAbPaje', 'F2552')} lui donnent les plafonds du couple à deux revenus. Avec ${h.eur(45000)} de revenus ${h.P.paje.revenus_reference} et un premier enfant attendu, elle reste sous la limite de ${h.eur(pn(h, 1, true))} et touche ${h.eur(h.M.paje({ enfants: 1, deuxRevenus: true, revenus: 45000 }).prime, 2)}, quand un couple au même revenu sans second salaire en serait privé.</p>

<h2>Le bon moment pour compter</h2>
<h3>Le bébé à naître est déjà un enfant à charge</h3>
<p>Pour la prime, la fiche F2550 précise que l’enfant à naître compte pour un enfant. Un couple sans enfant se place donc sur la première ligne, et un couple qui a déjà un aîné sur la deuxième. C’est l’erreur la plus fréquente dans les simulations faites à la main : oublier le bébé fait lire une ligne trop basse.</p>
<h3>La situation au début du 7e mois</h3>
<p>Mariage, séparation, mise en couple : la situation familiale retenue est celle du premier jour du mois civil qui suit le 5e mois de grossesse. La demande est étudiée au cours du 6e mois, à condition que la grossesse ait été déclarée avant la fin du 3e mois. La prime est versée avant la fin du mois civil qui suit le 6e mois.</p>

<h2>La demande, en pratique</h2>
<p>La prime se demande en ligne, sur le site de la CAF, que l’on soit déjà allocataire ou non ; la MSA a son propre formulaire pour le régime agricole. Dans tous les cas, la grossesse doit avoir été déclarée. La CAF compare alors le revenu net catégoriel ${h.P.paje.revenus_reference} qu’elle connaît, ou celui que vous lui déclarez si vous êtes nouveau, au plafond de votre ligne. Un foyer qui n’a jamais perçu de prestation a intérêt à vérifier le chiffre sur son avis d’impôt : c’est lui qui décidera, sans rattrapage possible par un calcul dégressif.</p>

<h2>Pas de zone de transition</h2>
<p>Contrairement à l’ARS ou aux allocations familiales, la prime de naissance n’a pas de mécanisme différentiel. Un euro au-dessus de ${h.eur(pn(h, 1, false))} suffit, pour un couple à un revenu attendant son premier enfant, à perdre ${h.eur(h.P.paje.prime_naissance, 2)}. Les autres prestations familiales gardent leurs propres plafonds : le ${h.a('complement-familial', 'complément familial')} ou les ${h.a('allocations-familiales-2-enfants', 'allocations familiales')} ne suivent pas ce barème.</p>
<p>Le même tableau sert, en partie, pour l’${h.a('allocation-base-paje', 'allocation de base de la Paje')} : son taux partiel s’arrête exactement aux plafonds de la prime. Pour une grossesse multiple, voyez la page ${h.a('prime-naissance-jumeaux', 'prime de naissance pour des jumeaux')}. Le ${h.a('simulateur-prime-naissance', 'simulateur de la prime de naissance')} fait le test complet.</p>
`,
  },
  en: {
    slug: 'birth-grant-income-ceiling',
    nav: 'Birth grant income ceiling',
    card: 'The 2026 income ceilings for the French birth grant, the two-income rule and how single parents are treated.',
    title: 'Birth Grant 2026: CAF Income Ceiling and Two-Income Rule',
    description: 'Birth grant income ceiling 2026: €37,118 of 2024 income for a one-income couple, €49,054 for two incomes or a single parent, first child. The €6,306 rule.',
    h1: 'The birth grant ceiling: which column, which row',
    intro: 'The birth grant scale reads like a two-way table: the number of dependent children on one side, the number of earners in the household on the other.',
    resume: (h) => `To receive the ${h.eur(h.P.paje.prime_naissance, 2)} prime à la naissance (birth grant, part of the Paje early-childhood benefit paid by the CAF family benefits office) in 2026, a household’s ${h.P.paje.revenus_reference} revenu net catégoriel, broadly taxable income after the standard deductions, must not exceed ${h.eur(pn(h, 1, false))} for a one-income couple expecting a first child, or ${h.eur(pn(h, 1, true))} for a two-income couple. Single parents get the same ceiling as two-income couples. With one child already dependent, the limits become ${h.eur(pn(h, 2, false))} and ${h.eur(pn(h, 2, true))}; with two, ${h.eur(pn(h, 3, false))} and ${h.eur(pn(h, 3, true))}, then ${h.eur(h.P.paje.plafonds_naissance.par_enfant)} more per child. The expected baby already counts as one child. A couple has two incomes when each partner earned at least ${h.eur(seuil(h))} in ${h.P.paje.revenus_reference} from work or from daily benefits for a work accident or occupational disease. That rule moves the limit by ${h.eur(pn(h, 1, true) - pn(h, 1, false))} for a first child. The ceiling is a cliff edge: there is no reduced amount above it. These are estimates that only the CAF can confirm.`,
    faqs: (h) => [
      { q: 'My partner earned €6,000 in 2024: are we a two-income couple for the birth grant?', a: `No. Each partner must have received at least ${h.eur(seuil(h))} in ${h.P.paje.revenus_reference} from work or from daily benefits for a work accident or occupational disease (sheet F2550). With €6,000, your household stays on the one-income scale: ${h.eur(pn(h, 1, false))} for a first child instead of ${h.eur(pn(h, 1, true))}.` },
      { q: 'I am pregnant and live alone: which birth grant ceiling applies?', a: `The two-income couple’s: ${h.eur(pn(h, 1, true))} of ${h.P.paje.revenus_reference} income for a first child, ${h.eur(pn(h, 2, true))} if you already have one dependent child. Service-public.fr sets this out in a separate single-parent table with identical figures. Your situation is assessed on the first day of the calendar month following the fifth month of pregnancy, in other words at the start of the seventh month.` },
      { q: 'We moved in together in the sixth month of pregnancy: which scale does the CAF use?', a: `The couple scale. Service-public.fr sheet F2550 assesses family situation on the first day of the calendar month following the fifth month of pregnancy. A couple formed before that date is assessed as a couple, on both partners’ ${h.P.paje.revenus_reference} income. Depending on whether each earned ${h.eur(seuil(h))}, the first-child ceiling is ${h.eur(pn(h, 1, true))} or ${h.eur(pn(h, 1, false))}.` },
      { q: 'What is the birth grant ceiling for a fourth child?', a: `${h.eur(pn(h, 4, false))} for a one-income couple and ${h.eur(pn(h, 4, true))} for a two-income couple or single parent, counting the expected baby as the fourth dependent child. The 2026 scale adds ${h.eur(h.P.paje.plafonds_naissance.par_enfant)} per child beyond the third, in both columns. The grant itself stays at ${h.eur(h.P.paje.prime_naissance, 2)}.` },
      { q: 'Our 2026 income is lower than in 2024: can the CAF use the newer figure?', a: `Not for the grant ceiling. For 2026, the ${h.P.paje.revenus_reference} revenu net catégoriel is the reference, according to service-public.fr sheets F2550 and F2552. A recent pay cut therefore does not bring you under the ${h.eur(pn(h, 1, false))} or ${h.eur(pn(h, 1, true))} ceiling. It will count towards entitlements based on the matching income year.` },
      { q: 'We have just moved to France: can we still get the birth grant?', a: `The ceiling is not the only test. Service-public.fr sheet F2550 requires living in France for more than nine months, consecutive or not, during the calendar year in which benefits are paid. A household that arrived during the year should check that first, before even comparing its ${h.P.paje.revenus_reference} income with the ${h.eur(pn(h, 1, false))} or ${h.eur(pn(h, 1, true))} ceiling. The CAF looks at residence when it examines the claim.` },
    ],
    body: (h) => `
<h2>The full scale</h2>
${h.table(['Dependent children (baby included)', 'Couple, one income', 'Couple, two incomes, or single parent'], [1, 2, 3, 4, 5].map((n) => [String(n), h.eur(pn(h, n, false)), h.eur(pn(h, n, true))]), `Birth grant ceilings 2026, ${h.P.paje.revenus_reference} net taxable income`, ['l', 'r', 'r'])}
<p>These figures come from ${h.src('spNaissance', 'service-public.fr sheet F2550')}, checked on 1 April 2026, extended beyond three children with the official step of ${h.eur(h.P.paje.plafonds_naissance.par_enfant)}. The gap between the two columns never changes: ${h.eur(pn(h, 1, true) - pn(h, 1, false))} whatever the number of children.</p>

<h2>The two-income rule in practice</h2>
<p>Sophie and Karim are expecting their first child. Their ${h.P.paje.revenus_reference} net taxable income is ${h.eur(REV)}, almost all of it Karim’s salary; Sophie went back to studying and worked a few months. If she earned €6,000, the household stays in the one-income column with a ceiling of ${h.eur(pn(h, 1, false))}, and no grant is due (${h.eur(avec(h, false).prime, 2)}). If she earned €6,500, she clears the ${h.eur(seuil(h))} threshold, the household moves to ${h.eur(pn(h, 1, true))} and receives ${h.eur(avec(h, true).prime, 2)}.</p>
<p>Five hundred euros of Sophie’s pay are worth a whole birth grant here. The threshold covers earnings from work and daily benefits for a work accident or occupational disease; the sheet does not mention unemployment benefit, and we cannot say how the CAF would treat it.</p>
<!--mini:naissancePlafond-->

<h2>Single parents fare better than people expect</h2>
<p>A mother on her own has one income, yet the CAF does not put her in the one-income couple column. Sheets F2550 and ${h.src('spAbPaje', 'F2552')} give her the two-income ceilings. With ${h.eur(45000)} of ${h.P.paje.revenus_reference} income and a first baby on the way, she stays under the ${h.eur(pn(h, 1, true))} limit and receives ${h.eur(h.M.paje({ enfants: 1, deuxRevenus: true, revenus: 45000 }).prime, 2)}, whereas a couple on the same income with no second earner would miss out.</p>

<h2>When the count is made</h2>
<h3>The unborn baby is already a dependent child</h3>
<p>For the grant, sheet F2550 states that the unborn child counts as one child. A couple with no children uses the first row, and a couple with one older child the second. Forgetting the baby is the most common mistake in back-of-the-envelope checks: it makes you read a row that is too low.</p>
<h3>The situation at the start of the seventh month</h3>
<p>Marriage, separation, moving in together: the family situation used is the one on the first day of the calendar month following the fifth month of pregnancy. The claim is examined during the sixth month, provided the pregnancy was declared before the end of the third month. The grant is paid before the end of the calendar month following the sixth month.</p>

<h2>Making the claim</h2>
<p>The grant is claimed online on the CAF website, whether or not you already receive benefits; the MSA, which covers the farming sector, has its own form. Either way, the pregnancy must have been declared. The CAF then compares the ${h.P.paje.revenus_reference} net taxable income it holds, or the figure you give it if you are new, with the ceiling for your row. A household that has never claimed anything should check the figure on its avis d’imposition (tax notice): it alone decides the outcome, with no tapering to soften a near miss.</p>

<h2>No transition band</h2>
<p>Unlike the back-to-school allowance or family allowances, the birth grant has no differential mechanism. One euro over ${h.eur(pn(h, 1, false))} is enough, for a one-income couple expecting a first child, to lose ${h.eur(h.P.paje.prime_naissance, 2)}. Other family benefits keep their own ceilings: the ${h.a('complement-familial', 'family supplement')} and ${h.a('allocations-familiales-2-enfants', 'family allowances')} do not follow this scale.</p>
<p>The same table partly serves the ${h.a('allocation-base-paje', 'Paje basic allowance')}: its partial rate stops exactly at the grant ceilings. For a multiple pregnancy, see the page on the ${h.a('prime-naissance-jumeaux', 'birth grant for twins')}. The ${h.a('simulateur-prime-naissance', 'birth grant calculator')} runs the full test.</p>
`,
  },
});
