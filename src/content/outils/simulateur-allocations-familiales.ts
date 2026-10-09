import { defineGuide, type Helpers } from '../../lib/guide-types';

const af = (h: Helpers, enfants: number, revenus: number, majorables = 0) => h.M.allocationsFamiliales({ enfants, majorables, revenus });
const rangs = [2, 3, 4, 5, 6];

export default defineGuide({
  id: 'simulateur-allocations-familiales',
  group: 'famille',
  order: 10,
  tool: 'af',
  related: ['allocations-familiales-2-enfants', 'allocations-familiales-3-enfants', 'majoration-allocations-familiales', 'complement-degressif', 'complement-familial'],
  sources: ['spAf', 'instructionPf2026'],
  fr: {
    slug: 'simulateur-allocations-familiales',
    nav: 'Allocations familiales',
    card: 'Le montant mensuel selon le nombre d’enfants, l’âge des aînés et le revenu 2024 du foyer.',
    title: 'Allocations familiales 2026 : montant et simulateur gratuit',
    description: 'Allocations familiales 2026 : 152,25 € par mois pour 2 enfants, 347,32 € pour 3 au montant plein. Simulateur gratuit selon revenus 2024, majoration et forfait.',
    h1: 'Simulateur des allocations familiales',
    intro: 'Nombre d’enfants, âge, revenu du foyer : le simulateur applique le barème en vigueur depuis le 1er avril 2026.',
    resume: (h) => `Une famille de deux enfants reçoit ${h.eur(h.M.baseAf(2, 0), 2)} d’allocations familiales par mois en 2026 si son revenu net catégoriel de ${h.P.af.revenus_reference} ne dépasse pas ${h.eur(h.M.plafondsAf(2)[0])}. Avec trois enfants, le montant plein passe à ${h.eur(h.M.baseAf(3, 0), 2)}, avec quatre à ${h.eur(h.M.baseAf(4, 0), 2)}. Au-dessus du premier plafond, le montant est divisé par deux ; au-dessus du second, par quatre. Un enfant né avant le ${h.date(h.P.af.bascule_majoration)} ajoute une majoration de ${h.eur(h.P.af.majoration[0], 2)} à ses ${h.P.af.age_majoration_ancien} ans ; pour un enfant né ensuite, elle n’arrive qu’à ${h.P.af.age_majoration_nouveau} ans. Le revenu retenu est celui qui figure sur l’avis d’imposition reçu en 2025, et les montants sont nets de CRDS. Le simulateur ci-dessus reprend ces règles, ajoute le forfait des 20 ans et le complément dégressif près d’un plafond. Il donne une estimation : seule la CAF fixe le droit, à partir de votre dossier.`,
    faqs: (h) => [
      { q: 'Où trouver le revenu à saisir dans le simulateur ?', a: `Sur l’avis d’imposition reçu en 2025, qui porte sur les revenus de ${h.P.af.revenus_reference}. Le revenu net catégoriel est la somme des revenus de chaque catégorie après abattements, dont les ${h.pct(h.P.apl.abattement_frais_pro, 0)} de frais professionnels sur les salaires. En couple, additionnez les deux. Pour une famille de deux enfants, tout se joue sous ${h.eur(h.M.plafondsAf(2)[0])} ou ${h.eur(h.M.plafondsAf(2)[1])} selon service-public.` },
      { q: 'Le simulateur compte-t-il la majoration pour l’aîné de deux enfants ?', a: `Non, et c’est voulu. Dans une famille de deux enfants, la règle exclut l’aîné de la majoration pour âge : seul le cadet peut l’ouvrir. Si vous saisissez deux enfants nés avant le 1er mars 2012, le calcul ajoute donc une seule majoration de ${h.eur(h.P.af.majoration[0], 2)} au montant plein, soit ${h.eur(af(h, 2, 40000, 2).total, 2)} au total pour un revenu de 40 000 €.` },
      { q: 'Pourquoi mon résultat diffère-t-il de celui de la CAF ?', a: `Trois causes fréquentes : un enfant compté à charge par la CAF mais pas par vous (ou l’inverse), un revenu ${h.P.af.revenus_reference} mal reporté, une date de naissance qui change l’âge de la majoration. La CAF tient aussi compte de situations que l’outil ignore : garde alternée, enfant qui travaille, résidence hors de France. Le barème utilisé est celui de l’instruction du 20 mars 2026.` },
    ],
    body: (h) => `
<h2>Ce que calcule l’outil</h2>
<p>Le simulateur estime le montant mensuel des allocations familiales versées par la CAF en France métropolitaine, à partir de quatre données : le nombre d’enfants de moins de ${h.P.af.age_limite} ans à charge, le nombre de ceux qui ouvrent la majoration pour âge, le nombre de jeunes qui viennent d’avoir ${h.P.af.age_limite} ans, et le revenu net catégoriel ${h.P.af.revenus_reference} du foyer. Il en déduit la tranche de revenus, le montant de base, les majorations, le forfait et, le cas échéant, le complément dégressif.</p>
<p>Le barème est celui des montants nets de CRDS publiés pour la période qui court depuis le 1er avril 2026, d’après l’${h.src('instructionPf2026', 'instruction interministérielle du 20 mars 2026')}, avec les plafonds de ressources relevés sur la ${h.src('spAf', 'fiche service-public des allocations familiales')}.</p>

<h2>Le barème 2026 en un tableau</h2>
<p>Montant de base par mois, hors majorations, selon le nombre d’enfants et la tranche de revenus. Les plafonds augmentent de ${h.eur(h.P.af.plafonds.par_enfant)} par enfant à partir du troisième.</p>
${h.table(['Enfants', 'Montant plein', 'Divisé par 2', 'Divisé par 4', 'Plafond 1', 'Plafond 2'], rangs.map((n) => [String(n), h.eur(h.M.baseAf(n, 0), 2), h.eur(h.M.baseAf(n, 1), 2), h.eur(h.M.baseAf(n, 2), 2), h.eur(h.M.plafondsAf(n)[0]), h.eur(h.M.plafondsAf(n)[1])]), 'Allocations familiales, montants mensuels nets de CRDS depuis le 1er avril 2026, revenus 2024', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Quelques cas types calculés par le même moteur : une famille de trois enfants à 60 000 € de revenus touche ${h.eur(af(h, 3, 60000).total, 2)} ; à 100 000 €, ${h.eur(af(h, 3, 100000).total, 2)} ; avec un adolescent né avant mars 2012 et 60 000 €, ${h.eur(af(h, 3, 60000, 1).total, 2)}. Les pages ${h.a('allocations-familiales-2-enfants', 'deux enfants')}, ${h.a('allocations-familiales-3-enfants', 'trois enfants')} et ${h.a('allocations-familiales-4-enfants', 'quatre enfants et plus')} détaillent chaque situation.</p>

<h2>Ce que l’outil ne fait pas</h2>
<p>Il ne connaît ni la garde alternée, ni l’enfant confié à un tiers, ni les règles des départements d’outre-mer, qui sont différentes. Il ne calcule pas le ${h.a('complement-familial', 'complément familial')}, l’${h.a('allocation-soutien-familial', 'allocation de soutien familial')} ni l’allocation de rentrée scolaire, qui ont leurs propres conditions. Il suppose que chaque enfant saisi est bien à charge au sens de la CAF. La majoration est comptée pour les enfants nés avant le 1er mars 2012, les seuls qui y ont droit en 2026 ; le détail est sur la page ${h.a('majoration-allocations-familiales', 'majoration pour âge')}. Le résultat reste une estimation.</p>
`,
  },
  en: {
    slug: 'family-allowance-calculator',
    nav: 'Family allowance',
    card: 'The monthly amount by number of children, age of the eldest and the household’s 2024 income.',
    title: 'Family Allowance France 2026: Amount and Free Calculator',
    description: 'Family allowance 2026 (allocations familiales): €152.25 a month for 2 children, €347.32 for 3 at the full rate. Free calculator by 2024 income and child age.',
    h1: 'Family allowance calculator (allocations familiales)',
    intro: 'Number of children, their age, household income: the calculator applies the scale in force since 1 April 2026.',
    resume: (h) => `A family with two children receives ${h.eur(h.M.baseAf(2, 0), 2)} of family allowance (allocations familiales) a month in 2026, provided its ${h.P.af.revenus_reference} net income does not exceed ${h.eur(h.M.plafondsAf(2)[0])}. With three children the full amount rises to ${h.eur(h.M.baseAf(3, 0), 2)}, with four to ${h.eur(h.M.baseAf(4, 0), 2)}. Above the first income ceiling the amount is halved; above the second, it is quartered. A child born before ${h.date(h.P.af.bascule_majoration)} adds a supplement of ${h.eur(h.P.af.majoration[0], 2)} from age ${h.P.af.age_majoration_ancien}; for a child born later, it only comes at ${h.P.af.age_majoration_nouveau}. The income used is the revenu net catégoriel, the net income by category shown on the tax assessment notice (avis d'imposition) received in 2025, and all amounts are net of CRDS, a small social levy. The calculator above applies these rules, plus the age-20 flat payment and the tapering top-up near a ceiling. It gives an estimate: only the CAF, the family benefits office, sets the entitlement.`,
    faqs: (h) => [
      { q: 'Which income figure do I type into the family allowance calculator?', a: `The one on the tax assessment notice (avis d'imposition) you received in 2025, covering ${h.P.af.revenus_reference} income. Look for the revenu net catégoriel: each income category after allowances, including the ${h.pct(h.P.apl.abattement_frais_pro, 0)} deduction for work expenses on salaries. Couples add both figures. For a two-child family, everything turns on ${h.eur(h.M.plafondsAf(2)[0])} and ${h.eur(h.M.plafondsAf(2)[1])}, according to service-public.fr.` },
      { q: 'Does the calculator add a supplement for the elder of two children?', a: `No, by design. In a two-child family the rules exclude the elder child from the age supplement; only the younger one can trigger it. If you enter two children born before 1 March 2012, the result adds a single ${h.eur(h.P.af.majoration[0], 2)} supplement to the full amount, giving ${h.eur(af(h, 2, 40000, 2).total, 2)} in total for an income of €40,000.` },
      { q: 'Why does my estimate not match what the CAF pays me?', a: `Three usual reasons: a child the CAF counts as dependent and you do not (or the reverse), a ${h.P.af.revenus_reference} income copied from the wrong line, or a birth date that changes the supplement age. The CAF also handles cases the tool ignores, such as shared custody, a working teenager or a child living abroad. The scale used comes from the instruction of 20 March 2026.` },
    ],
    body: (h) => `
<h2>What the tool works out</h2>
<p>The calculator estimates the monthly family allowance paid by the CAF in mainland France from four inputs: how many dependent children under ${h.P.af.age_limite} you have, how many of them qualify for the age supplement, how many have just turned ${h.P.af.age_limite}, and the household's ${h.P.af.revenus_reference} net income. From those it finds your income band, the base amount, the supplements, the flat payment and, where relevant, the tapering top-up (complément dégressif).</p>
<p>The scale is the set of amounts net of CRDS published for the period running from 1 April 2026, taken from the ${h.src('instructionPf2026', 'inter-ministerial instruction of 20 March 2026')}, with the income ceilings read on the ${h.src('spAf', 'service-public.fr family allowance page')}.</p>

<h2>The 2026 scale in one table</h2>
<p>Base amount per month, before supplements, by number of children and income band. Ceilings rise by ${h.eur(h.P.af.plafonds.par_enfant)} per child from the third onwards.</p>
${h.table(['Children', 'Full rate', 'Halved', 'Quartered', 'Ceiling 1', 'Ceiling 2'], rangs.map((n) => [String(n), h.eur(h.M.baseAf(n, 0), 2), h.eur(h.M.baseAf(n, 1), 2), h.eur(h.M.baseAf(n, 2), 2), h.eur(h.M.plafondsAf(n)[0]), h.eur(h.M.plafondsAf(n)[1])]), 'Family allowance, monthly amounts net of CRDS from 1 April 2026, 2024 income', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>A few typical cases from the same engine: a three-child family on €60,000 receives ${h.eur(af(h, 3, 60000).total, 2)}; on €100,000, ${h.eur(af(h, 3, 100000).total, 2)}; with one teenager born before March 2012 and €60,000, ${h.eur(af(h, 3, 60000, 1).total, 2)}. The pages on ${h.a('allocations-familiales-2-enfants', 'two children')}, ${h.a('allocations-familiales-3-enfants', 'three children')} and ${h.a('allocations-familiales-4-enfants', 'four children or more')} go through each situation.</p>

<h2>What the tool does not do</h2>
<p>It does not handle shared custody, a child placed with someone else, or the overseas departments, where the rules differ. It does not compute the ${h.a('complement-familial', 'family supplement')}, the ${h.a('allocation-soutien-familial', 'family support allowance')} or the back-to-school allowance, which have their own conditions. It assumes every child you enter is dependent in the CAF's sense. The supplement is counted for children born before 1 March 2012, the only ones entitled to it in 2026; details on the ${h.a('majoration-allocations-familiales', 'age supplement')} page. The result remains an estimate.</p>
`,
  },
});
