import { primeActivite } from '../engine/minima';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Votre trimestre de référence', 'Your reference quarter'),
  cta: T(l, 'Simulateur de prime d’activité complet', 'Full activity bonus calculator'),
  inputs: [
    { id: 'a', label: T(l, 'Salaire net, 1er mois', 'Net pay, month 1'), def: 1300, unit: '€', max: 5000 },
    { id: 'b', label: T(l, 'Salaire net, 2e mois', 'Net pay, month 2'), def: 900, unit: '€', max: 5000 },
    { id: 'c', label: T(l, 'Salaire net, 3e mois', 'Net pay, month 3'), def: 1500, unit: '€', max: 5000 },
  ],
  run: ({ a, b, c }: Record<string, number>) => {
    const moy = ((a || 0) + (b || 0) + (c || 0)) / 3;
    const r = primeActivite({ couple: false, enfants: 0, revenu1: moy });
    return { head: [T(l, 'Prime fixe pendant 3 mois', 'Bonus fixed for 3 months'), eur(r.prime, l)],
      rows: [[T(l, 'Moyenne mensuelle retenue', 'Monthly average used'), eur(moy, l)], [T(l, 'Total versé sur le trimestre', 'Total paid over the quarter'), eur(r.prime * 3, l)], [T(l, 'Calcul avant le seuil de versement', 'Amount before the payment floor'), eur(r.brute, l, 2)]] as [string, string][],
      note: T(l, `Personne seule. Sous ${eur(P.pa.minimum_verse, l)} par mois, la CAF ne verse rien.`, `Single person. Below ${eur(P.pa.minimum_verse, l)} a month, the CAF pays nothing.`) };
  },
});
