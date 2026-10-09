import { defineGuide, type Helpers } from '../../lib/guide-types';

const R = (h: Helpers) => h.P.prepare;
const maj = (h: Helpers, couple = true) => h.M.prepare({ mode: 'plein', enfants: 3, couple, majoree: true });
const std = (h: Helpers, couple = true) => h.M.prepare({ mode: 'plein', enfants: 3, couple });
/** Nombre de mois de congé à partir duquel la PreParE classique rapporte plus que la majorée (couple, aucune déduction). */
const bascule = (h: Helpers) => Math.ceil(maj(h).total / R(h).taux_plein);

export default defineGuide({
  id: 'prepare-majoree',
  group: 'famille',
  order: 290,
  mini: 'prepareMajoree',
  miniHref: 'simulateur-prepare',
  related: ['simulateur-prepare', 'prepare-duree', 'prepare-temps-partiel', 'complement-familial', 'allocations-familiales-3-enfants'],
  sources: ['spPrepare', 'instructionPf2026'],
  fr: {
    slug: 'prepare-majoree',
    nav: 'PreParE majorée',
    card: 'Trois enfants et un arrêt total : 751,40 € par mois pendant huit mois, ou la PreParE classique plus longue. Le calcul pour choisir.',
    title: 'PreParE 2026 : PreParE majorée à 751,40 €, faut-il choisir ?',
    description: 'PreParE majorée 2026 : 751,40 € par mois pendant 8 mois par parent au plus, dès 3 enfants, en arrêt total. Choix définitif face aux 459,70 € de la classique.',
    h1: 'PreParE majorée : plus par mois, moins longtemps',
    intro: 'Les familles de trois enfants ont le choix entre deux PreParE. La majorée paie davantage chaque mois, mais elle s’arrête vite, et le choix ne se refait pas.',
    resume: (h) => `La PreParE majorée verse ${h.eur(R(h).majoree, 2)} par mois en 2026, contre ${h.eur(R(h).taux_plein, 2)} pour la PreParE classique en arrêt total. Elle est réservée aux parents qui ont au moins trois enfants à charge, qui cessent complètement de travailler et qui ont validé 8 trimestres de cotisations vieillesse au cours des cinq dernières années. Le temps partiel est exclu. En couple, chaque parent peut la percevoir ${R(h).duree.majoree_mois} mois au plus, dans la limite du premier anniversaire du plus jeune : ${h.eur(maj(h).total)} au maximum par parent. La PreParE classique, elle, dure jusqu’à ${R(h).duree.deux_enfants_mois} mois par parent pour une famille de trois enfants et peut atteindre ${h.eur(std(h).total)}. Pour un parent sans congé maternité à déduire, le calcul est simple : la majorée l’emporte si le congé dure moins de ${bascule(h)} mois, la classique au-delà. La fiche F32485 de service-public précise que le choix entre les deux est définitif, et que deux PreParE majorées perçues le même mois par un couple sont plafonnées à ${h.eur(R(h).majoree, 2)}. Estimations à confirmer par la CAF.`,
    faqs: (h) => [
      { q: 'Avec trois enfants, vaut-il mieux prendre la PreParE majorée ou la classique ?', a: `Tout dépend de la durée du congé. La majorée rapporte ${h.eur(R(h).majoree - R(h).taux_plein, 2)} de plus par mois, mais s’arrête au bout de ${R(h).duree.majoree_mois} mois par parent en couple, soit ${h.eur(maj(h).total)} au plus. La classique peut durer ${R(h).duree.deux_enfants_mois} mois. Sans congé maternité à déduire, au-delà de ${bascule(h) - 1} mois d’arrêt, la PreParE classique rapporte davantage. Le choix est définitif selon la fiche F32485.` },
      { q: 'Peut-on toucher la PreParE majorée en travaillant à mi-temps ?', a: `Non. Service-public est explicite : il n’est pas possible de percevoir la PreParE majorée en cas de travail à temps partiel. Un salarié du privé doit prendre un congé parental à temps plein, un agent public un congé parental. Un parent qui veut garder un mi-temps se tourne vers la PreParE classique, ${h.eur(R(h).partiel_50, 2)} par mois en 2026.` },
      { q: 'Mon congé maternité réduit-il la durée de la PreParE majorée ?', a: `Oui. La fiche F32485 indique que la durée du droit est réduite du nombre de mois indemnisés au titre du congé maternité ou d’adoption. En couple, les ${R(h).duree.majoree_mois} mois de la mère deviennent ${R(h).duree.majoree_mois - 2} s’il faut en retirer deux, soit ${h.eur(R(h).majoree * (R(h).duree.majoree_mois - 2), 2)}. Le père, s’il prend aussi la majorée, garde ses propres mois dans la limite du premier anniversaire.` },
      { q: 'Je suis seule avec trois enfants, combien de temps dure la PreParE majorée ?', a: `Jusqu’au premier anniversaire du plus jeune, moins les mois de congé maternité indemnisés. Sans déduction, cela représente au plus ${h.eur(maj(h, false).total)} à ${h.eur(R(h).majoree, 2)} par mois. La PreParE classique, pour un parent isolé de trois enfants, court jusqu’aux 3 ans du plus jeune, soit ${h.eur(std(h, false).total)} au plus à taux plein. L’écart de durée est encore plus marqué qu’en couple.` },
      { q: 'Les deux parents peuvent-ils prendre la PreParE majorée le même mois ?', a: `Oui, mais le total des deux droits est limité à ${h.eur(R(h).majoree, 2)} pour le mois concerné, selon service-public. Prendre la majorée à deux en même temps n’apporte donc rien de plus qu’un seul parent, ce mois-là. En revanche, deux périodes successives de ${R(h).duree.majoree_mois} mois ne tiennent pas avant le premier anniversaire : les parents doivent se répartir l’année.` },
      { q: 'J’ai choisi la PreParE majorée, puis-je revenir à la classique si je prolonge mon congé ?', a: `Non. La fiche F32485 de service-public le dit sans détour : le choix entre la PreParE et la PreParE majorée est définitif. Un parent qui a perçu ${h.eur(R(h).majoree, 2)} pendant quelques mois ne peut pas basculer ensuite sur ${h.eur(R(h).taux_plein, 2)} jusqu’aux 3 ans de l’enfant. Si la durée du congé est incertaine, la prudence penche vers la formule classique.` },
    ],
    body: (h) => `
<h2>Les deux formules côte à côte</h2>
${h.table(['', 'PreParE majorée', 'PreParE classique, arrêt total'], [
  ['Montant mensuel', h.eur(R(h).majoree, 2), h.eur(R(h).taux_plein, 2)],
  ['Durée par parent, couple', `${R(h).duree.majoree_mois} mois`, `${R(h).duree.deux_enfants_mois} mois`],
  ['Limite d’âge du plus jeune', '1er anniversaire', '3 ans'],
  ['Total maximal par parent, couple', h.eur(maj(h).total), h.eur(std(h).total)],
  ['Temps partiel possible', 'non', 'oui (autre montant)'],
], 'Famille de trois enfants, barème 2026, avant déduction du congé maternité', ['l', 'r', 'r'])}
<p>Les montants viennent de la ${h.src('spPrepare', 'fiche F32485 de service-public')}, vérifiée le 1er juin 2026, et de l’${h.src('instructionPf2026', 'instruction du 20 mars 2026')} qui les a revalorisés au 1er avril. La majorée paie ${h.pct((R(h).majoree - R(h).taux_plein) / R(h).taux_plein, 0)} de plus par mois ; la classique dure trois fois plus longtemps en couple.</p>
<!--mini:prepareMajoree-->

<h2>Le seuil de bascule</h2>
<p>Pour un parent en couple, la majorée rapporte au plus ${h.eur(maj(h).total)}. La classique atteint ce même total après ${bascule(h)} mois d’arrêt à ${h.eur(R(h).taux_plein, 2)}. La règle de décision en découle :</p>
${h.table(['Durée du congé envisagée', 'Majorée', 'Classique', 'Plus avantageuse'], [6, 8, 12, bascule(h), 18, 24].map((m) => { const a = R(h).majoree * Math.min(m, R(h).duree.majoree_mois); const b = R(h).taux_plein * Math.min(m, R(h).duree.deux_enfants_mois); return [`${m} mois`, h.eur(a), h.eur(b), a >= b ? 'majorée' : 'classique']; }), 'Un parent en couple, trois enfants, arrêt total (estimation)', ['l', 'r', 'r', 'l'])}
<p>Ce tableau ne retire pas les mois de congé maternité, qui réduisent les deux formules. Pour la mère, avec deux mois à déduire, la majorée tombe à ${h.eur(R(h).majoree * (R(h).duree.majoree_mois - 2))} et la classique à ${h.eur(R(h).taux_plein * (R(h).duree.deux_enfants_mois - 2))}. Le calcul fin pour votre cas se fait avec le mini-simulateur ci-dessus.</p>

<h2>Pourquoi le congé maternité pèse plus lourd sur la majorée</h2>
<p>Deux mois de congé maternité indemnisés se retirent des deux formules. Mais ils n’ont pas le même poids. Sur la majorée, ils coûtent ${h.eur(R(h).majoree * 2, 2)}, soit ${h.pct(2 / R(h).duree.majoree_mois, 0)} du droit total d’un parent en couple. Sur la classique, ils coûtent ${h.eur(R(h).taux_plein * 2, 2)}, à peine ${h.pct(2 / R(h).duree.deux_enfants_mois, 0)} des ${R(h).duree.deux_enfants_mois} mois. Pour la mère, la majorée perd donc beaucoup de son intérêt ; pour le père, qui n’a pas ces mois à déduire, elle le garde intact.</p>

<h2>Exemple : Inès, troisième enfant</h2>
<p>Inès, salariée et en couple, attend son troisième enfant. Elle envisage de s’arrêter jusqu’au premier anniversaire, puis de reprendre à temps plein. Son congé maternité indemnisé couvre deux mois après la naissance. Avec la majorée, elle perçoit ${h.eur(R(h).majoree, 2)} pendant ${R(h).duree.majoree_mois - 2} mois, soit ${h.eur(R(h).majoree * (R(h).duree.majoree_mois - 2))}. Avec la classique sur la même période, environ dix mois, elle toucherait ${h.eur(R(h).taux_plein * 10)}. Pour ce congé d’un an, ${R(h).majoree * (R(h).duree.majoree_mois - 2) >= R(h).taux_plein * 10 ? 'la majorée garde l’avantage' : 'la classique l’emporte déjà'}, de ${h.eur(Math.abs(R(h).majoree * (R(h).duree.majoree_mois - 2) - R(h).taux_plein * 10))} : les mois de congé maternité mordent sur une majorée déjà courte. La majorée ne prend vraiment l’avantage que pour un arrêt bref, qui tient dans ses quelques mois. Et si Inès hésite à prolonger jusqu’aux 2 ans de l’enfant, l’écart en faveur de la classique se creuse ; le choix étant définitif, il se tranche avant la demande.</p>

<h2>Les conditions à ne pas rater</h2>
<ul>
<li><strong>Trois enfants à charge au moins</strong>, le nouveau-né compris.</li>
<li><strong>Arrêt total d’activité</strong> : congé parental à temps plein pour un salarié du privé, congé parental pour un agent public, cessation prouvée pour un indépendant.</li>
<li><strong>8 trimestres de cotisations vieillesse</strong> au cours des cinq années qui précèdent la naissance, ou la demande si elle est faite après.</li>
<li><strong>Pas de cumul</strong> avec les indemnités de congés payés, de congé maternité, paternité ou maladie, les allocations chômage ou le ${h.a('complement-familial', 'complément familial')}.</li>
</ul>
<p>La demande passe par le cerfa n° 12324, envoyé après la fin du congé maternité indemnisé. La prestation est versée à terme échu, comme la classique. Les ${h.a('allocations-familiales-3-enfants', 'allocations familiales de trois enfants')} continuent en parallèle. Pour les règles de durée communes aux deux formules, voir ${h.a('prepare-duree', 'durée de la PreParE')} ; pour garder un temps partiel, ${h.a('prepare-temps-partiel', 'PreParE à temps partiel')}. Le ${h.a('simulateur-prepare', 'simulateur de la PreParE')} compare les deux options.</p>
`,
  },
  en: {
    slug: 'higher-rate-parental-leave-benefit',
    nav: 'Higher-rate PreParE',
    card: 'Three children and a full stop: €751.40 a month for eight months, or the longer standard PreParE. The sums to help you choose.',
    title: 'PreParE 2026: Higher Rate at €751.40, Is It Worth It?',
    description: 'Higher-rate PreParE 2026: €751.40 a month for up to 8 months per parent, from 3 children with a full stop. A final choice against the €459.70 standard PreParE.',
    h1: 'Higher-rate PreParE: more per month, for less time',
    intro: 'Families with three children choose between two versions of the PreParE. The higher rate pays more each month but stops early, and the choice cannot be undone.',
    resume: (h) => `The PreParE majorée (higher-rate shared child-rearing benefit, paid by the CAF family benefits office during parental leave) is ${h.eur(R(h).majoree, 2)} a month in 2026, against ${h.eur(R(h).taux_plein, 2)} for the standard PreParE with a full stop. It is reserved for parents with at least three dependent children who stop work completely and have 8 quarters of pension contributions over the last five years. Part-time work is excluded. In a couple, each parent can receive it for at most ${R(h).duree.majoree_mois} months, within the youngest child’s first year: ${h.eur(maj(h).total)} at most per parent. The standard PreParE runs for up to ${R(h).duree.deux_enfants_mois} months per parent in a three-child family and can reach ${h.eur(std(h).total)}. For a parent with no maternity leave to deduct, the sum is simple: the higher rate wins if leave lasts less than ${bascule(h)} months, the standard rate beyond that. Service-public.fr sheet F32485 states that the choice between the two is final, and that two higher-rate payments received by a couple in the same month are capped at ${h.eur(R(h).majoree, 2)}. Estimates for the CAF to confirm.`,
    faqs: (h) => [
      { q: 'With three children, is the higher-rate or standard PreParE better?', a: `It depends on how long your leave lasts. The higher rate pays ${h.eur(R(h).majoree - R(h).taux_plein, 2)} more a month but stops after ${R(h).duree.majoree_mois} months per parent in a couple, ${h.eur(maj(h).total)} at most. The standard rate can last ${R(h).duree.deux_enfants_mois} months. With no maternity leave to deduct, beyond ${bascule(h) - 1} months off work the standard PreParE pays more. The choice is final under sheet F32485.` },
      { q: 'Can I get the higher-rate PreParE while working half-time?', a: `No. Service-public.fr is explicit: the higher-rate PreParE cannot be received with part-time work. A private-sector employee must take full-time parental leave, a public-sector employee parental leave. A parent who wants to keep a half-time job should look at the standard PreParE, ${h.eur(R(h).partiel_50, 2)} a month in 2026.` },
      { q: 'Does maternity leave shorten the higher-rate PreParE?', a: `Yes. Sheet F32485 says the length of entitlement is reduced by the number of months paid as maternity or adoption leave. In a couple, the mother’s ${R(h).duree.majoree_mois} months become ${R(h).duree.majoree_mois - 2} if two must be taken off, worth ${h.eur(R(h).majoree * (R(h).duree.majoree_mois - 2), 2)}. The father, if he also takes the higher rate, keeps his own months within the first year.` },
      { q: 'I am bringing up three children alone: how long does the higher-rate PreParE last?', a: `Until the youngest child’s first birthday, less any paid maternity leave months. With no deduction, that is at most ${h.eur(maj(h, false).total)} at ${h.eur(R(h).majoree, 2)} a month. The standard PreParE for a single parent of three runs until the youngest turns 3, up to ${h.eur(std(h, false).total)} at the full rate. The difference in length is even sharper than for couples.` },
      { q: 'Can both parents take the higher-rate PreParE in the same month?', a: `Yes, but the two entitlements together are capped at ${h.eur(R(h).majoree, 2)} for that month, according to service-public.fr. Taking it together therefore brings no more than one parent would that month. And two back-to-back periods of ${R(h).duree.majoree_mois} months do not fit before the first birthday, so parents have to share out the year.` },
      { q: 'I chose the higher-rate PreParE: can I switch to the standard one if I extend my leave?', a: `No. Service-public.fr sheet F32485 is blunt: the choice between the PreParE and the higher-rate PreParE is final. A parent who has received ${h.eur(R(h).majoree, 2)} for a few months cannot then move to ${h.eur(R(h).taux_plein, 2)} until the child turns 3. If you are unsure how long your leave will last, caution points to the standard version.` },
    ],
    body: (h) => `
<h2>The two versions side by side</h2>
${h.table(['', 'Higher-rate PreParE', 'Standard PreParE, full stop'], [
  ['Monthly amount', h.eur(R(h).majoree, 2), h.eur(R(h).taux_plein, 2)],
  ['Length per parent, couple', `${R(h).duree.majoree_mois} months`, `${R(h).duree.deux_enfants_mois} months`],
  ['Youngest child’s age limit', 'first birthday', 'age 3'],
  ['Maximum total per parent, couple', h.eur(maj(h).total), h.eur(std(h).total)],
  ['Part-time possible', 'no', 'yes (other amounts)'],
], 'Three-child family, 2026 scale, before deducting maternity leave', ['l', 'r', 'r'])}
<p>The amounts come from ${h.src('spPrepare', 'service-public.fr sheet F32485')}, checked on 1 June 2026, and the ${h.src('instructionPf2026', 'instruction of 20 March 2026')} that uprated them on 1 April. The higher rate pays ${h.pct((R(h).majoree - R(h).taux_plein) / R(h).taux_plein, 0)} more a month; the standard version lasts three times as long for a couple.</p>
<!--mini:prepareMajoree-->

<h2>The break-even point</h2>
<p>For a parent in a couple, the higher rate brings at most ${h.eur(maj(h).total)}. The standard rate reaches the same total after ${bascule(h)} months off at ${h.eur(R(h).taux_plein, 2)}. The decision rule follows:</p>
${h.table(['Planned length of leave', 'Higher rate', 'Standard', 'Better option'], [6, 8, 12, bascule(h), 18, 24].map((m) => { const a = R(h).majoree * Math.min(m, R(h).duree.majoree_mois); const b = R(h).taux_plein * Math.min(m, R(h).duree.deux_enfants_mois); return [`${m} months`, h.eur(a), h.eur(b), a >= b ? 'higher rate' : 'standard']; }), 'One parent in a couple, three children, full stop (estimate)', ['l', 'r', 'r', 'l'])}
<p>The table does not take off maternity leave months, which shorten both versions. For the mother, with two months to deduct, the higher rate drops to ${h.eur(R(h).majoree * (R(h).duree.majoree_mois - 2))} and the standard rate to ${h.eur(R(h).taux_plein * (R(h).duree.deux_enfants_mois - 2))}. The mini calculator above does the exact sum for your case.</p>

<h2>Why maternity leave weighs more on the higher rate</h2>
<p>Two months of paid maternity leave come off both versions, but not with the same weight. On the higher rate they cost ${h.eur(R(h).majoree * 2, 2)}, which is ${h.pct(2 / R(h).duree.majoree_mois, 0)} of a parent’s total entitlement in a couple. On the standard rate they cost ${h.eur(R(h).taux_plein * 2, 2)}, barely ${h.pct(2 / R(h).duree.deux_enfants_mois, 0)} of the ${R(h).duree.deux_enfants_mois} months. For the mother, the higher rate therefore loses much of its appeal; for the father, who has no such months to deduct, it keeps all of it.</p>

<h2>Example: Inès and her third child</h2>
<p>Inès, an employee living with her partner, is expecting her third child. She plans to stop until the first birthday and then go back full-time. Her paid maternity leave covers two months after the birth. With the higher rate she receives ${h.eur(R(h).majoree, 2)} for ${R(h).duree.majoree_mois - 2} months, ${h.eur(R(h).majoree * (R(h).duree.majoree_mois - 2))} in all. With the standard rate over the same period, about ten months, she would get ${h.eur(R(h).taux_plein * 10)}. For this one-year break, ${R(h).majoree * (R(h).duree.majoree_mois - 2) >= R(h).taux_plein * 10 ? 'the higher rate keeps the edge' : 'the standard rate is already ahead'}, by ${h.eur(Math.abs(R(h).majoree * (R(h).duree.majoree_mois - 2) - R(h).taux_plein * 10))}: maternity months eat into a higher rate that is short to begin with. The higher rate only really pays off for a brief stop that fits inside its few months. And if Inès is tempted to stay off until the child is 2, the gap in favour of the standard rate widens; since the choice is final, she has to decide before claiming.</p>

<h2>Conditions not to miss</h2>
<ul>
<li><strong>At least three dependent children</strong>, the newborn included.</li>
<li><strong>A complete stop</strong>: full-time parental leave for a private-sector employee, parental leave for a civil servant, proven cessation for the self-employed.</li>
<li><strong>8 quarters of pension contributions</strong> in the five years before the birth, or before the claim if made afterwards.</li>
<li><strong>No combining</strong> with paid-holiday pay, maternity, paternity or sick pay, unemployment benefit or the ${h.a('complement-familial', 'family supplement')}.</li>
</ul>
<p>The claim uses form cerfa no. 12324, sent after paid maternity leave ends. Payment is in arrears, as with the standard version. ${h.a('allocations-familiales-3-enfants', 'Family allowances for three children')} carry on alongside. For the length rules shared by both versions, see ${h.a('prepare-duree', 'PreParE length')}; to keep a part-time job, see ${h.a('prepare-temps-partiel', 'part-time PreParE')}. The ${h.a('simulateur-prepare', 'PreParE calculator')} compares both options.</p>
`,
  },
});
