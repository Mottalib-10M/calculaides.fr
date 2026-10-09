import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Personne seule avec forfait logement : RSA et prime d'activité pour un salaire net donné. */
const r = (h: Helpers, s: number) => h.M.rsa({ couple: false, enfants: 0, revenus: s, forfaitLogement: true }).rsa;
const pa = (h: Helpers, s: number) => h.M.primeActivite({ couple: false, enfants: 0, revenu1: s, forfaitLogement: true }).prime;
const tot = (h: Helpers, s: number) => s + r(h, s) + pa(h, s);
const finRsa = (h: Helpers) => h.P.rsa.montant_forfaitaire - h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa);
const lea = 600;

export default defineGuide({
  id: 'rsa-cumul-salaire',
  group: 'rsa',
  order: 60,
  mini: 'rsaCumulSalaire',
  related: ['simulateur-rsa', 'simulateur-prime-activite', 'prime-activite-declaration-trimestrielle', 'rsa-personne-seule', 'prime-activite-temps-partiel'],
  sources: ['spRsa', 'spPa', 'decretPa2026', 'decretRsa2026'],
  fr: {
    slug: 'rsa-et-salaire',
    nav: 'RSA et salaire',
    card: 'Ce qu’un salaire retire du RSA, ce que la prime d’activité rend, et le décalage de la déclaration.',
    title: 'RSA et salaire 2026 : cumul, baisse et prime d’activité',
    description: 'RSA et salaire en 2026 : chaque euro gagné réduit le RSA d’un euro, mais la prime d’activité ajoute 59,85 % du salaire. Tableau du revenu total et exemple.',
    h1: 'Reprendre un emploi au RSA : ce qui reste vraiment',
    intro: 'Le RSA baisse dès le premier euro de salaire ; la prime d’activité, elle, monte. C’est la somme des deux qu’il faut regarder.',
    resume: (h) => `Pour le RSA, un salaire compte en entier : chaque euro net gagné retire un euro au montant versé. Une personne seule qui touche une aide au logement voit son RSA disparaître dès que son salaire net atteint environ ${h.eur(finRsa(h), 2)} par mois, au barème du 1er avril 2026. Travailler reste pourtant payant, parce que la CAF verse en parallèle la prime d’activité, qui ajoute ${h.pct(h.P.pa.taux_revenus, 2)} des revenus professionnels au montant forfaitaire de la prime. Avec ${h.eur(lea)} net de salaire, la même personne garde ${h.eur(r(h, lea), 2)} de RSA et reçoit environ ${h.eur(pa(h, lea), 2)} de prime d’activité, soit ${h.eur(tot(h, lea), 2)} au total contre ${h.eur(r(h, 0), 2)} sans emploi. Le salaire entre dans le calcul par la déclaration trimestrielle, qui retient depuis mars 2025 les ressources des mois M-2 à M-4 : la baisse du RSA arrive donc avec retard. Ce sont des estimations ; la CAF calcule les droits.`,
    faqs: (h) => [
      { q: 'Je reprends un travail à 600 € par mois, est-ce que je perds tout mon RSA ?', a: `Non, pas avec ce salaire. Pour une personne seule aidée pour son logement, le RSA estimé tombe à ${h.eur(r(h, lea), 2)}, mais la prime d’activité apporte environ ${h.eur(pa(h, lea), 2)}. Votre revenu total atteint ${h.eur(tot(h, lea), 2)}, soit ${h.eur(tot(h, lea) - r(h, 0), 2)} de plus que sans emploi. Ces deux aides sont calculées sur la même déclaration trimestrielle.` },
      { q: 'Pourquoi mon RSA baisse-t-il trois mois après mon premier salaire ?', a: 'À cause du décalage de la déclaration préremplie. Depuis le 1er mars 2025, le RSA est calculé sur les ressources des mois M-2 à M-4 : pour la déclaration de mars 2026, service-public cite novembre, décembre et janvier. Un salaire de janvier pèse donc sur le RSA versé plusieurs mois plus tard. Ce n’est pas une erreur, et il faut garder de quoi absorber cette baisse.' },
      { q: 'À partir de quel salaire le RSA s’arrête-t-il pour une personne seule ?', a: `Avec une aide au logement, vers ${h.eur(finRsa(h), 2)} net par mois : c’est le montant forfaitaire de ${h.eur(h.P.rsa.montant_forfaitaire, 2)} moins le forfait logement. Sans aide au logement, il faut atteindre ${h.eur(h.P.rsa.montant_forfaitaire, 2)}. La prime d’activité, elle, continue bien au-delà, jusqu’à environ ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0, forfaitLogement: true }))} de salaire dans notre calcul.` },
      { q: 'Quel montant de salaire déclarer à la CAF pour le RSA ?', a: 'Le montant net social, désormais imprimé sur la fiche de paie. Selon service-public, les salaires et revenus de remplacement sont préremplis sous cette forme dans la déclaration trimestrielle en ligne. Vous devez vérifier ces montants, les valider et compléter avec les ressources qui n’y figurent pas, comme une pension alimentaire. Ce même montant sert pour la prime d’activité.' },
      { q: 'Le RSA et la prime d’activité sont-ils imposables ?', a: `Non, ni l’un ni l’autre. Service-public le précise pour le RSA comme pour la prime d’activité. Seul le salaire entre dans le revenu imposable. Une personne qui cumule ${h.eur(lea)} de salaire, ${h.eur(r(h, lea), 2)} de RSA et ${h.eur(pa(h, lea), 2)} de prime d’activité ne déclare donc aux impôts que son salaire.` },
    ],
    body: (h) => `
<h2>Un euro gagné, un euro de RSA en moins</h2>
<p>Le principe du RSA est différentiel. La CAF part du montant forfaitaire fixé par le ${h.src('decretRsa2026', 'décret du 30 mars 2026')} et en retire toutes les ressources du foyer, dont les revenus d’activité, sans abattement. La ${h.src('spRsa', 'fiche RSA de service-public')} ne mentionne aucune période pendant laquelle un salaire serait ignoré : il compte dès qu’il figure dans la déclaration. Si le RSA était la seule aide, travailler 20 heures ne rapporterait donc rien, tant que le salaire reste sous le montant forfaitaire.</p>
<p>C’est la prime d’activité qui corrige cet effet. Décrite par la ${h.src('spPa', 'fiche prime d’activité')} et revalorisée par le ${h.src('decretPa2026', 'décret n° 2026-222')}, elle ajoute au montant forfaitaire de la prime ${h.pct(h.P.pa.taux_revenus, 2)} des revenus professionnels, puis retire les ressources du foyer. Pour un salarié au RSA, le résultat est simple à lire : à peu près six euros sur dix gagnés reviennent dans sa poche par la prime.</p>

<h2>Le revenu total, salaire par salaire</h2>
${h.table(['Salaire net', 'RSA', 'Prime d’activité', 'Revenu total'], [0, 300, lea, 900, 1200, h.P.smic.mensuel_net].map((s) => [h.eur(s), h.eur(r(h, s), 2), h.eur(pa(h, s), 2), h.eur(tot(h, s), 2)]), 'Personne seule, aide au logement perçue, barèmes du 1er avril 2026 (estimation)', ['r', 'r', 'r', 'r'])}
<p>La dernière ligne correspond au Smic net à temps plein. Le RSA y a disparu depuis longtemps ; la prime d’activité, renforcée par la bonification individuelle au-dessus de ${h.eur(h.M.seuilBonification(), 2)}, prend toute la place. Le revenu total progresse avec le salaire, à une nuance près : quand le RSA ou la prime passe sous son seuil de versement, ${h.eur(h.P.rsa.minimum_verse)} pour l’un et ${h.eur(h.P.pa.minimum_verse)} pour l’autre, quelques euros disparaissent d’un coup.</p>
<!--mini:rsaCumulSalaire-->

<h2>Ce que rapportent 100 € de salaire en plus</h2>
<p>Le tableau cache un chiffre plus parlant : le gain réel de chaque augmentation de salaire. Entre 300 et 400 € net par mois, la personne de notre exemple gagne ${h.eur(tot(h, 400) - tot(h, 300), 2)} de revenu total pour 100 € de salaire supplémentaire : le RSA reprend les 100 €, la prime d’activité en rend une grosse moitié. Entre 1 000 et 1 100 €, le RSA a disparu et le gain monte à ${h.eur(tot(h, 1100) - tot(h, 1000), 2)}, car le salaire n’est plus repris euro pour euro et la bonification individuelle progresse. Autour du point où le RSA s’éteint, vers ${h.eur(finRsa(h), 0)}, la courbe change de pente ; elle ne recule que de quelques euros au passage du seuil de versement.</p>
<p>Ce calcul sert à trancher une question fréquente : accepter quelques heures de plus, ou un contrat un peu mieux payé, ne fait pas reculer le revenu total dans notre modèle, hormis ces quelques euros de seuil. Ce qui peut surprendre, c’est le rythme : la prime d’activité est fixée pour trois mois, le RSA suit la déclaration trimestrielle, et les deux bougent avec un décalage sur le salaire.</p>

<h2>Léa, un mi-temps en janvier</h2>
<p>Léa, 29 ans, touche ${h.eur(r(h, 0), 2)} de RSA avec son APL. Elle signe en janvier un contrat à mi-temps payé ${h.eur(lea)} net. En février et en mars, rien ne bouge : ses déclarations portent encore sur des mois sans salaire. Lorsque janvier entre dans la période retenue, son RSA tombe autour de ${h.eur(r(h, lea), 2)}, et la prime d’activité, demandée en même temps, s’ajoute pour environ ${h.eur(pa(h, lea), 2)}.</p>
<p>Le piège, pour Léa, serait de dépenser pendant deux mois un RSA qui sera recalculé. L’inverse existe aussi : quand son contrat s’arrête, le salaire continue de peser quelques mois sur son RSA avant de disparaître de la période. Garder une marge pendant ces transitions évite les difficultés, et les trop-perçus éventuels se remboursent par retenues sur les versements suivants.</p>

<h2>Les obligations qui ne disparaissent pas</h2>
<p>Un allocataire qui travaille reste au RSA tant que ses ressources sont sous le montant forfaitaire, avec son référent et son contrat d’engagement. Service-public précise que la recherche d’emploi est obligatoire lorsque les ressources du foyer sont en moyenne inférieures à 500 € par mois.</p>

<h2>En couple ou avec des enfants</h2>
<p>Le mécanisme reste le même, mais les montants changent. Dans un couple, le salaire de l’un réduit le RSA commun, alors que la prime d’activité tient compte de chaque revenu, avec une bonification par personne. La page ${h.a('prime-activite-temps-partiel', 'prime d’activité à temps partiel')} détaille ce dernier point. Pour simuler votre propre foyer, le ${h.a('simulateur-rsa', 'simulateur RSA')} et le ${h.a('simulateur-prime-activite', 'simulateur de prime d’activité')} partent des mêmes données ; la ${h.a('prime-activite-declaration-trimestrielle', 'déclaration trimestrielle')} explique le calendrier commun aux deux.</p>
`,
  },
  en: {
    slug: 'rsa-and-wages',
    nav: 'RSA and wages',
    card: 'What a wage takes off RSA, what the activity bonus gives back, and the lag in the quarterly return.',
    title: 'RSA and Wages 2026: Working on RSA and the Activity Bonus',
    description: 'RSA and wages in 2026: each euro earned cuts RSA by one euro, but the activity bonus adds back 59.85% of pay. Table of total income and a worked example.',
    h1: 'Going back to work on RSA: what you really keep',
    intro: 'RSA drops from the first euro of pay; the prime d’activité rises. What matters is the two together.',
    resume: (h) => `For RSA (revenu de solidarité active, France’s minimum income), wages count in full: each net euro earned takes one euro off the payment. A single person who receives housing aid sees RSA disappear once net pay reaches about ${h.eur(finRsa(h), 2)} a month, on the scale of 1 April 2026. Working still pays, because the CAF (family benefits office) also pays the prime d’activité (in-work activity bonus), which adds ${h.pct(h.P.pa.taux_revenus, 2)} of earnings to the bonus flat rate. On ${h.eur(lea)} of net pay, the same person keeps ${h.eur(r(h, lea), 2)} of RSA and gets about ${h.eur(pa(h, lea), 2)} of activity bonus, ${h.eur(tot(h, lea), 2)} in total compared with ${h.eur(r(h, 0), 2)} out of work. Wages enter the sum through the quarterly return, which since March 2025 uses income from months M-2 to M-4, so the RSA cut arrives late. These are estimates; the CAF sets the entitlements.`,
    faqs: (h) => [
      { q: 'I am starting a €600-a-month job, do I lose all my RSA?', a: `No, not at that wage. For a single person with housing aid, estimated RSA falls to ${h.eur(r(h, lea), 2)}, but the activity bonus adds about ${h.eur(pa(h, lea), 2)}. Your total income reaches ${h.eur(tot(h, lea), 2)}, which is ${h.eur(tot(h, lea) - r(h, 0), 2)} more than without the job. Both payments are worked out from the same quarterly return.` },
      { q: 'Why did my RSA drop three months after my first pay slip?', a: 'Because of the lag built into the pre-filled return. Since 1 March 2025, RSA is calculated on income from months M-2 to M-4: for the March 2026 return, service-public.fr cites November, December and January. January’s wage therefore weighs on RSA paid several months later. It is not a mistake, so keep something aside to absorb the drop.' },
      { q: 'At what wage does RSA stop for a single person?', a: `With housing aid, at around ${h.eur(finRsa(h), 2)} net a month: the ${h.eur(h.P.rsa.montant_forfaitaire, 2)} flat rate minus the housing deduction. Without housing aid you need to reach ${h.eur(h.P.rsa.montant_forfaitaire, 2)}. The activity bonus carries on well beyond, up to roughly ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0, forfaitLogement: true }))} of pay in our calculation.` },
      { q: 'Which pay figure do I declare to the CAF for RSA?', a: 'The montant net social (net social amount), now printed on French payslips. According to service-public.fr, wages and replacement income are pre-filled in that form in the online quarterly return. You must check those amounts, confirm them and add any income missing, such as maintenance payments. The same figure is used for the activity bonus.' },
      { q: 'Are RSA and the activity bonus taxable in France?', a: `No, neither is. Service-public.fr says so for both RSA and the prime d’activité. Only the wage counts as taxable income. Someone combining ${h.eur(lea)} of pay, ${h.eur(r(h, lea), 2)} of RSA and ${h.eur(pa(h, lea), 2)} of activity bonus therefore declares only the wage on their tax return.` },
    ],
    body: (h) => `
<h2>One euro earned, one euro of RSA gone</h2>
<p>RSA is a top-up. The CAF starts from the flat rate set by the ${h.src('decretRsa2026', 'decree of 30 March 2026')} and subtracts all household income, earnings included, with no allowance. The ${h.src('spRsa', 'service-public.fr RSA sheet')} mentions no period during which a wage would be ignored: it counts as soon as it appears in the return. If RSA were the only benefit, working 20 hours a week would bring nothing extra as long as pay stayed below the flat rate.</p>
<p>The activity bonus fixes that. Set out on the ${h.src('spPa', 'service-public.fr activity bonus sheet')} and uprated by ${h.src('decretPa2026', 'decree 2026-222')}, it adds ${h.pct(h.P.pa.taux_revenus, 2)} of earnings to its own flat rate, then subtracts household income. For a worker on RSA the result is easy to read: roughly six euros in every ten earned come back through the bonus.</p>

<h2>Total income, wage by wage</h2>
${h.table(['Net pay', 'RSA', 'Activity bonus', 'Total income'], [0, 300, lea, 900, 1200, h.P.smic.mensuel_net].map((s) => [h.eur(s), h.eur(r(h, s), 2), h.eur(pa(h, s), 2), h.eur(tot(h, s), 2)]), 'Single person receiving housing aid, rates from 1 April 2026 (estimate)', ['r', 'r', 'r', 'r'])}
<p>The last row is the full-time Smic (minimum wage) after deductions. RSA has long gone; the activity bonus, boosted by the individual top-up above ${h.eur(h.M.seuilBonification(), 2)}, takes over. Total income rises with pay, with one nuance: when RSA or the bonus falls below its payment floor, ${h.eur(h.P.rsa.minimum_verse)} for one and ${h.eur(h.P.pa.minimum_verse)} for the other, a few euros vanish at once.</p>
<!--mini:rsaCumulSalaire-->

<h2>What an extra €100 of pay is worth</h2>
<p>The table hides a more telling figure: the real gain from each pay rise. Between €300 and €400 net a month, the person in our example gains ${h.eur(tot(h, 400) - tot(h, 300), 2)} of total income for €100 more pay: RSA takes the €100 back, the activity bonus returns a good half of it. Between €1,000 and €1,100, RSA has gone and the gain rises to ${h.eur(tot(h, 1100) - tot(h, 1000), 2)}, because pay is no longer clawed back euro for euro and the individual top-up keeps growing. Around the point where RSA runs out, near ${h.eur(finRsa(h), 0)}, the curve changes slope; it only dips by a few euros where a payment floor is crossed.</p>
<p>This settles a common worry among newcomers to the French system: taking on a few more hours, or a slightly better-paid contract, does not lower total income in our model, apart from those few euros at a payment floor. What does catch people out is the timing. The activity bonus is fixed for three months at a time, RSA follows the quarterly return, and both react to a new wage with a delay. If you are used to a system where benefits adjust from one pay slip to the next, expect a lag of several months here, in both directions.</p>

<h2>Léa: a half-time job in January</h2>
<p>Léa, 29, receives ${h.eur(r(h, 0), 2)} of RSA alongside her APL (housing aid). In January she signs a half-time contract paying ${h.eur(lea)} net. In February and March nothing changes: her returns still cover months without pay. Once January falls inside the period used, her RSA drops to around ${h.eur(r(h, lea), 2)}, and the activity bonus, claimed at the same time, adds about ${h.eur(pa(h, lea), 2)}.</p>
<p>The trap for Léa would be to spend, for two months, RSA that is about to be recalculated. The reverse also happens: when her contract ends, the wage keeps weighing on RSA for a few months before it leaves the reference period. Keeping a cushion through these transitions avoids trouble, and any overpayment is recovered by deductions from later payments.</p>

<h2>The duties that stay</h2>
<p>A claimant who works stays on RSA as long as income is below the flat rate, with their adviser and engagement contract. Service-public.fr states that job seeking is compulsory when household income averages under €500 a month.</p>

<h2>Couples and families</h2>
<p>The mechanism is the same, but the amounts differ. In a couple, one partner’s wage cuts the shared RSA, whereas the activity bonus looks at each person’s earnings, with a top-up per worker. The page on the ${h.a('prime-activite-temps-partiel', 'activity bonus for part-time work')} explains that point. To model your own household, the ${h.a('simulateur-rsa', 'RSA calculator')} and the ${h.a('simulateur-prime-activite', 'activity bonus calculator')} use the same inputs, and the page on the ${h.a('prime-activite-declaration-trimestrielle', 'quarterly return')} sets out the timetable they share.</p>
`,
  },
});
