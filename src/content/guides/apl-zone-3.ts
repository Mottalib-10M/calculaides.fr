import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples de la page : zone 3, petits loyers, 9 000 € de revenus nets imposables sur douze mois. */
const REV = 9000;
const seul = (h: Helpers, loyer: number, rev = REV) => h.M.apl({ zone: 3, couple: false, enfants: 0, loyer, revenusAnnuels: rev });
const fam = (h: Helpers, loyer: number) => h.M.apl({ zone: 3, couple: true, enfants: 1, loyer, revenusAnnuels: 16000 });
const plS = (h: Helpers) => h.M.loyerPlafond(3, false, 0);
const gain10 = (h: Helpers, loyer: number) => seul(h, loyer + 10).aide - seul(h, loyer).aide;
const LOYERS = [150, 200, 250, 275, 350];

export default defineGuide({
  id: 'apl-zone-3',
  group: 'logement',
  order: 90,
  mini: 'aplZone3',
  related: ['apl-loyer-plafond', 'simulateur-apl', 'apl-zone-1', 'apl-zone-2', 'apl-calcul'],
  sources: ['spApl', 'arreteApl2026', 'cchD823'],
  fr: {
    slug: 'apl-zone-3',
    nav: 'APL zone 3',
    card: 'Villes moyennes et campagne : sous le plafond, chaque euro de loyer déclaré entre dans l’aide.',
    title: 'APL zone 3 2026 : petits loyers, plafond et montant réel',
    description: 'APL zone 3 2026 : plafond de 275 € pour une personne seule. Sous ce montant, la CAF retient le loyer réel, qui fait varier l’aide. Cas types et simulateur.',
    h1: 'APL en zone 3 : quand le loyer réel fait le montant',
    intro: 'Hors des grandes villes, beaucoup de loyers restent sous le plafond : la CAF prend alors le loyer tel qu’il est, et l’aide suit.',
    resume: (h) => `En zone 3, le loyer plafond d’une personne seule est de ${h.eur(plS(h))} par mois au barème du 1er octobre 2026, ${h.eur(h.M.loyerPlafond(3, true, 0))} pour un couple et ${h.eur(h.M.loyerPlafond(3, true, 1))} avec un enfant. Ce sont les plafonds les plus bas de France métropolitaine, mais ce sont aussi les seuls que de nombreux locataires n’atteignent pas : studio en ville moyenne, petite maison de bourg, logement ancien loué à bas prix. Sous le plafond, la CAF retient le loyer réel, et l’aide en dépend directement. Pour 9 000 € de revenus nets imposables sur douze mois, une personne seule qui paie 200 € hors charges reçoit environ ${h.eur(seul(h, 200).aide)} par mois ; à 250 €, l’estimation monte à ${h.eur(seul(h, 250).aide)}. Chaque tranche de 10 € de loyer ajoute près de ${h.eur(gain10(h, 200), 2)} d’aide, jusqu’au plafond. Au-delà, plus rien ne bouge. Ces chiffres sont des estimations ; seule la CAF calcule le droit.`,
    faqs: (h) => [
      { q: 'Je paie 220 € de loyer dans un bourg en zone 3, combien d’APL puis-je toucher ?', a: `Pour une personne seule avec 9 000 € de revenus nets imposables sur douze mois, notre estimation est de ${h.eur(seul(h, 220).aide)} par mois. Le loyer de 220 € est sous le plafond de ${h.eur(plS(h))} : il est retenu en entier. Avec des revenus plus élevés, par exemple 14 000 €, l’aide estimée tombe à ${h.eur(seul(h, 220, 14000).aide)}. Ces montants suivent le barème du 1er octobre 2026 et ne valent que comme estimation.` },
      { q: 'Si mon propriétaire baisse le loyer, mon APL baisse-t-elle aussi ?', a: `En zone 3, souvent oui, si le loyer est sous le plafond. Une personne seule qui passe de 260 € à 230 € de loyer voit son aide estimée passer de ${h.eur(seul(h, 260).aide)} à ${h.eur(seul(h, 230).aide)} : elle gagne quand même ${h.eur(30 - (seul(h, 260).aide - seul(h, 230).aide), 2)} par mois sur son reste à payer. Si le loyer dépasse le plafond de ${h.eur(plS(h))}, une baisse qui reste au-dessus ne touche pas l’aide.` },
      { q: 'Je loue la maison de mon oncle à la campagne, ai-je droit à l’APL ?', a: 'Oui, selon la fiche APL de service-public : un frère, une sœur, un oncle, une tante, un cousin ou un neveu peut être votre bailleur sans fermer le droit. En revanche, aucune aide n’est due si le propriétaire est votre ascendant (parent, grand-parent) ou votre descendant, ou celui de votre conjoint ou partenaire de Pacs. Le logement doit rester décent et être votre résidence principale, occupée au moins 8 mois par an.' },
      { q: 'Pourquoi un loyer de 280 € et un de 350 € donnent-ils la même APL en zone 3 ?', a: `Parce que les deux dépassent le plafond d’une personne seule, fixé à ${h.eur(plS(h))}. La CAF ne retient que ce montant, et l’aide estimée reste à ${h.eur(seul(h, 350).aide)} pour 9 000 € de revenus. La dégressivité ne joue qu’à partir de ${h.num(h.P.apl.degressivite['3'][0], 1)} fois le plafond, soit ${h.eur(plS(h) * h.P.apl.degressivite['3'][0])} : un cas rare à ce niveau de loyer.` },
      { q: 'Mon APL calculée en zone 3 fait 8 €, pourquoi la CAF ne verse-t-elle rien ?', a: `Parce qu’une aide au logement inférieure à ${h.eur(h.P.apl.seuil_versement)} par mois n’est pas versée. Ce cas arrive plus vite avec un petit loyer, car le loyer retenu est faible et la participation personnelle l’absorbe presque entièrement. Pour une personne seule à 200 € de loyer, notre calcul passe sous ce seuil vers ${h.eur(h.M.seuilSortieApl({ zone: 3, couple: false, enfants: 0, loyer: 200 }))} de revenus annuels. Un trimestre de revenus plus bas peut rouvrir le versement.` },
    ],
    body: (h) => `
<h2>Le plafond de la zone 3 n’est pas toujours la limite</h2>
<p>La zone 3 couvre les communes qui ne relèvent ni de l’agglomération parisienne ni des grandes agglomérations : villes moyennes, petites villes et campagne. Le classement exact d’une commune se vérifie avec le service en ligne de l’État signalé par ${h.src('spApl', 'service-public')}. L’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')} y fixe les plafonds suivants pour un logement loué entier.</p>
${h.table(['Foyer', 'Loyer plafond zone 3'], [['Personne seule', h.eur(plS(h), 2)], ['Couple sans enfant', h.eur(h.M.loyerPlafond(3, true, 0), 2)], ['Un enfant à charge', h.eur(h.M.loyerPlafond(3, true, 1), 2)], ['Deux enfants', h.eur(h.M.loyerPlafond(3, true, 2), 2)], ['Par enfant supplémentaire', `+ ${h.eur(h.P.apl.loyers_plafonds['3'].par_enfant, 2)}`]], 'Barème du 1er octobre 2026', ['l', 'r'])}
<p>À Paris, comparer son loyer au plafond est presque inutile, tant l’écart est grand. Ici, c’est la première chose à faire : un locataire sous le plafond est dans une autre logique de calcul, où chaque euro de loyer déclaré compte.</p>

<h2>Ce que rapporte un euro de loyer en plus</h2>
<p>La formule du ${h.src('cchD823', 'code de la construction et de l’habitation')} additionne le loyer retenu et un forfait charges de ${h.eur(h.M.forfaitCharges(false, 0), 2)}, puis retire une participation personnelle. Sous le plafond, augmenter le loyer augmente le premier terme presque à l’identique. Presque seulement, car la participation monte un peu avec lui : son minimum vaut ${h.pct(h.P.apl.p0_taux, 1)} du loyer et des charges (au moins ${h.eur(h.P.apl.p0_min, 2)}), et un taux lié au loyer s’ajoute dès que celui-ci dépasse ${h.pct(h.P.apl.tl.seuil1, 0)} du loyer de référence.</p>
${h.table(['Loyer hors charges', 'Loyer retenu', 'APL estimée', 'Aide pour 10 € de plus'], LOYERS.map((l) => { const r = seul(h, l); return [h.eur(l), h.eur(r.loyerRetenu, 2), h.eur(r.aide), h.eur(gain10(h, l), 2)]; }), 'Zone 3, personne seule, 9 000 € de revenus sur douze mois (estimation)', ['l', 'r', 'r', 'r'])}
<p>Entre 150 € et le plafond, l’aide progresse d’environ ${h.eur(gain10(h, 150) / 10, 2)} à ${h.eur(gain10(h, 250) / 10, 2)} par euro de loyer. Passé ${h.eur(plS(h))}, la dernière colonne tombe à zéro. Le reste à charge, lui, continue de monter euro pour euro.</p>
<!--mini:aplZone3-->

<h2>Petit loyer, petite aide : le seuil de ${h.eur(h.P.apl.seuil_versement)}</h2>
<p>Un loyer très bas a un revers. Le montant brut de l’aide est réduit d’une minoration forfaitaire de ${h.eur(h.P.apl.minoration)}, puis il n’est versé que s’il atteint ${h.eur(h.P.apl.seuil_versement)} par mois. Avec 150 € de loyer, notre personne seule touche ${h.eur(seul(h, 150).aide)} à 9 000 € de revenus ; à 12 000 €, l’estimation descend à ${h.eur(seul(h, 150, 12000).aide)}. Un salaire à temps partiel suffit donc à faire disparaître l’aide sur un loyer modeste, alors qu’elle subsisterait sur un loyer au plafond.</p>

<h2>Une famille en zone 3</h2>
<p>Un couple avec un enfant et 16 000 € de revenus annuels loue une maison de bourg. À 300 € hors charges, son loyer est sous le plafond de ${h.eur(h.M.loyerPlafond(3, true, 1))} et l’aide estimée vaut ${h.eur(fam(h, 300).aide)}. À 380 €, le plafond est dépassé et l’aide monte à ${h.eur(fam(h, 380).aide)} ; à 450 €, elle reste exactement la même. Pour cette famille, les ${h.eur(h.M.loyerPlafond(3, true, 1) - 300)} de loyer supplémentaire jusqu’au plafond sont en partie pris en charge, les suivants non. Avec un deuxième enfant, le plafond monterait de ${h.eur(h.P.apl.loyers_plafonds['3'].par_enfant)}, ce qui rouvrirait une marge.</p>

<h2>Comparer deux logements avant de signer</h2>
<p>Sous le plafond, l’écart de loyer entre deux logements est en partie amorti par l’aide, ce qui change la façon de choisir. Prenons une personne seule avec 9 000 € de revenus qui hésite entre un studio à 200 € et un deux-pièces à 260 € hors charges. Le loyer diffère de 60 €, mais l’aide estimée passe de ${h.eur(seul(h, 200).aide)} à ${h.eur(seul(h, 260).aide)}. Une fois l’aide déduite, le deux-pièces ne coûte en réalité que ${h.eur(60 - (seul(h, 260).aide - seul(h, 200).aide), 2)} de plus par mois. Le même raisonnement ne marche plus au-dessus du plafond : entre un logement à 300 € et un autre à 360 €, l’aide ne bouge pas et les 60 € restent entièrement à payer. Avant de comparer des annonces en zone 3, il vaut donc mieux raisonner en loyer net d’aide, avec le mini-simulateur ci-dessus, qu’en loyer affiché.</p>

<h2>Trois vérifications propres aux petits loyers</h2>
<ul>
<li><strong>Déclarer le loyer hors charges exact</strong>, tel qu’il figure sur le bail : sous le plafond, une erreur de 20 € se répercute presque entièrement sur l’aide.</li>
<li><strong>Vérifier le lien avec le bailleur</strong> : la location à un parent ou à un enfant n’ouvre aucun droit, celle à un oncle ou à un cousin oui.</li>
<li><strong>S’assurer que le logement est décent</strong> : un logement ancien à bas prix peut ne pas l’être, et l’aide peut alors être suspendue.</li>
</ul>
<p>Le versement intervient le 5 de chaque mois, à partir du mois qui suit la demande. Le mécanisme pas à pas est détaillé sur la page ${h.a('apl-calcul', 'calcul de l’APL')}, et le ${h.a('simulateur-apl', 'simulateur APL')} reprend toutes les situations.</p>
`,
  },
  en: {
    slug: 'housing-aid-zone-3',
    nav: 'APL zone 3',
    card: 'Mid-sized towns and the countryside: below the ceiling, every euro of declared rent feeds into the aid.',
    title: 'APL Zone 3 2026: Low Rents, Ceiling and the Real Amount',
    description: 'APL zone 3 in 2026: a €275 rent ceiling for a single person. Below it, the CAF counts your actual rent, so the aid moves with it. Worked cases and a calculator.',
    h1: 'Housing aid in zone 3: when your actual rent sets the amount',
    intro: 'Outside the big cities many rents stay below the ceiling, so the CAF takes the rent as it is and the aid follows.',
    resume: (h) => `In zone 3, the single-person rent ceiling is ${h.eur(plS(h))} a month on the scale in force since 1 October 2026, ${h.eur(h.M.loyerPlafond(3, true, 0))} for a couple and ${h.eur(h.M.loyerPlafond(3, true, 1))} with one child. These are the lowest ceilings in mainland France, yet they are also the only ones many tenants never reach: a studio in a mid-sized town, a small village house, an older home let cheaply. Below the ceiling, the CAF (the family allowance fund that pays APL, France's main housing benefit) counts your actual rent, and the aid depends on it directly. With €9,000 of taxable net income over twelve months, a single person paying €200 excluding charges receives about ${h.eur(seul(h, 200).aide)} a month; at €250 the estimate rises to ${h.eur(seul(h, 250).aide)}. Every extra €10 of rent adds close to ${h.eur(gain10(h, 200), 2)} of aid, up to the ceiling. Beyond it, nothing moves. These figures are estimates; only the CAF calculates the entitlement.`,
    faqs: (h) => [
      { q: 'I pay €220 rent in a French village in zone 3; how much APL can I get?', a: `For a single person with €9,000 of taxable net income over twelve months, our estimate is ${h.eur(seul(h, 220).aide)} a month. A €220 rent is under the ${h.eur(plS(h))} ceiling, so it is counted in full. With higher income, say €14,000, the estimate falls to ${h.eur(seul(h, 220, 14000).aide)}. These amounts follow the 1 October 2026 scale and are estimates only.` },
      { q: 'If my landlord lowers the rent, does my housing aid drop too?', a: `In zone 3, often yes, when rent is below the ceiling. A single person whose rent goes from €260 to €230 sees the estimated aid move from ${h.eur(seul(h, 260).aide)} to ${h.eur(seul(h, 230).aide)}, yet still saves ${h.eur(30 - (seul(h, 260).aide - seul(h, 230).aide), 2)} a month on what they pay. If rent is above the ${h.eur(plS(h))} ceiling, a cut that keeps it above leaves the aid untouched.` },
      { q: 'Can I get APL if I rent my uncle’s house in the countryside?', a: 'Yes, according to the APL page on service-public.fr: a brother, sister, uncle, aunt, cousin or nephew can be your landlord without closing the right. No aid is due, however, if the owner is your parent, grandparent, child or grandchild, or those of your spouse or civil partner (Pacs). The home must still meet decency standards and be your main residence, lived in at least 8 months a year.' },
      { q: 'Why do a €280 rent and a €350 rent give the same housing aid in zone 3?', a: `Because both are above the single-person ceiling of ${h.eur(plS(h))}. The CAF counts only that figure, and the estimate stays at ${h.eur(seul(h, 350).aide)} on €9,000 of income. The high-rent taper only starts at ${h.num(h.P.apl.degressivite['3'][0], 1)} times the ceiling, ${h.eur(plS(h) * h.P.apl.degressivite['3'][0])}, which is rare at these rent levels.` },
      { q: 'My zone 3 housing aid works out at €8; why does the CAF pay nothing?', a: `Because housing aid below ${h.eur(h.P.apl.seuil_versement)} a month is not paid. With a low rent this happens sooner, since the rent counted is small and your own contribution swallows almost all of it. For a single person paying €200, our calculation drops below that threshold at around ${h.eur(h.M.seuilSortieApl({ zone: 3, couple: false, enfants: 0, loyer: 200 }))} of yearly income. A quarter with lower income can restart payment.` },
    ],
    body: (h) => `
<h2>In zone 3 the ceiling is not always the limit</h2>
<p>Zone 3 covers towns outside the Paris area and the large urban areas: mid-sized towns, small towns and the countryside. Where a given town sits can be checked with the government's online tool listed by ${h.src('spApl', 'service-public.fr')}. The ${h.src('arreteApl2026', 'order of 28 September 2026')} sets these ceilings for a whole home rented there.</p>
${h.table(['Household', 'Zone 3 rent ceiling'], [['Single person', h.eur(plS(h), 2)], ['Couple, no children', h.eur(h.M.loyerPlafond(3, true, 0), 2)], ['One dependent child', h.eur(h.M.loyerPlafond(3, true, 1), 2)], ['Two children', h.eur(h.M.loyerPlafond(3, true, 2), 2)], ['Each extra child', `+ ${h.eur(h.P.apl.loyers_plafonds['3'].par_enfant, 2)}`]], 'Scale of 1 October 2026', ['l', 'r'])}
<p>In Paris, comparing your rent with the ceiling is almost pointless, the gap is so wide. Here it is the first thing to do: a tenant under the ceiling is in a different kind of calculation, where every declared euro of rent counts.</p>

<h2>What one more euro of rent brings</h2>
<p>The formula in the ${h.src('cchD823', 'Construction and Housing Code')} adds the rent counted to a service-charge allowance of ${h.eur(h.M.forfaitCharges(false, 0), 2)}, then takes off your own contribution. Below the ceiling, higher rent raises the first term almost one for one. Almost, because the contribution creeps up too: its minimum is ${h.pct(h.P.apl.p0_taux, 1)} of rent plus charges (at least ${h.eur(h.P.apl.p0_min, 2)}), and a rent-linked rate kicks in once rent passes ${h.pct(h.P.apl.tl.seuil1, 0)} of the reference rent.</p>
${h.table(['Rent excl. charges', 'Rent counted', 'Estimated APL', 'Aid for €10 more'], LOYERS.map((l) => { const r = seul(h, l); return [h.eur(l), h.eur(r.loyerRetenu, 2), h.eur(r.aide), h.eur(gain10(h, l), 2)]; }), 'Zone 3, single person, €9,000 income over twelve months (estimate)', ['l', 'r', 'r', 'r'])}
<p>Between €150 and the ceiling, aid grows by roughly ${h.eur(gain10(h, 150) / 10, 2)} to ${h.eur(gain10(h, 250) / 10, 2)} per euro of rent. Past ${h.eur(plS(h))}, the last column drops to zero, while what you pay keeps climbing euro for euro.</p>
<!--mini:aplZone3-->

<h2>Small rent, small aid: the ${h.eur(h.P.apl.seuil_versement)} floor</h2>
<p>Very low rent has a downside. The gross aid is cut by a flat ${h.eur(h.P.apl.minoration)} deduction, then paid only if it reaches ${h.eur(h.P.apl.seuil_versement)} a month. With €150 rent our single tenant gets ${h.eur(seul(h, 150).aide)} on €9,000 of income; at €12,000 the estimate falls to ${h.eur(seul(h, 150, 12000).aide)}. A part-time wage can therefore wipe out the aid on a modest rent, when it would survive on a rent at the ceiling.</p>

<h2>A family in zone 3</h2>
<p>A couple with one child and €16,000 of yearly income rents a village house. At €300 excluding charges their rent is below the ${h.eur(h.M.loyerPlafond(3, true, 1))} ceiling and the estimated aid is ${h.eur(fam(h, 300).aide)}. At €380 the ceiling is passed and aid rises to ${h.eur(fam(h, 380).aide)}; at €450 it stays exactly the same. For this family the first ${h.eur(h.M.loyerPlafond(3, true, 1) - 300)} of extra rent, up to the ceiling, is partly covered and the rest is not. A second child would lift the ceiling by ${h.eur(h.P.apl.loyers_plafonds['3'].par_enfant)}, reopening some room.</p>

<h2>Comparing two homes before you sign</h2>
<p>Below the ceiling, the rent gap between two homes is partly absorbed by the aid, which changes how you choose. Take a single person on €9,000 a year torn between a €200 studio and a €260 one-bedroom flat, excluding charges. The rents differ by €60, but the estimated aid goes from ${h.eur(seul(h, 200).aide)} to ${h.eur(seul(h, 260).aide)}. Once the aid is deducted, the larger flat really costs only ${h.eur(60 - (seul(h, 260).aide - seul(h, 200).aide), 2)} more a month. The same logic fails above the ceiling: between a €300 home and a €360 one, the aid does not move and the full €60 is yours to pay. When comparing listings in zone 3, think in rent net of aid, using the mini calculator above, rather than in advertised rent.</p>

<h2>Three checks that matter for low rents</h2>
<ul>
<li><strong>Declare the exact rent excluding charges</strong>, as written in the lease: below the ceiling, a €20 mistake feeds almost entirely into the aid.</li>
<li><strong>Check your link to the landlord</strong>: renting from a parent or child opens no right, renting from an uncle or cousin does.</li>
<li><strong>Make sure the home meets decency standards</strong> (logement décent): a cheap older property may not, and the aid can then be suspended.</li>
</ul>
<p>Payment arrives on the 5th of each month, starting the month after your claim. The step-by-step mechanism is on the ${h.a('apl-calcul', 'APL calculation')} page, and the ${h.a('simulateur-apl', 'housing aid calculator')} covers every situation.</p>
`,
  },
});
