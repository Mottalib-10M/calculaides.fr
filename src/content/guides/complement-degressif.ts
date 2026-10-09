import { defineGuide, type Helpers } from '../../lib/guide-types';

const af = (h: Helpers, enfants: number, revenus: number, majorables = 0) => h.M.allocationsFamiliales({ enfants, majorables, revenus });
/** Revenu à partir duquel le complément disparaît au-dessus du plafond t (1 ou 2), hors majorations. */
const fin = (h: Helpers, n: number, t: 1 | 2) => h.M.plafondsAf(n)[t - 1] + 12 * (h.M.baseAf(n, (t - 1) as 0 | 1) - h.M.baseAf(n, t));
const ex = (h: Helpers) => af(h, 3, 87000);
const P3 = (h: Helpers) => h.M.plafondsAf(3)[0];

export default defineGuide({
  id: 'complement-degressif',
  group: 'famille',
  order: 70,
  mini: 'cdDegressif',
  miniHref: 'simulateur-allocations-familiales',
  related: ['simulateur-allocations-familiales', 'allocations-familiales-2-enfants', 'allocations-familiales-3-enfants', 'allocations-familiales-4-enfants'],
  sources: ['spAf', 'instructionPf2026'],
  fr: {
    slug: 'complement-degressif-allocations-familiales',
    nav: 'Complément dégressif',
    card: 'Le lissage versé quand les revenus dépassent de peu un plafond, avec l’exemple officiel recalculé.',
    title: 'Complément dégressif 2026 : calcul et exemple à 87 000 €',
    description: 'Complément dégressif des allocations familiales 2026 : 317,65 € par mois au total pour 3 enfants et 87 000 € de revenus, au lieu de 173,67 €. Formule et seuils.',
    h1: 'Complément dégressif des allocations familiales',
    intro: 'Dépasser un plafond de quelques euros ne divise pas les allocations par deux du jour au lendemain : un complément comble l’écart, puis s’efface.',
    resume: (h) => `Une famille de trois enfants qui déclare 87 000 € de revenu net catégoriel ${h.P.af.revenus_reference} dépasse de ${h.eur(87000 - P3(h))} le plafond de ${h.eur(P3(h))}. Sans correctif, ses allocations familiales tomberaient de ${h.eur(h.M.baseAf(3, 0), 2)} à ${h.eur(h.M.baseAf(3, 1), 2)} par mois. Le complément dégressif évite cette chute : la CAF verse ${h.eur(ex(h).complement, 2)} de plus, soit ${h.eur(ex(h).total, 2)} au total, le chiffre de l’exemple officiel de service-public. Le principe est fixé par une formule : on ajoute au plafond dépassé douze fois le montant mensuel d’avant, on retire les ressources, on divise par douze. Le complément existe tant que le dépassement reste inférieur à douze fois l’écart entre les deux montants ; pour trois enfants, il s’éteint vers ${h.eur(fin(h, 3, 1))} de revenus. Le même mécanisme joue au second plafond. Les ressources sont celles de l’avis d’imposition 2025 et les montants sont nets de CRDS. Nos chiffres restent des estimations ; la CAF calcule le droit sur le dossier.`,
    faqs: (h) => [
      { q: 'Comment la CAF calcule-t-elle le complément dégressif des allocations familiales ?', a: `Avec la formule publiée par service-public : (plafond dépassé + 12 × montant mensuel des allocations avant dépassement − ressources) ÷ 12. Le résultat est le total versé ; le complément est ce qui dépasse le montant réduit. Pour trois enfants et 87 000 € : (${h.eur(P3(h))} + 12 × ${h.eur(h.M.baseAf(3, 0), 2)} − 87 000 €) ÷ 12 = ${h.eur(ex(h).total, 2)}.` },
      { q: 'Nos revenus dépassent le plafond de 300 €, perd-on la moitié des allocations ?', a: `Non. Avec deux enfants et ${h.eur(h.M.plafondsAf(2)[0] + 300)} de revenus ${h.P.af.revenus_reference}, la famille reçoit ${h.eur(af(h, 2, h.M.plafondsAf(2)[0] + 300).total, 2)} par mois au lieu de ${h.eur(h.M.baseAf(2, 0), 2)}, soit une baisse de ${h.eur(300 / 12, 2)} : exactement un douzième du dépassement. Le complément dégressif absorbe le reste, selon la règle décrite par service-public.` },
      { q: 'Jusqu’à quel revenu le complément dégressif est-il versé pour trois enfants ?', a: `Hors majorations, jusqu’à environ ${h.eur(fin(h, 3, 1))} au-dessus du premier plafond de ${h.eur(P3(h))}, et jusqu’à ${h.eur(fin(h, 3, 2))} au-dessus du second, fixé à ${h.eur(h.M.plafondsAf(3)[1])}. Au-delà, la famille touche le montant réduit sans complément. Ces seuils découlent de la règle : le dépassement doit rester inférieur à douze fois l’écart entre les deux montants mensuels.` },
      { q: 'Le complément dégressif tient-il compte des majorations pour âge ?', a: `Notre calcul applique la formule au montant total d’avant dépassement, majorations comprises, ce qui élargit la zone de lissage. Pour trois enfants dont un né avant mars 2012, à 87 000 €, l’estimation est de ${h.eur(af(h, 3, 87000, 1).total, 2)} par mois, dont ${h.eur(af(h, 3, 87000, 1).complement, 2)} de complément. La CAF reste seule juge du montant exact.` },
      { q: 'Existe-t-il un complément dégressif pour le complément familial ?', a: `Pas sous ce nom, mais un mécanisme voisin : selon service-public, une allocation différentielle est versée quand les ressources dépassent de peu le plafond du complément familial, ${h.eur(h.P.cf.plafonds.un_revenu[0])} pour trois enfants et un revenu. Notre simulateur ne la calcule pas. Le complément dégressif décrit ici ne concerne que les allocations familiales et leurs trois niveaux de revenus.` },
      { q: 'Faut-il déclarer quelque chose pour recevoir le complément dégressif ?', a: `Rien de particulier : il découle du revenu net catégoriel ${h.P.af.revenus_reference} que la CAF connaît par l’administration fiscale, et du nombre d’enfants à charge. Vérifiez seulement que le revenu retenu correspond à votre avis d’imposition 2025. Une erreur de quelques centaines d’euros peut suffire, près d’un plafond, à faire apparaître ou disparaître ${h.eur(ex(h).complement, 2)} par mois.` },
    ],
    body: (h) => `
<h2>Un effet de seuil, corrigé</h2>
<p>Les allocations familiales sont modulées en trois niveaux : montant plein, divisé par deux, divisé par quatre. Sans correctif, un euro de revenu au-dessus d’un plafond coûterait des centaines d’euros par an. La ${h.src('spAf', 'fiche service-public')} prévoit donc un complément dégressif quand les ressources dépassent de peu le plafond : la différence entre les ressources et le plafond dépassé ne doit pas excéder douze fois le montant mensuel concerné.</p>
<p>Concrètement, chaque euro de dépassement annuel retire un douzième d’euro par mois, jusqu’à ce que la famille rejoigne le montant réduit. La baisse devient progressive au lieu d’être brutale. Service-public résume la règle en quelques lignes et un seul exemple ; nous le décomposons ci-dessous, puis l’appliquons aux autres tailles de famille et au second plafond.</p>

<h2>L’exemple officiel, recalculé</h2>
<p>Service-public prend une famille de trois enfants à 87 000 € de ressources annuelles :</p>
<ol>
<li>Plafond dépassé : ${h.eur(P3(h))}. Dépassement : ${h.eur(87000 - P3(h))}.</li>
<li>Montant d’avant dépassement : ${h.eur(h.M.baseAf(3, 0), 2)} par mois, soit ${h.eur(h.M.baseAf(3, 0) * 12, 2)} sur douze mois. Le dépassement est bien inférieur.</li>
<li>Formule : (${h.eur(P3(h))} + ${h.eur(h.M.baseAf(3, 0) * 12, 2)} − 87 000 €) ÷ 12 = ${h.eur(ex(h).total, 2)}.</li>
<li>Décomposition : ${h.eur(ex(h).base, 2)} d’allocations au deuxième niveau et ${h.eur(ex(h).complement, 2)} de complément.</li>
</ol>
<p>La fiche conclut ensuite que la famille « peut donc percevoir une allocation de 314,65 € par mois ». Le calcul qu’elle vient de poser donne pourtant ${h.eur(ex(h).total, 2)}, et c’est ce montant que retient notre moteur : nous y voyons une coquille de la fiche, relevée le 9 octobre 2026.</p>
<!--mini:cdDegressif-->

<h2>Où commence et où finit le lissage</h2>
<p>Hors majorations, la zone couverte par le complément va du plafond jusqu’au revenu où le complément tombe à zéro. Elle est étroite pour deux enfants, plus large ensuite, parce que l’écart entre deux niveaux grandit avec le nombre d’enfants :</p>
${h.table(['Enfants', 'Plafond 1', 'Fin du complément', 'Plafond 2', 'Fin du complément'], [2, 3, 4, 5].map((n) => [String(n), h.eur(h.M.plafondsAf(n)[0]), h.eur(fin(h, n, 1)), h.eur(h.M.plafondsAf(n)[1]), h.eur(fin(h, n, 2))]), 'Revenus 2024 au-delà desquels le complément dégressif disparaît, hors majorations (estimation)', ['l', 'r', 'r', 'r', 'r'])}
<p>Pour deux enfants, il suffit de dépasser le premier plafond de ${h.eur(fin(h, 2, 1) - h.M.plafondsAf(2)[0])} pour perdre tout complément. Pour quatre enfants, la zone s’étend sur ${h.eur(fin(h, 4, 1) - h.M.plafondsAf(4)[0])}. Les pages ${h.a('allocations-familiales-2-enfants', 'deux enfants')}, ${h.a('allocations-familiales-3-enfants', 'trois enfants')} et ${h.a('allocations-familiales-4-enfants', 'quatre enfants et plus')} donnent les plafonds de chaque taille de famille.</p>

<h2>Dans la zone de lissage, un euro gagné reprend un euro d’allocation</h2>
<p>La formule a une conséquence que peu de familles voient venir. Entre le plafond et la fin du complément, chaque euro de revenu annuel supplémentaire retire exactement un euro d’allocations sur l’année. Une famille de trois enfants à 87 000 € reçoit ${h.eur(ex(h).total, 2)} par mois ; à 88 000 €, ${h.eur(af(h, 3, 88000).total, 2)}. Sur douze mois, l’écart vaut ${h.eur((ex(h).total - af(h, 3, 88000).total) * 12)}, soit précisément les 1 000 € de revenus en plus.</p>
<p>Il n’y a donc pas de piège où gagner davantage ferait perdre plus qu’on ne gagne : le complément neutralise l’effet de seuil, il ne le retourne pas. Mais dans cette zone, une hausse de revenus est entièrement absorbée côté allocations familiales. Et l’effet est décalé de deux ans, puisque les droits de 2026 reposent sur les revenus de ${h.P.af.revenus_reference} : une prime touchée cette année ne pèsera sur les allocations qu’en 2028.</p>

<h2>Au second plafond, même logique</h2>
<p>Une famille de trois enfants à 113 500 € dépasse de ${h.eur(113500 - h.M.plafondsAf(3)[1])} le second plafond de ${h.eur(h.M.plafondsAf(3)[1])}. Au lieu de tomber à ${h.eur(h.M.baseAf(3, 2), 2)}, elle reçoit ${h.eur(af(h, 3, 113500).total, 2)} par mois, dont ${h.eur(af(h, 3, 113500).complement, 2)} de complément. À 115 000 €, le complément a disparu : ${h.eur(af(h, 3, 115000).total, 2)}.</p>

<h2>Les cas où un petit écart de revenu compte</h2>
<p>Comme le revenu retenu est celui de ${h.P.af.revenus_reference}, connu par l’avis d’imposition 2025, une famille près d’un plafond ne peut plus rien changer à ses ressources de référence. Elle peut seulement vérifier que la CAF a repris le bon chiffre, notamment après une déclaration rectificative. Des frais réels déclarés à la place de l’abattement forfaitaire de ${h.pct(h.P.apl.abattement_frais_pro, 0)} modifient le revenu net catégoriel des salaires, et donc le complément. Le ${h.a('simulateur-allocations-familiales', 'simulateur des allocations familiales')} calcule le complément pour tout revenu saisi.</p>
`,
  },
  en: {
    slug: 'family-allowance-tapering-top-up',
    nav: 'Tapering top-up',
    card: 'The smoothing payment when income is just over a ceiling, with the official example worked through.',
    title: 'Tapering Top-Up 2026: Family Allowance Just Over a Ceiling',
    description: 'Family allowance tapering top-up 2026 (complément dégressif): €317.65 a month in total for 3 children on €87,000 of income, not €173.67. Formula and limits.',
    h1: 'The family allowance tapering top-up (complément dégressif)',
    intro: 'Going a few euros over a ceiling does not halve your family allowance overnight: a top-up fills the gap, then fades out.',
    resume: (h) => `A three-child family declaring €87,000 of ${h.P.af.revenus_reference} net income (revenu net catégoriel) is ${h.eur(87000 - P3(h))} over the ${h.eur(P3(h))} ceiling. Without a fix, its family allowance would drop from ${h.eur(h.M.baseAf(3, 0), 2)} to ${h.eur(h.M.baseAf(3, 1), 2)} a month. The tapering top-up (complément dégressif) prevents that cliff: the CAF, the family benefits office, pays ${h.eur(ex(h).complement, 2)} more, ${h.eur(ex(h).total, 2)} in total, the figure from service-public.fr's official example. It follows a formula: add twelve times the previous monthly amount to the ceiling exceeded, subtract your income, divide by twelve. The top-up exists while the excess stays below twelve times the gap between the two monthly amounts; for three children it ends at about ${h.eur(fin(h, 3, 1))} of income. The same mechanism applies at the second ceiling. Income is taken from the 2025 tax assessment notice (avis d'imposition) and amounts are net of the CRDS levy. Our figures are estimates; the CAF works out the entitlement on your file.`,
    faqs: (h) => [
      { q: 'How does the CAF work out the family allowance tapering top-up?', a: `With the formula published on service-public.fr: (ceiling exceeded + 12 × monthly allowance before the excess − income) ÷ 12. The result is the total paid; the top-up is whatever exceeds the reduced amount. For three children and €87,000: (${h.eur(P3(h))} + 12 × ${h.eur(h.M.baseAf(3, 0), 2)} − €87,000) ÷ 12 = ${h.eur(ex(h).total, 2)}.` },
      { q: 'Our income is €300 over the ceiling, do we lose half our family allowance?', a: `No. With two children and ${h.eur(h.M.plafondsAf(2)[0] + 300)} of ${h.P.af.revenus_reference} income, the family receives ${h.eur(af(h, 2, h.M.plafondsAf(2)[0] + 300).total, 2)} a month instead of ${h.eur(h.M.baseAf(2, 0), 2)}, a cut of ${h.eur(300 / 12, 2)}: exactly one twelfth of the excess. The tapering top-up absorbs the rest, under the rule described by service-public.fr.` },
      { q: 'Up to what income is the tapering top-up paid for three children?', a: `Before age supplements, up to about ${h.eur(fin(h, 3, 1))} above the first ceiling of ${h.eur(P3(h))}, and up to ${h.eur(fin(h, 3, 2))} above the second, set at ${h.eur(h.M.plafondsAf(3)[1])}. Beyond that the family gets the reduced amount with no top-up. These limits follow from the rule: the excess must stay below twelve times the gap between the two monthly amounts.` },
      { q: 'Does the tapering top-up take age supplements into account?', a: `Our calculation applies the formula to the total amount before the excess, supplements included, which widens the smoothing zone. For three children, one born before March 2012, on €87,000, the estimate is ${h.eur(af(h, 3, 87000, 1).total, 2)} a month, including ${h.eur(af(h, 3, 87000, 1).complement, 2)} of top-up. The CAF alone decides the exact amount.` },
      { q: 'Is there a tapering top-up for the family supplement too?', a: `Not under that name, but a similar mechanism: according to service-public.fr, a differential allowance is paid when income is only slightly over the family supplement ceiling, ${h.eur(h.P.cf.plafonds.un_revenu[0])} for three children on one income. Our calculator does not compute it. The tapering top-up described here only concerns family allowance and its three income levels.` },
      { q: 'Do I need to report anything to receive the tapering top-up?', a: `Nothing in particular: it follows from the ${h.P.af.revenus_reference} revenu net catégoriel the CAF gets from the tax authorities, and from the number of dependent children. Just check that the income used matches your 2025 tax notice. Near a ceiling, an error of a few hundred euros can make ${h.eur(ex(h).complement, 2)} a month appear or vanish.` },
    ],
    body: (h) => `
<h2>A threshold effect, corrected</h2>
<p>French family allowance comes in three levels: full, halved, quartered. Without a correction, one euro of income over a ceiling would cost hundreds of euros a year. The ${h.src('spAf', 'service-public.fr page')} therefore provides a tapering top-up when income is only slightly above the ceiling: the difference between income and the ceiling exceeded must not be more than twelve times the monthly amount concerned.</p>
<p>In practice, each euro of yearly excess removes one twelfth of a euro a month, until the family reaches the reduced amount. The fall becomes a slope instead of a cliff. Service-public.fr sums the rule up in a few lines and a single example; the sections below take that example apart, then apply it to other family sizes and to the second ceiling.</p>

<h2>The official example, worked through</h2>
<p>Service-public.fr takes a three-child family with €87,000 of yearly income:</p>
<ol>
<li>Ceiling exceeded: ${h.eur(P3(h))}. Excess: ${h.eur(87000 - P3(h))}.</li>
<li>Amount before the excess: ${h.eur(h.M.baseAf(3, 0), 2)} a month, or ${h.eur(h.M.baseAf(3, 0) * 12, 2)} over twelve months. The excess is well below that.</li>
<li>Formula: (${h.eur(P3(h))} + ${h.eur(h.M.baseAf(3, 0) * 12, 2)} − €87,000) ÷ 12 = ${h.eur(ex(h).total, 2)}.</li>
<li>Breakdown: ${h.eur(ex(h).base, 2)} of allowance at the second level plus ${h.eur(ex(h).complement, 2)} of top-up.</li>
</ol>
<p>The page then concludes that the family "can therefore receive an allowance of €314.65 a month". Yet the sum it has just set out gives ${h.eur(ex(h).total, 2)}, and that is the figure our engine uses: we read it as a typo on the page, noted on 9 October 2026.</p>
<!--mini:cdDegressif-->

<h2>Where the smoothing starts and ends</h2>
<p>Before supplements, the zone covered by the top-up runs from the ceiling to the income at which the top-up reaches zero. It is narrow for two children and wider after that, because the gap between two levels grows with the number of children:</p>
${h.table(['Children', 'Ceiling 1', 'Top-up ends', 'Ceiling 2', 'Top-up ends'], [2, 3, 4, 5].map((n) => [String(n), h.eur(h.M.plafondsAf(n)[0]), h.eur(fin(h, n, 1)), h.eur(h.M.plafondsAf(n)[1]), h.eur(fin(h, n, 2))]), '2024 income above which the tapering top-up disappears, before supplements (estimate)', ['l', 'r', 'r', 'r', 'r'])}
<p>With two children, going ${h.eur(fin(h, 2, 1) - h.M.plafondsAf(2)[0])} over the first ceiling is enough to lose the whole top-up. With four children, the zone stretches over ${h.eur(fin(h, 4, 1) - h.M.plafondsAf(4)[0])}. The pages on ${h.a('allocations-familiales-2-enfants', 'two children')}, ${h.a('allocations-familiales-3-enfants', 'three children')} and ${h.a('allocations-familiales-4-enfants', 'four children or more')} give the ceilings for each family size.</p>

<h2>Inside the smoothing zone, each euro earned takes back a euro of allowance</h2>
<p>The formula has a consequence few families see coming. Between the ceiling and the end of the top-up, each extra euro of yearly income removes exactly one euro of allowance over the year. A three-child family on €87,000 receives ${h.eur(ex(h).total, 2)} a month; on €88,000, ${h.eur(af(h, 3, 88000).total, 2)}. Over twelve months the gap is ${h.eur((ex(h).total - af(h, 3, 88000).total) * 12)}, precisely the extra €1,000 of income.</p>
<p>So there is no trap in which earning more loses you more than you gain: the top-up removes the threshold effect, it does not reverse it. But within this zone, a pay rise is fully absorbed on the family allowance side. And the effect lags by two years, since 2026 entitlements rest on ${h.P.af.revenus_reference} income: a bonus received this year will only weigh on the allowance in 2028.</p>

<h2>Same logic at the second ceiling</h2>
<p>A three-child family on €113,500 is ${h.eur(113500 - h.M.plafondsAf(3)[1])} over the second ceiling of ${h.eur(h.M.plafondsAf(3)[1])}. Instead of dropping to ${h.eur(h.M.baseAf(3, 2), 2)}, it receives ${h.eur(af(h, 3, 113500).total, 2)} a month, including ${h.eur(af(h, 3, 113500).complement, 2)} of top-up. At €115,000 the top-up has gone: ${h.eur(af(h, 3, 115000).total, 2)}.</p>

<h2>When a small income gap matters</h2>
<p>Because the income used is from ${h.P.af.revenus_reference}, as shown on the 2025 tax notice, a family near a ceiling can no longer change its reference income. It can only check that the CAF picked up the right figure, especially after an amended tax return. Actual work expenses (frais réels) claimed instead of the standard ${h.pct(h.P.apl.abattement_frais_pro, 0)} allowance change the revenu net catégoriel on salaries, and therefore the top-up. The ${h.a('simulateur-allocations-familiales', 'family allowance calculator')} works out the top-up for any income you enter.</p>
`,
  },
});
