import { primeActivite } from '../engine/minima';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Parent isolé : la prime avec et sans majoration', 'Lone parent: the bonus with and without the higher rate'),
  cta: T(l, 'Simulateur de prime d’activité complet', 'Full activity bonus calculator'),
  inputs: [
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 1, options: [T(l, 'Grossesse déclarée, pas encore d’enfant', 'Declared pregnancy, no child yet'), T(l, '1 enfant', '1 child'), T(l, '2 enfants', '2 children'), T(l, '3 enfants', '3 children')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 's', label: T(l, 'Salaire net moyen par mois', 'Average net monthly pay'), def: 1100, unit: '€', max: 5000 },
  ],
  run: ({ e, s }: Record<string, number>) => {
    const maj = primeActivite({ couple: false, enfants: e, revenu1: s, isoleMajore: true });
    const std = primeActivite({ couple: false, enfants: e, revenu1: s });
    return { head: [T(l, 'Prime majorée par mois', 'Higher-rate bonus per month'), eur(maj.prime, l)],
      rows: [[T(l, 'Montant forfaitaire majoré', 'Higher flat-rate amount'), eur(maj.forfaitaire, l, 2)], [T(l, 'Prime après la période majorée', 'Bonus once the higher rate ends'), eur(std.prime, l)], [T(l, 'Écart par mois', 'Monthly difference'), eur(maj.prime - std.prime, l)]] as [string, string][],
      note: T(l, 'Majoration accordée 12 mois sur 18 après l’événement, ou jusqu’aux 3 ans du plus jeune enfant.', 'Higher rate granted for 12 months within 18 after the event, or until the youngest child turns 3.') };
  },
});
