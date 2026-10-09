import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Cas types : durée par parent avant déduction des indemnités postnatales. */
const cas = (h: Helpers) => [
  { k: 'a', r: h.M.prepare({ mode: 'plein', enfants: 1, couple: true }) },
  { k: 'b', r: h.M.prepare({ mode: 'plein', enfants: 1, couple: false }) },
  { k: 'c', r: h.M.prepare({ mode: 'mi-temps', enfants: 2, couple: true }) },
  { k: 'd', r: h.M.prepare({ mode: 'partiel', enfants: 2, couple: true }) },
  { k: 'e', r: h.M.prepare({ mode: 'plein', enfants: 3, couple: true, majoree: true }) },
];
const lib = {
  fr: { a: 'Couple, 1 enfant, arrêt total', b: 'Parent isolé, 1 enfant, arrêt total', c: 'Couple, 2 enfants, mi-temps', d: 'Couple, 2 enfants, 80 %', e: 'Couple, 3 enfants, PreParE majorée' },
  en: { a: 'Couple, 1 child, full stop', b: 'Single parent, 1 child, full stop', c: 'Couple, 2 children, half-time', d: 'Couple, 2 children, 80%', e: 'Couple, 3 children, higher rate' },
};
const tableau = (h: Helpers, l: 'fr' | 'en') => h.table(
  l === 'fr' ? ['Situation', 'Par mois', 'Durée max. par parent', 'Total'] : ['Situation', 'Per month', 'Max. length per parent', 'Total'],
  cas(h).map((c) => [lib[l][c.k as keyof typeof lib.fr], h.eur(c.r.mensuel, 2), l === 'fr' ? `${c.r.dureeMois} mois` : `${c.r.dureeMois} months`, h.eur(c.r.total)]),
  l === 'fr' ? 'Barème 2026, avant déduction des mois d’indemnités postnatales (estimation)' : '2026 scale, before deducting months of post-natal benefit (estimate)',
  ['l', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'simulateur-prepare',
  group: 'famille',
  order: 260,
  tool: 'prepare',
  related: ['prepare-temps-partiel', 'prepare-duree', 'prepare-majoree', 'simulateur-prime-naissance', 'allocation-base-paje'],
  sources: ['spPrepare', 'instructionPf2026'],
  fr: {
    slug: 'simulateur-prepare',
    nav: 'Simulateur PreParE',
    card: 'Le montant et la durée de la PreParE, l’aide de la CAF pendant le congé parental, selon votre temps de travail et vos enfants.',
    title: 'PreParE 2026 : montant du congé parental et simulateur',
    description: 'PreParE 2026 : 459,70 € par mois en arrêt total, 297,17 € à mi-temps, 171,42 € entre 50 et 80 %, 751,40 € en majorée. Simulateur du montant et de la durée.',
    h1: 'Simulateur de la PreParE',
    intro: 'Choisissez votre temps de travail pendant le congé parental, le nombre d’enfants et votre situation : l’outil donne le montant mensuel, la durée et le total.',
    resume: (h) => `En 2026, la PreParE, prestation partagée d’éducation de l’enfant versée pendant un congé parental, vaut ${h.eur(h.P.prepare.taux_plein, 2)} par mois pour un parent qui cesse totalement de travailler, ${h.eur(h.P.prepare.partiel_50, 2)} pour un temps partiel de 50 % au plus et ${h.eur(h.P.prepare.partiel_50_80, 2)} entre 50 et 80 %. Elle ne dépend pas des revenus du foyer. La durée change tout : un couple avec un seul enfant a droit à ${h.P.prepare.duree.un_enfant_mois} mois par parent avant le premier anniversaire, soit ${h.eur(cas(h)[0].r.total)} au plus pour un parent en arrêt total ; à partir de deux enfants, chaque parent peut la percevoir ${h.P.prepare.duree.deux_enfants_mois} mois, jusqu’aux 3 ans du plus jeune. Un parent isolé la garde jusqu’au premier anniversaire ou jusqu’aux 3 ans. Avec trois enfants ou plus, la PreParE majorée verse ${h.eur(h.P.prepare.majoree, 2)} pendant ${h.P.prepare.duree.majoree_mois} mois par parent en couple. Il faut avoir validé au moins 8 trimestres de cotisations vieillesse. Ces chiffres sont des estimations, la CAF décide.`,
    faqs: (h) => [
      { q: 'Le simulateur PreParE tient-il compte de mon salaire ?', a: `Non, et c’est normal : la PreParE n’est pas soumise à condition de ressources. Le montant dépend seulement du temps de travail conservé, ${h.eur(h.P.prepare.taux_plein, 2)}, ${h.eur(h.P.prepare.partiel_50, 2)} ou ${h.eur(h.P.prepare.partiel_50_80, 2)} par mois en 2026. Votre salaire sert ailleurs : la condition des 8 trimestres de cotisations vieillesse, appréciée sur deux, quatre ou cinq ans selon le nombre d’enfants (fiche F32485).` },
      { q: 'Pourquoi le simulateur affiche-t-il moins de mois que prévu ?', a: `Pour deux enfants ou plus en couple, la fiche F32485 réduit les ${h.P.prepare.duree.deux_enfants_mois} mois du nombre de mois d’indemnités journalières postnatales de maternité. Service-public donne l’exemple d’une mère qui perçoit la PreParE 21 mois pour un deuxième enfant. Le droit s’ouvre aussi au premier mois plein de congé parental, ce qui peut retirer un mois. Le détail figure sur la page consacrée à la durée.` },
      { q: 'Les deux parents peuvent-ils toucher la PreParE en même temps ?', a: `Oui, simultanément ou l’un après l’autre. Mais quand deux PreParE sont cumulées le même mois, leur total ne peut pas dépasser ${h.eur(h.P.prepare.taux_plein, 2)}, selon la fiche F32485. Deux parents à mi-temps reçoivent donc ${h.eur(h.P.prepare.partiel_50 * 2, 2)} théoriques ramenés à ${h.eur(h.P.prepare.taux_plein, 2)}. Pour la PreParE majorée, le plafond commun est de ${h.eur(h.P.prepare.majoree, 2)}.` },
    ],
    body: (h) => `
<h2>Ce que calcule l’outil</h2>
<p>Trois réponses suffisent : le temps de travail conservé (arrêt total, 50 % ou moins, de 50 à 80 %), le nombre d’enfants à charge, et si vous vivez en couple ou seul. L’outil en tire le montant mensuel, la durée maximale pour le parent concerné et le total sur cette durée. Pour trois enfants et plus en arrêt total, il compare aussi la PreParE majorée.</p>
<p>Les montants sont ceux de la ${h.src('spPrepare', 'fiche F32485 de service-public')}, revalorisés au 1er avril 2026 par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}. La PreParE est versée chaque mois à terme échu : le mois de janvier est payé début février.</p>

<h2>Cas types</h2>
${tableau(h, 'fr')}
<p>La deuxième ligne montre l’avantage du parent isolé avec un enfant : jusqu’au premier anniversaire, contre ${h.P.prepare.duree.un_enfant_mois} mois par parent pour un couple. La dernière montre l’arbitrage de la majorée : un montant plus fort, sur une durée bien plus courte.</p>

<h2>Ce que l’outil ne fait pas</h2>
<p>Il ne vérifie pas la condition d’activité antérieure : au moins 8 trimestres de cotisations vieillesse sur les deux dernières années pour un enfant, quatre ans pour deux, cinq ans pour trois et plus. Il ne retire pas automatiquement les mois d’indemnités postnatales, que la page ${h.a('prepare-duree', 'durée de la PreParE')} permet de déduire. Il ne traite pas l’adoption, ni les cas de prolongation prévus par la fiche.</p>
<p>Il ignore enfin les règles de cumul. La PreParE ne se cumule pas avec les indemnités de congés payés ni avec le complément familial ; avec les indemnités de congé maternité ou paternité, seulement dans des cas précis listés par service-public. La demande se fait avec le formulaire cerfa n° 12324, après la fin de l’indemnisation du congé maternité.</p>
<p>Pour les détails : ${h.a('prepare-temps-partiel', 'PreParE à temps partiel')}, ${h.a('prepare-majoree', 'PreParE majorée')}. Avant la naissance, le ${h.a('simulateur-prime-naissance', 'simulateur de la prime de naissance')} estime la prime et l’allocation de base.</p>
`,
  },
  en: {
    slug: 'parental-leave-benefit-calculator',
    nav: 'Parental leave benefit calculator',
    card: 'How much the PreParE, the CAF benefit paid during parental leave, brings in and for how long, by working time and children.',
    title: 'PreParE 2026: Parental Leave Benefit Calculator, Amounts',
    description: 'PreParE 2026, the French parental leave benefit: €459.70 a month for a full stop, €297.17 half-time, €171.42 at 50 to 80%, €751.40 higher rate. Amounts, length.',
    h1: 'Parental leave benefit (PreParE) calculator',
    intro: 'Choose your working time during parental leave, your number of children and household type: the tool gives the monthly amount, the length and the total.',
    resume: (h) => `In 2026, the PreParE (prestation partagée d’éducation de l’enfant, the shared child-rearing benefit that the CAF family benefits office pays during parental leave) is ${h.eur(h.P.prepare.taux_plein, 2)} a month for a parent who stops work completely, ${h.eur(h.P.prepare.partiel_50, 2)} for part-time work of 50% or less, and ${h.eur(h.P.prepare.partiel_50_80, 2)} between 50 and 80%. It does not depend on household income. Length is what really matters: a couple with one child gets ${h.P.prepare.duree.un_enfant_mois} months per parent before the first birthday, so at most ${h.eur(cas(h)[0].r.total)} for a parent who stops work; from the second child, each parent can receive it for ${h.P.prepare.duree.deux_enfants_mois} months, up to the youngest child’s third birthday. A single parent keeps it until the first birthday or until age 3. With three or more children, the higher-rate PreParE (PreParE majorée) pays ${h.eur(h.P.prepare.majoree, 2)} for ${h.P.prepare.duree.majoree_mois} months per parent in a couple. At least 8 quarters of pension contributions are required. These are estimates; the CAF decides.`,
    faqs: (h) => [
      { q: 'Does the PreParE calculator take my salary into account?', a: `No, and rightly so: the PreParE is not means-tested. The amount depends only on the working time you keep: ${h.eur(h.P.prepare.taux_plein, 2)}, ${h.eur(h.P.prepare.partiel_50, 2)} or ${h.eur(h.P.prepare.partiel_50_80, 2)} a month in 2026. Your pay matters elsewhere, for the condition of 8 quarters of pension contributions, assessed over two, four or five years depending on the number of children (sheet F32485).` },
      { q: 'Why does the calculator show fewer months than I expected?', a: `For couples with two or more children, sheet F32485 cuts the ${h.P.prepare.duree.deux_enfants_mois} months by the number of months of post-natal maternity daily benefit. Service-public.fr gives the case of a mother receiving the PreParE for 21 months for a second child. Entitlement also starts with the first full month of parental leave, which can cost a month. The page on length goes into detail.` },
      { q: 'Can both parents receive the PreParE at the same time?', a: `Yes, together or one after the other. But when two PreParE payments overlap in the same month, their total cannot exceed ${h.eur(h.P.prepare.taux_plein, 2)}, according to sheet F32485. Two half-time parents would in theory get ${h.eur(h.P.prepare.partiel_50 * 2, 2)}, capped at ${h.eur(h.P.prepare.taux_plein, 2)}. For the higher-rate PreParE, the joint cap is ${h.eur(h.P.prepare.majoree, 2)}.` },
    ],
    body: (h) => `
<h2>What the tool works out</h2>
<p>Three answers are enough: the working time you keep (none, 50% or less, 50 to 80%), the number of dependent children, and whether you live as a couple or alone. The tool returns the monthly amount, the maximum length for that parent and the total over that period. For three or more children with a full stop, it also compares the higher-rate PreParE.</p>
<p>Amounts come from ${h.src('spPrepare', 'service-public.fr sheet F32485')}, uprated on 1 April 2026 by the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}. The PreParE is paid monthly in arrears: January is paid at the start of February.</p>

<h2>Sample cases</h2>
${tableau(h, 'en')}
<p>The second row shows the single parent’s advantage with one child: up to the first birthday, against ${h.P.prepare.duree.un_enfant_mois} months per parent in a couple. The last row shows the higher-rate trade-off: more per month, for a much shorter time.</p>

<h2>What the tool does not do</h2>
<p>It does not check the work-history condition: at least 8 quarters of pension contributions over the last two years for one child, four years for two, five years for three or more. It does not automatically deduct months of post-natal benefit; the page on ${h.a('prepare-duree', 'PreParE length')} lets you do that. It leaves out adoption and the extension cases set out in the sheet.</p>
<p>Nor does it apply the rules on combining benefits. The PreParE cannot be combined with paid-holiday pay or the complément familial (family supplement), and only in specific cases listed by service-public.fr with maternity or paternity leave pay. The claim uses form cerfa no. 12324, sent once maternity leave pay has ended.</p>
<p>More detail: ${h.a('prepare-temps-partiel', 'part-time PreParE')} and ${h.a('prepare-majoree', 'higher-rate PreParE')}. Before the birth, the ${h.a('simulateur-prime-naissance', 'birth grant calculator')} estimates the grant and the basic allowance.</p>
`,
  },
});
