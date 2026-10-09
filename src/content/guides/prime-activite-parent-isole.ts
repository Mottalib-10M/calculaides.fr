import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Parent isolé : prime avec et sans majoration pour isolement. */
const iso = (h: Helpers, enfants: number, s: number, maj = true, autres = 0) => h.M.primeActivite({ couple: false, enfants, revenu1: s, isoleMajore: maj, autres });
const smic = (h: Helpers) => h.P.smic.mensuel_net;
const S = 1100;

export default defineGuide({
  id: 'prime-activite-parent-isole',
  group: 'activite',
  order: 40,
  mini: 'paParentIsole',
  related: ['simulateur-prime-activite', 'prime-activite-couple', 'allocation-soutien-familial', 'rsa-parent-isole', 'prime-activite-smic'],
  sources: ['spPa', 'decretPa2026', 'cssD843'],
  fr: {
    slug: 'prime-activite-parent-isole',
    nav: 'Parent isolé',
    card: 'La majoration pour isolement : son montant, sa durée, et ce que devient la prime quand elle s’arrête.',
    title: 'Prime d’activité parent isolé 2026 : majoration et durée',
    description: 'Prime d’activité 2026 pour un parent isolé : forfaitaire majoré de 128,412 % plus 42,804 % par enfant, 12 mois sur 18 ou jusqu’aux 3 ans du plus jeune.',
    h1: 'Prime d’activité du parent isolé',
    intro: 'Après une séparation, une naissance ou un veuvage, le parent seul peut toucher une prime majorée, pour un temps limité.',
    resume: (h) => `Un parent seul avec un enfant qui gagne ${h.eur(S)} net par mois peut recevoir environ ${h.eur(iso(h, 1, S).prime)} de prime d’activité au barème du 1er avril 2026 tant qu’il bénéficie de la majoration pour isolement, puis ${h.eur(iso(h, 1, S, false).prime)} quand elle prend fin. La majoration remplace le barème habituel par un montant forfaitaire égal à ${h.pct(h.P.pa.isole.base, 3)} du montant de base, plus ${h.pct(h.P.pa.isole.par_enfant, 3)} par enfant à charge : ${h.eur(h.M.forfaitairePa(false, 1, true), 2)} avec un enfant au lieu de ${h.eur(h.M.forfaitairePa(false, 1), 2)}. Elle s’ouvre le mois d’une déclaration de grossesse, d’une naissance, de la prise en charge d’un enfant, d’une séparation ou d’un veuvage. Elle dure 12 mois, continus ou non, dans les 18 mois qui suivent l’événement, ou jusqu’aux 3 ans du plus jeune enfant si cette date est plus lointaine. Chiffres estimés : le montant officiel sort du dossier traité par la CAF.`,
    faqs: (h) => [
      { q: 'Combien de temps dure la majoration parent isolé de la prime d’activité ?', a: `Douze mois, continus ou discontinus, à utiliser dans les dix-huit mois qui suivent l’événement (séparation, naissance, veuvage, grossesse, prise en charge d’un enfant). Si le plus jeune enfant a moins de 3 ans, elle court jusqu’à son troisième anniversaire. Avec un enfant et ${h.eur(S)} de salaire, elle vaut environ ${h.eur(iso(h, 1, S).prime - iso(h, 1, S, false).prime)} par mois, selon la fiche F2882.` },
      { q: 'Je suis enceinte et seule, ma prime d’activité est-elle majorée ?', a: `Oui, dès le mois de la déclaration de grossesse. Le forfaitaire passe alors à ${h.eur(h.M.forfaitairePa(false, 0, true), 2)}, soit ${h.pct(h.P.pa.isole.base, 3)} du montant de base, contre ${h.eur(h.P.pa.montant_forfaitaire, 2)} pour une personne seule. Au Smic, la prime estimée monte de ${h.eur(iso(h, 0, smic(h), false).prime)} à ${h.eur(iso(h, 0, smic(h)).prime)} par mois. Après la naissance, le montant augmente encore avec l’enfant.` },
      { q: 'Que devient ma prime d’activité quand mon enfant a 3 ans ?', a: `La majoration s’arrête, sauf s’il vous reste des mois sur la période de 12 mois sur 18 ouverte par un autre événement. La prime est alors calculée sur le barème ordinaire : avec un enfant et ${h.eur(S)} de salaire, elle passe d’environ ${h.eur(iso(h, 1, S).prime)} à ${h.eur(iso(h, 1, S, false).prime)}. Anticipez cette baisse sur le trimestre qui suit l’anniversaire.` },
      { q: 'La pension alimentaire que je reçois réduit-elle ma prime d’activité ?', a: `Oui. Service-public la cite parmi les ressources à ajouter à la déclaration trimestrielle préremplie. Elle n’est pas un revenu d’activité : elle entre en entier dans les ressources. Avec un enfant, ${h.eur(S)} de salaire et ${h.eur(200)} de pension, la prime majorée passe de ${h.eur(iso(h, 1, S).prime)} à ${h.eur(iso(h, 1, S, true, 200).prime)}.` },
      { q: 'Mère seule avec deux enfants au Smic, quelle prime d’activité ?', a: `Environ ${h.eur(iso(h, 2, smic(h)).prime)} par mois pendant la période majorée, au barème du 1er avril 2026, sans aide au logement ni autre ressource. Le forfaitaire majoré atteint ${h.eur(h.M.forfaitairePa(false, 2, true), 2)}. Hors majoration, la prime retombe vers ${h.eur(iso(h, 2, smic(h), false).prime)}. Les allocations familiales de deux enfants, si elles sont versées, se déduisent du calcul.` },
    ],
    body: (h) => `
<h2>Deux barèmes pour un même parent</h2>
<p>Un parent seul n’est pas toujours un « parent isolé » au sens de la majoration. Hors période majorée, la CAF lui applique l’échelle ordinaire : le premier enfant compte comme une deuxième personne, à +${h.pct(h.P.pa.majoration.deuxieme, 0)}, le deuxième à +${h.pct(h.P.pa.majoration.suivante, 0)}. Pendant la période majorée, un autre calcul s’applique : ${h.pct(h.P.pa.isole.base, 3)} du montant de base pour le parent, plus ${h.pct(h.P.pa.isole.par_enfant, 3)} par enfant, selon la ${h.src('spPa', 'fiche F2882 de service-public')}. L’écart entre les deux se lit dans le tableau.</p>
${h.table(['Enfants', 'Forfaitaire ordinaire', 'Forfaitaire majoré', 'Prime majorée', 'Prime ordinaire'], [0, 1, 2, 3].map((n) => [n === 0 ? 'Grossesse' : String(n), h.eur(h.M.forfaitairePa(false, n), 2), h.eur(h.M.forfaitairePa(false, n, true), 2), h.eur(iso(h, n, S).prime), h.eur(iso(h, n, S, false).prime)]), `Parent seul, salaire net de 1 100 €, sans autre ressource, barème du 1er avril 2026 (estimation)`, ['l', 'r', 'r', 'r', 'r'])}
<!--mini:paParentIsole-->

<h2>Quand la période majorée commence et finit</h2>
<p>Cinq événements l’ouvrent, à partir du mois où ils surviennent : la déclaration de grossesse, la naissance, la prise en charge d’un enfant, la séparation et le veuvage. Le droit court alors 12 mois, qui peuvent être discontinus, à l’intérieur d’une fenêtre de 18 mois. Le texte parle de mois « continus ou discontinus » : une interruption ne fait pas recommencer le compte, et les 18 mois partent toujours de l’événement initial.</p>
<p>La seconde règle protège les familles avec un très jeune enfant : tant que le plus jeune a moins de 3 ans, la majoration est maintenue jusqu’à son anniversaire. Une mère qui se sépare quand son bébé a 6 mois garde donc la prime majorée deux ans et demi, bien au-delà des 12 mois.</p>

<h2>Une majoration qui ne profite pas à tous les salaires</h2>
<p>Paradoxe du calcul : avec un très petit salaire, la majoration ne rapporte rien. Tant que les ressources restent sous le forfaitaire ordinaire, ${h.eur(h.M.forfaitairePa(false, 1), 2)} avec un enfant, la CAF retire ce forfaitaire en entier, qu’il soit majoré ou non. La prime se réduit alors à ${h.pct(h.P.pa.taux_revenus, 2)} du salaire plus la bonification, dans les deux barèmes.</p>
${h.table(['Salaire net', 'Prime majorée', 'Prime ordinaire', 'Gain de la majoration'], [600, 900, S, smic(h), 1800, 2400].map((x) => [h.eur(x), h.eur(iso(h, 1, x).prime), h.eur(iso(h, 1, x, false).prime), h.eur(iso(h, 1, x).prime - iso(h, 1, x, false).prime)]), 'Parent seul avec un enfant, sans autre ressource (estimation)', ['r', 'r', 'r', 'r'])}
<p>Le gain apparaît dès que le salaire dépasse le forfaitaire ordinaire et plafonne à l’écart entre les deux forfaitaires, ${h.eur(h.M.forfaitairePa(false, 1, true) - h.M.forfaitairePa(false, 1), 2)} par mois, jusqu’à ce que la prime majorée elle-même s’éteigne. Pour un parent à quelques heures par semaine, c’est plutôt le RSA majoré qui compte.</p>

<h2>Le parcours de Sonia, séparée en mars</h2>
<p>Sonia élève seule son fils de 7 ans depuis sa séparation en mars 2026. Elle travaille comme employée administrative à temps partiel, ${h.eur(S)} net par mois, sans aide au logement. De mars 2026 à février 2027, elle perçoit environ ${h.eur(iso(h, 1, S).prime)} par mois. Son fils ayant plus de 3 ans, la majoration s’arrête au bout des 12 mois : la prime retombe à ${h.eur(iso(h, 1, S, false).prime)}. Sur l’année majorée, le supplément atteint ${h.eur((iso(h, 1, S).prime - iso(h, 1, S, false).prime) * 12)}.</p>
<p>Si Sonia reçoit une pension alimentaire de ${h.eur(200)} pour son fils, elle la déclare chaque trimestre : sa prime majorée devient ${h.eur(iso(h, 1, S, true, 200).prime)}. Si la pension n’est pas payée, l’${h.a('allocation-soutien-familial', 'allocation de soutien familial')} peut prendre le relais, sous ses propres conditions.</p>

<h2>Le salaire auquel la prime disparaît</h2>
<p>La majoration repousse nettement le point de sortie. Avec un enfant, la prime s’éteint vers ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 1, isoleMajore: true }))} de salaire net pendant la période majorée, contre ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 1 }))} ensuite. Un parent seul qui gagne entre ces deux montants perd donc tout droit à la fin de la majoration, sans que son salaire ait changé. C’est le moment de vérifier son ${h.a('rsa-parent-isole', 'éventuel droit au RSA majoré')} si les revenus baissent, ou de relancer une estimation dans le ${h.a('simulateur-prime-activite', 'simulateur')}.</p>

<h2>Les erreurs qui coûtent cher</h2>
<p>Déclarer la séparation tard est la première : tant que la CAF ne la connaît pas, elle continue de calculer la prime comme pour un couple, alors que la majoration est due dès le mois de l’événement. Oublier qu’un nouveau conjoint vit au foyer est la seconde, et la plus lourde : la CAF recalcule alors en couple, sans majoration, et réclame les sommes versées en trop. La troisième tient à la bonification, souvent ignorée des parents à temps partiel : elle ne démarre qu’au-dessus de ${h.eur(h.M.seuilBonification(), 2)} de salaire, ce qu’indique le ${h.src('cssD843', 'code de la sécurité sociale')}. Quelques heures de plus peuvent la déclencher.</p>
<p>Les montants de cette page suivent le ${h.src('decretPa2026', 'décret du 30 mars 2026')} et restent des estimations : seule la CAF fixe le droit, à partir des ressources déclarées.</p>
`,
  },
  en: {
    slug: 'activity-bonus-lone-parent',
    nav: 'Lone parent',
    card: 'The lone-parent higher rate: how much, how long, and what happens to the bonus when it ends.',
    title: 'Activity Bonus Lone Parent 2026: Higher Rate and Duration',
    description: 'Activity bonus 2026 for lone parents in France: a flat rate of 128.412% plus 42.804% per child, for 12 months out of 18 or until the youngest turns 3.',
    h1: 'Activity bonus for lone parents',
    intro: 'After a separation, a birth or a bereavement, a parent on their own can receive a higher bonus for a limited time.',
    resume: (h) => `A lone parent with one child earning ${h.eur(S)} net a month can receive about ${h.eur(iso(h, 1, S).prime)} of prime d’activité, the earnings supplement handled by the CAF (the family allowance fund), at 1 April 2026 rates while the lone-parent higher rate (majoration pour isolement) applies, then ${h.eur(iso(h, 1, S, false).prime)} once it ends. The higher rate replaces the usual scale with a flat-rate amount of ${h.pct(h.P.pa.isole.base, 3)} of the base amount, plus ${h.pct(h.P.pa.isole.par_enfant, 3)} per dependent child: ${h.eur(h.M.forfaitairePa(false, 1, true), 2)} with one child instead of ${h.eur(h.M.forfaitairePa(false, 1), 2)}. It starts in the month of a declared pregnancy, a birth, taking a child into your care, a separation or the death of a partner. It lasts 12 months, consecutive or not, within the 18 months after the event, or until the youngest child turns 3 if that is later. Estimated figures: the official amount comes from the CAF’s own processing of your file.`,
    faqs: (h) => [
      { q: 'How long does the lone-parent higher rate of the activity bonus last?', a: `Twelve months, consecutive or not, used within the eighteen months after the event (separation, birth, bereavement, pregnancy, taking a child into your care). If the youngest child is under 3, it runs until their third birthday. With one child and ${h.eur(S)} of pay, it is worth about ${h.eur(iso(h, 1, S).prime - iso(h, 1, S, false).prime)} a month, according to sheet F2882.` },
      { q: 'I am pregnant and on my own, is my activity bonus higher?', a: `Yes, from the month you declare the pregnancy. The flat rate rises to ${h.eur(h.M.forfaitairePa(false, 0, true), 2)}, that is ${h.pct(h.P.pa.isole.base, 3)} of the base, against ${h.eur(h.P.pa.montant_forfaitaire, 2)} for a single person. On the minimum wage (Smic), the estimated bonus goes from ${h.eur(iso(h, 0, smic(h), false).prime)} to ${h.eur(iso(h, 0, smic(h)).prime)} a month. After the birth, the amount rises again with the child.` },
      { q: 'What happens to my activity bonus when my child turns 3?', a: `The higher rate stops, unless you still have months left in a 12-out-of-18 window opened by another event. The bonus then follows the ordinary scale: with one child and ${h.eur(S)} of pay, it falls from about ${h.eur(iso(h, 1, S).prime)} to ${h.eur(iso(h, 1, S, false).prime)}. Plan for that drop in the quarter after the birthday.` },
      { q: 'Does child maintenance I receive reduce my activity bonus?', a: `Yes. Service-public.fr lists maintenance (pension alimentaire) among the resources to add to the pre-filled quarterly return. It is not earned income, so it counts in full. With one child, ${h.eur(S)} of pay and ${h.eur(200)} of maintenance, the higher-rate bonus goes from ${h.eur(iso(h, 1, S).prime)} to ${h.eur(iso(h, 1, S, true, 200).prime)}.` },
      { q: 'Single mother of two on the minimum wage, how much activity bonus?', a: `About ${h.eur(iso(h, 2, smic(h)).prime)} a month during the higher-rate period, at 1 April 2026 rates, with no housing aid and no other income. The higher flat rate reaches ${h.eur(h.M.forfaitairePa(false, 2, true), 2)}. Outside that period, the bonus drops to about ${h.eur(iso(h, 2, smic(h), false).prime)}. Family allowances for two children, if paid, are deducted.` },
    ],
    body: (h) => `
<h2>Two scales for the same parent</h2>
<p>A parent on their own is not always a “lone parent” for the higher rate. Outside the higher-rate period, the CAF uses the ordinary scale: the first child counts as a second person, at +${h.pct(h.P.pa.majoration.deuxieme, 0)}, the second at +${h.pct(h.P.pa.majoration.suivante, 0)}. During the higher-rate period a different sum applies: ${h.pct(h.P.pa.isole.base, 3)} of the base for the parent plus ${h.pct(h.P.pa.isole.par_enfant, 3)} per child, according to the ${h.src('spPa', 'service-public.fr sheet F2882')}. The table shows the gap.</p>
${h.table(['Children', 'Ordinary flat rate', 'Higher flat rate', 'Higher-rate bonus', 'Ordinary bonus'], [0, 1, 2, 3].map((n) => [n === 0 ? 'Pregnancy' : String(n), h.eur(h.M.forfaitairePa(false, n), 2), h.eur(h.M.forfaitairePa(false, n, true), 2), h.eur(iso(h, n, S).prime), h.eur(iso(h, n, S, false).prime)]), 'Parent on their own, net pay €1,100, no other income, 1 April 2026 rates (estimate)', ['l', 'r', 'r', 'r', 'r'])}
<!--mini:paParentIsole-->

<h2>When the higher-rate period starts and ends</h2>
<p>Five events open it, from the month they happen: declaring a pregnancy, a birth, taking a child into your care, a separation and the death of a partner. The right then runs for 12 months, which need not be consecutive, inside an 18-month window. The rule speaks of months that are “continuous or discontinuous”: a break does not restart the count, and the 18 months always run from the original event.</p>
<p>The second rule protects families with a very young child: while the youngest is under 3, the higher rate continues until that birthday. A mother who separates when her baby is 6 months old therefore keeps the higher bonus for two and a half years, well beyond 12 months.</p>

<h2>A higher rate that does not help every wage</h2>
<p>A quirk of the formula: on very low pay, the higher rate adds nothing. While resources stay below the ordinary flat rate, ${h.eur(h.M.forfaitairePa(false, 1), 2)} with one child, the CAF deducts that flat rate in full, raised or not. The bonus then comes down to ${h.pct(h.P.pa.taux_revenus, 2)} of pay plus any top-up, on both scales.</p>
${h.table(['Net pay', 'Higher-rate bonus', 'Ordinary bonus', 'Gain from the higher rate'], [600, 900, S, smic(h), 1800, 2400].map((x) => [h.eur(x), h.eur(iso(h, 1, x).prime), h.eur(iso(h, 1, x, false).prime), h.eur(iso(h, 1, x).prime - iso(h, 1, x, false).prime)]), 'Parent on their own with one child, no other income (estimate)', ['r', 'r', 'r', 'r'])}
<p>The gain appears once pay passes the ordinary flat rate and tops out at the difference between the two flat rates, ${h.eur(h.M.forfaitairePa(false, 1, true) - h.M.forfaitairePa(false, 1), 2)} a month, until the higher-rate bonus itself runs out. For a parent working only a few hours a week, the higher-rate RSA is usually what matters.</p>

<h2>Sonia’s case, separated in March</h2>
<p>Sonia has been raising her 7-year-old son alone since she separated in March 2026. She works part-time as an office assistant, ${h.eur(S)} net a month, with no housing aid. From March 2026 to February 2027, she receives about ${h.eur(iso(h, 1, S).prime)} a month. As her son is over 3, the higher rate stops after 12 months and the bonus falls back to ${h.eur(iso(h, 1, S, false).prime)}. Over the higher-rate year, the extra comes to ${h.eur((iso(h, 1, S).prime - iso(h, 1, S, false).prime) * 12)}.</p>
<p>If Sonia receives ${h.eur(200)} of child maintenance for her son, she declares it each quarter and her higher-rate bonus becomes ${h.eur(iso(h, 1, S, true, 200).prime)}. If the maintenance goes unpaid, the ${h.a('allocation-soutien-familial', 'family support allowance (ASF)')} may step in, under its own conditions.</p>

<h2>The pay level at which the bonus disappears</h2>
<p>The higher rate pushes the exit point well out. With one child, the bonus ends at around ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 1, isoleMajore: true }))} of net pay during the higher-rate period, against ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 1 }))} afterwards. A lone parent earning between those two figures loses the whole bonus when the higher rate ends, with no change in pay. That is the time to check a possible ${h.a('rsa-parent-isole', 'higher-rate RSA (minimum income)')} if earnings fall, or to run a new estimate in the ${h.a('simulateur-prime-activite', 'calculator')}.</p>

<h2>Costly mistakes</h2>
<p>Reporting the separation late is the first: until the CAF knows about it, it keeps calculating the bonus as for a couple, although the higher rate is due from the month of the event. Forgetting that a new partner has moved in is the second, and the most expensive: the CAF then recalculates as a couple, without the higher rate, and claims back what was overpaid. The third concerns the top-up, often overlooked by part-time parents: it only starts above ${h.eur(h.M.seuilBonification(), 2)} of pay, as set by the ${h.src('cssD843', 'Social Security Code')}. A few extra hours can trigger it.</p>
<p>The amounts on this page follow the ${h.src('decretPa2026', 'decree of 30 March 2026')} and remain estimates: only the CAF sets the entitlement, from the income you declare.</p>
`,
  },
});
