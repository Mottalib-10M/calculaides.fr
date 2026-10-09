import { primeActivite } from '../engine/minima';
import { T, eur, type L } from './_kit';
const F = [{ c: false, e: 0 }, { c: true, e: 0 }, { c: true, e: 1 }, { c: true, e: 2 }];
export default (l: L) => ({
  title: T(l, 'Ce que le forfait logement retire', 'What the housing flat rate takes away'),
  cta: T(l, 'Simulateur de prime d’activité complet', 'Full activity bonus calculator'),
  inputs: [
    { id: 'f', label: T(l, 'Foyer', 'Household'), def: 0, options: [T(l, 'Seul', 'Single'), T(l, 'Couple', 'Couple'), T(l, 'Couple, 1 enfant', 'Couple, 1 child'), T(l, 'Couple, 2 enfants', 'Couple, 2 children')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 's', label: T(l, 'Salaires nets du foyer par mois', 'Household net pay per month'), def: 1300, unit: '€', max: 5000 },
  ],
  run: ({ f, s }: Record<string, number>) => {
    const x = F[f] ?? F[0];
    const avec = primeActivite({ couple: x.c, enfants: x.e, revenu1: s, forfaitLogement: true });
    const sans = primeActivite({ couple: x.c, enfants: x.e, revenu1: s });
    return { head: [T(l, 'Prime avec APL ou logé gratuitement', 'Bonus with housing aid or free housing'), eur(avec.prime, l)],
      rows: [[T(l, 'Forfait logement compté', 'Housing flat rate counted'), eur(avec.fl, l, 2)], [T(l, 'Prime d’un locataire sans aide', 'Bonus for a tenant without aid'), eur(sans.prime, l)], [T(l, 'Perte par mois', 'Monthly loss'), eur(sans.prime - avec.prime, l)]] as [string, string][],
      note: T(l, 'Salaires saisis sur un seul actif ; le forfait s’ajoute aux ressources du foyer.', 'Pay entered for one earner; the flat rate is added to household resources.') };
  },
});
