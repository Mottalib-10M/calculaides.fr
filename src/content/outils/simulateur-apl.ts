import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Cas types de la page outil : quatre foyers, mêmes loyers et revenus dans les trois zones. */
type Cas = { couple: boolean; enfants: number; loyer: number; revenus: number; fr: string; en: string };
const CAS: Cas[] = [
  { couple: false, enfants: 0, loyer: 500, revenus: 12000, fr: 'Personne seule, 500 €, 12 000 €/an', en: 'Single, €500 rent, €12,000/yr' },
  { couple: true, enfants: 0, loyer: 650, revenus: 18000, fr: 'Couple, 650 €, 18 000 €/an', en: 'Couple, €650 rent, €18,000/yr' },
  { couple: false, enfants: 1, loyer: 600, revenus: 14000, fr: 'Parent isolé, 1 enfant, 600 €, 14 000 €/an', en: 'Single parent, 1 child, €600, €14,000/yr' },
  { couple: true, enfants: 2, loyer: 800, revenus: 26000, fr: 'Couple, 2 enfants, 800 €, 26 000 €/an', en: 'Couple, 2 children, €800, €26,000/yr' },
];
const aide = (h: Helpers, c: Cas, zone: 1 | 2 | 3) => h.M.apl({ zone, couple: c.couple, enfants: c.enfants, loyer: c.loyer, revenusAnnuels: c.revenus }).aide;
const tableau = (h: Helpers, l: 'fr' | 'en') => h.table(
  l === 'fr' ? ['Foyer, loyer hors charges, revenus', 'Zone 1', 'Zone 2', 'Zone 3'] : ['Household, rent excl. charges, income', 'Zone 1', 'Zone 2', 'Zone 3'],
  CAS.map((c) => [c[l], h.eur(aide(h, c, 1)), h.eur(aide(h, c, 2)), h.eur(aide(h, c, 3))]),
  l === 'fr' ? 'Aide au logement mensuelle estimée, barème du 1er octobre 2026, revenus nets imposables des 12 derniers mois' : 'Estimated monthly housing aid, scale of 1 October 2026, taxable net income over the last 12 months',
  ['l', 'r', 'r', 'r'],
);

