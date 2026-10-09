import { allocationsFamiliales } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Le mois où l’aîné fête ses 20 ans', 'The month the eldest turns 20'),
  cta: T(l, 'Simulateur des allocations familiales', 'Family allowance calculator'),
  inputs: [
    { id: 'f', label: T(l, 'Enfants à charge avant ses 20 ans', 'Dependent children before the 20th birthday'), def: 3, options: [3, 4, 5, 6].map((x) => ({ value: String(x), label: String(x) })) },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024 du foyer', 'Household 2024 net income (revenu net catégoriel)'), def: 60000, unit: '€', max: 500000 },
  ],
  run: ({ f, r }: Record<string, number>) => {
    const n = f || 3;
    const avant = allocationsFamiliales({ enfants: n, majorables: 0, revenus: r }).total;
    const forfait = allocationsFamiliales({ enfants: n, majorables: 0, vingtAns: 1, revenus: r }).forfait;
    const reste = allocationsFamiliales({ enfants: n - 1, majorables: 0, revenus: r }).total;
    return { head: [T(l, 'Allocation forfaitaire par mois', 'Flat-rate allowance per month'), eur(forfait, l, 2)],
      rows: [[T(l, `Allocations avant, ${n} enfants`, `Allowance before, ${n} children`), eur(avant, l, 2)], [T(l, `Allocations après, ${n - 1} enfants`, `Allowance after, ${n - 1} children`), eur(reste, l, 2)], [T(l, 'Total après, forfait compris', 'Total after, flat rate included'), eur(reste + forfait, l, 2)], [T(l, 'Forfait sur un an', 'Flat rate over one year'), eur(forfait * 12, l, 2)]] as [string, string][],
      note: T(l, 'Hors majorations pour âge. Le forfait suppose que le jeune vit encore au foyer et gagne peu.', 'Before age supplements. The flat rate assumes the young adult still lives at home and earns little.') };
  },
});
