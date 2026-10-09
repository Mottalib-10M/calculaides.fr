import { rsa, primeActivite } from '../engine/minima';
import { allocationsFamiliales } from '../engine/famille';
import { T, eur, type L } from './_kit';
/** Accueil : ce que rapporte un salaire en RSA + prime d'activité, selon le foyer. */
export default (l: L) => ({
  title: T(l, 'Salaire et aides : ce qui reste au foyer chaque mois', 'Pay and benefits: what the household keeps each month'),
  cta: T(l, 'Simulateur de prime d’activité', 'Activity bonus calculator'),
  inputs: [
    { id: 'c', label: T(l, 'Foyer', 'Household'), def: 0, options: [T(l, 'Personne seule', 'Single person'), T(l, 'Couple', 'Couple')].map((x, i) => ({ value: String(i), label: x })) },
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 0, max: 8 },
    { id: 's', label: T(l, 'Salaire net du foyer par mois', 'Household net pay per month'), def: 900, unit: '€', max: 10000 },
  ],
  run: ({ c, e, s }: Record<string, number>) => {
    const couple = c === 1;
    const af = allocationsFamiliales({ enfants: e, majorables: 0, revenus: s * 12 }).total;
    const r = rsa({ couple, enfants: e, revenus: s, autres: af, forfaitLogement: true });
    const p = primeActivite({ couple, enfants: e, revenu1: s, autres: af + r.rsa, forfaitLogement: true });
    return { head: [T(l, 'Revenu du foyer, aides comprises', 'Household income, benefits included'), eur(s + r.rsa + p.prime + af, l)],
      rows: [[T(l, 'RSA', 'RSA'), eur(r.rsa, l)], [T(l, 'Prime d’activité', 'Activity bonus'), eur(p.prime, l)], [T(l, 'Allocations familiales', 'Family allowances'), eur(af, l)]] as [string, string][],
      note: T(l, 'Avec une aide au logement (forfait logement déduit), hors aide au logement elle-même.', 'Assumes housing aid is paid (housing flat rate deducted), housing aid itself not included.') };
  },
});
