import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Un ou deux salaires au Smic net de 2026, selon la composition du foyer. */
const smic = (h: Helpers) => h.P.smic.mensuel_net;
const pa = (h: Helpers, o: { couple?: boolean; enfants?: number; deux?: boolean; iso?: boolean; autres?: number; fl?: boolean }) =>
  h.M.primeActivite({ couple: !!o.couple, enfants: o.enfants ?? 0, revenu1: smic(h), revenu2: o.deux ? smic(h) : 0, isoleMajore: o.iso, autres: o.autres, forfaitLogement: o.fl });
const af2 = (h: Helpers) => h.P.af.tranches_nettes.deux[0];
const foyers = (h: Helpers, l: 'fr' | 'en') => [
  [l === 'fr' ? 'Seul, sans enfant' : 'Single, no children', pa(h, {})],
  [l === 'fr' ? 'Seul, avec APL' : 'Single, with housing aid', pa(h, { fl: true })],
  [l === 'fr' ? 'Couple, un Smic' : 'Couple, one Smic', pa(h, { couple: true })],
  [l === 'fr' ? 'Couple, deux Smic' : 'Couple, two Smic', pa(h, { couple: true, deux: true })],
  [l === 'fr' ? 'Couple, un Smic, 1 enfant' : 'Couple, one Smic, 1 child', pa(h, { couple: true, enfants: 1 })],
  [l === 'fr' ? 'Couple, un Smic, 2 enfants, AF déduites' : 'Couple, one Smic, 2 children, family allowance deducted', pa(h, { couple: true, enfants: 2, autres: af2(h) })],
  [l === 'fr' ? 'Parent isolé, 1 enfant, majoré' : 'Lone parent, 1 child, higher rate', pa(h, { enfants: 1, iso: true })],
] as const;

