import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Forfait logement de la prime d'activité : 12 %, 16 % ou 16,5 % du forfaitaire selon le foyer. */
const base = (h: Helpers) => h.P.pa.montant_forfaitaire;
const fl = (h: Helpers, n: number) => h.M.forfaitLogement(base(h), n);
const pa = (h: Helpers, couple: boolean, enfants: number, s: number, avec: boolean) => h.M.primeActivite({ couple, enfants, revenu1: s, forfaitLogement: avec });
const T = (h: Helpers, l: 'fr' | 'en') => [
  { n: l === 'fr' ? 'Personne seule' : 'Single person', c: false, e: 0, p: 1, t: h.P.pa.forfait_logement.un, coef: 1 },
  { n: l === 'fr' ? 'Couple ou parent + 1 enfant' : 'Couple, or parent + 1 child', c: true, e: 0, p: 2, t: h.P.pa.forfait_logement.deux, coef: 1.5 },
  { n: l === 'fr' ? 'Trois personnes et plus' : 'Three people or more', c: true, e: 1, p: 3, t: h.P.pa.forfait_logement.trois, coef: 1.8 },
];
const S = 1300;

export default defineGuide({
  id: 'prime-activite-forfait-logement',
  group: 'activite',
  order: 80,
  mini: 'paForfaitLogement',
  related: ['simulateur-prime-activite', 'rsa-forfait-logement', 'prime-activite-celibataire', 'simulateur-apl', 'apl-salarie'],
  sources: ['spPa', 'decretPa2026', 'spRsa', 'spApl'],
  fr: {
    slug: 'prime-activite-forfait-logement',
    nav: 'Forfait logement',
    card: 'Pourquoi l’APL ou un hébergement gratuit réduit la prime, et de combien selon le foyer.',
    title: 'Forfait logement prime d’activité 2026 : 12, 16 ou 16,5 %',
    description: 'Forfait logement de la prime d’activité 2026 : 76,59 € seul, 153,19 € à deux, 189,57 € dès trois personnes, ajoutés aux ressources si vous touchez l’APL.',
    h1: 'Le forfait logement de la prime d’activité',
    intro: 'Toucher une aide au logement ou être logé gratuitement ajoute une somme fixe à vos ressources : la prime baisse d’autant, ou pas du tout.',
    resume: (h) => `Le forfait logement de la prime d’activité vaut ${h.eur(fl(h, 1), 2)} par mois pour une personne seule, ${h.eur(fl(h, 2), 2)} pour un foyer de deux personnes et ${h.eur(fl(h, 3), 2)} à partir de trois, au barème du 1er avril 2026. Il correspond à ${h.pct(h.P.pa.forfait_logement.un, 0)}, ${h.pct(h.P.pa.forfait_logement.deux, 0)} ou ${h.pct(h.P.pa.forfait_logement.trois, 1)} du montant forfaitaire du foyer. La CAF l’ajoute aux ressources quand vous percevez une aide au logement (APL, ALF ou ALS) ou quand vous êtes hébergé gratuitement. Il ne s’agit pas d’une somme que vous payez : c’est un avantage en nature évalué forfaitairement, qui alourdit le calcul. Son effet dépend de votre salaire. Si vos ressources dépassent déjà le montant forfaitaire, la prime baisse exactement du montant du forfait. Si elles restent en dessous, elle baisse moins, voire pas du tout. Une personne seule à ${h.eur(S)} net passe ainsi de ${h.eur(pa(h, false, 0, S, false).prime)} à ${h.eur(pa(h, false, 0, S, true).prime)}. Simple estimation : la CAF reste seule juge du montant.`,
    faqs: (h) => [
      { q: 'Pourquoi la CAF ajoute un forfait logement à mes ressources de prime d’activité ?', a: `Parce que vous n’avez pas à payer tout ou partie de votre logement : l’aide au logement ou l’hébergement gratuit est traité comme un revenu en nature. Plutôt que de l’évaluer au cas par cas, la CAF ajoute un montant fixe, ${h.eur(fl(h, 1), 2)} pour une personne seule en 2026. La prime est calculée comme si vous aviez reçu cette somme en plus.` },
      { q: 'Je suis logé gratuitement chez mes parents, ma prime d’activité baisse-t-elle ?', a: `Oui, si vos ressources dépassent le forfaitaire de ${h.eur(base(h), 2)}. Hébergé gratuitement, vous vous voyez compter ${h.eur(fl(h, 1), 2)} de forfait logement si vous constituez seul votre foyer. À ${h.eur(1000)} de salaire, la prime estimée passe de ${h.eur(pa(h, false, 0, 1000, false).prime)} à ${h.eur(pa(h, false, 0, 1000, true).prime)}. Avec un très petit salaire, l’effet peut être nul.` },
      { q: 'Le forfait logement dépend-il du montant de mon APL ?', a: `Non, il dépend seulement du nombre de personnes au foyer. Que vous touchiez 60 € ou 300 € d’aide au logement, le forfait reste de ${h.eur(fl(h, 1), 2)} seul, ${h.eur(fl(h, 2), 2)} à deux et ${h.eur(fl(h, 3), 2)} à trois et plus. C’est l’un des rares postes du calcul qui ne suit pas un montant réel.` },
      { q: 'Combien vaut le forfait logement de la prime pour une famille avec enfants ?', a: `${h.eur(fl(h, 3), 2)} par mois dès trois personnes, soit ${h.pct(h.P.pa.forfait_logement.trois, 1)} du forfaitaire d’un foyer de trois. Il ne grandit plus ensuite : une famille de cinq paie le même forfait qu’un couple avec un enfant. Un couple avec deux enfants et un salaire de ${h.eur(1500)} passe de ${h.eur(pa(h, true, 2, 1500, false).prime)} à ${h.eur(pa(h, true, 2, 1500, true).prime)}.` },
      { q: 'Le forfait logement de la prime est-il le même que celui du RSA ?', a: `Les taux sont identiques (${h.pct(h.P.pa.forfait_logement.un, 0)}, ${h.pct(h.P.pa.forfait_logement.deux, 0)}, ${h.pct(h.P.pa.forfait_logement.trois, 1)}), mais ils s’appliquent à des bases différentes. Le RSA part de ${h.eur(h.P.rsa.montant_forfaitaire, 2)}, la prime de ${h.eur(base(h), 2)}. D’où un forfait RSA de ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} pour une personne seule, contre ${h.eur(fl(h, 1), 2)} pour la prime.` },
    ],
    body: (h) => `
<h2>Trois forfaits selon la taille du foyer</h2>
<p>Le forfait se calcule sur le montant forfaitaire de la prime d’activité, ${h.eur(base(h), 2)} depuis le ${h.src('decretPa2026', 'décret du 30 mars 2026')}, multiplié par le coefficient du foyer puis par un taux. Le taux grimpe un peu avec la taille du foyer, mais s’arrête à trois personnes.</p>
${h.table(['Foyer', 'Taux', 'Forfaitaire de référence', 'Forfait logement'], T(h, 'fr').map((r) => [r.n, h.pct(r.t, 1), h.eur(base(h) * r.coef, 2), h.eur(fl(h, r.p), 2)]), 'Forfait logement de la prime d’activité, barème du 1er avril 2026', ['l', 'r', 'r', 'r'])}
<!--mini:paForfaitLogement-->

<h2>Qui se voit compter un forfait</h2>
<p>Deux situations le déclenchent pour la prime d’activité. La première : vous percevez une aide au logement, quelle qu’elle soit, ${h.src('spApl', 'APL')}, ALF ou ALS. La seconde : vous êtes hébergé gratuitement, chez un parent ou un ami, sans payer de loyer. Le locataire qui ne touche aucune aide au logement, parce que ses revenus ou son loyer ne l’y autorisent pas, n’a pas de forfait. C’est souvent le cas d’un salarié seul au-dessus du Smic.</p>
<p>Pour le RSA, la ${h.src('spRsa', 'fiche de service-public')} mentionne aussi le propriétaire de son logement. Nous n’avons pas trouvé cette précision pour la prime d’activité sur la ${h.src('spPa', 'fiche F2882')} ; notre simulateur ne retient donc que les deux situations ci-dessus.</p>

<h2>Une baisse pleine, partielle ou nulle</h2>
<p>La formule retire à la fin le plus élevé de deux montants : le forfaitaire du foyer ou ses ressources. Le forfait logement s’ajoute aux ressources. Tant que les ressources, forfait compris, restent sous le forfaitaire, c’est le forfaitaire qui est retiré, et le forfait logement ne change rien. Dès qu’elles le dépassent, chaque euro de forfait coûte un euro de prime.</p>
${h.table(['Salaire net (seul)', 'Sans forfait', 'Avec forfait', 'Perte'], [500, 600, 800, S, h.P.smic.mensuel_net].map((x) => [h.eur(x), h.eur(pa(h, false, 0, x, false).prime), h.eur(pa(h, false, 0, x, true).prime), h.eur(pa(h, false, 0, x, false).prime - pa(h, false, 0, x, true).prime)]), 'Personne seule, sans enfant ni autre ressource (estimation)', ['r', 'r', 'r', 'r'])}
<p>À ${h.eur(500)}, la perte est nulle : ${h.eur(500)} plus ${h.eur(fl(h, 1), 2)} restent sous ${h.eur(base(h), 2)}. À ${h.eur(600)}, elle est partielle. Au-delà, elle atteint le forfait entier. Le forfait avance aussi le point de sortie de la prime : seul, vers ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0, forfaitLogement: true }))} au lieu de ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))}.</p>

<h2>Le même forfait pèse moins dans une grande famille</h2>
<p>Le forfait plafonne à trois personnes alors que le montant forfaitaire continue de grandir avec chaque enfant. Sa part dans le calcul diminue donc à mesure que la famille s’agrandit. Le tableau garde un seul salaire de ${h.eur(S)} et fait varier le foyer.</p>
${h.table(['Foyer', 'Forfait', 'Prime sans', 'Prime avec'], [[false, 0, 'Seul'], [true, 0, 'Couple'], [true, 1, 'Couple, 1 enfant'], [true, 2, 'Couple, 2 enfants'], [true, 3, 'Couple, 3 enfants']].map(([c, e, n]) => [n as string, h.eur(fl(h, (c ? 2 : 1) + (e as number)), 2), h.eur(pa(h, c as boolean, e as number, S, false).prime), h.eur(pa(h, c as boolean, e as number, S, true).prime)]), 'Un salaire de 1 300 € net, sans allocations familiales (estimation)', ['l', 'r', 'r', 'r'])}
<p>Pour une personne seule, le forfait retire près d’un tiers de la prime ; pour un couple avec trois enfants, rien du tout à ce salaire, car ressources et forfait réunis restent sous le montant forfaitaire du foyer, ${h.eur(h.M.forfaitairePa(true, 3), 2)}. Les allocations familiales, qui s’ajoutent elles aussi aux ressources à partir du deuxième enfant, ne sont pas intégrées ici.</p>

<h2>Un couple locataire avec APL</h2>
<p>Mehdi et Clara louent un deux-pièces et perçoivent l’APL. Mehdi gagne ${h.eur(S)} net, Clara ne travaille pas. Leur foyer compte deux personnes : forfait de ${h.eur(fl(h, 2), 2)}. Sans aide au logement, leur prime serait de ${h.eur(pa(h, true, 0, S, false).prime)} ; avec, elle tombe à ${h.eur(pa(h, true, 0, S, true).prime)}. La différence ne signifie pas qu’ils perdent de l’argent en touchant l’APL : il faut mettre en regard l’aide reçue et le forfait retiré, ce que chaque couple peut faire avec ses propres chiffres. Le ${h.a('simulateur-apl', 'simulateur APL')} donne le montant de l’aide pour leur loyer.</p>

<h2>Les erreurs de déclaration fréquentes</h2>
<p>La première tient à l’hébergement : un jeune salarié qui vit chez ses parents sans payer de loyer et qui déclare être locataire touche une prime trop élevée, que la CAF peut ensuite réclamer. La deuxième, à l’inverse : un salarié hébergé qui commence à verser un loyer à son hébergeur doit le signaler, sinon le forfait continue d’être compté. La troisième concerne l’aide au logement qui s’arrête, par exemple après une hausse de salaire : le forfait doit disparaître du calcul de la prime dès le trimestre suivant. Le ${h.a('simulateur-prime-activite', 'simulateur de prime d’activité')} permet de tester les deux situations ; la page ${h.a('rsa-forfait-logement', 'forfait logement du RSA')} détaille la version RSA.</p>
`,
  },
  en: {
    slug: 'activity-bonus-housing-flat-rate',
    nav: 'Housing flat rate',
    card: 'Why housing aid or free accommodation lowers the bonus, and by how much for each household.',
    title: 'Housing Flat Rate in the Activity Bonus 2026: 12, 16, 16.5%',
    description: 'Housing flat rate of the French activity bonus in 2026: €76.59 single, €153.19 for two, €189.57 from three people, added to resources if you receive APL.',
    h1: 'The housing flat rate in the activity bonus',
    intro: 'Receiving housing aid or living rent-free adds a fixed sum to your resources: the bonus falls by that much, or not at all.',
    resume: (h) => `The housing flat rate (forfait logement) in the prime d’activité, the in-work top-up paid by the CAF (the family allowance fund), is ${h.eur(fl(h, 1), 2)} a month for a single person, ${h.eur(fl(h, 2), 2)} for a two-person household and ${h.eur(fl(h, 3), 2)} from three people upwards, at 1 April 2026 rates. It equals ${h.pct(h.P.pa.forfait_logement.un, 0)}, ${h.pct(h.P.pa.forfait_logement.deux, 0)} or ${h.pct(h.P.pa.forfait_logement.trois, 1)} of the household flat-rate amount. The CAF adds it to your resources when you receive housing aid (APL, ALF or ALS) or when you are housed for free. It is not something you pay: it is a benefit in kind valued at a flat rate, which weighs on the sum. Its effect depends on your pay. If your resources are already above the flat-rate amount, the bonus falls by exactly the housing flat rate. If they are below, it falls by less, or not at all. A single person on ${h.eur(S)} net goes from ${h.eur(pa(h, false, 0, S, false).prime)} to ${h.eur(pa(h, false, 0, S, true).prime)}. Treat these as estimates: the CAF alone sets the amount.`,
    faqs: (h) => [
      { q: 'Why does the CAF add a housing flat rate to my activity bonus resources?', a: `Because you do not pay all or part of your housing costs: housing aid or free accommodation is treated as income in kind. Rather than value it case by case, the CAF adds a fixed amount, ${h.eur(fl(h, 1), 2)} for a single person in 2026. The bonus is then worked out as if you had received that sum on top of your pay.` },
      { q: 'I live rent-free with my parents, does my activity bonus go down?', a: `Yes, if your resources are above the ${h.eur(base(h), 2)} flat rate. Housed for free and forming a household on your own, you have ${h.eur(fl(h, 1), 2)} of housing flat rate counted. At ${h.eur(1000)} of pay, the estimated bonus goes from ${h.eur(pa(h, false, 0, 1000, false).prime)} to ${h.eur(pa(h, false, 0, 1000, true).prime)}. On very low pay, the effect can be nil.` },
      { q: 'Does the housing flat rate depend on how much APL I get?', a: `No, only on how many people live in the household. Whether you get €60 or €300 of housing aid, the flat rate stays at ${h.eur(fl(h, 1), 2)} alone, ${h.eur(fl(h, 2), 2)} for two and ${h.eur(fl(h, 3), 2)} for three or more. It is one of the few parts of the sum that does not follow a real amount.` },
      { q: 'How much is the housing flat rate for a family with children?', a: `${h.eur(fl(h, 3), 2)} a month from three people, that is ${h.pct(h.P.pa.forfait_logement.trois, 1)} of a three-person flat rate. It does not grow after that: a family of five has the same flat rate as a couple with one child. A couple with two children and ${h.eur(1500)} of pay goes from ${h.eur(pa(h, true, 2, 1500, false).prime)} to ${h.eur(pa(h, true, 2, 1500, true).prime)}.` },
      { q: 'Is the activity bonus housing flat rate the same as the RSA one?', a: `The rates are identical (${h.pct(h.P.pa.forfait_logement.un, 0)}, ${h.pct(h.P.pa.forfait_logement.deux, 0)}, ${h.pct(h.P.pa.forfait_logement.trois, 1)}), but they apply to different bases. The RSA (minimum income) starts from ${h.eur(h.P.rsa.montant_forfaitaire, 2)}, the bonus from ${h.eur(base(h), 2)}. Hence an RSA housing flat rate of ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} for a single person, against ${h.eur(fl(h, 1), 2)} for the bonus.` },
    ],
    body: (h) => `
<h2>Three flat rates by household size</h2>
<p>The flat rate is worked out from the activity bonus flat-rate amount, ${h.eur(base(h), 2)} since the ${h.src('decretPa2026', 'decree of 30 March 2026')}, multiplied by the household coefficient and then by a rate. The rate edges up with household size but stops at three people.</p>
${h.table(['Household', 'Rate', 'Reference flat rate', 'Housing flat rate'], T(h, 'en').map((r) => [r.n, h.pct(r.t, 1), h.eur(base(h) * r.coef, 2), h.eur(fl(h, r.p), 2)]), 'Housing flat rate in the activity bonus, 1 April 2026 scale', ['l', 'r', 'r', 'r'])}
<!--mini:paForfaitLogement-->

<h2>Who has a flat rate counted</h2>
<p>Two situations trigger it for the activity bonus. First, you receive housing aid of any kind: ${h.src('spApl', 'APL')} (personalised housing aid), ALF or ALS. Second, you are housed for free, by a parent or a friend, without paying rent. A tenant who receives no housing aid, because their income or rent rules it out, has no flat rate. That is often the case for a single employee earning above the minimum wage.</p>
<p>For the RSA, the ${h.src('spRsa', 'service-public.fr sheet')} also mentions people who own their home. We did not find that point for the activity bonus on ${h.src('spPa', 'sheet F2882')}, so our calculator applies only the two situations above.</p>

<h2>A full, partial or zero cut</h2>
<p>At the end, the formula deducts the higher of two amounts: the household flat rate or its resources. The housing flat rate is added to resources. While resources, flat rate included, stay below the household flat rate, it is the household flat rate that is deducted, and the housing flat rate changes nothing. Once they go above it, each euro of housing flat rate costs a euro of bonus.</p>
${h.table(['Net pay (single)', 'Without flat rate', 'With flat rate', 'Loss'], [500, 600, 800, S, h.P.smic.mensuel_net].map((x) => [h.eur(x), h.eur(pa(h, false, 0, x, false).prime), h.eur(pa(h, false, 0, x, true).prime), h.eur(pa(h, false, 0, x, false).prime - pa(h, false, 0, x, true).prime)]), 'Single person, no children, no other income (estimate)', ['r', 'r', 'r', 'r'])}
<p>At ${h.eur(500)}, nothing is lost: ${h.eur(500)} plus ${h.eur(fl(h, 1), 2)} stays below ${h.eur(base(h), 2)}. At ${h.eur(600)}, the loss is partial. Beyond that, it is the full flat rate. The flat rate also brings forward the point where the bonus stops: for a single person, at about ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0, forfaitLogement: true }))} instead of ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))}.</p>

<h2>The same flat rate weighs less in a large family</h2>
<p>The housing flat rate stops growing at three people, while the household flat-rate amount keeps rising with each child. Its share of the sum therefore shrinks as the family grows. The table keeps a single wage of ${h.eur(S)} and changes the household.</p>
${h.table(['Household', 'Flat rate', 'Bonus without', 'Bonus with'], [[false, 0, 'Single'], [true, 0, 'Couple'], [true, 1, 'Couple, 1 child'], [true, 2, 'Couple, 2 children'], [true, 3, 'Couple, 3 children']].map(([c, e, n]) => [n as string, h.eur(fl(h, (c ? 2 : 1) + (e as number)), 2), h.eur(pa(h, c as boolean, e as number, S, false).prime), h.eur(pa(h, c as boolean, e as number, S, true).prime)]), 'One wage of €1,300 net, no family allowances (estimate)', ['l', 'r', 'r', 'r'])}
<p>For a single person, the flat rate takes nearly a third of the bonus; for a couple with three children, nothing at all at this wage, because resources plus flat rate stay below the household flat-rate amount of ${h.eur(h.M.forfaitairePa(true, 3), 2)}. Family allowances (allocations familiales), which are also added to resources from the second child, are left out here.</p>

<h2>A tenant couple receiving APL</h2>
<p>Mehdi and Clara rent a two-room flat and receive APL. Mehdi earns ${h.eur(S)} net; Clara does not work. Their household has two people, so the flat rate is ${h.eur(fl(h, 2), 2)}. Without housing aid, their bonus would be ${h.eur(pa(h, true, 0, S, false).prime)}; with it, it falls to ${h.eur(pa(h, true, 0, S, true).prime)}. That does not mean APL leaves them worse off: you have to set the aid received against the flat rate deducted, which each household can do with its own figures. The ${h.a('simulateur-apl', 'housing aid calculator')} gives the aid for their rent.</p>

<h2>Common reporting mistakes</h2>
<p>The first concerns accommodation: a young employee living rent-free with their parents who reports being a tenant gets too much bonus, which the CAF can later claim back. The second is the reverse: someone housed for free who starts paying rent to their host should report it, or the flat rate keeps being counted. The third concerns housing aid that stops, for instance after a pay rise: the flat rate should then leave the bonus sum from the next quarter. The ${h.a('simulateur-prime-activite', 'activity bonus calculator')} lets you test both cases; the ${h.a('rsa-forfait-logement', 'RSA housing flat rate')} page covers the RSA version.</p>
`,
  },
});
