import { allocationsFamiliales } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Allocations familiales pour deux enfants', 'Family allowance for two children'),
  cta: T(l, 'Simulateur des allocations familiales', 'Family allowance calculator'),
  inputs: [
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024 du foyer', 'Household 2024 net income (revenu net catégoriel)'), def: 45000, unit: '€', max: 500000 },
    { id: 'c', label: T(l, 'Le cadet est né avant le 1er mars 2012', 'The younger child was born before 1 March 2012'), def: 0, options: [T(l, 'Non', 'No'), T(l, 'Oui', 'Yes')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ r, c }: Record<string, number>) => {
    const a = allocationsFamiliales({ enfants: 2, majorables: c === 1 ? 2 : 0, revenus: r });
    const tr = [T(l, '1re (montant plein)', '1st (full rate)'), T(l, '2e (divisé par 2)', '2nd (halved)'), T(l, '3e (divisé par 4)', '3rd (quartered)')][a.tranche];
    return { head: [T(l, 'Allocations familiales par mois', 'Family allowance per month'), eur(a.total, l, 2)],
      rows: [[T(l, 'Tranche de revenus', 'Income band'), tr], [T(l, 'Montant de base', 'Base amount'), eur(a.base, l, 2)], [T(l, 'Majoration pour le cadet', 'Age supplement for the younger child'), eur(a.majorations, l, 2)], [T(l, 'Complément dégressif', 'Tapering top-up'), eur(a.complement, l, 2)]] as [string, string][],
      note: T(l, 'Dans une famille de deux enfants, l’aîné n’ouvre jamais droit à la majoration pour âge.', 'In a two-child family, the elder child never triggers the age supplement.') };
  },
});
