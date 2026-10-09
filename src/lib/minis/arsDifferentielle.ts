import { ars } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Dépassement du plafond : ce qui reste d’ARS', 'Over the ceiling: what is left of the allowance'),
  cta: T(l, 'Simulateur ARS complet', 'Full back-to-school allowance calculator'),
  inputs: [
    { id: 'n', label: T(l, 'Enfants de 6 à 18 ans scolarisés', 'School pupils aged 6 to 18'), def: 1, max: 8 },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024', 'Net taxable income for 2024'), def: 29100, unit: '€', max: 300000 },
  ],
  run: ({ n, r }: Record<string, number>) => {
    const k = Math.max(1, Math.floor(n || 1));
    const x = ars({ c6_10: 0, c11_14: 0, c15_18: k, revenus: r });
    const depasse = Math.max(0, r - x.plafond);
    return {
      head: [T(l, 'ARS versée (enfants de 15 à 18 ans)', 'Allowance paid (children aged 15 to 18)'), eur(x.total, l, 2)] as [string, string],
      rows: [
        [T(l, 'Montant plein', 'Full amount'), eur(x.plein, l, 2)],
        [T(l, 'Plafond du foyer', 'Household ceiling'), eur(x.plafond, l)],
        [T(l, 'Dépassement retiré', 'Excess deducted'), eur(depasse, l)],
        [T(l, 'Plus rien au-delà de', 'Nothing left above'), eur(x.plafond + x.plein, l)],
      ] as [string, string][],
      note: T(l, 'Allocation différentielle : montant plein moins le dépassement. Estimation à vérifier auprès de la CAF.', 'Differential allowance: full amount minus the excess. An estimate to check with the CAF.'),
    };
  },
});
