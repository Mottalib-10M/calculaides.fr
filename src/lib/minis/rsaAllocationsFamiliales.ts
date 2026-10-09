import { rsa } from '../engine/minima';
import { allocationsFamiliales } from '../engine/famille';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'RSA quand les allocations familiales arrivent', 'RSA once family allowances are paid'),
  cta: T(l, 'Simulateur RSA complet', 'Full RSA calculator'),
  inputs: [
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 2, options: [2, 3, 4].map((n) => ({ value: String(n), label: String(n) })) },
    { id: 'c', label: T(l, 'Foyer', 'Household'), def: 1, options: [T(l, 'Parent seul', 'Single parent'), T(l, 'Couple', 'Couple')].map((x, i) => ({ value: String(i), label: x })) },
  ],
  run: ({ e, c }: Record<string, number>) => {
    const af = allocationsFamiliales({ enfants: e, majorables: 0, revenus: 0 }).total;
    const avec = rsa({ couple: c === 1, enfants: e, revenus: 0, autres: af, forfaitLogement: true });
    const sans = rsa({ couple: c === 1, enfants: e, revenus: 0, forfaitLogement: true });
    return { head: [T(l, 'RSA après déduction des AF', 'RSA after family allowances'), eur(avec.rsa, l, 2)],
      rows: [[T(l, 'Allocations familiales', 'Family allowances'), eur(af, l, 2)], [T(l, 'RSA si les AF ne comptaient pas', 'RSA if allowances did not count'), eur(sans.rsa, l, 2)], [T(l, 'Total RSA + AF', 'Total RSA + allowances'), eur(avec.rsa + af, l, 2)]] as [string, string][],
      note: T(l, 'Sans revenu, avec aide au logement, enfants de moins de 14 ans, majoration parent isolé non appliquée.', 'No income, housing aid received, children under 14, no lone-parent increase.') };
  },
});
