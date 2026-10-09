import { primeActivite } from '../engine/minima';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
const F = [
  { c: false, e: 0, s2: 0, i: false }, { c: true, e: 0, s2: 0, i: false }, { c: true, e: 0, s2: 1, i: false },
  { c: true, e: 2, s2: 0, i: false }, { c: false, e: 1, s2: 0, i: true },
];
export default (l: L) => ({
  title: T(l, 'Au Smic, combien de prime ?', 'On the minimum wage, how much bonus?'),
  cta: T(l, 'Simulateur de prime d’activité complet', 'Full activity bonus calculator'),
  inputs: [
    { id: 'f', label: T(l, 'Foyer', 'Household'), def: 0, options: [T(l, 'Seul', 'Single'), T(l, 'Couple, un Smic', 'Couple, one wage'), T(l, 'Couple, deux Smic', 'Couple, two wages'), T(l, 'Couple, un Smic, 2 enfants', 'Couple, one wage, 2 children'), T(l, 'Parent isolé, 1 enfant (majoré)', 'Lone parent, 1 child (higher rate)')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'n', label: T(l, 'Part du Smic travaillée', 'Share of full-time Smic'), def: 0, options: ['100 %', '80 %', '50 %'].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ f, n }: Record<string, number>) => {
    const x = F[f] ?? F[0]; const k = [1, 0.8, 0.5][n] ?? 1; const s = P.smic.mensuel_net * k;
    const r = primeActivite({ couple: x.c, enfants: x.e, revenu1: s, revenu2: x.s2 * s, isoleMajore: x.i });
    return { head: [T(l, 'Prime au Smic par mois', 'Bonus at minimum wage per month'), eur(r.prime, l)],
      rows: [[T(l, 'Salaire net retenu par actif', 'Net pay per earner'), eur(s, l, 2)], [T(l, 'Revenu du foyer avec la prime', 'Household income with bonus'), eur(s * (1 + x.s2) + r.prime, l)], [T(l, 'Sur un trimestre', 'Over a quarter'), eur(r.prime * 3, l)]] as [string, string][],
      note: T(l, `Smic net de ${eur(P.smic.mensuel_net, l, 2)} par mois à temps plein ; aucune autre ressource.`, `Full-time net minimum wage of ${eur(P.smic.mensuel_net, l, 2)} a month; no other income.`) };
  },
});
