import { defineGuide, type Helpers } from '../../lib/guide-types';

const m = (h: Helpers) => h.P.ars.montants;
/** Montant plein d'une fratrie, sous le plafond (revenus nuls pour isoler l'effet de l'âge). */
const fratrie = (h: Helpers, a: number, b: number, c: number) => h.M.ars({ c6_10: a, c11_14: b, c15_18: c, revenus: 0 }).plein;
/** Cumul sur une scolarité complète à barème constant : 5 rentrées de 6 à 10 ans, 4 de 11 à 14, 4 de 15 à 18. */
const parcours = (h: Helpers) => fratrie(h, 5, 4, 4);

export default defineGuide({
  id: 'ars-montant-age',
  group: 'famille',
  order: 120,
  mini: 'arsMontantAge',
  miniHref: 'simulateur-ars',
  related: ['simulateur-ars', 'ars-plafond', 'ars-lyceen-apprenti', 'ars-differentielle', 'allocations-familiales-2-enfants'],
  sources: ['spArs', 'instructionPf2026'],
  fr: {
    slug: 'montant-ars-par-age',
    nav: 'Montant de l’ARS par âge',
    card: 'Les trois montants de l’ARS 2026 selon l’âge, et ce que reçoit une fratrie de deux, trois ou quatre enfants.',
    title: 'Allocation de rentrée scolaire 2026 : montant selon l’âge',
    description: 'Montant de l’allocation de rentrée scolaire 2026 : 426,87 € de 6 à 10 ans, 450,41 € de 11 à 14 ans, 466,02 € de 15 à 18 ans. Totaux par fratrie, nets de CRDS.',
    h1: 'Combien rapporte l’ARS selon l’âge de chaque enfant',
    intro: 'L’ARS ne dépend pas de la classe mais de l’âge : trois tranches, trois montants, et un total qui s’additionne enfant par enfant.',
    resume: (h) => `À la rentrée 2026, l’allocation de rentrée scolaire verse ${h.eur(m(h)['6_10'], 2)} par enfant de 6 à 10 ans, ${h.eur(m(h)['11_14'], 2)} par enfant de 11 à 14 ans et ${h.eur(m(h)['15_18'], 2)} par jeune de 15 à 18 ans. Ces montants sont nets : la CRDS est déjà retirée. Le passage d’une tranche à l’autre rapporte ${h.eur(m(h)['11_14'] - m(h)['6_10'], 2)} puis ${h.eur(m(h)['15_18'] - m(h)['11_14'], 2)} de plus ; l’écart entre le plus jeune et le plus âgé reste modeste. Les sommes s’additionnent : une fratrie de 8, 12 et 16 ans reçoit ${h.eur(fratrie(h, 1, 1, 1), 2)} en une fois, si les revenus 2024 du foyer restent sous le plafond. Selon la fiche de service-public, c’est l’âge qui fixe la tranche, pas le niveau scolaire : un élève de 11 ans encore en CM2 touche le montant du collège. L’enfant doit être né entre le ${h.date(h.P.ars.naissance_min)} et le ${h.date(h.P.ars.naissance_max)}. Chiffres indicatifs, à confirmer par la CAF.`,
    faqs: (h) => [
      { q: 'Mon fils a 11 ans mais il est encore en CM2, quel montant d’ARS ?', a: `Celui des 11 à 14 ans, soit ${h.eur(m(h)['11_14'], 2)} pour la rentrée 2026. En métropole, la fiche F1878 de service-public fait varier le montant selon l’âge de l’enfant, sans regarder la classe. Un redoublant ou un élève en avance ne change donc pas de tranche. Seul Mayotte fixe ses montants selon le niveau, primaire, collège ou lycée.` },
      { q: 'Mon enfant de 5 ans entre au CP, a-t-il droit à l’ARS ?', a: `Oui, s’il est inscrit en CP et que vous transmettez le certificat de scolarité à la CAF : service-public le prévoit pour l’enfant de moins de 6 ans scolarisé en élémentaire. Il reçoit alors le montant de la première tranche, ${h.eur(m(h)['6_10'], 2)}, sous réserve du plafond de ressources. Un enfant de 5 ans encore en grande section de maternelle n’y a pas droit.` },
      { q: 'Combien touche une famille avec quatre enfants de 6, 9, 13 et 17 ans ?', a: `${h.eur(fratrie(h, 2, 1, 1), 2)} à la rentrée 2026, si ses revenus 2024 ne dépassent pas ${h.eur(h.M.plafondArs(4))}, plafond d’une famille de quatre enfants. Le détail : deux fois ${h.eur(m(h)['6_10'], 2)}, une fois ${h.eur(m(h)['11_14'], 2)} et une fois ${h.eur(m(h)['15_18'], 2)}. Chaque enfant compte pour son propre montant, sans majoration de rang comme pour les allocations familiales.` },
      { q: 'Les montants de l’ARS sont-ils les mêmes pour une fille et un garçon, un public et un privé ?', a: `Oui. Le montant ne dépend que de la tranche d’âge : ${h.eur(m(h)['6_10'], 2)}, ${h.eur(m(h)['11_14'], 2)} ou ${h.eur(m(h)['15_18'], 2)} en 2026. La fiche F1878 ne pose qu’une condition de scolarité : l’enfant est scolarisé ou inscrit au Cned. Le type d’établissement n’entre pas en ligne de compte. Seule l’instruction en famille ferme le droit, quels que soient les revenus du foyer.` },
      { q: 'L’ARS est-elle versée en une fois ou en plusieurs mensualités ?', a: `En une fois, chaque été, pour tous les enfants qui remplissent les conditions. En 2026, service-public indique un versement à partir du ${h.date('2026-08-18')} en métropole pour les 6 à 16 ans et pour les 16 à 18 ans déclarés scolarisés ou apprentis. Une famille de deux enfants de 7 et 14 ans a donc reçu ${h.eur(fratrie(h, 1, 1, 0), 2)} d’un seul coup.` },
      { q: 'Mon enfant est placé à l’aide sociale à l’enfance, qui touche son ARS ?', a: `Ni la famille ni le service d’accueil, si le placement a été décidé par un juge. Selon la fiche F1878 de service-public, l’allocation, par exemple ${h.eur(m(h)['15_18'], 2)} pour un adolescent de 15 ans, est alors conservée sur un compte bloqué à la Caisse des dépôts et consignations. Elle est versée au jeune lui-même, à sa demande, quand il devient majeur, pour l’aider à prendre son autonomie.` },
    ],
    body: (h) => `
<h2>Trois tranches, trois montants</h2>
${h.table(['Tranche d’âge', 'Montant 2026', 'Écart avec la tranche précédente'], [['6 à 10 ans', h.eur(m(h)['6_10'], 2), ''], ['11 à 14 ans', h.eur(m(h)['11_14'], 2), h.eur(m(h)['11_14'] - m(h)['6_10'], 2)], ['15 à 18 ans', h.eur(m(h)['15_18'], 2), h.eur(m(h)['15_18'] - m(h)['11_14'], 2)]], 'Allocation de rentrée scolaire, rentrée 2026, montants nets de CRDS', ['l', 'r', 'r'])}
<p>Ces chiffres sont ceux de la ${h.src('spArs', 'fiche F1878 de service-public')}. Ils découlent de la revalorisation du 1er avril 2026, fixée par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')} sur la base mensuelle de calcul des allocations familiales, et valent pour toute la rentrée. Une revalorisation ultérieure ne touche que la rentrée suivante.</p>
<p>La progression est faible : entre un enfant de 6 ans et un lycéen de 17 ans, l’écart ne dépasse pas ${h.eur(m(h)['15_18'] - m(h)['6_10'], 2)}. Les besoins d’un adolescent coûtent pourtant bien plus, mais l’ARS n’a pas été conçue pour suivre une liste de fournitures : c’est une somme forfaitaire.</p>
<!--mini:arsMontantAge-->

<h2>Ce que reçoit une fratrie</h2>
<p>Chaque enfant apporte son montant, sans rang ni dégressivité. C’est une différence nette avec les ${h.a('allocations-familiales-2-enfants', 'allocations familiales')}, où le premier enfant ne rapporte rien seul et où le montant dépend du nombre d’enfants. Pour l’ARS, un aîné de 15 ans vaut ${h.eur(m(h)['15_18'], 2)}, qu’il soit seul ou entouré de cinq frères et sœurs.</p>
${h.table(['Fratrie', 'Total ARS 2026'], [['Un enfant de 7 ans', h.eur(fratrie(h, 1, 0, 0), 2)], ['Jumeaux de 9 ans', h.eur(fratrie(h, 2, 0, 0), 2)], ['8 et 13 ans', h.eur(fratrie(h, 1, 1, 0), 2)], ['12 et 16 ans', h.eur(fratrie(h, 0, 1, 1), 2)], ['8, 12 et 16 ans', h.eur(fratrie(h, 1, 1, 1), 2)], ['6, 9, 13 et 17 ans', h.eur(fratrie(h, 2, 1, 1), 2)]], 'Montants pleins, sous réserve du plafond de ressources du foyer', ['l', 'r'])}
<p>Ces totaux supposent des revenus 2024 sous le plafond. Une famille juste au-dessus verra le total réduit par le ${h.a('ars-differentielle', 'calcul différentiel')}, qui s’applique à la somme de tous les enfants, pas à chacun séparément.</p>

<h2>Le changement de tranche, une année sur deux ou trois</h2>
<p>Un enfant ne reste pas dans la même tranche toute sa scolarité. Celui qui touche ${h.eur(m(h)['6_10'], 2)} à 10 ans passera au montant suivant l’année où il aura 11 ans, même s’il n’entre au collège que l’année d’après. Vu sur l’ensemble du parcours, à barème inchangé, un enfant qui touche l’ARS de 6 à 18 ans cumule cinq rentrées dans la première tranche, quatre dans la deuxième et quatre dans la troisième : environ ${h.eur(parcours(h))} au total. Ce chiffre est un ordre de grandeur, les montants étant revalorisés chaque année.</p>

<h2>Les âges limites, au jour près</h2>
<h3>Le plus jeune</h3>
<p>Pour la rentrée 2026, l’enfant doit être né au plus tard le ${h.date(h.P.ars.naissance_max)}. Un enfant né en janvier 2021 n’y a pas droit, sauf s’il entre déjà au CP : dans ce cas, la famille envoie le certificat de scolarité remis par l’école. Sans ce document, la CAF ne peut pas savoir que l’enfant a sauté la grande section.</p>
<h3>Le plus âgé</h3>
<p>À l’autre bout, la date de naissance limite est le ${h.date(h.P.ars.naissance_min)}. Le jeune doit encore être lycéen, inscrit au Cned ou apprenti avec un salaire sous le plafond. Pour les 16 à 18 ans, la famille déclare sa situation sur le site de la CAF à partir de la mi-juillet ; la page ${h.a('ars-lyceen-apprenti', 'lycéens et apprentis')} explique cette démarche et le plafond de salaire.</p>

<h2>Un montant identique partout en métropole</h2>
<p>Paris, Lille ou un village de la Creuse : le barème est le même. Le régime agricole applique aussi ces trois montants, la démarche passant alors par la MSA au lieu de la CAF. Les départements d’outre-mer suivent les règles générales, avec une date de versement propre à La Réunion, le ${h.date('2026-08-04')} en 2026 selon service-public. Mayotte fait exception : elle verse des montants légèrement différents, fixés selon le niveau scolaire et non selon l’âge, avec ses propres plafonds. Les chiffres de cette page ne valent donc pas pour une famille installée à Mayotte.</p>

<h2>Le plafond, toujours en arrière-plan</h2>
<p>Les montants du tableau ne s’appliquent que si le revenu net catégoriel 2024 du foyer ne dépasse pas ${h.eur(h.M.plafondArs(1))} pour un enfant à charge, ${h.eur(h.M.plafondArs(2))} pour deux ou ${h.eur(h.M.plafondArs(3))} pour trois. La page ${h.a('ars-plafond', 'plafond de l’ARS')} détaille ce test. Le ${h.a('simulateur-ars', 'simulateur de l’ARS')} réunit les deux : âges et revenus.</p>
`,
  },
  en: {
    slug: 'ars-amount-by-age',
    nav: 'Allowance amount by age',
    card: 'The three 2026 back-to-school allowance amounts by age, and what families of two, three or four children receive.',
    title: 'Back-to-School Allowance 2026: Amount by Age of Child',
    description: 'Back-to-school allowance 2026 amounts: €426.87 for ages 6 to 10, €450.41 for 11 to 14, €466.02 for 15 to 18. Totals for siblings, all net of the CRDS levy.',
    h1: 'How much the back-to-school allowance pays at each age',
    intro: 'The allowance depends on age, not school year: three age bands, three amounts, and a total that adds up child by child.',
    resume: (h) => `For the 2026 school year, the allocation de rentrée scolaire (ARS, France’s back-to-school allowance, paid by the CAF family benefits office) pays ${h.eur(m(h)['6_10'], 2)} per child aged 6 to 10, ${h.eur(m(h)['11_14'], 2)} per child aged 11 to 14 and ${h.eur(m(h)['15_18'], 2)} per young person aged 15 to 18. These are net figures: the CRDS social levy has already been taken off. Moving up a band adds ${h.eur(m(h)['11_14'] - m(h)['6_10'], 2)}, then ${h.eur(m(h)['15_18'] - m(h)['11_14'], 2)}, so the gap between youngest and oldest is small. Amounts add up: children of 8, 12 and 16 bring ${h.eur(fratrie(h, 1, 1, 1), 2)} in one payment, provided the household’s 2024 income is under the ceiling. Under the service-public.fr sheet, age sets the band, not the class: an 11-year-old still in the last year of primary school gets the secondary-school amount. The child must be born between ${h.date(h.P.ars.naissance_min)} and ${h.date(h.P.ars.naissance_max)}. Figures are indicative; the CAF confirms entitlement.`,
    faqs: (h) => [
      { q: 'My son is 11 but still in primary school: which allowance amount applies?', a: `The 11 to 14 band, ${h.eur(m(h)['11_14'], 2)} for autumn 2026. In mainland France, service-public.fr sheet F1878 sets the amount by the child’s age without looking at the class. A child who repeated a year, or one who skipped ahead, stays in the band for their age. Only Mayotte bases its amounts on the school level: primary, collège or lycée.` },
      { q: 'My 5-year-old is starting CP: can we get the back-to-school allowance?', a: `Yes, if the child is enrolled in CP (the first year of primary school) and you send the CAF the school certificate: service-public.fr provides for children under 6 in primary school. The child then gets the first-band amount, ${h.eur(m(h)['6_10'], 2)}, subject to the income ceiling. A 5-year-old still in the last year of nursery school (grande section) does not qualify.` },
      { q: 'What does a family with children aged 6, 9, 13 and 17 receive?', a: `${h.eur(fratrie(h, 2, 1, 1), 2)} for autumn 2026, if 2024 income does not exceed ${h.eur(h.M.plafondArs(4))}, the ceiling for a four-child family. The breakdown: twice ${h.eur(m(h)['6_10'], 2)}, once ${h.eur(m(h)['11_14'], 2)} and once ${h.eur(m(h)['15_18'], 2)}. Each child brings their own amount, with no ranking bonus as with family allowances.` },
      { q: 'Is the allowance the same in a private school as in a state school?', a: `Yes. Only the age band matters: ${h.eur(m(h)['6_10'], 2)}, ${h.eur(m(h)['11_14'], 2)} or ${h.eur(m(h)['15_18'], 2)} in 2026. Sheet F1878 sets a single schooling condition: the child attends a school or is enrolled with Cned. The type of school plays no part. Only home education (instruction en famille) rules the allowance out, whatever the household income.` },
      { q: 'Is the back-to-school allowance paid in one go or in instalments?', a: `In one go, each summer, for every child who qualifies. In 2026, service-public.fr gives payment from ${h.date('2026-08-18')} in mainland France for children aged 6 to 16 and for 16 to 18-year-olds declared as pupils or apprentices. A family with children of 7 and 14 therefore received ${h.eur(fratrie(h, 1, 1, 0), 2)} in a single transfer.` },
      { q: 'My child is in care: who receives the back-to-school allowance?', a: `Neither the family nor the care service, when a judge ordered the placement. Under service-public.fr sheet F1878, the allowance, for instance ${h.eur(m(h)['15_18'], 2)} for a 15-year-old, is kept in a blocked account at the Caisse des dépôts (the state savings institution). It is paid to the young person, at their request, once they reach 18, to help them become independent.` },
    ],
    body: (h) => `
<h2>Three bands, three amounts</h2>
${h.table(['Age band', '2026 amount', 'Increase on the band below'], [['6 to 10', h.eur(m(h)['6_10'], 2), ''], ['11 to 14', h.eur(m(h)['11_14'], 2), h.eur(m(h)['11_14'] - m(h)['6_10'], 2)], ['15 to 18', h.eur(m(h)['15_18'], 2), h.eur(m(h)['15_18'] - m(h)['11_14'], 2)]], 'Back-to-school allowance, autumn 2026, amounts net of CRDS', ['l', 'r', 'r'])}
<p>These figures come from ${h.src('spArs', 'service-public.fr sheet F1878')}. They follow the 1 April 2026 uprating set by the ${h.src('instructionPf2026', 'instruction of 20 March 2026')} on the monthly base used for family benefits, and they hold for the whole school year. A later uprating only affects the following September.</p>
<p>The steps are small: between a 6-year-old and a 17-year-old the difference is no more than ${h.eur(m(h)['15_18'] - m(h)['6_10'], 2)}. Teenagers cost far more to equip, but the allowance was never meant to track a shopping list. It is a flat sum.</p>
<!--mini:arsMontantAge-->

<h2>What brothers and sisters add up to</h2>
<p>Each child brings their own amount, with no ranking and no tapering. That is a clear contrast with ${h.a('allocations-familiales-2-enfants', 'family allowances')}, where a single child brings nothing and the rate depends on how many children you have. For this allowance, a 15-year-old is worth ${h.eur(m(h)['15_18'], 2)}, alone or with five siblings.</p>
${h.table(['Children', 'Total allowance 2026'], [['One child aged 7', h.eur(fratrie(h, 1, 0, 0), 2)], ['Twins aged 9', h.eur(fratrie(h, 2, 0, 0), 2)], ['8 and 13', h.eur(fratrie(h, 1, 1, 0), 2)], ['12 and 16', h.eur(fratrie(h, 0, 1, 1), 2)], ['8, 12 and 16', h.eur(fratrie(h, 1, 1, 1), 2)], ['6, 9, 13 and 17', h.eur(fratrie(h, 2, 1, 1), 2)]], 'Full amounts, subject to the household income ceiling', ['l', 'r'])}
<p>These totals assume 2024 income below the ceiling. A family just above it sees the total cut by the ${h.a('ars-differentielle', 'differential calculation')}, which applies to the sum for all the children, not to each child separately.</p>

<h2>Moving up a band every few years</h2>
<p>No child stays in one band for their whole schooling. A child receiving ${h.eur(m(h)['6_10'], 2)} at 10 moves to the next amount in the year they turn 11, even if they only start secondary school a year later. Over a full school career, on an unchanged scale, a child who receives the allowance from 6 to 18 spends five years in the first band, four in the second and four in the third: about ${h.eur(parcours(h))} in all. That is an order of magnitude, since amounts are uprated each year.</p>

<h2>The age limits, to the day</h2>
<h3>The youngest</h3>
<p>For autumn 2026, the child must be born no later than ${h.date(h.P.ars.naissance_max)}. A child born in January 2021 does not qualify unless already starting CP, in which case the family sends the certificate issued by the school. Without it, the CAF has no way of knowing the child has skipped the last year of nursery school.</p>
<h3>The oldest</h3>
<p>At the other end, the cut-off birth date is ${h.date(h.P.ars.naissance_min)}. The young person must still be at school, enrolled with Cned (the state distance-learning service) or an apprentice earning below the pay ceiling. For 16 to 18-year-olds, the family declares the situation on the CAF website from mid-July; the page on ${h.a('ars-lyceen-apprenti', 'older pupils and apprentices')} covers that step and the pay limit.</p>

<h2>The same amount everywhere in mainland France</h2>
<p>Paris, Lille or a village in the Creuse: the scale does not change. The farming social security scheme, the MSA, pays the same three amounts; families covered by it simply deal with the MSA instead of the CAF. The overseas departments follow the general rules, with a payment date of their own in Réunion, ${h.date('2026-08-04')} in 2026 according to service-public.fr. Mayotte is the exception: it pays slightly different amounts, set by school level rather than age, with its own ceilings. The figures on this page therefore do not apply to a family living in Mayotte.</p>

<h2>The ceiling is always in the background</h2>
<p>The amounts above only apply if the household’s 2024 net taxable income (revenu net catégoriel) is no more than ${h.eur(h.M.plafondArs(1))} with one dependent child, ${h.eur(h.M.plafondArs(2))} with two or ${h.eur(h.M.plafondArs(3))} with three. The ${h.a('ars-plafond', 'income ceiling')} page explains that test, and the ${h.a('simulateur-ars', 'back-to-school allowance calculator')} brings ages and income together.</p>
`,
  },
});
