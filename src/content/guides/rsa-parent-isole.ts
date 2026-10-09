import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemple de la page : mère séparée, deux enfants de 4 et 7 ans, AF et aide au logement. */
const af2 = (h: Helpers) => h.P.af.tranches_nettes.deux[0];
const sophie = (h: Helpers, majore: boolean) => h.M.rsa({ couple: false, enfants: 2, revenus: 0, autres: af2(h), forfaitLogement: true, isoleMajore: majore });
const parEnfant = (h: Helpers) => h.P.rsa.montant_forfaitaire * h.P.rsa.isole.par_enfant;

export default defineGuide({
  id: 'rsa-parent-isole',
  group: 'rsa',
  order: 40,
  mini: 'rsaParentIsole',
  related: ['simulateur-rsa', 'rsa-allocations-familiales', 'rsa-personne-seule', 'prime-activite-parent-isole', 'allocation-soutien-familial'],
  sources: ['spRsa', 'decretRsa2026', 'spAf'],
  fr: {
    slug: 'rsa-parent-isole',
    nav: 'RSA parent isolé',
    card: 'Le RSA majoré après une séparation ou pendant une grossesse : montants, durée et fin de la majoration.',
    title: 'RSA parent isolé 2026 : montant majoré et durée exacte',
    description: 'RSA parent isolé 2026 : 1 115,80 € par mois avec un enfant, 836,85 € pour une femme enceinte seule. Durée : 12 mois ou jusqu’aux 3 ans de l’enfant, exemple.',
    h1: 'RSA majoré du parent isolé : combien et jusqu’à quand',
    intro: 'Après une séparation, un veuvage ou pendant une grossesse vécue seule, le RSA est majoré, mais pour un temps compté qu’il faut connaître dès le départ.',
    resume: (h) => `Un parent qui se retrouve seul avec un enfant peut recevoir jusqu’à ${h.eur(h.M.forfaitaireRsa(false, 1, true), 2)} de RSA par mois depuis le 1er avril 2026, contre ${h.eur(h.M.forfaitaireRsa(false, 1), 2)} sans la majoration. Une femme enceinte seule a droit à ${h.eur(h.M.forfaitaireRsa(false, 0, true), 2)}, et chaque enfant supplémentaire ajoute ${h.eur(parEnfant(h), 2)}. Cette majoration n’est pas permanente. Si l’événement, séparation ou décès du conjoint, survient après les 3 ans du plus jeune enfant, elle dure 12 mois, à prendre dans les 18 mois qui suivent, et doit être déclarée dans les 6 mois. Si l’enfant a moins de 3 ans, elle court jusqu’à son troisième anniversaire. Les allocations familiales et l’aide au logement réduisent le montant versé : une mère seule avec deux enfants et l’APL touche environ ${h.eur(sophie(h, true).rsa, 2)}. Ce sont des estimations ; la CAF calcule le droit sur le dossier.`,
    faqs: (h) => [
      { q: 'Je suis enceinte et seule, combien de RSA puis-je toucher ?', a: `Jusqu’à ${h.eur(h.M.forfaitaireRsa(false, 0, true), 2)} par mois, contre ${h.eur(h.P.rsa.montant_forfaitaire, 2)} pour une personne seule. Service-public range la femme enceinte isolée parmi les parents isolés : la grossesse déclarée suffit, sans attendre la naissance. Le forfait logement de ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} se retire si vous touchez une aide au logement ou êtes logée gratuitement.` },
      { q: 'Ma séparation date de 8 mois, est-il trop tard pour le RSA majoré ?', a: 'Si votre plus jeune enfant avait déjà 3 ans au moment de la séparation, la fiche service-public demande de déclarer l’événement à la CAF dans les 6 mois. Passé ce délai, la majoration de 12 mois risque d’être perdue en partie, puisqu’elle doit être versée dans les 18 mois suivant la séparation. Si l’enfant a moins de 3 ans, la règle est différente : la majoration va jusqu’à ses 3 ans.' },
      { q: 'Que devient mon RSA quand la majoration parent isolé s’arrête ?', a: `Il repasse au barème ordinaire d’une personne seule avec enfants. Avec un enfant, le montant forfaitaire tombe de ${h.eur(h.M.forfaitaireRsa(false, 1, true), 2)} à ${h.eur(h.M.forfaitaireRsa(false, 1), 2)}, soit ${h.eur(h.M.forfaitaireRsa(false, 1, true) - h.M.forfaitaireRsa(false, 1), 2)} de moins par mois. La bascule se fait à la fin de la durée prévue, 12 mois ou les 3 ans de l’enfant : mieux vaut anticiper cette baisse dans son budget.` },
      { q: 'Je suis étudiante et mère seule, ai-je droit au RSA ?', a: `Peut-être. Service-public pose une exception à l’exclusion des étudiants : le parent isolé élève, étudiant ou stagiaire non rémunéré peut avoir droit au RSA sous certaines conditions, que la fiche ne détaille pas. Avec un enfant, l’enjeu est réel : jusqu’à ${h.eur(h.M.forfaitaireRsa(false, 1, true), 2)} par mois. Posez la question à votre CAF avant de renoncer.` },
      { q: 'La majoration parent isolé s’ajoute-t-elle aux allocations familiales ?', a: `Non, elles se compensent en partie. Les prestations familiales comptent dans les ressources du RSA. Pour une mère seule avec deux enfants, aidée pour le logement, les ${h.eur(af2(h), 2)} d’allocations familiales se retirent du montant majoré de ${h.eur(h.M.forfaitaireRsa(false, 2, true), 2)}, comme le forfait logement. Il reste environ ${h.eur(sophie(h, true).rsa, 2)} de RSA, versés en plus des allocations.` },
    ],
    body: (h) => `
<h2>Le barème majoré, enfant par enfant</h2>
<p>Le RSA majoré ne suit pas la même échelle que le RSA ordinaire. Au lieu d’ajouter des pourcentages par personne, il part de ${h.pct(h.P.rsa.isole.base, 3)} du montant de base, puis ajoute ${h.pct(h.P.rsa.isole.par_enfant, 3)} par enfant à charge. Sur la base de ${h.eur(h.P.rsa.montant_forfaitaire, 2)} fixée par le ${h.src('decretRsa2026', 'décret du 30 mars 2026')}, l’écart avec le barème ordinaire est sensible dès le premier enfant.</p>
${h.table(['Enfants à charge', 'RSA majoré', 'RSA non majoré', 'Écart mensuel'], [0, 1, 2, 3].map((e) => [e ? String(e) : 'Grossesse', h.eur(h.M.forfaitaireRsa(false, e, true), 2), h.eur(h.M.forfaitaireRsa(false, e), 2), h.eur(h.M.forfaitaireRsa(false, e, true) - h.M.forfaitaireRsa(false, e), 2)]), 'Montants forfaitaires au 1er avril 2026, avant ressources et forfait logement (estimation)', ['l', 'r', 'r', 'r'])}
<p>Ces montants sont des maximums. Ils baissent avec les ressources du foyer, dont les allocations familiales à partir de deux enfants, et avec le forfait logement si une aide au logement est perçue.</p>
<!--mini:rsaParentIsole-->

<h2>Qui est parent isolé pour la CAF</h2>
<p>La ${h.src('spRsa', 'fiche RSA de service-public')} retient deux situations. D’une part la femme enceinte qui vit seule. D’autre part la personne qui assume seule au moins un enfant ou une personne à charge à la suite d’un événement de vie : séparation, décès du conjoint. Le mot clé est l’événement. Un parent qui élève seul son enfant depuis des années sans avoir déclaré de rupture récente ne bénéficie plus de la majoration, et c’est le barème ordinaire qui s’applique.</p>

<h2>Douze mois, ou jusqu’aux 3 ans : la règle de durée</h2>
<p>Tout dépend de l’âge du plus jeune enfant au moment de l’événement. S’il a déjà 3 ans, la majoration dure 12 mois, versés dans une fenêtre de 18 mois qui suit la séparation ou le décès ; d’où l’obligation de la déclarer dans les 6 mois. S’il a moins de 3 ans, ou pendant la grossesse, elle dure jusqu’à son troisième anniversaire. Une mère séparée quand son bébé a 6 mois peut ainsi toucher le montant majoré pendant deux ans et demi ; une autre, séparée quand son cadet a 4 ans, l’aura pour un an seulement.</p>

<h2>Sophie, deux enfants, une séparation récente</h2>
<p>Sophie s’est séparée en janvier. Ses enfants ont 4 et 7 ans : la majoration durera donc 12 mois. Elle n’a pas de revenu, perçoit l’APL et ${h.eur(af2(h), 2)} d’allocations familiales, versées selon la ${h.src('spAf', 'fiche allocations familiales')}. Le montant majoré pour deux enfants est de ${h.eur(h.M.forfaitaireRsa(false, 2, true), 2)}. La CAF retire le forfait logement de trois personnes, ${h.eur(sophie(h, true).fl, 2)}, et les allocations familiales. Sophie reçoit environ ${h.eur(sophie(h, true).rsa, 2)} de RSA par mois.</p>
<p>Dans un an, sans changement de situation, le calcul repassera au barème ordinaire : ${h.eur(h.M.forfaitaireRsa(false, 2), 2)} de base, et un RSA estimé à ${h.eur(sophie(h, false).rsa, 2)}. La baisse, ${h.eur(sophie(h, true).rsa - sophie(h, false).rsa, 2)} par mois, n’est pas une erreur de la CAF. Mieux vaut la préparer, par exemple en reprenant une activité à temps partiel : le RSA diminue alors, mais la ${h.a('prime-activite-parent-isole', 'prime d’activité du parent isolé')}, elle aussi majorée, s’ajoute.</p>

<h2>Par où commencer après une séparation</h2>
<p>La demande se fait auprès de la CAF, en ligne ou sur place selon les départements. Le RSA est dû à partir du premier jour du mois où le dossier est déposé : déposer le 28 plutôt que le 2 du mois suivant fait gagner un mois entier, au montant majoré. Les ressources retenues sont celles des trois derniers mois, ce qui pose un problème fréquent après une rupture : le salaire de l’ex-conjoint figure encore dans la période. Il faut alors signaler la date de séparation, pour que la CAF calcule sur le foyer réel. La notification d’attribution couvre trois mois, puis chaque déclaration trimestrielle, préremplie depuis mars 2025, relance le calcul.</p>

<h2>Les pièges propres au parent seul</h2>
<p>Le premier est la déclaration tardive, déjà évoquée : au-delà de 6 mois, une partie de la majoration peut être perdue. Le deuxième est la remise en couple. Dès qu’un nouveau conjoint s’installe, la majoration cesse, le barème du couple s’applique et les revenus du conjoint entrent dans le calcul ; service-public demande de signaler rapidement ce changement. Le troisième concerne l’autre parent : s’il ne verse pas de pension alimentaire, une ${h.a('allocation-soutien-familial', 'allocation de soutien familial')} peut être demandée, et une pension reçue se déclare dans les ressources du trimestre.</p>
<p>Un point protège en revanche le parent seul : la réduction de moitié du RSA après 60 jours d’hospitalisation ne touche pas l’allocataire qui a une personne à charge. Et en cas de sanction pour non-respect du contrat d’engagement, la réduction est plafonnée à 50 % puisque le foyer compte au moins un enfant. Le ${h.a('simulateur-rsa', 'simulateur RSA')} applique le montant majoré si vous cochez la situation de parent isolé.</p>
`,
  },
  en: {
    slug: 'rsa-lone-parent',
    nav: 'RSA, lone parent',
    card: 'The increased RSA after a separation or during pregnancy: amounts, how long it lasts and what happens after.',
    title: 'RSA Lone Parent 2026: Increased Amount and Its Duration',
    description: 'RSA for a lone parent in 2026: €1,115.80 a month with one child, €836.85 if pregnant and alone. The increase lasts 12 months, or until the child turns 3.',
    h1: 'Increased RSA for lone parents: how much and for how long',
    intro: 'After a separation, a bereavement or during a pregnancy faced alone, RSA is increased, but only for a set period you should know from day one.',
    resume: (h) => `A parent left alone with one child can receive up to ${h.eur(h.M.forfaitaireRsa(false, 1, true), 2)} of RSA (revenu de solidarité active, France’s minimum income) a month since 1 April 2026, against ${h.eur(h.M.forfaitaireRsa(false, 1), 2)} without the increase. A pregnant woman living alone is entitled to ${h.eur(h.M.forfaitaireRsa(false, 0, true), 2)}, and each further child adds ${h.eur(parEnfant(h), 2)}. The increase, called majoration parent isolé, is not permanent. If the triggering event, a separation or a partner’s death, happens after the youngest child turns 3, it lasts 12 months, paid within the following 18 months, and must be reported within 6 months. If the child is under 3, it runs until the third birthday. Family allowances and housing aid reduce what is paid: a mother alone with two children and APL housing aid receives about ${h.eur(sophie(h, true).rsa, 2)}. These are estimates; the CAF (family benefits office) sets the entitlement from your file.`,
    faqs: (h) => [
      { q: 'I am pregnant and on my own, how much RSA can I get?', a: `Up to ${h.eur(h.M.forfaitaireRsa(false, 0, true), 2)} a month, compared with ${h.eur(h.P.rsa.montant_forfaitaire, 2)} for a single person. Service-public.fr treats a pregnant woman living alone as a lone parent: a declared pregnancy is enough, with no need to wait for the birth. The ${h.eur(h.M.forfaitLogement(h.P.rsa.montant_forfaitaire, 1, h.P.rsa), 2)} housing deduction applies if you get housing aid or live rent-free.` },
      { q: 'We split up eight months ago, is it too late for the increased RSA?', a: 'If your youngest child was already 3 at the time of the separation, the service-public.fr sheet asks you to report it to the CAF within 6 months. After that, part of the 12-month increase may be lost, since it has to be paid within 18 months of the separation. If the child is under 3, the rule differs: the increase runs until the third birthday.' },
      { q: 'What happens to my RSA when the lone-parent increase ends?', a: `It goes back to the ordinary scale for a single person with children. With one child, the flat rate drops from ${h.eur(h.M.forfaitaireRsa(false, 1, true), 2)} to ${h.eur(h.M.forfaitaireRsa(false, 1), 2)}, which is ${h.eur(h.M.forfaitaireRsa(false, 1, true) - h.M.forfaitaireRsa(false, 1), 2)} less a month. The switch happens when the set period ends, 12 months or the child’s third birthday, so plan for the drop in your budget.` },
      { q: 'I am a student and a single mother, can I claim RSA?', a: `Possibly. Service-public.fr makes an exception to the student exclusion: a lone parent who is a pupil, student or unpaid intern may qualify under certain conditions, which the sheet does not spell out. With one child the stakes are real, up to ${h.eur(h.M.forfaitaireRsa(false, 1, true), 2)} a month. Ask your CAF before ruling it out.` },
      { q: 'Is the lone-parent increase paid on top of child benefit?', a: `Not quite: the two partly cancel out. Family benefits count as RSA income. For a mother alone with two children and housing aid, the ${h.eur(af2(h), 2)} of allocations familiales (child benefit) come off the ${h.eur(h.M.forfaitaireRsa(false, 2, true), 2)} increased rate, as does the housing deduction. About ${h.eur(sophie(h, true).rsa, 2)} of RSA remains, paid alongside the allowance.` },
    ],
    body: (h) => `
<h2>The increased scale, child by child</h2>
<p>Increased RSA does not use the ordinary scale. Rather than adding percentages per person, it starts at ${h.pct(h.P.rsa.isole.base, 3)} of the base amount and adds ${h.pct(h.P.rsa.isole.par_enfant, 3)} per dependent child. With the ${h.eur(h.P.rsa.montant_forfaitaire, 2)} base set by the ${h.src('decretRsa2026', 'decree of 30 March 2026')}, the gap with the ordinary scale is noticeable from the first child.</p>
${h.table(['Dependent children', 'Increased RSA', 'Ordinary RSA', 'Monthly gap'], [0, 1, 2, 3].map((e) => [e ? String(e) : 'Pregnancy', h.eur(h.M.forfaitaireRsa(false, e, true), 2), h.eur(h.M.forfaitaireRsa(false, e), 2), h.eur(h.M.forfaitaireRsa(false, e, true) - h.M.forfaitaireRsa(false, e), 2)]), 'Flat-rate amounts from 1 April 2026, before income and housing deduction (estimate)', ['l', 'r', 'r', 'r'])}
<p>These are ceilings. They fall with household income, including child benefit from the second child, and with the housing deduction if housing aid is paid.</p>
<!--mini:rsaParentIsole-->

<h2>Who counts as a lone parent for the CAF</h2>
<p>The ${h.src('spRsa', 'service-public.fr RSA sheet')} covers two situations. First, a pregnant woman living alone. Second, someone left to care alone for at least one child or dependant after a life event such as a separation or a partner’s death. The key word is event. A parent who has raised a child alone for years without a recent break-up no longer gets the increase, and the ordinary scale applies.</p>

<h2>Twelve months, or until age 3: the duration rule</h2>
<p>Everything depends on the youngest child’s age at the time of the event. If the child is already 3, the increase lasts 12 months, paid within an 18-month window after the separation or death, which is why it must be reported within 6 months. If the child is under 3, or during pregnancy, it lasts until the third birthday. A mother who separates when her baby is 6 months old can therefore receive the increased rate for two and a half years; another, separating when her youngest is 4, gets it for one year only.</p>

<h2>Sophie: two children, a recent separation</h2>
<p>Sophie separated in January. Her children are 4 and 7, so the increase will last 12 months. She has no income and receives APL plus ${h.eur(af2(h), 2)} of child benefit, paid under the rules on the ${h.src('spAf', 'family allowances sheet')}. The increased rate for two children is ${h.eur(h.M.forfaitaireRsa(false, 2, true), 2)}. The CAF deducts the three-person housing amount, ${h.eur(sophie(h, true).fl, 2)}, and the child benefit. Sophie receives about ${h.eur(sophie(h, true).rsa, 2)} of RSA a month.</p>
<p>A year from now, with no change in her situation, the calculation returns to the ordinary scale: a ${h.eur(h.M.forfaitaireRsa(false, 2), 2)} base and an estimated RSA of ${h.eur(sophie(h, false).rsa, 2)}. The drop, ${h.eur(sophie(h, true).rsa - sophie(h, false).rsa, 2)} a month, is not a CAF mistake. It pays to prepare, for instance by taking part-time work: RSA then shrinks, but the ${h.a('prime-activite-parent-isole', 'activity bonus for lone parents')}, also increased, is added.</p>

<h2>Where to start after a separation</h2>
<p>You apply to the CAF, online or in person depending on the département. RSA is due from the first day of the month in which the claim is filed: filing on the 28th rather than the 2nd of the following month gains a whole month at the increased rate. Income is taken from the last three months, which causes a common problem after a break-up: the former partner’s pay still sits in that period. Report the separation date so the CAF works from the household as it really is now. The first decision covers three months; after that, each quarterly return, pre-filled since March 2025, triggers a fresh calculation.</p>

<h2>Traps specific to parents on their own</h2>
<p>The first is reporting late, as above: beyond 6 months, part of the increase may be lost. The second is a new relationship. As soon as a new partner moves in, the increase stops, the couple scale applies and the partner’s income enters the sum; service-public.fr asks for prompt reporting of that change. The third concerns the other parent: if they pay no maintenance, you can claim the ${h.a('allocation-soutien-familial', 'family support allowance (ASF)')}, and any maintenance received is declared in the quarter’s income.</p>
<p>One rule protects lone parents: the halving of RSA after 60 days in hospital does not apply to a claimant with a dependant. And if a penalty is imposed for breaching the engagement contract, the cut is capped at 50% because the household includes at least one child. The ${h.a('simulateur-rsa', 'RSA calculator')} applies the increased rate when you tick the lone-parent option.</p>
`,
  },
});
