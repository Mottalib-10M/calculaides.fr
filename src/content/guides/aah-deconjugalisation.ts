import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemples : Camille sans revenu (conjoint à 2 500 €), Thomas salarié à 1 600 € net (conjointe sans revenu). */
const thomas = 1600;
const aahSal = (h: Helpers, s: number) => h.M.aah({ salaire: s });
const coupleEnfant = (h: Helpers) => h.P.aah.plafond_couple_conjugalise + h.P.aah.majoration_enfant;

export default defineGuide({
  id: 'aah-deconjugalisation',
  group: 'handicap',
  order: 20,
  mini: 'aahDeconjugalisation',
  related: ['simulateur-aah', 'aah-plafond-ressources', 'aah-cumul-salaire', 'aah-enfants', 'rsa-couple'],
  sources: ['spAah', 'decretAah2026'],
  fr: {
    slug: 'aah-deconjugalisation',
    nav: 'AAH et couple',
    card: 'Depuis octobre 2023, l’AAH ignore les revenus du conjoint, sauf si l’ancien calcul est plus favorable.',
    title: 'Déconjugalisation AAH 2026 : couple, conjoint et calcul',
    description: 'Déconjugalisation de l’AAH en 2026 : depuis le 1er octobre 2023, seuls vos revenus comptent. Plafond 12 499 €, ancien calcul de couple (22 623 €) si meilleur.',
    h1: 'AAH et vie de couple : ce que change la déconjugalisation',
    intro: 'Le salaire du conjoint ne réduit plus l’AAH. Mais pour certains couples, l’ancien mode de calcul reste plus intéressant, et la CAF le garde.',
    resume: (h) => `Depuis le 1er octobre 2023, l’AAH est calculée sur les seules ressources de la personne handicapée : les revenus de son conjoint, époux, partenaire de Pacs ou concubin, ne comptent plus. Une personne sans ressource personnelle touche donc ${h.eur(h.P.aah.montant_max, 2)} par mois en 2026, que son conjoint gagne 1 000 € ou 4 000 €. Le plafond de ressources est celui d’une personne seule, ${h.eur(h.P.aah.plafond_annuel)} par an sans enfant. Ce changement s’appelle la déconjugalisation. Il ne se retourne pas contre ceux qu’il désavantagerait : quand l’ancien calcul, dit conjugalisé, reste plus favorable, par exemple parce que la personne handicapée gagne plus que son conjoint, la CAF ou la MSA le maintient automatiquement, avec un plafond de couple de ${h.eur(h.P.aah.plafond_couple_conjugalise)}. Dès qu’il ne l’est plus, le passage au nouveau calcul est automatique et définitif. Les montants donnés ici sont des estimations ; seule la caisse calcule le droit.`,
    faqs: (h) => [
      { q: 'Mon mari gagne 3 000 € par mois, ai-je droit à l’AAH à taux plein ?', a: `Oui, si vous n’avez vous-même aucune ressource. Depuis le 1er octobre 2023, les revenus du conjoint ne sont plus pris en compte. Votre AAH estimée est de ${h.eur(h.P.aah.montant_max, 2)} par mois, au montant du 1er avril 2026. Le droit dépend toujours du taux d’incapacité reconnu par la CDAPH et de vos propres ressources, sous le plafond de ${h.eur(h.P.aah.plafond_annuel)} par an.` },
      { q: 'Dois-je demander à la CAF de passer à l’AAH déconjugalisée ?', a: 'Non. Selon service-public, c’est la CAF ou la MSA qui évalue et applique automatiquement le mode de calcul le plus avantageux, sans démarche de votre part. Si l’ancien calcul de couple vous reste favorable, il est conservé ; dès qu’il ne l’est plus, l’AAH est déconjugalisée. Il suffit de déclarer normalement vos ressources et tout changement de situation familiale.' },
      { q: 'Peut-on revenir à l’ancien calcul de l’AAH en couple après la bascule ?', a: `Non. La fiche service-public est explicite : lorsque la conjugalisation ne vous avantage plus, l’AAH est déconjugalisée, et ce calcul est automatique et définitif. Une hausse ultérieure des revenus de votre conjoint ou une baisse des vôtres ne fera pas revenir au plafond de couple de ${h.eur(h.P.aah.plafond_couple_conjugalise)}. Le calcul individuel, plafonné à ${h.eur(h.P.aah.plafond_annuel)}, s’applique alors durablement.` },
      { q: 'Qui garde l’ancien calcul conjugalisé de l’AAH ?', a: `Surtout la personne handicapée qui gagne davantage que son conjoint. L’ancien plafond de couple, ${h.eur(h.P.aah.plafond_couple_conjugalise)} par an sans enfant et ${h.eur(coupleEnfant(h))} avec un enfant, est plus haut que le plafond individuel de ${h.eur(h.P.aah.plafond_annuel)}. Si le conjoint a peu de revenus, ce plafond plus large peut laisser une AAH plus élevée. Le tableau de service-public vise les couples déjà bénéficiaires de l’AAH.` },
      { q: 'Se marier ou se pacser fait-il baisser l’AAH depuis 2023 ?', a: `Non, plus pour la personne qui relève du calcul individuel. Que vous viviez en union libre, pacsé ou marié, l’AAH dépend de vos seules ressources : sans revenu, elle reste à ${h.eur(h.P.aah.montant_max, 2)}. La vie de couple doit tout de même être déclarée à la CAF, car elle compte pour d’autres prestations du foyer, comme le RSA ou l’aide au logement.` },
    ],
    body: (h) => `
<h2>Ce que dit la règle depuis octobre 2023</h2>
<p>La ${h.src('spAah', 'fiche AAH de service-public')} résume la réforme en une phrase : depuis le 1er octobre 2023, le montant de l’AAH est calculé uniquement à partir des ressources personnelles, sans tenir compte des revenus de la personne avec laquelle on vit en couple. Le couple, ici, recouvre le mariage, le Pacs et l’union libre. Le montant maximal, ${h.eur(h.P.aah.montant_max, 2)} depuis le ${h.src('decretAah2026', 'décret du 30 mars 2026')}, et le plafond individuel de ${h.eur(h.P.aah.plafond_annuel)} par an s’appliquent comme pour une personne seule.</p>
<p>Avant cette date, les ressources des deux conjoints s’additionnaient face à un plafond de couple. Une personne handicapée sans revenu pouvait perdre tout ou partie de son AAH parce que son conjoint travaillait. C’est cette dépendance financière que la déconjugalisation a supprimée.</p>
<!--mini:aahDeconjugalisation-->

<h2>Camille : un conjoint salarié, une AAH intacte</h2>
<p>Camille vit avec Hugo, cadre payé 2 500 € net par mois. Elle ne travaille pas et sa CDAPH lui a reconnu un taux d’incapacité de 80 %. Ses ressources personnelles sont nulles. Son AAH estimée est de ${h.eur(aahSal(h, 0).aah, 2)}. Le salaire d’Hugo n’entre dans aucune ligne du calcul. Si Hugo obtient une augmentation, rien ne bouge ; s’il perd son emploi, rien ne bouge non plus. Pour Camille, la vie de couple n’a plus d’effet sur le montant.</p>

<h2>Thomas : le cas où l’ancien calcul compte encore</h2>
<p>Thomas perçoit l’AAH depuis des années et travaille dans une entreprise ordinaire, pour ${h.eur(thomas)} net par mois. Sa compagne n’a aucun revenu. Avec le calcul individuel, son salaire est retenu après abattement, à ${h.eur(aahSal(h, thomas).salaireRetenu, 2)} par mois, et son AAH estimée tombe à ${h.eur(aahSal(h, thomas).aah, 2)}. Avec l’ancien calcul, ses ressources et celles de sa compagne, nulles, auraient été comparées au plafond de couple de ${h.eur(h.P.aah.plafond_couple_conjugalise)}, bien plus haut. C’est exactement le profil que décrit service-public : des ressources personnelles plus élevées que celles du conjoint.</p>
<p>Thomas n’a rien à demander. La CAF compare les deux modes et lui applique le plus favorable. Notre simulateur, lui, ne reproduit que le calcul individuel : pour un profil comme le sien, l’AAH réellement versée peut être supérieure à notre estimation.</p>

<h2>Les plafonds des deux modes de calcul</h2>
${h.table(['Mode de calcul', 'Sans enfant', 'Avec 1 enfant'], [
  ['Déconjugalisé (ressources personnelles)', h.eur(h.M.plafondAah(0)), h.eur(h.M.plafondAah(1))],
  ['Conjugalisé (ressources du couple)', h.eur(h.P.aah.plafond_couple_conjugalise), h.eur(coupleEnfant(h))],
], 'Plafonds annuels de ressources de l’AAH en 2026, selon service-public', ['l', 'r', 'r'])}
<p>Chaque enfant à charge relève les deux plafonds du même montant, ${h.eur(h.P.aah.majoration_enfant)} environ ; la page ${h.a('aah-enfants', 'AAH et enfants à charge')} donne la suite du barème. Les ressources retenues sont celles du revenu net catégoriel de l’avis d’imposition de 2024 pour une demande faite en 2026, comme l’explique la page ${h.a('aah-plafond-ressources', 'plafond de ressources de l’AAH')}.</p>

<h2>Ce que la réforme ne change pas</h2>
<p>La déconjugalisation porte sur le calcul du montant, pas sur l’accès au droit. Il faut toujours un taux d’incapacité d’au moins 80 %, ou de 50 à 79 % avec une restriction substantielle et durable d’accès à l’emploi, reconnu par la CDAPH de la MDPH, et avoir au moins 20 ans. La durée d’attribution reste la même : de 1 à 10 ans, ou à vie quand le handicap ne peut pas évoluer favorablement, pour un taux d’au moins 80 %.</p>
<p>La vie de couple garde aussi un rôle dans une situation précise. En cas d’hospitalisation ou de séjour en maison d’accueil spécialisée de plus de 60 jours, l’AAH est normalement réduite à ${h.pct(h.P.aah.taux_hospitalisation, 0)} de son montant. Service-public prévoit plusieurs exceptions, dont celle-ci : la réduction ne s’applique pas si la personne avec laquelle vous vivez en couple ne travaille pas pour un motif reconnu par la CDAPH.</p>

<h2>Le piège : la bascule sans retour</h2>
<p>Le maintien de l’ancien calcul n’est pas un choix permanent. Service-public précise que dès que la conjugalisation ne vous avantage plus, l’AAH est déconjugalisée, et que ce calcul est définitif. Pour Thomas, cela peut arriver le jour où sa compagne trouve un emploi : le calcul de couple cesse alors d’être favorable, la CAF bascule, et un retour au chômage de sa compagne ne fera pas revenir l’ancien mode. Ce n’est pas une raison pour retarder une déclaration, qui reste obligatoire pour tout changement de situation, mais c’est un élément à connaître avant de s’étonner d’une baisse.</p>
<p>Pour estimer votre propre montant au calcul individuel, utilisez le ${h.a('simulateur-aah', 'simulateur AAH')} ; si vous travaillez, la page ${h.a('aah-cumul-salaire', 'AAH et salaire')} détaille l’abattement.</p>
`,
  },
  en: {
    slug: 'aah-partner-income',
    nav: 'AAH and couples',
    card: 'Since October 2023, AAH ignores a partner’s income, unless the old joint calculation is better.',
    title: 'AAH Partner Income 2026: Individual Calculation Explained',
    description: 'AAH in 2026: since 1 October 2023 only your own income counts, not your partner’s. A €12,499 ceiling, or the old €22,623 couple ceiling where it is better.',
    h1: 'AAH and living as a couple: what individualisation changed',
    intro: 'A partner’s pay no longer reduces AAH. For some couples, though, the old joint calculation is still better, and the CAF keeps it.',
    resume: (h) => `Since 1 October 2023, the AAH (allocation aux adultes handicapés, France’s allowance for disabled adults) is worked out on the disabled person’s own resources only: the income of a spouse, civil partner or unmarried partner no longer counts. Someone with no personal income therefore receives ${h.eur(h.P.aah.montant_max, 2)} a month in 2026, be their partner’s pay €1,000 or €4,000. The ceiling is the single-person one, ${h.eur(h.P.aah.plafond_annuel)} a year with no children. The French call this change déconjugalisation. It does not work against those it would disadvantage: where the old joint method is still more favourable, for instance because the disabled person earns more than their partner, the CAF (family benefits office) or the MSA keeps it automatically, with a couple ceiling of ${h.eur(h.P.aah.plafond_couple_conjugalise)}. Once it stops being better, the switch to the new method is automatic and permanent. Figures here are estimates; only the benefits office sets the entitlement.`,
    faqs: (h) => [
      { q: 'My husband earns €3,000 a month, can I get the full AAH?', a: `Yes, if you have no income yourself. Since 1 October 2023, a partner’s income is not taken into account. Your estimated AAH is ${h.eur(h.P.aah.montant_max, 2)} a month at the 1 April 2026 rate. Entitlement still depends on the impairment rate recognised by the CDAPH (the MDPH decision board) and on your own resources, under the ${h.eur(h.P.aah.plafond_annuel)} yearly ceiling.` },
      { q: 'Do I need to ask the CAF to switch to individualised AAH?', a: 'No. According to service-public.fr, the CAF or MSA assesses and applies the more favourable method automatically, with nothing for you to do. If the old couple calculation still suits you, it stays; as soon as it no longer does, AAH is individualised. Just keep declaring your income and any change in family situation as usual.' },
      { q: 'Can I go back to the old couple calculation for AAH after the switch?', a: `No. The service-public.fr sheet is explicit: once the joint calculation no longer benefits you, AAH is individualised, and that is automatic and final. A later rise in your partner’s income or a fall in yours will not bring back the ${h.eur(h.P.aah.plafond_couple_conjugalise)} couple ceiling. The individual calculation, capped at ${h.eur(h.P.aah.plafond_annuel)}, then applies for good.` },
      { q: 'Who keeps the old joint AAH calculation?', a: `Mainly a disabled person who earns more than their partner. The old couple ceiling, ${h.eur(h.P.aah.plafond_couple_conjugalise)} a year with no children and ${h.eur(coupleEnfant(h))} with one child, is higher than the ${h.eur(h.P.aah.plafond_annuel)} individual ceiling. If the partner has little income, that wider ceiling can leave a higher AAH. The service-public.fr table covers couples already receiving AAH.` },
      { q: 'Does marrying or signing a Pacs reduce AAH since 2023?', a: `No, not for someone on the individual calculation. Unmarried, in a Pacs (civil partnership) or married, AAH depends on your own resources only: with no income it stays at ${h.eur(h.P.aah.montant_max, 2)}. You must still report the relationship to the CAF, because it matters for other household benefits such as RSA or housing aid.` },
    ],
    body: (h) => `
<h2>What the rule has said since October 2023</h2>
<p>The ${h.src('spAah', 'service-public.fr AAH sheet')} sums up the reform in one sentence: since 1 October 2023, AAH is calculated solely from personal resources, without regard to the income of the person you live with as a couple. Couple here covers marriage, Pacs and living together unmarried. The maximum, ${h.eur(h.P.aah.montant_max, 2)} under the ${h.src('decretAah2026', 'decree of 30 March 2026')}, and the ${h.eur(h.P.aah.plafond_annuel)} individual yearly ceiling apply just as for a single person.</p>
<p>Before that date, both partners’ resources were added together against a couple ceiling. A disabled person with no income could lose all or part of their AAH because their partner had a job. Individualisation removed that financial dependence.</p>
<!--mini:aahDeconjugalisation-->

<h2>Camille: a partner in work, AAH untouched</h2>
<p>Camille lives with Hugo, a manager earning €2,500 net a month. She does not work and the CDAPH has recognised an 80% impairment rate. Her personal resources are nil. Her estimated AAH is ${h.eur(aahSal(h, 0).aah, 2)}. Hugo’s salary appears nowhere in the calculation. If he gets a pay rise, nothing changes; if he loses his job, nothing changes either. For Camille, being in a couple no longer affects the amount.</p>

<h2>Thomas: where the old method still matters</h2>
<p>Thomas has received AAH for years and works for a mainstream employer, earning ${h.eur(thomas)} net a month. His partner has no income. Under the individual method, his pay is counted after the allowance, at ${h.eur(aahSal(h, thomas).salaireRetenu, 2)} a month, and his estimated AAH falls to ${h.eur(aahSal(h, thomas).aah, 2)}. Under the old method, his resources plus his partner’s, which are nil, would have been compared with the ${h.eur(h.P.aah.plafond_couple_conjugalise)} couple ceiling, far higher. That is exactly the profile service-public.fr describes: personal resources higher than the partner’s.</p>
<p>Thomas has nothing to request. The CAF compares both methods and applies the better one. Our calculator only reproduces the individual method, so for a profile like his, the AAH actually paid may be higher than our estimate.</p>

<h2>The ceilings under each method</h2>
${h.table(['Method', 'No children', 'With 1 child'], [
  ['Individualised (personal resources)', h.eur(h.M.plafondAah(0)), h.eur(h.M.plafondAah(1))],
  ['Joint (couple’s resources)', h.eur(h.P.aah.plafond_couple_conjugalise), h.eur(coupleEnfant(h))],
], 'Yearly AAH resource ceilings in 2026, per service-public.fr', ['l', 'r', 'r'])}
<p>Each dependent child raises both ceilings by the same amount, about ${h.eur(h.P.aah.majoration_enfant)}; the page on ${h.a('aah-enfants', 'AAH with dependent children')} gives the rest of the scale. The resources counted are the revenu net catégoriel (net income by category) on the 2024 tax notice for a claim made in 2026, as the page on the ${h.a('aah-plafond-ressources', 'AAH income ceiling')} explains.</p>

<h2>What the reform leaves unchanged</h2>
<p>Individualisation concerns how the amount is calculated, not who qualifies. You still need an impairment rate of at least 80%, or 50 to 79% with a substantial and lasting restriction on access to work, recognised by the CDAPH of the MDPH (maison départementale des personnes handicapées, the local disability office), and you must be at least 20. The award period is also unchanged: from 1 to 10 years, or for life when the condition cannot improve, for a rate of at least 80%.</p>
<p>Living as a couple still matters in one specific situation. After more than 60 days in hospital or in a specialised care home (maison d’accueil spécialisée), AAH is normally cut to ${h.pct(h.P.aah.taux_hospitalisation, 0)} of its amount. Service-public.fr lists several exceptions, including this one: the cut does not apply if the person you live with as a couple is unable to work for a reason recognised by the CDAPH. If that describes your partner, make sure the CAF knows before any long hospital stay begins.</p>

<h2>The trap: a one-way switch</h2>
<p>Keeping the old method is not a permanent option. Service-public.fr states that once the joint calculation no longer benefits you, AAH is individualised, and that this is final. For Thomas, that could happen the day his partner finds a job: the couple calculation stops being favourable, the CAF switches, and his partner later becoming unemployed will not bring the old method back. That is no reason to delay reporting a change, which remains compulsory, but it is worth knowing before being surprised by a lower payment.</p>
<p>To estimate your own amount on the individual method, use the ${h.a('simulateur-aah', 'AAH calculator')}; if you work, the page on ${h.a('aah-cumul-salaire', 'AAH and wages')} explains the allowance on earnings.</p>
`,
  },
});
