import { rsa } from '../engine/minima';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ce que le forfait logement retire', 'What the housing deduction takes off'),
  cta: T(l, 'Simulateur RSA complet', 'Full RSA calculator'),
  inputs: [
    { id: 'p', label: T(l, 'Foyer', 'Household'), def: 0, options: [T(l, 'Personne seule', 'Single person'), T(l, 'Couple', 'Couple'), T(l, 'Couple et 1 enfant', 'Couple and 1 child'), T(l, 'Couple et 2 enfants', 'Couple and 2 children')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'r', label: T(l, 'Ressources du mois', 'Monthly income'), def: 0, unit: '€', max: 3000 },
  ],
  run: ({ p, r }: Record<string, number>) => {
    const couple = p > 0, enfants = Math.max(0, p - 1);
    const avec = rsa({ couple, enfants, revenus: r, forfaitLogement: true });
    const sans = rsa({ couple, enfants, revenus: r });
    return { head: [T(l, 'Forfait logement', 'Housing deduction'), eur(avec.fl, l, 2)],
      rows: [[T(l, 'RSA sans forfait (loyer sans aide)', 'RSA without deduction (rent, no aid)'), eur(sans.rsa, l, 2)], [T(l, 'RSA avec forfait (aide, logé gratuitement, propriétaire)', 'RSA with deduction (aid, free housing, owner)'), eur(avec.rsa, l, 2)]] as [string, string][] };
  },
});
