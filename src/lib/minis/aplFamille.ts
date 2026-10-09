import { apl } from '../engine/logement';
import { T, eur, type L } from './_kit';
/** Composition : valeur = nombre d'enfants, + 10 pour un parent seul. Zone 2 fixée. */
export default (l: L) => ({
  title: T(l, 'L’APL de votre famille en zone 2', 'Your family’s housing aid in zone 2'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'c', label: T(l, 'Composition du foyer', 'Household'), def: 2, options: [1, 2, 3, 4, 11, 12, 13, 14].map((v) => ({ value: String(v), label: v > 10 ? T(l, `Parent seul, ${v - 10} enfant${v > 11 ? 's' : ''}`, `Single parent, ${v - 10} child${v > 11 ? 'ren' : ''}`) : T(l, `Couple, ${v} enfant${v > 1 ? 's' : ''}`, `Couple, ${v} child${v > 1 ? 'ren' : ''}`) })) },
    { id: 'r', label: T(l, 'Revenus nets imposables du foyer sur 12 mois', 'Household taxable net income over 12 months'), def: 24000, unit: '€', max: 200000 },
    { id: 'lo', label: T(l, 'Loyer hors charges', 'Rent excluding charges'), def: 800, unit: '€', max: 5000 },
  ],
  run: ({ c, r, lo }: Record<string, number>) => {
    const v = c || 2;
    const a = apl({ zone: 2, couple: v < 10, enfants: v % 10, loyer: lo, revenusAnnuels: r });
    return { head: [T(l, 'APL estimée par mois', 'Estimated aid per month'), eur(a.aide, l)],
      rows: [[T(l, 'Loyer plafond pour ces enfants', 'Rent ceiling for these children'), eur(a.plafond, l, 2)], [T(l, 'Forfait charges', 'Charges allowance'), eur(a.charges, l, 2)], [T(l, 'Abattement R0 annuel', 'Yearly R0 allowance'), eur(a.r0, l)]] as [string, string][],
      note: T(l, 'Barème du 1er octobre 2026, zone 2 (grandes agglomérations). Estimation, la CAF calcule le droit.', 'Scale of 1 October 2026, zone 2 (large cities). Estimate; the CAF decides the entitlement.') };
  },
});
