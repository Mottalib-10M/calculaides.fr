import { defineGuide, type Helpers } from '../../lib/guide-types';

/** AAH différentielle : pension ou rente mensuelle, éventuellement avec un salaire. */
const diff = (h: Helpers, pension: number, salaire = 0) => h.M.aah({ salaire, autres: pension });
const patrick = 750;

export default defineGuide({
  id: 'aah-pension-invalidite',
  group: 'handicap',
  order: 50,
  mini: 'aahPensionInvalidite',
  related: ['simulateur-aah', 'aah-plafond-ressources', 'aah-cumul-salaire', 'aah-deconjugalisation', 'aah-enfants'],
  sources: ['spAah', 'decretAah2026'],
  fr: {
    slug: 'aah-pension-invalidite',
    nav: 'AAH et pension d’invalidité',
    card: 'Avec une pension d’invalidité ou une rente, l’AAH devient différentielle : elle complète jusqu’au maximum.',
    title: 'AAH et pension d’invalidité 2026 : complément différentiel',
    description: 'AAH et pension d’invalidité en 2026 : l’AAH complète la pension jusqu’à 1 041,59 € par mois. Exemple à 750 € de pension, retraite, rentes et cumuls interdits.',
    h1: 'AAH et pension d’invalidité : le calcul différentiel',
    intro: 'Une pension d’invalidité ne ferme pas l’AAH : elle en fixe le montant, puisque l’allocation vient combler l’écart jusqu’au maximum.',
    resume: (h) => `Quand une personne reconnue handicapée perçoit une pension d’invalidité, une rente d’accident du travail ou une pension de retraite inférieure à ${h.eur(h.P.aah.montant_max, 2)}, elle reçoit une AAH dite différentielle : la différence entre ce montant maximal, en vigueur depuis le 1er avril 2026, et sa pension. Avec ${h.eur(patrick)} de pension d’invalidité, l’AAH estimée est de ${h.eur(diff(h, patrick).aah, 2)}, et le revenu total atteint ${h.eur(patrick + diff(h, patrick).aah, 2)}. Au contraire d’un salaire, la pension ne bénéficie d’aucun abattement : chaque euro de pension retire un euro d’AAH. Au-delà de ${h.eur(h.P.aah.montant_max, 2)} de pension, plus rien n’est versé. Les conditions de taux d’incapacité restent celles de l’AAH et c’est la CDAPH de la MDPH qui les apprécie, la pension d’invalidité ne valant pas reconnaissance automatique. Ces montants sont des estimations ; la CAF calcule le droit sur le dossier.`,
    faqs: (h) => [
      { q: 'Je touche 750 € de pension d’invalidité, combien d’AAH vais-je percevoir ?', a: `Environ ${h.eur(diff(h, patrick).aah, 2)} par mois, si vous n’avez ni salaire ni enfant à charge et que la CDAPH vous reconnaît un taux suffisant. Selon service-public, la personne qui perçoit une pension ou une rente reçoit la différence entre son montant et le maximum de l’AAH, soit ${h.eur(h.P.aah.montant_max, 2)}. Votre revenu total serait de ${h.eur(patrick + diff(h, patrick).aah, 2)}.` },
      { q: 'Ma pension d’invalidité dépasse 1 041,59 €, ai-je droit à l’AAH ?', a: `Non, pas à un versement. L’AAH différentielle comble l’écart entre votre pension et ${h.eur(h.P.aah.montant_max, 2)} ; si la pension est égale ou supérieure, il ne reste rien à verser. Avec un enfant à charge, le plafond annuel monte à ${h.eur(h.M.plafondAah(1))}, ce qui peut laisser une petite AAH : pour 1 100 € de pension, notre estimation donne ${h.eur(h.M.aah({ salaire: 0, autres: 1100, enfants: 1 }).aah, 2)}.` },
      { q: 'Que devient mon AAH quand je passe à la retraite ?', a: `Cela dépend du taux d’incapacité. À 80 % ou plus, service-public indique que l’AAH se cumule avec une pension de retraite inférieure à ${h.eur(h.P.aah.montant_max, 2)} : vous recevez la différence. Entre 50 et 79 %, l’AAH s’arrête à l’âge légal de départ ; sans pension, elle est remplacée par l’allocation de solidarité aux personnes âgées, l’Aspa.` },
      { q: 'Peut-on toucher l’AAH et l’ASS en même temps ?', a: 'Non, en règle générale. La fiche service-public précise qu’il n’est pas possible de cumuler l’AAH et l’allocation de solidarité spécifique. Une exception existe pour les personnes qui percevaient les deux au 31 décembre 2016 : elles peuvent continuer tant qu’elles remplissent les conditions, pendant dix ans au maximum. Le RSA, lui, réduit l’AAH comme une pension.' },
      { q: 'Faut-il refaire un dossier MDPH quand on a déjà une pension d’invalidité ?', a: 'Oui. La pension d’invalidité relève de l’assurance maladie, l’AAH d’une décision de la CDAPH, au sein de la MDPH. La demande se fait en ligne si votre MDPH le propose, ou avec le formulaire de demande de prestations handicap, accompagné des justificatifs. La CDAPH répond en quatre mois ; son silence vaut rejet. Une procédure de RQTH est engagée en même temps.' },
    ],
    body: (h) => `
<h2>Le calcul différentiel, sans abattement</h2>
<p>La ${h.src('spAah', 'fiche AAH de service-public')} décrit la règle en une ligne : la personne qui perçoit une pension ou une rente, d’invalidité, de retraite ou d’accident du travail, reçoit la différence entre le montant de cette pension et le montant maximal de l’AAH. Ce maximum est de ${h.eur(h.P.aah.montant_max, 2)} depuis le ${h.src('decretAah2026', 'décret du 30 mars 2026')}. La pension compte donc en entier, quand un salaire n’est retenu qu’en partie.</p>
${h.table(['Pension mensuelle', 'AAH différentielle', 'Revenu total'], [200, 400, 600, patrick, 900, 1000].map((p) => [h.eur(p), h.eur(diff(h, p).aah, 2), h.eur(p + diff(h, p).aah, 2)]), 'Personne sans salaire ni enfant à charge, montant du 1er avril 2026 (estimation)', ['r', 'r', 'r'])}
<p>La troisième colonne reste constante tant que la pension est inférieure au maximum : l’AAH garantit ce niveau de revenu, quelle que soit la part de la pension.</p>
<!--mini:aahPensionInvalidite-->

<h2>Patrick, pension d’invalidité et reprise partielle</h2>
<p>Patrick, 52 ans, perçoit une pension d’invalidité de ${h.eur(patrick)} par mois depuis un accident de santé. La CDAPH lui a reconnu un taux d’incapacité de 80 %. Son AAH estimée est de ${h.eur(diff(h, patrick).aah, 2)}, soit un revenu de ${h.eur(patrick + diff(h, patrick).aah, 2)}. Il envisage un emploi à temps très partiel, payé 400 € net. Son salaire ne serait retenu que pour ${h.eur(h.M.salaireRetenuAah(400), 2)}, grâce à l’abattement des revenus d’activité, et son AAH passerait à ${h.eur(diff(h, patrick, 400).aah, 2)}. Son revenu total atteindrait ${h.eur(patrick + 400 + diff(h, patrick, 400).aah, 2)}.</p>
<p>La leçon tient à l’asymétrie : chaque euro de pension coûte un euro d’AAH, mais chaque euro de salaire n’en coûte que vingt centimes sur les premières centaines d’euros. Reprendre une activité compatible avec son état peut donc relever le revenu de Patrick, sous réserve des règles propres à sa pension d’invalidité, que nous ne traitons pas ici.</p>
<p>Point pratique : la pension d’invalidité et l’AAH sont versées par deux organismes différents, la caisse d’assurance maladie pour la première, la CAF pour la seconde. Quand la pension est revalorisée ou change de catégorie, il faut prévenir la CAF, puisque le complément suit chaque mouvement de la pension.</p>

<h2>Retraite : deux régimes selon le taux</h2>
<p>Au passage à la retraite, la situation se sépare. Avec un taux d’au moins 80 %, c’est la pension de retraite qui est comparée au maximum : si elle est inférieure à ${h.eur(h.P.aah.montant_max, 2)}, l’AAH continue en différentiel. Avec un taux de 50 à 79 %, l’AAH prend fin à l’âge légal de départ ; si la personne n’a jamais cotisé ou ne perçoit aucun avantage vieillesse, l’AAH est remplacée par l’Aspa. Service-public ajoute qu’une personne ayant perdu l’AAH à cause d’une hausse de sa retraite liée à la réforme des retraites peut conserver la majoration pour la vie autonome, ou le complément de ressources si elle y avait encore droit.</p>

<h2>Hospitalisation longue : une règle qui touche souvent les pensionnés</h2>
<p>Les personnes qui cumulent pension d’invalidité et AAH connaissent parfois des séjours hospitaliers longs. Service-public prévoit qu’au-delà de 60 jours d’hospitalisation ou d’hébergement en maison d’accueil spécialisée, l’AAH est réduite à ${h.pct(h.P.aah.taux_hospitalisation, 0)}, soit environ ${h.eur(h.P.aah.montant_max * h.P.aah.taux_hospitalisation)} par mois sur la base du maximum. La réduction ne s’applique pas si vous payez le forfait journalier, si vous avez au moins un enfant à charge, si vous avez un ascendant à charge au sens fiscal, ou si votre conjoint ne travaille pas pour un motif reconnu par la CDAPH. À la sortie, le montant normal est rétabli. Pour Patrick, dont l’AAH n’est déjà qu’un complément de ${h.eur(diff(h, patrick).aah, 2)}, l’effet exact d’une telle réduction sur une AAH différentielle est à vérifier auprès de la CAF.</p>

<h2>Les cumuls autorisés et interdits</h2>
<p>L’AAH se cumule avec la prime d’activité, avec la majoration pour la vie autonome ou le complément de ressources pour ceux qui le percevaient avant sa suppression en décembre 2019, pendant dix ans au plus, et avec la réduction sociale téléphonique. Les autres allocations, comme une pension d’invalidité ou le RSA, conduisent à une AAH réduite. Le cumul avec l’allocation de solidarité spécifique est en principe impossible. Pour savoir si une rente ou un loyer perçu compte aussi, la page ${h.a('aah-plafond-ressources', 'plafond de ressources de l’AAH')} reprend la liste ; pour un emploi, voir ${h.a('aah-cumul-salaire', 'AAH et salaire')}.</p>
<p>Le ${h.a('simulateur-aah', 'simulateur AAH')} accepte une pension et un salaire en même temps et applique à chacun sa règle.</p>
`,
  },
  en: {
    slug: 'aah-disability-pension',
    nav: 'AAH and disability pension',
    card: 'With a disability pension or annuity, AAH becomes a top-up: it fills the gap up to the maximum.',
    title: 'AAH and Disability Pension 2026: How the Top-Up Works',
    description: 'AAH and a disability pension in 2026: AAH tops your pension up to €1,041.59 a month. Example with a €750 pension, retirement rules and what cannot be combined.',
    h1: 'AAH and a disability pension: the top-up calculation',
    intro: 'A disability pension does not close the door to AAH: it sets the amount, since the allowance fills the gap up to the maximum.',
    resume: (h) => `When a person recognised as disabled receives a disability pension (pension d’invalidité, paid by the health insurance system), a work-injury annuity or a retirement pension below ${h.eur(h.P.aah.montant_max, 2)}, they receive a top-up AAH (allocation aux adultes handicapés, France’s allowance for disabled adults): the difference between that maximum, in force since 1 April 2026, and the pension. With a ${h.eur(patrick)} disability pension, estimated AAH is ${h.eur(diff(h, patrick).aah, 2)}, and total income reaches ${h.eur(patrick + diff(h, patrick).aah, 2)}. Unlike a wage, a pension gets no allowance: each euro of pension removes one euro of AAH. Above ${h.eur(h.P.aah.montant_max, 2)} of pension, nothing is paid. The impairment conditions remain those of AAH and are assessed by the CDAPH of the MDPH (the local disability office); a disability pension is not automatic recognition. These figures are estimates; the CAF (family benefits office) works out the entitlement.`,
    faqs: (h) => [
      { q: 'I receive a €750 disability pension, how much AAH will I get?', a: `About ${h.eur(diff(h, patrick).aah, 2)} a month, if you have no wages or dependent children and the CDAPH recognises a sufficient impairment rate. According to service-public.fr, someone with a pension or annuity receives the difference between it and the AAH maximum of ${h.eur(h.P.aah.montant_max, 2)}. Your total income would be ${h.eur(patrick + diff(h, patrick).aah, 2)}.` },
      { q: 'My disability pension is above €1,041.59, can I still get AAH?', a: `Not as a payment. Top-up AAH fills the gap between your pension and ${h.eur(h.P.aah.montant_max, 2)}; if the pension is equal or higher, there is nothing left to pay. With one dependent child, the yearly ceiling rises to ${h.eur(h.M.plafondAah(1))}, which can leave a small AAH: on a €1,100 pension, our estimate gives ${h.eur(h.M.aah({ salaire: 0, autres: 1100, enfants: 1 }).aah, 2)}.` },
      { q: 'What happens to my AAH when I retire?', a: `It depends on your impairment rate. At 80% or more, service-public.fr says AAH can be combined with a retirement pension below ${h.eur(h.P.aah.montant_max, 2)}: you receive the difference. Between 50 and 79%, AAH stops at the legal retirement age; if you have no pension, it is replaced by the Aspa (allocation de solidarité aux personnes âgées, the minimum old-age income).` },
      { q: 'Can I receive AAH and ASS at the same time?', a: 'Not as a rule. The service-public.fr sheet states that AAH cannot be combined with the ASS (allocation de solidarité spécifique, a means-tested unemployment benefit). People who were receiving both on 31 December 2016 may keep them while they meet the conditions, for ten years at most. RSA, for its part, reduces AAH the way a pension does.' },
      { q: 'Do I need a separate MDPH claim if I already have a disability pension?', a: 'Yes. The disability pension comes from health insurance; AAH depends on a decision by the CDAPH, within the MDPH. You apply online if your MDPH offers it, or with the disability benefits claim form plus supporting documents. The CDAPH answers within four months, and silence counts as refusal. A RQTH procedure (recognition as a disabled worker) starts at the same time.' },
    ],
    body: (h) => `
<h2>The top-up calculation, with no allowance</h2>
<p>The ${h.src('spAah', 'service-public.fr AAH sheet')} states the rule in one line: someone receiving a pension or annuity, whether for disability, retirement or a work injury, receives the difference between that pension and the AAH maximum. The maximum is ${h.eur(h.P.aah.montant_max, 2)} since the ${h.src('decretAah2026', 'decree of 30 March 2026')}. The pension therefore counts in full, while a wage is counted only in part.</p>
${h.table(['Monthly pension', 'Top-up AAH', 'Total income'], [200, 400, 600, patrick, 900, 1000].map((p) => [h.eur(p), h.eur(diff(h, p).aah, 2), h.eur(p + diff(h, p).aah, 2)]), 'Person with no wages or dependent children, rate from 1 April 2026 (estimate)', ['r', 'r', 'r'])}
<p>The third column stays flat while the pension is below the maximum: AAH guarantees that level of income, whatever share the pension provides.</p>
<!--mini:aahPensionInvalidite-->

<h2>Patrick: a disability pension and a little work</h2>
<p>Patrick, 52, has received a ${h.eur(patrick)} monthly disability pension since a serious illness. The CDAPH has recognised an 80% impairment rate. His estimated AAH is ${h.eur(diff(h, patrick).aah, 2)}, for an income of ${h.eur(patrick + diff(h, patrick).aah, 2)}. He is thinking of a very part-time job paying €400 net. His wage would be counted at only ${h.eur(h.M.salaireRetenuAah(400), 2)}, thanks to the allowance on earnings, and his AAH would become ${h.eur(diff(h, patrick, 400).aah, 2)}. His total income would reach ${h.eur(patrick + 400 + diff(h, patrick, 400).aah, 2)}.</p>
<p>The lesson is the asymmetry: each euro of pension costs a euro of AAH, but each euro of pay costs only twenty cents over the first few hundred euros. Taking on work compatible with his health could therefore raise Patrick’s income, subject to the rules of his disability pension itself, which this page does not cover.</p>
<p>One practical point for readers new to France: the disability pension and the AAH are paid by two different bodies, the first by the health insurance fund (CPAM, or MSA for farm workers), the second by the CAF. Each needs to know about the other. When the pension is revalued or changes category, tell the CAF, since the top-up moves with it.</p>

<h2>Retirement: two paths depending on the rate</h2>
<p>At retirement the situation splits. With a rate of at least 80%, it is the retirement pension that is compared with the maximum: if it is below ${h.eur(h.P.aah.montant_max, 2)}, AAH carries on as a top-up. With a rate of 50 to 79%, AAH ends at the legal retirement age; if the person never paid into a pension scheme or receives no old-age benefit, AAH is replaced by the Aspa. Service-public.fr adds that someone who lost AAH because their pension rose under the pension reform can keep the majoration pour la vie autonome (independent living supplement), or the complément de ressources if they still qualified for it.</p>

<h2>Long hospital stays: a rule that often affects pensioners</h2>
<p>People combining a disability pension and AAH sometimes face long hospital stays. Service-public.fr provides that after more than 60 days in hospital or in a maison d’accueil spécialisée (specialised care home), AAH is cut to ${h.pct(h.P.aah.taux_hospitalisation, 0)}, about ${h.eur(h.P.aah.montant_max * h.P.aah.taux_hospitalisation)} a month on the basis of the maximum. The cut does not apply if you pay the daily hospital charge (forfait journalier), have at least one dependent child, support a parent or grandparent as a tax dependant, or if your partner cannot work for a reason recognised by the CDAPH. Once you leave, the normal amount returns. For Patrick, whose AAH is already only a ${h.eur(diff(h, patrick).aah, 2)} top-up, the exact effect of such a cut on a top-up AAH is something to confirm with the CAF before a planned stay.</p>

<h2>What can and cannot be combined</h2>
<p>AAH can be combined with the prime d’activité (in-work bonus), with the independent living supplement or the complément de ressources for those who received it before it was abolished in December 2019, for ten years at most, and with the reduced social telephone rate. Other benefits, such as a disability pension or RSA, lead to a reduced AAH. Combining it with the ASS is ruled out in principle. To check whether an annuity or rent you receive also counts, the page on the ${h.a('aah-plafond-ressources', 'AAH income ceiling')} has the list; for a job, see ${h.a('aah-cumul-salaire', 'AAH and wages')}.</p>
<p>The ${h.a('simulateur-aah', 'AAH calculator')} accepts a pension and a wage together and applies the right rule to each.</p>
`,
  },
});
