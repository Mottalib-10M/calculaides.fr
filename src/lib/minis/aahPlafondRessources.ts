import { aah, plafondAah } from '../engine/aah';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Vos ressources face au plafond de l’AAH', 'Your resources against the AAH ceiling'),
  cta: T(l, 'Simulateur AAH complet', 'Full AAH calculator'),
  inputs: [
    { id: 'r', label: T(l, 'Ressources annuelles retenues', 'Yearly resources counted'), def: 6000, unit: '€', max: 40000 },
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 0, options: [0, 1, 2, 3].map((n) => ({ value: String(n), label: String(n) })) },
  ],
  run: ({ r, e }: Record<string, number>) => {
    const x = aah({ salaire: 0, autres: r / 12, enfants: e });
    const pl = plafondAah(e);
    return { head: [T(l, 'AAH estimée par mois', 'Estimated AAH per month'), eur(x.aah, l, 2)],
      rows: [[T(l, 'Plafond annuel', 'Yearly ceiling'), eur(pl, l)], [T(l, 'Marge sous le plafond', 'Room under the ceiling'), eur(Math.max(0, pl - r), l)]] as [string, string][],
      note: T(l, 'Saisissez des ressources déjà retenues (après abattements), pas un salaire brut.', 'Enter resources as counted (after allowances), not gross pay.') };
  },
});
