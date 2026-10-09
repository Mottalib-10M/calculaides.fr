import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples de la page : étudiant seul, sans revenu déclaré, loyer de 450 €, dans chaque zone. */
const cas = (h: Helpers, zone: 1 | 2 | 3, boursier: boolean, loyer = 450) => h.M.apl({ zone, couple: false, enfants: 0, loyer, revenusAnnuels: 0, etudiant: true, boursier });
const plancher = (h: Helpers) => h.P.apl.etudiant_forfait_ressources;
const plancherB = (h: Helpers) => h.P.apl.etudiant_forfait_ressources - h.P.apl.etudiant_minoration_boursier;

export default defineGuide({
  id: 'apl-etudiant',
  group: 'logement',
  order: 20,
  mini: 'aplEtudiant',
  related: ['simulateur-apl', 'apl-colocation', 'apl-chambre-foyer', 'apl-ressources', 'apl-zone-1'],
  sources: ['spApl', 'arreteApl2026', 'cchD823', 'arreteR0'],
  fr: {
    slug: 'apl-etudiant',
    nav: 'APL étudiant',
    card: 'Le forfait de ressources que la CAF applique aux étudiants, et ce qu’il laisse d’aide selon la ville.',
    title: 'APL étudiant 2026 : montant par zone, boursier ou non',
    description: 'APL étudiant 2026 : la CAF retient au moins 8 600 € de ressources par an (6 900 € pour un boursier). Montant par zone au barème d’octobre 2026 et simulateur.',
    h1: 'APL étudiant : combien la CAF verse vraiment',
    intro: 'Sans revenu, un étudiant n’est pas compté à zéro : la CAF lui applique un forfait de ressources, et c’est lui qui fixe l’aide.',
    resume: (h) => `Un étudiant seul qui loue 450 € hors charges en zone 1 reçoit environ ${h.eur(cas(h, 1, false).aide)} d’APL par mois au barème du 1er octobre 2026, ${h.eur(cas(h, 1, true).aide)} s’il est boursier. En zone 2 l’estimation tombe à ${h.eur(cas(h, 2, false).aide)}, en zone 3 à ${h.eur(cas(h, 3, false).aide)}. L’écart vient du loyer plafond, pas du loyer réel : au-delà de ${h.eur(h.M.loyerPlafond(1, false, 0))} en zone 1, chaque euro de loyer reste à la charge de l’étudiant. Les ressources comptent aussi, mais d’une manière particulière. Un étudiant qui déclare peu ou pas de revenus n’est pas traité comme un foyer sans ressources : la CAF retient un montant forfaitaire d’au moins ${h.eur(plancher(h))} par an, ramené à ${h.eur(plancherB(h))} pour un boursier. Ce plancher, combiné à l’abattement R0 de ${h.eur(h.M.r0(false, 0))}, explique qu’un étudiant ne touche jamais le maximum théorique. Ces montants sont des estimations : seule la CAF calcule le droit, sur le dossier.`,
    faqs: (h) => [
      { q: 'Je n’ai aucun revenu, pourquoi mon APL n’est pas au maximum ?', a: `Parce que la CAF ne retient pas zéro. Pour un étudiant, elle compte au moins ${h.eur(plancher(h))} de ressources annuelles, ou ${h.eur(plancherB(h))} s’il est boursier. Au-delà de l’abattement R0 de ${h.eur(h.M.r0(false, 0))}, ce forfait crée une participation personnelle d’environ ${h.eur(cas(h, 1, false).pp)} par mois en zone 1, déduite de l’aide. Le forfait figure dans l’arrêté du 27 septembre 2019 qui fixe les paramètres de calcul.` },
      { q: 'Être boursier du Crous augmente-t-il l’APL ?', a: `Oui, d’environ ${h.eur(cas(h, 1, true).aide - cas(h, 1, false).aide)} par mois dans notre exemple de zone 1. Le forfait de ressources d’un boursier est diminué de ${h.eur(h.P.apl.etudiant_minoration_boursier)}, ce qui réduit la participation personnelle. Pour un étudiant étranger hors Union européenne, la bourse sur critères sociaux compte doublement depuis le 1er juillet 2026 : c’est l’une des trois conditions qui ouvrent encore le droit à l’APL.` },
      { q: 'Un étudiant étranger peut-il toucher l’APL en 2026 ?', a: 'Oui, avec un titre de séjour valide, mais les règles ont changé le 1er juillet 2026 pour les ressortissants de pays hors Union européenne, Espace économique européen et Suisse venus pour leurs études. Selon service-public, ils ne peuvent percevoir l’APL que s’ils sont boursiers sur critères sociaux, s’ils exercent une activité professionnelle, ou s’ils sont en contrat d’apprentissage ou de professionnalisation.' },
      { q: 'Mon loyer est de 700 € à Paris, est-ce que je touche plus ?', a: `Non. En zone 1, la CAF ne retient pas plus de ${h.eur(h.M.loyerPlafond(1, false, 0))} de loyer pour une personne seule au barème d’octobre 2026. Au-delà, l’aide ne bouge plus. Elle baisse même quand le loyer dépasse ${h.num(h.P.apl.degressivite['1'][0], 1)} fois ce plafond, et disparaît à ${h.num(h.P.apl.degressivite['1'][1], 0)} fois. Avec 700 €, l’estimation reste à ${h.eur(cas(h, 1, false, 700).aide)}.` },
      { q: 'Je travaille l’été, est-ce que mes salaires réduisent l’APL ?', a: `Seulement s’ils dépassent le forfait. Les ressources prises en compte sont celles des douze derniers mois, après un abattement de ${h.pct(h.P.apl.abattement_frais_pro, 0)}. Tant que ce montant reste sous ${h.eur(plancher(h))}, c’est le forfait qui s’applique et l’aide ne change pas. Au-dessus, chaque tranche de 100 € de ressources annuelles retire environ ${h.eur(cas(h, 1, false).tp * 100, 2)} d’aide par mois.` },
    ],
    body: (h) => `
<h2>Le forfait de ressources, cœur du calcul</h2>
<p>Pour la plupart des allocataires, l’aide au logement dépend des revenus des douze derniers mois, actualisés chaque trimestre. Un étudiant déclare souvent très peu : un job d’été, quelques heures de cours particuliers, parfois rien. S’il était compté à zéro, il toucherait davantage qu’un salarié modeste au même loyer. Les textes l’évitent avec une évaluation forfaitaire : la CAF retient au moins ${h.eur(plancher(h))} de ressources par an, ou ${h.eur(plancherB(h))} pour un boursier.</p>
<p>Ce plancher se lit dans la formule du ${h.src('cchD823', 'code de la construction et de l’habitation')}. L’aide vaut le loyer retenu, plus un forfait charges, moins une participation personnelle. Cette participation est faite d’un minimum fixe, puis d’un pourcentage des ressources qui dépassent l’abattement R0. Pour une personne seule, R0 vaut ${h.eur(h.M.r0(false, 0))} selon l’${h.src('arreteR0', 'arrêté du 27 septembre 2019')} : avec le forfait étudiant, ${h.eur(plancher(h) - h.M.r0(false, 0))} de ressources sont soumis au taux de participation, d’environ ${h.pct(cas(h, 1, false).tp, 2)} dans notre exemple parisien.</p>
<p>La valeur de R0 utilisée ici est la dernière publiée, applicable depuis le 1er janvier 2025 : nous n’avons trouvé aucun arrêté la revalorisant pour 2026 à la date de notre relevé. Si elle change, l’aide de tous les étudiants bouge de quelques euros.</p>

<h2>Ce que verse la CAF selon la ville</h2>
<p>Le tableau reprend le même étudiant : seul, sans revenu déclaré, 450 € de loyer hors charges, logement entier. Seule la zone change. La zone 1 regroupe Paris et sa petite couronne, la zone 2 les grandes agglomérations, la zone 3 le reste du territoire.</p>
${h.table(['Zone', 'Loyer plafond', 'APL non boursier', 'APL boursier'], ([1, 2, 3] as const).map((z) => [`Zone ${z}`, h.eur(h.M.loyerPlafond(z, false, 0)), h.eur(cas(h, z, false).aide), h.eur(cas(h, z, true).aide)]), 'Étudiant seul, loyer 450 € hors charges, barème du 1er octobre 2026 (estimation)', ['l', 'r', 'r', 'r'])}
<p>Le loyer réel de 450 € dépasse le plafond dans les trois zones : la CAF ne retient que le plafond. C’est pourquoi deux étudiants qui paient 450 € et 650 € dans la même ville touchent la même APL, sauf si le second franchit le seuil où la dégressivité commence.</p>
<!--mini:aplEtudiant-->

<h2>Studio, colocation, résidence : trois calculs différents</h2>
<h3>Le studio ou l’appartement loué seul</h3>
<p>C’est le cas du tableau. Le plafond est celui d’une personne seule, le forfait charges vaut ${h.eur(h.M.forfaitCharges(false, 0))} par mois, et la participation minimale ${h.eur(h.P.apl.p0_min)}.</p>
<h3>La colocation</h3>
<p>Chaque colocataire fait sa propre demande, sur sa part du loyer. Le plafond est réduit à ${h.pct(h.P.apl.coef_colocation, 0)} de celui d’une personne seule, et le forfait charges tombe à ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'))}. Le même étudiant, avec une part de loyer de 450 € en zone 1, obtient environ ${h.eur(h.M.apl({ zone: 1, couple: false, enfants: 0, loyer: 450, logement: 'colocation', revenusAnnuels: 0, etudiant: true }).aide)}. Le détail est sur la page ${h.a('apl-colocation', 'APL en colocation')}.</p>
<h3>La chambre en résidence ou en foyer</h3>
<p>Pour une chambre, le plafond est ramené à ${h.pct(h.P.apl.coef_chambre, 0)} de celui d’un logement entier : ${h.eur(h.M.loyerPlafond(1, false, 0) * h.P.apl.coef_chambre)} en zone 1 selon l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')}. Beaucoup de résidences universitaires sont des logements-foyers conventionnés, dont la redevance suit une formule propre : notre estimation y applique la règle des chambres, ce qui reste une approximation. Voir ${h.a('apl-chambre-foyer', 'APL en chambre, foyer ou résidence')}.</p>

<h2>Quand les revenus de l’étudiant comptent vraiment</h2>
<p>Le forfait n’est qu’un plancher. Un étudiant en alternance ou qui travaille toute l’année peut déclarer plus. La CAF prend alors ses ressources réelles des douze derniers mois, après un abattement de ${h.pct(h.P.apl.abattement_frais_pro, 0)} pour frais professionnels, arrondies à la centaine supérieure. Avec 12 000 € de salaires nets imposables sur l’année, en zone 1 et pour un loyer de 450 €, l’estimation descend à ${h.eur(h.M.apl({ zone: 1, couple: false, enfants: 0, loyer: 450, revenusAnnuels: 12000, etudiant: true }).aide)}. L’aide s’éteint vers ${h.eur(h.M.seuilSortieApl({ zone: 1, couple: false, enfants: 0, loyer: 450, etudiant: true }))} de revenus annuels dans ce cas.</p>
<p>La page ${h.a('apl-ressources', 'ressources des douze derniers mois')} explique comment la CAF lit ces revenus, mois par mois, et pourquoi l’aide se recalcule tous les trois mois.</p>

<h2>Les démarches qui changent le montant</h2>
<ul>
<li><strong>Déclarer la bourse</strong> dès sa notification : sans elle, la CAF applique le forfait le plus élevé.</li>
<li><strong>Vérifier la zone</strong> de la commune du logement : une ville de banlieue peut être en zone 1 ou 2, et l’écart de plafond atteint ${h.eur(h.M.loyerPlafond(1, false, 0) - h.M.loyerPlafond(3, false, 0))} entre zone 1 et zone 3.</li>
<li><strong>Demander dès l’entrée dans les lieux</strong> : selon ${h.src('spApl', 'service-public')}, l’APL peut être versée à un mineur ou à un étudiant sans âge minimum, mais pas pour les mois antérieurs à la demande.</li>
<li><strong>Signaler un emménagement en couple</strong> : deux étudiants qui vivent ensemble forment un couple pour la CAF, avec un plafond et un forfait différents.</li>
</ul>
<p>Le ${h.a('simulateur-apl', 'simulateur APL complet')} reprend toutes ces variables, y compris le couple, la colocation et les revenus réels.</p>
`,
  },
  en: {
    slug: 'student-housing-aid',
    nav: 'Student APL',
    card: 'The flat-rate income the CAF applies to students, and the aid it leaves in each part of France.',
    title: 'Student APL 2026: Housing Aid by Zone, Grant or Not',
    description: 'Student APL in 2026: the CAF counts at least €8,600 of yearly resources (€6,900 for grant holders). Amounts by zone at October 2026 rates, with a calculator.',
    h1: 'Student housing aid (APL): what the CAF actually pays',
    intro: 'A student with no income is not counted at zero: the CAF applies a flat-rate income figure, and that figure sets the aid.',
    resume: (h) => `A single student renting a flat for €450 a month excluding charges in zone 1 (Paris and its inner suburbs) gets about ${h.eur(cas(h, 1, false).aide)} of APL a month under the scale in force since 1 October 2026, or ${h.eur(cas(h, 1, true).aide)} with a needs-based grant. In zone 2, the estimate falls to ${h.eur(cas(h, 2, false).aide)}, and to ${h.eur(cas(h, 3, false).aide)} in zone 3. The gap comes from the rent ceiling, not from the rent you pay: above ${h.eur(h.M.loyerPlafond(1, false, 0))} in zone 1, every extra euro of rent is yours alone. Income matters too, in a special way. A student who declares little or nothing is not treated as a household with no means: the CAF counts a flat-rate income of at least ${h.eur(plancher(h))} a year, lowered to ${h.eur(plancherB(h))} for grant holders. That floor, combined with the R0 allowance of ${h.eur(h.M.r0(false, 0))}, is why a student never receives the theoretical maximum. All figures are estimates; only the CAF (the family allowance fund that pays housing aid) decides the entitlement.`,
    faqs: (h) => [
      { q: 'I have no income at all, so why is my housing aid not at the maximum?', a: `Because the CAF does not count zero. For a student it counts at least ${h.eur(plancher(h))} of yearly resources, or ${h.eur(plancherB(h))} for a grant holder. Above the R0 allowance of ${h.eur(h.M.r0(false, 0))}, that flat rate creates an own contribution of roughly ${h.eur(cas(h, 1, false).pp)} a month in zone 1, deducted from the aid. The rule sits in the order of 27 September 2019 that sets the calculation parameters.` },
      { q: 'Does a Crous grant increase student housing aid?', a: `Yes, by about ${h.eur(cas(h, 1, true).aide - cas(h, 1, false).aide)} a month in our zone 1 example. A grant holder's flat-rate income is reduced by ${h.eur(h.P.apl.etudiant_minoration_boursier)}, which lowers the own contribution. For students from outside the EU, the needs-based grant matters twice since 1 July 2026: it is one of three conditions that still open the right to APL.` },
      { q: 'Can an international student from outside the EU get APL in 2026?', a: 'Yes, with a valid residence permit, but the rules changed on 1 July 2026 for nationals of countries outside the EU, the EEA and Switzerland holding a student permit. According to service-public.fr, they can only receive APL if they hold a needs-based grant (Crous or regional), work, or have an apprenticeship or professional-training contract.' },
      { q: 'My rent in Paris is €700, do I get more aid than with a cheaper studio?', a: `No. In zone 1, the CAF counts no more than ${h.eur(h.M.loyerPlafond(1, false, 0))} of rent for a single person on the October 2026 scale. Above that, the aid stays flat. It even falls once rent passes ${h.num(h.P.apl.degressivite['1'][0], 1)} times the ceiling, and stops at ${h.num(h.P.apl.degressivite['1'][1], 0)} times. With €700, the estimate stays at ${h.eur(cas(h, 1, false, 700).aide)}.` },
      { q: 'Will a summer job reduce my student housing aid?', a: `Only if your earnings exceed the flat rate. The CAF looks at the last twelve months, after a ${h.pct(h.P.apl.abattement_frais_pro, 0)} allowance for work expenses. While that figure stays under ${h.eur(plancher(h))}, the flat rate applies and the aid does not move. Above it, each extra €100 of yearly resources removes about ${h.eur(cas(h, 1, false).tp * 100, 2)} of aid a month.` },
    ],
    body: (h) => `
<h2>The flat-rate income at the heart of the sum</h2>
<p>For most claimants, housing aid depends on income over the last twelve months, refreshed every quarter. Students often declare very little: a summer job, a few hours of tutoring, sometimes nothing. Counted at zero, they would receive more than a low-paid worker paying the same rent. The rules prevent that with a flat-rate assessment: the CAF counts at least ${h.eur(plancher(h))} of income a year, or ${h.eur(plancherB(h))} for a student with a needs-based grant (bourse sur critères sociaux).</p>
<p>The floor works through the formula in the ${h.src('cchD823', 'Construction and Housing Code')}. Aid equals the rent taken into account, plus a flat allowance for service charges, minus your own contribution. That contribution is a fixed minimum plus a percentage of whatever income exceeds the R0 allowance. For a single person, R0 is ${h.eur(h.M.r0(false, 0))} under the ${h.src('arreteR0', 'order of 27 September 2019')}: with the student flat rate, ${h.eur(plancher(h) - h.M.r0(false, 0))} of income is exposed to the contribution rate, about ${h.pct(cas(h, 1, false).tp, 2)} in our Paris example.</p>
<p>The R0 value used here is the latest published one, in force since 1 January 2025. We found no order uprating it for 2026 when we checked. If it changes, every student's aid moves by a few euros.</p>

<h2>What the CAF pays, city by city</h2>
<p>The table keeps the same student: single, no declared income, €450 rent excluding charges, a whole flat. Only the zone changes. Zone 1 covers Paris and the inner suburbs, zone 2 the large urban areas, zone 3 the rest of France.</p>
${h.table(['Zone', 'Rent ceiling', 'APL, no grant', 'APL, grant holder'], ([1, 2, 3] as const).map((z) => [`Zone ${z}`, h.eur(h.M.loyerPlafond(z, false, 0)), h.eur(cas(h, z, false).aide), h.eur(cas(h, z, true).aide)]), 'Single student, €450 rent excluding charges, scale of 1 October 2026 (estimate)', ['l', 'r', 'r', 'r'])}
<p>A €450 rent is above the ceiling in all three zones, so the CAF counts only the ceiling. That is why two students paying €450 and €650 in the same city receive the same aid, unless the second crosses the point where the high-rent reduction starts.</p>
<!--mini:aplEtudiant-->

<h2>Studio, flat-share, student residence: three different sums</h2>
<h3>A studio or flat rented alone</h3>
<p>This is the case in the table. The ceiling is the single-person one, the service-charge allowance is ${h.eur(h.M.forfaitCharges(false, 0))} a month and the minimum contribution ${h.eur(h.P.apl.p0_min)}.</p>
<h3>A flat-share (colocation)</h3>
<p>Each flatmate claims separately, on their own share of the rent. The ceiling drops to ${h.pct(h.P.apl.coef_colocation, 0)} of the single-person figure and the charges allowance to ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'))}. The same student paying a €450 share in zone 1 gets about ${h.eur(h.M.apl({ zone: 1, couple: false, enfants: 0, loyer: 450, logement: 'colocation', revenusAnnuels: 0, etudiant: true }).aide)}. Details on the ${h.a('apl-colocation', 'flat-share housing aid')} page.</p>
<h3>A room in a residence or hostel</h3>
<p>For a single room, the ceiling is cut to ${h.pct(h.P.apl.coef_chambre, 0)} of a whole home: ${h.eur(h.M.loyerPlafond(1, false, 0) * h.P.apl.coef_chambre)} in zone 1 under the ${h.src('arreteApl2026', 'order of 28 September 2026')}. Many university residences are approved hostels (logements-foyers) whose fee follows its own formula; our estimate applies the room rule there, which remains an approximation. See ${h.a('apl-chambre-foyer', 'housing aid for a room or hostel')}.</p>

<h2>When a student's own earnings really count</h2>
<p>The flat rate is only a floor. A work-study student (alternant) or someone working all year may declare more. The CAF then uses actual income over the last twelve months, minus a ${h.pct(h.P.apl.abattement_frais_pro, 0)} work-expense allowance, rounded up to the next hundred euros. With €12,000 of taxable net pay over the year, in zone 1 and paying €450, the estimate falls to ${h.eur(h.M.apl({ zone: 1, couple: false, enfants: 0, loyer: 450, revenusAnnuels: 12000, etudiant: true }).aide)}. Aid stops at around ${h.eur(h.M.seuilSortieApl({ zone: 1, couple: false, enfants: 0, loyer: 450, etudiant: true }))} of yearly income in that case.</p>
<p>The page on ${h.a('apl-ressources', 'income over the last twelve months')} explains how the CAF reads those earnings month by month, and why the aid is recalculated every three months.</p>

<h2>Steps that change the amount</h2>
<ul>
<li><strong>Report your grant</strong> as soon as it is awarded: without it, the CAF applies the higher flat rate.</li>
<li><strong>Check the zone</strong> of the town where you live: a suburb can be in zone 1 or 2, and the ceiling gap between zones 1 and 3 reaches ${h.eur(h.M.loyerPlafond(1, false, 0) - h.M.loyerPlafond(3, false, 0))}.</li>
<li><strong>Apply as soon as you move in</strong>: according to ${h.src('spApl', 'service-public.fr')}, APL has no minimum age and can go to a student or even a minor, but it is not paid for months before the claim.</li>
<li><strong>Report moving in with a partner</strong>: two students living together are a couple for the CAF, with a different ceiling and charges allowance.</li>
</ul>
<p>The ${h.a('simulateur-apl', 'full housing aid calculator')} handles all of these, including couples, flat-shares and actual earnings.</p>
`,
  },
});