export default defineGuide({
  id: 'simulateur-apl',
  group: 'logement',
  order: 10,
  tool: 'apl',
  related: ['apl-calcul', 'apl-zone-1', 'apl-famille', 'apl-ressources', 'apl-als-alf'],
  sources: ['spApl', 'arreteApl2026', 'cchD823', 'arreteR0'],
  fr: {
    slug: 'simulateur-apl',
    nav: 'Simulateur APL',
    card: 'L’aide au logement estimée au barème d’octobre 2026, selon la zone, le foyer, le loyer et les revenus.',
    title: 'APL 2026 : simulateur gratuit, montant selon zone et loyer',
    description: 'APL 2026 : estimez gratuitement votre aide au logement au barème du 1er octobre 2026, selon la zone, le loyer, le foyer et vos revenus des 12 derniers mois.',
    h1: 'Simulateur APL : votre aide au logement en une minute',
    intro: 'Zone, foyer, loyer et revenus des douze derniers mois : le simulateur applique la formule des aides au logement et affiche chaque étape.',
    resume: (h) => `Une personne seule qui loue 500 € hors charges en zone 1 avec 12 000 € de revenus nets imposables sur douze mois peut compter sur environ ${h.eur(aide(h, CAS[0], 1))} d’APL par mois au barème revalorisé le 1er octobre 2026. Le même dossier en zone 3 donne ${h.eur(aide(h, CAS[0], 3))}, parce que le loyer plafond y descend à ${h.eur(h.M.loyerPlafond(3, false, 0))} contre ${h.eur(h.M.loyerPlafond(1, false, 0))}. Le simulateur ci-dessus reprend ce calcul pour votre situation : il retient votre loyer dans la limite du plafond de la zone, ajoute le forfait charges, puis retire la participation personnelle qui grandit avec les ressources. Il vaut pour l’APL comme pour l’ALF et l’ALS, qui partagent le même barème en location. Le résultat est une estimation : la CAF calcule le droit sur votre dossier, avec vos revenus réels transmis par les impôts, et ne verse rien sous ${h.eur(h.P.apl.seuil_versement)} par mois.`,
    faqs: (h) => [
      { q: 'Le simulateur APL tient-il compte de la hausse d’octobre 2026 ?', a: `Oui. Les loyers plafonds, le forfait charges et la participation minimale sont ceux de l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')}, en vigueur depuis le 1er octobre 2026. Une personne seule en zone 1 voit ainsi son loyer retenu plafonné à ${h.eur(h.M.loyerPlafond(1, false, 0), 2)}. Seul l’abattement R0 reste à sa dernière valeur publiée, celle de janvier 2025, faute d’arrêté plus récent trouvé lors de notre relevé.` },
      { q: 'Pourquoi le simulateur affiche 0 € alors que je paie un gros loyer ?', a: `Deux raisons possibles. Soit vos ressources font monter la participation personnelle au-dessus du loyer retenu plus les charges ; soit votre loyer réel dépasse ${h.num(h.P.apl.degressivite['1'][1], 0)} fois le plafond en zone 1, ou ${h.num(h.P.apl.degressivite['2'][1], 1)} fois en zones 2 et 3, seuil où l’aide est supprimée. Un résultat inférieur à ${h.eur(h.P.apl.seuil_versement)} est aussi affiché à zéro, puisqu’il n’est pas versé.` },
      { q: 'Ce simulateur APL fonctionne-t-il pour un achat ou une maison de retraite ?', a: 'Non. Il couvre la location d’un logement entier, la colocation et la chambre louée. L’aide à l’accession à la propriété, les établissements comme les Ehpad et le barème exact des logements-foyers suivent d’autres règles que nous ne modélisons pas. Pour ces cas, le simulateur de la CAF et la fiche F12006 de service-public restent la référence.' },
    ],
    body: (h) => `
<h2>Ce que calcule le simulateur</h2>
<p>Le simulateur applique la formule du ${h.src('cchD823', 'code de la construction et de l’habitation')} : loyer retenu, plus forfait charges, moins participation personnelle, moins une minoration forfaitaire de ${h.eur(h.P.apl.minoration)}. Il affiche chaque terme, du loyer plafond de votre zone aux ressources retenues : vous voyez pourquoi l’aide a ce montant. Le détail de chaque terme est expliqué dans ${h.a('apl-calcul', 'la formule de calcul pas à pas')}.</p>

<h2>Quatre foyers, trois zones</h2>
<p>Le tableau applique le simulateur à quatre situations fréquentes. Les montants sont mensuels, pour un logement entier loué vide ou meublé, sans patrimoine important.</p>
${tableau(h, 'fr')}
<p>La famille de deux enfants garde une aide nettement plus haute que le couple sans enfant malgré des revenus supérieurs : chaque personne à charge relève le plafond, le forfait charges et l’abattement sur les ressources. Entre la zone 1 et la zone 3, le couple sans enfant perd ${h.eur(aide(h, CAS[1], 1) - aide(h, CAS[1], 3))} par mois sans que son loyer change. Les pages ${h.a('apl-famille', 'APL avec enfants')} et ${h.a('apl-zone-1', 'APL en zone 1')} détaillent ces écarts.</p>

<h2>Sur quelles données</h2>
<p>Les loyers plafonds, le forfait charges et la participation minimale viennent de l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')}, qui les a relevés au 1er octobre 2026. Les taux de participation et l’abattement R0 viennent de l’${h.src('arreteR0', 'arrêté du 27 septembre 2019')} ; pour R0, nous utilisons la valeur de janvier 2025, la dernière publiée à la date de notre relevé du 9 octobre 2026. Les conditions d’ouverture du droit sont celles de la ${h.src('spApl', 'fiche service-public')} : résidence principale occupée au moins 8 mois par an, logement décent, pas de lien d’ascendance ou de descendance avec le propriétaire.</p>

<h2>Ce qu’il ne sait pas faire</h2>
<p>Le simulateur ne connaît pas votre commune : choisissez la zone vous-même, à l’aide du service officiel de zonage indiqué sur service-public. Il ignore le patrimoine supérieur à 30 000 €, que la CAF ajoute aux ressources, ainsi que les abattements particuliers liés au chômage ou à certaines pensions. Les logements-foyers et résidences sont estimés avec la règle des chambres, ce qui reste une approximation (${h.a('apl-als-alf', 'APL, ALF ou ALS')} précise quelle aide vous concerne). Enfin, la CAF ouvre le droit le mois qui suit la demande : une estimation ne remplace ni le dépôt du dossier ni la notification de la caisse.</p>
`,
  },
  en: {
    slug: 'apl-calculator',
    nav: 'Housing aid calculator',
    card: 'Housing aid (APL) estimated at October 2026 rates, by zone, household, rent and income.',
    title: 'APL 2026: Free French Housing Aid Calculator by Zone',
    description: 'APL 2026: estimate your French housing aid for free, at the rates uprated on 1 October 2026, from your zone, rent, household and income over the last 12 months.',
    h1: 'Housing aid (APL) calculator: your figure in a minute',
    intro: 'Zone, household, rent and the last twelve months of income: the calculator runs the official housing aid formula and shows every step.',
    resume: (h) => `A single person renting for €500 a month excluding charges in zone 1 (Paris and its inner suburbs), with €12,000 of taxable net income over twelve months, can expect about ${h.eur(aide(h, CAS[0], 1))} a month of APL, the personalised housing aid paid by the CAF (the family allowance fund), under the rates uprated on 1 October 2026. The same file in zone 3 gives ${h.eur(aide(h, CAS[0], 3))}, because the rent ceiling there drops to ${h.eur(h.M.loyerPlafond(3, false, 0))} against ${h.eur(h.M.loyerPlafond(1, false, 0))}. The calculator above runs that sum for your own case: it counts your rent up to the zone ceiling, adds a flat allowance for service charges, then subtracts your own contribution, which rises with income. It works for APL and for the two other housing allowances, ALF and ALS, which use the same scale for tenants. The result is an estimate: the CAF sets the entitlement from your file, using income passed on by the tax office, and pays nothing below ${h.eur(h.P.apl.seuil_versement)} a month.`,
    faqs: (h) => [
      { q: 'Does the housing aid calculator include the October 2026 uprating?', a: `Yes. Rent ceilings, the service-charge allowance and the minimum contribution are those of the ${h.src('arreteApl2026', 'order of 28 September 2026')}, in force since 1 October 2026. A single person in zone 1 therefore has rent counted up to ${h.eur(h.M.loyerPlafond(1, false, 0), 2)}. Only the R0 allowance stays at its last published value, from January 2025, as we found no newer order when we checked.` },
      { q: 'Why does the calculator show €0 when my rent is high?', a: `Two possible reasons. Either your income pushes your own contribution above the counted rent plus charges, or your actual rent is more than ${h.num(h.P.apl.degressivite['1'][1], 0)} times the ceiling in zone 1, or ${h.num(h.P.apl.degressivite['2'][1], 1)} times in zones 2 and 3, where the aid is withdrawn. Any result under ${h.eur(h.P.apl.seuil_versement)} also shows as zero, since it is not paid.` },
      { q: 'Can I use this calculator for a home purchase or a care home?', a: 'No. It covers renting a whole home, a flat-share and a rented room. Aid for home buyers, care homes such as Ehpad and the exact scale for approved hostels (logements-foyers) follow other rules that we do not model. For those cases, the CAF simulator and service-public.fr sheet F12006 remain the reference.' },
    ],
    body: (h) => `
<h2>What the calculator works out</h2>
<p>It applies the formula of the ${h.src('cchD823', 'Construction and Housing Code')}: counted rent, plus the charges allowance, minus your own contribution, minus a flat deduction of ${h.eur(h.P.apl.minoration)}. It shows every term, from your zone's rent ceiling to the income counted, so you see why the aid lands where it does. Each term is unpacked in ${h.a('apl-calcul', 'the step-by-step formula')}.</p>

<h2>Four households, three zones</h2>
<p>The table runs the calculator for four common situations. Amounts are monthly, for a whole home rented furnished or unfurnished, with no significant savings or property.</p>
${tableau(h, 'en')}
<p>The family with two children keeps far more aid than the childless couple despite a higher income: each dependent raises the ceiling, the charges allowance and the income deduction. Between zone 1 and zone 3, the childless couple loses ${h.eur(aide(h, CAS[1], 1) - aide(h, CAS[1], 3))} a month for the same rent. The pages on ${h.a('apl-famille', 'housing aid with children')} and ${h.a('apl-zone-1', 'zone 1 housing aid')} explain these gaps.</p>

<h2>The data behind it</h2>
<p>Rent ceilings, the charges allowance and the minimum contribution come from the ${h.src('arreteApl2026', 'order of 28 September 2026')}, which raised them on 1 October 2026. Contribution rates and the R0 allowance come from the ${h.src('arreteR0', 'order of 27 September 2019')}; for R0 we use the January 2025 value, the latest published when we checked on 9 October 2026. Eligibility conditions follow the ${h.src('spApl', 'service-public.fr sheet')}: a main home lived in at least 8 months a year, a decent dwelling, and no parent-child or grandparent link with the landlord.</p>

<h2>What it cannot do</h2>
<p>The calculator does not know your town, so you pick the zone yourself, using the official zoning service linked from service-public.fr. It ignores savings and property above €30,000, which the CAF adds to income, and the special deductions tied to unemployment or some pensions. Approved hostels and residences are estimated with the single-room rule, an approximation (${h.a('apl-als-alf', 'APL, ALF or ALS')} explains which allowance applies to you). Finally, the CAF opens entitlement from the month after your claim: an estimate replaces neither the application nor the fund's decision letter.</p>
`,
  },
});
