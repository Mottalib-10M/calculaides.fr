import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Cas de la page : personne seule, zone 1, loyer 500 € hors charges. */
const cas = (h: Helpers, revenusAnnuels: number) => h.M.apl({ zone: 1, couple: false, enfants: 0, loyer: 500, revenusAnnuels });
const sortie = (h: Helpers) => h.M.seuilSortieApl({ zone: 1, couple: false, enfants: 0, loyer: 500 });
const paliers = [0, 6000, 9000, 12000, 15000];

export default defineGuide({
  id: 'apl-ressources',
  group: 'logement',
  order: 100,
  mini: 'aplRessources',
  related: ['simulateur-apl', 'apl-calcul', 'apl-salarie', 'apl-couple', 'apl-etudiant'],
  sources: ['spApl', 'spAls', 'arreteR0', 'cchD823'],
  fr: {
    slug: 'apl-ressources',
    nav: 'Ressources APL',
    card: 'Quels revenus la CAF retient pour l’aide au logement, sur quelle période, et ce que coûte chaque euro gagné.',
    title: 'Ressources APL 2026 : 12 mois glissants, abattement de 10 %',
    description: 'Ressources APL 2026 : la CAF retient vos revenus des 12 derniers mois, moins 10 %, arrondis à la centaine, revus chaque trimestre. Effet de 100 € de plus.',
    h1: 'Les ressources retenues pour l’APL : quelle période, quel montant',
    intro: 'Depuis la réforme des aides au logement, la CAF ne regarde plus l’avis d’imposition de l’an passé mais vos revenus récents, et elle les relit tous les trois mois.',
    resume: (h) => `Pour l’APL 2026, la CAF ne retient pas votre revenu fiscal de l’année précédente mais vos revenus des 12 derniers mois glissants, réactualisés chaque trimestre. Elle en retire un abattement forfaitaire de ${h.pct(h.P.apl.abattement_frais_pro, 0)} et arrondit le résultat à la centaine d’euros supérieure : c’est la valeur R de la formule. Avec 12 000 € nets imposables sur un an, R vaut ${h.eur(h.M.ressourcesRetenues(12000).r)}. Au-dessus de l’abattement R0, ${h.eur(h.M.r0(false, 0))} pour une personne seule, chaque centaine d’euros de R retire environ ${h.eur(cas(h, 12000).tp * 100, 2)} d’aide par mois. Une personne seule qui loue 500 € en zone 1 touche ainsi ${h.eur(cas(h, 9000).aide)} avec 9 000 € de revenus, ${h.eur(cas(h, 15000).aide)} avec 15 000 €, et plus rien vers ${h.eur(sortie(h))}. Les ressources du conjoint et des personnes vivant au foyer s’additionnent. Le patrimoine compte s’il dépasse 30 000 €. Ce sont des estimations : la CAF calcule seule le droit.`,
    faqs: (h) => [
      { q: 'J’ai perdu mon emploi, quand mon APL va-t-elle augmenter ?', a: `Pas d’un coup. La période de référence couvre les 12 derniers mois et avance de trois mois à chaque actualisation : les salaires d’avant la perte d’emploi sortent du calcul progressivement. Il faut donc plusieurs trimestres pour que l’aide reflète pleinement la baisse. Avec 15 000 € puis 9 000 € de revenus annuels, notre exemple parisien passe de ${h.eur(cas(h, 15000).aide)} à ${h.eur(cas(h, 9000).aide)} par mois.` },
      { q: 'Dois-je déclarer mes revenus à la CAF chaque trimestre pour l’APL ?', a: `En principe non. Selon service-public, les ressources sont actualisées automatiquement tous les trois mois : la CAF les récupère notamment auprès de l’administration fiscale et de France Travail. Ce n’est pas le cas de la prime d’activité, qui a sa propre déclaration trimestrielle. En revanche, un changement de situation familiale, un déménagement ou une hausse importante de patrimoine se signalent soi-même.` },
      { q: 'Mon livret A est-il pris en compte dans le calcul de l’APL ?', a: `Seulement si votre patrimoine total, celui du conjoint et des personnes vivant au foyer compris, dépasse 30 000 €, indique la fiche officielle sur l’APL. En dessous, l’épargne est ignorée. Au-dessus, la CAF ajoute aux ressources un revenu théorique tiré de ce patrimoine. Notre simulateur ne modélise pas ce revenu fictif : si vous dépassez ce montant, l’aide réelle sera plus faible que l’estimation.` },
      { q: 'Pourquoi 100 € de salaire en plus m’enlèvent-ils parfois plus de 3 € d’APL ?', a: `À cause de l’arrondi. Après l’abattement de ${h.pct(h.P.apl.abattement_frais_pro, 0)}, la CAF arrondit R à la centaine supérieure. Selon où tombent vos revenus, 100 € gagnés peuvent faire franchir une ou deux centaines. Chaque centaine coûte environ ${h.eur(cas(h, 12000).tp * 100, 2)} d’aide mensuelle dans notre exemple, soit près de ${h.eur(cas(h, 12000).tp * 1200, 0)} sur une année.` },
      { q: 'Les revenus de mon colocataire réduisent-ils mon APL ?', a: `Non. En colocation, chacun dépose sa propre demande et déclare ses revenus personnels, comme le précise service-public. Seules s’additionnent les ressources des membres de votre foyer : conjoint, partenaire de Pacs, concubin et personnes à charge. Un colocataire avec qui vous ne formez pas un couple n’entre pas dans votre R, même s’il gagne bien plus que vous.` },
      { q: 'L’APL elle-même compte-t-elle dans mes ressources pour l’APL ?', a: `Non, l’aide au logement n’entre pas dans la base R qui sert à la calculer, ce serait circulaire. Les salaires, allocations chômage, pensions et revenus de remplacement imposables y figurent. L’abattement R0, ${h.eur(h.M.r0(false, 0))} pour une personne seule et ${h.eur(h.M.r0(true, 0))} pour un couple sans enfant, protège ensuite la première tranche de ces ressources.` },
    ],
    body: (h) => `
<h2>Une fenêtre de douze mois qui glisse tous les trimestres</h2>
<p>La fiche ${h.src('spApl', 'service-public sur l’APL')} le dit en deux phrases : l’ensemble des ressources des personnes du foyer est pris en compte sur les 12 derniers mois, et ces ressources sont actualisées automatiquement tous les trois mois. La même règle vaut pour l’${h.src('spAls', 'allocation de logement sociale')}. Concrètement, l’aide d’un trimestre est calculée sur une année qui se termine peu avant, puis la fenêtre avance de trois mois.</p>
<p>Cette mécanique a deux effets. Une hausse de salaire ne réduit pas l’aide du jour au lendemain, elle la rogne trimestre après trimestre. Une baisse de revenus, à l’inverse, ne se traduit qu’avec retard par une aide plus forte. Pour un CDD qui s’arrête ou une reprise d’emploi, il faut raisonner sur quatre trimestres, pas sur un mois.</p>

<h2>Du revenu déclaré à la valeur R</h2>
<p>Trois opérations transforment vos revenus en ressources retenues.</p>
<ol>
<li><strong>L’addition.</strong> Vos revenus nets imposables, ceux de votre conjoint et ceux des personnes à charge qui en ont.</li>
<li><strong>L’abattement de ${h.pct(h.P.apl.abattement_frais_pro, 0)}.</strong> C’est la déduction forfaitaire pour frais professionnels, appliquée aux salaires. Notre outil l’applique à tous les revenus saisis, ce qui peut flatter légèrement l’estimation si une partie de vos ressources n’y a pas droit.</li>
<li><strong>L’arrondi.</strong> Le résultat monte à la centaine d’euros supérieure, comme le prévoit le barème : 10 801 € deviennent ${h.eur(Math.ceil(10801 / h.P.apl.arrondi_ressources) * h.P.apl.arrondi_ressources)}.</li>
</ol>
<p>Ensuite seulement intervient l’abattement R0 de l’${h.src('arreteR0', 'arrêté du 27 septembre 2019')} : la part de R qui le dépasse est multipliée par le taux de participation. Pour une personne seule, R0 vaut ${h.eur(h.M.r0(false, 0))}, pour un couple sans enfant ${h.eur(h.M.r0(true, 0))}, pour un foyer avec un enfant ${h.eur(h.M.r0(false, 1))}.</p>

<h2>Ce que coûtent les revenus, palier par palier</h2>
<p>Le tableau suit une personne seule qui loue 500 € hors charges en zone 1. Seuls ses revenus changent.</p>
${h.table(['Revenus nets imposables sur 12 mois', 'R retenu', 'APL estimée'], paliers.map((r) => [h.eur(r), h.eur(cas(h, r).r), h.eur(cas(h, r).aide)]), 'Personne seule, zone 1, loyer 500 €, barème du 1er octobre 2026 (estimation)', ['r', 'r', 'r'])}
<p>La pente est presque régulière : environ ${h.eur(cas(h, 12000).tp * 1000)} d’aide mensuelle en moins pour 1 000 € de ressources retenues en plus. Avec zéro revenu, l’aide n’est pourtant pas illimitée : la participation minimale de ${h.eur(h.P.apl.p0_min, 2)} reste due. Au bout de la courbe, l’aide passe sous ${h.eur(h.P.apl.seuil_versement)} et n’est plus versée, vers ${h.eur(sortie(h))} de revenus dans ce cas.</p>
<!--mini:aplRessources-->

<h2>Le patrimoine, l’autre ressource</h2>
<p>Au-delà de 30 000 € de patrimoine immobilier et financier pour l’ensemble du foyer, la CAF ajoute aux ressources une estimation du revenu qu’il pourrait produire. Un livret bien rempli, une résidence secondaire ou un terrain peuvent ainsi réduire l’aide alors que les salaires sont modestes. Notre moteur ne le calcule pas : si vous êtes concerné, prenez l’estimation comme un maximum.</p>

<h2>Les cas où les règles s’écartent</h2>
<p>Les étudiants sont traités à part : la CAF leur applique un forfait de ressources même s’ils déclarent moins, comme l’explique la page ${h.a('apl-etudiant', 'APL étudiant')}. Un couple additionne ses revenus et bénéficie d’un R0 plus élevé, ce que détaille ${h.a('apl-couple', 'l’APL en couple')}. Pour un salarié seul qui cherche où l’aide s’arrête selon sa ville, voir ${h.a('apl-salarie', 'l’APL d’un salarié')}.</p>
<p>La place de R dans la formule, entre P0, TF et TL, est déroulée sur ${h.a('apl-calcul', 'le calcul de l’APL pas à pas')}. Le ${h.a('simulateur-apl', 'simulateur APL')} reprend tout avec votre composition familiale. Seule la CAF fixe le droit, sur les ressources qu’elle a réellement reçues.</p>
`,
  },
  en: {
    slug: 'housing-aid-income',
    nav: 'Income for APL',
    card: 'Which income the CAF counts for housing aid, over which period, and what each euro earned costs you.',
    title: 'APL Income Rules 2026: 12 Rolling Months, 10% Allowance',
    description: 'APL income rules for 2026: the CAF counts the last 12 months of income, minus 10%, rounded up to the next hundred, reviewed each quarter. What €100 more costs.',
    h1: 'The income counted for housing aid: which months, which amount',
    intro: 'Since France reformed housing aid, the CAF no longer reads last year’s tax notice: it looks at your recent income and re-reads it every three months.',
    resume: (h) => `For APL in 2026, the CAF (the family allowance fund that pays housing aid) does not use your income from the previous tax year. It uses the last 12 rolling months, refreshed every quarter. It removes a flat ${h.pct(h.P.apl.abattement_frais_pro, 0)} allowance, then rounds the result up to the next hundred euros: that is the value R in the formula. With €12,000 of taxable net income (revenu net imposable) over a year, R is ${h.eur(h.M.ressourcesRetenues(12000).r)}. Above the R0 allowance, ${h.eur(h.M.r0(false, 0))} for a single person, every hundred euros of R takes about ${h.eur(cas(h, 12000).tp * 100, 2)} off the monthly aid. A single person renting for €500 in zone 1 (Paris and its inner suburbs) gets ${h.eur(cas(h, 9000).aide)} on €9,000 of income, ${h.eur(cas(h, 15000).aide)} on €15,000, and nothing from around ${h.eur(sortie(h))}. A partner's income and that of others in the household are added together, and savings count above €30,000. These are estimates; only the CAF decides.`,
    faqs: (h) => [
      { q: 'I lost my job, when will my housing aid go up?', a: `Not all at once. The reference period covers the last 12 months and moves forward three months at each review, so pay from before the job loss drops out gradually. It takes several quarters for the aid to fully reflect the fall. Going from €15,000 to €9,000 of yearly income, our Paris example moves from ${h.eur(cas(h, 15000).aide)} to ${h.eur(cas(h, 9000).aide)} a month.` },
      { q: 'Do I have to report my income to the CAF every quarter for APL?', a: `Normally no. According to service-public.fr, income is updated automatically every three months, with the CAF collecting it from the tax authority and France Travail (the public employment service), among others. The activity bonus (prime d'activité) is different and has its own quarterly return. A change in family situation, a move or a large rise in savings must still be reported by you.` },
      { q: 'Does my savings account count towards housing aid?', a: `Only if your total assets, including those of your partner and anyone living in the household, exceed €30,000, according to the official APL sheet. Below that, savings are ignored. Above it, the CAF adds a notional income from those assets to your resources. Our calculator does not model that notional income, so if you are above the threshold, your real aid will be lower than the estimate.` },
      { q: 'Why can €100 more pay cost me more than €3 of housing aid?', a: `Because of rounding. After the ${h.pct(h.P.apl.abattement_frais_pro, 0)} allowance, the CAF rounds R up to the next hundred. Depending on where your income falls, €100 earned can push R over one or two hundreds. Each hundred costs about ${h.eur(cas(h, 12000).tp * 100, 2)} of monthly aid in our example, close to ${h.eur(cas(h, 12000).tp * 1200, 0)} over a year.` },
      { q: 'Does my flatmate’s income reduce my housing aid?', a: `No. In a flat-share, each person files their own claim and reports their own income, as service-public.fr explains. Only the income of your household is added up: spouse, civil partner (Pacs), cohabiting partner and dependants. A flatmate you are not in a couple with stays out of your R, even if they earn far more than you.` },
      { q: 'Is housing aid itself counted as income for housing aid?', a: `No, the aid does not enter the R base used to calculate it, which would be circular. Taxable pay, unemployment benefit, pensions and other taxable replacement income do. The R0 allowance, ${h.eur(h.M.r0(false, 0))} for a single person and ${h.eur(h.M.r0(true, 0))} for a couple without children, then shields the first slice of that income.` },
    ],
    body: (h) => `
<h2>A twelve-month window that slides every quarter</h2>
<p>The ${h.src('spApl', 'service-public.fr page on APL')} says it in two sentences: the income of everyone in the household is counted over the last 12 months, and it is updated automatically every three months. The same applies to the ${h.src('spAls', 'social housing allowance (ALS)')}. In practice, the aid for a given quarter is worked out on a year that ended shortly before, then the window moves forward by three months.</p>
<p>That has two effects. A pay rise does not cut your aid overnight; it trims it quarter after quarter. A drop in income only shows up as higher aid after a delay. If a fixed-term contract ends or you go back to work, think in terms of four quarters, not one month.</p>

<h2>From declared income to the value R</h2>
<p>Three steps turn your income into the figure the CAF uses.</p>
<ol>
<li><strong>Adding up.</strong> Your taxable net income, your partner's, and that of any dependant who earns.</li>
<li><strong>The ${h.pct(h.P.apl.abattement_frais_pro, 0)} allowance.</strong> This is the flat deduction for work expenses, applied to earnings. Our tool applies it to all income entered, which may slightly flatter the estimate if part of your income does not qualify.</li>
<li><strong>Rounding.</strong> The result goes up to the next hundred euros, as the scale requires: €10,801 becomes ${h.eur(Math.ceil(10801 / h.P.apl.arrondi_ressources) * h.P.apl.arrondi_ressources)}.</li>
</ol>
<p>Only then does the R0 allowance from the ${h.src('arreteR0', 'order of 27 September 2019')} come in: the part of R above it is multiplied by the contribution rate. R0 is ${h.eur(h.M.r0(false, 0))} for a single person, ${h.eur(h.M.r0(true, 0))} for a couple without children and ${h.eur(h.M.r0(false, 1))} for a household with one child.</p>

<h2>What income costs, step by step</h2>
<p>The table follows one single person renting for €500 excluding charges in zone 1. Only the income changes.</p>
${h.table(['Taxable net income over 12 months', 'R counted', 'Estimated APL'], paliers.map((r) => [h.eur(r), h.eur(cas(h, r).r), h.eur(cas(h, r).aide)]), 'Single person, zone 1, €500 rent, scale of 1 October 2026 (estimate)', ['r', 'r', 'r'])}
<p>The slope is almost even: about ${h.eur(cas(h, 12000).tp * 1000)} of monthly aid lost for every €1,000 of extra counted income. With no income at all, the aid is still capped, since the minimum contribution of ${h.eur(h.P.apl.p0_min, 2)} remains. At the far end, aid drops below ${h.eur(h.P.apl.seuil_versement)} and is no longer paid, at around ${h.eur(sortie(h))} of income here.</p>
<!--mini:aplRessources-->

<h2>Savings and property, the other resource</h2>
<p>Above €30,000 of property and financial assets across the household, the CAF adds an estimate of the income those assets could produce. A well-stocked savings account, a second home or a plot of land can therefore reduce the aid even when wages are modest. Our engine does not calculate this: if it applies to you, treat the estimate as a ceiling.</p>

<h2>Where the rules differ</h2>
<p>Students are handled separately: the CAF applies a flat-rate income even if they declare less, as the ${h.a('apl-etudiant', 'student APL')} page explains. A couple adds both incomes and gets a higher R0, covered in ${h.a('apl-couple', 'housing aid for couples')}. For a single employee wondering where aid stops in their city, see ${h.a('apl-salarie', 'housing aid for employees')}.</p>
<p>Where R sits in the formula, alongside P0, TF and TL, is set out in ${h.a('apl-calcul', 'the APL calculation step by step')}. The ${h.a('simulateur-apl', 'APL calculator')} handles everything with your own household. Only the CAF decides your entitlement, based on the income it has actually received.</p>
`,
  },
});
