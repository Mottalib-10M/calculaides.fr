import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Salarié seul, payé au Smic, à différentes quotités de travail. */
const smic = (h: Helpers) => h.P.smic.mensuel_net;
const q = (h: Helpers, k: number, autres = 0) => h.M.primeActivite({ couple: false, enfants: 0, revenu1: smic(h) * k, autres });
const QUOTITES = [0.3, 0.5, 0.6, 0.7, 0.8, 1];
const fam = (h: Helpers, k: number) => h.M.primeActivite({ couple: true, enfants: 2, revenu1: smic(h), revenu2: smic(h) * k });
const tot = (h: Helpers, k: number) => smic(h) * k + q(h, k).prime;

export default defineGuide({
  id: 'prime-activite-temps-partiel',
  group: 'activite',
  order: 60,
  mini: 'paTempsPartiel',
  related: ['simulateur-prime-activite', 'prime-activite-bonification', 'prime-activite-celibataire', 'prime-activite-smic', 'rsa-cumul-salaire'],
  sources: ['spPa', 'cssD843', 'spSmic', 'decretPa2026'],
  fr: {
    slug: 'prime-activite-temps-partiel',
    nav: 'Temps partiel',
    card: 'Mi-temps, 80 %, deux employeurs : ce que la prime ajoute à un salaire réduit.',
    title: 'Prime d’activité temps partiel 2026 : mi-temps et 80 %',
    description: 'Prime d’activité 2026 à temps partiel : au Smic à mi-temps, environ 345 € par mois, plus qu’à temps plein. Quotités de 30 à 100 %, deux employeurs, simulateur.',
    h1: 'Prime d’activité à temps partiel',
    intro: 'Moins d’heures, plus de prime : à temps partiel, la prime d’activité rattrape une partie du salaire perdu, mais pas tout.',
    resume: (h) => `Un salarié seul payé au Smic à mi-temps, soit ${h.eur(smic(h) / 2)} net par mois, peut recevoir environ ${h.eur(q(h, 0.5).prime)} de prime d’activité au barème du 1er avril 2026, davantage que les ${h.eur(q(h, 1).prime)} d’un temps plein au Smic. Ce n’est pas une anomalie : à mi-temps, le salaire reste sous le montant forfaitaire de ${h.eur(h.P.pa.montant_forfaitaire, 2)}, et la prime vaut alors ${h.pct(h.P.pa.taux_revenus, 2)} du salaire, bonification en plus. Au total, le mi-temps procure ${h.eur(tot(h, 0.5))} par mois, le temps plein ${h.eur(tot(h, 1))} : la prime réduit l’écart sans le combler. À 80 %, la prime tombe à ${h.eur(q(h, 0.8).prime)} et le revenu total atteint ${h.eur(tot(h, 0.8))}. Les heures comptent aussi pour la bonification individuelle, qui ne démarre qu’au-dessus de ${h.eur(h.M.seuilBonification(), 2)} de salaire. Ces chiffres valent pour une personne seule sans autre ressource ni aide au logement ; seule la CAF arrête le montant définitif.`,
    faqs: (h) => [
      { q: 'À mi-temps au Smic, combien de prime d’activité peut-on toucher ?', a: `Environ ${h.eur(q(h, 0.5).prime)} par mois pour une personne seule sans autre ressource, au barème d’avril 2026. Le salaire, ${h.eur(smic(h) / 2)} net, reste sous le forfaitaire : la CAF ajoute ${h.pct(h.P.pa.taux_revenus, 2)} du salaire, soit ${h.eur(q(h, 0.5).partRevenus, 2)}, et une petite bonification de ${h.eur(q(h, 0.5).bonif, 2)}, à peine au-dessus du seuil d’entrée.` },
      { q: 'Passer de 80 % à temps plein fait-il perdre de la prime d’activité ?', a: `Oui, environ ${h.eur(q(h, 0.8).prime - q(h, 1).prime)} par mois au Smic pour une personne seule. Mais le salaire augmente de ${h.eur(smic(h) * 0.2)} : le revenu total gagne donc ${h.eur(tot(h, 1) - tot(h, 0.8))}. La bonification, qui suit le salaire, amortit une partie de la baisse. La hausse n’apparaît qu’au trimestre suivant le changement.` },
      { q: 'J’ai deux temps partiels chez deux employeurs, comment est calculée ma prime ?', a: `Vos deux salaires s’additionnent : la CAF raisonne sur vos revenus professionnels, pas sur chaque contrat. Deux mi-temps au Smic équivalent à un temps plein et donnent la même prime, ${h.eur(q(h, 1).prime)}. La bonification se calcule une seule fois sur le total. Les deux salaires sont normalement préremplis en montant net social sur la déclaration trimestrielle.` },
      { q: 'Temps partiel et allocation chômage, la prime d’activité reste-t-elle possible ?', a: `Oui, mais l’allocation compte en entier dans vos ressources, sans ouvrir de part de ${h.pct(h.P.pa.taux_revenus, 2)}. Avec un mi-temps au Smic et ${h.eur(400)} d’allocation, la prime estimée tombe de ${h.eur(q(h, 0.5).prime)} à ${h.eur(q(h, 0.5, 400).prime)}. Au-delà d’un certain montant d’allocation, elle disparaît : testez votre cas dans le simulateur.` },
      { q: 'Combien d’heures par semaine faut-il pour toucher la bonification ?', a: `Au Smic, un peu plus de ${h.num(h.M.seuilBonification() / (smic(h) / (35 * 52 / 12)) * 12 / 52, 0)} heures par semaine : la bonification démarre au-dessus de ${h.eur(h.M.seuilBonification(), 2)} de salaire mensuel, soit 59 Smic horaires bruts selon l’article D843-2 du code de la sécurité sociale. Un contrat de 15 heures reste en dessous ; un contrat de 24 heures donne environ ${h.eur(h.M.bonification(smic(h) * 24 / 35), 2)}.` },
    ],
    body: (h) => `
<h2>La prime selon la quotité</h2>
<p>Le tableau suit un même salarié au Smic dont seule la durée du travail change. Les colonnes montrent ce qui intéresse vraiment : combien il garde à la fin du mois.</p>
${h.table(['Quotité', 'Salaire net', 'Prime estimée', 'Revenu total'], QUOTITES.map((k) => [h.pct(k, 0), h.eur(smic(h) * k), h.eur(q(h, k).prime), h.eur(tot(h, k))]), 'Personne seule au Smic, sans autre ressource, barème du 1er avril 2026 (estimation)', ['l', 'r', 'r', 'r'])}
<p>La prime culmine autour de 43 % d’un temps plein, quand le salaire égale le forfaitaire de ${h.eur(h.P.pa.montant_forfaitaire, 2)}. En dessous, elle grandit avec chaque heure ; au-dessus, elle décroît lentement. Le revenu total, lui, monte à chaque palier : aucune quotité ne fait perdre de l’argent par rapport à la précédente.</p>
<!--mini:paTempsPartiel-->

<h2>Ce que rapporte vraiment une heure de plus</h2>
<p>Passer de 50 % à 60 % ajoute ${h.eur(smic(h) * 0.1)} de salaire et retire ${h.eur(q(h, 0.5).prime - q(h, 0.6).prime)} de prime : le gain net est de ${h.eur(tot(h, 0.6) - tot(h, 0.5))}. De 80 % à 100 %, le salaire monte de ${h.eur(smic(h) * 0.2)} et la prime baisse de ${h.eur(q(h, 0.8).prime - q(h, 1).prime)}. Dans cette zone, chaque euro de salaire en plus laisse environ 85 centimes, grâce à la bonification qui progresse en même temps.</p>
<p>Sous le forfaitaire, le calcul est encore plus favorable : un salarié à 30 % qui monte à 40 % voit à la fois son salaire et sa prime augmenter. C’est toute la logique de la prime : rendre chaque heure travaillée visible sur le revenu, même dans un petit contrat.</p>

<h2>Reprendre à temps partiel dans une famille</h2>
<p>Le cas typique : un parent reprend un emploi à temps partiel après quelques années au foyer, l’autre travaille déjà au Smic, deux enfants à charge. Le forfaitaire du foyer, ${h.eur(h.M.forfaitairePa(true, 2), 2)}, est assez élevé pour que la prime reste importante même avec deux salaires.</p>
${h.table(['Quotité du second parent', 'Prime du foyer', 'Revenu du foyer'], [0, 0.5, 0.6, 0.8, 1].map((k) => [h.pct(k, 0), h.eur(fam(h, k).prime), h.eur(smic(h) * (1 + k) + fam(h, k).prime)]), 'Couple, 2 enfants, premier salaire au Smic, sans allocations familiales ni aide au logement (estimation)', ['l', 'r', 'r'])}
<p>Le passage à mi-temps du second parent coûte ${h.eur(fam(h, 0).prime - fam(h, 0.5).prime)} de prime mais rapporte ${h.eur(smic(h) / 2)} de salaire. Ce calcul n’intègre ni les allocations familiales, qui s’ajoutent aux ressources, ni les frais de garde, qui pèsent souvent davantage que la prime perdue. La reprise se répercute sur la prime avec un trimestre de retard : prévoir le budget en conséquence.</p>

<h2>Deux employeurs, un seul calcul</h2>
<p>Beaucoup de temps partiels se cumulent : aide à domicile chez plusieurs particuliers, agent d’entretien sur deux sites, vendeur le samedi en plus d’un poste en semaine. Pour la CAF, seuls comptent vos revenus professionnels du mois, tous employeurs confondus. La ${h.src('spPa', 'fiche F2882')} précise que la déclaration trimestrielle préremplie reprend vos salaires en montant net social : vérifiez que chaque employeur y figure et complétez si une ligne manque, avant de valider.</p>
<p>La bonification, elle, porte sur le total de vos revenus et non sur chaque contrat. Deux mi-temps de ${h.eur(smic(h) / 2)} ouvrent la même bonification qu’un temps plein, ${h.eur(h.M.bonification(smic(h)), 2)}, et non deux petites bonifications.</p>

<h2>Les heures complémentaires et les mois creux</h2>
<p>Le salaire d’un temps partiel bouge souvent : heures complémentaires en décembre, contrat réduit l’été. La CAF ne regarde pas chaque mois isolément mais la moyenne du trimestre de référence, et fixe la prime pour les trois mois suivants. Un trimestre chargé en heures fait donc baisser la prime du trimestre d’après, même si vous êtes revenu à votre horaire normal. Inversement, un trimestre creux la relève plus tard, quand le salaire est peut-être déjà remonté. Le décalage est expliqué sur la page ${h.a('prime-activite-declaration-trimestrielle', 'déclaration trimestrielle')}.</p>

<h2>Temps partiel et autres ressources</h2>
<p>Le temps partiel va souvent avec un complément : allocation de France Travail en activité réduite, pension d’invalidité, pension alimentaire. Toutes entrent dans les ressources du foyer sans ouvrir de part de ${h.pct(h.P.pa.taux_revenus, 2)} ni de bonification. Elles sont la première cause de prime nulle chez les salariés à temps partiel. Un mi-temps au Smic avec ${h.eur(700)} d’autres ressources ne laisse plus que ${h.eur(q(h, 0.5, 700).prime)} de prime estimée.</p>
<p>Pour les foyers aux revenus très faibles, le RSA peut se cumuler avec un salaire et compléter la prime : voir ${h.a('rsa-cumul-salaire', 'RSA et salaire')}. Le ${h.a('simulateur-prime-activite', 'simulateur de prime d’activité')} accepte ces autres ressources ; les seuils de bonification suivent le ${h.src('cssD843', 'code de la sécurité sociale')} et le ${h.src('spSmic', 'Smic 2026')}.</p>
`,
  },
  en: {
    slug: 'activity-bonus-part-time',
    nav: 'Part-time work',
    card: 'Half-time, 80%, two employers: what the activity bonus adds to reduced pay.',
    title: 'Activity Bonus Part-Time 2026: Half-Time and 80% Contracts',
    description: 'Activity bonus 2026 for part-time work in France: on a half-time minimum wage, about €345 a month, more than full time. Hours from 30 to 100%, two employers.',
    h1: 'Activity bonus for part-time workers',
    intro: 'Fewer hours, more bonus: part-time, the activity bonus makes up some of the lost pay, though not all of it.',
    resume: (h) => `A single employee on a half-time minimum wage (Smic), ${h.eur(smic(h) / 2)} net a month, can receive about ${h.eur(q(h, 0.5).prime)} of prime d’activité, the CAF’s supplement for people in work on modest pay, at 1 April 2026 rates. That is more than the ${h.eur(q(h, 1).prime)} paid on a full-time Smic. It is not a glitch: at half time, pay stays below the flat-rate amount of ${h.eur(h.P.pa.montant_forfaitaire, 2)}, so the bonus equals ${h.pct(h.P.pa.taux_revenus, 2)} of pay plus any top-up. In total, half time brings ${h.eur(tot(h, 0.5))} a month and full time ${h.eur(tot(h, 1))}: the bonus narrows the gap without closing it. At 80%, the bonus drops to ${h.eur(q(h, 0.8).prime)} and total income reaches ${h.eur(tot(h, 0.8))}. Hours also matter for the individual top-up, which only starts above ${h.eur(h.M.seuilBonification(), 2)} of pay. These figures assume a single person with no other income and no housing aid; only the CAF fixes the final amount.`,
    faqs: (h) => [
      { q: 'On a half-time minimum wage, how much activity bonus can I get?', a: `About ${h.eur(q(h, 0.5).prime)} a month for a single person with no other income, at April 2026 rates. Pay of ${h.eur(smic(h) / 2)} net stays below the flat rate, so the CAF adds ${h.pct(h.P.pa.taux_revenus, 2)} of pay, ${h.eur(q(h, 0.5).partRevenus, 2)}, and a small top-up of ${h.eur(q(h, 0.5).bonif, 2)}, only just above the entry threshold.` },
      { q: 'Will going from 80% to full time cost me activity bonus?', a: `Yes, about ${h.eur(q(h, 0.8).prime - q(h, 1).prime)} a month on the Smic for a single person. But pay rises by ${h.eur(smic(h) * 0.2)}, so total income goes up by ${h.eur(tot(h, 1) - tot(h, 0.8))}. The top-up, which follows pay, absorbs part of the drop. The change only shows in the quarter after the switch.` },
      { q: 'I have two part-time jobs with two employers, how is my bonus worked out?', a: `Your two wages are added together: the CAF looks at your earnings, not at each contract. Two half-time jobs on the Smic equal one full-time job and give the same bonus, ${h.eur(q(h, 1).prime)}. The top-up is calculated once, on the total. Both wages should be pre-filled at the “net social” amount on your quarterly return.` },
      { q: 'Can I get the activity bonus with part-time pay and unemployment benefit?', a: `Yes, but the benefit counts in full as resources and adds no ${h.pct(h.P.pa.taux_revenus, 2)} share. With half-time Smic pay and ${h.eur(400)} of benefit, the estimated bonus falls from ${h.eur(q(h, 0.5).prime)} to ${h.eur(q(h, 0.5, 400).prime)}. Above a certain level of benefit it disappears: test your own case in the calculator.` },
      { q: 'How many hours a week do I need to get the top-up?', a: `On the Smic, a little over ${h.num(h.M.seuilBonification() / (smic(h) / (35 * 52 / 12)) * 12 / 52, 0)} hours a week: the top-up starts above ${h.eur(h.M.seuilBonification(), 2)} of monthly pay, or 59 gross hourly Smic under article D843-2 of the Social Security Code. A 15-hour contract stays below it; a 24-hour contract brings about ${h.eur(h.M.bonification(smic(h) * 24 / 35), 2)}.` },
    ],
    body: (h) => `
<h2>The bonus by working time</h2>
<p>The table follows one employee on the Smic whose hours alone change. The columns show what really matters: how much is left at the end of the month.</p>
${h.table(['Working time', 'Net pay', 'Estimated bonus', 'Total income'], QUOTITES.map((k) => [h.pct(k, 0), h.eur(smic(h) * k), h.eur(q(h, k).prime), h.eur(tot(h, k))]), 'Single person on the Smic, no other income, 1 April 2026 rates (estimate)', ['l', 'r', 'r', 'r'])}
<p>The bonus peaks at around 43% of full time, when pay equals the ${h.eur(h.P.pa.montant_forfaitaire, 2)} flat rate. Below that, it grows with every hour; above, it slowly falls. Total income rises at every step: no working time leaves you worse off than the one below it.</p>
<!--mini:paTempsPartiel-->

<h2>What one more hour is really worth</h2>
<p>Going from 50% to 60% adds ${h.eur(smic(h) * 0.1)} of pay and removes ${h.eur(q(h, 0.5).prime - q(h, 0.6).prime)} of bonus: a net gain of ${h.eur(tot(h, 0.6) - tot(h, 0.5))}. From 80% to 100%, pay rises by ${h.eur(smic(h) * 0.2)} and the bonus falls by ${h.eur(q(h, 0.8).prime - q(h, 1).prime)}. In this range, each extra euro of pay leaves you about 85 cents, thanks to the top-up rising at the same time.</p>
<p>Below the flat rate, the sum is even kinder: someone moving from 30% to 40% sees both pay and bonus rise. That is the whole logic of the bonus: every hour worked should show up in income, even on a small contract.</p>

<h2>Going back to part-time work in a family</h2>
<p>A typical case: one parent returns to a part-time job after a few years at home, the other already works on the Smic, and there are two dependent children. The household flat rate, ${h.eur(h.M.forfaitairePa(true, 2), 2)}, is high enough for the bonus to stay substantial even with two wages coming in.</p>
${h.table(['Second parent’s working time', 'Household bonus', 'Household income'], [0, 0.5, 0.6, 0.8, 1].map((k) => [h.pct(k, 0), h.eur(fam(h, k).prime), h.eur(smic(h) * (1 + k) + fam(h, k).prime)]), 'Couple, 2 children, first wage at the Smic, no family allowances or housing aid (estimate)', ['l', 'r', 'r'])}
<p>The second parent’s move to half time costs ${h.eur(fam(h, 0).prime - fam(h, 0.5).prime)} of bonus but brings in ${h.eur(smic(h) / 2)} of pay. This sum leaves out family allowances (allocations familiales), which are added to resources, and childcare costs, which often weigh more than the bonus lost. The return to work shows up in the bonus a quarter later, so plan the household budget around that delay.</p>
<p>For a family that has been living on one wage, the first months after the return look deceptively comfortable: the new salary is coming in while the bonus is still based on the old quarter. It then drops in one step, so it is wise to set some of that early money aside.</p>

<h2>Two employers, one sum</h2>
<p>Many part-time jobs are combined: home help for several households, cleaning on two sites, Saturday shop work on top of a weekday post. For the CAF, only your total earnings for the month count, whoever pays them. The ${h.src('spPa', 'service-public.fr sheet F2882')} says the pre-filled quarterly return shows your pay at the “net social” amount: check that every employer appears and add any missing line before you confirm it.</p>
<p>The top-up applies to your total earnings, not to each contract. Two half-time jobs at ${h.eur(smic(h) / 2)} earn the same top-up as one full-time job, ${h.eur(h.M.bonification(smic(h)), 2)}, not two small ones.</p>

<h2>Extra hours and quiet months</h2>
<p>Part-time pay often moves: extra hours (heures complémentaires) in December, a reduced contract in summer. The CAF does not look at each month on its own but at the average of the reference quarter, and fixes the bonus for the next three months. A busy quarter therefore lowers the following quarter’s bonus, even if you are back to normal hours. A quiet quarter lifts it later, when your pay may already have recovered. The lag is explained on the ${h.a('prime-activite-declaration-trimestrielle', 'quarterly return')} page.</p>

<h2>Part-time work and other income</h2>
<p>Part-time work often comes with something else: France Travail benefit while working reduced hours, an invalidity pension, child maintenance. All of these count as household resources without adding a ${h.pct(h.P.pa.taux_revenus, 2)} share or a top-up. They are the leading cause of a zero bonus among part-time workers. Half-time Smic pay plus ${h.eur(700)} of other income leaves an estimated bonus of only ${h.eur(q(h, 0.5, 700).prime)}.</p>
<p>For households on very low income, the RSA (minimum income) can be combined with pay and top up the bonus: see ${h.a('rsa-cumul-salaire', 'RSA and earnings')}. The ${h.a('simulateur-prime-activite', 'activity bonus calculator')} accepts this other income; the top-up limits follow the ${h.src('cssD843', 'Social Security Code')} and the ${h.src('spSmic', '2026 Smic')}.</p>
`,
  },
});
