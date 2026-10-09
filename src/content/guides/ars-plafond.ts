import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemple fil rouge : couple avec un enfant de 9 ans et un de 3 ans (2 enfants à charge). */
const fil = (h: Helpers, revenus: number) => h.M.ars({ c6_10: 1, c11_14: 0, c15_18: 0, enfants: 2, revenus });
const pl = (h: Helpers, n: number) => h.M.plafondArs(n);

export default defineGuide({
  id: 'ars-plafond',
  group: 'famille',
  order: 110,
  mini: 'arsPlafond',
  miniHref: 'simulateur-ars',
  related: ['simulateur-ars', 'ars-differentielle', 'ars-montant-age', 'allocations-familiales-3-enfants', 'complement-familial'],
  sources: ['spArs', 'instructionPf2026'],
  fr: {
    slug: 'plafond-ars',
    nav: 'Plafond de l’ARS',
    card: 'Le revenu à ne pas dépasser pour l’ARS 2026, selon le nombre d’enfants à charge, et la ligne de l’avis d’impôt à lire.',
    title: 'Allocation de rentrée scolaire 2026 : plafond de revenus',
    description: 'Plafond de l’allocation de rentrée scolaire 2026 : 28 956 € de revenus 2024 pour un enfant, 35 638 € pour deux, 42 320 € pour trois, puis 6 682 € par enfant.',
    h1: 'Le plafond de ressources de l’ARS, enfant par enfant',
    intro: 'Le droit à l’ARS se joue sur une seule ligne : le revenu net catégoriel 2024 du foyer, comparé à un plafond qui grandit avec la famille.',
    resume: (h) => `Pour l’allocation de rentrée scolaire 2026, le plafond de ressources est de ${h.eur(pl(h, 1))} pour un enfant à charge, ${h.eur(pl(h, 2))} pour deux et ${h.eur(pl(h, 3))} pour trois, augmenté de ${h.eur(h.P.ars.plafonds.par_enfant)} par enfant supplémentaire. Le revenu comparé est le revenu net catégoriel de l’année ${h.P.ars.revenus_reference}, celui que la CAF connaît par votre déclaration de revenus, et non le salaire de 2026. Le plafond est le même pour un couple marié, des concubins ou un parent seul : seule compte la taille de la fratrie. Il se lit avec tous les enfants à charge, y compris ceux qui sont trop jeunes pour l’ARS. Un couple avec un enfant de 9 ans et un de 3 ans a donc droit au plafond de deux enfants, soit ${h.eur(pl(h, 2))}, et touche ${h.eur(fil(h, 34000).total, 2)} avec 34 000 € de revenus 2024. Juste au-dessus, une allocation différentielle prend le relais. Ce calcul reste une estimation : la décision appartient à la CAF.`,
    faqs: (h) => [
      { q: 'Quel revenu la CAF compare-t-elle au plafond de l’ARS 2026 ?', a: `Le revenu net catégoriel de ${h.P.ars.revenus_reference} de tout le foyer, c’est-à-dire les revenus déclarés aux impôts après les abattements fiscaux, dont la déduction pour frais professionnels sur les salaires. Ce n’est ni le net payé en 2026 ni le revenu fiscal de référence. Pour la rentrée 2026, ce montant est mis en regard d’un plafond qui commence à ${h.eur(pl(h, 1))} pour un enfant (fiche F1878 de service-public).` },
      { q: 'Parent seul ou couple : le plafond de l’ARS change-t-il ?', a: `Non. Service-public le précise : le plafond est identique quelle que soit la situation de la famille. Un parent isolé avec deux enfants et un couple avec deux enfants partagent la même limite de ${h.eur(pl(h, 2))}. La différence se fait sur les revenus eux-mêmes : un couple additionne ceux des deux conjoints, un parent seul ne déclare que les siens.` },
      { q: 'Combien d’euros de plafond rapporte un quatrième enfant ?', a: `${h.eur(h.P.ars.plafonds.par_enfant)}. À partir du troisième enfant à charge, chaque enfant de plus relève le plafond de ce montant : ${h.eur(pl(h, 4))} pour quatre enfants, ${h.eur(pl(h, 5))} pour cinq. Le saut est plus fort entre un et deux enfants (${h.eur(pl(h, 2) - pl(h, 1))}) et entre deux et trois (${h.eur(pl(h, 3) - pl(h, 2))}). Ce sont les chiffres de la rentrée 2026.` },
      { q: 'Mes revenus ont baissé depuis 2024, est-ce que ça compte pour l’ARS ?', a: `Pas pour la rentrée 2026. Le plafond est comparé aux revenus de ${h.P.ars.revenus_reference}, déclarés aux impôts au printemps 2025. Une baisse de salaire en 2025 ou en 2026 ne sera visible qu’aux rentrées suivantes. Pour qu’aucun retard ne bloque le dossier, service-public rappelle qu’il faut avoir fait sa déclaration de revenus et que la CAF doit disposer des ressources de ${h.P.ars.revenus_reference}.` },
      { q: 'Je dépasse le plafond de 300 €, je perds toute l’ARS ?', a: `Pas forcément. L’allocation différentielle verse le montant plein moins le dépassement. Pour notre famille d’un enfant de 9 ans et d’un enfant de 3 ans, ${h.eur(pl(h, 2) + 300)} de revenus 2024 donnent encore ${h.eur(fil(h, pl(h, 2) + 300).total, 2)}, au lieu de ${h.eur(h.P.ars.montants['6_10'], 2)}. Le droit s’éteint quand le dépassement atteint le montant plein.` },
      { q: 'Je ne suis pas encore allocataire, comment la CAF connaît-elle mes revenus pour l’ARS ?', a: `Elle ne les connaît pas : c’est à vous de les lui donner. Service-public indique qu’une famille qui n’est pas allocataire doit remplir une déclaration de situation pour les prestations familiales et une déclaration de ressources ${h.P.ars.revenus_reference}. La CAF compare ensuite ce revenu au plafond, ${h.eur(pl(h, 1))} pour un enfant à charge à la rentrée 2026. Sans ces deux formulaires, aucun droit ne peut être étudié.` },
    ],
    body: (h) => `
<h2>Le barème des plafonds pour la rentrée 2026</h2>
<p>Le plafond suit le nombre d’enfants à charge, pas le nombre d’enfants qui ouvrent droit à l’ARS. C’est la nuance que beaucoup de familles ratent. Un enfant de 3 ans ne reçoit rien en août, mais sa présence relève la limite de revenus de toute la famille. Le tableau reprend les montants de la ${h.src('spArs', 'fiche F1878 de service-public')}, prolongés au-delà de trois enfants avec le pas officiel de ${h.eur(h.P.ars.plafonds.par_enfant)}.</p>
${h.table(['Enfants à charge', 'Plafond (revenus 2024)', 'Écart avec la ligne du dessus'], [1, 2, 3, 4, 5, 6].map((n) => [String(n), h.eur(pl(h, n)), n === 1 ? '' : h.eur(pl(h, n) - pl(h, n - 1))]), 'Plafonds de ressources de l’ARS, rentrée 2026', ['l', 'r', 'r'])}
<p>Les montants de l’allocation elle-même sont revalorisés chaque 1er avril par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}. Les plafonds, eux, sont publiés pour chaque rentrée. Un plafond dépassé d’un euro ne ferme pas la porte : il fait basculer dans le calcul différentiel.</p>

<h2>Qui compte comme enfant à charge</h2>
<p>Pour la CAF, un enfant est à charge quand vous assurez son entretien de façon effective et permanente, qu’il soit le vôtre ou non. Le bébé, l’enfant en maternelle, l’adolescent de 19 ans encore au foyer : tous peuvent entrer dans le décompte, même s’ils n’ont pas l’âge de l’ARS. Un jeune qui travaille cesse d’être à charge si sa rémunération dépasse 55 % du Smic, règle détaillée sur la page consacrée aux ${h.a('ars-lyceen-apprenti', 'lycéens et apprentis')}.</p>
<p>Prenons un exemple concret. Un couple élève un garçon de 9 ans et une fille de 3 ans. Il a déclaré 34 000 € de revenu net catégoriel pour ${h.P.ars.revenus_reference}. Avec un seul enfant compté, la limite serait de ${h.eur(pl(h, 1))} et la famille la dépasserait de loin. Avec les deux, le plafond monte à ${h.eur(pl(h, 2))} : le garçon reçoit ses ${h.eur(fil(h, 34000).total, 2)} pleins.</p>

<h2>La bonne ligne de l’avis d’imposition</h2>
<p>Le revenu net catégoriel n’est pas imprimé tel quel en haut de l’avis d’impôt. Il s’agit de vos revenus après les abattements fiscaux propres à chaque catégorie : pour un salarié, le salaire imposable diminué de la déduction de ${h.pct(h.P.apl.abattement_frais_pro, 0)} pour frais professionnels (ou des frais réels). Un couple de salariés qui déclare 37 800 € de salaires imposables arrive ainsi autour de 34 000 €. Le revenu fiscal de référence, souvent cité, peut s’en écarter ; c’est donc une mauvaise base pour tester le plafond.</p>
<p>Dans la pratique, si vous percevez déjà des prestations, la CAF dispose de ces revenus et vous n’avez rien à saisir. Les familles qui ne sont pas encore allocataires doivent remplir une déclaration de situation et une déclaration de ressources ${h.P.ars.revenus_reference}, selon service-public.</p>

<h2>Trois familles, trois positions face au plafond</h2>
<h3>Loin en dessous</h3>
<p>Une mère seule avec une fille de 12 ans et 21 000 € de revenus 2024 reste ${h.eur(pl(h, 1) - 21000)} sous la limite. Elle reçoit ${h.eur(h.M.ars({ c6_10: 0, c11_14: 1, c15_18: 0, enfants: 1, revenus: 21000 }).total, 2)}, sans calcul particulier.</p>
<h3>À quelques centaines d’euros</h3>
<p>Le couple de notre exemple voit ses revenus monter à ${h.eur(pl(h, 2) + 250)}. Il dépasse de 250 €. L’ARS du garçon descend à ${h.eur(fil(h, pl(h, 2) + 250).total, 2)}. La page ${h.a('ars-differentielle', 'allocation différentielle')} montre jusqu’où ce mécanisme tient.</p>
<h3>Hors de portée</h3>
<p>Au-delà de ${h.eur(pl(h, 2) + h.P.ars.montants['6_10'])} de revenus pour ce couple, le dépassement absorbe la totalité de l’aide. Il faudrait un troisième enfant à charge, et un plafond de ${h.eur(pl(h, 3))}, pour retrouver un droit.</p>
<!--mini:arsPlafond-->

<h2>Les familles nombreuses gagnent deux fois</h2>
<p>Dans une famille de trois enfants d’âge scolaire, chaque enfant apporte son montant et le plafond grimpe. Trois enfants de 7, 12 et 16 ans représentent ${h.eur(h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: 0 }).plein, 2)} d’ARS au total, sous un plafond de ${h.eur(pl(h, 3))}. Pour ces familles, l’ARS vient souvent avec les ${h.a('allocations-familiales-3-enfants', 'allocations familiales de trois enfants')} et parfois le ${h.a('complement-familial', 'complément familial')}, qui ont leurs propres plafonds. Une famille peut être sous l’un et au-dessus de l’autre : chaque prestation se teste à part.</p>
<h2>Le plafond ne fait pas tout</h2>
<p>Passer sous la limite de revenus ouvre la porte, sans garantir le versement. L’enfant doit aussi être né entre le ${h.date(h.P.ars.naissance_min)} et le ${h.date(h.P.ars.naissance_max)}, et être scolarisé ou inscrit au Cned à la rentrée. Une famille qui instruit son enfant à la maison n’a pas droit à l’ARS, même avec des revenus très modestes. À l’inverse, un enfant de moins de 6 ans qui entre en CP peut en bénéficier, à condition que la CAF reçoive le certificat de scolarité. Les montants versés selon l’âge sont détaillés sur la page ${h.a('ars-montant-age', 'ARS par tranche d’âge')}.</p>
<p>Le ${h.a('simulateur-ars', 'simulateur de l’ARS')} combine le plafond, les tranches d’âge et le calcul différentiel en une seule saisie.</p>
`,
  },
  en: {
    slug: 'ars-income-ceiling',
    nav: 'Back-to-school allowance ceiling',
    card: 'The 2026 income limit for the French back-to-school allowance, by number of dependent children, and the tax figure to use.',
    title: 'Back-to-School Allowance 2026: Income Ceiling by Family',
    description: 'Back-to-school allowance income ceiling 2026: €28,956 of 2024 income for one child, €35,638 for two, €42,320 for three, then €6,682 more for each extra child.',
    h1: 'The back-to-school allowance income ceiling, child by child',
    intro: 'Your right to the allowance turns on one figure: the household’s 2024 net taxable income, set against a ceiling that rises with family size.',
    resume: (h) => `For the 2026 allocation de rentrée scolaire (ARS, the back-to-school allowance paid by the CAF family benefits office), the income ceiling is ${h.eur(pl(h, 1))} for one dependent child, ${h.eur(pl(h, 2))} for two and ${h.eur(pl(h, 3))} for three, plus ${h.eur(h.P.ars.plafonds.par_enfant)} for each further child. The income tested is the household’s revenu net catégoriel for ${h.P.ars.revenus_reference}, meaning taxable income after the standard deductions, taken from the French tax return, not your pay in 2026. Married, in a civil partnership, cohabiting or bringing up children alone: the ceiling is the same, only the number of children changes it. Every dependent child counts, including those too young for the allowance. A couple with a 9-year-old and a 3-year-old therefore gets the two-child ceiling of ${h.eur(pl(h, 2))} and receives ${h.eur(fil(h, 34000).total, 2)} on €34,000 of 2024 income. Just above the line, a reduced differential allowance takes over. This is an estimate; the CAF makes the decision.`,
    faqs: (h) => [
      { q: 'Which income does the CAF check against the back-to-school allowance ceiling?', a: `The whole household’s revenu net catégoriel for ${h.P.ars.revenus_reference}: income declared to the French tax office after the standard deductions, such as the allowance for work expenses on salaries. It is neither your 2026 take-home pay nor the revenu fiscal de référence shown on the tax notice. For autumn 2026 it is compared with a ceiling starting at ${h.eur(pl(h, 1))} for one child (service-public.fr sheet F1878).` },
      { q: 'Is the ARS ceiling higher for a single parent than for a couple?', a: `No. Service-public.fr states that the ceiling is the same whatever the family situation. A lone parent with two children and a couple with two children share the same limit of ${h.eur(pl(h, 2))}. The difference lies in the income itself: a couple adds up both partners’ earnings, while a single parent declares only their own.` },
      { q: 'How much does a fourth child add to the back-to-school allowance ceiling?', a: `${h.eur(h.P.ars.plafonds.par_enfant)}. From the third dependent child onwards, each extra child raises the ceiling by that amount: ${h.eur(pl(h, 4))} for four children, ${h.eur(pl(h, 5))} for five. The jumps are bigger between one and two children (${h.eur(pl(h, 2) - pl(h, 1))}) and between two and three (${h.eur(pl(h, 3) - pl(h, 2))}). These are the autumn 2026 figures.` },
      { q: 'My income has dropped since 2024: does that help with the back-to-school allowance?', a: `Not for autumn 2026. The ceiling is compared with ${h.P.ars.revenus_reference} income, declared to the tax office in spring 2025. A pay cut in 2025 or 2026 only shows up in later years. To avoid a stalled file, service-public.fr reminds families that their tax return must have been filed and that the CAF needs their ${h.P.ars.revenus_reference} income.` },
      { q: 'I am €300 over the ARS ceiling: do I lose everything?', a: `Not necessarily. The differential allowance pays the full amount minus the excess. For our family with a 9-year-old and a 3-year-old, ${h.eur(pl(h, 2) + 300)} of 2024 income still brings ${h.eur(fil(h, pl(h, 2) + 300).total, 2)}, instead of ${h.eur(h.P.ars.montants['6_10'], 2)}. Entitlement ends once the excess equals the full amount.` },
      { q: 'I have never claimed from the CAF: how does it learn my income for the back-to-school allowance?', a: `It does not, until you tell it. Service-public.fr says a family that is not yet on the CAF’s books must send a statement of situation for family benefits and a declaration of ${h.P.ars.revenus_reference} income. The CAF then compares that income with the ceiling, ${h.eur(pl(h, 1))} for one dependent child in autumn 2026. Without those two forms, no entitlement can be assessed at all.` },
    ],
    body: (h) => `
<h2>The ceilings for the 2026 school year</h2>
<p>The ceiling follows the number of dependent children, not the number of children who qualify for the allowance. Many families miss that. A 3-year-old receives nothing in August, but still raises the whole family’s income limit. The table uses the figures from ${h.src('spArs', 'service-public.fr sheet F1878')}, extended beyond three children with the official step of ${h.eur(h.P.ars.plafonds.par_enfant)}.</p>
${h.table(['Dependent children', 'Ceiling (2024 income)', 'Increase on the row above'], [1, 2, 3, 4, 5, 6].map((n) => [String(n), h.eur(pl(h, n)), n === 1 ? '' : h.eur(pl(h, n) - pl(h, n - 1))]), 'Back-to-school allowance income ceilings, autumn 2026', ['l', 'r', 'r'])}
<p>The allowance amounts are uprated every 1 April under the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}; the ceilings are published for each school year. Going one euro over does not shut you out: it moves you onto the differential calculation.</p>

<h2>Who counts as a dependent child</h2>
<p>For the CAF, a child is dependent when you genuinely and permanently support them, whether or not you are the parent. A baby, a nursery-age child, a 19-year-old still living at home: all can be counted, even if they are outside the allowance’s age range. A young person who works stops being dependent once their pay exceeds 55% of the Smic (the French minimum wage), as the page on ${h.a('ars-lyceen-apprenti', 'older pupils and apprentices')} explains.</p>
<p>Take a real case. A couple are raising a boy of 9 and a girl of 3, and declared €34,000 of net taxable income for ${h.P.ars.revenus_reference}. Counting one child only, the limit would be ${h.eur(pl(h, 1))} and they would be well over it. Counting both, the ceiling rises to ${h.eur(pl(h, 2))} and the boy gets his full ${h.eur(fil(h, 34000).total, 2)}.</p>

<h2>Finding the right figure on your tax notice</h2>
<p>The revenu net catégoriel is not printed as such at the top of the avis d’imposition (French tax notice). It is your income after the deductions specific to each type of income: for an employee, taxable salary less the ${h.pct(h.P.apl.abattement_frais_pro, 0)} deduction for work expenses (or actual expenses claimed). A couple with €37,800 of taxable salaries thus ends up around €34,000. The revenu fiscal de référence, the figure most people quote, can differ, so it is the wrong yardstick here.</p>
<p>If you already receive benefits, the CAF has this income and you enter nothing. Families who are new to the CAF must send a statement of their situation and a declaration of ${h.P.ars.revenus_reference} income, according to service-public.fr.</p>

<h2>Three households, three positions against the ceiling</h2>
<h3>Comfortably below</h3>
<p>A single mother with a 12-year-old daughter and €21,000 of 2024 income sits ${h.eur(pl(h, 1) - 21000)} below the limit. She receives ${h.eur(h.M.ars({ c6_10: 0, c11_14: 1, c15_18: 0, enfants: 1, revenus: 21000 }).total, 2)}, with no special calculation.</p>
<h3>A few hundred euros over</h3>
<p>Our couple’s income rises to ${h.eur(pl(h, 2) + 250)}, so they are €250 over. The boy’s allowance falls to ${h.eur(fil(h, pl(h, 2) + 250).total, 2)}. The ${h.a('ars-differentielle', 'differential allowance')} page shows how far this cushion stretches.</p>
<h3>Out of reach</h3>
<p>Above ${h.eur(pl(h, 2) + h.P.ars.montants['6_10'])} of income for this couple, the excess swallows the whole allowance. Only a third dependent child, with a ceiling of ${h.eur(pl(h, 3))}, would bring entitlement back.</p>
<!--mini:arsPlafond-->

<h2>Large families gain twice</h2>
<p>With three school-age children, each brings its own amount and the ceiling climbs as well. Children of 7, 12 and 16 add up to ${h.eur(h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: 0 }).plein, 2)} of allowance, under a ceiling of ${h.eur(pl(h, 3))}. These families often also receive ${h.a('allocations-familiales-3-enfants', 'family allowances for three children')} and sometimes the ${h.a('complement-familial', 'family supplement')}, each with its own ceiling. You can be under one and over another, so each benefit is tested separately.</p>
<h2>The ceiling is not the whole story</h2>
<p>Being under the income limit opens the door but does not guarantee payment. The child must also be born between ${h.date(h.P.ars.naissance_min)} and ${h.date(h.P.ars.naissance_max)} and be enrolled at school or with Cned (the state distance-learning service) when term starts. A family that educates its child at home receives no allowance, however low its income. On the other hand, a child under 6 who starts CP (the first year of primary school) can qualify, provided the CAF receives the school enrolment certificate. Amounts by age are set out on the ${h.a('ars-montant-age', 'allowance by age band')} page.</p>
<p>The ${h.a('simulateur-ars', 'back-to-school allowance calculator')} combines the ceiling, the age bands and the differential sum in one go.</p>
`,
  },
});
