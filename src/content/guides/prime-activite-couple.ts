import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Couple : un Smic net d'un côté, un second salaire variable de l'autre. */
const smic = (h: Helpers) => h.P.smic.mensuel_net;
const c = (h: Helpers, s2: number, enfants = 0, s1 = smic(h)) => h.M.primeActivite({ couple: true, enfants, revenu1: s1, revenu2: s2 });
const seconds = (h: Helpers) => [0, 400, 800, 1200, smic(h)];

export default defineGuide({
  id: 'prime-activite-couple',
  group: 'activite',
  order: 30,
  mini: 'paCouple',
  related: ['simulateur-prime-activite', 'prime-activite-celibataire', 'prime-activite-smic', 'prime-activite-bonification', 'apl-couple'],
  sources: ['spPa', 'decretPa2026', 'cssD843'],
  fr: {
    slug: 'prime-activite-couple',
    nav: 'Couple',
    card: 'Un ou deux salaires dans le foyer : ce que le second revenu change à la prime du couple.',
    title: 'Prime d’activité couple 2026 : un ou deux salaires, montant',
    description: 'Prime d’activité 2026 en couple : 957,42 € de forfaitaire, une bonification par salaire. Un seul Smic donne environ 550 €, deux Smic beaucoup moins. Simulateur.',
    h1: 'Prime d’activité en couple',
    intro: 'Marié, pacsé ou en union libre, le couple forme un seul foyer pour la CAF, et le second salaire pèse lourd dans le calcul.',
    resume: (h) => `Un couple sans enfant dont un seul membre travaille au Smic net de ${h.eur(smic(h), 2)} peut recevoir environ ${h.eur(c(h, 0).prime)} de prime d’activité par mois au barème du 1er avril 2026. Si le second conjoint gagne ${h.eur(800)}, la prime tombe vers ${h.eur(c(h, 800).prime)}, et à ${h.eur(c(h, smic(h)).prime)} quand les deux sont au Smic. Le foyer dispose d’un montant forfaitaire de ${h.eur(h.M.forfaitairePa(true, 0), 2)}, soit une fois et demie celui d’une personne seule, et chaque conjoint qui travaille ouvre sa propre bonification individuelle, jusqu’à ${h.eur(h.M.bonificationMax(), 2)}. Mais tous les revenus du couple s’additionnent dans les ressources : un second salaire rapporte ${h.pct(h.P.pa.taux_revenus, 2)} de lui-même à la prime et en retire la totalité. Le revenu du ménage progresse toujours, la prime diminue. Les montants sont des estimations ; la CAF calcule le droit sur la déclaration trimestrielle commune.`,
    faqs: (h) => [
      { q: 'Mon conjoint ne travaille pas, a-t-on droit à la prime d’activité ?', a: `Oui, si l’un des deux travaille. Un seul salaire au Smic dans un couple sans enfant donne environ ${h.eur(c(h, 0).prime)} par mois, car le forfaitaire du foyer, ${h.eur(h.M.forfaitairePa(true, 0), 2)}, couvre deux personnes. Les allocations chômage du conjoint inactif comptent toutefois dans les ressources et réduisent la prime à due concurrence.` },
      { q: 'Le salaire de mon conjoint fait-il baisser ma prime d’activité ?', a: `Oui. Au-dessus du forfaitaire, chaque euro gagné par le conjoint retire un euro de prime et en rend ${h.pct(h.P.pa.taux_revenus, 2)}, plus sa bonification s’il dépasse ${h.eur(h.M.seuilBonification(), 2)}. Avec un premier salaire au Smic, un second de ${h.eur(400)} fait passer la prime de ${h.eur(c(h, 0).prime)} à ${h.eur(c(h, 400).prime)}.` },
      { q: 'Pacsés ou en concubinage, la CAF nous traite-t-elle comme un couple ?', a: `Oui. Service-public range le mariage, le Pacs et le concubinage (union libre) sous la même définition du couple. Deux personnes qui vivent ensemble déclarent leurs revenus sur une seule demande et reçoivent une seule prime, calculée sur le forfaitaire de couple de ${h.eur(h.M.forfaitairePa(true, 0), 2)}. Cacher une vie commune expose à un indu.` },
      { q: 'Jusqu’à quel salaire un couple sans enfant garde la prime d’activité ?', a: `Avec un seul salaire, jusque vers ${h.eur(h.M.seuilSortiePrime({ couple: true, enfants: 0 }))} net par mois au barème d’avril 2026. Avec deux enfants, le seuil recule vers ${h.eur(h.M.seuilSortiePrime({ couple: true, enfants: 2 }))}. Quand les deux travaillent, la sortie dépend de la répartition : deux salaires de ${h.eur(1500)} laissent encore ${h.eur(c(h, 1500, 0, 1500).prime)}.` },
      { q: 'Vaut-il mieux qu’un seul conjoint travaille pour garder la prime ?', a: `Non : le revenu du ménage monte toujours. Passer d’un à deux Smic réduit la prime de ${h.eur(c(h, 0).prime - c(h, smic(h)).prime)}, mais ajoute ${h.eur(smic(h))} de salaire. Le gain net reste d’environ ${h.eur(smic(h) - (c(h, 0).prime - c(h, smic(h)).prime))} par mois, avant frais de garde ou de transport, qui ne sont pas pris en compte.` },
    ],
    body: (h) => `
<h2>Un forfaitaire pour deux, deux bonifications</h2>
<p>Le couple n’a pas deux primes mais une seule, calculée sur le foyer. Son point de départ, le montant forfaitaire, vaut ${h.eur(h.M.forfaitairePa(true, 0), 2)} sans enfant : le montant de base de ${h.eur(h.P.pa.montant_forfaitaire, 2)} augmenté de ${h.pct(h.P.pa.majoration.deuxieme, 0)} pour la deuxième personne, comme l’indique la ${h.src('spPa', 'fiche F2882')}. Les revenus professionnels des deux conjoints s’additionnent pour la part de ${h.pct(h.P.pa.taux_revenus, 2)}.</p>
<p>La bonification fait exception : elle se calcule salaire par salaire, selon le ${h.src('cssD843', 'code de la sécurité sociale')}. Un couple dont chacun gagne ${h.eur(1000)} touche deux bonifications de ${h.eur(h.M.bonification(1000), 2)}, soit ${h.eur(2 * h.M.bonification(1000), 2)}, alors qu’un couple où un seul gagne ${h.eur(2000)} n’en touche qu’une, mais au plafond de ${h.eur(h.M.bonification(2000), 2)}. À revenus égaux, le second foyer reçoit ${h.eur(c(h, 0, 0, 2000).prime - c(h, 1000, 0, 1000).prime)} de plus par mois : chaque salaire doit franchir seul le seuil de ${h.eur(h.M.seuilBonification(), 2)} avant d’ouvrir le premier euro de bonification.</p>

<h2>L’effet du second salaire</h2>
<p>Le premier conjoint gagne le Smic net. Le tableau fait varier le salaire de l’autre, sans enfant, sans aide au logement.</p>
${h.table(['Second salaire', 'Bonifications', 'Prime du couple', 'Revenu du ménage'], seconds(h).map((s) => [h.eur(s), h.eur(c(h, s).bonif), h.eur(c(h, s).prime), h.eur(smic(h) + s + c(h, s).prime)]), 'Couple sans enfant, premier salaire au Smic net, barème du 1er avril 2026 (estimation)', ['r', 'r', 'r', 'r'])}
<p>Les premiers euros du second salaire sont les plus taxés : sous ${h.eur(h.M.seuilBonification())}, ils n’ouvrent aucune bonification, et chacun retire environ 40 centimes de prime. Au-delà, la bonification du second conjoint adoucit la pente. Quand les deux sont au Smic, le foyer touche encore ${h.eur(c(h, smic(h)).prime)} par mois, ce qui surprend souvent les couples qui pensaient avoir dépassé les plafonds.</p>
<!--mini:paCouple-->

<h2>Même revenu total, prime différente</h2>
<p>Parce que la bonification suit chaque salaire, la façon dont le couple partage ${h.eur(2000)} de revenus change la prime. Le tableau garde le même total et déplace les heures d’un conjoint à l’autre.</p>
${h.table(['Répartition', 'Bonifications', 'Prime du couple'], [[2000, 0], [1500, 500], [1200, 800], [1000, 1000]].map(([a, b]) => [`${h.eur(a)} + ${h.eur(b)}`, h.eur(c(h, b, 0, a).bonif), h.eur(c(h, b, 0, a).prime)]), 'Couple sans enfant, 2 000 € de salaires nets au total (estimation)', ['l', 'r', 'r'])}
<p>L’écart vient entièrement des bonifications. Chacune ne démarre qu’au-dessus de ${h.eur(h.M.seuilBonification())} : deux salaires moyens subissent ce seuil deux fois, alors qu’un seul salaire qui dépasse ${h.eur(h.M.plafondBonification())} décroche d’un coup la bonification maximale. Le partage égal, qui paraît le plus juste, est ici le moins favorable. Personne ne règle son temps de travail sur ce seul critère, mais l’effet aide à comprendre pourquoi deux couples aux revenus identiques ne touchent pas la même prime.</p>

<h2>Lecture d’un calcul : un Smic et 800 €</h2>
<p>Elle est aide-soignante au Smic, lui travaille quelques matinées par semaine pour ${h.eur(800)} net. Le forfaitaire du couple, ${h.eur(h.M.forfaitairePa(true, 0), 2)}, s’ajoute à ${h.eur(c(h, 800).partRevenus, 2)} de part des revenus et à ${h.eur(c(h, 800).bonif, 2)} de bonifications, dont ${h.eur(h.M.bonification(800), 2)} seulement pour lui. On retranche les ressources, ${h.eur(smic(h) + 800)}, supérieures au forfaitaire. Reste ${h.eur(c(h, 800).prime, 2)} par mois.</p>

<h2>Avec des enfants, le calcul s’élargit</h2>
<p>Chaque enfant à charge relève le forfaitaire : ${h.eur(h.M.forfaitairePa(true, 1), 2)} avec un enfant, ${h.eur(h.M.forfaitairePa(true, 2), 2)} avec deux, puis +${h.pct(h.P.pa.majoration.au_dela_troisieme_enfant, 0)} du montant de base à partir du troisième. Un couple avec deux enfants et un seul Smic reçoit environ ${h.eur(c(h, 0, 2).prime)} ; avec deux Smic, ${h.eur(c(h, smic(h), 2).prime)}. Mais les allocations familiales, versées dès le deuxième enfant, comptent dans les ressources : à ${h.eur(h.P.af.tranches_nettes.deux[0], 2)} par mois, elles retranchent la même somme de la prime, soit ${h.eur(h.M.primeActivite({ couple: true, enfants: 2, revenu1: smic(h), revenu2: 0, autres: h.P.af.tranches_nettes.deux[0] }).prime)} pour le foyer à un salaire.</p>

<h2>Trois situations de couple qui trompent</h2>
<h3>Le conjoint au chômage</h3>
<p>Son allocation n’est pas un revenu d’activité. Elle entre en entier dans les ressources, sans part de ${h.pct(h.P.pa.taux_revenus, 2)} ni bonification. Un Smic plus ${h.eur(900)} de chômage ramène la prime du couple sans enfant à ${h.eur(h.M.primeActivite({ couple: true, enfants: 0, revenu1: smic(h), revenu2: 0, autres: 900 }).prime)}.</p>
<h3>Le conjoint étudiant sans emploi</h3>
<p>Il compte dans le foyer et augmente le forfaitaire, comme tout conjoint sans revenu. Ses propres ressources éventuelles figurent sur la même déclaration trimestrielle que le salaire de l’autre conjoint.</p>
<h3>La vie commune non déclarée</h3>
<p>Deux personnes qui partagent un logement et une vie de couple sans le signaler reçoivent deux primes de célibataire. Le contrôle de la CAF peut requalifier la situation et réclamer la différence sur plusieurs trimestres. Mieux vaut déclarer la mise en couple le mois où elle intervient.</p>

<h2>Une seule déclaration, tous les trois mois</h2>
<p>Chaque trimestre, le couple valide une déclaration commune : les salaires des deux conjoints y sont préremplis en montant net social. Le droit est fixé pour trois mois. Si l’un des deux perd son emploi ou reprend un travail en cours de trimestre, la prime ne bouge qu’au trimestre suivant. La page ${h.a('prime-activite-declaration-trimestrielle', 'déclaration trimestrielle')} explique ce décalage. Pour un couple dont les salaires changent souvent, le ${h.a('simulateur-prime-activite', 'simulateur complet')} permet de tester plusieurs trimestres à la suite.</p>
`,
  },
  en: {
    slug: 'activity-bonus-couple',
    nav: 'Couple',
    card: 'One earner or two: what the second wage does to a couple’s activity bonus.',
    title: 'Activity Bonus for Couples 2026: One or Two Wages Compared',
    description: 'Activity bonus 2026 for couples in France: a €957.42 flat rate and one top-up per earner. One minimum wage brings about €550 a month, two wages far less.',
    h1: 'Activity bonus for couples',
    intro: 'Married, in a PACS or simply living together, a couple is one household for the CAF, and the second wage weighs heavily in the sum.',
    resume: (h) => `A couple with no children where only one partner works, on the net minimum wage (Smic) of ${h.eur(smic(h), 2)}, can receive about ${h.eur(c(h, 0).prime)} a month of prime d’activité, the monthly in-work benefit that the CAF, France’s family benefits office, pays to modest earners, under the rates in force since 1 April 2026. If the other partner earns ${h.eur(800)}, the bonus drops to about ${h.eur(c(h, 800).prime)}, and to ${h.eur(c(h, smic(h)).prime)} when both are on the Smic. The household gets a flat-rate amount of ${h.eur(h.M.forfaitairePa(true, 0), 2)}, one and a half times the single-person figure, and each working partner earns their own individual top-up, worth up to ${h.eur(h.M.bonificationMax(), 2)}. All of the couple’s income is pooled into resources, though: a second wage adds ${h.pct(h.P.pa.taux_revenus, 2)} of itself to the bonus and removes all of itself. Household income always rises; the bonus shrinks. These are estimates; the CAF calculates the entitlement from the joint quarterly return.`,
    faqs: (h) => [
      { q: 'My partner does not work, can we still get the activity bonus?', a: `Yes, as long as one of you works. A single minimum wage in a childless couple brings about ${h.eur(c(h, 0).prime)} a month, because the household flat rate of ${h.eur(h.M.forfaitairePa(true, 0), 2)} covers two people. Any unemployment benefit received by the partner who is not working still counts as resources and lowers the bonus euro for euro.` },
      { q: 'Does my partner’s salary reduce our activity bonus?', a: `Yes. Above the flat rate, each euro your partner earns removes a euro of bonus and gives back ${h.pct(h.P.pa.taux_revenus, 2)}, plus their own top-up once they pass ${h.eur(h.M.seuilBonification(), 2)}. With one wage at the Smic, a second wage of ${h.eur(400)} takes the bonus from ${h.eur(c(h, 0).prime)} to ${h.eur(c(h, 400).prime)}.` },
      { q: 'We are in a PACS or just living together, does the CAF see us as a couple?', a: `Yes. Service-public.fr puts marriage, the PACS (civil partnership) and cohabitation (concubinage or union libre) under the same definition of a couple. Two people living together declare their income on one claim and receive one bonus, based on the couple flat rate of ${h.eur(h.M.forfaitairePa(true, 0), 2)}. Hiding a shared life leads to repayment demands.` },
      { q: 'Up to what salary does a childless couple keep the activity bonus?', a: `With one wage, up to about ${h.eur(h.M.seuilSortiePrime({ couple: true, enfants: 0 }))} net a month at April 2026 rates. With two children, the cut-off moves to about ${h.eur(h.M.seuilSortiePrime({ couple: true, enfants: 2 }))}. When both work, it depends on the split: two wages of ${h.eur(1500)} still leave ${h.eur(c(h, 1500, 0, 1500).prime)} for the household each month.` },
      { q: 'Is it better for only one of us to work to keep the bonus?', a: `No: household income always goes up. Moving from one to two minimum wages cuts the bonus by ${h.eur(c(h, 0).prime - c(h, smic(h)).prime)} but adds ${h.eur(smic(h))} of pay. The net gain is still around ${h.eur(smic(h) - (c(h, 0).prime - c(h, smic(h)).prime))} a month, before childcare or travel costs, which the formula ignores.` },
    ],
    body: (h) => `
<h2>One flat rate for two, two top-ups</h2>
<p>A couple does not get two bonuses but one, worked out for the household. Its starting point, the flat-rate amount (montant forfaitaire), is ${h.eur(h.M.forfaitairePa(true, 0), 2)} without children: the ${h.eur(h.P.pa.montant_forfaitaire, 2)} base raised by ${h.pct(h.P.pa.majoration.deuxieme, 0)} for the second person, as the ${h.src('spPa', 'service-public.fr sheet F2882')} sets out. Both partners’ earnings are added together for the ${h.pct(h.P.pa.taux_revenus, 2)} share.</p>
<p>The top-up is the exception: it is calculated wage by wage, under the ${h.src('cssD843', 'Social Security Code')}. A couple who each earn ${h.eur(1000)} get two top-ups of ${h.eur(h.M.bonification(1000), 2)}, or ${h.eur(2 * h.M.bonification(1000), 2)} together, while a couple where one partner earns ${h.eur(2000)} get just one, but at the ceiling of ${h.eur(h.M.bonification(2000), 2)}. For the same total pay, the second household receives ${h.eur(c(h, 0, 0, 2000).prime - c(h, 1000, 0, 1000).prime)} more a month: each wage has to clear the ${h.eur(h.M.seuilBonification(), 2)} threshold on its own before earning its first euro of top-up.</p>

<h2>What the second wage does</h2>
<p>The first partner earns the net Smic. The table varies the other partner’s pay, with no children and no housing aid.</p>
${h.table(['Second wage', 'Top-ups', 'Couple’s bonus', 'Household income'], seconds(h).map((s) => [h.eur(s), h.eur(c(h, s).bonif), h.eur(c(h, s).prime), h.eur(smic(h) + s + c(h, s).prime)]), 'Couple, no children, first wage at net Smic, 1 April 2026 rates (estimate)', ['r', 'r', 'r', 'r'])}
<p>The first euros of a second wage are hit hardest: below ${h.eur(h.M.seuilBonification())}, they earn no top-up, and each one removes about 40 cents of bonus. Above that, the second partner’s top-up softens the slope. With both on the Smic, the household still gets ${h.eur(c(h, smic(h)).prime)} a month, which often surprises couples who assumed they were over the limit.</p>
<!--mini:paCouple-->

<h2>Same total pay, different bonus</h2>
<p>Because the top-up follows each wage, the way a couple splits ${h.eur(2000)} of earnings changes the bonus. The table keeps the total fixed and moves hours from one partner to the other.</p>
${h.table(['Split', 'Top-ups', 'Couple’s bonus'], [[2000, 0], [1500, 500], [1200, 800], [1000, 1000]].map(([a, b]) => [`${h.eur(a)} + ${h.eur(b)}`, h.eur(c(h, b, 0, a).bonif), h.eur(c(h, b, 0, a).prime)]), 'Couple, no children, €2,000 of total net pay (estimate)', ['l', 'r', 'r'])}
<p>The whole gap comes from the top-ups. Each one only starts above ${h.eur(h.M.seuilBonification())}: two middling wages hit that threshold twice, while a single wage above ${h.eur(h.M.plafondBonification())} collects the maximum top-up in one go. The even split, which looks fairest, is the least favourable here. Nobody sets their working hours on that basis alone, but it explains why two couples with identical earnings do not receive the same bonus.</p>

<h2>Reading one sum: a minimum wage plus €800</h2>
<p>She works as a care assistant on the Smic; he works a few mornings a week for ${h.eur(800)} net. The couple’s flat rate, ${h.eur(h.M.forfaitairePa(true, 0), 2)}, is added to ${h.eur(c(h, 800).partRevenus, 2)} for the share of earnings and ${h.eur(c(h, 800).bonif, 2)} of top-ups, of which only ${h.eur(h.M.bonification(800), 2)} is his. Their resources, ${h.eur(smic(h) + 800)}, are higher than the flat rate, so that figure is deducted. What is left is ${h.eur(c(h, 800).prime, 2)} a month.</p>

<h2>With children, the sum widens</h2>
<p>Each dependent child lifts the flat rate: ${h.eur(h.M.forfaitairePa(true, 1), 2)} with one child, ${h.eur(h.M.forfaitairePa(true, 2), 2)} with two, then +${h.pct(h.P.pa.majoration.au_dela_troisieme_enfant, 0)} of the base from the third. A couple with two children and one minimum wage gets about ${h.eur(c(h, 0, 2).prime)}; with two minimum wages, ${h.eur(c(h, smic(h), 2).prime)}. But family allowances (allocations familiales), paid from the second child, count as resources: at ${h.eur(h.P.af.tranches_nettes.deux[0], 2)} a month they take the same amount off the bonus, leaving ${h.eur(h.M.primeActivite({ couple: true, enfants: 2, revenu1: smic(h), revenu2: 0, autres: h.P.af.tranches_nettes.deux[0] }).prime)} for the one-wage household.</p>

<h2>Three couple situations that catch people out</h2>
<h3>A partner on unemployment benefit</h3>
<p>Benefit from France Travail is not earned income. It goes into resources in full, with no ${h.pct(h.P.pa.taux_revenus, 2)} share and no top-up. One Smic plus ${h.eur(900)} of benefit brings a childless couple’s bonus down to ${h.eur(h.M.primeActivite({ couple: true, enfants: 0, revenu1: smic(h), revenu2: 0, autres: 900 }).prime)}.</p>
<h3>A partner who studies and does not work</h3>
<p>They count in the household and raise the flat rate, like any partner without income. Any income of their own goes on the same quarterly return as the working partner’s pay.</p>
<h3>Living together without telling the CAF</h3>
<p>Two people sharing a home and a life as a couple without reporting it receive two single-person bonuses. A CAF check can reclassify the household and claim back the difference over several quarters. It is safer to report moving in together in the month it happens.</p>

<h2>One return every three months</h2>
<p>Each quarter, the couple confirms a joint return: both partners’ pay is pre-filled at the “net social” amount shown on payslips. The entitlement is then fixed for three months. If one partner loses a job or starts one mid-quarter, the bonus only changes the following quarter. The ${h.a('prime-activite-declaration-trimestrielle', 'quarterly return')} page explains that lag. For couples whose pay changes often, the ${h.a('simulateur-prime-activite', 'full calculator')} lets you test several quarters in a row.</p>
`,
  },
});
