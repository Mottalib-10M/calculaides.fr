import { allocationsFamiliales } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Votre complément dégressif', 'Your tapering top-up'),
  cta: T(l, 'Simulateur des allocations familiales', 'Family allowance calculator'),
  inputs: [
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 3, options: [2, 3, 4, 5].map((x) => ({ value: String(x), label: String(x) })) },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024 du foyer', 'Household 2024 net income (revenu net catégoriel)'), def: 87000, unit: '€', max: 500000 },
  ],
  run: ({ e, r }: Record<string, number>) => {
    const a = allocationsFamiliales({ enfants: e || 3, majorables: 0, revenus: r });
    const depasse = a.tranche > 0 ? eur(a.plafonds[a.tranche - 1], l) : T(l, 'aucun', 'none');
    return { head: [T(l, 'Complément dégressif par mois', 'Tapering top-up per month'), eur(a.complement, l, 2)],
      rows: [[T(l, 'Plafond dépassé', 'Ceiling exceeded'), depasse], [T(l, 'Allocations de la tranche', 'Allowance in this band'), eur(a.base, l, 2)], [T(l, 'Total versé par mois', 'Total paid per month'), eur(a.total, l, 2)]] as [string, string][],
      note: T(l, 'Le complément n’existe que si le dépassement du plafond reste inférieur à douze mois d’allocations.', 'The top-up exists only while the excess over the ceiling stays below twelve months of allowance.') };
  },
});
