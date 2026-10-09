import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Plafond de rémunération d'un enfant à charge qui travaille : 55 % du Smic brut pour 169 heures (service-public, fiche F16947). */
const TAUX_ENFANT_CHARGE = 0.55;
const HEURES = 169;
const plafondJeune = (h: Helpers) => Math.round(h.P.smic.horaire_brut * HEURES * TAUX_ENFANT_CHARGE * 100) / 100;
const m18 = (h: Helpers) => h.P.ars.montants['15_18'];
/** Mère seule, un apprenti de 17 ans à charge. */
const mere = (h: Helpers, revenus: number) => h.M.ars({ c6_10: 0, c11_14: 0, c15_18: 1, enfants: 1, revenus });

export default defineGuide({
  id: 'ars-lyceen-apprenti',
  group: 'famille',
  order: 140,
  mini: 'arsLyceenApprenti',
  miniHref: 'simulateur-ars',
  related: ['simulateur-ars', 'ars-montant-age', 'ars-plafond', 'allocation-forfaitaire-20-ans', 'ars-differentielle'],
  sources: ['spArs', 'spSmic', 'instructionPf2026'],
  fr: {
    slug: 'ars-lyceen-apprenti',
    nav: 'ARS lycéen et apprenti',
    card: 'L’ARS des 16 à 18 ans : déclaration de scolarité, apprentissage et plafond de salaire de l’apprenti.',
    title: 'Allocation de rentrée scolaire 2026 : lycéen et apprenti',
    description: 'ARS 2026 de 16 à 18 ans : 466,02 € pour un lycéen ou un apprenti déclaré à la CAF, l’apprenti devant gagner au plus 1 144,21 € par mois. Démarche et exemples.',
    h1: 'ARS des 16 à 18 ans : lycéen, apprenti, ce qui change',
    intro: 'Après 16 ans, l’ARS n’arrive plus toute seule : il faut déclarer que le jeune poursuit sa formation, et son salaire d’apprenti peut tout faire basculer.',
    resume: (h) => `Pour un jeune de 16 à 18 ans, l’allocation de rentrée scolaire 2026 vaut ${h.eur(m18(h), 2)}, comme pour tout enfant de 15 à 18 ans. Deux conditions s’ajoutent pourtant à celles des plus jeunes. D’abord, la famille doit déclarer à la CAF que l’adolescent sera toujours scolarisé ou en apprentissage à la rentrée ; service-public indique que cette déclaration se fait à partir de la mi-juillet sur le site de la CAF, pour les jeunes nés entre le ${h.date(h.P.ars.naissance_min)} et le 31 décembre 2010. Sans elle, rien n’est versé. Ensuite, un apprenti ne fait gagner l’ARS que si sa rémunération reste sous un plafond : ${h.eur(plafondJeune(h), 2)} net par mois, soit 55 % du Smic pour 169 heures selon la fiche F16947 de service-public. Au-delà, il n’est plus considéré comme enfant à charge et la famille perd le droit pour lui. Le plafond de ressources du foyer s’applique comme pour tous : ${h.eur(h.P.ars.plafonds.un)} de revenus 2024 avec un seul enfant. Ces montants sont une estimation, la CAF tranche.`,
    faqs: (h) => [
      { q: 'Mon fils de 17 ans est apprenti, ai-je droit à l’ARS ?', a: `Oui, si son salaire net ne dépasse pas ${h.eur(plafondJeune(h), 2)} par mois et que vous avez déclaré l’apprentissage à la CAF. La fiche F1878 de service-public exclut l’apprenti dont la rémunération dépasse un plafond ; la fiche F16947 le fixe à 55 % du Smic pour 169 heures. Sous ce seuil, l’ARS vaut ${h.eur(m18(h), 2)} pour la rentrée 2026, si les revenus du foyer restent sous le plafond.` },
      { q: 'Quand déclarer la scolarité de mon enfant de 16 ans pour l’ARS ?', a: `À partir de la mi-juillet, sur le site de votre CAF, selon service-public. La déclaration concerne les jeunes nés entre le ${h.date(h.P.ars.naissance_min)} et le 31 décembre 2010. En 2026, l’ARS a été versée à partir du ${h.date('2026-08-18')} pour ceux dont la situation était déjà déclarée ; une déclaration plus tardive entraîne un versement quelques jours après sa réception. L’enjeu : ${h.eur(m18(h), 2)} par jeune.` },
      { q: 'Ma fille lycéenne a un job d’été, risque-t-on de perdre l’ARS ?', a: `Seulement si ses gains sont importants. Pour un enfant scolarisé qui travaille, service-public (fiche F16947) apprécie la rémunération sur six mois, du 1er avril au 30 septembre, en divisant le total par six, puis la compare à 55 % du Smic. Deux mois d’été payés 1 219 € chacun donnent environ 403 € par mois sur la période : la fiche conclut que les prestations sont maintenues.` },
      { q: 'Mon enfant a eu 18 ans en septembre 2026, est-il trop vieux pour l’ARS ?', a: `Pas forcément. La rentrée 2026 couvre les enfants nés à partir du ${h.date(h.P.ars.naissance_min)}. Un jeune né le 20 septembre 2008 y a donc droit s’il est encore lycéen ou apprenti sous le plafond de salaire, pour ${h.eur(m18(h), 2)}. Né le 10 septembre 2008, il en est exclu, même s’il passe son bac en juin suivant.` },
      { q: 'Mon fils a arrêté le lycée en juin, la CAF va-t-elle quand même verser l’ARS ?', a: `Non. La condition est d’être scolarisé, inscrit au Cned ou apprenti à la rentrée 2026. Un jeune qui quitte toute formation n’ouvre plus droit aux ${h.eur(m18(h), 2)}. La déclaration de la mi-juillet, demandée par service-public pour les 16 à 18 ans, doit donc dire la situation réelle : ni scolarité, ni apprentissage, pas d’ARS pour ce jeune.` },
      { q: 'Mon adolescent suit ses cours avec le Cned, la CAF verse-t-elle l’ARS ?', a: `Oui. La fiche F1878 de service-public assimile l’inscription au Cned à la scolarisation : l’ARS de ${h.eur(m18(h), 2)} est due pour un jeune de 15 à 18 ans inscrit au Centre national d’enseignement à distance, sous le plafond de ressources du foyer. L’instruction en famille sans inscription au Cned, elle, ne donne aucun droit. Pour les 16 ans et plus, la déclaration de la mi-juillet reste obligatoire.` },
    ],
    body: (h) => `
<h2>Pourquoi les 16 à 18 ans ont une démarche de plus</h2>
<p>Pour un enfant de moins de 16 ans, la CAF ne demande rien aux familles déjà allocataires : l’ARS est versée sans démarche, pourvu que les revenus aient été déclarés. Après 16 ans, plus rien n’est automatique. Le jeune peut poursuivre au lycée, entrer en apprentissage, chercher un emploi ou rester sans formation. La ${h.src('spArs', 'fiche F1878 de service-public')} demande donc aux parents de déclarer, à partir de la mi-juillet, que l’adolescent sera toujours scolarisé ou en apprentissage à la rentrée.</p>
<p>Pour la rentrée 2026, cette démarche vise les jeunes nés entre le ${h.date(h.P.ars.naissance_min)} et le 31 décembre 2010. Elle se fait sur le site de la CAF, ou sur celui de la MSA pour le régime agricole. Elle vaut jeune par jeune : dans une famille avec un enfant de 14 ans et un de 17 ans, l’ARS du cadet arrive seule, celle de l’aîné attend que les parents confirment le lycée ou l’apprentissage. Les familles qui ne sont pas encore allocataires suivent un autre chemin : déclaration de situation et déclaration de ressources ${h.P.ars.revenus_reference} avant tout versement.</p>

<h2>Le plafond de salaire de l’apprenti</h2>
<p>L’apprenti reçoit un salaire. Tant qu’il reste modeste, il demeure un enfant à charge pour ses parents. Le seuil, donné par la fiche F16947 de service-public (vérifiée le 1er juin 2026), est de ${h.eur(plafondJeune(h), 2)} net par mois, c’est-à-dire 55 % du Smic horaire brut de ${h.eur(h.P.smic.horaire_brut, 2)} sur 169 heures, d’après la ${h.src('spSmic', 'fiche Smic de service-public')}. Pour un apprenti, la comparaison se fait mois par mois : si un mois dépasse, le droit aux prestations tombe pour ce mois.</p>
${h.table(['Salaire net de l’apprenti', 'Enfant à charge ?', 'ARS 2026 (foyer sous le plafond)'], [900, 1100, plafondJeune(h), 1300].map((s) => [h.eur(s, s % 1 ? 2 : 0), s <= plafondJeune(h) ? 'oui' : 'non', h.eur(s <= plafondJeune(h) ? m18(h) : 0, 2)]), 'Apprenti de 17 ans, rentrée 2026 (estimation)', ['l', 'l', 'r'])}
<p>Le passage de la ligne coûte cher : ${h.eur(m18(h), 2)} d’un coup, sans calcul différentiel côté salaire. Seul le plafond de ressources des parents bénéficie d’une zone de transition, décrite sur la page ${h.a('ars-differentielle', 'ARS différentielle')}.</p>
<!--mini:arsLyceenApprenti-->

<h2>Lycéen qui travaille : la moyenne sur six mois</h2>
<p>Pour un jeune scolarisé qui a un petit emploi, la règle est plus souple. Les salaires sont totalisés sur des périodes de six mois, du 1er octobre au 31 mars et du 1er avril au 30 septembre, puis divisés par six. Un job d’été bien payé est ainsi lissé sur la période. La fiche F16947 donne l’exemple d’un jeune payé 1 219 € net en juillet et en août : sa moyenne sur la période d’avril à septembre ressort à environ 403 € par mois, sous le plafond, et les prestations familiales sont maintenues.</p>

<h2>Exemple : une mère seule et son apprenti</h2>
<p>Claire élève seule Hugo, 17 ans, apprenti en CAP. Elle a déclaré 24 000 € de revenu net catégoriel pour ${h.P.ars.revenus_reference}, sous le plafond d’un enfant de ${h.eur(h.P.ars.plafonds.un)}. Hugo gagne 950 € net par mois. Il reste à charge, Claire déclare l’apprentissage en juillet et reçoit ${h.eur(mere(h, 24000).total, 2)}. Si le salaire d’Hugo montait au-dessus de ${h.eur(plafondJeune(h), 2)} à la rentrée, l’ARS disparaîtrait pour lui, quel que soit le revenu de sa mère.</p>
<p>Inversement, si Claire avait déclaré ${h.eur(h.P.ars.plafonds.un + 200)}, elle dépasserait son propre plafond de 200 € et recevrait ${h.eur(mere(h, h.P.ars.plafonds.un + 200).total, 2)} au titre de la différentielle. Les deux tests sont indépendants : le salaire du jeune d’un côté, les revenus 2024 du foyer de l’autre.</p>

<h2>Après 18 ans</h2>
<p>L’ARS s’arrête avec la tranche des 15 à 18 ans. Le jeune peut rester à charge pour d’autres prestations : les allocations familiales jusqu’à 20 ans, et dans les familles de trois enfants et plus, l’${h.a('allocation-forfaitaire-20-ans', 'allocation forfaitaire des 20 ans')}. Les montants de chaque tranche d’âge figurent sur la page ${h.a('ars-montant-age', 'ARS par âge')}, et le ${h.a('simulateur-ars', 'simulateur de l’ARS')} calcule le total de la fratrie.</p>
`,
  },
  en: {
    slug: 'ars-older-pupil-apprentice',
    nav: 'Allowance for pupils and apprentices',
    card: 'The back-to-school allowance for 16 to 18-year-olds: declaring schooling, apprenticeships and the apprentice pay ceiling.',
    title: 'Back-to-School Allowance 2026: Pupils and Apprentices',
    description: 'Back-to-school allowance 2026 at 16 to 18: €466.02 for a declared pupil or apprentice, the apprentice earning no more than €1,144.21 a month. Steps, examples.',
    h1: 'Back-to-school allowance at 16 to 18: pupil or apprentice',
    intro: 'After 16 the allowance no longer arrives on its own: you must declare that your teenager is still in education, and apprentice pay can tip the balance.',
    resume: (h) => `For a 16 to 18-year-old, the 2026 allocation de rentrée scolaire (ARS, the back-to-school allowance paid by the CAF family benefits office) is ${h.eur(m18(h), 2)}, as for any child aged 15 to 18. Two extra conditions apply, though. First, the family must tell the CAF that the teenager will still be at school or in an apprenticeship when term starts; service-public.fr says this is done from mid-July on the CAF website, for young people born between ${h.date(h.P.ars.naissance_min)} and 31 December 2010. Without it, nothing is paid. Second, an apprentice only brings the allowance if their pay stays below a ceiling: ${h.eur(plafondJeune(h), 2)} net a month, which is 55% of the Smic (the French minimum wage) for 169 hours, according to service-public.fr sheet F16947. Above that, the young person no longer counts as a dependent child and the family loses the allowance for them. The household income ceiling applies as usual: ${h.eur(h.P.ars.plafonds.un)} of 2024 income with one child. These figures are estimates; the CAF decides.`,
    faqs: (h) => [
      { q: 'My 17-year-old son is an apprentice: can we get the back-to-school allowance?', a: `Yes, if his net pay is no more than ${h.eur(plafondJeune(h), 2)} a month and you have declared the apprenticeship to the CAF. Service-public.fr sheet F1878 excludes apprentices paid above a ceiling, and sheet F16947 sets it at 55% of the minimum wage for 169 hours. Below that, the allowance is ${h.eur(m18(h), 2)} for autumn 2026, provided household income is under the ceiling.` },
      { q: 'When do I declare my 16-year-old’s schooling to the CAF?', a: `From mid-July, on your CAF’s website, according to service-public.fr. It covers young people born between ${h.date(h.P.ars.naissance_min)} and 31 December 2010. In 2026 the allowance was paid from ${h.date('2026-08-18')} for those already declared; a later declaration means payment a few days after the CAF receives it. At stake: ${h.eur(m18(h), 2)} per teenager.` },
      { q: 'My daughter is at lycée and has a summer job: could we lose the allowance?', a: `Only if she earns a lot. For a pupil who works, service-public.fr (sheet F16947) looks at pay over six months, 1 April to 30 September, divides the total by six, and compares it with 55% of the minimum wage. Two summer months at €1,219 each work out at about €403 a month over the period: the sheet concludes that benefits continue.` },
      { q: 'My child turned 18 in September 2026: too old for the allowance?', a: `Not necessarily. Autumn 2026 covers children born on or after ${h.date(h.P.ars.naissance_min)}. A young person born on 20 September 2008 still qualifies if at lycée or an apprentice under the pay ceiling, for ${h.eur(m18(h), 2)}. Born on 10 September 2008, they are excluded, even if sitting the baccalauréat the following June.` },
      { q: 'My son left school in June: will the CAF still pay the allowance?', a: `No. The condition is being at school, enrolled with Cned (the state distance-learning service) or in an apprenticeship at the start of the 2026 school year. A young person who leaves all education no longer brings the ${h.eur(m18(h), 2)}. The mid-July declaration that service-public.fr requires for 16 to 18-year-olds must therefore state the real situation: no school, no apprenticeship, no allowance for that teenager.` },
      { q: 'My teenager studies through Cned: does the CAF pay the back-to-school allowance?', a: `Yes. Service-public.fr sheet F1878 treats enrolment with Cned, the national distance-learning centre, as schooling: the ${h.eur(m18(h), 2)} allowance is due for a 15 to 18-year-old enrolled there, within the household income ceiling. Home education without Cned enrolment gives no entitlement. For those aged 16 and over, the mid-July declaration is still required.` },
    ],
    body: (h) => `
<h2>Why 16 to 18-year-olds need an extra step</h2>
<p>For a child under 16, the CAF asks nothing of families already on its books: the allowance is paid without any step, as long as income has been declared. After 16, nothing is automatic. A teenager may stay at lycée (upper secondary school), start an apprenticeship, look for work or drop out. ${h.src('spArs', 'Service-public.fr sheet F1878')} therefore asks parents to declare, from mid-July, that the young person will still be at school or in an apprenticeship when term begins.</p>
<p>For autumn 2026, this applies to young people born between ${h.date(h.P.ars.naissance_min)} and 31 December 2010. It is done on the CAF website, or on the MSA site for families in the farming scheme. The declaration covers each teenager separately: in a family with a 14-year-old and a 17-year-old, the younger child’s allowance arrives on its own, while the older one’s waits for the parents to confirm lycée or apprenticeship. Families who are new to the CAF follow a different route: they send a statement of their situation and a declaration of ${h.P.ars.revenus_reference} income before anything can be paid.</p>

<h2>The apprentice pay ceiling</h2>
<p>An apprentice earns a wage. As long as it stays modest, they remain a dependent child for their parents. The threshold, given in service-public.fr sheet F16947 (checked 1 June 2026), is ${h.eur(plafondJeune(h), 2)} net a month: 55% of the gross hourly Smic of ${h.eur(h.P.smic.horaire_brut, 2)} over 169 hours, from the ${h.src('spSmic', 'service-public.fr minimum wage sheet')}. For an apprentice the test is monthly: if one month goes over, benefit entitlement is lost for that month.</p>
${h.table(['Apprentice net pay', 'Still dependent?', 'Allowance 2026 (household under ceiling)'], [900, 1100, plafondJeune(h), 1300].map((s) => [h.eur(s, s % 1 ? 2 : 0), s <= plafondJeune(h) ? 'yes' : 'no', h.eur(s <= plafondJeune(h) ? m18(h) : 0, 2)]), 'Apprentice aged 17, autumn 2026 (estimate)', ['l', 'l', 'r'])}
<p>Crossing the line is costly: ${h.eur(m18(h), 2)} at once, with no tapering on the pay side. Only the parents’ income ceiling has a transition band, described on the ${h.a('ars-differentielle', 'differential allowance')} page.</p>
<!--mini:arsLyceenApprenti-->

<h2>A pupil with a job: the six-month average</h2>
<p>For a young person still at school who works on the side, the rule is gentler. Earnings are added up over six-month periods, 1 October to 31 March and 1 April to 30 September, then divided by six, so a well-paid summer job is smoothed out. Sheet F16947 gives the case of a teenager paid €1,219 net in July and in August: averaged over April to September, that comes to about €403 a month, below the ceiling, and family benefits continue.</p>

<h2>Example: a single mother and her apprentice son</h2>
<p>Claire is bringing up Hugo, 17, alone; he is doing a CAP (a vocational qualification) as an apprentice. She declared €24,000 of net taxable income for ${h.P.ars.revenus_reference}, below the one-child ceiling of ${h.eur(h.P.ars.plafonds.un)}. Hugo earns €950 net a month. He stays dependent, Claire declares the apprenticeship in July and receives ${h.eur(mere(h, 24000).total, 2)}. If Hugo’s pay rose above ${h.eur(plafondJeune(h), 2)} at the start of term, the allowance for him would disappear, whatever his mother earns.</p>
<p>Conversely, had Claire declared ${h.eur(h.P.ars.plafonds.un + 200)}, she would be €200 over her own ceiling and receive ${h.eur(mere(h, h.P.ars.plafonds.un + 200).total, 2)} under the differential rule. The two tests are separate: the young person’s pay on one side, the household’s 2024 income on the other.</p>

<h2>After 18</h2>
<p>The allowance ends with the 15 to 18 band. The young person can remain dependent for other benefits: family allowances up to 20 and, in families of three or more children, the ${h.a('allocation-forfaitaire-20-ans', 'flat-rate allowance at 20')}. Amounts for every age band are on the ${h.a('ars-montant-age', 'allowance by age')} page, and the ${h.a('simulateur-ars', 'back-to-school allowance calculator')} adds up the total for all your children.</p>
`,
  },
});
