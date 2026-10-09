import { defineGuide, type Helpers } from '../../lib/guide-types';

const af = (h: Helpers, enfants: number, revenus: number, vingtAns = 0) => h.M.allocationsFamiliales({ enfants, majorables: 0, revenus, vingtAns });
const F = (h: Helpers, t: 0 | 1 | 2) => h.P.af.forfait_20_ans[t];
/** Famille de trois enfants dont l'aîné atteint 20 ans : forfait au barème de trois enfants, allocations au barème de deux. */
const forfait3 = (h: Helpers, revenus: number) => af(h, 3, revenus, 1).forfait;
const apres3 = (h: Helpers, revenus: number) => af(h, 2, revenus).total + forfait3(h, revenus);

export default defineGuide({
  id: 'allocation-forfaitaire-20-ans',
  group: 'famille',
  order: 60,
  mini: 'afForfait20',
  miniHref: 'simulateur-allocations-familiales',
  related: ['simulateur-allocations-familiales', 'allocations-familiales-3-enfants', 'allocations-familiales-4-enfants', 'complement-familial', 'majoration-allocations-familiales'],
  sources: ['spAf', 'instructionPf2026', 'spCf'],
  fr: {
    slug: 'allocation-forfaitaire-20-ans',
    nav: 'Allocation forfaitaire 20 ans',
    card: 'Le relais d’un an versé quand l’aîné d’une famille d’au moins trois enfants atteint 20 ans.',
    title: 'Allocation forfaitaire 20 ans 2026 : 96,27 € pendant un an',
    description: 'Allocation forfaitaire 2026 : 96,27 € par mois pendant un an quand un enfant d’une famille de 3 enfants ou plus atteint 20 ans. Conditions, montants et exemple.',
    h1: 'L’allocation forfaitaire quand un enfant atteint 20 ans',
    intro: 'Le jour où l’aîné a 20 ans, il sort du calcul des allocations familiales ; dans une famille nombreuse, un forfait amortit la chute pendant un an.',
    resume: (h) => `Quand un enfant d’une famille d’au moins trois enfants atteint ${h.P.af.age_limite} ans, la CAF verse une allocation forfaitaire de ${h.eur(F(h, 0), 2)} par mois en 2026, ${h.eur(F(h, 1), 2)} ou ${h.eur(F(h, 2), 2)} si les revenus de la famille dépassent les plafonds. Elle compense en partie la baisse des allocations familiales, puisque l’enfant de ${h.P.af.age_limite} ans cesse d’être compté. Trois conditions, selon service-public : le jeune vit encore au foyer, son revenu professionnel reste sous un plafond mensuel, et les allocations familiales étaient versées pour au moins trois enfants le mois précédant son anniversaire. Le forfait est versé automatiquement jusqu’au mois qui précède ses 21 ans, soit environ un an. Pour une famille de trois enfants à 60 000 € de revenus, les allocations passent de ${h.eur(af(h, 3, 60000).total, 2)} à ${h.eur(af(h, 2, 60000).total, 2)}, et le forfait remonte le total à ${h.eur(apres3(h, 60000), 2)}. Une famille de deux enfants n’y a pas droit. Ces montants, nets de CRDS, sont des estimations ; le droit est fixé par la CAF.`,
    faqs: (h) => [
      { q: 'Mon aîné a 20 ans et vit toujours chez nous, avons-nous droit à quelque chose ?', a: `Oui, si la famille touchait les allocations familiales pour au moins trois enfants le mois précédant ses 20 ans et si son revenu professionnel reste modeste. La CAF verse alors ${h.eur(F(h, 0), 2)} par mois au premier niveau de revenus, en plus des allocations des enfants restants. Avec deux enfants seulement, rien n’est prévu : les allocations s’arrêtent, d’après service-public.` },
      { q: 'Faut-il demander l’allocation forfaitaire à la CAF ?', a: `Non. Selon service-public, elle est versée automatiquement quand les conditions sont remplies : la CAF connaît la date de naissance et le nombre d’enfants. Il faut en revanche déclarer tout changement, en particulier le départ du jeune du foyer ou un emploi mieux payé, qui mettent fin au droit. Un trop-perçu de ${h.eur(F(h, 0), 2)} par mois serait réclamé.` },
      { q: 'Jusqu’à quand l’allocation forfaitaire est-elle versée ?', a: `Jusqu’au mois qui précède le 21e anniversaire du jeune, selon la fiche service-public des allocations familiales. Elle dure donc environ douze mois, pour un total de ${h.eur(F(h, 0) * 12)} au premier niveau de revenus, ${h.eur(F(h, 1) * 12)} au deuxième. Elle s’arrête plus tôt si le jeune quitte le foyer ou dépasse le plafond de revenu professionnel.` },
      { q: 'Mon fils de 20 ans est apprenti, garde-t-on l’allocation forfaitaire ?', a: `Tout dépend de sa rémunération. La fiche service-public fixe un plafond mensuel de revenu professionnel au-delà duquel le forfait n’est pas dû. Un apprenti peu payé qui vit encore chez ses parents peut ouvrir le droit, soit ${h.eur(F(h, 0), 2)} par mois au premier niveau de revenus ; un salaire supérieur au plafond le supprime. Déclarez son contrat à la CAF.` },
      { q: 'Le forfait des 20 ans est-il versé pour chaque enfant qui atteint 20 ans ?', a: `Pour chacun, tant que la troisième condition est remplie : les allocations familiales devaient être versées pour au moins trois enfants le mois précédant son anniversaire. Dans une famille de cinq, les trois premiers départs ouvrent chacun un forfait de ${h.eur(F(h, 0), 2)} au premier niveau de revenus ; le quatrième n’en ouvre pas, car il ne restait que deux enfants comptés.` },
      { q: 'Combien vaut le forfait des 20 ans au-dessus de 86 644 € de revenus ?', a: `${h.eur(F(h, 1), 2)} par mois pour une famille de trois enfants entre ${h.eur(h.M.plafondsAf(3)[0])} et ${h.eur(h.M.plafondsAf(3)[1])} de revenu net catégoriel ${h.P.af.revenus_reference}, ${h.eur(F(h, 2), 2)} au-delà. Pour une famille de quatre enfants, service-public indique les seuils de ${h.eur(h.M.plafondsAf(4)[0])} et ${h.eur(h.M.plafondsAf(4)[1])}. Le forfait suit la même modulation que les allocations.` },
    ],
    body: (h) => `
<h2>Pourquoi un forfait à 20 ans</h2>
<p>Les allocations familiales s’adressent aux enfants de moins de ${h.P.af.age_limite} ans. Le mois où l’aîné atteint cet âge, il cesse d’être compté. Pour une famille de deux enfants, le droit s’arrête ; pour une famille de trois, le montant redescend au barème de deux enfants, soit une perte de ${h.eur(h.M.baseAf(3, 0) - h.M.baseAf(2, 0), 2)} par mois au premier niveau de revenus. La ${h.src('spAf', 'fiche service-public')} le dit simplement : pour une famille d’au moins trois enfants, la perte peut être importante, et l’allocation forfaitaire provisoire est là pour l’atténuer.</p>

<h2>Les trois conditions</h2>
<ol>
<li>Le jeune de ${h.P.af.age_limite} ans vit encore au foyer de l’allocataire.</li>
<li>Il ne perçoit pas de revenu professionnel supérieur au plafond mensuel indiqué par service-public.</li>
<li>Le mois précédant ses ${h.P.af.age_limite} ans, les allocations familiales étaient versées pour au moins trois enfants.</li>
</ol>
<p>La troisième condition explique qu’une famille de deux enfants n’y ait jamais droit, et qu’une famille de trois dont l’un des enfants est déjà sorti du calcul n’y ait plus droit pour le suivant.</p>
<!--mini:afForfait20-->

<h2>Le montant, selon les revenus</h2>
<p>Le forfait vaut ${h.pct(h.P.af.taux_bmaf.forfait, 3)} de la base mensuelle des allocations familiales, d’après l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}, et suit la modulation habituelle :</p>
${h.table(['Revenus 2024 (famille de 3 enfants)', 'Revenus 2024 (famille de 4 enfants)', 'Forfait par mois', 'Sur un an'], ([0, 1, 2] as const).map((t) => [t === 0 ? `jusqu’à ${h.eur(h.M.plafondsAf(3)[0])}` : t === 1 ? `jusqu’à ${h.eur(h.M.plafondsAf(3)[1])}` : `plus de ${h.eur(h.M.plafondsAf(3)[1])}`, t === 0 ? `jusqu’à ${h.eur(h.M.plafondsAf(4)[0])}` : t === 1 ? `jusqu’à ${h.eur(h.M.plafondsAf(4)[1])}` : `plus de ${h.eur(h.M.plafondsAf(4)[1])}`, h.eur(F(h, t), 2), h.eur(F(h, t) * 12)]), 'Allocation forfaitaire pour un enfant concerné, montants nets de CRDS (barème 2026, seuils de service-public)', ['l', 'l', 'r', 'r'])}

<h2>La famille Garnier, avant et après</h2>
<p>Trois enfants de 19, 16 et 11 ans, 60 000 € de revenu net catégoriel ${h.P.af.revenus_reference}. Aujourd’hui, la famille reçoit ${h.eur(af(h, 3, 60000).total, 2)} d’allocations familiales par mois, hors majorations. Le mois qui suit les ${h.P.af.age_limite} ans de l’aînée, Manon, qui fait ses études et habite encore chez ses parents :</p>
<ul>
<li>les allocations des deux plus jeunes : ${h.eur(af(h, 2, 60000).total, 2)} ;</li>
<li>le forfait pour Manon : ${h.eur(forfait3(h, 60000), 2)} ;</li>
<li>au total ${h.eur(apres3(h, 60000), 2)}, contre ${h.eur(af(h, 2, 60000).total, 2)} sans forfait.</li>
</ul>
<p>Au 21e anniversaire de Manon, le forfait s’arrête. La famille passe à ${h.eur(af(h, 2, 60000).total, 2)} par mois, puis rien du tout quand le deuxième atteindra ${h.P.af.age_limite} ans : à ce moment-là, les allocations n’étaient plus versées que pour deux enfants, et la troisième condition n’est plus remplie.</p>

<h2>Avec des revenus plus élevés, la même marche en plus petit</h2>
<p>Les Duval ont aussi trois enfants, mais déclarent 100 000 €. Ils se situent au deuxième niveau de revenus : ${h.eur(af(h, 3, 100000).total, 2)} d’allocations familiales par mois avant les 20 ans de l’aîné. Après, les deux plus jeunes ouvrent ${h.eur(af(h, 2, 100000).total, 2)} et le forfait ${h.eur(forfait3(h, 100000), 2)}, soit ${h.eur(apres3(h, 100000), 2)}. La baisse mensuelle passe de ${h.eur(af(h, 3, 100000).total - af(h, 2, 100000).total, 2)} à ${h.eur(af(h, 3, 100000).total - apres3(h, 100000), 2)} grâce au forfait.</p>
<p>Sur l’année des 20 ans, la différence entre les deux familles se lit en montants cumulés : ${h.eur(forfait3(h, 60000) * 12)} de forfait pour les Garnier, ${h.eur(forfait3(h, 100000) * 12)} pour les Duval. Dans les deux cas, le forfait ne couvre qu’une partie de la perte, et pour une seule année. L’anniversaire suivant, le 21e, fait disparaître ce relais ; il vaut mieux avoir prévu cette seconde baisse dans le budget familial, au même titre que la première, en notant la date dès aujourd’hui.</p>

<h2>Dans une famille de quatre enfants ou plus</h2>
<p>Le mécanisme se répète à chaque aîné, tant que la famille comptait au moins trois enfants le mois précédant l’anniversaire. Une famille de quatre à 60 000 € dont l’aîné a ${h.P.af.age_limite} ans perçoit les allocations de trois enfants et le forfait : ${h.eur(af(h, 3, 60000, 1).total, 2)} par mois. Le calendrier complet d’une fratrie de cinq figure sur la page ${h.a('allocations-familiales-4-enfants', 'quatre enfants et plus')}.</p>

<h2>Le complément familial, lui, continue</h2>
<p>Le même anniversaire ne touche pas le ${h.a('complement-familial', 'complément familial')} : selon la ${h.src('spCf', 'fiche service-public')}, il retient les enfants jusqu’à moins de ${h.P.cf.age_max} ans. Une famille qui le perçoit le garde jusqu’aux ${h.P.cf.age_max} ans de l’aîné, à condition de compter toujours trois enfants de ${h.P.cf.age_min} à moins de ${h.P.cf.age_max} ans. L’année des 20 ans est donc une année de transition, où le forfait et le complément se cumulent.</p>
`,
  },
  en: {
    slug: 'family-allowance-age-twenty-flat-rate',
    nav: 'Age-20 flat-rate allowance',
    card: 'The one-year bridge paid when the eldest in a family of three or more children turns 20.',
    title: 'Age-20 Flat-Rate Allowance 2026: €96.27 a Month for a Year',
    description: 'Age-20 flat-rate allowance 2026: €96.27 a month for a year when a child in a family of 3 or more turns 20 in France. Conditions, amounts and a worked example.',
    h1: 'The flat-rate allowance when a child turns 20',
    intro: 'The day the eldest turns 20, they leave the family allowance count; in a large family, a flat payment softens the drop for a year.',
    resume: (h) => `When a child in a family of at least three children turns ${h.P.af.age_limite}, the CAF (Caisse d'allocations familiales, the family benefits office) pays a flat-rate allowance (allocation forfaitaire) of ${h.eur(F(h, 0), 2)} a month in 2026, or ${h.eur(F(h, 1), 2)} and ${h.eur(F(h, 2), 2)} when family income is above the ceilings. It partly offsets the fall in family allowance, since the ${h.P.af.age_limite}-year-old stops being counted. Three conditions apply, according to service-public.fr: the young adult still lives at home, their earnings stay under a monthly ceiling, and family allowance was paid for at least three children in the month before the birthday. It is paid automatically until the month before their 21st birthday, about a year. For a three-child family on €60,000, family allowance falls from ${h.eur(af(h, 3, 60000).total, 2)} to ${h.eur(af(h, 2, 60000).total, 2)}, and the flat rate brings the total back to ${h.eur(apres3(h, 60000), 2)}. A two-child family is not covered. Amounts are net of the CRDS levy and are estimates; the CAF sets the entitlement.`,
    faqs: (h) => [
      { q: 'Our eldest has turned 20 and still lives with us, are we entitled to anything?', a: `Yes, if the family was receiving family allowance for at least three children in the month before the 20th birthday and the young adult's earnings stay modest. The CAF then pays ${h.eur(F(h, 0), 2)} a month at the lowest income level, on top of the allowance for the remaining children. With only two children there is nothing: the allowance stops, says service-public.fr.` },
      { q: 'Do I have to apply to the CAF for the age-20 flat-rate allowance?', a: `No. According to service-public.fr it is paid automatically when the conditions are met: the CAF knows the dates of birth and the number of children. You must, however, report any change, especially the young adult moving out or taking a better-paid job, which ends the entitlement. An overpayment of ${h.eur(F(h, 0), 2)} a month would be clawed back.` },
      { q: 'Until when is the age-20 flat-rate allowance paid?', a: `Until the month before the young adult's 21st birthday, according to the service-public.fr family allowance page. It therefore lasts about twelve months, for a total of ${h.eur(F(h, 0) * 12)} at the lowest income level and ${h.eur(F(h, 1) * 12)} at the second. It stops sooner if they leave home or earn above the monthly ceiling.` },
      { q: 'My 20-year-old son is an apprentice, do we keep the flat-rate allowance?', a: `It depends on his pay. The service-public.fr page sets a monthly earnings ceiling above which the flat rate is not due. A low-paid apprentice still living with his parents can open the entitlement, ${h.eur(F(h, 0), 2)} a month at the lowest income level; pay above the ceiling removes it. Report his contract to the CAF.` },
      { q: 'Is the age-20 flat rate paid for every child who turns 20?', a: `For each one, as long as the third condition holds: family allowance must have been paid for at least three children in the month before the birthday. In a family of five, the first three departures each open a flat rate of ${h.eur(F(h, 0), 2)} at the lowest income level; the fourth does not, since only two children were then being counted.` },
      { q: 'How much is the age-20 flat rate above €86,644 of income?', a: `${h.eur(F(h, 1), 2)} a month for a three-child family between ${h.eur(h.M.plafondsAf(3)[0])} and ${h.eur(h.M.plafondsAf(3)[1])} of ${h.P.af.revenus_reference} revenu net catégoriel (net income by category, from the tax notice), ${h.eur(F(h, 2), 2)} above that. For a four-child family, service-public.fr gives thresholds of ${h.eur(h.M.plafondsAf(4)[0])} and ${h.eur(h.M.plafondsAf(4)[1])}. The flat rate is scaled like the allowance.` },
    ],
    body: (h) => `
<h2>Why a flat rate at 20</h2>
<p>French family allowance covers children under ${h.P.af.age_limite}. In the month the eldest reaches that age, they stop being counted. For a two-child family, the entitlement ends; for a family of three, the amount drops to the two-child scale, a loss of ${h.eur(h.M.baseAf(3, 0) - h.M.baseAf(2, 0), 2)} a month at the lowest income level. The ${h.src('spAf', 'service-public.fr page')} puts it plainly: for a family of at least three children the loss can be large, and the provisional flat-rate allowance is there to soften it.</p>

<h2>The three conditions</h2>
<ol>
<li>The ${h.P.af.age_limite}-year-old still lives in the claimant's household.</li>
<li>They do not earn more than the monthly ceiling stated by service-public.fr.</li>
<li>In the month before their ${h.P.af.age_limite}th birthday, family allowance was paid for at least three children.</li>
</ol>
<p>The third condition explains why a two-child family never qualifies, and why a family of three in which one child has already left the count no longer qualifies for the next one.</p>
<!--mini:afForfait20-->

<h2>The amount, by income</h2>
<p>The flat rate equals ${h.pct(h.P.af.taux_bmaf.forfait, 3)} of the monthly family benefit base (BMAF), per the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}, and follows the usual income scaling:</p>
${h.table(['2024 income (three-child family)', '2024 income (four-child family)', 'Flat rate per month', 'Over a year'], ([0, 1, 2] as const).map((t) => [t === 0 ? `up to ${h.eur(h.M.plafondsAf(3)[0])}` : t === 1 ? `up to ${h.eur(h.M.plafondsAf(3)[1])}` : `over ${h.eur(h.M.plafondsAf(3)[1])}`, t === 0 ? `up to ${h.eur(h.M.plafondsAf(4)[0])}` : t === 1 ? `up to ${h.eur(h.M.plafondsAf(4)[1])}` : `over ${h.eur(h.M.plafondsAf(4)[1])}`, h.eur(F(h, t), 2), h.eur(F(h, t) * 12)]), 'Flat-rate allowance for one child concerned, amounts net of CRDS (2026 scale, service-public.fr thresholds)', ['l', 'l', 'r', 'r'])}

<h2>The Garnier family, before and after</h2>
<p>Three children aged 19, 16 and 11, €60,000 of ${h.P.af.revenus_reference} net income as shown on the avis d'imposition (tax assessment notice). Today the family receives ${h.eur(af(h, 3, 60000).total, 2)} of family allowance a month, before supplements. In the month after the eldest, Manon, turns ${h.P.af.age_limite}, while she studies and still lives at home:</p>
<ul>
<li>allowance for the two younger children: ${h.eur(af(h, 2, 60000).total, 2)};</li>
<li>flat rate for Manon: ${h.eur(forfait3(h, 60000), 2)};</li>
<li>in total ${h.eur(apres3(h, 60000), 2)}, against ${h.eur(af(h, 2, 60000).total, 2)} without it.</li>
</ul>
<p>On Manon's 21st birthday the flat rate ends. The family moves to ${h.eur(af(h, 2, 60000).total, 2)} a month, then nothing at all when the second child turns ${h.P.af.age_limite}: by then the allowance was only being paid for two children, so the third condition is no longer met.</p>

<h2>Higher income, the same step on a smaller scale</h2>
<p>The Duvals also have three children but declared €100,000. They sit on the second income level: ${h.eur(af(h, 3, 100000).total, 2)} of family allowance a month before the eldest turns 20. Afterwards the two younger children open ${h.eur(af(h, 2, 100000).total, 2)} and the flat rate ${h.eur(forfait3(h, 100000), 2)}, giving ${h.eur(apres3(h, 100000), 2)}. Thanks to the flat rate, the monthly drop shrinks from ${h.eur(af(h, 3, 100000).total - af(h, 2, 100000).total, 2)} to ${h.eur(af(h, 3, 100000).total - apres3(h, 100000), 2)}.</p>
<p>Over the year after the 20th birthday, the gap between the two families shows in the totals: ${h.eur(forfait3(h, 60000) * 12)} of flat rate for the Garniers, ${h.eur(forfait3(h, 100000) * 12)} for the Duvals. In both cases it only covers part of the loss, and for a single year. The next birthday, the 21st, removes this bridge; it is wise to have budgeted for that second cut, just like the first one, by noting the date in the diary today.</p>

<h2>In families of four or more</h2>
<p>The mechanism repeats with each eldest child, as long as the family counted at least three children in the month before the birthday. A family of four on €60,000 whose eldest turns ${h.P.af.age_limite} receives the three-child allowance plus the flat rate: ${h.eur(af(h, 3, 60000, 1).total, 2)} a month. The full timetable for five siblings is on the ${h.a('allocations-familiales-4-enfants', 'four children or more')} page.</p>

<h2>The family supplement carries on</h2>
<p>The same birthday does not affect the ${h.a('complement-familial', 'family supplement')} (complément familial): according to the ${h.src('spCf', 'service-public.fr page')}, it counts children up to under ${h.P.cf.age_max}. A family receiving it keeps it until the eldest turns ${h.P.cf.age_max}, provided it still has three children aged ${h.P.cf.age_min} to under ${h.P.cf.age_max}. The year after the 20th birthday is therefore a transition year in which the flat rate and the supplement are paid together.</p>
`,
  },
});
