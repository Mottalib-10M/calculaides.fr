import { paje } from '../engine/famille';
import { T, eur, type L } from './_kit';
/** Versements de l'allocation de base : du mois qui suit la naissance au mois qui précède les 3 ans (fiche F2552). */
const MOIS_VERSES = 3 * 12 - 1;
export default (l: L) => ({
  title: T(l, 'Allocation de base : taux plein ou partiel ?', 'Basic allowance: full or partial rate?'),
  cta: T(l, 'Simulateur prime de naissance', 'Birth grant calculator'),
  inputs: [
    { id: 's', label: T(l, 'Situation du foyer', 'Household'), def: 0, options: [T(l, 'Couple, un seul revenu', 'Couple, one income'), T(l, 'Couple, deux revenus', 'Couple, two incomes'), T(l, 'Parent isolé', 'Single parent')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'n', label: T(l, 'Enfants à charge, nouveau-né compris', 'Dependent children, newborn included'), def: 1, max: 10 },
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024', 'Net taxable income for 2024'), def: 34000, unit: '€', max: 300000 },
  ],
  run: ({ s, n, r }: Record<string, number>) => {
    const x = paje({ enfants: Math.max(1, Math.floor(n || 1)), deuxRevenus: s >= 1, revenus: r });
    const taux = x.taux === 'plein' ? T(l, 'taux plein', 'full rate') : x.taux === 'partiel' ? T(l, 'taux partiel', 'partial rate') : T(l, 'pas de droit', 'no entitlement');
    return {
      head: [T(l, 'Allocation de base par mois', 'Basic allowance per month'), eur(x.ab, l, 2)] as [string, string],
      rows: [
        [T(l, 'Taux', 'Rate'), taux],
        [T(l, 'Taux plein jusqu’à', 'Full rate up to'), eur(x.plafondPlein, l)],
        [T(l, 'Taux partiel jusqu’à', 'Partial rate up to'), eur(x.plafond, l)],
        [T(l, `Total sur ${MOIS_VERSES} mois`, `Total over ${MOIS_VERSES} months`), eur(x.ab * MOIS_VERSES, l)],
      ] as [string, string][],
      note: T(l, 'Une seule allocation de base par famille à la fois, sauf naissances multiples. Estimation à confirmer par la CAF.', 'One basic allowance per family at a time, except for multiple births. An estimate for the CAF to confirm.'),
    };
  },
});
