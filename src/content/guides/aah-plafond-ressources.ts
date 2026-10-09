import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Ressources annuelles déjà retenues (après abattements) : AAH mensuelle. */
const parAn = (h: Helpers, annuel: number, enfants = 0) => h.M.aah({ salaire: 0, autres: annuel / 12, enfants });
const yasmine = 6000;

export default defineGuide({
  id: 'aah-plafond-ressources',
  group: 'handicap',
  order: 40,
  mini: 'aahPlafondRessources',
  related: ['simulateur-aah', 'aah-cumul-salaire', 'aah-enfants', 'aah-deconjugalisation', 'aah-pension-invalidite'],
  sources: ['spAah', 'decretAah2026'],
  fr: {
    slug: 'aah-plafond-ressources',
    nav: 'Plafond de ressources AAH',
    card: 'Le plafond de 12 499 € par an, les revenus que la CAF retient et l’année de référence.',
    title: 'Plafond AAH 2026 : 12 499 € par an et revenus retenus',
    description: 'Plafond de ressources de l’AAH en 2026 : 12 499 € par an pour une personne seule, plus par enfant. Revenus de l’avis d’imposition 2024, exemple et simulateur.',
    h1: 'Plafond de ressources de l’AAH : la limite et ce qu’elle compte',
    intro: 'Le plafond de l’AAH n’est pas un couperet : c’est la somme d’où l’on retire vos ressources annuelles pour obtenir l’allocation.',
    resume: (h) => `Pour percevoir l’AAH en 2026, une personne seule sans enfant ne doit pas dépasser ${h.eur(h.P.aah.plafond_annuel)} de ressources annuelles retenues. Ce plafond correspond à douze mois d’AAH au taux maximal de ${h.eur(h.P.aah.montant_max, 2)}, et il augmente de ${h.eur(h.P.aah.majoration_enfant)} environ par enfant à charge. Il ne fonctionne pas comme un seuil tout ou rien : l’AAH mensuelle vaut à peu près le plafond moins les ressources, divisé par douze. Avec ${h.eur(yasmine)} de ressources retenues sur l’année, l’allocation estimée est de ${h.eur(parAn(h, yasmine).aah, 2)} par mois. Pour une demande faite en 2026, service-public indique que les ressources sont celles de la ligne revenu net catégoriel de l’avis d’imposition 2024. Salaires et pensions y sont pris en compte partiellement, les loyers perçus en entier. Depuis octobre 2023, les revenus du conjoint n’entrent plus dans ce plafond. Estimation ; la CAF calcule le droit.`,
    faqs: (h) => [
      { q: 'Quels revenus la CAF compare-t-elle au plafond de l’AAH en 2026 ?', a: `Pour une demande faite en 2026, ceux de la ligne revenu net catégoriel de votre avis d’imposition 2024, selon service-public. Ce sont vos revenus personnels, sans ceux du conjoint, face au plafond de ${h.eur(h.P.aah.plafond_annuel)} pour une personne sans enfant. Les salaires, pensions et revenus d’activité indépendante y figurent pour une part seulement, les revenus fonciers en totalité.` },
      { q: 'Je dépasse le plafond de l’AAH de 200 €, ai-je tout perdu ?', a: `Pour l’année concernée, l’allocation calculée est nulle : au-delà de ${h.eur(h.P.aah.plafond_annuel)} de ressources retenues, il ne reste rien à verser. Mais juste en dessous, l’AAH est déjà très faible : avec ${h.eur(h.P.aah.plafond_annuel - 200)} de ressources, elle serait d’environ ${h.eur(parAn(h, h.P.aah.plafond_annuel - 200).aah, 2)} par mois. Si vos ressources baissent ensuite, signalez-le : tout changement de situation se déclare à la CAF.` },
      { q: 'Le plafond de l’AAH est-il le même pour une personne en couple ?', a: `Oui, dans le calcul actuel. Depuis le 1er octobre 2023, la personne en couple a le même plafond qu’une personne seule, ${h.eur(h.P.aah.plafond_annuel)} sans enfant, puisque seules ses ressources comptent. L’ancien plafond de couple, ${h.eur(h.P.aah.plafond_couple_conjugalise)}, ne sert plus que lorsque l’ancien calcul reste plus favorable pour un couple déjà bénéficiaire.` },
      { q: 'Des loyers perçus comptent-ils dans le plafond de l’AAH ?', a: `Oui, et en totalité. Service-public distingue les revenus pris en compte partiellement, comme les salaires et les pensions, des revenus fonciers, c’est-à-dire les loyers d’un logement mis en location, retenus intégralement. Un studio loué 400 € par mois, soit 4 800 € par an, laisse une AAH estimée de ${h.eur(parAn(h, 4800).aah, 2)} si c’est la seule ressource.` },
      { q: 'Combien de temps la MDPH a-t-elle pour répondre à une demande d’AAH ?', a: 'Quatre mois. Selon service-public, la commission des droits et de l’autonomie de la MDPH répond dans ce délai ; son silence au-delà vaut rejet implicite. Un refus se conteste d’abord par un recours administratif préalable obligatoire auprès de la MDPH, dans les deux mois, puis devant le tribunal judiciaire dans les deux mois suivant la réponse.' },
    ],
    body: (h) => `
<h2>Un plafond qui sert de base au calcul</h2>
<p>La ${h.src('spAah', 'fiche AAH de service-public')} publie le plafond sous forme de tableau. Il n’est pas fixé au hasard : ${h.eur(h.P.aah.plafond_annuel)}, c’est douze mois du montant maximal de ${h.eur(h.P.aah.montant_max, 2)} revalorisé par le ${h.src('decretAah2026', 'décret du 30 mars 2026')}, arrondi à l’euro. D’où la règle pratique : l’allocation mensuelle est égale au plafond moins les ressources annuelles retenues, le tout divisé par douze, sans dépasser le maximum.</p>
${h.table(['Ressources annuelles retenues', 'Marge sous le plafond', 'AAH mensuelle estimée'], [0, 3000, yasmine, 9000, 12000].map((r) => [h.eur(r), h.eur(Math.max(0, h.P.aah.plafond_annuel - r)), h.eur(parAn(h, r).aah, 2)]), 'Personne seule sans enfant, calcul déconjugalisé, montants 2026 (estimation)', ['r', 'r', 'r'])}
<!--mini:aahPlafondRessources-->

<h2>Les ressources que retient la CAF</h2>
<p>Pour une demande faite en 2026, la référence est la ligne revenu net catégoriel de l’avis d’imposition 2024, soit les revenus de deux ans plus tôt. Service-public précise ensuite que plusieurs catégories ne sont prises en compte que partiellement : revenus des activités commerciales, artisanales, libérales ou agricoles, traitements et salaires, pensions, rentes viagères à titre gratuit, rémunération garantie en Ésat. Les revenus fonciers, eux, sont retenus en totalité.</p>
<p>Pour un salaire en milieu ordinaire, l’abattement de ${h.pct(h.P.aah.abattement_activite.taux_bas, 0)} puis ${h.pct(h.P.aah.abattement_activite.taux_haut, 0)} réduit fortement la part retenue : la page ${h.a('aah-cumul-salaire', 'AAH et salaire')} en donne le détail. Une pension ou une rente, en revanche, vient en déduction de l’AAH mois par mois, comme l’explique la page ${h.a('aah-pension-invalidite', 'AAH et pension d’invalidité')}.</p>

<h2>Yasmine et ses revenus de 2024</h2>
<p>Yasmine dépose sa demande en 2026. En 2024, elle avait encore un emploi quelques mois, puis des indemnités ; sa ligne revenu net catégoriel retient un montant que nous arrondissons ici à ${h.eur(yasmine)} de ressources prises en compte. Son plafond, sans enfant, est de ${h.eur(h.P.aah.plafond_annuel)}. Il reste ${h.eur(h.P.aah.plafond_annuel - yasmine)} sous le plafond, soit une AAH estimée de ${h.eur(parAn(h, yasmine).aah, 2)} par mois.</p>
<p>Le décalage de deux ans est le piège principal. Yasmine n’a plus aucun revenu aujourd’hui, mais ses ressources de 2024 réduisent son allocation. À l’inverse, une personne qui a cessé de travailler récemment ou dont la situation a changé doit signaler tout changement à la CAF : service-public rappelle que toute évolution de situation se déclare, car elle peut modifier l’AAH.</p>

<h2>Le plafond selon les enfants à charge</h2>
${h.table(['Enfants à charge', 'Plafond annuel'], [0, 1, 2, 3, 4].map((e) => [String(e), h.eur(h.M.plafondAah(e))]), 'Plafonds de ressources de l’AAH, calcul déconjugalisé, 2026 (calcul du moteur)', ['l', 'r'])}
<p>Chaque enfant à charge au sens des prestations familiales relève le plafond d’environ ${h.eur(h.P.aah.majoration_enfant)}. Les valeurs du tableau de service-public sont arrondies à l’euro, et notre calcul les reproduit ; la page ${h.a('aah-enfants', 'AAH et enfants à charge')} montre l’effet sur l’allocation versée.</p>

<h2>Combien de temps le droit est ouvert</h2>
<p>Le plafond s’apprécie chaque année, mais le droit lui-même est accordé pour une durée fixée par la CDAPH. Avec un taux d’incapacité d’au moins 80 %, l’AAH est attribuée pour 1 à 10 ans, ou à vie si le handicap ne peut pas évoluer favorablement. Avec un taux de 50 à 79 %, la durée est de 1 à 2 ans, ou de 1 à 5 ans lorsque le handicap ne peut pas évoluer favorablement sur la période, selon service-public. Hors attribution à vie, la nouvelle demande se dépose avant la fin de la période, avec le même formulaire et les mêmes pièces que la première fois. Entre deux décisions, ce sont les ressources qui font varier le montant : une année à ${h.eur(9000)} de ressources retenues donne environ ${h.eur(parAn(h, 9000).aah, 2)} par mois, une année sans ressource redonne le maximum.</p>

<h2>Les conditions qui s’ajoutent au plafond</h2>
<p>Rester sous le plafond ne suffit pas. Il faut un taux d’incapacité d’au moins 80 %, ou de 50 à 79 % avec une restriction substantielle et durable d’accès à l’emploi, fixé par la CDAPH. Il faut avoir au moins 20 ans, ou 16 ans si l’on n’est plus à la charge de ses parents pour les prestations familiales. Un ressortissant européen ou étranger doit résider en France depuis plus de 3 mois, sauf s’il travaille, et l’étranger hors Union européenne doit être en situation régulière. Le ${h.a('simulateur-aah', 'simulateur AAH')} part du principe que ces conditions sont remplies.</p>
`,
  },
  en: {
    slug: 'aah-income-ceiling',
    nav: 'AAH income ceiling',
    card: 'The €12,499 yearly ceiling, the income the CAF counts and the reference year it uses.',
    title: 'AAH Income Ceiling 2026: €12,499 a Year, What Counts',
    description: 'AAH income ceiling in 2026: €12,499 a year for a single person, more per child. Income from the 2024 tax notice is used, with a worked example and a calculator.',
    h1: 'The AAH income ceiling: the limit and what it counts',
    intro: 'The AAH ceiling is not a cliff edge: it is the figure your yearly resources are subtracted from to give the allowance.',
    resume: (h) => `To receive the AAH (allocation aux adultes handicapés, France’s allowance for disabled adults) in 2026, a single person with no children must not exceed ${h.eur(h.P.aah.plafond_annuel)} of counted yearly resources. That ceiling equals twelve months of AAH at the ${h.eur(h.P.aah.montant_max, 2)} maximum, and rises by about ${h.eur(h.P.aah.majoration_enfant)} per dependent child. It does not work as an all-or-nothing threshold: monthly AAH is roughly the ceiling minus resources, divided by twelve. With ${h.eur(yasmine)} of counted resources over the year, the estimated allowance is ${h.eur(parAn(h, yasmine).aah, 2)} a month. For a claim made in 2026, service-public.fr says resources are taken from the revenu net catégoriel (net income by category) line of the 2024 tax notice. Wages and pensions count only in part there, rental income in full. Since October 2023, a partner’s income no longer counts. Estimate only; the CAF (family benefits office) sets the entitlement.`,
    faqs: (h) => [
      { q: 'Which income does the CAF compare with the AAH ceiling in 2026?', a: `For a claim made in 2026, the revenu net catégoriel line of your 2024 tax notice (avis d’imposition), according to service-public.fr. It is your own income, not your partner’s, set against the ${h.eur(h.P.aah.plafond_annuel)} ceiling for someone with no children. Wages, pensions and self-employed income count only in part; rental income counts in full.` },
      { q: 'I am €200 over the AAH ceiling, have I lost everything?', a: `For that year the calculated allowance is zero: above ${h.eur(h.P.aah.plafond_annuel)} of counted resources there is nothing left to pay. But just below, AAH is already very small: with ${h.eur(h.P.aah.plafond_annuel - 200)} of resources it would be about ${h.eur(parAn(h, h.P.aah.plafond_annuel - 200).aah, 2)} a month. If your resources fall later, report it: any change of situation must be declared to the CAF.` },
      { q: 'Is the AAH ceiling the same for someone living with a partner?', a: `Yes, under the current method. Since 1 October 2023, someone in a couple has the same ceiling as a single person, ${h.eur(h.P.aah.plafond_annuel)} with no children, because only their own resources count. The old ${h.eur(h.P.aah.plafond_couple_conjugalise)} couple ceiling now applies only where the old method remains more favourable for a couple already receiving AAH.` },
      { q: 'Does rent I receive count towards the AAH ceiling?', a: `Yes, in full. Service-public.fr separates income counted in part, such as wages and pensions, from revenus fonciers, meaning rent from a property you let out, which is counted entirely. A studio let for €400 a month, €4,800 a year, leaves an estimated AAH of ${h.eur(parAn(h, 4800).aah, 2)} if it is your only resource.` },
      { q: 'How long does the MDPH have to answer an AAH claim?', a: 'Four months. According to service-public.fr, the MDPH decision board (CDAPH) replies within that time; silence beyond it counts as an implicit refusal. A refusal is challenged first through a compulsory internal appeal to the MDPH (RAPO) within two months, then before the tribunal judiciaire (civil court) within two months of the answer.' },
    ],
    body: (h) => `
<h2>A ceiling that is also the basis of the sum</h2>
<p>The ${h.src('spAah', 'service-public.fr AAH sheet')} publishes the ceiling as a table. It is not arbitrary: ${h.eur(h.P.aah.plafond_annuel)} is twelve months of the ${h.eur(h.P.aah.montant_max, 2)} maximum uprated by the ${h.src('decretAah2026', 'decree of 30 March 2026')}, rounded to the euro. Hence the rule of thumb: the monthly allowance equals the ceiling minus counted yearly resources, divided by twelve, without exceeding the maximum.</p>
${h.table(['Counted yearly resources', 'Room under the ceiling', 'Estimated monthly AAH'], [0, 3000, yasmine, 9000, 12000].map((r) => [h.eur(r), h.eur(Math.max(0, h.P.aah.plafond_annuel - r)), h.eur(parAn(h, r).aah, 2)]), 'Single person, no children, individualised calculation, 2026 amounts (estimate)', ['r', 'r', 'r'])}
<!--mini:aahPlafondRessources-->

<h2>The resources the CAF counts</h2>
<p>For a claim made in 2026, the reference is the revenu net catégoriel on the 2024 tax notice, that is, income from two years earlier. Service-public.fr then lists categories counted only in part: commercial, craft, professional or farm income, wages and salaries, pensions, life annuities received free of charge, and the guaranteed pay of an Ésat (sheltered work setting). Rental income is counted in full.</p>
<p>For a mainstream wage, the ${h.pct(h.P.aah.abattement_activite.taux_bas, 0)} then ${h.pct(h.P.aah.abattement_activite.taux_haut, 0)} allowance sharply reduces the share counted: see ${h.a('aah-cumul-salaire', 'AAH and wages')}. A pension or annuity, on the other hand, comes off AAH month by month, as the page on ${h.a('aah-pension-invalidite', 'AAH and a disability pension')} explains.</p>

<h2>Yasmine and her 2024 income</h2>
<p>Yasmine claims in 2026. In 2024 she still worked for a few months, then received benefits; her revenu net catégoriel line gives a figure we round here to ${h.eur(yasmine)} of counted resources. Her ceiling, with no children, is ${h.eur(h.P.aah.plafond_annuel)}. That leaves ${h.eur(h.P.aah.plafond_annuel - yasmine)} under the ceiling, an estimated AAH of ${h.eur(parAn(h, yasmine).aah, 2)} a month.</p>
<p>The two-year lag is the main trap. Yasmine has no income today, yet her 2024 resources reduce her allowance. Conversely, anyone who has recently stopped working, or whose situation has changed, should tell the CAF: service-public.fr reminds claimants that any change of situation must be reported, because it may alter AAH. For people who arrived in France recently, the reference year may also show little or no French income at all, which is worth checking on the tax notice.</p>

<h2>The ceiling by number of dependent children</h2>
${h.table(['Dependent children', 'Yearly ceiling'], [0, 1, 2, 3, 4].map((e) => [String(e), h.eur(h.M.plafondAah(e))]), 'AAH resource ceilings, individualised calculation, 2026 (engine calculation)', ['l', 'r'])}
<p>Each child who is a dependant for family benefit purposes raises the ceiling by about ${h.eur(h.P.aah.majoration_enfant)}. The service-public.fr figures are rounded to the euro, and our calculation reproduces them; the page on ${h.a('aah-enfants', 'AAH with dependent children')} shows the effect on the allowance paid.</p>

<h2>How long the entitlement lasts</h2>
<p>The ceiling is checked every year, but the right itself is granted for a period set by the CDAPH. With an impairment rate of at least 80%, AAH is awarded for 1 to 10 years, or for life if the condition cannot improve. With a rate of 50 to 79%, the period is 1 to 2 years, or 1 to 5 years where the condition cannot improve over that time, according to service-public.fr. Unless the award is for life, you file a new claim before the period ends, using the same form and documents as the first time. Between two decisions, resources are what move the amount: a year with ${h.eur(9000)} of counted resources gives about ${h.eur(parAn(h, 9000).aah, 2)} a month, while a year with none brings back the maximum. It helps to note the end date of your award as soon as the decision arrives.</p>

<h2>Conditions on top of the ceiling</h2>
<p>Staying under the ceiling is not enough. You need an impairment rate of at least 80%, or 50 to 79% with a substantial and lasting restriction on access to work, set by the CDAPH. You must be at least 20, or 16 if you are no longer a dependant of your parents for family benefits. EU and other foreign nationals must have lived in France for more than 3 months, unless they work, and non-EU nationals must hold a valid residence permit. The ${h.a('simulateur-aah', 'AAH calculator')} assumes these conditions are met.</p>
`,
  },
});