export default defineGuide({
  id: 'prime-activite-smic',
  group: 'activite',
  order: 70,
  mini: 'paSmic',
  related: ['simulateur-prime-activite', 'prime-activite-celibataire', 'prime-activite-couple', 'prime-activite-parent-isole', 'prime-activite-bonification'],
  sources: ['spSmic', 'spPa', 'decretPa2026', 'cssD843'],
  fr: {
    slug: 'prime-activite-smic',
    nav: 'Au Smic',
    card: 'Le montant de la prime pour un salaire au Smic net, du célibataire à la famille.',
    title: 'Prime d’activité au Smic 2026 : montant selon le foyer',
    description: 'Prime d’activité 2026 au Smic net de 1 477,93 € : environ 231 € seul, 550 € en couple avec un salaire, bien plus avec enfants. Tableau par foyer et simulateur.',
    h1: 'La prime d’activité au Smic',
    intro: 'Au salaire minimum à temps plein, presque tous les foyers ont droit à la prime ; seul le montant varie, dans un rapport de un à quatre et plus.',
    resume: (h) => `Au Smic net de ${h.eur(smic(h), 2)} par mois, soit ${h.eur(h.P.smic.mensuel_brut, 2)} brut pour 35 heures, une personne seule sans aide au logement peut recevoir environ ${h.eur(pa(h, {}).prime)} de prime d’activité par mois au barème du 1er avril 2026. Le même salaire fait vivre un couple dont l’autre membre ne travaille pas : la prime monte alors vers ${h.eur(pa(h, { couple: true }).prime)}. Avec un enfant, elle approche ${h.eur(pa(h, { couple: true, enfants: 1 }).prime)} ; un parent seul avec un enfant, pendant la période majorée, reçoit ${h.eur(pa(h, { enfants: 1, iso: true }).prime)}. Deux Smic dans un couple sans enfant laissent encore ${h.eur(pa(h, { couple: true, deux: true }).prime)}. Partout, le calcul ajoute au forfaitaire ${h.eur(pa(h, {}).partRevenus, 2)} de part des revenus et une bonification de ${h.eur(pa(h, {}).bonif, 2)} par salaire au Smic, puis retire les ressources du foyer. Sur un an, la prime d’une personne seule au Smic représente ${h.eur(pa(h, {}).prime * 12)}, non imposables. Tous ces montants restent indicatifs, la décision appartenant à la CAF.`,
    faqs: (h) => [
      { q: 'Au Smic à temps plein, a-t-on droit à la prime d’activité ?', a: `Oui, dans presque tous les cas. Seul, sans enfant et sans aide au logement, la prime estimée atteint ${h.eur(pa(h, {}).prime)} par mois au barème d’avril 2026. Elle ne s’éteint, pour une personne seule, que vers ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))} de salaire net, bien au-dessus du Smic de ${h.eur(smic(h), 2)}. Encore faut-il la demander sur le site de la CAF.` },
      { q: 'Prime d’activité au Smic avec deux enfants, quel montant ?', a: `Pour un couple dont un seul travaille au Smic, environ ${h.eur(pa(h, { couple: true, enfants: 2, autres: af2(h) }).prime)} par mois une fois déduites les allocations familiales de ${h.eur(af2(h), 2)}. Sans elles, le calcul donnerait ${h.eur(pa(h, { couple: true, enfants: 2 }).prime)}. Le forfaitaire du foyer atteint ${h.eur(h.M.forfaitairePa(true, 2), 2)}, ce qui explique ce montant élevé.` },
      { q: 'Faut-il déclarer le Smic brut ou net à la CAF ?', a: `Le net, et plus précisément le montant net social qui figure sur le bulletin de paie, selon service-public. Au Smic à temps plein, c’est ${h.eur(smic(h), 2)} et non ${h.eur(h.P.smic.mensuel_brut, 2)}. Depuis le 1er mars 2025, ce montant est prérempli sur la déclaration trimestrielle : il suffit de le vérifier.` },
      { q: 'Combien rapporte la prime d’activité sur un an quand on est au Smic ?', a: `Pour une personne seule sans aide au logement, environ ${h.eur(pa(h, {}).prime * 12)} sur douze mois au barème d’avril 2026. Pour un couple avec un seul Smic, ${h.eur(pa(h, { couple: true }).prime * 12)}. Ces sommes ne sont pas imposables et ne se déclarent pas aux impôts, selon la fiche F2882. Elles supposent un salaire stable toute l’année.` },
      { q: 'Un mois d’heures supplémentaires au Smic réduit-il la prime ?', a: `Un peu, et plus tard. La CAF retient la moyenne du trimestre : un mois à ${h.eur(1800)} au lieu du Smic porte la moyenne à ${h.eur((1800 + 2 * smic(h)) / 3)}. Pour une personne seule, la prime du trimestre suivant passe de ${h.eur(pa(h, {}).prime)} à ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: (1800 + 2 * smic(h)) / 3 }).prime)}, soit une baisse modeste face au gain de salaire.` },
    ],
    body: (h) => `
<h2>Le même salaire, sept foyers</h2>
<p>Le tableau garde un salaire au Smic net de 2026, publié sur ${h.src('spSmic', 'service-public')}, et change seulement le foyer autour. C’est la composition familiale qui fait la différence, bien plus que le salaire.</p>
${h.table(['Foyer', 'Forfaitaire', 'Ressources comptées', 'Prime estimée'], foyers(h, 'fr').map(([n, r]) => [n, h.eur(r.forfaitaire, 2), h.eur(r.ressources), h.eur(r.prime)]), 'Smic net à temps plein, barème du 1er avril 2026 (estimation)', ['l', 'r', 'r', 'r'])}
<!--mini:paSmic-->

<h2>Pourquoi le Smic donne droit, presque toujours</h2>
<p>Pour une personne seule, la prime au Smic se lit en trois nombres : ${h.eur(h.P.pa.montant_forfaitaire, 2)} de forfaitaire, ${h.eur(pa(h, {}).partRevenus, 2)} de part des revenus et ${h.eur(pa(h, {}).bonif, 2)} de bonification, soit ${h.eur(h.P.pa.montant_forfaitaire + pa(h, {}).partRevenus + pa(h, {}).bonif)} avant déduction. On retire le salaire, ${h.eur(smic(h), 2)}. Il reste ${h.eur(pa(h, {}).prime, 2)}.</p>
<p>La bonification joue un rôle décisif à ce niveau. Fixée par le ${h.src('cssD843', 'code de la sécurité sociale')}, elle démarre à ${h.eur(h.M.seuilBonification(), 2)} et atteint ${h.eur(h.M.bonificationMax(), 2)} à ${h.eur(h.M.plafondBonification(), 2)} : le Smic net se situe aux trois quarts de la rampe. Sans elle, la prime d’une personne seule au Smic ne serait que de ${h.eur(pa(h, {}).prime - pa(h, {}).bonif)}.</p>

<h2>Brut, net, net social : quel Smic compte</h2>
<p>Trois chiffres circulent. ${h.eur(h.P.smic.horaire_brut, 2)} brut de l’heure sert à fixer les bornes de la bonification. ${h.eur(h.P.smic.mensuel_brut, 2)} brut par mois, pour 151,67 heures, figure en haut du bulletin. ${h.eur(smic(h), 2)} net est ce que la CAF compare au forfaitaire, via le montant net social du bulletin, prérempli sur la déclaration trimestrielle. Confondre le brut et le net en remplissant un simulateur fait chuter la prime estimée d’une centaine d’euros : avec ${h.eur(h.P.smic.mensuel_brut)} saisis, une personne seule ne verrait plus que ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: h.P.smic.mensuel_brut }).prime)}.</p>

<h2>Au Smic avec des enfants</h2>
<p>Chaque enfant ajoute au forfaitaire, ce qui augmente la prime au même salaire. Mais à partir de deux enfants, les allocations familiales arrivent dans les ressources et retirent leur montant de la prime. Pour un couple avec deux enfants et un Smic, la prime passe ainsi de ${h.eur(pa(h, { couple: true, enfants: 2 }).prime)} à ${h.eur(pa(h, { couple: true, enfants: 2, autres: af2(h) }).prime)}. Le total perçu (allocations plus prime) ne bouge pas : l’argent change seulement de colonne.</p>
<p>Le parent seul au Smic est le cas où la prime pèse le plus lourd dans le budget : ${h.eur(pa(h, { enfants: 1, iso: true }).prime)} pendant la période majorée, soit près de la moitié du salaire. La page ${h.a('prime-activite-parent-isole', 'parent isolé')} détaille la durée de cette majoration.</p>

<h2>Quand le Smic ne suffit plus à ouvrir le droit</h2>
<p>Le droit au Smic n’est pas garanti dans tous les foyers. Trois situations le réduisent fortement ou l’annulent, toutes calculées ici avec le même moteur.</p>
<p>Le couple à deux Smic qui perçoit une aide au logement d’abord : le forfait logement de ${h.eur(h.M.forfaitLogement(h.P.pa.montant_forfaitaire, 2), 2)} s’ajoute à des ressources déjà élevées, et la prime disparaît : ${h.eur(pa(h, { couple: true, deux: true, fl: true }).prime)}. Le salarié seul au Smic qui touche aussi une pension d’invalidité de ${h.eur(150)} ensuite : sa prime estimée descend à ${h.eur(pa(h, { autres: 150 }).prime)}. Enfin le couple dont l’un est au Smic et l’autre perçoit ${h.eur(500)} d’allocation chômage : la prime passe à ${h.eur(pa(h, { couple: true, autres: 500 }).prime)}.</p>
<p>Dans chacun de ces cas, ce n’est pas le salaire qui bloque, mais ce qui l’accompagne. Une estimation fiable demande donc de saisir toutes les ressources du foyer, et pas seulement la fiche de paie.</p>

<h2>Au Smic mais pas à temps plein</h2>
<p>Un Smic horaire sur 24 ou 28 heures par semaine change le calcul : la bonification fond et le salaire se rapproche du forfaitaire. La prime d’une personne seule à 80 % du Smic atteint ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: smic(h) * 0.8 }).prime)}, plus qu’à temps plein. La page ${h.a('prime-activite-temps-partiel', 'temps partiel')} suit toutes les quotités.</p>

<h2>Ce que la revalorisation d’avril 2026 a changé</h2>
<p>Le ${h.src('decretPa2026', 'décret du 30 mars 2026')} a porté le montant forfaitaire à ${h.eur(h.P.pa.montant_forfaitaire, 2)} et, avec lui, la bonification maximale. La ${h.src('spPa', 'fiche F2882')} reprend ces montants. Une revalorisation du forfaitaire profite directement aux salariés au Smic, puisqu’elle s’ajoute au calcul sans toucher aux ressources. Une hausse du Smic agit dans l’autre sens sur la prime, mais augmente toujours le revenu total. Le ${h.a('simulateur-prime-activite', 'simulateur')} applique le barème en vigueur.</p>
`,
  },
  en: {
    slug: 'activity-bonus-minimum-wage',
    nav: 'On the minimum wage',
    card: 'How much activity bonus a minimum-wage salary brings, from a single person to a family.',
    title: 'Activity Bonus on the Minimum Wage 2026: Amount by Household',
    description: 'Activity bonus 2026 on the net Smic of €1,477.93: about €231 single, €550 for a one-wage couple, far more with children. Table by household, calculator.',
    h1: 'The activity bonus on the minimum wage',
    intro: 'On a full-time minimum wage, almost every household qualifies for the bonus; only the amount varies, by a factor of four or more.',
    resume: (h) => `On the net minimum wage (Smic) of ${h.eur(smic(h), 2)} a month, which is ${h.eur(h.P.smic.mensuel_brut, 2)} gross for a 35-hour week, a single person with no housing aid can receive about ${h.eur(pa(h, {}).prime)} a month of prime d’activité, the in-work benefit administered by the CAF, the public body that pays family and housing benefits, under the rates in force since 1 April 2026. The same wage supporting a couple where the other partner does not work brings the bonus to around ${h.eur(pa(h, { couple: true }).prime)}. With one child it nears ${h.eur(pa(h, { couple: true, enfants: 1 }).prime)}; a lone parent with one child, during the higher-rate period, gets ${h.eur(pa(h, { enfants: 1, iso: true }).prime)}. Two minimum wages in a childless couple still leave ${h.eur(pa(h, { couple: true, deux: true }).prime)}. In every case, the formula adds ${h.eur(pa(h, {}).partRevenus, 2)} of earnings share and a ${h.eur(pa(h, {}).bonif, 2)} top-up per minimum wage to the flat rate, then deducts household resources. Over a year, a single person’s bonus on the Smic comes to ${h.eur(pa(h, {}).prime * 12)}, tax-free. All amounts are indicative: the decision rests with the CAF.`,
    faqs: (h) => [
      { q: 'Do you get the activity bonus on a full-time minimum wage?', a: `Yes, in almost every case. Single, childless and without housing aid, the estimated bonus is ${h.eur(pa(h, {}).prime)} a month at April 2026 rates. For a single person it only stops at about ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))} of net pay, well above the ${h.eur(smic(h), 2)} Smic. You still have to claim it on the CAF website.` },
      { q: 'Activity bonus on the minimum wage with two children, how much?', a: `For a couple where only one partner works on the Smic, about ${h.eur(pa(h, { couple: true, enfants: 2, autres: af2(h) }).prime)} a month once the ${h.eur(af2(h), 2)} of family allowances is deducted. Without them, the sum would give ${h.eur(pa(h, { couple: true, enfants: 2 }).prime)}. The household flat rate reaches ${h.eur(h.M.forfaitairePa(true, 2), 2)}, which explains the high amount.` },
      { q: 'Should I report my gross or net minimum wage to the CAF?', a: `Net, and more precisely the “net social” amount shown on the payslip, according to service-public.fr. On a full-time Smic that is ${h.eur(smic(h), 2)}, not ${h.eur(h.P.smic.mensuel_brut, 2)}. Since 1 March 2025, the figure is pre-filled on the quarterly return: you only need to check it.` },
      { q: 'How much does the activity bonus add up to over a year on the minimum wage?', a: `For a single person with no housing aid, about ${h.eur(pa(h, {}).prime * 12)} over twelve months at April 2026 rates. For a couple living on one Smic, ${h.eur(pa(h, { couple: true }).prime * 12)}. These sums are not taxable and do not go on your tax return, according to sheet F2882. They assume steady pay all year.` },
      { q: 'Does a month of overtime on the minimum wage reduce the bonus?', a: `A little, and later. The CAF uses the quarterly average: one month at ${h.eur(1800)} instead of the Smic lifts the average to ${h.eur((1800 + 2 * smic(h)) / 3)}. For a single person, the next quarter’s bonus goes from ${h.eur(pa(h, {}).prime)} to ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: (1800 + 2 * smic(h)) / 3 }).prime)}, a modest drop next to the extra pay.` },
    ],
    body: (h) => `
<h2>One wage, seven households</h2>
<p>The table keeps a 2026 net Smic wage, as published on ${h.src('spSmic', 'service-public.fr')}, and changes only the household around it. Family make-up makes the difference, far more than pay.</p>
${h.table(['Household', 'Flat rate', 'Resources counted', 'Estimated bonus'], foyers(h, 'en').map(([n, r]) => [n, h.eur(r.forfaitaire, 2), h.eur(r.ressources), h.eur(r.prime)]), 'Full-time net Smic, 1 April 2026 rates (estimate)', ['l', 'r', 'r', 'r'])}
<!--mini:paSmic-->

<h2>Why the minimum wage almost always qualifies</h2>
<p>For a single person, the bonus on the Smic comes down to three figures: a ${h.eur(h.P.pa.montant_forfaitaire, 2)} flat rate, ${h.eur(pa(h, {}).partRevenus, 2)} of earnings share and a ${h.eur(pa(h, {}).bonif, 2)} top-up, ${h.eur(h.P.pa.montant_forfaitaire + pa(h, {}).partRevenus + pa(h, {}).bonif)} before deductions. Take away the ${h.eur(smic(h), 2)} wage and ${h.eur(pa(h, {}).prime, 2)} remains.</p>
<p>The top-up is decisive at this level. Set by the ${h.src('cssD843', 'Social Security Code')}, it starts at ${h.eur(h.M.seuilBonification(), 2)} and reaches ${h.eur(h.M.bonificationMax(), 2)} at ${h.eur(h.M.plafondBonification(), 2)}: the net Smic sits three quarters of the way up the ramp. Without it, a single person’s bonus on the Smic would be just ${h.eur(pa(h, {}).prime - pa(h, {}).bonif)}.</p>

<h2>Gross, net, net social: which Smic counts</h2>
<p>Three figures do the rounds. ${h.eur(h.P.smic.horaire_brut, 2)} gross an hour sets the top-up limits. ${h.eur(h.P.smic.mensuel_brut, 2)} gross a month, for 151.67 hours, appears at the top of the payslip. ${h.eur(smic(h), 2)} net is what the CAF compares with the flat rate, through the “net social” amount on the payslip, pre-filled on the quarterly return. Mixing up gross and net when filling in a calculator knocks around a hundred euros off the estimate: with ${h.eur(h.P.smic.mensuel_brut)} entered, a single person would see only ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: h.P.smic.mensuel_brut }).prime)}.</p>

<h2>On the minimum wage with children</h2>
<p>Each child adds to the flat rate, which raises the bonus for the same pay. From the second child, though, family allowances (allocations familiales) enter resources and take their amount off the bonus. For a couple with two children and one Smic, the bonus goes from ${h.eur(pa(h, { couple: true, enfants: 2 }).prime)} to ${h.eur(pa(h, { couple: true, enfants: 2, autres: af2(h) }).prime)}. The total received, allowances plus bonus, does not change: the money simply moves from one column to another.</p>
<p>The lone parent on the Smic is where the bonus weighs most in the budget: ${h.eur(pa(h, { enfants: 1, iso: true }).prime)} during the higher-rate period, close to half the wage. The ${h.a('prime-activite-parent-isole', 'lone parent')} page covers how long that higher rate lasts.</p>

<h2>When the minimum wage is no longer enough to qualify</h2>
<p>Entitlement on the Smic is not guaranteed in every household. Three situations cut it sharply or wipe it out, all worked out here with the same engine.</p>
<p>First, a couple on two minimum wages who receive housing aid: the housing flat rate of ${h.eur(h.M.forfaitLogement(h.P.pa.montant_forfaitaire, 2), 2)} is added to resources that are already high, and the bonus disappears: ${h.eur(pa(h, { couple: true, deux: true, fl: true }).prime)}. Next, a single worker on the Smic who also draws a ${h.eur(150)} invalidity pension: the estimated bonus drops to ${h.eur(pa(h, { autres: 150 }).prime)}. Last, a couple where one partner earns the Smic and the other receives ${h.eur(500)} of unemployment benefit from France Travail: the bonus becomes ${h.eur(pa(h, { couple: true, autres: 500 }).prime)}.</p>
<p>In each case it is not the wage that blocks the bonus but what comes with it. A reliable estimate therefore needs every source of household income, not just the payslip.</p>

<h2>On the minimum wage but not full time</h2>
<p>An hourly Smic over 24 or 28 hours a week changes the sum: the top-up shrinks and pay moves closer to the flat rate. A single person at 80% of the Smic gets an estimated ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: smic(h) * 0.8 }).prime)}, more than full time. The ${h.a('prime-activite-temps-partiel', 'part-time work')} page follows every working-time level.</p>

<h2>What the April 2026 uprating changed</h2>
<p>The ${h.src('decretPa2026', 'decree of 30 March 2026')} set the flat-rate amount at ${h.eur(h.P.pa.montant_forfaitaire, 2)} and, with it, the maximum top-up. The ${h.src('spPa', 'service-public.fr sheet F2882')} shows these figures. An increase in the flat rate goes straight to minimum-wage workers, since it is added to the sum without touching resources. A rise in the Smic works the other way on the bonus, but always lifts total income. The ${h.a('simulateur-prime-activite', 'calculator')} applies the current scale.</p>
`,
  },
});
