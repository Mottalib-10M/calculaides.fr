import { primeActivite } from '../engine/minima';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
const Q = [0.5, 0.6, 0.7, 0.8, 0.9, 1];
export default (l: L) => ({
  title: T(l, 'Temps partiel : salaire plus prime', 'Part-time: pay plus bonus'),
  cta: T(l, 'Simulateur de prime d’activité complet', 'Full activity bonus calculator'),
  inputs: [
    { id: 'q', label: T(l, 'Quotité de travail', 'Working time'), def: 0, options: Q.map((q, i) => ({ value: String(i), label: `${Math.round(q * 100)} %` })) },
    { id: 't', label: T(l, 'Salaire net à temps plein', 'Full-time net pay'), def: Math.round(P.smic.mensuel_net), unit: '€', max: 4000 },
  ],
  run: ({ q, t }: Record<string, number>) => {
    const sal = t * (Q[q] ?? 0.5);
    const r = primeActivite({ couple: false, enfants: 0, revenu1: sal });
    return { head: [T(l, 'Prime estimée par mois', 'Estimated bonus per month'), eur(r.prime, l)],
      rows: [[T(l, 'Salaire net à cette quotité', 'Net pay at this working time'), eur(sal, l)], [T(l, 'Salaire + prime', 'Pay + bonus'), eur(sal + r.prime, l)], [T(l, 'Bonification comprise', 'Top-up included'), eur(r.bonif, l, 2)]] as [string, string][],
      note: T(l, 'Personne seule, sans enfant, sans aide au logement.', 'Single person, no children, no housing aid.') };
  },
});
