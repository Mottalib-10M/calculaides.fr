import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemple déroulé de la page : personne seule, zone 2, loyer 400 €, 12 000 € de revenus nets imposables. */
const ex = (h: Helpers) => h.M.apl({ zone: 2, couple: false, enfants: 0, loyer: 400, revenusAnnuels: 12000 });
/** Même personne, petit loyer de zone 3 : le taux TL change. */
const petit = (h: Helpers) => h.M.apl({ zone: 3, couple: false, enfants: 0, loyer: 200, revenusAnnuels: 12000 });
const ref2 = (h: Helpers) => h.M.loyerPlafond(2, false, 0);

export default defineGuide({
  id: 'apl-calcul',
  group: 'logement',
  order: 120,
  mini: 'aplCalcul',
  related: ['simulateur-apl', 'apl-ressources', 'apl-loyer-plafond', 'apl-salarie', 'apl-zone-2'],
  sources: ['cchD823', 'arreteApl2026', 'arreteR0', 'spApl'],
  fr: {
    slug: 'calcul-apl',
    nav: 'Calcul de l’APL',
    card: 'La formule de l’aide au logement déroulée ligne par ligne, avec un vrai exemple chiffré.',
    title: 'APL 2026 : la formule de calcul expliquée pas à pas',
    description: 'Calcul APL 2026 : aide = L + C − Pp. Exemple déroulé ligne à ligne pour une personne seule en zone 2 avec 12 000 € de revenus nets, barème d’octobre 2026.',
    h1: 'Calcul de l’APL : la formule, une ligne après l’autre',
    intro: 'L’aide au logement n’est pas un pourcentage du loyer : c’est une soustraction entre ce que coûte le logement et ce que le foyer est censé payer lui-même.',
    resume: (h) => `Une personne seule qui loue 400 € hors charges en zone 2 et a gagné 12 000 € nets imposables sur les douze derniers mois reçoit environ ${h.eur(ex(h).aide)} d’APL par mois au barème du 1er octobre 2026. Le calcul tient en une ligne : l’aide vaut L + C − Pp, moins une minoration forfaitaire de ${h.eur(h.P.apl.minoration)}. L est le loyer retenu, plafonné ici à ${h.eur(ex(h).loyerRetenu, 2)} ; C le forfait charges de ${h.eur(ex(h).charges, 2)} ; Pp la participation personnelle, soit ${h.eur(ex(h).pp, 2)} dans cet exemple. Cette participation se compose d’un minimum P0 et d’un taux Tp appliqué aux ressources R qui dépassent un abattement R0. Le taux Tp additionne un taux familial TF et un taux lié au loyer TL. Chaque terme vient du code de la construction et de l’habitation et des arrêtés de barème : aucun n’est laissé à l’appréciation de la CAF. Le résultat reste une estimation, seule la caisse fixe le droit.`,
    faqs: (h) => [
      { q: 'Pourquoi la CAF enlève-t-elle 5 € à mon APL ?', a: `C’est la minoration forfaitaire prévue par le barème : une fois L + C − Pp calculé, la CAF retire ${h.eur(h.P.apl.minoration)} par mois, quel que soit le foyer. Elle explique qu’une aide théorique de quelques euros devienne nulle : après la minoration, tout montant inférieur à ${h.eur(h.P.apl.seuil_versement)} n’est pas versé, selon la fiche officielle sur l’APL. Dans notre exemple de zone 2, l’aide brute avant minoration atteint ${h.eur(ex(h).aide + h.P.apl.minoration, 2)}.` },
      { q: 'Que veut dire P0 sur le détail de calcul de mon APL ?', a: `P0 est la participation minimale du foyer, celle qu’il paie même sans aucun revenu. Elle vaut ${h.pct(h.P.apl.p0_taux, 1)} de la somme du loyer retenu et du forfait charges, avec un minimum de ${h.eur(h.P.apl.p0_min, 2)} par mois. Pour un loyer retenu de ${h.eur(ex(h).loyerRetenu, 2)}, le pourcentage donnerait moins que ce minimum : c’est donc le plancher de ${h.eur(h.P.apl.p0_min, 2)} qui s’applique.` },
      { q: 'Le loyer de référence de zone 2 sert aussi à Paris ?', a: `Oui, pour une seule chose : le taux TL. Le loyer retenu est comparé au plafond de zone 2 de la même composition familiale, ${h.eur(ref2(h), 2)} pour une personne seule, quelle que soit la zone réelle du logement. Sous ${h.pct(h.P.apl.tl.seuil1, 0)} de ce montant, TL vaut zéro ; au-delà, il grimpe par paliers. Le plafond qui limite le loyer, lui, reste celui de la zone du logement.` },
      { q: 'Mes revenus de 12 001 € comptent-ils comme 12 100 € ?', a: `Pas exactement. La CAF applique d’abord l’abattement de ${h.pct(h.P.apl.abattement_frais_pro, 0)}, puis arrondit à la centaine supérieure. Avec 12 001 €, on obtient 10 800,90 €, arrondis à ${h.eur(h.M.ressourcesRetenues(12001).r)}. Avec 12 000 €, R vaut exactement ${h.eur(ex(h).r)}. Un euro de plus peut donc ajouter cent euros à R, ce qui retire environ ${h.eur(ex(h).tp * 100, 2)} d’aide mensuelle.` },
      { q: 'Peut-on refaire le calcul de l’APL à la main ?', a: `Oui, avec une calculatrice et le barème. Il faut le loyer plafond de la zone, le forfait charges, R0 de la composition du foyer et le taux familial TF. Le seul passage délicat est TL, qui dépend du rapport entre loyer retenu et loyer de référence. Notre exemple déroulé donne ${h.eur(ex(h).aide)} ; un écart de quelques centimes avec la CAF vient en général des arrondis intermédiaires.` },
    ],
    body: (h) => `
<h2>La formule officielle, telle que l’écrivent les textes</h2>
<p>Le ${h.src('cchD823', 'code de la construction et de l’habitation')} pose le principe : l’aide couvre la dépense de logement, dans une certaine limite, moins ce que le ménage peut supporter. En symboles, aide = L + C − Pp. La participation personnelle Pp s’écrit à son tour P0 + Tp × (R − R0). Six lettres suffisent donc, et chacune a sa table de valeurs dans l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')}, qui a relevé les montants de 1,15 % au 1er octobre.</p>
<p>Les montants de R0 viennent d’un autre texte, l’${h.src('arreteR0', 'article 15 de l’arrêté du 27 septembre 2019')}. Leur dernière valeur publiée date du 1er janvier 2025 ; nous n’avons trouvé aucune revalorisation pour 2026.</p>

<h2>L’exemple déroulé : 400 € de loyer en zone 2</h2>
<p>Prenons Inès, seule, sans enfant, locataire d’un deux-pièces à 400 € hors charges dans une grande agglomération classée en zone 2. Ses salaires des douze derniers mois totalisent 12 000 € nets imposables. Voici le calcul dans l’ordre où le fait le moteur de ce site.</p>
<ol>
<li><strong>Loyer retenu L.</strong> Le plafond d’une personne seule en zone 2 est de ${h.eur(ex(h).plafond, 2)}. Le loyer réel le dépasse : L = ${h.eur(ex(h).loyerRetenu, 2)}.</li>
<li><strong>Forfait charges C.</strong> Pour un foyer sans personne à charge, C = ${h.eur(ex(h).charges, 2)}, quelles que soient les charges réelles.</li>
<li><strong>Participation minimale P0.</strong> ${h.pct(h.P.apl.p0_taux, 1)} de L + C donne ${h.eur(h.P.apl.p0_taux * (ex(h).loyerRetenu + ex(h).charges), 2)}, sous le minimum : P0 = ${h.eur(ex(h).p0, 2)}.</li>
<li><strong>Ressources R.</strong> 12 000 € moins ${h.pct(h.P.apl.abattement_frais_pro, 0)}, arrondis à la centaine supérieure : R = ${h.eur(ex(h).r)}.</li>
<li><strong>Abattement R0.</strong> Pour une personne seule, R0 = ${h.eur(ex(h).r0)}. La part soumise au taux est R − R0 = ${h.eur(ex(h).r - ex(h).r0)}.</li>
<li><strong>Taux Tp.</strong> TF vaut ${h.pct(ex(h).tf, 2)}. Le loyer retenu égale ici le loyer de référence, d’où TL = ${h.pct(ex(h).tl, 3)}. Au total Tp = ${h.pct(ex(h).tp, 3)}.</li>
<li><strong>Participation Pp.</strong> P0 + Tp × (R − R0) = ${h.eur(ex(h).pp, 2)} par mois.</li>
<li><strong>Aide.</strong> L + C − Pp − ${h.eur(h.P.apl.minoration)} = ${h.eur(ex(h).aide, 2)} par mois.</li>
</ol>
${h.table(['Terme', 'Valeur', 'D’où il vient'], [['L', h.eur(ex(h).loyerRetenu, 2), 'plafond zone 2, personne seule'], ['C', h.eur(ex(h).charges, 2), 'forfait sans personne à charge'], ['P0', h.eur(ex(h).p0, 2), 'minimum réglementaire'], ['R', h.eur(ex(h).r), 'revenus abattus et arrondis'], ['R0', h.eur(ex(h).r0), 'abattement personne seule'], ['Tp', h.pct(ex(h).tp, 3), 'TF + TL'], ['Pp', h.eur(ex(h).pp, 2), 'P0 + Tp × (R − R0)'], ['Aide', h.eur(ex(h).aide, 2), 'L + C − Pp − minoration']], 'Calcul de l’APL d’Inès, barème du 1er octobre 2026 (estimation)', ['l', 'r', 'l'])}
<!--mini:aplCalcul-->

<h2>Le terme le plus mal compris : TL</h2>
<p>Le taux familial TF est simple à lire : une valeur par composition du foyer. TL l’est beaucoup moins. Il augmente la participation quand le logement est cher par rapport à un loyer de référence, toujours pris en zone 2, même pour un logement parisien. Le rapport loyer retenu sur loyer de référence est calculé, puis trois paliers s’appliquent. Sous ${h.pct(h.P.apl.tl.seuil1, 0)}, TL est nul. Entre ${h.pct(h.P.apl.tl.seuil1, 0)} et ${h.pct(h.P.apl.tl.seuil2, 0)}, chaque point de rapport ajoute ${h.pct(h.P.apl.tl.taux2 / 100, 4)} au taux. Au-delà de ${h.pct(h.P.apl.tl.seuil2, 0)}, la pente passe à ${h.pct(h.P.apl.tl.taux3 / 100, 4)} par point.</p>
<p>Conséquence concrète : avec un petit loyer de 200 € en zone 3, le même revenu que celui d’Inès donne un TL de ${h.pct(petit(h).tl, 3)} seulement, et une aide de ${h.eur(petit(h).aide)}. Le loyer pèse donc deux fois dans la formule : dans L, qui fait monter l’aide, et dans TL, qui la freine légèrement.</p>

<h2>Ce que la formule ne dit pas</h2>
<p>Deux mécanismes s’ajoutent après la soustraction. Le premier est la dégressivité : si le loyer réel dépasse un multiple du plafond, l’aide diminue puis s’annule. La page ${h.a('apl-loyer-plafond', 'loyer plafond et dégressivité')} détaille ces seuils zone par zone. Le second est le seuil de versement : sous ${h.eur(h.P.apl.seuil_versement)}, la CAF ne paie rien.</p>
<p>Le calcul de R mérite aussi qu’on s’y arrête, parce qu’il change chaque trimestre et ne correspond pas à l’avis d’imposition : la page ${h.a('apl-ressources', 'ressources prises en compte')} l’explique. Pour une personne seule qui travaille, la question devient vite celle du revenu au-delà duquel tout s’arrête ; elle est traitée sur ${h.a('apl-salarie', 'l’APL d’un salarié')}.</p>

<h2>Les écarts possibles avec la notification de la CAF</h2>
<p>Notre moteur arrondit L, C, P0 et Pp au centime, comme le fait le barème publié. La CAF peut arrondir différemment à une étape intermédiaire, ce qui produit des écarts de quelques centimes. Un écart de plusieurs dizaines d’euros signale autre chose : une zone mal identifiée, des revenus d’un trimestre plus ancien, un patrimoine supérieur à 30 000 € pris en compte selon ${h.src('spApl', 'service-public')}, ou un loyer qui n’a pas encore été mis à jour. Pour vérifier votre cas complet, avec couple et enfants, utilisez le ${h.a('simulateur-apl', 'simulateur APL')}.</p>
`,
  },
  en: {
    slug: 'how-housing-aid-is-calculated',
    nav: 'How APL is calculated',
    card: 'The housing aid formula worked through line by line, with a real numerical example.',
    title: 'Housing Aid Formula 2026: APL Calculation Step by Step',
    description: 'How APL is calculated in 2026: aid = L + C − Pp. A line-by-line example for a single person in zone 2 earning €12,000, using the October 2026 aid scale.',
    h1: 'How housing aid (APL) is calculated, one line at a time',
    intro: 'French housing aid is not a percentage of your rent: it is a subtraction between what the home costs and what your household is expected to pay itself.',
    resume: (h) => `A single person renting for €400 a month excluding charges in zone 2 (France's large cities outside Paris), with €12,000 of taxable net income over the last twelve months, receives about ${h.eur(ex(h).aide)} of APL a month on the scale in force since 1 October 2026. APL (aide personnalisée au logement) is the means-tested housing benefit paid by the CAF, the family allowance fund. Its formula fits on one line: aid equals L + C − Pp, minus a flat deduction of ${h.eur(h.P.apl.minoration)}. L is the rent taken into account, capped here at ${h.eur(ex(h).loyerRetenu, 2)}; C is a service-charge allowance of ${h.eur(ex(h).charges, 2)}; Pp is your own contribution, ${h.eur(ex(h).pp, 2)} in this example. That contribution is a minimum, P0, plus a rate Tp applied to income R above an allowance called R0. Every term comes from the Construction and Housing Code and the official scales, so nothing is left to the CAF's discretion. The result remains an estimate; only the CAF sets the entitlement.`,
    faqs: (h) => [
      { q: 'Why does the CAF take €5 off my housing aid?', a: `That is the flat deduction written into the scale: once L + C − Pp is worked out, the CAF removes ${h.eur(h.P.apl.minoration)} a month for every household. It explains why a theoretical aid of a few euros ends up at zero, because after the deduction anything under ${h.eur(h.P.apl.seuil_versement)} is not paid, according to service-public.fr. In our zone 2 example, the aid before the deduction is ${h.eur(ex(h).aide + h.P.apl.minoration, 2)}.` },
      { q: 'What does P0 mean on my CAF calculation breakdown?', a: `P0 is the minimum contribution, the part you pay even with no income at all. It equals ${h.pct(h.P.apl.p0_taux, 1)} of the rent taken into account plus the charges allowance, with a floor of ${h.eur(h.P.apl.p0_min, 2)} a month. With a counted rent of ${h.eur(ex(h).loyerRetenu, 2)}, the percentage gives less than that floor, so the ${h.eur(h.P.apl.p0_min, 2)} minimum applies.` },
      { q: 'Is the zone 2 reference rent used for a flat in Paris too?', a: `Yes, for one thing only: the TL rate. Your counted rent is compared with the zone 2 ceiling for the same household type, ${h.eur(ref2(h), 2)} for a single person, wherever you actually live. Below ${h.pct(h.P.apl.tl.seuil1, 0)} of that figure, TL is zero; above it, TL rises in steps. The ceiling that caps your rent is still the one for your own zone.` },
      { q: 'Does income of €12,001 count as €12,100 for housing aid?', a: `Not quite. The CAF first removes the ${h.pct(h.P.apl.abattement_frais_pro, 0)} allowance, then rounds up to the next hundred. €12,001 becomes €10,800.90, rounded to ${h.eur(h.M.ressourcesRetenues(12001).r)}. With €12,000, R is exactly ${h.eur(ex(h).r)}. One extra euro can therefore add a hundred euros to R, which removes roughly ${h.eur(ex(h).tp * 100, 2)} of monthly aid.` },
      { q: 'Can I redo the APL calculation by hand?', a: `Yes, with a calculator and the official scale. You need your zone's rent ceiling, the charges allowance, the R0 figure for your household and the family rate TF. The only awkward step is TL, which depends on the ratio between counted rent and reference rent. Our worked example lands on ${h.eur(ex(h).aide)}; a gap of a few cents with the CAF usually comes from intermediate rounding.` },
    ],
    body: (h) => `
<h2>The official formula, as the rules write it</h2>
<p>The ${h.src('cchD823', 'Construction and Housing Code')} sets the principle: aid covers housing costs, up to a limit, minus what the household can afford. In symbols, aid = L + C − Pp, and the own contribution Pp is P0 + Tp × (R − R0). Six letters, each with its own table of values in the ${h.src('arreteApl2026', 'order of 28 September 2026')}, which raised the amounts by 1.15% on 1 October.</p>
<p>The R0 figures sit in a separate text, ${h.src('arreteR0', 'article 15 of the order of 27 September 2019')}. Their latest published values date from 1 January 2025; we found no uprating for 2026.</p>

<h2>Worked example: €400 rent in zone 2</h2>
<p>Take Inès, single, no children, renting a two-room flat for €400 excluding charges in a large city classed as zone 2. Her pay over the last twelve months adds up to €12,000 of taxable net income (the revenu net imposable shown on French payslips and tax returns). Here is the calculation in the order this site's engine runs it.</p>
<ol>
<li><strong>Counted rent L.</strong> The zone 2 ceiling for a single person is ${h.eur(ex(h).plafond, 2)}. Her rent is higher, so L = ${h.eur(ex(h).loyerRetenu, 2)}.</li>
<li><strong>Charges allowance C.</strong> For a household with nobody dependent on it, C = ${h.eur(ex(h).charges, 2)}, whatever the real service charges.</li>
<li><strong>Minimum contribution P0.</strong> ${h.pct(h.P.apl.p0_taux, 1)} of L + C gives ${h.eur(h.P.apl.p0_taux * (ex(h).loyerRetenu + ex(h).charges), 2)}, below the floor, so P0 = ${h.eur(ex(h).p0, 2)}.</li>
<li><strong>Income R.</strong> €12,000 minus ${h.pct(h.P.apl.abattement_frais_pro, 0)}, rounded up to the next hundred: R = ${h.eur(ex(h).r)}.</li>
<li><strong>Allowance R0.</strong> For a single person R0 = ${h.eur(ex(h).r0)}, leaving R − R0 = ${h.eur(ex(h).r - ex(h).r0)} exposed to the rate.</li>
<li><strong>Rate Tp.</strong> TF is ${h.pct(ex(h).tf, 2)}. Counted rent equals the reference rent here, giving TL = ${h.pct(ex(h).tl, 3)}, so Tp = ${h.pct(ex(h).tp, 3)}.</li>
<li><strong>Own contribution Pp.</strong> P0 + Tp × (R − R0) = ${h.eur(ex(h).pp, 2)} a month.</li>
<li><strong>Aid.</strong> L + C − Pp − ${h.eur(h.P.apl.minoration)} = ${h.eur(ex(h).aide, 2)} a month.</li>
</ol>
${h.table(['Term', 'Value', 'Where it comes from'], [['L', h.eur(ex(h).loyerRetenu, 2), 'zone 2 ceiling, single person'], ['C', h.eur(ex(h).charges, 2), 'allowance, no dependants'], ['P0', h.eur(ex(h).p0, 2), 'regulatory floor'], ['R', h.eur(ex(h).r), 'income after allowance, rounded'], ['R0', h.eur(ex(h).r0), 'single-person allowance'], ['Tp', h.pct(ex(h).tp, 3), 'TF + TL'], ['Pp', h.eur(ex(h).pp, 2), 'P0 + Tp × (R − R0)'], ['Aid', h.eur(ex(h).aide, 2), 'L + C − Pp − deduction']], 'Inès’s housing aid, scale of 1 October 2026 (estimate)', ['l', 'r', 'l'])}
<!--mini:aplCalcul-->

<h2>The least understood term: TL</h2>
<p>The family rate TF is easy to read: one value per household type. TL is trickier. It raises your contribution when your home is expensive compared with a reference rent, and that reference is always the zone 2 ceiling, even for a flat in Paris. The CAF divides counted rent by the reference rent, then applies three bands. Below ${h.pct(h.P.apl.tl.seuil1, 0)}, TL is zero. Between ${h.pct(h.P.apl.tl.seuil1, 0)} and ${h.pct(h.P.apl.tl.seuil2, 0)}, each point of ratio adds ${h.pct(h.P.apl.tl.taux2 / 100, 4)} to the rate. Past ${h.pct(h.P.apl.tl.seuil2, 0)}, the slope steepens to ${h.pct(h.P.apl.tl.taux3 / 100, 4)} per point.</p>
<p>In practice, a small €200 rent in zone 3 with Inès's income gives a TL of only ${h.pct(petit(h).tl, 3)} and aid of ${h.eur(petit(h).aide)}. Rent therefore appears twice in the formula: in L, which lifts the aid, and in TL, which brakes it slightly.</p>

<h2>What the formula leaves out</h2>
<p>Two mechanisms apply after the subtraction. The first is the high-rent reduction (dégressivité): if your actual rent exceeds a multiple of the ceiling, aid shrinks and then disappears. The page on ${h.a('apl-loyer-plafond', 'rent ceilings and the high-rent reduction')} lists those thresholds zone by zone. The second is the payment floor: below ${h.eur(h.P.apl.seuil_versement)}, the CAF pays nothing.</p>
<p>How R is built also deserves attention, since it moves every quarter and does not match your tax notice (avis d'imposition): see ${h.a('apl-ressources', 'income counted for housing aid')}. For a single worker, the real question soon becomes the income level where everything stops, covered in ${h.a('apl-salarie', 'housing aid for employees')}.</p>

<h2>Why your CAF letter may differ from this</h2>
<p>Our engine rounds L, C, P0 and Pp to the cent, as the published scale does. The CAF may round differently at an intermediate step, which explains gaps of a few cents. A gap of tens of euros points to something else: the wrong zone, income from an older quarter, savings or property above €30,000 being counted according to ${h.src('spApl', 'service-public.fr')}, or a rent figure not yet updated. To check a full situation, couples and children included, use the ${h.a('simulateur-apl', 'APL calculator')}.</p>
`,
  },
});
