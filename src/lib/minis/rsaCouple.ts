import { rsa } from '../engine/minima';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'RSA d’un couple', 'RSA for a couple'),
  cta: T(l, 'Simulateur RSA complet', 'Full RSA calculator'),
  inputs: [
    { id: 'r', label: T(l, 'Ressources mensuelles des deux conjoints', 'Combined monthly income of both partners'), def: 400, unit: '€', max: 4000 },
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 0, options: [0, 1, 2, 3].map((n) => ({ value: String(n), label: String(n) })) },
    { id: 'g', label: T(l, 'Aide au logement ou logement gratuit', 'Housing aid or free housing'), def: 1, options: [T(l, 'Non', 'No'), T(l, 'Oui', 'Yes')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ r, e, g }: Record<string, number>) => {
    const x = rsa({ couple: true, enfants: e, revenus: r, forfaitLogement: g === 1 });
    return { head: [T(l, 'RSA du couple par mois', 'Couple’s RSA per month'), eur(x.rsa, l, 2)],
      rows: [[T(l, 'Montant forfaitaire du foyer', 'Household flat-rate amount'), eur(x.forfaitaire, l, 2)], [T(l, 'Forfait logement', 'Housing deduction'), eur(x.fl, l, 2)], [T(l, 'Revenu total du foyer avec le RSA', 'Household total with RSA'), eur(x.ressources + x.rsa, l, 2)]] as [string, string][],
      note: T(l, 'Les revenus des deux conjoints sont additionnés : un seul RSA par foyer.', 'Both partners’ income is added up: one RSA per household.') };
  },
});
