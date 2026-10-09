import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples de la page : zone 2 ; couple à 24 000 € et 800 € de loyer ; parent seul à 14 000 € et 700 €. */
const cpl = (h: Helpers, n: number) => h.M.apl({ zone: 2, couple: true, enfants: n, loyer: 800, revenusAnnuels: 24000 });
const iso = (h: Helpers, n: number) => h.M.apl({ zone: 2, couple: false, enfants: n, loyer: 700, revenusAnnuels: 14000 });
const sortieCpl = (h: Helpers, n: number) => h.M.seuilSortieApl({ zone: 2, couple: true, enfants: n, loyer: 800 });
const parEnfant = (h: Helpers, z: '1' | '2' | '3' = '2') => h.P.apl.loyers_plafonds[z].par_enfant;

export default defineGuide({
  id: 'apl-famille',
  group: 'logement',
  order: 50,
  mini: 'aplFamille',
  related: ['simulateur-apl', 'apl-couple', 'apl-zone-2', 'apl-als-alf', 'apl-ressources'],
  sources: ['spApl', 'arreteApl2026', 'arreteR0', 'cchD823'],
  fr: {
    slug: 'apl-famille',
    nav: 'APL avec enfants',
    card: 'Ce que chaque enfant ajoute au plafond, au forfait charges et à l’abattement, pour un couple ou un parent seul.',
    title: 'APL famille 2026 : montant avec enfants, plafond par enfant',
    description: 'APL avec enfants 2026 : dès le 2e enfant, le plafond monte de 58,88 € par enfant en zone 2 ; chaque enfant ajoute 13,90 € de charges. Montants de 1 à 4 enfants.',
    h1: 'APL avec enfants : ce que change chaque personne à charge',
    intro: 'Un enfant de plus, c’est un plafond plus haut, un forfait charges majoré et une participation plus faible : l’aide monte vite avec la taille de la famille.',
    resume: (h) => `Un couple avec deux enfants qui loue 800 € hors charges en zone 2 et déclare 24 000 € de revenus nets imposables sur douze mois peut toucher environ ${h.eur(cpl(h, 2).aide)} d’APL par mois au barème du 1er octobre 2026. Avec un seul enfant, l’estimation n’est que de ${h.eur(cpl(h, 1).aide)} ; avec trois, elle atteint ${h.eur(cpl(h, 3).aide)}. Chaque personne à charge agit sur quatre leviers. Le loyer plafond grimpe de ${h.eur(parEnfant(h), 2)} par enfant au-delà du premier en zone 2. Le forfait charges gagne ${h.eur(h.P.apl.forfait_charges.par_enfant, 2)} par enfant. L’abattement R0 augmente, de ${h.eur(h.M.r0(true, 0))} pour un couple sans enfant à ${h.eur(h.M.r0(true, 2))} avec deux enfants. Le taux de participation baisse enfin, de ${h.pct(h.M.tauxFamille(true, 1), 2)} à ${h.pct(h.M.tauxFamille(true, 4), 2)} entre un et quatre enfants. Un parent seul avec un enfant, 14 000 € de revenus et 700 € de loyer reçoit environ ${h.eur(iso(h, 1).aide)}. Ces montants sont des estimations : seule la CAF calcule le droit.`,
    faqs: (h) => [
      { q: 'Combien d’APL en plus pour un troisième enfant ?', a: `Dans notre exemple de couple en zone 2, avec 24 000 € de revenus et 800 € de loyer, l’aide passe de ${h.eur(cpl(h, 2).aide)} à ${h.eur(cpl(h, 3).aide)} par mois, soit ${h.eur(cpl(h, 3).aide - cpl(h, 2).aide)} de plus. Le plafond monte de ${h.eur(parEnfant(h), 2)}, le forfait charges de ${h.eur(h.P.apl.forfait_charges.par_enfant, 2)}, l’abattement R0 passe à ${h.eur(h.M.r0(true, 3))} et le taux de participation tombe à ${h.pct(h.M.tauxFamille(true, 3), 2)}.` },
      { q: 'Mes enfants sont en garde alternée, qui touche l’APL ?', a: `Les deux parents. Selon service-public, en résidence alternée chaque parent peut compter les enfants pour les jours où il les accueille. Chacun dépose donc sa demande pour son propre logement, avec ses propres ressources. L’enfant ne disparaît pas du calcul de l’un au profit de l’autre : il est partagé, ce qui évite qu’un des deux logements soit traité comme celui d’une personne seule.` },
      { q: 'Je suis enceinte et seule, puis-je déjà toucher une aide au logement familiale ?', a: `Oui, sous forme d’ALF quand le logement n’est pas conventionné. Selon la fiche service-public de l’ALF, une femme enceinte seule sans personne à charge y a droit à partir du 1er jour du mois civil qui suit le 4e mois de grossesse, jusqu’au mois de la naissance. Le montant suit le barème commun : ${h.eur(h.M.loyerPlafond(2, false, 0), 2)} de plafond en zone 2 tant que l’enfant n’est pas né.` },
      { q: 'Avec quatre enfants, jusqu’à quel revenu garde-t-on l’APL ?', a: `Pour un couple de quatre enfants qui paie 800 € hors charges en zone 2, notre estimation place la fin de l’aide vers ${h.eur(sortieCpl(h, 4))} de revenus nets imposables annuels, contre ${h.eur(sortieCpl(h, 1))} avec un seul enfant. L’écart vient de l’abattement R0 plus élevé et du taux de participation plus bas. Au-dessous de ${h.eur(h.P.apl.seuil_versement)} par mois, la CAF ne verse rien.` },
      { q: 'Un parent qui élève seul ses enfants a-t-il un plafond plus élevé qu’un couple ?', a: `Non, le loyer plafond dépend du nombre de personnes à charge, pas de la présence d’un conjoint : ${h.eur(h.M.loyerPlafond(2, false, 2), 2)} en zone 2 pour deux enfants, dans les deux cas. Ce qui change, ce sont les ressources : un seul revenu au lieu de deux. Un parent seul avec deux enfants, 14 000 € de revenus et 700 € de loyer touche environ ${h.eur(iso(h, 2).aide)} par mois.` },
    ],
    body: (h) => `
<h2>Quatre paramètres qui bougent à chaque naissance</h2>
<p>La formule du ${h.src('cchD823', 'code de la construction et de l’habitation')} est la même pour tous les ménages, mais presque toutes ses valeurs dépendent du nombre de personnes à charge. Pour une famille, l’aide se joue donc autant sur la composition du foyer que sur les revenus.</p>
<h3>Le loyer plafond</h3>
<p>L’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')} fixe un plafond pour un enfant, puis une majoration par enfant supplémentaire : ${h.eur(h.M.loyerPlafond(1, true, 1), 2)} puis ${h.eur(parEnfant(h, '1'), 2)} de plus par enfant en zone 1, ${h.eur(h.M.loyerPlafond(2, true, 1), 2)} puis ${h.eur(parEnfant(h, '2'), 2)} en zone 2, ${h.eur(h.M.loyerPlafond(3, true, 1), 2)} puis ${h.eur(parEnfant(h, '3'), 2)} en zone 3.</p>
<h3>Le forfait charges</h3>
<p>Il part de ${h.eur(h.P.apl.forfait_charges.base, 2)} et gagne ${h.eur(h.P.apl.forfait_charges.par_enfant, 2)} par personne à charge. Une famille de trois enfants reçoit ainsi ${h.eur(h.M.forfaitCharges(true, 3), 2)} au titre des charges, quel que soit le montant réel de ses factures.</p>
<h3>L’abattement R0 et le taux familial</h3>
<p>L’${h.src('arreteR0', 'arrêté du 27 septembre 2019')} relève l’abattement R0 avec chaque personne à charge : ${h.eur(h.M.r0(true, 1))} pour une, ${h.eur(h.M.r0(true, 2))} pour deux, ${h.eur(h.M.r0(true, 3))} pour trois (valeurs de janvier 2025, dernières publiées). Le taux familial, qui fixe la pente de la participation, décroît au contraire : ${h.pct(h.M.tauxFamille(true, 1), 2)} avec un enfant, ${h.pct(h.M.tauxFamille(true, 2), 2)} avec deux, ${h.pct(h.M.tauxFamille(true, 3), 2)} avec trois.</p>

<h2>De un à quatre enfants : le même couple, la même ville</h2>
<p>Le tableau fixe tout sauf le nombre d’enfants : un couple en zone 2, 800 € de loyer hors charges, 24 000 € de revenus nets imposables sur l’année.</p>
${h.table(['Enfants', 'Loyer plafond', 'Forfait charges', 'Participation', 'APL estimée', 'Fin de l’aide vers'], [1, 2, 3, 4].map((n) => [String(n), h.eur(cpl(h, n).plafond, 2), h.eur(cpl(h, n).charges, 2), h.eur(cpl(h, n).pp), h.eur(cpl(h, n).aide), h.eur(sortieCpl(h, n))]), 'Couple, zone 2, loyer 800 €, 24 000 € de revenus annuels, barème du 1er octobre 2026 (estimation)', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>La progression n’est pas linéaire. Le premier enfant ajoute peu, car à 24 000 € de revenus la participation reste lourde. Ensuite, la baisse de la participation et la hausse du plafond se combinent : le deuxième et le troisième enfant rapportent chacun plus de 100 € par mois dans cet exemple, le quatrième un peu moins. Même avec quatre enfants, le plafond de ${h.eur(cpl(h, 4).plafond, 2)} reste sous le loyer de 800 € : c’est lui, et non le loyer payé, qui fixe l’aide des familles nombreuses dans un logement de taille courante.</p>
<!--mini:aplFamille-->

<h2>Le parent qui élève seul ses enfants</h2>
<p>Le barème ne prévoit pas de plafond spécifique au parent isolé : à nombre d’enfants égal, il retient le même loyer plafond et le même forfait charges qu’un couple. L’avantage vient de l’abattement, puisque l’abattement R0 avec personnes à charge est identique avec ou sans conjoint, alors qu’il n’y a qu’un revenu à déclarer. Un parent seul avec 14 000 € de revenus et 700 € de loyer en zone 2 touche environ ${h.eur(iso(h, 1).aide)} avec un enfant, ${h.eur(iso(h, 2).aide)} avec deux et ${h.eur(iso(h, 3).aide)} avec trois.</p>

<h2>Garde alternée, grossesse, enfant qui part</h2>
<p>En résidence alternée, le ${h.src('spApl', 'service-public')} prévoit que chaque parent compte les enfants pour ses jours de garde. Les deux logements sont donc reconnus comme des logements familiaux, chacun avec sa propre demande et ses propres ressources.</p>
<p>Pendant la grossesse, une femme seule sans autre personne à charge peut relever de l’allocation de logement familiale (ALF) à partir du mois civil qui suit le 4e mois, si le logement n’est pas conventionné. Le calcul reste toutefois celui d’une personne seule jusqu’à la naissance.</p>
<p>Quand un enfant quitte le foyer ou n’est plus à charge, le plafond, le forfait et l’abattement redescendent d’un cran : l’aide peut baisser nettement même si les revenus n’ont pas bougé. Mieux vaut l’anticiper en refaisant une simulation.</p>
<p>Les personnes à charge ne sont pas toujours des enfants. La fiche service-public de l’ALF cite aussi un ascendant de plus de 65 ans (60 ans s’il est inapte au travail) dont les ressources ne dépassent pas le plafond de l’Aspa, ou un proche atteint d’une incapacité d’au moins 80 %. Un parent âgé hébergé chez vous peut ainsi faire monter le plafond et le forfait charges comme le ferait un enfant.</p>

<h2>APL ou ALF : le nom change, pas le barème</h2>
<p>Dans un logement conventionné, la famille touche l’APL. Ailleurs, elle touche le plus souvent l’ALF, ouverte notamment aux allocataires de prestations familiales et aux ménages ayant un enfant à charge. Les deux suivent la même formule. Les détails sont sur la page ${h.a('apl-als-alf', 'APL, ALF ou ALS')}, et le cas des familles des grandes agglomérations sur ${h.a('apl-zone-2', 'l’APL en zone 2')}.</p>
<p>Le ${h.a('simulateur-apl', 'simulateur APL')} tient compte du nombre de personnes à charge. Ses résultats restent des estimations : la CAF calcule le droit sur le dossier de la famille.</p>
`,
  },
  en: {
    slug: 'family-housing-aid',
    nav: 'APL with children',
    card: 'What each child adds to the ceiling, the charges allowance and the income allowance, for couples and single parents.',
    title: 'APL with Children 2026: Family Housing Aid, Per-Child Limits',
    description: 'APL for families in 2026: from the 2nd child, the zone 2 rent ceiling rises €58.88 per child, each child adds €13.90 for charges. Amounts for 1 to 4 children.',
    h1: 'Housing aid with children: what each dependant changes',
    intro: 'One more child means a higher ceiling, a bigger charges allowance and a smaller own contribution, so the aid climbs quickly with family size.',
    resume: (h) => `A couple with two children renting for €800 a month excluding charges in zone 2, with €24,000 of taxable net income over the last twelve months, can receive about ${h.eur(cpl(h, 2).aide)} of APL (French housing benefit) a month under the scale in force since 1 October 2026. With one child the estimate is only ${h.eur(cpl(h, 1).aide)}; with three it reaches ${h.eur(cpl(h, 3).aide)}. Every dependant pulls four levers. The rent ceiling rises by ${h.eur(parEnfant(h), 2)} for each child after the first in zone 2. The flat charges allowance gains ${h.eur(h.P.apl.forfait_charges.par_enfant, 2)} per child. The R0 allowance, an income band the CAF ignores, goes from ${h.eur(h.M.r0(true, 0))} for a childless couple to ${h.eur(h.M.r0(true, 2))} with two children. And the contribution rate falls, from ${h.pct(h.M.tauxFamille(true, 1), 2)} with one child to ${h.pct(h.M.tauxFamille(true, 4), 2)} with four. A single parent with one child, €14,000 of income and €700 of rent gets about ${h.eur(iso(h, 1).aide)}. These are estimates; only the CAF, the family allowance fund, decides the entitlement.`,
    faqs: (h) => [
      { q: 'How much more housing aid do we get for a third child?', a: `In our zone 2 couple example, on €24,000 of income and €800 of rent, aid moves from ${h.eur(cpl(h, 2).aide)} to ${h.eur(cpl(h, 3).aide)} a month, an extra ${h.eur(cpl(h, 3).aide - cpl(h, 2).aide)}. The ceiling rises by ${h.eur(parEnfant(h), 2)}, the charges allowance by ${h.eur(h.P.apl.forfait_charges.par_enfant, 2)}, the R0 allowance reaches ${h.eur(h.M.r0(true, 3))} and the contribution rate drops to ${h.pct(h.M.tauxFamille(true, 3), 2)}.` },
      { q: 'Our children live with each of us alternately, which parent gets the APL?', a: `Both. According to service-public.fr, with shared residence (résidence alternée) each parent can count the children for the days they look after them. Each files a claim for their own home, on their own income. The child is not moved from one claim to the other but shared, so neither home ends up assessed as a single person’s flat.` },
      { q: 'I am pregnant and living alone, can I already get family housing aid?', a: `Yes, as ALF (family housing allowance) when the home is not an approved one. The ALF sheet on service-public.fr opens it to a woman living alone with no dependants from the first day of the calendar month after the fourth month of pregnancy until the month of birth. The amount follows the common scale: a ${h.eur(h.M.loyerPlafond(2, false, 0), 2)} ceiling in zone 2 until the baby arrives.` },
      { q: 'With four children, up to what income do we keep housing aid?', a: `For a couple with four children paying €800 excluding charges in zone 2, our estimate puts the end of aid at about ${h.eur(sortieCpl(h, 4))} of yearly taxable net income, against ${h.eur(sortieCpl(h, 1))} with one child. The difference comes from the higher R0 allowance and the lower contribution rate. Below ${h.eur(h.P.apl.seuil_versement)} a month, the CAF pays nothing.` },
      { q: 'Does a single parent get a higher rent ceiling than a couple?', a: `No. The ceiling depends on the number of dependants, not on whether there is a partner: ${h.eur(h.M.loyerPlafond(2, false, 2), 2)} in zone 2 for two children either way. What differs is income, one salary instead of two. A single parent with two children, €14,000 of income and €700 of rent receives about ${h.eur(iso(h, 2).aide)} a month.` },
    ],
    body: (h) => `
<h2>Four figures that move with each birth</h2>
<p>The formula in the ${h.src('cchD823', 'Construction and Housing Code')} is the same for every household, yet nearly all its values depend on the number of dependants (personnes à charge). For a family, the aid turns on household make-up as much as on income.</p>
<h3>The rent ceiling</h3>
<p>The ${h.src('arreteApl2026', 'order of 28 September 2026')} sets a ceiling for one child, then an increase for each further child: ${h.eur(h.M.loyerPlafond(1, true, 1), 2)} plus ${h.eur(parEnfant(h, '1'), 2)} per extra child in zone 1 (Paris area), ${h.eur(h.M.loyerPlafond(2, true, 1), 2)} plus ${h.eur(parEnfant(h, '2'), 2)} in zone 2 (large cities), ${h.eur(h.M.loyerPlafond(3, true, 1), 2)} plus ${h.eur(parEnfant(h, '3'), 2)} in zone 3.</p>
<h3>The charges allowance</h3>
<p>It starts at ${h.eur(h.P.apl.forfait_charges.base, 2)} and adds ${h.eur(h.P.apl.forfait_charges.par_enfant, 2)} per dependant. A family of three children is credited with ${h.eur(h.M.forfaitCharges(true, 3), 2)} for service charges, whatever their real bills.</p>
<h3>The R0 allowance and the family rate</h3>
<p>The ${h.src('arreteR0', 'order of 27 September 2019')} raises the R0 allowance with each dependant: ${h.eur(h.M.r0(true, 1))} for one, ${h.eur(h.M.r0(true, 2))} for two, ${h.eur(h.M.r0(true, 3))} for three (January 2025 values, the latest published). The family rate, which sets how steeply your contribution grows with income, goes the other way: ${h.pct(h.M.tauxFamille(true, 1), 2)} with one child, ${h.pct(h.M.tauxFamille(true, 2), 2)} with two, ${h.pct(h.M.tauxFamille(true, 3), 2)} with three.</p>

<h2>One to four children: same couple, same city</h2>
<p>Everything is fixed except the number of children: a couple in zone 2, €800 of rent excluding charges, €24,000 of taxable net income over the year.</p>
${h.table(['Children', 'Rent ceiling', 'Charges allowance', 'Own contribution', 'Estimated APL', 'Aid ends near'], [1, 2, 3, 4].map((n) => [String(n), h.eur(cpl(h, n).plafond, 2), h.eur(cpl(h, n).charges, 2), h.eur(cpl(h, n).pp), h.eur(cpl(h, n).aide), h.eur(sortieCpl(h, n))]), 'Couple, zone 2, €800 rent, €24,000 yearly income, scale of 1 October 2026 (estimate)', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The rise is not a straight line. The first child adds little, because at €24,000 of income the contribution is still heavy. After that, a lower contribution and a higher ceiling work together: the second and third child are each worth more than €100 a month in this example, the fourth a little less. Even with four children the ${h.eur(cpl(h, 4).plafond, 2)} ceiling stays below the €800 rent, so the ceiling, not the rent actually paid, sets the aid of a large family in an ordinary-sized home.</p>
<!--mini:aplFamille-->

<h2>Raising children on your own</h2>
<p>There is no special ceiling for single parents (parents isolés): with the same number of children, the CAF uses the same ceiling and charges allowance as for a couple. The advantage lies in the allowance, because R0 with dependants is the same with or without a partner while only one income is declared. A single parent on €14,000 paying €700 in zone 2 gets about ${h.eur(iso(h, 1).aide)} with one child, ${h.eur(iso(h, 2).aide)} with two and ${h.eur(iso(h, 3).aide)} with three.</p>

<h2>Shared custody, pregnancy, a child leaving home</h2>
<p>With shared residence, ${h.src('spApl', 'service-public.fr')} lets each parent count the children for their own days. Both homes are therefore recognised as family homes, each with its own claim and income.</p>
<p>During pregnancy, a woman living alone with no other dependant may qualify for the family housing allowance (ALF) from the calendar month after the fourth month, if the home is not an approved one. The sum is still worked out as for a single person until the birth.</p>
<p>When a child leaves or stops being a dependant, ceiling, allowance and R0 each drop a notch: aid can fall sharply although income has not changed. Running a new estimate beforehand avoids the surprise.</p>
<p>Dependants are not always children. The ALF sheet on service-public.fr also lists a parent or grandparent over 65 (60 if unfit for work) whose income stays under the Aspa ceiling (the French minimum old-age pension), or a relative with an incapacity of at least 80%. An elderly parent living with you can therefore raise the ceiling and the charges allowance just as a child would.</p>

<h2>APL or ALF: a different name, the same scale</h2>
<p>In an approved home (logement conventionné, mostly social housing) the family receives APL. Elsewhere it usually receives ALF, open in particular to people drawing family benefits and to households with a dependent child. Both use the same formula. See ${h.a('apl-als-alf', 'APL, ALF and ALS compared')}, and for families in big cities ${h.a('apl-zone-2', 'housing aid in zone 2')}.</p>
<p>The ${h.a('simulateur-apl', 'housing aid calculator')} takes the number of dependants into account. Its results are estimates; the CAF works out the entitlement from the family’s own file.</p>
`,
  },
});
