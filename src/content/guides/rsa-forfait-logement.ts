import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemple de la page : Nadia, seule, loyer 450 € en zone 2, sans revenu, avant et après sa demande d'APL. */
const base = (h: Helpers) => h.P.rsa.montant_forfaitaire;
const fl = (h: Helpers, n: number) => h.M.forfaitLogement(base(h), n, h.P.rsa);
const aplNadia = (h: Helpers) => h.M.apl({ zone: 2, couple: false, enfants: 0, loyer: 450, revenusAnnuels: 0 }).aide;
const rsaNadia = (h: Helpers, avecAide: boolean) => h.M.rsa({ couple: false, enfants: 0, revenus: 0, forfaitLogement: avecAide }).rsa;

export default defineGuide({
  id: 'rsa-forfait-logement',
  group: 'rsa',
  order: 50,
  mini: 'rsaForfaitLogement',
  related: ['simulateur-rsa', 'rsa-personne-seule', 'prime-activite-forfait-logement', 'simulateur-apl', 'apl-ressources'],
  sources: ['spRsa', 'decretRsa2026', 'spApl'],
  fr: {
    slug: 'rsa-forfait-logement',
    nav: 'Forfait logement RSA',
    card: 'Les 78,20 € retirés du RSA d’une personne aidée pour son logement, logée gratuitement ou propriétaire.',
    title: 'Forfait logement RSA 2026 : 78,20 € à 193,55 € retirés',
    description: 'Forfait logement du RSA en 2026 : 78,20 € pour une personne, 156,41 € pour deux, 193,55 € dès trois. Qui le subit, pourquoi l’APL reste gagnante, exemple.',
    h1: 'Le forfait logement du RSA : qui le paie et combien',
    intro: 'Toucher l’APL, être hébergé gratuitement ou être propriétaire : ces trois situations font baisser le RSA d’un même montant fixe, qui dépend seulement de la taille du foyer.',
    resume: (h) => `Le forfait logement retire ${h.eur(fl(h, 1), 2)} par mois au RSA d’une personne seule, ${h.eur(fl(h, 2), 2)} à un foyer de deux personnes et ${h.eur(fl(h, 3), 2)} à partir de trois, aux montants du 1er avril 2026. La CAF l’ajoute aux ressources dans trois cas, selon service-public : quand le foyer perçoit une aide au logement, quand il est hébergé gratuitement et quand il est propriétaire de son logement. L’idée est simple : le montant forfaitaire du RSA couvre en partie le logement, et quelqu’un qui n’a pas, ou plus entièrement, de loyer à payer reçoit moins. Ce forfait ne doit pas dissuader de demander l’APL. Une personne seule sans revenu qui loue 450 € en zone 2 perd ${h.eur(fl(h, 1), 2)} de RSA mais reçoit environ ${h.eur(aplNadia(h))} d’aide au logement. Le gain net reste largement positif. Ces chiffres sont des estimations ; la CAF calcule le droit.`,
    faqs: (h) => [
      { q: 'Si je demande l’APL, mon RSA va-t-il baisser du montant de l’APL ?', a: `Non, il baisse du forfait logement, pas de l’aide elle-même. Pour une personne seule, le RSA passe de ${h.eur(base(h), 2)} à ${h.eur(rsaNadia(h, true), 2)}, soit ${h.eur(fl(h, 1), 2)} de moins, alors que l’APL d’un loyer de 450 € en zone 2 atteint environ ${h.eur(aplNadia(h))}. Dans l’exemple officiel de service-public, seul le forfait est retiré au couple aidé pour son logement.` },
      { q: 'Je suis propriétaire de mon appartement, le forfait logement s’applique-t-il ?', a: `Oui. Service-public range le propriétaire de son logement parmi les cas où un forfait s’ajoute aux ressources, au même titre que l’allocataire d’une aide au logement. Pour un propriétaire seul, la déduction est de ${h.eur(fl(h, 1), 2)} par mois et le RSA maximal tombe à ${h.eur(rsaNadia(h, true), 2)}. Le montant ne dépend pas de la valeur du bien, seulement du nombre de personnes au foyer.` },
      { q: 'Mes parents paient mon loyer, est-ce la même chose qu’un hébergement gratuit ?', a: `Pas forcément. Service-public distingue ce cas : quand une autre personne paie votre loyer, vous bénéficiez d’un avantage évalué forfaitairement, déductible du RSA selon votre situation, et il faut contacter la CAF pour savoir si cette déduction vous concerne. L’hébergement gratuit chez un proche relève, lui, du forfait logement de ${h.eur(fl(h, 1), 2)} pour une personne seule.` },
      { q: 'Je paie un loyer sans toucher d’aide au logement, le forfait est-il retiré ?', a: `Non. Les trois cas listés par service-public sont l’aide au logement, l’hébergement gratuit et la propriété. Un locataire qui paie son loyer sans aucune aide garde le montant forfaitaire entier, soit ${h.eur(base(h), 2)} pour une personne seule sans ressource. C’est le seul cas où ce montant est versé en totalité : dès qu’une aide au logement est accordée, le forfait de ${h.eur(fl(h, 1), 2)} s’applique.` },
      { q: 'Pourquoi le forfait logement ne grimpe-t-il plus au-delà de trois personnes ?', a: `Parce que la règle le plafonne. Il vaut ${h.pct(h.P.rsa.forfait_logement.un, 0)} du montant forfaitaire d’une personne, ${h.pct(h.P.rsa.forfait_logement.deux, 0)} de celui de deux personnes, puis ${h.pct(h.P.rsa.forfait_logement.trois, 1)} de celui de trois personnes, et reste ensuite fixé à ${h.eur(fl(h, 3), 2)}. Une famille de cinq subit la même déduction qu’une famille de trois.` },
    ],
    body: (h) => `
<h2>Le barème du forfait selon la taille du foyer</h2>
<p>Le forfait se calcule à partir du montant de base fixé par le ${h.src('decretRsa2026', 'décret du 30 mars 2026')}. Pour une personne, il en représente ${h.pct(h.P.rsa.forfait_logement.un, 0)}. Pour deux, ${h.pct(h.P.rsa.forfait_logement.deux, 0)} du montant d’un couple. À partir de trois, ${h.pct(h.P.rsa.forfait_logement.trois, 1)} du montant d’un foyer de trois, sans augmentation ensuite.</p>
${h.table(['Personnes au foyer', 'Forfait logement mensuel', 'Part du montant forfaitaire d’un couple sans enfant'], [1, 2, 3, 4, 5].map((n) => [String(n), h.eur(fl(h, n), 2), h.pct(fl(h, n) / h.M.forfaitaireRsa(true, 0), 1)]), 'Forfait logement du RSA au 1er avril 2026 (calcul du moteur)', ['l', 'r', 'r'])}
<p>Ces montants sont ceux que publie la ${h.src('spRsa', 'fiche RSA de service-public')}. Les enfants comptent comme des personnes du foyer : un parent seul avec deux enfants subit la déduction maximale.</p>
<!--mini:rsaForfaitLogement-->

<h2>Trois situations, un même montant</h2>
<h3>L’aide au logement</h3>
<p>C’est le cas le plus courant. Le foyer qui perçoit l’APL, l’ALF ou l’ALS voit le forfait s’ajouter à ses ressources. L’aide elle-même n’est pas soustraite du RSA : dans l’exemple chiffré de service-public, un couple avec deux enfants aidé pour son loyer perd ${h.eur(fl(h, 4), 2)} de forfait, pas le montant de son APL.</p>
<h3>L’hébergement gratuit</h3>
<p>Celui qui vit chez un parent, un ami ou un ancien conjoint sans payer de loyer est réputé avoir un logement couvert. Le forfait s’applique de la même façon. Il faut le distinguer de la situation où un tiers paie le loyer d’un logement que l’allocataire occupe : là, service-public parle d’un avantage évalué forfaitairement et renvoie à la CAF.</p>
<h3>La propriété</h3>
<p>Le propriétaire occupant subit aussi le forfait, quelle que soit la valeur de son logement. Un petit appartement hérité suffit. Être propriétaire de son toit compte comme un avantage de logement, même sans en tirer aucun revenu ; la déduction n’est toutefois pas plus lourde que celle d’un locataire aidé. Pour un allocataire qui vit seul dans le logement familial dont il a hérité, le RSA maximal est donc de ${h.eur(rsaNadia(h, true), 2)} et non de ${h.eur(base(h), 2)}.</p>

<h2>Nadia hésite à demander l’APL</h2>
<p>Nadia, 41 ans, vit seule à Rennes. Elle loue un studio 450 € hors charges, n’a plus de revenu et touche le RSA plein de ${h.eur(rsaNadia(h, false), 2)}. Une voisine lui a dit que l’APL ferait baisser son RSA. C’est exact, mais incomplet. Si elle dépose sa demande d’aide au logement, son RSA tombe à ${h.eur(rsaNadia(h, true), 2)}. Son APL, calculée en zone 2 selon la ${h.src('spApl', 'fiche APL de service-public')}, serait d’environ ${h.eur(aplNadia(h))} par mois. Ses ressources totales passent de ${h.eur(rsaNadia(h, false), 2)} à ${h.eur(rsaNadia(h, true) + aplNadia(h), 2)}.</p>
<p>Le calcul ne s’inverse que si l’aide au logement est inférieure au forfait, ce qui supposerait un loyer très bas. Le ${h.a('simulateur-apl', 'simulateur APL')} donne l’aide exacte pour un loyer et une commune.</p>
<p>Le raisonnement vaut plus encore pour une famille. Un couple sans revenu avec deux enfants, locataire à 700 € en zone 2, perd ${h.eur(fl(h, 4), 2)} de RSA en demandant l’aide au logement, mais celle-ci atteint environ ${h.eur(h.M.apl({ zone: 2, couple: true, enfants: 2, loyer: 700, revenusAnnuels: 0 }).aide)} par mois selon notre moteur. Le forfait plafonné à trois personnes rend l’écart encore plus favorable aux familles nombreuses.</p>

<h2>RSA et prime d’activité : deux forfaits voisins</h2>
<p>Les deux prestations appliquent la même règle de pourcentages, mais chacune sur son propre montant de base. Comme la base de la prime d’activité est un peu plus basse, son forfait l’est aussi. Un allocataire qui touche les deux, parce qu’il travaille peu, voit donc deux déductions différentes sur ses deux calculs.</p>
${h.table(['Personnes au foyer', 'Forfait RSA', 'Forfait prime d’activité'], [1, 2, 3].map((n) => [n === 3 ? '3 et plus' : String(n), h.eur(fl(h, n), 2), h.eur(h.M.forfaitLogement(h.P.pa.montant_forfaitaire, n), 2)]), 'Montants mensuels au 1er avril 2026 (calcul du moteur)', ['l', 'r', 'r'])}

<h2>Ce que le forfait n’est pas</h2>
<p>Ce n’est pas une sanction. Il découle de la situation de logement que la CAF connaît par le dossier : aide versée, hébergement, propriété. Une erreur classique consiste à le confondre avec le forfait logement de la prime d’activité, qui suit le même principe mais part d’un autre montant de base : la page ${h.a('prime-activite-forfait-logement', 'forfait logement de la prime d’activité')} en donne les valeurs. Un changement de logement, un départ de chez un proche ou une fin d’aide au logement se signalent, car ils peuvent faire disparaître le forfait et remonter le RSA.</p>
`,
  },
  en: {
    slug: 'rsa-housing-deduction',
    nav: 'RSA housing deduction',
    card: 'The €78.20 taken off the RSA of someone with housing aid, free lodging or their own home.',
    title: 'RSA Housing Deduction 2026: €78.20 to €193.55 a Month',
    description: 'The RSA housing deduction in 2026: €78.20 for one person, €156.41 for two, €193.55 from three. Who it hits and why claiming APL still pays off, with an example.',
    h1: 'The RSA housing deduction: who has it and how much',
    intro: 'Receiving housing aid, living rent-free or owning your home: all three cut RSA by the same fixed amount, which depends only on household size.',
    resume: (h) => `The forfait logement (housing deduction) takes ${h.eur(fl(h, 1), 2)} a month off the RSA (revenu de solidarité active, France’s minimum income) of a single person, ${h.eur(fl(h, 2), 2)} off a two-person household and ${h.eur(fl(h, 3), 2)} from three people, at the rates of 1 April 2026. According to service-public.fr, the CAF (family benefits office) adds it to income in three cases: when the household receives housing aid, when it lives somewhere free of charge and when it owns its home. The logic is that the RSA flat rate partly covers housing, so someone with little or no rent to pay gets less. The deduction should not put anyone off claiming APL (housing aid). A single person with no income renting at €450 in zone 2 loses ${h.eur(fl(h, 1), 2)} of RSA but gains about ${h.eur(aplNadia(h))} of housing aid. The net gain is clearly positive. These are estimates; the CAF decides the entitlement.`,
    faqs: (h) => [
      { q: 'If I claim APL, will my RSA drop by the amount of the APL?', a: `No, it drops by the housing deduction, not by the aid itself. For a single person, RSA goes from ${h.eur(base(h), 2)} to ${h.eur(rsaNadia(h, true), 2)}, ${h.eur(fl(h, 1), 2)} less, while APL on a €450 rent in zone 2 reaches about ${h.eur(aplNadia(h))}. In the official service-public.fr example, only the flat deduction is taken from a couple receiving housing aid.` },
      { q: 'I own my flat, does the RSA housing deduction apply to me?', a: `Yes. Service-public.fr lists owning your home among the cases where a flat amount is added to income, just like receiving housing aid. For a single owner, the deduction is ${h.eur(fl(h, 1), 2)} a month and the maximum RSA falls to ${h.eur(rsaNadia(h, true), 2)}. The amount does not depend on what the property is worth, only on how many people live in the household.` },
      { q: 'My parents pay my rent, is that the same as free lodging?', a: `Not necessarily. Service-public.fr treats it separately: when someone else pays your rent, you receive a benefit valued at a flat rate that may be deducted from RSA depending on your situation, and you need to ask the CAF whether it applies. Living free of charge in a relative’s home falls under the ordinary ${h.eur(fl(h, 1), 2)} housing deduction for a single person.` },
      { q: 'I pay rent but get no housing aid, is the deduction applied?', a: `No. The three cases listed by service-public.fr are housing aid, free lodging and home ownership. A tenant paying rent with no aid at all keeps the whole flat rate, ${h.eur(base(h), 2)} for a single person with no income. It is the only case where that amount is paid in full: as soon as housing aid is granted, the ${h.eur(fl(h, 1), 2)} deduction applies.` },
      { q: 'Why does the housing deduction stop rising after three people?', a: `Because the rule caps it. It equals ${h.pct(h.P.rsa.forfait_logement.un, 0)} of the one-person flat rate, ${h.pct(h.P.rsa.forfait_logement.deux, 0)} of the two-person rate, then ${h.pct(h.P.rsa.forfait_logement.trois, 1)} of the three-person rate, and stays at ${h.eur(fl(h, 3), 2)} from then on. A family of five has the same deduction as a family of three.` },
    ],
    body: (h) => `
<h2>The deduction by household size</h2>
<p>The deduction is worked out from the base amount set by the ${h.src('decretRsa2026', 'decree of 30 March 2026')}. For one person, it is ${h.pct(h.P.rsa.forfait_logement.un, 0)} of it. For two, ${h.pct(h.P.rsa.forfait_logement.deux, 0)} of the couple amount. From three, ${h.pct(h.P.rsa.forfait_logement.trois, 1)} of the three-person amount, with no further rise.</p>
${h.table(['People in household', 'Monthly housing deduction', 'Share of a childless couple’s flat rate'], [1, 2, 3, 4, 5].map((n) => [String(n), h.eur(fl(h, n), 2), h.pct(fl(h, n) / h.M.forfaitaireRsa(true, 0), 1)]), 'RSA housing deduction from 1 April 2026 (engine calculation)', ['l', 'r', 'r'])}
<p>These are the amounts published on the ${h.src('spRsa', 'service-public.fr RSA sheet')}. Children count as household members: a lone parent with two children has the maximum deduction.</p>
<!--mini:rsaForfaitLogement-->

<h2>Three situations, one amount</h2>
<h3>Housing aid</h3>
<p>This is the most common case. A household receiving APL, ALF or ALS (the three French housing allowances) has the deduction added to its income. The aid itself is not subtracted from RSA: in the service-public.fr worked example, a couple with two children helped with rent loses ${h.eur(fl(h, 4), 2)} of deduction, not the amount of their APL.</p>
<h3>Free lodging</h3>
<p>Someone living with a parent, a friend or a former partner without paying rent is treated as having their housing covered. The deduction applies in the same way. This differs from a third party paying rent on a place the claimant occupies: there, service-public.fr speaks of a flat-rate benefit in kind and refers you to the CAF.</p>
<h3>Home ownership</h3>
<p>An owner-occupier also has the deduction, whatever the home is worth. A small inherited flat is enough. This often surprises people who have bought a modest place in France after years abroad and then lost their income: owning the roof over your head counts as a housing advantage, even with no cash coming from it. The deduction is the same as for a tenant on housing aid, no more. For a claimant living alone in a family home they have inherited, the maximum RSA is therefore ${h.eur(rsaNadia(h, true), 2)}, not ${h.eur(base(h), 2)}.</p>

<h2>Nadia is unsure about claiming APL</h2>
<p>Nadia, 41, lives alone in Rennes. She rents a studio for €450 excluding charges, has no income left and gets the full ${h.eur(rsaNadia(h, false), 2)} of RSA. A neighbour told her APL would lower her RSA. True, but incomplete. If she applies for housing aid, her RSA falls to ${h.eur(rsaNadia(h, true), 2)}. Her APL, worked out for zone 2 under the rules on the ${h.src('spApl', 'service-public.fr APL sheet')}, would be about ${h.eur(aplNadia(h))} a month. Her total resources rise from ${h.eur(rsaNadia(h, false), 2)} to ${h.eur(rsaNadia(h, true) + aplNadia(h), 2)}.</p>
<p>The sum only turns against her if housing aid is lower than the deduction, which would take a very low rent. The ${h.a('simulateur-apl', 'housing aid calculator')} gives the exact aid for a given rent and town.</p>
<p>The reasoning holds even more for a family. A couple with no income and two children, renting at €700 in zone 2, loses ${h.eur(fl(h, 4), 2)} of RSA by claiming housing aid, but the aid comes to about ${h.eur(h.M.apl({ zone: 2, couple: true, enfants: 2, loyer: 700, revenusAnnuels: 0 }).aide)} a month according to our engine. Because the deduction is capped at three people, larger families come out even further ahead.</p>

<h2>RSA and activity bonus: two similar deductions</h2>
<p>Both benefits apply the same percentages, each to its own base amount. Since the prime d’activité base is slightly lower, its deduction is too. A claimant who receives both, because they work a few hours, therefore sees two different deductions in the two calculations.</p>
${h.table(['People in household', 'RSA deduction', 'Activity bonus deduction'], [1, 2, 3].map((n) => [n === 3 ? '3 or more' : String(n), h.eur(fl(h, n), 2), h.eur(h.M.forfaitLogement(h.P.pa.montant_forfaitaire, n), 2)]), 'Monthly amounts from 1 April 2026 (engine calculation)', ['l', 'r', 'r'])}

<h2>What the deduction is not</h2>
<p>It is not a penalty. It follows from the housing situation the CAF knows from your file: aid paid, free lodging or ownership. A common mix-up is with the housing deduction of the prime d’activité (in-work bonus), which follows the same principle from a different base amount: the page on the ${h.a('prime-activite-forfait-logement', 'activity bonus housing deduction')} gives its values. Moving home, leaving a relative’s place or losing housing aid must be reported, because any of these can remove the deduction and raise RSA again.</p>
`,
  },
});
