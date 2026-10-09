import { aah } from '../engine/aah';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'AAH à côté d’une pension d’invalidité', 'AAH alongside a disability pension'),
  cta: T(l, 'Simulateur AAH complet', 'Full AAH calculator'),
  inputs: [{ id: 'p', label: T(l, 'Pension ou rente mensuelle', 'Monthly pension or annuity'), def: 600, unit: '€', max: 3000 }],
  run: ({ p }: Record<string, number>) => {
    const x = aah({ salaire: 0, autres: p });
    return { head: [T(l, 'AAH différentielle', 'Top-up AAH'), eur(x.aah, l, 2)],
      rows: [[T(l, 'Montant maximal de l’AAH', 'Maximum AAH'), eur(P.aah.montant_max, l, 2)], [T(l, 'Pension + AAH', 'Pension + AAH'), eur(p + x.aah, l, 2)]] as [string, string][],
      note: T(l, 'Sans salaire ni enfant à charge.', 'No wages, no dependent children.') };
  },
});
