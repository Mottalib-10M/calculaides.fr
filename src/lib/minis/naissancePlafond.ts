import { paje } from '../engine/famille';
import { T, eur, type L } from './_kit';
/** Situation : 0 couple à un revenu, 1 couple à deux revenus, 2 parent isolé (même barème que deux revenus, fiche F2550). */
export default (l: L) => ({
  title: T(l, 'Prime de naissance : êtes-vous sous le plafond ?', 'Birth grant: are you under the ceiling?'),
  cta: T(l, 'Simulateur prime de naissance', 'Birth grant calculator'),
  inputs: [
    { id: 's', label: T(l, 'Situation du foyer', 'Household'), def: 0, options: [T(l, 'Couple, un seul revenu', 'Couple, one income'), T(l, 'Couple, deux revenus', 'Couple, two incomes'), T(l, 'Parent isolé', 'Single parent')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'n', label: T(l, 'Enfants à charge, bébé à naître compris', 'Dependent children, unborn baby included'), def: 1, max: 10 },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024', 'Net taxable income for 2024'), def: 36000, unit: '€', max: 300000 },
  ],
  run: ({ s, n, r }: Record<string, number>) => {
    const x = paje({ enfants: Math.max(1, Math.floor(n || 1)), deuxRevenus: s >= 1, revenus: r });
    const marge = x.plafond - r;
    return {
      head: [T(l, 'Prime à la naissance', 'Birth grant'), eur(x.prime, l, 2)] as [string, string],
      rows: [
        [T(l, 'Plafond applicable', 'Applicable ceiling'), eur(x.plafond, l)],
        [marge >= 0 ? T(l, 'Marge restante', 'Room left') : T(l, 'Dépassement', 'Amount over'), eur(Math.abs(marge), l)],
        [T(l, 'Barème lu', 'Scale used'), s >= 1 ? T(l, 'deux revenus ou parent isolé', 'two incomes or single parent') : T(l, 'un seul revenu', 'one income')],
      ] as [string, string][],
      note: T(l, 'Pas de montant réduit : un euro au-dessus du plafond et la prime n’est pas due. Estimation, la CAF décide.', 'No reduced rate: one euro over the ceiling and no grant is due. Estimate only; the CAF decides.'),
    };
  },
});
