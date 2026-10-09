import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Famille fil rouge : deux enfants à charge, 10 et 13 ans. */
const duo = (h: Helpers, revenus: number) => h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 0, enfants: 2, revenus });
const pl2 = (h: Helpers) => h.M.plafondArs(2);
const plein2 = (h: Helpers) => duo(h, 0).plein;
/** Lycéen seul à charge. */
const solo = (h: Helpers, revenus: number) => h.M.ars({ c6_10: 0, c11_14: 0, c15_18: 1, enfants: 1, revenus });

export default defineGuide({
  id: 'ars-differentielle',
  group: 'famille',
  order: 130,
  mini: 'arsDifferentielle',
  miniHref: 'simulateur-ars',
  related: ['simulateur-ars', 'ars-plafond', 'ars-montant-age', 'complement-degressif', 'ars-lyceen-apprenti'],
  sources: ['spArs', 'instructionPf2026'],
  fr: {
    slug: 'ars-differentielle',
    nav: 'ARS différentielle',
    card: 'Quand les revenus dépassent un peu le plafond : le calcul de l’allocation de rentrée réduite, euro pour euro.',
    title: 'Allocation de rentrée scolaire 2026 : ARS différentielle',
    description: 'ARS différentielle 2026 : au-dessus du plafond de 28 956 € (un enfant), la CAF verse le montant plein moins le dépassement. Calcul pas à pas et seuil de sortie.',
    h1: 'L’allocation différentielle : l’ARS quand on dépasse un peu le plafond',
    intro: 'Dépasser le plafond de l’ARS de quelques centaines d’euros ne fait pas tout perdre : la CAF retire le dépassement du montant plein.',
    resume: (h) => `L’allocation différentielle de rentrée scolaire se calcule en une soustraction : montant plein de l’ARS moins le dépassement du plafond. Une famille de deux enfants de 10 et 13 ans, dont l’ARS pleine vaut ${h.eur(plein2(h), 2)}, a un plafond de ${h.eur(pl2(h))} pour la rentrée 2026. Avec ${h.eur(pl2(h) + 400)} de revenu net catégoriel 2024, elle dépasse de 400 € et reçoit ${h.eur(duo(h, pl2(h) + 400).total, 2)}. Chaque euro de revenu au-dessus du plafond retire donc un euro d’allocation, jusqu’à extinction : pour cette famille, plus rien n’est versé à partir de ${h.eur(pl2(h) + plein2(h))}. Service-public parle d’une allocation dégressive en cas de léger dépassement ; elle remplace l’effet de seuil qui ferait tout perdre pour un euro de trop. Le dépassement se mesure sur le revenu annuel du foyer et se retire du total de tous les enfants, pas de chacun. Notre calcul ne retient pas un reliquat inférieur à ${h.eur(h.P.ars.minimum_verse)}. Il s’agit d’une estimation, la CAF calcule le droit réel.`,
    faqs: (h) => [
      { q: 'Comment la CAF calcule-t-elle l’ARS différentielle ?', a: `Elle additionne d’abord les montants pleins de tous les enfants, puis retire l’écart entre vos revenus 2024 et le plafond. Exemple pour un lycéen seul à charge : ${h.eur(h.P.ars.montants['15_18'], 2)} moins un dépassement de 300 € donnent ${h.eur(solo(h, h.P.ars.plafonds.un + 300).total, 2)}. La fiche F1878 de service-public présente ce mécanisme comme une allocation dégressive calculée en fonction des revenus.` },
      { q: 'À partir de quel revenu ne touche-t-on plus du tout l’ARS ?', a: `Quand le dépassement égale le montant plein. Pour un enfant de 15 à 18 ans seul à charge, la limite de la rentrée 2026 tombe à ${h.eur(h.P.ars.plafonds.un + h.P.ars.montants['15_18'])} de revenus 2024 : le plafond de ${h.eur(h.P.ars.plafonds.un)} plus ${h.eur(h.P.ars.montants['15_18'], 2)}. Avec deux enfants de 10 et 13 ans, elle se situe à ${h.eur(pl2(h) + plein2(h))}. Plus la fratrie est grande, plus la marge s’allonge.` },
      { q: 'Avec trois enfants scolarisés, le dépassement est-il retiré trois fois ?', a: `Non, une seule fois, sur le total. Trois enfants de 8, 12 et 16 ans représentent ${h.eur(h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: 0 }).plein, 2)}. Un dépassement de 1 000 € du plafond de ${h.eur(h.M.plafondArs(3))} laisse ${h.eur(h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: h.M.plafondArs(3) + 1000 }).total, 2)}. C’est ce qui rend la différentielle plus généreuse pour les familles nombreuses.` },
      { q: 'Faut-il demander l’allocation différentielle à part ?', a: `Rien n’indique une démarche distincte sur la fiche F1878 : la différentielle est l’ARS elle-même, calculée autrement quand les revenus dépassent un peu le plafond. Les conditions restent celles de l’ARS, dont la déclaration de scolarité pour les 16 à 18 ans à partir de la mi-juillet. Le montant versé, par exemple ${h.eur(duo(h, pl2(h) + 400).total, 2)} pour notre famille, apparaît sur le compte CAF.` },
      { q: 'Une petite hausse de salaire peut-elle me coûter de l’ARS ?', a: `Oui, si elle fait passer vos revenus au-dessus du plafond, mais avec un décalage : la rentrée 2026 regarde les revenus de ${h.P.ars.revenus_reference}. Dans la zone de différentielle, 500 € de revenus en plus retirent 500 € d’ARS. Pour notre famille de deux enfants, passer de ${h.eur(pl2(h))} à ${h.eur(pl2(h) + 500)} fait tomber l’ARS de ${h.eur(plein2(h), 2)} à ${h.eur(duo(h, pl2(h) + 500).total, 2)}.` },
      { q: 'Je dépasse le plafond de l’ARS de 5 000 €, la différentielle peut-elle encore jouer ?', a: `Seulement pour une famille qui a beaucoup d’enfants scolarisés. Le dépassement doit rester inférieur au total des montants pleins. Avec un seul enfant, la marge ne dépasse jamais ${h.eur(h.P.ars.montants['15_18'], 2)}. Il faudrait au moins ${Math.ceil(5000 / h.P.ars.montants['15_18'])} adolescents de 15 à 18 ans, soit plus de 5 000 € d’ARS pleine, pour qu’un dépassement de cette taille laisse encore quelque chose.` },
    ],
    body: (h) => `
<h2>Le calcul, en trois lignes</h2>
<ol>
<li>Additionner les montants pleins de chaque enfant : ici ${h.eur(h.P.ars.montants['6_10'], 2)} pour l’enfant de 10 ans et ${h.eur(h.P.ars.montants['11_14'], 2)} pour celui de 13 ans, soit ${h.eur(plein2(h), 2)}.</li>
<li>Mesurer le dépassement : revenu net catégoriel 2024 moins le plafond de deux enfants, ${h.eur(pl2(h))}.</li>
<li>Retirer le dépassement du total. Ce qui reste est l’allocation différentielle.</li>
</ol>
<p>La ${h.src('spArs', 'fiche F1878 de service-public')} ne donne pas la formule chiffrée ; elle mentionne une allocation dégressive en cas de léger dépassement, calculée en fonction des revenus. Notre simulateur applique la règle de la soustraction décrite ci-dessus, avec les montants revalorisés par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}.</p>

<h2>La famille de deux enfants, revenu par revenu</h2>
${h.table(['Revenus 2024', 'Dépassement', 'ARS versée'], [0, 200, 400, 600, 800].map((d) => [h.eur(pl2(h) + d), h.eur(d), h.eur(duo(h, pl2(h) + d).total, 2)]), 'Deux enfants de 10 et 13 ans, rentrée 2026 (estimation)', ['l', 'r', 'r'])}
<p>La pente est de un pour un. Entre la première et la dernière ligne, 800 € de revenus en plus ont coûté 800 € d’allocation. Cela ne veut pas dire qu’une famille perd de l’argent en gagnant plus : sur l’année, elle garde au moins son revenu supplémentaire moins la même somme d’ARS, donc à peu près l’équilibre. Le vrai saut, celui que la différentielle évite, serait de perdre ${h.eur(plein2(h), 2)} pour un euro de trop.</p>
<!--mini:arsDifferentielle-->

<h2>Où s’arrête la zone de différentielle</h2>
<p>Elle s’étend du plafond au plafond augmenté du montant plein. Sa largeur dépend donc de l’âge et du nombre d’enfants scolarisés, pas seulement de la taille de la famille.</p>
${h.table(['Situation', 'Plafond', 'ARS pleine', 'Plus rien au-delà de'], [
  ['Un enfant de 8 ans', h.eur(h.M.plafondArs(1)), h.eur(h.P.ars.montants['6_10'], 2), h.eur(h.M.plafondArs(1) + h.P.ars.montants['6_10'])],
  ['Un lycéen de 16 ans', h.eur(h.M.plafondArs(1)), h.eur(h.P.ars.montants['15_18'], 2), h.eur(h.M.plafondArs(1) + h.P.ars.montants['15_18'])],
  ['Deux enfants, 10 et 13 ans', h.eur(pl2(h)), h.eur(plein2(h), 2), h.eur(pl2(h) + plein2(h))],
  ['Trois enfants, 8, 12 et 16 ans', h.eur(h.M.plafondArs(3)), h.eur(h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: 0 }).plein, 2), h.eur(h.M.plafondArs(3) + h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: 0 }).plein)],
], 'Seuils de sortie de l’ARS, rentrée 2026', ['l', 'r', 'r', 'r'])}
<p>Une famille de trois enfants dont un seul est en âge scolaire a un plafond élevé mais une zone étroite : elle ne dispose que du montant d’un enfant pour amortir le dépassement. Le raisonnement est détaillé sur la page ${h.a('ars-plafond', 'plafond de l’ARS')}.</p>

<h2>Même revenu, résultat différent</h2>
<p>Deux mères seules déclarent chacune ${h.eur(h.P.ars.plafonds.un + 440)} pour ${h.P.ars.revenus_reference}, 440 € au-dessus du plafond d’un enfant. La première a une fille de 8 ans : son ARS pleine de ${h.eur(h.P.ars.montants['6_10'], 2)} est entièrement absorbée, elle reçoit ${h.eur(h.M.ars({ c6_10: 1, c11_14: 0, c15_18: 0, enfants: 1, revenus: h.P.ars.plafonds.un + 440 }).total, 2)}. La seconde a un fils de 16 ans, dont le montant plein atteint ${h.eur(h.P.ars.montants['15_18'], 2)} : il lui reste ${h.eur(h.M.ars({ c6_10: 0, c11_14: 0, c15_18: 1, enfants: 1, revenus: h.P.ars.plafonds.un + 440 }).total, 2)}. Rien d’injuste là-dedans, seulement l’effet mécanique de la soustraction : plus le montant de départ est élevé, plus il résiste au dépassement.</p>

<h2>Le petit reliquat</h2>
<p>Près du seuil de sortie, le calcul peut laisser quelques euros. Notre moteur n’affiche rien sous ${h.eur(h.P.ars.minimum_verse)}, valeur reprise dans nos paramètres. Un lycéen seul à charge dont les revenus dépassent le plafond de ${h.eur(h.P.ars.montants['15_18'] - 10)} laisserait 10 € théoriques : le simulateur indique zéro.</p>

<h2>Un cousin des allocations familiales</h2>
<p>Le même principe existe ailleurs dans les prestations familiales. Les allocations familiales ont leur ${h.a('complement-degressif', 'complément dégressif')}, qui adoucit le passage d’une tranche de revenus à la suivante. La logique est voisine, mais la règle diffère : pour les allocations familiales, le complément se calcule sur douze mois. Pour l’ARS, tout se joue en une fois, sur un versement annuel.</p>

<h2>Ce qu’il faut vérifier si le montant surprend</h2>
<p>Un chiffre plus bas que prévu vient presque toujours de l’une de ces causes : un enfant à charge oublié, qui ferait monter le plafond ; un revenu 2024 que la CAF connaît différemment de ce que vous pensez ; ou un enfant de 16 ans dont la scolarité n’a pas été déclarée, et qui sort du total. La page ${h.a('ars-lyceen-apprenti', 'lycéens et apprentis')} traite ce dernier cas. Le ${h.a('simulateur-ars', 'simulateur de l’ARS')} permet de refaire le calcul avec vos propres chiffres, et seul le compte CAF fait foi.</p>
`,
  },
  en: {
    slug: 'ars-differential-allowance',
    nav: 'Differential allowance',
    card: 'When income is slightly over the ceiling: how the reduced back-to-school allowance is worked out, euro for euro.',
    title: 'Back-to-School Allowance 2026: the Differential Amount',
    description: 'Differential back-to-school allowance 2026: above the €28,956 ceiling (one child), the CAF pays the full amount minus the excess. Step-by-step sums and cut-off.',
    h1: 'The differential allowance: back-to-school money just over the ceiling',
    intro: 'Going a few hundred euros over the ceiling does not cost you everything: the CAF deducts the excess from the full amount.',
    resume: (h) => `The differential back-to-school allowance (allocation différentielle) is a single subtraction: the full allocation de rentrée scolaire (ARS, the allowance the CAF family benefits office pays before the school year) minus the amount by which income exceeds the ceiling. A family with children aged 10 and 13, whose full allowance is ${h.eur(plein2(h), 2)}, has a ceiling of ${h.eur(pl2(h))} for autumn 2026. With ${h.eur(pl2(h) + 400)} of 2024 net taxable income (revenu net catégoriel), it is €400 over and receives ${h.eur(duo(h, pl2(h) + 400).total, 2)}. Each euro above the ceiling removes one euro of allowance until nothing is left: for this family, payment stops from ${h.eur(pl2(h) + plein2(h))}. Service-public.fr calls it a tapering allowance for a slight overshoot; it replaces the cliff edge where one euro too many would cost the lot. The excess is measured on annual household income and deducted from the total for all the children, not from each child. Our calculation ignores any remainder below ${h.eur(h.P.ars.minimum_verse)}. This is an estimate; the CAF works out the actual entitlement.`,
    faqs: (h) => [
      { q: 'How does the CAF work out the differential back-to-school allowance?', a: `It first adds up the full amounts for every child, then deducts the gap between your 2024 income and the ceiling. For one dependent pupil aged 16: ${h.eur(h.P.ars.montants['15_18'], 2)} minus a €300 excess leaves ${h.eur(solo(h, h.P.ars.plafonds.un + 300).total, 2)}. Service-public.fr sheet F1878 describes it as a tapering allowance worked out according to income.` },
      { q: 'At what income does the back-to-school allowance stop completely?', a: `When the excess equals the full amount. For one dependent child aged 15 to 18, the autumn 2026 limit is ${h.eur(h.P.ars.plafonds.un + h.P.ars.montants['15_18'])} of 2024 income: the ${h.eur(h.P.ars.plafonds.un)} ceiling plus ${h.eur(h.P.ars.montants['15_18'], 2)}. With two children aged 10 and 13, it is ${h.eur(pl2(h) + plein2(h))}. The bigger the family of pupils, the wider the margin.` },
      { q: 'With three children at school, is the excess deducted three times?', a: `No, once, from the total. Children of 8, 12 and 16 bring ${h.eur(h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: 0 }).plein, 2)}. Being €1,000 over the ${h.eur(h.M.plafondArs(3))} ceiling leaves ${h.eur(h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: h.M.plafondArs(3) + 1000 }).total, 2)}. Each child’s amount adds to the cushion before the deduction is made, which is why the differential amount is more generous for larger families.` },
      { q: 'Do I have to apply separately for the differential allowance?', a: `Sheet F1878 mentions no separate step: the differential amount is the allowance itself, worked out differently when income is slightly over the ceiling. The usual conditions still apply, including declaring schooling for 16 to 18-year-olds from mid-July. The sum paid, ${h.eur(duo(h, pl2(h) + 400).total, 2)} for our sample family, shows up on your CAF account.` },
      { q: 'Can a small pay rise cost me back-to-school allowance?', a: `Yes, if it pushes income above the ceiling, but with a delay: autumn 2026 looks at ${h.P.ars.revenus_reference} income. Inside the differential band, €500 more income removes €500 of allowance. For our two-child family, going from ${h.eur(pl2(h))} to ${h.eur(pl2(h) + 500)} cuts the allowance from ${h.eur(plein2(h), 2)} to ${h.eur(duo(h, pl2(h) + 500).total, 2)}.` },
      { q: 'I am €5,000 over the back-to-school allowance ceiling: can the differential rule still help?', a: `Only in a family with many children at school. The excess has to be smaller than the total of the full amounts. With one child, the margin is never more than ${h.eur(h.P.ars.montants['15_18'], 2)}. You would need at least ${Math.ceil(5000 / h.P.ars.montants['15_18'])} teenagers aged 15 to 18, worth over €5,000 of full allowance, for an excess that size to leave anything at all.` },
    ],
    body: (h) => `
<h2>The sum in three lines</h2>
<ol>
<li>Add the full amount for each child: here ${h.eur(h.P.ars.montants['6_10'], 2)} for the 10-year-old and ${h.eur(h.P.ars.montants['11_14'], 2)} for the 13-year-old, ${h.eur(plein2(h), 2)} in all.</li>
<li>Measure the excess: 2024 net taxable income minus the two-child ceiling of ${h.eur(pl2(h))}.</li>
<li>Deduct the excess from the total. What is left is the differential allowance.</li>
</ol>
<p>${h.src('spArs', 'Service-public.fr sheet F1878')} gives no worked formula; it refers to a tapering allowance for a slight overshoot, based on income. Our calculator applies the subtraction rule above, with the amounts uprated by the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}.</p>

<h2>The two-child family, income step by income step</h2>
${h.table(['2024 income', 'Excess', 'Allowance paid'], [0, 200, 400, 600, 800].map((d) => [h.eur(pl2(h) + d), h.eur(d), h.eur(duo(h, pl2(h) + d).total, 2)]), 'Two children aged 10 and 13, autumn 2026 (estimate)', ['l', 'r', 'r'])}
<p>The slope is one for one. Between the first and last rows, €800 more income cost €800 of allowance. That does not mean the family loses by earning more: over the year it keeps its extra income less the same amount of allowance, roughly breaking even. The real jump, the one the differential rule prevents, would be losing ${h.eur(plein2(h), 2)} for a single euro too many.</p>
<!--mini:arsDifferentielle-->

<h2>Where the differential band ends</h2>
<p>It runs from the ceiling up to the ceiling plus the full amount. Its width therefore depends on the age and number of children at school, not just on family size.</p>
${h.table(['Situation', 'Ceiling', 'Full allowance', 'Nothing above'], [
  ['One child aged 8', h.eur(h.M.plafondArs(1)), h.eur(h.P.ars.montants['6_10'], 2), h.eur(h.M.plafondArs(1) + h.P.ars.montants['6_10'])],
  ['One pupil aged 16', h.eur(h.M.plafondArs(1)), h.eur(h.P.ars.montants['15_18'], 2), h.eur(h.M.plafondArs(1) + h.P.ars.montants['15_18'])],
  ['Two children, 10 and 13', h.eur(pl2(h)), h.eur(plein2(h), 2), h.eur(pl2(h) + plein2(h))],
  ['Three children, 8, 12 and 16', h.eur(h.M.plafondArs(3)), h.eur(h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: 0 }).plein, 2), h.eur(h.M.plafondArs(3) + h.M.ars({ c6_10: 1, c11_14: 1, c15_18: 1, revenus: 0 }).plein)],
], 'Back-to-school allowance cut-off points, autumn 2026', ['l', 'r', 'r', 'r'])}
<p>A three-child family with only one child of school age has a high ceiling but a narrow band: it has just one child’s amount to absorb the excess. The reasoning is set out on the ${h.a('ars-plafond', 'income ceiling')} page.</p>

<h2>Same income, different outcome</h2>
<p>Two single mothers each declared ${h.eur(h.P.ars.plafonds.un + 440)} for ${h.P.ars.revenus_reference}, €440 above the one-child ceiling. The first has an 8-year-old daughter: her full allowance of ${h.eur(h.P.ars.montants['6_10'], 2)} is wiped out and she receives ${h.eur(h.M.ars({ c6_10: 1, c11_14: 0, c15_18: 0, enfants: 1, revenus: h.P.ars.plafonds.un + 440 }).total, 2)}. The second has a 16-year-old son, whose full amount is ${h.eur(h.P.ars.montants['15_18'], 2)}: she is left with ${h.eur(h.M.ars({ c6_10: 0, c11_14: 0, c15_18: 1, enfants: 1, revenus: h.P.ars.plafonds.un + 440 }).total, 2)}. Nothing unfair about it, just the arithmetic of subtraction: the higher the starting amount, the better it withstands the excess.</p>

<h2>The small remainder</h2>
<p>Close to the cut-off, the sum can leave a few euros. Our engine shows nothing below ${h.eur(h.P.ars.minimum_verse)}, a value taken from our parameter file. One dependent pupil whose household is ${h.eur(h.P.ars.montants['15_18'] - 10)} over the ceiling would leave a theoretical €10; the calculator shows zero.</p>

<h2>A relative of the family allowance top-up</h2>
<p>The same idea appears elsewhere in French family benefits. Family allowances have their own ${h.a('complement-degressif', 'tapering top-up')} (complément dégressif), which softens the move from one income band to the next. The logic is similar, the rule is not: for family allowances the top-up is spread over twelve months, whereas the back-to-school allowance is settled in one annual payment.</p>

<h2>What to check if the amount surprises you</h2>
<p>A lower figure than expected nearly always has one of three causes: a dependent child left out, who would raise the ceiling; 2024 income that the CAF holds differently from what you think; or a 16-year-old whose schooling was not declared and who drops out of the total. The page on ${h.a('ars-lyceen-apprenti', 'older pupils and apprentices')} covers that last case. The ${h.a('simulateur-ars', 'back-to-school allowance calculator')} lets you rerun the sums with your own figures, and only your CAF account is authoritative.</p>
`,
  },
});
