import { defineGuide, type Helpers } from '../../lib/guide-types';

const A = (h: Helpers) => h.P.asf.par_enfant;
const asf = (h: Helpers, enfants: number, pension = 0) => h.M.asf(enfants, pension);

export default defineGuide({
  id: 'allocation-soutien-familial',
  group: 'famille',
  order: 90,
  mini: 'asfDifferentielle',
  miniHref: 'simulateur-allocations-familiales',
  related: ['simulateur-allocations-familiales', 'allocations-familiales-2-enfants', 'complement-familial', 'allocations-familiales-3-enfants'],
  sources: ['spAsf', 'instructionPf2026'],
  fr: {
    slug: 'allocation-soutien-familial',
    nav: 'Allocation de soutien familial',
    card: 'L’aide au parent qui élève seul un enfant sans pension, ou avec une pension inférieure à son montant.',
    title: 'Allocation de soutien familial 2026 : 200,78 € par enfant',
    description: 'Allocation de soutien familial (ASF) 2026 : 200,78 € par mois et par enfant, ou la différence si la pension est plus faible. Supprimée en couple. Conditions.',
    h1: 'Allocation de soutien familial (ASF)',
    intro: 'Quand l’autre parent ne verse rien, ou trop peu, la CAF garantit au parent seul un montant minimum par enfant.',
    resume: (h) => `L’allocation de soutien familial vaut ${h.eur(A(h), 2)} par mois et par enfant en 2026. La CAF la verse au parent qui vit seul et élève un enfant dont l’autre parent ne participe plus à l’entretien depuis au moins un mois, ou verse une pension alimentaire inférieure à ${h.eur(A(h), 2)}. Dans ce second cas, l’ASF est différentielle : elle complète la pension jusqu’à ${h.eur(A(h), 2)}. Une mère seule avec deux enfants et sans aucune pension reçoit ainsi ${h.eur(asf(h, 2), 2)} par mois ; si le père verse 120 € par enfant, l’ASF tombe à ${h.eur(asf(h, 2, 120), 2)}. La fiche officielle ne prévoit aucune condition de ressources, mais l’allocation est supprimée dès que le parent vit en couple. Quand aucune pension n’a été fixée, l’ASF n’est versée que quatre mois si le parent n’engage pas de démarche devant le juge aux affaires familiales. La demande se fait avec le formulaire cerfa n° 12038. Montants nets de CRDS ; il s’agit d’une estimation, la CAF décidant sur le dossier.`,
    faqs: (h) => [
      { q: 'Le père ne paie plus la pension depuis deux mois, puis-je toucher l’ASF ?', a: `Oui, si vous vivez seule : l’ASF est due quand l’autre parent ne participe plus à l’entretien depuis au moins un mois. Si la pension a été fixée par un jugement ou une convention de divorce déposée chez un notaire, l’ASF vous est versée à titre d’avance, ${h.eur(A(h), 2)} par enfant, et la CAF peut agir pour récupérer jusqu’à deux ans d’impayés, selon service-public.` },
      { q: 'Je reçois 120 € de pension alimentaire par enfant, combien d’ASF ?', a: `${h.eur(asf(h, 1, 120), 2)} par enfant et par mois : l’ASF différentielle comble l’écart entre la pension reçue et ${h.eur(A(h), 2)}. Avec deux enfants, ${h.eur(asf(h, 2, 120), 2)} par mois. D’après service-public, ce complément dû chaque mois est versé en une seule fois tous les trois mois, et il n’est pas versé si la différence est trop faible.` },
      { q: 'Je me remets en couple, l’ASF continue-t-elle ?', a: `Non. Service-public le rappelle : l’allocation de soutien familial est supprimée si vous vivez en couple. Une mère qui touchait ${h.eur(asf(h, 2), 2)} par mois pour deux enfants perd donc l’intégralité de ce montant. Déclarez la mise en couple sans attendre pour éviter un trop-perçu.` },
      { q: 'Aucune pension n’a été fixée par le juge, ai-je droit à l’ASF ?', a: `Oui, pendant quatre mois. Pour la garder au-delà, il faut dans ce délai saisir le juge aux affaires familiales du tribunal de votre domicile afin de faire fixer une pension, ou demander la révision d’une décision qui n’en prévoit pas, selon service-public. Pendant ces quatre mois, l’ASF vaut ${h.eur(A(h), 2)} par enfant, soit ${h.eur(A(h) * 4, 2)} au total pour un enfant.` },
      { q: 'L’autre parent est au RSA et ne peut rien payer, l’ASF est-elle possible ?', a: `Oui. Service-public prévoit l’ASF quand l’autre parent ne peut pas assurer son obligation d’entretien : insolvabilité, chômage, incarcération, RSA. La CAF vérifie sa situation et vous dit si une démarche pour fixer une pension reste nécessaire. Le montant est alors l’ASF complète, ${h.eur(A(h), 2)} par enfant et par mois, soit ${h.eur(A(h) * 12)} par an.` },
    ],
    body: (h) => `
<h2>Ce que garantit l’ASF</h2>
<p>L’allocation de soutien familial assure au parent qui élève seul son enfant un minimum de ${h.eur(A(h), 2)} par mois et par enfant, quand l’autre parent ne contribue pas ou contribue trop peu. Elle est versée par la CAF, ou par la MSA pour le régime agricole, d’après la ${h.src('spAsf', 'fiche service-public de l’ASF')}. Son montant a été revalorisé au 1er avril 2026 avec les autres prestations familiales, selon l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}.</p>
<p>Trois conditions s’appliquent dans tous les cas : vivre seul, résider en France, avoir au moins un enfant à charge pour lequel l’autre parent ne participe plus à l’entretien depuis au moins un mois, ou verse une pension inférieure à ${h.eur(A(h), 2)}. L’allocation est due à compter du mois qui suit la séparation.</p>

<h2>Quatre situations, quatre traitements</h2>
<h3>Une pension fixée mais impayée</h3>
<p>Le juge ou une convention de divorce déposée chez un notaire a fixé une pension, et elle n’arrive pas, ou pas en entier. La CAF verse l’ASF à titre d’avance, puis peut agir à votre place pour récupérer la pension, jusqu’à deux ans d’impayés. Pour deux enfants, l’avance représente ${h.eur(asf(h, 2), 2)} par mois.</p>
<h3>Un parent qui ne peut pas payer</h3>
<p>Insolvabilité, chômage, incarcération, RSA : quand l’autre parent est hors d’état d’assurer l’entretien, la CAF examine sa situation et peut verser l’ASF. Elle indique si vous devez malgré tout engager une démarche pour faire fixer une pension.</p>
<h3>Aucune pension fixée</h3>
<p>L’ASF est versée quatre mois. Pour la conserver, il faut dans ce délai saisir le juge aux affaires familiales, ou demander la révision d’une décision qui ne prévoit pas de pension.</p>
<h3>Une pension trop faible</h3>
<p>C’est l’ASF différentielle : la CAF complète la pension jusqu’à ${h.eur(A(h), 2)}. Ce complément est dû chaque mois mais payé en une fois tous les trois mois ; la fiche précise qu’il n’est pas versé quand la différence est trop faible.</p>
<!--mini:asfDifferentielle-->

<h2>Combien selon la pension reçue</h2>
<p>Le calcul est simple, par enfant : ${h.eur(A(h), 2)} moins la pension effectivement reçue. Le tableau donne l’ASF mensuelle pour un et deux enfants.</p>
${h.table(['Pension reçue par enfant', 'ASF, 1 enfant', 'ASF, 2 enfants', 'Total reçu par enfant'], [0, 50, 100, 150].map((p) => [h.eur(p), h.eur(asf(h, 1, p), 2), h.eur(asf(h, 2, p), 2), h.eur(asf(h, 1, p) + p, 2)]), 'Allocation de soutien familial 2026, montants mensuels nets de CRDS (estimation)', ['l', 'r', 'r', 'r'])}
<p>Quelle que soit la pension en dessous du seuil, le parent reçoit au total ${h.eur(A(h), 2)} par enfant. Au-delà, la pension suffit et l’ASF n’est pas due.</p>

<h2>Une année avec l’ASF</h2>
<p>Sarah élève seule ses deux enfants. Le jugement de divorce a fixé une pension de 100 € par enfant, que le père paie régulièrement. Elle reçoit l’ASF différentielle : ${h.eur(asf(h, 2, 100), 2)} par mois pour les deux, versés en une fois tous les trois mois, soit ${h.eur(asf(h, 2, 100) * 3, 2)} par trimestre. Au printemps, le père cesse de payer. Un mois plus tard, Sarah le signale : la CAF lui verse alors l’ASF complète à titre d’avance, ${h.eur(asf(h, 2), 2)} par mois, et se charge de réclamer les sommes dues au père. À l’automne, Sarah emménage avec son nouveau compagnon : l’ASF s’arrête, même si la pension reste impayée.</p>
<p>Ce parcours montre les deux leviers à surveiller : déclarer vite un impayé, pour passer de l’ASF différentielle à l’ASF complète, et déclarer vite une mise en couple, pour éviter de devoir rembourser des mois perçus à tort.</p>

<h2>Ce qui supprime l’ASF</h2>
<p>La vie en couple, d’abord. Service-public est explicite : l’ASF est supprimée si vous vivez en couple. Une mère seule avec trois enfants sans pension perd ainsi ${h.eur(asf(h, 3), 2)} par mois en emménageant avec quelqu’un. Ensuite, le paiement régulier d’une pension au moins égale à ${h.eur(A(h), 2)}. Enfin, l’absence de démarche devant le juge au-delà de quatre mois quand aucune pension n’a été fixée.</p>
<p>L’ASF ne dépend pas des revenus du parent : elle s’ajoute avec les ${h.a('allocations-familiales-2-enfants', 'allocations familiales')}, et pour un parent isolé de trois enfants, avec le ${h.a('complement-familial', 'complément familial')}, dont les plafonds sont alors ceux d’un couple à deux revenus.</p>

<h2>La demande</h2>
<p>Le dossier se constitue avec le formulaire cerfa n° 12038, accompagné du formulaire n° 11423 de déclaration de situation et des pièces demandées selon le cas : jugement, convention de divorce, preuves des impayés. Pour la MSA, les formulaires sont propres au régime agricole. Le ${h.a('simulateur-allocations-familiales', 'simulateur des allocations familiales')} complète l’estimation pour les autres prestations du foyer.</p>
`,
  },
  en: {
    slug: 'family-support-allowance',
    nav: 'Family support allowance (ASF)',
    card: 'The payment for a parent raising a child alone with no maintenance, or with maintenance below its amount.',
    title: 'Family Support Allowance 2026: €200.78 per Child (ASF)',
    description: 'Family support allowance (ASF) 2026 in France: €200.78 a month per child, or the difference when maintenance is lower. Ends if you live as a couple. Rules.',
    h1: 'Family support allowance (allocation de soutien familial, ASF)',
    intro: 'When the other parent pays nothing, or too little, the CAF guarantees the lone parent a minimum amount per child.',
    resume: (h) => `The family support allowance (allocation de soutien familial, ASF) is worth ${h.eur(A(h), 2)} a month per child in 2026. The CAF, the French family benefits office, pays it to a parent living alone and raising a child whose other parent has stopped contributing to the child's upkeep for at least a month, or pays maintenance (pension alimentaire) below ${h.eur(A(h), 2)}. In the second case the ASF is differential: it tops the maintenance up to ${h.eur(A(h), 2)}. A mother alone with two children and no maintenance therefore receives ${h.eur(asf(h, 2), 2)} a month; if the father pays €120 per child, the ASF falls to ${h.eur(asf(h, 2, 120), 2)}. The official page sets no income test, but the allowance ends as soon as the parent lives as a couple. When no maintenance has been set, the ASF is only paid for four months unless the parent takes the matter to the family court judge (juge aux affaires familiales). The claim uses form cerfa 12038. Amounts are net of the CRDS levy; this is an estimate, and the CAF decides on the file.`,
    faqs: (h) => [
      { q: 'My ex has not paid maintenance for two months, can I claim the ASF?', a: `Yes, if you live alone: the ASF is due once the other parent has stopped contributing for at least a month. If maintenance was set by a court ruling or a divorce agreement lodged with a notary, the ASF is paid to you as an advance, ${h.eur(A(h), 2)} per child, and the CAF can act to recover up to two years of arrears, according to service-public.fr.` },
      { q: 'I receive €120 maintenance per child, how much ASF will I get?', a: `${h.eur(asf(h, 1, 120), 2)} per child per month: the differential ASF fills the gap between the maintenance received and ${h.eur(A(h), 2)}. With two children, ${h.eur(asf(h, 2, 120), 2)} a month. According to service-public.fr, this top-up is due monthly but paid in one go every three months, and it is not paid when the difference is very small.` },
      { q: 'I am moving in with a new partner, does the ASF continue?', a: `No. Service-public.fr is clear: the family support allowance ends if you live as a couple. A mother receiving ${h.eur(asf(h, 2), 2)} a month for two children therefore loses the whole amount. Report the change straight away to avoid an overpayment being clawed back.` },
      { q: 'No maintenance was ever set by a judge, am I entitled to the ASF?', a: `Yes, for four months. To keep it beyond that, you must within that time ask the family court judge at your local court to set maintenance, or seek a review of a ruling that set none, according to service-public.fr. During those four months the ASF is ${h.eur(A(h), 2)} per child, ${h.eur(A(h) * 4, 2)} in total for one child.` },
      { q: 'The other parent is on RSA and cannot pay anything, is the ASF possible?', a: `Yes. Service-public.fr provides for the ASF when the other parent cannot meet the duty to support the child: insolvency, unemployment, prison, or living on the RSA (France's minimum income). The CAF checks their situation and tells you whether you still need to take steps to set maintenance. The amount is then the full ASF, ${h.eur(A(h), 2)} per child per month, or ${h.eur(A(h) * 12)} a year.` },
    ],
    body: (h) => `
<h2>What the ASF guarantees</h2>
<p>The family support allowance guarantees a parent raising a child alone a minimum of ${h.eur(A(h), 2)} a month per child, when the other parent contributes nothing or too little. It is paid by the CAF, or by the MSA for farming households, according to the ${h.src('spAsf', 'service-public.fr ASF page')}. The amount was uprated on 1 April 2026 with the other family benefits, per the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}.</p>
<p>Three conditions apply in every case: living alone, residing in France, and having at least one dependent child whose other parent has not contributed to their upkeep for at least a month, or pays maintenance below ${h.eur(A(h), 2)}. The allowance is due from the month after the separation.</p>

<h2>Four situations, four treatments</h2>
<h3>Maintenance set but unpaid</h3>
<p>A judge, or a divorce agreement lodged with a notary, set maintenance, and it does not arrive, or not in full. The CAF pays the ASF as an advance, then can act on your behalf to recover the maintenance, up to two years of arrears. For two children, the advance is ${h.eur(asf(h, 2), 2)} a month.</p>
<h3>A parent who cannot pay</h3>
<p>Insolvency, unemployment, prison, the RSA: when the other parent is unable to support the child, the CAF looks at their situation and may pay the ASF. It tells you whether you should still take steps to have maintenance set.</p>
<h3>No maintenance set</h3>
<p>The ASF is paid for four months. To keep it, you must within that time apply to the family court judge, or ask for a review of a ruling that set no maintenance.</p>
<h3>Maintenance that is too low</h3>
<p>This is the differential ASF: the CAF tops the maintenance up to ${h.eur(A(h), 2)}. The top-up is due monthly but paid in one go every three months; the page adds that it is not paid when the difference is very small.</p>
<!--mini:asfDifferentielle-->

<h2>How much, depending on the maintenance received</h2>
<p>The sum is simple, per child: ${h.eur(A(h), 2)} minus the maintenance actually received. The table gives the monthly ASF for one and two children.</p>
${h.table(['Maintenance received per child', 'ASF, 1 child', 'ASF, 2 children', 'Total received per child'], [0, 50, 100, 150].map((p) => [h.eur(p), h.eur(asf(h, 1, p), 2), h.eur(asf(h, 2, p), 2), h.eur(asf(h, 1, p) + p, 2)]), 'Family support allowance 2026, monthly amounts net of CRDS (estimate)', ['l', 'r', 'r', 'r'])}
<p>Whatever the maintenance below the threshold, the parent ends up with ${h.eur(A(h), 2)} per child in total. Above it, the maintenance is enough and no ASF is due.</p>

<h2>A year on the ASF</h2>
<p>Sarah is raising her two children alone. The divorce ruling set maintenance at €100 per child, which the father pays regularly. She receives the differential ASF: ${h.eur(asf(h, 2, 100), 2)} a month for both, paid in one go every three months, so ${h.eur(asf(h, 2, 100) * 3, 2)} a quarter. In spring the father stops paying. A month later Sarah reports it: the CAF then pays her the full ASF as an advance, ${h.eur(asf(h, 2), 2)} a month, and takes over chasing the father for what he owes. In the autumn Sarah moves in with her new partner: the ASF ends, even though the maintenance is still unpaid.</p>
<p>This path shows the two things to watch: report missed maintenance quickly, to move from the differential to the full ASF, and report moving in with someone quickly, to avoid repaying months received in error.</p>

<h2>What ends the ASF</h2>
<p>Living as a couple, first of all. Service-public.fr is explicit: the ASF ends if you live with a partner. A mother alone with three children and no maintenance loses ${h.eur(asf(h, 3), 2)} a month by moving in with someone. Next, regular payment of maintenance at least equal to ${h.eur(A(h), 2)}. Finally, taking no court action beyond four months when no maintenance was ever set.</p>
<p>The ASF does not depend on the parent's income: it comes on top of ${h.a('allocations-familiales-2-enfants', 'family allowance')}, and for a single parent of three, the ${h.a('complement-familial', 'family supplement')}, whose ceilings are then those of a two-income couple.</p>

<h2>Making the claim</h2>
<p>The claim is made on form cerfa 12038, together with form 11423 (the CAF's general situation declaration) and the documents your case calls for: court ruling, divorce agreement, proof of unpaid maintenance. For the MSA, farming households use that scheme's own forms. The ${h.a('simulateur-allocations-familiales', 'family allowance calculator')} rounds out the estimate for the household's other benefits.</p>
`,
  },
});
