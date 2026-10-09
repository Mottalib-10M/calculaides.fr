import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples de la page : couple sans enfant, zone 2, loyer de 650 € hors charges. */
type Z = 1 | 2 | 3;
const cp = (h: Helpers, rev: number, zone: Z = 2, loyer = 650) => h.M.apl({ zone, couple: true, enfants: 0, loyer, revenusAnnuels: rev });
/** Avant l'installation : chacun seul, 400 € de loyer, 7 000 € de revenus. */
const avant = (h: Helpers) => h.M.apl({ zone: 2, couple: false, enfants: 0, loyer: 400, revenusAnnuels: 7000 });
const sortie = (h: Helpers, zone: Z = 2) => h.M.seuilSortieApl({ zone, couple: true, enfants: 0, loyer: 650 });

export default defineGuide({
  id: 'apl-couple',
  group: 'logement',
  order: 40,
  mini: 'aplCouple',
  related: ['simulateur-apl', 'apl-famille', 'apl-colocation', 'apl-als-alf', 'apl-ressources'],
  sources: ['spApl', 'arreteApl2026', 'arreteR0', 'cchD823'],
  fr: {
    slug: 'apl-couple',
    nav: 'APL en couple',
    card: 'Plafond, abattement et taux d’un couple sans enfant, et ce que l’installation à deux fait à l’aide.',
    title: 'APL couple 2026 : montant sans enfant, plafond et revenus',
    description: 'APL couple 2026 : sans enfant, la CAF additionne les revenus des deux et retient un loyer plafond de 359,47 € en zone 2. Montants et seuil de sortie par revenu.',
    h1: 'APL en couple sans enfant : le calcul à deux',
    intro: 'Dès que deux personnes vivent ensemble, la CAF ne voit plus qu’un foyer : un loyer, un plafond, des ressources additionnées.',
    resume: (h) => `Un couple sans enfant qui loue 650 € hors charges en zone 2 et déclare 14 000 € de revenus nets imposables à deux sur douze mois peut toucher environ ${h.eur(cp(h, 14000).aide)} d’APL par mois au barème du 1er octobre 2026. À 18 000 €, l’estimation descend à ${h.eur(cp(h, 18000).aide)}, et l’aide s’arrête vers ${h.eur(sortie(h))} de revenus annuels. Le loyer plafond d’un couple vaut ${h.eur(h.M.loyerPlafond(2, true, 0), 2)} en zone 2, contre ${h.eur(h.M.loyerPlafond(2, false, 0), 2)} pour une personne seule ; l’abattement R0 passe de ${h.eur(h.M.r0(false, 0))} à ${h.eur(h.M.r0(true, 0))}. Ces deux hausses ne compensent pas l’addition des revenus : deux personnes qui touchaient chacune une aide en vivant seules perdent souvent plus de la moitié du total en s’installant ensemble. La CAF compte le conjoint marié, le partenaire de Pacs et le concubin de la même façon, et le forfait charges d’un couple est le même que celui d’une personne seule. Ces chiffres sont des estimations : seule la CAF calcule le droit.`,
    faqs: (h) => [
      { q: 'Mon conjoint gagne bien sa vie, ai-je encore droit à l’APL ?', a: `Rarement. La CAF additionne vos ressources et les siennes sur les douze derniers mois, après l’abattement de ${h.pct(h.P.apl.abattement_frais_pro, 0)}. Pour un couple sans enfant qui paie 650 € en zone 2, l’aide s’éteint vers ${h.eur(sortie(h))} de revenus annuels à deux. Peu importe qui gagne quoi : un seul salaire de 20 000 € et deux salaires de 10 000 € donnent exactement le même montant.` },
      { q: 'On vient d’emménager ensemble, pourquoi notre APL est-elle bien plus faible que nos deux aides d’avant ?', a: `Parce qu’il n’y a plus qu’un loyer retenu et qu’un forfait charges, alors que vos ressources s’ajoutent. Deux personnes seules à 400 € de loyer et 7 000 € de revenus touchent environ ${h.eur(avant(h).aide)} chacune en zone 2, soit ${h.eur(2 * avant(h).aide)} au total. Ensemble dans un logement à 650 €, avec 14 000 € de revenus, elles reçoivent environ ${h.eur(cp(h, 14000).aide)}.` },
      { q: 'Être pacsé ou en concubinage change-t-il le montant de l’APL ?', a: `Non. Selon service-public, les ressources prises en compte sont celles de la personne avec laquelle vous vivez en couple, qu’il s’agisse d’un conjoint, d’un partenaire de Pacs ou d’un concubin. Le barème est identique : plafond couple de ${h.eur(h.M.loyerPlafond(2, true, 0), 2)} en zone 2, abattement R0 de ${h.eur(h.M.r0(true, 0))}. Seul le nom de l’aide peut changer, le mariage sans enfant ouvrant l’ALF plutôt que l’ALS dans un logement non conventionné.` },
      { q: 'À partir de quel revenu un couple sans enfant n’a plus d’APL ?', a: `Pour un loyer de 650 € hors charges, nos estimations placent la sortie vers ${h.eur(sortie(h, 1))} de revenus nets imposables annuels en zone 1, ${h.eur(sortie(h, 2))} en zone 2 et ${h.eur(sortie(h, 3))} en zone 3. Au-delà, l’aide calculée tombe sous ${h.eur(h.P.apl.seuil_versement)} par mois, montant en dessous duquel la CAF ne verse rien. Ces seuils dépendent aussi du loyer : un loyer sous le plafond les abaisse.` },
      { q: 'Faut-il déclarer son concubin à la CAF si chacun paie sa part du loyer ?', a: `Oui. Pour la CAF, deux personnes qui vivent en couple forment un seul foyer, même si chacune règle la moitié du loyer. Le dossier passe alors au plafond couple, ${h.eur(h.M.loyerPlafond(1, true, 0), 2)} en zone 1, et les ressources des deux sont additionnées. Le cas diffère d’une colocation entre amis, où chaque occupant a son propre dossier sur sa part.` },
    ],
    body: (h) => `
<h2>Un foyer, un loyer, deux revenus</h2>
<p>Vivre en couple, pour la CAF, ce n’est pas une question d’état civil. Le ${h.src('spApl', 'service-public')} vise la personne avec laquelle vous vivez en couple, qu’elle soit conjoint, partenaire de Pacs ou concubin. À partir de là, le dossier est unique : une seule demande, le loyer du logement commun, et les ressources des deux membres du couple sur les douze derniers mois, actualisées tous les trois mois. Le patrimoine des deux compte aussi quand il dépasse 30 000 €.</p>
<p>La répartition des revenus entre les deux ne joue aucun rôle. Un couple où une personne gagne 16 000 € et l’autre rien est traité comme un couple où chacun gagne 8 000 €. Ce qui compte, c’est le total, réduit de ${h.pct(h.P.apl.abattement_frais_pro, 0)} et arrondi à la centaine supérieure.</p>

<h2>Les paramètres propres au couple</h2>
<p>Trois valeurs changent quand on passe d’une personne seule à un couple sans personne à charge. Le loyer plafond d’abord, fixé par l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')} : ${h.eur(h.M.loyerPlafond(1, true, 0), 2)} en zone 1, ${h.eur(h.M.loyerPlafond(2, true, 0), 2)} en zone 2, ${h.eur(h.M.loyerPlafond(3, true, 0), 2)} en zone 3. L’abattement R0 ensuite, qui monte à ${h.eur(h.M.r0(true, 0))} par an selon l’${h.src('arreteR0', 'arrêté du 27 septembre 2019')} (valeur de janvier 2025, la dernière publiée). Le taux de participation familial enfin, de ${h.pct(h.M.tauxFamille(true, 0), 2)} contre ${h.pct(h.M.tauxFamille(false, 0), 2)} pour une personne seule.</p>
<p>Un paramètre, lui, ne bouge pas : le forfait charges reste à ${h.eur(h.M.forfaitCharges(true, 0))} par mois, le même montant que pour un locataire seul. Le chauffage et l’eau d’un deux-pièces partagé ne sont donc pas mieux couverts que ceux d’un studio.</p>

<h2>Le montant selon les revenus du ménage</h2>
<p>Le tableau suit un couple qui loue 650 € hors charges en zone 2. Le loyer dépasse le plafond, la CAF retient donc ${h.eur(cp(h, 14000).loyerRetenu, 2)}. Seules les ressources varient.</p>
${h.table(['Revenus nets imposables du couple', 'Ressources retenues', 'Participation mensuelle', 'APL estimée'], [10000, 14000, 18000, 22000].map((r) => [h.eur(r), h.eur(cp(h, r).r), h.eur(cp(h, r).pp), h.eur(cp(h, r).aide)]), 'Couple sans enfant, zone 2, loyer 650 € hors charges, barème du 1er octobre 2026 (estimation)', ['l', 'r', 'r', 'r'])}
<p>Chaque tranche de 1 000 € de revenus annuels supplémentaires retire environ ${h.eur(cp(h, 14000).tp * 1000)} d’aide par mois. La pente est plus forte que pour une personne seule, parce que le taux de participation du couple est plus élevé. Au-delà de ${h.eur(sortie(h))}, il ne reste rien.</p>

<h2>S’installer ensemble : le calcul avant et après</h2>
<p>C’est le moment où beaucoup de couples découvrent la règle. Prenons deux personnes qui vivaient chacune dans un studio à 400 € en zone 2, avec 7 000 € de revenus annuels chacune. Seules, elles touchaient environ ${h.eur(avant(h).aide)} par mois chacune, soit ${h.eur(2 * avant(h).aide)} pour le ménage. Une fois réunies dans un logement à 650 €, avec 14 000 € de ressources communes, l’estimation tombe à ${h.eur(cp(h, 14000).aide)}.</p>
<p>La perte vient de trois effets cumulés : un seul plafond au lieu de deux, un seul forfait charges, et un abattement R0 de couple (${h.eur(h.M.r0(true, 0))}) bien inférieur à deux abattements de personne seule (${h.eur(2 * h.M.r0(false, 0))}). Le loyer total a pourtant baissé de 150 €, ce qui limite la casse sur le budget. La vie commune se déclare à la CAF dès l’emménagement : c’est la date qui fait basculer le dossier au barème du couple.</p>

<h2>Marié, pacsé, concubin : quelle aide, quel nom</h2>
<p>Le montant ne change pas selon le statut du couple, mais l’aide versée peut porter un autre nom. Dans un logement conventionné, c’est l’APL. Hors conventionnement, un couple marié sans enfant relève de l’allocation de logement familiale (ALF), un couple pacsé ou en concubinage de l’allocation de logement sociale (ALS). Toutes suivent le barème de la formule du ${h.src('cchD823', 'code de la construction et de l’habitation')}. La page ${h.a('apl-als-alf', 'APL, ALF ou ALS')} explique la différence.</p>
<p>Quand un enfant arrive, tout bascule : plafond par enfant, forfait charges majoré, R0 relevé. C’est l’objet de la page ${h.a('apl-famille', 'APL avec enfants')}. Pour un couple qui partage un appartement avec d’autres personnes, voir ${h.a('apl-colocation', 'APL en colocation')}.</p>

<h2>Les démarches à deux</h2>
<ul>
<li><strong>Déclarer la mise en couple</strong> dans l’espace allocataire, avec la date d’emménagement commun.</li>
<li><strong>Vérifier que les deux déclarations de revenus sont faites</strong> : la CAF récupère les ressources auprès des impôts, et un revenu manquant bloque le calcul.</li>
<li><strong>Signaler une séparation</strong> aussitôt : chacun peut alors redemander une aide en personne seule.</li>
</ul>
<p>Le ${h.a('simulateur-apl', 'simulateur APL')} gère le couple avec ou sans enfant. Il donne une estimation, et la CAF reste seule juge du droit.</p>
`,
  },
  en: {
    slug: 'couple-housing-aid',
    nav: 'APL for couples',
    card: 'Ceiling, allowance and contribution rate for a childless couple, and what moving in together does to the aid.',
    title: 'APL for Couples 2026: Housing Aid Without Children, Limits',
    description: 'APL for a couple in 2026: with no children, the CAF adds both incomes and counts rent up to €359.47 in zone 2. Monthly amounts and the income where aid stops.',
    h1: 'Housing aid for a couple without children',
    intro: 'As soon as two people live together, the CAF sees a single household: one rent, one ceiling, pooled income.',
    resume: (h) => `A childless couple renting for €650 a month excluding charges in zone 2, with €14,000 of combined taxable net income over the last twelve months, can receive about ${h.eur(cp(h, 14000).aide)} of APL (French housing benefit) a month under the scale in force since 1 October 2026. At €18,000 the estimate falls to ${h.eur(cp(h, 18000).aide)}, and aid ends at around ${h.eur(sortie(h))} of yearly income. A couple’s rent ceiling is ${h.eur(h.M.loyerPlafond(2, true, 0), 2)} in zone 2, against ${h.eur(h.M.loyerPlafond(2, false, 0), 2)} for a single person, and the R0 allowance (an income band the CAF disregards) rises from ${h.eur(h.M.r0(false, 0))} to ${h.eur(h.M.r0(true, 0))}. Neither increase makes up for adding the two incomes together: two people who each received aid while living alone often lose more than half of their combined amount once they move in together. The CAF, the family allowance fund that pays housing aid, treats a spouse, a civil partner and an unmarried partner alike, and the service-charge allowance for a couple equals the single-person one. These are estimates; only the CAF sets the entitlement.`,
    faqs: (h) => [
      { q: 'My partner earns a good salary, can I still get APL?', a: `Seldom. The CAF adds your income and theirs over the last twelve months, after a ${h.pct(h.P.apl.abattement_frais_pro, 0)} allowance for work expenses. For a childless couple paying €650 in zone 2, aid stops at about ${h.eur(sortie(h))} of joint yearly income. Who earns what is irrelevant: one salary of €20,000 and two of €10,000 produce exactly the same amount.` },
      { q: 'We just moved in together, why is our housing aid far lower than our two separate amounts?', a: `Because only one rent and one charges allowance are now counted, while your incomes are pooled. Two single people each paying €400 with €7,000 of income get about ${h.eur(avant(h).aide)} each in zone 2, ${h.eur(2 * avant(h).aide)} in total. Together in a €650 home with €14,000 of income, they receive about ${h.eur(cp(h, 14000).aide)}.` },
      { q: 'Does a Pacs or living together unmarried change the APL amount?', a: `No. Service-public.fr counts the income of the person you live with as a couple, whether spouse, Pacs partner (French civil partnership) or cohabiting partner (concubin). The scale is the same: a couple ceiling of ${h.eur(h.M.loyerPlafond(2, true, 0), 2)} in zone 2 and an R0 allowance of ${h.eur(h.M.r0(true, 0))}. Only the name of the benefit may differ, marriage without children opening ALF rather than ALS in a non-approved home.` },
      { q: 'At what income does a couple without children lose housing aid?', a: `For €650 of rent excluding charges, our estimates put the cut-off at about ${h.eur(sortie(h, 1))} of yearly taxable net income in zone 1, ${h.eur(sortie(h, 2))} in zone 2 and ${h.eur(sortie(h, 3))} in zone 3. Beyond that, the calculated aid drops below ${h.eur(h.P.apl.seuil_versement)} a month, the amount under which the CAF pays nothing. A rent below the ceiling lowers these thresholds.` },
      { q: 'Must I declare my partner to the CAF if we each pay half the rent?', a: `Yes. Two people living as a couple are one household for the CAF, even when each pays half. The file then moves to the couple ceiling, ${h.eur(h.M.loyerPlafond(1, true, 0), 2)} in zone 1, and both incomes are added. It is not the same as a flat-share between friends, where each occupant keeps a separate claim on their own share.` },
    ],
    body: (h) => `
<h2>One household, one rent, two incomes</h2>
<p>For the CAF, being a couple has nothing to do with marital status. ${h.src('spApl', 'Service-public.fr')} refers to the person you live with as a couple, be it a spouse, a Pacs partner or a cohabiting partner. From then on there is one file: a single claim, the rent of the shared home, and both partners’ income over the last twelve months, refreshed every quarter. Savings and property of both also count when their value exceeds €30,000.</p>
<p>How income is split between you does not matter. A couple where one earns €16,000 and the other nothing is assessed like a couple where each earns €8,000. Only the total counts, reduced by ${h.pct(h.P.apl.abattement_frais_pro, 0)} and rounded up to the next hundred euros.</p>

<h2>The figures that apply to couples</h2>
<p>Three values change when a single person becomes a couple with no dependants. First the rent ceiling, set by the ${h.src('arreteApl2026', 'order of 28 September 2026')}: ${h.eur(h.M.loyerPlafond(1, true, 0), 2)} in zone 1 (Paris area), ${h.eur(h.M.loyerPlafond(2, true, 0), 2)} in zone 2 (large cities), ${h.eur(h.M.loyerPlafond(3, true, 0), 2)} in zone 3 (elsewhere). Then the R0 allowance, which rises to ${h.eur(h.M.r0(true, 0))} a year under the ${h.src('arreteR0', 'order of 27 September 2019')} (the January 2025 value, the latest published). Finally the household contribution rate, ${h.pct(h.M.tauxFamille(true, 0), 2)} against ${h.pct(h.M.tauxFamille(false, 0), 2)} for a single person.</p>
<p>One figure stays put: the service-charge allowance is ${h.eur(h.M.forfaitCharges(true, 0))} a month, exactly what a single tenant gets. Heating and water for a shared two-room flat are not covered any better than for a studio.</p>

<h2>The amount at different household incomes</h2>
<p>The table follows a couple paying €650 excluding charges in zone 2. The rent is above the ceiling, so the CAF counts ${h.eur(cp(h, 14000).loyerRetenu, 2)}. Only income changes.</p>
${h.table(['Couple’s taxable net income', 'Resources counted', 'Monthly contribution', 'Estimated APL'], [10000, 14000, 18000, 22000].map((r) => [h.eur(r), h.eur(cp(h, r).r), h.eur(cp(h, r).pp), h.eur(cp(h, r).aide)]), 'Childless couple, zone 2, €650 rent excluding charges, scale of 1 October 2026 (estimate)', ['l', 'r', 'r', 'r'])}
<p>Each extra €1,000 of yearly income removes about ${h.eur(cp(h, 14000).tp * 1000)} of aid a month. The slope is steeper than for a single person because the couple contribution rate is higher. Past ${h.eur(sortie(h))}, nothing is left.</p>

<h2>Moving in together: the sum before and after</h2>
<p>This is when many couples find out how the rule works. Take two people who each rented a €400 studio in zone 2 on €7,000 of yearly income. Living apart, each received about ${h.eur(avant(h).aide)} a month, ${h.eur(2 * avant(h).aide)} for the two. Once together in a €650 flat, with €14,000 of joint resources, the estimate falls to ${h.eur(cp(h, 14000).aide)}.</p>
<p>Three effects stack up: one ceiling instead of two, one charges allowance, and a couple R0 of ${h.eur(h.M.r0(true, 0))}, far below two single allowances (${h.eur(2 * h.M.r0(false, 0))}). Total rent did drop by €150, which softens the blow to the budget. The move must be reported to the CAF from the day you set up home together: that date switches the file to the couple scale.</p>

<h2>Married, Pacs or cohabiting: which benefit, which name</h2>
<p>The amount does not depend on the couple’s status, but the benefit may carry a different name. In an approved home (logement conventionné, typically social housing), it is APL. Outside that, a married couple without children falls under the family housing allowance (ALF), a Pacs or cohabiting couple under the social housing allowance (ALS). All follow the formula of the ${h.src('cchD823', 'Construction and Housing Code')}. The page on ${h.a('apl-als-alf', 'APL, ALF and ALS')} sets out the differences.</p>
<p>A first child changes everything: a ceiling that grows per child, a higher charges allowance, a higher R0. See ${h.a('apl-famille', 'housing aid with children')}. For a couple sharing a flat with other people, see ${h.a('apl-colocation', 'flat-share housing aid')}.</p>

<h2>Steps to take as a couple</h2>
<ul>
<li><strong>Report that you live together</strong> in your online CAF account, with the date you moved in.</li>
<li><strong>Make sure both tax returns are filed</strong>: the CAF takes income figures from the tax office, and a missing one stalls the calculation.</li>
<li><strong>Report a separation</strong> straight away: each of you can then claim again as a single person.</li>
</ul>
<p>The ${h.a('simulateur-apl', 'housing aid calculator')} handles couples with or without children. It gives an estimate; the CAF alone rules on entitlement.</p>
`,
  },
});
