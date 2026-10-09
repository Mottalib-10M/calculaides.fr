import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Salaire net mensuel et enfants à charge : AAH estimée. */
const a = (h: Helpers, salaire: number, enfants: number) => h.M.aah({ salaire, enfants });
const nora = 1500;

export default defineGuide({
  id: 'aah-enfants',
  group: 'handicap',
  order: 60,
  mini: 'aahEnfants',
  related: ['simulateur-aah', 'aah-plafond-ressources', 'aah-cumul-salaire', 'aah-deconjugalisation', 'simulateur-allocations-familiales'],
  sources: ['spAah', 'decretAah2026', 'spAf'],
  fr: {
    slug: 'aah-enfants-a-charge',
    nav: 'AAH et enfants',
    card: 'Chaque enfant à charge relève le plafond de l’AAH : ce que cela change pour un parent qui travaille.',
    title: 'AAH avec enfants 2026 : plafond majoré de 6 250 € par enfant',
    description: 'AAH et enfants à charge en 2026 : le plafond passe de 12 499 € à 18 749 € avec un enfant. Effet sur un parent salarié, seuil de sortie par enfant et simulateur.',
    h1: 'AAH et enfants à charge : un plafond plus haut, pas un montant plus haut',
    intro: 'Les enfants n’augmentent pas le maximum de l’AAH. Ils relèvent le plafond de ressources, ce qui compte surtout pour le parent qui travaille.',
    resume: (h) => `Chaque enfant à charge relève le plafond de ressources de l’AAH de ${h.eur(h.P.aah.majoration_enfant)} environ par an : ${h.eur(h.M.plafondAah(0))} sans enfant, ${h.eur(h.M.plafondAah(1))} avec un enfant en 2026. Le montant maximal, lui, reste de ${h.eur(h.P.aah.montant_max, 2)} par mois quel que soit le nombre d’enfants : un parent sans aucune ressource touche la même AAH qu’une personne seule. La majoration change en revanche beaucoup de choses pour le parent qui a des revenus. Avec ${h.eur(nora)} de salaire net, une personne sans enfant garde une AAH estimée de ${h.eur(a(h, nora, 0).aah, 2)} ; avec deux enfants à charge, elle en garde ${h.eur(a(h, nora, 2).aah, 2)}. Le seuil de salaire où l’AAH s’éteint passe de ${h.eur(h.M.seuilSortieAah(0))} à ${h.eur(h.M.seuilSortieAah(2))}. Seuls comptent les enfants à charge au sens des prestations familiales. Ce sont des estimations ; la CAF calcule le droit.`,
    faqs: (h) => [
      { q: 'L’AAH augmente-t-elle quand on a un enfant ?', a: `Pas le montant maximal, qui reste de ${h.eur(h.P.aah.montant_max, 2)} par mois. Ce qui augmente, c’est le plafond de ressources : ${h.eur(h.M.plafondAah(1))} par an avec un enfant à charge au lieu de ${h.eur(h.M.plafondAah(0))}. Un parent sans ressource ne voit donc aucune différence ; un parent qui travaille ou perçoit une pension garde davantage d’AAH, puisqu’une plus grande part de ses revenus tient sous le plafond.` },
      { q: 'Je suis maman solo, je gagne 1 500 € net avec deux enfants, ai-je droit à l’AAH ?', a: `Si la CDAPH vous reconnaît un taux d’incapacité suffisant, oui, et le montant reste significatif. Avec deux enfants à charge, votre plafond annuel est de ${h.eur(h.M.plafondAah(2))} selon notre moteur. Votre salaire, retenu après abattement pour ${h.eur(h.M.salaireRetenuAah(nora), 2)} par mois, laisse une AAH estimée de ${h.eur(a(h, nora, 2).aah, 2)}. Sans enfant, elle ne serait que de ${h.eur(a(h, nora, 0).aah, 2)}.` },
      { q: 'Quel enfant compte comme à charge pour le plafond de l’AAH ?', a: `L’enfant à charge au sens des prestations familiales, selon le tableau de service-public. C’est la même notion que pour les allocations familiales, versées jusqu’aux ${h.P.af.age_limite} ans de l’enfant. Un enfant qui n’est plus à charge à ce titre cesse de relever le plafond de ${h.eur(h.P.aah.majoration_enfant)}, ce qui peut faire baisser l’AAH d’un parent salarié.` },
      { q: 'Dois-je signaler la naissance de mon enfant pour mon AAH ?', a: `Oui. Service-public demande de déclarer à la CAF ou à la MSA tout changement de situation, vie familiale comprise, car il peut modifier l’AAH. Pour un parent qui travaille, l’enjeu est concret : avec ${h.eur(nora)} de salaire net, l’arrivée d’un premier enfant fait passer l’AAH estimée de ${h.eur(a(h, nora, 0).aah, 2)} à ${h.eur(a(h, nora, 1).aah, 2)} par mois, grâce au plafond relevé.` },
      { q: 'Avec un enfant, l’AAH est-elle réduite pendant une hospitalisation ?', a: `Non. Service-public prévoit qu’au-delà de 60 jours d’hospitalisation ou d’hébergement en maison d’accueil spécialisée, l’AAH est ramenée à ${h.pct(h.P.aah.taux_hospitalisation, 0)} du maximum, mais pas si vous avez au moins un enfant à charge au sens des prestations familiales. La même exception vaut en cas d’incarcération de plus de 60 jours. Vous gardez alors votre AAH habituelle.` },
    ],
    body: (h) => `
<h2>Le barème des plafonds, enfant par enfant</h2>
<p>La ${h.src('spAah', 'fiche AAH de service-public')} publie un tableau des plafonds selon le nombre d’enfants à charge. Chaque enfant ajoute environ la moitié du plafond d’une personne seule, soit ${h.eur(h.P.aah.majoration_enfant)}. Le montant maximal, fixé par le ${h.src('decretAah2026', 'décret du 30 mars 2026')}, ne bouge pas.</p>
${h.table(['Enfants à charge', 'Plafond annuel', 'AAH au Smic net', 'Salaire de sortie'], [0, 1, 2, 3].map((e) => [String(e), h.eur(h.M.plafondAah(e)), h.eur(a(h, h.P.smic.mensuel_net, e).aah, 2), h.eur(h.M.seuilSortieAah(e))]), 'Calcul déconjugalisé, sans autre ressource, barème 2026 (calcul du moteur)', ['l', 'r', 'r', 'r'])}
<p>Une précision sur les arrondis : le plafond vaut douze fois le montant maximal de l’AAH, majoré de moitié par enfant, puis arrondi à l’euro. C’est pourquoi l’écart d’un enfant au suivant varie d’un euro selon les lignes du tableau publié, et notre moteur reproduit ces valeurs à l’euro près.</p>
<!--mini:aahEnfants-->

<h2>Pourquoi la majoration ne profite qu’aux parents qui ont des revenus</h2>
<p>Le calcul de l’AAH retire les ressources du plafond, puis plafonne le résultat au montant maximal. Sans ressource, le résultat dépasse toujours ce maximum, avec ou sans enfant : la majoration du plafond reste invisible. Dès qu’un salaire ou une pension entre en jeu, la majoration crée une marge supplémentaire de ${h.eur(h.P.aah.majoration_enfant / 12, 2)} par mois et par enfant avant que l’AAH ne commence à baisser. C’est pour cela que deux parents au même salaire, l’un avec enfants, l’autre sans, peuvent toucher des AAH très différentes.</p>

<h2>Nora, deux enfants et un poste à temps plein</h2>
<p>Nora élève seule ses deux enfants de 6 et 9 ans. La CDAPH lui a reconnu un taux de 50 % avec une restriction substantielle et durable d’accès à l’emploi, ce qui ouvre l’AAH. Elle travaille à temps plein dans une association pour ${h.eur(nora)} net par mois. Après abattement, la CAF retient ${h.eur(h.M.salaireRetenuAah(nora), 2)} par mois. Son plafond, avec deux enfants, est de ${h.eur(h.M.plafondAah(2))} selon notre moteur. Son AAH estimée atteint ${h.eur(a(h, nora, 2).aah, 2)}, soit un revenu de ${h.eur(nora + a(h, nora, 2).aah, 2)} hors allocations familiales.</p>
<p>Le jour où son aîné cesse d’être à charge au sens des prestations familiales, le plafond redescend à ${h.eur(h.M.plafondAah(1))} et l’AAH estimée de Nora tombe à ${h.eur(a(h, nora, 1).aah, 2)}. Rien n’a changé dans son salaire ni dans son handicap : c’est l’effet mécanique du plafond. Mieux vaut anticiper cette marche dans le budget du foyer.</p>
<p>Nora perçoit aussi des allocations familiales pour ses deux enfants, selon la ${h.src('spAf', 'fiche allocations familiales')} ; le ${h.a('simulateur-allocations-familiales', 'simulateur d’allocations familiales')} en donne le montant. Avec un taux de 50 à 79 %, son AAH lui est accordée pour 1 à 2 ans, ou 1 à 5 ans si son handicap ne peut pas évoluer favorablement : elle devra renouveler sa demande avant l’échéance.</p>

<h2>Même salaire, nombre d’enfants différent</h2>
<p>Le tableau suivant garde le salaire de Nora, ${h.eur(nora)} net par mois, et ne fait varier que le nombre d’enfants à charge. L’écart entre la première et la dernière ligne dépasse plusieurs centaines d’euros par mois, alors que le handicap et le salaire sont identiques.</p>
${h.table(['Enfants à charge', 'AAH estimée', 'Salaire + AAH'], [0, 1, 2, 3].map((e) => [String(e), h.eur(a(h, nora, e).aah, 2), h.eur(nora + a(h, nora, e).aah, 2)]), 'Salaire net de 1 500 € par mois, calcul déconjugalisé (estimation)', ['l', 'r', 'r'])}
<p>La logique vaut aussi pour une pension. Un parent qui perçoit 900 € de pension d’invalidité avec un enfant à charge garde une AAH estimée de ${h.eur(h.M.aah({ salaire: 0, autres: 900, enfants: 1 }).aah, 2)}, contre ${h.eur(h.M.aah({ salaire: 0, autres: 900 }).aah, 2)} sans enfant. Le plafond plus élevé laisse simplement plus de place sous la limite. Au-delà de trois enfants, la majoration continue, au même rythme d’environ ${h.eur(h.P.aah.majoration_enfant)} par an et par enfant.</p>

<h2>En couple avec enfants</h2>
<p>Pour un parent en couple, c’est le plafond individuel qui s’applique depuis le 1er octobre 2023, majoré de la même façon pour chaque enfant. L’ancien calcul de couple, conservé s’il est plus favorable, a lui aussi un plafond majoré par enfant : ${h.eur(h.P.aah.plafond_couple_conjugalise + h.P.aah.majoration_enfant)} avec un enfant contre ${h.eur(h.P.aah.plafond_couple_conjugalise)} sans enfant. La page ${h.a('aah-deconjugalisation', 'déconjugalisation de l’AAH')} explique quand ce calcul reste appliqué. Pour un parent qui travaille, la page ${h.a('aah-cumul-salaire', 'AAH et salaire')} détaille l’abattement, et le ${h.a('simulateur-aah', 'simulateur AAH')} prend en compte le nombre d’enfants.</p>
`,
  },
  en: {
    slug: 'aah-with-children',
    nav: 'AAH and children',
    card: 'Each dependent child raises the AAH ceiling: what that means for a parent in work.',
    title: 'AAH With Children 2026: €6,250 More Ceiling per Child',
    description: 'AAH with dependent children in 2026: the ceiling rises from €12,499 to €18,749 with one child. Effect on a working parent, exit wage per child, calculator.',
    h1: 'AAH with dependent children: a higher ceiling, not a higher amount',
    intro: 'Children do not raise the AAH maximum. They raise the income ceiling, which matters most for a parent who works.',
    resume: (h) => `Each dependent child raises the income ceiling of the AAH (allocation aux adultes handicapés, France’s allowance for disabled adults) by about ${h.eur(h.P.aah.majoration_enfant)} a year: ${h.eur(h.M.plafondAah(0))} with no children, ${h.eur(h.M.plafondAah(1))} with one child in 2026. The maximum stays at ${h.eur(h.P.aah.montant_max, 2)} a month whatever the number of children, so a parent with no income receives the same AAH as a single person. For a parent with income, however, the uplift changes a great deal. On ${h.eur(nora)} of net pay, someone with no children keeps an estimated AAH of ${h.eur(a(h, nora, 0).aah, 2)}; with two dependent children, they keep ${h.eur(a(h, nora, 2).aah, 2)}. The wage at which AAH runs out moves from ${h.eur(h.M.seuilSortieAah(0))} to ${h.eur(h.M.seuilSortieAah(2))}. Only children who are dependants for family benefit purposes count. These are estimates; the CAF (family benefits office) works out the entitlement.`,
    faqs: (h) => [
      { q: 'Does AAH go up when you have a child?', a: `Not the maximum, which stays at ${h.eur(h.P.aah.montant_max, 2)} a month. What goes up is the income ceiling: ${h.eur(h.M.plafondAah(1))} a year with one dependent child instead of ${h.eur(h.M.plafondAah(0))}. A parent with no income sees no difference; a parent who works or has a pension keeps more AAH, because more of their income fits under the ceiling.` },
      { q: 'I am a single mum earning €1,500 net with two children, can I get AAH?', a: `If the CDAPH recognises a sufficient impairment rate, yes, and the amount is still meaningful. With two dependent children, your yearly ceiling is ${h.eur(h.M.plafondAah(2))} according to our engine. Your pay, counted after the earnings allowance at ${h.eur(h.M.salaireRetenuAah(nora), 2)} a month, leaves an estimated AAH of ${h.eur(a(h, nora, 2).aah, 2)}. Without children it would be only ${h.eur(a(h, nora, 0).aah, 2)}.` },
      { q: 'Which children count as dependants for the AAH ceiling?', a: `Children who are dependants for family benefit purposes, according to the service-public.fr table. It is the same notion as for allocations familiales (child benefit), paid until the child turns ${h.P.af.age_limite}. A child who stops being a dependant on that basis no longer raises the ceiling by ${h.eur(h.P.aah.majoration_enfant)}, which can lower a working parent’s AAH.` },
      { q: 'Do I need to report my baby’s birth for my AAH?', a: `Yes. Service-public.fr asks you to report any change of situation to the CAF or MSA, family life included, because it can alter AAH. For a working parent the stakes are concrete: on ${h.eur(nora)} of net pay, a first child moves estimated AAH from ${h.eur(a(h, nora, 0).aah, 2)} to ${h.eur(a(h, nora, 1).aah, 2)} a month, thanks to the higher ceiling.` },
      { q: 'With a child, is AAH cut during a long hospital stay?', a: `No. Service-public.fr says that after more than 60 days in hospital or in a specialised care home, AAH drops to ${h.pct(h.P.aah.taux_hospitalisation, 0)} of the maximum, but not if you have at least one dependent child for family benefit purposes. The same exception applies to imprisonment of more than 60 days. You then keep your usual AAH.` },
    ],
    body: (h) => `
<h2>The ceilings, child by child</h2>
<p>The ${h.src('spAah', 'service-public.fr AAH sheet')} publishes a table of ceilings by number of dependent children. Each child adds roughly half the single-person ceiling, ${h.eur(h.P.aah.majoration_enfant)}. The maximum amount, set by the ${h.src('decretAah2026', 'decree of 30 March 2026')}, does not change.</p>
${h.table(['Dependent children', 'Yearly ceiling', 'AAH on net minimum wage', 'Exit wage'], [0, 1, 2, 3].map((e) => [String(e), h.eur(h.M.plafondAah(e)), h.eur(a(h, h.P.smic.mensuel_net, e).aah, 2), h.eur(h.M.seuilSortieAah(e))]), 'Individualised calculation, no other income, 2026 scale (engine calculation)', ['l', 'r', 'r', 'r'])}
<p>A note on rounding: the ceiling is twelve times the maximum AAH, raised by half for each child, then rounded to the euro. That is why the step from one child to the next varies by a euro across the published table, and our engine reproduces those values exactly.</p>
<!--mini:aahEnfants-->

<h2>Why the uplift only helps parents with income</h2>
<p>The AAH calculation subtracts resources from the ceiling, then caps the result at the maximum. With no resources, the result is always above that maximum, with or without children, so the uplift is invisible. As soon as a wage or pension comes into play, the uplift creates an extra margin of ${h.eur(h.P.aah.majoration_enfant / 12, 2)} a month per child before AAH starts to fall. That is why two parents on the same pay, one with children and one without, can receive very different amounts.</p>

<h2>Nora: two children and a full-time job</h2>
<p>Nora raises her two children, aged 6 and 9, on her own. The CDAPH (the decision board of the MDPH, the local disability office) has recognised a 50% rate with a substantial and lasting restriction on access to work, which opens AAH. She works full time for a charity, earning ${h.eur(nora)} net a month. After the earnings allowance, the CAF counts ${h.eur(h.M.salaireRetenuAah(nora), 2)} a month. Her ceiling with two children is ${h.eur(h.M.plafondAah(2))} according to our engine. Her estimated AAH is ${h.eur(a(h, nora, 2).aah, 2)}, giving an income of ${h.eur(nora + a(h, nora, 2).aah, 2)} before child benefit.</p>
<p>The day her elder child stops being a dependant for family benefit purposes, the ceiling drops to ${h.eur(h.M.plafondAah(1))} and Nora’s estimated AAH falls to ${h.eur(a(h, nora, 1).aah, 2)}. Nothing has changed in her pay or her disability: it is simply the ceiling at work. It is worth planning that step into the household budget.</p>
<p>Nora also receives allocations familiales for her two children, under the ${h.src('spAf', 'family allowances sheet')}; the ${h.a('simulateur-allocations-familiales', 'family allowance calculator')} gives the amount. With a 50 to 79% rate, her AAH is granted for 1 to 2 years, or 1 to 5 years if her condition cannot improve, so she will need to renew her claim before it expires.</p>

<h2>Same pay, different number of children</h2>
<p>The next table keeps Nora’s pay, ${h.eur(nora)} net a month, and only changes the number of dependent children. The gap between the first and last rows runs to several hundred euros a month, although the disability and the wage are identical.</p>
${h.table(['Dependent children', 'Estimated AAH', 'Pay + AAH'], [0, 1, 2, 3].map((e) => [String(e), h.eur(a(h, nora, e).aah, 2), h.eur(nora + a(h, nora, e).aah, 2)]), 'Net pay of €1,500 a month, individualised calculation (estimate)', ['l', 'r', 'r'])}
<p>The same logic applies to a pension. A parent with a €900 disability pension and one dependent child keeps an estimated AAH of ${h.eur(h.M.aah({ salaire: 0, autres: 900, enfants: 1 }).aah, 2)}, against ${h.eur(h.M.aah({ salaire: 0, autres: 900 }).aah, 2)} with no children. The higher ceiling simply leaves more room under the limit. Beyond three children, the uplift carries on at the same pace, about ${h.eur(h.P.aah.majoration_enfant)} a year per child. If you moved to France with your family, make sure each child is registered with the CAF as a dependant: the ceiling only rises for children the CAF knows about.</p>

<h2>Parents in a couple</h2>
<p>For a parent living with a partner, the individual ceiling has applied since 1 October 2023, raised in the same way for each child. The old couple calculation, kept where it is more favourable, also has a ceiling raised per child: ${h.eur(h.P.aah.plafond_couple_conjugalise + h.P.aah.majoration_enfant)} with one child against ${h.eur(h.P.aah.plafond_couple_conjugalise)} with none. The page on ${h.a('aah-deconjugalisation', 'AAH and a partner’s income')} explains when that method still applies. For a working parent, the page on ${h.a('aah-cumul-salaire', 'AAH and wages')} details the earnings allowance, and the ${h.a('simulateur-aah', 'AAH calculator')} takes the number of children into account.</p>
`,
  },
});
