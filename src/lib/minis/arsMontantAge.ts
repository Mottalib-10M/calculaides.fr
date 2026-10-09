import { ars } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'L’ARS de vos enfants, tranche par tranche', 'Your children’s allowance, age band by age band'),
  cta: T(l, 'Simulateur ARS complet', 'Full back-to-school allowance calculator'),
  inputs: [
    { id: 'a', label: T(l, 'Enfants de 6 à 10 ans', 'Children aged 6 to 10'), def: 1, max: 8 },
    { id: 'b', label: T(l, 'Enfants de 11 à 14 ans', 'Children aged 11 to 14'), def: 1, max: 8 },
    { id: 'c', label: T(l, 'Enfants de 15 à 18 ans', 'Children aged 15 to 18'), def: 0, max: 8 },
  ],
  run: ({ a, b, c }: Record<string, number>) => {
    const k = (v: number) => Math.max(0, Math.floor(v || 0));
    const one = (x: number, y: number, z: number) => ars({ c6_10: x, c11_14: y, c15_18: z, revenus: 0 }).plein;
    const tot = ars({ c6_10: k(a), c11_14: k(b), c15_18: k(c), revenus: 0 });
    return {
      head: [T(l, 'ARS totale, sous le plafond', 'Total allowance, below the ceiling'), eur(tot.plein, l, 2)] as [string, string],
      rows: [
        [T(l, '6 à 10 ans', 'Aged 6 to 10'), eur(one(k(a), 0, 0), l, 2)],
        [T(l, '11 à 14 ans', 'Aged 11 to 14'), eur(one(0, k(b), 0), l, 2)],
        [T(l, '15 à 18 ans', 'Aged 15 to 18'), eur(one(0, 0, k(c)), l, 2)],
      ] as [string, string][],
      note: T(l, 'Montants nets de CRDS de la rentrée 2026, si les revenus 2024 du foyer restent sous le plafond.', 'Autumn 2026 amounts, net of CRDS, assuming 2024 household income stays below the ceiling.'),
    };
  },
});
