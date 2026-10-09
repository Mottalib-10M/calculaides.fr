import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Cas types du tableau : salaire net, autre ressource mensuelle, enfants. */
const smic = (h: Helpers) => h.P.smic.mensuel_net;
const cas = (h: Helpers): Array<[string, string, number, number, number]> => [
  ['Aucune ressource', 'No income', 0, 0, 0],
  ['Salaire de 800 €', '€800 wage', 800, 0, 0],
  ['Smic net à temps plein', 'Full-time minimum wage', smic(h), 0, 0],
  ['Smic net, 1 enfant à charge', 'Minimum wage, 1 child', smic(h), 0, 1],
  ['Pension d’invalidité de 600 €', '€600 disability pension', 0, 600, 0],
];

export default defineGuide({
  id: 'simulateur-aah',
  group: 'handicap',
  order: 10,
  tool: 'aah',
  related: ['aah-cumul-salaire', 'aah-plafond-ressources', 'aah-deconjugalisation', 'aah-pension-invalidite', 'aah-enfants'],
  sources: ['spAah', 'decretAah2026', 'spSmic'],
  fr: {
    slug: 'simulateur-aah',
    nav: 'Simulateur AAH',
    card: 'Le montant mensuel de l’AAH selon votre salaire, une pension et vos enfants à charge.',
    title: 'Montant AAH 2026 : simulateur selon salaire et pension',
    description: 'Montant AAH 2026 : 1 041,59 € par mois au maximum depuis le 1er avril. Simulateur gratuit avec abattement sur salaire, pension d’invalidité et enfants à charge.',
    h1: 'Simulateur AAH : votre montant mensuel',
    intro: 'Saisissez votre salaire, une éventuelle pension et vos enfants à charge : l’outil applique les règles de l’allocation aux adultes handicapés au 1er avril 2026.',
    resume: (h) => `L’allocation aux adultes handicapés atteint au maximum ${h.eur(h.P.aah.montant_max, 2)} par mois depuis le 1er avril 2026, montant versé à une personne sans aucune ressource. Une pension ou une rente se retire de ce maximum : avec 600 € de pension d’invalidité, l’AAH tombe à ${h.eur(h.M.aah({ salaire: 0, autres: 600 }).aah, 2)}. Un salaire en milieu ordinaire pèse beaucoup moins, grâce à un abattement de ${h.pct(h.P.aah.abattement_activite.taux_bas, 0)} puis de ${h.pct(h.P.aah.abattement_activite.taux_haut, 0)} : au Smic net, l’AAH estimée reste de ${h.eur(h.M.aah({ salaire: smic(h) }).aah, 2)}. Le plafond annuel de ressources, ${h.eur(h.P.aah.plafond_annuel)} pour une personne seule, augmente de ${h.eur(h.P.aah.majoration_enfant)} par enfant à charge. Depuis le 1er octobre 2023, les revenus du conjoint ne comptent plus. Le simulateur ne décide pas du droit : c’est la commission de la MDPH qui reconnaît le taux d’incapacité, et la CAF qui calcule le montant.`,
    faqs: (h) => [
      { q: 'Le simulateur AAH tient-il compte des revenus de mon conjoint ?', a: `Non, et c’est conforme à la règle actuelle. Depuis le 1er octobre 2023, l’AAH est calculée sur vos seules ressources personnelles. L’ancien calcul, avec un plafond de couple de ${h.eur(h.P.aah.plafond_couple_conjugalise)} par an sans enfant, n’est conservé que s’il vous est plus favorable ; la CAF ou la MSA fait elle-même la comparaison. L’outil ne reproduit pas cet ancien calcul.` },
      { q: 'Quel salaire saisir dans le simulateur AAH ?', a: `Le salaire net mensuel d’un emploi en milieu ordinaire, c’est-à-dire hors Ésat. L’outil applique l’abattement : ${h.pct(h.P.aah.abattement_activite.taux_bas, 0)} jusqu’à ${h.pct(h.P.aah.abattement_activite.tranche_smic_brut, 0)} du Smic brut, soit ${h.eur(h.P.aah.abattement_activite.tranche_smic_brut * h.P.smic.mensuel_brut, 2)} par mois, et ${h.pct(h.P.aah.abattement_activite.taux_haut, 0)} au-delà. Avec 800 € net, seuls ${h.eur(h.M.salaireRetenuAah(800), 2)} sont retenus et l’AAH estimée atteint ${h.eur(h.M.aah({ salaire: 800 }).aah, 2)}.` },
      { q: 'Pourquoi la CAF me verse-t-elle moins que le simulateur AAH ?', a: `Plusieurs situations réduisent l’AAH sans que l’outil les connaisse. Une hospitalisation ou un séjour en maison d’accueil spécialisée de plus de 60 jours ramène l’allocation à ${h.pct(h.P.aah.taux_hospitalisation, 0)} du maximum, soit environ ${h.eur(h.P.aah.montant_max * h.P.aah.taux_hospitalisation)} par mois, sauf exceptions. Des revenus fonciers comptent en entier. Et la CAF raisonne sur les revenus de l’avis d’imposition, pas sur un mois isolé.` },
    ],
    body: (h) => `
<h2>Ce que calcule l’outil</h2>
<p>Le calcul part du montant maximal de ${h.eur(h.P.aah.montant_max, 2)} fixé par le ${h.src('decretAah2026', 'décret du 30 mars 2026')}. Il retire vos ressources retenues : une pension ou une rente en entier, un salaire après abattement. Le plafond annuel, ${h.eur(h.P.aah.plafond_annuel)} augmenté de ${h.eur(h.P.aah.majoration_enfant)} par enfant à charge, fixe la limite au-delà de laquelle plus rien n’est versé. Le Smic utilisé pour l’abattement est celui de la ${h.src('spSmic', 'fiche Smic de service-public')}, ${h.eur(h.P.smic.mensuel_brut, 2)} brut par mois.</p>
${h.table(['Situation', 'Ressources retenues par mois', 'AAH estimée'], cas(h).map(([fr, en, s, a, e]) => { const x = h.M.aah({ salaire: s, autres: a, enfants: e }); return [h.lang === 'fr' ? fr : en, h.eur(x.ressourcesRetenues, 2), h.eur(x.aah, 2)]; }), 'Personne seule ou calcul déconjugalisé, barème du 1er avril 2026 (estimation)', ['l', 'r', 'r'])}
<p>Sans autre ressource ni enfant, l’AAH s’éteint vers ${h.eur(h.M.seuilSortieAah(0))} de salaire net mensuel. Les pages ${h.a('aah-cumul-salaire', 'AAH et salaire')} et ${h.a('aah-enfants', 'AAH avec enfants')} détaillent ces deux leviers.</p>

<h2>Les données utilisées</h2>
<p>Les montants et plafonds viennent de la ${h.src('spAah', 'fiche AAH de service-public')}, vérifiée le 14 septembre 2026, et du décret de revalorisation. La règle d’abattement sur les salaires suit le code de la sécurité sociale. Nous relisons ces valeurs à chaque revalorisation d’avril.</p>

<h2>Ce que l’outil ne sait pas faire</h2>
<p>Il ne dit pas si vous avez droit à l’AAH : seule la CDAPH, la commission de la maison départementale des personnes handicapées (MDPH), fixe le taux d’incapacité, d’au moins 80 %, ou de 50 à 79 % avec une restriction substantielle et durable d’accès à l’emploi. Il ne traite ni le travail en Ésat, ni l’ancien calcul conjugalisé, ni Mayotte, où le barème diffère. Il ne calcule pas non plus la prime d’activité, cumulable avec l’AAH selon service-public.</p>
`,
  },
  en: {
    slug: 'aah-disability-allowance-calculator',
    nav: 'AAH calculator',
    card: 'Your monthly AAH disability allowance from your wage, a pension and dependent children.',
    title: 'AAH Amount 2026: France Disability Allowance Calculator',
    description: 'AAH amount in 2026: up to €1,041.59 a month since 1 April. Free calculator for the French disability allowance, with the wage allowance, a pension and children.',
    h1: 'AAH calculator: your monthly disability allowance',
    intro: 'Enter your wage, any pension and your dependent children: the tool applies the rules of France’s adult disability allowance as of 1 April 2026.',
    resume: (h) => `The AAH (allocation aux adultes handicapés, France’s allowance for disabled adults) is worth at most ${h.eur(h.P.aah.montant_max, 2)} a month since 1 April 2026, the amount paid to someone with no income at all. A pension or annuity is subtracted from that maximum: with a €600 disability pension, AAH drops to ${h.eur(h.M.aah({ salaire: 0, autres: 600 }).aah, 2)}. Wages from a mainstream job weigh far less, thanks to an allowance of ${h.pct(h.P.aah.abattement_activite.taux_bas, 0)} then ${h.pct(h.P.aah.abattement_activite.taux_haut, 0)}: on the full-time minimum wage, estimated AAH is still ${h.eur(h.M.aah({ salaire: smic(h) }).aah, 2)}. The yearly income ceiling, ${h.eur(h.P.aah.plafond_annuel)} for one person, rises by ${h.eur(h.P.aah.majoration_enfant)} per dependent child. Since 1 October 2023, a partner’s income no longer counts. The calculator does not decide eligibility: the MDPH (the local disability office) assesses your level of impairment, and the CAF (family benefits office) works out the amount.`,
    faqs: (h) => [
      { q: 'Does the AAH calculator take my partner’s income into account?', a: `No, in line with the current rule. Since 1 October 2023, AAH is based on your personal resources only. The old joint calculation, with a couple ceiling of ${h.eur(h.P.aah.plafond_couple_conjugalise)} a year without children, is kept only where it suits you better, and the CAF or MSA makes that comparison itself. The tool does not reproduce the old method.` },
      { q: 'Which wage should I enter in the AAH calculator?', a: `Your net monthly pay from a mainstream job, meaning outside an Ésat (sheltered workshop). The tool applies the allowance: ${h.pct(h.P.aah.abattement_activite.taux_bas, 0)} up to ${h.pct(h.P.aah.abattement_activite.tranche_smic_brut, 0)} of the gross minimum wage, ${h.eur(h.P.aah.abattement_activite.tranche_smic_brut * h.P.smic.mensuel_brut, 2)} a month, and ${h.pct(h.P.aah.abattement_activite.taux_haut, 0)} above. On €800 net, only ${h.eur(h.M.salaireRetenuAah(800), 2)} counts and estimated AAH reaches ${h.eur(h.M.aah({ salaire: 800 }).aah, 2)}.` },
      { q: 'Why does the CAF pay me less than the AAH calculator shows?', a: `Several situations reduce AAH that the tool does not know about. A stay of more than 60 days in hospital or a specialised care home (MAS) cuts the allowance to ${h.pct(h.P.aah.taux_hospitalisation, 0)} of the maximum, about ${h.eur(h.P.aah.montant_max * h.P.aah.taux_hospitalisation)} a month, with exceptions. Rental income counts in full. And the CAF works from the income on your tax notice, not from a single month.` },
    ],
    body: (h) => `
<h2>What the tool works out</h2>
<p>The sum starts from the ${h.eur(h.P.aah.montant_max, 2)} maximum set by the ${h.src('decretAah2026', 'decree of 30 March 2026')}. It subtracts your counted resources: a pension or annuity in full, a wage after its allowance. The yearly ceiling, ${h.eur(h.P.aah.plafond_annuel)} plus ${h.eur(h.P.aah.majoration_enfant)} per dependent child, is the limit beyond which nothing is paid. The minimum wage used for the allowance comes from the ${h.src('spSmic', 'service-public.fr Smic sheet')}: ${h.eur(h.P.smic.mensuel_brut, 2)} gross a month.</p>
${h.table(['Situation', 'Monthly resources counted', 'Estimated AAH'], cas(h).map(([fr, en, s, a, e]) => { const x = h.M.aah({ salaire: s, autres: a, enfants: e }); return [h.lang === 'fr' ? fr : en, h.eur(x.ressourcesRetenues, 2), h.eur(x.aah, 2)]; }), 'Single person or individualised calculation, rates from 1 April 2026 (estimate)', ['l', 'r', 'r'])}
<p>With no other income and no children, AAH runs out at around ${h.eur(h.M.seuilSortieAah(0))} of net monthly pay. The pages on ${h.a('aah-cumul-salaire', 'AAH and wages')} and ${h.a('aah-enfants', 'AAH with children')} go into these two levers.</p>

<h2>The data behind it</h2>
<p>Amounts and ceilings come from the ${h.src('spAah', 'service-public.fr AAH sheet')}, checked on 14 September 2026, and from the uprating decree. The wage allowance follows the Social Security Code. We re-read these values at each April uprating.</p>

<h2>What it cannot do</h2>
<p>It does not decide eligibility: only the CDAPH, the decision board of the MDPH (maison départementale des personnes handicapées), sets the impairment rate, at least 80%, or 50 to 79% with a substantial and lasting restriction on access to work. It does not cover work in an Ésat, the old joint calculation, or Mayotte, where the scale differs. Nor does it compute the prime d’activité (in-work bonus), which service-public.fr says can be combined with AAH.</p>
`,
  },
});
