import { apl } from '../engine/logement';
import { T, eur, type L } from './_kit';
/** Zone 3 : petits loyers sous le plafond, le loyer réel compte. */
export default (l: L) => ({
  title: T(l, 'Petit loyer en zone 3 : l’aide au plus près', 'Low rent in zone 3: aid to the euro'),
  cta: T(l, 'Simulateur APL complet', 'Full housing aid calculator'),
  inputs: [
    { id: 'l', label: T(l, 'Loyer hors charges', 'Rent excluding charges'), def: 230, unit: '€', max: 2000 },
    { id: 'r', label: T(l, 'Revenus nets imposables sur 12 mois', 'Taxable net income over 12 months'), def: 9000, unit: '€', max: 80000 },
  ],
  run: ({ l: loyer, r: rev }: Record<string, number>) => {
    const x = apl({ zone: 3, couple: false, enfants: 0, loyer, revenusAnnuels: rev });
    const plus = apl({ zone: 3, couple: false, enfants: 0, loyer: loyer + 10, revenusAnnuels: rev });
    return {
      head: [T(l, 'APL estimée par mois', 'Estimated aid per month'), eur(x.aide, l)] as [string, string],
      rows: [
        [T(l, 'Loyer retenu par la CAF', 'Rent the CAF counts'), eur(x.loyerRetenu, l)],
        [T(l, 'Plafond zone 3, personne seule', 'Zone 3 ceiling, single person'), eur(x.plafond, l)],
        [T(l, 'Aide en plus pour 10 € de loyer en plus', 'Extra aid for €10 more rent'), eur(plus.aide - x.aide, l, 2)],
      ] as [string, string][],
      note: T(l, 'Personne seule. Estimation au barème du 1er octobre 2026 ; seule la CAF calcule le droit.', 'Single person. Estimate on the 1 October 2026 scale; only the CAF sets the entitlement.'),
    };
  },
});
