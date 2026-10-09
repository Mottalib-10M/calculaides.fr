import { aah } from '../engine/aah';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'AAH avec des enfants à charge', 'AAH with dependent children'),
  cta: T(l, 'Simulateur AAH complet', 'Full AAH calculator'),
  inputs: [
    { id: 's', label: T(l, 'Salaire net mensuel', 'Net monthly pay'), def: 1478, unit: '€', max: 5000 },
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 1, options: [0, 1, 2, 3, 4].map((n) => ({ value: String(n), label: String(n) })) },
  ],
  run: ({ s, e }: Record<string, number>) => {
    const x = aah({ salaire: s, enfants: e });
    const sans = aah({ salaire: s, enfants: 0 });
    return { head: [T(l, 'AAH estimée par mois', 'Estimated AAH per month'), eur(x.aah, l, 2)],
      rows: [[T(l, 'Plafond annuel du foyer', 'Yearly ceiling'), eur(x.plafondAnnuel, l)], [T(l, 'AAH sans enfant, même salaire', 'AAH with no children, same pay'), eur(sans.aah, l, 2)]] as [string, string][] };
  },
});
