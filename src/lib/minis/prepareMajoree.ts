import { prepare } from '../engine/famille';
import { T, eur, type L } from './_kit';
/** PreParE majorée (3 enfants et plus, arrêt total) face à la PreParE à taux plein ; choix définitif (fiche F32485). */
export default (l: L) => ({
  title: T(l, 'PreParE majorée ou PreParE classique ?', 'Higher-rate or standard PreParE?'),
  cta: T(l, 'Simulateur PreParE complet', 'Full parental leave benefit calculator'),
  inputs: [
    { id: 'c', label: T(l, 'Situation', 'Household'), def: 1, options: [T(l, 'Parent isolé', 'Single parent'), T(l, 'En couple', 'Couple')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'm', label: T(l, 'Mois de congé maternité indemnisés à déduire', 'Months of paid maternity leave to deduct'), def: 2, max: 12 },
  ],
  run: ({ c, m }: Record<string, number>) => {
    const couple = c === 1, d = Math.max(0, Math.floor(m || 0));
    const maj = prepare({ mode: 'plein', enfants: 3, couple, majoree: true });
    const std = prepare({ mode: 'plein', enfants: 3, couple });
    const dMaj = Math.max(0, maj.dureeMois - d), dStd = couple ? Math.max(0, std.dureeMois - d) : std.dureeMois;
    return {
      head: [T(l, 'Total PreParE majorée', 'Higher-rate PreParE total'), eur(maj.mensuel * dMaj, l)] as [string, string],
      rows: [
        [T(l, 'Majorée', 'Higher rate'), T(l, `${eur(maj.mensuel, l, 2)} × ${dMaj} mois`, `${eur(maj.mensuel, l, 2)} × ${dMaj} months`)],
        [T(l, 'Classique à taux plein', 'Standard full rate'), T(l, `${eur(std.mensuel, l, 2)} × ${dStd} mois`, `${eur(std.mensuel, l, 2)} × ${dStd} months`)],
        [T(l, 'Total PreParE classique', 'Standard PreParE total'), eur(std.mensuel * dStd, l)],
      ] as [string, string][],
      note: T(l, 'Trois enfants à charge ou plus, arrêt total d’activité. Le choix est définitif. Estimation.', 'Three or more dependent children, work stopped completely. The choice is final. Estimate only.'),
    };
  },
});
