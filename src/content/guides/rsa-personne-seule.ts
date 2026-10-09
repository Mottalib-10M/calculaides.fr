import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemple de la page : adulte seul, 300 € d'allocation chômage, avec ou sans forfait logement. */
const are = 300;
const seul = (h: Helpers, autres = 0, fl = false) => h.M.rsa({ couple: false, enfants: 0, revenus: 0, autres, forfaitLogement: fl });

export default defineGuide({
  id: 'rsa-personne-seule',
  group: 'rsa',
  order: 20,
  mini: 'rsaPersonneSeule',
  related: ['simulateur-rsa', 'rsa-forfait-logement', 'rsa-cumul-salaire', 'rsa-couple', 'prime-activite-celibataire'],
  sources: ['spRsa', 'decretRsa2026'],
  fr: {
    slug: 'rsa-personne-seule',
    nav: 'RSA personne seule',
    card: 'Le montant d’un adulte seul sans enfant, ce qui le réduit et les obligations qui l’accompagnent.',
    title: 'RSA personne seule 2026 : 651,69 € et ce qui le réduit',
    description: 'RSA personne seule 2026 : 651,69 € par mois au maximum, 573,49 € avec une aide au logement. Exemple chiffré avec une allocation chômage, conditions, démarches.',
    h1: 'RSA pour une personne seule : le montant réel',
    intro: 'Le chiffre affiché partout est un maximum : la plupart des allocataires seuls touchent moins, et la raison tient en deux lignes de calcul.',
    resume: (h) => `Un adulte seul de 25 ans ou plus, sans enfant ni ressource, peut recevoir au plus ${h.eur(h.P.rsa.montant_forfaitaire, 2)} de RSA par mois depuis la revalorisation du 1er avril 2026. Ce maximum n’est versé qu’à celui qui paie un loyer sans toucher d’aide au logement. Dès qu’il perçoit l’APL, qu’il est hébergé gratuitement ou qu’il est propriétaire, la CAF retire un forfait logement de ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} et le RSA tombe à ${h.eur(seul(h, 0, true).rsa, 2)}. Toute autre ressource du foyer se retire ensuite euro pour euro, en moyenne sur les trois derniers mois : avec ${h.eur(are)} d’allocation chômage, la même personne hébergée chez un ami ne garde que ${h.eur(seul(h, are, true).rsa, 2)} de RSA. Le versement démarre le premier jour du mois de la demande. Ce sont des estimations ; la CAF calcule le droit sur le dossier déposé.`,
    faqs: (h) => [
      { q: 'Je vis seul et je touche l’APL, combien de RSA vais-je recevoir ?', a: `Environ ${h.eur(seul(h, 0, true).rsa, 2)} par mois si vous n’avez aucune autre ressource. L’aide au logement elle-même ne vient pas en déduction : la CAF la remplace par un forfait logement de ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} pour une personne, retiré du montant forfaitaire de ${h.eur(h.P.rsa.montant_forfaitaire, 2)}. L’exemple chiffré de service-public procède de la même façon pour un couple avec enfants.` },
      { q: 'Je suis hébergé gratuitement chez ma sœur, ai-je droit au RSA plein ?', a: `Non. Être logé sans payer de loyer compte comme un avantage : service-public prévoit le même forfait logement que pour un allocataire de l’APL, soit ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} pour une personne seule. Le RSA estimé descend alors à ${h.eur(seul(h, 0, true).rsa, 2)}. Si c’est votre sœur qui paie un loyer pour vous, la CAF évalue un avantage forfaitaire : il faut la contacter.` },
      { q: 'Mes 300 € de chômage sont-ils retirés de mon RSA ?', a: `Oui, en entier. L’allocation d’aide au retour à l’emploi fait partie des ressources que liste service-public, au même titre que les indemnités journalières. Pour un adulte seul hébergé gratuitement, ${h.eur(are)} d’allocation laissent ${h.eur(seul(h, are, true).rsa, 2)} de RSA par mois. Le revenu total reste ainsi proche du montant forfaitaire, quelle que soit la part du chômage.` },
      { q: 'Je viens de déposer ma demande le 20 du mois, ce mois-là est-il payé ?', a: 'Oui. Selon service-public, le RSA est dû à partir du premier jour du mois au cours duquel la demande a été déposée. Il est ensuite versé chaque mois pour le mois écoulé : le RSA de mars arrive en avril. Après avis favorable, la CAF envoie une notification d’attribution pour une période de trois mois, renouvelée par la déclaration trimestrielle.' },
      { q: 'Un étudiant seul de 26 ans peut-il toucher le RSA ?', a: `En règle générale, non. La fiche service-public exclut l’élève, l’étudiant et le stagiaire non rémunéré, quel que soit l’âge. La seule exception concerne le parent isolé, sous conditions. Un adulte seul sans enfant qui suit des études n’a donc pas droit aux ${h.eur(h.P.rsa.montant_forfaitaire, 2)}, même sans aucune ressource. Le congé sabbatique ou sans solde ferme aussi le droit.` },
    ],
    body: (h) => `
<h2>Deux lignes de calcul, pas une</h2>
<p>Le montant de ${h.eur(h.P.rsa.montant_forfaitaire, 2)} n’est que le point de départ, le montant forfaitaire fixé par le ${h.src('decretRsa2026', 'décret du 30 mars 2026')}. La CAF en retire ensuite deux choses : les ressources du foyer, en moyenne mensuelle sur trois mois, et, si la situation de logement le prévoit, un forfait. Pour un adulte seul, le foyer se résume à lui-même. Aucun revenu de conjoint, aucune allocation familiale : le calcul est le plus simple qui soit, et c’est justement pour cela que chaque euro compte.</p>
${h.table(['Situation', 'Forfait logement', 'RSA estimé'], [
  ['Loyer payé, sans aide au logement', h.eur(0), h.eur(seul(h).rsa, 2)],
  ['Aide au logement perçue', h.eur(seul(h, 0, true).fl, 2), h.eur(seul(h, 0, true).rsa, 2)],
  ['Hébergé gratuitement, 300 € de chômage', h.eur(seul(h, are, true).fl, 2), h.eur(seul(h, are, true).rsa, 2)],
  ['Propriétaire, 450 € de pension', h.eur(seul(h, 450, true).fl, 2), h.eur(seul(h, 450, true).rsa, 2)],
], 'Adulte seul de 25 ans ou plus, barème du 1er avril 2026 (estimation)', ['l', 'r', 'r'])}
<p>La première ligne est rare dans les faits. Un adulte seul qui paie un loyer a presque toujours droit à une aide au logement, et la demande des deux aides va souvent de pair. Le montant le plus courant pour un allocataire seul sans revenu est donc celui de la deuxième ligne.</p>
<!--mini:rsaPersonneSeule-->

<h2>Le cas de Karim, hébergé chez un ami</h2>
<p>Karim a 34 ans. Il a perdu son emploi, ses droits au chômage arrivent à leur fin et il perçoit encore ${h.eur(are)} par mois. Il dort chez un ami qui ne lui demande rien. Pour la CAF, il vit seul : l’hébergeant n’est ni un conjoint ni une personne à charge. Son montant forfaitaire est de ${h.eur(h.P.rsa.montant_forfaitaire, 2)}. Comme il est logé gratuitement, ${h.eur(seul(h, are, true).fl, 2)} de forfait logement sont retirés. Les ${h.eur(are)} d’allocation le sont aussi. Il reste ${h.eur(seul(h, are, true).rsa, 2)} de RSA. Le mois où son chômage s’arrête, la déclaration suivante fait remonter l’estimation à ${h.eur(seul(h, 0, true).rsa, 2)}.</p>
<p>Le piège, pour Karim, serait de se déclarer en couple avec son hébergeant par erreur, ou à l’inverse de taire une vie de couple réelle. La CAF raisonne sur la situation de fait. Un changement de situation familiale se signale rapidement, faute de quoi le trop-perçu peut être réclamé pendant deux ans par retenues sur les versements suivants.</p>

<h2>Qui peut le demander seul</h2>
<p>La ${h.src('spRsa', 'fiche RSA de service-public')} pose les conditions. Il faut avoir au moins 25 ans, sans âge maximum, et résider en France de manière stable et effective. Un ressortissant européen doit en plus justifier d’un droit de séjour, par exemple trois mois de résidence ou un emploi déclaré antérieur. Un étranger hors Union européenne doit, sauf exceptions, détenir depuis cinq ans un titre de séjour autorisant à travailler, ou une carte de résident. Les élèves, étudiants et stagiaires non rémunérés sont exclus, de même que les personnes en congé parental, sabbatique, sans solde ou en disponibilité.</p>

<h2>Ce que le RSA demande en retour</h2>
<p>Le RSA ouvre un accompagnement, et cet accompagnement crée des obligations. Le département oriente l’allocataire vers France Travail s’il peut reprendre un emploi, ou vers ses services sociaux si un problème de santé ou de logement l’en empêche. Un référent unique est désigné et un contrat d’engagement est signé. Selon service-public, si les ressources du foyer sont en moyenne inférieures à 500 € par mois, la recherche d’emploi est obligatoire, et l’allocataire ne peut pas refuser plus de deux offres raisonnables d’emploi prévues par ce contrat.</p>
<p>Pour une personne seule, la sanction pèse plus lourd que pour une famille. En cas de manquement sans raison légitime, le département peut réduire le RSA jusqu’à 80 % pour un à trois mois à la première sanction, alors que la réduction est limitée à 50 % quand le foyer compte d’autres personnes. Une hospitalisation de plus de 60 jours réduit aussi le RSA de moitié pour un allocataire sans conjoint ni personne à charge.</p>

<h2>Les bons réflexes pour ne pas perdre de mois</h2>
<p>Déposer la demande dès que la situation le permet, en ligne ou auprès de la CAF, puisque le mois de dépôt est payé en entier. Vérifier chaque trimestre la déclaration préremplie, qui reprend les salaires et allocations des mois M-2 à M-4 en montant net social. Penser à la ${h.a('prime-activite-celibataire', 'prime d’activité d’une personne seule')} dès la reprise d’un petit emploi : la page ${h.a('rsa-cumul-salaire', 'RSA et salaire')} montre le revenu total obtenu. Le ${h.a('simulateur-rsa', 'simulateur RSA')} reprend toutes les situations de logement.</p>
<p>Le RSA n’est pas imposable : il ne se déclare pas aux impôts. C’est la CAF qui instruit et verse, le département qui oriente et peut sanctionner, France Travail qui suit la recherche d’emploi quand l’allocataire lui est confié.</p>
`,
  },
  en: {
    slug: 'rsa-single-person',
    nav: 'RSA, single person',
    card: 'What a single adult with no children receives, what reduces it and what is expected in return.',
    title: 'RSA Single Person 2026: €651.69 and What Reduces It',
    description: 'RSA for a single person in 2026: €651.69 a month at most, €573.49 with housing aid. Worked example with unemployment benefit, eligibility and how to claim.',
    h1: 'RSA for a single person: the real amount',
    intro: 'The figure quoted everywhere is a ceiling: most single claimants get less, and the reason fits in two lines of arithmetic.',
    resume: (h) => `A single adult aged 25 or over, with no children and no income, can receive at most ${h.eur(h.P.rsa.montant_forfaitaire, 2)} a month of RSA (revenu de solidarité active, France’s minimum income) since the uprating of 1 April 2026. That maximum only goes to someone paying rent without housing aid. As soon as they receive APL (housing aid), live rent-free or own their home, the CAF (the family benefits office) deducts a flat ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} housing amount and RSA falls to ${h.eur(seul(h, 0, true).rsa, 2)}. Any other income is then taken off euro for euro, averaged over the last three months: with ${h.eur(are)} of unemployment benefit, the same person staying with a friend keeps only ${h.eur(seul(h, are, true).rsa, 2)} of RSA. Payment starts on the first day of the month of the claim. These are estimates; the CAF sets the entitlement from the file you submit.`,
    faqs: (h) => [
      { q: 'I live alone and get APL housing aid, how much RSA will I receive?', a: `About ${h.eur(seul(h, 0, true).rsa, 2)} a month if you have no other income. The housing aid itself is not deducted: the CAF replaces it with a forfait logement (flat housing deduction) of ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} for one person, taken off the ${h.eur(h.P.rsa.montant_forfaitaire, 2)} flat rate. The worked example on service-public.fr follows the same logic for a family.` },
      { q: 'I stay with my sister for free, do I get the full RSA?', a: `No. Living rent-free counts as an advantage: service-public.fr applies the same housing deduction as for someone on APL, ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} for a single person. The estimate then drops to ${h.eur(seul(h, 0, true).rsa, 2)}. If your sister actually pays rent on your behalf, the CAF values that as a flat-rate benefit in kind, and you need to ask them how it applies.` },
      { q: 'Is my €300 of unemployment benefit taken off my RSA?', a: `Yes, in full. The ARE (France Travail unemployment benefit) is on the list of resources given by service-public.fr, like sick pay. For a single adult living rent-free, ${h.eur(are)} of benefit leaves ${h.eur(seul(h, are, true).rsa, 2)} of RSA a month. Total income therefore stays close to the flat rate, however it is split between the two payments.` },
      { q: 'I applied on the 20th, is that month paid?', a: 'Yes. According to service-public.fr, RSA is due from the first day of the month in which the claim was filed. It is then paid monthly in arrears: March’s RSA arrives in April. After approval, the CAF sends a decision covering three months, renewed through the quarterly income return (déclaration trimestrielle).' },
      { q: 'Can a 26-year-old student living alone claim RSA?', a: `As a rule, no. The service-public.fr sheet excludes pupils, students and unpaid interns whatever their age. The only exception is a lone parent, under conditions. A single student with no children therefore has no right to the ${h.eur(h.P.rsa.montant_forfaitaire, 2)}, even with no income at all. Sabbatical or unpaid leave closes the right too.` },
    ],
    body: (h) => `
<h2>Two lines of arithmetic, not one</h2>
<p>The ${h.eur(h.P.rsa.montant_forfaitaire, 2)} figure is only the starting point, the flat rate set by the ${h.src('decretRsa2026', 'decree of 30 March 2026')}. The CAF then subtracts two things: household income, as a monthly average over three months, and a housing deduction where the living arrangement calls for one. For a single adult the household is just that person. No partner’s pay, no child benefit: it is the simplest calculation there is, which is exactly why every euro shows.</p>
${h.table(['Situation', 'Housing deduction', 'Estimated RSA'], [
  ['Paying rent, no housing aid', h.eur(0), h.eur(seul(h).rsa, 2)],
  ['Receiving housing aid', h.eur(seul(h, 0, true).fl, 2), h.eur(seul(h, 0, true).rsa, 2)],
  ['Living rent-free, €300 unemployment benefit', h.eur(seul(h, are, true).fl, 2), h.eur(seul(h, are, true).rsa, 2)],
  ['Home owner, €450 pension', h.eur(seul(h, 450, true).fl, 2), h.eur(seul(h, 450, true).rsa, 2)],
], 'Single adult aged 25 or over, scale of 1 April 2026 (estimate)', ['l', 'r', 'r'])}
<p>The first row is uncommon in practice. A single adult who pays rent nearly always qualifies for housing aid too, and people often apply for both at once. For a single claimant with no income, the second row is the figure you are most likely to see.</p>
<!--mini:rsaPersonneSeule-->

<h2>Karim’s case: sleeping at a friend’s</h2>
<p>Karim is 34. He lost his job, his unemployment rights are running out and he still gets ${h.eur(are)} a month. He stays with a friend who charges him nothing. For the CAF he lives alone: the host is neither a partner nor a dependant. His flat rate is ${h.eur(h.P.rsa.montant_forfaitaire, 2)}. Because he lives rent-free, ${h.eur(seul(h, are, true).fl, 2)} of housing deduction comes off, and so does the ${h.eur(are)} of benefit. That leaves ${h.eur(seul(h, are, true).rsa, 2)} of RSA. The month his benefit ends, the next return lifts the estimate to ${h.eur(seul(h, 0, true).rsa, 2)}.</p>
<p>The trap for Karim would be to declare himself a couple with his host by mistake, or the reverse, to hide a real relationship. The CAF goes by the facts on the ground. Changes in family situation must be reported promptly; otherwise an overpayment can be reclaimed for two years, through deductions from later payments.</p>

<h2>Who can claim on their own</h2>
<p>The ${h.src('spRsa', 'service-public.fr RSA sheet')} sets the conditions. You must be at least 25, with no upper age limit, and live in France in a stable, effective way. EU nationals also need a right of residence, for instance three months of living in France or previous declared work. Non-EU nationals generally need five years with a residence permit allowing work, or a resident card. Pupils, students and unpaid interns are excluded, as are people on parental, sabbatical or unpaid leave, or on leave from the civil service (disponibilité).</p>

<h2>What RSA asks in return</h2>
<p>RSA comes with support, and that support comes with duties. The département (the local council in charge of RSA) refers the claimant to France Travail (the public employment service) if they can work, or to its social services if health or housing problems stand in the way. A single named adviser is appointed and a contrat d’engagement (engagement contract) is signed. According to service-public.fr, if household income averages under €500 a month, looking for work is compulsory, and the claimant may not turn down more than two reasonable job offers defined in that contract.</p>
<p>Penalties weigh more on a single person than on a family. For an unjustified breach, the département can cut RSA by up to 80% for one to three months on a first penalty, whereas the cut is capped at 50% when the household includes other people. A hospital stay of more than 60 days also halves RSA for a claimant with no partner and no dependants.</p>

<h2>Habits that avoid losing months</h2>
<p>Apply as soon as your situation allows, online or at the CAF, since the month of filing is paid in full. Check the pre-filled quarterly return each time: it now shows wages and benefits from months M-2 to M-4 at their net social amount. Think of the ${h.a('prime-activite-celibataire', 'activity bonus for a single person')} as soon as you take on a small job; the page on ${h.a('rsa-cumul-salaire', 'RSA and wages')} shows the total you end up with. The ${h.a('simulateur-rsa', 'RSA calculator')} covers every housing situation.</p>
<p>One last point for newcomers to France: RSA is not taxable, so it does not appear as income on your tax return, and it is paid by the CAF even though the département decides on the support side. If you are unsure which body handles what, the CAF instructs and pays, the département orients and can sanction, and France Travail follows the job search when you are referred there.</p>
`,
  },
});
