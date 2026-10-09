import { apl, seuilSortieApl } from '../engine/logement';
import { T, eur, type L } from './_kit';
/** Zone 2 : familles, plafond qui monte avec chaque enfant. */
export default (l: L) => ({
  title: T(l, 'L’APL d’une famille en zone 2', 'A family’s housing aid in zone 2'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'n', label: T(l, 'Enfants à charge', 'Dependent children'), def: 2, options: ['1', '2', '3', '4', '5'].map((x) => ({ value: x, label: x })) },
    { id: 'r', label: T(l, 'Revenus nets imposables du foyer sur 12 mois', 'Household taxable net income over 12 months'), def: 24000, unit: '€', max: 150000 },
    { id: 'l', label: T(l, 'Loyer hors charges', 'Rent excluding charges'), def: 700, unit: '€', max: 4000 },
  ],
  run: ({ n, r: rev, l: loyer }: Record<string, number>) => {
    const enfants = Math.max(1, n || 1);
    const base = { zone: 2 as const, couple: true, enfants, loyer };
    const x = apl({ ...base, revenusAnnuels: rev });
    return {
      head: [T(l, 'APL estimée par mois', 'Estimated aid per month'), eur(x.aide, l)] as [string, string],
      rows: [
        [T(l, 'Loyer plafond pour ce foyer', 'Rent ceiling for this household'), eur(x.plafond, l)],
        [T(l, 'Forfait charges', 'Service-charge allowance'), eur(x.charges, l)],
        [T(l, 'Aide nulle au-delà de (revenus annuels)', 'Aid stops above (yearly income)'), eur(seuilSortieApl(base), l)],
      ] as [string, string][],
      note: T(l, 'Même résultat pour un parent seul ou un couple avec le même nombre d’enfants et les mêmes ressources. Estimation ; seule la CAF calcule le droit.', 'Same result for a lone parent or a couple with the same number of children and the same income. Estimate; only the CAF sets the entitlement.'),
    };
  },
});
