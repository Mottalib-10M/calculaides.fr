import { rsa } from '../engine/minima';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'RSA majoré du parent isolé', 'Increased RSA for a lone parent'),
  cta: T(l, 'Simulateur RSA complet', 'Full RSA calculator'),
  inputs: [
    { id: 'e', label: T(l, 'Enfants à charge', 'Dependent children'), def: 1, options: [0, 1, 2, 3, 4].map((n) => ({ value: String(n), label: n === 0 ? T(l, 'Aucun, grossesse déclarée', 'None, declared pregnancy') : String(n) })) },
    { id: 'r', label: T(l, 'Ressources du mois, hors RSA', 'Monthly income, excluding RSA'), def: 0, unit: '€', max: 3000 },
  ],
  run: ({ e, r }: Record<string, number>) => {
    const maj = rsa({ couple: false, enfants: e, revenus: r, isoleMajore: true });
    const std = rsa({ couple: false, enfants: e, revenus: r });
    return { head: [T(l, 'RSA majoré estimé', 'Estimated increased RSA'), eur(maj.rsa, l, 2)],
      rows: [[T(l, 'Montant forfaitaire majoré', 'Increased flat-rate amount'), eur(maj.forfaitaire, l, 2)], [T(l, 'RSA à la fin de la majoration', 'RSA once the increase ends'), eur(std.rsa, l, 2)], [T(l, 'Écart par mois', 'Monthly difference'), eur(maj.rsa - std.rsa, l, 2)]] as [string, string][],
      note: T(l, 'Sans forfait logement ni allocations familiales : ajoutez-les dans le simulateur complet.', 'Without the housing deduction or family allowances: add them in the full calculator.') };
  },
});
