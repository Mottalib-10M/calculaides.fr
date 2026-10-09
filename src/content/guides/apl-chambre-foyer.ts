import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples de la page : personne seule, chambre à 380 €, 6 000 € de revenus annuels. */
type Z = 1 | 2 | 3;
const ch = (h: Helpers, zone: Z, loyer = 380, rev = 6000) => h.M.apl({ zone, couple: false, enfants: 0, loyer, logement: 'chambre', revenusAnnuels: rev });
const ent = (h: Helpers, zone: Z, loyer = 380, rev = 6000) => h.M.apl({ zone, couple: false, enfants: 0, loyer, revenusAnnuels: rev });
const coef = (h: Helpers) => h.P.apl.coef_chambre;

export default defineGuide({
  id: 'apl-chambre-foyer',
  group: 'logement',
  order: 140,
  mini: 'aplChambreFoyer',
  related: ['simulateur-apl', 'apl-etudiant', 'apl-colocation', 'apl-als-alf', 'apl-loyer-plafond'],
  sources: ['spApl', 'spAls', 'arreteApl2026', 'cchD823'],
  fr: {
    slug: 'apl-chambre-foyer',
    nav: 'APL chambre ou foyer',
    card: 'Chambre chez un particulier, foyer, résidence ou Ehpad : le plafond à 90 % et les limites d’une estimation.',
    title: 'APL chambre 2026 : plafond à 90 %, foyer, résidence, Ehpad',
    description: 'APL pour une chambre en 2026 : la CAF retient 90 % du loyer plafond d’un logement entier, soit 264,31 € en zone 2. Foyers, résidences et Ehpad : ce qui change.',
    h1: 'APL pour une chambre, un foyer ou une résidence',
    intro: 'Louer une chambre plutôt qu’un logement entier réduit le plafond, et vivre en établissement change le circuit de l’aide.',
    resume: (h) => `Une personne seule qui loue une chambre 380 € par mois en zone 2, avec 6 000 € de revenus nets imposables sur douze mois, peut toucher environ ${h.eur(ch(h, 2).aide)} d’APL au barème du 1er octobre 2026. Le loyer plafond d’une chambre est fixé à ${h.pct(coef(h), 0)} de celui d’un logement entier : ${h.eur(ch(h, 2).plafond, 2)} en zone 2 au lieu de ${h.eur(h.M.loyerPlafond(2, false, 0), 2)}, ${h.eur(ch(h, 1).plafond, 2)} en zone 1 et ${h.eur(ch(h, 3).plafond, 2)} en zone 3. Le reste de la formule ne bouge pas : même forfait charges, même participation selon les ressources. Pour les résidents d’un établissement (logement-foyer, foyer de jeunes travailleurs, résidence autonomie, Ehpad), l’aide est en général versée au gestionnaire, qui la déduit de la redevance. Le calcul officiel de ces foyers suit des règles propres que notre outil ne reproduit pas : il leur applique la règle de la chambre, ce qui donne un ordre de grandeur et non le montant exact. Seule la CAF calcule le droit, sur le dossier.`,
    faqs: (h) => [
      { q: 'Je loue une chambre chez l’habitant, ai-je droit à l’APL ?', a: `Oui, si le logement est votre résidence principale, décent, et que le bail ou la sous-location est en règle. Si la personne qui vous loge est elle-même locataire, la sous-location doit être déclarée au propriétaire et n’ouvre l’aide qu’aux moins de 30 ans ou aux personnes chez un accueillant familial. Le plafond retenu est alors celui d’une chambre, ${h.eur(ch(h, 2).plafond, 2)} en zone 2.` },
      { q: 'En Ehpad ou en résidence autonomie, l’aide au logement m’est-elle versée directement ?', a: `En général non. Selon service-public, l’aide d’un résident en établissement est versée au gestionnaire, qui la déduit de la redevance mensuelle. Vous payez donc une redevance déjà réduite. L’établissement doit être conventionné pour l’APL ; sinon, c’est l’allocation de logement sociale (ALS) qui peut prendre le relais, sous les mêmes conditions de ressources sur douze mois.` },
      { q: 'Pourquoi votre estimation pour mon foyer de jeunes travailleurs peut-elle différer de celle de la CAF ?', a: `Parce que les logements-foyers relèvent d’un mode de calcul propre, fondé sur la redevance, que notre moteur ne reproduit pas. Nous leur appliquons la règle des chambres, avec un plafond à ${h.pct(coef(h), 0)} de celui d’un logement entier. L’ordre de grandeur est utile pour budgéter, mais l’écart avec le montant réel peut atteindre plusieurs dizaines d’euros. Seule la notification de la CAF fait foi.` },
      { q: 'Une chambre meublée à 380 € en zone 2, combien d’APL avec 6 000 € de revenus ?', a: `Environ ${h.eur(ch(h, 2).aide)} par mois au barème du 1er octobre 2026. La CAF retient le plafond de chambre, ${h.eur(ch(h, 2).plafond, 2)}, ajoute un forfait charges de ${h.eur(ch(h, 2).charges, 2)} et retire une participation de ${h.eur(ch(h, 2).pp)} liée aux ressources. Le même loyer pour un studio entier donnerait ${h.eur(ent(h, 2).aide)}.` },
      { q: 'La chambre m’est louée par mon oncle, la CAF peut-elle refuser l’aide ?', a: `Pas pour ce motif. Selon service-public, l’aide est exclue quand le propriétaire est un ascendant ou un descendant, de vous ou de votre conjoint : parent, grand-parent, enfant. Un oncle, une tante, un frère ou un cousin peuvent en revanche vous louer une chambre ouvrant droit à l’aide, avec un vrai loyer et un logement décent. Le plafond reste celui d’une chambre, ${h.eur(ch(h, 1).plafond, 2)} en zone 1.` },
    ],
    body: (h) => `
<h2>Le coefficient de 90 % et rien d’autre</h2>
<p>La location d’une chambre suit la formule générale du ${h.src('cchD823', 'code de la construction et de l’habitation')}, avec une seule différence : le loyer plafond est multiplié par ${h.num(coef(h), 2)}. Le forfait charges reste celui d’une personne seule, ${h.eur(h.M.forfaitCharges(false, 0), 2)}, et la participation dépend toujours des ressources des douze derniers mois. Le tableau compare la même personne, 380 € de loyer et 6 000 € de revenus annuels, dans une chambre et dans un studio.</p>
${h.table(['Zone', 'Plafond logement entier', 'Plafond chambre', 'APL studio', 'APL chambre'], ([1, 2, 3] as const).map((z) => [`Zone ${z}`, h.eur(h.M.loyerPlafond(z, false, 0), 2), h.eur(ch(h, z).plafond, 2), h.eur(ent(h, z).aide), h.eur(ch(h, z).aide)]), 'Personne seule, loyer 380 €, 6 000 € de revenus annuels, barème du 1er octobre 2026 (estimation)', ['l', 'r', 'r', 'r', 'r'])}
<p>L’écart entre chambre et studio est modeste, une trentaine d’euros, parce que seul le plafond change. Il n’apparaît d’ailleurs que si le loyer dépasse le plafond de la chambre : une chambre à 220 € en zone 3, sous les deux plafonds, donne pratiquement la même aide qu’un studio au même prix, à quelques centimes près.</p>

<h2>Chambre ou colocation : deux coefficients différents</h2>
<p>Une chambre dans un appartement partagé peut relever de deux régimes. Si chaque occupant a son nom sur un bail commun, c’est une colocation : plafond à ${h.pct(h.P.apl.coef_colocation, 0)} et forfait charges réduit à ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'), 2)}. Si la chambre fait l’objet d’un contrat de location à part, c’est une chambre : plafond à ${h.pct(coef(h), 0)} et forfait charges entier. Pour 380 € en zone 2 et 6 000 € de revenus, la différence est nette : ${h.eur(ch(h, 2).aide)} pour la chambre, ${h.eur(h.M.apl({ zone: 2, couple: false, enfants: 0, loyer: 380, logement: 'colocation', revenusAnnuels: 6000 }).aide)} en colocation. En cas de doute sur le régime applicable, c’est la CAF qui tranche au vu du bail transmis. La page ${h.a('apl-colocation', 'APL en colocation')} détaille le second cas.</p>

<h2>La chambre chez un particulier</h2>
<p>Louer une chambre dans l’appartement ou la maison d’un particulier ouvre droit à l’aide dans les mêmes conditions qu’un logement entier : résidence principale occupée au moins huit mois par an, logement décent, loyer réellement payé. Deux situations demandent une vérification.</p>
<p>Si votre hôte est lui-même locataire, vous êtes sous-locataire. Le ${h.src('spApl', 'service-public')} ne retient la sous-location que si elle est déclarée au propriétaire, et seulement pour les moins de 30 ans ou les personnes hébergées chez un accueillant familial. Au-delà de 30 ans, une chambre sous-louée chez un locataire n’ouvre pas d’aide.</p>
<p>Si votre hôte est de votre famille, tout dépend du lien. Un parent, un grand-parent ou un enfant propriétaire exclut l’aide ; un frère, une tante ou un cousin ne l’exclut pas.</p>

<h2>Foyers, résidences et Ehpad : le circuit de la redevance</h2>
<p>Les résidents d’un établissement (logement-foyer, foyer de jeunes travailleurs, résidence pour étudiants, résidence autonomie, Ehpad) ne paient pas un loyer mais une redevance. L’APL leur est ouverte quand l’établissement est conventionné. Elle est alors versée, en règle générale, directement au gestionnaire, qui la retire de la redevance : le résident ne voit passer qu’une facture réduite. Hors conventionnement, la ${h.src('spAls', 'fiche de l’ALS')} prévoit que l’allocation de logement sociale peut être demandée pour une redevance en établissement, sous les mêmes conditions de ressources.</p>
<p>Le calcul officiel de ces aides en foyer n’est pas celui d’une location ordinaire : il repose sur la redevance et sur des barèmes propres aux logements-foyers. Notre moteur, lui, ne connaît que la location. Il traite donc un résident de foyer comme le locataire d’une chambre, avec le plafond à ${h.pct(coef(h), 0)}. Pour une redevance de 550 € en zone 2 et 11 000 € de revenus, il estime l’aide à ${h.eur(ch(h, 2, 550, 11000).aide)}. Prenez ce chiffre comme un ordre de grandeur pour préparer un budget, pas comme une promesse : l’écart avec le montant notifié peut être sensible, dans un sens comme dans l’autre.</p>
<!--mini:aplChambreFoyer-->

<h2>Quand une hausse de la redevance compte</h2>
<p>Une augmentation du loyer ou de la redevance en cours d’année n’est pas prise en compte tout de suite. Selon le service-public, l’aide est réévaluée au 1er janvier suivant, sur la base du montant payé en juillet. Une redevance qui augmente en septembre ne change donc l’aide qu’au début de l’année suivante. Le barème lui-même a été revalorisé au 1er octobre 2026 par l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')}.</p>

<h2>Ce qu’il faut fournir</h2>
<ul>
<li><strong>Une attestation de loyer ou de résidence en foyer</strong>, remplie et signée par le bailleur ou le gestionnaire.</li>
<li><strong>Le bail ou le contrat de résidence</strong>, avec la surface et le caractère meublé de la chambre.</li>
<li><strong>Pour une sous-location</strong>, l’accord écrit du propriétaire.</li>
</ul>
<p>Les étudiants trouveront le cas des résidences universitaires sur la page ${h.a('apl-etudiant', 'APL étudiant')}. Le ${h.a('simulateur-apl', 'simulateur APL')} propose l’option chambre, et toute estimation reste indicative : la CAF fixe seule le droit.</p>
`,
  },
  en: {
    slug: 'housing-aid-room-hostel',
    nav: 'APL for a room or hostel',
    card: 'A room in someone’s home, a hostel, a residence or a care home: the 90% ceiling and the limits of an estimate.',
    title: 'APL for a Room 2026: 90% Ceiling, Hostels, Care Homes',
    description: 'Housing aid (APL) for a room in 2026: the CAF counts 90% of a whole-home rent ceiling, €264.31 in zone 2. What changes in hostels, residences and care homes.',
    h1: 'Housing aid for a room, a hostel or a residence',
    intro: 'Renting a room rather than a whole home lowers the ceiling, and living in an establishment changes who receives the aid.',
    resume: (h) => `A single person renting a room for €380 a month in zone 2, with €6,000 of taxable net income over the last twelve months, can receive about ${h.eur(ch(h, 2).aide)} of APL (French housing benefit) under the scale in force since 1 October 2026. The rent ceiling for a room is set at ${h.pct(coef(h), 0)} of a whole home’s: ${h.eur(ch(h, 2).plafond, 2)} in zone 2 instead of ${h.eur(h.M.loyerPlafond(2, false, 0), 2)}, ${h.eur(ch(h, 1).plafond, 2)} in zone 1 (Paris area) and ${h.eur(ch(h, 3).plafond, 2)} in zone 3. The rest of the formula is unchanged: same charges allowance, same income-based contribution. For residents of an establishment, such as a hostel (logement-foyer), a young workers’ hostel, a supported residence for older people (résidence autonomie) or a care home (Ehpad), the aid usually goes to the manager, who deducts it from the monthly fee (redevance). The official calculation for these places follows its own rules, which our tool does not reproduce: it applies the room rule instead, which gives a ballpark figure rather than the exact amount. Only the CAF, the family allowance fund, sets the entitlement.`,
    faqs: (h) => [
      { q: 'I rent a room in a private home, can I get APL?', a: `Yes, if it is your main home, it meets decency standards and the letting is in order. If your host is a tenant, you are a subtenant: the sublet must be declared to the landlord and only opens aid to people under 30 or those housed by an approved family host. The ceiling used is the room figure, ${h.eur(ch(h, 2).plafond, 2)} in zone 2.` },
      { q: 'In a care home or supported residence, is the housing aid paid to me?', a: `Usually not. According to service-public.fr, aid for a resident of an establishment goes to the manager, who takes it off the monthly fee. You simply pay a reduced fee. The establishment must be approved (conventionné) for APL; otherwise the social housing allowance (ALS) can step in, on the same twelve-month income conditions.` },
      { q: 'Why might your estimate for my young workers’ hostel differ from the CAF figure?', a: `Because hostels (logements-foyers) have their own method based on the fee, which our engine does not model. We apply the room rule to them, with a ceiling at ${h.pct(coef(h), 0)} of a whole home. The ballpark is useful for budgeting, but the gap with the real amount can reach several tens of euros. Only the CAF decision letter counts.` },
      { q: 'How much APL for a €380 furnished room in zone 2 on €6,000 a year?', a: `About ${h.eur(ch(h, 2).aide)} a month on the 1 October 2026 scale. The CAF counts the room ceiling of ${h.eur(ch(h, 2).plafond, 2)}, adds a charges allowance of ${h.eur(ch(h, 2).charges, 2)} and subtracts an income-based contribution of ${h.eur(ch(h, 2).pp)}. The same rent for a whole studio would give ${h.eur(ent(h, 2).aide)}.` },
      { q: 'My uncle rents me the room, can the CAF refuse housing aid for that?', a: `Not on that ground. Service-public.fr excludes aid when the owner is an ascendant or descendant of you or your partner: parent, grandparent, child. An uncle, aunt, brother or cousin can let you a room that qualifies, provided there is real rent and the home is decent. The ceiling stays the room one, ${h.eur(ch(h, 1).plafond, 2)} in zone 1.` },
    ],
    body: (h) => `
<h2>A 90% coefficient, and nothing else</h2>
<p>Renting a room follows the general formula of the ${h.src('cchD823', 'Construction and Housing Code')}, with one difference: the rent ceiling is multiplied by ${h.num(coef(h), 2)}. The charges allowance stays at the single-person level, ${h.eur(h.M.forfaitCharges(false, 0), 2)}, and the contribution still depends on income over the last twelve months. The table compares the same person, €380 of rent and €6,000 of yearly income, in a room and in a studio.</p>
${h.table(['Zone', 'Whole-home ceiling', 'Room ceiling', 'APL, studio', 'APL, room'], ([1, 2, 3] as const).map((z) => [`Zone ${z}`, h.eur(h.M.loyerPlafond(z, false, 0), 2), h.eur(ch(h, z).plafond, 2), h.eur(ent(h, z).aide), h.eur(ch(h, z).aide)]), 'Single person, €380 rent, €6,000 yearly income, scale of 1 October 2026 (estimate)', ['l', 'r', 'r', 'r', 'r'])}
<p>The gap between room and studio is small, around thirty euros, because only the ceiling moves. It only shows when rent exceeds the room ceiling: a €220 room in zone 3, under both ceilings, gives practically the same aid as a studio at that price, give or take a few cents.</p>

<h2>Room or flat-share: two different coefficients</h2>
<p>A room in a shared flat can fall under either regime. If every occupant is named on one joint lease, it is a flat-share (colocation): a ceiling at ${h.pct(h.P.apl.coef_colocation, 0)} and a charges allowance cut to ${h.eur(h.M.forfaitCharges(false, 0, 'colocation'), 2)}. If the room has its own separate tenancy agreement, it is a room: ceiling at ${h.pct(coef(h), 0)} and the full charges allowance. At €380 in zone 2 on €6,000 of income, the difference is clear: ${h.eur(ch(h, 2).aide)} for the room, ${h.eur(h.M.apl({ zone: 2, couple: false, enfants: 0, loyer: 380, logement: 'colocation', revenusAnnuels: 6000 }).aide)} as a flat-share. If you are unsure which regime applies, the CAF decides from the lease you send it. The ${h.a('apl-colocation', 'flat-share housing aid')} page covers the second case.</p>

<h2>A room in a private home</h2>
<p>Renting a room in someone’s flat or house opens the same right as renting a whole home: your main residence, lived in at least eight months a year, a decent home, rent actually paid. Two situations need a check.</p>
<p>If your host is a tenant, you are a subtenant. ${h.src('spApl', 'Service-public.fr')} only accepts a sublet declared to the landlord, and only for people under 30 or those housed by an approved family host (accueillant familial). Over 30, a room sublet from a tenant does not open aid.</p>
<p>If your host is a relative, it depends on the link. A parent, grandparent or child as owner rules aid out; a brother, aunt or cousin does not.</p>

<h2>Hostels, residences and care homes: aid through the fee</h2>
<p>Residents of an establishment, whether a hostel, a young workers’ hostel (foyer de jeunes travailleurs), a student residence, a supported residence or a care home, pay a fee rather than rent. APL is open to them when the establishment is approved. It is then, as a rule, paid straight to the manager, who deducts it from the fee: the resident only sees a reduced bill. Outside approval, the ${h.src('spAls', 'ALS sheet')} allows the social housing allowance to be claimed for a fee in an establishment, on the same income conditions.</p>
<p>The official sum for hostels is not that of an ordinary tenancy: it rests on the fee and on scales specific to logements-foyers. Our engine only knows tenancies, so it treats a hostel resident as the tenant of a room, with the ${h.pct(coef(h), 0)} ceiling. For a €550 fee in zone 2 and €11,000 of income, it estimates the aid at ${h.eur(ch(h, 2, 550, 11000).aide)}. Read that as a ballpark for planning a budget, not a promise: the gap with the notified amount can be noticeable, either way.</p>
<!--mini:aplChambreFoyer-->

<h2>When a higher fee starts to count</h2>
<p>A rise in rent or fee during the year is not taken into account straight away. Service-public.fr says the aid is reassessed on the following 1 January, using the amount paid in July. A fee that goes up in September therefore only affects the aid at the start of the next year. The scale itself was uprated on 1 October 2026 by the ${h.src('arreteApl2026', 'order of 28 September 2026')}.</p>

<h2>What to provide</h2>
<ul>
<li><strong>A rent or residence certificate</strong> (attestation de loyer ou de résidence en foyer), completed and signed by the landlord or manager.</li>
<li><strong>The lease or residence contract</strong>, showing the floor area and whether the room is furnished.</li>
<li><strong>For a sublet</strong>, the owner’s written consent.</li>
</ul>
<p>Students will find university residences covered on the ${h.a('apl-etudiant', 'student housing aid')} page. The ${h.a('simulateur-apl', 'housing aid calculator')} has a room option, and every estimate is indicative: the CAF alone decides.</p>
`,
  },
});
