import { defineGuide, type Helpers } from '../../lib/guide-types';

const cf = (h: Helpers, enfants3a21: number, deuxRevenus: boolean, revenus: number) => h.M.complementFamilial({ enfants3a21, deuxRevenus, revenus });
const seuils = (h: Helpers, n: number, deux: boolean) => cf(h, n, deux, 0);

export default defineGuide({
  id: 'complement-familial',
  group: 'famille',
  order: 80,
  mini: 'cfMontant',
  miniHref: 'simulateur-allocations-familiales',
  related: ['simulateur-allocations-familiales', 'allocations-familiales-3-enfants', 'allocations-familiales-4-enfants', 'allocation-forfaitaire-20-ans', 'allocation-soutien-familial'],
  sources: ['spCf', 'instructionPf2026', 'spAf'],
  fr: {
    slug: 'complement-familial',
    nav: 'Complément familial',
    card: 'La prestation des familles de trois enfants de 3 ans et plus : plafonds à un ou deux revenus, montant majoré.',
    title: 'Complément familial 2026 : 198,16 € ou 297,27 € par mois',
    description: 'Complément familial 2026 : 198,16 € par mois, 297,27 € majoré, pour 3 enfants de 3 à 21 ans. Plafonds 2024 à un ou deux revenus, parent isolé et cas chiffrés.',
    h1: 'Complément familial : conditions, plafonds et montant',
    intro: 'Trois enfants, tous âgés d’au moins 3 ans, et des revenus modestes : le complément familial s’ajoute alors aux allocations familiales.',
    resume: (h) => `Le complément familial vaut ${h.eur(h.P.cf.base, 2)} par mois en 2026, ou ${h.eur(h.P.cf.majore, 2)} dans sa version majorée. Il est versé par la CAF aux familles qui ont au moins trois enfants à charge, tous âgés de ${h.P.cf.age_min} ans à moins de ${h.P.cf.age_max} ans, sous plafond de revenus. Pour trois enfants, le revenu net catégoriel ${h.P.cf.revenus_reference} ne doit pas dépasser ${h.eur(h.P.cf.plafonds.un_revenu[0])} pour un couple à un seul revenu, ${h.eur(h.P.cf.plafonds.deux_revenus[0])} pour un couple à deux revenus ou un parent isolé. Le montant majoré est réservé aux foyers sous ${h.eur(h.P.cf.plafonds_majore.un_revenu[0])} (un revenu) ou ${h.eur(h.P.cf.plafonds_majore.deux_revenus[0])} (deux revenus ou parent isolé). Un couple compte deux revenus quand chacun a perçu au moins ${h.eur(h.P.paje.seuil_deuxieme_revenu)} de revenus professionnels en ${h.P.cf.revenus_reference}. Aucune démarche n’est nécessaire : la CAF reçoit les données fiscales. Le droit s’ouvre au troisième anniversaire du plus jeune et cesse, par exemple, à l’arrivée d’un nouvel enfant de moins de 3 ans. Montants nets de CRDS ; estimation à confirmer par la CAF.`,
    faqs: (h) => [
      { q: 'Le complément familial s’arrête-t-il si un nouveau bébé arrive ?', a: `Oui. Tous les enfants comptés doivent avoir au moins ${h.P.cf.age_min} ans : service-public cite justement l’arrivée d’un nouvel enfant de moins de 3 ans parmi les cas qui mettent fin au versement. Une famille qui perçoit ${h.eur(h.P.cf.base, 2)} par mois le perd donc à la naissance, et le retrouve au troisième anniversaire du bébé si les autres conditions tiennent encore.` },
      { q: 'Comment savoir si nous sommes un couple à deux revenus pour le complément familial ?', a: `Chacun des deux doit avoir perçu au moins ${h.eur(h.P.paje.seuil_deuxieme_revenu)} de revenus professionnels en ${h.P.cf.revenus_reference}, selon service-public. Un parent qui a travaillé quelques mois peut suffire. L’enjeu est réel : pour trois enfants, le plafond passe de ${h.eur(h.P.cf.plafonds.un_revenu[0])} à ${h.eur(h.P.cf.plafonds.deux_revenus[0])}, et celui du montant majoré de ${h.eur(h.P.cf.plafonds_majore.un_revenu[0])} à ${h.eur(h.P.cf.plafonds_majore.deux_revenus[0])}.` },
      { q: 'Parent isolé avec trois enfants, quel plafond pour le complément familial ?', a: `Le même que celui d’un couple à deux revenus : ${h.eur(h.P.cf.plafonds.deux_revenus[0])} de revenu net catégoriel ${h.P.cf.revenus_reference} pour trois enfants, et ${h.eur(h.P.cf.plafonds_majore.deux_revenus[0])} pour le montant majoré de ${h.eur(h.P.cf.majore, 2)}. Avec 25 000 €, un parent isolé reçoit ${h.eur(cf(h, 3, true, 25000).cf, 2)} par mois, d’après le barème de service-public.` },
      { q: 'Nos revenus dépassent un peu le plafond du complément familial, perd-on tout ?', a: `Pas forcément. Selon service-public, une allocation différentielle est versée quand les ressources dépassent de peu le plafond. Son montant dépend de l’écart ; notre simulateur ne la calcule pas et affiche zéro au-delà du plafond, qui est de ${h.eur(h.P.cf.plafonds.un_revenu[0])} pour trois enfants et un revenu. Interrogez la CAF si vous êtes dans ce cas.` },
      { q: 'Faut-il faire une demande de complément familial à la CAF ?', a: `Non, dans le cas général. Service-public indique que les services fiscaux transmettent automatiquement les revenus à la CAF, qui ouvre le droit quand les conditions sont réunies. Une déclaration n’est utile que si cette transmission n’a pas eu lieu. Le versement commence au troisième anniversaire du plus jeune, pour ${h.eur(h.P.cf.base, 2)} ou ${h.eur(h.P.cf.majore, 2)} par mois.` },
      { q: 'Quel revenu pour toucher le complément familial majoré avec quatre enfants ?', a: `Au plus ${h.eur(h.P.cf.plafonds_majore.un_revenu[1])} de revenu net catégoriel ${h.P.cf.revenus_reference} pour un couple à un revenu, ${h.eur(h.P.cf.plafonds_majore.deux_revenus[1])} pour un couple à deux revenus ou un parent isolé. Chaque enfant supplémentaire relève ces seuils de ${h.eur(h.P.cf.plafonds_majore.par_enfant)}. Le montant majoré est alors de ${h.eur(h.P.cf.majore, 2)} par mois, selon service-public.` },
    ],
    body: (h) => `
<h2>Qui peut le toucher</h2>
<p>Le complément familial concerne les familles d’au moins trois enfants à charge, tous âgés de plus de ${h.P.cf.age_min} ans et de moins de ${h.P.cf.age_max} ans, d’après la ${h.src('spCf', 'fiche service-public du complément familial')}. La borne haute n’est pas celle des allocations familiales : un enfant de 20 ans, qui ne compte plus pour celles-ci, compte encore ici jusqu’à ses ${h.P.cf.age_max} ans. La borne basse, elle, exclut toute la famille tant que le plus jeune n’a pas ${h.P.cf.age_min} ans.</p>
<p>La prestation est versée chaque mois à partir du troisième anniversaire du benjamin. Elle s’arrête quand il reste moins de trois enfants dans la tranche d’âge, quand l’aîné atteint ${h.P.cf.age_max} ans dans une famille de trois, ou quand un nouvel enfant de moins de ${h.P.cf.age_min} ans arrive.</p>
<p>Prenons une famille dont les enfants ont 2, 5 et 9 ans. Elle remplit la condition du nombre, pas celle de l’âge : rien n’est dû tant que la cadette n’a pas fêté ses ${h.P.cf.age_min} ans. À partir de cet anniversaire, si le revenu ${h.P.cf.revenus_reference} est sous le plafond, le versement démarre sans démarche. Il durera jusqu’aux ${h.P.cf.age_max} ans de l’aîné, soit douze ans plus tard, à condition qu’aucun nouvel enfant de moins de ${h.P.cf.age_min} ans n’arrive entre-temps.</p>

<h2>Les plafonds de ressources</h2>
<p>Le revenu retenu est le revenu net catégoriel de ${h.P.cf.revenus_reference}, celui de l’avis d’imposition 2025. Le plafond dépend du nombre d’enfants et de la situation : couple à un revenu, ou bien couple à deux revenus et parent isolé, qui partagent les mêmes seuils.</p>
${h.table(['Enfants de 3 à 20 ans', 'Majoré, 1 revenu', 'Base, 1 revenu', 'Majoré, 2 revenus ou isolé', 'Base, 2 revenus ou isolé'], [3, 4, 5, 6].map((n) => [String(n), h.eur(seuils(h, n, false).plafondMajore), h.eur(seuils(h, n, false).plafond), h.eur(seuils(h, n, true).plafondMajore), h.eur(seuils(h, n, true).plafond)]), 'Complément familial 2026 : plafonds de revenus 2024 (au-delà de 4 enfants, prolongement du barème)', ['l', 'r', 'r', 'r', 'r'])}
<p>Un couple est à deux revenus quand chacun a perçu au moins ${h.eur(h.P.paje.seuil_deuxieme_revenu)} de revenus professionnels en ${h.P.cf.revenus_reference}. Le montant est de ${h.eur(h.P.cf.majore, 2)} sous le plafond majoré, ${h.eur(h.P.cf.base, 2)} entre les deux plafonds, selon l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}.</p>
<!--mini:cfMontant-->

<h2>Quatre familles, quatre réponses</h2>
<h3>Un seul salaire, 30 000 €</h3>
<p>Un couple dont un seul parent travaille, trois enfants de 4, 8 et 12 ans. Avec 30 000 €, il dépasse le plafond majoré de ${h.eur(h.P.cf.plafonds_majore.un_revenu[0])} mais reste sous ${h.eur(h.P.cf.plafonds.un_revenu[0])} : ${h.eur(cf(h, 3, false, 30000).cf, 2)} par mois.</p>
<h3>Deux salaires, même revenu total</h3>
<p>Les mêmes 30 000 €, mais répartis entre deux parents qui gagnent chacun plus de ${h.eur(h.P.paje.seuil_deuxieme_revenu)}. Le plafond majoré monte à ${h.eur(h.P.cf.plafonds_majore.deux_revenus[0])} : toujours au-dessus, donc ${h.eur(cf(h, 3, true, 30000).cf, 2)}. À 26 000 €, en revanche, ce couple toucherait ${h.eur(cf(h, 3, true, 26000).cf, 2)}, alors qu’un couple à un revenu n’aurait que ${h.eur(cf(h, 3, false, 26000).cf, 2)}.</p>
<h3>Un parent isolé</h3>
<p>Une mère seule avec trois enfants et 25 000 € de revenus bénéficie des seuils d’un couple à deux revenus : ${h.eur(cf(h, 3, true, 25000).cf, 2)} par mois. Si l’autre parent ne contribue pas à l’entretien des enfants, l’${h.a('allocation-soutien-familial', 'allocation de soutien familial')} peut s’y ajouter.</p>
<h3>Cinq enfants, deux revenus, 60 000 €</h3>
<p>Le plafond de base atteint ${h.eur(seuils(h, 5, true).plafond)} pour cinq enfants : la famille reçoit ${h.eur(cf(h, 5, true, 60000).cf, 2)}. Le montant ne grandit pas avec le nombre d’enfants, seul le plafond s’élève, comme l’explique la page ${h.a('allocations-familiales-4-enfants', 'quatre enfants et plus')}.</p>

<h2>Juste au-dessus du plafond</h2>
<p>Service-public prévoit une allocation différentielle quand les ressources dépassent de peu le plafond. Notre outil ne la calcule pas : il affiche zéro dès que le plafond est franchi. Si votre revenu se situe quelques centaines d’euros au-dessus, la CAF peut verser une somme réduite ; c’est à elle qu’il faut la demander.</p>

<h2>Avec les autres prestations</h2>
<p>Le complément familial s’ajoute aux allocations familiales de la famille. Pour trois enfants et 30 000 € de revenus à un seul salaire, le foyer perçoit ${h.eur(h.M.allocationsFamiliales({ enfants: 3, majorables: 0, revenus: 30000 }).total, 2)} d’allocations familiales et ${h.eur(cf(h, 3, false, 30000).cf, 2)} de complément, soit ${h.eur(h.M.allocationsFamiliales({ enfants: 3, majorables: 0, revenus: 30000 }).total + cf(h, 3, false, 30000).cf, 2)} par mois. Le détail des allocations figure sur la page ${h.a('allocations-familiales-3-enfants', 'trois enfants')} ; l’${h.a('allocation-forfaitaire-20-ans', 'allocation forfaitaire des 20 ans')} explique l’année où les deux prestations divergent.</p>
`,
  },
  en: {
    slug: 'family-supplement',
    nav: 'Family supplement',
    card: 'The benefit for families with three children aged 3 and over: one- or two-income ceilings and the higher rate.',
    title: 'Family Supplement 2026: €198.16 or €297.27 a Month (CAF)',
    description: 'Family supplement 2026 (complément familial): €198.16 a month, €297.27 at the higher rate, for 3 children aged 3 to 21. 2024 income ceilings and worked cases.',
    h1: 'Family supplement (complément familial): conditions, ceilings, amount',
    intro: 'Three children, all aged at least 3, and a modest income: the family supplement is then paid on top of family allowance.',
    resume: (h) => `The family supplement (complément familial) is worth ${h.eur(h.P.cf.base, 2)} a month in 2026, or ${h.eur(h.P.cf.majore, 2)} at the higher rate. The CAF (Caisse d'allocations familiales, the family benefits office) pays it to families with at least three dependent children, all aged ${h.P.cf.age_min} to under ${h.P.cf.age_max}, subject to an income ceiling. For three children, the ${h.P.cf.revenus_reference} revenu net catégoriel (net income by category, from the tax assessment notice) must not exceed ${h.eur(h.P.cf.plafonds.un_revenu[0])} for a one-income couple, ${h.eur(h.P.cf.plafonds.deux_revenus[0])} for a two-income couple or a single parent. The higher rate is for households under ${h.eur(h.P.cf.plafonds_majore.un_revenu[0])} (one income) or ${h.eur(h.P.cf.plafonds_majore.deux_revenus[0])} (two incomes or single parent). A couple counts as two incomes when each partner earned at least ${h.eur(h.P.paje.seuil_deuxieme_revenu)} from work in ${h.P.cf.revenus_reference}. No application is needed: the CAF receives the tax data. Payment starts on the youngest's third birthday and ends, for instance, when a new child under 3 arrives. Amounts are net of the CRDS levy; an estimate to be confirmed by the CAF.`,
    faqs: (h) => [
      { q: 'Does the family supplement stop when a new baby arrives?', a: `Yes. Every child counted must be at least ${h.P.cf.age_min}: service-public.fr lists the arrival of a new child under 3 among the events that end payment. A family receiving ${h.eur(h.P.cf.base, 2)} a month therefore loses it at the birth, and gets it back on the baby's third birthday if the other conditions still hold.` },
      { q: 'How do we know if we count as a two-income couple for the family supplement?', a: `Each partner must have earned at least ${h.eur(h.P.paje.seuil_deuxieme_revenu)} from work in ${h.P.cf.revenus_reference}, according to service-public.fr. A few months of work by one parent can be enough. It matters: for three children the ceiling rises from ${h.eur(h.P.cf.plafonds.un_revenu[0])} to ${h.eur(h.P.cf.plafonds.deux_revenus[0])}, and the higher-rate ceiling from ${h.eur(h.P.cf.plafonds_majore.un_revenu[0])} to ${h.eur(h.P.cf.plafonds_majore.deux_revenus[0])}.` },
      { q: 'Single parent with three children, which family supplement ceiling applies?', a: `The same as a two-income couple: ${h.eur(h.P.cf.plafonds.deux_revenus[0])} of ${h.P.cf.revenus_reference} net income for three children, and ${h.eur(h.P.cf.plafonds_majore.deux_revenus[0])} for the higher rate of ${h.eur(h.P.cf.majore, 2)}. On €25,000, a single parent receives ${h.eur(cf(h, 3, true, 25000).cf, 2)} a month, on the scale published by service-public.fr for 2026 entitlements.` },
      { q: 'Our income is slightly over the family supplement ceiling, do we lose it all?', a: `Not necessarily. According to service-public.fr, a differential allowance is paid when income is only slightly above the ceiling. Its amount depends on the gap; our calculator does not compute it and shows zero above the ceiling, which is ${h.eur(h.P.cf.plafonds.un_revenu[0])} for three children on one income. Ask the CAF if this is your case.` },
      { q: 'Do I have to apply to the CAF for the family supplement?', a: `Not in the usual case. Service-public.fr says the tax authorities pass income data to the CAF automatically, and the CAF opens the entitlement when the conditions are met. A declaration is only needed if that transfer did not happen. Payment starts on the youngest's third birthday, at ${h.eur(h.P.cf.base, 2)} or ${h.eur(h.P.cf.majore, 2)} a month.` },
      { q: 'What income qualifies for the higher family supplement with four children?', a: `No more than ${h.eur(h.P.cf.plafonds_majore.un_revenu[1])} of ${h.P.cf.revenus_reference} net income for a one-income couple, ${h.eur(h.P.cf.plafonds_majore.deux_revenus[1])} for a two-income couple or single parent. Each further child raises these limits by ${h.eur(h.P.cf.plafonds_majore.par_enfant)}. The higher rate is then ${h.eur(h.P.cf.majore, 2)} a month, according to service-public.fr, instead of the standard ${h.eur(h.P.cf.base, 2)}.` },
    ],
    body: (h) => `
<h2>Who can receive it</h2>
<p>The family supplement is for families with at least three dependent children, all over ${h.P.cf.age_min} and under ${h.P.cf.age_max}, according to the ${h.src('spCf', 'service-public.fr family supplement page')}. The upper limit differs from family allowance: a 20-year-old, who no longer counts for family allowance, still counts here until 21. The lower limit shuts the whole family out until the youngest turns ${h.P.cf.age_min}.</p>
<p>It is paid monthly from the youngest child's third birthday. It stops when fewer than three children remain in the age band, when the eldest of three reaches ${h.P.cf.age_max}, or when a new child under ${h.P.cf.age_min} arrives.</p>
<p>Take a family whose children are 2, 5 and 9. It meets the number condition but not the age one: nothing is due until the youngest has turned ${h.P.cf.age_min}. From that birthday, if ${h.P.cf.revenus_reference} income is under the ceiling, payment starts with no paperwork. It will last until the eldest turns ${h.P.cf.age_max}, twelve years later, provided no new child under ${h.P.cf.age_min} joins the family in the meantime.</p>

<h2>Income ceilings</h2>
<p>The income used is the ${h.P.cf.revenus_reference} revenu net catégoriel shown on the 2025 avis d'imposition (tax assessment notice). The ceiling depends on the number of children and the situation: a one-income couple, or else a two-income couple or single parent, who share the same limits.</p>
${h.table(['Children aged 3 to 20', 'Higher, 1 income', 'Base, 1 income', 'Higher, 2 incomes or single', 'Base, 2 incomes or single'], [3, 4, 5, 6].map((n) => [String(n), h.eur(seuils(h, n, false).plafondMajore), h.eur(seuils(h, n, false).plafond), h.eur(seuils(h, n, true).plafondMajore), h.eur(seuils(h, n, true).plafond)]), 'Family supplement 2026: 2024 income ceilings (beyond 4 children, the scale extended)', ['l', 'r', 'r', 'r', 'r'])}
<p>A couple has two incomes when each partner earned at least ${h.eur(h.P.paje.seuil_deuxieme_revenu)} from work in ${h.P.cf.revenus_reference}. The amount is ${h.eur(h.P.cf.majore, 2)} below the higher-rate ceiling and ${h.eur(h.P.cf.base, 2)} between the two ceilings, per the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}.</p>
<!--mini:cfMontant-->

<h2>Four families, four answers</h2>
<h3>One salary, €30,000</h3>
<p>A couple in which only one parent works, three children aged 4, 8 and 12. On €30,000 they are above the higher-rate ceiling of ${h.eur(h.P.cf.plafonds_majore.un_revenu[0])} but below ${h.eur(h.P.cf.plafonds.un_revenu[0])}: ${h.eur(cf(h, 3, false, 30000).cf, 2)} a month.</p>
<h3>Two salaries, same total income</h3>
<p>The same €30,000, but split between two parents each earning more than ${h.eur(h.P.paje.seuil_deuxieme_revenu)}. The higher-rate ceiling rises to ${h.eur(h.P.cf.plafonds_majore.deux_revenus[0])}: still above it, so ${h.eur(cf(h, 3, true, 30000).cf, 2)}. On €26,000, though, this couple would get ${h.eur(cf(h, 3, true, 26000).cf, 2)}, whereas a one-income couple would only get ${h.eur(cf(h, 3, false, 26000).cf, 2)}.</p>
<h3>A single parent</h3>
<p>A mother raising three children alone on €25,000 gets the two-income couple limits: ${h.eur(cf(h, 3, true, 25000).cf, 2)} a month. If the other parent does not contribute to the children's upkeep, the ${h.a('allocation-soutien-familial', 'family support allowance')} (ASF) may come on top.</p>
<h3>Five children, two incomes, €60,000</h3>
<p>The base ceiling reaches ${h.eur(seuils(h, 5, true).plafond)} for five children, so the family receives ${h.eur(cf(h, 5, true, 60000).cf, 2)}. The amount does not grow with the number of children, only the ceiling does, as the ${h.a('allocations-familiales-4-enfants', 'four children or more')} page explains.</p>

<h2>Just above the ceiling</h2>
<p>Service-public.fr provides for a differential allowance when income is only slightly above the ceiling. Our tool does not compute it: it shows zero as soon as the ceiling is crossed. If your income is a few hundred euros over, the CAF may pay a reduced sum; that is a question for the CAF itself.</p>

<h2>Alongside other benefits</h2>
<p>The family supplement is paid on top of the family's family allowance. For three children and €30,000 on a single salary, the household receives ${h.eur(h.M.allocationsFamiliales({ enfants: 3, majorables: 0, revenus: 30000 }).total, 2)} of family allowance plus ${h.eur(cf(h, 3, false, 30000).cf, 2)} of supplement, ${h.eur(h.M.allocationsFamiliales({ enfants: 3, majorables: 0, revenus: 30000 }).total + cf(h, 3, false, 30000).cf, 2)} a month in all. The allowance itself is detailed on the ${h.a('allocations-familiales-3-enfants', 'three children')} page; the ${h.a('allocation-forfaitaire-20-ans', 'age-20 flat-rate allowance')} page covers the year when the two benefits part ways.</p>
`,
  },
});
