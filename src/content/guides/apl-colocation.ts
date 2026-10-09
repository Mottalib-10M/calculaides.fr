import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples de la page : un colocataire seul, part de loyer de 400 €, 9 000 € de revenus annuels. */
type Z = 1 | 2 | 3;
const co = (h: Helpers, zone: Z, loyer = 400, rev = 9000, couple = false) => h.M.apl({ zone, couple, enfants: 0, loyer, logement: 'colocation', revenusAnnuels: rev });
const seul = (h: Helpers, zone: Z, loyer = 400, rev = 9000) => h.M.apl({ zone, couple: false, enfants: 0, loyer, revenusAnnuels: rev });
const coef = (h: Helpers) => h.P.apl.coef_colocation;
const deg = (h: Helpers) => h.P.apl.degressivite['2'];

export default defineGuide({
  id: 'apl-colocation',
  group: 'logement',
  order: 30,
  mini: 'aplColocation',
  related: ['simulateur-apl', 'apl-couple', 'apl-chambre-foyer', 'apl-loyer-plafond', 'apl-ressources'],
  sources: ['spApl', 'arreteApl2026', 'cchD823'],
  fr: {
    slug: 'apl-colocation',
    nav: 'APL en colocation',
    card: 'Plafond réduit, forfait charges divisé par deux : ce que touche chaque colocataire sur sa part de loyer.',
    title: 'APL colocation 2026 : plafond à 75 %, part de loyer, montant',
    description: 'APL en colocation 2026 : la CAF retient 75 % du loyer plafond d’une personne seule, sur la part de loyer de chacun. Montants par zone au barème d’octobre 2026.',
    h1: 'APL en colocation : l’aide de chaque colocataire',
    intro: 'En colocation, chacun a son propre dossier, sa propre part de loyer et un plafond plus bas que s’il louait seul.',
    resume: (h) => `Un colocataire qui paie 400 € de loyer hors charges pour sa part, avec 9 000 € de revenus nets imposables sur douze mois, peut compter sur environ ${h.eur(co(h, 2).aide)} d’APL par mois en zone 2 au barème du 1er octobre 2026. La même personne, au même loyer dans un studio, toucherait ${h.eur(seul(h, 2).aide)}. L’écart tient à deux règles propres à la colocation. Le loyer plafond est ramené à ${h.pct(coef(h), 0)} de celui d’une personne seule, soit ${h.eur(co(h, 2).plafond)} en zone 2 au lieu de ${h.eur(h.M.loyerPlafond(2, false, 0))}. Le forfait charges d’un colocataire seul tombe à ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'))} contre ${h.eur(h.M.forfaitCharges(false, 0))}. Chaque colocataire fait sa demande à son nom, déclare ses seules ressources et reçoit une aide calculée sur la part de loyer qu’il verse. Les revenus des autres occupants n’entrent pas dans son calcul, sauf s’il vit en couple avec l’un d’eux. Ces montants restent des estimations : la CAF calcule le droit sur le dossier complet.`,
    faqs: (h) => [
      { q: 'Mon nom n’est pas sur le bail de la colocation, puis-je toucher l’APL ?', a: `En principe non : selon service-public, chaque colocataire qui demande l’aide doit figurer sur le bail. Une exception existe pour la sous-location déclarée au propriétaire, ouverte aux moins de 30 ans ou aux personnes hébergées chez un accueillant familial. Sans bail ni sous-location déclarée, la CAF n’a aucune part de loyer à retenir, et le plafond de ${h.eur(co(h, 2).plafond)} en zone 2 reste sans effet.` },
      { q: 'Les salaires de mes colocataires font-ils baisser mon APL ?', a: `Non. La CAF ne regarde que vos ressources des douze derniers mois, et celles de la personne avec qui vous vivez en couple. Un colocataire qui gagne 40 000 € par an ne change rien à votre droit. Dans notre exemple de zone 2, avec 9 000 € de revenus personnels, l’aide reste d’environ ${h.eur(co(h, 2).aide)}, quels que soient les revenus des autres occupants du logement.` },
      { q: 'On partage le loyer à 60/40, sur quelle somme la CAF calcule-t-elle mon aide ?', a: `Sur la part que vous payez réellement, telle qu’elle figure dans la déclaration de loyer. Si le loyer total est de 1 000 €, celui qui verse 600 € et celui qui verse 400 € n’ont pas la même base. En zone 2, le plafond de colocation de ${h.eur(co(h, 2).plafond)} est toutefois dépassé dans les deux cas : la part retenue est la même, et l’écart d’aide reste nul tant que la dégressivité ne joue pas.` },
      { q: 'Nous sommes en couple dans une colocation à quatre, comment l’aide est-elle calculée ?', a: `Le couple forme un seul foyer pour la CAF : une demande, les ressources des deux, la part de loyer des deux. Le plafond est celui d’un couple, réduit à ${h.pct(coef(h), 0)}, soit ${h.eur(co(h, 2, 500, 16000, true).plafond)} en zone 2, et le forfait charges vaut ${h.eur(h.M.forfaitCharges(true, 0, 'colocation'))}. Avec 500 € de loyer pour le couple et 16 000 € de revenus, l’estimation tombe à ${h.eur(co(h, 2, 500, 16000, true).aide)} par mois.` },
      { q: 'Pourquoi je touche moins en colocation que dans un studio au même prix ?', a: `Parce que la CAF considère qu’une colocation coûte moins cher par personne : plafond à ${h.pct(coef(h), 0)} et forfait charges réduit. À 400 € de loyer en zone 3 et 9 000 € de revenus, l’aide passe de ${h.eur(seul(h, 3).aide)} dans un logement loué seul à ${h.eur(co(h, 3).aide)} en colocation. La participation personnelle, elle, ne bouge pas : elle dépend des ressources, pas du type de logement.` },
    ],
    body: (h) => `
<h2>Un dossier par colocataire, pas un dossier par logement</h2>
<p>La colocation n’existe pas pour la CAF comme un foyer unique. Chaque occupant titulaire du bail dépose sa propre demande, avec son numéro d’allocataire, ses revenus et la part du loyer qu’il règle. Le ${h.src('spApl', 'service-public')} le résume ainsi : chaque colocataire peut toucher l’APL, à condition d’avoir son nom sur le bail et de déclarer ses ressources personnelles. Trois personnes qui partagent un appartement de 1 200 € ouvrent donc trois droits distincts, calculés séparément.</p>
<p>Ce découpage a une conséquence directe : un colocataire sans revenus ne profite pas de la situation des autres, et un colocataire aisé ne pénalise personne. La seule exception est le couple, qui compte pour un foyer même au milieu d’autres occupants.</p>

<h2>Le plafond de colocation, zone par zone</h2>
<p>L’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')} a revalorisé les loyers plafonds au 1er octobre. En colocation, ce plafond est multiplié par ${h.num(coef(h), 2)}. Le tableau garde le même colocataire : seul, 400 € de part de loyer hors charges, 9 000 € de revenus nets imposables sur l’année.</p>
${h.table(['Zone', 'Plafond personne seule', 'Plafond colocation', 'APL logement seul', 'APL colocation'], ([1, 2, 3] as const).map((z) => [`Zone ${z}`, h.eur(h.M.loyerPlafond(z, false, 0), 2), h.eur(co(h, z).plafond, 2), h.eur(seul(h, z).aide), h.eur(co(h, z).aide)]), 'Part de loyer de 400 €, 9 000 € de revenus annuels, barème du 1er octobre 2026 (estimation)', ['l', 'r', 'r', 'r', 'r'])}
<p>Dans les trois zones, une part de 400 € dépasse largement le plafond de colocation. La CAF ne retient alors que le plafond : payer 350 € ou 450 € pour sa chambre dans le même appartement donne la même aide, tant que la part reste sous le seuil de dégressivité.</p>

<h2>D’où vient l’écart avec un logement loué seul</h2>
<p>La formule du ${h.src('cchD823', 'code de la construction et de l’habitation')} additionne le loyer retenu et un forfait charges, puis retire la participation personnelle. En colocation, les deux premiers termes baissent : le loyer retenu passe de ${h.eur(seul(h, 2).loyerRetenu, 2)} à ${h.eur(co(h, 2).loyerRetenu, 2)} en zone 2, et le forfait charges d’une personne seule de ${h.eur(h.M.forfaitCharges(false, 0))} à ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'))}. Le troisième terme reste identique, environ ${h.eur(co(h, 2).pp)} par mois avec 9 000 € de revenus, car il ne dépend que des ressources et de la composition du foyer.</p>
<p>Résultat : la perte se chiffre à ${h.eur(seul(h, 2).aide - co(h, 2).aide)} par mois dans notre exemple. Elle est presque fixe, quel que soit le niveau de revenus, jusqu’au moment où l’aide de colocation s’éteint. Pour ce colocataire de zone 2, cela arrive vers ${h.eur(h.M.seuilSortieApl({ zone: 2, couple: false, enfants: 0, loyer: 400, logement: 'colocation' }))} de revenus annuels, bien avant le seuil d’un logement loué seul (${h.eur(h.M.seuilSortieApl({ zone: 2, couple: false, enfants: 0, loyer: 400 }))}).</p>

<h2>Une part de loyer très élevée</h2>
<p>La dégressivité s’applique aussi en colocation, mais sur le plafond réduit. En zone 2, l’aide commence à baisser quand la part dépasse ${h.num(deg(h)[0], 1)} fois le plafond de colocation, soit ${h.eur(co(h, 2).plafond * deg(h)[0])}, et disparaît à ${h.num(deg(h)[1], 1)} fois, soit ${h.eur(co(h, 2).plafond * deg(h)[1])}. Un colocataire qui paie 600 € pour une grande chambre avec salle de bains ne touche plus qu’environ ${h.eur(co(h, 2, 600).aide)}. Les seuils de la zone 1 sont plus hauts, et la page ${h.a('apl-loyer-plafond', 'loyers plafonds et dégressivité')} les détaille.</p>

<h2>Le couple au milieu des colocataires</h2>
<p>Deux personnes en couple dans une colocation (mariés, pacsés ou en concubinage) ne déposent qu’une demande. Leurs revenus s’additionnent, leurs parts de loyer aussi. Le plafond retenu est celui d’un couple, toujours réduit à ${h.pct(coef(h), 0)} : ${h.eur(co(h, 2, 500, 16000, true).plafond, 2)} en zone 2. Le forfait charges remonte à ${h.eur(h.M.forfaitCharges(true, 0, 'colocation'))}. Pour un couple qui verse 500 € à deux avec 16 000 € de revenus, l’estimation est de ${h.eur(co(h, 2, 500, 16000, true).aide)} par mois. Les règles générales du couple sont sur la page ${h.a('apl-couple', 'APL en couple')}.</p>

<h2>Avant de déposer la demande</h2>
<ul>
<li><strong>Faire inscrire tous les noms au bail</strong>, ou faire déclarer la sous-location au propriétaire si vous avez moins de 30 ans : sans cela, aucune part de loyer n’est retenue.</li>
<li><strong>Demander une déclaration de loyer qui précise la part de chacun</strong> : c’est elle qui fixe la base de votre aide.</li>
<li><strong>Déposer dès l’arrivée</strong> : les droits s’ouvrent le mois qui suit la demande, et le premier versement a lieu le 5 du mois suivant.</li>
<li><strong>Prévenir la CAF au départ d’un colocataire</strong> si votre part augmente : sinon la base de calcul reste l’ancienne.</li>
</ul>
<p>Le ${h.a('simulateur-apl', 'simulateur APL')} propose l’option colocation, et l’estimation qu’il donne reste indicative : seule la CAF fixe le montant versé.</p>
`,
  },
  en: {
    slug: 'flat-share-housing-aid',
    nav: 'Flat-share APL',
    card: 'A lower ceiling and half the charges allowance: what each flatmate receives on their share of the rent.',
    title: 'Flat-Share APL 2026: 75% Rent Ceiling, Your Share, Amounts',
    description: 'Flat-share housing aid (APL) in 2026: the CAF counts 75% of the single-person rent ceiling on each flatmate’s share. Amounts by zone at October 2026 rates.',
    h1: 'Housing aid in a flat-share: what each flatmate gets',
    intro: 'In a flat-share (colocation), every tenant has a separate claim, a separate share of the rent and a lower ceiling than someone renting alone.',
    resume: (h) => `A flatmate paying €400 a month excluding charges as their share, with €9,000 of taxable net income over the last twelve months, can expect about ${h.eur(co(h, 2).aide)} of APL (the main French housing benefit) a month in zone 2 under the scale in force since 1 October 2026. The same person paying the same rent for a studio would get ${h.eur(seul(h, 2).aide)}. Two flat-share rules explain the gap. The rent ceiling is cut to ${h.pct(coef(h), 0)} of the single-person figure, so ${h.eur(co(h, 2).plafond)} in zone 2 instead of ${h.eur(h.M.loyerPlafond(2, false, 0))}. The flat service-charge allowance for a single flatmate drops to ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'))} from ${h.eur(h.M.forfaitCharges(false, 0))}. Each flatmate applies in their own name to the CAF (the family allowance fund), reports only their own income and is assessed on the share of rent they actually pay. Other tenants’ earnings play no part, unless you are a couple with one of them. These are estimates; the CAF sets the real entitlement from the full file.`,
    faqs: (h) => [
      { q: 'I am not named on the tenancy agreement of our flat-share, can I still claim APL?', a: `Normally not. Service-public.fr states that each flatmate claiming the aid must be on the lease. There is one way round it: a sublet declared to the landlord, open to people under 30 or to those housed by an approved family host (accueillant familial). Without a lease or a declared sublet, the CAF has no rent share to count, and the ${h.eur(co(h, 2).plafond)} zone 2 ceiling never comes into play.` },
      { q: 'Does a high-earning flatmate reduce my housing aid?', a: `No. The CAF only looks at your own income over the last twelve months, plus that of a partner if you live as a couple. A flatmate earning €40,000 a year changes nothing for you. In our zone 2 example, with €9,000 of personal income, the aid stays at about ${h.eur(co(h, 2).aide)} a month whatever the other occupants earn.` },
      { q: 'We split the rent 60/40, which amount does the CAF use for me?', a: `The share you really pay, as stated on the rent certificate (attestation de loyer) your landlord fills in. With €1,000 of total rent, the person paying €600 and the one paying €400 start from different figures. In zone 2, though, both shares exceed the ${h.eur(co(h, 2).plafond)} flat-share ceiling, so the rent counted is identical and so is the aid, until the high-rent reduction applies.` },
      { q: 'My partner and I share a flat with two friends, how is our aid worked out?', a: `A couple is one household for the CAF: one claim, both incomes, both rent shares added together. The ceiling is the couple figure cut to ${h.pct(coef(h), 0)}, which gives ${h.eur(co(h, 2, 500, 16000, true).plafond)} in zone 2, and the charges allowance is ${h.eur(h.M.forfaitCharges(true, 0, 'colocation'))}. Paying €500 between you with €16,000 of combined income, the estimate falls to ${h.eur(co(h, 2, 500, 16000, true).aide)} a month.` },
      { q: 'Why do I get less in a flat-share than in a studio at the same price?', a: `Because the rules assume shared housing costs less per head: a ceiling at ${h.pct(coef(h), 0)} and a smaller charges allowance. With €400 of rent in zone 3 and €9,000 of income, the aid moves from ${h.eur(seul(h, 3).aide)} for a home rented alone to ${h.eur(co(h, 3).aide)} in a flat-share. Your own contribution does not change: it depends on income, not on the type of home.` },
    ],
    body: (h) => `
<h2>One claim per flatmate, not one per flat</h2>
<p>The CAF does not treat a flat-share as a single household. Every tenant named on the lease files their own claim, with their own CAF number (numéro d’allocataire), their own income and the part of the rent they pay. ${h.src('spApl', 'Service-public.fr')} puts it plainly: each flatmate can receive APL, provided their name is on the lease and they report their personal resources. Three people sharing a €1,200 flat therefore open three separate entitlements, assessed one by one.</p>
<p>The split cuts both ways. A flatmate with no income gains nothing from the others, and a well-paid one costs nobody anything. The only exception is a couple, who count as one household even when they live among other tenants.</p>

<h2>The flat-share ceiling in each zone</h2>
<p>The ${h.src('arreteApl2026', 'order of 28 September 2026')} raised rent ceilings on 1 October. In a flat-share, that ceiling is multiplied by ${h.num(coef(h), 2)}. The table keeps one flatmate constant: single, a €400 rent share excluding charges, €9,000 of taxable net income for the year. France is split into three housing-aid zones, zone 1 being the most expensive.</p>
${h.table(['Zone', 'Single ceiling', 'Flat-share ceiling', 'Aid, rented alone', 'Aid, flat-share'], ([1, 2, 3] as const).map((z) => [`Zone ${z}`, h.eur(h.M.loyerPlafond(z, false, 0), 2), h.eur(co(h, z).plafond, 2), h.eur(seul(h, z).aide), h.eur(co(h, z).aide)]), '€400 rent share, €9,000 yearly income, scale of 1 October 2026 (estimate)', ['l', 'r', 'r', 'r', 'r'])}
<p>In all three zones a €400 share is well above the flat-share ceiling, so the CAF only counts the ceiling. Paying €350 or €450 for your room in the same flat makes no difference to the aid, as long as your share stays below the point where the reduction for high rents begins.</p>

<h2>Where the gap with a home of your own comes from</h2>
<p>The formula in the ${h.src('cchD823', 'Construction and Housing Code')} adds the rent counted to a flat charges allowance, then subtracts your own contribution. In a flat-share the first two items shrink: the rent counted falls from ${h.eur(seul(h, 2).loyerRetenu, 2)} to ${h.eur(co(h, 2).loyerRetenu, 2)} in zone 2, and the single-person charges allowance from ${h.eur(h.M.forfaitCharges(false, 0))} to ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'))}. The third item is unchanged, roughly ${h.eur(co(h, 2).pp)} a month on €9,000 of income, because it depends only on resources and household make-up.</p>
<p>The loss works out at ${h.eur(seul(h, 2).aide - co(h, 2).aide)} a month in our example. It is close to fixed at every income level, right up to the point where flat-share aid runs out. For this zone 2 tenant that happens at about ${h.eur(h.M.seuilSortieApl({ zone: 2, couple: false, enfants: 0, loyer: 400, logement: 'colocation' }))} of yearly income, well before the cut-off for a home rented alone (${h.eur(h.M.seuilSortieApl({ zone: 2, couple: false, enfants: 0, loyer: 400 }))}).</p>

<h2>A very large rent share</h2>
<p>The high-rent reduction (dégressivité) also exists in flat-shares, measured against the reduced ceiling. In zone 2, aid starts to fall once your share passes ${h.num(deg(h)[0], 1)} times the flat-share ceiling, that is ${h.eur(co(h, 2).plafond * deg(h)[0])}, and stops entirely at ${h.num(deg(h)[1], 1)} times, or ${h.eur(co(h, 2).plafond * deg(h)[1])}. Someone paying €600 for a large room with its own bathroom keeps only about ${h.eur(co(h, 2, 600).aide)}. Zone 1 thresholds are higher; the page on ${h.a('apl-loyer-plafond', 'rent ceilings and the high-rent reduction')} lists them.</p>

<h2>A couple inside a flat-share</h2>
<p>Two partners in a flat-share, whether married, in a civil partnership (Pacs) or simply living together, file a single claim. Their incomes are pooled and so are their rent shares. The ceiling is the couple one, still cut to ${h.pct(coef(h), 0)}: ${h.eur(co(h, 2, 500, 16000, true).plafond, 2)} in zone 2. The charges allowance rises to ${h.eur(h.M.forfaitCharges(true, 0, 'colocation'))}. A couple paying €500 together on €16,000 of income would receive an estimated ${h.eur(co(h, 2, 500, 16000, true).aide)} a month. General couple rules are on the ${h.a('apl-couple', 'couple housing aid')} page.</p>

<h2>Before you send the claim</h2>
<ul>
<li><strong>Get every name on the lease</strong>, or have a sublet declared to the landlord if you are under 30: otherwise no rent share is counted.</li>
<li><strong>Ask for a rent certificate showing each person’s share</strong>: that figure is the base of your aid.</li>
<li><strong>Apply as soon as you move in</strong>: entitlement starts the month after the claim, and the first payment arrives on the 5th of the following month.</li>
<li><strong>Tell the CAF when a flatmate leaves</strong> and your share goes up, or the old figure stays in the calculation.</li>
</ul>
<p>The ${h.a('simulateur-apl', 'housing aid calculator')} has a flat-share option. Its result is a guide only: the CAF alone decides what it pays.</p>
`,
  },
});
