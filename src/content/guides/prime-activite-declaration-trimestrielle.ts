import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Un salarié seul aux revenus irréguliers : la prime de chaque trimestre suit la moyenne du précédent. */
const seul = (h: Helpers, s: number) => h.M.primeActivite({ couple: false, enfants: 0, revenu1: s });
const moy = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length;
const ANNEE = [[1500, 1500, 1500], [600, 0, 900], [1478, 1478, 1478], [1900, 2100, 2000]];
const minimum = (h: Helpers) => h.P.pa.minimum_verse;

export default defineGuide({
  id: 'prime-activite-declaration-trimestrielle',
  group: 'activite',
  order: 90,
  mini: 'paTrimestre',
  related: ['simulateur-prime-activite', 'prime-activite-temps-partiel', 'prime-activite-celibataire', 'prime-activite-couple', 'apl-ressources'],
  sources: ['spPa', 'decretPa2026', 'cssD843'],
  fr: {
    slug: 'declaration-trimestrielle-prime-activite',
    nav: 'Déclaration trimestrielle',
    card: 'Le trimestre de référence, la déclaration préremplie, le montant fixe trois mois et les recours.',
    title: 'Déclaration trimestrielle prime d’activité 2026 : le guide',
    description: 'Déclaration trimestrielle de la prime d’activité en 2026 : préremplie depuis mars 2025, montant fixe 3 mois, rien sous 15 €, recours sous 2 mois. Simulateur.',
    h1: 'La déclaration trimestrielle de la prime d’activité',
    intro: 'Tous les trois mois, une déclaration fixe la prime des trois mois suivants : c’est elle qui explique la plupart des surprises sur le montant.',
    resume: (h) => `La prime d’activité est recalculée tous les trois mois à partir d’une déclaration trimestrielle de ressources, et son montant reste ensuite fixe pendant trois mois, même si vos revenus changent entre-temps. Depuis le 1er mars 2025, cette déclaration est préremplie : salaires, allocations chômage, pensions et indemnités journalières de tout le foyer y figurent en montant net social. Vous devez les vérifier, les valider et ajouter ce qui manque, comme une pension alimentaire. Avec le préremplissage, la CAF s’appuie sur les ressources des mois M-2 à M-4 : pour la déclaration de mars 2025, celles de novembre 2024, décembre 2024 et janvier 2025. Un salarié seul dont la moyenne trimestrielle atteint ${h.eur(1200)} reçoit environ ${h.eur(seul(h, 1200).prime)} par mois pendant les trois mois suivants. Sous ${h.eur(minimum(h))}, rien n’est versé. La prime n’est pas imposable. En cas de désaccord, le recours amiable doit être formé dans les 2 mois suivant la décision. Nos chiffres sont des ordres de grandeur ; le montant versé est celui que notifie la CAF.`,
    faqs: (h) => [
      { q: 'Sur quels mois la CAF calcule ma prime d’activité depuis le préremplissage ?', a: 'Sur les mois M-2 à M-4 par rapport au mois de la déclaration, et non plus M-1 à M-3. Service-public donne l’exemple de la déclaration de mars 2025, qui reprend les ressources de novembre 2024, décembre 2024 et janvier 2025. Ce décalage d’un mois supplémentaire allonge le délai entre un changement de salaire et son effet sur la prime.' },
      { q: 'J’ai perdu mon emploi mais ma prime d’activité ne bouge pas, est-ce normal ?', a: `Oui, dans un premier temps. Le montant notifié est fixe pendant 3 mois et ne tient pas compte des changements de ressources survenus entre-temps, selon la fiche F2882. Signalez toutefois la fin de contrat à la CAF sans attendre : un changement de situation professionnelle doit être déclaré rapidement, et la prime du trimestre suivant tiendra compte de la baisse.` },
      { q: 'Que faire si les montants préremplis de ma déclaration sont faux ?', a: `Corrigez-les avant de valider. La déclaration préremplie vous demande de consulter vos ressources, de les confirmer et de compléter celles qui manquent. Une erreur validée fausse la prime pendant trois mois. Si une décision a déjà été prise sur de mauvais chiffres, le recours amiable reste ouvert pendant 2 mois à compter de sa réception.` },
      { q: 'Comment contester un montant de prime d’activité ?', a: 'En saisissant la commission de recours amiable de votre CAF, dans un délai de 2 mois à partir de la réception de la décision contestée. Si sa réponse est défavorable, un recours contentieux est possible devant le tribunal administratif, selon service-public. Joignez les bulletins de paie du trimestre de référence et la notification reçue.' },
      { q: 'Ma prime d’activité calculée est de 12 €, vais-je la recevoir ?', a: `Non. Le montant minimal de versement est fixé à ${h.eur(minimum(h))} par mois : en dessous, la CAF ne verse rien pour le trimestre. C’est fréquent juste avant le seuil de sortie, vers ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))} de salaire pour une personne seule. Le droit reste ouvert et peut redevenir payable au trimestre suivant si vos revenus baissent.` },
      { q: 'Faut-il déclarer la prime d’activité aux impôts ?', a: `Non. La prime d’activité n’est pas imposable, rappelle la fiche F2882 de service-public. Elle ne figure pas dans le revenu à déclarer. Une personne seule qui touche ${h.eur(seul(h, 1200).prime)} par mois toute l’année perçoit ${h.eur(seul(h, 1200).prime * 12)} sans effet sur son impôt. Seuls vos salaires apparaissent dans la déclaration de revenus.` },
    ],
    body: (h) => `
<h2>Le décalage entre salaire et prime</h2>
<p>Trois mois de revenus, une moyenne, une prime fixée pour trois mois : la mécanique décrite par la ${h.src('spPa', 'fiche F2882 de service-public')} crée toujours un décalage. La notification d’attribution porte sur une période de 3 mois, et la période de référence est le trimestre qui précède. Le tableau suit un intérimaire seul sur une année.</p>
${h.table(['Trimestre de travail', 'Salaires des 3 mois', 'Moyenne', 'Prime versée au trimestre suivant'], ANNEE.map((t, i) => [`T${i + 1}`, t.map((x) => h.eur(x)).join(' / '), h.eur(moy(t)), h.eur(seul(h, moy(t)).prime)]), 'Personne seule, barème du 1er avril 2026 (estimation)', ['l', 'l', 'r', 'r'])}
<p>Le deuxième trimestre, presque sans travail, ouvre la prime la plus élevée, mais elle arrive au troisième, quand l’intérimaire a retrouvé un temps plein. Le quatrième, bien payé, coupe la prime du trimestre suivant. Avec le préremplissage sur les mois M-2 à M-4, ce décalage peut dépasser trois mois.</p>
<p>Pour se repérer, il suffit de compter à rebours. Un salaire modifié en juin 2026 entrera, selon le mois où tombe votre déclaration, dans celle d’août, de septembre ou d’octobre 2026, puis pèsera sur les trois mois de prime qui suivent. Entre la fiche de paie et l’effet sur le compte, quatre à six mois peuvent ainsi s’écouler.</p>

<!--mini:paTrimestre-->
<h2>La déclaration préremplie, ligne par ligne</h2>
<p>Depuis le 1er mars 2025, la CAF préremplit les ressources de tout le foyer : salaires, revenus de remplacement, allocations chômage, retraites, pensions, arrêts maladie. Les montants sont repris en net social, le chiffre affiché sur le bulletin de paie. Votre rôle change : vous ne calculez plus, vous contrôlez.</p>
<ol>
<li>Vérifiez que chaque employeur figure, mois par mois, avec le bon montant.</li>
<li>Ajoutez ce que la CAF ne peut pas connaître, en premier lieu une pension alimentaire reçue.</li>
<li>Validez-la : la fiche de service-public présente cette validation comme une étape à part entière, pas comme une formalité.</li>
</ol>
<p>Un mois manquant fait baisser la moyenne et gonfle la prime ; la CAF le découvre ensuite et réclame la différence. Un mois compté deux fois a l’effet inverse et vous prive d’une partie du droit.</p>

<h2>Ce qui arrive entre deux déclarations</h2>
<p>Le montant notifié ne tient pas compte des changements de ressources du trimestre en cours. Une augmentation, une baisse d’heures ou une fin de contrat ne bougent rien avant la déclaration suivante. Les changements de situation sont une autre affaire : un déménagement, une mise en couple, une séparation, une naissance ou un changement professionnel doivent être signalés rapidement à la CAF. Une séparation ouvre par exemple la ${h.a('prime-activite-parent-isole', 'majoration pour parent isolé')} dès le mois de l’événement.</p>
<p>Si vous ne remplissez plus les conditions, le versement s’arrête. Les sommes perçues à tort peuvent être récupérées par retenue sur d’autres prestations à venir : prestations familiales, allocation aux adultes handicapés, aides au logement.</p>

<h2>Le premier versement</h2>
<p>La prime est due à partir du premier jour du mois où vous déposez la demande, pas avant : chaque mois d’hésitation est perdu. Elle est versée chaque mois, à terme échu : la prime du mois de mars est payée en avril. Après la demande, la CAF instruit le dossier puis envoie une notification d’attribution pour trois mois. Les montants du barème suivent le ${h.src('decretPa2026', 'décret du 30 mars 2026')}, et la bonification individuelle, calculée sur la même moyenne trimestrielle, le ${h.src('cssD843', 'code de la sécurité sociale')}.</p>

<h2>Contester une décision</h2>
<p>Le recours commence par la commission de recours amiable de votre CAF, saisie dans les 2 mois qui suivent la réception de la décision. Votre demande doit dire ce que vous contestez et pourquoi, pièces à l’appui, typiquement les bulletins de paie du trimestre de référence. Si la commission rejette votre demande, le tribunal administratif peut être saisi. Avant toute démarche, refaire le calcul dans le ${h.a('simulateur-prime-activite', 'simulateur')} avec la moyenne exacte des trois mois retenus permet souvent de repérer l’erreur, qu’elle vienne d’un mois oublié ou d’un montant brut saisi à la place du net.</p>
`,
  },
  en: {
    slug: 'activity-bonus-quarterly-return',
    nav: 'Quarterly return',
    card: 'The reference quarter, the pre-filled return, the amount fixed for three months, and appeals.',
    title: 'Activity Bonus Quarterly Return 2026: How the DTR Works',
    description: 'Quarterly return for the French activity bonus in 2026: pre-filled since March 2025, amount fixed for 3 months, nothing paid under €15, appeal within 2 months.',
    h1: 'The activity bonus quarterly return',
    intro: 'Every three months, a return sets the bonus for the next three months: it explains most surprises about the amount.',
    resume: (h) => `The prime d’activité, the benefit for low-paid workers run by the CAF (caisse d’allocations familiales), is recalculated every three months from a quarterly declaration of resources (déclaration trimestrielle de ressources, or DTR), and the amount then stays fixed for three months, even if your income changes in the meantime. Since 1 March 2025 the return has been pre-filled: pay, unemployment benefit, pensions and sick pay for the whole household appear at the “net social” amount. You must check them, confirm them and add anything missing, such as child maintenance. With pre-filling, the CAF uses resources from months M-2 to M-4: for the March 2025 return, November 2024, December 2024 and January 2025. A single employee whose quarterly average is ${h.eur(1200)} receives about ${h.eur(seul(h, 1200).prime)} a month for the next three months. Below ${h.eur(minimum(h))}, nothing is paid. The bonus is not taxable. If you disagree, the internal appeal must be lodged within 2 months of the decision. Our figures are ballpark ones; what you are paid is what the CAF notifies.`,
    faqs: (h) => [
      { q: 'Which months does the CAF use for my activity bonus since pre-filling began?', a: 'Months M-2 to M-4 counted back from the month of the return, rather than M-1 to M-3 as before. Service-public.fr gives the example of the March 2025 return, which uses income from November 2024, December 2024 and January 2025. That extra month of delay lengthens the gap between a change in pay and its effect on the bonus.' },
      { q: 'I lost my job but my activity bonus has not changed, is that normal?', a: `Yes, at first. The notified amount is fixed for 3 months and ignores changes in resources during that time, according to sheet F2882. Still, tell the CAF about the end of your contract straight away: a change in work situation must be reported promptly, and the next quarter’s bonus will reflect the drop.` },
      { q: 'What should I do if the pre-filled figures on my return are wrong?', a: `Correct them before you confirm. The pre-filled return asks you to review your resources, confirm them and add anything missing. A wrong figure, once confirmed, distorts the bonus for three months. If a decision has already been made on wrong figures, the internal appeal stays open for 2 months from the date you receive it.` },
      { q: 'How do I challenge an activity bonus decision?', a: 'Write to your CAF’s internal appeals board (commission de recours amiable) within 2 months of receiving the decision. If it turns you down, you can bring a case before the administrative court (tribunal administratif), according to service-public.fr. Attach the payslips for the reference quarter and the decision letter you received.' },
      { q: 'My calculated activity bonus is €12, will it be paid?', a: `No. The minimum payment is set at ${h.eur(minimum(h))} a month: below that, the CAF pays nothing for the quarter. It often happens just before the exit point, around ${h.eur(h.M.seuilSortiePrime({ couple: false, enfants: 0 }))} of pay for a single person. The claim stays open and can become payable again next quarter if your income falls.` },
      { q: 'Do I need to declare the activity bonus on my tax return?', a: `No. The activity bonus is not taxable, as sheet F2882 on service-public.fr states. It is not part of the income you declare. A single person receiving ${h.eur(seul(h, 1200).prime)} a month all year gets ${h.eur(seul(h, 1200).prime * 12)} with no effect on income tax. Only your pay goes on the tax return.` },
    ],
    body: (h) => `
<h2>The lag between pay and bonus</h2>
<p>Three months of income, one average, a bonus fixed for three months: the process set out in the ${h.src('spPa', 'service-public.fr sheet F2882')} always creates a lag. The award notice covers a 3-month period, and the reference period is the previous quarter. The table follows a single agency worker over a year.</p>
${h.table(['Quarter worked', 'Pay over the 3 months', 'Average', 'Bonus paid the next quarter'], ANNEE.map((t, i) => [`Q${i + 1}`, t.map((x) => h.eur(x)).join(' / '), h.eur(moy(t)), h.eur(seul(h, moy(t)).prime)]), 'Single person, 1 April 2026 rates (estimate)', ['l', 'l', 'r', 'r'])}
<p>The second quarter, with almost no work, produces the highest bonus, but it arrives in the third, when the worker is back to full time. The fourth, well paid, switches off the following quarter’s bonus. With pre-filling based on months M-2 to M-4, the lag can run beyond three months.</p>
<p>To find your bearings, count backwards. A change in pay in June 2026 will enter the August, September or October 2026 return, depending on the month in which your return falls, and will then affect the three months of bonus that follow. Between the payslip and the effect on your bank account, four to six months can pass.</p>

<!--mini:paTrimestre-->
<h2>The pre-filled return, line by line</h2>
<p>Since 1 March 2025, the CAF has pre-filled the whole household’s resources: pay, replacement income, unemployment benefit, retirement pensions, other pensions, sick pay. Amounts are taken at the “net social” figure printed on the payslip. Your job changes: you no longer calculate, you check.</p>
<ol>
<li>Make sure every employer appears, month by month, with the right amount.</li>
<li>Add what the CAF cannot know, starting with any child maintenance you receive.</li>
<li>Confirm it: the service-public.fr sheet presents that confirmation as a step in its own right, not a formality.</li>
</ol>
<p>A missing month lowers the average and inflates the bonus; the CAF finds out later and claims back the difference. A month counted twice does the opposite and costs you part of your entitlement.</p>

<h2>What happens between two returns</h2>
<p>The notified amount ignores changes in resources during the current quarter. A pay rise, fewer hours or the end of a contract changes nothing until the next return. Changes in circumstances are different: moving home, moving in with a partner, separating, having a baby or a change in work must be reported to the CAF promptly. A separation, for example, opens the ${h.a('prime-activite-parent-isole', 'lone-parent higher rate')} from the month it happens.</p>
<p>If you no longer meet the conditions, payments stop. Money paid in error can be recovered by deductions from future benefits: family benefits, the disabled adult allowance (AAH) and housing aid.</p>

<h2>The first payment</h2>
<p>The bonus is due from the first day of the month in which you claim, not before, so every month of hesitation is lost. It is paid monthly, in arrears: March’s bonus is paid in April. After the claim, the CAF processes the file and sends an award notice for three months. The amounts follow the ${h.src('decretPa2026', 'decree of 30 March 2026')}, and the individual top-up, worked out on the same quarterly average, follows the ${h.src('cssD843', 'Social Security Code')}.</p>

<h2>Challenging a decision</h2>
<p>An appeal starts with your CAF’s internal appeals board, within 2 months of receiving the decision. Your request should say what you dispute and why, with evidence, typically the payslips for the reference quarter. If the board rejects your case, you can go to the administrative court. Before doing anything, re-running the sum in the ${h.a('simulateur-prime-activite', 'calculator')} with the exact average of the three months used often reveals the mistake, whether it is a forgotten month or a gross figure entered instead of the net one.</p>
`,
  },
});
