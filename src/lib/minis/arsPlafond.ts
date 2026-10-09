import { ars, plafondArs } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Votre plafond de ressources pour l’ARS', 'Your income ceiling for the back-to-school allowance'),
  cta: T(l, 'Simulateur ARS complet', 'Full back-to-school allowance calculator'),
  inputs: [
    { id: 'n', label: T(l, 'Enfants à charge (tous âges)', 'Dependent children (any age)'), def: 2, max: 10 },
    { id: 'e', label: T(l, 'Dont enfants de 6 à 18 ans scolarisés', 'Of whom school pupils aged 6 to 18'), def: 1, max: 10 },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024 du foyer', 'Household net taxable income for 2024'), def: 34000, unit: '€', max: 300000 },
  ],
  run: ({ n, e, r }: Record<string, number>) => {
    const enfants = Math.max(1, Math.floor(n || 1));
    const sco = Math.max(0, Math.min(Math.floor(e || 0), enfants));
    const plafond = plafondArs(enfants);
    const x = ars({ c6_10: 0, c11_14: sco, c15_18: 0, enfants, revenus: r });
    const marge = plafond - r;
    return {
      head: [T(l, 'Plafond pour votre foyer', 'Ceiling for your household'), eur(plafond, l)] as [string, string],
      rows: [
        [marge >= 0 ? T(l, 'Marge sous le plafond', 'Room below the ceiling') : T(l, 'Dépassement du plafond', 'Amount above the ceiling'), eur(Math.abs(marge), l)],
        [T(l, 'ARS estimée (enfants de 11 à 14 ans)', 'Estimated allowance (children aged 11 to 14)'), eur(x.total, l, 2)],
        [T(l, 'Calcul appliqué', 'Rule applied'), x.differentielle ? T(l, 'allocation différentielle', 'reduced (differential) allowance') : T(l, 'montant plein', 'full amount')],
      ] as [string, string][],
      note: T(l, 'Le plafond dépend de tous les enfants à charge, même ceux qui n’ont pas l’âge de l’ARS. Estimation : seule la CAF fixe le droit.', 'The ceiling counts every dependent child, including those too young for the allowance. Estimate only: the CAF decides.'),
    };
  },
});
