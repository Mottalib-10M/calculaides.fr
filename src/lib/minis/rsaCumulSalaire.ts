import { rsa, primeActivite } from '../engine/minima';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Reprendre un emploi au RSA : le revenu total', 'Back to work on RSA: total income'),
  cta: T(l, 'Simulateur RSA complet', 'Full RSA calculator'),
  inputs: [
    { id: 's', label: T(l, 'Salaire net du mois', 'Net monthly pay'), def: 500, unit: '€', max: 3000 },
    { id: 'g', label: T(l, 'Aide au logement ou logement gratuit', 'Housing aid or free housing'), def: 1, options: [T(l, 'Non', 'No'), T(l, 'Oui', 'Yes')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ s, g }: Record<string, number>) => {
    const r = rsa({ couple: false, enfants: 0, revenus: s, forfaitLogement: g === 1 });
    const p = primeActivite({ couple: false, enfants: 0, revenu1: s, forfaitLogement: g === 1 });
    return { head: [T(l, 'Salaire + RSA + prime d’activité', 'Pay + RSA + activity bonus'), eur(s + r.rsa + p.prime, l, 2)],
      rows: [[T(l, 'RSA restant', 'Remaining RSA'), eur(r.rsa, l, 2)], [T(l, 'Prime d’activité', 'Activity bonus'), eur(p.prime, l, 2)], [T(l, 'Gain par rapport à zéro salaire', 'Gain compared with no pay'), eur(s + r.rsa + p.prime - rsa({ couple: false, enfants: 0, revenus: 0, forfaitLogement: g === 1 }).rsa, l, 2)]] as [string, string][],
      note: T(l, 'Personne seule sans enfant. Le salaire compte en entier pour le RSA.', 'Single person, no children. Pay counts in full for RSA.') };
  },
});
