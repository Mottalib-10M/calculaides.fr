import { defineGuide, type Helpers } from '../../lib/guide-types';

const maj = (h: Helpers, t: 0 | 1 | 2) => h.P.af.majoration[t];
const ans = (h: Helpers) => h.P.af.age_majoration_nouveau - h.P.af.age_majoration_ancien;
const dureeAncien = (h: Helpers) => (h.P.af.age_limite - h.P.af.age_majoration_ancien) * 12;
const dureeNouveau = (h: Helpers) => (h.P.af.age_limite - h.P.af.age_majoration_nouveau) * 12;
const af = (h: Helpers, enfants: number, majorables: number, revenus: number) => h.M.allocationsFamiliales({ enfants, majorables, revenus });

export default defineGuide({
  id: 'majoration-allocations-familiales',
  group: 'famille',
  order: 50,
  mini: 'afMajoration',
  miniHref: 'simulateur-allocations-familiales',
  related: ['simulateur-allocations-familiales', 'allocations-familiales-2-enfants', 'allocations-familiales-3-enfants', 'allocation-forfaitaire-20-ans'],
  sources: ['spAf', 'instructionPf2026'],
  fr: {
    slug: 'majoration-allocations-familiales',
    nav: 'Majoration pour âge',
    card: 'Né avant ou après le 1er mars 2012 : 14 ou 18 ans pour la majoration, et ce que la réforme coûte.',
    title: 'Majoration allocations familiales 2026 : 14 ou 18 ans ?',
    description: 'Majoration des allocations familiales 2026 : 76,13 € par mois à 14 ans pour un enfant né avant le 1er mars 2012, à 18 ans s’il est né après. Cas et dates.',
    h1: 'Majoration pour âge des allocations familiales : 14 ou 18 ans',
    intro: 'Deux enfants nés à quelques semaines d’écart en 2012 n’ouvrent pas la majoration au même âge : tout se joue sur la date du 1er mars.',
    resume: (h) => `La majoration pour âge ajoute ${h.eur(maj(h, 0), 2)} par mois et par enfant aux allocations familiales en 2026, ${h.eur(maj(h, 1), 2)} ou ${h.eur(maj(h, 2), 2)} si les revenus du foyer dépassent les plafonds. L’âge auquel elle commence dépend de la date de naissance : à ${h.P.af.age_majoration_ancien} ans pour un enfant né avant le ${h.date(h.P.af.bascule_majoration)}, à ${h.P.af.age_majoration_nouveau} ans pour un enfant né à partir de cette date. En 2026, ce sont donc les derniers enfants nés début 2012 qui l’ouvrent encore à ${h.P.af.age_majoration_ancien} ans ; pour tous les suivants, il faudra attendre ${h.P.af.age_majoration_nouveau} ans, soit ${ans(h)} ans de plus. Comme les allocations s’arrêtent aux ${h.P.af.age_limite} ans de l’enfant, la majoration dure au plus ${dureeNouveau(h)} mois dans le nouveau régime, contre ${dureeAncien(h)} dans l’ancien. Dernière règle : dans une famille de deux enfants, l’aîné n’ouvre jamais de majoration, seul le cadet le peut. Les montants sont nets de CRDS et constituent une estimation ; la CAF tranche sur le dossier.`,
    faqs: (h) => [
      { q: 'Mon fils est né le 5 mars 2012, quand la CAF versera-t-elle sa majoration ?', a: `À ses ${h.P.af.age_majoration_nouveau} ans, en mars 2030, et non à ${h.P.af.age_majoration_ancien} ans. Né après le 1er mars 2012, il relève du nouveau régime. Il faudra aussi qu’il reste à charge et que la famille perçoive encore les allocations familiales à ce moment-là. La majoration vaudra alors ${h.eur(maj(h, 0), 2)} par mois au premier niveau de revenus, au barème actuel publié par service-public.` },
      { q: 'Ma fille née en février 2012 a eu 14 ans : la majoration est-elle due ?', a: `Oui. Née avant le 1er mars 2012, elle relève de l’ancien régime : la majoration est versée à partir du mois qui suit son ${h.P.af.age_majoration_ancien}e anniversaire, selon service-public, donc depuis mars 2026. Au premier niveau de revenus, elle ajoute ${h.eur(maj(h, 0), 2)} par mois, à condition qu’elle ne soit pas l’aînée d’une famille de deux enfants.` },
      { q: 'Pourquoi n’ai-je aucune majoration pour mon aîné de 17 ans avec deux enfants ?', a: `Parce que la règle l’exclut : dans une famille de deux enfants, l’aîné n’ouvre pas la majoration, même né avant mars 2012. Seul le cadet peut la déclencher. Si le cadet est né après le 1er mars 2012, la famille attendra ses ${h.P.af.age_majoration_nouveau} ans, ce qui arrive souvent après les ${h.P.af.age_limite} ans de l’aîné, date à laquelle les allocations s’arrêtent.` },
      { q: 'Combien vaut la majoration pour âge quand nos revenus dépassent le plafond ?', a: `Elle suit la même modulation que les allocations : ${h.eur(maj(h, 1), 2)} par mois entre les deux plafonds, ${h.eur(maj(h, 2), 2)} au-delà du second. Pour trois enfants, les plafonds sont de ${h.eur(h.M.plafondsAf(3)[0])} et ${h.eur(h.M.plafondsAf(3)[1])} de revenu net catégoriel ${h.P.af.revenus_reference}, d’après le barème publié par service-public.` },
      { q: 'Des jumeaux nés le 29 février et le 1er mars 2012 ont-ils la même majoration ?', a: `Non, en application stricte de la règle. Le critère est la date de naissance : l’enfant né le 29 février 2012 relève de l’ancien régime et ouvre la majoration à ${h.P.af.age_majoration_ancien} ans, son jumeau né le 1er mars à ${h.P.af.age_majoration_nouveau} ans. Écart cumulé au premier niveau de revenus : ${h.eur(maj(h, 0) * (dureeAncien(h) - dureeNouveau(h)))}. Service-public ne prévoit pas d’exception pour les naissances multiples.` },
      { q: 'Pendant combien de mois la majoration est-elle versée ?', a: `Jusqu’à ce que l’enfant ait ${h.P.af.age_limite} ans, âge où il cesse de compter pour les allocations familiales. Ouverte à ${h.P.af.age_majoration_ancien} ans, elle dure jusqu’à ${dureeAncien(h)} mois, soit ${h.eur(maj(h, 0) * dureeAncien(h))} au premier niveau. Ouverte à ${h.P.af.age_majoration_nouveau} ans, ${dureeNouveau(h)} mois au plus, ${h.eur(maj(h, 0) * dureeNouveau(h))}, et seulement si la famille garde assez d’enfants à charge.` },
    ],
    body: (h) => `
<h2>Ce qu’a changé la date du 1er mars 2012</h2>
<p>Pendant des années, la majoration pour âge s’ouvrait à ${h.P.af.age_majoration_ancien} ans pour tous les enfants. La règle a été modifiée pour les enfants nés à partir du ${h.date(h.P.af.bascule_majoration)} : pour eux, elle arrive à ${h.P.af.age_majoration_nouveau} ans, comme le précise la ${h.src('spAf', 'fiche service-public des allocations familiales')}. Les enfants nés avant cette date conservent l’ancien âge.</p>
<p>En 2026, la bascule se voit concrètement. Les enfants nés en janvier et février 2012 fêtent leurs ${h.P.af.age_majoration_ancien} ans et ouvrent la majoration. Ceux nés à partir de mars 2012, qui ont aussi ${h.P.af.age_majoration_ancien} ans cette année, n’ouvrent rien. Pour toutes les générations suivantes, la majoration ne viendra qu’à ${h.P.af.age_majoration_nouveau} ans.</p>
<!--mini:afMajoration-->

<h2>Quatre enfants, quatre dates</h2>
<p>Voici comment la règle s’applique à des enfants réels, dans des familles d’au moins trois enfants (la majoration de l’aîné y est due) :</p>
${h.table(['Date de naissance', 'Âge d’ouverture', 'Majoration à partir de', 'Durée maximale'], [['15 février 2012', `${h.P.af.age_majoration_ancien} ans`, 'mars 2026', `${dureeAncien(h)} mois`], ['10 mars 2012', `${h.P.af.age_majoration_nouveau} ans`, 'avril 2030', `${dureeNouveau(h)} mois`], ['30 novembre 2011', `${h.P.af.age_majoration_ancien} ans`, 'décembre 2025', `${dureeAncien(h)} mois`], ['1er juin 2015', `${h.P.af.age_majoration_nouveau} ans`, 'juillet 2033', `${dureeNouveau(h)} mois`]], 'Majoration pour âge selon la date de naissance (premier mois estimé : le mois qui suit l’anniversaire)', ['l', 'l', 'l', 'r'])}
<p>Entre le premier et le deuxième enfant du tableau, nés à moins d’un mois d’écart, la différence cumulée atteint ${h.eur(maj(h, 0) * (dureeAncien(h) - dureeNouveau(h)))} au premier niveau de revenus. C’est l’effet le plus visible de la réforme : un droit qui durait six ans n’en dure plus que deux.</p>

<h2>La famille de deux enfants, un cas à part</h2>
<p>Dans une famille de deux enfants, l’aîné n’ouvre jamais la majoration, quel que soit son âge ou sa date de naissance. Seul le cadet compte. Avec le nouvel âge de ${h.P.af.age_majoration_nouveau} ans, le cadet doit encore avoir un frère ou une sœur de moins de ${h.P.af.age_limite} ans à ce moment-là, sinon les allocations elles-mêmes ont disparu. Deux enfants nés en 2013 et 2016 : l’aîné atteint ${h.P.af.age_limite} ans en 2033, le cadet ${h.P.af.age_majoration_nouveau} ans en 2034. Cette famille ne touchera jamais de majoration. La page ${h.a('allocations-familiales-2-enfants', 'allocations familiales pour deux enfants')} reprend ce calendrier.</p>
<p>À partir de trois enfants, la règle change : chaque enfant qui remplit la condition d’âge ouvre sa majoration, y compris l’aîné. Une famille de trois à 60 000 € dont deux adolescents sont nés avant mars 2012 touche ${h.eur(af(h, 3, 2, 60000).total, 2)} par mois, contre ${h.eur(af(h, 3, 0, 60000).total, 2)} sans eux.</p>

<h2>Quand la majoration croise les départs des aînés</h2>
<p>Le nouvel âge de ${h.P.af.age_majoration_nouveau} ans tombe souvent au moment où la famille rétrécit. Prenons trois enfants nés en 2011, 2013 et 2016, avec 60 000 € de revenus. En 2026, seul l’aîné, né avant mars 2012, ouvre une majoration : la famille reçoit ${h.eur(af(h, 3, 1, 60000).total, 2)} par mois. En 2031, l’aîné atteint ${h.P.af.age_limite} ans et sort du calcul. La même année, le deuxième fête ses ${h.P.af.age_majoration_nouveau} ans ; mais il est désormais l’aîné d’une famille de deux enfants, et l’exclusion de l’aîné s’applique à lui. Aucune majoration ne lui sera versée.</p>
<p>Le benjamin, né en 2016, n’atteindra ${h.P.af.age_majoration_nouveau} ans qu’en 2034, un an après les ${h.P.af.age_limite} ans de son frère, quand il ne restera plus qu’un enfant et plus d’allocations familiales. Sur toute la vie de la famille, une seule majoration aura donc été versée. Avec l’ancienne règle, chacun des trois l’aurait touchée à ${h.P.af.age_majoration_ancien} ans. Ces calendriers se vérifient enfant par enfant avec le mini-simulateur ci-dessus.</p>

<h2>Un montant qui suit les revenus</h2>
<p>La majoration n’est pas fixe. Elle vaut ${h.pct(h.P.af.taux_bmaf.majoration, 0)} de la base mensuelle des allocations familiales au premier niveau de revenus, selon l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}, puis elle est divisée par deux et par quatre comme le reste :</p>
${h.table(['Niveau de revenus', 'Par enfant et par mois', `Sur ${dureeNouveau(h)} mois`, `Sur ${dureeAncien(h)} mois`], ([0, 1, 2] as const).map((t) => [['Montant plein', 'Divisé par 2', 'Divisé par 4'][t], h.eur(maj(h, t), 2), h.eur(maj(h, t) * dureeNouveau(h)), h.eur(maj(h, t) * dureeAncien(h))]), 'Majoration pour âge, montants nets de CRDS (barème 2026)', ['l', 'r', 'r', 'r'])}

<h2>Les démarches</h2>
<p>Aucune demande n’est à faire : la CAF connaît la date de naissance de chaque enfant et ajoute la majoration d’elle-même. Vérifiez seulement, au mois qui suit l’anniversaire, que le montant a bien bougé, et signalez toute erreur sur la date enregistrée. Le ${h.a('simulateur-allocations-familiales', 'simulateur')} tient compte du nombre d’enfants nés avant le 1er mars 2012.</p>
`,
  },
  en: {
    slug: 'family-allowance-age-supplement',
    nav: 'Age supplement',
    card: 'Born before or after 1 March 2012: age 14 or 18 for the supplement, and what the change costs families.',
    title: 'Family Allowance Age Supplement 2026: at 14 or at 18?',
    description: 'Family allowance age supplement 2026: €76.13 a month from age 14 for a child born before 1 March 2012, from age 18 if born later. Worked cases and dates.',
    h1: 'Family allowance age supplement: 14 or 18',
    intro: 'Two children born a few weeks apart in 2012 do not open the supplement at the same age: everything turns on 1 March.',
    resume: (h) => `The age supplement (majoration pour âge) adds ${h.eur(maj(h, 0), 2)} per child per month to French family allowance in 2026, or ${h.eur(maj(h, 1), 2)} and ${h.eur(maj(h, 2), 2)} when household income is above the ceilings. The age at which it starts depends on the date of birth: ${h.P.af.age_majoration_ancien} for a child born before ${h.date(h.P.af.bascule_majoration)}, ${h.P.af.age_majoration_nouveau} for a child born on or after that date. In 2026, the last children born in early 2012 still open it at ${h.P.af.age_majoration_ancien}; everyone born later waits until ${h.P.af.age_majoration_nouveau}, ${ans(h)} years more. Since family allowance stops when the child turns ${h.P.af.age_limite}, the supplement lasts at most ${dureeNouveau(h)} months under the new rule, against ${dureeAncien(h)} under the old one. One more rule: in a two-child family the elder child never opens a supplement, only the younger can. Amounts are net of the CRDS levy and are estimates; the CAF, the family benefits office, decides on the file.`,
    faqs: (h) => [
      { q: 'My son was born on 5 March 2012, when will the CAF pay his supplement?', a: `At ${h.P.af.age_majoration_nouveau}, in March 2030, not at ${h.P.af.age_majoration_ancien}. Born after 1 March 2012, he falls under the new rule. He must also still be dependent, and the family still receiving family allowance, at that point. The supplement will then be ${h.eur(maj(h, 0), 2)} a month at the lowest income level, on the current scale published by service-public.fr.` },
      { q: 'My daughter born in February 2012 has turned 14: is the supplement due?', a: `Yes. Born before 1 March 2012, she falls under the old rule: the supplement is paid from the month after her ${h.P.af.age_majoration_ancien}th birthday, according to service-public.fr, so from March 2026. At the lowest income level it adds ${h.eur(maj(h, 0), 2)} a month, provided she is not the elder child in a two-child family.` },
      { q: 'Why is there no supplement for my 17-year-old when I have two children?', a: `Because the rule excludes them: in a two-child family the elder child does not open the supplement, even if born before March 2012. Only the younger one can. If the younger was born after 1 March 2012, the family waits until that child is ${h.P.af.age_majoration_nouveau}, which often comes after the elder turns ${h.P.af.age_limite}, when family allowance stops altogether.` },
      { q: 'How much is the age supplement when our income is above the ceiling?', a: `It is scaled like the allowance itself: ${h.eur(maj(h, 1), 2)} a month between the two ceilings, ${h.eur(maj(h, 2), 2)} above the second. For three children, the ceilings are ${h.eur(h.M.plafondsAf(3)[0])} and ${h.eur(h.M.plafondsAf(3)[1])} of ${h.P.af.revenus_reference} revenu net catégoriel (net income by category, from your tax notice), per the scale published by service-public.fr.` },
      { q: 'Twins born on 29 February and 1 March 2012: do they get the same supplement?', a: `No, if the rule is applied to the letter. The test is the date of birth: the child born on 29 February 2012 falls under the old rule and opens the supplement at ${h.P.af.age_majoration_ancien}, the twin born on 1 March at ${h.P.af.age_majoration_nouveau}. Cumulative gap at the lowest income level: ${h.eur(maj(h, 0) * (dureeAncien(h) - dureeNouveau(h)))}. Service-public.fr mentions no exception for multiple births.` },
      { q: 'For how many months is the age supplement paid?', a: `Until the child turns ${h.P.af.age_limite}, when they stop counting for family allowance. Opened at ${h.P.af.age_majoration_ancien}, it lasts up to ${dureeAncien(h)} months, worth ${h.eur(maj(h, 0) * dureeAncien(h))} at the lowest income level. Opened at ${h.P.af.age_majoration_nouveau}, it runs for ${dureeNouveau(h)} months at most, or ${h.eur(maj(h, 0) * dureeNouveau(h))}, and only if the family still has enough dependent children for the allowance to continue.` },
    ],
    body: (h) => `
<h2>What the 1 March 2012 cut-off changed</h2>
<p>For years, the age supplement started at ${h.P.af.age_majoration_ancien} for every child. The rule was changed for children born on or after ${h.date(h.P.af.bascule_majoration)}: for them it comes at ${h.P.af.age_majoration_nouveau}, as the ${h.src('spAf', 'service-public.fr family allowance page')} states. Children born before that date keep the old age.</p>
<p>In 2026 the switch is plain to see. Children born in January and February 2012 turn ${h.P.af.age_majoration_ancien} and open the supplement. Those born from March 2012, who also turn ${h.P.af.age_majoration_ancien} this year, open nothing. For every later generation, the supplement only comes at ${h.P.af.age_majoration_nouveau}.</p>
<!--mini:afMajoration-->

<h2>Four children, four dates</h2>
<p>This is how the rule plays out for real birth dates, in families of at least three children (where the eldest's supplement is due):</p>
${h.table(['Date of birth', 'Opening age', 'Supplement from', 'Maximum length'], [['15 February 2012', String(h.P.af.age_majoration_ancien), 'March 2026', `${dureeAncien(h)} months`], ['10 March 2012', String(h.P.af.age_majoration_nouveau), 'April 2030', `${dureeNouveau(h)} months`], ['30 November 2011', String(h.P.af.age_majoration_ancien), 'December 2025', `${dureeAncien(h)} months`], ['1 June 2015', String(h.P.af.age_majoration_nouveau), 'July 2033', `${dureeNouveau(h)} months`]], 'Age supplement by date of birth (first month estimated as the month after the birthday)', ['l', 'l', 'l', 'r'])}
<p>Between the first two children in the table, born less than a month apart, the cumulative difference reaches ${h.eur(maj(h, 0) * (dureeAncien(h) - dureeNouveau(h)))} at the lowest income level. That is the most visible effect of the change: an entitlement that lasted six years now lasts two.</p>

<h2>Two-child families are a case apart</h2>
<p>In a two-child family, the elder never opens the supplement, whatever their age or date of birth. Only the younger counts. With the new age of ${h.P.af.age_majoration_nouveau}, the younger child must still have a sibling under ${h.P.af.age_limite} at that time, otherwise the allowance itself has gone. Two children born in 2013 and 2016: the elder turns ${h.P.af.age_limite} in 2033, the younger ${h.P.af.age_majoration_nouveau} in 2034. That family will never receive a supplement. The page on ${h.a('allocations-familiales-2-enfants', 'family allowance for two children')} walks through this timeline.</p>
<p>From three children the rule changes: each child who meets the age condition opens a supplement, the eldest included. A family of three on €60,000 with two teenagers born before March 2012 receives ${h.eur(af(h, 3, 2, 60000).total, 2)} a month, against ${h.eur(af(h, 3, 0, 60000).total, 2)} without them.</p>

<h2>When the supplement meets the eldest leaving</h2>
<p>The new age of ${h.P.af.age_majoration_nouveau} often lands just as the family shrinks. Take three children born in 2011, 2013 and 2016, on €60,000 of income. In 2026 only the eldest, born before March 2012, opens a supplement: the family receives ${h.eur(af(h, 3, 1, 60000).total, 2)} a month. In 2031 the eldest turns ${h.P.af.age_limite} and leaves the count. The same year the second child turns ${h.P.af.age_majoration_nouveau}; but they are now the elder of a two-child family, and the elder-child exclusion applies to them. No supplement will be paid for them.</p>
<p>The youngest, born in 2016, only reaches ${h.P.af.age_majoration_nouveau} in 2034, a year after their sibling turns ${h.P.af.age_limite}, when a single child is left and family allowance has ended. Over the family's whole life, a single supplement will have been paid. Under the old rule, all three would have received it at ${h.P.af.age_majoration_ancien}. You can check these timelines child by child with the mini calculator above.</p>

<h2>An amount that follows income</h2>
<p>The supplement is not a fixed sum. It equals ${h.pct(h.P.af.taux_bmaf.majoration, 0)} of the monthly family benefit base (BMAF) at the lowest income level, per the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}, and is then halved and quartered like the rest:</p>
${h.table(['Income level', 'Per child per month', `Over ${dureeNouveau(h)} months`, `Over ${dureeAncien(h)} months`], ([0, 1, 2] as const).map((t) => [['Full rate', 'Halved', 'Quartered'][t], h.eur(maj(h, t), 2), h.eur(maj(h, t) * dureeNouveau(h)), h.eur(maj(h, t) * dureeAncien(h))]), 'Age supplement, amounts net of CRDS (2026 scale)', ['l', 'r', 'r', 'r'])}

<h2>What you need to do</h2>
<p>Nothing to apply for: the CAF holds each child's date of birth and adds the supplement itself. Just check, in the month after the birthday, that the payment has moved, and report any mistake in the recorded date. The ${h.a('simulateur-allocations-familiales', 'calculator')} takes into account how many children were born before 1 March 2012.</p>
`,
  },
});
