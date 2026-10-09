import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Montant forfaitaire selon la composition, puis RSA sans ressource avec forfait logement. */
const lignes = (h: Helpers) => ([
  [false, 0, false], [false, 1, false], [false, 1, true], [false, 2, true], [true, 0, false], [true, 1, false], [true, 2, false], [true, 3, false],
] as Array<[boolean, number, boolean]>).map(([c, e, iso]) => ({ c, e, iso, f: h.M.forfaitaireRsa(c, e, iso), fl: h.M.rsa({ couple: c, enfants: e, revenus: 0, forfaitLogement: true, isoleMajore: iso }).rsa }));
const nom = (h: Helpers, c: boolean, e: number, iso: boolean) => h.lang === 'fr'
  ? `${c ? 'Couple' : iso ? 'Parent isolé (majoré)' : 'Personne seule'}${e ? `, ${e} enfant${e > 1 ? 's' : ''}` : ''}`
  : `${c ? 'Couple' : iso ? 'Lone parent (increased)' : 'Single person'}${e ? `, ${e} child${e > 1 ? 'ren' : ''}` : ''}`;

export default defineGuide({
  id: 'simulateur-rsa',
  group: 'rsa',
  order: 10,
  tool: 'rsa',
  related: ['rsa-personne-seule', 'rsa-couple', 'rsa-parent-isole', 'rsa-forfait-logement', 'rsa-cumul-salaire'],
  sources: ['spRsa', 'decretRsa2026'],
  fr: {
    slug: 'simulateur-rsa',
    nav: 'Simulateur RSA',
    card: 'Le RSA du mois selon le foyer, le logement et les ressources des trois derniers mois.',
    title: 'RSA 2026 : simulateur gratuit du montant selon le foyer',
    description: 'RSA 2026 : 651,69 € pour une personne seule, 977,54 € pour un couple depuis le 1er avril. Simulateur gratuit avec forfait logement, salaires et allocations.',
    h1: 'Simulateur RSA : votre montant du mois',
    intro: 'Indiquez la composition du foyer, le logement et les ressources des trois derniers mois : l’outil applique le barème en vigueur depuis le 1er avril 2026.',
    resume: (h) => `Une personne seule sans ressource a droit à un RSA de ${h.eur(h.P.rsa.montant_forfaitaire, 2)} par mois depuis le 1er avril 2026, et à ${h.eur(h.M.rsa({ couple: false, enfants: 0, revenus: 0, forfaitLogement: true }).rsa, 2)} si elle touche une aide au logement ou n’a pas de loyer à payer. Un couple sans enfant part de ${h.eur(h.M.forfaitaireRsa(true, 0), 2)}, un couple avec deux enfants de ${h.eur(h.M.forfaitaireRsa(true, 2), 2)}. Le simulateur suit la règle du revenu de solidarité active : il prend ce montant forfaitaire, qui dépend de la taille du foyer, puis il retire la moyenne mensuelle des ressources des trois derniers mois et, s’il y a lieu, un forfait logement. Salaires, allocations chômage, indemnités journalières et prestations familiales entrent dans ce calcul. Le résultat est une estimation au barème du décret du 30 mars 2026 ; seule la CAF, ou la MSA pour le régime agricole, fixe le droit réel après étude du dossier.`,
    faqs: (h) => [
      { q: 'Le simulateur RSA tient-il compte de mes allocations familiales ?', a: `Oui, si vous les saisissez dans les autres ressources. Service-public le dit : les prestations familiales font partie des ressources retenues. Un couple avec deux enfants, aidé pour son logement et qui reçoit ${h.eur(h.P.af.tranches_nettes.deux[0], 2)} d’allocations familiales, obtient ${h.eur(h.M.rsa({ couple: true, enfants: 2, revenus: 0, autres: h.P.af.tranches_nettes.deux[0], forfaitLogement: true }).rsa, 2)} de RSA, le montant de l’exemple officiel.` },
      { q: 'Pourquoi le résultat du simulateur RSA diffère-t-il de celui de la CAF ?', a: `La CAF part des ressources réellement déclarées sur trois mois, préremplies depuis mars 2025 en montant net social, et elle peut retenir des éléments que l’outil ignore : avantage en nature quand un tiers paie votre loyer, revenus de placement, réduction pour non-respect du contrat d’engagement. Un écart de quelques euros vient aussi de l’arrondi : sous ${h.eur(h.P.rsa.minimum_verse)}, rien n’est versé.` },
      { q: 'Le simulateur RSA marche-t-il avant 25 ans ?', a: `Non. Le barème calculé ici est celui de la fiche service-public du demandeur de 25 ans et plus. Avant cet âge, le RSA n’est ouvert que dans des situations particulières, comme celle d’un parent isolé, avec des conditions que l’outil ne vérifie pas. Le montant forfaitaire de ${h.eur(h.P.rsa.montant_forfaitaire, 2)} n’est donc pas un droit acquis pour un demandeur plus jeune.` },
    ],
    body: (h) => `
<h2>Ce que calcule l’outil</h2>
<p>Le calcul tient en une soustraction. Le point de départ est le montant forfaitaire du foyer : ${h.eur(h.P.rsa.montant_forfaitaire, 2)} pour une personne seule, majoré de ${h.pct(h.P.rsa.majoration.deuxieme, 0)} pour la deuxième personne, de ${h.pct(h.P.rsa.majoration.suivante, 0)} pour la troisième, puis de ${h.pct(h.P.rsa.majoration.au_dela_troisieme_enfant, 0)} par enfant à partir du troisième. On retire ensuite la moyenne des ressources des trois derniers mois, puis le forfait logement si le foyer touche une aide au logement, est hébergé gratuitement ou est propriétaire. Le reste, s’il atteint ${h.eur(h.P.rsa.minimum_verse)}, est le RSA du mois.</p>
${h.table(['Foyer', 'Montant forfaitaire', 'RSA sans ressource, avec forfait logement'], lignes(h).map((x) => [nom(h, x.c, x.e, x.iso), h.eur(x.f, 2), h.eur(x.fl, 2)]), 'Barème RSA au 1er avril 2026, calculé par notre moteur (estimation)', ['l', 'r', 'r'])}
<p>Le parent isolé reçoit un montant majoré pendant une durée limitée ; la page ${h.a('rsa-parent-isole', 'RSA parent isolé')} en donne les règles. Le détail du forfait est sur ${h.a('rsa-forfait-logement', 'forfait logement du RSA')}.</p>

<h2>Les données utilisées</h2>
<p>Les montants viennent du ${h.src('decretRsa2026', 'décret n° 2026-220 du 30 mars 2026')}, applicable au 1er avril 2026, et des tableaux de la ${h.src('spRsa', 'fiche RSA de service-public')}. Nous les relisons à chaque revalorisation annuelle. Une remarque sur un cas : pour un foyer de trois personnes, notre moteur arrondit le forfaitaire à un centime près du chiffre publié par service-public.</p>

<h2>Ce que l’outil ne sait pas faire</h2>
<p>Il ne vérifie pas les conditions d’accès : âge, résidence stable en France, titre de séjour, situation d’étudiant ou de congé parental. Il ne connaît pas les règles de la MSA, ni celles des départements d’outre-mer. Il ne calcule pas les sanctions décidées par le département ni l’avantage en nature d’un loyer payé par un proche. Pour un salaire en cours de reprise, la page ${h.a('rsa-cumul-salaire', 'RSA et salaire')} montre comment la prime d’activité prend le relais.</p>
`,
  },
  en: {
    slug: 'rsa-calculator',
    nav: 'RSA calculator',
    card: 'This month’s RSA by household, housing situation and income over the last three months.',
    title: 'RSA 2026: Free Calculator for France’s Minimum Income',
    description: 'RSA 2026: €651.69 a month for a single person and €977.54 for a couple since 1 April. Free calculator with housing deduction, wages and family allowances.',
    h1: 'RSA calculator: your monthly minimum income',
    intro: 'Enter your household, housing situation and income over the last three months: the tool applies the scale in force since 1 April 2026.',
    resume: (h) => `A single person with no income is entitled to ${h.eur(h.P.rsa.montant_forfaitaire, 2)} a month of RSA (revenu de solidarité active, France’s minimum income for people aged 25 and over) since 1 April 2026, or ${h.eur(h.M.rsa({ couple: false, enfants: 0, revenus: 0, forfaitLogement: true }).rsa, 2)} if they receive housing aid or pay no rent. A childless couple starts from ${h.eur(h.M.forfaitaireRsa(true, 0), 2)}, a couple with two children from ${h.eur(h.M.forfaitaireRsa(true, 2), 2)}. The calculator follows the official method: it takes that flat-rate amount, which grows with household size, subtracts the average monthly income of the last three months and, where relevant, a flat housing deduction. Wages, unemployment benefit, sick pay and family benefits all count. The figure is an estimate based on the decree of 30 March 2026; only the CAF (the family benefits office), or the MSA for farm workers, sets the actual entitlement after reviewing your file.`,
    faqs: (h) => [
      { q: 'Does the RSA calculator count my child benefit?', a: `Yes, if you enter it under other income. Service-public.fr is explicit: family benefits are part of the resources taken into account. A couple with two children, receiving housing aid and ${h.eur(h.P.af.tranches_nettes.deux[0], 2)} of allocations familiales (child benefit), gets ${h.eur(h.M.rsa({ couple: true, enfants: 2, revenus: 0, autres: h.P.af.tranches_nettes.deux[0], forfaitLogement: true }).rsa, 2)} of RSA, the exact figure in the official example.` },
      { q: 'Why does my CAF payment differ from this RSA estimate?', a: `The CAF works from income actually declared over three months, pre-filled since March 2025 using the net social amount on your payslip, and it may count items this tool ignores: a benefit in kind when someone else pays your rent, savings income, or a cut for not keeping to your engagement contract. Rounding matters too: below ${h.eur(h.P.rsa.minimum_verse)}, nothing is paid.` },
      { q: 'Can I use the RSA calculator if I am under 25?', a: `Not reliably. The scale used here is the one service-public.fr publishes for claimants aged 25 and over. Below that age, RSA is only open in specific cases, such as a lone parent, under conditions this tool does not check. The ${h.eur(h.P.rsa.montant_forfaitaire, 2)} flat rate is therefore not a given for a younger claimant.` },
    ],
    body: (h) => `
<h2>What the tool works out</h2>
<p>The sum is a single subtraction. It starts from the household’s flat-rate amount: ${h.eur(h.P.rsa.montant_forfaitaire, 2)} for one person, plus ${h.pct(h.P.rsa.majoration.deuxieme, 0)} for a second person, ${h.pct(h.P.rsa.majoration.suivante, 0)} for a third, then ${h.pct(h.P.rsa.majoration.au_dela_troisieme_enfant, 0)} per child from the third child on. It then takes off average income over the last three months, and the forfait logement (housing deduction) when the household gets housing aid, lives rent-free or owns its home. Whatever is left, if it reaches ${h.eur(h.P.rsa.minimum_verse)}, is the month’s RSA.</p>
${h.table(['Household', 'Flat-rate amount', 'RSA with no income, housing deduction applied'], lignes(h).map((x) => [nom(h, x.c, x.e, x.iso), h.eur(x.f, 2), h.eur(x.fl, 2)]), 'RSA scale from 1 April 2026, computed by our engine (estimate)', ['l', 'r', 'r'])}
<p>A lone parent receives an increased amount for a limited period; see ${h.a('rsa-parent-isole', 'RSA for lone parents')}. The deduction itself is explained on ${h.a('rsa-forfait-logement', 'the RSA housing deduction')}.</p>

<h2>The data behind it</h2>
<p>Amounts come from ${h.src('decretRsa2026', 'decree 2026-220 of 30 March 2026')}, in force from 1 April 2026, and from the tables on the ${h.src('spRsa', 'service-public.fr RSA sheet')}. We re-read them at each yearly uprating. One caveat: for a three-person household, our engine rounds the flat rate one cent away from the published figure.</p>

<h2>What it cannot do</h2>
<p>It does not check eligibility: age, stable residence in France, residence permit, student status or parental leave. It does not apply MSA rules or those of the overseas departments. It does not model penalties decided by the département (the local council in charge of RSA) or the benefit in kind of rent paid by a relative. If you are starting a job, the page on ${h.a('rsa-cumul-salaire', 'RSA and wages')} shows how the prime d’activité (in-work activity bonus) takes over.</p>
`,
  },
});
