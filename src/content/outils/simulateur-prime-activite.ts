import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Cas types du tableau, tous au Smic net de 2026 ou à une fraction de celui-ci. */
const smic = (h: Helpers) => h.P.smic.mensuel_net;
const cas = (h: Helpers) => [
  { k: 'seul', r: h.M.primeActivite({ couple: false, enfants: 0, revenu1: smic(h) }), sal: smic(h) },
  { k: 'mi', r: h.M.primeActivite({ couple: false, enfants: 0, revenu1: smic(h) / 2 }), sal: smic(h) / 2 },
  { k: 'couple', r: h.M.primeActivite({ couple: true, enfants: 2, revenu1: smic(h), revenu2: 0 }), sal: smic(h) },
  { k: 'iso', r: h.M.primeActivite({ couple: false, enfants: 1, revenu1: smic(h), isoleMajore: true }), sal: smic(h) },
];
const lib = {
  fr: { seul: 'Seul, Smic à temps plein', mi: 'Seul, Smic à mi-temps', couple: 'Couple, 2 enfants, un Smic', iso: 'Parent isolé, 1 enfant, un Smic (majoré)' },
  en: { seul: 'Single, full-time minimum wage', mi: 'Single, half-time minimum wage', couple: 'Couple, 2 children, one minimum wage', iso: 'Lone parent, 1 child, one minimum wage (higher rate)' },
};
const tableau = (h: Helpers, l: 'fr' | 'en') => h.table(
  l === 'fr' ? ['Situation', 'Salaire net', 'Forfaitaire', 'Prime estimée'] : ['Household', 'Net pay', 'Flat-rate amount', 'Estimated bonus'],
  cas(h).map((c) => [lib[l][c.k as keyof typeof lib.fr], h.eur(c.sal), h.eur(c.r.forfaitaire, 2), h.eur(c.r.prime)]),
  l === 'fr' ? 'Barème du 1er avril 2026, sans aide au logement ni autre ressource (estimation)' : 'Rates from 1 April 2026, no housing aid and no other income (estimate)',
  ['l', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'simulateur-prime-activite',
  group: 'activite',
  order: 10,
  tool: 'pa',
  related: ['prime-activite-celibataire', 'prime-activite-couple', 'prime-activite-parent-isole', 'prime-activite-bonification', 'prime-activite-declaration-trimestrielle'],
  sources: ['spPa', 'decretPa2026', 'cssD843', 'spSmic'],
  fr: {
    slug: 'simulateur-prime-activite',
    nav: 'Simulateur prime d’activité',
    card: 'La simulation de prime d’activité au barème d’avril 2026, foyer par foyer.',
    title: 'Prime d’activité 2026 : simulation gratuite et montant',
    description: 'Prime d’activité 2026 : simulation au barème d’avril 2026. Forfaitaire de 638,28 €, 59,85 % des salaires ajoutés, bonification jusqu’à 240,63 € par actif.',
    h1: 'Simulation de la prime d’activité',
    intro: 'Saisissez vos salaires du dernier trimestre et la composition du foyer : le simulateur applique la formule de la CAF.',
    resume: (h) => `Au Smic net de ${h.eur(smic(h), 2)}, une personne seule sans aide au logement peut prétendre à environ ${h.eur(cas(h)[0].r.prime)} de prime d’activité par mois au barème du 1er avril 2026. Le simulateur reprend la formule publiée sur service-public : montant forfaitaire du foyer, qui part de ${h.eur(h.P.pa.montant_forfaitaire, 2)} pour une personne seule, plus ${h.pct(h.P.pa.taux_revenus, 2)} des revenus professionnels, plus une bonification individuelle par actif, le tout diminué des ressources du foyer ou du forfaitaire s’il est plus élevé. Vous indiquez le salaire net moyen des trois derniers mois, celui du conjoint, les enfants à charge, les autres ressources et votre situation de logement. Le résultat s’affiche avec le détail de chaque ligne et le salaire au-delà duquel la prime s’arrête. C’est une estimation : la CAF calcule le droit sur la déclaration trimestrielle.`,
    faqs: (h) => [
      { q: 'Quel salaire saisir dans la simulation de prime d’activité ?', a: `Le salaire net mensuel moyen des trois derniers mois, primes comprises, tel qu’il figure en net social sur vos bulletins. La CAF raisonne sur un trimestre : si vous avez gagné 1 100 €, 1 400 € et 1 250 €, saisissez ${h.eur((1100 + 1400 + 1250) / 3)}. La bonification de chaque actif dépend aussi de cette moyenne, selon la fiche F2882 de service-public.` },
      { q: 'Pourquoi le simulateur affiche zéro alors que je travaille ?', a: `Deux raisons possibles. Soit vos ressources dépassent le seuil de sortie, environ ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))} de salaire net pour une personne seule ; soit le calcul donne moins de ${h.eur(h.P.pa.minimum_verse)}, montant sous lequel la CAF ne verse rien. Des allocations chômage ou une pension alimentaire importantes peuvent aussi annuler le droit.` },
      { q: 'Le simulateur tient-il compte des allocations familiales ?', a: `Oui, si vous les saisissez dans « autres ressources ». La CAF les compte dans les ressources du foyer, comme le chômage ou une pension. Un couple avec deux enfants qui perçoit ${h.eur(h.P.af.tranches_nettes.deux[0], 2)} d’allocations familiales voit sa prime réduite d’autant, sauf si ses ressources restent sous le montant forfaitaire du foyer.` },
      { q: 'Quelle différence entre ce simulateur et celui de la CAF ?', a: `Les deux appliquent la même formule et le même montant forfaitaire de ${h.eur(h.P.pa.montant_forfaitaire, 2)}. Le simulateur de la CAF part de votre dossier réel et des ressources préremplies ; le nôtre part de vos saisies, sans vous identifier. Il ne gère pas les travailleurs indépendants ni les ressources étalées sur l’année, signalées plus bas.` },
    ],
    body: (h) => `
<h2>Ce que le simulateur calcule</h2>
<p>Il calcule la prime d’activité mensuelle d’un salarié ou d’un couple de salariés vivant en métropole, au barème revalorisé le 1er avril 2026 par le ${h.src('decretPa2026', 'décret du 30 mars 2026')}. Le montant forfaitaire suit la composition du foyer : +50 % pour la deuxième personne, +30 % pour chaque personne suivante, +40 % par enfant au-delà du deuxième. Un parent isolé peut cocher la majoration, qui porte le forfaitaire à ${h.pct(h.P.pa.isole.base, 3)} du montant de base, plus ${h.pct(h.P.pa.isole.par_enfant, 3)} par enfant.</p>
<p>La bonification individuelle suit le ${h.src('cssD843', 'code de la sécurité sociale, article D843-2')} : nulle jusqu’à ${h.eur(h.M.seuilBonification(), 2)} de revenus, elle monte ensuite jusqu’à ${h.eur(h.M.bonificationMax(), 2)}, atteints à ${h.eur(h.M.plafondBonification(), 2)}. Elle se calcule séparément pour chaque conjoint.</p>

<h2>Quatre foyers au Smic</h2>
<p>Le tableau ci-dessous est calculé par le même moteur que le simulateur, avec le Smic net de ${h.eur(smic(h), 2)} publié sur ${h.src('spSmic', 'service-public')}.</p>
${tableau(h, 'fr')}
<p>Le mi-temps touche davantage que le temps plein : avec un salaire faible, les ressources restent sous le forfaitaire, et la prime vaut alors la part de ${h.pct(h.P.pa.taux_revenus, 2)} plus la bonification. Le parent isolé reçoit ${h.eur(cas(h)[3].r.prime - h.M.primeActivite({ couple: false, enfants: 1, revenu1: smic(h) }).prime)} de plus par mois pendant la période majorée.</p>

<h2>Ce qu’il ne sait pas faire</h2>
<p>Il ne traite pas les revenus d’indépendant, les ressources des enfants de plus de 18 ans à charge, ni un changement de situation survenu en cours de trimestre. Il suppose que chaque salaire saisi est la moyenne du trimestre de référence. Il ne remplace pas la demande en ligne sur le site de la CAF, seule à notifier un droit, ni la ${h.src('spPa', 'fiche F2882 de service-public')}, que nous avons relue pour construire le calcul.</p>
`,
  },
  en: {
    slug: 'activity-bonus-calculator',
    nav: 'Activity bonus calculator',
    card: 'Estimate the French activity bonus (prime d’activité) at April 2026 rates, household by household.',
    title: 'Activity Bonus 2026: Prime d’Activité Calculator, Free',
    description: 'Activity bonus 2026 (prime d’activité): estimate it at April 2026 rates. Flat-rate €638.28, 59.85% of earnings added, top-up of up to €240.63 per worker.',
    h1: 'Activity bonus calculator (prime d’activité)',
    intro: 'Enter your pay over the last quarter and who lives with you: the calculator applies the formula the CAF uses.',
    resume: (h) => `On the net minimum wage (Smic) of ${h.eur(smic(h), 2)}, a single person with no housing aid can expect about ${h.eur(cas(h)[0].r.prime)} a month of prime d’activité, the in-work top-up paid by the CAF (France’s family allowance fund), under the rates in force since 1 April 2026. The calculator follows the formula published on service-public.fr: a household flat-rate amount starting at ${h.eur(h.P.pa.montant_forfaitaire, 2)} for one person, plus ${h.pct(h.P.pa.taux_revenus, 2)} of earnings from work, plus an individual top-up for each worker, minus household resources or the flat-rate amount if that is higher. You enter your average net pay over the last three months, your partner’s pay, dependent children, other income and your housing situation. The result shows each line of the sum and the pay level at which the bonus stops. It is an estimate: the CAF decides the entitlement from your quarterly return.`,
    faqs: (h) => [
      { q: 'Which pay figure should I enter in the activity bonus calculator?', a: `Your average net monthly pay over the last three months, bonuses included, as shown under “net social” on your payslips. The CAF works by quarter: if you earned €1,100, €1,400 and €1,250, enter ${h.eur((1100 + 1400 + 1250) / 3)}. Each worker’s top-up also depends on that average, according to sheet F2882 on service-public.fr.` },
      { q: 'Why does the calculator show zero when I have a job?', a: `Either your resources are above the exit point, about ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))} of net pay for a single person, or the sum comes to less than ${h.eur(h.P.pa.minimum_verse)}, below which the CAF pays nothing. Large unemployment benefits or maintenance payments can also wipe out the entitlement.` },
      { q: 'Does the activity bonus estimate include family allowances?', a: `Yes, if you enter them under “other income”. The CAF counts allocations familiales (family allowances) as household resources, like unemployment benefit or a pension. A couple with two children receiving ${h.eur(h.P.af.tranches_nettes.deux[0], 2)} of family allowances sees the bonus fall by that amount, unless resources stay below the household flat rate.` },
      { q: 'How does this calculator differ from the one on the CAF website?', a: `Both use the same formula and the same ${h.eur(h.P.pa.montant_forfaitaire, 2)} flat-rate amount. The CAF tool starts from your real file and pre-filled income; ours starts from what you type, without identifying you. It does not handle self-employment or income spread over the year, as explained below.` },
    ],
    body: (h) => `
<h2>What the calculator works out</h2>
<p>It estimates the monthly activity bonus of an employee, or a couple of employees, living in mainland France, at the rates uprated on 1 April 2026 by the ${h.src('decretPa2026', 'decree of 30 March 2026')}. The flat-rate amount (montant forfaitaire) follows household size: +50% for the second person, +30% for each further person, +40% per child beyond the second. A lone parent can tick the higher rate (majoration pour isolement), which lifts the flat rate to ${h.pct(h.P.pa.isole.base, 3)} of the base amount plus ${h.pct(h.P.pa.isole.par_enfant, 3)} per child.</p>
<p>The individual top-up (bonification individuelle) follows the ${h.src('cssD843', 'Social Security Code, article D843-2')}: zero up to ${h.eur(h.M.seuilBonification(), 2)} of earnings, it then climbs to ${h.eur(h.M.bonificationMax(), 2)}, reached at ${h.eur(h.M.plafondBonification(), 2)}. It is worked out separately for each partner.</p>

<h2>Four households on the minimum wage</h2>
<p>The table comes from the same engine as the calculator, using the net Smic of ${h.eur(smic(h), 2)} published on ${h.src('spSmic', 'service-public.fr')}.</p>
${tableau(h, 'en')}
<p>The half-time worker gets more than the full-timer: on low pay, resources stay under the flat rate, so the bonus equals the ${h.pct(h.P.pa.taux_revenus, 2)} share plus the top-up. The lone parent receives ${h.eur(cas(h)[3].r.prime - h.M.primeActivite({ couple: false, enfants: 1, revenu1: smic(h) }).prime)} more a month while the higher rate lasts.</p>

<h2>What it cannot do</h2>
<p>It does not handle self-employed income, the income of dependent children over 18, or a change of situation in the middle of a quarter. It assumes each figure you enter is the average of the reference quarter. It does not replace the online claim on the CAF website, the only body that can grant the bonus, nor the ${h.src('spPa', 'service-public.fr sheet F2882')} we used to build the sum.</p>
`,
  },
});
