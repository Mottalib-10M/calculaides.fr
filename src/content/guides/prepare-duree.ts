import { defineGuide, type Helpers } from '../../lib/guide-types';

const d = (h: Helpers) => h.P.prepare.duree;
const pl = (h: Helpers, enfants: number, couple: boolean, majoree = false) => h.M.prepare({ mode: 'plein', enfants, couple, majoree });
/** Exemple officiel de la fiche F32485 : 2e enfant, la mère perçoit 21 mois (24 moins le congé postnatal), le père 12 mois. */
const POSTNATAL_EXEMPLE = 3;
const PERE_EXEMPLE = 12;

export default defineGuide({
  id: 'prepare-duree',
  group: 'famille',
  order: 280,
  mini: 'prepareDuree',
  miniHref: 'simulateur-prepare',
  related: ['simulateur-prepare', 'prepare-temps-partiel', 'prepare-majoree', 'allocation-base-paje', 'prime-naissance-jumeaux'],
  sources: ['spPrepare', 'instructionPf2026'],
  fr: {
    slug: 'duree-prepare',
    nav: 'Durée de la PreParE',
    card: 'Six mois, vingt-quatre mois, jusqu’aux 3 ans : la durée de la PreParE selon le nombre d’enfants, le couple et le congé postnatal.',
    title: 'PreParE 2026 : durée du congé parental indemnisé par la CAF',
    description: 'PreParE 2026 : 6 mois par parent avant le 1er anniversaire avec un enfant, 24 mois par parent jusqu’aux 3 ans à partir de deux, moins le congé postnatal.',
    h1: 'Combien de temps dure la PreParE',
    intro: 'Le montant de la PreParE est simple ; sa durée l’est beaucoup moins. Elle dépend du nombre d’enfants, du couple, et des mois de congé maternité déjà indemnisés.',
    resume: (h) => `La PreParE dure ${d(h).un_enfant_mois} mois par parent, dans la limite du premier anniversaire, pour un couple qui a un seul enfant. À partir de deux enfants, chaque parent peut la percevoir jusqu’à ${d(h).deux_enfants_mois} mois, jusqu’au 3e anniversaire du plus jeune. Un parent isolé y a droit jusqu’au premier anniversaire de l’enfant s’il n’en a qu’un, jusqu’aux 3 ans du plus jeune à partir de deux. Pour les couples de deux enfants et plus, la durée est réduite du nombre de mois d’indemnités journalières postnatales : la fiche F32485 donne l’exemple d’une mère qui touche la PreParE 21 mois pour un deuxième enfant et d’un père qui la touche un an. Le droit s’ouvre au premier mois plein de congé parental et cesse le premier jour du mois où les conditions ne sont plus remplies. À taux plein, ${d(h).deux_enfants_mois} mois représentent ${h.eur(pl(h, 2, true).total)} pour un parent, ${d(h).un_enfant_mois} mois ${h.eur(pl(h, 1, true).total)}. La PreParE majorée, réservée aux familles de trois enfants, se limite à ${d(h).majoree_mois} mois par parent. Ces durées sont des maximums ; la CAF fixe le droit réel.`,
    faqs: (h) => [
      { q: 'Avec un premier enfant, combien de mois de PreParE pour chaque parent ?', a: `${d(h).un_enfant_mois} mois chacun, dans la limite du premier anniversaire de l’enfant, selon la fiche F32485 de service-public. Les deux parents peuvent les prendre en même temps ou l’un après l’autre, ce qui couvre jusqu’à douze mois si les périodes se suivent. À taux plein, chaque parent perçoit au plus ${h.eur(pl(h, 1, true).total)} sur la période, soit ${h.eur(h.P.prepare.taux_plein, 2)} par mois.` },
      { q: 'Je suis seule avec mon bébé, combien de temps dure la PreParE ?', a: `Jusqu’au premier anniversaire de l’enfant s’il est votre seul enfant, et jusqu’aux 3 ans du plus jeune si vous en avez deux ou plus. C’est plus long que pour un parent en couple avec un enfant, limité à ${d(h).un_enfant_mois} mois. En arrêt total, le plafond théorique sur la première année est de ${h.eur(pl(h, 1, false).total)} ; en pratique, les mois de congé maternité indemnisés ne s’y ajoutent pas, car les deux ne se cumulent pas, sauf le premier mois pour un seul enfant.` },
      { q: `Pourquoi n’ai-je droit qu’à ${d(h).deux_enfants_mois - POSTNATAL_EXEMPLE} mois de PreParE au lieu de ${d(h).deux_enfants_mois} ?`, a: `Parce que la fiche F32485 réduit la durée du nombre de mois d’indemnités journalières postnatales de maternité, pour les couples ayant au moins deux enfants. C’est l’exemple de service-public : 21 mois pour une mère après un deuxième enfant. À taux plein, ces ${POSTNATAL_EXEMPLE} mois retirés représentent ${h.eur(h.P.prepare.taux_plein * POSTNATAL_EXEMPLE, 2)}. Dans le même exemple, aucune réduction n’est appliquée au père.` },
      { q: 'Je reprends le travail le 24 juin, la PreParE de juin est-elle payée ?', a: `Non. La fiche F32485 prend exactement cet exemple : quand les conditions cessent d’être remplies le 24 juin, la PreParE n’est pas versée pour le mois de juin. Le versement s’arrête au premier jour du mois civil au cours duquel le droit prend fin. Reprendre le 1er juillet plutôt que fin juin préserve donc un mois de ${h.eur(h.P.prepare.taux_plein, 2)} à taux plein.` },
      { q: 'La PreParE démarre-t-elle le jour où commence mon congé parental ?', a: `Non, au premier mois plein de congé parental, selon service-public. Un congé qui commence le 10 du mois n’ouvre pas de PreParE pour ce mois-là. Elle est ensuite versée chaque mois à terme échu : le mois de janvier est payé début février. Mieux vaut caler le début du congé sur le 1er du mois pour ne pas perdre ${h.eur(h.P.prepare.taux_plein, 2)}.` },
      { q: 'En cas de décès de l’enfant, la PreParE s’arrête-t-elle tout de suite ?', a: `Non. La fiche F32485 de service-public prévoit que la prestation est prolongée automatiquement de trois mois après le décès de l’enfant, pour la PreParE comme pour la PreParE majorée. Pour un parent en arrêt total, ces trois mois représentent ${h.eur(h.P.prepare.taux_plein * 3, 2)}. Aucune démarche particulière n’est mentionnée pour obtenir cette prolongation, mais la CAF doit être informée du changement de situation.` },
    ],
    body: (h) => `
<h2>Les durées maximales, situation par situation</h2>
${h.table(['Situation', 'Durée maximale', 'Limite d’âge', 'Total à taux plein'], [
  ['Couple, 1 enfant', `${d(h).un_enfant_mois} mois par parent`, '1er anniversaire', h.eur(pl(h, 1, true).total)],
  ['Couple, 2 enfants et plus', `${d(h).deux_enfants_mois} mois par parent`, '3 ans du plus jeune', h.eur(pl(h, 2, true).total)],
  ['Parent isolé, 1 enfant', 'jusqu’au 1er anniversaire', '1er anniversaire', h.eur(pl(h, 1, false).total)],
  ['Parent isolé, 2 enfants et plus', 'jusqu’aux 3 ans', '3 ans du plus jeune', h.eur(pl(h, 2, false).total)],
  ['PreParE majorée, couple', `${d(h).majoree_mois} mois par parent`, '1er anniversaire', h.eur(pl(h, 3, true, true).total)],
], 'PreParE 2026 après une naissance, avant déduction du congé postnatal', ['l', 'l', 'l', 'r'])}
<p>Ces durées sont celles de la ${h.src('spPrepare', 'fiche F32485 de service-public')}, vérifiée le 1er juin 2026, et les totaux appliquent le taux plein de ${h.eur(h.P.prepare.taux_plein, 2)} revalorisé par l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')}. Pour un parent isolé, le total suppose une PreParE perçue de la naissance à la limite d’âge, ce qui est rarement le cas en pratique.</p>
<!--mini:prepareDuree-->

<h2>Le congé postnatal se déduit</h2>
<p>Pour un couple qui a au moins deux enfants, la durée de ${d(h).deux_enfants_mois} mois est réduite du nombre de mois d’indemnités journalières postnatales de maternité. L’exemple de service-public est parlant : pour un deuxième enfant, la mère peut percevoir la PreParE pendant 21 mois, une fois retiré son congé postnatal ; le père pendant un an, jusqu’aux 3 ans de l’enfant.</p>
${h.table(['Parent', 'Durée', 'Total à taux plein'], [['Mère', `${d(h).deux_enfants_mois - POSTNATAL_EXEMPLE} mois`, h.eur(h.P.prepare.taux_plein * (d(h).deux_enfants_mois - POSTNATAL_EXEMPLE))], ['Père', `${PERE_EXEMPLE} mois`, h.eur(h.P.prepare.taux_plein * PERE_EXEMPLE)], ['Foyer', `${d(h).deux_enfants_mois - POSTNATAL_EXEMPLE + PERE_EXEMPLE} mois`, h.eur(h.P.prepare.taux_plein * (d(h).deux_enfants_mois - POSTNATAL_EXEMPLE + PERE_EXEMPLE))]], 'Exemple de la fiche F32485 : deuxième enfant, parents en arrêt total', ['l', 'r', 'r'])}
<p>Le père, dans cet exemple, ne prend que douze mois parce que la limite des 3 ans de l’enfant arrive. Les mois de chaque parent ne se cumulent pas au-delà de cette borne quand ils se suivent ; pris en même temps, ils sont plafonnés à ${h.eur(h.P.prepare.taux_plein, 2)} par mois pour le couple.</p>

<h2>Le début et la fin, au mois près</h2>
<h3>Le premier mois plein</h3>
<p>Le droit s’ouvre à partir du premier mois plein de congé parental. Un congé qui démarre le 15 avril fait courir la PreParE à partir de mai. La demande elle-même ne peut partir qu’après la fin de l’indemnisation du congé maternité, paternité ou maladie.</p>
<h3>Le dernier mois</h3>
<p>Le versement cesse le premier jour du mois civil au cours duquel les conditions ne sont plus remplies. Une reprise du travail le 24 juin supprime la PreParE de juin entière : c’est l’exemple donné par service-public.</p>
<h3>Le versement</h3>
<p>Il se fait à terme échu : janvier payé début février. Le dernier versement arrive donc un mois après la fin du droit.</p>

<h2>Une condition d’activité avant la durée</h2>
<p>Avant même de compter les mois, il faut ouvrir le droit : au moins 8 trimestres de cotisations vieillesse sur une période qui dépend du nombre d’enfants, deux ans pour un enfant, quatre ans pour deux, cinq ans pour trois et plus. Pour un premier enfant, les trimestres validés grâce au chômage indemnisé ne comptent pas. Si la demande est faite après la naissance, la période de référence est celle qui précède la demande. Un parent qui ne remplit pas cette condition n’a droit à aucun mois, quelle que soit la composition de la famille.</p>

<h2>Un enfant ou deux : l’écart est énorme</h2>
<p>Avec un seul enfant, un couple ne peut cumuler au mieux que ${d(h).un_enfant_mois * 2} mois de PreParE, avant le premier anniversaire. Avec deux enfants, chaque parent dispose de ${d(h).deux_enfants_mois} mois. Pour un parent en arrêt total, l’écart représente ${h.eur(pl(h, 2, true).total - pl(h, 1, true).total)}. Les naissances multiples changent aussi la donne, puisque des jumeaux font passer d’un coup à deux enfants à charge ou plus : voir ${h.a('prime-naissance-jumeaux', 'jumeaux et triplés')}.</p>
<p>Le montant mensuel ne change pas avec la durée ; seul le temps de travail conservé le fait, comme l’explique la page ${h.a('prepare-temps-partiel', 'PreParE à temps partiel')}. Pour trois enfants, la ${h.a('prepare-majoree', 'PreParE majorée')} échange de la durée contre un montant plus élevé. Le ${h.a('simulateur-prepare', 'simulateur de la PreParE')} met tout bout à bout, et l’${h.a('allocation-base-paje', 'allocation de base')} court en parallèle jusqu’aux 3 ans.</p>
`,
  },
  en: {
    slug: 'parental-leave-benefit-length',
    nav: 'PreParE length',
    card: 'Six months, twenty-four months, up to age 3: how long the PreParE lasts by number of children, couple status and post-natal leave.',
    title: 'PreParE 2026: How Long the Parental Leave Benefit Lasts',
    description: 'PreParE 2026 length: 6 months per parent before the first birthday with one child, 24 months per parent up to age 3 from the second, less post-natal leave.',
    h1: 'How long the PreParE lasts',
    intro: 'The PreParE amount is simple; its length is not. It depends on the number of children, on whether you are a couple, and on maternity months already paid.',
    resume: (h) => `The PreParE (prestation partagée d’éducation de l’enfant, the shared child-rearing benefit the CAF family benefits office pays during parental leave) lasts ${d(h).un_enfant_mois} months per parent, within the child’s first year, for a couple with one child. From the second child, each parent can receive it for up to ${d(h).deux_enfants_mois} months, until the youngest child’s third birthday. A single parent is entitled until the first birthday with one child, and until the youngest turns 3 with two or more. For couples with two or more children, the length is cut by the number of months of post-natal maternity daily benefit: sheet F32485 gives the example of a mother receiving the PreParE for 21 months for a second child and a father receiving it for a year. Entitlement starts with the first full month of parental leave and stops on the first day of the month in which the conditions are no longer met. At the full rate, ${d(h).deux_enfants_mois} months are worth ${h.eur(pl(h, 2, true).total)} for one parent, ${d(h).un_enfant_mois} months ${h.eur(pl(h, 1, true).total)}. The higher-rate PreParE, for families with three children, is limited to ${d(h).majoree_mois} months per parent. These are maximums; the CAF sets the real entitlement.`,
    faqs: (h) => [
      { q: 'With a first child, how many months of PreParE does each parent get?', a: `${d(h).un_enfant_mois} months each, within the child’s first year, according to service-public.fr sheet F32485. Parents can take them at the same time or one after the other, which covers up to twelve months if the periods follow on. At the full rate, each parent receives at most ${h.eur(pl(h, 1, true).total)} over the period, ${h.eur(h.P.prepare.taux_plein, 2)} a month.` },
      { q: 'I am on my own with my baby: how long does the PreParE last?', a: `Until the child’s first birthday if it is your only child, and until the youngest turns 3 if you have two or more. That is longer than for a parent in a couple with one child, who is limited to ${d(h).un_enfant_mois} months. With a full stop, the theoretical ceiling over the first year is ${h.eur(pl(h, 1, false).total)}; in practice, paid maternity leave months come out of it, since the two cannot be combined, except in the first month for an only child.` },
      { q: `Why am I only entitled to ${d(h).deux_enfants_mois - POSTNATAL_EXEMPLE} months of PreParE instead of ${d(h).deux_enfants_mois}?`, a: `Because sheet F32485 cuts the length by the number of months of post-natal maternity daily benefit, for couples with at least two children. That is service-public.fr’s own example: 21 months for a mother after a second child. At the full rate, the ${POSTNATAL_EXEMPLE} months removed are worth ${h.eur(h.P.prepare.taux_plein * POSTNATAL_EXEMPLE, 2)}. In the same example, no reduction is applied to the father.` },
      { q: 'I go back to work on 24 June: is the PreParE for June paid?', a: `No. Sheet F32485 uses exactly that example: when the conditions stop being met on 24 June, no PreParE is paid for June. Payment stops on the first day of the calendar month in which entitlement ends. Returning on 1 July rather than late June therefore keeps a month of ${h.eur(h.P.prepare.taux_plein, 2)} at the full rate.` },
      { q: 'Does the PreParE start on the day my parental leave begins?', a: `No, from the first full month of parental leave, according to service-public.fr. Leave starting on the 10th of a month brings no PreParE for that month. It is then paid monthly in arrears: January is paid at the start of February. Starting leave on the 1st of a month avoids losing ${h.eur(h.P.prepare.taux_plein, 2)}.` },
      { q: 'If the child dies, does the PreParE stop straight away?', a: `No. Service-public.fr sheet F32485 provides that the benefit continues automatically for three months after the child’s death, for both the standard and the higher-rate PreParE. For a parent who had stopped work, those three months are worth ${h.eur(h.P.prepare.taux_plein * 3, 2)}. No special step is mentioned to obtain the extension, but the CAF must be told about the change of situation.` },
    ],
    body: (h) => `
<h2>Maximum lengths, case by case</h2>
${h.table(['Situation', 'Maximum length', 'Age limit', 'Total at full rate'], [
  ['Couple, 1 child', `${d(h).un_enfant_mois} months per parent`, 'first birthday', h.eur(pl(h, 1, true).total)],
  ['Couple, 2 or more children', `${d(h).deux_enfants_mois} months per parent`, 'youngest turns 3', h.eur(pl(h, 2, true).total)],
  ['Single parent, 1 child', 'until the first birthday', 'first birthday', h.eur(pl(h, 1, false).total)],
  ['Single parent, 2 or more children', 'until age 3', 'youngest turns 3', h.eur(pl(h, 2, false).total)],
  ['Higher-rate PreParE, couple', `${d(h).majoree_mois} months per parent`, 'first birthday', h.eur(pl(h, 3, true, true).total)],
], 'PreParE 2026 after a birth, before deducting post-natal leave', ['l', 'l', 'l', 'r'])}
<p>These lengths come from ${h.src('spPrepare', 'service-public.fr sheet F32485')}, checked on 1 June 2026, and the totals apply the full rate of ${h.eur(h.P.prepare.taux_plein, 2)} uprated by the ${h.src('instructionPf2026', 'instruction of 20 March 2026')}. For a single parent, the total assumes the PreParE is received from birth to the age limit, which is rarely the case in practice.</p>
<!--mini:prepareDuree-->

<h2>Post-natal leave is deducted</h2>
<p>For a couple with at least two children, the ${d(h).deux_enfants_mois}-month length is reduced by the number of months of post-natal maternity daily benefit. Service-public.fr’s example says it all: for a second child, the mother can receive the PreParE for 21 months once her post-natal leave is taken off; the father for one year, until the child turns 3.</p>
${h.table(['Parent', 'Length', 'Total at full rate'], [['Mother', `${d(h).deux_enfants_mois - POSTNATAL_EXEMPLE} months`, h.eur(h.P.prepare.taux_plein * (d(h).deux_enfants_mois - POSTNATAL_EXEMPLE))], ['Father', `${PERE_EXEMPLE} months`, h.eur(h.P.prepare.taux_plein * PERE_EXEMPLE)], ['Household', `${d(h).deux_enfants_mois - POSTNATAL_EXEMPLE + PERE_EXEMPLE} months`, h.eur(h.P.prepare.taux_plein * (d(h).deux_enfants_mois - POSTNATAL_EXEMPLE + PERE_EXEMPLE))]], 'Sheet F32485 example: second child, both parents stop work', ['l', 'r', 'r'])}
<p>In this example the father takes only twelve months because the child’s third birthday arrives. Each parent’s months cannot run past that limit when taken one after the other; taken at the same time, they are capped at ${h.eur(h.P.prepare.taux_plein, 2)} a month for the couple.</p>

<h2>Start and end, to the month</h2>
<h3>The first full month</h3>
<p>Entitlement starts with the first full month of parental leave. Leave beginning on 15 April means PreParE from May. The claim itself can only be sent once maternity, paternity or sick pay has ended.</p>
<h3>The last month</h3>
<p>Payment stops on the first day of the calendar month in which the conditions are no longer met. Returning to work on 24 June wipes out the whole of June’s PreParE: that is the example service-public.fr gives.</p>
<h3>Payment</h3>
<p>It is paid in arrears: January at the start of February. The last payment therefore arrives a month after entitlement ends.</p>

<h2>A work-history condition comes first</h2>
<p>Before counting months, entitlement has to open: at least 8 quarters of pension contributions over a period that depends on the number of children, two years for one child, four for two, five for three or more. For a first child, quarters credited through paid unemployment do not count. If you claim after the birth, the reference period is the one before the claim. A parent who does not meet this condition gets no months at all, whatever the size of the family.</p>

<h2>One child or two: a huge difference</h2>
<p>With one child, a couple can at best put together ${d(h).un_enfant_mois * 2} months of PreParE, all before the first birthday. With two children, each parent has ${d(h).deux_enfants_mois} months. For one parent with a full stop, the gap is worth ${h.eur(pl(h, 2, true).total - pl(h, 1, true).total)}. Multiple births change the picture too, since twins take a household straight to two or more dependent children: see ${h.a('prime-naissance-jumeaux', 'twins and triplets')}.</p>
<p>The monthly amount does not change with length; only the working time you keep does, as the ${h.a('prepare-temps-partiel', 'part-time PreParE')} page explains. For three children, the ${h.a('prepare-majoree', 'higher-rate PreParE')} trades length for a bigger monthly payment. The ${h.a('simulateur-prepare', 'PreParE calculator')} puts it all together, and the ${h.a('allocation-base-paje', 'basic allowance')} runs alongside until age 3.</p>
`,
  },
});
