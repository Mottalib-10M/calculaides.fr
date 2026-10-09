import { paje } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Jumeaux, triplés : primes et allocations', 'Twins, triplets: grants and allowances'),
  cta: T(l, 'Simulateur prime de naissance', 'Birth grant calculator'),
  inputs: [
    { id: 'b', label: T(l, 'Bébés attendus', 'Babies expected'), def: 2, options: [2, 3, 4].map((x) => ({ value: String(x), label: String(x) })) },
    { id: 's', label: T(l, 'Situation du foyer', 'Household'), def: 1, options: [T(l, 'Couple, un seul revenu', 'Couple, one income'), T(l, 'Couple, deux revenus', 'Couple, two incomes'), T(l, 'Parent isolé', 'Single parent')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024', 'Net taxable income for 2024'), def: 42000, unit: '€', max: 300000 },
  ],
  run: ({ b, s, r }: Record<string, number>) => {
    const n = Math.max(2, Math.floor(b || 2));
    // Prime : plafond lu au plus prudent (un enfant à charge). Allocation de base : les bébés nés sont à charge.
    const avant = paje({ enfants: 1, deuxRevenus: s >= 1, revenus: r, naissances: n });
    const apres = paje({ enfants: n, deuxRevenus: s >= 1, revenus: r });
    return {
      head: [T(l, `Primes pour ${n} bébés`, `Grants for ${n} babies`), eur(avant.prime, l, 2)] as [string, string],
      rows: [
        [T(l, 'Prime par enfant', 'Grant per child'), eur(avant.prime / n, l, 2)],
        [T(l, 'Allocations de base par mois', 'Basic allowances per month'), eur(apres.ab * n, l, 2)],
        [T(l, 'Plafond de la prime retenu ici', 'Grant ceiling used here'), eur(avant.plafond, l)],
      ] as [string, string][],
      note: T(l, 'Prime testée au plafond le plus bas (un enfant à charge) ; une famille proche du seuil doit interroger la CAF.', 'Grant tested against the lowest ceiling (one dependent child); families near the line should ask the CAF.'),
    };
  },
});
