import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Foyers comparés : zone 2, loyer 550 €, 14 000 € de revenus sur 12 mois. */
const cas = (h: Helpers, couple: boolean, enfants: number) => h.M.apl({ zone: 2, couple, enfants, loyer: 550, revenusAnnuels: 14000 });

export default defineGuide({
  id: 'apl-als-alf',
  group: 'logement',
  order: 130,
  mini: 'aplAlsAlf',
  related: ['simulateur-apl', 'apl-calcul', 'apl-couple', 'apl-famille', 'apl-chambre-foyer'],
  sources: ['spApl', 'spAls', 'cchD823', 'arreteApl2026'],
  fr: {
    slug: 'apl-als-alf',
    nav: 'APL, ALF ou ALS',
    card: 'Trois noms pour une même aide au logement : ce qui décide de l’étiquette, et pourquoi le montant ne change pas.',
    title: 'APL, ALF ou ALS 2026 : quelle aide au logement pour vous',
    description: 'APL, ALF ou ALS en 2026 : logement conventionné, c’est l’APL ; sinon la famille tranche entre ALF et ALS. Même barème depuis 2001, donc même montant net.',
    h1: 'APL, ALF, ALS : trois noms, un seul calcul',
    intro: 'La CAF verse l’une des trois, jamais deux à la fois, et le nom dépend du logement puis de la famille, pas de vos revenus.',
    resume: (h) => `En 2026, l’APL, l’ALF et l’ALS se calculent avec la même formule et les mêmes barèmes, alignés depuis 2001 : pour un même loyer, une même zone et les mêmes ressources, le montant est identique. Un couple marié sans enfant qui loue 550 € en zone 2 avec 14 000 € de revenus annuels reçoit environ ${h.eur(cas(h, true, 0).aide)} par mois, qu’on appelle cette aide APL, ALF ou ALS. Ce qui change, c’est l’étiquette, et elle se décide dans un ordre précis. D’abord le logement : s’il est conventionné, c’est-à-dire lié à l’État par une convention, comme la plupart des HLM, l’aide est l’APL. Sinon, la situation familiale tranche : des enfants ou autres personnes à charge, un mariage, une grossesse ouvrent l’ALF. Tous les autres locataires, en particulier les personnes seules et les couples non mariés sans enfant, reçoivent l’ALS. Les trois aides ne se cumulent pas. Les montants cités sont des estimations : la CAF détermine l’aide et son nom.`,
    faqs: (h) => [
      { q: 'Je suis pacsé sans enfant, pourquoi la CAF me verse l’ALS et pas l’ALF ?', a: `Parce que la liste des situations qui ouvrent l’ALF, sur la fiche F13132 de service-public, cite les couples mariés sans enfant, pas les partenaires de Pacs ni les concubins. Dans un logement non conventionné, un couple pacsé sans personne à charge relève donc de l’ALS. Le montant n’y perd rien : avec 550 € de loyer en zone 2 et 14 000 € de revenus, l’estimation est de ${h.eur(cas(h, true, 0).aide)} dans les deux cas.` },
      { q: 'Comment savoir si mon logement est conventionné APL ?', a: `Le plus simple est de demander au bailleur : selon la fiche officielle sur l’APL, c’est à lui de vous l’indiquer. La plupart des logements HLM le sont. Un logement du parc privé peut l’être aussi, s’il fait l’objet d’une convention signée par son propriétaire avec l’État. Pour le montant, la réponse ne change rien : un plafond de ${h.eur(h.M.loyerPlafond(2, false, 0), 2)} s’applique à une personne seule en zone 2 dans les trois cas.` },
      { q: 'L’ALS est-elle moins élevée que l’APL pour le même loyer ?', a: `Non. Les barèmes ont été unifiés en 2001 et le code de la construction et de l’habitation applique depuis une formule commune, revalorisée de 1,15 % au 1er octobre 2026. Une personne seule qui loue 550 € en zone 2 avec 14 000 € de revenus reçoit environ ${h.eur(cas(h, false, 0).aide)} par mois, que ce soit sous le nom d’APL ou d’ALS.` },
      { q: 'Enceinte et seule, à partir de quand puis-je toucher l’ALF ?', a: `Selon la fiche F13132, une femme enceinte vivant seule sans personne à charge relève de l’ALF à partir du premier jour du mois civil qui suit le quatrième mois de grossesse, jusqu’au mois de la naissance. Avant, si le logement n’est pas conventionné, elle perçoit l’ALS. Le passage de l’une à l’autre ne modifie pas le calcul : ce sont la naissance et l’enfant à charge qui relèvent ensuite le plafond.` },
      { q: 'Peut-on toucher l’APL et l’ALF en même temps ?', a: `Non. La fiche officielle sur l’ALF précise qu’elle n’est pas accordée à qui bénéficie déjà de l’APL ou de l’ALS, et l’ALS n’est versée qu’à défaut des deux autres. Un foyer touche donc une seule aide au logement, pour sa résidence principale, celle qu’il occupe au moins huit mois par an. Le montant suit le barème commun, ${h.eur(cas(h, false, 1).aide)} par exemple pour un parent seul avec un enfant dans notre cas de zone 2.` },
      { q: 'Mon père de 70 ans vit chez moi : quelle aide au logement demander ?', a: `Dans un logement non conventionné, l’ALF, si vous l’avez à charge et que ses ressources ne dépassent pas le plafond de l’Aspa, le minimum vieillesse, comme l’indique la fiche F13132. L’âge requis est de plus de 65 ans, ou 60 ans en cas d’inaptitude au travail. Dans un logement conventionné, ce sera l’APL. Dans les deux cas, une personne à charge relève le plafond : ${h.eur(h.M.loyerPlafond(2, false, 1), 2)} en zone 2.` },
    ],
    body: (h) => `
<h2>L’ordre dans lequel la CAF choisit le nom</h2>
<p>La question n’est jamais « laquelle est la plus avantageuse » : il n’y a pas de choix à faire. La CAF examine votre dossier dans un ordre fixe.</p>
<ol>
<li><strong>Le logement est-il conventionné ?</strong> Si oui, l’aide est l’APL, selon la ${h.src('spApl', 'fiche F12006 de service-public')}. Le bailleur sait si son logement l’est ; la plupart des HLM le sont.</li>
<li><strong>Sinon, la famille ouvre-t-elle l’ALF ?</strong> La fiche F13132 sur l’allocation de logement familiale liste les cas : percevoir des prestations familiales ou l’AEEH, avoir un enfant à charge de 21 ans au plus sans prestations, être marié sans enfant, être enceinte et seule à partir du mois qui suit le quatrième mois de grossesse, avoir à charge un ascendant de plus de 65 ans aux ressources modestes, ou un proche atteint d’une incapacité d’au moins 80 %.</li>
<li><strong>Sinon, l’ALS.</strong> La ${h.src('spAls', 'fiche F1280')} le dit simplement : l’allocation de logement sociale est versée à qui ne peut prétendre ni à l’APL ni à l’ALF.</li>
</ol>
<p>Les conditions communes restent les mêmes pour les trois : résidence principale en France, logement décent, pas de lien d’ascendant ou de descendant avec le propriétaire, ressources des douze derniers mois sous les barèmes.</p>

<h2>Un barème, trois étiquettes : la preuve par les chiffres</h2>
<p>Depuis 2001, le calcul est commun. La formule du ${h.src('cchD823', 'code de la construction et de l’habitation')}, loyer retenu plus forfait charges moins participation personnelle, s’applique telle quelle, avec les plafonds de l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')}. Le tableau prend quatre foyers dans un logement à 550 € hors charges en zone 2, avec 14 000 € de revenus sur douze mois.</p>
${h.table(['Foyer', 'Logement conventionné', 'Logement non conventionné', 'Montant estimé'], [['Personne seule', 'APL', 'ALS', h.eur(cas(h, false, 0).aide)], ['Couple pacsé sans enfant', 'APL', 'ALS', h.eur(cas(h, true, 0).aide)], ['Couple marié sans enfant', 'APL', 'ALF', h.eur(cas(h, true, 0).aide)], ['Parent seul, un enfant', 'APL', 'ALF', h.eur(cas(h, false, 1).aide)]], 'Nom de l’aide et montant, zone 2, loyer 550 €, barème du 1er octobre 2026 (estimation)', ['l', 'l', 'l', 'r'])}
<p>La dernière colonne ne dépend que de la composition du foyer. Le couple pacsé et le couple marié touchent la même somme, l’un en ALS, l’autre en ALF. C’est l’enfant, pas le nom de l’aide, qui fait monter le montant : plafond de ${h.eur(h.M.loyerPlafond(2, false, 1), 2)} au lieu de ${h.eur(h.M.loyerPlafond(2, false, 0), 2)}, forfait charges de ${h.eur(h.M.forfaitCharges(false, 1), 2)} et abattement R0 plus large.</p>
<!--mini:aplAlsAlf-->

<h2>Les vraies différences, qui ne touchent pas au montant</h2>
<h3>Qui reçoit l’argent</h3>
<p>L’APL est en règle générale versée directement au bailleur, qui la déduit du loyer : le locataire ne voit passer que la quittance réduite. Pour un résident en établissement, elle va au gestionnaire. C’est la conséquence pratique la plus visible de la convention.</p>
<h3>Le moment où le nom change</h3>
<p>Un même locataire peut changer d’aide sans déménager. Une personne seule en ALS qui se marie passe à l’ALF ; une femme enceinte seule passe de l’ALS à l’ALF au cours de la grossesse ; un couple pacsé qui accueille un enfant aussi. Si le bailleur signe une convention, l’aide devient l’APL. Le versement continue, et le montant ne bouge que si la composition du foyer change.</p>
<h3>Les établissements</h3>
<p>En résidence autonomie, en résidence étudiante ou en logement-foyer, l’aide est l’APL lorsque l’établissement est conventionné, et elle porte sur une redevance plutôt qu’un loyer. La page ${h.a('apl-chambre-foyer', 'APL en chambre ou en foyer')} décrit l’approximation que nous faisons dans ce cas.</p>

<h2>Pourquoi notre simulateur ne demande pas le nom de l’aide</h2>
<p>Puisque le calcul est le même, le ${h.a('simulateur-apl', 'simulateur APL')} donne un montant valable pour les trois aides. Il a besoin de la zone, du loyer, de la composition du foyer et des ressources, comme le détaille ${h.a('apl-calcul', 'le calcul pas à pas')}. Les règles propres aux couples et aux familles sont sur ${h.a('apl-couple', 'l’APL en couple')} et ${h.a('apl-famille', 'l’APL avec enfants')}. Seule la CAF, sur dossier, fixe le nom et le montant de l’aide.</p>
`,
  },
  en: {
    slug: 'apl-alf-als-differences',
    nav: 'APL, ALF or ALS',
    card: 'Three names for one housing aid: what decides the label, and why the amount stays the same.',
    title: 'APL, ALF or ALS 2026: Which French Housing Aid Applies',
    description: 'APL, ALF or ALS in 2026: an approved (conventionné) home gives APL; otherwise family status decides ALF or ALS. One scale since 2001, so the same amount.',
    h1: 'APL, ALF, ALS: three names, one calculation',
    intro: 'The CAF pays one of the three, never two at once, and the name depends on your home and then your family, not on your income.',
    resume: (h) => `In 2026, France's three housing benefits, APL (aide personnalisée au logement), ALF (allocation de logement familiale) and ALS (allocation de logement sociale), are worked out with the same formula and the same scales, aligned since 2001. For the same rent, zone and income, the amount is identical. A married couple without children renting for €550 in zone 2 (large cities outside Paris) with €14,000 of yearly income gets about ${h.eur(cas(h, true, 0).aide)} a month, whichever name the aid carries. What changes is the label, decided in a fixed order. First the home: if it is conventionné, meaning tied to the State by an agreement, as most social housing (HLM) is, the aid is APL. If not, family status decides: children or other dependants, marriage or pregnancy open ALF. Every other tenant, especially single people and unmarried couples without children, receives ALS. The three cannot be combined. Figures are estimates; the CAF, France's family allowance fund, decides both the aid and its name.`,
    faqs: (h) => [
      { q: 'We are in a civil partnership with no children, why does the CAF pay us ALS rather than ALF?', a: `Because the list of situations opening ALF, on service-public.fr sheet F13132, names married couples without children, not civil partners (Pacs) or cohabiting couples. In a home that is not conventionné, a Pacs couple with no dependants therefore gets ALS. The amount is unaffected: with €550 rent in zone 2 and €14,000 of income, the estimate is ${h.eur(cas(h, true, 0).aide)} either way.` },
      { q: 'How do I find out whether my flat is conventionné for APL?', a: `The simplest route is to ask your landlord: according to the official APL sheet, it is up to them to tell you. Most social housing (HLM) is conventionné. A private rental can be too, if its owner has signed an agreement with the State. For the amount it makes no difference: a ceiling of ${h.eur(h.M.loyerPlafond(2, false, 0), 2)} applies to a single person in zone 2 in all three cases.` },
      { q: 'Is ALS lower than APL for the same rent?', a: `No. The scales were unified in 2001 and the Construction and Housing Code has applied one formula ever since, uprated by 1.15% on 1 October 2026. A single person renting for €550 in zone 2 with €14,000 of income receives about ${h.eur(cas(h, false, 0).aide)} a month, whether the aid is called APL or ALS.` },
      { q: 'I am pregnant and living alone, from when can I get ALF?', a: `According to sheet F13132, a pregnant woman living alone with no dependants qualifies for ALF from the first day of the calendar month after the fourth month of pregnancy, until the month of the birth. Before that, if the home is not conventionné, she gets ALS. Switching from one to the other does not change the calculation; it is the birth and the dependent child that later raise the ceiling.` },
      { q: 'Can I receive APL and ALF at the same time?', a: `No. The official ALF sheet states it is not granted to anyone already receiving APL or ALS, and ALS is only paid when neither of the others applies. A household gets a single housing aid, for its main home, meaning the one lived in at least eight months a year. The amount follows the shared scale, for example ${h.eur(cas(h, false, 1).aide)} for a single parent with one child in our zone 2 case.` },
      { q: 'My 70-year-old father lives with me: which housing aid should I claim?', a: `In a home that is not conventionné, ALF, provided he is your dependant and his income is below the Aspa ceiling (the French old-age minimum), as sheet F13132 sets out. He must be over 65, or 60 if unfit for work. In a conventionné home it will be APL. Either way, a dependant raises the ceiling: ${h.eur(h.M.loyerPlafond(2, false, 1), 2)} in zone 2.` },
    ],
    body: (h) => `
<h2>The order in which the CAF picks the name</h2>
<p>The question is never "which one pays more": there is no choice to make. The CAF goes through your file in a fixed order.</p>
<ol>
<li><strong>Is the home conventionné?</strong> If so, the aid is APL, according to ${h.src('spApl', 'service-public.fr sheet F12006')}. The landlord knows whether it is; most HLM homes are.</li>
<li><strong>If not, does the family open ALF?</strong> Sheet F13132 on the family housing allowance lists the cases: receiving family benefits or AEEH (the disabled child allowance), having a dependent child aged 21 or under with no family benefits, being married without children, being pregnant and alone from the month after the fourth month, supporting a parent or grandparent over 65 on a low income, or a relative with an incapacity of at least 80%.</li>
<li><strong>Otherwise, ALS.</strong> ${h.src('spAls', 'Sheet F1280')} puts it plainly: the social housing allowance goes to those who can claim neither APL nor ALF.</li>
</ol>
<p>The shared conditions do not change: a main home in France, a decent dwelling, no parent-child link with the owner, and income over the last twelve months within the scales.</p>

<h2>One scale, three labels: the numbers prove it</h2>
<p>Since 2001 the calculation has been common. The ${h.src('cchD823', 'Construction and Housing Code')} formula, counted rent plus a charges allowance minus your own contribution, applies unchanged, with the ceilings of the ${h.src('arreteApl2026', 'order of 28 September 2026')}. The table takes four households in a €550 home excluding charges in zone 2, with €14,000 of income over twelve months.</p>
${h.table(['Household', 'Conventionné home', 'Other home', 'Estimated amount'], [['Single person', 'APL', 'ALS', h.eur(cas(h, false, 0).aide)], ['Pacs couple, no children', 'APL', 'ALS', h.eur(cas(h, true, 0).aide)], ['Married couple, no children', 'APL', 'ALF', h.eur(cas(h, true, 0).aide)], ['Single parent, one child', 'APL', 'ALF', h.eur(cas(h, false, 1).aide)]], 'Name of the aid and amount, zone 2, €550 rent, scale of 1 October 2026 (estimate)', ['l', 'l', 'l', 'r'])}
<p>The last column depends only on who lives in the home. The Pacs couple and the married couple get the same sum, one as ALS, the other as ALF. It is the child, not the label, that lifts the amount: a ceiling of ${h.eur(h.M.loyerPlafond(2, false, 1), 2)} instead of ${h.eur(h.M.loyerPlafond(2, false, 0), 2)}, a charges allowance of ${h.eur(h.M.forfaitCharges(false, 1), 2)} and a larger R0 allowance.</p>
<!--mini:aplAlsAlf-->

<h2>The real differences, none of them in the amount</h2>
<h3>Who receives the money</h3>
<p>APL is normally paid straight to the landlord, who deducts it from the rent, so the tenant only sees a reduced rent receipt. For a resident in an establishment, it goes to the manager. That is the most visible practical effect of the agreement.</p>
<h3>When the name changes</h3>
<p>The same tenant can switch aid without moving. A single person on ALS who marries moves to ALF; a pregnant woman living alone moves from ALS to ALF during the pregnancy; a Pacs couple who have a child do too. If the landlord signs an agreement, the aid becomes APL. Payments carry on, and the amount only moves if the household changes.</p>
<h3>Residences and hostels</h3>
<p>In a senior residence, a student residence or a logement-foyer (a hostel-type residence with shared services), the aid is APL where the establishment is conventionné, and it applies to a fee (redevance) rather than a rent. The page on ${h.a('apl-chambre-foyer', 'housing aid for a room or hostel')} describes the approximation we use there.</p>

<h2>Why our calculator does not ask which aid you get</h2>
<p>Since the calculation is the same, the ${h.a('simulateur-apl', 'APL calculator')} gives an amount valid for all three. It needs the zone, rent, household and income, as set out in ${h.a('apl-calcul', 'the step-by-step calculation')}. Rules specific to couples and families are on ${h.a('apl-couple', 'housing aid for couples')} and ${h.a('apl-famille', 'housing aid with children')}. Only the CAF, on your file, sets the name and amount of the aid.</p>
`,
  },
});
