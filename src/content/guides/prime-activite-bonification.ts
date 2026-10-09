import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Bonification individuelle : seuil à 59 Smic horaires, plafond à 138, montant maximal. */
const seuil = (h: Helpers) => h.M.seuilBonification();
const plafond = (h: Helpers) => h.M.plafondBonification();
const max = (h: Helpers) => h.M.bonificationMax();
const pente = (h: Helpers) => max(h) / (plafond(h) - seuil(h));
const hNet = (h: Helpers) => h.P.smic.mensuel_net / (35 * 52 / 12);
const points = (h: Helpers) => [700, seuil(h), 900, 1100, 1300, h.P.smic.mensuel_net, plafond(h), 2000];

export default defineGuide({
  id: 'prime-activite-bonification',
  group: 'activite',
  order: 50,
  mini: 'paBonif',
  related: ['simulateur-prime-activite', 'prime-activite-celibataire', 'prime-activite-temps-partiel', 'prime-activite-couple', 'prime-activite-smic'],
  sources: ['cssD843', 'decretPa2026', 'spPa', 'spSmic'],
  fr: {
    slug: 'bonification-prime-activite',
    nav: 'Bonification',
    card: 'Le seuil de 59 Smic horaires, le plafond de 138, et la pente entre les deux.',
    title: 'Bonification prime d’activité 2026 : seuil, plafond, calcul',
    description: 'Bonification individuelle de la prime d’activité 2026 : nulle jusqu’à 726,29 €, elle monte jusqu’à 240,63 € atteints à 1 698,78 €. Courbe et simulateur.',
    h1: 'La bonification individuelle de la prime d’activité',
    intro: 'Un supplément propre à chaque actif du foyer, qui récompense les salaires proches du Smic à temps plein.',
    resume: (h) => `La bonification individuelle de la prime d’activité est nulle tant que les revenus professionnels d’un actif ne dépassent pas ${h.eur(seuil(h), 2)} par mois, soit ${h.P.pa.bonif.seuil_smic_h} fois le Smic horaire brut de ${h.eur(h.P.smic.horaire_brut, 2)}. Au-delà, elle augmente d’environ ${h.num(pente(h) * 100, 1)} centimes par euro gagné, jusqu’à ${h.eur(max(h), 2)} par mois, montant atteint à ${h.eur(plafond(h), 2)}, soit ${h.P.pa.bonif.plafond_smic_h} Smic horaires. Elle reste ensuite fixe. Elle se calcule pour chaque membre du foyer qui travaille, sur la moyenne de ses revenus des trois derniers mois, et s’ajoute au montant forfaitaire et à la part de ${h.pct(h.P.pa.taux_revenus, 2)} des revenus avant la déduction des ressources. Au Smic net à temps plein, elle vaut ${h.eur(h.M.bonification(h.P.smic.mensuel_net), 2)}. C’est elle qui évite qu’un salarié à temps plein voie sa prime fondre trop vite. Ces montants suivent le barème du 1er avril 2026 et n’engagent pas la CAF, qui calcule seule le droit.`,
    faqs: (h) => [
      { q: 'À partir de quel salaire touche-t-on la bonification de la prime d’activité ?', a: `Au-dessus de ${h.eur(seuil(h), 2)} de revenus professionnels mensuels, moyenne des trois derniers mois. Ce seuil correspond à ${h.P.pa.bonif.seuil_smic_h} fois le Smic horaire brut de ${h.eur(h.P.smic.horaire_brut, 2)}, comme le prévoit l’article D843-2 du code de la sécurité sociale. Un salarié qui gagne ${h.eur(700)} n’en reçoit donc aucune au barème 2026.` },
      { q: 'Comment calculer la bonification entre 59 et 138 Smic horaires ?', a: `On retire ${h.eur(seuil(h), 2)} au revenu mensuel, on divise par l’écart entre les deux bornes, ${h.eur(plafond(h) - seuil(h), 2)}, et on multiplie par ${h.eur(max(h), 2)}. Pour ${h.eur(1200)} de revenus, cela donne ${h.eur(h.M.bonification(1200), 2)}. La progression est linéaire : environ ${h.num(pente(h) * 100, 1)} centimes de bonification par euro supplémentaire.` },
      { q: 'Pourquoi les seuils de la bonification sont-ils exprimés en Smic horaires ?', a: `Pour suivre le salaire minimum sans nouveau texte. Le seuil vaut ${h.P.pa.bonif.seuil_smic_h} heures payées au Smic brut, le plafond ${h.P.pa.bonif.plafond_smic_h} heures. Quand le Smic horaire est revalorisé, les deux bornes montent d’autant : avec ${h.eur(h.P.smic.horaire_brut, 2)} de l’heure, elles valent ${h.eur(seuil(h), 2)} et ${h.eur(plafond(h), 2)}. Le montant maximal, lui, suit le montant forfaitaire.` },
      { q: 'La bonification est-elle versée séparément de la prime d’activité ?', a: `Non. Elle entre dans la formule avant la déduction des ressources et se fond dans un versement mensuel unique. Une personne seule à ${h.eur(1500)} de salaire voit ${h.eur(h.M.bonification(1500), 2)} de bonification dans le calcul, mais reçoit une prime totale de ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: 1500 }).prime)}. Le relevé de la CAF détaille les lignes.` },
      { q: 'Mon salaire dépasse 1 700 €, ai-je encore une bonification ?', a: `Oui, au maximum : ${h.eur(max(h), 2)} par mois dès ${h.eur(plafond(h), 2)} de revenus. Elle ne baisse pas au-delà. Mais la prime elle-même diminue car vos ressources augmentent : seul et sans enfant, elle s’éteint vers ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))}. En couple ou avec des enfants, la bonification maximale pèse plus longtemps.` },
    ],
    body: (h) => `
<h2>Trois zones sur la courbe</h2>
<p>Le ${h.src('cssD843', 'code de la sécurité sociale, article D843-2')} découpe les revenus d’un actif en trois zones. Sous ${h.eur(seuil(h), 2)}, rien. Entre ${h.eur(seuil(h), 2)} et ${h.eur(plafond(h), 2)}, une rampe régulière. Au-dessus, un palier à ${h.eur(max(h), 2)}, soit ${h.pct(h.P.pa.bonif.taux_max, 1)} du montant forfaitaire de ${h.eur(h.P.pa.montant_forfaitaire, 2)}. Les bornes sont des multiples du ${h.src('spSmic', 'Smic horaire brut')}, ${h.eur(h.P.smic.horaire_brut, 2)} en 2026, alors que la comparaison porte sur des revenus nets, en montant net social : c’est pourquoi un Smic net à temps plein se trouve dans la rampe et non au plafond.</p>
${h.table(['Revenus du mois', 'Bonification', 'Part du maximum', 'Prime d’une personne seule'], points(h).map((x) => [h.eur(x, 2), h.eur(h.M.bonification(x), 2), h.pct(h.M.bonification(x) / max(h), 0), h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: x }).prime)]), 'Barème du 1er avril 2026, personne seule sans autre ressource (estimation)', ['r', 'r', 'r', 'r'])}
<!--mini:paBonif-->

<h2>Le calcul à la main</h2>
<p>La formule tient en une règle de trois. Bonification = ${h.eur(max(h), 2)} × (revenus − ${h.eur(seuil(h), 2)}) ÷ (${h.eur(plafond(h), 2)} − ${h.eur(seuil(h), 2)}). Pour une aide à domicile qui gagne ${h.eur(1050)} en moyenne : (1 050 − ${h.num(seuil(h), 2)}) ÷ ${h.num(plafond(h) - seuil(h), 2)} = ${h.num((1050 - seuil(h)) / (plafond(h) - seuil(h)), 3)}, multiplié par ${h.num(max(h), 2)}, soit ${h.eur(h.M.bonification(1050), 2)}. Le moteur du site arrondit le résultat au centime.</p>
<p>« Revenus » s’entend ici des revenus professionnels de la personne, moyennés sur le trimestre de référence. Une indemnité chômage ou une pension n’en fait pas partie : elle ne déclenche aucune bonification, même si elle porte le total des ressources au-dessus du seuil.</p>

<h2>En heures de travail au Smic</h2>
<p>Les bornes parlent en Smic horaire brut, mais un salarié raisonne en heures. Au Smic net, une heure rapporte environ ${h.eur(hNet(h), 2)} (${h.eur(h.P.smic.mensuel_net, 2)} pour 35 heures par semaine). Le seuil d’entrée correspond donc à ${h.num(seuil(h) / hNet(h), 0)} heures payées par mois, soit à peu près ${h.num(seuil(h) / hNet(h) * 12 / 52, 0)} heures par semaine. Le plafond, lui, demanderait ${h.num(plafond(h) / hNet(h), 0)} heures par mois, plus qu’un temps plein. Un salarié payé au Smic n’atteint donc jamais la bonification maximale : il lui faut un salaire supérieur d’environ ${h.pct(plafond(h) / h.P.smic.mensuel_net - 1, 0)} au Smic net, ou des heures supplémentaires régulières. À l’inverse, un contrat de 15 heures par semaine au Smic reste sous le seuil et n’ouvre aucune bonification. Le passage à 20 ou 24 heures, fréquent dans la propreté ou la restauration, fait entrer dans la rampe.</p>
<p>Un dernier point surprend souvent : la bonification ne dépend pas du nombre d’heures mais du montant gagné. Un cadre à mi-temps payé ${h.eur(1800)} net touche la bonification maximale, alors qu’un salarié à temps plein au Smic n’en reçoit que ${h.eur(h.M.bonification(h.P.smic.mensuel_net), 2)}. Le mot « Smic horaire » dans le texte sert d’unité de mesure, pas de condition de durée.</p>

<h2>Pourquoi ce supplément existe</h2>
<p>Sans bonification, la prime d’une personne seule baisserait de 40 centimes pour chaque euro gagné dès que son salaire dépasse le forfaitaire. Un mi-temps et un temps plein au Smic se retrouveraient très proches une fois la prime ajoutée. La rampe compense en partie : entre les deux bornes, l’actif récupère environ ${h.num(pente(h) * 100, 1)} centimes par euro, et la prime ne recule plus que d’une quinzaine de centimes. C’est la pièce du calcul qui rend le travail à temps plein plus rémunérateur que le temps partiel.</p>

<h2>Un actif, une bonification</h2>
<p>Dans un couple, chaque conjoint a la sienne, calculée sur son propre salaire. Deux salaires de ${h.eur(1000)} ouvrent ${h.eur(2 * h.M.bonification(1000), 2)} de bonifications au total ; un salaire unique de ${h.eur(2000)}, ${h.eur(h.M.bonification(2000), 2)}. Chaque salaire doit franchir seul le seuil d’entrée, ce qui désavantage les couples aux deux revenus modestes. La page ${h.a('prime-activite-couple', 'prime d’activité en couple')} compare plusieurs partages. Selon la ${h.src('spPa', 'fiche F2882')}, chaque membre du foyer qui exerce une activité professionnelle y a droit, salarié ou non.</p>

<h2>Les mois irréguliers</h2>
<p>La moyenne trimestrielle lisse les écarts, mais pas toujours dans le bon sens. Un intérimaire qui gagne ${h.eur(1400)}, ${h.eur(300)} puis ${h.eur(1400)} affiche une moyenne de ${h.eur(1033)} : bonification de ${h.eur(h.M.bonification(1033), 2)}. Le même revenu trimestriel réparti en trois mois égaux donnerait exactement la même chose, puisque seule la moyenne compte. En revanche, un mois très élevé, comme un treizième mois versé d’un bloc, peut faire passer la moyenne au-dessus du plafond pour un trimestre : la bonification reste alors bloquée à ${h.eur(max(h), 2)} pendant que les ressources, elles, montent sans limite.</p>

<h2>Ce qui fait bouger les bornes en 2026</h2>
<p>Deux paramètres, deux textes. Le seuil et le plafond suivent le Smic horaire brut : une revalorisation du Smic les décale. Le montant maximal suit le montant forfaitaire, revalorisé au 1er avril 2026 par le ${h.src('decretPa2026', 'décret du 30 mars 2026')}. Notre ${h.a('simulateur-prime-activite', 'simulateur')} lit les deux dans le même fichier de paramètres et se met à jour avec eux.</p>
`,
  },
  en: {
    slug: 'activity-bonus-top-up',
    nav: 'Individual top-up',
    card: 'The 59-hour threshold, the 138-hour ceiling, and the slope in between.',
    title: 'Activity Bonus Top-Up 2026: Threshold, Ceiling, Formula',
    description: 'Individual top-up of the French activity bonus in 2026: zero up to €726.29 of monthly earnings, rising to €240.63 reached at €1,698.78. Curve and calculator.',
    h1: 'The individual top-up of the activity bonus',
    intro: 'An extra amount for each working member of the household, designed to reward pay close to a full-time minimum wage.',
    resume: (h) => `The individual top-up (bonification individuelle) of the prime d’activité, France’s in-work benefit paid by the CAF, is zero as long as a worker’s monthly earnings stay at or below ${h.eur(seuil(h), 2)}, that is ${h.P.pa.bonif.seuil_smic_h} times the gross hourly minimum wage (Smic) of ${h.eur(h.P.smic.horaire_brut, 2)}. Above that, it grows by about ${h.num(pente(h) * 100, 1)} cents per euro earned, up to ${h.eur(max(h), 2)} a month, reached at ${h.eur(plafond(h), 2)}, or ${h.P.pa.bonif.plafond_smic_h} hourly minimum wages. It then stays flat. It is worked out for each working member of the household, on their average earnings over the last three months, and is added to the flat-rate amount and the ${h.pct(h.P.pa.taux_revenus, 2)} share of earnings before resources are deducted. On the full-time net Smic it is worth ${h.eur(h.M.bonification(h.P.smic.mensuel_net), 2)}. It is what stops a full-time worker’s bonus from melting away too fast. These figures follow the 1 April 2026 scale and are only indicative, since the CAF alone decides.`,
    faqs: (h) => [
      { q: 'From what level of pay do you get the activity bonus top-up?', a: `Above ${h.eur(seuil(h), 2)} of monthly earnings, averaged over the last three months. That threshold equals ${h.P.pa.bonif.seuil_smic_h} times the gross hourly Smic of ${h.eur(h.P.smic.horaire_brut, 2)}, as article D843-2 of the Social Security Code provides. Someone earning ${h.eur(700)} therefore gets no top-up under the 2026 scale.` },
      { q: 'How is the top-up calculated between 59 and 138 hourly minimum wages?', a: `Take ${h.eur(seuil(h), 2)} off monthly earnings, divide by the gap between the two limits, ${h.eur(plafond(h) - seuil(h), 2)}, and multiply by ${h.eur(max(h), 2)}. For ${h.eur(1200)} of earnings, that gives ${h.eur(h.M.bonification(1200), 2)}. The rise is linear: about ${h.num(pente(h) * 100, 1)} cents of top-up per extra euro earned, until the cap is reached.` },
      { q: 'Why are the top-up limits expressed in hourly minimum wages?', a: `So they track the minimum wage without a new decree. The threshold is ${h.P.pa.bonif.seuil_smic_h} hours paid at the gross Smic, the ceiling ${h.P.pa.bonif.plafond_smic_h} hours. When the hourly Smic is raised, both limits move with it: at ${h.eur(h.P.smic.horaire_brut, 2)} an hour, they are ${h.eur(seuil(h), 2)} and ${h.eur(plafond(h), 2)}. The maximum amount follows the flat-rate amount instead.` },
      { q: 'Is the top-up paid separately from the activity bonus?', a: `No. It goes into the formula before resources are deducted and ends up in a single monthly payment. A single person earning ${h.eur(1500)} has ${h.eur(h.M.bonification(1500), 2)} of top-up in the sum but receives a total bonus of ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: 1500 }).prime)}. The CAF statement lists each line.` },
      { q: 'I earn over €1,700 a month, do I still get a top-up?', a: `Yes, the maximum: ${h.eur(max(h), 2)} a month from ${h.eur(plafond(h), 2)} of earnings. It does not fall beyond that. The bonus itself does shrink as your resources rise: single and childless, it stops at around ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))}. In a couple or with children, the maximum top-up keeps counting for longer.` },
    ],
    body: (h) => `
<h2>Three zones on the curve</h2>
<p>The ${h.src('cssD843', 'Social Security Code, article D843-2')} splits a worker’s earnings into three zones. Below ${h.eur(seuil(h), 2)}, nothing. Between ${h.eur(seuil(h), 2)} and ${h.eur(plafond(h), 2)}, a steady ramp. Above, a plateau at ${h.eur(max(h), 2)}, or ${h.pct(h.P.pa.bonif.taux_max, 1)} of the ${h.eur(h.P.pa.montant_forfaitaire, 2)} flat-rate amount. The limits are multiples of the ${h.src('spSmic', 'gross hourly Smic')}, ${h.eur(h.P.smic.horaire_brut, 2)} in 2026, while the comparison uses net earnings (the “net social” amount on payslips). That is why a full-time net Smic sits on the ramp rather than at the ceiling.</p>
${h.table(['Monthly earnings', 'Top-up', 'Share of maximum', 'Single person’s bonus'], points(h).map((x) => [h.eur(x, 2), h.eur(h.M.bonification(x), 2), h.pct(h.M.bonification(x) / max(h), 0), h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: x }).prime)]), '1 April 2026 scale, single person with no other income (estimate)', ['r', 'r', 'r', 'r'])}
<!--mini:paBonif-->

<h2>Working it out by hand</h2>
<p>The formula is a simple proportion. Top-up = ${h.eur(max(h), 2)} × (earnings − ${h.eur(seuil(h), 2)}) ÷ (${h.eur(plafond(h), 2)} − ${h.eur(seuil(h), 2)}). For a home-care worker averaging ${h.eur(1050)}: (1,050 − ${h.num(seuil(h), 2)}) ÷ ${h.num(plafond(h) - seuil(h), 2)} = ${h.num((1050 - seuil(h)) / (plafond(h) - seuil(h)), 3)}, times ${h.num(max(h), 2)}, which gives ${h.eur(h.M.bonification(1050), 2)}. The site’s engine rounds the result to the cent.</p>
<p>“Earnings” here means the person’s own income from work, averaged over the reference quarter. Unemployment benefit or a pension is not part of it: it never triggers a top-up, even when it lifts total resources above the threshold.</p>

<h2>In hours worked on the minimum wage</h2>
<p>The limits are written in gross hourly Smic, but employees think in hours. On the net Smic, an hour brings in about ${h.eur(hNet(h), 2)} (${h.eur(h.P.smic.mensuel_net, 2)} for a 35-hour week). The entry threshold therefore matches ${h.num(seuil(h) / hNet(h), 0)} paid hours a month, roughly ${h.num(seuil(h) / hNet(h) * 12 / 52, 0)} hours a week. The ceiling would need ${h.num(plafond(h) / hNet(h), 0)} hours a month, more than full time. A worker paid the Smic never reaches the maximum top-up: they would need pay about ${h.pct(plafond(h) / h.P.smic.mensuel_net - 1, 0)} above the net Smic, or regular overtime. Conversely, a 15-hour weekly contract at the Smic stays below the threshold and earns no top-up. Moving to 20 or 24 hours, common in cleaning or catering, puts you on the ramp.</p>
<p>One last point often surprises people: the top-up depends on the amount earned, not on hours worked. A half-time manager paid ${h.eur(1800)} net gets the maximum top-up, while a full-time employee on the Smic receives only ${h.eur(h.M.bonification(h.P.smic.mensuel_net), 2)}. The phrase “hourly minimum wage” in the rule is a unit of measurement, not a condition on working time.</p>

<h2>Why the top-up exists</h2>
<p>Without it, a single person’s bonus would fall by 40 cents for every euro earned once pay passes the flat rate. Half-time and full-time work on the Smic would end up very close once the bonus is added. The ramp makes up part of the gap: between the two limits, the worker gets back about ${h.num(pente(h) * 100, 1)} cents per euro, and the bonus only falls by around fifteen cents. It is the piece of the formula that makes full-time work pay better than part-time.</p>

<h2>One worker, one top-up</h2>
<p>In a couple, each partner has their own, based on their own pay. Two wages of ${h.eur(1000)} bring ${h.eur(2 * h.M.bonification(1000), 2)} of top-ups in total; a single wage of ${h.eur(2000)} brings ${h.eur(h.M.bonification(2000), 2)}. Each wage must clear the entry threshold on its own, which works against couples with two modest incomes. The ${h.a('prime-activite-couple', 'activity bonus for couples')} page compares several splits. According to the ${h.src('spPa', 'service-public.fr sheet F2882')}, every working member of the household qualifies, employed or not.</p>

<h2>Uneven months</h2>
<p>The quarterly average smooths out swings, though not always in your favour. A temp worker paid ${h.eur(1400)}, ${h.eur(300)} and then ${h.eur(1400)} shows an average of ${h.eur(1033)}, for a top-up of ${h.eur(h.M.bonification(1033), 2)}. The same quarterly pay spread evenly would give exactly the same, since only the average counts. A very high month, though, such as a thirteenth-month bonus paid in one go, can lift the average above the ceiling for a quarter: the top-up then stays stuck at ${h.eur(max(h), 2)} while resources keep rising with no limit.</p>

<h2>What moves the limits in 2026</h2>
<p>Two parameters, two texts. The threshold and the ceiling follow the gross hourly Smic, so any Smic increase shifts them. The maximum follows the flat-rate amount, uprated on 1 April 2026 by the ${h.src('decretPa2026', 'decree of 30 March 2026')}. Our ${h.a('simulateur-prime-activite', 'calculator')} reads both from the same parameter file and updates with them.</p>
`,
  },
});
