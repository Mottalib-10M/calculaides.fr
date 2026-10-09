import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Salarié au Smic net : salaire supposé proportionnel au temps de travail (approximation affichée comme telle). */
const smic = (h: Helpers) => h.P.smic.mensuel_net;
const pp = (h: Helpers, mode: 'plein' | 'mi-temps' | 'partiel') => h.M.prepare({ mode, enfants: 2, couple: true });
const lignes = (h: Helpers) => [
  { q: 1, pre: 0 },
  { q: 0.8, pre: pp(h, 'partiel').mensuel },
  { q: 0.5, pre: pp(h, 'mi-temps').mensuel },
  { q: 0, pre: pp(h, 'plein').mensuel },
];

export default defineGuide({
  id: 'prepare-temps-partiel',
  group: 'famille',
  order: 270,
  mini: 'prepareTempsPartiel',
  miniHref: 'simulateur-prepare',
  related: ['simulateur-prepare', 'prepare-duree', 'prepare-majoree', 'allocation-base-paje', 'prime-activite-temps-partiel'],
  sources: ['spPrepare', 'instructionPf2026', 'spSmic'],
  fr: {
    slug: 'prepare-temps-partiel',
    nav: 'PreParE à temps partiel',
    card: 'Congé parental à 50 % ou à 80 % : le montant de la PreParE 2026 et ce qu’il reste à la fin du mois.',
    title: 'PreParE 2026 : congé parental à temps partiel, montants',
    description: 'PreParE 2026 à temps partiel : 297,17 € par mois jusqu’à 50 % de temps de travail, 171,42 € de 50 à 80 %. Au-delà de 80 %, rien. Exemples chiffrés au Smic.',
    h1: 'La PreParE à temps partiel : 50 %, 80 %, ce que ça change',
    intro: 'La PreParE n’est pas réservée aux parents qui s’arrêtent : un congé parental à mi-temps ou à 80 % ouvre aussi droit à une aide, plus petite.',
    resume: (h) => `À temps partiel, la PreParE vaut ${h.eur(h.P.prepare.partiel_50, 2)} par mois en 2026 pour un parent qui travaille 50 % ou moins, et ${h.eur(h.P.prepare.partiel_50_80, 2)} entre 50 et 80 %. Au-delà de 80 % de temps de travail, elle n’est pas due. Ces montants sont fixes : ils ne dépendent ni du salaire ni des revenus du foyer. La durée est la même qu’en arrêt total : pour un couple avec deux enfants ou plus, jusqu’à ${h.P.prepare.duree.deux_enfants_mois} mois par parent avant les 3 ans du plus jeune. Prenons un salarié au Smic, ${h.eur(smic(h), 2)} net par mois à temps plein, qui passe à 80 % : son salaire tombe à environ ${h.eur(smic(h) * 0.8)} et la PreParE ajoute ${h.eur(h.P.prepare.partiel_50_80, 2)}, soit un revenu mensuel proche de ${h.eur(smic(h) * 0.8 + h.P.prepare.partiel_50_80)}. À mi-temps, il garde environ ${h.eur(smic(h) * 0.5 + h.P.prepare.partiel_50)}. Les deux parents peuvent la toucher ensemble, dans la limite de ${h.eur(h.P.prepare.taux_plein, 2)} par mois pour le couple. Ce sont des estimations, la CAF calcule le droit.`,
    faqs: (h) => [
      { q: 'Je passe à 4 jours sur 5 en congé parental, combien la CAF me verse-t-elle ?', a: `${h.eur(h.P.prepare.partiel_50_80, 2)} par mois en 2026. Quatre jours sur cinq correspondent à 80 % de temps de travail, dans la tranche comprise entre 50 % et 80 % de la fiche F32485 de service-public. Ce montant est le même quel que soit votre salaire. Pour un couple avec deux enfants, il peut être versé jusqu’à ${h.P.prepare.duree.deux_enfants_mois} mois, moins les mois d’indemnités postnatales.` },
      { q: 'À 85 % de temps de travail, ai-je droit à la PreParE ?', a: `Non. La fiche F32485 de service-public ne prévoit que trois situations : activité totalement interrompue (${h.eur(h.P.prepare.taux_plein, 2)}), temps partiel de 50 % maximum (${h.eur(h.P.prepare.partiel_50, 2)}) et temps partiel compris entre 50 % et 80 % (${h.eur(h.P.prepare.partiel_50_80, 2)}). Au-delà de 80 %, aucune tranche ne s’applique. Pour toucher l’aide, il faut descendre à 80 % ou moins.` },
      { q: `Nous sommes tous les deux à mi-temps, chacun touche-t-il ${h.eur(h.P.prepare.partiel_50, 2)} ?`, a: `Pas tout à fait. Les deux parents peuvent percevoir la PreParE en même temps, mais le total des deux ne peut pas dépasser ${h.eur(h.P.prepare.taux_plein, 2)} par mois, selon la fiche F32485. Deux mi-temps donneraient ${h.eur(h.P.prepare.partiel_50 * 2, 2)} : la CAF ramène l’ensemble à ${h.eur(h.P.prepare.taux_plein, 2)}. Deux parents à 80 % touchent en revanche ${h.eur(h.P.prepare.partiel_50_80 * 2, 2)}, sous le plafond.` },
      { q: 'Mon salaire à temps partiel réduit-il la PreParE ?', a: `Non. Le salaire du temps travaillé n’est pas déduit : pour la PreParE à taux partiel, la fiche F32485 n’exclut le cumul avec un salaire que pour le temps non travaillé. Un parent à mi-temps garde donc son demi-salaire et touche ${h.eur(h.P.prepare.partiel_50, 2)} en plus. Le montant ne varie pas selon le niveau de rémunération, du Smic au salaire de cadre.` },
      { q: 'Je suis indépendant, puis-je toucher la PreParE à temps partiel ?', a: `Oui, si vous réduisez votre activité, mais la preuve se fait autrement que pour un salarié. Service-public indique qu’un travailleur non salarié doit prouver qu’il a réduit ou cessé son activité, et renvoie vers la CAF ou la MSA pour les justificatifs. Le montant reste celui du barème : ${h.eur(h.P.prepare.partiel_50, 2)} jusqu’à 50 % d’activité, ${h.eur(h.P.prepare.partiel_50_80, 2)} jusqu’à 80 %.` },
      { q: 'Mes trimestres de chômage comptent-ils pour avoir la PreParE à temps partiel ?', a: `Pas pour un premier enfant. La fiche F32485 exige 8 trimestres de cotisations vieillesse sur les deux dernières années quand vous avez un enfant à charge, et précise que les trimestres validés grâce au chômage indemnisé ne sont pas retenus. Avec deux enfants, la période s’étend à quatre ans, avec trois à cinq ans. Sans ces trimestres, ni les ${h.eur(h.P.prepare.partiel_50_80, 2)} ni les ${h.eur(h.P.prepare.partiel_50, 2)} ne sont dus.` },
    ],
    body: (h) => `
<h2>Trois tranches de temps de travail</h2>
${h.table(['Temps de travail conservé', 'PreParE par mois', 'Écart avec l’arrêt total'], [['0 % (arrêt total)', h.eur(h.P.prepare.taux_plein, 2), ''], ['50 % ou moins', h.eur(h.P.prepare.partiel_50, 2), h.eur(h.P.prepare.taux_plein - h.P.prepare.partiel_50, 2)], ['De 50 à 80 %', h.eur(h.P.prepare.partiel_50_80, 2), h.eur(h.P.prepare.taux_plein - h.P.prepare.partiel_50_80, 2)], ['Plus de 80 %', h.eur(0), '']], 'Montants mensuels de la PreParE, 2026', ['l', 'r', 'r'])}
<p>Le barème vient de la ${h.src('spPrepare', 'fiche F32485 de service-public')}, montants revalorisés au 1er avril 2026 par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}. Les frontières comptent : un mi-temps exact reste dans la tranche des 50 % ou moins, un 80 % exact dans la tranche intermédiaire.</p>
<!--mini:prepareTempsPartiel-->

<h2>Ce qui reste à la fin du mois, au Smic</h2>
<p>Le montant seul ne dit pas grand-chose. Ce qui intéresse un parent, c’est le revenu du mois une fois le temps de travail réduit. Le tableau prend un salarié au Smic, ${h.eur(smic(h), 2)} net par mois à temps plein selon la ${h.src('spSmic', 'fiche Smic de service-public')}, et suppose un salaire proportionnel au temps travaillé. C’est une approximation : les cotisations ne sont pas tout à fait linéaires.</p>
${h.table(['Temps de travail', 'Salaire net estimé', 'PreParE', 'Revenu du mois'], lignes(h).map((x) => [h.pct(x.q, 0), h.eur(smic(h) * x.q), h.eur(x.pre, 2), h.eur(smic(h) * x.q + x.pre)]), 'Salarié au Smic, couple avec deux enfants (estimation)', ['l', 'r', 'r', 'r'])}
<p>Passer de 100 % à 80 % coûte environ ${h.eur(smic(h) * 0.2 - h.P.prepare.partiel_50_80)} par mois au Smic. Passer à mi-temps en coûte environ ${h.eur(smic(h) * 0.5 - h.P.prepare.partiel_50)}. Plus le salaire est élevé, plus l’écart se creuse, puisque l’aide ne suit pas la rémunération. Un temps partiel peut aussi ouvrir ou augmenter la ${h.a('prime-activite-temps-partiel', 'prime d’activité')}, à vérifier à part.</p>

<h2>Deux parents à 80 %, ou un seul à l’arrêt ?</h2>
<p>Beaucoup de couples hésitent entre deux formules pour un deuxième enfant : l’un des parents s’arrête complètement, ou les deux passent à 4 jours. Avant déduction des indemnités postnatales, la première rapporte ${h.eur(h.M.prepare({ mode: 'plein', enfants: 2, couple: true }).total)} sur ${h.P.prepare.duree.deux_enfants_mois} mois. La seconde, ${h.eur(h.P.prepare.partiel_50_80, 2)} pour chacun pendant ${h.P.prepare.duree.deux_enfants_mois} mois, donne ${h.eur(h.M.prepare({ mode: 'partiel', enfants: 2, couple: true }).total * 2)} au total, sous le plafond commun de ${h.eur(h.P.prepare.taux_plein, 2)} par mois. L’aide est plus faible, mais chaque parent garde 80 % de son salaire et sa place dans l’entreprise. Le calcul qui compte se fait donc sur les deux salaires, pas sur la seule PreParE.</p>

<h2>Comment on obtient un congé parental à temps partiel</h2>
<h3>Salarié du privé</h3>
<p>Il faut prendre un congé parental à temps partiel auprès de l’employeur. La PreParE n’est pas le congé : c’est l’aide de la CAF qui l’accompagne. La demande se fait avec le formulaire cerfa n° 12324, accompagné du cerfa n° 11423 pour un parent qui n’est pas encore allocataire.</p>
<h3>Agent public</h3>
<p>Un fonctionnaire peut prendre un congé parental ou un temps partiel, selon la fiche F32485. Les deux ouvrent la PreParE dans les mêmes tranches.</p>
<h3>Travailleur indépendant</h3>
<p>Il doit prouver la réduction de son activité ; la CAF ou la MSA précisent les pièces demandées.</p>

<h2>Les pièges du temps partiel</h2>
<p>Pendant un congé maternité ou maladie, la PreParE à taux partiel n’est versée que si elle avait commencé avant les indemnités. Elle ne se cumule pas avec les indemnités de congés payés ni avec le complément familial. Et pour un couple avec un seul enfant, la durée reste limitée à ${h.P.prepare.duree.un_enfant_mois} mois par parent avant le premier anniversaire : un temps partiel ne la rallonge pas. Les règles de durée sont détaillées sur la page ${h.a('prepare-duree', 'durée de la PreParE')}.</p>
<p>Le parent isolé suit le même calendrier à temps partiel qu’en arrêt total : jusqu’au premier anniversaire avec un enfant, jusqu’aux 3 ans du plus jeune à partir de deux. Une mère seule de deux enfants à 80 % peut donc percevoir ${h.eur(h.P.prepare.partiel_50_80, 2)} par mois pendant trois ans au plus, ${h.eur(h.M.prepare({ mode: 'partiel', enfants: 2, couple: false }).total)} au total, sans condition de ressources et en plus du salaire de ses heures travaillées.</p>
<p>Avec trois enfants ou plus, une autre option existe, mais seulement en arrêt total : la ${h.a('prepare-majoree', 'PreParE majorée')}. Le ${h.a('simulateur-prepare', 'simulateur de la PreParE')} compare toutes les formules ; l’${h.a('allocation-base-paje', 'allocation de base')} peut s’y ajouter jusqu’aux 3 ans.</p>
`,
  },
  en: {
    slug: 'part-time-parental-leave-benefit',
    nav: 'Part-time PreParE',
    card: 'Parental leave at 50% or 80%: the 2026 PreParE amount and what you are left with at the end of the month.',
    title: 'PreParE 2026: Part-Time Parental Leave Benefit Amounts',
    description: 'Part-time PreParE 2026: €297.17 a month when working 50% or less, €171.42 between 50 and 80%. Nothing above 80%. Worked examples on the French minimum wage.',
    h1: 'Part-time PreParE: what 50% or 80% changes',
    intro: 'The PreParE is not only for parents who stop work: part-time parental leave at half-time or 80% also brings a payment, a smaller one.',
    resume: (h) => `When working part-time, the PreParE (prestation partagée d’éducation de l’enfant, the shared child-rearing benefit the CAF family benefits office pays during parental leave) is ${h.eur(h.P.prepare.partiel_50, 2)} a month in 2026 for a parent working 50% or less, and ${h.eur(h.P.prepare.partiel_50_80, 2)} between 50 and 80%. Above 80% of normal hours, nothing is due. These are flat amounts: they depend neither on pay nor on household income. The length is the same as for a full stop: for a couple with two or more children, up to ${h.P.prepare.duree.deux_enfants_mois} months per parent before the youngest turns 3. Take an employee on the Smic (the French minimum wage), ${h.eur(smic(h), 2)} net a month full-time, who drops to 80%: pay falls to about ${h.eur(smic(h) * 0.8)} and the PreParE adds ${h.eur(h.P.prepare.partiel_50_80, 2)}, for a monthly income of around ${h.eur(smic(h) * 0.8 + h.P.prepare.partiel_50_80)}. At half-time, they keep about ${h.eur(smic(h) * 0.5 + h.P.prepare.partiel_50)}. Both parents can claim at once, within a joint cap of ${h.eur(h.P.prepare.taux_plein, 2)} a month. These are estimates; the CAF decides.`,
    faqs: (h) => [
      { q: 'I am moving to four days a week on parental leave: how much does the CAF pay?', a: `${h.eur(h.P.prepare.partiel_50_80, 2)} a month in 2026. Four days out of five is 80% of normal hours, inside the 50 to 80% band of service-public.fr sheet F32485. The amount is the same whatever your salary. For a couple with two children, it can be paid for up to ${h.P.prepare.duree.deux_enfants_mois} months, less the months of post-natal maternity benefit.` },
      { q: 'At 85% of my normal hours, can I get the PreParE?', a: `No. Sheet F32485 provides for three situations only: work stopped completely (${h.eur(h.P.prepare.taux_plein, 2)}), part-time of at most 50% (${h.eur(h.P.prepare.partiel_50, 2)}) and part-time between 50 and 80% (${h.eur(h.P.prepare.partiel_50_80, 2)}). Above 80%, no band applies. To receive the benefit, you need to go down to 80% or less.` },
      { q: `We are both working half-time: does each of us get ${h.eur(h.P.prepare.partiel_50, 2)}?`, a: `Not quite. Both parents can receive the PreParE at the same time, but the two together cannot exceed ${h.eur(h.P.prepare.taux_plein, 2)} a month, according to sheet F32485. Two half-time claims would come to ${h.eur(h.P.prepare.partiel_50 * 2, 2)}, which the CAF brings down to ${h.eur(h.P.prepare.taux_plein, 2)}. Two parents at 80%, on the other hand, get ${h.eur(h.P.prepare.partiel_50_80 * 2, 2)}, below the cap.` },
      { q: 'Does my part-time salary reduce the PreParE?', a: `No. Pay for the hours you work is not deducted: for part-rate PreParE, sheet F32485 only rules out combining it with a salary for the time not worked. A half-time parent therefore keeps half their pay and gets ${h.eur(h.P.prepare.partiel_50, 2)} on top. The amount does not vary with earnings, from the minimum wage to a manager’s salary.` },
      { q: 'I am self-employed: can I get part-time PreParE?', a: `Yes, if you scale back your business, but the proof works differently from an employee’s. Service-public.fr says a self-employed person must show that they have reduced or stopped their activity, and refers you to the CAF or the MSA (the farming scheme) for the documents. The amount follows the scale: ${h.eur(h.P.prepare.partiel_50, 2)} up to 50% activity, ${h.eur(h.P.prepare.partiel_50_80, 2)} up to 80%.` },
      { q: 'Do quarters spent on unemployment benefit count towards part-time PreParE?', a: `Not for a first child. Sheet F32485 requires 8 quarters of pension contributions over the last two years when you have one dependent child, and states that quarters credited through paid unemployment do not count. With two children the period extends to four years, with three to five years. Without those quarters, neither the ${h.eur(h.P.prepare.partiel_50_80, 2)} nor the ${h.eur(h.P.prepare.partiel_50, 2)} is due.` },
    ],
    body: (h) => `
<h2>Three bands of working time</h2>
${h.table(['Working time kept', 'PreParE per month', 'Gap with a full stop'], [['0% (full stop)', h.eur(h.P.prepare.taux_plein, 2), ''], ['50% or less', h.eur(h.P.prepare.partiel_50, 2), h.eur(h.P.prepare.taux_plein - h.P.prepare.partiel_50, 2)], ['50 to 80%', h.eur(h.P.prepare.partiel_50_80, 2), h.eur(h.P.prepare.taux_plein - h.P.prepare.partiel_50_80, 2)], ['Over 80%', h.eur(0), '']], 'Monthly PreParE amounts, 2026', ['l', 'r', 'r'])}
<p>The scale comes from ${h.src('spPrepare', 'service-public.fr sheet F32485')}, with amounts uprated on 1 April 2026 by the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}. The boundaries matter: exactly half-time stays in the 50%-or-less band, and exactly 80% in the middle band.</p>
<!--mini:prepareTempsPartiel-->

<h2>What is left at the end of the month on the minimum wage</h2>
<p>The benefit on its own says little. What a parent wants to know is their monthly income once hours are cut. The table takes an employee on the Smic, ${h.eur(smic(h), 2)} net a month full-time according to the ${h.src('spSmic', 'service-public.fr minimum wage sheet')}, and assumes pay falls in line with hours. That is an approximation, since social contributions are not perfectly proportional.</p>
${h.table(['Working time', 'Estimated net pay', 'PreParE', 'Monthly income'], lignes(h).map((x) => [h.pct(x.q, 0), h.eur(smic(h) * x.q), h.eur(x.pre, 2), h.eur(smic(h) * x.q + x.pre)]), 'Minimum-wage employee, couple with two children (estimate)', ['l', 'r', 'r', 'r'])}
<p>Going from 100% to 80% costs about ${h.eur(smic(h) * 0.2 - h.P.prepare.partiel_50_80)} a month on the minimum wage; going half-time costs about ${h.eur(smic(h) * 0.5 - h.P.prepare.partiel_50)}. The higher the salary, the bigger the gap, because the benefit does not follow pay. Part-time work may also open or increase the ${h.a('prime-activite-temps-partiel', 'prime d’activité')} (in-work top-up), which is worth checking separately.</p>

<h2>Both parents at 80%, or one at home full-time?</h2>
<p>Many couples weigh two options for a second child: one parent stops work completely, or both drop to four days a week. Before deducting post-natal benefit months, the first brings ${h.eur(h.M.prepare({ mode: 'plein', enfants: 2, couple: true }).total)} over ${h.P.prepare.duree.deux_enfants_mois} months. The second, ${h.eur(h.P.prepare.partiel_50_80, 2)} each for ${h.P.prepare.duree.deux_enfants_mois} months, adds up to ${h.eur(h.M.prepare({ mode: 'partiel', enfants: 2, couple: true }).total * 2)}, under the joint cap of ${h.eur(h.P.prepare.taux_plein, 2)} a month. The benefit is smaller, but each parent keeps 80% of their salary and their foothold at work. The sum that really matters is therefore the one that includes both salaries, not the PreParE alone.</p>

<h2>How to get part-time parental leave</h2>
<h3>Private-sector employee</h3>
<p>You take part-time parental leave (congé parental à temps partiel) with your employer. The PreParE is not the leave itself but the CAF payment that goes with it. The claim uses form cerfa no. 12324, plus cerfa no. 11423 for a parent not yet known to the CAF.</p>
<h3>Public-sector employee</h3>
<p>A civil servant can take parental leave or work part-time, according to sheet F32485. Both open the PreParE in the same bands.</p>
<h3>Self-employed</h3>
<p>You must show that your activity has been reduced; the CAF or MSA will say which documents they need.</p>

<h2>Part-time pitfalls</h2>
<p>During maternity or sick leave, part-rate PreParE is only paid if it started before the daily benefits. It cannot be combined with paid-holiday pay or with the complément familial (family supplement). And for a couple with one child, the length stays at ${h.P.prepare.duree.un_enfant_mois} months per parent before the first birthday: working part-time does not stretch it. Length rules are set out on the ${h.a('prepare-duree', 'PreParE length')} page.</p>
<p>Single parents follow the same calendar at part-time as at a full stop: until the child’s first birthday with one child, until the youngest turns 3 with two or more. A lone parent of two working at 80% can therefore receive ${h.eur(h.P.prepare.partiel_50_80, 2)} a month for up to three years, ${h.eur(h.M.prepare({ mode: 'partiel', enfants: 2, couple: false }).total)} in total, without any income test and on top of the pay for the hours worked.</p>
<p>With three or more children there is another option, but only for a full stop: the ${h.a('prepare-majoree', 'higher-rate PreParE')}. The ${h.a('simulateur-prepare', 'PreParE calculator')} compares every formula, and the ${h.a('allocation-base-paje', 'basic allowance')} can come on top until age 3.</p>
`,
  },
});
