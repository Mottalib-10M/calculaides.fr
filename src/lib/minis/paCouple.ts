import { primeActivite } from '../engine/minima';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'La prime d’un couple, salaire par salaire', 'A couple’s bonus, pay packet by pay packet'),
  cta: T(l, 'Simulateur de prime d’activité complet', 'Full activity bonus calculator'),
  inputs: [
    { id: 'a', label: T(l, 'Salaire net du premier conjoint', 'First partner’s net pay'), def: 1478, unit: '€', max: 5000 },
    { id: 'b', label: T(l, 'Salaire net du second conjoint', 'Second partner’s net pay'), def: 800, unit: '€', max: 5000 },
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 0, max: 6 },
  ],
  run: ({ a, b, e }: Record<string, number>) => {
    const r = primeActivite({ couple: true, enfants: e, revenu1: a, revenu2: b });
    const seul = primeActivite({ couple: true, enfants: e, revenu1: a, revenu2: 0 });
    return { head: [T(l, 'Prime du couple par mois', 'Couple’s bonus per month'), eur(r.prime, l)],
      rows: [[T(l, 'Montant forfaitaire du foyer', 'Household flat-rate amount'), eur(r.forfaitaire, l, 2)], [T(l, 'Deux bonifications cumulées', 'Both top-ups combined'), eur(r.bonif, l, 2)], [T(l, 'Si seul le premier travaillait', 'If only the first partner worked'), eur(seul.prime, l)]] as [string, string][],
      note: T(l, 'Chaque salaire ouvre sa propre bonification ; le second revenu augmente les ressources du foyer.', 'Each pay packet earns its own top-up; the second income also raises household resources.') };
  },
});
