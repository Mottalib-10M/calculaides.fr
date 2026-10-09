import { allocationsFamiliales } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ce que le troisième enfant change', 'What a third child changes'),
  cta: T(l, 'Simulateur des allocations familiales', 'Family allowance calculator'),
  inputs: [
    { id: 'r', label: T(l, 'Revenu net catégoriel 2024 du foyer', 'Household 2024 net income (revenu net catégoriel)'), def: 60000, unit: '€', max: 500000 },
    { id: 'm', label: T(l, 'Enfants nés avant le 1er mars 2012', 'Children born before 1 March 2012'), def: 0, options: [0, 1, 2, 3].map((x) => ({ value: String(x), label: String(x) })) },
  ],
  run: ({ r, m }: Record<string, number>) => {
    const trois = allocationsFamiliales({ enfants: 3, majorables: m, revenus: r });
    const deux = allocationsFamiliales({ enfants: 2, majorables: Math.min(m, 2), revenus: r });
    return { head: [T(l, 'Allocations familiales, 3 enfants', 'Family allowance, 3 children'), eur(trois.total, l, 2)],
      rows: [[T(l, 'Avec deux enfants seulement', 'With two children only'), eur(deux.total, l, 2)], [T(l, 'Gain mensuel du troisième enfant', 'Monthly gain from the third child'), eur(trois.total - deux.total, l, 2)], [T(l, 'Dont majorations pour âge', 'Of which age supplements'), eur(trois.majorations, l, 2)], [T(l, 'Gain sur un an', 'Gain over a year'), eur((trois.total - deux.total) * 12, l, 0)]] as [string, string][],
      note: T(l, 'À trois enfants, chaque enfant né avant le 1er mars 2012 compte pour la majoration, l’aîné compris.', 'With three children, every child born before 1 March 2012 counts for the supplement, the eldest included.') };
  },
});
