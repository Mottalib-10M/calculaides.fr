import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Personne seule, sans enfant, locataire sans aide au logement : la prime selon le salaire. */
const pa = (h: Helpers, s: number, autres = 0) => h.M.primeActivite({ couple: false, enfants: 0, revenu1: s, autres });
const base = (h: Helpers) => h.P.pa.montant_forfaitaire;
const sortie = (h: Helpers) => h.M.seuilSortiePrime({ couple: false, enfants: 0 });
const paliers = (h: Helpers) => [400, base(h), 900, 1200, h.P.smic.mensuel_net, 1800, 2000];

export default defineGuide({
  id: 'prime-activite-celibataire',
  group: 'activite',
  order: 20,
  mini: 'paCelibataire',
  related: ['simulateur-prime-activite', 'prime-activite-bonification', 'prime-activite-forfait-logement', 'prime-activite-temps-partiel', 'prime-activite-smic'],
  sources: ['spPa', 'decretPa2026', 'cssD843'],
  fr: {
    slug: 'prime-activite-personne-seule',
    nav: 'Personne seule',
    card: 'La courbe de la prime d’une personne seule, du petit salaire jusqu’au seuil où elle s’éteint.',
    title: 'Prime d’activité personne seule 2026 : montant par salaire',
    description: 'Prime d’activité 2026 pour une personne seule : maximale vers 638,28 € de salaire, nulle autour de 2 150 € net. Courbe complète, exemple chiffré, simulateur.',
    h1: 'Prime d’activité quand on vit seul',
    intro: 'Seul, sans enfant : la prime monte avec les premiers euros gagnés, puis redescend lentement jusqu’à disparaître.',
    resume: (h) => `Une personne seule qui gagne ${h.eur(1200)} net par mois peut recevoir environ ${h.eur(pa(h, 1200).prime)} de prime d’activité au barème du 1er avril 2026, et près de ${h.eur(pa(h, h.P.smic.mensuel_net).prime)} au Smic à temps plein. La prime ne suit pas le salaire de façon simple. Tant que le salaire reste sous le montant forfaitaire de ${h.eur(base(h), 2)}, elle grimpe avec lui : chaque euro gagné ajoute ${h.pct(h.P.pa.taux_revenus, 2)} d’euro de prime. Elle culmine à ${h.eur(pa(h, base(h)).prime)} pour un salaire égal à ce forfaitaire, puis baisse doucement, freinée par la bonification individuelle qui grandit jusqu’à ${h.eur(h.P.smic.horaire_brut * h.P.pa.bonif.plafond_smic_h, 2)}. Au-delà, la baisse s’accélère, et le droit s’éteint vers ${h.eur(sortie(h))} de salaire net, sans aide au logement ni autre ressource. Ces chiffres sont des estimations faites avec le moteur du site ; la CAF fixe le montant réel à partir de la déclaration trimestrielle.`,
    faqs: (h) => [
      { q: 'Je vis seul et je gagne 1 200 € net, combien de prime d’activité ?', a: `Environ ${h.eur(pa(h, 1200).prime)} par mois au barème d’avril 2026, si vous n’avez ni aide au logement ni autre revenu. Le détail : forfaitaire de ${h.eur(base(h), 2)}, plus ${h.eur(pa(h, 1200).partRevenus, 2)} au titre de vos revenus, plus ${h.eur(pa(h, 1200).bonif, 2)} de bonification, moins vos ${h.eur(1200)} de ressources. La CAF part de la moyenne de vos trois derniers salaires.` },
      { q: 'À partir de quel salaire une personne seule perd la prime d’activité ?', a: `Vers ${h.eur(sortie(h))} net par mois pour un célibataire locataire sans aide au logement, au barème du 1er avril 2026. Avec l’APL ou un hébergement gratuit, le forfait logement avance ce seuil à environ ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0, forfaitLogement: true }))}. Juste avant l’extinction, le calcul passe sous ${h.eur(h.P.pa.minimum_verse)} et la CAF cesse de verser.` },
      { q: 'Pourquoi ma prime baisse alors que mon salaire augmente ?', a: `Parce que vos ressources dépassent le forfaitaire de ${h.eur(base(h), 2)}. À partir de là, chaque euro de salaire en plus retire un euro et rend ${h.pct(h.P.pa.taux_revenus, 2)} d’euro, soit une perte nette d’environ 40 centimes, en partie compensée par la bonification jusqu’à ${h.eur(h.M.plafondBonification(), 2)}. Votre revenu total continue toutefois de progresser.` },
      { q: 'Mes allocations chômage réduisent-elles ma prime si je vis seul ?', a: `Oui, entièrement. Le chômage entre dans les ressources du foyer mais pas dans les revenus professionnels qui ouvrent la part de ${h.pct(h.P.pa.taux_revenus, 2)}. Avec ${h.eur(800)} de salaire et ${h.eur(500)} d’allocation, la prime tombe à ${h.eur(pa(h, 800, 500).prime)}, contre ${h.eur(pa(h, 800).prime)} sans allocation. Déclarez les deux à la CAF chaque trimestre.` },
      { q: 'Un étranger qui vit seul peut-il toucher la prime d’activité ?', a: 'Oui, sous conditions de séjour. Selon la fiche F2882 de service-public, un ressortissant européen doit avoir droit au séjour et vivre en France depuis au moins 3 mois. Hors Europe, il faut notamment un titre de séjour permettant de travailler détenu depuis au moins 5 ans, une carte de résident, ou le statut de réfugié ou de bénéficiaire de la protection subsidiaire.' },
    ],
    body: (h) => `
<h2>Une prime en cloche, pas en ligne droite</h2>
<p>Pour un célibataire, la formule tient en une ligne : montant forfaitaire, plus ${h.pct(h.P.pa.taux_revenus, 2)} du salaire, plus la bonification, moins les ressources ou le forfaitaire si celui-ci est plus élevé. Ce « ou » change tout. Avec un petit salaire, les ressources sont inférieures à ${h.eur(base(h), 2)} : la CAF retire le forfaitaire qu’elle vient d’ajouter, et il ne reste que la part du salaire. La prime vaut alors ${h.pct(h.P.pa.taux_revenus, 2)} de ce que vous gagnez, bonification en plus.</p>
<p>Dès que le salaire passe le forfaitaire, c’est lui qu’on retire. La prime devient le forfaitaire moins environ 40 % du salaire, et elle commence à décroître. Le sommet se situe donc pile au niveau du forfaitaire : ${h.eur(pa(h, base(h)).prime)} par mois pour ${h.eur(base(h), 2)} de salaire net.</p>
${h.table(['Salaire net mensuel', 'Part des revenus', 'Bonification', 'Prime estimée'], paliers(h).map((s) => [h.eur(s), h.eur(pa(h, s).partRevenus), h.eur(pa(h, s).bonif), h.eur(pa(h, s).prime)]), 'Personne seule sans enfant, sans aide au logement, barème du 1er avril 2026 (estimation)', ['r', 'r', 'r', 'r'])}
<!--mini:paCelibataire-->

<h2>Le cas de 1 200 € détaillé</h2>
<p>Prenons une vendeuse à temps partiel qui touche ${h.eur(1200)} net en moyenne sur le trimestre. Le calcul de la CAF se lit ainsi :</p>
<ol>
<li>montant forfaitaire d’une personne seule : ${h.eur(base(h), 2)} ;</li>
<li>${h.pct(h.P.pa.taux_revenus, 2)} de ses revenus professionnels : ${h.eur(pa(h, 1200).partRevenus, 2)} ;</li>
<li>bonification individuelle, puisque son salaire dépasse ${h.eur(h.M.seuilBonification(), 2)} : ${h.eur(pa(h, 1200).bonif, 2)} ;</li>
<li>on retire ses ressources, ${h.eur(1200)}, plus élevées que le forfaitaire.</li>
</ol>
<p>Reste ${h.eur(pa(h, 1200).prime, 2)} par mois, fixes pendant trois mois. Sur un an, à salaire constant, cela représente ${h.eur(pa(h, 1200).prime * 12)} non imposables, selon la ${h.src('spPa', 'fiche F2882 de service-public')}.</p>

<h2>Gagner plus fait-il perdre de l’argent ?</h2>
<p>Non. Entre ${h.eur(h.M.seuilBonification())} et ${h.eur(h.M.plafondBonification())} de salaire, la bonification monte en même temps que la prime de base baisse. Un euro de salaire supplémentaire coûte en moyenne une quinzaine de centimes de prime, pas davantage. Passer de ${h.eur(1200)} à ${h.eur(1600)} réduit la prime de ${h.eur(pa(h, 1200).prime - pa(h, 1600).prime)} mais augmente le revenu total de ${h.eur(1600 + pa(h, 1600).prime - 1200 - pa(h, 1200).prime)}.</p>
<p>Au-dessus de ${h.eur(h.M.plafondBonification())}, la bonification est plafonnée à ${h.eur(h.M.bonificationMax(), 2)} par le ${h.src('cssD843', 'code de la sécurité sociale')} : la prime perd alors un peu plus de 40 centimes par euro gagné, jusqu’à s’annuler. Le revenu total continue de monter, plus lentement. Le détail de cette mécanique figure sur la page ${h.a('prime-activite-bonification', 'bonification individuelle')}.</p>

<h2>Ce qui réduit la prime d’un célibataire</h2>
<h3>Les ressources qui ne sont pas un salaire</h3>
<p>Allocations chômage, pension d’invalidité, pension alimentaire reçue : tout ce qui n’est pas un revenu d’activité alourdit les ressources sans rien ajouter à la part de ${h.pct(h.P.pa.taux_revenus, 2)}. C’est le piège le plus fréquent des reprises d’emploi à temps partiel, quand l’allocation de France Travail continue d’être versée.</p>
<h3>Le logement</h3>
<p>Un célibataire qui touche l’APL, ou qui est logé gratuitement par un proche, se voit compter un forfait logement de ${h.eur(h.M.forfaitLogement(base(h), 1), 2)} par mois dans ses ressources. Au salaire de ${h.eur(1200)}, la prime descend à ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: 1200, forfaitLogement: true }).prime)}. Voir ${h.a('prime-activite-forfait-logement', 'le forfait logement de la prime d’activité')}.</p>
<h3>Un temps plein au-dessus du Smic</h3>
<p>Le seuil de sortie, vers ${h.eur(sortie(h))} net, représente un peu moins d’une fois et demie le Smic net. Une augmentation, un treizième mois versé en une fois ou des heures supplémentaires peuvent suffire à couper la prime pour un trimestre, puis à la rouvrir le suivant.</p>

<h2>Redevenir seul après une rupture</h2>
<p>Une séparation sans enfant fait basculer le foyer du barème couple au barème personne seule. Le forfaitaire passe de ${h.eur(h.M.forfaitairePa(true, 0), 2)} à ${h.eur(base(h), 2)}, et les revenus de l’ex-conjoint sortent du calcul. Selon le salaire restant, la prime peut monter ou baisser : avec ${h.eur(1400)} net et un conjoint sans revenu, le couple touchait ${h.eur(h.M.primeActivite({ couple: true, enfants: 0, revenu1: 1400, revenu2: 0 }).prime)} ; seul, la même personne reçoit ${h.eur(pa(h, 1400).prime)}. La majoration pour isolement ne s’applique pas ici : elle suppose un enfant à charge ou une grossesse. La CAF demande de signaler rapidement tout changement de situation familiale ; un droit calculé sur l’ancien foyer donnerait lieu à un indu.</p>

<h2>Avant de faire la demande</h2>
<p>Trois conditions générales s’appliquent à un Français vivant seul : avoir au moins 18 ans, exercer une activité professionnelle avec des revenus modestes, résider en France de manière stable. Un travailleur détaché temporairement en France n’y a pas droit. La demande se fait en ligne sur le site de la CAF, et la prime est due à partir du premier jour du mois de la demande : attendre coûte des mois de droits. Le ${h.a('simulateur-prime-activite', 'simulateur complet')} ajoute les autres ressources et le logement pour affiner l’estimation.</p>
`,
  },
  en: {
    slug: 'activity-bonus-single-person',
    nav: 'Single person',
    card: 'How a single person’s activity bonus rises, peaks and fades as pay goes up.',
    title: 'Activity Bonus Single Person 2026: Amount by Net Pay',
    description: 'Activity bonus 2026 for a single person in France: it peaks near €638.28 of pay and fades out around €2,150 net a month. Full curve, worked example, calculator.',
    h1: 'Activity bonus when you live alone',
    intro: 'Single, no children: the bonus rises with your first euros of pay, then slowly falls away.',
    resume: (h) => `A single person earning ${h.eur(1200)} net a month can receive about ${h.eur(pa(h, 1200).prime)} of prime d’activité, France’s top-up for low earners, paid by the CAF (caisse d’allocations familiales), under the scale in force since 1 April 2026, and close to ${h.eur(pa(h, h.P.smic.mensuel_net).prime)} on the full-time minimum wage (Smic). The bonus does not track pay in a simple way. While pay stays below the flat-rate amount of ${h.eur(base(h), 2)}, it rises with it: each euro earned adds ${h.pct(h.P.pa.taux_revenus, 2)} of a euro. It peaks at ${h.eur(pa(h, base(h)).prime)} when pay equals that flat rate, then edges down, cushioned by the individual top-up that grows until pay reaches ${h.eur(h.P.smic.horaire_brut * h.P.pa.bonif.plafond_smic_h, 2)}. Beyond that the decline speeds up, and the right ends at around ${h.eur(sortie(h))} of net pay, with no housing aid and no other income. These are estimates from the site’s engine; the CAF sets the real amount from your quarterly return.`,
    faqs: (h) => [
      { q: 'I live alone and earn €1,200 net, how much activity bonus will I get?', a: `About ${h.eur(pa(h, 1200).prime)} a month at April 2026 rates, if you have no housing aid and no other income. Line by line: flat rate of ${h.eur(base(h), 2)}, plus ${h.eur(pa(h, 1200).partRevenus, 2)} for your earnings, plus a ${h.eur(pa(h, 1200).bonif, 2)} top-up, minus your ${h.eur(1200)} of resources. The CAF uses the average of your last three monthly payslips.` },
      { q: 'At what salary does a single person stop getting the activity bonus?', a: `At about ${h.eur(sortie(h))} net a month for a single tenant with no housing aid, at 1 April 2026 rates. With APL (housing aid) or free accommodation, the housing flat rate brings the cut-off forward to about ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0, forfaitLogement: true }))}. Just before that point the sum drops below ${h.eur(h.P.pa.minimum_verse)} and the CAF stops paying.` },
      { q: 'Why does my bonus go down when I earn more?', a: `Because your resources are now above the ${h.eur(base(h), 2)} flat rate. From there, each extra euro of pay removes one euro and gives back ${h.pct(h.P.pa.taux_revenus, 2)} of a euro, a net loss of about 40 cents, partly offset by the top-up until pay reaches ${h.eur(h.M.plafondBonification(), 2)}. Your total income still goes up.` },
      { q: 'Do unemployment benefits cut a single person’s activity bonus?', a: `Yes, in full. Unemployment benefit counts as household resources but not as earnings, so it adds nothing to the ${h.pct(h.P.pa.taux_revenus, 2)} share. With ${h.eur(800)} of pay and ${h.eur(500)} of benefit, the bonus falls to ${h.eur(pa(h, 800, 500).prime)}, against ${h.eur(pa(h, 800).prime)} without benefit. Report both to the CAF every quarter.` },
      { q: 'Can a foreign national living alone in France claim the activity bonus?', a: 'Yes, subject to residence rules. According to sheet F2882 on service-public.fr, EU nationals need a right of residence and at least 3 months living in France. Others need, among the options listed, a residence permit allowing work held for at least 5 years, a resident card (carte de résident), or refugee or subsidiary protection status.' },
    ],
    body: (h) => `
<h2>A bell curve, not a straight line</h2>
<p>For a single person, the formula fits on one line: flat-rate amount, plus ${h.pct(h.P.pa.taux_revenus, 2)} of pay, plus the top-up, minus resources or minus the flat rate if that is higher. That “or” is the whole story. On low pay, your resources are under ${h.eur(base(h), 2)}, so the CAF takes back the flat rate it has just added and only the share of pay is left. The bonus is then ${h.pct(h.P.pa.taux_revenus, 2)} of what you earn, plus any top-up.</p>
<p>Once pay passes the flat rate, pay is what gets deducted. The bonus becomes the flat rate minus roughly 40% of pay, and starts to shrink. The peak therefore sits exactly at the flat rate: ${h.eur(pa(h, base(h)).prime)} a month for ${h.eur(base(h), 2)} of net pay.</p>
${h.table(['Net monthly pay', 'Share of earnings', 'Top-up', 'Estimated bonus'], paliers(h).map((s) => [h.eur(s), h.eur(pa(h, s).partRevenus), h.eur(pa(h, s).bonif), h.eur(pa(h, s).prime)]), 'Single person, no children, no housing aid, 1 April 2026 rates (estimate)', ['r', 'r', 'r', 'r'])}
<!--mini:paCelibataire-->

<h2>The €1,200 case, step by step</h2>
<p>Take a part-time shop assistant whose net pay averages ${h.eur(1200)} over the quarter. The CAF’s sum reads like this:</p>
<ol>
<li>single-person flat-rate amount: ${h.eur(base(h), 2)};</li>
<li>${h.pct(h.P.pa.taux_revenus, 2)} of her earnings: ${h.eur(pa(h, 1200).partRevenus, 2)};</li>
<li>individual top-up, since her pay is above ${h.eur(h.M.seuilBonification(), 2)}: ${h.eur(pa(h, 1200).bonif, 2)};</li>
<li>minus her resources, ${h.eur(1200)}, which are higher than the flat rate.</li>
</ol>
<p>That leaves ${h.eur(pa(h, 1200).prime, 2)} a month, fixed for three months. Over a year at steady pay, that comes to ${h.eur(pa(h, 1200).prime * 12)}, tax-free according to the ${h.src('spPa', 'service-public.fr sheet F2882')}.</p>

<h2>Can earning more leave you worse off?</h2>
<p>No. Between ${h.eur(h.M.seuilBonification())} and ${h.eur(h.M.plafondBonification())} of pay, the top-up grows while the basic bonus shrinks. An extra euro of pay costs around fifteen cents of bonus on average, no more. Going from ${h.eur(1200)} to ${h.eur(1600)} trims the bonus by ${h.eur(pa(h, 1200).prime - pa(h, 1600).prime)} but lifts total income by ${h.eur(1600 + pa(h, 1600).prime - 1200 - pa(h, 1200).prime)}.</p>
<p>Above ${h.eur(h.M.plafondBonification())}, the top-up is capped at ${h.eur(h.M.bonificationMax(), 2)} by the ${h.src('cssD843', 'Social Security Code')}: the bonus then loses a little over 40 cents per euro earned until it reaches zero. Total income keeps rising, more slowly. The mechanics are on the ${h.a('prime-activite-bonification', 'individual top-up')} page.</p>

<h2>What shrinks a single person’s bonus</h2>
<h3>Income that is not pay</h3>
<p>Unemployment benefit, an invalidity pension, maintenance received from an ex-partner: anything that is not earned from work weighs on resources without feeding the ${h.pct(h.P.pa.taux_revenus, 2)} share. This is the usual trap when someone returns to part-time work while France Travail (the public employment service) keeps paying benefit.</p>
<h3>Housing</h3>
<p>A single person who receives APL, or who lives rent-free with a relative or friend, has a housing flat rate (forfait logement) of ${h.eur(h.M.forfaitLogement(base(h), 1), 2)} a month added to resources. At ${h.eur(1200)} of pay, the bonus falls to ${h.eur(h.M.primeActivite({ couple: false, enfants: 0, revenu1: 1200, forfaitLogement: true }).prime)}. See ${h.a('prime-activite-forfait-logement', 'the housing flat rate')}.</p>
<h3>Full-time work above the minimum wage</h3>
<p>The cut-off, near ${h.eur(sortie(h))} net, is a little under one and a half times the net Smic. A pay rise, a thirteenth-month bonus paid in one go or a run of overtime can switch the bonus off for one quarter and back on for the next.</p>

<h2>Living alone again after a break-up</h2>
<p>A separation without children moves the household from the couple scale to the single-person scale. The flat rate drops from ${h.eur(h.M.forfaitairePa(true, 0), 2)} to ${h.eur(base(h), 2)}, and the former partner’s income leaves the sum. Depending on the pay you keep, the bonus can go either way: with ${h.eur(1400)} net and a partner with no income, the couple received ${h.eur(h.M.primeActivite({ couple: true, enfants: 0, revenu1: 1400, revenu2: 0 }).prime)}; alone, the same person receives ${h.eur(pa(h, 1400).prime)}. The lone-parent higher rate does not apply here, because it requires a dependent child or a pregnancy. The CAF asks you to report any change in family situation promptly. Any bonus calculated on the old household and paid after the split would have to be repaid (an indu, meaning an overpayment the CAF claws back from later payments).</p>

<h2>Before you claim</h2>
<p>Three general conditions apply to a French national living alone: being at least 18, working with modest earnings, and living in France on a stable basis. A worker temporarily posted to France by a foreign employer is not eligible. You claim online on the CAF website, and the bonus is due from the first day of the month of your claim, so waiting costs you months of entitlement. The ${h.a('simulateur-prime-activite', 'full calculator')} adds other income and housing for a finer estimate.</p>
`,
  },
});
