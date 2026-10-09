import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Couple sans revenu, aide au logement, enfants de moins de 14 ans : AF puis RSA. */
const T = (h: Helpers) => h.P.af.tranches_nettes;
const af = (h: Helpers, n: 2 | 3 | 4) => (n === 2 ? T(h).deux[0] : n === 3 ? T(h).trois[0] : T(h).quatre[0]);
const fam = (h: Helpers, n: 2 | 3 | 4, autres = af(h, n)) => h.M.rsa({ couple: true, enfants: n, revenus: 0, autres, forfaitLogement: true });
const maj = (h: Helpers) => h.P.af.majoration[0];

export default defineGuide({
  id: 'rsa-allocations-familiales',
  group: 'rsa',
  order: 70,
  mini: 'rsaAllocationsFamiliales',
  related: ['simulateur-rsa', 'rsa-couple', 'rsa-parent-isole', 'simulateur-allocations-familiales', 'majoration-allocations-familiales', 'allocations-familiales-3-enfants'],
  sources: ['spRsa', 'spAf', 'decretRsa2026', 'instructionPf2026'],
  fr: {
    slug: 'rsa-et-allocations-familiales',
    nav: 'RSA et allocations familiales',
    card: 'Pourquoi les allocations familiales font baisser le RSA, avec l’exemple officiel à 1 022,75 €.',
    title: 'RSA et allocations familiales 2026 : ce qui est déduit',
    description: 'RSA et allocations familiales en 2026 : les AF comptent dans les ressources. Exemple officiel d’un couple avec deux enfants : 1 022,75 € de RSA. Par famille.',
    h1: 'RSA et allocations familiales : pourquoi l’un fait baisser l’autre',
    intro: 'Les allocations familiales sont versées en entier, mais le RSA diminue du même montant : pour une famille sans revenu, le total ne change pas.',
    resume: (h) => `Les allocations familiales font partie des ressources retenues pour le RSA : elles se retirent du montant forfaitaire, euro pour euro. Service-public en donne l’exemple officiel au barème du 1er avril 2026. Un couple avec deux enfants, sans autre revenu et aidé pour son logement, a un montant forfaitaire de ${h.eur(h.M.forfaitaireRsa(true, 2), 2)}. On retire ${h.eur(af(h, 2), 2)} d’allocations familiales et ${h.eur(fam(h, 2).fl, 2)} de forfait logement : il reste ${h.eur(fam(h, 2).rsa, 2)} de RSA. La famille reçoit donc les deux aides, mais leur total reste égal à ce que le RSA seul lui garantit. Conséquence pratique : tant que le RSA est versé, une hausse des allocations familiales, à l’arrivée d’un enfant ou à la majoration pour âge, est reprise par une baisse du RSA. Ces montants sont des estimations ; la CAF calcule le droit sur le dossier.`,
    faqs: (h) => [
      { q: 'Pourquoi la CAF retire-t-elle mes allocations familiales de mon RSA ?', a: `Parce que le RSA garantit un niveau de ressources au foyer, toutes ressources comprises. La fiche service-public range les prestations familiales parmi les ressources prises en compte. Pour un couple avec deux enfants aidé pour son logement, les ${h.eur(af(h, 2), 2)} d’allocations familiales font passer le RSA de ${h.eur(fam(h, 2, 0).rsa, 2)} à ${h.eur(fam(h, 2).rsa, 2)}. Le total des deux aides reste identique.` },
      { q: 'Mon aîné a eu 14 ans, pourquoi mon RSA a-t-il baissé ?', a: `Parce que les allocations familiales ont augmenté. Un enfant né avant le 1er mars 2012 ouvre une majoration de ${h.eur(maj(h), 2)} par mois à 14 ans, sauf pour l’aîné d’une famille de deux enfants. Cette majoration entre dans les ressources du RSA, qui baisse d’autant tant qu’il reste versé. Pour un enfant né à partir du 1er mars 2012, la majoration intervient à 18 ans.` },
      { q: 'Avec un troisième enfant, combien de RSA en plus touche-t-on ?', a: `Moins qu’on ne le croit. Le montant forfaitaire d’un couple passe de ${h.eur(h.M.forfaitaireRsa(true, 2), 2)} à ${h.eur(h.M.forfaitaireRsa(true, 3), 2)}, mais les allocations familiales montent aussi, de ${h.eur(af(h, 2), 2)} à ${h.eur(af(h, 3), 2)}. Résultat pour un couple sans revenu aidé pour son logement : le RSA passe de ${h.eur(fam(h, 2).rsa, 2)} à ${h.eur(fam(h, 3).rsa, 2)}, et le total RSA plus AF progresse de ${h.eur(fam(h, 3).rsa + af(h, 3) - fam(h, 2).rsa - af(h, 2), 2)}.` },
      { q: 'Avec un seul enfant, les allocations familiales réduisent-elles le RSA ?', a: `Non, faute d’allocations familiales : elles ne sont versées qu’à partir de deux enfants à charge, selon la fiche service-public qui leur est consacrée. Un parent seul avec un enfant, ou un couple avec un enfant, n’a donc pas cette déduction. Pour un couple avec un enfant aidé pour son logement, le RSA estimé sans revenu est de ${h.eur(h.M.rsa({ couple: true, enfants: 1, revenus: 0, forfaitLogement: true }).rsa, 2)}.` },
      { q: 'Si mes allocations familiales sont versées en retard, mon RSA est-il recalculé ?', a: 'Le RSA repose sur les ressources réellement perçues au cours des trois mois retenus par la déclaration trimestrielle, préremplie depuis mars 2025. Un rappel d’allocations familiales versé d’un coup peut donc peser sur une période. Si vous constatez une baisse inattendue, comparez les montants préremplis avec vos relevés et signalez l’écart à la CAF, qui peut aussi réclamer ou reverser une différence pendant deux ans.' },
    ],
    body: (h) => `
<h2>L’exemple officiel, ligne par ligne</h2>
<p>La ${h.src('spRsa', 'fiche RSA de service-public')} décompose le cas d’un couple avec deux enfants à charge, bénéficiaire d’une aide au logement et des allocations familiales. Notre moteur retrouve le même résultat au centime.</p>
${h.table(['Ligne du calcul', 'Montant mensuel'], [
  ['Montant forfaitaire, couple et 2 enfants', h.eur(h.M.forfaitaireRsa(true, 2), 2)],
  ['Allocations familiales, 2 enfants', `- ${h.eur(af(h, 2), 2)}`],
  ['Forfait logement, 4 personnes', `- ${h.eur(fam(h, 2).fl, 2)}`],
  ['RSA versé', h.eur(fam(h, 2).rsa, 2)],
], 'Exemple de service-public au barème du 1er avril 2026', ['l', 'r'])}
<p>Le montant des allocations familiales est celui de la première tranche de revenus, fixé par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')} et repris par la ${h.src('spAf', 'fiche allocations familiales')}. Une famille au RSA se situe presque toujours dans cette tranche.</p>
<!--mini:rsaAllocationsFamiliales-->

<h2>Famille par famille : le RSA qui reste</h2>
${h.table(['Couple sans revenu', 'Montant forfaitaire', 'Allocations familiales', 'RSA estimé', 'RSA + AF'], ([2, 3, 4] as const).map((n) => [`${n} enfants`, h.eur(h.M.forfaitaireRsa(true, n), 2), h.eur(af(h, n), 2), h.eur(fam(h, n).rsa, 2), h.eur(fam(h, n).rsa + af(h, n), 2)]), 'Aide au logement perçue, enfants de moins de 14 ans, barèmes du 1er avril 2026 (estimation)', ['l', 'r', 'r', 'r', 'r'])}
<p>La dernière colonne est celle qui compte pour le budget. Elle égale le montant forfaitaire moins le forfait logement : les allocations familiales ne changent rien au total, elles en changent seulement la répartition entre deux versements. Ce n’est plus vrai dès que le RSA tombe à zéro ; au-delà, chaque euro d’allocations familiales s’ajoute réellement.</p>

<h2>La famille Diallo et la majoration à 14 ans</h2>
<p>Aminata et Moussa Diallo ont trois enfants. Aucun des deux ne travaille, ils perçoivent l’APL. Leur RSA estimé est de ${h.eur(fam(h, 3).rsa, 2)} à côté de ${h.eur(af(h, 3), 2)} d’allocations familiales. Leur aînée, née en janvier 2012, fête ses 14 ans. La ${h.a('majoration-allocations-familiales', 'majoration pour âge')} ajoute ${h.eur(maj(h), 2)} à leurs allocations familiales. Trois mois plus tard environ, quand cette hausse entre dans la période déclarée, leur RSA passe à ${h.eur(fam(h, 3, af(h, 3) + maj(h)).rsa, 2)}. Le total ne bouge pas.</p>
<p>Les Diallo ont cru à une erreur. Il n’y en a pas : la majoration est bien versée, mais elle se retrouve dans les ressources. Ce mécanisme surprend d’autant plus que les deux aides arrivent par des versements séparés, avec des dates différentes, et que la baisse du RSA suit la hausse des allocations familiales avec le décalage de la déclaration trimestrielle.</p>

<h2>Quand un salaire arrive dans le foyer</h2>
<p>Le point où les allocations familiales deviennent un vrai supplément se calcule. Pour un couple avec trois enfants aidé pour son logement, le RSA disparaît quand les autres ressources atteignent ${h.eur(h.M.forfaitaireRsa(true, 3) - fam(h, 3).fl - af(h, 3), 2)} par mois : c’est le montant forfaitaire, moins le forfait logement, moins les allocations familiales. Si Moussa Diallo trouve un emploi payé 900 € net, le foyer garde ${h.eur(h.M.rsa({ couple: true, enfants: 3, revenus: 900, autres: af(h, 3), forfaitLogement: true }).rsa, 2)} de RSA, et la prime d’activité s’y ajoute. À 1 300 €, le RSA est nul : une hausse des allocations familiales, à ce stade, augmente directement le revenu du foyer.</p>
<p>Ce seuil explique pourquoi deux familles de même taille vivent la majoration pour âge de façon opposée. Pour la famille sans revenu, elle ne change rien au total. Pour la famille où l’un des parents travaille à temps plein, c’est un vrai gain.</p>

<h2>Les situations où l’effet s’arrête</h2>
<p>L’effet de vases communicants disparaît dans trois cas. Le premier : le foyer a d’autres revenus, salaires ou chômage, qui ont déjà ramené le RSA à zéro ; les allocations familiales s’ajoutent alors pleinement. Le deuxième : un enfant cesse d’ouvrir droit aux allocations familiales, au plus tard à 20 ans ; leur baisse fait alors remonter le RSA, tant qu’il reste versé, sans que le total du foyer ne bouge. Le troisième : le parent isolé dont la majoration prend fin voit son montant forfaitaire baisser, alors que ses allocations familiales restent les mêmes ; la page ${h.a('rsa-parent-isole', 'RSA parent isolé')} montre l’ampleur de cette baisse.</p>
<p>Les autres prestations familiales suivent la même logique dès lors qu’elles figurent parmi les ressources retenues. Les montants propres aux familles de trois enfants sont détaillés sur la page ${h.a('allocations-familiales-3-enfants', 'allocations familiales avec trois enfants')}. Pour savoir ce que la CAF vous versera, le ${h.a('simulateur-allocations-familiales', 'simulateur d’allocations familiales')} donne d’abord le montant des AF, puis le ${h.a('simulateur-rsa', 'simulateur RSA')} permet de le saisir comme ressource.</p>
`,
  },
  en: {
    slug: 'rsa-and-family-allowances',
    nav: 'RSA and child benefit',
    card: 'Why family allowances reduce RSA, with the official example at €1,022.75.',
    title: 'RSA and Family Allowances 2026: What the CAF Deducts',
    description: 'RSA and family allowances in 2026: child benefit counts as income. Official example of a couple with two children: €1,022.75 of RSA. Shown for each family size.',
    h1: 'RSA and family allowances: why one lowers the other',
    intro: 'Family allowances are paid in full, but RSA falls by the same amount: for a family with no other income, the total stays the same.',
    resume: (h) => `Allocations familiales (France’s child benefit, paid from the second child) count as income for RSA (revenu de solidarité active, the minimum income): they are taken off the flat rate euro for euro. Service-public.fr gives the official example on the scale of 1 April 2026. A couple with two children, no other income and housing aid has a flat rate of ${h.eur(h.M.forfaitaireRsa(true, 2), 2)}. Subtract ${h.eur(af(h, 2), 2)} of family allowances and the ${h.eur(fam(h, 2).fl, 2)} housing deduction, and ${h.eur(fam(h, 2).rsa, 2)} of RSA remains. The family receives both benefits, but their total stays equal to what RSA alone guarantees. In practice, as long as RSA is paid, any rise in child benefit, when a child is born or reaches the age uplift, is offset by a fall in RSA. These are estimates; the CAF (family benefits office) sets the entitlement from your file.`,
    faqs: (h) => [
      { q: 'Why does the CAF deduct my child benefit from my RSA?', a: `Because RSA guarantees the household a level of resources, counting everything it receives. The service-public.fr sheet lists family benefits among the resources taken into account. For a couple with two children and housing aid, the ${h.eur(af(h, 2), 2)} of family allowances bring RSA down from ${h.eur(fam(h, 2, 0).rsa, 2)} to ${h.eur(fam(h, 2).rsa, 2)}. The total of the two stays the same.` },
      { q: 'My eldest turned 14, why did my RSA go down?', a: `Because your family allowances went up. A child born before 1 March 2012 brings an uplift of ${h.eur(maj(h), 2)} a month at 14, except for the eldest in a two-child family. That uplift counts as RSA income, so RSA falls by the same amount while it is still paid. For a child born on or after 1 March 2012, the uplift comes at 18.` },
      { q: 'How much more RSA do we get with a third child?', a: `Less than you might think. A couple’s flat rate rises from ${h.eur(h.M.forfaitaireRsa(true, 2), 2)} to ${h.eur(h.M.forfaitaireRsa(true, 3), 2)}, but family allowances also rise, from ${h.eur(af(h, 2), 2)} to ${h.eur(af(h, 3), 2)}. For a couple with no income and housing aid, RSA goes from ${h.eur(fam(h, 2).rsa, 2)} to ${h.eur(fam(h, 3).rsa, 2)}, and RSA plus child benefit together grow by ${h.eur(fam(h, 3).rsa + af(h, 3) - fam(h, 2).rsa - af(h, 2), 2)}.` },
      { q: 'With only one child, does child benefit reduce RSA?', a: `No, because there is none: allocations familiales are only paid from two dependent children, according to the service-public.fr sheet on them. A lone parent or couple with one child therefore has no such deduction. For a couple with one child and housing aid, estimated RSA with no income is ${h.eur(h.M.rsa({ couple: true, enfants: 1, revenus: 0, forfaitLogement: true }).rsa, 2)}.` },
      { q: 'If back-dated child benefit arrives in one go, is my RSA recalculated?', a: 'RSA is based on income actually received during the three months covered by the quarterly return, pre-filled since March 2025. A lump of back-dated family allowance can therefore weigh on one period. If you see an unexpected drop, compare the pre-filled amounts with your bank statements and report any gap to the CAF, which can also reclaim or repay a difference for up to two years.' },
    ],
    body: (h) => `
<h2>The official example, line by line</h2>
<p>The ${h.src('spRsa', 'service-public.fr RSA sheet')} breaks down the case of a couple with two dependent children receiving housing aid and family allowances. Our engine reaches the same result to the cent.</p>
${h.table(['Step', 'Monthly amount'], [
  ['Flat rate, couple with 2 children', h.eur(h.M.forfaitaireRsa(true, 2), 2)],
  ['Family allowances, 2 children', `- ${h.eur(af(h, 2), 2)}`],
  ['Housing deduction, 4 people', `- ${h.eur(fam(h, 2).fl, 2)}`],
  ['RSA paid', h.eur(fam(h, 2).rsa, 2)],
], 'Service-public.fr example on the scale of 1 April 2026', ['l', 'r'])}
<p>The family allowance figure is the first income band, set by the ${h.src('instructionPf2026', 'instruction of 20 March 2026')} and shown on the ${h.src('spAf', 'family allowances sheet')}. A family on RSA is almost always in that band.</p>
<!--mini:rsaAllocationsFamiliales-->

<h2>Family by family: the RSA left</h2>
${h.table(['Couple, no income', 'Flat rate', 'Family allowances', 'Estimated RSA', 'RSA + allowances'], ([2, 3, 4] as const).map((n) => [`${n} children`, h.eur(h.M.forfaitaireRsa(true, n), 2), h.eur(af(h, n), 2), h.eur(fam(h, n).rsa, 2), h.eur(fam(h, n).rsa + af(h, n), 2)]), 'Housing aid received, children under 14, rates from 1 April 2026 (estimate)', ['l', 'r', 'r', 'r', 'r'])}
<p>The last column is the one that matters for the budget. It equals the flat rate minus the housing deduction: family allowances do not change the total, only how it is split between two payments. That stops being true once RSA reaches zero; beyond that point, every euro of child benefit is a real addition.</p>

<h2>The Diallo family and the age-14 uplift</h2>
<p>Aminata and Moussa Diallo have three children. Neither works and they receive APL (housing aid). Their estimated RSA is ${h.eur(fam(h, 3).rsa, 2)} alongside ${h.eur(af(h, 3), 2)} of family allowances. Their eldest daughter, born in January 2012, turns 14. The ${h.a('majoration-allocations-familiales', 'age uplift')} adds ${h.eur(maj(h), 2)} to their allowances. About three months later, once that rise falls inside the declared period, their RSA becomes ${h.eur(fam(h, 3, af(h, 3) + maj(h)).rsa, 2)}. The total does not move.</p>
<p>The Diallos thought it was a mistake. It is not: the uplift is paid, but it shows up in their income. The effect is all the more puzzling because the two benefits arrive as separate payments on different dates, and the RSA cut follows the allowance rise with the lag built into the quarterly return.</p>

<h2>When a wage comes into the household</h2>
<p>The point at which family allowances become a genuine extra can be worked out. For a couple with three children and housing aid, RSA disappears once other income reaches ${h.eur(h.M.forfaitaireRsa(true, 3) - fam(h, 3).fl - af(h, 3), 2)} a month: the flat rate, minus the housing deduction, minus family allowances. If Moussa Diallo finds a job paying €900 net, the household keeps ${h.eur(h.M.rsa({ couple: true, enfants: 3, revenus: 900, autres: af(h, 3), forfaitLogement: true }).rsa, 2)} of RSA, and the prime d’activité (in-work bonus) is added. At €1,300, RSA is zero: from then on, any rise in family allowances lifts household income directly.</p>
<p>That threshold explains why two families of the same size experience the age uplift in opposite ways. For the family with no earnings, it changes nothing in the total. For the family where one parent works full time, it is a real gain. If you have moved to France recently and compare notes with other parents at the school gate, this is often why their experience of the same benefit does not match yours: the allowance is identical, but what it does to the rest of the household budget depends on whether RSA is still being paid.</p>

<h2>When the effect stops</h2>
<p>The see-saw ends in three cases. First, the household has other income, wages or unemployment benefit, that has already brought RSA to zero; family allowances are then a genuine extra. Second, a child stops giving entitlement to family allowances, at 20 at the latest; the drop in allowances then lifts RSA, as long as it is still paid, with no change to the household total. Third, a lone parent whose increase ends sees the flat rate drop while allowances stay the same; the page on ${h.a('rsa-parent-isole', 'RSA for lone parents')} shows how large that drop is.</p>
<p>Other family benefits follow the same logic whenever they are counted as resources. Amounts for families with three children are set out on the page on ${h.a('allocations-familiales-3-enfants', 'family allowances with three children')}. To see what the CAF will pay you, the ${h.a('simulateur-allocations-familiales', 'family allowance calculator')} gives the allowance first, then the ${h.a('simulateur-rsa', 'RSA calculator')} lets you enter it as income.</p>
`,
  },
});
