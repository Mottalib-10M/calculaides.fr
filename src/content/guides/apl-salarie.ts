import { defineGuide, type Helpers } from '../../lib/guide-types';

type Z = 1 | 2 | 3;
/** Salarié seul, sans enfant, non étudiant. */
const base = (zone: Z, loyer: number) => ({ zone, couple: false, enfants: 0, loyer });
const aide = (h: Helpers, zone: Z, loyer: number, revenusAnnuels: number) => h.M.apl({ ...base(zone, loyer), revenusAnnuels }).aide;
const seuil = (h: Helpers, zone: Z, loyer: number) => h.M.seuilSortieApl(base(zone, loyer));
/** Smic net à temps plein sur douze mois (net versé, pas net imposable). */
const smicAn = (h: Helpers) => h.P.smic.mensuel_net * 12;

export default defineGuide({
  id: 'apl-salarie',
  group: 'logement',
  order: 60,
  mini: 'aplSalarie',
  related: ['simulateur-apl', 'apl-ressources', 'apl-calcul', 'apl-zone-1', 'simulateur-prime-activite'],
  sources: ['spApl', 'arreteApl2026', 'spSmic', 'arreteR0'],
  fr: {
    slug: 'apl-salarie',
    nav: 'APL salarié',
    card: 'Le salaire à partir duquel un salarié seul ne touche plus d’aide au logement, ville par ville.',
    title: 'APL salarié 2026 : jusqu’à quel salaire on la touche seul',
    description: 'APL salarié 2026 : seul en zone 1 avec un loyer de 500 €, l’aide s’arrête vers 17 500 € nets imposables par an. Seuils par zone, effet d’une hausse de salaire.',
    h1: 'APL d’un salarié seul : le salaire où l’aide s’arrête',
    intro: 'Pour une personne seule qui travaille, l’aide au logement fond vite avec le salaire : tout se joue sur quelques milliers d’euros par an.',
    resume: (h) => `Un salarié seul, sans enfant, qui loue 500 € hors charges en zone 1 cesse de toucher l’APL vers ${h.eur(seuil(h, 1, 500))} de salaire net imposable sur les douze derniers mois, au barème du 1er octobre 2026. Le seuil tombe à ${h.eur(seuil(h, 2, 500))} en zone 2 et à ${h.eur(seuil(h, 3, 500))} en zone 3, parce que le loyer plafond y est plus bas. Avec 15 000 € par an, ce même salarié reçoit encore ${h.eur(aide(h, 1, 500, 15000))} par mois en zone 1, ${h.eur(aide(h, 2, 500, 15000))} en zone 2 et ${h.eur(aide(h, 3, 500, 15000))} en zone 3. Chaque millier d’euros gagné en plus enlève environ ${h.eur(h.M.apl({ ...base(1, 500), revenusAnnuels: 15000 }).tp * 900)} d’aide mensuelle. Pour repère, le Smic net à temps plein représente ${h.eur(smicAn(h))} versés sur un an, et le net imposable est un peu plus élevé : un salarié seul payé au Smic à plein temps se trouve donc au bord de la sortie, ou déjà au-delà. Estimation indicative : la CAF calcule seule le droit.`,
    faqs: (h) => [
      { q: 'Je suis payé au Smic à temps plein et je vis seul, ai-je encore droit à l’APL ?', a: `C’est limite. Le Smic net versé représente ${h.eur(smicAn(h))} sur douze mois, et votre net imposable est un peu supérieur. Or l’aide d’une personne seule s’arrête vers ${h.eur(seuil(h, 1, 500))} en zone 1 pour 500 € de loyer, et plus tôt en zones 2 et 3. Selon la ville, vous toucherez quelques dizaines d’euros ou rien. Faites le test avec votre cumul net imposable.` },
      { q: 'Un loyer plus cher repousse-t-il le salaire où l’APL s’arrête ?', a: `Seulement tant que le loyer reste sous le plafond. En zone 1, passer de 300 € à 500 € de loyer déplace le seuil de ${h.eur(seuil(h, 1, 300))} à ${h.eur(seuil(h, 1, 500))}. Au-delà de ${h.eur(h.M.loyerPlafond(1, false, 0), 2)}, plafond d’une personne seule, la CAF ne retient plus rien de plus : 500 € ou 650 € donnent le même seuil.` },
      { q: 'J’ai été augmenté en janvier, quand mon APL va-t-elle baisser ?', a: `Progressivement, à partir de l’actualisation trimestrielle suivante. La CAF prend les revenus des 12 derniers mois : chaque trimestre, trois mois de l’ancien salaire sont remplacés par trois mois du nouveau. Il faut donc environ un an pour que l’aide corresponde entièrement au nouveau salaire. Aucune déclaration n’est à faire, les revenus sont récupérés automatiquement selon service-public.` },
      { q: 'Est-ce que je perds la prime d’activité en même temps que l’APL ?', a: `Non, ce sont deux aides distinctes, avec des seuils différents. La prime d’activité suit vos revenus du trimestre précédent et peut continuer bien après la fin de l’aide au logement. Un salarié seul qui dépasse ${h.eur(seuil(h, 2, 500))} par an en zone 2 ne touche plus d’APL, mais peut garder une prime. Notre simulateur de prime d’activité donne le montant.` },
      { q: 'Faut-il donner son salaire brut ou net à la CAF pour l’APL ?', a: `Ni l’un ni l’autre exactement : la base est le revenu net imposable, celui de la ligne dédiée du bulletin de paie et de la déclaration de revenus. La CAF le récupère elle-même, puis applique un abattement de ${h.pct(h.P.apl.abattement_frais_pro, 0)} pour frais professionnels. Saisir le brut dans un simulateur sous-estime l’aide, saisir le net versé la surestime légèrement.` },
    ],
    body: (h) => `
<h2>Le seuil de sortie selon la ville et le loyer</h2>
<p>Pour un salarié seul, la vraie question n’est pas « combien » mais « jusqu’où ». Le tableau donne, pour trois loyers, le salaire net imposable annuel au-delà duquel l’aide estimée passe sous ${h.eur(h.P.apl.seuil_versement)} et n’est plus versée.</p>
${h.table(['Loyer hors charges', 'Zone 1', 'Zone 2', 'Zone 3'], [250, 350, 500].map((l) => [h.eur(l), h.eur(seuil(h, 1, l)), h.eur(seuil(h, 2, l)), h.eur(seuil(h, 3, l))]), 'Salaire net imposable annuel où l’APL s’arrête, personne seule, barème du 1er octobre 2026 (estimation)', ['l', 'r', 'r', 'r'])}
<p>Deux lectures. Entre zones, l’écart reste modeste, de l’ordre de ${h.eur(seuil(h, 1, 500) - seuil(h, 3, 500))} par an pour un loyer de 500 € : le plafond de zone 1 est plus haut, mais pas de beaucoup. Entre loyers, l’effet disparaît dès que le loyer dépasse le plafond : à partir de là, payer plus cher ne donne droit à rien de plus. Les plafonds d’octobre 2026 figurent dans l’${h.src('arreteApl2026', 'arrêté du 28 septembre 2026')}.</p>
<!--mini:aplSalarie-->

<h2>Le Smic comme repère, sans se tromper de net</h2>
<p>Le ${h.src('spSmic', 'Smic')} mensuel s’élève à ${h.eur(h.P.smic.mensuel_brut, 2)} brut et ${h.eur(h.P.smic.mensuel_net, 2)} net en 2026, soit ${h.eur(smicAn(h))} nets versés sur douze mois. Ce net versé n’est pas la base de l’APL : la CAF retient le net imposable, qui réintègre une partie des prélèvements sociaux et dépasse donc un peu le net perçu. Nous ne convertissons pas l’un en l’autre ici, parce que l’écart dépend de la mutuelle, des heures supplémentaires et d’autres lignes du bulletin.</p>
<p>Ce qui est sûr : à temps plein au Smic, une personne seule est déjà près du seuil de sortie, voire au-delà en zone 3. À temps partiel, l’aide reste nette. Avec 9 000 € nets imposables par an, par exemple un mi-temps payé un peu au-dessus du Smic, l’estimation atteint ${h.eur(aide(h, 1, 500, 9000))} par mois en zone 1 et ${h.eur(aide(h, 3, 500, 9000))} en zone 3.</p>

<h2>Ce qu’une augmentation fait à l’aide</h2>
<p>Une fois passé l’abattement R0 de ${h.eur(h.M.r0(false, 0))} prévu par l’${h.src('arreteR0', 'arrêté de 2019')}, chaque euro de ressources retenues réduit l’aide d’un pourcentage fixe, environ ${h.pct(h.M.apl({ ...base(1, 500), revenusAnnuels: 15000 }).tp, 2)} pour un loyer au plafond. Après l’abattement de ${h.pct(h.P.apl.abattement_frais_pro, 0)}, une augmentation de 100 € nets imposables par mois, soit 1 200 € sur l’année, retire de l’ordre de ${h.eur(h.M.apl({ ...base(1, 500), revenusAnnuels: 15000 }).tp * 1080)} d’APL mensuelle. Le gain de salaire reste donc largement supérieur à la perte d’aide.</p>
${h.table(['Salaire net imposable annuel', 'Zone 1', 'Zone 2', 'Zone 3'], [6000, 10000, 14000, 16000].map((r) => [h.eur(r), h.eur(aide(h, 1, 500, r)), h.eur(aide(h, 2, 500, r)), h.eur(aide(h, 3, 500, r))]), 'APL mensuelle estimée, personne seule, loyer 500 € hors charges', ['l', 'r', 'r', 'r'])}
<p>La baisse n’est pas immédiate. Les ressources sont celles des douze derniers mois, actualisées chaque trimestre selon ${h.src('spApl', 'service-public')} : une hausse de salaire mord sur l’aide par quarts successifs. Le détail de cette fenêtre glissante est sur la page ${h.a('apl-ressources', 'ressources retenues pour l’APL')}.</p>

<h2>Premier emploi, nouveau logement : les délais à prévoir</h2>
<p>Un jeune salarié qui signe son premier bail ne touche rien le mois de son arrivée. Selon ${h.src('spApl', 'la fiche officielle')}, le droit s’ouvre le mois qui suit la demande et le paiement intervient le 5 de chaque mois : pour une entrée dans les lieux le 15 octobre, le droit commence en novembre et le premier versement arrive le 5 décembre. L’aide va en général directement au bailleur, qui la déduit du loyer ; la quittance baisse d’autant. Une hausse de loyer en cours d’année n’est pas répercutée tout de suite : l’aide est réévaluée au 1er janvier suivant, sur la base du loyer de juillet. Mieux vaut donc déposer la demande dès la signature du bail, même si le salaire semble proche du seuil.</p>

<h2>Les situations qui changent la donne</h2>
<p>Un salarié qui emménage en couple change de barème : plafond, R0 et taux familial sont différents, et les deux salaires s’additionnent. Un salarié qui a des enfants à charge bénéficie d’un plafond plus haut et d’un R0 plus large. Un étudiant qui travaille relève d’une règle à part, avec un forfait de ressources minimal. Si votre loyer est très au-dessus du plafond parisien, la dégressivité peut réduire l’aide avant même le seuil de revenus : voir ${h.a('apl-zone-1', 'l’APL en zone 1')}.</p>
<p>Enfin, quitter l’APL n’est pas quitter toutes les aides. La prime d’activité suit d’autres règles et reste souvent due à un salarié seul bien au-delà du seuil d’APL : le ${h.a('simulateur-prime-activite', 'simulateur de prime d’activité')} le vérifie. Pour l’aide au logement avec votre situation exacte, utilisez le ${h.a('simulateur-apl', 'simulateur APL')} ; la décision finale revient à la CAF.</p>
`,
  },
  en: {
    slug: 'housing-aid-for-employees',
    nav: 'APL for employees',
    card: 'The pay level at which a single employee stops getting housing aid, city by city.',
    title: 'APL for Employees 2026: Pay Limit for Single Workers',
    description: 'APL for employees in 2026: living alone in zone 1 on €500 rent, housing aid stops at about €17,500 of taxable net pay a year. Limits by zone, effect of a raise.',
    h1: 'Housing aid for a single employee: the pay level where it stops',
    intro: 'For a single person in work, French housing aid melts quickly as pay rises: everything happens within a few thousand euros a year.',
    resume: (h) => `A single employee with no children renting for €500 excluding charges in zone 1 (Paris and its inner suburbs) stops receiving APL at around ${h.eur(seuil(h, 1, 500))} of taxable net pay over the last twelve months, on the scale in force since 1 October 2026. APL is the housing benefit paid by the CAF, France's family allowance fund. The limit falls to ${h.eur(seuil(h, 2, 500))} in zone 2 (large cities) and ${h.eur(seuil(h, 3, 500))} in zone 3 (the rest of France), because the rent ceiling there is lower. On €15,000 a year, the same employee still gets ${h.eur(aide(h, 1, 500, 15000))} a month in zone 1, ${h.eur(aide(h, 2, 500, 15000))} in zone 2 and ${h.eur(aide(h, 3, 500, 15000))} in zone 3. Each extra thousand euros earned removes about ${h.eur(h.M.apl({ ...base(1, 500), revenusAnnuels: 15000 }).tp * 900)} of monthly aid. For reference, the full-time minimum wage (Smic) pays ${h.eur(smicAn(h))} net over a year, and taxable net pay is slightly higher: a single full-time minimum-wage worker is right at the edge, or past it. This is an estimate; only the CAF decides.`,
    faqs: (h) => [
      { q: 'I earn the full-time minimum wage and live alone, can I still get APL?', a: `It is borderline. The net minimum wage (Smic) comes to ${h.eur(smicAn(h))} paid over twelve months, and your taxable net pay is slightly higher. A single person's aid stops at around ${h.eur(seuil(h, 1, 500))} in zone 1 for €500 rent, and earlier in zones 2 and 3. Depending on the city you may get a few tens of euros or nothing. Test it with the cumulative taxable figure on your payslip.` },
      { q: 'Does a higher rent raise the pay level where housing aid stops?', a: `Only while the rent stays under the ceiling. In zone 1, going from €300 to €500 rent moves the limit from ${h.eur(seuil(h, 1, 300))} to ${h.eur(seuil(h, 1, 500))}. Above ${h.eur(h.M.loyerPlafond(1, false, 0), 2)}, the single-person ceiling, the CAF counts nothing extra: €500 or €650 give the same limit.` },
      { q: 'I got a pay rise in January, when will my housing aid drop?', a: `Gradually, from the next quarterly review. The CAF uses income from the last 12 months, so each quarter three months of old pay are replaced by three months of new pay. It takes about a year for the aid to match your new salary fully. You have nothing to declare, as income is collected automatically according to service-public.fr.` },
      { q: 'Will I lose the activity bonus when my housing aid stops?', a: `No, they are separate benefits with different limits. The activity bonus (prime d'activité, a top-up for low earners) follows your income from the previous quarter and can continue well after housing aid ends. A single employee above ${h.eur(seuil(h, 2, 500))} a year in zone 2 gets no APL but may keep a bonus. Our activity bonus calculator gives the amount.` },
      { q: 'Should I give the CAF my gross or net salary for housing aid?', a: `Neither exactly: the base is taxable net pay (net imposable), shown on its own line on the payslip and on the tax return. The CAF collects it itself, then applies a ${h.pct(h.P.apl.abattement_frais_pro, 0)} allowance for work expenses. Entering gross pay in a calculator underestimates the aid; entering net take-home pay slightly overestimates it.` },
    ],
    body: (h) => `
<h2>The cut-off by city and rent</h2>
<p>For a single employee, the real question is not "how much" but "up to where". The table gives, for three rent levels, the yearly taxable net pay above which estimated aid falls below ${h.eur(h.P.apl.seuil_versement)} and is no longer paid.</p>
${h.table(['Rent excluding charges', 'Zone 1', 'Zone 2', 'Zone 3'], [250, 350, 500].map((l) => [h.eur(l), h.eur(seuil(h, 1, l)), h.eur(seuil(h, 2, l)), h.eur(seuil(h, 3, l))]), 'Yearly taxable net pay where APL stops, single person, scale of 1 October 2026 (estimate)', ['l', 'r', 'r', 'r'])}
<p>Two readings. Between zones, the gap is modest, around ${h.eur(seuil(h, 1, 500) - seuil(h, 3, 500))} a year for €500 rent: the zone 1 ceiling is higher, but not by much. Between rents, the effect vanishes once rent exceeds the ceiling, after which paying more earns nothing extra. The October 2026 ceilings are set by the ${h.src('arreteApl2026', 'order of 28 September 2026')}.</p>
<!--mini:aplSalarie-->

<h2>The minimum wage as a yardstick, using the right "net"</h2>
<p>The monthly ${h.src('spSmic', 'minimum wage (Smic)')} is ${h.eur(h.P.smic.mensuel_brut, 2)} gross and ${h.eur(h.P.smic.mensuel_net, 2)} net in 2026, or ${h.eur(smicAn(h))} net paid over twelve months. That take-home figure is not the APL base: the CAF uses taxable net pay, which adds back part of the social levies and so is a little above what you receive. We do not convert one into the other here, because the gap depends on your health insurance plan, overtime and other payslip lines.</p>
<p>What is certain: on a full-time minimum wage, a single person is already near the cut-off, or beyond it in zone 3. Part-time, the aid stays substantial. With €9,000 of taxable net pay a year, for instance half-time paid a little above the minimum wage, the estimate reaches ${h.eur(aide(h, 1, 500, 9000))} a month in zone 1 and ${h.eur(aide(h, 3, 500, 9000))} in zone 3.</p>

<h2>What a pay rise does to the aid</h2>
<p>Once past the R0 allowance of ${h.eur(h.M.r0(false, 0))} set by the ${h.src('arreteR0', '2019 order')}, each euro of counted income reduces the aid by a fixed percentage, about ${h.pct(h.M.apl({ ...base(1, 500), revenusAnnuels: 15000 }).tp, 2)} for a rent at the ceiling. After the ${h.pct(h.P.apl.abattement_frais_pro, 0)} allowance, a rise of €100 of taxable net pay a month, €1,200 over the year, removes roughly ${h.eur(h.M.apl({ ...base(1, 500), revenusAnnuels: 15000 }).tp * 1080)} of monthly APL. The pay gain stays far larger than the aid lost.</p>
${h.table(['Yearly taxable net pay', 'Zone 1', 'Zone 2', 'Zone 3'], [6000, 10000, 14000, 16000].map((r) => [h.eur(r), h.eur(aide(h, 1, 500, r)), h.eur(aide(h, 2, 500, r)), h.eur(aide(h, 3, 500, r))]), 'Estimated monthly APL, single person, €500 rent excluding charges', ['l', 'r', 'r', 'r'])}
<p>The drop is not immediate. Income covers the last twelve months, updated every quarter according to ${h.src('spApl', 'service-public.fr')}, so a pay rise eats into the aid one quarter at a time. The sliding window is explained on the ${h.a('apl-ressources', 'income counted for housing aid')} page.</p>

<h2>First job, new home: the delays to expect</h2>
<p>A young employee signing a first lease receives nothing for the month they move in. According to ${h.src('spApl', 'the official sheet')}, entitlement starts the month after the claim and payment arrives on the 5th of each month: move in on 15 October, the right opens in November and the first payment lands on 5 December. The aid usually goes straight to the landlord, who deducts it from the rent, so your rent receipt shows a lower amount. A rent increase during the year is not passed on at once: the aid is reassessed on the following 1 January, using the July rent. It is worth applying as soon as the lease is signed, even if your pay looks close to the limit.</p>

<h2>Situations that change the picture</h2>
<p>An employee who moves in with a partner switches scale: ceiling, R0 and family rate all differ, and both salaries are added. An employee with dependent children gets a higher ceiling and a larger R0. A working student falls under a separate rule with a minimum flat-rate income. If your rent is far above the Paris ceiling, the high-rent reduction can cut the aid before the income limit is reached: see ${h.a('apl-zone-1', 'housing aid in zone 1')}.</p>
<p>Finally, leaving APL does not mean leaving every benefit. The activity bonus follows other rules and often remains payable to a single employee well past the APL cut-off: the ${h.a('simulateur-prime-activite', 'activity bonus calculator')} checks it. For housing aid in your exact situation, use the ${h.a('simulateur-apl', 'APL calculator')}; the final decision rests with the CAF.</p>
`,
  },
});
