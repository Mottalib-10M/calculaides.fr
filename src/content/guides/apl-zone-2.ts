import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples de la page : familles en zone 2, loyer de 700 € hors charges. */
const LOYER = 700;
const fam = (h: Helpers, enfants: number, rev: number, loyer = LOYER) => h.M.apl({ zone: 2, couple: true, enfants, loyer, revenusAnnuels: rev });
const sortie = (h: Helpers, enfants: number) => h.M.seuilSortieApl({ zone: 2, couple: true, enfants, loyer: LOYER });
const Z = (h: Helpers) => h.P.apl.loyers_plafonds['2'];
const N = [1, 2, 3, 4];

export default defineGuide({
  id: 'apl-zone-2',
  group: 'logement',
  order: 80,
  mini: 'aplZone2',
  related: ['apl-famille', 'simulateur-apl', 'apl-zone-1', 'apl-zone-3', 'apl-als-alf'],
  sources: ['spApl', 'arreteApl2026', 'arreteR0', 'cchD823'],
  fr: {
    slug: 'apl-zone-2',
    nav: 'APL zone 2',
    card: 'Grandes villes de province : ce que chaque enfant ajoute au plafond et à l’aide d’une famille.',
    title: 'APL zone 2 2026 : familles, plafond par enfant et montants',
    description: 'APL zone 2 2026 : plafond de 404 € avec un enfant, puis 59 € par enfant suivant. Montants pour un couple ou un parent seul, de 1 à 4 enfants, et simulateur.',
    h1: 'APL en zone 2 : ce que touche une famille selon le nombre d’enfants',
    intro: 'Dans les grandes agglomérations de province, c’est le nombre d’enfants, bien plus que le loyer, qui fait varier l’aide d’une famille.',
    resume: (h) => `En zone 2, une famille avec un enfant voit son loyer pris en compte jusqu’à ${h.eur(Z(h).un_enfant)} par mois au barème du 1er octobre 2026, et chaque enfant suivant relève ce plafond de ${h.eur(Z(h).par_enfant)}. Pour un loyer de 700 € hors charges et 24 000 € de revenus nets imposables sur douze mois, l’APL estimée vaut ${h.eur(fam(h, 1, 24000).aide)} avec un enfant, ${h.eur(fam(h, 2, 24000).aide)} avec deux, ${h.eur(fam(h, 3, 24000).aide)} avec trois et ${h.eur(fam(h, 4, 24000).aide)} avec quatre. L’écart grandit plus vite que le plafond, parce que chaque enfant joue sur quatre pièces du calcul à la fois : le plafond, le forfait charges, l’abattement R0 sur les ressources et le taux de participation. Un parent qui élève seul ses enfants et un couple avec le même nombre d’enfants relèvent du même barème ; seule la différence de ressources les sépare. Ce sont des estimations : seule la CAF calcule le droit de chaque foyer.`,
    faqs: (h) => [
      { q: 'Je suis seule avec deux enfants en zone 2, ai-je le même plafond qu’un couple ?', a: `Oui. Dès qu’il y a au moins un enfant à charge, le barème ne distingue plus la personne seule du couple : même plafond de ${h.eur(h.M.loyerPlafond(2, false, 2))} pour deux enfants, même forfait charges de ${h.eur(h.M.forfaitCharges(false, 2))}, même abattement R0. À ressources égales, l’aide est donc identique. En pratique, un parent seul déclare souvent un seul revenu, ce qui joue en sa faveur dans la participation personnelle.` },
      { q: 'De combien l’APL augmente-t-elle à l’arrivée d’un troisième enfant en zone 2 ?', a: `Dans notre exemple (loyer de 700 €, 24 000 € de revenus annuels), l’aide passe de ${h.eur(fam(h, 2, 24000).aide)} à ${h.eur(fam(h, 3, 24000).aide)}, soit environ ${h.eur(fam(h, 3, 24000).aide - fam(h, 2, 24000).aide)} de plus par mois. Le plafond monte de ${h.eur(Z(h).par_enfant)}, le forfait charges de ${h.eur(h.P.apl.forfait_charges.par_enfant)}, et l’abattement R0 passe de ${h.eur(h.M.r0(true, 2))} à ${h.eur(h.M.r0(true, 3))}. La naissance se déclare à la CAF pour que l’aide soit recalculée.` },
      { q: 'Mon aîné quitte le foyer, mon APL va-t-elle baisser ?', a: `Oui, s’il n’est plus à votre charge pour la CAF. Une famille de trois enfants qui passe à deux perd ${h.eur(Z(h).par_enfant)} de plafond et ${h.eur(h.P.apl.forfait_charges.par_enfant)} de forfait charges, et son abattement R0 diminue. Avec 700 € de loyer et 24 000 € de revenus, l’estimation recule de ${h.eur(fam(h, 3, 24000).aide)} à ${h.eur(fam(h, 2, 24000).aide)}. Le changement doit être déclaré : un trop-perçu serait réclamé ensuite.` },
      { q: 'Avec 35 000 € de revenus et trois enfants, ai-je encore droit à l’APL en zone 2 ?', a: `Selon notre calcul, oui mais de peu. Pour un loyer de 700 € hors charges, l’aide estimée vaut ${h.eur(fam(h, 3, 35000).aide)} par mois, et elle s’éteint vers ${h.eur(sortie(h, 3))} de revenus nets imposables annuels. Avec quatre enfants, le seuil monte vers ${h.eur(sortie(h, 4))}. Ces seuils dépendent aussi du loyer : un logement moins cher les abaisse.` },
      { q: 'Garde alternée en zone 2 : qui reçoit l’APL pour les enfants ?', a: `Chacun des deux parents, pour ses propres jours de résidence, selon la fiche APL de service-public. Chaque parent dépose donc sa propre demande, pour son propre logement, et déclare la résidence alternée à la CAF. En zone 2, un enfant compte pour ${h.eur(Z(h).par_enfant)} de plafond dès le deuxième ; la répartition fine se fait sur le dossier, et seule la CAF peut chiffrer le droit de chacun.` },
    ],
    body: (h) => `
<h2>Un plafond qui s’élargit à chaque enfant</h2>
<p>Pour un logement loué entier en zone 2, l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')} fixe le loyer plafond à ${h.eur(Z(h).seul, 2)} pour une personne seule et ${h.eur(Z(h).couple, 2)} pour un couple sans enfant. Avec un enfant à charge, il saute à ${h.eur(Z(h).un_enfant, 2)}, puis progresse de ${h.eur(Z(h).par_enfant, 2)} par enfant supplémentaire. C’est la zone des grandes agglomérations hors Paris ; la zone d’une commune précise se vérifie avec le service en ligne indiqué par ${h.src('spApl', 'service-public')}.</p>
${h.table(['Enfants à charge', 'Loyer plafond', 'Forfait charges', 'Abattement R0', 'Aide nulle au-delà de'], N.map((n) => [String(n), h.eur(h.M.loyerPlafond(2, true, n), 2), h.eur(h.M.forfaitCharges(true, n), 2), h.eur(h.M.r0(true, n)), h.eur(sortie(h, n))]), 'Zone 2, couple ou parent seul, loyer de 700 € hors charges, barème du 1er octobre 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>La dernière colonne donne le revenu annuel net imposable au-delà duquel notre estimation tombe sous le seuil de versement de ${h.eur(h.P.apl.seuil_versement)}. Entre un et quatre enfants, il gagne ${h.eur(sortie(h, 4) - sortie(h, 1))} : c’est ce qui permet à des familles aux revenus moyens de rester allocataires.</p>

<h2>Quatre leviers actionnés par chaque enfant</h2>
<p>Un enfant de plus ne se contente pas d’élever le plafond. La formule du ${h.src('cchD823', 'code de la construction et de l’habitation')} fait intervenir trois autres pièces qui bougent en même temps.</p>
<ol>
<li><strong>Le loyer plafond</strong>, relevé de ${h.eur(Z(h).par_enfant)} au-delà du premier enfant.</li>
<li><strong>Le forfait charges</strong>, qui ajoute ${h.eur(h.P.apl.forfait_charges.par_enfant)} par personne à charge au montant de base de ${h.eur(h.P.apl.forfait_charges.base)}.</li>
<li><strong>L’abattement R0</strong>, la part des ressources qui n’entre pas dans la participation : ${h.eur(h.M.r0(true, 1))} avec un enfant, ${h.eur(h.M.r0(true, 4))} avec quatre, selon l’${h.src('arreteR0', 'arrêté du 27 septembre 2019')}.</li>
<li><strong>Le taux de participation familial</strong>, qui baisse : ${h.pct(h.M.tauxFamille(true, 1), 2)} avec un enfant, ${h.pct(h.M.tauxFamille(true, 4), 2)} avec quatre.</li>
</ol>
<p>Le dernier levier est le plus discret et souvent le plus fort quand les revenus sont élevés : chaque euro de ressources au-dessus de R0 coûte moins d’aide à une grande famille qu’à une petite.</p>
<!--mini:aplZone2-->

<h2>Le même loyer, des familles différentes</h2>
<p>Le tableau suit un logement à 700 € hors charges, montant plausible pour un trois ou quatre pièces dans une grande ville de province, et deux niveaux de ressources annuelles.</p>
${h.table(['Enfants', 'APL à 24 000 €', 'APL à 32 000 €', 'Loyer retenu'], N.map((n) => [String(n), h.eur(fam(h, n, 24000).aide), h.eur(fam(h, n, 32000).aide), h.eur(fam(h, n, 24000).loyerRetenu)]), 'Zone 2, loyer de 700 € hors charges, revenus nets imposables sur douze mois (estimation)', ['l', 'r', 'r', 'r'])}
<p>Avec un enfant, 32 000 € de revenus suffisent à éteindre l’aide ; avec quatre, elle reste à ${h.eur(fam(h, 4, 32000).aide)}. Le loyer de 700 € dépasse le plafond jusqu’à trois enfants : à quatre, le plafond de ${h.eur(h.M.loyerPlafond(2, true, 4))} est presque atteint, et un loyer un peu plus élevé serait cette fois retenu en entier.</p>

<h2>Parent seul ou couple : le barème est commun, les ressources non</h2>
<p>Le barème des aides au logement ne connaît que deux compositions sans enfant, personne seule et couple. Dès la première personne à charge, plafond, forfait charges, R0 et taux familial sont identiques pour les deux. Ce qui distingue un parent seul, ce sont ses ressources, souvent plus faibles parce qu’un seul adulte travaille. Un couple qui gagne 32 000 € à deux et un parent seul qui en gagne 24 000 avec le même nombre d’enfants n’ont donc pas la même aide, mais pour une seule raison.</p>
<p>Les personnes à charge ne sont pas que des enfants : un ascendant de plus de 65 ans ou un proche handicapé vivant au foyer peut aussi compter, selon la fiche ${h.src('spApl', 'APL de service-public')}.</p>

<h2>Déménager pour plus grand : ce que l’aide suit, et ce qu’elle ne suit pas</h2>
<p>Une famille qui s’agrandit cherche souvent une pièce de plus. Si le loyer actuel dépasse déjà le plafond, le nouveau loyer plus élevé ne change rien à l’aide : avec trois enfants et 24 000 € de revenus, un logement à 700 € et un autre à 850 € donnent tous deux ${h.eur(fam(h, 3, 24000, 850).aide)} dans notre calcul. Seul le plafond, attaché au nombre d’enfants, fait bouger l’APL. Le budget du déménagement doit donc se raisonner sans compter sur une hausse de l’aide, sauf si l’ancien loyer était inférieur au plafond de la famille.</p>

<h2>Les événements familiaux qui relancent le calcul</h2>
<p>Une naissance, l’arrivée d’un enfant en garde alternée, le départ d’un aîné ou une séparation modifient la composition du foyer. La CAF recalcule alors l’aide, et les ressources elles-mêmes sont actualisées chaque trimestre sur les douze derniers mois. Si le logement n’est pas conventionné, la famille ne touche pas l’APL mais l’allocation de logement familiale, calculée sur le même barème : la page ${h.a('apl-als-alf', 'APL, ALF ou ALS')} détaille la différence. Pour une famille dans une autre zone, voir ${h.a('apl-famille', 'l’APL des familles')} ; le ${h.a('simulateur-apl', 'simulateur APL')} reprend votre foyer complet.</p>
`,
  },
  en: {
    slug: 'housing-aid-zone-2',
    nav: 'APL zone 2',
    card: 'Large regional cities: what each child adds to a family’s rent ceiling and housing aid.',
    title: 'APL Zone 2 2026: Family Housing Aid, Ceiling per Child',
    description: 'APL zone 2 in 2026: €404 rent ceiling with one child, then €59 per extra child. Amounts for couples and lone parents with 1 to 4 children, plus a calculator.',
    h1: 'Housing aid in zone 2: what a family receives by number of children',
    intro: 'In France’s large regional cities, the number of children shapes a family’s housing aid far more than the rent does.',
    resume: (h) => `In zone 2, which covers France's large urban areas outside Paris, a family with one child has its rent counted up to ${h.eur(Z(h).un_enfant)} a month on the scale in force since 1 October 2026, and every further child lifts that ceiling by ${h.eur(Z(h).par_enfant)}. For €700 of rent excluding charges and €24,000 of taxable net income over twelve months, the estimated APL (aide personnalisée au logement, France's main housing benefit, paid by the CAF family allowance fund) is ${h.eur(fam(h, 1, 24000).aide)} with one child, ${h.eur(fam(h, 2, 24000).aide)} with two, ${h.eur(fam(h, 3, 24000).aide)} with three and ${h.eur(fam(h, 4, 24000).aide)} with four. The gap widens faster than the ceiling because each child moves four parts of the formula at once: the ceiling, the service-charge allowance, the R0 income allowance and the contribution rate. A lone parent and a couple with the same number of children sit on the same scale; only their income sets them apart. These are estimates; only the CAF sets each household's entitlement.`,
    faqs: (h) => [
      { q: 'I am a single mother of two in zone 2; is my rent ceiling the same as a couple’s?', a: `Yes. As soon as there is at least one dependent child, the scale no longer separates single people from couples: the same ${h.eur(h.M.loyerPlafond(2, false, 2))} ceiling for two children, the same ${h.eur(h.M.forfaitCharges(false, 2))} service-charge allowance, the same R0 allowance. With equal income the aid is identical. In practice a lone parent often declares a single income, which lowers the contribution deducted from the aid.` },
      { q: 'How much does housing aid rise when a third child is born in zone 2?', a: `In our example (€700 rent, €24,000 yearly income), aid goes from ${h.eur(fam(h, 2, 24000).aide)} to ${h.eur(fam(h, 3, 24000).aide)}, about ${h.eur(fam(h, 3, 24000).aide - fam(h, 2, 24000).aide)} more a month. The ceiling rises by ${h.eur(Z(h).par_enfant)}, the charges allowance by ${h.eur(h.P.apl.forfait_charges.par_enfant)}, and R0 goes from ${h.eur(h.M.r0(true, 2))} to ${h.eur(h.M.r0(true, 3))}. Report the birth to the CAF so the aid is recalculated.` },
      { q: 'My eldest is moving out; will my family’s housing aid go down?', a: `Yes, once the CAF no longer counts them as your dependant. A family going from three children to two loses ${h.eur(Z(h).par_enfant)} of ceiling and ${h.eur(h.P.apl.forfait_charges.par_enfant)} of charges allowance, and its R0 allowance falls. With €700 rent and €24,000 of income, the estimate drops from ${h.eur(fam(h, 3, 24000).aide)} to ${h.eur(fam(h, 2, 24000).aide)}. Report the change promptly, or an overpayment will be clawed back later.` },
      { q: 'We earn €35,000 a year with three children in zone 2; are we still eligible for APL?', a: `On our figures, yes, but only just. With €700 rent excluding charges the estimated aid is ${h.eur(fam(h, 3, 35000).aide)} a month, and it ends at around ${h.eur(sortie(h, 3))} of taxable net income a year. With four children, the cut-off rises to about ${h.eur(sortie(h, 4))}. These thresholds also depend on rent: a cheaper home lowers them.` },
      { q: 'Shared custody in zone 2: which parent gets housing aid for the children?', a: `Both, each for the days the children live with them, according to the APL page on service-public.fr. Each parent files their own claim for their own home and tells the CAF about the alternating residence. In zone 2 a child is worth ${h.eur(Z(h).par_enfant)} of ceiling from the second one on; the exact split is worked out on the file, and only the CAF can put a figure on each parent's entitlement.` },
    ],
    body: (h) => `
<h2>A ceiling that widens with every child</h2>
<p>For a whole home rented in zone 2, the ${h.src('arreteApl2026', 'order of 28 September 2026')} sets the rent ceiling (loyer plafond) at ${h.eur(Z(h).seul, 2)} for a single person and ${h.eur(Z(h).couple, 2)} for a couple without children. With one dependent child it jumps to ${h.eur(Z(h).un_enfant, 2)}, then grows by ${h.eur(Z(h).par_enfant, 2)} for each additional child. This is the zone of the big urban areas outside Paris; the zone of a given town can be checked with the online tool listed by ${h.src('spApl', 'service-public.fr')}.</p>
${h.table(['Dependent children', 'Rent ceiling', 'Charges allowance', 'R0 allowance', 'Aid stops above'], N.map((n) => [String(n), h.eur(h.M.loyerPlafond(2, true, n), 2), h.eur(h.M.forfaitCharges(true, n), 2), h.eur(h.M.r0(true, n)), h.eur(sortie(h, n))]), 'Zone 2, couple or lone parent, €700 rent excluding charges, scale of 1 October 2026', ['l', 'r', 'r', 'r', 'r'])}
<p>The last column is the yearly taxable net income above which our estimate falls below the ${h.eur(h.P.apl.seuil_versement)} payment threshold. Between one and four children it climbs by ${h.eur(sortie(h, 4) - sortie(h, 1))}, which is why middle-income families can remain claimants.</p>

<h2>Four levers pulled by each child</h2>
<p>An extra child does more than raise the ceiling. The formula in the ${h.src('cchD823', 'Construction and Housing Code')} brings in three other parts that move at the same time.</p>
<ol>
<li><strong>The rent ceiling</strong>, up ${h.eur(Z(h).par_enfant)} for each child after the first.</li>
<li><strong>The service-charge allowance</strong> (forfait charges), which adds ${h.eur(h.P.apl.forfait_charges.par_enfant)} per dependant to the ${h.eur(h.P.apl.forfait_charges.base)} base.</li>
<li><strong>The R0 allowance</strong>, the slice of income kept out of your contribution: ${h.eur(h.M.r0(true, 1))} with one child, ${h.eur(h.M.r0(true, 4))} with four, under the ${h.src('arreteR0', 'order of 27 September 2019')}.</li>
<li><strong>The family contribution rate</strong>, which falls: ${h.pct(h.M.tauxFamille(true, 1), 2)} with one child, ${h.pct(h.M.tauxFamille(true, 4), 2)} with four.</li>
</ol>
<p>The last lever is the quietest and often the strongest when income is higher: each euro of income above R0 costs a large family less aid than a small one.</p>
<!--mini:aplZone2-->

<h2>Same rent, different families</h2>
<p>The table follows a €700 home excluding charges, a plausible figure for a two- or three-bedroom flat in a large regional city, at two income levels.</p>
${h.table(['Children', 'APL at €24,000', 'APL at €32,000', 'Rent counted'], N.map((n) => [String(n), h.eur(fam(h, n, 24000).aide), h.eur(fam(h, n, 32000).aide), h.eur(fam(h, n, 24000).loyerRetenu)]), 'Zone 2, €700 rent excluding charges, taxable net income over twelve months (estimate)', ['l', 'r', 'r', 'r'])}
<p>With one child, €32,000 of income is enough to end the aid; with four, it is still ${h.eur(fam(h, 4, 32000).aide)}. The €700 rent is above the ceiling up to three children; with four, the ${h.eur(h.M.loyerPlafond(2, true, 4))} ceiling is almost reached, and slightly higher rent would then be counted in full.</p>

<h2>Lone parent or couple: one scale, different incomes</h2>
<p>The housing aid scale only knows two childless household types, single person and couple. From the first dependant onwards, ceiling, charges allowance, R0 and family rate are the same for both. What sets a lone parent apart is income, often lower because only one adult earns. A couple earning €32,000 between them and a lone parent earning €24,000 with the same number of children do not get the same aid, but for that reason alone.</p>
<p>Dependants are not only children: a parent or grandparent over 65 or a disabled relative living in the home can count too, according to the ${h.src('spApl', 'service-public.fr APL page')}.</p>

<h2>Moving somewhere bigger: what the aid follows and what it ignores</h2>
<p>A growing family often looks for an extra room. If the current rent is already above the ceiling, a higher new rent changes nothing: with three children and €24,000 of income, a €700 home and an €850 one both give ${h.eur(fam(h, 3, 24000, 850).aide)} in our calculation. Only the ceiling, tied to the number of children, moves the APL. Budget the move without counting on more aid, unless your old rent was below your family's ceiling.</p>

<h2>Family events that restart the calculation</h2>
<p>A birth, a child arriving under shared custody, an older child leaving or a separation changes the household. The CAF then recalculates the aid, and income itself is refreshed every quarter over the last twelve months. If the home is not covered by an agreement with the State (non conventionné), the family receives ALF (allocation de logement familiale, the family housing allowance) instead of APL, on the same scale: the ${h.a('apl-als-alf', 'APL, ALF or ALS')} page explains the difference. For families in other zones, see ${h.a('apl-famille', 'housing aid for families')}; the ${h.a('simulateur-apl', 'housing aid calculator')} takes your full household.</p>
`,
  },
});
